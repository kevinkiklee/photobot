#!/bin/bash

# ============================================
# Photobot — Cleanup
# ============================================
# Tear down Docker services, remove build
# artifacts, and optionally nuke everything.
#
# Usage:
#   pnpm cleanup           Stop containers, remove build artifacts
#   pnpm cleanup --full    Also remove node_modules and Docker volumes
# ============================================

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

log()  { echo -e "${CYAN}[cleanup]${NC} $1"; }
ok()   { echo -e "${GREEN}[cleanup]${NC} $1"; }
warn() { echo -e "${YELLOW}[cleanup]${NC} $1"; }

FULL=false
if [ "$1" = "--full" ] || [ "$1" = "-f" ]; then
  FULL=true
fi

# -----------------------------------------------
# 1. Stop Docker services
# -----------------------------------------------
if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  log "Stopping Docker services..."
  if [ "$FULL" = true ]; then
    docker compose down -v 2>/dev/null || true
    ok "Containers stopped, volumes removed"
  else
    docker compose down 2>/dev/null || true
    ok "Containers stopped (volumes preserved)"
  fi
else
  warn "Docker not available — skipping container cleanup"
fi

# -----------------------------------------------
# 2. Remove build artifacts
# -----------------------------------------------
log "Removing build artifacts..."

rm -rf packages/db/dist
rm -rf packages/ai/dist
rm -rf apps/bot/dist
rm -rf apps/dashboard/.next

# Prisma generated client
rm -rf packages/db/node_modules/.prisma

# TypeScript build info
find . -name "tsconfig.tsbuildinfo" -not -path "*/node_modules/*" -delete 2>/dev/null

ok "Build artifacts removed"

# -----------------------------------------------
# 3. Full cleanup (optional)
# -----------------------------------------------
if [ "$FULL" = true ]; then
  warn "Removing all node_modules..."
  rm -rf node_modules
  rm -rf apps/bot/node_modules
  rm -rf apps/dashboard/node_modules
  rm -rf packages/db/node_modules
  rm -rf packages/ai/node_modules
  ok "node_modules removed"

  warn "Removing pnpm store cache for this project..."
  rm -rf .pnpm-store 2>/dev/null || true
fi

# -----------------------------------------------
# Summary
# -----------------------------------------------
echo ""
ok "Cleanup complete"
if [ "$FULL" = true ]; then
  echo ""
  echo "  To restore: pnpm init:local"
else
  echo ""
  echo "  Data preserved in Docker volumes."
  echo "  To start fresh: pnpm cleanup --full"
  echo "  To restart:     pnpm dev:local"
fi
echo ""
