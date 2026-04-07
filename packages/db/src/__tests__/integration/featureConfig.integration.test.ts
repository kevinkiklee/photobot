import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanupTestData, connectDb, disconnectDb, prisma, testId } from './setup';

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
    const targetId = testId('target-1');
    const config = await prisma.featureConfig.create({
      data: {
        targetType: 'SERVER',
        targetId,
        featureKey: 'critique',
        isEnabled: true,
      },
    });

    expect(config.id).toBeDefined();
    expect(config.targetId).toBe(targetId);
    expect(config.isEnabled).toBe(true);
    expect(config.createdAt).toBeInstanceOf(Date);

    const found = await prisma.featureConfig.findFirst({
      where: { targetId, featureKey: 'critique' },
    });
    expect(found).not.toBeNull();
    expect(found!.id).toBe(config.id);
  });

  it('enforces unique constraint on composite key', async () => {
    const targetId = testId('target-2');
    await prisma.featureConfig.create({
      data: {
        targetType: 'SERVER',
        targetId,
        featureKey: 'critique',
        isEnabled: true,
      },
    });

    await expect(
      prisma.featureConfig.create({
        data: {
          targetType: 'SERVER',
          targetId,
          featureKey: 'critique',
          isEnabled: false,
        },
      }),
    ).rejects.toThrow();
  });

  it('upsert creates then updates', async () => {
    const targetId = testId('target-3');
    const where = {
      targetType_targetId_featureKey: {
        targetType: 'SERVER' as const,
        targetId,
        featureKey: 'palette',
      },
    };
    const base = { targetType: 'SERVER' as const, targetId, featureKey: 'palette' };

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
    const targetId = testId('target-4');
    const log = await prisma.configAuditLog.create({
      data: {
        userId: 'test-user',
        action: 'UPDATE',
        targetType: 'SERVER',
        targetId,
        featureKey: 'critique',
        oldValue: { isEnabled: false },
        newValue: { isEnabled: true },
      },
    });

    expect(log.id).toBeDefined();
    expect(log.oldValue).toEqual({ isEnabled: false });
    expect(log.newValue).toEqual({ isEnabled: true });

    const found = await prisma.configAuditLog.findFirst({
      where: { targetId },
    });
    expect(found).not.toBeNull();
  });
});
