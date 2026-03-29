# Photobot Test Suite Design — Layered Coverage

**Goal:** Achieve broad test coverage across the entire monorepo using a layered approach: unit tests for every untested module plus integration tests against a real database.

**Current state:** 43 tests across 11 files. Significant gaps in server actions, client components, dashboard layout, error paths, and integration testing.

**Target state:** ~88 tests across ~17 files. Every module has at least basic coverage, critical paths have edge case coverage, and key data flows are verified end-to-end against real Postgres.

---

## Layer 1: Unit Tests — New Test Files

### 1.1 `apps/dashboard/src/__tests__/actions.test.ts`

Tests for `updateFeatureAction` server action in `lib/actions.ts`.

**Mocks:** `@photobot/db` (prisma), `next-auth/next` (getServerSession), `@/lib/auth`, `@/lib/discord` (getAdminGuilds), `next/cache` (revalidatePath)

| Test | Setup | Assertion |
|------|-------|-----------|
| throws Unauthorized when no session | `getServerSession` returns null | throws 'Unauthorized' |
| throws Unauthorized when no accessToken | session without accessToken | throws 'Unauthorized' |
| throws Forbidden when user is not admin | `getAdminGuilds` returns guilds not matching serverId | throws 'Forbidden' |
| creates new config via upsert | `findFirst` returns null, `upsert` returns new config | `upsert` called with create fields, audit log records `oldValue: { isEnabled: true }` (default) |
| updates existing config via upsert | `findFirst` returns existing config with isEnabled: true | `upsert` called with update fields, audit log records correct old/new |
| revalidates settings and audit paths | successful toggle | `revalidatePath` called with '/settings' and '/audit' |

---

### 1.2 `apps/dashboard/src/__tests__/feature-toggle.test.tsx`

Tests for `FeatureToggle` client component in `components/feature-toggle.tsx`.

**Mocks:** `@/lib/actions` (updateFeatureAction)

| Test | Setup | Assertion |
|------|-------|-----------|
| renders enabled state | `initialEnabled: true` | button has `aria-pressed="true"`, green bg class |
| renders disabled state | `initialEnabled: false` | button has `aria-pressed="false"`, gray bg class |
| toggles state on click | click button | `updateFeatureAction` called with `(serverId, featureKey, true)` |
| rolls back on action error | `updateFeatureAction` rejects | state reverts to initial after error |
| disables button while pending | click button, action is pending | button has `disabled` attribute, opacity class |

---

### 1.3 `apps/dashboard/src/__tests__/server-selector-client.test.tsx`

Tests for the client `ServerSelector` in `components/server-selector.tsx`.

**Mocks:** `next/navigation` (useRouter, useSearchParams, usePathname)

| Test | Setup | Assertion |
|------|-------|-----------|
| renders guild options in dropdown | guilds array with 2 items | 2 option elements + placeholder |
| selecting guild pushes URL with serverId | change select to guild id '123' | `router.push` called with `?serverId=123` |
| clearing selection removes serverId | change select to empty | `router.push` called without serverId param |
| pre-selects current serverId from URL | searchParams has serverId '123' | select value is '123' |

---

### 1.4 `apps/dashboard/src/__tests__/layout.test.tsx`

Tests for `DashboardLayout` in `app/(dashboard)/layout.tsx`.

**Mocks:** `next-auth/next`, `@/lib/auth`, `@/lib/discord`, `next/navigation` (redirect), `@/components/server-selector`

| Test | Setup | Assertion |
|------|-------|-----------|
| redirects when no session | `getServerSession` returns null | `redirect('/')` called |
| redirects when no accessToken | session without accessToken | `redirect('/')` called |
| renders nav and children with valid session | session with accessToken, adminGuilds returns data | heading "Photobot" renders, nav links render, children render |

---

## Layer 1: Unit Tests — Additions to Existing Files

### 1.5 `apps/bot/src/__tests__/critique.test.ts` (+3 tests)

| Test | Setup | Assertion |
|------|-------|-----------|
| returns rate limit message when rate limited | `checkRateLimit` returns `{ allowed: false }` | `editReply` called with rate limit message |
| handles image download failure | `fetch` returns `{ ok: false }` | `editReply` called with error message |
| handles AI provider error | `analyzeImage` rejects with Error | `editReply` called with error message |

---

### 1.6 `apps/bot/src/__tests__/palette.test.ts` (+3 tests)

| Test | Setup | Assertion |
|------|-------|-----------|
| returns rate limit message when rate limited | `checkRateLimit` returns `{ allowed: false }` | `editReply` called with rate limit message |
| handles <5 hex codes in AI response | `analyzeImage` returns only 3 hex codes | `editReply` called with "Could not extract" message |
| handles AI provider error | `analyzeImage` rejects with Error | `editReply` called with error message |

---

### 1.7 `apps/bot/src/__tests__/settings.test.ts` (+2 tests)

