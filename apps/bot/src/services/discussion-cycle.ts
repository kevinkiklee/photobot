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
 * The lock guards both runDailyCycle (full cycle) and the scheduler's Phase 2
 * lounge re-announcements so they cannot interleave.
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
): Promise<CycleResult> {
  if (!tryAcquireCycleLock()) return { ok: false, reason: 'busy' };

  try {
    const allowed = await canUseFeature(config.discussionsChannelId, [], 'discuss');
    if (!allowed) return { ok: false, reason: 'not_allowed' };

    const discussionsChannel = await fetchTextChannel(client, config.discussionsChannelId);
    const loungeChannel = await fetchTextChannel(client, config.loungeChannelId);
    if (!discussionsChannel || !loungeChannel) {
      return { ok: false, reason: 'channel_unavailable' };
    }

    const prompt = await selectPrompt(config.categoryFilter);

    // Post the prompt embed in #discussions (no quiet wait).
    let discussionsMessage: Message;
    try {
      const embed = createPromptEmbed(prompt.text, prompt.category, 'Discussion of the Day');
      discussionsMessage = await discussionsChannel.send({ embeds: [embed] });
    } catch (err) {
      console.error('Failed to post in discussions channel:', err);
      return { ok: false, reason: 'discord_error' };
    }

    // Create the thread.
    let threadId: string;
    try {
      const thread = await discussionsMessage.startThread({
        name: buildThreadName(prompt.text),
        autoArchiveDuration: THREAD_AUTO_ARCHIVE_MINUTES,
      });
      threadId = thread.id;
    } catch (err) {
      console.error('Failed to create discussion thread:', err);
      // Best-effort cleanup of the orphan message.
      try {
        await discussionsMessage.delete();
      } catch (delErr) {
        console.error('Failed to delete orphan discussion message:', delErr);
      }
      return { ok: false, reason: 'discord_error' };
    }

    // Insert the log row before attempting the lounge announcement.
    const log = await prisma.discussionPromptLog.create({
      data: {
        channelId: config.discussionsChannelId,
        promptText: prompt.text,
        category: prompt.category,
        threadId,
        discussionsMessageId: discussionsMessage.id,
      },
    });

    // Announce in lounge with quiet wait + isActive re-check.
    const announce = await runLoungeAnnounce(
      client,
      log.id,
      prompt.text,
      prompt.category,
      threadId,
      loungeChannel,
    );

    // A genuine Discord/DB error during the lounge phase fails the cycle.
    // An admin-driven skip (isActive flipped off) does NOT — the discussions
    // side already succeeded, so the cycle is logically complete.
    if (announce.error) return { ok: false, reason: 'discord_error' };

    return { ok: true };
  } finally {
    releaseCycleLock();
  }
}

interface AnnounceResult {
  posted: boolean;
  error: boolean;
}

export async function runLoungeAnnounce(
  client: Client,
  logId: string,
  promptText: string,
  category: string,
  threadId: string,
  loungeChannel: TextChannel,
): Promise<AnnounceResult> {
  await waitForQuiet(loungeChannel);

  // Re-check isActive after the wait — admin may have disabled mid-cycle.
  const fresh = await prisma.discussionConfig.findUnique({ where: { id: 'singleton' } });
  if (!fresh || !fresh.isActive) return { posted: false, error: false };

  const guildId =
    loungeChannel.guildId ??
    client.guilds.cache.get(process.env.PL_GUILD_ID ?? '')?.id;
  const threadUrl = `https://discord.com/channels/${guildId}/${threadId}`;
  const embed = createPromptEmbed(promptText, category, 'Discussion of the Day', threadUrl);

  try {
    await loungeChannel.send({ embeds: [embed] });
    await prisma.discussionPromptLog.update({
      where: { id: logId },
      data: { lastAnnouncedAt: new Date() },
    });
    return { posted: true, error: false };
  } catch (err) {
    console.error('Failed to post lounge announcement:', err);
    // Do not update lastAnnouncedAt — next tick will retry.
    return { posted: false, error: true };
  }
}

async function fetchTextChannel(client: Client, channelId: string): Promise<TextChannel | null> {
  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel || !(channel instanceof TextChannelClass)) return null;
    return channel;
  } catch (err) {
    console.error(`Failed to fetch channel ${channelId}:`, err);
    return null;
  }
}

async function isChannelQuiet(channel: TextChannel): Promise<boolean> {
  try {
    const messages: Collection<string, Message> = await channel.messages.fetch({ limit: 1 });
    if (messages.size === 0) return true;
    const last = messages.first()!;
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
