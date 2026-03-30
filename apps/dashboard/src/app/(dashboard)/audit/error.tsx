'use client';

import { ErrorCard } from '@/components/ErrorCard';

export default function AuditError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <ErrorCard
        title="Audit log unavailable"
        message="Couldn't load the audit log — Discord might be taking a nap."
        onRetry={reset}
      />
    </div>
  );
}
