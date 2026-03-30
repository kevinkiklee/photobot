# Dashboard Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add loading states, error boundaries, toast notifications, server selector popover, mobile bottom nav, and page-level polish across the Photobot dashboard.

**Architecture:** Component-first approach — build shared primitives (Skeleton, ErrorCard, Toast, ServerPopover, MobileNav), then wire them into pages. New CSS keyframes and Tailwind extensions support bottom-sheet and toast animations. All new components are client components except Skeleton which is a simple div.

**Tech Stack:** Next.js 14 (App Router), Tailwind CSS 3, React 18, lucide-react, vitest + @testing-library/react

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `src/components/Skeleton.tsx` | Shimmer skeleton primitive (single div, className prop) |
| `src/components/ErrorCard.tsx` | Branded error card with camera icon, retry button |
| `src/components/Toast.tsx` | Toast context provider, useToast hook, Toaster portal |
| `src/components/ServerPopover.tsx` | Popover server selector (desktop dropdown + mobile bottom sheet) |
| `src/components/MobileNav.tsx` | Fixed bottom tab bar for mobile |
| `src/components/relative-time.tsx` | Client component for relative timestamp display |
| `src/app/(dashboard)/loading.tsx` | Dashboard layout loading skeleton |
| `src/app/(dashboard)/settings/loading.tsx` | Settings page skeleton |
| `src/app/(dashboard)/audit/loading.tsx` | Audit page skeleton |
| `src/app/(dashboard)/error.tsx` | Dashboard error boundary |
| `src/app/(dashboard)/settings/error.tsx` | Settings error boundary |
| `src/app/(dashboard)/audit/error.tsx` | Audit error boundary |
| `src/app/not-found.tsx` | 404 page |
| `public/icon.svg` | SVG favicon (camera icon) |
| `src/__tests__/skeleton.test.tsx` | Skeleton component test |
| `src/__tests__/error-card.test.tsx` | ErrorCard component test |
| `src/__tests__/toast.test.tsx` | Toast system test |
| `src/__tests__/server-popover.test.tsx` | ServerPopover test |
| `src/__tests__/mobile-nav.test.tsx` | MobileNav test |

### Modified Files
| File | Changes |
|------|---------|
| `src/app/globals.css` | Reduce grain opacity, add bottom-sheet/toast/popover keyframes, safe-area utility |
| `tailwind.config.ts` | Add shimmer, slide-up, slide-down, toast-in animations |
| `src/app/layout.tsx` | Add Toaster provider, update metadata (favicon, OG) |
| `src/app/page.tsx` | Suspense boundary around ServerSelector, responsive tweaks |
| `src/app/(dashboard)/layout.tsx` | Replace select with ServerPopover, add MobileNav, responsive header |
| `src/app/(dashboard)/settings/page.tsx` | Responsive grid classes |
| `src/app/(dashboard)/audit/page.tsx` | Action badges, relative timestamps, sticky header, responsive table, scroll-to-top |
| `src/components/LoginButton.tsx` | Loading/disabled states |
| `src/components/feature-toggle.tsx` | Toast integration replacing alert() |
| `src/__tests__/home.test.tsx` | Update for Suspense wrapper |
| `src/__tests__/settings.test.tsx` | Update for toast behavior |
| `src/__tests__/audit.test.tsx` | Update for relative timestamps, action badges |
| `src/__tests__/feature-toggle.test.tsx` | Update for toast instead of alert |
| `src/__tests__/server-selector-client.test.tsx` | Rewrite for ServerPopover |

### Removed Files
| File | Reason |
|------|--------|
| `src/components/server-selector.tsx` | Replaced by ServerPopover |

---

## Task 1: CSS Foundation — Animations and Grain Fix

**Files:**
- Modify: `apps/dashboard/src/app/globals.css`
- Modify: `apps/dashboard/tailwind.config.ts`

- [ ] **Step 1: Add new keyframes and reduce grain opacity in globals.css**

Add after the existing `@keyframes shimmer` block (line 102):

```css
@keyframes slide-up {
  from { opacity: 0; transform: translateY(100%); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slide-down {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(100%); }
}
@keyframes toast-in {
  from { opacity: 0; transform: translateX(100%); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes toast-out {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(100%); }
}
@keyframes scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

Change grain opacity — line 59 from `opacity: 0.025;` to `opacity: 0.015;` and line 66 from `opacity: 0.04;` to `opacity: 0.025;`.

Add at the bottom of the file:

```css
/* ─── Safe area for mobile bottom nav ─── */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
```

- [ ] **Step 2: Add new animations to tailwind.config.ts**

Add these entries to `theme.extend.animation`:

```ts
'shimmer': 'shimmer 2s linear infinite',
'slide-up': 'slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
'slide-down': 'slide-down 0.2s ease-in',
'toast-in': 'toast-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
'toast-out': 'toast-out 0.2s ease-in forwards',
'scale-in': 'scale-in 0.15s ease-out',
```

And add corresponding entries to `theme.extend.keyframes`:

```ts
'shimmer': {
  '0%': { backgroundPosition: '-200% 0' },
  '100%': { backgroundPosition: '200% 0' },
},
'slide-up': {
  from: { opacity: '0', transform: 'translateY(100%)' },
  to: { opacity: '1', transform: 'translateY(0)' },
},
'slide-down': {
  from: { opacity: '1', transform: 'translateY(0)' },
  to: { opacity: '0', transform: 'translateY(100%)' },
},
'toast-in': {
  from: { opacity: '0', transform: 'translateX(100%)' },
  to: { opacity: '1', transform: 'translateX(0)' },
},
'toast-out': {
  from: { opacity: '1', transform: 'translateX(0)' },
  to: { opacity: '0', transform: 'translateX(100%)' },
},
'scale-in': {
  from: { opacity: '0', transform: 'scale(0.95)' },
  to: { opacity: '1', transform: 'scale(1)' },
},
```

- [ ] **Step 3: Commit**

```bash
git add apps/dashboard/src/app/globals.css apps/dashboard/tailwind.config.ts
git commit -m "feat(dashboard): add animation keyframes and reduce grain opacity"
```

---

## Task 2: Skeleton Component

**Files:**
- Create: `apps/dashboard/src/components/Skeleton.tsx`
- Create: `apps/dashboard/src/__tests__/skeleton.test.tsx`

- [ ] **Step 1: Write the test**

```tsx
// apps/dashboard/src/__tests__/skeleton.test.tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton } from '../components/Skeleton';

