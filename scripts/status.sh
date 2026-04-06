#!/bin/bash

# ============================================
# Photobot — Environment Status
# ============================================
# Shows the health of all services, ports,
# database, and Ollama model availability.
#
# Usage:  pnpm status
#         ./scripts/status.sh
# ============================================

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

pass() { echo -e "  ${GREEN}OK${NC}  $1"; }
warn() { echo -e "  ${YELLOW}--${NC}  $1"; }
err()  { echo -e "  ${RED}!!${NC}  $1"; }

echo ""
echo -e "${BOLD}Photobot Environment Status${NC}"
echo -e "${DIM}$(date)${NC}"
echo ""

# -----------------------------------------------
# Prerequisites
# -----------------------------------------------
echo -e "${BOLD}Prerequisites${NC}"

if command -v node >/dev/null 2>&1; then
  pass "Node.js $(node -v)"
else
  err  "Node.js not installed"
fi

if command -v pnpm >/dev/null 2>&1; then
  pass "pnpm $(pnpm -v)"
else
  err  "pnpm not installed"
fi

if command -v docker >/dev/null 2>&1; then
  if docker info >/dev/null 2>&1; then
    pass "Docker running"
  else
    err  "Docker installed but not running"
  fi
else
  err  "Docker not installed"
fi

echo ""

# -----------------------------------------------
# .env file
# -----------------------------------------------
echo -e "${BOLD}Configuration${NC}"

if [ -f ".env" ]; then
  pass ".env file exists"

  # Check critical vars (without exposing values)
  check_var() {
    local val
    val=$(grep "^$1=" .env 2>/dev/null | cut -d= -f2-)
    if [ -n "$val" ] && [ "$val" != "your-discord-bot-token" ] && [ "$val" != "your-discord-client-id" ] && [ "$val" != "your-discord-client-secret" ] && [ "$val" != "your-gemini-api-key" ] && [ "$val" != "generate-a-random-secret-here" ]; then
      pass "$1 is set"
    else
      warn "$1 is not configured"
    fi
  }

  check_var "DISCORD_TOKEN"
  check_var "DISCORD_CLIENT_ID"
  check_var "DISCORD_CLIENT_SECRET"
  check_var "NEXTAUTH_SECRET"
  check_var "DATABASE_URL"
else
  err  ".env file missing — run: pnpm init:local"
fi

echo ""

# -----------------------------------------------
# Docker services
# -----------------------------------------------
echo -e "${BOLD}Docker Services${NC}"

check_container() {
  local name=$1
  local port=$2
  local label=$3

  if docker ps --format '{{.Names}}' 2>/dev/null | grep -q "^${name}$"; then
    local health
    health=$(docker inspect -f '{{.State.Health.Status}}' "$name" 2>/dev/null || echo "running")
    if [ "$health" = "healthy" ] || [ "$health" = "running" ]; then
      pass "$label ${DIM}(${name} on port ${port})${NC}"
    else
      warn "$label ${DIM}(status: ${health})${NC}"
    fi
  else
    err  "$label ${DIM}(container not running)${NC}"
  fi
}

check_container "photobot-db"              "54422" "Postgres"
check_container "photobot-auth"            "9998"  "GoTrue Auth"
check_container "photobot-rest"            "54421" "PostgREST"

echo ""

# -----------------------------------------------
# Database
# -----------------------------------------------
echo -e "${BOLD}Database${NC}"

if docker ps --format '{{.Names}}' 2>/dev/null | grep -q photobot-db; then
  TABLE_COUNT=$(docker exec photobot-db psql -U postgres -d postgres -tAc "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public'" 2>/dev/null || echo "?")
  if [ "$TABLE_COUNT" != "?" ] && [ "$TABLE_COUNT" -gt 0 ] 2>/dev/null; then
    pass "Schema applied ${DIM}(${TABLE_COUNT} tables)${NC}"
  else
    warn "Schema not applied — run: pnpm db:push"
  fi
else
  warn "Database not running"
fi

echo ""

# -----------------------------------------------
# Build artifacts
# -----------------------------------------------
echo -e "${BOLD}Build State${NC}"

if [ -d "node_modules" ]; then
  pass "Dependencies installed"
else
  err  "Dependencies missing — run: pnpm install"
fi

if [ -f "packages/db/dist/index.js" ]; then
  pass "packages/db built"
else
  warn "packages/db not built — run: pnpm -C packages/db build"
fi

if [ -d "packages/db/node_modules/.prisma" ]; then
  pass "Prisma client generated"
else
  warn "Prisma client missing — run: pnpm -C packages/db exec prisma generate"
fi

echo ""

# -----------------------------------------------
# Port availability
# -----------------------------------------------
echo -e "${BOLD}Port Availability${NC}"

check_port() {
  local port=$1
  local label=$2
  if lsof -i ":${port}" >/dev/null 2>&1; then
    local proc
    proc=$(lsof -i ":${port}" -t 2>/dev/null | head -1 | xargs ps -p 2>/dev/null | tail -1 | awk '{print $4}' 2>/dev/null || echo "unknown")
    pass "Port ${port} in use ${DIM}(${label} — ${proc})${NC}"
  else
    warn "Port ${port} not in use ${DIM}(${label})${NC}"
  fi
}

check_port 3100  "Dashboard"
check_port 54422 "Postgres"
check_port 54421 "PostgREST"
check_port 9998  "GoTrue"
check_port 11434 "Ollama"

echo ""
