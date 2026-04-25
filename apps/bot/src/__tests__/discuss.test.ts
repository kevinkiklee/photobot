import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@photobot/db', () => ({
  prisma: {
    discussionConfig: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
    },
    discussionPromptLog: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    configAuditLog: {
      create: vi.fn(),
    },
  },
}));

vi.mock('../middleware/permissions', () => ({
  canUseFeature: vi.fn(),
}));

vi.mock('../services/prompts', () => ({
  selectPrompt: vi.fn(),
}));

vi.mock('../services/discussion-cycle', () => ({
  runDailyCycle: vi.fn(),
  isCycleLockHeld: vi.fn(),
  resetCycleLockForTest: vi.fn(),
}));

import { prisma } from '@photobot/db';
import { TextChannel, ChannelType } from 'discord.js';
import { canUseFeature } from '../middleware/permissions';
import { selectPrompt } from '../services/prompts';
import { runDailyCycle, isCycleLockHeld } from '../services/discussion-cycle';
import { execute } from '../commands/discuss';

function makeChannel(id: string, type = ChannelType.GuildText) {
  const ch: any = { id, type, isTextBased: () => true };
  Object.setPrototypeOf(ch, TextChannel.prototype);
  return ch;
}

function makeInteraction(opts: {
  subcommand: string;
  channelId?: string;
  guildId?: string;
  userId?: string;
  options?: Record<string, unknown>;
  channels?: Record<string, unknown>;
}) {
  const replies: any[] = [];
  return {
    replies,
    interaction: {
      guildId: opts.guildId ?? 'guild-1',
      channelId: opts.channelId ?? 'ch-current',
      user: { id: opts.userId ?? 'user-1' },
      member: { roles: { cache: new Map() } },
      options: {
        getSubcommand: () => opts.subcommand,
        getString: (name: string) => (opts.options?.[name] as string | null) ?? null,
        getChannel: (name: string, required = false) => {
          const value = opts.options?.[name];
          if (!value && required) throw new Error(`Missing required option ${name}`);
          return value ?? null;
        },
        getBoolean: (name: string) => (opts.options?.[name] as boolean | null) ?? null,
      },
      client: {
        channels: {
          fetch: vi.fn(async (id: string) => opts.channels?.[id] ?? null),
        },
      },
      reply: vi.fn(async (payload: unknown) => replies.push(payload)),
      deferReply: vi.fn(async () => undefined),
      editReply: vi.fn(async (payload: unknown) => replies.push(payload)),
    } as any,
  };
}

describe('/discuss schedule', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (prisma.discussionConfig.upsert as any).mockResolvedValue({});
    (prisma.configAuditLog.create as any).mockResolvedValue({});
  });

  it('rejects when discussions and lounge channels are the same', async () => {
    const sameChannel = makeChannel('same-1');
    const { interaction, replies } = makeInteraction({
      subcommand: 'schedule',
      options: { discussions: sameChannel, lounge: sameChannel },
      channels: { 'same-1': sameChannel },
    });

    await execute(interaction);

    expect(prisma.discussionConfig.upsert).not.toHaveBeenCalled();
    expect(replies[0]).toMatchObject({ ephemeral: true });
    expect(JSON.stringify(replies[0])).toContain('different');
  });

  it('upserts singleton config with discussions/lounge IDs', async () => {
    const dCh = makeChannel('d-1');
    const lCh = makeChannel('l-1');
    const { interaction } = makeInteraction({
      subcommand: 'schedule',
      options: { discussions: dCh, lounge: lCh, category: 'creative' },
      channels: { 'd-1': dCh, 'l-1': lCh },
    });

    await execute(interaction);

    expect(prisma.discussionConfig.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'singleton' },
        create: expect.objectContaining({
          id: 'singleton',
          discussionsChannelId: 'd-1',
          loungeChannelId: 'l-1',
          categoryFilter: 'creative',
        }),
        update: expect.objectContaining({
          discussionsChannelId: 'd-1',
          loungeChannelId: 'l-1',
          categoryFilter: 'creative',
        }),
      }),
    );
    expect(prisma.configAuditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ action: 'SET_DISCUSSION_CONFIG', targetType: 'GLOBAL' }),
      }),
    );
  });
});

