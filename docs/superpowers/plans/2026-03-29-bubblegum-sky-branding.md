# Bubblegum Sky Branding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the Bubblegum Sky color palette across all Photobot surfaces — dashboard (with light/dark theme toggle), Discord bot embeds, and generated images.

**Architecture:** CSS variables define light/dark semantic tokens in `globals.css`, Tailwind config extends with brand colors + CSS variable references, a `ThemeToggle` client component manages the `.dark` class on `<html>`. Bot commands use embeds with the brand color constant.

**Tech Stack:** Tailwind CSS, CSS custom properties, Next.js 14 App Router, discord.js EmbedBuilder, Sharp SVG

---

## File Structure

### New Files
- `apps/dashboard/src/components/ThemeToggle.tsx` — client component, sun/moon toggle
- `apps/bot/src/constants.ts` — `BRAND_COLOR` constant for embed sidebar

### Modified Files
- `apps/dashboard/src/app/globals.css` — replace CSS variables with Bubblegum Sky tokens
- `apps/dashboard/tailwind.config.ts` — extend with brand colors + semantic tokens
- `apps/dashboard/src/app/layout.tsx` — anti-flash script, body class updates
- `apps/dashboard/src/app/page.tsx` — swap all color classes to brand tokens
- `apps/dashboard/src/components/LoginButton.tsx` — brand accent color
- `apps/dashboard/src/app/(dashboard)/layout.tsx` — header branding, add ThemeToggle
- `apps/dashboard/src/components/ServerSelector.tsx` — card branding
- `apps/dashboard/src/components/server-selector.tsx` — select branding
- `apps/dashboard/src/components/feature-toggle.tsx` — toggle colors
- `apps/dashboard/src/app/(dashboard)/settings/page.tsx` — card/warning branding
- `apps/dashboard/src/app/(dashboard)/audit/page.tsx` — table/badge branding
- `apps/bot/src/commands/critique.ts` — wrap response in branded embed
- `apps/bot/src/commands/palette.ts` — wrap response in branded embed, SVG border

---

### Task 1: CSS Variables and Tailwind Config

**Files:**
- Modify: `apps/dashboard/src/app/globals.css`
- Modify: `apps/dashboard/tailwind.config.ts`

- [ ] **Step 1: Replace globals.css with Bubblegum Sky tokens**

Replace the entire contents of `apps/dashboard/src/app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

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

body {
  color: var(--text-primary);
  background: var(--bg-page);
  font-family: Arial, Helvetica, sans-serif;
}
```

- [ ] **Step 2: Update tailwind.config.ts with brand colors**

Replace the entire contents of `apps/dashboard/tailwind.config.ts` with:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
        DEFAULT: 'var(--border-default)',
        subtle: 'var(--border-subtle)',
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 3: Verify the build compiles**

