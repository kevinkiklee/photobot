import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@photobot/db', () => ({
  prisma: {
    discussionConfig: {
      findUnique: vi.fn(),
    },
    discussionPromptLog: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    mirroredMessage: {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { prisma } from '@photobot/db';
import { MessageReferenceType } from 'discord.js';
import {
  onLoungeMessageCreate,
  onLoungeMessageDelete,
  onLoungeMessageUpdate,
} from '../services/lounge-mirror';

const ORIGINAL_PL_GUILD_ID = process.env.PL_GUILD_ID;
const TEST_GUILD_ID = 'test-guild-1';

const CONFIG = {
  id: 'singleton',
  discussionsChannelId: 'd-1',
  loungeChannelId: 'lounge-1',
  categoryFilter: null,
  isActive: true,
  lastUpdatedBy: 'admin-1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const ACTIVE_PROMPT = {
  id: 'log-1',
  channelId: 'd-1',
  promptText: 'Test prompt?',
  category: 'creative',
  threadId: 'thread-1',
  discussionsMessageId: null,
  crossPostMessageId: 'cross-1',
  loungePromptMessageId: 'prompt-msg-1',
  lastAnnouncedAt: new Date(),
  mirrorEndedAt: null,
  postedAt: new Date(),
};

function makeMessage(overrides: Partial<any> = {}) {
  const base = {
    id: 'msg-1',
    content: 'I love sunsets',
    partial: false,
    author: { id: 'user-1', username: 'kevinkik', bot: false },
    member: { displayName: 'kevinkik' },
    guild: { id: TEST_GUILD_ID },
    channel: { id: 'lounge-1' },
    reference: {
      messageId: 'prompt-msg-1',
      channelId: 'lounge-1',
      type: MessageReferenceType.Default,
    },
    client: null as any,
  };
  return { ...base, ...overrides };
}

function makeThread(opts: { archived?: boolean } = {}) {
  const sentMessage = { id: 'thread-msg-1', edit: vi.fn().mockResolvedValue(undefined) };
  const thread: any = {
    archived: opts.archived ?? false,
    isThread: () => true,
    send: vi.fn().mockResolvedValue(sentMessage),
    messages: {
      fetch: vi.fn().mockResolvedValue({
        id: 'thread-msg-1',
        edit: vi.fn().mockResolvedValue(undefined),
        delete: vi.fn().mockResolvedValue(undefined),
      }),
    },
  };
  return thread;
}

function makeClientWithThread(thread: any) {
  return {
    channels: { fetch: vi.fn().mockResolvedValue(thread) },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.PL_GUILD_ID = TEST_GUILD_ID;
  (prisma.discussionConfig.findUnique as any).mockResolvedValue(CONFIG);
  (prisma.discussionPromptLog.findFirst as any).mockResolvedValue(ACTIVE_PROMPT);
  (prisma.discussionPromptLog.findUnique as any).mockResolvedValue(ACTIVE_PROMPT);
  (prisma.mirroredMessage.findUnique as any).mockResolvedValue(null);
  (prisma.mirroredMessage.create as any).mockResolvedValue({});
  (prisma.mirroredMessage.delete as any).mockResolvedValue({});
  (prisma.discussionPromptLog.update as any).mockResolvedValue({});
});

afterEach(() => {
  process.env.PL_GUILD_ID = ORIGINAL_PL_GUILD_ID;
});

describe('onLoungeMessageCreate', () => {
  it('mirrors a direct reply to the active prompt with bot-quoted format', async () => {
    const thread = makeThread();
    const client = makeClientWithThread(thread);
    const msg = makeMessage({ client });

    await onLoungeMessageCreate(msg as any);

    expect(thread.send).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining('**kevinkik**'),
        allowedMentions: { parse: [] },
        flags: expect.any(Number),
      }),
    );
    const sentContent = (thread.send.mock.calls[0][0] as any).content as string;
    expect(sentContent).toContain('> I love sunsets');
    expect(sentContent).toContain(`/${TEST_GUILD_ID}/lounge-1/msg-1`);
    expect(prisma.mirroredMessage.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        loungeMessageId: 'msg-1',
        threadMessageId: 'thread-msg-1',
        promptLogId: 'log-1',
        authorId: 'user-1',
        authorDisplayName: 'kevinkik',
      }),
    });
  });

  it('mirrors a transitive reply that targets a previously-mirrored message', async () => {
    const thread = makeThread();
    const client = makeClientWithThread(thread);
    const msg = makeMessage({
      id: 'msg-2',
      content: 'agreed!',
      reference: {
        messageId: 'msg-1',
        channelId: 'lounge-1',
        type: MessageReferenceType.Default,
      },
      client,
    });
    (prisma.mirroredMessage.findUnique as any).mockImplementation(
      ({ where }: { where: { loungeMessageId: string } }) =>
        where.loungeMessageId === 'msg-1'
          ? Promise.resolve({ loungeMessageId: 'msg-1', promptLogId: 'log-1' })
          : Promise.resolve(null),
    );

    await onLoungeMessageCreate(msg as any);

    expect(thread.send).toHaveBeenCalled();
    expect(prisma.mirroredMessage.create).toHaveBeenCalled();
  });

  it('no-ops when reply targets a message not in the active mirrored chain', async () => {
    const thread = makeThread();
    const client = makeClientWithThread(thread);
    const msg = makeMessage({
      reference: {
        messageId: 'unrelated-msg',
        channelId: 'lounge-1',
        type: MessageReferenceType.Default,
      },
      client,
    });
    (prisma.mirroredMessage.findUnique as any).mockResolvedValue(null);

    await onLoungeMessageCreate(msg as any);

    expect(thread.send).not.toHaveBeenCalled();
    expect(prisma.mirroredMessage.create).not.toHaveBeenCalled();
  });

  it('no-ops when reply is to a mirrored message from a previous prompt cycle', async () => {
    const thread = makeThread();
    const client = makeClientWithThread(thread);
    const msg = makeMessage({
      reference: {
        messageId: 'old-mirror',
        channelId: 'lounge-1',
        type: MessageReferenceType.Default,
      },
      client,
    });
    (prisma.mirroredMessage.findUnique as any).mockResolvedValue({
      loungeMessageId: 'old-mirror',
      promptLogId: 'log-OLD',
    });

    await onLoungeMessageCreate(msg as any);

    expect(thread.send).not.toHaveBeenCalled();
  });

  it('no-ops on bot messages', async () => {
    const thread = makeThread();
    const client = makeClientWithThread(thread);
    const msg = makeMessage({
      author: { id: 'bot-1', username: 'photobot', bot: true },
      client,
    });

    await onLoungeMessageCreate(msg as any);

    expect(thread.send).not.toHaveBeenCalled();
  });

  it('no-ops on forwarded messages (reference.type !== Default)', async () => {
    const thread = makeThread();
    const client = makeClientWithThread(thread);
    const msg = makeMessage({
      reference: {
        messageId: 'prompt-msg-1',
        channelId: 'lounge-1',
        type: MessageReferenceType.Forward,
      },
      client,
    });

    await onLoungeMessageCreate(msg as any);

    expect(thread.send).not.toHaveBeenCalled();
  });

  it('no-ops on messages outside the configured lounge channel', async () => {
    const thread = makeThread();
    const client = makeClientWithThread(thread);
    const msg = makeMessage({ channel: { id: 'some-other-channel' }, client });

    await onLoungeMessageCreate(msg as any);

    expect(thread.send).not.toHaveBeenCalled();
  });

  it('no-ops when there is no active prompt', async () => {
    const thread = makeThread();
    const client = makeClientWithThread(thread);
    const msg = makeMessage({ client });
    (prisma.discussionPromptLog.findFirst as any).mockResolvedValue(null);

    await onLoungeMessageCreate(msg as any);

    expect(thread.send).not.toHaveBeenCalled();
  });

  it('no-ops on duplicate mirror (idempotency check)', async () => {
    const thread = makeThread();
    const client = makeClientWithThread(thread);
    const msg = makeMessage({ client });
    (prisma.mirroredMessage.findUnique as any).mockImplementation(
      ({ where }: { where: { loungeMessageId: string } }) =>
        where.loungeMessageId === 'msg-1'
          ? Promise.resolve({ loungeMessageId: 'msg-1', promptLogId: 'log-1' })
          : Promise.resolve(null),
    );

    await onLoungeMessageCreate(msg as any);

    expect(thread.send).not.toHaveBeenCalled();
    expect(prisma.mirroredMessage.create).not.toHaveBeenCalled();
  });

  it('renders empty-content replies with the placeholder', async () => {
    const thread = makeThread();
    const client = makeClientWithThread(thread);
    const msg = makeMessage({ content: '   ', client });

    await onLoungeMessageCreate(msg as any);

    const sentContent = (thread.send.mock.calls[0][0] as any).content as string;
    expect(sentContent).toContain('*(no text — see lounge)*');
  });

  it('truncates very long content', async () => {
    const thread = makeThread();
    const client = makeClientWithThread(thread);
    const longBody = 'x'.repeat(2000);
    const msg = makeMessage({ content: longBody, client });

    await onLoungeMessageCreate(msg as any);

    const sentContent = (thread.send.mock.calls[0][0] as any).content as string;
    expect(sentContent).toContain('…');
    expect(sentContent.length).toBeLessThanOrEqual(2000);
  });

  it('escapes markdown in display name', async () => {
    const thread = makeThread();
    const client = makeClientWithThread(thread);
    const msg = makeMessage({
      member: { displayName: '**Kevin**' },
      client,
    });

    await onLoungeMessageCreate(msg as any);

    const sentContent = (thread.send.mock.calls[0][0] as any).content as string;
    expect(sentContent).toContain('\\*\\*Kevin\\*\\*');
  });

  it('marks mirror ended when the active thread is archived', async () => {
    const thread = makeThread({ archived: true });
    const client = makeClientWithThread(thread);
    const msg = makeMessage({ client });
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await onLoungeMessageCreate(msg as any);

    expect(prisma.discussionPromptLog.update).toHaveBeenCalledWith({
      where: { id: 'log-1' },
      data: { mirrorEndedAt: expect.any(Date) },
    });
    expect(thread.send).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('no-ops when DiscussionConfig is inactive', async () => {
    const thread = makeThread();
    const client = makeClientWithThread(thread);
    const msg = makeMessage({ client });
    (prisma.discussionConfig.findUnique as any).mockResolvedValue({
      ...CONFIG,
      isActive: false,
    });

    await onLoungeMessageCreate(msg as any);

    expect(thread.send).not.toHaveBeenCalled();
  });
});

