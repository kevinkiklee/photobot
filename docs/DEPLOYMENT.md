# Photobot Deployment & Release Process

How to deploy Photobot to production and manage releases.

## Architecture Overview

| Component | Platform | Purpose |
|-----------|----------|---------|
| **Bot** | Railway | Persistent Discord.js process |
| **Dashboard** | Vercel | Next.js admin panel (serverless) |
| **Database** | Supabase | Managed Postgres |
| **AI** | Google Gemini API | Image analysis (production) |

All three services share a single Supabase Postgres database via `DATABASE_URL`.

```
                    ┌──────────────┐
                    │   Supabase   │
                    │  (Postgres)  │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
     ┌────────▼───┐  ┌────▼─────┐  ┌──▼───────────┐
     │  Railway   │  │  Vercel  │  │  Gemini API  │
     │   (Bot)    │  │(Dashboard│  │  (AI Vision) │
     └────────────┘  └──────────┘  └──────────────┘
```

---

## Prerequisites

Before your first deploy, you need accounts and projects on:

- [Supabase](https://supabase.com) — Create a project; note the connection string
- [Vercel](https://vercel.com) — Link to your GitHub repo
- [Railway](https://railway.app) — Create a project for the bot
- [Google AI Studio](https://aistudio.google.com/apikey) — Get a Gemini API key
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

### Initial Setup

1. Import the repo in Vercel.
2. Set the **Root Directory** to `apps/dashboard`.
3. Set **Framework Preset** to Next.js.
4. Set the **Build Command** to:
   ```
   cd ../.. && pnpm install && pnpm --filter @photobot/db build && pnpm --filter @photobot/dashboard build
   ```
   This builds the shared `@photobot/db` package before the dashboard.
5. Set the **Output Directory** to `.next` (default).
6. Set the **Install Command** to:
   ```
   cd ../.. && pnpm install
   ```

### Environment Variables

Set these in Vercel project settings (**Settings > Environment Variables**):

| Variable | Value | Environments |
|----------|-------|-------------|
| `DISCORD_CLIENT_ID` | Your production Discord app ID | All |
| `DISCORD_CLIENT_SECRET` | Your production Discord secret | All |
| `NEXTAUTH_SECRET` | Random 32-byte string | All |
| `NEXTAUTH_URL` | `https://your-domain.com` | Production |
| `DATABASE_URL` | Supabase connection string | All |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://YOURPROJECT.supabase.co` | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase Settings > API | All |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase Settings > API | All |

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### Deploy

Vercel deploys automatically on push to `main`. To deploy manually:

```bash
# Preview deployment (from repo root)
vercel

# Production deployment
vercel --prod
```

### Discord OAuth Redirect

In the Discord Developer Portal, add the OAuth2 redirect URL:
```
https://your-domain.com/api/auth/callback/discord
```

For Vercel preview deployments, also add:
```
https://your-project-name.vercel.app/api/auth/callback/discord
```

---

## 3. Bot (Railway)

### Initial Setup

1. Create a new Railway project.
2. Add a service from your GitHub repo.
3. Set the **Root Directory** to `/` (monorepo root).
4. Set the **Build Command** to:
   ```
   pnpm install && pnpm --filter @photobot/db build && pnpm --filter @photobot/ai build && pnpm --filter @photobot/bot build
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
| `AI_PROVIDER` | `gemini` |
| `GEMINI_API_KEY` | Your Google Gemini API key |

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

## 4. Release Process

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
   └─ Dashboard: sign in, check feature toggles
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

## 5. Environment Variable Reference

### Full Production Variable List

```bash
# ─── Shared ───
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres

# ─── Bot (Railway) ───
DISCORD_TOKEN=<bot-token>
DISCORD_CLIENT_ID=<app-id>
AI_PROVIDER=gemini
GEMINI_API_KEY=<gemini-key>

# ─── Dashboard (Vercel) ───
DISCORD_CLIENT_ID=<app-id>
DISCORD_CLIENT_SECRET=<client-secret>
NEXTAUTH_SECRET=<random-32-byte-base64>
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

### Where to Find Each Value

| Variable | Source |
|----------|--------|
| `DATABASE_URL` | Supabase > Settings > Database > Connection string |
| `DISCORD_TOKEN` | Discord Developer Portal > Bot > Reset Token |
| `DISCORD_CLIENT_ID` | Discord Developer Portal > General Information > Application ID |
| `DISCORD_CLIENT_SECRET` | Discord Developer Portal > OAuth2 > Client Secret |
| `NEXTAUTH_SECRET` | Generate: `openssl rand -base64 32` |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/apikey) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase > Settings > API > Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase > Settings > API > anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase > Settings > API > service_role secret |

---

## 6. Rollback

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

## 7. Monitoring & Troubleshooting

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
| Dashboard 500 on login | Missing or wrong `NEXTAUTH_SECRET` | Regenerate and redeploy |
| Dashboard "Access Denied" | OAuth redirect URL not configured | Add URL in Discord Developer Portal |
| Bot offline | Railway service stopped or crashed | Check Railway logs, redeploy |
| Bot commands missing | `DISCORD_CLIENT_ID` mismatch | Verify env var matches Discord app |
| "Can't reach database" | Wrong `DATABASE_URL` or Supabase paused | Check connection string; unpause project |
| AI commands fail | Missing `GEMINI_API_KEY` or quota exceeded | Check key validity and quota in Google AI Studio |

---

## 8. Pre-Deploy Checklist

Use this before every production deploy:

- [ ] All tests pass locally: `pnpm test`
- [ ] Build succeeds: `pnpm build`
- [ ] Schema changes applied to production Supabase (if any)
- [ ] Environment variables updated in Vercel/Railway (if any new ones)
- [ ] Discord OAuth redirect URLs configured (if domain changed)
- [ ] AI access grants configured for production server (`/ai-access list`)
- [ ] Push to `main`
- [ ] Verify Vercel deployment succeeded
- [ ] Verify Railway deployment succeeded
- [ ] Smoke test: dashboard login + bot command in Discord
