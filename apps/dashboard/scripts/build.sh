#!/bin/bash
set -e

cd ../..

# Build Prisma client
pnpm --filter @photobot/db build

# Build Next.js
pnpm --filter @photobot/dashboard build

# Note: Prisma 7 removed the Rust engine binary, so no nft trace patching is needed.
