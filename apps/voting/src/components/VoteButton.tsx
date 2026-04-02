'use client';

import { useState } from 'react';
import { LucideThumbsUp, LucideThumbsDown } from 'lucide-react';

interface VoteButtonProps {
  promptId: string;
  direction: 'UP' | 'DOWN';
  count: number;
  active: boolean;
  disabled: boolean;
  onVote: (promptId: string, direction: 'UP' | 'DOWN') => Promise<void>;
}

export function VoteButton({ promptId, direction, count, active, disabled, onVote }: VoteButtonProps) {
  const [loading, setLoading] = useState(false);
  const [optimisticCount, setOptimisticCount] = useState(count);
  const [optimisticActive, setOptimisticActive] = useState(active);

  const Icon = direction === 'UP' ? LucideThumbsUp : LucideThumbsDown;
  const colorActive = direction === 'UP'
    ? 'bg-green-500/15 border-green-500/30 text-green-400'
    : 'bg-red-500/15 border-red-500/30 text-red-400';
  const colorInactive = 'bg-transparent border-subtle text-muted hover:text-secondary hover:border-brand-primary/20';

  const handleClick = async () => {
    if (disabled || loading) return;
    setLoading(true);

    const wasActive = optimisticActive;
    setOptimisticActive(!wasActive);
    setOptimisticCount(wasActive ? optimisticCount - 1 : optimisticCount + 1);

    try {
      await onVote(promptId, direction);
    } catch {
      setOptimisticActive(wasActive);
      setOptimisticCount(count);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      title={disabled ? 'Sign in to vote' : direction === 'UP' ? 'Upvote' : 'Downvote'}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 justify-center ${
        optimisticActive ? colorActive : colorInactive
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
      <span>{optimisticCount}</span>
    </button>
  );
}
