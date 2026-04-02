---
title: Prompt Voting Site
date: 2026-04-02
status: approved
---

# Prompt Voting Site — Design Spec

A standalone community tool for Photography Lounge members to vote on discussion prompts. Lives in the Photobot monorepo as `apps/voting`, shares the existing Supabase database, and deploys as a separate Vercel project.

## Goals

- Let community members upvote/downvote the 410 curated discussion prompts
- Surface which prompts resonate and which should be retired
- Keep votes anonymous between members; admins can see voter identities for moderation
- Clean, professional, mobile-friendly UI with dark/light theme toggle

## Architecture

### Monorepo Placement

```
apps/voting/          New Next.js 14 app (App Router)
packages/db/          Shared — adds Prompt, PromptTag, PromptVote models
scripts/seed-prompts.ts   One-time seed script
```

### Stack

- **Framework**: Next.js 14 (App Router), same as dashboard
- **Auth**: NextAuth 4 + Discord OAuth (reuses existing Discord app credentials)
- **Database**: Shared Supabase Postgres via `@photobot/db`
- **Styling**: Tailwind CSS
- **Deploy**: Separate Vercel project, own subdomain (e.g., `vote.photobot.app`)

### Auth

Reuses the same `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET`. A second OAuth callback URL is added in the Discord Developer Portal for the voting site.

The NextAuth config requests only the `identify` scope (no `guilds` needed). The session stores the Discord user ID and username.

Admin detection: the session callback fetches the user's roles from the Photography Lounge server via the bot token (`DISCORD_TOKEN`) and checks for admin/moderator roles. A `VOTING_ADMIN_ROLE_IDS` env var lists the Discord role IDs that grant admin access.

## Data Model

### New Prisma Models

```prisma
model Prompt {
  id               String       @id @default(cuid())
  text             String
  originalCategory String       @map("original_category") // "creative" or "inspiration"
  createdAt        DateTime     @default(now()) @map("created_at")
  tags             PromptTag[]
  votes            PromptVote[]

  @@map("prompts")
}

model PromptTag {
  id       String @id @default(cuid())
  promptId String @map("prompt_id")
  tag      String // e.g., "motivation", "workflow", "style"
  prompt   Prompt @relation(fields: [promptId], references: [id], onDelete: Cascade)

  @@unique([promptId, tag])
  @@index([tag])
  @@map("prompt_tags")
}

enum VoteDirection {
  UP
  DOWN
}

model PromptVote {
  id              String        @id @default(cuid())
  promptId        String        @map("prompt_id")
  discordUserId   String        @map("discord_user_id")
  discordUsername String        @map("discord_username")
  vote            VoteDirection
  createdAt       DateTime      @default(now()) @map("created_at")
  updatedAt       DateTime      @updatedAt @map("updated_at")
  prompt          Prompt        @relation(fields: [promptId], references: [id], onDelete: Cascade)

  @@unique([promptId, discordUserId])
  @@index([discordUserId])
  @@map("prompt_votes")
}
```

### Tag Set (17 tags)

| Tag | Description |
|-----|-------------|
| `motivation` | Pushing through blocks, staying driven |
| `workflow` | Process, habits, routines |
| `style` | Finding/evolving personal voice |
| `editing` | Post-processing decisions |
| `portfolio` | Curating, sharing, presenting work |
| `storytelling` | Narrative, meaning, emotion in images |
| `collaboration` | Working with others |
| `social-media` | Engagement, audience, platforms |
| `gear` | Equipment choices and philosophy |
| `ethics` | Consent, representation, responsibility |
| `business` | Career, clients, commercial work |
| `influences` | Other artists, art forms, books, films |
| `learning` | Growth, skills, lessons |
| `projects` | Long-term series, personal projects |
| `self-reflection` | Identity, emotion, personal meaning |
| `community` | Connection, teaching, sharing knowledge |
| `technique` | Composition, light, color decisions |

Each prompt gets 1-3 tags. Assignments are hardcoded in the seed script.

## Pages & Routes

### `/` — Prompt List (all authenticated users)

Main page showing all prompts in a paginated, sortable, filterable table.

**Table columns:**
- Prompt text
- Tags (colored pills)
- Vote buttons (👍 / 👎) with counts
- Approval % with progress bar

**Table features:**
- **Pagination**: 20 prompts per page, server-side via query params (`?page=1`)
- **Sorting**: Approval % (default desc), total votes, alphabetical. Via query param (`?sort=approval`)
- **Filtering**: Multi-select tag filter chips at top. Text search input. Via query params (`?tags=motivation,workflow&q=creative`)
- **Voting**: Click 👍 or 👎. One vote per prompt per user. Click same button to remove vote. Click opposite to switch. Calls `POST /api/vote` with optimistic UI update.

