import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { prisma, connectDb, disconnectDb, cleanupTestData, testId } from './setup';

describe('FeatureConfig Integration', () => {
  beforeAll(async () => {
    await connectDb();
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
    await disconnectDb();
  });

  it('creates and reads a FeatureConfig', async () => {
    const serverId = testId('server-1');
    const config = await prisma.featureConfig.create({
      data: {
        serverId,
        targetType: 'SERVER',
        targetId: serverId,
        featureKey: 'critique',
        isEnabled: true,
      },
    });

    expect(config.id).toBeDefined();
    expect(config.serverId).toBe(serverId);
    expect(config.isEnabled).toBe(true);
    expect(config.createdAt).toBeInstanceOf(Date);

    const found = await prisma.featureConfig.findFirst({
      where: { serverId, featureKey: 'critique' },
    });
    expect(found).not.toBeNull();
    expect(found!.id).toBe(config.id);
  });

  it('enforces unique constraint on composite key', async () => {
    const serverId = testId('server-2');
    await prisma.featureConfig.create({
      data: {
        serverId,
        targetType: 'SERVER',
        targetId: serverId,
        featureKey: 'critique',
        isEnabled: true,
      },
    });

    await expect(
      prisma.featureConfig.create({
        data: {
          serverId,
          targetType: 'SERVER',
          targetId: serverId,
          featureKey: 'critique',
          isEnabled: false,
        },
      })
    ).rejects.toThrow();
  });

  it('upsert creates then updates', async () => {
    const serverId = testId('server-3');
    const where = {
      serverId_targetType_targetId_featureKey: {
        serverId,
        targetType: 'SERVER' as const,
        targetId: serverId,
        featureKey: 'palette',
      },
    };
    const base = { serverId, targetType: 'SERVER' as const, targetId: serverId, featureKey: 'palette' };

    const created = await prisma.featureConfig.upsert({
      where,
      create: { ...base, isEnabled: true },
      update: { isEnabled: true },
    });
    expect(created.isEnabled).toBe(true);

    const updated = await prisma.featureConfig.upsert({
      where,
      create: { ...base, isEnabled: false },
      update: { isEnabled: false },
    });
    expect(updated.id).toBe(created.id);
    expect(updated.isEnabled).toBe(false);
  });

  it('creates an audit log entry with JSON values', async () => {
    const serverId = testId('server-4');
    const log = await prisma.configAuditLog.create({
      data: {
        serverId,
        userId: 'test-user',
        action: 'UPDATE',
        targetType: 'SERVER',
        targetId: serverId,
        featureKey: 'critique',
        oldValue: { isEnabled: false },
        newValue: { isEnabled: true },
      },
    });

    expect(log.id).toBeDefined();
    expect(log.oldValue).toEqual({ isEnabled: false });
    expect(log.newValue).toEqual({ isEnabled: true });

    const found = await prisma.configAuditLog.findFirst({
      where: { serverId },
    });
    expect(found).not.toBeNull();
  });
});
