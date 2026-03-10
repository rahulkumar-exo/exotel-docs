#!/bin/bash
# ============================================================
# Build script for Vercel Build Output API with A/B middleware
#
# This script:
# 1. Builds Docusaurus normally
# 2. Converts the output to Vercel Build Output API format
# 3. Adds Edge Middleware for A/B testing
#
# USAGE:
#   To ENABLE A/B testing:
#     Change vercel.json buildCommand to: "bash scripts/build-with-ab.sh"
#
#   To DISABLE A/B testing (normal build):
#     Change vercel.json buildCommand back to: "npm run build"
# ============================================================

set -e

echo "=== Step 1: Building Docusaurus ==="
npm run build

echo "=== Step 2: Creating Vercel Build Output API structure ==="
mkdir -p .vercel/output/static
mkdir -p .vercel/output/functions/_middleware.func

# Copy Docusaurus build output to static directory
cp -r build/* .vercel/output/static/

echo "=== Step 3: Adding Edge Middleware for A/B testing ==="
# Copy the middleware
cp ab-testing/vercel-middleware/middleware-edge.js .vercel/output/functions/_middleware.func/index.js

# Create middleware config
cat > .vercel/output/functions/_middleware.func/.vc-config.json << 'VCCONFIG'
{
  "runtime": "edge",
  "entrypoint": "index.js"
}
VCCONFIG

echo "=== Step 4: Copying API functions ==="
# Copy existing serverless functions
for func_file in api/*.js api/*.ts; do
  if [ -f "$func_file" ]; then
    func_name=$(basename "$func_file" | sed 's/\.[^.]*$//')
    mkdir -p ".vercel/output/functions/api/${func_name}.func"
    cp "$func_file" ".vercel/output/functions/api/${func_name}.func/index.js"
    cat > ".vercel/output/functions/api/${func_name}.func/.vc-config.json" << FUNCCONFIG
{
  "runtime": "nodejs20.x",
  "handler": "index.js",
  "launcherType": "Nodejs",
  "maxDuration": 10
}
FUNCCONFIG
  fi
done

echo "=== Step 5: Creating Build Output config ==="
# Create the config.json with redirects (copied from vercel.json)
cat > .vercel/output/config.json << 'OUTPUTCONFIG'
{
  "version": 3,
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html", "status": 200 }
  ]
}
OUTPUTCONFIG

echo "=== Build complete! ==="
echo "Output directory: .vercel/output/"
echo "Static files: .vercel/output/static/"
echo "Edge Middleware: .vercel/output/functions/_middleware.func/"
echo "A/B testing is ENABLED"
