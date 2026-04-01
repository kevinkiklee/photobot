import { prisma } from '@photobot/db';

/**
 * Checks if a user has AI access in the given server.
 * Access is granted if:
 * - The user has an individual USER grant, OR
 * - Any of the user's roles has a ROLE grant
 *
 * Returns false if no grants match (allowlist model).
 */
export async function canUseAI(
  serverId: string,
  userId: string,
  roleIds: string[],
): Promise<boolean> {
  const grant = await prisma.aIAccessGrant.findFirst({
    where: {
      serverId,
      OR: [
        { grantType: 'USER', targetId: userId },
        { grantType: 'ROLE', targetId: { in: roleIds } },
      ],
    },
    select: { id: true },
  });

  return grant !== null;
}
