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
  resetMirrorWebhookCacheForTest,
} from '../services/lounge-mirror';

const ORIGINAL_PL_GUILD_ID = process.env.PL_GUILD_ID;
const ORIGINAL_DEV_GUILD_ID = process.env.DEV_GUILD_ID;
const TEST_GUILD_ID = 'test-guild-1';
const TEST_DEV_GUILD_ID = 'test-dev-guild-1';

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
  promptChannelId: 'lounge-1',
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
    author: {
      id: 'user-1',
      username: 'kevinkik',
      bot: false,
      displayAvatarURL: () => 'https://cdn.discord/user-1.png',
    },
    member: {
      displayName: 'kevinkik',
      displayAvatarURL: () => 'https://cdn.discord/user-1.png',
    },
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

const BOT_CLIENT_ID = 'bot-self';

function makeThread(opts: { archived?: boolean; parentless?: boolean } = {}) {
  const webhook = {
    id: 'wh-1',
    name: 'Photobot Mirror',
    owner: { id: BOT_CLIENT_ID },
    send: vi.fn().mockResolvedValue({ id: 'thread-msg-1' }),
    editMessage: vi.fn().mockResolvedValue({ id: 'thread-msg-1' }),
    deleteMessage: vi.fn().mockResolvedValue(undefined),
  };
  const parent: any = opts.parentless
    ? null
    : {
        id: 'parent-1',
        createWebhook: vi.fn().mockResolvedValue(webhook),
        fetchWebhooks: vi.fn().mockResolvedValue({
          find: (fn: (w: any) => boolean) => [webhook].find(fn),
        }),
        client: { user: { id: BOT_CLIENT_ID } },
      };
  const sentMessage = { id: 'thread-msg-1', edit: vi.fn().mockResolvedValue(undefined) };
  const thread: any = {
    id: 'thread-1',
    archived: opts.archived ?? false,
    isThread: () => true,
    parent,
    send: vi.fn().mockResolvedValue(sentMessage),
    messages: {
      fetch: vi.fn().mockResolvedValue({
        id: 'thread-msg-1',
        edit: vi.fn().mockResolvedValue(undefined),
        delete: vi.fn().mockResolvedValue(undefined),
      }),
    },
  };
  thread._webhook = webhook;
  return thread;
}

function makeClientWithThread(thread: any) {
  return {
    channels: { fetch: vi.fn().mockResolvedValue(thread) },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  resetMirrorWebhookCacheForTest();
  process.env.PL_GUILD_ID = TEST_GUILD_ID;
  (prisma.discussionConfig.findUnique as any).mockResolvedValue(CONFIG);
  // Default: returns the active prompt only when the lookup is keyed to its
  // promptChannelId. Tests that exercise other channels override or check null.
  (prisma.discussionPromptLog.findFirst as any).mockImplementation(({ where }: any) => {
    if (where?.promptChannelId && where.promptChannelId !== ACTIVE_PROMPT.promptChannelId) {
      return Promise.resolve(null);
    }
    return Promise.resolve(ACTIVE_PROMPT);
  });
  (prisma.discussionPromptLog.findUnique as any).mockResolvedValue(ACTIVE_PROMPT);
  (prisma.mirroredMessage.findUnique as any).mockResolvedValue(null);
  (prisma.mirroredMessage.create as any).mockResolvedValue({});
  (prisma.mirroredMessage.delete as any).mockResolvedValue({});
  (prisma.discussionPromptLog.update as any).mockResolvedValue({});
});

afterEach(() => {
  process.env.PL_GUILD_ID = ORIGINAL_PL_GUILD_ID;
  if (ORIGINAL_DEV_GUILD_ID === undefined) {
    delete process.env.DEV_GUILD_ID;
  } else {
    process.env.DEV_GUILD_ID = ORIGINAL_DEV_GUILD_ID;
  }
});

