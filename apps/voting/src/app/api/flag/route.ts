import { prisma } from '@photobot/db';
import { type NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.discordUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!checkRateLimit('flag', session.discordUserId)) {
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
  } catch (_err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
