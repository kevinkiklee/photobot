'use client';

import { useEffect } from 'react';

export default function ErrorPage({ error: _error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {}, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-display font-semibold text-[var(--text-primary)]">Something went wrong</h2>
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--brand-primary)] text-[var(--brand-dark)] hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
