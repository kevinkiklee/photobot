#!/bin/bash
set -e

# ============================================
# Photobot — One-Command Dev Environment
# ============================================
# Starts Docker services, runs migrations,
# builds shared packages, and launches all apps.
#
# Usage:  pnpm dev:local
#         ./scripts/dev.sh
# ============================================

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

# Load .env if it exists (don't override already-set vars)
if [ -f "$ROOT_DIR/.env" ]; then
  set -a
  source "$ROOT_DIR/.env"
  set +a
fi
export DATABASE_URL="${DATABASE_URL:-postgresql://postgres:postgres@localhost:54422/postgres}"

# --- Colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${CYAN}[photobot]${NC} $1"; }
ok()   { echo -e "${GREEN}[photobot]${NC} $1"; }
warn() { echo -e "${YELLOW}[photobot]${NC} $1"; }
fail() { echo -e "${RED}[photobot]${NC} $1"; exit 1; }

# -----------------------------------------------
# 1. Preflight checks
# -----------------------------------------------
log "Checking prerequisites..."

command -v docker >/dev/null 2>&1 || fail "Docker is not installed. See https://docs.docker.com/get-docker/"
command -v pnpm   >/dev/null 2>&1 || fail "pnpm is not installed. Run: npm i -g pnpm"
docker info >/dev/null 2>&1       || fail "Docker daemon is not running. Please start Docker."

if [ ! -f ".env" ]; then
  if [ -f ".env.example" ]; then
    warn ".env not found — copying from .env.example"
    cp .env.example .env
    warn "Edit .env with your credentials before using Discord features."
  else
    fail ".env file not found and no .env.example to copy from."
  fi
fi

ok "Prerequisites OK"

# -----------------------------------------------
# 2. Install dependencies (skip if node_modules exists)
# -----------------------------------------------
if [ ! -d "node_modules" ]; then
  log "Installing dependencies..."
  pnpm install
  ok "Dependencies installed"
else
  log "Dependencies already installed (run 'pnpm install' to update)"
fi

# -----------------------------------------------
# 3. Start Docker services
# -----------------------------------------------
# shellcheck source=lib/docker-compose.sh
source "$ROOT_DIR/scripts/lib/docker-compose.sh"

log "Starting Docker services..."
dc down --remove-orphans 2>/dev/null
# Remove stale containers that may linger from a previous run
docker rm -f photobot-db photobot-auth photobot-rest photobot-ollama 2>/dev/null || true
dc up -d

# Wait for Postgres to be healthy
log "Waiting for database..."
MAX_RETRIES=30
RETRY_COUNT=0
until [ "$(docker inspect -f '{{.State.Health.Status}}' photobot-db 2>/dev/null)" = "healthy" ]; do
  if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
    fail "Database did not become healthy within 60 seconds."
  fi
  printf "."
  sleep 2
  RETRY_COUNT=$((RETRY_COUNT + 1))
done
echo ""
ok "Database is healthy"

# -----------------------------------------------
# 4. Pull Ollama model (if using Ollama)
# -----------------------------------------------
if docker ps --format '{{.Names}}' | grep -q photobot-ollama; then
  if ! docker exec photobot-ollama ollama list 2>/dev/null | grep -q llava; then
    log "Pulling Ollama llava model (first time only, ~4.7 GB)..."
    docker exec photobot-ollama ollama pull llava
    ok "Ollama model ready"
  else
    ok "Ollama llava model already available"
  fi
fi

# -----------------------------------------------
# 5. Database setup
# -----------------------------------------------
# Small delay to ensure Postgres is accepting connections after health check
sleep 2

log "Generating Prisma client..."
pnpm -C packages/db exec prisma generate --no-hints

log "Pushing schema to database..."
pnpm -C packages/db exec prisma db push
ok "Database schema is up to date"

# -----------------------------------------------
# 6. Build shared packages
# -----------------------------------------------
log "Building shared packages..."
pnpm -C packages/db build 2>/dev/null
ok "Shared packages built"

# -----------------------------------------------
# 7. Launch apps
# -----------------------------------------------
echo ""
ok "All systems ready!"
echo ""
log "Starting apps..."
log "  Dashboard:  http://localhost:3100"
log "  Bot:        Connecting to Discord..."
log "  Commands:   /discuss"
log "  Status:     pnpm status"
echo ""

pnpm dev
