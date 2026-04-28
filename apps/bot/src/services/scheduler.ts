// Single anchored slot scheduler. Four UTC slots per day:
//   08:00 — daily prompt + thread + cross-post (origin = #photo-lounge)
//   14:00 / 20:00 / 02:00 — slim "bump" replies in #photo-lounge that
//                            Discord-reply to the original prompt message.
//
// On each 60s tick, computes the most recent slot and decides what to do.
// Two-phase catch-up handles bot restarts: fire today's daily if missed,
// then post a bump if the current slot's bump hasn't happened yet.

import { prisma } from '@photobot/db';
import type { Client, TextChannel } from 'discord.js';
import { TextChannel as TextChannelClass } from 'discord.js';
import { postBumpInLounge, releaseCycleLock, runDailyCycle, tryAcquireCycleLock } from './discussion-cycle';

const SLOT_HOURS_UTC = [2, 8, 14, 20] as const;
const DAILY_SLOT_HOUR_UTC = 8;
const TICK_INTERVAL_MS = 60 * 1000;
const CATCHUP_HORIZON_MS = 6 * 60 * 60 * 1000;

let tickInterval: ReturnType<typeof setInterval> | null = null;
let clientRef: Client | null = null;
let isTickRunning = false;

export function currentSlotStart(now: Date): Date {
  const utcDateMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const hour = now.getUTCHours();
  const slotHour = [...SLOT_HOURS_UTC].reverse().find((h) => h <= hour);
  if (slotHour !== undefined) {
    return new Date(utcDateMs + slotHour * 60 * 60 * 1000);
  }
  return new Date(utcDateMs - 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000);
}

// The 08:00 UTC anchor of the daily cycle this slot belongs to. For slots at or
// after 08:00 UTC, that's the same calendar day's 08:00. For the pre-daily
// 02:00 UTC slot (a bump of yesterday's daily), it's the PREVIOUS day's 08:00.
// Anchoring 02:00 to today's (future) 08:00 used to make `dailyFired` queries
// always return null, causing the scheduler to re-post the daily every minute.
export function dailyAnchorForSlot(slotStart: Date): Date {
  const utcDateMs = Date.UTC(slotStart.getUTCFullYear(), slotStart.getUTCMonth(), slotStart.getUTCDate());
  const dayOffsetMs = slotStart.getUTCHours() < DAILY_SLOT_HOUR_UTC ? -24 * 60 * 60 * 1000 : 0;
  return new Date(utcDateMs + dayOffsetMs + DAILY_SLOT_HOUR_UTC * 60 * 60 * 1000);
}

export async function startScheduler(client: Client): Promise<void> {
  if (tickInterval) {
    return;
  }
  clientRef = client;

  await onTick();
  tickInterval = setInterval(() => {
    onTick().catch((_err) => {});
  }, TICK_INTERVAL_MS);
}

export function stopScheduler(): void {
  if (tickInterval) {
    clearInterval(tickInterval);
    tickInterval = null;
  }
  isTickRunning = false;
  clientRef = null;
}

async function onTick(): Promise<void> {
  if (isTickRunning) return;
  if (!clientRef) return;
  isTickRunning = true;

  try {
    const config = await prisma.discussionConfig.findUnique({ where: { id: 'singleton' } });
    if (!config?.isActive) return;

    const now = new Date();
    const slotStart = currentSlotStart(now);

    if (now.getTime() - slotStart.getTime() > CATCHUP_HORIZON_MS) return;

    await runSlot(clientRef, config, slotStart);
  } catch (_err) {
  } finally {
    isTickRunning = false;
  }
}

async function runSlot(
  client: Client,
  config: Awaited<ReturnType<typeof prisma.discussionConfig.findUnique>>,
  slotStart: Date,
): Promise<void> {
  if (!config) return;

  const isDailySlot = slotStart.getUTCHours() === DAILY_SLOT_HOUR_UTC;
  const dailyAnchor = dailyAnchorForSlot(slotStart);

  // Phase 1: daily catch-up.
  const dailyFired = await prisma.discussionPromptLog.findFirst({
    where: { threadId: { not: null }, postedAt: { gte: dailyAnchor } },
  });

  if (!dailyFired) {
    if (Date.now() - dailyAnchor.getTime() > CATCHUP_HORIZON_MS) return;
    await runDailyCycle(client, config);
    // The daily cycle posts the prompt in lounge directly, so it counts as
    // this slot's announcement. Phase 2 will skip via lastAnnouncedAt.
    return;
  }

  if (isDailySlot) return;

  // Phase 2: bump.
  const current = await prisma.discussionPromptLog.findFirst({
    where: {
      threadId: { not: null },
      postedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
    orderBy: { postedAt: 'desc' },
  });
  if (!current?.threadId || !current.loungePromptMessageId) return;
  if (current.lastAnnouncedAt && current.lastAnnouncedAt >= slotStart) return;

  const loungeChannel = await fetchTextChannel(client, config.loungeChannelId);
  if (!loungeChannel) return;

  // Acquire the cycle lock so the bump cannot race with a manual
  // /discuss post-daily call.
  if (!tryAcquireCycleLock()) return;
  try {
    const guildId = loungeChannel.guildId ?? client.guilds.cache.get(process.env.PL_GUILD_ID ?? '')?.id;
    const threadUrl = `https://discord.com/channels/${guildId}/${current.threadId}`;
    await postBumpInLounge(current.id, current.loungePromptMessageId, threadUrl, loungeChannel);
  } finally {
    releaseCycleLock();
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
