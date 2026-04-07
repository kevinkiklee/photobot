import { prisma } from '@photobot/db';
import { type NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

const ALLOWED_TAGS = new Set([
  'motivation',
  'workflow',
  'style',
  'editing',
  'portfolio',
  'storytelling',
  'collaboration',
  'social-media',
  'gear',
  'ethics',
  'business',
  'influences',
  'learning',
  'projects',
  'self-reflection',
  'community',
  'technique',
]);

import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.discordUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!checkRateLimit('tag-vote', session.discordUserId)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const body = await request.json();
  const { promptId, tag, action } = body;

  if (!promptId || typeof promptId !== 'string' || promptId.length > 50) {
    return NextResponse.json({ error: 'Invalid promptId' }, { status: 400 });
  }
  if (!tag || !ALLOWED_TAGS.has(tag)) {
    return NextResponse.json({ error: 'Invalid tag' }, { status: 400 });
  }
  if (!['ADD', 'REMOVE'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  try {
    // Toggle: if same vote exists, remove it; otherwise upsert
    const existing = await prisma.promptTagSuggestion.findUnique({
      where: { promptId_tag_discordUserId: { promptId, tag, discordUserId: session.discordUserId } },
    });

    if (existing && existing.action === action) {
      // Toggle off
      await prisma.promptTagSuggestion.delete({ where: { id: existing.id } });
    } else if (existing) {
      // Switch action
      await prisma.promptTagSuggestion.update({ where: { id: existing.id }, data: { action } });
    } else {
      // New suggestion
      await prisma.promptTagSuggestion.create({
        data: { promptId, tag, action, discordUserId: session.discordUserId },
      });
    }

    // Return updated counts for this prompt's tags
    const suggestions = await prisma.promptTagSuggestion.findMany({
      where: { promptId },
      select: { tag: true, action: true, discordUserId: true },
    });

    // Group by tag
    const tagVotes: Record<string, { addCount: number; removeCount: number; userAction: string | null }> = {};
    for (const s of suggestions) {
      if (!tagVotes[s.tag]) tagVotes[s.tag] = { addCount: 0, removeCount: 0, userAction: null };
      if (s.action === 'ADD') tagVotes[s.tag].addCount++;
      else tagVotes[s.tag].removeCount++;
      if (s.discordUserId === session.discordUserId) tagVotes[s.tag].userAction = s.action;
    }

    return NextResponse.json({ tagVotes });
  } catch (err) {
    console.error('[POST /api/tag-vote]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
