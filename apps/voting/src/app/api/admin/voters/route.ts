import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getVotersForPrompt } from '@/lib/admin';

const adminRateLimits = new Map<string, { count: number; resetAt: number }>();

function checkAdminRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = adminRateLimits.get(userId);
  if (!entry || now > entry.resetAt) {
    adminRateLimits.set(userId, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  entry.count++;
  return entry.count <= 30;
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!checkAdminRateLimit(session.discordUserId!)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const promptId = request.nextUrl.searchParams.get('promptId');
  if (!promptId || promptId.length > 50) {
    return NextResponse.json({ error: 'Invalid promptId' }, { status: 400 });
  }

  try {
    const voters = await getVotersForPrompt(promptId);
    return NextResponse.json({ voters });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
