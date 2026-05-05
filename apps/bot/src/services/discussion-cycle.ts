import { prisma } from '@photobot/db';
import {
  type Client,
  type Collection,
  type Message,
  type TextChannel,
  TextChannel as TextChannelClass,
} from 'discord.js';
import { canUseFeature } from '../middleware/permissions';
import { createPromptEmbed } from '../utils/embed';
import { buildThreadName } from '../utils/thread-name';
import { selectPrompt } from './prompts';

const QUIET_THRESHOLD_MS = 2 * 60 * 1000;
const MAX_DEFER_MS = 5 * 60 * 1000;
const DEFER_CHECK_MS = 60 * 1000;
const THREAD_AUTO_ARCHIVE_MINUTES = 10080; // 1 week — Discord max

let isCycleRunning = false;

export type CycleResult =
  | { ok: true; reason?: undefined }
  | { ok: false; reason: 'busy' | 'not_allowed' | 'channel_unavailable' | 'discord_error' };

interface DiscussionConfigShape {
  discussionsChannelId: string;
  loungeChannelId: string;
  categoryFilter: string | null;
  isActive: boolean;
}

/**
 * Try to acquire the cycle lock. Returns true if acquired, false if already held.
 * The lock guards both runDailyCycle and the scheduler's bump phase so they
 * cannot interleave.
 */
export function tryAcquireCycleLock(): boolean {
  if (isCycleRunning) return false;
  isCycleRunning = true;
  return true;
}

export function releaseCycleLock(): void {
  isCycleRunning = false;
}

export function isCycleLockHeld(): boolean {
  return isCycleRunning;
}

/** Test-only: forcibly release the cycle lock between tests. */
export function resetCycleLockForTest(): void {
  isCycleRunning = false;
}

export async function runDailyCycle(
  client: Client,
  config: DiscussionConfigShape,
  options: { skipQuietWait?: boolean } = {},
): Promise<CycleResult> {
  if (!tryAcquireCycleLock()) return { ok: false, reason: 'busy' };
  try {
    return await runDailyCycleInner(client, config, options);
  } finally {
    releaseCycleLock();
  }
}

/**
 * Same logic as runDailyCycle, but assumes the cycle lock is already held.
 * Used by both the public runDailyCycle wrapper and skipCurrentDailyPrompt
 * (which holds the lock across delete + repost).
 */
async function runDailyCycleInner(
  client: Client,
  config: DiscussionConfigShape,
  options: { skipQuietWait?: boolean },
): Promise<CycleResult> {
  const allowed = await canUseFeature(config.discussionsChannelId, [], 'discuss');
  if (!allowed) return { ok: false, reason: 'not_allowed' };

  const loungeChannel = await fetchTextChannel(client, config.loungeChannelId);
  const discussionsChannel = await fetchTextChannel(client, config.discussionsChannelId);
  if (!loungeChannel || !discussionsChannel) {
    return { ok: false, reason: 'channel_unavailable' };
  }

  const prompt = await selectPrompt(config.categoryFilter);

  // Quiet-wait before the primary post — lounge is now the origin, so we
  // should defer if conversation is active. Skipped on /discuss post-daily.
  if (!options.skipQuietWait) await waitForQuiet(loungeChannel);

  // Re-check isActive after the wait — admin may have disabled mid-cycle.
  const fresh = await prisma.discussionConfig.findUnique({ where: { id: 'singleton' } });
  if (!fresh?.isActive) return { ok: true };

  // Post the prompt embed in lounge.
  let loungePromptMessage: Message;
  try {
    const embed = createPromptEmbed(prompt.text, 'Discussion of the Day');
    loungePromptMessage = await loungeChannel.send({ embeds: [embed] });
  } catch (_err) {
    return { ok: false, reason: 'discord_error' };
  }

  // Start a thread on the lounge prompt. If this fails, delete the prompt
  // message so the slot is retryable on the next tick.
  let threadId: string;
  try {
    const thread = await loungePromptMessage.startThread({
      name: buildThreadName(prompt.text),
      autoArchiveDuration: THREAD_AUTO_ARCHIVE_MINUTES,
    });
    threadId = thread.id;
  } catch (_err) {
    try {
      await loungePromptMessage.delete();
    } catch (_deleteErr) {}
    return { ok: false, reason: 'discord_error' };
  }

  const guildId = loungeChannel.guildId ?? client.guilds.cache.get(process.env.PL_GUILD_ID ?? '')?.id;
  const threadUrl = `https://discord.com/channels/${guildId}/${threadId}`;

  // Cross-post in #discussions. Best-effort — failure does not roll back.
  let crossPostMessageId: string | null = null;
  try {
    const crossPostEmbed = createPromptEmbed(prompt.text, 'Discussion of the Day', threadUrl);
    const crossPostMessage = await discussionsChannel.send({ embeds: [crossPostEmbed] });
    crossPostMessageId = crossPostMessage.id;
  } catch (_err) {}

  const now = new Date();
  // Close out any prior unended prompts in this lounge before recording the
  // new one. Without this, every cycle leaves a stale row with mirrorEndedAt
  // null, and historical rows accumulate forever even though only the most
  // recent one is ever consulted by the mirror service.
  await prisma.$transaction([
    prisma.discussionPromptLog.updateMany({
      where: {
        promptChannelId: config.loungeChannelId,
        mirrorEndedAt: null,
      },
      data: { mirrorEndedAt: now },
    }),
    prisma.discussionPromptLog.create({
      data: {
        channelId: config.discussionsChannelId,
        promptChannelId: config.loungeChannelId,
        promptText: prompt.text,
        category: prompt.category,
        threadId,
        loungePromptMessageId: loungePromptMessage.id,
        crossPostMessageId,
        lastAnnouncedAt: now,
      },
    }),
  ]);

  return { ok: true };
}