describe('Skeleton', () => {
  it('renders a div with shimmer animation', () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el.tagName).toBe('DIV');
    expect(el.className).toContain('animate-shimmer');
  });

  it('applies additional classNames', () => {
    const { container } = render(<Skeleton className="h-4 w-32" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('h-4');
    expect(el.className).toContain('w-32');
  });

  it('renders as rounded by default', () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('rounded-md');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/dashboard && pnpm vitest run src/__tests__/skeleton.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Write the implementation**

```tsx
// apps/dashboard/src/components/Skeleton.tsx
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-shimmer rounded-md bg-gradient-to-r from-brand-secondary/10 via-brand-primary/10 to-brand-secondary/10 bg-[length:200%_100%] ${className}`}
    />
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd apps/dashboard && pnpm vitest run src/__tests__/skeleton.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/dashboard/src/components/Skeleton.tsx apps/dashboard/src/__tests__/skeleton.test.tsx
git commit -m "feat(dashboard): add Skeleton shimmer component"
```

---

## Task 3: ErrorCard Component

**Files:**
- Create: `apps/dashboard/src/components/ErrorCard.tsx`
- Create: `apps/dashboard/src/__tests__/error-card.test.tsx`

- [ ] **Step 1: Write the test**

```tsx
// apps/dashboard/src/__tests__/error-card.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorCard } from '../components/ErrorCard';

describe('ErrorCard', () => {
  it('renders default title when none provided', () => {
    render(<ErrorCard message="Something broke" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders custom title', () => {
    render(<ErrorCard title="Oops!" message="Custom error" />);
    expect(screen.getByText('Oops!')).toBeInTheDocument();
    expect(screen.getByText('Custom error')).toBeInTheDocument();
  });

  it('shows retry button when onRetry is provided', () => {
    const onRetry = vi.fn();
    render(<ErrorCard message="Error" onRetry={onRetry} />);
    const button = screen.getByRole('button', { name: /try again/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('hides retry button when onRetry is not provided', () => {
    render(<ErrorCard message="Error" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/dashboard && pnpm vitest run src/__tests__/error-card.test.tsx`
Expected: FAIL

- [ ] **Step 3: Write the implementation**

```tsx
// apps/dashboard/src/components/ErrorCard.tsx
'use client';

import { LucideCamera, LucideX } from 'lucide-react';

interface ErrorCardProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorCard({ title = 'Something went wrong', message, onRetry }: ErrorCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-brand-accent/20 bg-card/50 backdrop-blur-sm animate-fade-up max-w-md mx-auto">
      {/* Camera icon with X overlay */}
      <div className="relative mb-5">
        <div className="p-4 rounded-2xl bg-brand-accent/10 border border-brand-accent/20">
          <LucideCamera className="w-8 h-8 text-brand-accent" strokeWidth={1.5} />
        </div>
        <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-card border border-brand-accent/30">
          <LucideX className="w-3 h-3 text-brand-accent" strokeWidth={2} />
        </div>
      </div>

      <h2 className="font-display text-lg text-primary mb-2">{title}</h2>
      <p className="text-sm text-secondary leading-relaxed mb-6">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2 rounded-lg text-sm font-medium bg-brand-primary/10 text-brand-primary border border-brand-primary/20 hover:bg-brand-primary/20 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd apps/dashboard && pnpm vitest run src/__tests__/error-card.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/dashboard/src/components/ErrorCard.tsx apps/dashboard/src/__tests__/error-card.test.tsx
git commit -m "feat(dashboard): add ErrorCard component with branded error display"
```

---

## Task 4: Toast System

**Files:**
- Create: `apps/dashboard/src/components/Toast.tsx`
- Create: `apps/dashboard/src/__tests__/toast.test.tsx`

- [ ] **Step 1: Write the test**

```tsx
// apps/dashboard/src/__tests__/toast.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastProvider, useToast, Toaster } from '../components/Toast';

function TestComponent() {
  const { toast } = useToast();
  return (
    <div>
      <button onClick={() => toast({ variant: 'success', message: 'It worked!' })}>
        Show Success
      </button>
      <button onClick={() => toast({ variant: 'error', message: 'It failed!' })}>
        Show Error
      </button>
    </div>
  );
}

function renderWithToast() {
  return render(
    <ToastProvider>
      <TestComponent />
      <Toaster />
    </ToastProvider>
  );
}

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows a success toast when triggered', () => {
    renderWithToast();
    fireEvent.click(screen.getByText('Show Success'));
    expect(screen.getByText('It worked!')).toBeInTheDocument();
  });

  it('shows an error toast when triggered', () => {
    renderWithToast();
    fireEvent.click(screen.getByText('Show Error'));
    expect(screen.getByText('It failed!')).toBeInTheDocument();
  });

  it('auto-dismisses after 4 seconds', () => {
    renderWithToast();
    fireEvent.click(screen.getByText('Show Success'));
    expect(screen.getByText('It worked!')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4500);
    });

    expect(screen.queryByText('It worked!')).not.toBeInTheDocument();
  });

  it('limits visible toasts to 3', () => {
    renderWithToast();
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByText('Show Success'));
    }
    const toasts = screen.getAllByText('It worked!');
    expect(toasts.length).toBeLessThanOrEqual(3);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/dashboard && pnpm vitest run src/__tests__/toast.test.tsx`
Expected: FAIL

- [ ] **Step 3: Write the implementation**

```tsx
// apps/dashboard/src/components/Toast.tsx
'use client';

import { createContext, useContext, useCallback, useState, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { LucideCheck, LucideX, LucideInfo } from 'lucide-react';

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
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => removeToast(id), 200);
  }, [removeToast]);

  const toast = useCallback(({ variant, message, action }: { variant: ToastVariant; message: string; action?: ToastAction }) => {
    const id = nextId++;
    setToasts(prev => {
      const next = [...prev, { id, variant, message, action }];
      if (next.length > MAX_TOASTS) {
        return next.slice(next.length - MAX_TOASTS);
      }
      return next;
    });

    setTimeout(() => dismissToast(id), AUTO_DISMISS_MS);
  }, [dismissToast]);

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
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2 max-sm:left-4 max-sm:right-4 max-sm:items-stretch sm:w-80" role="status" aria-live="polite">
      {toasts.map(t => {
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
                  onClick={(e) => { e.stopPropagation(); t.action!.onClick(); onDismiss(t.id); }}
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
    document.body
  );
}

// Re-export Toaster as no-op for layout — the portal is rendered inside ToastProvider
export function Toaster() {
  return null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd apps/dashboard && pnpm vitest run src/__tests__/toast.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/dashboard/src/components/Toast.tsx apps/dashboard/src/__tests__/toast.test.tsx
git commit -m "feat(dashboard): add toast notification system"
```

---

## Task 5: ServerPopover Component

**Files:**
- Create: `apps/dashboard/src/components/ServerPopover.tsx`
- Create: `apps/dashboard/src/__tests__/server-popover.test.tsx`

- [ ] **Step 1: Write the test**

```tsx
// apps/dashboard/src/__tests__/server-popover.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/settings',
  useSearchParams: () => new URLSearchParams(''),
}));

import { ServerPopover } from '../components/ServerPopover';

const guilds = [
  { id: '111', name: 'Photo Guild', permissions: '8', icon: null },
  { id: '222', name: 'Snap Community', permissions: '8', icon: null },
  { id: '333', name: 'Camera Club', permissions: '8', icon: null },
];

describe('ServerPopover', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders trigger with placeholder when no server selected', () => {
    render(<ServerPopover guilds={guilds} />);
    expect(screen.getByText('Select server...')).toBeInTheDocument();
  });

  it('opens popover on trigger click', () => {
    render(<ServerPopover guilds={guilds} />);
    fireEvent.click(screen.getByRole('button', { name: /select server/i }));
    expect(screen.getByText('Photo Guild')).toBeInTheDocument();
    expect(screen.getByText('Snap Community')).toBeInTheDocument();
  });

  it('navigates on server selection', () => {
    render(<ServerPopover guilds={guilds} />);
    fireEvent.click(screen.getByRole('button', { name: /select server/i }));
    fireEvent.click(screen.getByText('Photo Guild'));
    expect(mockPush).toHaveBeenCalledWith('/settings?serverId=111');
  });

  it('closes on Escape key', () => {
    render(<ServerPopover guilds={guilds} />);
    fireEvent.click(screen.getByRole('button', { name: /select server/i }));
    expect(screen.getByText('Photo Guild')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByText('Photo Guild')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/dashboard && pnpm vitest run src/__tests__/server-popover.test.tsx`
Expected: FAIL

- [ ] **Step 3: Write the implementation**

```tsx
// apps/dashboard/src/components/ServerPopover.tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { LucideChevronDown, LucideSearch } from 'lucide-react';
import { DiscordGuild } from '@/lib/discord';

interface ServerPopoverProps {
  guilds: DiscordGuild[];
  mode?: 'popover' | 'sheet';
  onClose?: () => void;
}

export function ServerPopover({ guilds, mode = 'popover', onClose }: ServerPopoverProps) {
  const [isOpen, setIsOpen] = useState(mode === 'sheet');
  const [search, setSearch] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentServerId = searchParams.get('serverId');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const currentGuild = guilds.find(g => g.id === currentServerId);

  const filtered = search
    ? guilds.filter(g => g.name.toLowerCase().includes(search.toLowerCase()))
    : guilds;

  const handleSelect = useCallback((guildId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('serverId', guildId);
    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
    setSearch('');
    onClose?.();
    triggerRef.current?.focus();
  }, [router, pathname, searchParams, onClose]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearch('');
    onClose?.();
    triggerRef.current?.focus();
  }, [onClose]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen || mode === 'sheet') return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, handleClose, mode]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, handleClose]);

  const guildInitial = (name: string) => name.charAt(0).toUpperCase();

  const listContent = (
    <>
      {guilds.length >= 5 && (
        <div className="p-2 border-b border-subtle">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-brand-primary/5 border border-subtle">
            <LucideSearch className="w-3.5 h-3.5 text-muted flex-shrink-0" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search servers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-primary placeholder:text-muted outline-none w-full"
              autoFocus
            />
          </div>
        </div>
      )}
      <div className="overflow-y-auto max-h-[320px] p-1.5">
        {filtered.length === 0 ? (
          <p className="text-xs text-muted text-center py-4">No servers found</p>
        ) : (
          filtered.map(guild => {
            const isSelected = guild.id === currentServerId;
            const isOwner = BigInt(guild.permissions) & BigInt(0x8);
            return (
              <button
                key={guild.id}
                onClick={() => handleSelect(guild.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  isSelected
                    ? 'bg-brand-primary/10 border-l-2 border-brand-primary'
                    : 'hover:bg-brand-primary/5 border-l-2 border-transparent'
                }`}
              >
                {guild.icon ? (
                  <img
                    src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                    alt=""
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary/30 to-brand-accent/30 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                    {guildInitial(guild.name)}
                  </div>
                )}
                <span className="text-sm text-primary truncate flex-1">{guild.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                  isOwner ? 'bg-brand-accent/15 text-brand-accent' : 'bg-brand-primary/15 text-brand-primary'
                }`}>
                  {isOwner ? 'Owner' : 'Admin'}
                </span>
              </button>
            );
          })
        )}
      </div>
    </>
  );

  // Sheet mode (mobile) — render inline, no trigger
  if (mode === 'sheet') {
    return (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
        <div className="absolute bottom-0 left-0 right-0 max-h-[60vh] bg-card border-t border-subtle rounded-t-2xl animate-slide-up pb-safe">
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-8 h-1 rounded-full bg-[var(--border-default)]" />
          </div>
          <h3 className="px-4 pb-2 text-sm font-semibold text-primary">Select Server</h3>
          {listContent}
        </div>
      </div>
    );
  }

  // Popover mode (desktop)
  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select server"
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-subtle hover:border-brand-primary/30 bg-card/50 backdrop-blur-sm transition-all text-sm"
      >
        {currentGuild ? (
          <>
            {currentGuild.icon ? (
              <img
                src={`https://cdn.discordapp.com/icons/${currentGuild.id}/${currentGuild.icon}.png`}
                alt=""
                className="w-5 h-5 rounded-full"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-brand-primary/30 to-brand-accent/30 flex items-center justify-center text-[10px] font-bold text-primary">
                {guildInitial(currentGuild.name)}
              </div>
            )}
            <span className="text-primary max-w-[120px] truncate">{currentGuild.name}</span>
          </>
        ) : (
          <span className="text-muted">Select server...</span>
        )}
        <LucideChevronDown className={`w-3.5 h-3.5 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} strokeWidth={1.5} />
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-subtle glass shadow-xl animate-scale-in z-50"
        >
          {listContent}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd apps/dashboard && pnpm vitest run src/__tests__/server-popover.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/dashboard/src/components/ServerPopover.tsx apps/dashboard/src/__tests__/server-popover.test.tsx
git commit -m "feat(dashboard): add ServerPopover with search and keyboard dismiss"
```

---

## Task 6: MobileNav Component

**Files:**
- Create: `apps/dashboard/src/components/MobileNav.tsx`
- Create: `apps/dashboard/src/__tests__/mobile-nav.test.tsx`

- [ ] **Step 1: Write the test**

```tsx
// apps/dashboard/src/__tests__/mobile-nav.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/settings',
  useSearchParams: () => new URLSearchParams('serverId=111'),
}));

vi.mock('../lib/discord', () => ({
  DiscordGuild: {},
}));

import { MobileNav } from '../components/MobileNav';

const guilds = [
  { id: '111', name: 'Photo Guild', permissions: '8' },
];

describe('MobileNav', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders three tab buttons', () => {
    render(<MobileNav guilds={guilds} />);
    expect(screen.getByLabelText('Settings')).toBeInTheDocument();
    expect(screen.getByLabelText('Audit Log')).toBeInTheDocument();
    expect(screen.getByLabelText('Servers')).toBeInTheDocument();
  });

  it('navigates to settings preserving serverId', () => {
    render(<MobileNav guilds={guilds} />);
    fireEvent.click(screen.getByLabelText('Settings'));
    expect(mockPush).toHaveBeenCalledWith('/settings?serverId=111');
  });

  it('navigates to audit preserving serverId', () => {
    render(<MobileNav guilds={guilds} />);
    fireEvent.click(screen.getByLabelText('Audit Log'));
    expect(mockPush).toHaveBeenCalledWith('/audit?serverId=111');
  });

  it('highlights active tab based on pathname', () => {
    render(<MobileNav guilds={guilds} />);
    const settingsBtn = screen.getByLabelText('Settings');
    expect(settingsBtn.className).toContain('text-brand-primary');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/dashboard && pnpm vitest run src/__tests__/mobile-nav.test.tsx`
Expected: FAIL

- [ ] **Step 3: Write the implementation**

```tsx
// apps/dashboard/src/components/MobileNav.tsx
'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { LucideSettings, LucideScrollText, LucideLayoutGrid } from 'lucide-react';
import { DiscordGuild } from '@/lib/discord';
import { ServerPopover } from './ServerPopover';

interface MobileNavProps {
  guilds: DiscordGuild[];
}

export function MobileNav({ guilds }: MobileNavProps) {
  const [showServerSheet, setShowServerSheet] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigate = (path: string) => {
    const params = new URLSearchParams(searchParams.toString());
    router.push(`${path}?${params.toString()}`);
  };

  const tabs = [
    { label: 'Settings', icon: LucideSettings, path: '/settings' },
    { label: 'Audit Log', icon: LucideScrollText, path: '/audit' },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass border-t border-subtle pb-safe">
        <div className="flex items-center justify-around h-16">
          {tabs.map(({ label, icon: Icon, path }) => {
            const isActive = pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                aria-label={label}
                className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                  isActive ? 'text-brand-primary' : 'text-secondary'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-[10px] font-medium">{label}</span>
                {isActive && (
                  <div className="absolute bottom-2 w-1 h-1 rounded-full bg-brand-primary" />
                )}
              </button>
            );
          })}
          <button
            onClick={() => setShowServerSheet(true)}
            aria-label="Servers"
            className="flex flex-col items-center gap-1 px-4 py-2 text-secondary transition-colors"
          >
            <LucideLayoutGrid className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-[10px] font-medium">Servers</span>
          </button>
        </div>
      </nav>

      {showServerSheet && (
        <ServerPopover
          guilds={guilds}
          mode="sheet"
          onClose={() => setShowServerSheet(false)}
        />
      )}
    </>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd apps/dashboard && pnpm vitest run src/__tests__/mobile-nav.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/dashboard/src/components/MobileNav.tsx apps/dashboard/src/__tests__/mobile-nav.test.tsx
git commit -m "feat(dashboard): add MobileNav bottom tab bar"
```

---

## Task 7: Loading Skeletons

**Files:**
- Create: `apps/dashboard/src/app/(dashboard)/loading.tsx`
- Create: `apps/dashboard/src/app/(dashboard)/settings/loading.tsx`
- Create: `apps/dashboard/src/app/(dashboard)/audit/loading.tsx`

- [ ] **Step 1: Create dashboard layout loading state**

```tsx
// apps/dashboard/src/app/(dashboard)/loading.tsx
import { LucideCamera } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 animate-fade-in">
      <div className="p-4 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 animate-glow-pulse">
        <LucideCamera className="w-8 h-8 text-brand-primary" strokeWidth={1.5} />
      </div>
      <p className="text-sm text-secondary">Loading...</p>
    </div>
  );
}
```

- [ ] **Step 2: Create settings loading skeleton**

```tsx
// apps/dashboard/src/app/(dashboard)/settings/loading.tsx
import { Skeleton } from '@/components/Skeleton';

export default function SettingsLoading() {
  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-fade-up p-5 rounded-xl border border-subtle bg-card/50">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-lg" />
                <div>
                  <Skeleton className="h-4 w-20 mb-1.5" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
              <Skeleton className="w-11 h-6 rounded-full" />
            </div>
            <Skeleton className="h-3 w-full mb-1" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create audit loading skeleton**

```tsx
// apps/dashboard/src/app/(dashboard)/audit/loading.tsx
import { Skeleton } from '@/components/Skeleton';

export default function AuditLoading() {
  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="rounded-xl border border-subtle bg-card/50 overflow-hidden">
        <div className="border-b border-subtle px-5 py-3 flex gap-8">
          {[80, 60, 48, 56, 120].map((w, i) => (
            <Skeleton key={i} className={`h-3`} style={{ width: w }} />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border-b border-subtle last:border-0 px-5 py-3.5 flex gap-8 stagger">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-16 rounded" />
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/dashboard/src/app/\(dashboard\)/loading.tsx apps/dashboard/src/app/\(dashboard\)/settings/loading.tsx apps/dashboard/src/app/\(dashboard\)/audit/loading.tsx
git commit -m "feat(dashboard): add loading skeletons for dashboard pages"
```

---

## Task 8: Error Boundaries and 404 Page

**Files:**
- Create: `apps/dashboard/src/app/(dashboard)/error.tsx`
- Create: `apps/dashboard/src/app/(dashboard)/settings/error.tsx`
- Create: `apps/dashboard/src/app/(dashboard)/audit/error.tsx`
- Create: `apps/dashboard/src/app/not-found.tsx`

- [ ] **Step 1: Create dashboard error boundary**

```tsx
// apps/dashboard/src/app/(dashboard)/error.tsx
'use client';

import { ErrorCard } from '@/components/ErrorCard';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <ErrorCard
        title="Oops! Something broke"
        message="We hit an unexpected error. Our camera must need new batteries."
        onRetry={reset}
      />
    </div>
  );
}
```

- [ ] **Step 2: Create settings error boundary**

```tsx
// apps/dashboard/src/app/(dashboard)/settings/error.tsx
'use client';

import { ErrorCard } from '@/components/ErrorCard';

export default function SettingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <ErrorCard
        title="Settings unavailable"
        message="Couldn't load your server settings — try refreshing."
        onRetry={reset}
      />
    </div>
  );
}
```

- [ ] **Step 3: Create audit error boundary**

```tsx
// apps/dashboard/src/app/(dashboard)/audit/error.tsx
'use client';

import { ErrorCard } from '@/components/ErrorCard';

export default function AuditError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <ErrorCard
        title="Audit log unavailable"
        message="Couldn't load the audit log — Discord might be taking a nap."
        onRetry={reset}
      />
    </div>
  );
}
```

- [ ] **Step 4: Create 404 page**

```tsx
// apps/dashboard/src/app/not-found.tsx
import Link from 'next/link';
import { LucideCamera, LucideHelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen mesh-dark dark:mesh-dark mesh-light flex items-center justify-center p-6">
      <div className="flex flex-col items-center text-center max-w-md animate-fade-up">
        <div className="relative mb-6">
          <div className="p-5 rounded-2xl bg-brand-accent/10 border border-brand-accent/20">
            <LucideCamera className="w-10 h-10 text-brand-accent" strokeWidth={1.5} />
          </div>
          <div className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-full bg-card border border-brand-accent/30">
            <LucideHelpCircle className="w-4 h-4 text-brand-accent" strokeWidth={2} />
          </div>
        </div>
        <h1 className="font-display text-3xl text-primary mb-3">404 — Lost in the darkroom</h1>
        <p className="text-secondary text-sm leading-relaxed mb-8">
          This page doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-xl text-sm font-medium bg-brand-primary/10 text-brand-primary border border-brand-primary/20 hover:bg-brand-primary/20 transition-colors"
        >
          Back to safety
        </Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add apps/dashboard/src/app/\(dashboard\)/error.tsx apps/dashboard/src/app/\(dashboard\)/settings/error.tsx apps/dashboard/src/app/\(dashboard\)/audit/error.tsx apps/dashboard/src/app/not-found.tsx
git commit -m "feat(dashboard): add error boundaries and 404 page"
```

---

## Task 9: Wire Toast into Root Layout

**Files:**
- Modify: `apps/dashboard/src/app/layout.tsx`

- [ ] **Step 1: Update root layout to wrap children with ToastProvider**

Replace the current `layout.tsx` body content. The `<body>` tag should wrap children with `ToastProvider`:

```tsx
// apps/dashboard/src/app/layout.tsx
import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import { ToastProvider } from "@/components/Toast";
import "./globals.css";

const display = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Photobot Dashboard",
  description: "Admin panel for Photobot — Photography community management",
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    title: 'Photobot Dashboard',
    description: 'AI-driven mentorship for photography communities',
    type: 'website',
  },
  twitter: {
    card: 'summary',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t==='light'){return}if(t==='dark'||(!t)){document.documentElement.classList.add('dark')}})()`,
          }}
        />
      </head>
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} font-body grain`}
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create SVG favicon**

