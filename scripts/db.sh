#!/bin/bash
set -e

# ============================================
# Photobot — Database Operations
# ============================================
# Manage the local development database.
#
# Usage:
#   pnpm db push      Push schema to database
#   pnpm db reset     Drop all data and re-push schema
#   pnpm db studio    Open Prisma Studio (GUI)
#   pnpm db seed      Insert sample data for development
#   pnpm db migrate   Create a new migration
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

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

log()  { echo -e "${CYAN}[db]${NC} $1"; }
ok()   { echo -e "${GREEN}[db]${NC} $1"; }
warn() { echo -e "${YELLOW}[db]${NC} $1"; }
fail() { echo -e "${RED}[db]${NC} $1"; exit 1; }

CMD="${1:-help}"

case "$CMD" in
  push)
    log "Generating Prisma client..."
    pnpm -C packages/db exec prisma generate --no-hints
    log "Pushing schema to database..."
    pnpm -C packages/db exec prisma db push
    ok "Schema pushed"
    ;;

  reset)
    warn "This will DROP all data in the local database."
    echo -e -n "${BOLD}Continue? [y/N] ${NC}"
    read -r CONFIRM
    if [ "$CONFIRM" = "y" ] || [ "$CONFIRM" = "Y" ]; then
      log "Resetting database..."
      pnpm -C packages/db exec prisma db push --force-reset
      ok "Database reset and schema re-applied"
    else
      log "Aborted"
    fi
    ;;

  studio)
    log "Opening Prisma Studio on http://localhost:5555..."
    pnpm -C packages/db exec prisma studio
    ;;

  seed)
    log "Inserting sample data..."

    PL_ID="${PL_GUILD_ID:-000000000000000001}"

    docker exec photobot-db psql -U postgres -d postgres -c "
      -- Sample feature configs for Photography Lounge
      INSERT INTO feature_configs (id, target_type, target_id, feature_key, is_enabled, created_at, updated_at)
      VALUES
        (gen_random_uuid(), 'SERVER', '${PL_ID}', 'settings',  true, now(), now()),
        (gen_random_uuid(), 'SERVER', '${PL_ID}', 'discuss',   true, now(), now())
      ON CONFLICT (target_type, target_id, feature_key) DO NOTHING;

      -- Sample audit log entry
      INSERT INTO config_audit_logs (id, user_id, action, target_type, target_id, feature_key, old_value, new_value, created_at)
      VALUES
        (gen_random_uuid(), 'seed-user', 'UPDATE', 'SERVER', '${PL_ID}', 'discuss', '{\"isEnabled\": false}', '{\"isEnabled\": true}', now())
      ON CONFLICT DO NOTHING;
    " 2>/dev/null

    ok "Sample data inserted for Photography Lounge"
    ;;

  migrate)
    MIGRATION_NAME="${2:-auto}"
    log "Creating migration: ${MIGRATION_NAME}..."
    pnpm -C packages/db exec prisma migrate dev --name "$MIGRATION_NAME"
    ok "Migration created"
    ;;

  help|*)
    echo ""
    echo -e "${BOLD}Photobot Database Commands${NC}"
    echo ""
    echo "  pnpm db push       Push schema to database (no migration history)"
    echo "  pnpm db reset      Drop all data and re-push schema"
    echo "  pnpm db studio     Open Prisma Studio (visual DB editor)"
    echo "  pnpm db seed       Insert sample development data"
    echo "  pnpm db migrate    Create a new Prisma migration"
    echo ""
    ;;
esac
