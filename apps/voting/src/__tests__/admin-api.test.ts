import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@photobot/db', () => ({
  prisma: {
    promptVote: {
      findMany: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
    },
    prompt: {
      count: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(),
}));

import { prisma } from '@photobot/db';
import { getServerSession } from 'next-auth/next';
import { GET } from '@/app/api/admin/voters/route';
import { NextRequest } from 'next/server';
import { getAdminStats, getVotersForPrompt } from '@/lib/admin';

describe('GET /api/admin/voters', () => {
  const adminSession = {
    discordUserId: 'admin-voter-user',
    discordUsername: 'AdminUser',
    isAdmin: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (getServerSession as any).mockResolvedValue(adminSession);
  });

  it('returns 403 when not admin', async () => {
    (getServerSession as any).mockResolvedValue({
      discordUserId: 'regular-user',
      isAdmin: false,
    });

    const req = new NextRequest('http://localhost/api/admin/voters?promptId=p1');
    const res = await GET(req);
    expect(res.status).toBe(403);
  });

  it('returns 403 when not authenticated', async () => {
    (getServerSession as any).mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/admin/voters?promptId=p1');
    const res = await GET(req);
    expect(res.status).toBe(403);
  });

  it('returns 400 when promptId is missing', async () => {
    const req = new NextRequest('http://localhost/api/admin/voters');
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 when promptId is too long', async () => {
    const longId = 'a'.repeat(51);
    const req = new NextRequest(`http://localhost/api/admin/voters?promptId=${longId}`);
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it('returns voters for a valid prompt', async () => {
    const voters = [
      { discordUsername: 'User1', vote: 'UP', createdAt: new Date('2026-01-01') },
      { discordUsername: 'User2', vote: 'DOWN', createdAt: new Date('2026-01-02') },
    ];
    (prisma.promptVote.findMany as any).mockResolvedValue(voters);

    const req = new NextRequest('http://localhost/api/admin/voters?promptId=p1');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.voters).toHaveLength(2);
    expect(data.voters[0].discordUsername).toBe('User1');
  });
});

describe('getAdminStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calculates stats correctly', async () => {
    (prisma.promptVote.count as any).mockResolvedValue(50);
    (prisma.promptVote.groupBy as any)
      .mockResolvedValueOnce([{ discordUserId: 'u1' }, { discordUserId: 'u2' }, { discordUserId: 'u3' }])
      .mockResolvedValueOnce([{ promptId: 'p1' }, { promptId: 'p2' }]);
    (prisma.prompt.count as any).mockResolvedValue(10);

    const stats = await getAdminStats();
    expect(stats.totalVotes).toBe(50);
    expect(stats.uniqueVoters).toBe(3);
    expect(stats.promptsWithZeroVotes).toBe(8);
  });

  it('handles zero state', async () => {
    (prisma.promptVote.count as any).mockResolvedValue(0);
    (prisma.promptVote.groupBy as any)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);
    (prisma.prompt.count as any).mockResolvedValue(5);

    const stats = await getAdminStats();
    expect(stats.totalVotes).toBe(0);
    expect(stats.uniqueVoters).toBe(0);
    expect(stats.promptsWithZeroVotes).toBe(5);
  });
});

describe('getVotersForPrompt', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns voters ordered by createdAt desc', async () => {
    const mockVoters = [
      { discordUsername: 'Latest', vote: 'UP', createdAt: new Date('2026-02-01') },
      { discordUsername: 'Earlier', vote: 'DOWN', createdAt: new Date('2026-01-01') },
    ];
    (prisma.promptVote.findMany as any).mockResolvedValue(mockVoters);

    const result = await getVotersForPrompt('p1');
    expect(result).toHaveLength(2);
    expect(result[0].discordUsername).toBe('Latest');
    expect(prisma.promptVote.findMany).toHaveBeenCalledWith({
      where: { promptId: 'p1' },
      orderBy: { createdAt: 'desc' },
      select: { discordUsername: true, vote: true, createdAt: true },
    });
  });

  it('returns empty array when no votes exist', async () => {
    (prisma.promptVote.findMany as any).mockResolvedValue([]);

    const result = await getVotersForPrompt('p1');
    expect(result).toEqual([]);
  });
});
