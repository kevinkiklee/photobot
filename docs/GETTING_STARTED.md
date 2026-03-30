# Getting Started with Photobot

Get the Photobot development environment running in under 5 minutes.

## The Fast Way (Recommended)

One interactive script handles everything — Discord credentials, environment config, Docker services, database setup, and AI model download:

```bash
git clone <repo-url>
cd photography-bot
pnpm install
pnpm init:local
```

The setup wizard will:

1. Check prerequisites (Node.js 20+, pnpm, Docker, Git)
2. Ask for your Discord bot credentials
3. Ask which AI provider to use (Ollama for free local dev, or Gemini)
4. Generate a `.env` file with a random `NEXTAUTH_SECRET`
5. Start Docker services (Postgres, Supabase Auth, PostgREST, Ollama)
6. Wait for the database to be healthy
7. Push the Prisma schema
8. Pull the Ollama AI model (if selected, ~4.7 GB first time)
9. Build shared packages

When it finishes, it tells you the next steps — adding the OAuth redirect URL and inviting the bot to a test server.

### After Setup

```bash
pnpm dev:local     # Start everything (Docker + DB + apps)
```

Dashboard opens at http://localhost:3100. The bot connects to Discord automatically.

---

## Before You Start: Discord Application

You need a Discord Application with a bot user. If you don't have one:

1. Go to [discord.com/developers/applications](https://discord.com/developers/applications)
2. Create a new application
3. Go to **Bot** > **Reset Token** — copy the token (you won't see it again)
4. Go to **OAuth2 > General** — add redirect: `http://localhost:3100/api/auth/callback/discord`
5. Copy the **Client Secret**
6. Go to **OAuth2 > URL Generator** — select scopes `bot` + `applications.commands`, then permissions: Send Messages, Create Public Threads, Add Reactions, Attach Files, Use Slash Commands, Read Message History
7. Open the generated URL to invite the bot to your test server

You'll need three values for setup:
- **Bot Token** (`DISCORD_TOKEN`)
- **Application ID** (`DISCORD_CLIENT_ID`) — shown at the top of the application page
- **Client Secret** (`DISCORD_CLIENT_SECRET`)

---

## What Gets Started

`pnpm dev:local` brings up the full stack:

| Component | What | Where |
|-----------|------|-------|
| **Postgres** | Database | Docker, port 54422 |
| **GoTrue** | Supabase Auth | Docker, port 9998 |
| **PostgREST** | REST API | Docker, port 54421 |
| **Ollama** | Local AI model | Docker, port 11434 |
| **Dashboard** | Next.js admin panel | http://localhost:3100 |
| **Bot** | Discord bot | Connects via websocket |

---

## Available Commands

### Development

| Command | What it does |
|---------|-------------|
| `pnpm dev:local` | Full stack startup (Docker + migrations + builds + apps) |
| `pnpm dev` | Start apps only (Docker must be running already) |
| `pnpm dev:down` | Stop Docker services |
| `pnpm status` | Health check all services, env vars, and build state |

### Database

| Command | What it does |
|---------|-------------|
| `pnpm db push` | Push Prisma schema to database |
| `pnpm db reset` | Drop all data and re-push schema |
| `pnpm db studio` | Open Prisma Studio (visual DB editor at localhost:5555) |
| `pnpm db seed` | Insert sample data for development |
| `pnpm db migrate <name>` | Create a named Prisma migration |

### Build & Test

| Command | What it does |
|---------|-------------|
| `pnpm build` | Build all packages and apps |
| `pnpm test` | Run all unit tests (no database needed) |
| `pnpm test:integration` | Run integration tests (needs running Docker) |
| `pnpm test:all` | Run both unit and integration tests |

### Cleanup

| Command | What it does |
|---------|-------------|
| `pnpm cleanup` | Stop Docker + remove build artifacts |
| `pnpm cleanup --full` | Also removes node_modules + Docker volumes |

---

## Bot Commands

Once running, these slash commands are available in Discord:

| Command | Description |
|---------|-------------|
| `/critique <image>` | AI-powered technical feedback on a photograph |
| `/palette <image>` | Extract a 5-color hex palette from an image |
| `/discuss prompt [category]` | Post a photography discussion prompt with thread + reactions |
| `/discuss schedule <channel> <days> <time>` | Set up automatic daily/weekly discussion prompts (admin) |
| `/discuss list` | Show configured discussion schedules (admin) |
| `/settings list` | Show feature toggles for the server (admin) |
| `/settings toggle <feature> <enabled>` | Enable/disable a feature (admin) |

### Discussion Prompt Categories

The `/discuss` command supports five categories:

- **Technique** — composition, exposure, lighting, post-processing
- **Gear** — lenses, cameras, accessories, workflow tools
- **Creative** — inspiration, artistic voice, creative blocks
- **Challenge** — photo assignments and creative constraints
- **Inspiration** — other art forms, artists, cross-discipline ideas

270 curated prompts are included. Enable AI generation via `/discuss schedule` with the `use_ai` flag for unlimited variety.

---

## Architecture Overview

```
photography-bot/
├── apps/
│   ├── bot/              Discord.js bot (commands, bouncer, scheduler)
│   └── dashboard/        Next.js admin panel (NextAuth + Discord OAuth)
├── packages/
│   ├── db/               Prisma client + schema
│   └── ai/               Provider-agnostic AI wrapper (Gemini / Ollama)
├── scripts/
│   ├── setup.sh          Interactive first-time setup (pnpm init:local)
│   ├── dev.sh            One-command dev environment (pnpm dev:local)
│   ├── status.sh         Health check (pnpm status)
│   ├── db.sh             Database operations (pnpm db <cmd>)
│   └── cleanup.sh        Tear down (pnpm cleanup)
├── docker-compose.yml    Local Postgres, Supabase, Ollama
├── .env.example          Template for environment variables
└── CLAUDE.md             AI assistant instructions
```

---

## Need More Detail?

- **[Local Setup Guide](./LOCAL_SETUP.md)** — step-by-step manual setup with explanations
- **[Design Document](./design.md)** — system architecture and feature roadmap
- **[Discussion Prompt Spec](./superpowers/specs/2026-03-29-discussion-prompt-design.md)** — detailed spec for the discussion feature

---

## Troubleshooting

Run `pnpm status` first — it checks everything and tells you what's wrong.

Common issues:

| Problem | Fix |
|---------|-----|
| Bot commands missing in Discord | Wait ~1 hour (global command cache) or restart bot |
| "Can't reach database server" | `docker compose up -d` then `pnpm db push` |
| Ollama slow on first request | Normal — model loads into RAM (~10-30s). Fast after that |
| Port already in use | `lsof -i :<port>` to find the conflict |
| Dashboard auth fails | Check `DISCORD_CLIENT_SECRET` and OAuth redirect URL |
| Scheduler not picking up changes | Syncs every 5 min; restart bot for immediate effect |

For a complete troubleshooting guide, see [Local Setup Guide > Troubleshooting](./LOCAL_SETUP.md#troubleshooting).