describe('onLoungeMessageUpdate', () => {
  it('edits the mirrored thread message with the new content', async () => {
    const fetchedThreadMessage = {
      id: 'thread-msg-1',
      edit: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
    };
    const thread = makeThread();
    thread.messages.fetch = vi.fn().mockResolvedValue(fetchedThreadMessage);
    const client = makeClientWithThread(thread);
    const newMsg = makeMessage({
      content: 'edited!',
      client,
    });
    (prisma.mirroredMessage.findUnique as any).mockResolvedValue({
      loungeMessageId: 'msg-1',
      threadMessageId: 'thread-msg-1',
      promptLogId: 'log-1',
      authorDisplayName: 'kevinkik',
    });

    await onLoungeMessageUpdate(newMsg as any);

    expect(fetchedThreadMessage.edit).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining('> edited!'),
        allowedMentions: { parse: [] },
      }),
    );
  });

  it('no-ops when the message was never mirrored', async () => {
    const thread = makeThread();
    const client = makeClientWithThread(thread);
    const newMsg = makeMessage({ content: 'edited!', client });
    (prisma.mirroredMessage.findUnique as any).mockResolvedValue(null);

    await onLoungeMessageUpdate(newMsg as any);

    expect(thread.messages.fetch).not.toHaveBeenCalled();
  });
});

