// Mirror service. Listens for replies to the active discussion prompt in
// #photo-lounge (and downstream replies in the same chain) and re-posts them
// into the discussion thread via a per-channel webhook so the message renders
// with the original user's display name and avatar (still tagged "APP").
//
// Persistent state (which lounge messages have been mirrored) lives in the DB.
// The webhook lookup is cached in-process and re-resolved on cold start.
//
// See docs/superpowers/specs/2026-04-26-lounge-prompt-mirror-design.md.

import { prisma } from '@photobot/db';
import {
  type Client,
  type Message,
  MessageFlags,
  MessageReferenceType,
  type OmitPartialGroupDMChannel,
  type PartialMessage,
  type TextChannel,
  type ThreadChannel,
  type Webhook,
} from 'discord.js';
import { isAllowedGuild } from '../utils/guilds';

const MAX_MIRRORED_BODY_LENGTH = 1900; // Leave headroom for the jump-link subtext.
const MIRROR_WEBHOOK_NAME = 'Photobot Mirror';

// Parent-channel ID -> Webhook instance. Cleared on cold start; we then
// re-discover by name via fetchWebhooks().
const webhookCache = new Map<string, Webhook>();

/** Test-only: clears the in-process webhook cache. */
export function resetMirrorWebhookCacheForTest(): void {
  webhookCache.clear();
}

/**
 * Resolve the active prompt for mirroring in `channelId`. Both the daily cycle
 * (in #photo-lounge) and `/discuss post-here` (in any channel) can hold an
 * active prompt; we key the lookup off `promptChannelId` so each channel has
 * its own active prompt independently. Returns the most recent if multiple.
 */
async function getActivePromptLog(channelId: string) {
  return prisma.discussionPromptLog.findFirst({
    where: {
      loungePromptMessageId: { not: null },
      mirrorEndedAt: null,
      promptChannelId: channelId,
    },
    orderBy: { postedAt: 'desc' },
  });
}

async function markMirrorEnded(logId: string, _reason: string): Promise<void> {
  try {
    await prisma.discussionPromptLog.update({
      where: { id: logId },
      data: { mirrorEndedAt: new Date() },
    });
  } catch (_err) {}
}

/**
 * Build the mirror content. Webhook posting carries the user's display name
 * and avatar, so the body is plain text plus a small subtext link back to the
 * original message. Bare placeholder when the original is empty (e.g.
 * image-only). Truncated to fit Discord's 2000-char message cap.
 */
function buildMirrorContent(rawContent: string, jumpUrl: string): string {
  const trimmed = rawContent.trim();
  const body =
    trimmed.length === 0
      ? '*(no text — see lounge)*'
      : trimmed.length > MAX_MIRRORED_BODY_LENGTH
        ? `${trimmed.slice(0, MAX_MIRRORED_BODY_LENGTH)}…`
        : trimmed;
  return `${body}\n-# [original ↗](${jumpUrl})`;
}

async function fetchActiveThread(client: Client, threadId: string): Promise<ThreadChannel | null> {
  try {
    const channel = await client.channels.fetch(threadId);
    if (!channel?.isThread()) return null;
    return channel as ThreadChannel;
  } catch {
    return null;
  }
}

/**
 * Get (or create) the dedicated mirror webhook on `parentChannel`. We reuse
 * one webhook per channel so threads under it can all share it via threadId.
 * Returns null if the bot lacks Manage Webhooks or the API call fails.
 */
async function getOrCreateMirrorWebhook(parentChannel: TextChannel): Promise<Webhook | null> {
  const cached = webhookCache.get(parentChannel.id);
  if (cached) return cached;

  const clientId = parentChannel.client.user?.id;
  if (!clientId) return null;

  try {
    const existing = await parentChannel.fetchWebhooks();
    const mine = existing.find((w) => w.owner?.id === clientId && w.name === MIRROR_WEBHOOK_NAME);
    if (mine) {
      webhookCache.set(parentChannel.id, mine);
      return mine;
    }
    const created = await parentChannel.createWebhook({
      name: MIRROR_WEBHOOK_NAME,
      reason: 'Mirror discussion replies into the prompt thread',
    });
    webhookCache.set(parentChannel.id, created);
    return created;
  } catch (_err) {
    return null;
  }
}

