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
        setIsEnabled(!nextState); // Rollback on error
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
      className={`w-12 h-6 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isEnabled ? 'bg-green-500' : 'bg-gray-300'} ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isEnabled ? 'left-7' : 'left-1'}`} />
    </button>
  );
}
