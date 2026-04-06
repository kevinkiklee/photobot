import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.stubEnv('PL_GUILD_ID', 'pl-guild-id');

vi.mock('@photobot/db', () => ({
  prisma: {
    discussionSchedule: {
      upsert: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    discussionPromptLog: {
      create: vi.fn(),
    },
    configAuditLog: {
      create: vi.fn(),
    },
  },
}));

vi.mock('../services/prompts', () => ({
  selectPrompt: vi.fn(),
}));

vi.mock('../middleware/permissions', () => ({
  canUseFeature: vi.fn(),
}));

import { prisma } from '@photobot/db';
import { selectPrompt } from '../services/prompts';
import { canUseFeature } from '../middleware/permissions';
import { execute, data } from '../commands/discuss';

describe('Discuss Command', () => {
  let interaction: any;

  beforeEach(() => {
    vi.clearAllMocks();

    (canUseFeature as any).mockResolvedValue(true);
    (selectPrompt as any).mockResolvedValue({
      text: 'How do you push through a creative rut when nothing feels inspiring?',
      category: 'creative',
    });
    (prisma.discussionPromptLog.create as any).mockResolvedValue({});
    (prisma.discussionSchedule.upsert as any).mockResolvedValue({});
    (prisma.discussionSchedule.findMany as any).mockResolvedValue([]);
    (prisma.configAuditLog.create as any).mockResolvedValue({});

    interaction = {
      guildId: 'pl-guild-id',
      channelId: 'channel-123',
      user: { id: 'user-123' },
      member: { roles: { cache: new Map([['role-1', { id: 'role-1' }]]) } },
      options: {
        getSubcommand: vi.fn(),
        getString: vi.fn(),
        getChannel: vi.fn(),
        getBoolean: vi.fn(),
      },
      deferReply: vi.fn().mockResolvedValue(undefined),
      editReply: vi.fn().mockResolvedValue(undefined),
      reply: vi.fn().mockResolvedValue({ id: 'msg-123' }),
    };
  });

  it('has the correct command name', () => {
    expect(data.name).toBe('discuss');
  });

  describe('prompt subcommand', () => {
    beforeEach(() => {
      interaction.options.getSubcommand.mockReturnValue('prompt');
      interaction.options.getString.mockReturnValue(null);
    });

    it('posts a discussion prompt embed as a regular message', async () => {
      await execute(interaction);

      expect(selectPrompt).toHaveBeenCalledWith(null);
      expect(interaction.reply).toHaveBeenCalledWith(
        expect.objectContaining({
          embeds: expect.arrayContaining([
            expect.objectContaining({
              data: expect.objectContaining({
                title: 'Discussion Prompt',
                description: expect.stringContaining('How do you push through a creative rut when nothing feels inspiring?'),
              }),
            }),
          ]),
        })
      );
    });

    it('does not create a thread', async () => {
      const replyMsg = await interaction.reply.mock.results?.[0]?.value;
      expect(replyMsg?.startThread).toBeUndefined();
    });

    it('logs the prompt to DiscussionPromptLog', async () => {
      await execute(interaction);

      expect(prisma.discussionPromptLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          promptText: 'How do you push through a creative rut when nothing feels inspiring?',
          category: 'creative',
        }),
      });
      // Ensure no serverId in log data
      const callData = (prisma.discussionPromptLog.create as any).mock.calls[0][0].data;
      expect(callData.serverId).toBeUndefined();
    });

    it('blocks when feature is disabled', async () => {
      (canUseFeature as any).mockResolvedValue(false);

      await execute(interaction);

      expect(interaction.reply).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.stringContaining('not enabled'),
          ephemeral: true,
        })
      );
      expect(selectPrompt).not.toHaveBeenCalled();
    });

    it('passes category filter when provided', async () => {
      interaction.options.getString.mockReturnValue('creative');

      await execute(interaction);

      expect(selectPrompt).toHaveBeenCalledWith('creative');
    });
  });

  describe('schedule subcommand', () => {
    beforeEach(() => {
      interaction.options.getSubcommand.mockReturnValue('schedule');
      interaction.options.getChannel.mockReturnValue({ id: 'channel-456', name: 'photo-talk' });
      interaction.options.getString.mockReturnValue(null);
    });

    it('creates a schedule and replies with confirmation', async () => {
      await execute(interaction);

      expect(prisma.discussionSchedule.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { channelId: 'channel-456' },
          create: expect.objectContaining({
            channelId: 'channel-456',
          }),
        })
      );

      expect(interaction.reply).toHaveBeenCalledWith(
        expect.objectContaining({ ephemeral: true })
      );
    });

    it('creates an audit log entry', async () => {
      await execute(interaction);

      expect(prisma.configAuditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-123',
          action: 'SET_SCHEDULE',
          featureKey: 'discuss',
        }),
      });
      // Ensure no serverId in audit log
      const callData = (prisma.configAuditLog.create as any).mock.calls[0][0].data;
      expect(callData.serverId).toBeUndefined();
    });
  });

  describe('list subcommand', () => {
    beforeEach(() => {
      interaction.options.getSubcommand.mockReturnValue('list');
    });

    it('displays schedules as an embed', async () => {
      (prisma.discussionSchedule.findMany as any).mockResolvedValue([
        {
          channelId: 'channel-456',
          days: [0, 1, 2, 3, 4, 5, 6],
          timeUtc: '00:00',
          timezone: 'UTC',
          categoryFilter: null,
          isActive: true,
        },
      ]);

      await execute(interaction);

      expect(interaction.reply).toHaveBeenCalledWith(
        expect.objectContaining({
          embeds: expect.arrayContaining([
            expect.objectContaining({
              data: expect.objectContaining({
                title: 'Discussion Schedules',
              }),
            }),
          ]),
          ephemeral: true,
        })
      );
    });

    it('shows a message when no schedules exist', async () => {
      await execute(interaction);

      expect(interaction.reply).toHaveBeenCalledWith(
        expect.objectContaining({ ephemeral: true })
      );
    });
  });
});