function resolveParentChannel(thread: ThreadChannel): TextChannel | null {
  const parent = thread.parent;
  if (!parent || !('createWebhook' in parent)) return null;
  return parent as TextChannel;
}

function resolveAvatarUrl(msg: OmitPartialGroupDMChannel<Message>): string | undefined {
  const member = msg.member;
  if (member && typeof member.displayAvatarURL === 'function') {
    return member.displayAvatarURL() ?? undefined;
  }
  return msg.author.displayAvatarURL?.() ?? undefined;
}

function isReplyCandidate(msg: OmitPartialGroupDMChannel<Message>): boolean {
  if (!msg.guild) return false;
  if (!isAllowedGuild(msg.guild.id)) return false;
  if (msg.author?.bot) return false;
  const ref = msg.reference;
  if (!ref?.messageId) return false;
  // Forwarded messages have type 1; only mirror genuine replies (type 0
  // / Default) and tolerate undefined for older clients.
  if (ref.type !== undefined && ref.type !== MessageReferenceType.Default) {
    return false;
  }
  if (ref.channelId && ref.channelId !== msg.channel.id) return false;
  return true;
}

export async function onLoungeMessageCreate(msg: OmitPartialGroupDMChannel<Message>): Promise<void> {
  if (!isReplyCandidate(msg)) return;

  // Idempotency: if we already mirrored this exact lounge message, no-op
  // (defends against gateway event re-delivery).
  const existing = await prisma.mirroredMessage.findUnique({
    where: { loungeMessageId: msg.id },
  });
  if (existing) return;

  const activePrompt = await getActivePromptLog(msg.channel.id);
  if (!activePrompt?.threadId || !activePrompt.loungePromptMessageId) {
    return;
  }

  // Daily-cycle prompts respect the global on/off toggle; one-off post-here
  // prompts are user-initiated and ignore it.
  const config = await prisma.discussionConfig.findUnique({ where: { id: 'singleton' } });
  if (config && activePrompt.promptChannelId === config.loungeChannelId && !config.isActive) {
    return;
  }

  const referenceId = msg.reference?.messageId;
  if (!referenceId) return;
  const isReplyToPrompt = referenceId === activePrompt.loungePromptMessageId;
  if (!isReplyToPrompt) {
    const ancestor = await prisma.mirroredMessage.findUnique({
      where: { loungeMessageId: referenceId },
    });
    if (!ancestor || ancestor.promptLogId !== activePrompt.id) return;
  }

  const thread = await fetchActiveThread(msg.client, activePrompt.threadId);
  if (!thread || thread.archived) {
    await markMirrorEnded(activePrompt.id, thread ? 'thread-archived' : 'thread-unavailable');
    return;
  }

  const authorName = msg.member?.displayName ?? msg.author.username;
  const guildId = msg.guild?.id;
  const jumpUrl = `https://discord.com/channels/${guildId}/${msg.channel.id}/${msg.id}`;
  const content = buildMirrorContent(msg.content, jumpUrl);

  const parentChannel = resolveParentChannel(thread);
  const webhook = parentChannel ? await getOrCreateMirrorWebhook(parentChannel) : null;

  let threadMessageId: string;
  try {
    if (webhook) {
      const mirrored = await webhook.send({
        content,
        username: authorName,
        avatarURL: resolveAvatarUrl(msg),
        threadId: thread.id,
        allowedMentions: { parse: [] },
        flags: MessageFlags.SuppressNotifications,
      });
      threadMessageId = mirrored.id;
    } else {
      // Fallback when we can't (or aren't allowed to) use a webhook: post as
      // the bot with an inline attribution header.
      const mirrored = await thread.send({
        content: `**${authorName}**\n${content}`,
        allowedMentions: { parse: [] },
        flags: MessageFlags.SuppressNotifications,
      });
      threadMessageId = mirrored.id;
    }
  } catch (_err) {
    return;
  }

  try {
    await prisma.mirroredMessage.create({
      data: {
        loungeMessageId: msg.id,
        threadMessageId,
        promptLogId: activePrompt.id,
        authorId: msg.author.id,
        authorDisplayName: authorName,
      },
    });
  } catch (_err) {}
}

