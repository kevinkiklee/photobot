# Discussion Prompt Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/discuss` command and scheduled auto-posting system for photography community engagement.

**Architecture:** New Prisma models (`DiscussionSchedule`, `DiscussionPromptLog`) store schedule config and history. A curated prompt bank in `constants.ts` provides reliable defaults; AI generation via `aiProvider.analyzeText()` is opt-in. `node-cron` runs inside the bot process with DB persistence and startup recovery. Dashboard gets a new feature toggle entry and schedule management UI.

**Tech Stack:** discord.js 14, Prisma 5, node-cron, vitest, Next.js 14 (App Router)

---

### Task 1: Prisma Schema — Add DiscussionSchedule and DiscussionPromptLog

**Files:**
- Modify: `packages/db/prisma/schema.prisma:109` (append after UserUsageMetric)

- [ ] **Step 1: Add models to Prisma schema**

Add the following at the end of `packages/db/prisma/schema.prisma`:

```prisma
model DiscussionSchedule {
  id             String   @id @default(cuid())
  serverId       String   @map("server_id")
  channelId      String   @map("channel_id")
  days           Json     // Array of day numbers: 0=Sun..6=Sat
  timeUtc        String   @map("time_utc") // e.g. "14:00"
  timezone       String   @default("UTC") // IANA timezone for display
  categoryFilter String?  @map("category_filter")
  useAi          Boolean  @default(false) @map("use_ai")
  isActive       Boolean  @default(true) @map("is_active")
  createdBy      String   @map("created_by")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  @@unique([serverId, channelId])
  @@map("discussion_schedules")
}

model DiscussionPromptLog {
  id         String   @id @default(cuid())
  serverId   String   @map("server_id")
  channelId  String   @map("channel_id")
  promptText String   @map("prompt_text")
  category   String
  source     String   // "curated" or "ai"
  threadId   String?  @map("thread_id")
  postedAt   DateTime @default(now()) @map("posted_at")

  @@index([serverId, postedAt])
  @@map("discussion_prompt_logs")
}
```

- [ ] **Step 2: Push schema to database**

Run: `pnpm db push`
Expected: Schema synced, no errors.

- [ ] **Step 3: Verify Prisma client has new types**

Run: `cd packages/db && npx prisma generate`
Expected: `Generated Prisma Client` output with no errors.

- [ ] **Step 4: Commit**

```bash
git add packages/db/prisma/schema.prisma
git commit -m "feat: add DiscussionSchedule and DiscussionPromptLog models"
```

---

### Task 2: Curated Prompt Bank

**Files:**
- Modify: `apps/bot/src/constants.ts`

- [ ] **Step 1: Write the test for prompt bank structure**

Create `apps/bot/src/__tests__/constants.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { DISCUSSION_PROMPTS, DISCUSSION_CATEGORIES } from '../constants';

describe('Curated Prompt Bank', () => {
  it('has prompts for every category', () => {
    const categories = Object.keys(DISCUSSION_CATEGORIES);
    for (const cat of categories) {
      const prompts = DISCUSSION_PROMPTS.filter(p => p.category === cat);
      expect(prompts.length).toBeGreaterThanOrEqual(10);
    }
  });

  it('every prompt has a non-empty text and 3 reactions', () => {
    for (const prompt of DISCUSSION_PROMPTS) {
      expect(prompt.text.length).toBeGreaterThan(0);
      expect(prompt.reactions).toHaveLength(3);
    }
  });

  it('every prompt category is a valid category key', () => {
    const validCategories = Object.keys(DISCUSSION_CATEGORIES);
    for (const prompt of DISCUSSION_PROMPTS) {
      expect(validCategories).toContain(prompt.category);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd apps/bot && pnpm test -- src/__tests__/constants.test.ts`
Expected: FAIL — `DISCUSSION_PROMPTS` and `DISCUSSION_CATEGORIES` not exported.

- [ ] **Step 3: Add prompt bank to constants.ts**

Replace the contents of `apps/bot/src/constants.ts` with:

```typescript
export const BRAND_COLOR = 0x74D7EC;

export interface DiscussionPrompt {
  category: string;
  text: string;
  reactions: string[];
}

export const DISCUSSION_CATEGORIES: Record<string, { label: string; description: string }> = {
  technique: { label: 'Technique', description: 'Composition, exposure, lighting, post-processing' },
  gear: { label: 'Gear', description: 'Lenses, cameras, accessories, workflow tools' },
  creative: { label: 'Creative Process', description: 'Inspiration, artistic voice, creative blocks' },
  challenge: { label: 'Challenge', description: 'Photo assignments and creative constraints' },
  inspiration: { label: 'Inspiration', description: 'Other art forms, artists, cross-discipline ideas' },
};

export const DISCUSSION_PROMPTS: DiscussionPrompt[] = [
  // --- technique (12) ---
  { category: 'technique', text: "What's a composition rule you intentionally break, and what made you start?", reactions: ['📐', '🎯', '💡'] },
  { category: 'technique', text: 'How do you decide between shooting wide open vs. stopped down for a portrait?', reactions: ['📸', '🔍', '🤔'] },
  { category: 'technique', text: 'What is your go-to approach for handling harsh midday light?', reactions: ['☀️', '🌤️', '💡'] },
  { category: 'technique', text: "Share a photo where you nailed the exposure in a tricky situation — what was your metering strategy?", reactions: ['🎯', '📊', '🔥'] },
  { category: 'technique', text: 'Do you prefer to get it right in camera or fix it in post? Where do you draw the line?', reactions: ['📷', '🖥️', '⚖️'] },
  { category: 'technique', text: 'What is the most underrated post-processing technique you use regularly?', reactions: ['🖥️', '✨', '💎'] },
  { category: 'technique', text: "How do you approach focus stacking for landscape shots? Any tips for beginners?", reactions: ['🏔️', '🔍', '📚'] },
  { category: 'technique', text: "What's the biggest mistake you see beginners make with white balance?", reactions: ['🎨', '🌡️', '📝'] },
  { category: 'technique', text: 'When do you choose black and white over color, and what drives that decision?', reactions: ['⬛', '⬜', '🎭'] },
  { category: 'technique', text: 'How has your editing style evolved over the past year?', reactions: ['📈', '🖌️', '🔄'] },
  { category: 'technique', text: "What's one technique you struggled with but finally mastered? How did it click?", reactions: ['💪', '💡', '🎉'] },
  { category: 'technique', text: 'Do you shoot bracketed exposures often? When is it worth the effort?', reactions: ['📊', '🌅', '🤷'] },

  // --- gear (11) ---
  { category: 'gear', text: "What's the one piece of gear (besides your camera) you never leave home without?", reactions: ['🎒', '⭐', '📸'] },
  { category: 'gear', text: 'If you could only shoot with one focal length for a year, what would you choose and why?', reactions: ['🔭', '📏', '🤔'] },
  { category: 'gear', text: "What's the best budget photography accessory you've ever bought?", reactions: ['💰', '🏆', '🛒'] },
  { category: 'gear', text: 'Tripod or no tripod — when do you insist on using one?', reactions: ['📐', '🖐️', '⚖️'] },
  { category: 'gear', text: "What software or app has most improved your workflow this year?", reactions: ['💻', '📱', '🚀'] },
  { category: 'gear', text: 'Do you use filters (ND, polarizer, etc.) regularly? Which ones and when?', reactions: ['🔲', '🌊', '🏔️'] },
  { category: 'gear', text: "What's a piece of gear you bought that turned out to be a waste of money?", reactions: ['💸', '😅', '🗑️'] },
  { category: 'gear', text: 'Prime vs. zoom — what is your philosophy and has it changed over time?', reactions: ['🔍', '🔭', '🔄'] },
  { category: 'gear', text: "How do you organize and back up your photo library?", reactions: ['💾', '📂', '☁️'] },
  { category: 'gear', text: "What camera bag setup are you currently using and what would you change?", reactions: ['🎒', '📦', '✏️'] },
  { category: 'gear', text: 'Have you tried any AI-powered editing tools? What do you think of them?', reactions: ['🤖', '🖌️', '👍'] },

  // --- creative (11) ---
  { category: 'creative', text: 'How do you push through a creative rut when nothing feels inspiring?', reactions: ['🧠', '💪', '🌟'] },
  { category: 'creative', text: "What other art form influences your photography the most?", reactions: ['🎨', '🎵', '📖'] },
  { category: 'creative', text: "How do you find your personal style and keep it evolving?", reactions: ['🔍', '🎭', '📈'] },
  { category: 'creative', text: 'Do you plan your shoots in advance or prefer spontaneous discovery?', reactions: ['📋', '🎲', '⚖️'] },
  { category: 'creative', text: "What's a project or series you've been wanting to start but haven't yet? What's holding you back?", reactions: ['💭', '🚧', '🚀'] },
  { category: 'creative', text: 'How do you balance shooting for yourself vs. shooting what gets engagement?', reactions: ['❤️', '📊', '🤔'] },
  { category: 'creative', text: "What's the most meaningful feedback you've ever received on your work?", reactions: ['💬', '💡', '🙏'] },
  { category: 'creative', text: 'Do you keep a photography journal or sketchbook? How does it help your process?', reactions: ['📓', '✏️', '💡'] },
  { category: 'creative', text: "What emotion or feeling do you most want your photos to evoke?", reactions: ['😊', '😢', '😮'] },
  { category: 'creative', text: 'How do you decide when a photo is "done" in post-processing?', reactions: ['✅', '🖥️', '🤔'] },
  { category: 'creative', text: "Has your 'why' for photography changed since you started?", reactions: ['💭', '🔄', '❤️'] },

  // --- challenge (10) ---
  { category: 'challenge', text: 'Challenge: shoot 10 photos using only natural window light this week. Share your favorite!', reactions: ['🪟', '☀️', '📸'] },
  { category: 'challenge', text: 'Challenge: capture a compelling photo where the main subject takes up less than 10% of the frame.', reactions: ['🔍', '🖼️', '🎯'] },
  { category: 'challenge', text: 'Challenge: take a photo that tells a complete story without showing any faces.', reactions: ['📖', '🎭', '📷'] },
  { category: 'challenge', text: "Challenge: photograph something mundane and make it look extraordinary.", reactions: ['🥄', '✨', '🏆'] },
  { category: 'challenge', text: 'Challenge: shoot a series of 3 photos that work together to convey a mood.', reactions: ['🎭', '3️⃣', '🌙'] },
  { category: 'challenge', text: 'Challenge: use only your phone camera for a day and share the best result.', reactions: ['📱', '🏆', '👀'] },
  { category: 'challenge', text: 'Challenge: find and photograph an interesting shadow. Bonus if it tells a story.', reactions: ['🌑', '📸', '⭐'] },
  { category: 'challenge', text: 'Challenge: take a self-portrait without showing your face.', reactions: ['🤳', '🎭', '🔥'] },
  { category: 'challenge', text: 'Challenge: photograph the same subject from 5 different angles. Which works best?', reactions: ['🔄', '5️⃣', '👁️'] },
  { category: 'challenge', text: 'Challenge: capture motion blur intentionally to create an abstract image.', reactions: ['💨', '🎨', '📸'] },

  // --- inspiration (10) ---
  { category: 'inspiration', text: "What photographer's work has had the biggest impact on how you see the world?", reactions: ['👁️', '🌍', '📚'] },
  { category: 'inspiration', text: 'Has a painting, film, or piece of music ever directly inspired a photo you took?', reactions: ['🎨', '🎬', '🎵'] },
  { category: 'inspiration', text: "What's a photography book or documentary you'd recommend to everyone here?", reactions: ['📖', '🎬', '⭐'] },
  { category: 'inspiration', text: 'How does the place you live shape the kind of photos you take?', reactions: ['🏙️', '🌲', '📸'] },
  { category: 'inspiration', text: "What non-photography skill has unexpectedly improved your photos?", reactions: ['🧩', '💡', '📈'] },
  { category: 'inspiration', text: 'Do you look at other photographers\' work for inspiration, or do you avoid it to stay original?', reactions: ['👀', '🚫', '⚖️'] },
  { category: 'inspiration', text: "What's a genre of photography you've never tried but are curious about?", reactions: ['🆕', '🤔', '🎯'] },
  { category: 'inspiration', text: 'If you could photograph any event, place, or person — past or present — what would it be?', reactions: ['🌍', '⏳', '✨'] },
  { category: 'inspiration', text: "How do you use social media as inspiration without falling into comparison?", reactions: ['📱', '⚖️', '💪'] },
  { category: 'inspiration', text: 'What everyday moment recently caught your eye and made you wish you had your camera?', reactions: ['👁️', '📷', '💭'] },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd apps/bot && pnpm test -- src/__tests__/constants.test.ts`