```svg
<!-- apps/dashboard/public/icon.svg -->
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="8" fill="#0c1929"/>
  <circle cx="16" cy="16" r="7" stroke="#74D7EC" stroke-width="1.5" fill="none"/>
  <circle cx="16" cy="16" r="3" fill="#74D7EC"/>
  <rect x="10" y="7" width="12" height="2" rx="1" fill="#74D7EC" opacity="0.5"/>
</svg>
```

- [ ] **Step 3: Commit**

```bash
git add apps/dashboard/src/app/layout.tsx apps/dashboard/public/icon.svg
git commit -m "feat(dashboard): wire ToastProvider into root layout, add favicon"
```

---

## Task 10: Replace Server Selector and Add MobileNav to Dashboard Layout

**Files:**
- Modify: `apps/dashboard/src/app/(dashboard)/layout.tsx`
- Delete: `apps/dashboard/src/components/server-selector.tsx`

- [ ] **Step 1: Rewrite dashboard layout**

Replace the full content of `apps/dashboard/src/app/(dashboard)/layout.tsx`:

```tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAdminGuilds } from "@/lib/discord";
import { ServerPopover } from "@/components/ServerPopover";
import { MobileNav } from "@/components/MobileNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { LucideCamera, LucideSettings, LucideScrollText } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    redirect("/");
  }

  const adminGuilds = await getAdminGuilds(session.accessToken as string);

  return (
    <div className="min-h-screen mesh-dark dark:mesh-dark mesh-light">
      <header className="glass border-b border-subtle sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="p-1.5 rounded-lg bg-brand-primary/10 border border-brand-primary/20 group-hover:bg-brand-primary/20 transition-colors">
                <LucideCamera className="w-4 h-4 text-brand-primary" strokeWidth={1.5} />
              </div>
              <span className="font-display text-lg text-primary">Photobot</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/settings"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-secondary hover:text-primary hover:bg-brand-primary/5 transition-all"
              >
                <LucideSettings className="w-3.5 h-3.5" strokeWidth={1.5} />
                Settings
              </Link>
              <Link
                href="/audit"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-secondary hover:text-primary hover:bg-brand-primary/5 transition-all"
              >
                <LucideScrollText className="w-3.5 h-3.5" strokeWidth={1.5} />
                Audit Log
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="w-px h-5 bg-[var(--border-subtle)] hidden md:block" />
            <div className="hidden md:block">
              <ServerPopover guilds={adminGuilds} />
            </div>
          </div>
        </div>
      </header>
      <main className="animate-fade-in pb-20 md:pb-0">{children}</main>
      <MobileNav guilds={adminGuilds} />
    </div>
  );
}
```

