'use client';

import { useState } from 'react';
import { Spinner } from './Spinner';
import { TagVotes } from './TagVotes';
import { VoteButton } from './VoteButton';

interface PromptCardActionsProps {
  promptId: string;
  upvotes: number;
  downvotes: number;
  approvalPct: number;
  userVote: 'UP' | 'DOWN' | null;
  isAuthenticated: boolean;
  isOwner: boolean;
  duplicateCount: number;
  userFlaggedDuplicate: boolean;
  tags: string[];
  suggestedTags: string[];
  tagVotes: Record<string, { addCount: number; removeCount: number; userAction: string | null }>;
  onVote: (promptId: string, direction: 'UP' | 'DOWN') => Promise<void>;
  onFlagDuplicate: (promptId: string) => Promise<void>;
  onTagVote: (promptId: string, tag: string, action: 'ADD' | 'REMOVE') => Promise<void>;
}

export function PromptCardActions({
  promptId,
  upvotes,
  downvotes,
  approvalPct,
  userVote,
  isAuthenticated,
  isOwner,
  duplicateCount,
  userFlaggedDuplicate,
  tags,
  suggestedTags,
  tagVotes,
  onVote,
  onFlagDuplicate,
  onTagVote,
}: PromptCardActionsProps) {
  const [flagging, setFlagging] = useState(false);
  const total = upvotes + downvotes;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-1 w-full">
      <VoteButton
        promptId={promptId}
        direction="UP"
        count={upvotes}
        active={userVote === 'UP'}
        disabled={!isAuthenticated || isOwner}
        onVote={onVote}
      />
      <VoteButton
        promptId={promptId}
        direction="DOWN"
        count={downvotes}
        active={userVote === 'DOWN'}
        disabled={!isAuthenticated || isOwner}
        onVote={onVote}
      />
      {total > 0 && <span className="text-xs text-muted font-medium tabular-nums">{approvalPct}%</span>}
      {isAuthenticated && !isOwner && (
        <button
          onClick={async () => {
            setFlagging(true);
            try {
              await onFlagDuplicate(promptId);
            } finally {
              setFlagging(false);
            }
          }}
          disabled={flagging}
          className={`px-1.5 py-0.5 rounded text-[11px] font-medium border transition-all inline-flex items-center gap-1 ${
            userFlaggedDuplicate
              ? 'bg-amber-500/15 text-amber-400 border-amber-500/20'
              : 'text-muted border-[var(--border-subtle)] hover:text-amber-400 hover:border-amber-500/20'
          } ${flagging ? 'opacity-60' : ''}`}
        >
          {flagging && <Spinner />}
          {userFlaggedDuplicate ? 'Marked duplicate' : 'Mark duplicate'}
        </button>
      )}
      <TagVotes
        promptId={promptId}
        tags={tags}
        suggestedTags={suggestedTags}
        tagVotes={tagVotes}
        isAuthenticated={isAuthenticated}
        onTagVote={onTagVote}
      />
    </div>
  );
}
