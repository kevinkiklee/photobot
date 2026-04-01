# Contributing to Photobot

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

1. Fork and clone the repo
2. Install dependencies: `pnpm install`
3. Copy `.env.example` to `.env` and fill in your credentials
4. Start local dev: `pnpm dev:local`

See [LOCAL_SETUP.md](LOCAL_SETUP.md) for detailed setup instructions.

## Making Changes

1. Create a branch from `main` (`git checkout -b my-feature`)
2. Make your changes
3. Run tests: `pnpm test`
4. Commit with a clear message describing what and why
5. Push and open a pull request

## Pull Requests

- Keep PRs focused on a single change
- Include a description of what changed and why
- Make sure all tests pass before requesting review
- Add tests for new functionality

## Code Style

- TypeScript throughout the monorepo
- Use the existing patterns in the codebase as a guide
- `@/` path alias maps to `apps/dashboard/src/`
- Tests use Vitest with `vi.clearAllMocks()` in `beforeEach`

## Reporting Bugs

Open a [GitHub issue](https://github.com/kevinkiklee/photobot/issues) with:

- Steps to reproduce
- Expected vs actual behavior
- Node version and OS

## Security Issues

Please do **not** open a public issue for security vulnerabilities. See [SECURITY.md](SECURITY.md) for responsible disclosure instructions.

---

## Production Service Access for Contributors

Most development uses local services only (Docker Postgres, Ollama). However, some tasks require access to production or staging services. This section is for project maintainers granting access to trusted contributors.

### Access Tiers

| Tier | Who | What they get |
|------|-----|---------------|
| **Local only** | All contributors | Docker-based dev env, no production access needed |
| **Staging** | Trusted contributors | Staging Supabase, Vercel preview deploys, dev Discord bot |
| **Production** | Maintainers only | Production Supabase, Railway, Vercel prod, live Discord bot |

Most contributions only need local access. Staging access is granted when a contributor needs to test against real Discord interactions or verify database migrations before production.

### Granting Staging Access

#### 1. Discord (Development Bot)

Create a separate Discord application for staging (not the production bot).

1. Go to [Discord Developer Portal](https://discord.com/developers/applications) and create a new application (e.g., "Photobot Staging").
2. Create a bot user and copy the token.
3. Invite the staging bot to a test Discord server.
4. Share with the contributor:
   - `DISCORD_TOKEN` (staging bot token)
   - `DISCORD_CLIENT_ID` (staging app ID)
   - `DISCORD_CLIENT_SECRET` (staging client secret)
   - Invite link to the test server

> **Never share the production bot token.** If a contributor needs to test bot commands, they use the staging bot in a test server.

#### 2. Supabase (Staging Database)

Option A: **Branch database** (preferred)
1. In the Supabase dashboard, create a branch database from the main project.
2. Share the branch's connection string with the contributor as their `DATABASE_URL`.
3. Branch databases are isolated — contributors can run migrations without affecting production.

Option B: **Separate project**
1. Create a new Supabase project for staging.
2. Apply the schema: `DATABASE_URL=<staging-url> npx prisma db push`
3. Share the connection string.

Either way, the contributor sets `DATABASE_URL` in their `.env` to point at the staging database.

#### 3. Vercel (Preview Deployments)

Contributors get preview deployments automatically via pull requests — no special access needed.

For dashboard environment variables on previews:
1. Go to Vercel project settings > Environment Variables.
2. Add staging values for the **Preview** environment only:
   - `DATABASE_URL` → staging Supabase connection string
   - `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` → staging Discord app
   - `NEXTAUTH_URL` → leave blank (Vercel sets it automatically for previews)
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` → staging Supabase

Contributors don't need Vercel account access for preview deploys. PRs automatically generate preview URLs.

#### 4. Railway (Bot Hosting)

Contributors generally don't need Railway access. If they're working on bot deployment or infrastructure:

1. Add them as a member on the Railway project.
2. Create a separate staging service (not the production service).
3. Set the staging service's env vars to point at the staging Discord bot and staging database.

#### 5. Google Gemini API (AI)

For local development, contributors use Ollama (free, no API key needed). This is the default.

If a contributor needs to test against Gemini specifically:
1. Have them create their own key at [Google AI Studio](https://aistudio.google.com/apikey) (free tier is sufficient for development).
2. They set `AI_PROVIDER=gemini` and `GEMINI_API_KEY=<their-key>` in their `.env`.

> **Never share the production Gemini API key.** Contributors use their own free-tier keys.

### Onboarding Checklist

When granting staging access to a contributor, use this checklist:

- [ ] Contributor has signed any required agreements (CLA, NDA if applicable)
- [ ] Created or identified staging Discord application
- [ ] Shared staging Discord credentials (token, client ID, client secret)
- [ ] Invited contributor to test Discord server
- [ ] Created staging database (Supabase branch or separate project)
- [ ] Shared staging `DATABASE_URL`
- [ ] Verified Vercel preview env vars are set for Preview environment
- [ ] Contributor confirmed `pnpm dev:local` works with staging credentials
- [ ] Contributor confirmed they can run a bot command in the test Discord server

### Revoking Access

When a contributor's access should be removed:

- **Discord:** Reset the staging bot token in the Developer Portal. Update other contributors.
- **Supabase:** Delete the branch database, or remove the contributor's IP from the allow list.
- **Railway:** Remove the member from the project.
- **Vercel:** Remove the member from the team (if added). Preview deploys don't require membership.

### What NOT to Share

| Secret | Why |
|--------|-----|
| Production `DISCORD_TOKEN` | Full control of the live bot in the 36k-member server |
| Production `DATABASE_URL` | Direct access to all production data |
| Production `NEXTAUTH_SECRET` | Could forge dashboard sessions |
| Production `SUPABASE_SERVICE_ROLE_KEY` | Bypasses all row-level security |
| Production `GEMINI_API_KEY` | Billed to the project; could exhaust quota |

All production secrets stay with maintainers only. Contributors work against staging/local environments.
