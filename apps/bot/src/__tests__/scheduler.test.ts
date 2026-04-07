import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@photobot/db', () => ({
  prisma: {
    discussionSchedule: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
    discussionPromptLog: {
      findFirst: vi.fn(),
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

import { prisma } from '@photobot/db';
import { TextChannel } from 'discord.js';
import { canUseFeature } from '../middleware/permissions';
import { selectPrompt } from '../services/prompts';
import { startScheduler, stopScheduler } from '../services/scheduler';

const SCHEDULE_FIXTURE = { id: 'sched-1', channelId: 'ch-1', categoryFilter: null, isActive: true };

function createMockClient() {
  const mockChannel = {
    send: vi.fn().mockResolvedValue({ id: 'msg-1' }),
    messages: {
      fetch: vi.fn().mockResolvedValue(new Map()),
    },
  };
  Object.setPrototypeOf(mockChannel, TextChannel.prototype);

  const mockClient = {
    channels: {
      fetch: vi.fn().mockResolvedValue(mockChannel),
    },
  };

  return { mockClient, mockChannel };
}

describe('Scheduler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    (prisma.discussionSchedule.findMany as any).mockResolvedValue([]);
    (prisma.discussionSchedule.findFirst as any).mockResolvedValue(null);
    (canUseFeature as any).mockResolvedValue(true);
    (selectPrompt as any).mockResolvedValue({
      text: 'Test prompt',
      category: 'creative',
    });
    (prisma.discussionPromptLog.create as any).mockResolvedValue({});
    (prisma.discussionPromptLog.findFirst as any).mockResolvedValue(null);
  });

  afterEach(() => {
    stopScheduler();
    vi.useRealTimers();
  });

  it('posts a prompt when 6 hours have passed since last post', async () => {
    const { mockClient, mockChannel } = createMockClient();
    const sevenHoursAgo = new Date(Date.now() - 7 * 60 * 60 * 1000);
    (prisma.discussionSchedule.findMany as any).mockResolvedValue([SCHEDULE_FIXTURE]);
    (prisma.discussionSchedule.findFirst as any).mockResolvedValue(SCHEDULE_FIXTURE);
    (prisma.discussionPromptLog.findFirst as any).mockResolvedValue({
      postedAt: sevenHoursAgo,
    });

    await startScheduler(mockClient as any);

    expect(selectPrompt).toHaveBeenCalled();
    expect(mockChannel.send).toHaveBeenCalledWith(
      expect.objectContaining({
        embeds: expect.arrayContaining([
          expect.objectContaining({
            data: expect.objectContaining({
              title: 'Discussion of the Day',
            }),
          }),
        ]),
      }),
    );
  });

  it('does not post when less than 6 hours since last post', async () => {
    const { mockClient, mockChannel } = createMockClient();
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    (prisma.discussionSchedule.findMany as any).mockResolvedValue([SCHEDULE_FIXTURE]);
    (prisma.discussionPromptLog.findFirst as any).mockResolvedValue({
      postedAt: twoHoursAgo,
    });

    await startScheduler(mockClient as any);

    expect(mockChannel.send).not.toHaveBeenCalled();
  });

  it('posts immediately when no previous post exists', async () => {
    const { mockClient, mockChannel } = createMockClient();
    (prisma.discussionSchedule.findMany as any).mockResolvedValue([SCHEDULE_FIXTURE]);
    (prisma.discussionSchedule.findFirst as any).mockResolvedValue(SCHEDULE_FIXTURE);
    (prisma.discussionPromptLog.findFirst as any).mockResolvedValue(null);

    await startScheduler(mockClient as any);

    expect(mockChannel.send).toHaveBeenCalled();
  });

  it('does not post when feature is disabled', async () => {
    const { mockClient, mockChannel } = createMockClient();
    (canUseFeature as any).mockResolvedValue(false);
    (prisma.discussionSchedule.findMany as any).mockResolvedValue([SCHEDULE_FIXTURE]);
    (prisma.discussionSchedule.findFirst as any).mockResolvedValue(SCHEDULE_FIXTURE);

    await startScheduler(mockClient as any);

    expect(mockChannel.send).not.toHaveBeenCalled();
  });

  it('logs posted prompt', async () => {
    const { mockClient } = createMockClient();
    (prisma.discussionSchedule.findMany as any).mockResolvedValue([SCHEDULE_FIXTURE]);
    (prisma.discussionSchedule.findFirst as any).mockResolvedValue(SCHEDULE_FIXTURE);
    (prisma.discussionPromptLog.findFirst as any).mockResolvedValue(null);

    await startScheduler(mockClient as any);

    expect(prisma.discussionPromptLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        channelId: 'ch-1',
        promptText: 'Test prompt',
        category: 'creative',
      }),
    });
    // Ensure no serverId is set
    const callData = (prisma.discussionPromptLog.create as any).mock.calls[0][0].data;
    expect(callData.serverId).toBeUndefined();
  });

  it('handles channel fetch failure without crashing', async () => {
    const mockClient = {
      channels: {
        fetch: vi.fn().mockRejectedValue(new Error('Unknown Channel')),
      },
    };
    (prisma.discussionSchedule.findMany as any).mockResolvedValue([SCHEDULE_FIXTURE]);
    (prisma.discussionSchedule.findFirst as any).mockResolvedValue(SCHEDULE_FIXTURE);
    (prisma.discussionPromptLog.findFirst as any).mockResolvedValue(null);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(startScheduler(mockClient as any)).resolves.toBeUndefined();

    // Channel.send should never have been called since fetch threw
    expect(prisma.discussionPromptLog.create).not.toHaveBeenCalled();
    // The error was caught and logged
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Failed to post scheduled prompt'),
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });

  it('skips posting when channel is not a TextChannel', async () => {
    // Create a mock channel that is NOT a TextChannel (e.g., a VoiceChannel)
    const mockVoiceChannel = {
      send: vi.fn(),
      messages: { fetch: vi.fn() },
    };
    // Do NOT set its prototype to TextChannel — it's a non-text channel
    const mockClient = {
      channels: {
        fetch: vi.fn().mockResolvedValue(mockVoiceChannel),
      },
    };
    (prisma.discussionSchedule.findMany as any).mockResolvedValue([SCHEDULE_FIXTURE]);
    (prisma.discussionSchedule.findFirst as any).mockResolvedValue(SCHEDULE_FIXTURE);
    (prisma.discussionPromptLog.findFirst as any).mockResolvedValue(null);

    await startScheduler(mockClient as any);

    // Should not attempt to send or log since channel is not a TextChannel
    expect(mockVoiceChannel.send).not.toHaveBeenCalled();
    expect(prisma.discussionPromptLog.create).not.toHaveBeenCalled();
  });

  it('handles database write failure without crashing', async () => {
    const { mockClient, mockChannel } = createMockClient();
    (prisma.discussionSchedule.findMany as any).mockResolvedValue([SCHEDULE_FIXTURE]);
    (prisma.discussionSchedule.findFirst as any).mockResolvedValue(SCHEDULE_FIXTURE);
    (prisma.discussionPromptLog.findFirst as any).mockResolvedValue(null);
    (prisma.discussionPromptLog.create as any).mockRejectedValue(new Error('Database connection lost'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(startScheduler(mockClient as any)).resolves.toBeUndefined();

    // The prompt was still sent to the channel before the DB write failed
    expect(mockChannel.send).toHaveBeenCalled();
    // The error was caught and logged, not thrown
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Failed to post scheduled prompt'),
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });
});
