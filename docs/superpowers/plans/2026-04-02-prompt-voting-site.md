# Prompt Voting Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a community voting site at `apps/voting` where Photography Lounge members can upvote/downvote discussion prompts, with admin oversight.

**Architecture:** New Next.js 14 app in the monorepo sharing `@photobot/db`. Discord OAuth for auth, Prisma for data, Tailwind for styling. Server-side pagination/filtering via query params. Vote API with optimistic UI.

**Tech Stack:** Next.js 14, NextAuth 4, Prisma 5, Tailwind CSS 3, Vitest, TypeScript

**Spec:** `docs/superpowers/specs/2026-04-02-prompt-voting-site-design.md`

---

### Task 1: Prisma Schema — Add Prompt, PromptTag, PromptVote Models

**Files:**
- Modify: `packages/db/prisma/schema.prisma`

- [ ] **Step 1: Add the three new models to the Prisma schema**

Append to the end of `packages/db/prisma/schema.prisma` (before the closing of the file):

```prisma
enum VoteDirection {
  UP
  DOWN
}

model Prompt {
  id               String       @id @default(cuid())
  text             String       @db.Text
  originalCategory String       @map("original_category")
  createdAt        DateTime     @default(now()) @map("created_at")
  tags             PromptTag[]
  votes            PromptVote[]

  @@map("prompts")
}

model PromptTag {
  id       String @id @default(cuid())
  promptId String @map("prompt_id")
  tag      String
  prompt   Prompt @relation(fields: [promptId], references: [id], onDelete: Cascade)

  @@unique([promptId, tag])
  @@index([tag])
  @@map("prompt_tags")
}

model PromptVote {
  id              String        @id @default(cuid())
  promptId        String        @map("prompt_id")
  discordUserId   String        @map("discord_user_id")
  discordUsername  String        @map("discord_username")
  vote            VoteDirection
  createdAt       DateTime      @default(now()) @map("created_at")
  updatedAt       DateTime      @updatedAt @map("updated_at")
  prompt          Prompt        @relation(fields: [promptId], references: [id], onDelete: Cascade)

  @@unique([promptId, discordUserId])
  @@index([discordUserId])
  @@map("prompt_votes")
}
```

- [ ] **Step 2: Generate Prisma client and build the db package**

Run: `pnpm --filter @photobot/db build`
Expected: Prisma client generated with new models, tsc compiles cleanly.

- [ ] **Step 3: Commit**

```bash
git add packages/db/prisma/schema.prisma
git commit -m "feat(db): add Prompt, PromptTag, PromptVote models for voting site"
```

---

### Task 2: Seed Script — Import Prompts with Tags

**Files:**
- Create: `scripts/seed-prompts.ts`
- Modify: `package.json` (add `seed:prompts` script)

- [ ] **Step 1: Create the seed script**

Create `scripts/seed-prompts.ts`. This script:
1. Reads `apps/bot/src/data/discussion-prompts.md`
2. Parses prompts using heading-based category detection (same logic as `parse-prompts.ts`)
3. Maps each prompt to 1-3 tags using keyword matching
4. Upserts into the database (idempotent)

```typescript
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const prisma = new PrismaClient();

// Keyword-to-tag mapping. Each keyword maps to one tag.
// A prompt gets all tags whose keywords appear in its text.
const KEYWORD_TAGS: Record<string, string[]> = {
  motivation: ['rut', 'burnout', 'motivated', 'motivation', 'creative block', 'push through', 'uninspired', 'energy', 'drive', 'stuck'],
  workflow: ['process', 'routine', 'habit', 'workflow', 'warm up', 'ritual', 'daily', 'weekly', 'schedule', 'practice'],
  style: ['style', 'voice', 'aesthetic', 'identity', 'signature', 'evolving', 'personal look', 'visual language'],
  editing: ['edit', 'post-processing', 'post processing', 'lightroom', 'color grade', 'color palette', 'crop', 'black-and-white', 'retouch'],
  portfolio: ['portfolio', 'curate', 'share publicly', 'present', 'gallery', 'showcase', 'body of work'],
  storytelling: ['story', 'narrative', 'emotion', 'feeling', 'evoke', 'meaning', 'message', 'convey', 'document'],
  collaboration: ['collaborat', 'partner', 'model', 'team', 'together', 'co-create'],
  'social-media': ['social media', 'instagram', 'engagement', 'audience', 'followers', 'likes', 'platform', 'online'],
  gear: ['gear', 'lens', 'camera', 'focal length', 'equipment', 'limitations'],
  ethics: ['ethics', 'consent', 'strangers', 'public space', 'respectful', 'vulnerable', 'exploit', 'responsible'],
  business: ['client', 'commercial', 'career', 'paid work', 'side hustle', 'professional', 'commission'],
  influences: ['influence', 'inspired by', 'painting', 'film', 'music', 'book', 'documentary', 'photographer.*impact', 'art form'],
  learning: ['lesson', 'learn', 'advice', 'mistake', 'failure', 'growth', 'improve', 'taught'],
  projects: ['project', 'series', 'long-term', 'multi-month', 'body of work', 'archive'],
  'self-reflection': ['why', 'identity', 'yourself', 'personal', 'emotion', 'meaning', 'memoir', 'introspect', 'changed'],
  community: ['community', 'connect', 'teach', 'mentor', 'share knowledge', 'workshop', 'group'],
  technique: ['composition', 'light', 'lighting', 'exposure', 'focus', 'depth of field', 'shutter', 'aperture', 'color'],
};

function assignTags(text: string): string[] {
  const lower = text.toLowerCase();
  const tags = new Set<string>();

  for (const [tag, keywords] of Object.entries(KEYWORD_TAGS)) {
    for (const keyword of keywords) {
      if (new RegExp(keyword, 'i').test(lower)) {
        tags.add(tag);
        break;
      }
    }
  }

  // Ensure at least one tag
  if (tags.size === 0) {
    tags.add('self-reflection');
  }

  // Cap at 3 tags
  return Array.from(tags).slice(0, 3);
}

interface ParsedPrompt {
  category: string;
  text: string;
}

function parseMarkdown(content: string): ParsedPrompt[] {
  const HEADING_TO_CATEGORY: Record<string, string> = {
    'Creative Process': 'creative',
    'Inspiration': 'inspiration',
  };

  const prompts: ParsedPrompt[] = [];
  let currentCategory = '';

  for (const line of content.split('\n')) {
    const headingMatch = line.match(/^##\s+(.+)/);
    if (headingMatch) {
      const heading = headingMatch[1].trim();
      currentCategory = HEADING_TO_CATEGORY[heading] || heading.toLowerCase();
      continue;
    }

    const promptMatch = line.match(/^-\s+(.+)/);
    if (promptMatch && currentCategory) {
      prompts.push({ category: currentCategory, text: promptMatch[1].trim() });
    }
  }

  return prompts;
}

async function main() {
  const mdPath = resolve(__dirname, '../apps/bot/src/data/discussion-prompts.md');
  const content = readFileSync(mdPath, 'utf-8');
  const prompts = parseMarkdown(content);

  console.log(`Parsed ${prompts.length} prompts. Seeding...`);

  let created = 0;
  let skipped = 0;

  for (const p of prompts) {
    const existing = await prisma.prompt.findFirst({ where: { text: p.text } });
    if (existing) {
      skipped++;
      continue;
    }

    const tags = assignTags(p.text);

    await prisma.prompt.create({
      data: {
        text: p.text,
        originalCategory: p.category,
        tags: {
          create: tags.map(tag => ({ tag })),
        },
      },
    });
    created++;
  }

  console.log(`Done. Created: ${created}, Skipped (duplicates): ${skipped}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
