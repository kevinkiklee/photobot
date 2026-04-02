#!/bin/bash
set -e

cd ../..

# Build Prisma client
pnpm --filter @photobot/db build

# Build Next.js
pnpm --filter @photobot/voting build

# After build: inject the engine binary path into Next.js trace files
# The nft paths are relative to the .nft.json file location
# With outputFileTracingRoot=monorepo_root, traces are relative to that root
ENGINE_REL="node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node"
SCHEMA_REL="node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/.prisma/client/schema.prisma"

if [ -f "$ENGINE_REL" ]; then
  echo "Patching nft trace files to include Prisma engine..."
  find apps/voting/.next -name '*.nft.json' | while read nft; do
    node -e "
      const fs = require('fs');
      const path = require('path');
      const trace = JSON.parse(fs.readFileSync('$nft', 'utf8'));
      // nft paths are relative to the file's directory
      // We need a path from the nft file to the monorepo root's node_modules
      const nftDir = path.dirname('$nft');
      const engineAbs = path.resolve('$ENGINE_REL');
      const engineRel = path.relative(nftDir, engineAbs);
      const schemaAbs = path.resolve('$SCHEMA_REL');
      const schemaRel = path.relative(nftDir, schemaAbs);
      if (!trace.files.includes(engineRel)) {
        trace.files.push(engineRel);
        trace.files.push(schemaRel);
        fs.writeFileSync('$nft', JSON.stringify(trace));
        console.log('  Patched: $nft -> ' + engineRel);
      }
    " 2>/dev/null || true
  done
  echo "Done patching"
else
  echo "WARNING: Engine not found"
fi
