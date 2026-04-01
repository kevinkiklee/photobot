// Server Actions for dashboard mutations. Every action re-verifies the user's
// Discord admin status before executing — we don't trust the session alone
// because guild permissions can change between page loads.

'use server';

import { prisma } from '@photobot/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';
import { getAdminGuilds } from './discord';
import { revalidatePath } from 'next/cache';

export async function updateFeatureAction(
  serverId: string,
  featureKey: string,
  isEnabled: boolean
) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error('Unauthorized');

  const adminGuilds = await getAdminGuilds(session.accessToken as string);
  const hasAccess = adminGuilds.some(g => g.id === serverId);
  if (!hasAccess) throw new Error('Forbidden');

  const oldConfig = await prisma.featureConfig.findFirst({
    where: { serverId, featureKey },
  });

  const newConfig = await prisma.featureConfig.upsert({
    where: {
      serverId_targetType_targetId_featureKey: {
        serverId,
        targetType: 'SERVER',
        targetId: serverId,
        featureKey,
      },
    },
    update: { isEnabled },
    create: {
      serverId,
      targetType: 'SERVER',
      targetId: serverId,
      featureKey,
      isEnabled,
    },
  });

  await prisma.configAuditLog.create({
    data: {
      serverId,
      userId: (session.user as any)?.id || 'unknown',
      action: 'UPDATE',
      targetType: 'SERVER',
      targetId: serverId,
      featureKey,
      oldValue: { isEnabled: oldConfig?.isEnabled ?? true },
      newValue: { isEnabled },
    },
  });

  revalidatePath('/settings');
  revalidatePath('/audit');
  return newConfig;
}

export async function getDiscussionSchedules(serverId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error('Unauthorized');

  const adminGuilds = await getAdminGuilds(session.accessToken as string);
  if (!adminGuilds.some(g => g.id === serverId)) throw new Error('Forbidden');

  return prisma.discussionSchedule.findMany({
    where: { serverId },
    orderBy: { createdAt: 'asc' },
  });
}

export async function deleteDiscussionSchedule(scheduleId: string, serverId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error('Unauthorized');

  const adminGuilds = await getAdminGuilds(session.accessToken as string);
  if (!adminGuilds.some(g => g.id === serverId)) throw new Error('Forbidden');

  const schedule = await prisma.discussionSchedule.findUnique({ where: { id: scheduleId } });
  if (!schedule || schedule.serverId !== serverId) throw new Error('Not found');

  await prisma.discussionSchedule.delete({ where: { id: scheduleId } });

  await prisma.configAuditLog.create({
    data: {
      serverId,
      userId: (session.user as any)?.id || 'unknown',
      action: 'DELETE_SCHEDULE',
      targetType: 'CHANNEL',
      targetId: schedule.channelId,
      featureKey: 'discuss',
      oldValue: { days: schedule.days, timeUtc: schedule.timeUtc },
    },
  });

  revalidatePath('/settings');
  revalidatePath('/audit');
}

export async function toggleDiscussionSchedule(scheduleId: string, serverId: string, isActive: boolean) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error('Unauthorized');

  const adminGuilds = await getAdminGuilds(session.accessToken as string);
  if (!adminGuilds.some(g => g.id === serverId)) throw new Error('Forbidden');

  const schedule = await prisma.discussionSchedule.findUnique({ where: { id: scheduleId } });
  if (!schedule || schedule.serverId !== serverId) throw new Error('Not found');

  await prisma.discussionSchedule.update({
    where: { id: scheduleId },
    data: { isActive },
  });

  await prisma.configAuditLog.create({
    data: {
      serverId,
      userId: (session.user as any)?.id || 'unknown',
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
