// Server Actions for dashboard mutations. Every action re-verifies the user's
// Discord admin status before executing — we don't trust the session alone
// because guild permissions can change between page loads.

'use server';

import { prisma } from '@photobot/db';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';
import { isPlAdmin } from './discord';

async function requirePlAdmin(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error('Unauthorized');
  const authorized = await isPlAdmin(session.accessToken as string);
  if (!authorized) throw new Error('Forbidden');
  return session?.user?.id || 'unknown';
}

export async function updateFeatureAction(featureKey: string, isEnabled: boolean) {
  const userId = await requirePlAdmin();

  const oldConfig = await prisma.featureConfig.findFirst({
    where: { featureKey, targetType: 'SERVER' },
  });

  const newConfig = await prisma.featureConfig.upsert({
    where: {
      targetType_targetId_featureKey: {
        targetType: 'SERVER',
        targetId: process.env.PL_GUILD_ID!,
        featureKey,
      },
    },
    update: { isEnabled },
    create: {
      targetType: 'SERVER',
      targetId: process.env.PL_GUILD_ID!,
      featureKey,
      isEnabled,
    },
  });

  await prisma.configAuditLog.create({
    data: {
      userId,
      action: 'UPDATE',
      targetType: 'SERVER',
      targetId: process.env.PL_GUILD_ID!,
      featureKey,
      oldValue: { isEnabled: oldConfig?.isEnabled ?? true },
      newValue: { isEnabled },
    },
  });

  revalidatePath('/settings');
  revalidatePath('/audit');
  return newConfig;
}

export async function getDiscussionSchedules() {
  await requirePlAdmin();

  return prisma.discussionSchedule.findMany({
    orderBy: { createdAt: 'asc' },
  });
}

export async function deleteDiscussionSchedule(scheduleId: string) {
  const userId = await requirePlAdmin();

  const schedule = await prisma.discussionSchedule.findUnique({ where: { id: scheduleId } });
  if (!schedule) throw new Error('Not found');

  await prisma.discussionSchedule.delete({ where: { id: scheduleId } });

  await prisma.configAuditLog.create({
    data: {
      userId,
      action: 'DELETE_SCHEDULE',
      targetType: 'CHANNEL',
      targetId: schedule.channelId,
      featureKey: 'discuss',
      oldValue: { channelId: schedule.channelId },
    },
  });

  revalidatePath('/settings');
  revalidatePath('/audit');
}

export async function toggleDiscussionSchedule(scheduleId: string, isActive: boolean) {
  const userId = await requirePlAdmin();

  const schedule = await prisma.discussionSchedule.findUnique({ where: { id: scheduleId } });
  if (!schedule) throw new Error('Not found');

  await prisma.discussionSchedule.update({
    where: { id: scheduleId },
    data: { isActive },
  });

  await prisma.configAuditLog.create({
    data: {
      userId,
      action: isActive ? 'ENABLE_SCHEDULE' : 'DISABLE_SCHEDULE',
      targetType: 'CHANNEL',
      targetId: schedule.channelId,
      featureKey: 'discuss',
      newValue: { isActive },
    },
  });

  revalidatePath('/settings');
  revalidatePath('/audit');
}
