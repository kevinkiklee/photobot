import { vi, describe, it, expect, beforeEach } from 'vitest';
import { canUseFeature } from '../middleware/permissions';
import { prisma } from '@photobot/db';

vi.mock('@photobot/db', () => ({
  prisma: {
    featureConfig: {
      findMany: vi.fn(),
    },
  },
  TargetType: {
    SERVER: 'SERVER',
    ROLE: 'ROLE',
    CHANNEL: 'CHANNEL',
  },
}));

describe('Permission Middleware', () => {
  const serverId = 'server-1';
  const channelId = 'channel-1';
  const roleIds = ['role-1', 'role-2'];
  const featureKey = 'discuss';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('allows access if channel config is enabled', async () => {
    (prisma.featureConfig.findMany as any).mockResolvedValue([
      { targetType: 'CHANNEL', targetId: channelId, isEnabled: true },
      { targetType: 'ROLE', targetId: 'role-1', isEnabled: false },
      { targetType: 'SERVER', targetId: serverId, isEnabled: false },
    ]);

    const result = await canUseFeature(serverId, channelId, roleIds, featureKey);
    expect(result).toBe(true);
  });

  it('denies access if channel config is disabled (even if roles/server are enabled)', async () => {
    (prisma.featureConfig.findMany as any).mockResolvedValue([
      { targetType: 'CHANNEL', targetId: channelId, isEnabled: false },
      { targetType: 'ROLE', targetId: 'role-1', isEnabled: true },
      { targetType: 'SERVER', targetId: serverId, isEnabled: true },
    ]);

    const result = await canUseFeature(serverId, channelId, roleIds, featureKey);
    expect(result).toBe(false);
  });

  it('allows access if any role is enabled and no channel config exists', async () => {
    (prisma.featureConfig.findMany as any).mockResolvedValue([
      { targetType: 'ROLE', targetId: 'role-1', isEnabled: true },
      { targetType: 'ROLE', targetId: 'role-2', isEnabled: false },
      { targetType: 'SERVER', targetId: serverId, isEnabled: false },
    ]);

    const result = await canUseFeature(serverId, channelId, roleIds, featureKey);
    expect(result).toBe(true);
  });

  it('denies access if all roles are disabled and no channel config exists', async () => {
    (prisma.featureConfig.findMany as any).mockResolvedValue([
      { targetType: 'ROLE', targetId: 'role-1', isEnabled: false },
      { targetType: 'ROLE', targetId: 'role-2', isEnabled: false },
      { targetType: 'SERVER', targetId: serverId, isEnabled: true },
    ]);

    const result = await canUseFeature(serverId, channelId, roleIds, featureKey);
    expect(result).toBe(false);
  });

  it('allows access if server config is enabled and no channel or role configs exist', async () => {
    (prisma.featureConfig.findMany as any).mockResolvedValue([
      { targetType: 'SERVER', targetId: serverId, isEnabled: true },
    ]);

    const result = await canUseFeature(serverId, channelId, roleIds, featureKey);
    expect(result).toBe(true);
  });

  it('denies access if server config is disabled and no channel or role configs exist', async () => {
    (prisma.featureConfig.findMany as any).mockResolvedValue([
      { targetType: 'SERVER', targetId: serverId, isEnabled: false },
    ]);

    const result = await canUseFeature(serverId, channelId, roleIds, featureKey);
    expect(result).toBe(false);
  });

  it('defaults to true if no config is found at all', async () => {
    (prisma.featureConfig.findMany as any).mockResolvedValue([]);

    const result = await canUseFeature(serverId, channelId, roleIds, featureKey);
    expect(result).toBe(true);
  });

  it('handles empty role list with no channel config', async () => {
    (prisma.featureConfig.findMany as any).mockResolvedValue([
      { targetType: 'SERVER', targetId: serverId, isEnabled: false },
    ]);

    const result = await canUseFeature(serverId, channelId, [], featureKey);
    expect(result).toBe(false);
  });

  it('falls through to server config when roles list is empty', async () => {
    (prisma.featureConfig.findMany as any).mockResolvedValue([
      { targetType: 'SERVER', targetId: serverId, isEnabled: true },
    ]);

    const result = await canUseFeature(serverId, channelId, [], featureKey);
    expect(result).toBe(true);
  });

  it('queries with the correct filter parameters', async () => {
    (prisma.featureConfig.findMany as any).mockResolvedValue([]);

    await canUseFeature(serverId, channelId, roleIds, featureKey);

    expect(prisma.featureConfig.findMany).toHaveBeenCalledWith({
      where: {
        serverId,
        featureKey,
        OR: [
          { targetType: 'CHANNEL', targetId: channelId },
          { targetType: 'ROLE', targetId: { in: roleIds } },
          { targetType: 'SERVER', targetId: serverId },
        ],
      },
    });
  });
});
