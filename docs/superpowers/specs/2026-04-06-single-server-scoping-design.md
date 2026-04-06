# Single-Server Scoping: Photography Lounge

Photobot is being scoped from multi-server to single-server — exclusively serving
Photography Lounge (PL, server ID `728905379274162177`). All multi-server
abstractions are removed so the codebase reflects reality: one bot, one server.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Non-PL servers | Auto-leave on `guildCreate` | Clean guarantee the bot never operates elsewhere |
| Dashboard auth | Keep Discord OAuth, verify PL admin | Dynamic admin verification; no hardcoded user lists |
| Database `serverId` | Drop columns via migration | Clean schema; column had one value anyway |
| Dashboard home page | Redirect `/` to `/settings` | Server selector was the only purpose of the home page |
| Command registration | Keep global | Works fine; auto-leave makes guild-specific moot |

## 1. Database Schema Migration

Remove `serverId` from four models. Composite unique constraints simplify.

### FeatureConfig

```prisma
model FeatureConfig {
  id         String     @id @default(uuid())
  targetType TargetType @map("target_type")
  targetId   String     @map("target_id")
  featureKey String     @map("feature_key")
  isEnabled  Boolean    @default(true) @map("is_enabled")
  createdAt  DateTime   @default(now()) @map("created_at")
  updatedAt  DateTime   @updatedAt @map("updated_at")

  @@unique([targetType, targetId, featureKey])
  @@map("feature_configs")
}
```

### ConfigAuditLog

```prisma
model ConfigAuditLog {
  id         String     @id @default(uuid())
  userId     String     @map("user_id")
  action     String
  targetType TargetType @map("target_type")
  targetId   String     @map("target_id")
  featureKey String     @map("feature_key")
  oldValue   Json?      @map("old_value")
  newValue   Json?      @map("new_value")
  createdAt  DateTime   @default(now()) @map("created_at")

  @@map("config_audit_logs")
}
```

### DiscussionSchedule

```prisma
model DiscussionSchedule {
  id             String   @id @default(cuid())
  channelId      String   @unique @map("channel_id")
  categoryFilter String?  @map("category_filter")
  isActive       Boolean  @default(true) @map("is_active")
  createdBy      String   @map("created_by")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  @@map("discussion_schedules")
}
```

### DiscussionPromptLog

```prisma
model DiscussionPromptLog {
  id         String   @id @default(cuid())
  channelId  String   @map("channel_id")
  promptText String   @map("prompt_text")
  category   String
  postedAt   DateTime @default(now()) @map("posted_at")

  @@index([postedAt])
  @@map("discussion_prompt_logs")
}
```

### TargetType Enum

The `SERVER` variant in `TargetType` is no longer meaningful since there's only one
server. However, the hierarchical permission model (Channel > Role > Server) still
uses it for the "global default" tier. Keep the enum unchanged — `SERVER` now means
"PL-wide default" rather than "this specific server."

The `targetId` for `SERVER`-type configs will use the PL guild ID constant, same as
before — but it's no longer duplicated in a separate `serverId` column.

## 2. Environment Variables

### New

- `PL_GUILD_ID` — Photography Lounge server ID. Used by bot (auto-leave guard,
  commands) and dashboard (authorization). Replaces the implicit multi-server
  assumption. Set to `728905379274162177`.

### Removed

- `VOTING_GUILD_ID` — replaced by `PL_GUILD_ID` (voting app uses the same value).

### Updated `.env.example`

Add `PL_GUILD_ID=your-photography-lounge-server-id` and remove `VOTING_GUILD_ID`.
Update the voting app's auth to read `PL_GUILD_ID` instead.

## 3. Bot Changes

### Auto-Leave Guard (`index.ts`)

Add a `guildCreate` event handler:

```typescript
client.on(Events.GuildCreate, async guild => {
  const plGuildId = process.env.PL_GUILD_ID;
  if (guild.id !== plGuildId) {
    console.log(`Leaving non-PL server: ${guild.name} (${guild.id})`);
    await guild.leave();
  }
});
```

### Interaction Guard (`index.ts`)

In the `InteractionCreate` handler, add an early return if `interaction.guildId`
doesn't match `PL_GUILD_ID`. This catches the edge case where a command executes
before the auto-leave fires.

### Permissions Middleware (`middleware/permissions.ts`)

Drop `serverId` parameter:

```typescript
export async function canUseFeature(
  channelId: string,
  roleIds: string[],
  featureKey: string
): Promise<boolean>
```

The Prisma query drops the `serverId` where clause. The `SERVER` target type
check changes from `targetId: serverId` to `targetId: process.env.PL_GUILD_ID`.

### Prompt Selection (`services/prompts.ts`)

Drop `serverId` parameter:

```typescript
export async function selectPrompt(
  category: string | null
): Promise<PromptResult>
```

The 30-day non-repeat query drops the `serverId` filter — there's only one
server's history.

### Scheduler (`services/scheduler.ts`)

- `runScheduledPosts()`: Queries all active schedules (no `serverId` filter —
  unchanged since `serverId` is gone from the model).
- `executeScheduledPrompt()`: The `canUseFeature` call drops `s.serverId`.
  The `selectPrompt` call drops `s.serverId`. The `discussionPromptLog.create`
  drops `serverId` from data. The `discussionPromptLog.findFirst` where clause
  drops `serverId`.

### Commands

