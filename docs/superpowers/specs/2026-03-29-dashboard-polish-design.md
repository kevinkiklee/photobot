# Dashboard Polish — Comprehensive UI/UX Improvement Spec

Apply loading states, error boundaries, responsive mobile layout, server selector redesign, and page-level polish across the entire Photobot dashboard.

## Approach

Component-first: build shared primitives, then wire into every page.

## Phase 1: Shared UI Primitives

All new components in `apps/dashboard/src/components/`.

### Skeleton

A `<Skeleton>` component rendering a pulsing rounded rect. Uses the existing `shimmer` keyframe from `globals.css`.

```tsx
// Props: className (controls size/shape)
<Skeleton className="h-4 w-32" />       // text line
<Skeleton className="h-10 w-10 rounded-full" /> // avatar
```

Implementation: single `div` with `animate-shimmer` class, background using `brand-secondary/20` base with `brand-primary/10` shimmer sweep.

### ErrorCard

Branded error display with camera icon, friendly copy, and optional retry.

```tsx
interface ErrorCardProps {
  title?: string;       // default: "Something went wrong"
  message: string;      // e.g. "Discord might be taking a nap"
  onRetry?: () => void; // shows "Try again" button if provided
}
```

- Camera icon with X overlay (CSS-only using pseudo-elements)
- `border-brand-accent/30` left border accent (4px)
- `bg-card` background with subtle `brand-accent/5` tint
- Retry button styled with `brand-primary`

### Toast System

Lightweight context-based toast notifications. No external dependencies.

**Components:**
- `<Toaster />` — portal-based container, rendered in root layout. Positions toasts top-right (desktop) or top-center (mobile).
- `useToast()` hook — returns `{ toast }` function.

**API:**
```tsx
const { toast } = useToast();
toast({ variant: 'success', message: 'Feature updated' });
toast({ variant: 'error', message: 'Failed to save', action: { label: 'Retry', onClick: fn } });
```

**Variants:**
| Variant | Border Color | Icon |
|---------|-------------|------|
| success | brand-primary | checkmark |
| error | brand-accent | x-circle |
| info | brand-secondary | info |

**Behavior:** Slide in from right, auto-dismiss after 4s, manual dismiss on click. Max 3 visible, oldest removed when exceeded. `fade-up` animation on enter, fade-out on exit.

### ServerPopover

Replaces the raw `<select>` in the dashboard header.

**Trigger:** Current server icon (gradient initials or Discord CDN image) + server name + chevron. If no server selected, shows "Select server..." placeholder with subtle pulse animation.

**Panel:** Absolute-positioned floating panel below trigger. 280px width.
- Search input: only rendered if 5+ servers. Filters by name (case-insensitive).
- Server list: scrollable, max-height 320px.
  - Each row: icon (32px circle, gradient initials or Discord avatar), name (truncated), role badge ("Owner" in `brand-accent/15`, "Admin" in `brand-primary/15`).
  - Selected server: `brand-primary/10` background, `brand-primary` left border.
- Backdrop: `glass` class (existing backdrop-blur utility).
- Dismiss: outside click, Escape key, or selecting a server.
- Animation: scale from 95% + fade in (150ms).

**Behavior:** On server selection, updates URL `searchParams` with `serverId` (same as current `<select>` behavior via `useRouter`).

### MobileNav

Fixed bottom tab bar, visible only below `md` breakpoint (768px).

**Tabs:**
| Tab | Icon | Action |
|-----|------|--------|
| Settings | Gear | Navigate to `/settings` (preserves serverId) |
| Audit | ClipboardList | Navigate to `/audit` (preserves serverId) |
| Server | Grid/Layers | Opens ServerPopover as bottom sheet |

**Styling:**
- `bg-header` with `glass` effect and top border `border-subtle`
- Active tab: `brand-primary` icon color + dot indicator below
- Inactive: `text-secondary` icon color
- Safe area padding for notched devices (`pb-safe` / `env(safe-area-inset-bottom)`)
- 64px height

**Header changes:** On mobile (`md:hidden` / `md:flex`), hide the nav links and server selector from the top header. Keep logo + ThemeToggle.

## Phase 2: Loading States

### `loading.tsx` files (Next.js App Router convention)

**`app/(dashboard)/settings/loading.tsx`:**
- "Settings" heading skeleton
- 3-column grid (responsive: 1→2→3 cols) of card skeletons
- Each card skeleton: icon circle + text lines + toggle placeholder
- Uses stagger animation classes