```

- [ ] **Step 2: Add the seed script to root package.json**

Add to `scripts` in root `package.json`:

```json
"seed:prompts": "tsx scripts/seed-prompts.ts"
```

- [ ] **Step 3: Run the seed script to verify it works**

Run: `pnpm seed:prompts`
Expected: `Parsed 410 prompts. Seeding...` then `Done. Created: 410, Skipped (duplicates): 0`

Run it again to test idempotency:
Expected: `Done. Created: 0, Skipped (duplicates): 410`

- [ ] **Step 4: Commit**

```bash
git add scripts/seed-prompts.ts package.json
git commit -m "feat: add seed script for discussion prompts with tag assignment"
```

---

### Task 3: Scaffold the Voting App

**Files:**
- Create: `apps/voting/package.json`
- Create: `apps/voting/tsconfig.json`
- Create: `apps/voting/next.config.mjs`
- Create: `apps/voting/postcss.config.js`
- Create: `apps/voting/tailwind.config.ts`
- Create: `apps/voting/src/app/globals.css`
- Create: `apps/voting/src/app/layout.tsx`
- Create: `apps/voting/src/types/next-auth.d.ts`

- [ ] **Step 1: Create `apps/voting/package.json`**

```json
{
  "name": "@photobot/voting",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3200",
    "build": "next build",
    "start": "next start",
    "test": "vitest run"
  },
  "dependencies": {
    "@next-auth/prisma-adapter": "^1.0.7",
    "@photobot/db": "workspace:*",
    "lucide-react": "^0.344.0",
    "next": "14.1.0",
    "next-auth": "4.24.5",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "@testing-library/react": "^16.3.2",
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "jsdom": "^24.0.0",
    "postcss": "^8.4.33",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.4.2",
    "vitest": "^1.3.1"
  }
}
```

- [ ] **Step 2: Create `apps/voting/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "dist",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "jsx": "preserve",
    "paths": { "@/*": ["./src/*"] },
    "baseUrl": ".",
    "allowJs": true,
    "noEmit": true,
    "incremental": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "plugins": [{ "name": "next" }]
  },
  "include": ["src/**/*", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Create `apps/voting/next.config.mjs`**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
```

- [ ] **Step 4: Create `apps/voting/postcss.config.js`**

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 5: Create `apps/voting/tailwind.config.ts`**

Copy the exact same config from `apps/dashboard/tailwind.config.ts` (same brand colors, fonts, animations).

- [ ] **Step 6: Create `apps/voting/src/app/globals.css`**

Copy the exact same CSS from `apps/dashboard/src/app/globals.css` (same theme variables, grain, glass, mesh, animations).

- [ ] **Step 7: Create `apps/voting/src/types/next-auth.d.ts`**

```typescript
import "next-auth";

declare module "next-auth" {
  interface Session {
    discordUserId?: string;
    discordUsername?: string;
    isAdmin?: boolean;
  }
}
```

- [ ] **Step 8: Create `apps/voting/src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = DM_Serif_Display({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Photobot — Prompt Voting",
  description: "Vote on discussion prompts for the Photography Lounge community",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `try{if(localStorage.getItem('theme')==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}`,
        }} />
      </head>
      <body className={`${display.variable} ${body.variable} ${mono.variable} font-body grain`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 9: Install dependencies and verify the app starts**

Run: `pnpm install && pnpm --filter @photobot/voting dev`
Expected: Next.js starts on port 3200, shows a blank page (no pages yet).
Stop the dev server after confirming.

- [ ] **Step 10: Commit**

```bash
git add apps/voting/
git commit -m "feat(voting): scaffold Next.js app with Tailwind and theme"
```

---

### Task 4: Auth — NextAuth with Discord OAuth

**Files:**
- Create: `apps/voting/src/lib/auth.ts`
- Create: `apps/voting/src/app/api/auth/[...nextauth]/route.ts`

- [ ] **Step 1: Create `apps/voting/src/lib/auth.ts`**

```typescript
import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@photobot/db";

const ADMIN_ROLE_IDS = (process.env.VOTING_ADMIN_ROLE_IDS || '').split(',').filter(Boolean);
const GUILD_ID = process.env.VOTING_GUILD_ID || '';

async function fetchUserRoles(discordUserId: string): Promise<string[]> {
  const botToken = process.env.DISCORD_TOKEN;
  if (!botToken || !GUILD_ID) return [];

  try {
    const res = await fetch(
      `https://discord.com/api/guilds/${GUILD_ID}/members/${discordUserId}`,
      { headers: { Authorization: `Bot ${botToken}` } }
    );
    if (!res.ok) return [];
    const member = await res.json();
    return member.roles || [];
  } catch {
    return [];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
      authorization: { params: { scope: "identify" } },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, user }) {
      const account = await prisma.account.findFirst({
        where: { userId: user.id, provider: "discord" },
      });

      if (account) {
        session.discordUserId = account.providerAccountId;
        session.discordUsername = user.name || 'Unknown';

        const roles = await fetchUserRoles(account.providerAccountId);
        session.isAdmin = roles.some(r => ADMIN_ROLE_IDS.includes(r));
      }

      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.VOTING_NEXTAUTH_SECRET,
};
```

- [ ] **Step 2: Create `apps/voting/src/app/api/auth/[...nextauth]/route.ts`**

```typescript
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

