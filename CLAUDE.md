# Photobot

**DO NOT PUSH ANYTHING TO GITHUB WITHOUT EXPLICIT USER INSTRUCTIONS. THE APP IS SERVED IN PRODUCTION.**

Photography community Discord bot with curated discussion prompts and an admin dashboard.

## Architecture

Pnpm monorepo with four apps and two shared packages:

```
apps/bot          Discord.js bot (commands, bouncer security, permissions middleware)
apps/dashboard    Next.js 16 admin dashboard (NextAuth + Discord OAuth, feature toggles, audit logs)
apps/voting       Next.js 16 community prompt voting site (Discord OAuth, upvote/downvote, admin view)
packages/db       Prisma client + schema
```

Prisma models: `FeatureConfig`, `ConfigAuditLog`, `DiscussionSchedule`, `DiscussionPromptLog`, `Prompt`, `PromptTag`, `PromptVote`, `PromptDuplicateFlag` (plus NextAuth models: `Account`, `Session`, `User`, `VerificationToken`).

## Key Commands

```bash
pnpm init:local       # Interactive first-time setup (prompts for creds, generates .env)
pnpm dev:local        # One-command local dev: Docker + migrations + builds + apps
pnpm dev              # Start apps only (assumes Docker and packages already built)
pnpm build            # Build all packages and apps
pnpm test             # Run all tests (vitest) across workspaces
pnpm test:integration # Integration tests (requires DATABASE_URL)
pnpm status           # Health check: shows state of all services and config
pnpm db <cmd>         # Database ops: push, reset, studio, seed, migrate
pnpm dev:down         # Stop Docker services
pnpm cleanup          # Stop containers + remove build artifacts
pnpm cleanup --full   # Nuclear option: also removes node_modules + Docker volumes
pnpm seed:prompts     # Seed discussion prompts into DB (requires DATABASE_URL)
```

## Tech Stack

- **Bot:** discord.js 14, dotenv
- **Dashboard:** Next.js 16 (App Router), NextAuth 4 (Discord OAuth with `guilds` scope), Tailwind CSS
- **Voting:** Next.js 16 (App Router), NextAuth 4 (Discord OAuth with `identify email` scope), Tailwind CSS
- **Database:** Prisma 7 on Supabase Postgres (pooled connections via PgBouncer port 6543)
- **Testing:** Vitest across all workspaces (`vitest.workspace.ts` at root, `vitest.integration.workspace.ts` for integration tests)

## Important Patterns

- **NextAuth + Discord OAuth is required** — the dashboard needs the Discord access token to call the Discord guilds API for authorization. Do not replace with Clerk/Auth0.
- **`@/` path alias** maps to `src/` in each app (`apps/dashboard/src/`, `apps/voting/src/`) — configured in each app's `tsconfig.json` and `vitest.config.ts`.
- **`(dashboard)` route group** — Settings and Audit pages live under `app/(dashboard)/` with a shared layout that handles auth and provides the server selector.
- **`lib/discord.ts`** — Canonical authorization utility (`getAdminGuilds`). Do not duplicate guild-fetching logic.
- **`lib/actions.ts`** — Server action for feature toggles with re-verification and audit logging.
- **Discussion prompts** — 400 curated prompts in `bot/src/data/discussion-prompts.md` across 2 categories (Creative Process, Inspiration). To add/edit prompts, edit the markdown file directly — each line is `- Prompt text here?`. The parser (`bot/src/data/parse-prompts.ts`) loads them at startup. The bot build step copies the `.md` to `dist/`.
- **Discussion scheduler** — interval-based scheduler in `bot/src/services/scheduler.ts` posts every 6 hours per channel, waiting for a natural conversation pause before posting.
- **Hierarchical permissions** — `canUseFeature()` in `bot/src/middleware/permissions.ts` implements Channel > Role > Server specificity with "Allow Wins" conflict resolution.
- **Permissions default to allow** — when no `FeatureConfig` exists for a feature, `canUseFeature()` returns `true`. New servers get all features enabled until admins explicitly disable them.
- **Voting site** — `apps/voting` is a Next.js 16 community tool for upvoting/downvoting discussion prompts (NextAuth + Discord OAuth, `identify email` scope). Runs on port 3200 in local dev. Deployed to Vercel at `discussion-prompts.pl.iser.io`. Admin access is controlled by `VOTING_ADMIN_USER_IDS` (comma-separated Discord user IDs) and optionally `VOTING_ADMIN_ROLE_IDS` + `DISCORD_TOKEN` for role-based access via guild member lookup. API routes: `/api/vote` (voting), `/api/prompt` (POST/PATCH/DELETE for prompt management), `/api/flag` (duplicate flagging toggle), `/api/admin/voters` (admin voter list), `/api/admin/export` (JSON export). Rate limiting: 20 votes/min and 20 prompt submissions/min per user. Privacy: `submittedBy`/`submittedByUsername` fields are stripped from non-admin responses. Prompts are seeded from `discussion-prompts.md` into `Prompt`/`PromptTag` tables with 17 granular tags. Each app's `.env` is a symlink to the root `.env`.
- **Dashboard deployment** — `apps/dashboard` is deployed to Vercel at `bot-dashboard.pl.iser.io`. Uses the same Supabase database. Requires `guilds` OAuth scope for Discord admin guild lookup. Build uses `scripts/build.sh` with Prisma NFT trace patching (same pattern as voting app).
- **Vercel monorepo deployment** — Both voting and dashboard apps use `outputFileTracingRoot` pointing to the monorepo root, a custom `scripts/build.sh` that builds the Prisma client then Next.js then patches `.nft.json` trace files to include the Prisma engine binary. The `vercel.json` in each app sets `installCommand: "cd ../.. && pnpm install"` and `buildCommand: "bash scripts/build.sh"`.
- **Tests use `vi.clearAllMocks()` in `beforeEach`** — mock return values must be re-established after clearing, not just in `vi.mock()`.

## Environment Variables

See `.env.example` at root for all required variables. Key ones:
- `DISCORD_TOKEN`, `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`
- `DATABASE_URL`
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `VOTING_NEXTAUTH_SECRET`, `VOTING_GUILD_ID`, `VOTING_ADMIN_USER_IDS`, `VOTING_ADMIN_ROLE_IDS`

## Local Development

```bash
pnpm init:local       # First time: interactive setup wizard
pnpm dev:local        # Every time: starts everything with one command
```

Requires Docker for local Postgres. See `docs/LOCAL_SETUP.md` for the full manual setup walkthrough.

## Troubleshooting

- **Dev logs** are written to `/tmp/photobot-dev.log` — check this file to diagnose startup or runtime issues.
- **Docker container conflicts** — `dev.sh` runs `docker compose down` and force-removes named containers before starting. If you still hit conflicts, run `docker rm -f photobot-db photobot-ollama` manually.
- **Integration test failures** — these require `DATABASE_URL` pointing to a running Postgres instance. Unit tests (`pnpm test`) work without a database.
