# Photobot

Photography community Discord bot with AI-driven critique, palette extraction, and an admin dashboard.

## Architecture

Pnpm monorepo with three apps and two shared packages:

```
apps/bot          Discord.js bot (commands, bouncer security, permissions middleware)
apps/dashboard    Next.js 14 admin dashboard (NextAuth + Discord OAuth, feature toggles, audit logs)
packages/ai       Provider-agnostic AI wrapper (Gemini for prod, Ollama for local dev)
packages/db       Prisma client + schema (FeatureConfig, ConfigAuditLog, UserUsageMetric)
```

## Key Commands

```bash
pnpm init:local            # Interactive first-time setup (prompts for creds, generates .env)
pnpm dev:local        # One-command local dev: Docker + migrations + builds + apps
pnpm dev              # Start apps only (assumes Docker and packages already built)
pnpm build            # Build all packages and apps
pnpm test             # Run all tests (vitest) across workspaces
pnpm status           # Health check: shows state of all services and config
pnpm db <cmd>         # Database ops: push, reset, studio, seed, migrate
pnpm dev:down         # Stop Docker services
pnpm cleanup          # Stop containers + remove build artifacts
pnpm cleanup --full   # Nuclear option: also removes node_modules + Docker volumes
```

## Tech Stack

- **Bot:** discord.js 14, Sharp (image processing), node-cron (scheduler), dotenv
- **Dashboard:** Next.js 14 (App Router), NextAuth 4 (Discord OAuth with `guilds` scope), Tailwind CSS
- **Database:** Prisma 5 on Supabase Postgres (FeatureConfig, ConfigAuditLog, UserUsageMetric, DiscussionSchedule, DiscussionPromptLog)
- **AI:** @google/generative-ai (Gemini) in prod, ollama package for local dev
- **Testing:** Vitest across all workspaces (vitest.workspace.ts at root, vitest.integration.workspace.ts for integration tests)

## Important Patterns

- **NextAuth + Discord OAuth is required** — the dashboard needs the Discord access token to call the Discord guilds API for authorization. Do not replace with Clerk/Auth0.
- **`@/` path alias** maps to `apps/dashboard/src/` — configured in both `tsconfig.json` and `vitest.config.ts`.
- **`(dashboard)` route group** — Settings and Audit pages live under `app/(dashboard)/` with a shared layout that handles auth and provides the server selector.
- **`lib/discord.ts`** — Canonical authorization utility (`getAdminGuilds`). Do not duplicate guild-fetching logic.
- **`lib/actions.ts`** — Server action for feature toggles with re-verification and audit logging.
- **Discussion scheduler** — interval-based scheduler in `bot/src/services/scheduler.ts` posts every 6 hours per channel, waiting for a natural conversation pause (5 min quiet) before posting. 241 curated prompts in `bot/src/data/discussion-prompts.md` across 2 categories (Creative Process, Inspiration). Posts are regular messages, not threads.
- **Dashboard components** — Toast notifications, ServerPopover, MobileNav, Skeleton loading states, ErrorCard, ErrorBoundary, and 404 page.
- **Bouncer pipeline** — Two-layer AI moderation (fast + deep) with EXIF stripping and shadow rate limiting.
- **Hierarchical permissions** — `canUseFeature()` in `bot/src/middleware/permissions.ts` implements Channel > Role > Server specificity with "Allow Wins" conflict resolution.
- **Tests use `vi.clearAllMocks()` in `beforeEach`** — mock return values must be re-established after clearing, not just in `vi.mock()`.

## Environment Variables

See `.env.example` at root for all required variables. Key ones:
- `DISCORD_TOKEN`, `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`
- `DATABASE_URL`
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `GEMINI_API_KEY` (prod) or `OLLAMA_HOST` (local dev)

## Local Development

```bash
pnpm init:local             # First time: interactive setup wizard
pnpm dev:local         # Every time: starts everything with one command
```

Requires Docker for local Postgres and Ollama. See `docs/LOCAL_SETUP.md` for the full manual setup walkthrough.
