'use client';

import { useState } from 'react';
import { LucideThumbsUp, LucideThumbsDown } from 'lucide-react';
import { Spinner } from './Spinner';

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

  const Icon = direction === 'UP' ? LucideThumbsUp : LucideThumbsDown;
  const colorActive = direction === 'UP'
    ? 'bg-green-500/15 border-green-500/25 text-green-400'
    : 'bg-red-500/15 border-red-500/25 text-red-400';
  const colorInactive = 'bg-transparent border-[var(--border-subtle)] text-muted hover:text-secondary hover:border-[var(--border-default)]';

  const handleClick = async () => {
    if (disabled || loading) return;
    setLoading(true);
    try {
      await onVote(promptId, direction);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      title={disabled ? 'Sign in to vote' : direction === 'UP' ? 'Upvote' : 'Downvote'}
      aria-label={disabled ? 'Sign in to vote' : direction === 'UP' ? 'Upvote' : 'Downvote'}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border transition-all ${
        active ? colorActive : colorInactive
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
    >
      {loading ? <Spinner /> : <Icon className="w-3 h-3" strokeWidth={1.5} />}
      <span className="tabular-nums">{count}</span>
    </button>
  );
}
