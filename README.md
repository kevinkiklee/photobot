<div align="center">

# Photobot

**AI-powered photography community bot for Discord**

Automated image critique, color palette extraction, discussion prompts,
and server-level feature management through an admin dashboard.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tests](https://github.com/kevinkiklee/photobot/actions/workflows/ci.yml/badge.svg)](https://github.com/kevinkiklee/photobot/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Discord.js](https://img.shields.io/badge/discord.js-14-5865F2?logo=discord&logoColor=white)](https://discord.js.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)

</div>

---

## Features

- **AI Image Critique** -- Technical feedback on photographs (composition, lighting, focus) powered by Gemini or Ollama
- **Color Palette Extraction** -- 5-color hex palette with a branded visual swatch image
- **Discussion Prompts** -- 400 curated prompts across Creative Process and Inspiration, posted on a schedule with conversation-aware timing
- **AI Access Control** -- Allowlist model: grant AI commands to specific roles or individual users
- **Admin Dashboard** -- Web-based feature management with Discord OAuth, audit logging, and schedule management
- **Bouncer Security** -- Two-layer AI moderation, EXIF metadata stripping, shadow rate limiting
- **Hierarchical Permissions** -- Channel > Role > Server specificity with "Allow Wins" conflict resolution
- **Prompt Voting Site** -- Community tool for members to upvote/downvote discussion prompts, with admin oversight

## Commands

```
/critique <image>                  Technical feedback on a photograph
/palette <image>                   Extract a 5-color hex palette with swatch

/discuss prompt [category]         Post a discussion prompt
/discuss schedule                  Set up automatic discussion prompts
/discuss list                      List all discussion schedules

/settings list                     List all feature toggles
/settings toggle <feature> <on>    Enable/disable a feature

/ai grant-role <role>              Grant AI access to a role
/ai revoke-role <role>             Revoke AI access from a role
/ai grant-user <user>              Grant AI access to a user
/ai revoke-user <user>             Revoke AI access from a user
/ai list                           List all AI access grants
```

`/critique` and `/palette` require an AI access grant. All other commands require Administrator permission. AI commands are hidden by default -- configure visibility in **Server Settings > Integrations > Photobot**.

## Quick Start

```bash
git clone https://github.com/kevinkiklee/photobot.git
cd photobot
pnpm install
cp .env.example .env   # Edit with your Discord credentials
pnpm dev:local         # Starts Docker, runs migrations, launches everything
```

Dashboard at `http://localhost:3100`. Voting site at `http://localhost:3200`. Bot connects to Discord automatically.

> **Prerequisites:** Node.js 20+, pnpm 8+, Docker, and a [Discord Application](https://discord.com/developers/applications) with bot token.

For step-by-step setup including Discord app creation and OAuth2 configuration, see [docs/LOCAL_SETUP.md](docs/LOCAL_SETUP.md).

## Project Structure

```
photobot/
├── apps/
│   ├── bot/                 Discord.js bot (commands, bouncer, permissions)
│   ├── dashboard/           Next.js 14 admin panel (NextAuth, feature toggles, audit logs)
│   └── voting/              Next.js 14 community prompt voting site
├── packages/
│   ├── ai/                  Provider-agnostic AI wrapper (Gemini / Ollama)
│   └── db/                  Prisma schema and client
├── scripts/                 Setup, dev, status, db, and cleanup scripts
└── docker-compose.yml       Local Postgres, Supabase Auth, Ollama
```

## Development

| Command | Description |
|---------|-------------|
| `pnpm dev:local` | One-command local dev (Docker + migrations + builds + apps) |
| `pnpm dev` | Start apps only (assumes Docker and packages are ready) |
| `pnpm build` | Build all packages and apps |
| `pnpm test` | Run all unit tests |
| `pnpm test:integration` | Run integration tests (requires running database) |
| `pnpm status` | Health check for all services |
| `pnpm db <cmd>` | Database ops: `push`, `reset`, `studio`, `seed`, `migrate` |
| `pnpm dev:down` | Stop Docker services |
| `pnpm cleanup` | Stop containers and remove build artifacts |
| `pnpm seed:prompts` | Seed discussion prompts into DB (requires `DATABASE_URL`) |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Bot | discord.js 14, Sharp, dotenv |
| Dashboard | Next.js 14 (App Router), NextAuth 4, Tailwind CSS |
| Voting | Next.js 14 (App Router), NextAuth 4, Tailwind CSS |
| Database | Prisma 5 on Supabase Postgres |
| AI | Google Gemini (prod), Ollama (local dev) |
| Testing | Vitest |
| Infrastructure | Docker Compose (local), Railway (bot), Vercel (dashboard) |

## Deployment

| Service | Platform |
|---------|----------|
| Bot | [Railway](https://railway.app/) (persistent process) |
| Dashboard | [Vercel](https://vercel.com/) (serverless) |
| Voting Site | [Vercel](https://vercel.com/) (serverless, separate project) |
| Database | [Supabase](https://supabase.com/) (managed Postgres) |

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

## Contributing

Contributions are welcome. Please read the [Contributing Guide](CONTRIBUTING.md) before submitting a pull request.

## Security

To report a vulnerability, see our [Security Policy](SECURITY.md).

## License

[MIT](LICENSE)
