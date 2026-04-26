'use client';

import { LucideLogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut()}
      title="Sign out"
      aria-label="Sign out"
      className="p-2 rounded-md text-muted hover:text-primary transition-colors"
    >
      <LucideLogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
    </button>
  );
}
