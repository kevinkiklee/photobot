# Photobot Local Setup Guide

Complete walkthrough for setting up the Photobot development environment from scratch.

> **Quick start:** If you just want to get running fast, use `pnpm init:local` — it handles everything interactively. This guide explains each step manually for when you need more control.

## Prerequisites

| Tool | Version | Install | Check |
|------|---------|---------|-------|
| Node.js | 20+ | [nodejs.org](https://nodejs.org) | `node -v` |
| pnpm | 8+ | `npm i -g pnpm` | `pnpm -v` |
| Docker | 24+ | [docker.com](https://docs.docker.com/get-docker/) | `docker -v` |
| Docker Compose | v2 | Included with Docker Desktop | `docker compose version` |
| Git | any | [git-scm.com](https://git-scm.com) | `git -v` |

You also need a **Discord Application** with a bot user. See [Step 1](#step-1-create-a-discord-application) if you don't have one.

---

## Step 1: Create a Discord Application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click **New Application**, name it (e.g., "Photobot Dev"), and create it.
3. Note your **Application ID** — this is your `DISCORD_CLIENT_ID`.

### Create a Bot User

1. Go to **Bot** in the sidebar.
2. Click **Reset Token** and copy it — this is your `DISCORD_TOKEN`. Save it now; you cannot see it again.
3. Under **Privileged Gateway Intents**, keep the defaults (the bot only needs the `Guilds` intent).

### Configure OAuth2

1. Go to **OAuth2 > General** in the sidebar.
2. Add a redirect URL: `http://localhost:3100/api/auth/callback/discord`
3. Copy the **Client Secret** — this is your `DISCORD_CLIENT_SECRET`.

### Invite the Bot to a Test Server

1. Go to **OAuth2 > URL Generator**.
2. Select scopes: `bot`, `applications.commands`.
3. Select bot permissions: `Send Messages`, `Create Public Threads`, `Add Reactions`, `Attach Files`, `Use Slash Commands`, `Read Message History`.
4. Open the generated URL and add the bot to your test server.

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

Open `.env` and fill in your Discord credentials:

```bash
# Required — from Step 1
DISCORD_TOKEN=your-bot-token
DISCORD_CLIENT_ID=your-application-id
DISCORD_CLIENT_SECRET=your-client-secret

# Database — these defaults work with the local Docker Postgres
DATABASE_URL=postgresql://postgres:postgres@localhost:54422/postgres

# NextAuth — generate a random secret
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3100

# Supabase — these defaults work with the local Docker services
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54421
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder-for-local-dev
SUPABASE_SERVICE_ROLE_KEY=placeholder-for-local-dev

# AI — choose one:
AI_PROVIDER=ollama                      # Free, runs in Docker (~4.7 GB download)
OLLAMA_HOST=http://localhost:11434

# OR for production-quality AI results:
# AI_PROVIDER=gemini
# GEMINI_API_KEY=your-gemini-api-key    # Get one at https://aistudio.google.com/apikey
```

> **Tip:** For local development, you can leave the Supabase keys as placeholders.
> The dashboard auth will fail gracefully — you can still develop non-auth features.

---

## Step 4: Start Docker Services

```bash
docker compose up -d
```

This starts four services:

| Service | Container | Port | Purpose |
|---------|-----------|------|---------|
| Postgres | photobot-db | 54422 | Database |
| GoTrue | photobot-auth | 9998 | Supabase Auth |
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

This downloads the `llava` vision model (~4.7 GB). Only needed once — data persists in a Docker volume.

---

## Step 6: Set Up the Database

Generate the Prisma client and push the schema:

```bash
pnpm -C packages/db exec prisma generate
pnpm -C packages/db exec prisma db push
```

Optionally seed with sample data:

```bash
pnpm db seed
```

This creates feature configs (critique, palette, settings, discuss) for a test server.

---

## Step 7: Build Shared Packages

The bot and dashboard depend on shared packages:

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

The bot registers its slash commands on startup: `/critique`, `/palette`, `/settings`, and `/discuss`.

---

## Step 9: Verify Everything Works

### Bot

1. Open your test Discord server.
2. Type `/` — you should see `critique`, `palette`, `settings`, and `discuss` in autocomplete.
3. Try `/discuss prompt` — the bot should post a discussion prompt with a thread and reactions.
4. Try `/critique` with an image attachment for AI-powered feedback.

### Dashboard

1. Open http://localhost:3100.
2. Click **Login with Discord**.
3. After OAuth, you should see your servers listed.
4. Click a server, then go to **Settings** to manage feature toggles.

### Health Check

```bash
pnpm status
```

This checks all prerequisites, Docker services, environment variables, database state, and AI model availability.

---

## Daily Development Workflow

After initial setup, you only need:

```bash
pnpm dev:local    # Starts Docker + DB + builds + apps (full stack)
# OR
pnpm dev          # Apps only (if Docker is already running)
```

Other useful commands:

```bash
pnpm test         # Run all unit tests
pnpm build        # Build all packages and apps
pnpm status       # Health check everything
pnpm db studio    # Open Prisma Studio (visual DB editor)
pnpm db push      # Push schema changes to database
pnpm db seed      # Insert sample data
pnpm db reset     # Drop all data and re-push schema
pnpm dev:down     # Stop Docker services
pnpm cleanup      # Stop Docker + remove build artifacts
pnpm cleanup --full  # Nuclear: also removes node_modules + Docker volumes
```

---

## Stopping the Environment

```bash
# Stop the Node.js apps: Ctrl+C in the terminal running pnpm dev

# Stop Docker services (preserves data)
pnpm dev:down

# Stop and remove all data (fresh start)
pnpm cleanup --full
```

---

## Troubleshooting

### Bot commands don't appear in Discord

Discord caches global slash commands for up to an hour. Wait, or restart the bot — it re-registers commands on every startup.

### "supabaseUrl is required"

The dashboard's NextAuth adapter needs Supabase env vars. Make sure `NEXT_PUBLIC_SUPABASE_URL` is set in `.env`. For local dev, placeholder values work.

### Ollama is slow on first request

The model loads into memory on the first request (~10-30 seconds). Subsequent requests are fast. If you have < 8 GB RAM, use the Gemini API instead (`AI_PROVIDER=gemini`).

### Prisma "Can't reach database server"

Ensure Docker is running and Postgres is healthy:

```bash
docker compose ps
docker inspect -f '{{.State.Health.Status}}' photobot-db
```

### Port conflicts

Photobot uses non-standard ports to avoid conflicts:

| Port | Service | Check |
|------|---------|-------|
| 54422 | Postgres | `lsof -i :54422` |
| 54421 | PostgREST | `lsof -i :54421` |
| 9998 | GoTrue Auth | `lsof -i :9998` |
| 11434 | Ollama | `lsof -i :11434` |
| 3100 | Dashboard | `lsof -i :3100` |

### Discussion scheduler not firing

The scheduler loads schedules from the database on bot startup and syncs every 5 minutes. If you create a schedule via the dashboard while the bot is running, it will be picked up within 5 minutes. Restart the bot for immediate effect.

### Tests failing

```bash
pnpm test           # Unit tests (no database needed)
pnpm test:integration  # Integration tests (requires running Docker)
```

Unit tests mock the database. Integration tests need `DATABASE_URL` pointing to a running Postgres.
