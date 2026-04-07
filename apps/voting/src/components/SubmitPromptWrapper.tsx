'use client';

import { createContext, type ReactNode, useContext, useState } from 'react';
import { SubmitPromptButton, SubmitPromptPanel } from './SubmitPrompt';

const SubmitContext = createContext<{ open: boolean; toggle: () => void }>({ open: false, toggle: () => {} });

export function SubmitPromptProvider({ isAuthenticated, children }: { isAuthenticated: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  if (!isAuthenticated) return <>{children}</>;

  return <SubmitContext.Provider value={{ open, toggle: () => setOpen((o) => !o) }}>{children}</SubmitContext.Provider>;
}

export function SubmitButton() {
  const { toggle } = useContext(SubmitContext);
  return <SubmitPromptButton onClick={toggle} />;
}

export function SubmitPanel() {
  const { open, toggle } = useContext(SubmitContext);
  if (!open) return null;
  return <SubmitPromptPanel onClose={toggle} />;
}
