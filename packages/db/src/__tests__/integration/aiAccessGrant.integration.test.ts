import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { prisma, connectDb, disconnectDb, cleanupTestData, testId } from './setup';

/**
 * Mirrors the canUseAI logic from apps/bot/src/services/ai-access.ts
 * inlined here to avoid cross-package imports that break tsc rootDir.
 */
async function canUseAI(serverId: string, userId: string, roleIds: string[]): Promise<boolean> {
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

describe('AIAccessGrant Integration', () => {
  beforeAll(async () => {
    await connectDb();
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
    await disconnectDb();
  });

  it('creates and reads back a ROLE grant', async () => {
    const serverId = testId('server-1');
    const grant = await prisma.aIAccessGrant.create({
      data: {
        serverId,
        grantType: 'ROLE',
        targetId: 'role-123',
        grantedBy: 'admin-user-1',
      },
    });

    expect(grant.id).toBeDefined();
    expect(grant.serverId).toBe(serverId);
    expect(grant.grantType).toBe('ROLE');
    expect(grant.targetId).toBe('role-123');
    expect(grant.grantedBy).toBe('admin-user-1');
    expect(grant.createdAt).toBeInstanceOf(Date);

    const found = await prisma.aIAccessGrant.findFirst({
      where: { serverId, grantType: 'ROLE', targetId: 'role-123' },
    });
    expect(found).not.toBeNull();
    expect(found!.id).toBe(grant.id);
  });

  it('creates and reads back a USER grant', async () => {
    const serverId = testId('server-2');
    const grant = await prisma.aIAccessGrant.create({
      data: {
        serverId,
        grantType: 'USER',
        targetId: 'user-456',
        grantedBy: 'admin-user-2',
      },
    });

    expect(grant.id).toBeDefined();
    expect(grant.serverId).toBe(serverId);
    expect(grant.grantType).toBe('USER');
    expect(grant.targetId).toBe('user-456');
    expect(grant.grantedBy).toBe('admin-user-2');
    expect(grant.createdAt).toBeInstanceOf(Date);

    const found = await prisma.aIAccessGrant.findFirst({
      where: { serverId, grantType: 'USER', targetId: 'user-456' },
    });
    expect(found).not.toBeNull();
    expect(found!.id).toBe(grant.id);
  });

  it('enforces unique constraint on (serverId, grantType, targetId)', async () => {
    const serverId = testId('server-3');
    await prisma.aIAccessGrant.create({
      data: {
        serverId,
        grantType: 'ROLE',
        targetId: 'role-dup',
        grantedBy: 'admin-user-3',
      },
    });

    await expect(
      prisma.aIAccessGrant.create({
        data: {
          serverId,
          grantType: 'ROLE',
          targetId: 'role-dup',
          grantedBy: 'admin-user-3-other',
        },
      })
    ).rejects.toThrow();
  });

  it('deletes a grant and verifies it is gone', async () => {
    const serverId = testId('server-4');
    const grant = await prisma.aIAccessGrant.create({
      data: {
        serverId,
        grantType: 'USER',
        targetId: 'user-to-delete',
        grantedBy: 'admin-user-4',
      },
    });

    await prisma.aIAccessGrant.delete({
      where: { id: grant.id },
    });

    const found = await prisma.aIAccessGrant.findUnique({
      where: { id: grant.id },
    });
    expect(found).toBeNull();
  });

  it('queries grants filtered by server', async () => {
    const serverA = testId('server-5a');
    const serverB = testId('server-5b');

    await prisma.aIAccessGrant.createMany({
      data: [
        { serverId: serverA, grantType: 'ROLE', targetId: 'role-a1', grantedBy: 'admin-5' },
        { serverId: serverA, grantType: 'USER', targetId: 'user-a1', grantedBy: 'admin-5' },
        { serverId: serverB, grantType: 'ROLE', targetId: 'role-b1', grantedBy: 'admin-5' },
      ],
    });

    const grantsA = await prisma.aIAccessGrant.findMany({
      where: { serverId: serverA },
    });
    expect(grantsA).toHaveLength(2);
    expect(grantsA.every((g) => g.serverId === serverA)).toBe(true);

    const grantsB = await prisma.aIAccessGrant.findMany({
      where: { serverId: serverB },
    });
    expect(grantsB).toHaveLength(1);
    expect(grantsB[0].targetId).toBe('role-b1');
  });

  it('canUseAI returns true for a user with a USER grant', async () => {
    const serverId = testId('server-6');
    await prisma.aIAccessGrant.create({
      data: {
        serverId,
        grantType: 'USER',
        targetId: 'user-granted',
        grantedBy: 'admin-6',
      },
    });

    const result = await canUseAI(serverId, 'user-granted', []);
    expect(result).toBe(true);
  });

  it('canUseAI returns true for a user with a matching ROLE grant', async () => {
    const serverId = testId('server-7');
    await prisma.aIAccessGrant.create({
      data: {
        serverId,
        grantType: 'ROLE',
        targetId: 'role-allowed',
        grantedBy: 'admin-7',
      },
    });

    const result = await canUseAI(serverId, 'some-user', ['role-allowed', 'role-other']);
    expect(result).toBe(true);
  });

  it('canUseAI returns false when no grants match', async () => {
    const serverId = testId('server-8');

    const result = await canUseAI(serverId, 'unknown-user', ['no-matching-role']);
    expect(result).toBe(false);
  });
});
