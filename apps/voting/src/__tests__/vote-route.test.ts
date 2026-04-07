import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/session', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/lib/vote', () => ({
  handleVote: vi.fn(),
}));

import { NextRequest } from 'next/server';
import { POST } from '@/app/api/vote/route';
import { getSession } from '@/lib/session';
import { handleVote } from '@/lib/vote';

function makeRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost/api/vote', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

describe('POST /api/vote', () => {
  const session = {
    discordUserId: 'vote-route-user',
    discordUsername: 'VoteUser',
    isAdmin: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (getSession as any).mockResolvedValue(session);
  });

  it('returns 401 when not authenticated', async () => {
    (getSession as any).mockResolvedValue(null);

    const res = await POST(makeRequest({ promptId: 'p1', direction: 'UP' }));
    expect(res.status).toBe(401);
  });

  it('returns 400 when promptId is missing', async () => {
    const res = await POST(makeRequest({ direction: 'UP' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when promptId is too long', async () => {
    const res = await POST(makeRequest({ promptId: 'a'.repeat(51), direction: 'UP' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when direction is invalid', async () => {
    const res = await POST(makeRequest({ promptId: 'p1', direction: 'SIDEWAYS' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when promptId is not a string', async () => {
    const res = await POST(makeRequest({ promptId: 123, direction: 'UP' }));
    expect(res.status).toBe(400);
  });

  it('calls handleVote with correct args and returns result', async () => {
    const voteResult = { upvotes: 5, downvotes: 2, userVote: 'UP' };
    (handleVote as any).mockResolvedValue(voteResult);

    const res = await POST(makeRequest({ promptId: 'p1', direction: 'UP' }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual(voteResult);

    expect(handleVote).toHaveBeenCalledWith('p1', 'vote-route-user', 'VoteUser', 'UP');
  });

  it('returns 500 when handleVote throws', async () => {
    (handleVote as any).mockRejectedValue(new Error('DB error'));

    const res = await POST(makeRequest({ promptId: 'p1', direction: 'DOWN' }));
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('Vote failed');
  });
});
