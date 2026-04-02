import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { ThemeToggle } from './ThemeToggle';
import { LoginButton } from './LoginButton';
import { LucideCamera } from 'lucide-react';
import Link from 'next/link';

export async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="glass border-b border-subtle sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded-lg bg-brand-primary/10 border border-brand-primary/20 group-hover:bg-brand-primary/20 transition-colors">
              <LucideCamera className="w-4 h-4 text-brand-primary" strokeWidth={1.5} />
            </div>
            <span className="font-display text-lg text-primary">Prompt Voting</span>
          </Link>
          {session?.isAdmin && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-brand-accent/15 text-brand-accent border border-brand-accent/20">
              Admin
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {session ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted hidden sm:block">{session.discordUsername}</span>
              <div className="w-7 h-7 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-xs font-medium text-brand-primary">
                {(session.discordUsername || '?')[0].toUpperCase()}
              </div>
            </div>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </header>
  );
}