**`discuss.ts`**: Remove `guildId` extraction from interaction. Calls to
`canUseFeature`, `selectPrompt`, and Prisma queries all drop `serverId`/`guildId`.
The `discussionSchedule.upsert` where clause changes from
`serverId_channelId: { serverId, channelId }` to just `{ channelId }` (now unique
on `channelId` alone). Audit log `create` drops `serverId`.

**`settings.ts`**: Remove `guildId` extraction. `featureConfig.findMany` where
clause changes from `{ serverId: guildId, targetType: 'SERVER', targetId: guildId }`
to `{ targetType: 'SERVER', targetId: process.env.PL_GUILD_ID }`.

## 4. Dashboard Changes

### Authorization (`lib/discord.ts`)

Replace `getAdminGuilds` + `getBotAdminGuilds` with a single `isPlAdmin` function:

```typescript
export async function isPlAdmin(accessToken: string): Promise<boolean> {
  const guilds = await getAdminGuilds(accessToken);
  return guilds.some(g => g.id === process.env.PL_GUILD_ID);
}
```

Keep `getAdminGuilds` as a private helper (still needed to fetch the guild list
from Discord). Remove `getBotAdminGuilds` and the `getBotGuildIds` cache entirely.

### Server Actions (`lib/actions.ts`)

All actions drop the `serverId` parameter:

- `updateFeatureAction(featureKey, isEnabled)` — authorization uses `isPlAdmin`
  instead of checking guild list. Prisma queries drop `serverId` from where/create.
  The `FeatureConfig` upsert where changes from the 4-field composite to
  `targetType_targetId_featureKey`.
- `getDiscussionSchedules()` — no `serverId` param or filter.
- `deleteDiscussionSchedule(scheduleId)` — no `serverId` param. Remove the
  `schedule.serverId !== serverId` ownership check (all schedules belong to PL).
- `toggleDiscussionSchedule(scheduleId, isActive)` — same simplification.

### Layout (`app/(dashboard)/layout.tsx`)

- Remove `getAdminGuilds` call and `adminGuilds` state.
- Remove `ServerPopover` from header.
- Remove `guilds` prop from `MobileNav`.
- Authorization: use `isPlAdmin` — if not PL admin, redirect to sign-in.

### Home Page (`app/page.tsx`)

Replace with a redirect to `/settings`:

```typescript
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/settings');
}
```

Or keep a minimal login page for unauthenticated users — if no session, show
the login button; if authenticated, redirect to `/settings`.

### Settings Page (`app/(dashboard)/settings/page.tsx`)

- Remove `serverId` from `searchParams`.
- Remove the admin guild authorization check (handled by layout).
- Remove the "select a server" empty state.
- Query `featureConfig.findMany({ where: { targetType: 'SERVER' } })` — no
  `serverId` filter.
- `FeatureToggle` component drops `serverId` prop.

### Audit Page (`app/(dashboard)/audit/page.tsx`)

- Remove `serverId` from `searchParams`.
- Remove admin guild authorization check (handled by layout).
- Remove "select a server" empty state.
- Query `configAuditLog.findMany()` with no `serverId` filter.
- Pagination links drop `serverId` query param.

### Feature Toggle Component (`components/feature-toggle.tsx`)

Drop `serverId` prop. Call `updateFeatureAction(featureKey, nextState)`.

### Delete Components

- `ServerSelector.tsx` — no longer needed.
- `ServerPopover.tsx` — no longer needed.

### Mobile Nav (`components/MobileNav.tsx`)

- Remove `guilds` prop and the "Servers" tab button.
- Remove `ServerPopover` sheet integration.

## 5. Voting App Changes

Minimal — already single-server. Replace `VOTING_GUILD_ID` with `PL_GUILD_ID`
in `apps/voting/src/lib/auth.ts`.

## 6. Test Updates

### Bot Tests

**`permissions.test.ts`**: Update `canUseFeature` calls to drop `serverId` param.
Update the query assertion to not include `serverId` in the where clause. The
`SERVER` targetId assertion changes to use `PL_GUILD_ID`.

**`scheduler.test.ts`**: Remove `serverId` from `SCHEDULE_FIXTURE`. Update
`canUseFeature` and `selectPrompt` call assertions. Update `discussionPromptLog`
assertions to not include `serverId`.

**`discuss.test.ts`**: Remove `serverId`/`guildId` from assertions on
`selectPrompt`, `canUseFeature`, `discussionSchedule.upsert`,
`discussionPromptLog.create`, and `configAuditLog.create`.

**`settings.test.ts`**: Update `featureConfig.findMany` assertion.

**`prompts.test.ts`**: Update `selectPrompt` calls to drop `serverId` param.

### Dashboard Tests

**`actions.test.ts`**: Update `updateFeatureAction` calls to drop `serverId`.
Update Prisma mock assertions. Replace `getAdminGuilds` mock with `isPlAdmin`.

**`discord.test.ts`**: Add tests for `isPlAdmin`. Existing `getAdminGuilds` tests
remain (function still exists as private helper, but tests can still import it or
test `isPlAdmin` instead).

### Integration Tests

**`permissions.integration.test.ts`**: Update `canUseFeature` calls to drop
`serverId`. Update `featureConfig.create` data to drop `serverId`. Cleanup
query changes (can't filter by `serverId` anymore — use a test-specific
`featureKey` prefix instead).

**`featureConfig.integration.test.ts`**: Update all `featureConfig` operations
to drop `serverId`. Update composite key references. Update audit log test.

## 7. CLAUDE.md Update

Update the project description to reflect single-server scope. Remove references
to multi-server patterns. Update the architecture description to note PL-only
deployment.
