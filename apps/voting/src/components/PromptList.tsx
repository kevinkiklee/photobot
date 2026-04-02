'use client';

import { useState } from 'react';
import { PromptCard } from './PromptCard';
import type { PromptWithVotes } from '@/lib/prompts';

interface PromptListProps {
  prompts: PromptWithVotes[];
  userVotes: Record<string, 'UP' | 'DOWN'>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export function PromptList({ prompts: initial, userVotes: initialVotes, isAuthenticated, isAdmin }: PromptListProps) {
  const [prompts, setPrompts] = useState(initial);
  const [userVotes, setUserVotes] = useState(initialVotes);

  const handleVote = async (promptId: string, direction: 'UP' | 'DOWN') => {
    const res = await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promptId, direction }),
    });

    if (!res.ok) throw new Error('Vote failed');

    const result = await res.json();

    setPrompts(prev => prev.map(p =>
      p.id === promptId
        ? { ...p, upvotes: result.upvotes, downvotes: result.downvotes, approvalPct: (result.upvotes + result.downvotes) > 0 ? Math.round((result.upvotes / (result.upvotes + result.downvotes)) * 100) : 0 }
        : p
    ));

    setUserVotes(prev => {
      const next = { ...prev };
      if (result.userVote) {
        next[promptId] = result.userVote;
      } else {
        delete next[promptId];
      }
      return next;
    });
  };

  return (
    <div className="space-y-3 stagger">
      {prompts.map(p => (
        <PromptCard
          key={p.id}
          id={p.id}
          text={p.text}
          tags={p.tags}
          upvotes={p.upvotes}
          downvotes={p.downvotes}
          approvalPct={p.approvalPct}
          userVote={userVotes[p.id] || null}
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
          onVote={handleVote}
        />
      ))}
      {prompts.length === 0 && (
        <div className="text-center py-16 text-muted text-sm">No prompts match your filters.</div>
      )}
    </div>
  );
}
