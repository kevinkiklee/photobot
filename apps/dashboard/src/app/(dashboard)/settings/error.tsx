'use client';

import { ErrorCard } from '@/components/ErrorCard';

export default function SettingsError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <ErrorCard
        title="Settings unavailable"
        message="Couldn't load your server settings — try refreshing."
        onRetry={reset}
      />
    </div>
  );
}
