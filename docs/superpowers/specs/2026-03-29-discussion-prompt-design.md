# Discussion Prompt Feature — Design Spec

## Overview

Add a `/discuss` command and scheduled auto-posting system to the bot for community engagement. The bot generates photography and creative discussion prompts — either from a curated bank or via AI — posts them as rich embeds with auto-created threads and starter reactions.

## Goals

- Spark daily/regular community conversation in photography Discord servers
- Support both on-demand (slash command) and scheduled (auto-post) usage
- Let admins configure schedules from Discord or the dashboard
- Use a hybrid prompt source: curated list for reliability, AI generation as an opt-in upgrade

## Data Model

### `DiscussionSchedule`

Stores per-server auto-post configuration. One server can have multiple schedules (e.g., different channels or times).

| Field          | Type       | Description                                              |
|----------------|------------|----------------------------------------------------------|
| `id`           | String     | cuid, primary key                                        |
| `serverId`     | String     | Discord guild ID                                         |
| `channelId`    | String     | Target channel for auto-posts                            |
| `days`         | Json       | Array of day numbers: 0=Sun, 1=Mon, ... 6=Sat            |
| `timeUtc`      | String     | Time in UTC, e.g. `"14:00"`                              |
| `timezone`     | String     | IANA timezone for display, e.g. `"America/New_York"`     |
| `categoryFilter` | String?  | Optional category restriction, null = any                |
| `useAi`        | Boolean    | Whether to use AI generation (default: false)            |
| `isActive`     | Boolean    | Enables/disables without deleting (default: true)        |
| `createdBy`    | String     | Discord user ID who created the schedule                 |
| `createdAt`    | DateTime   | Auto-set                                                 |
| `updatedAt`    | DateTime   | Auto-updated                                             |

**Unique constraint:** `(serverId, channelId)` — one schedule per channel per server.

### `DiscussionPromptLog`

Tracks posted prompts to avoid repeats and provide history.

| Field       | Type     | Description                                  |
|-------------|----------|----------------------------------------------|
| `id`        | String   | cuid, primary key                            |
| `serverId`  | String   | Discord guild ID                             |
| `channelId` | String   | Channel where it was posted                  |
| `promptText`| String   | The actual prompt text                       |
| `category`  | String   | Category tag (e.g., `"technique"`)           |
| `source`    | String   | `"curated"` or `"ai"`                        |
| `threadId`  | String?  | Discord thread ID, null if thread creation failed |
| `postedAt`  | DateTime | When it was posted                           |

**Index:** `(serverId, postedAt)` for efficient repeat-avoidance queries.

## Curated Prompt Bank

A `constants.ts` file in the bot (`apps/bot/src/constants.ts`) containing prompts organized by category.

### Categories

| Key           | Label            | Description                                        |
|---------------|------------------|----------------------------------------------------|
| `technique`   | Technique        | Composition, exposure, lighting, post-processing   |
| `gear`        | Gear             | Lenses, cameras, accessories, workflow tools       |
| `creative`    | Creative Process | Inspiration, artistic voice, creative blocks       |
| `challenge`   | Challenge        | Photo assignments and creative constraints         |
| `inspiration` | Inspiration      | Other art forms, artists, cross-discipline ideas   |

### Structure

```typescript
interface DiscussionPrompt {
  category: string;
  text: string;
  reactions: string[]; // emoji for starter reactions
}
```

10-15 prompts per category (~60 total). Each prompt includes 3 default reaction emoji relevant to the topic (e.g., a challenge prompt might get camera, star, and fire emoji).

### Selection Logic

1. Query `DiscussionPromptLog` for prompts posted to this server in the last 30 days
2. Filter curated bank to exclude recently used prompts (by exact text match)
3. If a category filter is set, narrow to that category
4. Pick randomly from remaining prompts
5. If all prompts in the filtered set have been used recently, reset and allow repeats

## Slash Command: `/discuss`

### Subcommands

#### `/discuss prompt [category]`

Generates and posts a discussion prompt on the spot.

- `category` — optional string choice (technique, gear, creative, challenge, inspiration)
- Checks `canUseFeature(serverId, channelId, roleIds, 'discuss')` before executing
- Uses AI or curated source based on server's schedule config `useAi` flag (defaults to curated if no schedule exists)
- Posts embed, creates thread, adds reactions
- Logs to `DiscussionPromptLog`

#### `/discuss schedule <channel> <days> <time> [timezone] [category] [use_ai]`

Creates or updates a schedule. Admin-only (`PermissionFlagsBits.Administrator`).

- `channel` — channel mention (required)
- `days` — string like `"mon,wed,fri"` or `"daily"` or `"weekdays"` (required)
- `time` — time string like `"9:00"` (required)
- `timezone` — IANA timezone string (optional, defaults to `"UTC"`)
- `category` — category filter (optional)
- `use_ai` — boolean (optional, defaults to false)

Parses days into the numeric array. Validates the channel exists and bot has send permissions. Upserts `DiscussionSchedule` (unique on serverId + channelId). Creates `ConfigAuditLog` entry. Confirms with ephemeral reply showing the schedule summary.

#### `/discuss list`