- [ ] **Step 2: Delete old server-selector.tsx**

```bash
rm apps/dashboard/src/components/server-selector.tsx
```

- [ ] **Step 3: Rewrite server-selector-client test for ServerPopover**

Replace `apps/dashboard/src/__tests__/server-selector-client.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/settings',
  useSearchParams: () => new URLSearchParams(''),
}));

vi.mock('../lib/discord', () => ({
  DiscordGuild: {},
}));

import { ServerPopover } from '../components/ServerPopover';

const guilds = [
  { id: '111', name: 'Guild One', permissions: '8' },
  { id: '222', name: 'Guild Two', permissions: '8' },
];

describe('ServerPopover (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows placeholder when no server is selected', () => {
    render(<ServerPopover guilds={guilds} />);
    expect(screen.getByText('Select server...')).toBeInTheDocument();
  });

  it('shows guild list on trigger click', () => {
    render(<ServerPopover guilds={guilds} />);
    fireEvent.click(screen.getByRole('button', { name: /select server/i }));
    expect(screen.getByText('Guild One')).toBeInTheDocument();
    expect(screen.getByText('Guild Two')).toBeInTheDocument();
  });

  it('navigates with serverId on selection', () => {
    render(<ServerPopover guilds={guilds} />);
    fireEvent.click(screen.getByRole('button', { name: /select server/i }));
    fireEvent.click(screen.getByText('Guild One'));
    expect(mockPush).toHaveBeenCalledWith('/settings?serverId=111');
  });

  it('closes popover on Escape', () => {
    render(<ServerPopover guilds={guilds} />);
    fireEvent.click(screen.getByRole('button', { name: /select server/i }));
    expect(screen.getByText('Guild One')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByText('Guild One')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run tests**

Run: `cd apps/dashboard && pnpm vitest run src/__tests__/server-selector-client.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/dashboard/src/app/\(dashboard\)/layout.tsx apps/dashboard/src/__tests__/server-selector-client.test.tsx
git rm apps/dashboard/src/components/server-selector.tsx
git commit -m "feat(dashboard): replace select with ServerPopover, add MobileNav to layout"
```

---

## Task 11: FeatureToggle Toast Integration

**Files:**
- Modify: `apps/dashboard/src/components/feature-toggle.tsx`
- Modify: `apps/dashboard/src/__tests__/feature-toggle.test.tsx`

- [ ] **Step 1: Update the test for toast instead of alert**

Replace the rollback test case in `feature-toggle.test.tsx` (the `rolls back state on action error` test):

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ToastProvider } from '../components/Toast';

vi.mock('../lib/actions', () => ({
  updateFeatureAction: vi.fn(),
}));

import { updateFeatureAction } from '../lib/actions';
import { FeatureToggle } from '../components/feature-toggle';

function renderWithToast(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>);
}

describe('FeatureToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (updateFeatureAction as any).mockResolvedValue({});
  });

  it('renders enabled state', () => {
    renderWithToast(<FeatureToggle serverId="s1" featureKey="critique" initialEnabled={true} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button.className).toContain('bg-brand-primary');
  });

  it('renders disabled state', () => {
    renderWithToast(<FeatureToggle serverId="s1" featureKey="critique" initialEnabled={false} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button.className).toContain('bg-[var(--toggle-off)]');
  });

  it('calls updateFeatureAction on click', async () => {
    renderWithToast(<FeatureToggle serverId="s1" featureKey="critique" initialEnabled={false} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(updateFeatureAction).toHaveBeenCalledWith('s1', 'critique', true);
    });
  });

  it('shows success toast after toggling', async () => {
    renderWithToast(<FeatureToggle serverId="s1" featureKey="critique" initialEnabled={false} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText(/critique enabled/i)).toBeInTheDocument();
    });
  });

  it('rolls back state and shows error toast on failure', async () => {
    (updateFeatureAction as any).mockRejectedValue(new Error('fail'));

    renderWithToast(<FeatureToggle serverId="s1" featureKey="critique" initialEnabled={false} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
      expect(screen.getByText(/failed to update/i)).toBeInTheDocument();
    });
  });

  it('has correct aria-label', () => {
    renderWithToast(<FeatureToggle serverId="s1" featureKey="critique" initialEnabled={true} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Toggle critique');
  });
});
```

