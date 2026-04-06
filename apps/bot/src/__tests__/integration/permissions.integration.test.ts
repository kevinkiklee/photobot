import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { prisma } from '@photobot/db';
import { canUseFeature } from '../../middleware/permissions';

const TEST_PREFIX = `perm-test-${Date.now()}-`;

function tid(suffix: string) {
  return `${TEST_PREFIX}${suffix}`;
}

async function cleanup() {
  await prisma.featureConfig.deleteMany({
    where: { serverId: { startsWith: TEST_PREFIX } },
  });
}

describe('Permissions Integration', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterEach(async () => {
    await cleanup();
  });

  afterAll(async () => {
    await cleanup();
    await prisma.$disconnect();
  });

  it('channel config overrides role and server', async () => {
    const serverId = tid('srv-1');
    const channelId = tid('ch-1');
    const roleId = tid('role-1');

    await prisma.featureConfig.create({
      data: { serverId, targetType: 'SERVER', targetId: serverId, featureKey: 'discuss', isEnabled: true },
    });
    await prisma.featureConfig.create({
      data: { serverId, targetType: 'ROLE', targetId: roleId, featureKey: 'discuss', isEnabled: true },
    });
    await prisma.featureConfig.create({
      data: { serverId, targetType: 'CHANNEL', targetId: channelId, featureKey: 'discuss', isEnabled: false },
    });

    const result = await canUseFeature(serverId, channelId, [roleId], 'discuss');
    expect(result).toBe(false);
  });

  it('role allow-wins when no channel config', async () => {
    const serverId = tid('srv-2');
    const channelId = tid('ch-2');
    const role1 = tid('role-2a');
    const role2 = tid('role-2b');

    await prisma.featureConfig.create({
      data: { serverId, targetType: 'SERVER', targetId: serverId, featureKey: 'settings', isEnabled: false },
    });
    await prisma.featureConfig.create({
      data: { serverId, targetType: 'ROLE', targetId: role1, featureKey: 'settings', isEnabled: false },
    });
    await prisma.featureConfig.create({
      data: { serverId, targetType: 'ROLE', targetId: role2, featureKey: 'settings', isEnabled: true },
    });

    const result = await canUseFeature(serverId, channelId, [role1, role2], 'settings');
    expect(result).toBe(true);
  });

  it('defaults to true with no config', async () => {
    const serverId = tid('srv-3');
    const channelId = tid('ch-3');

    const result = await canUseFeature(serverId, channelId, [], 'nonexistent');
    expect(result).toBe(true);
  });
});
