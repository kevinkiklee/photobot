# Photobot

AI-powered photography community bot for Discord. Provides automated image critique, color palette extraction, and server-level feature management through an admin dashboard.

## Features

- **/critique** — Get detailed technical feedback on uploaded photographs (composition, lighting, focus)
- **/palette** — Extract a 5-color hex palette from an image with a visual swatch
- **/settings** — Server admins can toggle features directly from Discord
- **Admin Dashboard** — Web-based feature management with audit logging
- **Bouncer Security** — Two-layer AI moderation, EXIF metadata stripping, shadow rate limiting
- **Hierarchical Permissions** — Channel > Role > Server specificity with "Allow Wins" conflict resolution

## Project Structure

```
photography-bot/
├── apps/
│   ├── bot/              # Discord.js bot
│   └── dashboard/        # Next.js 14 admin panel
├── packages/
│   ├── ai/               # Provider-agnostic AI wrapper (Gemini / Ollama)
│   └── db/               # Prisma schema and client
├── scripts/
│   ├── dev.sh            # One-command local dev environment
│   └── verify-dev-env.sh # Environment verification
└── docker-compose.yml    # Local Postgres + Ollama
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
git clone <repo-url>
cd photography-bot
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
pnpm test          # Run all tests across workspaces
```

Tests use Vitest with a workspace configuration. Each app/package has its own test setup.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Bot | discord.js 14, Sharp |
| Dashboard | Next.js 14 (App Router), NextAuth, Tailwind CSS |
| Database | Prisma on Supabase Postgres |
| AI | Google Gemini (prod), Ollama (local dev) |
| Testing | Vitest, Testing Library |
| Infrastructure | Docker Compose (local), Railway (bot), Vercel (dashboard) |

## Deployment

- **Bot** — Deploy to Railway (persistent process)
- **Dashboard** — Deploy to Vercel (serverless)
- **Database** — Supabase (managed Postgres)

## License

MIT
