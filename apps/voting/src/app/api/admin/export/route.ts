import { prisma } from '@photobot/db';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;

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

export async function GET() {
  const session = await getSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!checkRateLimit(session.discordUserId!)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    const prompts = await prisma.prompt.findMany({
      include: {
        tags: { select: { tag: true } },
        votes: {
          select: {
            discordUserId: true,
            discordUsername: true,
            vote: true,
            createdAt: true,
          },
        },
        duplicateFlags: {
          select: {
            discordUserId: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const data = prompts.map((p) => {
      const upvotes = p.votes.filter((v) => v.vote === 'UP').length;
      const downvotes = p.votes.filter((v) => v.vote === 'DOWN').length;
      const total = upvotes + downvotes;

      return {
        id: p.id,
        text: p.text,
        originalCategory: p.originalCategory,
        tags: p.tags.map((t) => t.tag),
        submittedBy: p.submittedBy,
        submittedByUsername: p.submittedByUsername,
        createdAt: p.createdAt,
        upvotes,
        downvotes,
        approvalPct: total > 0 ? Math.round((upvotes / total) * 100) : null,
        duplicateFlags: p.duplicateFlags.length,
        voters: p.votes.map((v) => ({
          discordUserId: v.discordUserId,
          discordUsername: v.discordUsername,
          vote: v.vote,
          createdAt: v.createdAt,
        })),
      };
    });

    const json = JSON.stringify({ exportedAt: new Date().toISOString(), prompts: data }, null, 2);

    return new NextResponse(json, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="photobot-prompts-export-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