describe('onLoungeMessageCreate', () => {
  it("posts the mirror via the channel webhook with the user's display name + avatar", async () => {
    const thread = makeThread();
    const client = makeClientWithThread(thread);
    const msg = makeMessage({ client });

    await onLoungeMessageCreate(msg as any);

    expect(thread._webhook.send).toHaveBeenCalledWith(
      expect.objectContaining({
        username: 'kevinkik',
        avatarURL: 'https://cdn.discord/user-1.png',
        threadId: 'thread-1',
        allowedMentions: { parse: [] },
        flags: expect.any(Number),
      }),
    );
    const sentContent = (thread._webhook.send.mock.calls[0][0] as any).content as string;
    // Body is plain (no quote prefix, no inline name).
    expect(sentContent).toMatch(/^I love sunsets\n-# \[original ↗\]/);
    expect(sentContent).toContain(`/${TEST_GUILD_ID}/lounge-1/msg-1`);
    expect(sentContent).not.toContain('**kevinkik**');
    // The bot's plain `thread.send` is not used in the webhook path.
    expect(thread.send).not.toHaveBeenCalled();
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

  it('falls back to a bot-authored message when no webhook is available', async () => {
    const thread = makeThread({ parentless: true });
    const client = makeClientWithThread(thread);
    const msg = makeMessage({ client });

    await onLoungeMessageCreate(msg as any);

    expect(thread.send).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining('**kevinkik**'),
        allowedMentions: { parse: [] },
      }),
    );
    expect(prisma.mirroredMessage.create).toHaveBeenCalled();
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

    expect(thread._webhook.send).toHaveBeenCalled();
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

    expect(thread._webhook.send).not.toHaveBeenCalled();
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

    expect(thread._webhook.send).not.toHaveBeenCalled();
  });

  it('no-ops on bot messages', async () => {
    const thread = makeThread();
    const client = makeClientWithThread(thread);
    const msg = makeMessage({
      author: { id: 'bot-1', username: 'photobot', bot: true },
      client,
    });

    await onLoungeMessageCreate(msg as any);

    expect(thread._webhook.send).not.toHaveBeenCalled();
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

    expect(thread._webhook.send).not.toHaveBeenCalled();
  });

  it('no-ops in a channel that has no active prompt', async () => {
    const thread = makeThread();
    const client = makeClientWithThread(thread);
    const msg = makeMessage({
      channel: { id: 'some-other-channel' },
      reference: { messageId: 'prompt-msg-1', channelId: 'some-other-channel', type: MessageReferenceType.Default },
      client,
    });

    await onLoungeMessageCreate(msg as any);

    expect(thread._webhook.send).not.toHaveBeenCalled();
  });

  it('mirrors a /discuss post-here reply in a non-lounge channel', async () => {
    const thread = makeThread();
    const client = makeClientWithThread(thread);
    const POST_HERE_PROMPT = {
      ...ACTIVE_PROMPT,
      id: 'log-2',
      promptChannelId: 'random-ch',
      channelId: 'random-ch',
      crossPostMessageId: null,
      loungePromptMessageId: 'post-here-prompt-1',
    };
    (prisma.discussionPromptLog.findFirst as any).mockImplementation(({ where }: any) => {
      if (where?.promptChannelId === 'random-ch') return Promise.resolve(POST_HERE_PROMPT);
      return Promise.resolve(null);
    });
    const msg = makeMessage({
      channel: { id: 'random-ch' },
      reference: {
        messageId: 'post-here-prompt-1',
        channelId: 'random-ch',
        type: MessageReferenceType.Default,
      },
      client,
    });

    await onLoungeMessageCreate(msg as any);

    expect(thread._webhook.send).toHaveBeenCalled();
    expect(prisma.mirroredMessage.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ promptLogId: 'log-2' }),
    });
  });

  it('mirrors post-here replies even when the global discussion config is inactive', async () => {
    const thread = makeThread();
    const client = makeClientWithThread(thread);
    const POST_HERE_PROMPT = {
      ...ACTIVE_PROMPT,
      id: 'log-3',
      promptChannelId: 'random-ch',
      channelId: 'random-ch',
      crossPostMessageId: null,
      loungePromptMessageId: 'post-here-prompt-3',
    };
    (prisma.discussionConfig.findUnique as any).mockResolvedValue({ ...CONFIG, isActive: false });
    (prisma.discussionPromptLog.findFirst as any).mockImplementation(({ where }: any) => {
      if (where?.promptChannelId === 'random-ch') return Promise.resolve(POST_HERE_PROMPT);
      return Promise.resolve(null);
    });
    const msg = makeMessage({
      channel: { id: 'random-ch' },
      reference: {
        messageId: 'post-here-prompt-3',
        channelId: 'random-ch',
        type: MessageReferenceType.Default,
      },
      client,
    });

    await onLoungeMessageCreate(msg as any);

    expect(thread._webhook.send).toHaveBeenCalled();
  });

  it('no-ops when there is no active prompt', async () => {
    const thread = makeThread();
    const client = makeClientWithThread(thread);
    const msg = makeMessage({ client });
    (prisma.discussionPromptLog.findFirst as any).mockResolvedValue(null);

    await onLoungeMessageCreate(msg as any);

    expect(thread._webhook.send).not.toHaveBeenCalled();
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

    expect(thread._webhook.send).not.toHaveBeenCalled();
    expect(prisma.mirroredMessage.create).not.toHaveBeenCalled();
  });

  it('renders empty-content replies with the placeholder', async () => {
    const thread = makeThread();
    const client = makeClientWithThread(thread);
    const msg = makeMessage({ content: '   ', client });

    await onLoungeMessageCreate(msg as any);

    const sentContent = (thread._webhook.send.mock.calls[0][0] as any).content as string;
    expect(sentContent).toContain('*(no text — see lounge)*');
  });

  it('truncates very long content', async () => {
    const thread = makeThread();
    const client = makeClientWithThread(thread);
    const longBody = 'x'.repeat(2500);
    const msg = makeMessage({ content: longBody, client });

    await onLoungeMessageCreate(msg as any);

    const sentContent = (thread._webhook.send.mock.calls[0][0] as any).content as string;
    expect(sentContent).toContain('…');
    expect(sentContent.length).toBeLessThanOrEqual(2000);
  });

  it('passes the display name through to the webhook username verbatim', async () => {
    // Webhook usernames render as plain text — Discord does not interpret
    // markdown there, so we deliberately do not escape it.
    const thread = makeThread();
    const client = makeClientWithThread(thread);
    const msg = makeMessage({
      member: { displayName: '**Kevin**', displayAvatarURL: () => 'https://cdn/x.png' },
      client,
    });

    await onLoungeMessageCreate(msg as any);

    expect(thread._webhook.send).toHaveBeenCalledWith(expect.objectContaining({ username: '**Kevin**' }));
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
    expect(thread._webhook.send).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('mirrors when message originates in DEV_GUILD_ID', async () => {
    process.env.DEV_GUILD_ID = TEST_DEV_GUILD_ID;
    const thread = makeThread();
    const client = makeClientWithThread(thread);
    const msg = makeMessage({ guild: { id: TEST_DEV_GUILD_ID }, client });

    await onLoungeMessageCreate(msg as any);

    expect(thread._webhook.send).toHaveBeenCalled();
    expect(prisma.mirroredMessage.create).toHaveBeenCalled();
  });

  it('no-ops when message originates in an unrelated guild', async () => {
    const thread = makeThread();
    const client = makeClientWithThread(thread);
    const msg = makeMessage({ guild: { id: 'some-other-guild' }, client });

    await onLoungeMessageCreate(msg as any);

    expect(thread._webhook.send).not.toHaveBeenCalled();
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

    expect(thread._webhook.send).not.toHaveBeenCalled();
  });
});

