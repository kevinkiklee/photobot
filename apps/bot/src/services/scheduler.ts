// The scheduler posts discussion prompts on a fixed interval per channel.
// Instead of rigid cron times, it checks every 60s whether any channel is
// due (6+ hours since last post). Before posting, it waits for a conversation
// lull (2 min of silence) so prompts don't interrupt active discussions.
// If the channel stays busy for 30 min, it posts anyway to avoid skipping.

import { prisma } from '@photobot/db';
import { Client, EmbedBuilder, TextChannel, Collection, Message } from 'discord.js';
import { BRAND_COLOR } from '../constants';
import { selectPrompt } from './prompts';
import { canUseFeature } from '../middleware/permissions';

const POST_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours
const QUIET_THRESHOLD_MS = 2 * 60 * 1000; // 2 minutes of silence = safe to post
const MAX_DEFER_MS = 30 * 60 * 1000; // give up waiting after 30 minutes
const DEFER_CHECK_MS = 60 * 1000; // re-check every 60 seconds while waiting

let postInterval: ReturnType<typeof setInterval> | null = null;
let clientRef: Client | null = null;

export async function startScheduler(client: Client): Promise<void> {
  clientRef = client;

  // Run immediately on startup for any overdue schedules
  await runScheduledPosts();

  // Check every 60 seconds for schedules that are due
  postInterval = setInterval(async () => {
    try {
      await runScheduledPosts();
    } catch (err) {
      console.error('Schedule check error:', err);
    }
  }, DEFER_CHECK_MS);
}

export function stopScheduler(): void {
  if (postInterval) {
    clearInterval(postInterval);
    postInterval = null;
  }
}

async function runScheduledPosts(): Promise<void> {
  const schedules = await prisma.discussionSchedule.findMany({
    where: { isActive: true },
  });

  const now = new Date();

  for (const s of schedules) {
    const lastLog = await prisma.discussionPromptLog.findFirst({
      where: { serverId: s.serverId, channelId: s.channelId },
      orderBy: { postedAt: 'desc' },
    });

    // Infinity for first-ever post ensures new schedules fire immediately
    const timeSinceLastPost = lastLog ? now.getTime() - lastLog.postedAt.getTime() : Infinity;
    if (timeSinceLastPost < POST_INTERVAL_MS) continue;

    await executeScheduledPrompt(s.id);
  }
}

async function isChannelQuiet(channel: TextChannel): Promise<boolean> {
  try {
    const messages: Collection<string, Message> = await channel.messages.fetch({ limit: 1 });
    if (messages.size === 0) return true;

    const lastMessage = messages.first()!;
    const timeSinceLastMessage = Date.now() - lastMessage.createdTimestamp;
    return timeSinceLastMessage >= QUIET_THRESHOLD_MS;
  } catch {
    // If we can't fetch messages, assume quiet and post anyway
    return true;
  }
}

async function waitForQuiet(channel: TextChannel): Promise<boolean> {
  const deadline = Date.now() + MAX_DEFER_MS;

  while (Date.now() < deadline) {
    if (await isChannelQuiet(channel)) return true;

    // Wait before checking again
    await new Promise(resolve => setTimeout(resolve, DEFER_CHECK_MS));
  }

  // Timed out waiting — post anyway rather than skipping entirely
  return true;
}

async function executeScheduledPrompt(scheduleId: string): Promise<void> {
  if (!clientRef) return;

  const schedule = await prisma.discussionSchedule.findMany({
    where: { id: scheduleId, isActive: true },
  });
  if (schedule.length === 0) return;

  const s = schedule[0];

  // Re-check permission at execution time — admins may have disabled the feature
  // via the dashboard since the schedule was created.
  const allowed = await canUseFeature(s.serverId, s.channelId, [], 'discuss');
  if (!allowed) return;

  try {
    const channel = await clientRef.channels.fetch(s.channelId);
    if (!channel || !(channel instanceof TextChannel)) return;

    // Wait for a natural pause in conversation before posting
    await waitForQuiet(channel);

    const prompt = await selectPrompt(s.serverId, s.useAi, s.categoryFilter);

    const embed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle('Discussion of the Day')
      .setDescription(prompt.text)
      .setFooter({ text: `Photobot • ${prompt.category}` })
      .setTimestamp();

    await channel.send({ embeds: [embed] });

    // Log
    await prisma.discussionPromptLog.create({
      data: {
        serverId: s.serverId,
        channelId: s.channelId,
        promptText: prompt.text,
        category: prompt.category,
        source: prompt.source,
      },
    });
  } catch (err) {
    console.error(`Failed to post scheduled prompt to ${s.channelId}:`, err);
  }
}
