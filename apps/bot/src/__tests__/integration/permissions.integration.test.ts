import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';

vi.stubEnv('PL_GUILD_ID', 'pl-integration-test');

import { prisma } from '@photobot/db';
import { canUseFeature } from '../../middleware/permissions';

const TEST_PREFIX = `perm-test-${Date.now()}-`;

function tid(suffix: string) {
  return `${TEST_PREFIX}${suffix}`;
}

async function cleanup() {
  await prisma.featureConfig.deleteMany({
    where: { targetId: { startsWith: TEST_PREFIX } },
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
    const channelId = tid('ch-1');
    const roleId = tid('role-1');

    await prisma.featureConfig.create({
      data: { targetType: 'SERVER', targetId: 'pl-integration-test', featureKey: tid('discuss'), isEnabled: true },
    });
    await prisma.featureConfig.create({
      data: { targetType: 'ROLE', targetId: roleId, featureKey: tid('discuss'), isEnabled: true },
    });
    await prisma.featureConfig.create({
      data: { targetType: 'CHANNEL', targetId: channelId, featureKey: tid('discuss'), isEnabled: false },
    });

    const result = await canUseFeature(channelId, [roleId], tid('discuss'));
    expect(result).toBe(false);
  });

  it('role allow-wins when no channel config', async () => {
    const channelId = tid('ch-2');
    const role1 = tid('role-2a');
    const role2 = tid('role-2b');

    await prisma.featureConfig.create({
      data: { targetType: 'SERVER', targetId: 'pl-integration-test', featureKey: tid('settings'), isEnabled: false },
    });
    await prisma.featureConfig.create({
      data: { targetType: 'ROLE', targetId: role1, featureKey: tid('settings'), isEnabled: false },
    });
    await prisma.featureConfig.create({
      data: { targetType: 'ROLE', targetId: role2, featureKey: tid('settings'), isEnabled: true },
    });

    const result = await canUseFeature(channelId, [role1, role2], tid('settings'));
    expect(result).toBe(true);
  });

  it('defaults to true with no config', async () => {
    const channelId = tid('ch-3');

    const result = await canUseFeature(channelId, [], 'nonexistent');
    expect(result).toBe(true);
  });
});