Run: `pnpm --filter @photobot/dashboard build`
Expected: Build succeeds (pages may look wrong until classes are swapped — that's expected)

- [ ] **Step 4: Commit**

```bash
git add apps/dashboard/src/app/globals.css apps/dashboard/tailwind.config.ts
git commit -m "feat: add Bubblegum Sky CSS variables and Tailwind brand colors"
```

---

### Task 2: Theme Toggle Component

**Files:**
- Create: `apps/dashboard/src/components/ThemeToggle.tsx`

- [ ] **Step 1: Create ThemeToggle component**

Create `apps/dashboard/src/components/ThemeToggle.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-brand-primary/10 transition-colors"
    >
      {dark ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/dashboard/src/components/ThemeToggle.tsx
git commit -m "feat: add ThemeToggle component with localStorage persistence"
```

---

### Task 3: Root Layout — Anti-Flash Script

**Files:**
- Modify: `apps/dashboard/src/app/layout.tsx`

- [ ] **Step 1: Update layout.tsx with anti-flash script and theme-aware body**

Replace the entire contents of `apps/dashboard/src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Photobot Dashboard",
  description: "Admin panel for Photobot",
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
            __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}})()`,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/dashboard/src/app/layout.tsx
git commit -m "feat: add anti-flash theme script to root layout"
```

---

### Task 4: Landing Page Branding

**Files:**
- Modify: `apps/dashboard/src/app/page.tsx`
- Modify: `apps/dashboard/src/components/LoginButton.tsx`

- [ ] **Step 1: Update page.tsx with brand colors**

Replace the entire contents of `apps/dashboard/src/app/page.tsx` with:

```tsx
import { LucideCamera } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth";
import { ServerSelector } from "../components/ServerSelector";
import { LoginButton } from "../components/LoginButton";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-page text-primary">
      <div className="z-10 max-w-7xl w-full flex flex-col gap-12 mt-16">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="p-4 bg-brand-primary rounded-3xl shadow-xl shadow-brand-primary/20">
            <LucideCamera className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-primary">
            Photobot Dashboard
          </h1>
          <p className="text-xl max-w-2xl text-secondary">
            Empowering photography communities with AI-driven mentorship, trivia, and automated critiques.
          </p>

          {!session && (
            <div className="flex gap-4 mt-4">
              <LoginButton />
            </div>
          )}
        </div>

        {session && (
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between border-b border-subtle pb-6">
              <h2 className="text-3xl font-bold text-primary">Your Servers</h2>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-secondary">Logged in as</p>
                  <p className="font-bold text-primary">{session.user?.name || session.user?.email}</p>
                </div>
                {session.user?.image && (
                  <img src={session.user.image} alt="" className="w-10 h-10 rounded-full border-2 border-card shadow-sm" />
                )}
              </div>
            </div>
            <ServerSelector />
          </div>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Update LoginButton.tsx with brand accent**

Replace the entire contents of `apps/dashboard/src/components/LoginButton.tsx` with:

```tsx
"use client";

import { signIn } from "next-auth/react";

export function LoginButton() {
  return (
    <button
      onClick={() => signIn("discord")}
      className="bg-brand-accent hover:bg-brand-accent/90 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-brand-accent/20 transition-all hover:scale-105"
    >
      Login with Discord
    </button>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/dashboard/src/app/page.tsx apps/dashboard/src/components/LoginButton.tsx
git commit -m "feat: apply Bubblegum Sky branding to landing page and login button"
```

---

### Task 5: Dashboard Layout and Header

**Files:**
- Modify: `apps/dashboard/src/app/(dashboard)/layout.tsx`
- Modify: `apps/dashboard/src/components/server-selector.tsx`

- [ ] **Step 1: Update dashboard layout with brand header and ThemeToggle**

Replace the entire contents of `apps/dashboard/src/app/(dashboard)/layout.tsx` with:

```tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAdminGuilds } from "@/lib/discord";
import { ServerSelector } from "@/components/server-selector";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

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
    <div className="min-h-screen bg-page">
      <header className="bg-header border-b border-subtle sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-xl text-brand-primary">Photobot</Link>
            <nav className="flex gap-4">
              <Link href="/settings" className="text-sm font-medium text-secondary hover:text-primary">Settings</Link>
              <Link href="/audit" className="text-sm font-medium text-secondary hover:text-primary">Audit Log</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <ServerSelector guilds={adminGuilds} />
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
```

- [ ] **Step 2: Update server-selector.tsx (dropdown) with brand colors**

Replace the entire contents of `apps/dashboard/src/components/server-selector.tsx` with:

```tsx
'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { DiscordGuild } from '@/lib/discord';

export function ServerSelector({ guilds }: { guilds: DiscordGuild[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentServerId = searchParams.get('serverId');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const serverId = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (serverId) {
      params.set('serverId', serverId);
    } else {
      params.delete('serverId');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      value={currentServerId || ''}
      onChange={handleChange}
      className="block w-full pl-3 pr-10 py-2 text-base border border-subtle bg-card text-primary focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md"
    >
      <option value="">Select a server...</option>
      {guilds.map((guild) => (
        <option key={guild.id} value={guild.id}>
          {guild.name}
        </option>
      ))}
    </select>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/dashboard/src/app/\(dashboard\)/layout.tsx apps/dashboard/src/components/server-selector.tsx
git commit -m "feat: apply Bubblegum Sky branding to dashboard header and server selector"
```

---

### Task 6: Server Cards Branding

**Files:**
- Modify: `apps/dashboard/src/components/ServerSelector.tsx`

- [ ] **Step 1: Update ServerSelector.tsx (cards) with brand colors**

Replace the entire contents of `apps/dashboard/src/components/ServerSelector.tsx` with:

```tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth";
import Link from "next/link";

export async function ServerSelector() {
  const session = await getServerSession(authOptions);
  if (!session || !(session as any).accessToken) {
    return (
      <div className="text-secondary p-8 border border-dashed border-subtle rounded-xl text-center">
        Please log in with Discord to view and manage your servers.
      </div>
    );
  }

  try {
    const response = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${(session as any).accessToken}`,
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return (
          <div className="text-red-500 p-8 border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-xl text-center">
            Your Discord session has expired. Please log out and log in again.
          </div>
        );
      }
      return (
        <div className="text-red-500 p-8 border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-xl text-center">
          Failed to fetch servers from Discord ({response.status}). Please try again later.
        </div>
      );
    }

    const guilds: Array<{
      id: string;
      name: string;
      icon: string | null;
      permissions: string;
      owner: boolean;
    }> = await response.json();

    const MANAGE_GUILD = BigInt(0x20);
    const ADMINISTRATOR = BigInt(0x8);

    const manageableGuilds = guilds.filter((guild) => {
      const permissions = BigInt(guild.permissions);
      return (
        guild.owner ||
        (permissions & MANAGE_GUILD) === MANAGE_GUILD ||
        (permissions & ADMINISTRATOR) === ADMINISTRATOR
      );
    });

    if (manageableGuilds.length === 0) {
      return (
        <div className="text-secondary p-8 border border-dashed border-subtle rounded-xl text-center">
          You don't have administrative permissions on any Discord servers where Photobot is active.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
        {manageableGuilds.map((guild) => (
          <div
            key={guild.id}
            className="flex flex-col p-6 bg-card rounded-2xl border border-subtle shadow-lg hover:shadow-xl hover:border-brand-primary/40 transition-all group"
          >
            <div className="flex items-center gap-4 mb-6 overflow-hidden">
              {guild.icon ? (
                <img
                  src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                  alt={guild.name}
                  className="w-14 h-14 rounded-2xl flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center font-bold text-white text-xl flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  {guild.name.charAt(0)}
                </div>
              )}
              <h3 className="font-bold text-lg text-primary truncate" title={guild.name}>
                {guild.name}
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-auto">
              <Link
                href={`/settings?serverId=${guild.id}`}
                className="flex items-center justify-center py-2 px-4 bg-brand-primary/10 text-brand-dark dark:text-brand-primary hover:bg-brand-primary hover:text-white rounded-lg font-semibold text-sm transition-colors"
              >
                Settings
              </Link>
              <Link
                href={`/audit?serverId=${guild.id}`}
                className="flex items-center justify-center py-2 px-4 bg-brand-secondary/20 text-brand-dark dark:text-brand-secondary hover:bg-brand-dark hover:text-white rounded-lg font-semibold text-sm transition-colors"
              >
                Audit Logs
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error fetching guilds:", error);
    return (
      <div className="text-red-500 p-8 border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-xl text-center">
        An error occurred while fetching your servers.
      </div>
    );
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/dashboard/src/components/ServerSelector.tsx
git commit -m "feat: apply Bubblegum Sky branding to server cards"
```

---

### Task 7: Settings and Audit Pages

**Files:**
- Modify: `apps/dashboard/src/components/feature-toggle.tsx`
- Modify: `apps/dashboard/src/app/(dashboard)/settings/page.tsx`
- Modify: `apps/dashboard/src/app/(dashboard)/audit/page.tsx`

- [ ] **Step 1: Update feature-toggle.tsx with brand toggle colors**

Replace the entire contents of `apps/dashboard/src/components/feature-toggle.tsx` with:

```tsx
'use client';

import { useState, useTransition } from 'react';
import { updateFeatureAction } from '@/lib/actions';

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

  const handleToggle = async () => {
    const nextState = !isEnabled;
    setIsEnabled(nextState);

    startTransition(async () => {
      try {
        await updateFeatureAction(serverId, featureKey, nextState);
      } catch (error) {
        setIsEnabled(!nextState);
        alert('Failed to update feature');
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      aria-pressed={isEnabled}
      aria-label={`Toggle ${featureKey}`}
      className={`w-12 h-6 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary ${isEnabled ? 'bg-[var(--toggle-on)]' : 'bg-[var(--toggle-off)]'} ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isEnabled ? 'left-7' : 'left-1'}`} />
    </button>
  );
}
```

- [ ] **Step 2: Update settings/page.tsx with brand colors**

Replace the entire contents of `apps/dashboard/src/app/(dashboard)/settings/page.tsx` with:

```tsx
import { prisma } from '@photobot/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getAdminGuilds } from '@/lib/discord';
import { FeatureToggle } from '@/components/feature-toggle';

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: { serverId?: string };
}) {
  const session = await getServerSession(authOptions);
  const serverId = searchParams.serverId;

  if (serverId) {
    const adminGuilds = await getAdminGuilds(session?.accessToken as string);
    if (!adminGuilds.some(g => g.id === serverId)) {
      return <div className="p-8 text-red-500">Access Denied: You are not an admin of this server.</div>;
    }
  }

  const features = serverId ? await prisma.featureConfig.findMany({
    where: { serverId, targetType: 'SERVER' },
    orderBy: { featureKey: 'asc' },
  }) : [];

  const availableFeatures = ['critique', 'palette', 'settings'];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-primary">Settings</h1>

      {!serverId ? (
        <div className="bg-brand-highlight/20 border-l-4 border-brand-highlight p-4 mb-8">
          <p className="text-primary">Please select a server to manage its settings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableFeatures.map((key) => {
            const config = features.find(f => f.featureKey === key);
            return (
              <div key={key} className="p-6 bg-card rounded-xl border border-subtle shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold capitalize text-primary">{key}</h3>
                  <FeatureToggle
                    serverId={serverId}
                    featureKey={key}
                    initialEnabled={config?.isEnabled ?? true}
                  />
                </div>
                <p className="text-sm text-secondary mb-4">
                  Status: {config?.isEnabled !== false ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Update audit/page.tsx with brand colors**

Replace the entire contents of `apps/dashboard/src/app/(dashboard)/audit/page.tsx` with:

```tsx
import { prisma } from '@photobot/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getAdminGuilds } from '@/lib/discord';
import Link from 'next/link';

export default async function AuditPage({
  searchParams,
}: {
  searchParams: { serverId?: string; page?: string };
}) {
  const session = await getServerSession(authOptions);
  const serverId = searchParams.serverId;

  if (!serverId) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-primary">Audit Log</h1>
        <div className="bg-brand-highlight/20 border-l-4 border-brand-highlight p-4">
          <p className="text-primary">Please select a server to view its audit logs.</p>
        </div>
      </div>
    );
  }

  const adminGuilds = await getAdminGuilds(session?.accessToken as string);
  if (!adminGuilds.some(g => g.id === serverId)) {
    return <div className="p-8 text-red-500">Access Denied.</div>;
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
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-primary">Audit Log</h1>

      <div className="bg-card rounded-xl border border-subtle shadow-sm overflow-hidden mb-6">
        <table className="min-w-full divide-y divide-[var(--border-subtle)]">
          <thead className="bg-page">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Feature</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-[var(--border-subtle)]">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                  {log.userId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  <span className={`px-2 py-1 rounded-full text-xs ${log.action === 'UPDATE' ? 'bg-brand-accent/20 text-brand-accent' : 'bg-brand-secondary/20 text-primary'}`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary capitalize">
                  {log.featureKey}
                </td>
                <td className="px-6 py-4 text-sm text-secondary">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-secondary/60">Target: {log.targetType} ({log.targetId})</span>
                    <span className="text-xs">
                      {JSON.stringify(log.oldValue)} &rarr; {JSON.stringify(log.newValue)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-secondary">
                  No audit logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/audit?serverId=${serverId}&page=${page - 1}`}
              className="px-4 py-2 border border-subtle rounded-lg hover:bg-card text-primary"
            >
              Previous
            </Link>
          )}
          <span className="px-4 py-2 text-primary">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/audit?serverId=${serverId}&page=${page + 1}`}
              className="px-4 py-2 border border-subtle rounded-lg hover:bg-card text-primary"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/dashboard/src/components/feature-toggle.tsx apps/dashboard/src/app/\(dashboard\)/settings/page.tsx apps/dashboard/src/app/\(dashboard\)/audit/page.tsx
git commit -m "feat: apply Bubblegum Sky branding to settings, audit, and feature toggle"
```

---

### Task 8: Discord Bot Branding

**Files:**
- Create: `apps/bot/src/constants.ts`
- Modify: `apps/bot/src/commands/critique.ts`
- Modify: `apps/bot/src/commands/palette.ts`

- [ ] **Step 1: Create brand constants file**

Create `apps/bot/src/constants.ts`:

```ts
export const BRAND_COLOR = 0x74D7EC;
```

- [ ] **Step 2: Update critique.ts to use branded embed**

Replace the entire contents of `apps/bot/src/commands/critique.ts` with:

```ts
import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { bouncerService, aiProvider } from '../services/ai';
import { BRAND_COLOR } from '../constants';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';

export const data = new SlashCommandBuilder()
  .setName('critique')
  .setDescription('Get technical feedback on an uploaded image')
  .addAttachmentOption(option =>
    option.setName('image')
      .setDescription('The image to critique')
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const attachment = interaction.options.getAttachment('image');

  if (!attachment || !attachment.contentType?.startsWith('image/')) {
    return interaction.reply({ content: 'Please attach an image to critique.', ephemeral: true });
  }

  await interaction.deferReply();

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'photobot-'));
  const tempPath = path.join(tempDir, attachment.name);

  try {
    // Download image
    const response = await fetch(attachment.url);
    if (!response.ok) throw new Error('Failed to download image.');
    const arrayBuffer = await response.arrayBuffer();
    await fs.writeFile(tempPath, Buffer.from(arrayBuffer));

    // Rate Limit Check
    const rateLimit = await bouncerService.checkRateLimit(interaction.user.id);
    if (!rateLimit.allowed) {
      return interaction.editReply(`Rate limit exceeded. Please try again later.`);
    }

    // Moderation Check
    const moderation = await bouncerService.moderateImage(tempPath);
    if (!moderation.allowed) {
      return interaction.editReply(moderation.reason || 'Image violated safety guidelines.');
    }

    // Layer 2 Analysis: Critique
    const prompt = `Provide a detailed technical critique of this photograph.
    Focus on composition, lighting, focus, and technical execution.
    Be constructive and professional.`;

    const analysis = await aiProvider.analyzeImage(tempPath, prompt);

    const embed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle('Photo Critique')
      .setDescription(analysis)
      .setThumbnail(attachment.url)
      .setFooter({ text: 'Photobot' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });

  } catch (error) {
    console.error('Critique command error:', error);
    await interaction.editReply('There was an error while processing your image.');
  } finally {
    // Cleanup
    try {
      await fs.unlink(tempPath);
      await fs.rmdir(tempDir);
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }
  }
}
```

- [ ] **Step 3: Update palette.ts to use branded embed and SVG border**

Replace the entire contents of `apps/bot/src/commands/palette.ts` with:

```ts
import { SlashCommandBuilder, ChatInputCommandInteraction, AttachmentBuilder, EmbedBuilder } from 'discord.js';
import { bouncerService, aiProvider } from '../services/ai';
import { BRAND_COLOR } from '../constants';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';
import sharp from 'sharp';

export const data = new SlashCommandBuilder()
  .setName('palette')
  .setDescription('Extract a 5-color hex code palette from an image')
  .addAttachmentOption(option =>
    option.setName('image')
      .setDescription('The image to extract a palette from')
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const attachment = interaction.options.getAttachment('image');

  if (!attachment || !attachment.contentType?.startsWith('image/')) {
    return interaction.reply({ content: 'Please attach an image to extract a palette from.', ephemeral: true });
  }

  await interaction.deferReply();

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'photobot-'));
  const tempPath = path.join(tempDir, attachment.name);
  const palettePath = path.join(tempDir, 'palette.png');

  try {
    // Download image
    const response = await fetch(attachment.url);
    if (!response.ok) throw new Error('Failed to download image.');
    const arrayBuffer = await response.arrayBuffer();
    await fs.writeFile(tempPath, Buffer.from(arrayBuffer));

    // Rate Limit Check
    const rateLimit = await bouncerService.checkRateLimit(interaction.user.id);
    if (!rateLimit.allowed) {
      return interaction.editReply(`Rate limit exceeded. Please try again later.`);
    }

    // Moderation Check
    const moderation = await bouncerService.moderateImage(tempPath);
    if (!moderation.allowed) {
      return interaction.editReply(moderation.reason || 'Image violated safety guidelines.');
    }

    // AI Color Extraction
    const prompt = `Extract exactly five dominant colors from this image.
    Return them as a comma-separated list of hex codes (e.g., #FFFFFF, #000000, ...).
    Do not include any other text.`;

    const colorText = await aiProvider.analyzeImage(tempPath, prompt);
    const hexCodes = colorText.match(/#[0-9A-Fa-f]{6}/g);

    if (!hexCodes || hexCodes.length < 5) {
      return interaction.editReply('Could not extract a valid 5-color palette.');
    }

    const finalHexCodes = hexCodes.slice(0, 5);

    // Create a branded 5-color graphic using Sharp
    const width = 500;
    const height = 120;
    const borderSize = 4;
    const colorWidth = (width - borderSize * 2) / 5;
    const colorHeight = height - borderSize * 2;

    const svg = `
      <svg width="${width}" height="${height}">
        <rect x="0" y="0" width="${width}" height="${height}" rx="8" fill="#74D7EC" />
        ${finalHexCodes.map((color, i) => `
          <rect x="${borderSize + i * colorWidth}" y="${borderSize}" width="${colorWidth}" height="${colorHeight}" fill="${color}" ${i === 0 ? 'rx="6"' : ''} ${i === 4 ? 'rx="6"' : ''} />
        `).join('')}
      </svg>
    `;

    await sharp(Buffer.from(svg))
      .png()
      .toFile(palettePath);

    const attachmentBuilder = new AttachmentBuilder(palettePath, { name: 'palette.png' });

    const embed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle('Color Palette')
      .setDescription(finalHexCodes.join(' • '))
      .setImage('attachment://palette.png')
      .setFooter({ text: 'Photobot' })
      .setTimestamp();

    await interaction.editReply({
      embeds: [embed],
      files: [attachmentBuilder]
    });

  } catch (error) {
    console.error('Palette command error:', error);
    await interaction.editReply('There was an error while processing your image.');
  } finally {
    // Cleanup
    try {
      await fs.unlink(tempPath).catch(() => {});
      await fs.unlink(palettePath).catch(() => {});
      await fs.rmdir(tempDir).catch(() => {});
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/bot/src/constants.ts apps/bot/src/commands/critique.ts apps/bot/src/commands/palette.ts
git commit -m "feat: apply Bubblegum Sky branding to Discord bot embeds and palette SVG"
```

---

### Task 9: Verify Build and Tests

- [ ] **Step 1: Build the dashboard**

Run: `pnpm --filter @photobot/dashboard build`
Expected: Build succeeds with no errors

- [ ] **Step 2: Run all tests**

Run: `pnpm test`
Expected: All tests pass (no color-specific assertions in existing tests)

- [ ] **Step 3: Commit any test fixes if needed**

If any tests failed due to class name changes, fix and commit:

```bash
git add -u
git commit -m "fix: update test assertions for Bubblegum Sky branding"
```
