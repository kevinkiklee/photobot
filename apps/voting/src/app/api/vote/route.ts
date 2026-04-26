import { type NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getSession } from '@/lib/session';
import { handleVote } from '@/lib/vote';

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.discordUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!checkRateLimit('vote', session.discordUserId)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const body = await request.json();
  const { promptId, direction } = body;

  if (!promptId || typeof promptId !== 'string' || promptId.length > 50) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  if (!['UP', 'DOWN'].includes(direction)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    const result = await handleVote(promptId, session.discordUserId, session.discordUsername || 'Unknown', direction);

    return NextResponse.json(result);
  } catch (_err) {
    return NextResponse.json({ error: 'Vote failed' }, { status: 500 });
  }
}