describe('onLoungeMessageDelete', () => {
  it('Path A: marks mirror ended when the lounge prompt itself is deleted', async () => {
    const thread = makeThread();
    const client = makeClientWithThread(thread);
    const deleted = makeMessage({ id: 'prompt-msg-1', client });
    (prisma.discussionPromptLog.findFirst as any).mockResolvedValue(ACTIVE_PROMPT);
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await onLoungeMessageDelete(deleted as any);

    expect(prisma.discussionPromptLog.update).toHaveBeenCalledWith({
      where: { id: 'log-1' },
      data: { mirrorEndedAt: expect.any(Date) },
    });
    // No thread modification on Path A.
    expect(thread.messages.fetch).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('Path B: deletes the mirrored thread message and removes the row', async () => {
    const fetchedThreadMessage = {
      id: 'thread-msg-1',
      edit: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
    };
    const thread = makeThread();
    thread.messages.fetch = vi.fn().mockResolvedValue(fetchedThreadMessage);
    const client = makeClientWithThread(thread);
    const deleted = makeMessage({ id: 'msg-1', client });
    // Path A returns null (this is a reply, not the prompt).
    (prisma.discussionPromptLog.findFirst as any).mockResolvedValue(null);
    (prisma.mirroredMessage.findUnique as any).mockResolvedValue({
      loungeMessageId: 'msg-1',
      threadMessageId: 'thread-msg-1',
      promptLogId: 'log-1',
      authorDisplayName: 'kevinkik',
    });
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await onLoungeMessageDelete(deleted as any);

    expect(fetchedThreadMessage.delete).toHaveBeenCalled();
    expect(prisma.mirroredMessage.delete).toHaveBeenCalledWith({
      where: { loungeMessageId: 'msg-1' },
    });

    consoleSpy.mockRestore();
  });

  it('no-ops when the deleted message is not the prompt and not in mirror table', async () => {
    const thread = makeThread();
    const client = makeClientWithThread(thread);
    const deleted = makeMessage({ id: 'unknown-msg', client });
    (prisma.discussionPromptLog.findFirst as any).mockResolvedValue(null);
    (prisma.mirroredMessage.findUnique as any).mockResolvedValue(null);

    await onLoungeMessageDelete(deleted as any);

    expect(prisma.discussionPromptLog.update).not.toHaveBeenCalled();
    expect(prisma.mirroredMessage.delete).not.toHaveBeenCalled();
  });

  it('no-ops on deletes outside the configured lounge channel', async () => {
    const deleted = makeMessage({
      id: 'prompt-msg-1',
      channel: { id: 'random-channel' },
    });

    await onLoungeMessageDelete(deleted as any);

    expect(prisma.discussionPromptLog.findFirst).not.toHaveBeenCalled();
    expect(prisma.mirroredMessage.findUnique).not.toHaveBeenCalled();
  });
});