Expected: All 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add apps/bot/src/constants.ts apps/bot/src/__tests__/constants.test.ts
git commit -m "feat: add curated discussion prompt bank with 54 prompts across 5 categories"
```

---

### Task 3: Prompt Selection Logic

**Files:**
- Create: `apps/bot/src/services/prompts.ts`
- Create: `apps/bot/src/__tests__/prompts.test.ts`

- [ ] **Step 1: Write the tests**

Create `apps/bot/src/__tests__/prompts.test.ts`:

```typescript
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { selectPrompt } from '../services/prompts';
import { DISCUSSION_PROMPTS } from '../constants';

vi.mock('@photobot/db', () => ({
  prisma: {
    discussionPromptLog: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('@photobot/ai', () => ({
  AIProviderError: class extends Error {},
}));

vi.mock('../services/ai', () => ({
  aiProvider: {
    analyzeText: vi.fn(),
  },
}));

import { prisma } from '@photobot/db';
import { aiProvider } from '../services/ai';

describe('selectPrompt', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (prisma.discussionPromptLog.findMany as any).mockResolvedValue([]);
  });

  it('returns a curated prompt when useAi is false', async () => {
    const result = await selectPrompt('server-1', false, null);
    expect(result.source).toBe('curated');
    expect(result.text.length).toBeGreaterThan(0);
    expect(result.reactions).toHaveLength(3);
  });

  it('filters by category when provided', async () => {
    const result = await selectPrompt('server-1', false, 'gear');
    expect(result.source).toBe('curated');
    expect(result.category).toBe('gear');
  });

  it('excludes recently used prompts', async () => {
    // Mark all gear prompts except one as recently used
    const gearPrompts = DISCUSSION_PROMPTS.filter(p => p.category === 'gear');
    const recentLogs = gearPrompts.slice(0, -1).map(p => ({ promptText: p.text }));
    (prisma.discussionPromptLog.findMany as any).mockResolvedValue(recentLogs);

    const result = await selectPrompt('server-1', false, 'gear');
    expect(result.text).toBe(gearPrompts[gearPrompts.length - 1].text);
  });

  it('resets and allows repeats when all prompts are exhausted', async () => {
    const gearPrompts = DISCUSSION_PROMPTS.filter(p => p.category === 'gear');
    const recentLogs = gearPrompts.map(p => ({ promptText: p.text }));
    (prisma.discussionPromptLog.findMany as any).mockResolvedValue(recentLogs);

    const result = await selectPrompt('server-1', false, 'gear');
    expect(result.source).toBe('curated');
    expect(result.category).toBe('gear');
  });

  it('uses AI when useAi is true', async () => {
    (aiProvider.analyzeText as any).mockResolvedValue('What makes a great street photo?');

    const result = await selectPrompt('server-1', true, 'technique');
    expect(result.source).toBe('ai');
    expect(result.text).toBe('What makes a great street photo?');
  });

  it('falls back to curated when AI fails', async () => {
    (aiProvider.analyzeText as any).mockRejectedValue(new Error('AI timeout'));

    const result = await selectPrompt('server-1', true, null);
    expect(result.source).toBe('curated');
    expect(result.text.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd apps/bot && pnpm test -- src/__tests__/prompts.test.ts`
Expected: FAIL — `selectPrompt` not found.

- [ ] **Step 3: Implement prompt selection**

Create `apps/bot/src/services/prompts.ts`:

```typescript
import { prisma } from '@photobot/db';
import { DISCUSSION_PROMPTS, DISCUSSION_CATEGORIES, type DiscussionPrompt } from '../constants';
import { aiProvider } from './ai';

interface PromptResult {
  text: string;
  category: string;
  source: 'curated' | 'ai';
  reactions: string[];
}

const AI_PROMPT_TEMPLATE = (category: string | null) => `Generate a single engaging discussion question for a photography Discord community.

Category: ${category ? DISCUSSION_CATEGORIES[category]?.label ?? category : 'any photography or creative topic'}

Requirements:
- Be specific and thought-provoking, not generic
- Encourage members to share experiences, opinions, or photos
- Keep it to 1-2 sentences
- Do not include any preamble, numbering, or formatting — just the question`;

const DEFAULT_REACTIONS = ['📸', '💬', '💡'];

export async function selectPrompt(
  serverId: string,
  useAi: boolean,
  category: string | null,
): Promise<PromptResult> {
  if (useAi) {
    try {
      const text = await aiProvider.analyzeText(AI_PROMPT_TEMPLATE(category));
      const trimmed = text.trim().replace(/^["']|["']$/g, '');
      if (trimmed.length > 0) {
        return {
          text: trimmed,
          category: category ?? 'mixed',
          source: 'ai',
          reactions: DEFAULT_REACTIONS,
        };
      }
    } catch (error) {
      console.error('AI prompt generation failed, falling back to curated:', error);
    }
  }

  return selectCuratedPrompt(serverId, category);
}

async function selectCuratedPrompt(
  serverId: string,
  category: string | null,
): Promise<PromptResult> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentLogs = await prisma.discussionPromptLog.findMany({
    where: { serverId, postedAt: { gte: thirtyDaysAgo } },
    select: { promptText: true },
  });

  const recentTexts = new Set(recentLogs.map(l => l.promptText));

  let candidates = DISCUSSION_PROMPTS;
  if (category) {
    candidates = candidates.filter(p => p.category === category);
  }

  let available = candidates.filter(p => !recentTexts.has(p.text));

  // Reset if all exhausted
  if (available.length === 0) {
    available = candidates;
  }

  const pick = available[Math.floor(Math.random() * available.length)];
  return {
    text: pick.text,
    category: pick.category,
    source: 'curated',
    reactions: pick.reactions,
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd apps/bot && pnpm test -- src/__tests__/prompts.test.ts`
Expected: All 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add apps/bot/src/services/prompts.ts apps/bot/src/__tests__/prompts.test.ts
git commit -m "feat: add prompt selection service with curated fallback and AI generation"
```

---

### Task 4: `/discuss` Slash Command

**Files:**
- Create: `apps/bot/src/commands/discuss.ts`
- Create: `apps/bot/src/__tests__/discuss.test.ts`
- Modify: `apps/bot/src/index.ts`

- [ ] **Step 1: Write the tests**

Create `apps/bot/src/__tests__/discuss.test.ts`:

```typescript
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@photobot/db', () => ({
  prisma: {
    discussionSchedule: {
      upsert: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    discussionPromptLog: {
      create: vi.fn(),
    },
    configAuditLog: {
      create: vi.fn(),
    },
  },
}));

vi.mock('../services/prompts', () => ({
  selectPrompt: vi.fn(),
}));

vi.mock('../middleware/permissions', () => ({
  canUseFeature: vi.fn(),
}));

import { prisma } from '@photobot/db';
import { selectPrompt } from '../services/prompts';
import { canUseFeature } from '../middleware/permissions';
import { execute, data } from '../commands/discuss';

describe('Discuss Command', () => {
  let interaction: any;

  beforeEach(() => {
    vi.clearAllMocks();

    (canUseFeature as any).mockResolvedValue(true);
    (selectPrompt as any).mockResolvedValue({
      text: 'What is your favorite lens?',
      category: 'gear',
      source: 'curated',
      reactions: ['🔭', '📏', '🤔'],
    });
    (prisma.discussionPromptLog.create as any).mockResolvedValue({});
    (prisma.discussionSchedule.upsert as any).mockResolvedValue({});
    (prisma.discussionSchedule.findMany as any).mockResolvedValue([]);
    (prisma.configAuditLog.create as any).mockResolvedValue({});

    interaction = {
      guildId: 'guild-123',
      channelId: 'channel-123',
      user: { id: 'user-123' },
      member: { roles: { cache: new Map([['role-1', { id: 'role-1' }]]) } },
      options: {
        getSubcommand: vi.fn(),
        getString: vi.fn(),
        getChannel: vi.fn(),
        getBoolean: vi.fn(),
      },
      deferReply: vi.fn().mockResolvedValue(undefined),
      editReply: vi.fn().mockResolvedValue(undefined),
      reply: vi.fn().mockResolvedValue({
        id: 'msg-123',
        startThread: vi.fn().mockResolvedValue({ id: 'thread-123' }),
        react: vi.fn().mockResolvedValue(undefined),
      }),
    };
  });

  it('has the correct command name', () => {
    expect(data.name).toBe('discuss');
  });

  describe('prompt subcommand', () => {
    beforeEach(() => {
      interaction.options.getSubcommand.mockReturnValue('prompt');
      interaction.options.getString.mockReturnValue(null);
    });

    it('posts a discussion prompt embed with thread and reactions', async () => {
      await execute(interaction);

      expect(selectPrompt).toHaveBeenCalledWith('guild-123', false, null);
      expect(interaction.reply).toHaveBeenCalledWith(
        expect.objectContaining({
          embeds: expect.arrayContaining([
            expect.objectContaining({
              data: expect.objectContaining({
                title: 'Discussion Prompt',
                description: expect.stringContaining('What is your favorite lens?'),
              }),
            }),
          ]),
        })
      );
    });

    it('creates a thread on the reply message', async () => {
      await execute(interaction);

      const replyMsg = await interaction.reply.mock.results[0].value;
      expect(replyMsg.startThread).toHaveBeenCalledWith(
        expect.objectContaining({
          name: expect.stringContaining('Discuss:'),
        })
      );
    });

    it('adds reactions to the reply message', async () => {
      await execute(interaction);

      const replyMsg = await interaction.reply.mock.results[0].value;
      expect(replyMsg.react).toHaveBeenCalledTimes(3);
    });

    it('logs the prompt to DiscussionPromptLog', async () => {
      await execute(interaction);

      expect(prisma.discussionPromptLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          serverId: 'guild-123',
          promptText: 'What is your favorite lens?',
          category: 'gear',
          source: 'curated',
        }),
      });
    });

    it('blocks when feature is disabled', async () => {
      (canUseFeature as any).mockResolvedValue(false);

      await execute(interaction);

      expect(interaction.reply).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.stringContaining('not enabled'),
          ephemeral: true,
        })
      );
      expect(selectPrompt).not.toHaveBeenCalled();
    });

    it('passes category filter when provided', async () => {
      interaction.options.getString.mockReturnValue('technique');

      await execute(interaction);

      expect(selectPrompt).toHaveBeenCalledWith('guild-123', false, 'technique');
    });
  });

  describe('schedule subcommand', () => {
    beforeEach(() => {
      interaction.options.getSubcommand.mockReturnValue('schedule');
      interaction.options.getChannel.mockReturnValue({ id: 'channel-456', name: 'photo-talk' });
      interaction.options.getString.mockImplementation((name: string) => {
        if (name === 'days') return 'mon,wed,fri';
        if (name === 'time') return '9:00';
        if (name === 'timezone') return null;
        if (name === 'category') return null;
        return null;
      });
      interaction.options.getBoolean.mockReturnValue(false);
    });

    it('creates a schedule and replies with confirmation', async () => {
      await execute(interaction);

      expect(prisma.discussionSchedule.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            serverId_channelId: { serverId: 'guild-123', channelId: 'channel-456' },
          },
          create: expect.objectContaining({
            serverId: 'guild-123',
            channelId: 'channel-456',
            days: [1, 3, 5],
            timeUtc: '09:00',
          }),
        })
      );

      expect(interaction.reply).toHaveBeenCalledWith(
        expect.objectContaining({ ephemeral: true })
      );
    });

    it('creates an audit log entry', async () => {
      await execute(interaction);

      expect(prisma.configAuditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          serverId: 'guild-123',
          userId: 'user-123',
          action: 'SET_SCHEDULE',
          featureKey: 'discuss',
        }),
      });
    });
  });

  describe('list subcommand', () => {
    beforeEach(() => {
      interaction.options.getSubcommand.mockReturnValue('list');
    });

    it('displays schedules as an embed', async () => {
      (prisma.discussionSchedule.findMany as any).mockResolvedValue([
        {
          channelId: 'channel-456',
          days: [1, 3, 5],
          timeUtc: '09:00',
          timezone: 'UTC',
          categoryFilter: null,
          useAi: false,
          isActive: true,
        },
      ]);

      await execute(interaction);

      expect(interaction.reply).toHaveBeenCalledWith(
        expect.objectContaining({
          embeds: expect.arrayContaining([
            expect.objectContaining({
              data: expect.objectContaining({
                title: 'Discussion Schedules',
              }),
            }),
          ]),
          ephemeral: true,
        })
      );
    });

    it('shows a message when no schedules exist', async () => {
      await execute(interaction);

      expect(interaction.reply).toHaveBeenCalledWith(
        expect.objectContaining({ ephemeral: true })
      );
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd apps/bot && pnpm test -- src/__tests__/discuss.test.ts`
Expected: FAIL — `discuss` command module not found.

- [ ] **Step 3: Implement the discuss command**

Create `apps/bot/src/commands/discuss.ts`:

```typescript
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  ChannelType,
} from 'discord.js';
import { prisma } from '@photobot/db';
import { BRAND_COLOR } from '../constants';
import { selectPrompt } from '../services/prompts';
import { canUseFeature } from '../middleware/permissions';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DAY_PARSE_MAP: Record<string, number[]> = {
  sun: [0], mon: [1], tue: [2], wed: [3], thu: [4], fri: [5], sat: [6],
  daily: [0, 1, 2, 3, 4, 5, 6],
  weekdays: [1, 2, 3, 4, 5],
  weekends: [0, 6],
};

function parseDays(input: string): number[] {
  const parts = input.toLowerCase().split(',').map(s => s.trim());
  const days = new Set<number>();
  for (const part of parts) {
    const mapped = DAY_PARSE_MAP[part];
    if (mapped) mapped.forEach(d => days.add(d));
  }
  return Array.from(days).sort();
}

function parseTime(input: string): string {
  const match = input.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return '00:00';
  const h = match[1].padStart(2, '0');
  const m = match[2];
  return `${h}:${m}`;
}

export const data = new SlashCommandBuilder()
  .setName('discuss')
  .setDescription('Photography discussion prompts for community engagement')
  .addSubcommand(sub =>
    sub.setName('prompt')
      .setDescription('Post a discussion prompt')
      .addStringOption(opt =>
        opt.setName('category')
          .setDescription('Prompt category')
          .addChoices(
            { name: 'Technique', value: 'technique' },
            { name: 'Gear', value: 'gear' },
            { name: 'Creative Process', value: 'creative' },
            { name: 'Challenge', value: 'challenge' },
            { name: 'Inspiration', value: 'inspiration' },
          )
      )
  )
  .addSubcommand(sub =>
    sub.setName('schedule')
      .setDescription('Set up automatic discussion prompts')
      .addChannelOption(opt =>
        opt.setName('channel')
          .setDescription('Channel for auto-posts')
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true)
      )
      .addStringOption(opt =>
        opt.setName('days')
          .setDescription('Days to post (e.g. "mon,wed,fri", "daily", "weekdays")')
          .setRequired(true)
      )
      .addStringOption(opt =>
        opt.setName('time')
          .setDescription('Time in UTC (e.g. "9:00", "14:30")')
          .setRequired(true)
      )
      .addStringOption(opt =>
        opt.setName('timezone')
          .setDescription('Your timezone for display (e.g. "America/New_York")')
      )
      .addStringOption(opt =>
        opt.setName('category')
          .setDescription('Limit to a category')
          .addChoices(
            { name: 'Technique', value: 'technique' },
            { name: 'Gear', value: 'gear' },
            { name: 'Creative Process', value: 'creative' },
            { name: 'Challenge', value: 'challenge' },
            { name: 'Inspiration', value: 'inspiration' },
          )
      )
      .addBooleanOption(opt =>
        opt.setName('use_ai')
          .setDescription('Use AI to generate prompts (default: false)')
      )
  )
  .addSubcommand(sub =>
    sub.setName('list')
      .setDescription('List discussion schedules for this server')
  ) as SlashCommandBuilder;

export async function execute(interaction: ChatInputCommandInteraction) {
  const guildId = interaction.guildId;
  if (!guildId) {
    return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
  }

  const subcommand = interaction.options.getSubcommand();

  if (subcommand === 'prompt') {
    return handlePrompt(interaction, guildId);
  }
  if (subcommand === 'schedule') {
    return handleSchedule(interaction, guildId);
  }
  if (subcommand === 'list') {
    return handleList(interaction, guildId);
  }
}

async function handlePrompt(interaction: ChatInputCommandInteraction, guildId: string) {
  const roleIds = interaction.member?.roles
    ? [...(interaction.member.roles as any).cache.keys()]
    : [];

  const allowed = await canUseFeature(guildId, interaction.channelId, roleIds, 'discuss');
  if (!allowed) {
    return interaction.reply({
      content: 'The discussion prompt feature is not enabled for this server.',
      ephemeral: true,
    });
  }

  const category = interaction.options.getString('category');

  // Check if server has a schedule with useAi
  const schedule = await prisma.discussionSchedule.findUnique({
    where: { serverId_channelId: { serverId: guildId, channelId: interaction.channelId } },
  });
  const useAi = schedule?.useAi ?? false;

  const prompt = await selectPrompt(guildId, useAi, category);

  const embed = new EmbedBuilder()
    .setColor(BRAND_COLOR)
    .setTitle('Discussion Prompt')
    .setDescription(`${prompt.text}\n\n*Jump into the thread below to share your thoughts!*`)
    .setFooter({ text: `Photobot • ${prompt.category}` })
    .setTimestamp();

  const replyMsg = await interaction.reply({
    embeds: [embed],
    fetchReply: true,
  });

  // Create thread
  const threadName = `Discuss: ${prompt.text.slice(0, 90)}`;
  let threadId: string | null = null;
  try {
    const thread = await replyMsg.startThread({ name: threadName });
    threadId = thread.id;
  } catch (err) {
    console.error('Failed to create discussion thread:', err);
  }

  // Add reactions
  for (const emoji of prompt.reactions) {
    try {
      await replyMsg.react(emoji);
    } catch (err) {
      console.error('Failed to add reaction:', err);
    }
  }

  // Log to database
  await prisma.discussionPromptLog.create({
    data: {
      serverId: guildId,
      channelId: interaction.channelId,
      promptText: prompt.text,
      category: prompt.category,
      source: prompt.source,
      threadId,
    },
  });
}

async function handleSchedule(interaction: ChatInputCommandInteraction, guildId: string) {
  const channel = interaction.options.getChannel('channel', true);
  const daysInput = interaction.options.getString('days', true);
  const timeInput = interaction.options.getString('time', true);
  const timezone = interaction.options.getString('timezone') ?? 'UTC';
  const category = interaction.options.getString('category');
  const useAi = interaction.options.getBoolean('use_ai') ?? false;

  const days = parseDays(daysInput);
  if (days.length === 0) {
    return interaction.reply({
      content: 'Invalid days format. Use names like "mon,wed,fri", "daily", or "weekdays".',
      ephemeral: true,
    });
  }

  const timeUtc = parseTime(timeInput);

  await prisma.discussionSchedule.upsert({
    where: {
      serverId_channelId: { serverId: guildId, channelId: channel.id },
    },
    update: { days, timeUtc, timezone, categoryFilter: category, useAi, createdBy: interaction.user.id },
    create: {
      serverId: guildId,
      channelId: channel.id,
      days,
      timeUtc,
      timezone,
      categoryFilter: category,
      useAi,
      createdBy: interaction.user.id,
    },
  });

  await prisma.configAuditLog.create({
    data: {
      serverId: guildId,
      userId: interaction.user.id,
      action: 'SET_SCHEDULE',
      targetType: 'CHANNEL',
      targetId: channel.id,
      featureKey: 'discuss',
      newValue: { days, timeUtc, timezone, categoryFilter: category, useAi },
    },
  });

  const dayLabels = days.map(d => DAY_NAMES[d]).join(', ');
  return interaction.reply({
    content: `Discussion schedule set for <#${channel.id}>: **${dayLabels}** at **${timeUtc} UTC** (${timezone}).${category ? ` Category: ${category}.` : ''}${useAi ? ' AI-generated prompts enabled.' : ''}`,
    ephemeral: true,
  });
}

async function handleList(interaction: ChatInputCommandInteraction, guildId: string) {
  const schedules = await prisma.discussionSchedule.findMany({
    where: { serverId: guildId },
  });

  const embed = new EmbedBuilder()
    .setColor(BRAND_COLOR)
    .setTitle('Discussion Schedules')
    .setFooter({ text: 'Photobot' })
    .setTimestamp();

  if (schedules.length === 0) {
    embed.setDescription('No discussion schedules configured. Use `/discuss schedule` to create one.');
  } else {
    for (const s of schedules) {
      const dayLabels = (s.days as number[]).map(d => DAY_NAMES[d]).join(', ');
      const status = s.isActive ? '✅ Active' : '⏸️ Paused';
      const ai = s.useAi ? ' | AI' : '';
      const cat = s.categoryFilter ? ` | ${s.categoryFilter}` : '';
      embed.addFields({
        name: `<#${s.channelId}>`,
        value: `${dayLabels} at ${s.timeUtc} UTC (${s.timezone}) — ${status}${ai}${cat}`,
      });
    }
  }

  return interaction.reply({ embeds: [embed], ephemeral: true });
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd apps/bot && pnpm test -- src/__tests__/discuss.test.ts`
Expected: All tests pass.

- [ ] **Step 5: Register the command in index.ts**

In `apps/bot/src/index.ts`, add the import and registration:

After line 9 (`import * as paletteCommand from './commands/palette';`), add:
```typescript
import * as discussCommand from './commands/discuss';
```

After line 25 (`client.commands.set(paletteCommand.data.name, paletteCommand);`), add:
```typescript
client.commands.set(discussCommand.data.name, discussCommand);
```

In the `rest.put` body array (line 44-47), add `discussCommand.data.toJSON()`:
```typescript
{ body: [
  settingsCommand.data.toJSON(),
  critiqueCommand.data.toJSON(),
  paletteCommand.data.toJSON(),
  discussCommand.data.toJSON(),
] },
```

- [ ] **Step 6: Run all bot tests to verify nothing is broken**

Run: `cd apps/bot && pnpm test`
Expected: All tests pass.

- [ ] **Step 7: Commit**

```bash
git add apps/bot/src/commands/discuss.ts apps/bot/src/__tests__/discuss.test.ts apps/bot/src/index.ts
git commit -m "feat: add /discuss command with prompt, schedule, and list subcommands"
```

---

### Task 5: Scheduler Service

**Files:**
- Create: `apps/bot/src/services/scheduler.ts`
- Create: `apps/bot/src/__tests__/scheduler.test.ts`
- Modify: `apps/bot/src/index.ts`
- Modify: `apps/bot/package.json`

- [ ] **Step 1: Install node-cron**

Run: `cd apps/bot && pnpm add node-cron && pnpm add -D @types/node-cron`

- [ ] **Step 2: Write the tests**

Create `apps/bot/src/__tests__/scheduler.test.ts`:

```typescript
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

vi.mock('node-cron', () => ({
  schedule: vi.fn().mockReturnValue({ stop: vi.fn() }),
}));

vi.mock('@photobot/db', () => ({
  prisma: {
    discussionSchedule: {
      findMany: vi.fn(),
    },
    discussionPromptLog: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('../middleware/permissions', () => ({
  canUseFeature: vi.fn(),
}));

vi.mock('../services/prompts', () => ({
  selectPrompt: vi.fn(),
}));

import cron from 'node-cron';
import { prisma } from '@photobot/db';
import { canUseFeature } from '../middleware/permissions';
import { selectPrompt } from '../services/prompts';
import { buildCronExpression, startScheduler, stopScheduler } from '../services/scheduler';

describe('Scheduler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    (prisma.discussionSchedule.findMany as any).mockResolvedValue([]);
    (canUseFeature as any).mockResolvedValue(true);
    (selectPrompt as any).mockResolvedValue({
      text: 'Test prompt', category: 'technique', source: 'curated', reactions: ['📸', '💬', '💡'],
    });
    (prisma.discussionPromptLog.create as any).mockResolvedValue({});
    (prisma.discussionPromptLog.findFirst as any).mockResolvedValue(null);
  });

  afterEach(() => {
    stopScheduler();
    vi.useRealTimers();
  });

  describe('buildCronExpression', () => {
    it('converts days and time to cron format', () => {
      expect(buildCronExpression([1, 3, 5], '14:00')).toBe('0 14 * * 1,3,5');
    });

    it('handles single day', () => {
      expect(buildCronExpression([0], '09:30')).toBe('30 9 * * 0');
    });

    it('handles daily', () => {
      expect(buildCronExpression([0, 1, 2, 3, 4, 5, 6], '08:00')).toBe('0 8 * * 0,1,2,3,4,5,6');
    });
  });

  describe('startScheduler', () => {
    it('loads active schedules and registers cron jobs', async () => {
      (prisma.discussionSchedule.findMany as any).mockResolvedValue([
        { id: 'sched-1', serverId: 'guild-1', channelId: 'ch-1', days: [1, 3, 5], timeUtc: '09:00', useAi: false, categoryFilter: null, isActive: true },
      ]);

      const mockClient = { channels: { fetch: vi.fn() } } as any;
      await startScheduler(mockClient);

      expect(cron.schedule).toHaveBeenCalledWith(
        '0 9 * * 1,3,5',
        expect.any(Function),
        expect.objectContaining({ timezone: 'UTC' }),
      );
    });

    it('does not register jobs for inactive schedules', async () => {
      (prisma.discussionSchedule.findMany as any).mockResolvedValue([
        { id: 'sched-1', serverId: 'guild-1', channelId: 'ch-1', days: [1], timeUtc: '09:00', useAi: false, categoryFilter: null, isActive: false },
      ]);

      const mockClient = { channels: { fetch: vi.fn() } } as any;
      await startScheduler(mockClient);

      expect(cron.schedule).not.toHaveBeenCalled();
    });
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `cd apps/bot && pnpm test -- src/__tests__/scheduler.test.ts`
Expected: FAIL — `scheduler` module not found.

- [ ] **Step 4: Implement the scheduler**

Create `apps/bot/src/services/scheduler.ts`:

```typescript
import cron, { type ScheduledTask } from 'node-cron';
import { prisma } from '@photobot/db';
import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import { BRAND_COLOR } from '../constants';
import { selectPrompt } from './prompts';
import { canUseFeature } from '../middleware/permissions';

const activeJobs = new Map<string, ScheduledTask>();
let syncInterval: ReturnType<typeof setInterval> | null = null;
let clientRef: Client | null = null;

export function buildCronExpression(days: number[], timeUtc: string): string {
  const [h, m] = timeUtc.split(':').map(Number);
  return `${m} ${h} * * ${days.join(',')}`;
}

export async function startScheduler(client: Client): Promise<void> {
  clientRef = client;
  await loadAndRegisterJobs();

  // Sync every 5 minutes to pick up dashboard changes
  syncInterval = setInterval(async () => {
    try {
      await loadAndRegisterJobs();
    } catch (err) {
      console.error('Schedule sync error:', err);
    }
  }, 5 * 60 * 1000);

  // Check for missed prompts
  await recoverMissedPrompts();
}

export function stopScheduler(): void {
  for (const [id, job] of activeJobs) {
    job.stop();
    activeJobs.delete(id);
  }
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
}

async function loadAndRegisterJobs(): Promise<void> {
  const schedules = await prisma.discussionSchedule.findMany({
    where: { isActive: true },
  });

  const activeIds = new Set(schedules.map(s => s.id));

  // Remove jobs for deleted/deactivated schedules
  for (const [id, job] of activeJobs) {
    if (!activeIds.has(id)) {
      job.stop();
      activeJobs.delete(id);
    }
  }

  // Register new/updated schedules
  for (const schedule of schedules) {
    const cronExpr = buildCronExpression(schedule.days as number[], schedule.timeUtc);

    if (activeJobs.has(schedule.id)) {
      // Already registered — skip (schedule changes require stop+re-register)
      continue;
    }

    const job = cron.schedule(
      cronExpr,
      () => { executeScheduledPrompt(schedule.id).catch(err => console.error('Scheduled prompt error:', err)); },
      { timezone: 'UTC' },
    );

    activeJobs.set(schedule.id, job);
  }
}

async function executeScheduledPrompt(scheduleId: string): Promise<void> {
  if (!clientRef) return;

  const schedule = await prisma.discussionSchedule.findMany({
    where: { id: scheduleId, isActive: true },
  });
  if (schedule.length === 0) return;

  const s = schedule[0];

  // Check feature is still enabled
  const allowed = await canUseFeature(s.serverId, s.channelId, [], 'discuss');
  if (!allowed) return;

  const prompt = await selectPrompt(s.serverId, s.useAi, s.categoryFilter);

  try {
    const channel = await clientRef.channels.fetch(s.channelId);
    if (!channel || !(channel instanceof TextChannel)) return;

    const embed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle('Discussion of the Day')
      .setDescription(`${prompt.text}\n\n*Jump into the thread below to share your thoughts!*`)
      .setFooter({ text: `Photobot • ${prompt.category}` })
      .setTimestamp();

    const msg = await channel.send({ embeds: [embed] });

    // Create thread
    const threadName = `Discuss: ${prompt.text.slice(0, 90)}`;
    let threadId: string | null = null;
    try {
      const thread = await msg.startThread({ name: threadName });
      threadId = thread.id;
    } catch (err) {
      console.error('Failed to create thread for scheduled prompt:', err);
    }

    // Add reactions
    for (const emoji of prompt.reactions) {
      try { await msg.react(emoji); } catch {}
    }

    // Log
    await prisma.discussionPromptLog.create({
      data: {
        serverId: s.serverId,
        channelId: s.channelId,
        promptText: prompt.text,
        category: prompt.category,
        source: prompt.source,
        threadId,
      },
    });
  } catch (err) {
    console.error(`Failed to post scheduled prompt to ${s.channelId}:`, err);
  }
}

async function recoverMissedPrompts(): Promise<void> {
  if (!clientRef) return;

  const schedules = await prisma.discussionSchedule.findMany({
    where: { isActive: true },
  });

  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  for (const s of schedules) {
    const lastLog = await prisma.discussionPromptLog.findFirst({
      where: { serverId: s.serverId, channelId: s.channelId },
      orderBy: { postedAt: 'desc' },
    });

    // Find the most recent scheduled time
    const [hour, minute] = s.timeUtc.split(':').map(Number);
    const days = s.days as number[];

    // Check backwards from now to find the last scheduled slot
    let expectedTime: Date | null = null;
    for (let daysBack = 0; daysBack < 7; daysBack++) {
      const candidate = new Date(now);
      candidate.setDate(candidate.getDate() - daysBack);
      candidate.setUTCHours(hour, minute, 0, 0);

      if (candidate > now) continue;
      if (!days.includes(candidate.getUTCDay())) continue;

      expectedTime = candidate;
      break;
    }

    if (!expectedTime) continue;
    if (expectedTime < twentyFourHoursAgo) continue;

    // If no log exists or last log is before expected time, fire recovery
    if (!lastLog || lastLog.postedAt < expectedTime) {
      console.log(`Recovering missed prompt for ${s.serverId}/${s.channelId}`);
      await executeScheduledPrompt(s.id);
    }
  }
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd apps/bot && pnpm test -- src/__tests__/scheduler.test.ts`
Expected: All tests pass.

- [ ] **Step 6: Wire scheduler into bot startup**

In `apps/bot/src/index.ts`, add the import after the command imports:
```typescript
import { startScheduler } from './services/scheduler';
```

Update the `ClientReady` handler (line 58-60) to start the scheduler:
```typescript
client.once(Events.ClientReady, async readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  await startScheduler(readyClient);
  console.log('Discussion scheduler started.');
});
```

- [ ] **Step 7: Run all bot tests**

Run: `cd apps/bot && pnpm test`
Expected: All tests pass.

- [ ] **Step 8: Commit**

```bash
git add apps/bot/src/services/scheduler.ts apps/bot/src/__tests__/scheduler.test.ts apps/bot/src/index.ts apps/bot/package.json
git commit -m "feat: add node-cron scheduler with DB persistence and missed-prompt recovery"
```

---

### Task 6: Dashboard — Feature Toggle + Schedule Management

**Files:**
- Modify: `apps/dashboard/src/app/(dashboard)/settings/page.tsx`
- Modify: `apps/dashboard/src/lib/actions.ts`

- [ ] **Step 1: Add discuss to feature metadata and available features**

In `apps/dashboard/src/app/(dashboard)/settings/page.tsx`:

Add `LucideMessageSquare` to the lucide-react import:
```typescript
import { LucideSparkles, LucidePalette, LucideSettings, LucideInfo, LucideMessageSquare } from 'lucide-react';
```

Add to `featureMeta`:
```typescript
discuss: {
  icon: LucideMessageSquare,
  description: 'AI-powered discussion prompts for community engagement',
},
```

Add `'discuss'` to the `availableFeatures` array:
```typescript
const availableFeatures = ['critique', 'palette', 'settings', 'discuss'];
```

- [ ] **Step 2: Add schedule server actions**

In `apps/dashboard/src/lib/actions.ts`, add after the existing `updateFeatureAction` function:

```typescript
export async function getDiscussionSchedules(serverId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error('Unauthorized');

  const adminGuilds = await getAdminGuilds(session.accessToken as string);
  if (!adminGuilds.some(g => g.id === serverId)) throw new Error('Forbidden');

  return prisma.discussionSchedule.findMany({
    where: { serverId },
    orderBy: { createdAt: 'asc' },
  });
}

export async function deleteDiscussionSchedule(scheduleId: string, serverId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error('Unauthorized');

  const adminGuilds = await getAdminGuilds(session.accessToken as string);
  if (!adminGuilds.some(g => g.id === serverId)) throw new Error('Forbidden');

  const schedule = await prisma.discussionSchedule.findUnique({ where: { id: scheduleId } });
  if (!schedule || schedule.serverId !== serverId) throw new Error('Not found');

  await prisma.discussionSchedule.delete({ where: { id: scheduleId } });

  await prisma.configAuditLog.create({
    data: {
      serverId,
      userId: (session.user as any)?.id || 'unknown',
      action: 'DELETE_SCHEDULE',
      targetType: 'CHANNEL',
      targetId: schedule.channelId,
      featureKey: 'discuss',
      oldValue: { days: schedule.days, timeUtc: schedule.timeUtc },
    },
  });

  revalidatePath('/settings');
  revalidatePath('/audit');
}

export async function toggleDiscussionSchedule(scheduleId: string, serverId: string, isActive: boolean) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error('Unauthorized');

  const adminGuilds = await getAdminGuilds(session.accessToken as string);
  if (!adminGuilds.some(g => g.id === serverId)) throw new Error('Forbidden');

  const schedule = await prisma.discussionSchedule.findUnique({ where: { id: scheduleId } });
  if (!schedule || schedule.serverId !== serverId) throw new Error('Not found');

  await prisma.discussionSchedule.update({
    where: { id: scheduleId },
    data: { isActive },
  });

  await prisma.configAuditLog.create({
    data: {
      serverId,
      userId: (session.user as any)?.id || 'unknown',
      action: isActive ? 'ENABLE_SCHEDULE' : 'DISABLE_SCHEDULE',
      targetType: 'CHANNEL',
      targetId: schedule.channelId,
      featureKey: 'discuss',
      newValue: { isActive },
    },
  });

  revalidatePath('/settings');
  revalidatePath('/audit');
}
```

- [ ] **Step 3: Run dashboard tests**

Run: `cd apps/dashboard && pnpm test`
Expected: All existing tests pass. New feature shows in settings.

- [ ] **Step 4: Commit**

```bash
git add apps/dashboard/src/app/\(dashboard\)/settings/page.tsx apps/dashboard/src/lib/actions.ts
git commit -m "feat: add discuss feature toggle and schedule management to dashboard"
```

---

### Task 7: Full Integration Test Run

**Files:** None (verification only)

- [ ] **Step 1: Run all tests across the monorepo**

Run: `pnpm test`
Expected: All tests pass across bot, dashboard, and packages.

- [ ] **Step 2: Build all packages**

Run: `pnpm build`
Expected: Clean build with no TypeScript errors.

- [ ] **Step 3: Commit any lockfile changes**

```bash
git add pnpm-lock.yaml
git commit -m "chore: update lockfile after node-cron addition"
```
