import { prisma, TargetType } from '@photobot/db';

/**
 * Checks if a feature is enabled for a given context based on hierarchical permissions.
 * Hierarchy: Channel > Role > Server.
 * Conflict resolution: Allow wins for roles (if any role is enabled, feature is enabled).
 *
 * @param channelId Discord ID of the channel
 * @param roleIds List of Discord IDs for the user's roles
 * @param featureKey The key of the feature to check
 * @returns Promise<boolean> True if the feature is enabled, false otherwise
 */
export async function canUseFeature(channelId: string, roleIds: string[], featureKey: string): Promise<boolean> {
  // Fetch all relevant configs for this featureKey in a single query
  const configs = await prisma.featureConfig.findMany({
    where: {
      featureKey,
      OR: [
        { targetType: TargetType.CHANNEL, targetId: channelId },
        { targetType: TargetType.ROLE, targetId: { in: roleIds } },
        { targetType: TargetType.SERVER, targetId: process.env.PL_GUILD_ID ?? '' },
      ],
    },
  });

  // 1. Channel specificity (Highest priority)
  const channelConfig = configs.find((c) => c.targetType === TargetType.CHANNEL);
  if (channelConfig) {
    return channelConfig.isEnabled;
  }

  // 2. Role specificity (Allow wins)
  const roleConfigs = configs.filter((c) => c.targetType === TargetType.ROLE);
  if (roleConfigs.length > 0) {
    // If any role is explicitly allowed, the user is allowed
    return roleConfigs.some((c) => c.isEnabled);
  }

  // 3. Server specificity (Global default for PL)
  const serverConfig = configs.find((c) => c.targetType === TargetType.SERVER);
  if (serverConfig) {
    return serverConfig.isEnabled;
  }

  // 4. Global Default (If no config found at any level)
  return true;
}
