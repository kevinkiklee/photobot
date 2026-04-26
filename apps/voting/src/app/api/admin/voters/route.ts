import { type NextRequest, NextResponse } from 'next/server';
import { getVotersForPrompt } from '@/lib/admin';
import { checkRateLimit } from '@/lib/rate-limit';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!checkRateLimit('admin-voters', session.discordUserId ?? '', 30)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const promptId = request.nextUrl.searchParams.get('promptId');
  if (!promptId || promptId.length > 50) {
    return NextResponse.json({ error: 'Invalid promptId' }, { status: 400 });
  }

  try {
    const voters = await getVotersForPrompt(promptId);
    return NextResponse.json({ voters });
  } catch (_err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
