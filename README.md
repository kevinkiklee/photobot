<div align="center">

# Photobot

**Photography Lounge Discord bot**

Curated discussion prompts, community voting, and feature management
through an admin dashboard — exclusively serving Photography Lounge.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tests](https://github.com/kevinkiklee/photobot/actions/workflows/ci.yml/badge.svg)](https://github.com/kevinkiklee/photobot/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Discord.js](https://img.shields.io/badge/discord.js-14-5865F2?logo=discord&logoColor=white)](https://discord.js.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)

</div>

---

## Features

- **Daily Discussion Cycle** -- 400 curated prompts across Creative Process and Inspiration, posted at 08:00 UTC daily as a lounge thread and cross-posted to a discussions channel; lounge replies are mirrored into the thread
- **Admin Dashboard** -- Web-based feature management with Discord OAuth, audit logging, and configuration history
- **Hierarchical Permissions** -- Channel > Role > Server specificity with "Allow Wins" conflict resolution
- **Prompt Voting Site** -- Community tool for members to upvote/downvote discussion prompts, submit new prompts, flag duplicates, with admin oversight and mobile-responsive design
- **Single-Server Guard** -- Auto-leaves any server that isn't Photography Lounge

## Commands

```
/discuss schedule <discussions> <lounge> [category]   Configure the daily discussion cycle
/discuss post-daily                                   Manually fire the daily cycle now
/discuss post-here [category]                         Post a one-off prompt in the current channel
/discuss config                                       Show the current cycle configuration
/discuss enable                                       Enable the daily discussion cycle
/discuss disable                                      Disable the daily discussion cycle
```

Restricted to Owner, Admin, and Mod roles (configurable via `DEV_STAFF_ROLE_IDS`).

## Quick Start

```bash
git clone https://github.com/kevinkiklee/photobot.git
cd photobot
pnpm install
cp .env.example .env   # Edit with your Discord credentials
pnpm dev:local         # Starts Docker, runs migrations, launches everything
```

Dashboard at `http://localhost:3100`. Voting site at `http://localhost:3200`. Bot connects to Discord automatically.

**Production URLs:**
- Voting: [discussion-prompts.pl.iser.io](https://discussion-prompts.pl.iser.io)
- Dashboard: [bot-dashboard.pl.iser.io](https://bot-dashboard.pl.iser.io)

> **Prerequisites:** Node.js 20+, pnpm 8+, Docker, and a [Discord Application](https://discord.com/developers/applications) with bot token.

For step-by-step setup including Discord app creation and OAuth2 configuration, see [docs/LOCAL_SETUP.md](docs/LOCAL_SETUP.md).

## Project Structure

```
photobot/
├── apps/
│   ├── bot/                 Discord.js bot (commands, permissions, auto-leave guard)
│   ├── dashboard/           Next.js 16 admin panel (NextAuth, feature toggles, audit logs)
│   └── voting/              Next.js 16 community prompt voting site
├── packages/
│   ├── db/                  Prisma schema and client
│   └── tailwind-config/     Shared Tailwind preset for dashboard + voting
├── scripts/                 Setup, dev, status, db, and cleanup scripts
└── docker-compose.yml       Local Postgres and Supabase Auth
```

## Development

| Command | Description |
|---------|-------------|
| `pnpm dev:local` | One-command local dev (Docker + migrations + builds + apps) |
| `pnpm dev` | Start apps only (assumes Docker and packages are ready) |
| `pnpm build` | Build all packages and apps |
| `pnpm test` | Run all unit tests |
| `pnpm test:integration` | Run integration tests (requires running database) |
| `pnpm test:all` | Run unit and integration tests |
| `pnpm check` | Format and lint with Biome |
| `pnpm status` | Health check for all services |
| `pnpm db <cmd>` | Database ops: `push`, `reset`, `studio`, `seed`, `migrate` |
| `pnpm dev:down` | Stop Docker services |
| `pnpm cleanup` | Stop containers and remove build artifacts |
| `pnpm seed:prompts` | Seed discussion prompts into DB (requires `DATABASE_URL`) |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Bot | discord.js 14, dotenv |
| Dashboard | Next.js 16 (App Router), NextAuth 4, Tailwind CSS |
| Voting | Next.js 16 (App Router), NextAuth 4, Tailwind CSS |
| Database | Prisma 7 on Supabase Postgres |
| Testing | Vitest |
| Tooling | Biome (format + lint), pnpm workspaces |
| Infrastructure | Docker Compose (local), Railway (bot), Vercel (dashboard + voting) |

## Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Bot | [Railway](https://railway.app/) (persistent process) | — |
| Dashboard | [Vercel](https://vercel.com/) (serverless) | `bot-dashboard.pl.iser.io` |
| Voting Site | [Vercel](https://vercel.com/) (serverless) | `discussion-prompts.pl.iser.io` |
| Database | [Supabase](https://supabase.com/) (managed Postgres) | — |

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

## Contributing

Contributions are welcome. Please read the [Contributing Guide](CONTRIBUTING.md) before submitting a pull request.

## Security

To report a vulnerability, see our [Security Policy](SECURITY.md).

## License

[MIT](LICENSE)