- [ ] **Step 2: Update feature-toggle.tsx to use toast**

Replace `apps/dashboard/src/components/feature-toggle.tsx`:

```tsx
'use client';

import { useState, useTransition } from 'react';
import { updateFeatureAction } from '@/lib/actions';
import { useToast } from '@/components/Toast';

export function FeatureToggle({
  serverId,
  featureKey,
  initialEnabled
}: {
  serverId: string;
  featureKey: string;
  initialEnabled: boolean
}) {
  const [isEnabled, setIsEnabled] = useState(initialEnabled);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleToggle = async () => {
    const nextState = !isEnabled;
    setIsEnabled(nextState);

    startTransition(async () => {
      try {
        await updateFeatureAction(serverId, featureKey, nextState);
        toast({
          variant: 'success',
          message: `${featureKey} ${nextState ? 'enabled' : 'disabled'}`,
        });
      } catch (error) {
        setIsEnabled(!nextState);
        toast({
          variant: 'error',
          message: 'Failed to update feature',
        });
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      aria-pressed={isEnabled}
      aria-label={`Toggle ${featureKey}`}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary/40 focus:ring-offset-[var(--bg-card)] ${isEnabled ? 'bg-brand-primary' : 'bg-[var(--toggle-off)]'} ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {isEnabled && (
        <span className="absolute inset-0 rounded-full bg-brand-primary/30 blur-md" />
      )}
      <span className={`relative block w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${isEnabled ? 'translate-x-[22px]' : 'translate-x-[3px]'} top-[4px]`} />
    </button>
  );
}
```

