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
