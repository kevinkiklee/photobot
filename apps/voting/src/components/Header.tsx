import { prisma } from '@photobot/db';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { AdminMenu } from './AdminMenu';
import { LoginButton } from './LoginButton';
import { SignOutButton } from './SignOutButton';
import { ThemeToggle } from './ThemeToggle';

async function getHeaderStats() {
  try {
    const [promptCount, voteCount] = await Promise.all([prisma.prompt.count(), prisma.promptVote.count()]);
    return { promptCount, voteCount };
  } catch {
    return { promptCount: 0, voteCount: 0 };
  }
}

export async function Header() {
  const [session, stats] = await Promise.all([getSession(), getHeaderStats()]);

  return (
    <header className="glass border-b border-subtle sticky top-0 z-30 animate-slide-down">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-xs font-bold text-[#0a0a0a] glow-logo transition-transform group-hover:scale-105">
              P
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold text-primary leading-none tracking-tight">Prompt Voting</div>
              <div className="text-[10px] text-muted leading-tight">Photography Lounge</div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 text-center">
            <div>
              <div className="text-sm font-semibold text-primary tabular-nums">{stats.promptCount}</div>
              <div className="text-[9px] text-muted uppercase tracking-widest">prompts</div>
            </div>
            <div className="w-px h-5 bg-[var(--border-subtle)]" />
            <div>
              <div className="text-sm font-semibold text-primary tabular-nums">{stats.voteCount}</div>
              <div className="text-[9px] text-muted uppercase tracking-widest">votes</div>
            </div>
          </div>

          <div className="w-px h-5 bg-[var(--border-subtle)] hidden sm:block" />

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {session ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted hidden sm:block">{session.discordUsername}</span>
                {session.isAdmin && (
                  <>
                    <span className="hidden sm:inline px-1.5 py-0.5 rounded text-[9px] font-medium bg-brand-accent/15 text-brand-accent border border-brand-accent/20">
                      Staff
                    </span>
                    <a
                      href="/api/admin/export"
                      className="hidden sm:inline px-1.5 py-0.5 rounded text-[9px] font-medium text-muted border border-[var(--border-subtle)] hover:text-primary hover:border-[var(--border-default)] transition-all"
                    >
                      Export JSON
                    </a>
                    <AdminMenu username={session.discordUsername || 'User'} />
                  </>
                )}
                <SignOutButton />
              </div>
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
