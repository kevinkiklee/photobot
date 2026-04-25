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
import { ForumChannel, TextChannel } from 'discord.js';
import { canUseFeature } from '../middleware/permissions';
import { runDailyCycle, resetCycleLockForTest } from '../services/discussion-cycle';
import { selectPrompt } from '../services/prompts';

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
  const mockDiscussionsChannel = {
    threads: { create: vi.fn().mockResolvedValue(mockThread) },
  };
  const mockLoungeMessage = { id: 'lounge-msg-1' };
  const mockLoungeChannel = {
    send: vi.fn().mockResolvedValue(mockLoungeMessage),
    messages: { fetch: vi.fn().mockResolvedValue(new Map()) },
  };
  Object.setPrototypeOf(mockDiscussionsChannel, ForumChannel.prototype);
  Object.setPrototypeOf(mockLoungeChannel, TextChannel.prototype);

  const channelMap: Record<string, unknown> = {
    'd-1': mockDiscussionsChannel,
    'l-1': mockLoungeChannel,
  };
  const mockClient = {
    channels: { fetch: vi.fn((id: string) => Promise.resolve(channelMap[id])) },
    guilds: { cache: { get: () => ({ id: 'guild-1' }) } },
  };

  return { mockClient, mockDiscussionsChannel, mockLoungeChannel, mockThread };
}

describe('runDailyCycle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    resetCycleLockForTest();
    (canUseFeature as any).mockResolvedValue(true);
    (selectPrompt as any).mockResolvedValue({ text: 'Test prompt?', category: 'creative' });
    (prisma.discussionConfig.findUnique as any).mockResolvedValue(CONFIG);
    (prisma.discussionPromptLog.create as any).mockResolvedValue({ id: 'log-1' });
    (prisma.discussionPromptLog.update as any).mockResolvedValue({});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('creates a forum thread and announces in lounge', async () => {
    const { mockClient, mockDiscussionsChannel, mockLoungeChannel } = createMockClient();

    const result = await runDailyCycle(mockClient as any, CONFIG);

    expect(result.ok).toBe(true);
    expect(mockDiscussionsChannel.threads.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test prompt?',
        autoArchiveDuration: 10080,
        message: expect.objectContaining({ embeds: expect.any(Array) }),
      }),
    );
    expect(prisma.discussionPromptLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        channelId: 'd-1',
        promptText: 'Test prompt?',
        category: 'creative',
        threadId: 'thread-1',
        discussionsMessageId: 'thread-1',
      }),
    });
    expect(mockLoungeChannel.send).toHaveBeenCalled();
    expect(prisma.discussionPromptLog.update).toHaveBeenCalledWith({
      where: { id: 'log-1' },
      data: { lastAnnouncedAt: expect.any(Date) },
    });
  });

  it('rejects concurrent calls with ok:false reason:busy', async () => {
    const { mockClient } = createMockClient();
    const first = runDailyCycle(mockClient as any, CONFIG);
    const second = await runDailyCycle(mockClient as any, CONFIG);
    expect(second.ok).toBe(false);
    expect(second.reason).toBe('busy');
    await first;
  });

  it('aborts with ok:false reason:not_allowed when canUseFeature returns false', async () => {
    const { mockClient, mockDiscussionsChannel } = createMockClient();
    (canUseFeature as any).mockResolvedValue(false);

    const result = await runDailyCycle(mockClient as any, CONFIG);

    expect(result.ok).toBe(false);
    expect(result.reason).toBe('not_allowed');
    expect(mockDiscussionsChannel.threads.create).not.toHaveBeenCalled();
  });

  it('returns discord_error and writes no log when forum thread creation fails', async () => {
    const { mockClient, mockDiscussionsChannel } = createMockClient();
    (mockDiscussionsChannel.threads.create as any).mockRejectedValueOnce(new Error('Missing Permissions'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await runDailyCycle(mockClient as any, CONFIG);

    expect(result.ok).toBe(false);
    expect((result as { reason: string }).reason).toBe('discord_error');
    expect(prisma.discussionPromptLog.create).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('keeps log row but skips lastAnnouncedAt when lounge post fails', async () => {
    const { mockClient, mockLoungeChannel } = createMockClient();
    (mockLoungeChannel.send as any).mockRejectedValueOnce(new Error('Forbidden'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await runDailyCycle(mockClient as any, CONFIG);

    expect(result.ok).toBe(false);
    expect(prisma.discussionPromptLog.create).toHaveBeenCalled();
    expect(prisma.discussionPromptLog.update).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('aborts lounge post if isActive flips to false during quiet wait', async () => {
    const { mockClient, mockLoungeChannel } = createMockClient();
    // runDailyCycle uses the `config` parameter directly; only runLoungeAnnounce
    // calls findUnique to re-check the singleton after the quiet wait. So this
    // single mock controls the post-wait re-check.
    (prisma.discussionConfig.findUnique as any).mockResolvedValueOnce({
      ...CONFIG,
      isActive: false,
    });

    const result = await runDailyCycle(mockClient as any, CONFIG);

    // discussions post + thread + log all happened, but lounge announce was skipped.
    expect(prisma.discussionPromptLog.create).toHaveBeenCalled();
    expect(mockLoungeChannel.send).not.toHaveBeenCalled();
    expect(prisma.discussionPromptLog.update).not.toHaveBeenCalled();
    // The function still returns ok:true because the discussions side succeeded.
    expect(result.ok).toBe(true);
  });
});
