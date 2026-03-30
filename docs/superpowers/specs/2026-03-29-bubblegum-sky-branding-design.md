# Bubblegum Sky Branding Spec

Apply the "Bubblegum Sky" color palette across all Photobot surfaces: dashboard, Discord bot embeds, and generated images.

## Palette

| Name        | Hex     | Role                                      |
|-------------|---------|-------------------------------------------|
| Aqua Pop    | #74D7EC | Primary buttons, headers, toggle-on state |
| Flamingo    | #FF85C8 | CTAs, badges, accent elements             |
| Sea Glass   | #A8EDEA | Backgrounds, cards, subtle fills          |
| Banana      | #FFF176 | Highlights, tags, status badges           |
| Ocean Deep  | #1E3A5F | Text, footers, dark theme base            |

## Color System (CSS Variables + Tailwind)

Define CSS variables in `globals.css` with two sets: light (`:root`) and dark (`.dark`).

### Light Theme (default)

```css
:root {
  --brand-primary: #74D7EC;
  --brand-accent: #FF85C8;
  --brand-secondary: #A8EDEA;
  --brand-highlight: #FFF176;
  --brand-dark: #1E3A5F;

  --bg-page: #f8fffe;
  --bg-card: #ffffff;
  --bg-header: #ffffff;
  --text-primary: #1E3A5F;
  --text-secondary: #1E3A5Faa;
  --border-default: #A8EDEA;
  --border-subtle: #A8EDEA60;
  --toggle-on: #74D7EC;
  --toggle-off: #ccd5db;
}
```

### Dark Theme

```css
.dark {
  --bg-page: #1E3A5F;
  --bg-card: #253f5f;
  --bg-header: #152d4a;
  --text-primary: #f0f8ff;
  --text-secondary: #A8EDEA;
  --border-default: #74D7EC40;
  --border-subtle: #74D7EC20;
  --toggle-on: #74D7EC;
  --toggle-off: #3a5070;
}
```

### Tailwind Config

Extend `tailwind.config.ts` to map CSS variables as Tailwind colors:

```ts
colors: {
  brand: {
    primary: '#74D7EC',
    accent: '#FF85C8',
    secondary: '#A8EDEA',
    highlight: '#FFF176',
    dark: '#1E3A5F',
  },
  page: 'var(--bg-page)',
  card: 'var(--bg-card)',
  header: 'var(--bg-header)',
},
textColor: {
  primary: 'var(--text-primary)',
  secondary: 'var(--text-secondary)',
},
borderColor: {
  default: 'var(--border-default)',
  subtle: 'var(--border-subtle)',
},
```

## Theme Toggle

- `ThemeToggle.tsx` client component: sun/moon icon button
- Reads `localStorage('theme')` on mount, falls back to `window.matchMedia('(prefers-color-scheme: dark)')`
- Toggles `.dark` class on `<html>`, saves preference to `localStorage`
- Placed in dashboard header alongside nav links
- Anti-flash inline script in `layout.tsx` `<head>` applies saved theme before paint

### Anti-flash script

```html
<script>
  (function() {
    var t = localStorage.getItem('theme');
    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  })();
</script>
```

## Dashboard File Changes

| File | Changes |
|------|---------|
| `globals.css` | Replace current CSS variables with Bubblegum Sky light/dark tokens |
| `tailwind.config.ts` | Extend colors with brand palette and semantic tokens |
| `layout.tsx` | Add anti-flash script in `<head>`, update body classes |
| `(dashboard)/layout.tsx` | Header: `bg-header`, `border-default`, brand nav colors. Add `ThemeToggle` |
| `page.tsx` | Hero background, heading, icon, all use brand tokens |
| `LoginButton.tsx` | `bg-brand-accent` replaces `bg-blue-600` |
| `ServerSelector.tsx` | Card borders: `border-default`, icon backgrounds: `brand-primary`/`brand-accent` |
| `feature-toggle.tsx` | Toggle on: `toggle-on` variable, focus ring: `brand-primary` |
| `settings/page.tsx` | Cards: `bg-card`, warning: `brand-highlight` tinted |
| `audit/page.tsx` | Table header: `bg-card`, badges: `brand-accent` tinted |

### New file

| File | Purpose |
|------|---------|
| `components/ThemeToggle.tsx` | Sun/moon toggle button, client component |

## Discord Bot Branding

### Embed color

All bot embeds use `0x74D7EC` (Aqua Pop) as the sidebar color.

### New file

| File | Purpose |
|------|---------|
| `apps/bot/src/constants.ts` | `BRAND_COLOR = 0x74D7EC` |

### Modified files

| File | Changes |
|------|---------|
| `apps/bot/src/commands/palette.ts` | Wrap response in embed with `BRAND_COLOR`, add branded border to SVG |
| `apps/bot/src/commands/critique.ts` | Wrap response in embed with `BRAND_COLOR` |

## Color Mapping Reference

Current class → New class:

| Current | New |
|---------|-----|
| `bg-gray-50` | `bg-page` |
| `bg-white` | `bg-card` |
| `bg-blue-600` | `bg-brand-primary` |
| `bg-blue-700` (hover) | `bg-brand-primary` with opacity or darken |
| `text-gray-900` | `text-primary` |
| `text-gray-600` / `text-gray-500` | `text-secondary` |
| `text-blue-600` | `text-brand-primary` |
| `border-gray-200` | `border-default` |
| `border-gray-100` | `border-subtle` |
| `bg-green-500` (toggle) | `bg-[var(--toggle-on)]` |
| `bg-gray-300` (toggle off) | `bg-[var(--toggle-off)]` |
| `shadow-blue-*` | `shadow-brand-primary/20` |
| `bg-blue-50` | `bg-brand-primary/10` |
| `bg-yellow-50` | `bg-brand-highlight/20` |
| `bg-blue-100 text-blue-800` (badges) | `bg-brand-accent/20 text-brand-accent` |

## Testing

- Update existing test assertions if any reference specific Tailwind color classes
- Theme toggle verified visually (client-side localStorage + class toggle)
- Bot embed formatting not tested in existing tests — no changes needed
- Manual verification: toggle theme in browser, run `/palette` and `/critique` in Discord