describe('onLoungeMessageUpdate', () => {
  it('edits the mirrored thread message via the webhook', async () => {
    const thread = makeThread();
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

    expect(thread._webhook.editMessage).toHaveBeenCalledWith(
      'thread-msg-1',
      expect.objectContaining({
        content: expect.stringContaining('edited!'),
        threadId: 'thread-1',
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

    expect(thread._webhook.editMessage).not.toHaveBeenCalled();
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

  it('Path B: deletes the mirrored thread message via the webhook and removes the row', async () => {
    const thread = makeThread();
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

    expect(thread._webhook.deleteMessage).toHaveBeenCalledWith('thread-msg-1', 'thread-1');
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

  it('still ends a /discuss post-here mirror when its prompt is deleted (any channel)', async () => {
    // Discord message IDs are globally unique; the prompt-message lookup keys
    // off ID, not channel, so deletes from a non-lounge channel must still hit
    // Path A.
    const deleted = makeMessage({
      id: 'prompt-msg-1',
      channel: { id: 'random-channel' },
    });

    await onLoungeMessageDelete(deleted as any);

    expect(prisma.discussionPromptLog.update).toHaveBeenCalledWith({
      where: { id: 'log-1' },
      data: { mirrorEndedAt: expect.any(Date) },
    });
  });
});
