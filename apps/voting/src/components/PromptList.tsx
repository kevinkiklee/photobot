'use client';

import { useState, useEffect } from 'react';
import { PromptCard } from './PromptCard';
import type { PromptWithVotes } from '@/lib/prompts';

interface PromptListProps {
  prompts: PromptWithVotes[];
  userVotes: Record<string, 'UP' | 'DOWN'>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  currentUserId: string | null;
}

export function PromptList({ prompts: initial, userVotes: initialVotes, isAuthenticated, isAdmin, currentUserId }: PromptListProps) {
  const [prompts, setPrompts] = useState(initial);
  const [userVotes, setUserVotes] = useState(initialVotes);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail?.id) return;
      const newPrompt: PromptWithVotes = {
        id: detail.id,
        text: detail.text,
        originalCategory: 'community',
        tags: detail.tags || [],
        upvotes: 0,
        downvotes: 0,
        approvalPct: 0,
        submittedBy: detail.submittedBy || null,
        submittedByUsername: detail.submittedByUsername || null,
        duplicateCount: 0,
        userFlaggedDuplicate: false,
      };
      setPrompts(prev => [newPrompt, ...prev]);
    };
    window.addEventListener('prompt-created', handler);
    return () => window.removeEventListener('prompt-created', handler);
  }, []);

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

  const handleEdit = async (promptId: string, newText: string, newTags: string[]) => {
    const res = await fetch('/api/prompt', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: promptId, text: newText, tags: newTags }),
    });

    if (!res.ok) throw new Error('Edit failed');

    setPrompts(prev => prev.map(p =>
      p.id === promptId ? { ...p, text: newText, tags: newTags } : p
    ));
  };

  const handleFlagDuplicate = async (promptId: string) => {
    const res = await fetch('/api/flag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promptId }),
    });

    if (!res.ok) throw new Error('Flag failed');

    const result = await res.json();

    setPrompts(prev => prev.map(p =>
      p.id === promptId
        ? { ...p, duplicateCount: result.duplicateCount, userFlaggedDuplicate: result.flagged }
        : p
    ));
  };

  const handleDelete = async (promptId: string) => {
    const res = await fetch('/api/prompt', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: promptId }),
    });

    if (!res.ok) throw new Error('Delete failed');

    setPrompts(prev => prev.filter(p => p.id !== promptId));
  };

  return (
    <div className="space-y-1 animate-fade-in">
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
          submittedBy={p.submittedBy}
          submittedByUsername={p.submittedByUsername}
          currentUserId={currentUserId}
          duplicateCount={p.duplicateCount}
          userFlaggedDuplicate={p.userFlaggedDuplicate}
          onVote={handleVote}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onFlagDuplicate={handleFlagDuplicate}
        />
      ))}
      {prompts.length === 0 && (
        <div className="text-center py-16 text-muted text-sm">No prompts match your filters.</div>
      )}
    </div>
  );
}
