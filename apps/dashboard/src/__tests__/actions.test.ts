import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.stubEnv('PL_GUILD_ID', 'pl-guild-id');

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
  isPlAdmin: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

import { prisma } from '@photobot/db';
import { getServerSession } from 'next-auth/next';
import { isPlAdmin } from '../lib/discord';
import { revalidatePath } from 'next/cache';
import { updateFeatureAction } from '../lib/actions';

describe('updateFeatureAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws Unauthorized when session is null', async () => {
    (getServerSession as any).mockResolvedValue(null);
    await expect(updateFeatureAction('discuss', true)).rejects.toThrow('Unauthorized');
  });

  it('throws Unauthorized when session has no accessToken', async () => {
    (getServerSession as any).mockResolvedValue({ user: { name: 'Test' } });
    await expect(updateFeatureAction('discuss', true)).rejects.toThrow('Unauthorized');
  });

  it('throws Forbidden when user is not PL admin', async () => {
    (getServerSession as any).mockResolvedValue({ accessToken: 'tok' });
    (isPlAdmin as any).mockResolvedValue(false);
    await expect(updateFeatureAction('discuss', true)).rejects.toThrow('Forbidden');
  });

  it('creates new config when none exists', async () => {
    (getServerSession as any).mockResolvedValue({ accessToken: 'tok', user: { id: 'user-1' } });
    (isPlAdmin as any).mockResolvedValue(true);
    (prisma.featureConfig.findFirst as any).mockResolvedValue(null);
    (prisma.featureConfig.upsert as any).mockResolvedValue({ id: '1', isEnabled: true });
    (prisma.configAuditLog.create as any).mockResolvedValue({});

    await updateFeatureAction('discuss', true);

    expect(prisma.featureConfig.upsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { targetType_targetId_featureKey: {
        targetType: 'SERVER', targetId: 'pl-guild-id', featureKey: 'discuss',
      }},
      create: expect.objectContaining({ targetType: 'SERVER', targetId: 'pl-guild-id', featureKey: 'discuss', isEnabled: true }),
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
    (isPlAdmin as any).mockResolvedValue(true);
    (prisma.featureConfig.findFirst as any).mockResolvedValue({ isEnabled: true });
    (prisma.featureConfig.upsert as any).mockResolvedValue({ id: '1', isEnabled: false });
    (prisma.configAuditLog.create as any).mockResolvedValue({});

    await updateFeatureAction('discuss', false);

    expect(prisma.configAuditLog.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        oldValue: { isEnabled: true },
        newValue: { isEnabled: false },
      }),
    }));
  });

  it('revalidates settings and audit paths', async () => {
    (getServerSession as any).mockResolvedValue({ accessToken: 'tok', user: { id: 'user-1' } });
    (isPlAdmin as any).mockResolvedValue(true);
    (prisma.featureConfig.findFirst as any).mockResolvedValue(null);
    (prisma.featureConfig.upsert as any).mockResolvedValue({ id: '1', isEnabled: true });
    (prisma.configAuditLog.create as any).mockResolvedValue({});

    await updateFeatureAction('discuss', true);

    expect(revalidatePath).toHaveBeenCalledWith('/settings');
    expect(revalidatePath).toHaveBeenCalledWith('/audit');
  });
});