export async function onLoungeMessageUpdate(
  newMessage: OmitPartialGroupDMChannel<Message | PartialMessage>,
): Promise<void> {
  if (!isAllowedGuild(newMessage.guild?.id)) return;
  if (newMessage.author?.bot) return;

  const row = await prisma.mirroredMessage.findUnique({
    where: { loungeMessageId: newMessage.id },
  });
  if (!row) return;

  // Resolve content. Partial messages need a fetch.
  let resolved: Message;
  try {
    resolved = newMessage.partial ? await newMessage.fetch() : (newMessage as Message);
  } catch (_err) {
    return;
  }

  const guildId = resolved.guild?.id;
  const jumpUrl = `https://discord.com/channels/${guildId}/${resolved.channel.id}/${resolved.id}`;
  const content = buildMirrorContent(resolved.content, jumpUrl);

  try {
    const log = await prisma.discussionPromptLog.findUnique({
      where: { id: row.promptLogId },
    });
    if (!log?.threadId) return;
    const thread = await fetchActiveThread(resolved.client, log.threadId);
    if (!thread) return;
    const parentChannel = resolveParentChannel(thread);
    const webhook = parentChannel ? await getOrCreateMirrorWebhook(parentChannel) : null;
    if (webhook) {
      await webhook.editMessage(row.threadMessageId, {
        content,
        threadId: thread.id,
        allowedMentions: { parse: [] },
      });
    } else {
      // Fallback: edit as the bot. Re-prepend the attribution header used in
      // the create-time fallback so the message stays self-describing.
      const threadMessage = await thread.messages.fetch(row.threadMessageId);
      await threadMessage.edit({
        content: `**${row.authorDisplayName}**\n${content}`,
        allowedMentions: { parse: [] },
      });
    }
  } catch (_err) {}
}

export async function onLoungeMessageDelete(
  deleted: OmitPartialGroupDMChannel<Message | PartialMessage>,
): Promise<void> {
  if (deleted.guild && !isAllowedGuild(deleted.guild.id)) return;

  // Path A: was this the lounge prompt itself?
  const promptLog = await prisma.discussionPromptLog.findFirst({
    where: { loungePromptMessageId: deleted.id, mirrorEndedAt: null },
  });
  if (promptLog) {
    await markMirrorEnded(promptLog.id, 'prompt-deleted');
    return;
  }

  // Path B: was this a mirrored reply?
  const row = await prisma.mirroredMessage.findUnique({
    where: { loungeMessageId: deleted.id },
  });
  if (!row) return;

  try {
    const log = await prisma.discussionPromptLog.findUnique({
      where: { id: row.promptLogId },
    });
    if (log?.threadId) {
      const thread = await fetchActiveThread(deleted.client, log.threadId);
      if (thread) {
        const parentChannel = resolveParentChannel(thread);
        const webhook = parentChannel ? await getOrCreateMirrorWebhook(parentChannel) : null;
        try {
          if (webhook) {
            await webhook.deleteMessage(row.threadMessageId, thread.id);
          } else {
            const threadMessage = await thread.messages.fetch(row.threadMessageId);
            await threadMessage.delete();
          }
        } catch (_err) {}
      }
    }
    await prisma.mirroredMessage.delete({ where: { loungeMessageId: deleted.id } });
  } catch (_err) {}
}