- [ ] **Step 3: Run tests**

Run: `cd apps/dashboard && pnpm vitest run src/__tests__/feature-toggle.test.tsx`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add apps/dashboard/src/components/feature-toggle.tsx apps/dashboard/src/__tests__/feature-toggle.test.tsx
git commit -m "feat(dashboard): replace alert with toast in FeatureToggle"
```

---

## Task 12: LoginButton Loading State

**Files:**
- Modify: `apps/dashboard/src/components/LoginButton.tsx`

- [ ] **Step 1: Update LoginButton with loading state**

Replace `apps/dashboard/src/components/LoginButton.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

export function LoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    signIn('discord');
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl font-medium text-base transition-all duration-300 ${
        isLoading ? 'pointer-events-none opacity-80' : 'hover:scale-[1.02] active:scale-[0.98]'
      }`}
    >
      {/* Glow backdrop */}
      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary opacity-90 group-hover:opacity-100 transition-opacity" />
      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />

      {/* Icon / Spinner */}
      <span className="relative z-10">
        {isLoading ? (
          <svg className="w-5 h-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
          </svg>
        )}
      </span>
      <span className="relative z-10 text-white font-semibold tracking-wide">
        {isLoading ? 'Connecting...' : 'Sign in with Discord'}
      </span>
    </button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/dashboard/src/components/LoginButton.tsx
git commit -m "feat(dashboard): add loading state to LoginButton"
```

---

## Task 13: Audit Page Polish — Action Badges, Relative Timestamps, Responsive Table

**Files:**
- Create: `apps/dashboard/src/components/relative-time.tsx`
- Modify: `apps/dashboard/src/app/(dashboard)/audit/page.tsx`
- Modify: `apps/dashboard/src/__tests__/audit.test.tsx`

- [ ] **Step 1: Create RelativeTime client component**

```tsx
// apps/dashboard/src/components/relative-time.tsx
'use client';

import { useState, useEffect } from 'react';

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return `Yesterday at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function RelativeTime({ date }: { date: string | Date }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const d = new Date(date);
  const full = d.toLocaleString();

  if (!mounted) return <span>{full}</span>;

  return <span title={full}>{getRelativeTime(d)}</span>;
}
```

- [ ] **Step 2: Update audit page with action badges, relative timestamps, responsive table, scroll-to-top**

Replace the full content of `apps/dashboard/src/app/(dashboard)/audit/page.tsx`:

```tsx
import { prisma } from '@photobot/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getAdminGuilds } from '@/lib/discord';
import { RelativeTime } from '@/components/relative-time';
import { LucideInfo, LucideChevronLeft, LucideChevronRight } from 'lucide-react';
import Link from 'next/link';