- [ ] **Step 3: Add voting-specific env vars to `.env.example`**

Append to `.env.example`:

```
# --- Voting App ---
VOTING_NEXTAUTH_SECRET=generate-a-separate-secret
VOTING_GUILD_ID=your-photography-lounge-server-id
VOTING_ADMIN_ROLE_IDS=role-id-1,role-id-2
```

- [ ] **Step 4: Commit**

```bash
git add apps/voting/src/lib/auth.ts apps/voting/src/app/api/auth/ .env.example
git commit -m "feat(voting): add NextAuth Discord OAuth with admin role detection"
```

---

### Task 5: Vote API Route

**Files:**
- Create: `apps/voting/src/app/api/vote/route.ts`
- Create: `apps/voting/src/__tests__/vote-api.test.ts`
- Create: `apps/voting/vitest.config.ts`

- [ ] **Step 1: Create `apps/voting/vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
```

- [ ] **Step 2: Write the failing test for vote logic**

Create `apps/voting/src/__tests__/vote-api.test.ts`:

```typescript
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@photobot/db', () => ({
  prisma: {
    promptVote: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(),
}));

import { prisma } from '@photobot/db';
import { getServerSession } from 'next-auth/next';
import { handleVote } from '@/lib/vote';

describe('handleVote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (prisma.promptVote.count as any).mockResolvedValue(0);
  });

  it('creates a new vote when none exists', async () => {
    (prisma.promptVote.findUnique as any).mockResolvedValue(null);
    (prisma.promptVote.create as any).mockResolvedValue({ id: 'v1', vote: 'UP' });
    (prisma.promptVote.count as any)
      .mockResolvedValueOnce(1)  // upvotes
      .mockResolvedValueOnce(0); // downvotes

    const result = await handleVote('prompt-1', 'user-1', 'TestUser', 'UP');

    expect(prisma.promptVote.create).toHaveBeenCalledWith({
      data: {
        promptId: 'prompt-1',
        discordUserId: 'user-1',
        discordUsername: 'TestUser',
        vote: 'UP',
      },
    });
    expect(result).toEqual({ upvotes: 1, downvotes: 0, userVote: 'UP' });
  });

  it('deletes the vote when clicking same direction (toggle off)', async () => {
    (prisma.promptVote.findUnique as any).mockResolvedValue({ id: 'v1', vote: 'UP' });
    (prisma.promptVote.delete as any).mockResolvedValue({});
    (prisma.promptVote.count as any)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0);

    const result = await handleVote('prompt-1', 'user-1', 'TestUser', 'UP');

    expect(prisma.promptVote.delete).toHaveBeenCalledWith({ where: { id: 'v1' } });
    expect(result).toEqual({ upvotes: 0, downvotes: 0, userVote: null });
  });

  it('switches direction when clicking opposite', async () => {
    (prisma.promptVote.findUnique as any).mockResolvedValue({ id: 'v1', vote: 'UP' });
    (prisma.promptVote.update as any).mockResolvedValue({ id: 'v1', vote: 'DOWN' });
    (prisma.promptVote.count as any)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(1);

    const result = await handleVote('prompt-1', 'user-1', 'TestUser', 'DOWN');

    expect(prisma.promptVote.update).toHaveBeenCalledWith({
      where: { id: 'v1' },
      data: { vote: 'DOWN' },
    });
    expect(result).toEqual({ upvotes: 0, downvotes: 1, userVote: 'DOWN' });
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm --filter @photobot/voting test`
Expected: FAIL — `handleVote` not found.

- [ ] **Step 4: Implement the vote logic**

Create `apps/voting/src/lib/vote.ts`:

```typescript
import { prisma } from '@photobot/db';

type Direction = 'UP' | 'DOWN';

export interface VoteResult {
  upvotes: number;
  downvotes: number;
  userVote: Direction | null;
}

export async function handleVote(
  promptId: string,
  discordUserId: string,
  discordUsername: string,
  direction: Direction,
): Promise<VoteResult> {
  const existing = await prisma.promptVote.findUnique({
    where: { promptId_discordUserId: { promptId, discordUserId } },
  });

  let userVote: Direction | null = direction;

  if (existing && existing.vote === direction) {
    // Toggle off
    await prisma.promptVote.delete({ where: { id: existing.id } });
    userVote = null;
  } else if (existing) {
    // Switch direction
    await prisma.promptVote.update({ where: { id: existing.id }, data: { vote: direction } });
  } else {
    // New vote
    await prisma.promptVote.create({
      data: { promptId, discordUserId, discordUsername, vote: direction },
    });
  }

  const [upvotes, downvotes] = await Promise.all([
    prisma.promptVote.count({ where: { promptId, vote: 'UP' } }),
    prisma.promptVote.count({ where: { promptId, vote: 'DOWN' } }),
  ]);

  return { upvotes, downvotes, userVote };
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm --filter @photobot/voting test`
Expected: 3 tests PASS.

