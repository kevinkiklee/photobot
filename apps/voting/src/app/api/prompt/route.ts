import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@photobot/db';

const promptRateLimits = new Map<string, { count: number; resetAt: number }>();

function checkPromptRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = promptRateLimits.get(userId);
  if (!entry || now > entry.resetAt) {
    promptRateLimits.set(userId, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  entry.count++;
  return entry.count <= 20;
}

function isValidId(id: unknown): id is string {
  return typeof id === 'string' && id.length > 0 && id.length <= 50;
}

const ALLOWED_TAGS = new Set([
  'motivation', 'workflow', 'style', 'editing', 'portfolio', 'storytelling',
  'collaboration', 'social-media', 'gear', 'ethics', 'business', 'influences',
  'learning', 'projects', 'self-reflection', 'community', 'technique',
]);

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.discordUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!checkPromptRateLimit(session.discordUserId)) {
    return NextResponse.json({ error: 'Too many submissions. Try again shortly.' }, { status: 429 });
  }

  const body = await request.json();
  const text = (body.text || '').trim();

  if (!text || text.length < 10) {
    return NextResponse.json({ error: 'Prompt must be at least 10 characters' }, { status: 400 });
  }

  if (text.length > 150) {
    return NextResponse.json({ error: 'Prompt must be under 150 characters' }, { status: 400 });
  }

  const tags: string[] = Array.isArray(body.tags)
    ? body.tags.filter((t: unknown) => typeof t === 'string' && ALLOWED_TAGS.has(t)).slice(0, 3)
    : [];

  try {
    const prompt = await prisma.prompt.create({
      data: {
        text,
        originalCategory: 'community',
        submittedBy: session.discordUserId,
        submittedByUsername: session.discordUsername || 'Unknown',
        tags: tags.length > 0 ? { create: tags.map(tag => ({ tag })) } : undefined,
      },
      include: {
        tags: { select: { tag: true } },
      },
    });

    return NextResponse.json({
      id: prompt.id,
      text: prompt.text,
      tags: prompt.tags.map(t => t.tag),
      submittedBy: prompt.submittedBy,
      submittedByUsername: prompt.submittedByUsername,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.discordUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!checkPromptRateLimit(session.discordUserId)) {
    return NextResponse.json({ error: 'Too many edits. Try again shortly.' }, { status: 429 });
  }

  const body = await request.json();
  const { id, text } = body;

  if (!isValidId(id)) {
    return NextResponse.json({ error: 'Invalid prompt id' }, { status: 400 });
  }

  try {
    const prompt = await prisma.prompt.findUnique({ where: { id } });
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    const isOwner = prompt.submittedBy === session.discordUserId;
    if (!isOwner && !session.isAdmin) {
      return NextResponse.json({ error: 'You can only edit your own prompts' }, { status: 403 });
    }

    const trimmed = (text || '').trim();
    if (!trimmed || trimmed.length < 10) {
      return NextResponse.json({ error: 'Prompt must be at least 10 characters' }, { status: 400 });
    }
    if (trimmed.length > 150) {
      return NextResponse.json({ error: 'Prompt must be under 150 characters' }, { status: 400 });
    }

    const newTags: string[] | undefined = Array.isArray(body.tags)
      ? body.tags.filter((t: unknown) => typeof t === 'string' && ALLOWED_TAGS.has(t)).slice(0, 3)
      : undefined;

    const updated = await prisma.prompt.update({
      where: { id },
      data: {
        text: trimmed,
        ...(newTags !== undefined && {
          tags: {
            deleteMany: {},
            create: newTags.map(tag => ({ tag })),
          },
        }),
      },
    });

    return NextResponse.json({ id: updated.id, text: updated.text });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.discordUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!checkPromptRateLimit(session.discordUserId)) {
    return NextResponse.json({ error: 'Too many requests. Try again shortly.' }, { status: 429 });
  }

  const body = await request.json();

  if (!isValidId(body.id)) {
    return NextResponse.json({ error: 'Invalid prompt id' }, { status: 400 });
  }

  try {
    const prompt = await prisma.prompt.findUnique({ where: { id: body.id } });
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    if (!prompt.submittedBy) {
      return NextResponse.json({ error: 'Curated prompts cannot be deleted' }, { status: 403 });
    }

    const isOwner = prompt.submittedBy === session.discordUserId;
    if (!isOwner && !session.isAdmin) {
      return NextResponse.json({ error: 'You can only delete your own prompts' }, { status: 403 });
    }

    await prisma.prompt.delete({ where: { id: body.id } });

    return NextResponse.json({ deleted: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
