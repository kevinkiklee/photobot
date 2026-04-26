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
import {
  postBumpInLounge,
  resetCycleLockForTest,
  runDailyCycle,
} from '../services/discussion-cycle';
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
  const mockLoungePromptMessage = {
    id: 'lounge-prompt-1',
    startThread: vi.fn().mockResolvedValue(mockThread),
    delete: vi.fn().mockResolvedValue(undefined),
  };
  const mockCrossPostMessage = { id: 'cross-1' };
  const mockLoungeChannel = {
    send: vi.fn().mockResolvedValue(mockLoungePromptMessage),
    messages: { fetch: vi.fn().mockResolvedValue(new Map()) },
    guildId: 'guild-1',
  };
  const mockDiscussionsChannel = {
    send: vi.fn().mockResolvedValue(mockCrossPostMessage),
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
    guilds: { cache: { get: () => ({ id: 'guild-1' }) } },
  };

  return {
    mockClient,
    mockLoungeChannel,
    mockDiscussionsChannel,
    mockLoungePromptMessage,
    mockCrossPostMessage,
    mockThread,
  };
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

  it('posts prompt in lounge, creates thread on it, cross-posts in discussions, and writes log row', async () => {
    const {
      mockClient,
      mockLoungeChannel,
      mockDiscussionsChannel,
      mockLoungePromptMessage,
    } = createMockClient();

    const result = await runDailyCycle(mockClient as any, CONFIG, { skipQuietWait: true });

    expect(result.ok).toBe(true);
    // Lounge prompt embed posted first.
    expect(mockLoungeChannel.send).toHaveBeenCalledWith(
      expect.objectContaining({ embeds: expect.any(Array) }),
    );
    // Thread started on the lounge prompt message.
    expect(mockLoungePromptMessage.startThread).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test prompt?',
        autoArchiveDuration: 10080,
      }),
    );
    // Cross-post in discussions channel with thread URL embedded.
    expect(mockDiscussionsChannel.send).toHaveBeenCalledWith(
      expect.objectContaining({ embeds: expect.any(Array) }),
    );
    // Log row reflects the new schema.
    expect(prisma.discussionPromptLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        channelId: 'd-1',
        promptText: 'Test prompt?',
        category: 'creative',
        threadId: 'thread-1',
        loungePromptMessageId: 'lounge-prompt-1',
        crossPostMessageId: 'cross-1',
        lastAnnouncedAt: expect.any(Date),
      }),
    });
  });

  it('rejects concurrent calls with ok:false reason:busy', async () => {
    const { mockClient } = createMockClient();
    const first = runDailyCycle(mockClient as any, CONFIG, { skipQuietWait: true });
    const second = await runDailyCycle(mockClient as any, CONFIG, { skipQuietWait: true });
    expect(second.ok).toBe(false);
    expect(second.reason).toBe('busy');
    await first;
  });

  it('aborts with ok:false reason:not_allowed when canUseFeature returns false', async () => {
    const { mockClient, mockLoungeChannel } = createMockClient();
    (canUseFeature as any).mockResolvedValue(false);

    const result = await runDailyCycle(mockClient as any, CONFIG, { skipQuietWait: true });

    expect(result.ok).toBe(false);
    expect(result.reason).toBe('not_allowed');
    expect(mockLoungeChannel.send).not.toHaveBeenCalled();
  });

  it('aborts with ok:true and writes nothing if isActive flips false during quiet wait', async () => {
    const { mockClient, mockLoungeChannel, mockDiscussionsChannel } = createMockClient();
    // The post-quiet-wait re-check sees isActive: false.
    (prisma.discussionConfig.findUnique as any).mockResolvedValueOnce({
      ...CONFIG,
      isActive: false,
    });

    const result = await runDailyCycle(mockClient as any, CONFIG, { skipQuietWait: true });

    expect(result.ok).toBe(true);
    expect(mockLoungeChannel.send).not.toHaveBeenCalled();
    expect(mockDiscussionsChannel.send).not.toHaveBeenCalled();
    expect(prisma.discussionPromptLog.create).not.toHaveBeenCalled();
  });

  it('returns discord_error if the lounge prompt post fails', async () => {
    const { mockClient, mockLoungeChannel } = createMockClient();
    (mockLoungeChannel.send as any).mockRejectedValueOnce(new Error('Forbidden'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await runDailyCycle(mockClient as any, CONFIG, { skipQuietWait: true });

    expect(result.ok).toBe(false);
    expect((result as { reason: string }).reason).toBe('discord_error');
    expect(prisma.discussionPromptLog.create).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('rolls back the lounge prompt if startThread fails', async () => {
    const { mockClient, mockLoungePromptMessage } = createMockClient();
    (mockLoungePromptMessage.startThread as any).mockRejectedValueOnce(
      new Error('Missing Permissions'),
    );
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await runDailyCycle(mockClient as any, CONFIG, { skipQuietWait: true });

    expect(result.ok).toBe(false);
    expect((result as { reason: string }).reason).toBe('discord_error');
    expect(mockLoungePromptMessage.delete).toHaveBeenCalledTimes(1);
    expect(prisma.discussionPromptLog.create).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('still inserts a log row with crossPostMessageId=null if the cross-post fails', async () => {
    const { mockClient, mockDiscussionsChannel } = createMockClient();
    (mockDiscussionsChannel.send as any).mockRejectedValueOnce(new Error('Forbidden'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await runDailyCycle(mockClient as any, CONFIG, { skipQuietWait: true });

    expect(result.ok).toBe(true);
    expect(prisma.discussionPromptLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        loungePromptMessageId: 'lounge-prompt-1',
        threadId: 'thread-1',
        crossPostMessageId: null,
      }),
    });

    consoleSpy.mockRestore();
  });

  it('returns channel_unavailable when the lounge channel cannot be resolved', async () => {
    const { mockDiscussionsChannel } = createMockClient();
    const mockClient = {
      channels: {
        fetch: vi.fn((id: string) => Promise.resolve(id === 'd-1' ? mockDiscussionsChannel : null)),
      },
      guilds: { cache: { get: () => ({ id: 'guild-1' }) } },
    };

    const result = await runDailyCycle(mockClient as any, CONFIG, { skipQuietWait: true });

    expect(result.ok).toBe(false);
    expect((result as { reason: string }).reason).toBe('channel_unavailable');
  });
});

describe('postBumpInLounge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    (prisma.discussionConfig.findUnique as any).mockResolvedValue(CONFIG);
    (prisma.discussionPromptLog.update as any).mockResolvedValue({});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function makeLoungeChannel() {
    const mockLoungeChannel: any = {
      send: vi.fn().mockResolvedValue({ id: 'bump-1' }),
      messages: { fetch: vi.fn().mockResolvedValue(new Map()) },
      guildId: 'guild-1',
    };
    Object.setPrototypeOf(mockLoungeChannel, TextChannel.prototype);
    return mockLoungeChannel;
  }

  it('posts as a Discord reply to the original prompt with repliedUser:false', async () => {
    const loungeChannel = makeLoungeChannel();

    const result = await postBumpInLounge(
      'log-1',
      'lounge-prompt-1',
      'https://discord.com/channels/g/c/t',
      loungeChannel,
      { skipQuietWait: true },
    );

    expect(result.posted).toBe(true);
    expect(loungeChannel.send).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining('still active'),
        reply: expect.objectContaining({
          messageReference: 'lounge-prompt-1',
          failIfNotExists: false,
        }),
        allowedMentions: { repliedUser: false },
      }),
    );
    expect(prisma.discussionPromptLog.update).toHaveBeenCalledWith({
      where: { id: 'log-1' },
      data: { lastAnnouncedAt: expect.any(Date) },
    });
  });

  it('skips silently and does not update lastAnnouncedAt if the original prompt was deleted', async () => {
    const loungeChannel = makeLoungeChannel();
    (loungeChannel.send as any).mockRejectedValueOnce(new Error('Unknown Message'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await postBumpInLounge(
      'log-1',
      'lounge-prompt-1',
      'https://discord.com/channels/g/c/t',
      loungeChannel,
      { skipQuietWait: true },
    );

    expect(result.posted).toBe(false);
    expect(result.error).toBe(true);
    expect(prisma.discussionPromptLog.update).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('skips and does not post if isActive flips false during quiet wait', async () => {
    const loungeChannel = makeLoungeChannel();
    (prisma.discussionConfig.findUnique as any).mockResolvedValueOnce({
      ...CONFIG,
      isActive: false,
    });

    const result = await postBumpInLounge(
      'log-1',
      'lounge-prompt-1',
      'https://discord.com/channels/g/c/t',
      loungeChannel,
      { skipQuietWait: true },
    );

    expect(result.posted).toBe(false);
    expect(result.error).toBe(false);
    expect(loungeChannel.send).not.toHaveBeenCalled();
    expect(prisma.discussionPromptLog.update).not.toHaveBeenCalled();
  });
});
