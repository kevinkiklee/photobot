import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

vi.mock('@photobot/db', () => ({
  prisma: {
    discussionSchedule: {
      findMany: vi.fn(),
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

import { TextChannel } from 'discord.js';
import { prisma } from '@photobot/db';
import { canUseFeature } from '../middleware/permissions';
import { selectPrompt } from '../services/prompts';
import { startScheduler, stopScheduler } from '../services/scheduler';

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
    (canUseFeature as any).mockResolvedValue(true);
    (selectPrompt as any).mockResolvedValue({
      text: 'Test prompt', category: 'creative', source: 'curated',
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
    (prisma.discussionSchedule.findMany as any).mockResolvedValue([
      { id: 'sched-1', serverId: 'guild-1', channelId: 'ch-1', useAi: false, categoryFilter: null, isActive: true },
    ]);
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
      })
    );
  });

  it('does not post when less than 6 hours since last post', async () => {
    const { mockClient, mockChannel } = createMockClient();
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    (prisma.discussionSchedule.findMany as any).mockResolvedValue([
      { id: 'sched-1', serverId: 'guild-1', channelId: 'ch-1', useAi: false, categoryFilter: null, isActive: true },
    ]);
    (prisma.discussionPromptLog.findFirst as any).mockResolvedValue({
      postedAt: twoHoursAgo,
    });

    await startScheduler(mockClient as any);

    expect(mockChannel.send).not.toHaveBeenCalled();
  });

  it('posts immediately when no previous post exists', async () => {
    const { mockClient, mockChannel } = createMockClient();
    (prisma.discussionSchedule.findMany as any).mockResolvedValue([
      { id: 'sched-1', serverId: 'guild-1', channelId: 'ch-1', useAi: false, categoryFilter: null, isActive: true },
    ]);
    (prisma.discussionPromptLog.findFirst as any).mockResolvedValue(null);

    await startScheduler(mockClient as any);

    expect(mockChannel.send).toHaveBeenCalled();
  });

  it('does not post when feature is disabled', async () => {
    const { mockClient, mockChannel } = createMockClient();
    (canUseFeature as any).mockResolvedValue(false);
    (prisma.discussionSchedule.findMany as any).mockResolvedValue([
      { id: 'sched-1', serverId: 'guild-1', channelId: 'ch-1', useAi: false, categoryFilter: null, isActive: true },
    ]);

    await startScheduler(mockClient as any);

    expect(mockChannel.send).not.toHaveBeenCalled();
  });

  it('logs posted prompt without threadId', async () => {
    const { mockClient } = createMockClient();
    (prisma.discussionSchedule.findMany as any).mockResolvedValue([
      { id: 'sched-1', serverId: 'guild-1', channelId: 'ch-1', useAi: false, categoryFilter: null, isActive: true },
    ]);
    (prisma.discussionPromptLog.findFirst as any).mockResolvedValue(null);

    await startScheduler(mockClient as any);

    expect(prisma.discussionPromptLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        serverId: 'guild-1',
        channelId: 'ch-1',
        promptText: 'Test prompt',
        category: 'creative',
        source: 'curated',
      }),
    });
    // Ensure no threadId is set
    const callData = (prisma.discussionPromptLog.create as any).mock.calls[0][0].data;
    expect(callData.threadId).toBeUndefined();
  });
});