- [ ] **Step 6: Create the API route**

Create `apps/voting/src/app/api/vote/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { handleVote } from '@/lib/vote';

// Simple in-memory rate limiter
const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 60; // votes per minute

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(userId);

  if (!entry || now > entry.resetAt) {
    rateLimits.set(userId, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  entry.count++;
  return entry.count <= RATE_LIMIT;
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.discordUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!checkRateLimit(session.discordUserId)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const body = await request.json();
  const { promptId, direction } = body;

  if (!promptId || !['UP', 'DOWN'].includes(direction)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const result = await handleVote(
    promptId,
    session.discordUserId,
    session.discordUsername || 'Unknown',
    direction,
  );

  return NextResponse.json(result);
}
```

- [ ] **Step 7: Commit**

```bash
git add apps/voting/vitest.config.ts apps/voting/src/__tests__/ apps/voting/src/lib/vote.ts apps/voting/src/app/api/vote/
git commit -m "feat(voting): add vote API with create/toggle/switch logic and tests"
```

---

### Task 6: Prompt Query Library

**Files:**
- Create: `apps/voting/src/lib/prompts.ts`
- Create: `apps/voting/src/__tests__/prompts.test.ts`

- [ ] **Step 1: Write failing tests for prompt query functions**

Create `apps/voting/src/__tests__/prompts.test.ts`:

```typescript
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@photobot/db', () => ({
  prisma: {
    prompt: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

import { prisma } from '@photobot/db';
import { fetchPrompts, type PromptQueryParams } from '@/lib/prompts';

describe('fetchPrompts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (prisma.prompt.count as any).mockResolvedValue(50);
    (prisma.prompt.findMany as any).mockResolvedValue([]);
  });

  it('returns paginated results with defaults', async () => {
    const result = await fetchPrompts({});

    expect(prisma.prompt.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 20,
        skip: 0,
      })
    );
    expect(result.totalPages).toBe(3); // 50 / 20 = 2.5, ceil = 3
  });

  it('filters by tags', async () => {
    await fetchPrompts({ tags: ['motivation', 'workflow'] });

    expect(prisma.prompt.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tags: { some: { tag: { in: ['motivation', 'workflow'] } } },
        }),
      })
    );
  });

  it('filters by search query', async () => {
    await fetchPrompts({ q: 'creative rut' });

    expect(prisma.prompt.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          text: { contains: 'creative rut', mode: 'insensitive' },
        }),
      })
    );
  });

  it('applies sort order', async () => {
    await fetchPrompts({ sort: 'alphabetical' });

    expect(prisma.prompt.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { text: 'asc' },
      })
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @photobot/voting test`
Expected: FAIL — `fetchPrompts` not found.

- [ ] **Step 3: Implement the prompt query library**

Create `apps/voting/src/lib/prompts.ts`:

