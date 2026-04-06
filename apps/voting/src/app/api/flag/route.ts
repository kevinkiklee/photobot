import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { prisma } from '@photobot/db';

const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;

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
  const session = await getSession();
  if (!session?.discordUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!checkRateLimit(session.discordUserId)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const { promptId } = await request.json();
  if (!promptId) {
    return NextResponse.json({ error: 'Missing promptId' }, { status: 400 });
  }

  if (typeof promptId !== 'string' || promptId.length > 50) {
    return NextResponse.json({ error: 'Invalid promptId' }, { status: 400 });
  }

  try {
    // Toggle: if already flagged, remove the flag
    const existing = await prisma.promptDuplicateFlag.findUnique({
      where: { promptId_discordUserId: { promptId, discordUserId: session.discordUserId } },
    });

    if (existing) {
      await prisma.promptDuplicateFlag.delete({ where: { id: existing.id } });
    } else {
      await prisma.promptDuplicateFlag.create({
        data: { promptId, discordUserId: session.discordUserId },
      });
    }

    const count = await prisma.promptDuplicateFlag.count({ where: { promptId } });

    return NextResponse.json({ flagged: !existing, duplicateCount: count });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
