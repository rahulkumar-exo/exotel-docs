#!/bin/bash
# ============================================================
# Build script for Vercel Build Output API with A/B middleware
#
# ONLY handles: static files + edge middleware
# API functions (api/*.js) are handled by Vercel automatically
# ============================================================

set -e

echo "=== Step 1: Building Docusaurus ==="
npm run build

echo "=== Step 2: Cleaning previous Build Output ==="
rm -rf .vercel/output

echo "=== Step 3: Creating Build Output API structure ==="
mkdir -p .vercel/output/static
mkdir -p .vercel/output/functions/_middleware.func

# Copy Docusaurus build output to static directory
cp -r build/* .vercel/output/static/

echo "=== Step 4: Adding Edge Middleware ==="
cp ab-testing/vercel-middleware/middleware-edge.js .vercel/output/functions/_middleware.func/index.js

cat > .vercel/output/functions/_middleware.func/.vc-config.json << 'VCCONFIG'
{
  "runtime": "edge",
  "entrypoint": "index.js"
}
VCCONFIG

echo "=== Step 5: Creating Build Output config ==="
cat > .vercel/output/config.json << 'OUTPUTCONFIG'
{
  "version": 3,
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html", "status": 200 }
  ]
}
OUTPUTCONFIG

echo "=== Build complete ==="
echo "A/B testing middleware is ENABLED"
