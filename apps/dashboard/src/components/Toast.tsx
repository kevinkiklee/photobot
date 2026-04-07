'use client';

import { LucideCheck, LucideInfo, LucideX } from 'lucide-react';
import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastItem {
  id: number;
  variant: ToastVariant;
  message: string;
  action?: ToastAction;
  exiting?: boolean;
}

interface ToastContextValue {
  toast: (opts: { variant: ToastVariant; message: string; action?: ToastAction }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 0;
const MAX_TOASTS = 3;
const AUTO_DISMISS_MS = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissToast = useCallback(
    (id: number) => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
      setTimeout(() => removeToast(id), 200);
    },
    [removeToast],
  );

  const toast = useCallback(
    ({ variant, message, action }: { variant: ToastVariant; message: string; action?: ToastAction }) => {
      const id = nextId++;
      setToasts((prev) => {
        const next = [...prev, { id, variant, message, action }];
        if (next.length > MAX_TOASTS) {
          return next.slice(next.length - MAX_TOASTS);
        }
        return next;
      });

      setTimeout(() => dismissToast(id), AUTO_DISMISS_MS);
    },
    [dismissToast],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToasterInternal toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const variantStyles: Record<ToastVariant, { border: string; icon: typeof LucideCheck }> = {
  success: { border: 'border-brand-primary/30', icon: LucideCheck },
  error: { border: 'border-brand-accent/30', icon: LucideX },
  info: { border: 'border-brand-secondary/30', icon: LucideInfo },
};

const variantIconColor: Record<ToastVariant, string> = {
  success: 'text-brand-primary',
  error: 'text-brand-accent',
  info: 'text-brand-secondary',
};

function ToasterInternal({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: number) => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed top-4 right-4 z-[60] flex flex-col gap-2 max-sm:left-4 max-sm:right-4 max-sm:items-stretch sm:w-80"
      role="status"
      aria-live="polite"
    >
      {toasts.map((t) => {
        const { border, icon: Icon } = variantStyles[t.variant];
        return (
          <div
            key={t.id}
            className={`flex items-start gap-3 p-3 rounded-xl border ${border} bg-card/95 backdrop-blur-md shadow-lg cursor-pointer ${t.exiting ? 'animate-toast-out' : 'animate-toast-in'}`}
            onClick={() => onDismiss(t.id)}
          >
            <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${variantIconColor[t.variant]}`} strokeWidth={2} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-primary">{t.message}</p>
              {t.action && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    t.action!.onClick();
                    onDismiss(t.id);
                  }}
                  className="text-xs font-medium text-brand-primary hover:underline mt-1"
                >
                  {t.action.label}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>,
    document.body,
  );
}

export function Toaster() {
  return null;
}
