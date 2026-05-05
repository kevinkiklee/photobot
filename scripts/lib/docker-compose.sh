# Resolve the Docker Compose command once.
# Prefers the `docker compose` plugin; falls back to the legacy
# hyphenated `docker-compose` binary when the plugin isn't installed.
if docker compose version >/dev/null 2>&1; then
  DC=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  DC=(docker-compose)
else
  echo "Neither 'docker compose' plugin nor 'docker-compose' binary is available." >&2
  exit 1
fi

dc() { "${DC[@]}" "$@"; }
