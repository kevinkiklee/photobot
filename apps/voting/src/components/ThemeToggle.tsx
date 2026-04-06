'use client';

import { useState, useEffect } from 'react';
import { LucideSun, LucideMoon } from 'lucide-react';

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch {}
  };

  if (dark === null) {
    return <div className="w-8 h-8 rounded-lg" />;
  }

  return (
    <button onClick={toggle} className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-brand-primary/5 transition-all" title="Toggle theme" aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>
      {dark ? <LucideSun className="w-4 h-4" strokeWidth={1.5} /> : <LucideMoon className="w-4 h-4" strokeWidth={1.5} />}
    </button>
  );
}
