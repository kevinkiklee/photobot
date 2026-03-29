# Feature Management & Audit View Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement robust server-specific authorization, interactive feature toggles with audit logging, and a server selection UI for the photography bot dashboard.

**Architecture:** Use a Next.js Route Group `(dashboard)` to share a layout that handles authorization. Fetch user guilds from Discord API to verify `ADMINISTRATOR` permissions. Use Server Actions for persistent feature updates and audit logging.

**Tech Stack:** Next.js 14 (App Router), NextAuth.js, Prisma, Tailwind CSS, Discord API.

---

### Task 1: Discord API Integration & Authorization Utility

**Files:**
- Create: `apps/dashboard/src/lib/discord.ts`
- Test: `apps/dashboard/src/__tests__/discord.test.ts`

- [ ] **Step 1: Write the failing test for Discord guild fetching**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { getAdminGuilds } from '../lib/discord';

global.fetch = vi.fn();

describe('Discord Lib', () => {
  it('filters guilds for ADMINISTRATOR permission', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [
        { id: '1', name: 'Admin Guild', permissions: '8' }, // 0x8 is ADMIN
        { id: '2', name: 'User Guild', permissions: '0' },
      ],
    });

    const guilds = await getAdminGuilds('fake-token');
    expect(guilds).toHaveLength(1);
    expect(guilds[0].id).toBe('1');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest apps/dashboard/src/__tests__/discord.test.ts`

- [ ] **Step 3: Implement `getAdminGuilds`**

```typescript
export interface DiscordGuild {
  id: string;
  name: string;
  permissions: string;
  icon?: string;
}

const ADMINISTRATOR_PERMISSION = 0x8;

export async function getAdminGuilds(accessToken: string): Promise<DiscordGuild[]> {
  const response = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) return [];

  const guilds: DiscordGuild[] = await response.json();
  return guilds.filter(guild => 
    (BigInt(guild.permissions) & BigInt(ADMINISTRATOR_PERMISSION)) === BigInt(ADMINISTRATOR_PERMISSION)
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

- [ ] **Step 5: Commit**

```bash
git add apps/dashboard/src/lib/discord.ts apps/dashboard/src/__tests__/discord.test.ts
git commit -m "feat: add discord guild authorization utility"
```

---

### Task 2: Shared Dashboard Layout

**Files:**
- Create: `apps/dashboard/src/app/(dashboard)/layout.tsx`
- Move: `apps/dashboard/src/app/settings` -> `apps/dashboard/src/app/(dashboard)/settings`
- Move: `apps/dashboard/src/app/audit` -> `apps/dashboard/src/app/(dashboard)/audit`

- [ ] **Step 1: Move existing pages into the route group**

Run: `mkdir -p apps/dashboard/src/app/(dashboard) && mv apps/dashboard/src/app/settings apps/dashboard/src/app/audit apps/dashboard/src/app/(dashboard)/`

- [ ] **Step 2: Create the shared layout with authorization**

```tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAdminGuilds } from "@/lib/discord";
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-xl text-brand-600">Photobot</Link>
            <nav className="flex gap-4">
              <Link href="/settings" className="text-sm font-medium text-gray-600 hover:text-gray-900">Settings</Link>
              <Link href="/audit" className="text-sm font-medium text-gray-600 hover:text-gray-900">Audit Log</Link>
            </nav>
          </div>
          <div id="server-selector-container">
             {/* ServerSelector will be injected here in Task 3 */}
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/dashboard/src/app/(dashboard)
git commit -m "feat: add shared dashboard layout with auth"
```

---

### Task 3: Server Selector Component

**Files:**
- Create: `apps/dashboard/src/components/server-selector.tsx`
- Modify: `apps/dashboard/src/app/(dashboard)/layout.tsx`

- [ ] **Step 1: Implement `ServerSelector`**

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
      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md"
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

- [ ] **Step 2: Inject into layout**

```tsx
// In layout.tsx
import { ServerSelector } from "@/components/server-selector";
// ...
          <div id="server-selector-container">
             <ServerSelector guilds={adminGuilds} />
          </div>
// ...
```

- [ ] **Step 3: Commit**

```bash
git add apps/dashboard/src/components/server-selector.tsx apps/dashboard/src/app/(dashboard)/layout.tsx
git commit -m "feat: add server selector component"
```

---

### Task 4: Server Action for Feature Updates

**Files:**
- Create: `apps/dashboard/src/lib/actions.ts`

- [ ] **Step 1: Implement `updateFeatureAction`**

```typescript
'use server';

import { prisma } from '@photobot/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';
import { getAdminGuilds } from './discord';
import { revalidatePath } from 'next/cache';

export async function updateFeatureAction(
  serverId: string,
  featureKey: string,
  isEnabled: boolean
) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error('Unauthorized');

  const adminGuilds = await getAdminGuilds(session.accessToken as string);
  const hasAccess = adminGuilds.some(g => g.id === serverId);
  if (!hasAccess) throw new Error('Forbidden');

  const oldConfig = await prisma.featureConfig.findFirst({
    where: { serverId, featureKey },
  });

  const newConfig = await prisma.featureConfig.upsert({
    where: {
      serverId_targetType_targetId_featureKey: {
        serverId,
        targetType: 'SERVER',
        targetId: serverId,
        featureKey,
      },
    },
    update: { isEnabled },
    create: {
      serverId,
      targetType: 'SERVER',
      targetId: serverId,
      featureKey,
      isEnabled,
    },
  });

  await prisma.configAuditLog.create({
    data: {
      serverId,
      userId: (session.user as any)?.id || 'unknown',
      action: 'UPDATE',
      targetType: 'SERVER',
      targetId: serverId,
      featureKey,
      oldValue: { isEnabled: oldConfig?.isEnabled ?? true },
      newValue: { isEnabled },
    },
  });

  revalidatePath('/settings');
  revalidatePath('/audit');
  return newConfig;
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/dashboard/src/lib/actions.ts
git commit -m "feat: add updateFeatureAction server action"
```

---

### Task 5: Interactive Feature Toggle Component

**Files:**
- Create: `apps/dashboard/src/components/feature-toggle.tsx`

- [ ] **Step 1: Implement `FeatureToggle`**

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
        setIsEnabled(!nextState); // Rollback on error
        alert('Failed to update feature');
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`w-12 h-6 rounded-full relative transition-colors ${isEnabled ? 'bg-green-500' : 'bg-gray-300'} ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isEnabled ? 'left-7' : 'left-1'}`} />
    </button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/dashboard/src/components/feature-toggle.tsx
git commit -m "feat: add interactive feature toggle component"
```

---

### Task 6: Refactor Settings Page

**Files:**
- Modify: `apps/dashboard/src/app/(dashboard)/settings/page.tsx`

- [ ] **Step 1: Update SettingsPage to use new components and verify access**

```tsx
import { prisma } from '@photobot/db';
import React from 'react';
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

  const availableFeatures = ['critique', 'palette', 'settings']; // Define known features

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      {!serverId ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <p className="text-yellow-700">Please select a server to manage its settings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableFeatures.map((key) => {
            const config = features.find(f => f.featureKey === key);
            return (
              <div key={key} className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold capitalize">{key}</h3>
                  <FeatureToggle 
                    serverId={serverId} 
                    featureKey={key} 
                    initialEnabled={config?.isEnabled ?? true} 
                  />
                </div>
                <p className="text-sm text-gray-500 mb-4">
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

- [ ] **Step 2: Commit**

```bash
git add apps/dashboard/src/app/(dashboard)/settings/page.tsx
git commit -m "refactor: update settings page with interactive toggles and auth"
```

---

### Task 7: Refactor Audit Page

**Files:**
- Modify: `apps/dashboard/src/app/(dashboard)/audit/page.tsx`

- [ ] **Step 1: Update AuditPage to require serverId and verify access**

```tsx
import { prisma } from '@photobot/db';
import React from 'react';
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
        <h1 className="text-3xl font-bold mb-8">Audit Log</h1>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">Please select a server to view its audit logs.</p>
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
      {/* ... (Existing table rendering, but filtered by serverId) */}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/dashboard/src/app/(dashboard)/audit/page.tsx
git commit -m "refactor: update audit page with mandatory serverId and auth"
```

---

### Task 8: Update Tests & Final Verification

- [ ] **Step 1: Update existing tests to mock `getAdminGuilds`**
- [ ] **Step 2: Run all tests**
- [ ] **Step 3: Commit final changes**
