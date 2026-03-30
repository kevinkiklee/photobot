import { vi, describe, it, expect, beforeEach } from 'vitest';

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
      text: 'What is your favorite lens?',
      category: 'gear',
      source: 'curated',
      reactions: ['🔭', '📏', '🤔'],
    });
    (prisma.discussionPromptLog.create as any).mockResolvedValue({});
    (prisma.discussionSchedule.upsert as any).mockResolvedValue({});
    (prisma.discussionSchedule.findMany as any).mockResolvedValue([]);
    (prisma.configAuditLog.create as any).mockResolvedValue({});

    interaction = {
      guildId: 'guild-123',
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
      reply: vi.fn().mockResolvedValue({
        id: 'msg-123',
        startThread: vi.fn().mockResolvedValue({ id: 'thread-123' }),
        react: vi.fn().mockResolvedValue(undefined),
      }),
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

    it('posts a discussion prompt embed with thread and reactions', async () => {
      await execute(interaction);

      expect(selectPrompt).toHaveBeenCalledWith('guild-123', false, null);
      expect(interaction.reply).toHaveBeenCalledWith(
        expect.objectContaining({
          embeds: expect.arrayContaining([
            expect.objectContaining({
              data: expect.objectContaining({
                title: 'Discussion Prompt',
                description: expect.stringContaining('What is your favorite lens?'),
              }),
            }),
          ]),
        })
      );
    });

    it('creates a thread on the reply message', async () => {
      await execute(interaction);

      const replyMsg = await interaction.reply.mock.results[0].value;
      expect(replyMsg.startThread).toHaveBeenCalledWith(
        expect.objectContaining({
          name: expect.stringContaining('Discuss:'),
        })
      );
    });

    it('adds reactions to the reply message', async () => {
      await execute(interaction);

      const replyMsg = await interaction.reply.mock.results[0].value;
      expect(replyMsg.react).toHaveBeenCalledTimes(3);
    });

    it('logs the prompt to DiscussionPromptLog', async () => {
      await execute(interaction);

      expect(prisma.discussionPromptLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          serverId: 'guild-123',
          promptText: 'What is your favorite lens?',
          category: 'gear',
          source: 'curated',
        }),
      });
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
      interaction.options.getString.mockReturnValue('technique');

      await execute(interaction);

      expect(selectPrompt).toHaveBeenCalledWith('guild-123', false, 'technique');
    });
  });

  describe('schedule subcommand', () => {
    beforeEach(() => {
      interaction.options.getSubcommand.mockReturnValue('schedule');
      interaction.options.getChannel.mockReturnValue({ id: 'channel-456', name: 'photo-talk' });
      interaction.options.getString.mockImplementation((name: string) => {
        if (name === 'days') return 'mon,wed,fri';
        if (name === 'time') return '9:00';
        if (name === 'timezone') return null;
        if (name === 'category') return null;
        return null;
      });
      interaction.options.getBoolean.mockReturnValue(false);
    });

    it('creates a schedule and replies with confirmation', async () => {
      await execute(interaction);

      expect(prisma.discussionSchedule.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            serverId_channelId: { serverId: 'guild-123', channelId: 'channel-456' },
          },
          create: expect.objectContaining({
            serverId: 'guild-123',
            channelId: 'channel-456',
            days: [1, 3, 5],
            timeUtc: '09:00',
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
          serverId: 'guild-123',
          userId: 'user-123',
          action: 'SET_SCHEDULE',
          featureKey: 'discuss',
        }),
      });
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
          days: [1, 3, 5],
          timeUtc: '09:00',
          timezone: 'UTC',
          categoryFilter: null,
          useAi: false,
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
