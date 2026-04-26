// Mirror service. Listens for replies to the active discussion prompt in
// #photo-lounge (and downstream replies in the same chain) and mirrors a
// bot-quoted copy into the discussion thread.
//
// State lives entirely in the DB — restart-safe, no in-memory caches.
//
// See docs/superpowers/specs/2026-04-26-lounge-prompt-mirror-design.md.

import { prisma } from '@photobot/db';
import {
  type Client,
  escapeMarkdown,
  type Message,
  MessageFlags,
  MessageReferenceType,
  type OmitPartialGroupDMChannel,
  type PartialMessage,
  type ThreadChannel,
} from 'discord.js';

const MAX_MIRRORED_BODY_LENGTH = 1700; // Leave headroom for prefix + jump link.

interface DiscussionConfigShape {
  loungeChannelId: string;
}

/**
 * Resolve the active prompt for mirroring. There is at most one: the most
 * recently posted prompt log row whose `mirrorEndedAt` is still null and that
 * was posted under the new channel-restructure flow (so `loungePromptMessageId`
 * is non-null).
 */
async function getActivePromptLog() {
  return prisma.discussionPromptLog.findFirst({
    where: {
      loungePromptMessageId: { not: null },
      mirrorEndedAt: null,
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
 * Build the bot-quoted mirror content. Bare placeholder when the original is
 * empty (e.g. image-only). Truncated to fit Discord's 2000-char message cap.
 */
function buildMirrorContent(authorDisplayName: string, rawContent: string, jumpUrl: string): string {
  const escapedAuthor = escapeMarkdown(authorDisplayName);
  const trimmed = rawContent.trim();
  let quoted: string;
  if (trimmed.length === 0) {
    quoted = '*(no text — see lounge)*';
  } else {
    const body = trimmed.length > MAX_MIRRORED_BODY_LENGTH ? `${trimmed.slice(0, MAX_MIRRORED_BODY_LENGTH)}…` : trimmed;
    quoted = body
      .split('\n')
      .map((line) => `> ${line}`)
      .join('\n');
  }
  return `**${escapedAuthor}** [↗ jump](${jumpUrl})\n${quoted}`;
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

async function shouldMirror(msg: OmitPartialGroupDMChannel<Message>, config: DiscussionConfigShape): Promise<boolean> {
  if (!msg.guild) return false;
  if (msg.guild.id !== process.env.PL_GUILD_ID) return false;
  if (msg.channel.id !== config.loungeChannelId) return false;
  if (msg.author?.bot) return false;
  const ref = msg.reference;
  if (!ref?.messageId) return false;
  // Forwarded messages have type 1; only mirror genuine replies (type 0
  // / Default) and tolerate undefined for older clients.
  if (ref.type !== undefined && ref.type !== MessageReferenceType.Default) {
    return false;
  }
  if (ref.channelId && ref.channelId !== config.loungeChannelId) return false;
  return true;
}

export async function onLoungeMessageCreate(msg: OmitPartialGroupDMChannel<Message>): Promise<void> {
  const config = await prisma.discussionConfig.findUnique({ where: { id: 'singleton' } });
  if (!config?.isActive) return;
  if (!(await shouldMirror(msg, config))) return;

  // Idempotency: if we already mirrored this exact lounge message, no-op
  // (defends against gateway event re-delivery).
  const existing = await prisma.mirroredMessage.findUnique({
    where: { loungeMessageId: msg.id },
  });
  if (existing) return;

  const activePrompt = await getActivePromptLog();
  if (!activePrompt?.threadId || !activePrompt.loungePromptMessageId) {
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
  const content = buildMirrorContent(authorName, msg.content, jumpUrl);

  let threadMessageId: string;
  try {
    const mirrored = await thread.send({
      content,
      allowedMentions: { parse: [] },
      flags: MessageFlags.SuppressNotifications,
    });
    threadMessageId = mirrored.id;
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
  const config = await prisma.discussionConfig.findUnique({ where: { id: 'singleton' } });
  if (!config) return;
  if (newMessage.channel.id !== config.loungeChannelId) return;
  if (newMessage.guild?.id !== process.env.PL_GUILD_ID) return;
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
  const content = buildMirrorContent(row.authorDisplayName, resolved.content, jumpUrl);

  try {
    const log = await prisma.discussionPromptLog.findUnique({
      where: { id: row.promptLogId },
    });
    if (!log?.threadId) return;
    const thread = await fetchActiveThread(resolved.client, log.threadId);
    if (!thread) return;
    const threadMessage = await thread.messages.fetch(row.threadMessageId);
    await threadMessage.edit({ content, allowedMentions: { parse: [] } });
  } catch (_err) {}
}

export async function onLoungeMessageDelete(
  deleted: OmitPartialGroupDMChannel<Message | PartialMessage>,
): Promise<void> {
  const config = await prisma.discussionConfig.findUnique({ where: { id: 'singleton' } });
  if (!config) return;
  if (deleted.channel.id !== config.loungeChannelId) return;
  if (deleted.guild && deleted.guild.id !== process.env.PL_GUILD_ID) return;

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
        try {
          const threadMessage = await thread.messages.fetch(row.threadMessageId);
          await threadMessage.delete();
        } catch (_err) {}
      }
    }
    await prisma.mirroredMessage.delete({ where: { loungeMessageId: deleted.id } });
  } catch (_err) {}
}
