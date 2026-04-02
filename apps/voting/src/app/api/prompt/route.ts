import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@photobot/db';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.discordUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const text = (body.text || '').trim();

  if (!text || text.length < 10) {
    return NextResponse.json({ error: 'Prompt must be at least 10 characters' }, { status: 400 });
  }

  if (text.length > 500) {
    return NextResponse.json({ error: 'Prompt must be under 500 characters' }, { status: 400 });
  }

  const tags: string[] = Array.isArray(body.tags) ? body.tags.slice(0, 3) : [];

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
    submittedByUsername: prompt.submittedByUsername,
  });
}