**States:**
- Unauthenticated: see prompts and vote counts, vote buttons show "Sign in to vote" tooltip
- Authenticated: vote buttons active, user's existing votes highlighted
- Admin: extra "Admin" tab appears in header

**Banner:**
> "Your votes are anonymous to other members. Admins can see votes to monitor misuse."

Shown once, dismissable, saved in localStorage.

### `/` with Admin tab (admins only)

When an admin user is detected, an "Admin" tab appears in the header alongside the default "Prompts" tab.

**Admin tab shows:**
- Same prompt list but with an expandable voter breakdown per prompt
- Click a prompt row to expand and see: list of voters (Discord username), their vote direction, timestamp
- Summary stats at top: total votes cast, unique voters, prompts with zero votes, lowest-rated prompts

### `/api/auth/[...nextauth]` — Auth endpoints

Standard NextAuth Discord OAuth flow. Session includes `discordUserId`, `discordUsername`, and `isAdmin` boolean.

### `/api/vote` — Vote endpoint

```
POST /api/vote
Body: { promptId: string, direction: "UP" | "DOWN" }
Response: { upvotes: number, downvotes: number, userVote: "UP" | "DOWN" | null }
```

Logic:
- If no existing vote: create with given direction
- If existing vote with same direction: delete (toggle off)
- If existing vote with different direction: update to new direction
- Returns updated counts

Requires authentication. Rate limited to 60 votes per minute per user (in-memory counter).

## Seed Script

`scripts/seed-prompts.ts` — run once via `pnpm seed:prompts`

1. Reads `apps/bot/src/data/discussion-prompts.md`
2. Parses using the same logic as `parse-prompts.ts`
3. For each prompt, looks up tag assignments from a hardcoded map in the script
4. Inserts `Prompt` rows with associated `PromptTag` rows
5. Skips duplicates (idempotent via prompt text matching)

Tag assignment strategy: the seed script contains a `PROMPT_TAGS` map keyed by prompt text substring, mapping to 1-3 tags. For prompts not explicitly mapped, tags are inferred from keyword matching (e.g., "burnout" → `motivation`, "portfolio" → `portfolio`, "edit" → `editing`).

## UI Design

### Theme

- Dark/light toggle in header, defaults to dark
- Dark theme matches Photobot brand (slate backgrounds, teal accents)
- Light theme: clean white cards, subtle borders, same accent colors
- User preference saved in localStorage

### Desktop Layout

- Fixed header: logo, "Prompts" tab, "Admin" tab (if admin), theme toggle, user avatar
- Below header: filter bar (tag chips + search + sort dropdown)
- Main area: prompt cards in a single-column list
- Each card: tags, prompt text, vote buttons with counts and approval bar

### Mobile Layout (< 640px)

- Hamburger menu for filters (slide-out drawer)
- Cards stack vertically, full width
- Vote buttons are large touch targets (44px minimum)
- Sticky filter summary bar at top showing active filters

### Components

| Component | Description |
|-----------|-------------|
| `PromptCard` | Displays prompt text, tags, vote buttons, approval bar |
| `VoteButton` | Upvote/downvote with optimistic state, disabled when unauthenticated |
| `TagFilter` | Multi-select chip bar for filtering by tag |
| `SearchInput` | Debounced text search |
| `SortSelect` | Dropdown for sort order |
| `Pagination` | Page navigation with page numbers |
| `AdminVoterList` | Expandable voter breakdown (admin only) |
| `ThemeToggle` | Dark/light switch |
| `AnonymityBanner` | Dismissable info banner about vote visibility |

## Environment Variables

New variables for the voting app (in addition to shared ones):

```
# Voting app specific
VOTING_ADMIN_ROLE_IDS=role-id-1,role-id-2   # Discord role IDs that grant admin access
NEXTAUTH_URL=https://vote.photobot.app       # Voting site URL
```

Shared from root `.env`:
```
DISCORD_TOKEN          # Bot token for fetching user roles
DISCORD_CLIENT_ID      # Same OAuth app
DISCORD_CLIENT_SECRET  # Same OAuth app
DATABASE_URL           # Same Supabase
NEXTAUTH_SECRET        # Separate secret from dashboard to avoid session cross-contamination
```

## Error Handling

- Discord OAuth failure: redirect to `/` with error message
- Expired token: redirect to re-authenticate (same pattern as dashboard)
- Vote API errors: toast notification, revert optimistic update
- Database errors: generic error page with retry

## Testing

- Unit tests for vote logic (create, toggle, switch direction)
- Unit tests for tag filtering and pagination query building
- Unit tests for admin role detection
- Component tests for PromptCard, VoteButton states
- Seed script tested with a small fixture set
