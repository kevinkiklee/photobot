'use client';

import { useState, useEffect } from 'react';
import { LucideSun, LucideMoon } from 'lucide-react';

export function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <button onClick={toggle} className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-brand-primary/5 transition-all" title="Toggle theme">
      {dark ? <LucideSun className="w-4 h-4" strokeWidth={1.5} /> : <LucideMoon className="w-4 h-4" strokeWidth={1.5} />}
    </button>
  );
}
