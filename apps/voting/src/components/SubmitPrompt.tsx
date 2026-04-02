'use client';

import { useState } from 'react';
import { LucidePlus, LucideX, LucideSend } from 'lucide-react';
import { Spinner } from './Spinner';
import { TAG_COLORS } from './TagFilter';
import { useRouter } from 'next/navigation';

const ALL_TAGS = [
  'motivation', 'workflow', 'style', 'editing', 'portfolio', 'storytelling',
  'collaboration', 'social-media', 'gear', 'ethics', 'business', 'influences',
  'learning', 'projects', 'self-reflection', 'community', 'technique',
];

export function SubmitPrompt({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [open, setOpen] = useState(false);
  if (!isAuthenticated) return null;
  if (!open) return <SubmitPromptButton onClick={() => setOpen(true)} />;
  return <SubmitPromptPanel onClose={() => setOpen(false)} />;
}

export function SubmitPromptButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-medium bg-brand-accent/15 text-brand-accent border border-brand-accent/20 hover:bg-brand-accent/25 transition-all whitespace-nowrap"
    >
      <LucidePlus className="w-3.5 h-3.5" strokeWidth={1.5} />
      <span className="hidden sm:inline">Submit a Prompt</span>
      <span className="sm:hidden">Submit</span>
    </button>
  );
}

export function SubmitPromptPanel({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const toggleTag = (tag: string) => {
    setTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : prev.length < 3 ? [...prev, tag] : prev
    );
  };

  const handleSubmit = async () => {
    setError('');
    const trimmed = text.trim();
    if (trimmed.length < 10) {
      setError('Prompt must be at least 10 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed, tags }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to submit.');
        return;
      }

      const result = await res.json();
      window.dispatchEvent(new CustomEvent('prompt-created', { detail: result }));
      setText('');
      setTags([]);
      onClose();
      router.refresh();
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 rounded-xl border border-brand-accent/20 bg-brand-accent/5 backdrop-blur-sm space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-primary">Submit a Discussion Prompt</p>
        <button onClick={() => { onClose(); setError(''); }} className="p-1 text-muted hover:text-primary transition-colors">
          <LucideX className="w-4 h-4" />
        </button>
      </div>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Write a thought-provoking question for the community..."
        maxLength={150}
        rows={3}
        aria-label="New prompt text"
        className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-sm text-primary placeholder:text-muted focus:outline-none focus:border-brand-accent/30 transition-colors resize-none"
      />

      <div>
        <p className="text-[11px] text-muted mb-1.5">Tags (up to 3):</p>
        <div className="flex flex-wrap gap-1">
          {ALL_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all ${
                tags.includes(tag)
                  ? TAG_COLORS[tag] || 'bg-brand-primary/15 text-brand-primary border-brand-primary/20'
                  : 'bg-transparent text-muted border-[var(--border-subtle)] hover:text-secondary'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted">
          {text.length}/150{text.trim().length > 0 && text.trim().length < 10 && ` · ${10 - text.trim().length} more characters needed`}
        </span>
        <button
          onClick={handleSubmit}
          disabled={submitting || text.trim().length < 10}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-brand-accent/15 text-brand-accent border border-brand-accent/20 hover:bg-brand-accent/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? <Spinner /> : <LucideSend className="w-3 h-3" strokeWidth={1.5} />}
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}
