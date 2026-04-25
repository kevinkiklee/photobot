// Single anchored slot scheduler. Four UTC slots per day:
//   08:00 — daily prompt + thread + first lounge announcement
//   14:00 / 20:00 / 02:00 — re-announce in lounge only
//
// On each 60s tick, computes the most recent slot and decides what to do.
// Two-phase catch-up handles bot restarts: fire today's daily if missed,
// then re-announce if the current slot's announcement hasn't happened yet.

import { prisma } from '@photobot/db';
import type { Client, TextChannel } from 'discord.js';
import { TextChannel as TextChannelClass } from 'discord.js';
import {
  releaseCycleLock,
  runDailyCycle,
  runLoungeAnnounce,
  tryAcquireCycleLock,
} from './discussion-cycle';

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

export function todaysDailySlotStart(slotStart: Date): Date {
  const utcDateMs = Date.UTC(
    slotStart.getUTCFullYear(),
    slotStart.getUTCMonth(),
    slotStart.getUTCDate(),
  );
  return new Date(utcDateMs + DAILY_SLOT_HOUR_UTC * 60 * 60 * 1000);
}

export async function startScheduler(client: Client): Promise<void> {
  if (tickInterval) {
    console.warn('Scheduler already running');
    return;
  }
  clientRef = client;

  await onTick();
  tickInterval = setInterval(() => {
    onTick().catch((err) => console.error('Scheduler tick error:', err));
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
    if (!config || !config.isActive) return;

    const now = new Date();
    const slotStart = currentSlotStart(now);

    if (now.getTime() - slotStart.getTime() > CATCHUP_HORIZON_MS) return;

    await runSlot(clientRef, config, slotStart);
  } catch (err) {
    console.error('Scheduler tick error:', err);
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
  const dailyAnchor = todaysDailySlotStart(slotStart);

  // Phase 1: daily catch-up.
  const dailyFired = await prisma.discussionPromptLog.findFirst({
    where: { threadId: { not: null }, postedAt: { gte: dailyAnchor } },
  });

  if (!dailyFired) {
    if (Date.now() - dailyAnchor.getTime() > CATCHUP_HORIZON_MS) return;
    await runDailyCycle(client, config);
    // The cycle also fired the lounge announcement; Phase 2 will skip.
  }

  if (isDailySlot) return;

  // Phase 2: re-announce.
  const current = await prisma.discussionPromptLog.findFirst({
    where: {
      threadId: { not: null },
      postedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
    orderBy: { postedAt: 'desc' },
  });
  if (!current || !current.threadId) return;
  if (current.lastAnnouncedAt && current.lastAnnouncedAt >= slotStart) return;

  const loungeChannel = await fetchTextChannel(client, config.loungeChannelId);
  if (!loungeChannel) return;

  // Acquire the cycle lock so Phase 2 cannot race with /discuss post-daily.
  if (!tryAcquireCycleLock()) return;
  try {
    await runLoungeAnnounce(
      client,
      current.id,
      current.promptText,
      current.category,
      current.threadId,
      loungeChannel,
    );
  } finally {
    releaseCycleLock();
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
