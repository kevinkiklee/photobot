#!/bin/bash
set -e

# Check if docker-compose.yml exists in root
if [ ! -f "docker-compose.yml" ]; then
  echo "❌ docker-compose.yml missing"
  exit 1
fi

# Check if scripts/dev.sh exists
if [ ! -f "scripts/dev.sh" ]; then
  echo "❌ scripts/dev.sh missing"
  exit 1
fi

# Check if scripts/dev.sh is executable
if [ ! -x "scripts/dev.sh" ]; then
  echo "❌ scripts/dev.sh is not executable"
  exit 1
fi

# Check docker-compose services
SERVICES=$(grep -E "^  [a-z]+:" docker-compose.yml | sed 's/  //' | sed 's/://')
echo "Found services: $SERVICES"

if ! echo "$SERVICES" | grep -q "db"; then
  echo "❌ db service missing in docker-compose.yml"
  exit 1
fi

if ! echo "$SERVICES" | grep -q "ollama"; then
  echo "❌ ollama service missing in docker-compose.yml"
  exit 1
fi

echo "✅ All checks passed!"
