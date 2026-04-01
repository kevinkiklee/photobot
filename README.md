# Photobot

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tests](https://github.com/kevinkiklee/photobot/actions/workflows/ci.yml/badge.svg)](https://github.com/kevinkiklee/photobot/actions/workflows/ci.yml)

AI-powered photography community bot for Discord. Provides automated image critique, color palette extraction, discussion prompts, and server-level feature management through an admin dashboard.

## Commands

| Command | Description | Access |
|---------|-------------|--------|
| `/critique <image>` | Technical feedback on a photograph (composition, lighting, focus) | AI grant |
| `/palette <image>` | Extract a 5-color hex palette with a visual swatch | AI grant |
| `/discuss prompt [category]` | Post a discussion prompt (Creative Process, Inspiration) | Admin |
| `/discuss schedule` | Set up automatic discussion prompts in a channel | Admin |
| `/discuss list` | List all discussion schedules for the server | Admin |
| `/settings list` | List all feature toggles | Admin |
| `/settings toggle <feature> <enabled>` | Enable/disable a feature | Admin |
| `/ai grant-role <role>` | Grant AI access to a role (e.g., Moderator, Specialist) | Admin |
| `/ai revoke-role <role>` | Revoke AI access from a role | Admin |
| `/ai grant-user <user>` | Grant AI access to an individual user | Admin |
| `/ai revoke-user <user>` | Revoke AI access from a user | Admin |
| `/ai list` | List all AI access grants for the server | Admin |

AI commands are hidden by default. Configure per-role visibility in **Server Settings > Integrations > Photobot**.

## Features

- **AI Image Critique** — Detailed technical feedback on photographs using Gemini (prod) or Ollama (local)
- **Color Palette Extraction** — 5-color hex palette with branded visual swatch
- **Discussion Prompts** — 241 curated prompts across Creative Process and Inspiration categories, posted every 6 hours with conversation-aware timing
- **AI Access Control** — Allowlist model for AI commands: grant access to specific roles or individual users
- **Admin Dashboard** — Web-based feature management with Discord OAuth, audit logging, and schedule management
- **Bouncer Security** — Two-layer AI moderation, EXIF metadata stripping, shadow rate limiting
- **Hierarchical Permissions** — Channel > Role > Server specificity with "Allow Wins" conflict resolution

## Project Structure

```
photobot/
├── apps/
│   ├── bot/              # Discord.js bot
│   └── dashboard/        # Next.js 14 admin panel
├── packages/
│   ├── ai/               # Provider-agnostic AI wrapper (Gemini / Ollama)
│   └── db/               # Prisma schema and client
├── scripts/
│   ├── setup.sh          # Interactive first-time setup (pnpm init:local)
│   ├── dev.sh            # One-command local dev environment
│   ├── status.sh         # Health check (pnpm status)
│   ├── db.sh             # Database operations (pnpm db <cmd>)
│   ├── cleanup.sh        # Tear down (pnpm cleanup)
│   └── verify-dev-env.sh # Environment verification
└── docker-compose.yml    # Local Postgres, Supabase, Ollama
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 8+
- [Docker](https://www.docker.com/) (for local development)
- A [Discord Application](https://discord.com/developers/applications) with bot token

### Quick Start

```bash
# Clone and install
git clone https://github.com/kevinkiklee/photobot.git
cd photobot
pnpm install

# Configure environment
cp .env.example .env
# Edit .env with your Discord credentials and API keys

# One command — starts Docker, runs migrations, builds packages, launches apps
pnpm dev:local
```

The dashboard will be at http://localhost:3100 and the bot will connect to Discord.

### Manual Setup

For step-by-step instructions including Discord application creation, OAuth2 configuration, and troubleshooting, see **[docs/LOCAL_SETUP.md](docs/LOCAL_SETUP.md)**.

## Testing

```bash
pnpm test              # Run all unit tests across workspaces
pnpm test:integration  # Run integration tests (requires Docker)
pnpm test:all          # Run both unit and integration tests
```

Tests use Vitest with a workspace configuration. Each app/package has its own test setup.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Bot | discord.js 14, Sharp, node-cron |
| Dashboard | Next.js 14 (App Router), NextAuth, Tailwind CSS |
| Database | Prisma on Supabase Postgres |
| AI | Google Gemini (prod), Ollama (local dev) |
| Testing | Vitest, Testing Library |
| Infrastructure | Docker Compose (local), Railway (bot), Vercel (dashboard) |

## Deployment

- **Bot** — Deploy to Railway (persistent process)
- **Dashboard** — Deploy to Vercel (serverless)
- **Database** — Supabase (managed Postgres)

See **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** for detailed deployment instructions.

## Contributing

Contributions are welcome! Please read the [Contributing Guide](CONTRIBUTING.md) before submitting a pull request.

## Security

To report a vulnerability, please see our [Security Policy](SECURITY.md).

## License

[MIT](LICENSE)