| Test | Setup | Assertion |
|------|-------|-----------|
| handles missing guildId | interaction.guildId is null | `reply` called with error message |
| renders empty feature list | `findMany` returns `[]` | reply contains embed (no crash) |

---

### 1.8 `apps/bot/src/__tests__/bouncer.test.ts` (+3 tests)

| Test | Setup | Assertion |
|------|-------|-----------|
| denies VIOLENCE classification | `analyzeImage` returns "VIOLENCE" | `{ allowed: false, reason: 'Image contains violent content.' }` |
| defaults to allowed for unrecognized response | `analyzeImage` returns "UNKNOWN_THING" | `{ allowed: true }` |
| isolates rate limits between users | user-1 makes 6 requests, user-2 makes 1 | user-2 has delay 0, user-1 has delay > 0 |

---

### 1.9 `apps/dashboard/src/__tests__/discord.test.ts` (+2 tests)

| Test | Setup | Assertion |
|------|-------|-----------|
| returns empty array on network error | `fetch` rejects with TypeError | returns `[]` |
| sends correct authorization header | `fetch` succeeds | fetch called with `{ headers: { Authorization: 'Bearer fake-token' } }` |

---

### 1.10 `packages/ai/src/__tests__/ai.test.ts` (+4 tests)

| Test | Setup | Assertion |
|------|-------|-----------|
| GeminiProvider maps file extensions correctly | call `getMimeType` with .png, .jpg, .webp | returns correct MIME types |
| OllamaProvider reuses client on second call | call `getClient()` twice | same instance returned |
| GeminiProvider throws on missing image file | `readFile` rejects | throws AIProviderError |
| OllamaProvider throws on connection refused | `generate` rejects with ECONNREFUSED | throws AIProviderError |

---

### 1.11 `packages/db/src/__tests__/db.test.ts` (+2 tests)

| Test | Setup | Assertion |
|------|-------|-----------|
| returns same instance (singleton) | import prisma twice | strict equality check |
| re-exports Prisma types | import TargetType from package | TargetType.SERVER exists |

---

## Layer 2: Integration Tests

These tests require a running Postgres instance (the Docker `photobot-db` container). They are placed in `__tests__/integration/` directories and tagged so they can be excluded from quick test runs.

### 2.1 `packages/db/src/__tests__/integration/featureConfig.integration.test.ts`

**Requires:** `DATABASE_URL` pointing to real Postgres

| Test | Flow | Assertion |
|------|------|-----------|
| creates and reads a FeatureConfig | insert via `prisma.featureConfig.create()`, read back via `findFirst` | fields match, timestamps populated |
| enforces unique constraint | insert duplicate (same serverId+targetType+targetId+featureKey) | throws PrismaClientKnownRequestError with code P2002 |
| upsert creates or updates | upsert non-existing then upsert existing with changed isEnabled | first returns created, second returns updated |
| creates audit log entry | insert via `prisma.configAuditLog.create()` | entry readable with correct JSON values |
| cleans up test data | delete all test records | count returns 0 |

---

### 2.2 `apps/bot/src/__tests__/integration/permissions.integration.test.ts`

**Requires:** `DATABASE_URL` pointing to real Postgres

| Test | Flow | Assertion |
|------|------|-----------|
| channel config overrides role and server | create server=enabled, role=enabled, channel=disabled configs, call `canUseFeature` | returns false (channel wins) |
| role allow-wins when no channel config | create server=disabled, role-1=disabled, role-2=enabled, call `canUseFeature` | returns true (any role enabled wins) |
| defaults to true with no config | call `canUseFeature` with serverId that has no configs | returns true |

---

## Test Infrastructure

### Integration test setup

A shared utility at `packages/db/src/__tests__/integration/setup.ts`:
- Connects to test database before all tests
- Cleans up test data after each test (uses unique test prefixes for serverId to avoid collisions)
- Disconnects after all tests

### Running tests

```bash
pnpm test              # All unit tests (fast, no Docker needed)
pnpm test:integration  # Integration tests only (requires Docker)
pnpm test:all          # Both unit and integration tests
```

The root `package.json` gets two new scripts:
```json
"test:integration": "vitest run --project @photobot/db --project @photobot/bot -- --testPathPattern=integration",
"test:all": "vitest run"
```

Integration tests use a filename convention (`*.integration.test.ts`) and are excluded from the default `vitest run` via workspace config updates.

---

## Summary

| Category | Existing | New | Total |
|----------|----------|-----|-------|
| Bot unit tests | 24 | 11 | 35 |
| Dashboard unit tests | 12 | 18 | 30 |
| AI package unit tests | 6 | 4 | 10 |
| DB package unit tests | 1 | 2 | 3 |
| Integration tests | 0 | 8 | 8 |
| **Total** | **43** | **43** | **86** |

---

## Success Criteria

- All 86 tests pass
- Every exported function/component has at least one test
- Error paths (unauthorized, forbidden, network failure, invalid data) are covered
- Integration tests verify real database behavior for permission hierarchy and feature config CRUD
- `pnpm test` runs fast (unit only), `pnpm test:all` includes integration