describe('/discuss post-daily', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (prisma.discussionConfig.findUnique as any).mockResolvedValue({
      id: 'singleton',
      discussionsChannelId: 'd-1',
      loungeChannelId: 'l-1',
      categoryFilter: null,
      isActive: true,
    });
    (runDailyCycle as any).mockResolvedValue({ ok: true });
    (isCycleLockHeld as any).mockReturnValue(false);
  });

  it('rejects when cycle lock is held', async () => {
    (isCycleLockHeld as any).mockReturnValue(true);
    const { interaction, replies } = makeInteraction({ subcommand: 'post-daily' });

    await execute(interaction);

    expect(runDailyCycle).not.toHaveBeenCalled();
    expect(JSON.stringify(replies[0])).toContain('in progress');
  });

  it('rejects when no config exists', async () => {
    (prisma.discussionConfig.findUnique as any).mockResolvedValue(null);
    const { interaction, replies } = makeInteraction({ subcommand: 'post-daily' });

    await execute(interaction);

    expect(runDailyCycle).not.toHaveBeenCalled();
    expect(JSON.stringify(replies[0])).toContain('schedule');
  });

  it('runs cycle and writes audit entry on success', async () => {
    (runDailyCycle as any).mockResolvedValue({ ok: true });
    const { interaction } = makeInteraction({ subcommand: 'post-daily' });

    await execute(interaction);

    expect(runDailyCycle).toHaveBeenCalled();
    expect(prisma.configAuditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ action: 'POST_DAILY_MANUAL' }),
      }),
    );
  });
});

describe('/discuss post-here', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (canUseFeature as any).mockResolvedValue(true);
    (selectPrompt as any).mockResolvedValue({ text: 'Test prompt', category: 'creative' });
    (prisma.discussionPromptLog.create as any).mockResolvedValue({ id: 'log-1' });
  });

  it('refuses when canUseFeature returns false', async () => {
    (canUseFeature as any).mockResolvedValue(false);
    const { interaction, replies } = makeInteraction({ subcommand: 'post-here' });

    await execute(interaction);

    expect(prisma.discussionPromptLog.create).not.toHaveBeenCalled();
    expect(JSON.stringify(replies[0])).toContain('not enabled');
  });

  it('writes log row with threadId null', async () => {
    const { interaction } = makeInteraction({ subcommand: 'post-here' });

    await execute(interaction);

    expect(prisma.discussionPromptLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        channelId: 'ch-current',
        promptText: 'Test prompt',
        category: 'creative',
      }),
    });
    const callData = (prisma.discussionPromptLog.create as any).mock.calls[0][0].data;
    expect(callData.threadId).toBeUndefined();
    expect(callData.discussionsMessageId).toBeUndefined();
  });
});

describe('/discuss config', () => {
  beforeEach(() => vi.clearAllMocks());

  it('reports no configuration when singleton missing', async () => {
    (prisma.discussionConfig.findUnique as any).mockResolvedValue(null);
    const { interaction, replies } = makeInteraction({ subcommand: 'config' });

    await execute(interaction);

    expect(JSON.stringify(replies[0])).toContain('No configuration');
  });

  it('returns the singleton when present', async () => {
    (prisma.discussionConfig.findUnique as any).mockResolvedValue({
      id: 'singleton',
      discussionsChannelId: 'd-1',
      loungeChannelId: 'l-1',
      categoryFilter: 'creative',
      isActive: true,
      lastUpdatedBy: 'user-1',
      updatedAt: new Date('2026-04-25T00:00:00Z'),
    });
    const { interaction, replies } = makeInteraction({ subcommand: 'config' });

    await execute(interaction);

    expect(JSON.stringify(replies[0])).toContain('d-1');
    expect(JSON.stringify(replies[0])).toContain('l-1');
  });
});

describe('/discuss enable / disable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (prisma.configAuditLog.create as any).mockResolvedValue({});
  });

  it('enable: refuses when no config exists', async () => {
    (prisma.discussionConfig.findUnique as any).mockResolvedValue(null);
    const { interaction, replies } = makeInteraction({ subcommand: 'enable' });

    await execute(interaction);

    expect(prisma.discussionConfig.update).not.toHaveBeenCalled();
    expect(JSON.stringify(replies[0])).toContain('schedule');
  });

  it('enable: sets isActive=true and writes audit log', async () => {
    (prisma.discussionConfig.findUnique as any).mockResolvedValue({ id: 'singleton', isActive: false });
    (prisma.discussionConfig.update as any).mockResolvedValue({});
    const { interaction } = makeInteraction({ subcommand: 'enable' });

    await execute(interaction);

    expect(prisma.discussionConfig.update).toHaveBeenCalledWith({
      where: { id: 'singleton' },
      data: { isActive: true, lastUpdatedBy: 'user-1' },
    });
    expect(prisma.configAuditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ action: 'ENABLE_DISCUSSION' }),
      }),
    );
  });

  it('disable: sets isActive=false and writes audit log', async () => {
    (prisma.discussionConfig.findUnique as any).mockResolvedValue({ id: 'singleton', isActive: true });
    (prisma.discussionConfig.update as any).mockResolvedValue({});
    const { interaction } = makeInteraction({ subcommand: 'disable' });

    await execute(interaction);

    expect(prisma.discussionConfig.update).toHaveBeenCalledWith({
      where: { id: 'singleton' },
      data: { isActive: false, lastUpdatedBy: 'user-1' },
    });
    expect(prisma.configAuditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ action: 'DISABLE_DISCUSSION' }),
      }),
    );
  });
});
