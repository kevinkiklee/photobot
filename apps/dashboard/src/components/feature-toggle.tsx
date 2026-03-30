'use client';

import { useState, useTransition } from 'react';
import { updateFeatureAction } from '@/lib/actions';

export function FeatureToggle({
  serverId,
  featureKey,
  initialEnabled
}: {
  serverId: string;
  featureKey: string;
  initialEnabled: boolean
}) {
  const [isEnabled, setIsEnabled] = useState(initialEnabled);
  const [isPending, startTransition] = useTransition();

  const handleToggle = async () => {
    const nextState = !isEnabled;
    setIsEnabled(nextState);

    startTransition(async () => {
      try {
        await updateFeatureAction(serverId, featureKey, nextState);
      } catch (error) {
        setIsEnabled(!nextState);
        alert('Failed to update feature');
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      aria-pressed={isEnabled}
      aria-label={`Toggle ${featureKey}`}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary/40 focus:ring-offset-[var(--bg-card)] ${isEnabled ? 'bg-brand-primary' : 'bg-[var(--toggle-off)]'} ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {/* Active glow */}
      {isEnabled && (
        <span className="absolute inset-0 rounded-full bg-brand-primary/30 blur-md" />
      )}
      <span className={`relative block w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${isEnabled ? 'translate-x-[22px]' : 'translate-x-[3px]'} top-[4px]`} />
    </button>
  );
}
