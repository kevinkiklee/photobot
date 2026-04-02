import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { handleVote } from '@/lib/vote';

const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 60;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(userId);

  if (!entry || now > entry.resetAt) {
    rateLimits.set(userId, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  entry.count++;
  return entry.count <= RATE_LIMIT;
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.discordUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!checkRateLimit(session.discordUserId)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const body = await request.json();
  const { promptId, direction } = body;

  if (!promptId || !['UP', 'DOWN'].includes(direction)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const result = await handleVote(
    promptId,
    session.discordUserId,
    session.discordUsername || 'Unknown',
    direction,
  );

  return NextResponse.json(result);
}
