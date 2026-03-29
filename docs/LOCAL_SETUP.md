# Photobot Local Setup Guide

Step-by-step instructions for setting up the Photobot development environment from scratch.

## Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Node.js | 20+ | `node -v` |
| pnpm | 8+ | `pnpm -v` |
| Docker | 24+ | `docker -v` |
| Docker Compose | v2 | `docker compose version` |
| Git | any | `git -v` |

You also need a **Discord Application** with a bot. If you don't have one yet, see [Step 1](#step-1-create-a-discord-application).

---

## Step 1: Create a Discord Application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click **New Application**, give it a name (e.g. "Photobot Dev"), and create it.
3. Note your **Application ID** — this is your `DISCORD_CLIENT_ID`.

### Create a Bot User

1. Go to **Bot** in the sidebar.
2. Click **Reset Token** and copy the token — this is your `DISCORD_TOKEN`. You will not be able to see it again.
3. Under **Privileged Gateway Intents**, keep the defaults (no extra intents needed — the bot only uses `Guilds`).

### Configure OAuth2

1. Go to **OAuth2 > General** in the sidebar.
2. Add a redirect URL: `http://localhost:3100/api/auth/callback/discord`
3. Copy the **Client Secret** — this is your `DISCORD_CLIENT_SECRET`.

### Invite the Bot to a Test Server

1. Go to **OAuth2 > URL Generator**.
2. Select scopes: `bot`, `applications.commands`.
3. Select bot permissions: `Send Messages`, `Attach Files`, `Use Slash Commands`.
4. Open the generated URL in your browser and add the bot to your test server.

---

## Step 2: Clone and Install

```bash
git clone <repo-url>
cd photography-bot
pnpm install
```

---

## Step 3: Configure Environment Variables

```bash
cp .env.example .env
```

Open `.env` and fill in the values:

```bash
# Required — from Step 1
DISCORD_TOKEN=your-bot-token
DISCORD_CLIENT_ID=your-application-id
DISCORD_CLIENT_SECRET=your-client-secret

# Database — these defaults work with the local Docker Postgres
DATABASE_URL=postgresql://postgres:postgres@localhost:54422/postgres

# NextAuth — generate a random secret (e.g. `openssl rand -base64 32`)
NEXTAUTH_SECRET=<random-string>
NEXTAUTH_URL=http://localhost:3100

# Supabase — these defaults work with the local Docker services
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54421
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-local-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-local-service-role-key>

# AI — choose one:
# For local dev (free, runs in Docker):
AI_PROVIDER=ollama
OLLAMA_HOST=http://localhost:11434

# For production-quality results:
# GEMINI_API_KEY=your-gemini-api-key
```

> **Tip:** For local development without Supabase auth, you can set
> `NEXT_PUBLIC_SUPABASE_URL` and keys to placeholder values. The dashboard
> auth will fail gracefully — you can still develop non-auth features.

---

## Step 4: Start Docker Services

The project uses Docker for local Postgres, Supabase Auth, PostgREST, and Ollama (local AI).

```bash
docker compose up -d
```

This starts four services:

| Service | Container | Port | Purpose |
|---------|-----------|------|---------|
| Postgres | photobot-db | 54422 | Database |
| GoTrue | photobot-auth | 9998 | Auth server |
| PostgREST | photobot-rest | 54421 | REST API |
| Ollama | photography-bot-ollama | 11434 | Local AI inference |

Wait for the database to be healthy:

```bash
docker inspect -f '{{.State.Health.Status}}' photobot-db
# Should print: healthy
```

---

## Step 5: Pull the Ollama Model

If using Ollama for local AI (recommended for development):

```bash
docker exec photography-bot-ollama ollama pull llava
```

This downloads the `llava` vision model (~4.7 GB). It only needs to be done once — the data persists in a Docker volume.

---

## Step 6: Run Database Migrations

Generate the Prisma client and push the schema to the local database:

```bash
pnpm -C packages/db exec prisma generate
pnpm -C packages/db exec prisma db push
```

> `db push` is used instead of `migrate dev` for local development since we
> don't have a migrations history yet. For production, use `prisma migrate deploy`.

---

## Step 7: Build Shared Packages

The bot and dashboard depend on shared packages that need to be compiled first:

```bash
pnpm -C packages/db build
pnpm -C packages/ai build
```

---

## Step 8: Start the Applications

```bash
pnpm dev
```

This starts both apps concurrently:

| App | URL | Description |
|-----|-----|-------------|
| Dashboard | http://localhost:3100 | Admin panel (Next.js) |
| Bot | — | Connects to Discord via websocket |

The bot will register its slash commands (`/critique`, `/palette`, `/settings`) on startup.

---

## Step 9: Verify Everything Works

### Bot

1. Open your test Discord server.
2. Type `/critique` or `/palette` — the commands should appear in autocomplete.
3. Attach an image and run a command.

### Dashboard

1. Open http://localhost:3100.
2. Click **Login with Discord**.
3. After OAuth, you should see your servers listed.
4. Click **Settings** on a server to manage feature toggles.

---

## Stopping the Environment

```bash
# Stop the Node.js apps
# (Ctrl+C in the terminal running `pnpm dev`)

# Stop Docker services
docker compose down

# Stop and remove all data (fresh start)
docker compose down -v
```

---

## Troubleshooting

### "supabaseUrl is required"
The dashboard's NextAuth adapter needs Supabase env vars. Make sure `NEXT_PUBLIC_SUPABASE_URL` is set in `.env`.

### Bot commands don't appear in Discord
Discord caches global commands for up to an hour. Either wait, or use guild-specific command registration for faster testing.

### Ollama is slow on first request
The model loads into memory on the first request. Subsequent requests are fast. If you have limited RAM (<8 GB), consider using the Gemini API instead.

### Prisma "Can't reach database server"
Ensure Docker is running and the Postgres container is healthy:
```bash
docker compose ps
docker inspect -f '{{.State.Health.Status}}' photobot-db
```

### Port conflicts
If ports are already in use, check with `lsof -i :54422` (or the relevant port) and stop the conflicting process. Photobot uses non-standard ports (54422, 54421, 9998) to avoid clashing with other Supabase instances.
