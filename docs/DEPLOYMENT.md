# Photobot Deployment & Release Process

How to deploy Photobot to production and manage releases.

## Architecture Overview

| Component | Platform | Purpose | URL |
|-----------|----------|---------|-----|
| **Bot** | Railway | Persistent Discord.js process | — |
| **Dashboard** | Vercel | Next.js admin panel (serverless) | `bot-dashboard.pl.iser.io` |
| **Voting Site** | Vercel | Next.js prompt voting (serverless) | `discussion-prompts.pl.iser.io` |
| **Database** | Supabase | Managed Postgres (PgBouncer pooling) | — |

All services share a single Supabase Postgres database via `DATABASE_URL` (pooled connection on port 6543).

```
                    ┌──────────────┐
                    │   Supabase   │
                    │  (Postgres)  │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │                         │
     ┌────────▼───┐          ┌─────────▼──────────┐
     │  Railway   │          │      Vercel        │
     │   (Bot)    │          │ Dashboard + Voting │
     └────────────┘          └────────────────────┘
```

---

## Prerequisites

Before your first deploy, you need accounts and projects on:

- [Supabase](https://supabase.com) — Create a project; note the connection string
- [Vercel](https://vercel.com) — Link to your GitHub repo
- [Railway](https://railway.app) — Create a project for the bot
- [Discord Developer Portal](https://discord.com/developers/applications) — Production bot application

---

## 1. Database (Supabase)

### Initial Setup

1. Create a new Supabase project.
2. Go to **Settings > Database** and copy the **Connection string** (URI format).
3. This `DATABASE_URL` is shared by both the bot and dashboard.

### Applying Schema Changes

Schema changes live in `packages/db/prisma/schema.prisma`. To apply them to production:

```bash
# Set the production DATABASE_URL temporarily
DATABASE_URL="postgresql://postgres:PASSWORD@db.YOURPROJECT.supabase.co:5432/postgres" \
  npx prisma db push
```

> **Important:** Always apply schema changes to production **before** deploying the bot or dashboard that depends on them. New columns/tables must exist before the code that references them goes live.

### Migration Checklist

- [ ] Schema change tested locally (`pnpm db push` against local Docker)
- [ ] All tests pass (`pnpm test`)
- [ ] Schema pushed to production Supabase
- [ ] Verified via Supabase dashboard (Table Editor) that new tables/columns exist
- [ ] Bot and dashboard deployed after schema is confirmed

---

## 2. Dashboard (Vercel)

**Vercel project:** `pl-bot-dashboard` | **Domain:** `bot-dashboard.pl.iser.io`

### Initial Setup

Both the dashboard and voting site use the same monorepo deployment pattern:

1. Create a Vercel project with `vercel link --project pl-bot-dashboard`.
2. Set the **Root Directory** to `apps/dashboard` in project settings.
3. Each app has a `vercel.json` that configures:
   - `installCommand`: `cd ../.. && pnpm install`
   - `buildCommand`: `bash scripts/build.sh`
   - `framework`: `nextjs`
4. The `scripts/build.sh` in each app:
   - Builds the Prisma client (`@photobot/db`)
   - Builds the Next.js app
   - Patches `.nft.json` trace files to include the Prisma engine binary for serverless
5. `next.config.mjs` sets `outputFileTracingRoot` to the monorepo root for proper file tracing.

### Environment Variables

Set these in Vercel project settings (**Settings > Environment Variables**):

| Variable | Value | Environments |
|----------|-------|-------------|
| `DISCORD_CLIENT_ID` | Main Discord app ID (needs `guilds` scope) | Production |
| `DISCORD_CLIENT_SECRET` | Main Discord app secret | Production |
| `DISCORD_TOKEN` | Bot token (for guild member lookup) | Production |
| `NEXTAUTH_SECRET` | Random 32-byte string | Production |
| `NEXTAUTH_URL` | `https://bot-dashboard.pl.iser.io` | Production |
| `DATABASE_URL` | Supabase pooled connection string (port 6543) | Production |
| `PL_GUILD_ID` | Photography Lounge Discord server ID | Production |

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### Deploy

Deploy from the monorepo root (after linking to the dashboard project):

```bash
vercel link --project pl-bot-dashboard
vercel --prod
```

### Discord OAuth Redirect

In the Discord Developer Portal (main bot app), add the OAuth2 redirect URL:
```
https://bot-dashboard.pl.iser.io/api/auth/callback/discord
```

---

## 3. Voting Site (Vercel)

**Vercel project:** `pl-discussion-voting` | **Domain:** `discussion-prompts.pl.iser.io`

### Initial Setup

Same monorepo pattern as the dashboard (see above). The voting app uses a separate Discord app with `identify email` scope (not `guilds`).

### Environment Variables

| Variable | Value | Environments |
|----------|-------|-------------|
| `DISCORD_CLIENT_ID` | Voting Discord app ID | Production |
| `DISCORD_CLIENT_SECRET` | Voting Discord app secret | Production |
| `NEXTAUTH_SECRET` | Random 32-byte string | Production |
| `NEXTAUTH_URL` | `https://discussion-prompts.pl.iser.io` | Production |
| `VOTING_NEXTAUTH_SECRET` | Random 32-byte string (fallback) | Production |
| `DATABASE_URL` | Supabase pooled connection string (port 6543) | Production |
| `VOTING_ADMIN_USER_IDS` | Comma-separated Discord user IDs | Production |
| `VOTING_ADMIN_ROLE_IDS` | Comma-separated Discord role IDs (optional) | Production |
| `PL_GUILD_ID` | Photography Lounge Discord server ID | Production |

### Deploy

```bash
vercel link --project pl-discussion-voting
vercel --prod
```

### Discord OAuth Redirect

In the Discord Developer Portal (voting app), add:
```
https://discussion-prompts.pl.iser.io/api/auth/callback/discord
```

---

## 4. Bot (Railway)

### Initial Setup

1. Create a new Railway project.
2. Add a service from your GitHub repo.
3. Set the **Root Directory** to `/` (monorepo root).
4. Set the **Build Command** to:
   ```
   pnpm install && pnpm --filter @photobot/db build && pnpm --filter @photobot/bot build
   ```
5. Set the **Start Command** to:
   ```
   node apps/bot/dist/index.js
   ```

### Environment Variables

Set these in Railway service settings:

| Variable | Value |
|----------|-------|
| `DISCORD_TOKEN` | Production bot token |
| `DISCORD_CLIENT_ID` | Production Discord app ID |
| `DATABASE_URL` | Supabase connection string |
| `PL_GUILD_ID` | Photography Lounge Discord server ID |

### Deploy

Railway deploys automatically on push to `main`. To trigger a manual redeploy, use the Railway dashboard or CLI:

```bash
railway up
```

### Health Check

The bot logs `Ready! Logged in as <tag>` on startup. Check Railway logs to confirm:
- Bot connects to Discord
- Slash commands are registered
- Discussion scheduler starts

---

## 5. Release Process

### Standard Release (Feature/Fix)

```
1. Develop & test locally
   └─ pnpm dev:local
   └─ pnpm test

2. Schema changes? Push to Supabase first
   └─ DATABASE_URL=<prod> npx prisma db push

3. Push to main
   └─ git push origin main

4. Verify deployments
   └─ Vercel: check deployment in dashboard or `vercel ls`
   └─ Railway: check logs in dashboard

5. Smoke test
   └─ Dashboard: sign in at bot-dashboard.pl.iser.io, check feature toggles
   └─ Voting: sign in at discussion-prompts.pl.iser.io, cast a vote
   └─ Bot: run a command in Discord (e.g., /discuss prompt)
```

### Release with Schema Changes

Schema changes require careful ordering to avoid downtime:

```
Step 1: Push ADDITIVE schema changes to Supabase
        (new tables, new columns with defaults, new indexes)
        ↓
Step 2: Deploy bot + dashboard (code that uses new schema)
        ↓
Step 3: Push DESTRUCTIVE schema changes to Supabase
        (drop old columns, rename tables — only after code no longer uses them)
```

> **Rule:** Never drop a column or table that deployed code still references. Additive changes first, then deploy code, then clean up old schema.

### Hotfix Process

For urgent production fixes:

```bash
# 1. Create a hotfix branch
git checkout -b hotfix/description main

# 2. Fix + test
pnpm test

# 3. Merge to main
git checkout main
git merge hotfix/description
git push origin main

# 4. Verify deployments complete
# 5. Delete the hotfix branch
git branch -d hotfix/description
```

---

## 6. Environment Variable Reference

### Full Production Variable List

```bash
# ─── Shared ───
DATABASE_URL=postgresql://postgres.PROJECT:PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1

# ─── Photography Lounge ───
PL_GUILD_ID=<discord-server-id>

# ─── Bot (Railway) ───
DISCORD_TOKEN=<bot-token>
DISCORD_CLIENT_ID=<app-id>

# ─── Dashboard (Vercel: pl-bot-dashboard) ───
DISCORD_CLIENT_ID=<main-app-id>
DISCORD_CLIENT_SECRET=<main-app-secret>
DISCORD_TOKEN=<bot-token>
NEXTAUTH_SECRET=<random-32-byte-base64>
NEXTAUTH_URL=https://bot-dashboard.pl.iser.io

# ─── Voting Site (Vercel: pl-discussion-voting) ───
DISCORD_CLIENT_ID=<voting-app-id>
DISCORD_CLIENT_SECRET=<voting-app-secret>
NEXTAUTH_SECRET=<random-32-byte-base64>
VOTING_NEXTAUTH_SECRET=<random-32-byte-base64>
NEXTAUTH_URL=https://discussion-prompts.pl.iser.io
VOTING_ADMIN_USER_IDS=<comma-separated-discord-user-ids>
VOTING_ADMIN_ROLE_IDS=<comma-separated-role-ids>
PL_GUILD_ID=<discord-server-id>
```

### Where to Find Each Value

| Variable | Source |
|----------|--------|
| `DATABASE_URL` | Supabase > Settings > Database > Connection string |
| `DISCORD_TOKEN` | Discord Developer Portal > Bot > Reset Token |
| `DISCORD_CLIENT_ID` | Discord Developer Portal > General Information > Application ID |
| `DISCORD_CLIENT_SECRET` | Discord Developer Portal > OAuth2 > Client Secret |
| `NEXTAUTH_SECRET` | Generate: `openssl rand -base64 32` |
| `PL_GUILD_ID` | Discord Developer Portal > Your server ID |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase > Settings > API > Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase > Settings > API > anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase > Settings > API > service_role secret |

---

## 7. Rollback

### Dashboard (Vercel)

Vercel keeps every deployment as an immutable snapshot. To roll back:

1. Go to the Vercel dashboard > Deployments tab.
2. Find the last known-good deployment.
3. Click the three-dot menu > **Promote to Production**.

Or via CLI:
```bash
# List recent deployments
vercel ls

# Promote a specific deployment to production
vercel promote <deployment-url>
```

### Bot (Railway)

Railway also keeps deployment history:

1. Go to Railway dashboard > Service > Deployments.
2. Click **Redeploy** on a previous deployment.

### Database

Supabase provides **Point-in-Time Recovery** on Pro plans. For schema rollbacks:

```bash
# Revert a schema change by pushing the previous schema version
git checkout HEAD~1 -- packages/db/prisma/schema.prisma
DATABASE_URL=<prod> npx prisma db push
```

> **Warning:** Dropping columns/tables loses data. If a schema rollback requires removing new columns, verify no data loss concerns first.

---

## 8. Monitoring & Troubleshooting

### Dashboard

- **Vercel dashboard:** Deployment logs, function logs, analytics
- **Check:** Visit `https://your-domain.com` and sign in with Discord

### Bot

- **Railway logs:** Real-time stdout/stderr from the bot process
- **Key log lines to watch for:**
  - `Ready! Logged in as Photobot#1234` — bot is connected
  - `Successfully reloaded application (/) commands.` — slash commands registered
  - `Discussion scheduler started.` — cron jobs running

### Database

- **Supabase dashboard:** Table editor, SQL editor, logs
- **Prisma Studio** (for debugging, not production):
  ```bash
  DATABASE_URL=<prod> npx prisma studio
  ```

### Common Issues

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Dashboard/Voting 500 on login | Missing or wrong `NEXTAUTH_SECRET` | Regenerate and redeploy |
| Dashboard/Voting "Access Denied" | OAuth redirect URL not configured | Add URL in Discord Developer Portal |
| Prisma engine not found on Vercel | NFT trace files missing engine | Check `scripts/build.sh` runs after `next build` |
| Supabase `MaxClientsInSessionMode` | Using direct connection (port 5432) | Switch to pooled connection (port 6543 with `?pgbouncer=true`) |
| Bot offline | Railway service stopped or crashed | Check Railway logs, redeploy |
| Bot commands missing | `DISCORD_CLIENT_ID` mismatch | Verify env var matches Discord app |
| "Can't reach database" | Wrong `DATABASE_URL` or Supabase paused | Check connection string; unpause project |

---

## 9. Pre-Deploy Checklist

Use this before every production deploy:

- [ ] All tests pass locally: `pnpm test`
- [ ] Build succeeds: `pnpm build`
- [ ] Schema changes applied to production Supabase (if any)
- [ ] Environment variables updated in Vercel/Railway (if any new ones)
- [ ] Discord OAuth redirect URLs configured for both apps (if domain changed)
- [ ] Push to `main`
- [ ] Verify Vercel deployments succeeded (both dashboard and voting)
- [ ] Verify Railway deployment succeeded
- [ ] Smoke test: dashboard login + voting login + bot command in Discord