**`app/(dashboard)/audit/loading.tsx`:**
- "Audit Log" heading skeleton
- Table skeleton: header row + 8 body rows
- Each row: 5 column skeletons with varying widths
- Stagger animation on rows

**`app/(dashboard)/loading.tsx`:**
- Fallback for the dashboard layout itself
- Centered brand logo with `glow-pulse` animation
- "Loading..." text in `text-secondary`

### Home page loading

The home page (`app/page.tsx`) is a server component that fetches guilds. Add a `<Suspense>` boundary around the `<ServerSelector>` (guild cards) with a skeleton fallback:
- 3-column grid of card skeletons matching ServerSelector card dimensions
- Gradient shimmer matching the mesh background

## Phase 3: Error States

### `error.tsx` files (Next.js App Router convention)

**`app/(dashboard)/error.tsx`:**
- Uses `ErrorCard` component
- Title: "Oops! Something broke"
- Message: "We hit an unexpected error. Our camera must need new batteries."
- Retry button calls `reset()` (Next.js error boundary prop)
- Centered in page with `fade-up` animation

**`app/(dashboard)/settings/error.tsx`:**
- ErrorCard with settings-specific message
- "Couldn't load your server settings — try refreshing."

**`app/(dashboard)/audit/error.tsx`:**
- ErrorCard with audit-specific message
- "Couldn't load the audit log — Discord might be taking a nap."

### `not-found.tsx`

**`app/not-found.tsx`:**
- Full-page centered layout with mesh background
- Large camera icon with "?" overlay
- Title: "404 — Lost in the darkroom"
- Message: "This page doesn't exist or has been moved."
- Link back to home: "Back to safety" button with `brand-primary`

### Home page error handling

The `ServerSelector` component fetches guilds via Discord API. Currently no error handling. Add:
- try/catch around the fetch in the server component
- On error: render `ErrorCard` with message "Couldn't load your servers — Discord might be having issues." and a retry link (refresh the page).

## Phase 4: Mobile Responsive

### Breakpoint strategy

Use Tailwind responsive prefixes. Key breakpoints:
- `sm` (640px): Minor spacing adjustments
- `md` (768px): Switch between mobile nav and desktop header nav
- `lg` (1024px): 3-column grids

### Header (`(dashboard)/layout.tsx`)

- Desktop (`md+`): Current layout — logo, nav links, ThemeToggle, ServerPopover
- Mobile (`<md`): Logo + ThemeToggle only. Nav moves to MobileNav bottom bar.
- Header height: consistent 64px

### Home page (`page.tsx`)

- Hero: reduce heading size on mobile (`text-3xl` → `text-2xl` on `sm`)
- Feature pills: wrap to 2 rows on mobile instead of single row
- Server cards: 1 column on mobile, 2 on `sm`, 3 on `lg`

### Settings page

- Feature cards: 1 column on mobile, 2 on `md`, 3 on `lg`
- Card padding: reduce on mobile

### Audit page

- Table: horizontal scroll wrapper on mobile with `-mx` to use full viewport width
- Reduce font size in table cells on mobile
- Pagination: full-width buttons stacked vertically on mobile

### ServerPopover on mobile

When triggered from MobileNav, render as a **bottom sheet** instead of a dropdown:
- Slides up from bottom of screen
- Full viewport width, max-height 60vh
- Drag handle at top (small rounded bar)
- Same content as desktop popover (search + server list)
- Backdrop overlay with dismiss on tap

## Phase 5: Page-Level Polish

### Audit log table improvements

- **Action badges:** Color-coded by action type:
  - UPDATE: `brand-primary/15` bg + `brand-primary` text
  - DELETE_SCHEDULE: `brand-accent/15` bg + `brand-accent` text
  - ENABLE_SCHEDULE: `brand-secondary/15` bg + `brand-secondary` text (green-ish)
  - DISABLE_SCHEDULE: `brand-highlight/20` bg + `brand-dark` text
- **Relative timestamps:** Show "2 minutes ago", "Yesterday at 3:15 PM" instead of raw date strings. Full timestamp on hover (title attribute).
- **Row hover:** Subtle `brand-primary/5` background on hover
- **Sticky header:** Table header row sticks on scroll

### Settings page feedback

