import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@photobot/db', () => ({
  prisma: {
    discussionConfig: {
      findUnique: vi.fn(),
    },
    discussionPromptLog: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
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
import { resetCycleLockForTest } from '../services/discussion-cycle';
import { currentSlotStart, todaysDailySlotStart, startScheduler, stopScheduler } from '../services/scheduler';

const CONFIG = {
  id: 'singleton',
  discussionsChannelId: 'd-1',
  loungeChannelId: 'l-1',
  categoryFilter: null,
  isActive: true,
  lastUpdatedBy: 'admin-1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

function createMockClient() {
  const mockThread = { id: 'thread-1' };
  const mockLoungePromptMessage = {
    id: 'lounge-prompt-1',
    startThread: vi.fn().mockResolvedValue(mockThread),
    delete: vi.fn().mockResolvedValue(undefined),
  };
  const mockLoungeChannel = {
    send: vi.fn().mockResolvedValue(mockLoungePromptMessage),
    messages: { fetch: vi.fn().mockResolvedValue(new Map()) },
    guildId: 'guild-1',
  };
  const mockDiscussionsChannel = {
    send: vi.fn().mockResolvedValue({ id: 'cross-1' }),
    messages: { fetch: vi.fn().mockResolvedValue(new Map()) },
    guildId: 'guild-1',
  };
  Object.setPrototypeOf(mockLoungeChannel, TextChannel.prototype);
  Object.setPrototypeOf(mockDiscussionsChannel, TextChannel.prototype);

  const channelMap: Record<string, unknown> = {
    'd-1': mockDiscussionsChannel,
    'l-1': mockLoungeChannel,
  };
  const mockClient = {
    channels: { fetch: vi.fn((id: string) => Promise.resolve(channelMap[id])) },
    guilds: { cache: { first: () => ({ id: 'guild-1' }), get: () => ({ id: 'guild-1' }) } },
  };

  return { mockClient, mockLoungeChannel, mockDiscussionsChannel, mockLoungePromptMessage };
}

describe('currentSlotStart', () => {
  it.each([
    ['01:59 UTC', '2026-04-25T01:59:00Z', '2026-04-24T20:00:00Z'],
    ['02:00 UTC', '2026-04-25T02:00:00Z', '2026-04-25T02:00:00Z'],
    ['07:59 UTC', '2026-04-25T07:59:00Z', '2026-04-25T02:00:00Z'],
    ['08:00 UTC', '2026-04-25T08:00:00Z', '2026-04-25T08:00:00Z'],
    ['13:59 UTC', '2026-04-25T13:59:00Z', '2026-04-25T08:00:00Z'],
    ['14:00 UTC', '2026-04-25T14:00:00Z', '2026-04-25T14:00:00Z'],
    ['19:59 UTC', '2026-04-25T19:59:00Z', '2026-04-25T14:00:00Z'],
    ['20:00 UTC', '2026-04-25T20:00:00Z', '2026-04-25T20:00:00Z'],
    ['23:59 UTC', '2026-04-25T23:59:00Z', '2026-04-25T20:00:00Z'],
    ['00:30 UTC (rolls back)', '2026-04-25T00:30:00Z', '2026-04-24T20:00:00Z'],
  ])('%s -> slot %s', (_, nowIso, expectedIso) => {
    expect(currentSlotStart(new Date(nowIso)).toISOString()).toBe(new Date(expectedIso).toISOString());
  });
});

describe('todaysDailySlotStart', () => {
  it('returns 08:00 UTC of the same day as the slot', () => {
    const slot = new Date('2026-04-25T14:00:00Z');
    expect(todaysDailySlotStart(slot).toISOString()).toBe(new Date('2026-04-25T08:00:00Z').toISOString());
  });

  it('returns yesterday 08:00 for a 02:00-rollback slot', () => {
    const slot = new Date('2026-04-24T20:00:00Z');
    expect(todaysDailySlotStart(slot).toISOString()).toBe(new Date('2026-04-24T08:00:00Z').toISOString());
  });
});

describe('Scheduler tick behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    resetCycleLockForTest();
    (canUseFeature as any).mockResolvedValue(true);
    (selectPrompt as any).mockResolvedValue({ text: 'Test prompt', category: 'creative' });
    (prisma.discussionConfig.findUnique as any).mockResolvedValue(CONFIG);
    (prisma.discussionPromptLog.findFirst as any).mockResolvedValue(null);
    (prisma.discussionPromptLog.create as any).mockResolvedValue({ id: 'log-1' });
    (prisma.discussionPromptLog.update as any).mockResolvedValue({});
  });

  afterEach(() => {
    stopScheduler();
    vi.useRealTimers();
  });

  it('skips when no config exists', async () => {
    const { mockClient, mockLoungeChannel } = createMockClient();
    (prisma.discussionConfig.findUnique as any).mockResolvedValue(null);
    vi.setSystemTime(new Date('2026-04-25T08:30:00Z'));

    await startScheduler(mockClient as any);

    expect(mockLoungeChannel.send).not.toHaveBeenCalled();
  });

  it('skips when config.isActive is false', async () => {
    const { mockClient, mockLoungeChannel } = createMockClient();
    (prisma.discussionConfig.findUnique as any).mockResolvedValue({ ...CONFIG, isActive: false });
    vi.setSystemTime(new Date('2026-04-25T08:30:00Z'));

    await startScheduler(mockClient as any);

    expect(mockLoungeChannel.send).not.toHaveBeenCalled();
  });

  it('fires daily cycle at the 08:00 slot when no daily fired today', async () => {
    const { mockClient, mockLoungeChannel, mockLoungePromptMessage, mockDiscussionsChannel } =
      createMockClient();
    vi.setSystemTime(new Date('2026-04-25T08:05:00Z'));

    await startScheduler(mockClient as any);

    expect(mockLoungeChannel.send).toHaveBeenCalled();
    expect(mockLoungePromptMessage.startThread).toHaveBeenCalled();
    expect(mockDiscussionsChannel.send).toHaveBeenCalled();
  });

  it('fires daily late at 13:30 (still within 6h horizon) when 08:00 was missed', async () => {
    const { mockClient, mockLoungePromptMessage } = createMockClient();
    vi.setSystemTime(new Date('2026-04-25T13:30:00Z'));

    await startScheduler(mockClient as any);

    expect(mockLoungePromptMessage.startThread).toHaveBeenCalled();
  });

  it('skips daily catch-up when today 08:00 is older than 6h horizon', async () => {
    const { mockClient, mockLoungePromptMessage } = createMockClient();
    vi.setSystemTime(new Date('2026-04-25T16:00:00Z'));

    await startScheduler(mockClient as any);

    expect(mockLoungePromptMessage.startThread).not.toHaveBeenCalled();
  });

  it('does not bump when lastAnnouncedAt is at or after current slot', async () => {
    const { mockClient, mockLoungeChannel } = createMockClient();
    vi.setSystemTime(new Date('2026-04-25T14:30:00Z'));
    (prisma.discussionPromptLog.findFirst as any).mockResolvedValue({
      id: 'log-1',
      threadId: 'thread-1',
      loungePromptMessageId: 'lounge-prompt-1',
      promptText: 'Test prompt',
      category: 'creative',
      postedAt: new Date('2026-04-25T08:00:00Z'),
      lastAnnouncedAt: new Date('2026-04-25T14:01:00Z'),
    });

    await startScheduler(mockClient as any);

    expect(mockLoungeChannel.send).not.toHaveBeenCalled();
  });

  it('posts a bump in lounge at 14:00 slot when lastAnnouncedAt is from morning', async () => {
    const { mockClient, mockLoungeChannel } = createMockClient();
    vi.setSystemTime(new Date('2026-04-25T14:05:00Z'));
    const logRow = {
      id: 'log-1',
      threadId: 'thread-1',
      loungePromptMessageId: 'lounge-prompt-1',
      promptText: 'Test prompt',
      category: 'creative',
      postedAt: new Date('2026-04-25T08:00:00Z'),
      lastAnnouncedAt: new Date('2026-04-25T08:00:00Z'),
    };
    (prisma.discussionPromptLog.findFirst as any)
      // Phase 1: did today's daily fire? Yes.
      .mockResolvedValueOnce(logRow)
      // Phase 2: current daily prompt (same row).
      .mockResolvedValueOnce(logRow);

    await startScheduler(mockClient as any);

    expect(mockLoungeChannel.send).toHaveBeenCalledWith(
      expect.objectContaining({
        reply: expect.objectContaining({ messageReference: 'lounge-prompt-1' }),
      }),
    );
    expect(prisma.discussionPromptLog.update).toHaveBeenCalledWith({
      where: { id: 'log-1' },
      data: { lastAnnouncedAt: expect.any(Date) },
    });
  });

  it('skips bump when the active prompt has no loungePromptMessageId (forum-era row)', async () => {
    const { mockClient, mockLoungeChannel } = createMockClient();
    vi.setSystemTime(new Date('2026-04-25T14:05:00Z'));
    const legacyRow = {
      id: 'log-1',
      threadId: 'thread-1',
      loungePromptMessageId: null,
      promptText: 'Test prompt',
      category: 'creative',
      postedAt: new Date('2026-04-25T08:00:00Z'),
      lastAnnouncedAt: new Date('2026-04-25T08:00:00Z'),
    };
    (prisma.discussionPromptLog.findFirst as any)
      .mockResolvedValueOnce(legacyRow)
      .mockResolvedValueOnce(legacyRow);

    await startScheduler(mockClient as any);

    expect(mockLoungeChannel.send).not.toHaveBeenCalled();
  });

  it('handles channel fetch failure without crashing', async () => {
    const mockClient = {
      channels: { fetch: vi.fn().mockRejectedValue(new Error('Unknown Channel')) },
      guilds: { cache: { first: () => ({ id: 'guild-1' }), get: () => ({ id: 'guild-1' }) } },
    };
    vi.setSystemTime(new Date('2026-04-25T08:05:00Z'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(startScheduler(mockClient as any)).resolves.toBeUndefined();

    expect(prisma.discussionPromptLog.create).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