/**
 * Skip the currently-active daily prompt: delete the lounge prompt message
 * (Discord auto-deletes the attached thread + its messages), delete the
 * cross-post in #discussions, drop the DB rows, then immediately post a fresh
 * cycle. Holds the cycle lock across both phases so the scheduler and
 * concurrent /post-daily calls can't interleave.
 */
export async function skipCurrentDailyPrompt(client: Client, config: DiscussionConfigShape): Promise<CycleResult> {
  if (!tryAcquireCycleLock()) return { ok: false, reason: 'busy' };
  try {
    const active = await prisma.discussionPromptLog.findFirst({
      where: {
        promptChannelId: config.loungeChannelId,
        mirrorEndedAt: null,
        loungePromptMessageId: { not: null },
      },
      orderBy: { postedAt: 'desc' },
    });

    if (active) {
      const loungeChannel = await fetchTextChannel(client, config.loungeChannelId);
      const discussionsChannel = await fetchTextChannel(client, config.discussionsChannelId);

      // Discord auto-deletes the thread (and its messages) when the message
      // it was started from is deleted, so deleting the lounge prompt is
      // sufficient to tear down the whole prompt + thread.
      if (loungeChannel && active.loungePromptMessageId) {
        try {
          const promptMsg = await loungeChannel.messages.fetch(active.loungePromptMessageId);
          await promptMsg.delete();
        } catch (_err) {}
      }

      if (discussionsChannel && active.crossPostMessageId) {
        try {
          const crossPostMsg = await discussionsChannel.messages.fetch(active.crossPostMessageId);
          await crossPostMsg.delete();
        } catch (_err) {}
      }

      // Drop DB rows. MirroredMessage.promptLogId has onDelete: Restrict, so
      // mirrors must go first.
      try {
        await prisma.$transaction([
          prisma.mirroredMessage.deleteMany({ where: { promptLogId: active.id } }),
          prisma.discussionPromptLog.delete({ where: { id: active.id } }),
        ]);
      } catch (_err) {
        // Non-fatal: a leftover row will be closed by the new cycle's
        // updateMany. Continue to the repost.
      }
    }

    return await runDailyCycleInner(client, config, { skipQuietWait: true });
  } finally {
    releaseCycleLock();
  }
}

interface BumpResult {
  posted: boolean;
  error: boolean;
}

/**
 * Re-announce the active prompt as a slim Discord-reply to the original lounge
 * prompt message. Discord renders the original prompt inline above the bump,
 * so users see it without scrolling. Replies to the bump itself are NOT mirrored
 * (only the original prompt anchors the mirror chain).
 */
export async function postBumpInLounge(
  logId: string,
  loungePromptMessageId: string,
  threadUrl: string,
  loungeChannel: TextChannel,
  options: { skipQuietWait?: boolean } = {},
): Promise<BumpResult> {
  if (!options.skipQuietWait) await waitForQuiet(loungeChannel);

  // Re-check isActive after the wait — admin may have disabled mid-window.
  const fresh = await prisma.discussionConfig.findUnique({ where: { id: 'singleton' } });
  if (!fresh?.isActive) return { posted: false, error: false };

  try {
    await loungeChannel.send({
      content: `💬 Today's prompt is still active — share your thoughts in the lounge or [in the thread](${threadUrl}).`,
      reply: { messageReference: loungePromptMessageId, failIfNotExists: false },
      allowedMentions: { repliedUser: false },
    });
    await prisma.discussionPromptLog.update({
      where: { id: logId },
      data: { lastAnnouncedAt: new Date() },
    });
    return { posted: true, error: false };
  } catch (_err) {
    return { posted: false, error: true };
  }
}

async function fetchTextChannel(client: Client, channelId: string): Promise<TextChannel | null> {
  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel || !(channel instanceof TextChannelClass)) return null;
    return channel;
  } catch (_err) {
    return null;
  }
}

async function isChannelQuiet(channel: TextChannel): Promise<boolean> {
  try {
    const messages: Collection<string, Message> = await channel.messages.fetch({ limit: 1 });
    if (messages.size === 0) return true;
    const last = messages.first();
    if (!last) return true;
    return Date.now() - last.createdTimestamp >= QUIET_THRESHOLD_MS;
  } catch {
    return true;
  }
}

async function waitForQuiet(channel: TextChannel): Promise<void> {
  const deadline = Date.now() + MAX_DEFER_MS;
  while (Date.now() < deadline) {
    if (await isChannelQuiet(channel)) return;
    await new Promise((resolve) => setTimeout(resolve, DEFER_CHECK_MS));
  }
}
