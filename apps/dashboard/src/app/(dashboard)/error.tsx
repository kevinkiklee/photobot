'use client';

import { ErrorCard } from '@/components/ErrorCard';

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <ErrorCard
        title="Oops! Something broke"
        message="We hit an unexpected error. Our camera must need new batteries."
        onRetry={reset}
      />
    </div>
  );
}
