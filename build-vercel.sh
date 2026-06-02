#!/bin/bash
set -e

# Run the normal build
bun run build

# Assemble Vercel Build Output API v3 structure
rm -rf .vercel/output
mkdir -p .vercel/output/static
mkdir -p .vercel/output/functions/__server.func

# Static assets
cp -r dist/client/. .vercel/output/static/

# Serverless function
cp -r dist/server/. .vercel/output/functions/__server.func/

# Routes config
cp dist/config.json .vercel/output/config.json