const actionStyles: Record<string, string> = {
  UPDATE: 'bg-brand-primary/15 text-brand-primary',
  DELETE_SCHEDULE: 'bg-brand-accent/15 text-brand-accent',
  ENABLE_SCHEDULE: 'bg-brand-secondary/15 text-brand-secondary',
  DISABLE_SCHEDULE: 'bg-brand-highlight/20 text-brand-dark',
};

export default async function AuditPage({
  searchParams,
}: {
  searchParams: { serverId?: string; page?: string };
}) {
  const session = await getServerSession(authOptions);
  const serverId = searchParams.serverId;

  if (!serverId) {
    return (
      <div className="p-6 sm:p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-display text-primary">Audit Log</h1>
          <p className="text-sm text-muted mt-1">Track all configuration changes</p>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-xl border border-brand-highlight/20 bg-brand-highlight/5 backdrop-blur-sm">
          <LucideInfo className="w-4 h-4 text-brand-highlight mt-0.5 flex-shrink-0" strokeWidth={1.5} />
          <p className="text-sm text-primary">Select a server from the header to view its audit logs.</p>
        </div>
      </div>
    );
  }

  const adminGuilds = await getAdminGuilds(session?.accessToken as string);
  if (!adminGuilds.some(g => g.id === serverId)) {
    return <div className="p-8 text-red-400">Access Denied.</div>;
  }

  const page = parseInt(searchParams.page || '1', 10);
  const pageSize = 20;

  const [logs, totalCount] = await Promise.all([
    prisma.configAuditLog.findMany({
      where: { serverId },
      orderBy: { createdAt: 'desc' },
      take: pageSize,
      skip: (page - 1) * pageSize,
    }),
    prisma.configAuditLog.count({ where: { serverId } }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-display text-primary">Audit Log</h1>
          <p className="text-sm text-muted mt-1">
            {totalCount} {totalCount === 1 ? 'entry' : 'entries'} recorded
          </p>
        </div>
      </div>

      <div id="audit-table" className="rounded-xl border border-subtle bg-card/50 backdrop-blur-sm overflow-hidden animate-fade-up">
        <div className="overflow-x-auto -mx-px">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-subtle bg-card/80 sticky top-0 z-10">
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-muted uppercase tracking-wider">Timestamp</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-muted uppercase tracking-wider">User</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-muted uppercase tracking-wider">Action</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-muted uppercase tracking-wider">Feature</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-muted uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-subtle last:border-0 hover:bg-brand-primary/5 transition-colors">
                  <td className="px-5 py-3.5 whitespace-nowrap text-xs font-mono text-muted">
                    <RelativeTime date={log.createdAt} />
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-sm text-primary font-medium">
                    {log.userId}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${actionStyles[log.action] || 'bg-brand-secondary/10 text-secondary'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-sm text-secondary capitalize">
                    {log.featureKey}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-muted">{log.targetType} / {log.targetId}</span>
                      <span className="font-mono">
                        {JSON.stringify(log.oldValue)} <span className="text-brand-primary mx-1">&rarr;</span> {JSON.stringify(log.newValue)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-muted">
                    <p className="font-display text-lg text-secondary mb-1">No Entries</p>
                    <p className="text-xs">Configuration changes will appear here.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-6 max-sm:flex-col max-sm:gap-2">
          {page > 1 && (
            <Link
              href={`/audit?serverId=${serverId}&page=${page - 1}#audit-table`}
              className="flex items-center gap-1 px-3 py-1.5 text-xs border border-subtle rounded-lg text-secondary hover:text-primary hover:border-brand-primary/30 transition-all max-sm:w-full max-sm:justify-center"
            >
              <LucideChevronLeft className="w-3 h-3" />
              Previous
            </Link>
          )}
          <span className="px-3 py-1.5 text-xs text-muted font-mono">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/audit?serverId=${serverId}&page=${page + 1}#audit-table`}
              className="flex items-center gap-1 px-3 py-1.5 text-xs border border-subtle rounded-lg text-secondary hover:text-primary hover:border-brand-primary/30 transition-all max-sm:w-full max-sm:justify-center"
            >
              Next
              <LucideChevronRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Update audit test for action badge classes and relative time**

Replace `apps/dashboard/src/__tests__/audit.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('@photobot/db', () => ({
  prisma: {
    configAuditLog: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('../lib/auth', () => ({
  authOptions: {},
}));

vi.mock('../lib/discord', () => ({
  getAdminGuilds: vi.fn(),
}));

import { prisma } from '@photobot/db';
import { getServerSession } from 'next-auth/next';
import { getAdminGuilds } from '../lib/discord';
import AuditPage from '../app/(dashboard)/audit/page';

describe('Audit Page', () => {
  it('shows prompt to select server when no serverId', async () => {
    (getServerSession as any).mockResolvedValue({ accessToken: 'tok' });

    const Page = await AuditPage({ searchParams: {} });
    render(Page);

    expect(screen.getByText(/Select a server from the header/i)).toBeInTheDocument();
  });

  it('shows access denied if user is not admin of server', async () => {
    (getServerSession as any).mockResolvedValue({ accessToken: 'tok' });
    (getAdminGuilds as any).mockResolvedValue([]);

    const Page = await AuditPage({ searchParams: { serverId: '123' } });
    render(Page);

    expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
  });

  it('renders audit logs with action badges', async () => {
    (getServerSession as any).mockResolvedValue({ accessToken: 'tok' });
    (getAdminGuilds as any).mockResolvedValue([{ id: '123', name: 'Test', permissions: '8' }]);
    (prisma.configAuditLog.findMany as any).mockResolvedValue([
      {
        id: '1',
        serverId: '123',
        userId: 'user1',
        action: 'UPDATE',
        targetType: 'SERVER',
        targetId: '123',
        featureKey: 'critique',
        oldValue: { isEnabled: false },
        newValue: { isEnabled: true },
        createdAt: new Date('2024-03-29T10:00:00Z'),
      },
    ]);
    (prisma.configAuditLog.count as any).mockResolvedValue(1);

    const Page = await AuditPage({ searchParams: { serverId: '123' } });
    render(Page);

    expect(screen.getByText(/Audit Log/i)).toBeInTheDocument();
    expect(screen.getByText(/user1/i)).toBeInTheDocument();
    expect(screen.getByText(/critique/i)).toBeInTheDocument();

    // Verify action badge exists with UPDATE text
    const badge = screen.getByText('UPDATE');
    expect(badge.className).toContain('bg-brand-primary/15');
  });
});
```

- [ ] **Step 4: Run tests**

Run: `cd apps/dashboard && pnpm vitest run src/__tests__/audit.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/dashboard/src/components/relative-time.tsx apps/dashboard/src/app/\(dashboard\)/audit/page.tsx apps/dashboard/src/__tests__/audit.test.tsx
git commit -m "feat(dashboard): polish audit page with action badges, relative timestamps, responsive table"
```

---

## Task 14: Home Page — Suspense Boundary and Responsive Tweaks

**Files:**
- Modify: `apps/dashboard/src/app/page.tsx`
- Modify: `apps/dashboard/src/__tests__/home.test.tsx`

- [ ] **Step 1: Update home page with Suspense boundary**

Replace `apps/dashboard/src/app/page.tsx`:

```tsx
import { Suspense } from 'react';
import { LucideCamera, LucideSparkles, LucidePalette, LucideShield } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth";
import { ServerSelector } from "../components/ServerSelector";
import { LoginButton } from "../components/LoginButton";
import { Skeleton } from "../components/Skeleton";

function ServerCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full stagger">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="animate-fade-up p-5 rounded-2xl border border-subtle bg-card/50">
          <div className="flex items-center gap-4 mb-5">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div>
              <Skeleton className="h-4 w-28 mb-2" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-8 rounded-lg" />
            <Skeleton className="h-8 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="relative min-h-screen mesh-dark dark:mesh-dark mesh-light overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-primary/10 blur-[120px] animate-glow-pulse" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-brand-accent/8 blur-[100px] animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-secondary/5 blur-[160px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 pt-16 sm:pt-20 pb-16">
        {/* Hero */}
        <div className="flex flex-col items-center gap-6 sm:gap-8 text-center max-w-3xl stagger">
          {/* Logo mark */}
          <div className="animate-fade-up relative">
            <div className="absolute inset-0 rounded-2xl bg-brand-primary/20 blur-xl scale-150 animate-glow-pulse" />
            <div className="relative p-4 rounded-2xl border border-brand-primary/30 bg-brand-primary/10 backdrop-blur-sm">
              <LucideCamera className="w-10 h-10 text-brand-primary" strokeWidth={1.5} />
            </div>
          </div>

          {/* Title */}
          <div className="animate-fade-up space-y-4" style={{ animationDelay: '80ms' }}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display tracking-tight text-primary leading-[1.1]">
              Photobot
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-secondary font-light leading-relaxed max-w-xl mx-auto">
              AI-driven mentorship, palette extraction, and automated critiques for photography communities.
            </p>
          </div>

          {/* Feature pills */}
          <div className="animate-fade-up flex flex-wrap justify-center gap-2 sm:gap-3" style={{ animationDelay: '160ms' }}>
            {[
              { icon: LucideSparkles, label: "AI Critique" },
              { icon: LucidePalette, label: "Palette Extraction" },
              { icon: LucideShield, label: "Content Moderation" },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-medium tracking-wide uppercase border border-subtle text-secondary bg-card/50 backdrop-blur-sm"
              >
                <Icon className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-brand-primary" strokeWidth={1.5} />
                {label}
              </span>
            ))}
          </div>

          {/* CTA */}
          {!session && (
            <div className="animate-fade-up mt-4" style={{ animationDelay: '240ms' }}>
              <LoginButton />
            </div>
          )}
        </div>

        {/* Server grid */}
        {session && (
          <div className="w-full max-w-5xl mt-16 sm:mt-20 animate-fade-up" style={{ animationDelay: '160ms' }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-10 gap-4">
              <div>
                <h2 className="text-2xl font-display text-primary">Your Servers</h2>
                <p className="text-sm text-muted mt-1">Select a server to manage</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-muted uppercase tracking-wider font-medium">Signed in as</p>
                  <p className="text-sm font-medium text-primary">{session.user?.name || session.user?.email}</p>
                </div>
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt=""
                    className="w-10 h-10 rounded-xl border border-subtle shadow-sm"
                  />
                )}
              </div>
            </div>
            <Suspense fallback={<ServerCardsSkeleton />}>
              <ServerSelector />
            </Suspense>
          </div>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Update home test**

Replace `apps/dashboard/src/__tests__/home.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn().mockResolvedValue(null),
}));

vi.mock('../lib/auth', () => ({
  authOptions: {},
}));

import Home from '../app/page';

describe('Home Page', () => {
  it('renders the heading "Photobot"', async () => {
    const Page = await Home();
    render(Page);
    const heading = screen.getByRole('heading', { level: 1, name: /Photobot/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the description text', async () => {
    const Page = await Home();
    render(Page);
    const description = screen.getByText(/photography communities/i);
    expect(description).toBeInTheDocument();
  });

  it('renders the "Login with Discord" link when not logged in', async () => {
    const Page = await Home();
    render(Page);
    const loginLink = screen.getByText(/Sign in with Discord/i);
    expect(loginLink).toBeInTheDocument();
  });

  it('contains the camera icon', async () => {
    const Page = await Home();
    const { container } = render(Page);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run tests**

Run: `cd apps/dashboard && pnpm vitest run src/__tests__/home.test.tsx`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add apps/dashboard/src/app/page.tsx apps/dashboard/src/__tests__/home.test.tsx
git commit -m "feat(dashboard): add Suspense skeleton to home page, responsive text sizing"
```

---

## Task 15: Settings Page Responsive Grid

**Files:**
- Modify: `apps/dashboard/src/app/(dashboard)/settings/page.tsx`
- Modify: `apps/dashboard/src/__tests__/settings.test.tsx`

- [ ] **Step 1: Update settings grid to be responsive**

In `apps/dashboard/src/app/(dashboard)/settings/page.tsx`, the grid on line 62 already has `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`. Just add mobile padding reduction to the card: change `p-5` to `p-4 sm:p-5` on line 72.

- [ ] **Step 2: Run settings tests to verify no breakage**

Run: `cd apps/dashboard && pnpm vitest run src/__tests__/settings.test.tsx`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add apps/dashboard/src/app/\(dashboard\)/settings/page.tsx
git commit -m "feat(dashboard): responsive card padding on settings page"
```

---

## Task 16: Run Full Test Suite

- [ ] **Step 1: Run all dashboard tests**

Run: `cd apps/dashboard && pnpm vitest run`
Expected: All tests pass. If any fail, fix before proceeding.

- [ ] **Step 2: Commit any fixes**

```bash
git add -A apps/dashboard/
git commit -m "fix(dashboard): resolve test failures from dashboard polish"
```

(Only if fixes were needed.)

---

## Task 17: Final Commit — All Dashboard Polish

- [ ] **Step 1: Verify git status is clean for dashboard changes**

```bash
git status
```

- [ ] **Step 2: If any unstaged changes remain, stage and commit**

```bash
git add apps/dashboard/
git commit -m "feat(dashboard): complete dashboard polish — loading, errors, toast, popover, mobile nav"
```