Shows active schedules for the server. Admin-only.

- Queries `DiscussionSchedule` for the server
- Displays each schedule as an embed field: channel, days, time, category, AI status, active/paused

## Scheduler System

### Technology

`node-cron` package — lightweight, no external dependencies.

### Startup Flow

1. Bot starts and connects to Discord
2. Load all `DiscussionSchedule` rows where `isActive = true`
3. For each schedule, compute the cron expression from `days` + `timeUtc` and register a cron job
4. Run missed-prompt recovery check (see below)

### Cron Expression Generation

Convert `days: [1, 3, 5]` + `timeUtc: "14:00"` into cron: `0 14 * * 1,3,5`

### Execution Flow (per job tick)

1. Verify `discuss` feature is still enabled via `canUseFeature()`
2. Select a prompt (curated or AI based on `useAi` flag)
3. Build embed with category tag, prompt text, and footer
4. Post to the configured channel
5. Create a thread on the message with a title derived from the prompt
6. Add 3 starter reactions to the original message
7. Log to `DiscussionPromptLog`
8. On any failure, log the error but don't crash the job

### Schedule Sync

Every 5 minutes, the bot re-reads `DiscussionSchedule` from the database and reconciles:
- New schedules: register cron job
- Removed/deactivated schedules: stop and remove cron job
- Changed schedules (time/days): stop old job, register new one

This allows the dashboard to modify schedules without needing to push changes to the bot.

### Missed-Prompt Recovery

On startup, for each active schedule:
1. Find the most recent `DiscussionPromptLog` entry for that server+channel
2. Calculate when the last prompt *should* have been posted based on the schedule
3. If the expected post time is more recent than the actual last post (and within the last 24 hours), fire the prompt immediately
4. Skip recovery for gaps longer than 24 hours to avoid spamming after extended downtime

## AI Prompt Generation

Uses the existing `aiProvider.analyzeText()` method from `packages/ai`.

### Prompt Template

```
Generate a single engaging discussion question for a photography Discord community.

Category: {category or "any photography or creative topic"}

Requirements:
- Be specific and thought-provoking, not generic
- Encourage members to share experiences, opinions, or photos
- Keep it to 1-2 sentences
- Do not include any preamble, numbering, or formatting — just the question

Examples of good prompts:
- "What's a photography 'rule' you intentionally break, and what made you start?"
- "Show us a photo where the light did something unexpected — what happened?"
```

### Fallback

If AI generation fails (timeout, error, empty response), fall back to the curated bank. Log the AI failure for observability but don't surface it to the user.

## Embed Format

```
+------------------------------------------+
| Discussion of the Day          [Category] |
|                                           |
| {prompt text}                             |
|                                           |
| Jump into the thread below to share       |
| your thoughts!                            |
|                                           |
| Photobot              Today at 9:00 AM    |
+------------------------------------------+
Reactions: [emoji1] [emoji2] [emoji3]
  -> Thread: "Discuss: {truncated prompt}"
```

- Embed color: existing `BRAND_COLOR` constant
- Title: "Discussion of the Day" (or "Discussion Prompt" for on-demand)
- Footer: "Photobot"
- Thread name: first ~90 characters of prompt, prefixed with "Discuss: "

## Dashboard Integration

### Feature Toggle

Add `discuss` to the existing `featureMeta` in `apps/dashboard/src/app/(dashboard)/settings/page.tsx`:

```typescript
discuss: {
  icon: MessageSquare,
  description: 'AI-powered discussion prompts for community engagement',
}
```

### Schedule Management

Add a "Discussion Schedules" card to the settings page, visible when the `discuss` feature is enabled for a server. Displays:

- List of active schedules (channel, days, time in local timezone, category, AI toggle)
- Create button to add a new schedule
- Edit/delete actions on each schedule
- Uses server actions for CRUD, same pattern as `updateFeatureAction`

Audit log entries created for all schedule changes.

## Permissions

- `/discuss prompt` — any user, gated by `canUseFeature()` with key `discuss`
- `/discuss schedule` and `/discuss list` — admin-only via `setDefaultMemberPermissions(PermissionFlagsBits.Administrator)` on the subcommands
- Dashboard schedule management — gated by existing Discord OAuth admin check

## Testing

### Bot Tests (`apps/bot/src/__tests__/discuss.test.ts`)

- Command registration (correct name, subcommands)
- `/discuss prompt` — posts embed, creates thread, adds reactions, logs to DB
- `/discuss prompt` with category filter — selects from correct category
- `/discuss schedule` — validates input, upserts schedule, creates audit log
- `/discuss list` — displays schedules correctly
- Prompt selection avoids recent repeats
- AI fallback to curated on failure

### Prompt Selection Tests

- Filters out recently used prompts
- Respects category filter
- Resets when all prompts exhausted
- AI mode calls `analyzeText` with correct prompt template

## Dependencies

- `node-cron` — new dependency in `apps/bot/package.json`
- No new dependencies for dashboard or shared packages

## Feature Flag

The entire feature is gated behind the `discuss` feature key in the existing `FeatureConfig` system. Admins must enable it per-server before any prompts are posted or commands work.