```typescript
import { prisma } from '@photobot/db';

const PAGE_SIZE = 20;

export type SortOption = 'approval' | 'votes' | 'alphabetical';

export interface PromptQueryParams {
  page?: number;
  sort?: SortOption;
  tags?: string[];
  q?: string;
}

export interface PromptWithVotes {
  id: string;
  text: string;
  originalCategory: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  approvalPct: number;
}

export interface PromptPage {
  prompts: PromptWithVotes[];
  page: number;
  totalPages: number;
  totalCount: number;
}

export async function fetchPrompts(
  params: PromptQueryParams,
  discordUserId?: string,
): Promise<PromptPage & { userVotes: Record<string, 'UP' | 'DOWN'> }> {
  const page = Math.max(1, params.page || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const where: any = {};

  if (params.tags && params.tags.length > 0) {
    where.tags = { some: { tag: { in: params.tags } } };
  }

  if (params.q) {
    where.text = { contains: params.q, mode: 'insensitive' };
  }

  let orderBy: any = { createdAt: 'asc' };
  if (params.sort === 'alphabetical') {
    orderBy = { text: 'asc' };
  }
  // 'approval' and 'votes' sorting done in-memory after fetching vote counts

  const [prompts, totalCount] = await Promise.all([
    prisma.prompt.findMany({
      where,
      include: {
        tags: { select: { tag: true } },
        votes: { select: { vote: true, discordUserId: true } },
      },
      take: PAGE_SIZE,
      skip,
      orderBy,
    }),
    prisma.prompt.count({ where }),
  ]);

  const userVotes: Record<string, 'UP' | 'DOWN'> = {};

  const mapped: PromptWithVotes[] = prompts.map((p: any) => {
    const upvotes = p.votes.filter((v: any) => v.vote === 'UP').length;
    const downvotes = p.votes.filter((v: any) => v.vote === 'DOWN').length;
    const total = upvotes + downvotes;
    const approvalPct = total > 0 ? Math.round((upvotes / total) * 100) : 0;

    if (discordUserId) {
      const userVote = p.votes.find((v: any) => v.discordUserId === discordUserId);
      if (userVote) userVotes[p.id] = userVote.vote;
    }

    return {
      id: p.id,
      text: p.text,
      originalCategory: p.originalCategory,
      tags: p.tags.map((t: any) => t.tag),
      upvotes,
      downvotes,
      approvalPct,
    };
  });

  // Sort by approval or votes if requested (post-fetch)
  if (params.sort === 'approval') {
    mapped.sort((a, b) => b.approvalPct - a.approvalPct);
  } else if (params.sort === 'votes') {
    mapped.sort((a, b) => (b.upvotes + b.downvotes) - (a.upvotes + a.downvotes));
  }

  return {
    prompts: mapped,
    page,
    totalPages: Math.ceil(totalCount / PAGE_SIZE),
    totalCount,
    userVotes,
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm --filter @photobot/voting test`
Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/voting/src/lib/prompts.ts apps/voting/src/__tests__/prompts.test.ts
git commit -m "feat(voting): add prompt query library with pagination, sorting, and filtering"
```

---

### Task 7: UI Components — ThemeToggle, AnonymityBanner, TagFilter, VoteButton

**Files:**
- Create: `apps/voting/src/components/ThemeToggle.tsx`
- Create: `apps/voting/src/components/AnonymityBanner.tsx`
- Create: `apps/voting/src/components/TagFilter.tsx`
- Create: `apps/voting/src/components/VoteButton.tsx`
- Create: `apps/voting/src/components/SearchInput.tsx`
- Create: `apps/voting/src/components/SortSelect.tsx`
- Create: `apps/voting/src/components/Pagination.tsx`

- [ ] **Step 1: Create ThemeToggle**

Create `apps/voting/src/components/ThemeToggle.tsx`:

```tsx
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
```

- [ ] **Step 2: Create AnonymityBanner**

Create `apps/voting/src/components/AnonymityBanner.tsx`:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { LucideShieldCheck, LucideX } from 'lucide-react';

export function AnonymityBanner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem('banner-dismissed') === 'true');
  }, []);

  if (dismissed) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 backdrop-blur-sm text-sm">
      <LucideShieldCheck className="w-4 h-4 text-brand-primary flex-shrink-0" strokeWidth={1.5} />
      <p className="text-secondary flex-1">
        Your votes are anonymous to other members. Admins can see votes to monitor misuse.
      </p>
      <button
        onClick={() => { setDismissed(true); localStorage.setItem('banner-dismissed', 'true'); }}
        className="p-1 rounded-md text-muted hover:text-primary transition-colors"
      >
        <LucideX className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Create TagFilter**

Create `apps/voting/src/components/TagFilter.tsx`:

```tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const ALL_TAGS = [
  'motivation', 'workflow', 'style', 'editing', 'portfolio', 'storytelling',
  'collaboration', 'social-media', 'gear', 'ethics', 'business', 'influences',
  'learning', 'projects', 'self-reflection', 'community', 'technique',
];

const TAG_COLORS: Record<string, string> = {
  motivation: 'bg-green-500/15 text-green-400 border-green-500/20',
  workflow: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  style: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  editing: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  portfolio: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  storytelling: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  collaboration: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  'social-media': 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
  gear: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
  ethics: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
  business: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  influences: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  learning: 'bg-teal-500/15 text-teal-400 border-teal-500/20',
  projects: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  'self-reflection': 'bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/20',
  community: 'bg-sky-500/15 text-sky-400 border-sky-500/20',
  technique: 'bg-lime-500/15 text-lime-400 border-lime-500/20',
};

export { TAG_COLORS };

