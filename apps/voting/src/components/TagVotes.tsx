'use client';

import { useState, useEffect, useRef } from 'react';
import { LucideX, LucidePlus } from 'lucide-react';
import { TAG_COLORS } from './TagFilter';
import { Spinner } from './Spinner';

const ALL_TAGS = [
  'motivation', 'workflow', 'style', 'editing', 'portfolio', 'storytelling',
  'collaboration', 'social-media', 'gear', 'ethics', 'business', 'influences',
  'learning', 'projects', 'self-reflection', 'community', 'technique',
];

interface TagVotesProps {
  promptId: string;
  tags: string[];
  suggestedTags: string[];
  tagVotes: Record<string, { addCount: number; removeCount: number; userAction: string | null }>;
  isAuthenticated: boolean;
  onTagVote: (promptId: string, tag: string, action: 'ADD' | 'REMOVE') => Promise<void>;
}

export function TagVotes({ promptId, tags, suggestedTags, tagVotes, isAuthenticated, onTagVote }: TagVotesProps) {
  const [loadingTag, setLoadingTag] = useState<string | null>(null);
  const [showSuggest, setShowSuggest] = useState(false);
  const suggestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showSuggest) return;
    const handleClick = (e: MouseEvent) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target as Node)) {
        setShowSuggest(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowSuggest(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [showSuggest]);

  const handleVote = async (tag: string, action: 'ADD' | 'REMOVE') => {
    if (!isAuthenticated || loadingTag) return;
    setLoadingTag(tag);
    try {
      await onTagVote(promptId, tag, action);
    } finally {
      setLoadingTag(null);
    }
  };

  // Tags not already on the prompt and not already suggested
  const availableToSuggest = ALL_TAGS.filter(t => !tags.includes(t) && !suggestedTags.includes(t));

  return (
    <div className="flex flex-wrap items-center gap-1">
      {/* Suggest a new tag button */}
      {isAuthenticated && availableToSuggest.length > 0 && (
        <div className="relative" ref={suggestRef}>
          <button
            onClick={() => setShowSuggest(!showSuggest)}
            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] text-muted border border-dashed border-[var(--border-subtle)] hover:text-secondary hover:border-[var(--border-default)] transition-all"
            title="Suggest a tag"
          >
            <LucidePlus className="w-2.5 h-2.5" />
          </button>

          {showSuggest && (
            <div className="absolute left-0 top-full mt-1 z-40 w-56 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-page)] shadow-lg shadow-black/20 animate-scale-in p-2 space-y-1">
              <p className="text-[10px] text-muted px-1 mb-1">Suggest a tag:</p>
              <div className="flex flex-wrap gap-1">
                {availableToSuggest.map(tag => (
                  <button
                    key={tag}
                    onClick={() => { handleVote(tag, 'ADD'); setShowSuggest(false); }}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium border transition-all ${
                      TAG_COLORS[tag] || 'bg-brand-primary/10 text-brand-primary/70 border-brand-primary/15'
                    } hover:opacity-80`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Existing tags with remove vote */}
      {tags.map(tag => {
        const votes = tagVotes[tag];
        const removeCount = votes?.removeCount || 0;
        const userVotedRemove = votes?.userAction === 'REMOVE';

        return (
          <span
            key={tag}
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-medium border ${
              TAG_COLORS[tag] || 'bg-brand-primary/10 text-brand-primary/70 border-brand-primary/15'
            } ${userVotedRemove ? 'opacity-70' : ''}`}
          >
            {tag}
            {removeCount > 0 && (
              <span className="text-[11px] text-red-400/80 ml-0.5 font-semibold leading-none">-{removeCount}</span>
            )}
            {isAuthenticated && (
              <button
                onClick={() => handleVote(tag, 'REMOVE')}
                disabled={loadingTag === tag}
                className="ml-0.5 hidden group-hover:inline-flex opacity-60 hover:opacity-100 transition-opacity"
                title={userVotedRemove ? 'Undo remove vote' : 'Vote to remove this tag'}
              >
                {loadingTag === tag ? <Spinner className="w-2.5 h-2.5" /> : <LucideX className="w-2.5 h-2.5" />}
              </button>
            )}
          </span>
        );
      })}

      {/* Suggested tags (from other users) */}
      {suggestedTags.map(tag => {
        const votes = tagVotes[tag];
        const addCount = votes?.addCount || 0;
        const userVotedAdd = votes?.userAction === 'ADD';

        return (
          <button
            key={`suggest-${tag}`}
            onClick={() => handleVote(tag, 'ADD')}
            disabled={!isAuthenticated || loadingTag === tag}
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-medium border border-dashed transition-all ${
              userVotedAdd
                ? 'border-green-400/40 bg-green-400/10 text-green-400/80'
                : 'border-[var(--border-subtle)] text-muted hover:border-green-400/30 hover:text-green-400/70'
            }`}
            title={userVotedAdd ? 'Undo suggestion' : `Vote to add "${tag}"`}
          >
            {loadingTag === tag ? <Spinner className="w-2.5 h-2.5" /> : <LucidePlus className="w-2.5 h-2.5" />}
            {tag}
            {addCount > 0 && <span className="text-[9px] opacity-70">+{addCount}</span>}
          </button>
        );
      })}

    </div>
  );
}
