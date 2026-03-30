import cron, { type ScheduledTask } from 'node-cron';
import { prisma } from '@photobot/db';
import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import { BRAND_COLOR } from '../constants';
import { selectPrompt } from './prompts';
import { canUseFeature } from '../middleware/permissions';

const activeJobs = new Map<string, ScheduledTask>();
let syncInterval: ReturnType<typeof setInterval> | null = null;
let clientRef: Client | null = null;

export function buildCronExpression(days: number[], timeUtc: string): string {
  const [h, m] = timeUtc.split(':').map(Number);
  return `${m} ${h} * * ${days.join(',')}`;
}

export async function startScheduler(client: Client): Promise<void> {
  clientRef = client;
  await loadAndRegisterJobs();

  // Sync every 5 minutes to pick up dashboard changes
  syncInterval = setInterval(async () => {
    try {
      await loadAndRegisterJobs();
    } catch (err) {
      console.error('Schedule sync error:', err);
    }
  }, 5 * 60 * 1000);

  // Check for missed prompts
  await recoverMissedPrompts();
}

export function stopScheduler(): void {
  for (const [id, job] of activeJobs) {
    job.stop();
    activeJobs.delete(id);
  }
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
}

async function loadAndRegisterJobs(): Promise<void> {
  const schedules = await prisma.discussionSchedule.findMany({
    where: { isActive: true },
  });

  const activeIds = new Set(schedules.map(s => s.id));

  // Remove jobs for deleted/deactivated schedules
  for (const [id, job] of activeJobs) {
    if (!activeIds.has(id)) {
      job.stop();
      activeJobs.delete(id);
    }
  }

  // Register new/updated schedules
  for (const schedule of schedules.filter(s => s.isActive)) {
    const cronExpr = buildCronExpression(schedule.days as number[], schedule.timeUtc);

    if (activeJobs.has(schedule.id)) {
      // Already registered — skip (schedule changes require stop+re-register)
      continue;
    }

    const job = cron.schedule(
      cronExpr,
      () => { executeScheduledPrompt(schedule.id).catch(err => console.error('Scheduled prompt error:', err)); },
      { timezone: 'UTC' },
    );

    activeJobs.set(schedule.id, job);
  }
}

async function executeScheduledPrompt(scheduleId: string): Promise<void> {
  if (!clientRef) return;

  const schedule = await prisma.discussionSchedule.findMany({
    where: { id: scheduleId, isActive: true },
  });
  if (schedule.length === 0) return;

  const s = schedule[0];

  // Check feature is still enabled
  const allowed = await canUseFeature(s.serverId, s.channelId, [], 'discuss');
  if (!allowed) return;

  const prompt = await selectPrompt(s.serverId, s.useAi, s.categoryFilter);

  try {
    const channel = await clientRef.channels.fetch(s.channelId);
    if (!channel || !(channel instanceof TextChannel)) return;

    const embed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle('Discussion of the Day')
      .setDescription(`${prompt.text}\n\n*Jump into the thread below to share your thoughts!*`)
      .setFooter({ text: `Photobot • ${prompt.category}` })
      .setTimestamp();

    const msg = await channel.send({ embeds: [embed] });

    // Create thread
    const threadName = `Discuss: ${prompt.text.slice(0, 90)}`;
    let threadId: string | null = null;
    try {
      const thread = await msg.startThread({ name: threadName });
      threadId = thread.id;
    } catch (err) {
      console.error('Failed to create thread for scheduled prompt:', err);
    }

    // Add reactions
    for (const emoji of prompt.reactions) {
      try { await msg.react(emoji); } catch {}
    }

    // Log
    await prisma.discussionPromptLog.create({
      data: {
        serverId: s.serverId,
        channelId: s.channelId,
        promptText: prompt.text,
        category: prompt.category,
        source: prompt.source,
        threadId,
      },
    });
  } catch (err) {
    console.error(`Failed to post scheduled prompt to ${s.channelId}:`, err);
  }
}

async function recoverMissedPrompts(): Promise<void> {
  if (!clientRef) return;

  const schedules = await prisma.discussionSchedule.findMany({
    where: { isActive: true },
  });

  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  for (const s of schedules) {
    const lastLog = await prisma.discussionPromptLog.findFirst({
      where: { serverId: s.serverId, channelId: s.channelId },
      orderBy: { postedAt: 'desc' },
    });

    // Find the most recent scheduled time
    const [hour, minute] = s.timeUtc.split(':').map(Number);
    const days = s.days as number[];

    // Check backwards from now to find the last scheduled slot
    let expectedTime: Date | null = null;
    for (let daysBack = 0; daysBack < 7; daysBack++) {
      const candidate = new Date(now);
      candidate.setDate(candidate.getDate() - daysBack);
      candidate.setUTCHours(hour, minute, 0, 0);

      if (candidate > now) continue;
      if (!days.includes(candidate.getUTCDay())) continue;

      expectedTime = candidate;
      break;
    }

    if (!expectedTime) continue;
    if (expectedTime < twentyFourHoursAgo) continue;

    // If no log exists or last log is before expected time, fire recovery
    if (!lastLog || lastLog.postedAt < expectedTime) {
      console.log(`Recovering missed prompt for ${s.serverId}/${s.channelId}`);
      await executeScheduledPrompt(s.id);
    }
  }
}