export function TagFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTags = searchParams.get('tags')?.split(',').filter(Boolean) || [];

  const toggle = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get('tags')?.split(',').filter(Boolean) || [];

    const next = current.includes(tag)
      ? current.filter(t => t !== tag)
      : [...current, tag];

    if (next.length > 0) {
      params.set('tags', next.join(','));
    } else {
      params.delete('tags');
    }
    params.set('page', '1');
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {ALL_TAGS.map(tag => {
        const active = activeTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => toggle(tag)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
              active
                ? TAG_COLORS[tag] || 'bg-brand-primary/15 text-brand-primary border-brand-primary/20'
                : 'bg-transparent text-muted border-subtle hover:text-secondary hover:border-brand-primary/20'
            }`}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Create VoteButton**

Create `apps/voting/src/components/VoteButton.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { LucideThumbsUp, LucideThumbsDown } from 'lucide-react';

interface VoteButtonProps {
  promptId: string;
  direction: 'UP' | 'DOWN';
  count: number;
  active: boolean;
  disabled: boolean;
  onVote: (promptId: string, direction: 'UP' | 'DOWN') => Promise<void>;
}

export function VoteButton({ promptId, direction, count, active, disabled, onVote }: VoteButtonProps) {
  const [loading, setLoading] = useState(false);
  const [optimisticCount, setOptimisticCount] = useState(count);
  const [optimisticActive, setOptimisticActive] = useState(active);

  const Icon = direction === 'UP' ? LucideThumbsUp : LucideThumbsDown;
  const colorActive = direction === 'UP'
    ? 'bg-green-500/15 border-green-500/30 text-green-400'
    : 'bg-red-500/15 border-red-500/30 text-red-400';
  const colorInactive = 'bg-transparent border-subtle text-muted hover:text-secondary hover:border-brand-primary/20';

  const handleClick = async () => {
    if (disabled || loading) return;
    setLoading(true);

    // Optimistic update
    const wasActive = optimisticActive;
    setOptimisticActive(!wasActive);
    setOptimisticCount(wasActive ? optimisticCount - 1 : optimisticCount + 1);

    try {
      await onVote(promptId, direction);
    } catch {
      // Revert on error
      setOptimisticActive(wasActive);
      setOptimisticCount(count);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      title={disabled ? 'Sign in to vote' : direction === 'UP' ? 'Upvote' : 'Downvote'}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 justify-center ${
        optimisticActive ? colorActive : colorInactive
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
      <span>{optimisticCount}</span>
    </button>
  );
}
```

- [ ] **Step 5: Create SearchInput**

Create `apps/voting/src/components/SearchInput.tsx`:

```tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LucideSearch } from 'lucide-react';

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set('q', value);
      } else {
        params.delete('q');
      }
      params.set('page', '1');
      router.push(`/?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="relative">
      <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" strokeWidth={1.5} />
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Search prompts..."
        className="w-full pl-9 pr-4 py-2 rounded-lg bg-card/50 border border-subtle text-sm text-primary placeholder:text-muted focus:outline-none focus:border-brand-primary/30 transition-colors"
      />
    </div>
  );
}
```

- [ ] **Step 6: Create SortSelect**

Create `apps/voting/src/components/SortSelect.tsx`:

```tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get('sort') || 'approval';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    params.set('page', '1');
    router.push(`/?${params.toString()}`);
  };

  return (
    <select
      value={current}
      onChange={handleChange}
      className="px-3 py-2 rounded-lg bg-card/50 border border-subtle text-sm text-primary focus:outline-none focus:border-brand-primary/30 transition-colors"
    >
      <option value="approval">Approval %</option>
      <option value="votes">Most Voted</option>
      <option value="alphabetical">A → Z</option>
    </select>
  );
}
```

- [ ] **Step 7: Create Pagination**

Create `apps/voting/src/components/Pagination.tsx`:

```tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { LucideChevronLeft, LucideChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
}

export function Pagination({ page, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goTo = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(p));
    router.push(`/?${params.toString()}`);
  };

  // Show at most 5 page numbers centered around current
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-brand-primary/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <LucideChevronLeft className="w-4 h-4" />
      </button>
      {pages.map(p => (
        <button
          key={p}
          onClick={() => goTo(p)}
          className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
            p === page
              ? 'bg-brand-primary/15 text-brand-primary border border-brand-primary/20'
              : 'text-secondary hover:text-primary hover:bg-brand-primary/5'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-brand-primary/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <LucideChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
```

- [ ] **Step 8: Commit**

```bash
git add apps/voting/src/components/
git commit -m "feat(voting): add UI components — ThemeToggle, TagFilter, VoteButton, Search, Sort, Pagination, AnonymityBanner"
```

---

### Task 8: Main Page — Prompt List with Voting

**Files:**
- Create: `apps/voting/src/app/page.tsx`
- Create: `apps/voting/src/components/PromptList.tsx`
- Create: `apps/voting/src/components/PromptCard.tsx`
- Create: `apps/voting/src/components/Header.tsx`
- Create: `apps/voting/src/components/LoginButton.tsx`

- [ ] **Step 1: Create Header**

Create `apps/voting/src/components/Header.tsx`:

```tsx
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { ThemeToggle } from './ThemeToggle';
import { LoginButton } from './LoginButton';
import { LucideCamera } from 'lucide-react';
import Link from 'next/link';

export async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="glass border-b border-subtle sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded-lg bg-brand-primary/10 border border-brand-primary/20 group-hover:bg-brand-primary/20 transition-colors">
              <LucideCamera className="w-4 h-4 text-brand-primary" strokeWidth={1.5} />
            </div>
            <span className="font-display text-lg text-primary">Prompt Voting</span>
          </Link>
          {session?.isAdmin && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-brand-accent/15 text-brand-accent border border-brand-accent/20">
              Admin
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {session ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted hidden sm:block">{session.discordUsername}</span>
              <div className="w-7 h-7 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-xs font-medium text-brand-primary">
                {(session.discordUsername || '?')[0].toUpperCase()}
              </div>
            </div>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Create LoginButton**

Create `apps/voting/src/components/LoginButton.tsx`:

```tsx
'use client';

import { useState } from 'react';

export function LoginButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const res = await fetch('/api/auth/csrf');
    const { csrfToken } = await res.json();

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/api/auth/signin/discord';

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'csrfToken';
    input.value = csrfToken;
    form.appendChild(input);

    const cb = document.createElement('input');
    cb.type = 'hidden';
    cb.name = 'callbackUrl';
    cb.value = '/';
    form.appendChild(cb);

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="px-4 py-1.5 rounded-lg text-xs font-medium bg-brand-primary/15 text-brand-primary border border-brand-primary/20 hover:bg-brand-primary/25 transition-all"
    >
      {loading ? 'Connecting...' : 'Sign in with Discord'}
    </button>
  );
}
```

- [ ] **Step 3: Create PromptCard**

Create `apps/voting/src/components/PromptCard.tsx`:

```tsx
'use client';

import { TAG_COLORS } from './TagFilter';
import { VoteButton } from './VoteButton';

interface PromptCardProps {
  id: string;
  text: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  approvalPct: number;
  userVote: 'UP' | 'DOWN' | null;
  isAuthenticated: boolean;
  onVote: (promptId: string, direction: 'UP' | 'DOWN') => Promise<void>;
}

export function PromptCard({ id, text, tags, upvotes, downvotes, approvalPct, userVote, isAuthenticated, onVote }: PromptCardProps) {
  const total = upvotes + downvotes;

  return (
    <div className="p-4 sm:p-5 rounded-xl border border-subtle bg-card/50 backdrop-blur-sm transition-all hover:border-brand-primary/10">
      <div className="flex flex-wrap gap-1.5 mb-3">
        {tags.map(tag => (
          <span
            key={tag}
            className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${TAG_COLORS[tag] || 'bg-brand-primary/15 text-brand-primary border-brand-primary/20'}`}
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="text-sm text-primary leading-relaxed mb-4">{text}</p>
      <div className="flex items-center gap-3">
        <VoteButton promptId={id} direction="UP" count={upvotes} active={userVote === 'UP'} disabled={!isAuthenticated} onVote={onVote} />
        <VoteButton promptId={id} direction="DOWN" count={downvotes} active={userVote === 'DOWN'} disabled={!isAuthenticated} onVote={onVote} />
        {total > 0 && (
          <>
            <div className="flex-1 h-1.5 rounded-full bg-[var(--border-subtle)] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-400 to-brand-primary transition-all"
                style={{ width: `${approvalPct}%` }}
              />
            </div>
            <span className="text-[11px] text-muted font-medium tabular-nums">{approvalPct}%</span>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create PromptList (client component that orchestrates voting)**

Create `apps/voting/src/components/PromptList.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { PromptCard } from './PromptCard';
import type { PromptWithVotes } from '@/lib/prompts';

interface PromptListProps {
  prompts: PromptWithVotes[];
  userVotes: Record<string, 'UP' | 'DOWN'>;
  isAuthenticated: boolean;
}

export function PromptList({ prompts: initial, userVotes: initialVotes, isAuthenticated }: PromptListProps) {
  const [prompts, setPrompts] = useState(initial);
  const [userVotes, setUserVotes] = useState(initialVotes);

  const handleVote = async (promptId: string, direction: 'UP' | 'DOWN') => {
    const res = await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promptId, direction }),
    });

    if (!res.ok) throw new Error('Vote failed');

    const result = await res.json();

    setPrompts(prev => prev.map(p =>
      p.id === promptId
        ? { ...p, upvotes: result.upvotes, downvotes: result.downvotes, approvalPct: (result.upvotes + result.downvotes) > 0 ? Math.round((result.upvotes / (result.upvotes + result.downvotes)) * 100) : 0 }
        : p
    ));

    setUserVotes(prev => {
      const next = { ...prev };
      if (result.userVote) {
        next[promptId] = result.userVote;
      } else {
        delete next[promptId];
      }
      return next;
    });
  };

  return (
    <div className="space-y-3 stagger">
      {prompts.map(p => (
        <PromptCard
          key={p.id}
          id={p.id}
          text={p.text}
          tags={p.tags}
          upvotes={p.upvotes}
          downvotes={p.downvotes}
          approvalPct={p.approvalPct}
          userVote={userVotes[p.id] || null}
          isAuthenticated={isAuthenticated}
          onVote={handleVote}
        />
      ))}
      {prompts.length === 0 && (
        <div className="text-center py-16 text-muted text-sm">No prompts match your filters.</div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Create the main page**

Create `apps/voting/src/app/page.tsx`:

```tsx
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { fetchPrompts } from '@/lib/prompts';
import { Header } from '@/components/Header';
import { PromptList } from '@/components/PromptList';
import { TagFilter } from '@/components/TagFilter';
import { SearchInput } from '@/components/SearchInput';
import { SortSelect } from '@/components/SortSelect';
import { Pagination } from '@/components/Pagination';
import { AnonymityBanner } from '@/components/AnonymityBanner';

export default async function HomePage({
  searchParams,
}: {
  searchParams: { page?: string; sort?: string; tags?: string; q?: string };
}) {
  const session = await getServerSession(authOptions);

  const params = {
    page: parseInt(searchParams.page || '1', 10),
    sort: (searchParams.sort || 'approval') as 'approval' | 'votes' | 'alphabetical',
    tags: searchParams.tags?.split(',').filter(Boolean),
    q: searchParams.q,
  };

  const data = await fetchPrompts(params, session?.discordUserId || undefined);

  return (
    <div className="min-h-screen mesh-dark dark:mesh-dark mesh-light">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5">
        <AnonymityBanner />

        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <SearchInput />
          </div>
          <SortSelect />
        </div>

        <TagFilter />

        <div className="text-xs text-muted">
          {data.totalCount} prompt{data.totalCount !== 1 ? 's' : ''} found
        </div>

        <PromptList
          prompts={data.prompts}
          userVotes={data.userVotes}
          isAuthenticated={!!session}
        />

        <Pagination page={data.page} totalPages={data.totalPages} />
      </main>
    </div>
  );
}
```

- [ ] **Step 6: Verify the app runs**

Run: `pnpm install && pnpm --filter @photobot/db build && pnpm --filter @photobot/voting dev`
Expected: App loads on `http://localhost:3200`, shows prompt cards with tags and vote buttons.

- [ ] **Step 7: Commit**

```bash
git add apps/voting/src/app/page.tsx apps/voting/src/components/Header.tsx apps/voting/src/components/LoginButton.tsx apps/voting/src/components/PromptCard.tsx apps/voting/src/components/PromptList.tsx
git commit -m "feat(voting): add main page with prompt cards, voting, filters, pagination"
```

---

### Task 9: Admin View

**Files:**
- Create: `apps/voting/src/components/AdminView.tsx`
- Create: `apps/voting/src/lib/admin.ts`

- [ ] **Step 1: Create admin data fetcher**

Create `apps/voting/src/lib/admin.ts`:

```typescript
import { prisma } from '@photobot/db';

export interface AdminStats {
  totalVotes: number;
  uniqueVoters: number;
  promptsWithZeroVotes: number;
}

export interface PromptVoterDetail {
  discordUsername: string;
  vote: 'UP' | 'DOWN';
  createdAt: Date;
}

export async function getAdminStats(): Promise<AdminStats> {
  const [totalVotes, uniqueVoters, totalPrompts, promptsWithVotes] = await Promise.all([
    prisma.promptVote.count(),
    prisma.promptVote.groupBy({ by: ['discordUserId'] }).then(r => r.length),
    prisma.prompt.count(),
    prisma.promptVote.groupBy({ by: ['promptId'] }).then(r => r.length),
  ]);

  return {
    totalVotes,
    uniqueVoters,
    promptsWithZeroVotes: totalPrompts - promptsWithVotes,
  };
}

export async function getVotersForPrompt(promptId: string): Promise<PromptVoterDetail[]> {
  const votes = await prisma.promptVote.findMany({
    where: { promptId },
    orderBy: { createdAt: 'desc' },
    select: { discordUsername: true, vote: true, createdAt: true },
  });
  return votes as PromptVoterDetail[];
}
```

- [ ] **Step 2: Create AdminView component**

Create `apps/voting/src/components/AdminView.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { LucideChevronDown, LucideChevronRight, LucideThumbsUp, LucideThumbsDown } from 'lucide-react';
import type { AdminStats } from '@/lib/admin';

interface AdminViewProps {
  stats: AdminStats;
}

export function AdminStatsBar({ stats }: AdminViewProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        { label: 'Total Votes', value: stats.totalVotes },
        { label: 'Unique Voters', value: stats.uniqueVoters },
        { label: 'No Votes Yet', value: stats.promptsWithZeroVotes },
      ].map(({ label, value }) => (
        <div key={label} className="p-3 rounded-xl border border-subtle bg-card/50 text-center">
          <p className="text-lg font-display text-primary">{value}</p>
          <p className="text-[10px] text-muted uppercase tracking-wider">{label}</p>
        </div>
      ))}
    </div>
  );
}

interface VoterDetailProps {
  promptId: string;
}

export function VoterDetail({ promptId }: VoterDetailProps) {
  const [voters, setVoters] = useState<Array<{ discordUsername: string; vote: string; createdAt: string }> | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (open) {
      setOpen(false);
      return;
    }

    if (!voters) {
      setLoading(true);
      const res = await fetch(`/api/admin/voters?promptId=${promptId}`);
      const data = await res.json();
      setVoters(data.voters);
      setLoading(false);
    }
    setOpen(true);
  };

  const Icon = open ? LucideChevronDown : LucideChevronRight;

  return (
    <div>
      <button onClick={toggle} className="flex items-center gap-1 text-[11px] text-muted hover:text-secondary transition-colors">
        <Icon className="w-3 h-3" />
        {loading ? 'Loading...' : open ? 'Hide voters' : 'Show voters'}
      </button>
      {open && voters && (
        <div className="mt-2 space-y-1 pl-4 border-l border-subtle">
          {voters.length === 0 && <p className="text-[11px] text-muted">No votes yet</p>}
          {voters.map((v, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px]">
              {v.vote === 'UP' ? (
                <LucideThumbsUp className="w-3 h-3 text-green-400" />
              ) : (
                <LucideThumbsDown className="w-3 h-3 text-red-400" />
              )}
              <span className="text-secondary">{v.discordUsername}</span>
              <span className="text-muted">{new Date(v.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create admin voters API route**

Create `apps/voting/src/app/api/admin/voters/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getVotersForPrompt } from '@/lib/admin';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const promptId = request.nextUrl.searchParams.get('promptId');
  if (!promptId) {
    return NextResponse.json({ error: 'Missing promptId' }, { status: 400 });
  }

  const voters = await getVotersForPrompt(promptId);
  return NextResponse.json({ voters });
}
```

- [ ] **Step 4: Wire admin components into the main page**

Update `apps/voting/src/app/page.tsx` — add admin stats bar and pass `isAdmin` to PromptList. Add these imports at the top:

```tsx
import { AdminStatsBar } from '@/components/AdminView';
import { getAdminStats } from '@/lib/admin';
```

After the `data` fetch, add:
```tsx
const adminStats = session?.isAdmin ? await getAdminStats() : null;
```

In the JSX, after `<AnonymityBanner />`, add:
```tsx
{adminStats && <AdminStatsBar stats={adminStats} />}
```

Pass `isAdmin` to PromptList:
```tsx
<PromptList
  prompts={data.prompts}
  userVotes={data.userVotes}
  isAuthenticated={!!session}
  isAdmin={!!session?.isAdmin}
/>
```

- [ ] **Step 5: Update PromptList and PromptCard to show VoterDetail for admins**

Update `PromptList` props to include `isAdmin: boolean` and pass it through to `PromptCard`.

Update `PromptCard` to render `<VoterDetail promptId={id} />` when `isAdmin` is true, below the vote buttons.

- [ ] **Step 6: Commit**

```bash
git add apps/voting/src/lib/admin.ts apps/voting/src/components/AdminView.tsx apps/voting/src/app/api/admin/ apps/voting/src/app/page.tsx apps/voting/src/components/PromptList.tsx apps/voting/src/components/PromptCard.tsx
git commit -m "feat(voting): add admin stats bar and voter detail expansion"
```

---

### Task 10: Add Voting App to Build Pipeline and Vitest Workspace

**Files:**
- Modify: `package.json`
- Modify: `vitest.workspace.ts`

- [ ] **Step 1: Add the voting app to the root build script**

In root `package.json`, update the `build` script to include the voting app. Change:

```
"build": "pnpm --filter @photobot/db build && pnpm --filter @photobot/ai build && pnpm --filter @photobot/bot build && pnpm --filter @photobot/dashboard build"
```

To:

```
"build": "pnpm --filter @photobot/db build && pnpm --filter @photobot/ai build && pnpm --filter @photobot/bot build && pnpm --filter @photobot/dashboard build && pnpm --filter @photobot/voting build"
```

- [ ] **Step 2: Add voting to vitest workspace**

Add to the array in `vitest.workspace.ts`:

```typescript
'apps/voting/vitest.config.ts',
```

- [ ] **Step 3: Run full build and test**

Run: `pnpm -w run build && pnpm -w run test`
Expected: All packages build. All tests pass (previous 176 + new voting tests).

- [ ] **Step 4: Commit**

```bash
git add package.json vitest.workspace.ts
git commit -m "feat(voting): add voting app to build pipeline and test workspace"
```
