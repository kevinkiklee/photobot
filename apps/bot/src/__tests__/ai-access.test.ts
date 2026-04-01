import { vi, describe, it, expect, beforeEach } from 'vitest';
import { canUseAI } from '../services/ai-access';

vi.mock('@photobot/db', () => ({
  prisma: {
    aIAccessGrant: {
      findFirst: vi.fn(),
    },
  },
}));

import { prisma } from '@photobot/db';

describe('canUseAI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns true when user has a direct USER grant', async () => {
    (prisma.aIAccessGrant.findFirst as any).mockResolvedValue({ id: 'grant-1' });

    const result = await canUseAI('guild-1', 'user-1', []);

    expect(result).toBe(true);
    expect(prisma.aIAccessGrant.findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        serverId: 'guild-1',
        OR: expect.arrayContaining([
          { grantType: 'USER', targetId: 'user-1' },
        ]),
      }),
    }));
  });

  it('returns true when user has a matching ROLE grant', async () => {
    (prisma.aIAccessGrant.findFirst as any).mockResolvedValue({ id: 'grant-2' });

    const result = await canUseAI('guild-1', 'user-2', ['role-mod', 'role-member']);

    expect(result).toBe(true);
    expect(prisma.aIAccessGrant.findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        OR: expect.arrayContaining([
          { grantType: 'ROLE', targetId: { in: ['role-mod', 'role-member'] } },
        ]),
      }),
    }));
  });

  it('returns false when no grants match', async () => {
    (prisma.aIAccessGrant.findFirst as any).mockResolvedValue(null);

    const result = await canUseAI('guild-1', 'user-3', ['role-everyone']);

    expect(result).toBe(false);
  });

  it('returns false with empty role list and no user grant', async () => {
    (prisma.aIAccessGrant.findFirst as any).mockResolvedValue(null);

    const result = await canUseAI('guild-1', 'user-4', []);

    expect(result).toBe(false);
  });
});
