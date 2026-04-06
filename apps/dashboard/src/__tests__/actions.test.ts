import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@photobot/db', () => ({
  prisma: {
    featureConfig: {
      findFirst: vi.fn(),
      upsert: vi.fn(),
    },
    configAuditLog: {
      create: vi.fn(),
    },
  },
}));

vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('../lib/auth', () => ({
  authOptions: {},
}));

vi.mock('../lib/discord', () => ({
  getAdminGuilds: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

import { prisma } from '@photobot/db';
import { getServerSession } from 'next-auth/next';
import { getAdminGuilds } from '../lib/discord';
import { revalidatePath } from 'next/cache';
import { updateFeatureAction } from '../lib/actions';

describe('updateFeatureAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws Unauthorized when session is null', async () => {
    (getServerSession as any).mockResolvedValue(null);
    await expect(updateFeatureAction('server-1', 'discuss', true)).rejects.toThrow('Unauthorized');
  });

  it('throws Unauthorized when session has no accessToken', async () => {
    (getServerSession as any).mockResolvedValue({ user: { name: 'Test' } });
    await expect(updateFeatureAction('server-1', 'discuss', true)).rejects.toThrow('Unauthorized');
  });

  it('throws Forbidden when user is not admin of server', async () => {
    (getServerSession as any).mockResolvedValue({ accessToken: 'tok' });
    (getAdminGuilds as any).mockResolvedValue([{ id: 'other-server', name: 'Other', permissions: '8' }]);
    await expect(updateFeatureAction('server-1', 'discuss', true)).rejects.toThrow('Forbidden');
  });

  it('creates new config when none exists', async () => {
    (getServerSession as any).mockResolvedValue({ accessToken: 'tok', user: { id: 'user-1' } });
    (getAdminGuilds as any).mockResolvedValue([{ id: 'server-1', name: 'Test', permissions: '8' }]);
    (prisma.featureConfig.findFirst as any).mockResolvedValue(null);
    (prisma.featureConfig.upsert as any).mockResolvedValue({ id: '1', isEnabled: true });
    (prisma.configAuditLog.create as any).mockResolvedValue({});

    await updateFeatureAction('server-1', 'discuss', true);

    expect(prisma.featureConfig.upsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { serverId_targetType_targetId_featureKey: {
        serverId: 'server-1', targetType: 'SERVER', targetId: 'server-1', featureKey: 'discuss',
      }},
      create: expect.objectContaining({ serverId: 'server-1', featureKey: 'discuss', isEnabled: true }),
    }));
    expect(prisma.configAuditLog.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        oldValue: { isEnabled: true },
        newValue: { isEnabled: true },
      }),
    }));
  });

  it('updates existing config and records old value', async () => {
    (getServerSession as any).mockResolvedValue({ accessToken: 'tok', user: { id: 'user-1' } });
    (getAdminGuilds as any).mockResolvedValue([{ id: 'server-1', name: 'Test', permissions: '8' }]);
    (prisma.featureConfig.findFirst as any).mockResolvedValue({ isEnabled: true });
    (prisma.featureConfig.upsert as any).mockResolvedValue({ id: '1', isEnabled: false });
    (prisma.configAuditLog.create as any).mockResolvedValue({});

    await updateFeatureAction('server-1', 'discuss', false);

    expect(prisma.configAuditLog.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        oldValue: { isEnabled: true },
        newValue: { isEnabled: false },
      }),
    }));
  });

  it('revalidates settings and audit paths', async () => {
    (getServerSession as any).mockResolvedValue({ accessToken: 'tok', user: { id: 'user-1' } });
    (getAdminGuilds as any).mockResolvedValue([{ id: 'server-1', name: 'Test', permissions: '8' }]);
    (prisma.featureConfig.findFirst as any).mockResolvedValue(null);
    (prisma.featureConfig.upsert as any).mockResolvedValue({ id: '1', isEnabled: true });
    (prisma.configAuditLog.create as any).mockResolvedValue({});

    await updateFeatureAction('server-1', 'discuss', true);

    expect(revalidatePath).toHaveBeenCalledWith('/settings');
    expect(revalidatePath).toHaveBeenCalledWith('/audit');
  });
});
