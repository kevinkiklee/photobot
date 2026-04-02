import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@photobot/db', () => ({
  prisma: {
    promptDuplicateFlag: {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
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
import { POST } from '@/app/api/flag/route';
import { NextRequest } from 'next/server';

function makeRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost/api/flag', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

describe('POST /api/flag', () => {
  const session = {
    discordUserId: 'flag-user',
    discordUsername: 'FlagUser',
    isAdmin: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (getServerSession as any).mockResolvedValue(session);
  });

  it('returns 401 when not authenticated', async () => {
    (getServerSession as any).mockResolvedValue(null);

    const res = await POST(makeRequest({ promptId: 'p1' }));
    expect(res.status).toBe(401);
  });

  it('returns 400 when promptId is missing', async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
  });

  it('returns 400 when promptId is too long', async () => {
    const res = await POST(makeRequest({ promptId: 'a'.repeat(51) }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when promptId is not a string', async () => {
    const res = await POST(makeRequest({ promptId: 123 }));
    expect(res.status).toBe(400);
  });

  it('creates a flag when none exists', async () => {
    (prisma.promptDuplicateFlag.findUnique as any).mockResolvedValue(null);
    (prisma.promptDuplicateFlag.create as any).mockResolvedValue({ id: 'f1' });
    (prisma.promptDuplicateFlag.count as any).mockResolvedValue(1);

    const res = await POST(makeRequest({ promptId: 'p1' }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.flagged).toBe(true);
    expect(data.duplicateCount).toBe(1);

    expect(prisma.promptDuplicateFlag.create).toHaveBeenCalledWith({
      data: { promptId: 'p1', discordUserId: 'flag-user' },
    });
  });

  it('removes a flag when one already exists (toggle off)', async () => {
    (prisma.promptDuplicateFlag.findUnique as any).mockResolvedValue({ id: 'f1' });
    (prisma.promptDuplicateFlag.delete as any).mockResolvedValue({});
    (prisma.promptDuplicateFlag.count as any).mockResolvedValue(0);

    const res = await POST(makeRequest({ promptId: 'p1' }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.flagged).toBe(false);
    expect(data.duplicateCount).toBe(0);

    expect(prisma.promptDuplicateFlag.delete).toHaveBeenCalledWith({
      where: { id: 'f1' },
    });
  });
});