- On successful feature toggle: show `success` toast — "Feature [name] enabled/disabled"
- On failed toggle: show `error` toast with retry action (replaces current `alert()`)
- Add subtle scale animation on the toggle component when state changes

### Login button states

- **Loading state:** After click, show a spinner replacing the Discord icon, text changes to "Connecting...", button becomes non-interactive (`pointer-events-none`, reduced opacity)
- **Disabled state:** If somehow rendered when already authenticated, show disabled styling

### Keyboard shortcuts

- `Escape`: Close any open popover/sheet
- Focus management: After closing ServerPopover, return focus to trigger button
- Tab order: Logical flow through header → content → pagination

## Phase 6: Minor Touches

### Favicon and OG metadata

- Favicon: Simple camera icon in brand-primary on transparent background. Generate as SVG favicon (`<link rel="icon" type="image/svg+xml">`).
- OG image: Static 1200x630 image with Bubblegum Sky mesh gradient, "Photobot" title, camera icon. Place in `public/og.png`.
- Add to root `layout.tsx` metadata: `openGraph.images`, `twitter.card`, `icons`.

### Scroll-to-top on pagination

In the audit page, after clicking Previous/Next pagination links, scroll to top of the table. Use `scrollIntoView({ behavior: 'smooth' })` on the table container ref.

### Grain overlay readability

The grain overlay at 25% opacity (light) / 40% (dark) slightly hurts readability on text-heavy pages. Adjustments:
- Reduce grain opacity: 15% light / 25% dark
- Add `pointer-events-none` (already present, verify)
- Exclude grain from within cards by giving cards a solid background (they already have `bg-card`, just ensure no transparency)

## File Map

### New Files
| File | Purpose |
|------|---------|
| `components/Skeleton.tsx` | Shimmer skeleton primitive |
| `components/ErrorCard.tsx` | Branded error display |
| `components/Toast.tsx` | Toaster provider + useToast hook |
| `components/ServerPopover.tsx` | Popover server selector (desktop + mobile bottom sheet) |
| `components/MobileNav.tsx` | Fixed bottom tab bar for mobile |
| `app/(dashboard)/loading.tsx` | Dashboard layout loading state |
| `app/(dashboard)/settings/loading.tsx` | Settings page skeleton |
| `app/(dashboard)/audit/loading.tsx` | Audit page skeleton |
| `app/(dashboard)/error.tsx` | Dashboard error boundary |
| `app/(dashboard)/settings/error.tsx` | Settings error boundary |
| `app/(dashboard)/audit/error.tsx` | Audit error boundary |
| `app/not-found.tsx` | 404 page |
| `public/icon.svg` | SVG favicon |
| `public/og.png` | OG share image |

### Modified Files
| File | Changes |
|------|---------|
| `app/layout.tsx` | Add Toaster, update metadata (favicon, OG) |
| `app/page.tsx` | Suspense boundary for guild cards, mobile responsive classes, login button loading state |
| `app/(dashboard)/layout.tsx` | Replace select with ServerPopover, add MobileNav, responsive header |
| `app/(dashboard)/settings/page.tsx` | Toast on toggle success/error, responsive grid |
| `app/(dashboard)/audit/page.tsx` | Action badges, relative timestamps, sticky header, scroll-to-top, responsive table |
| `components/LoginButton.tsx` | Loading/disabled states |
| `components/feature-toggle.tsx` | Toast integration, scale animation |
| `components/server-selector.tsx` | Remove (replaced by ServerPopover) |
| `app/globals.css` | Reduce grain opacity, add bottom-sheet animation keyframes, safe-area utilities |
| `tailwind.config.ts` | Add safe-area spacing utilities if needed |

### Test Files
| File | Changes |
|------|---------|
| `__tests__/server-selector-client.test.tsx` | Rewrite for ServerPopover |
| `__tests__/feature-toggle.test.tsx` | Add toast assertion |
| `__tests__/settings.test.tsx` | Update for toast behavior |
| `__tests__/audit.test.tsx` | Update for relative timestamps, action badges |
| `__tests__/home.test.tsx` | Add loading state test |

## Testing Strategy

- Unit tests: Each new component (Skeleton, ErrorCard, Toast, ServerPopover, MobileNav)
- Integration tests: Update existing page tests for new behaviors
- Manual verification: Theme toggle in both themes, mobile viewport in browser devtools, keyboard navigation flow
