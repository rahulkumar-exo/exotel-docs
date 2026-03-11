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

echo "=== Step 2: Cleaning previous Build Output ==="
rm -rf .vercel/output

echo "=== Step 3: Creating Vercel Build Output API structure ==="
mkdir -p .vercel/output/static
mkdir -p .vercel/output/functions/_middleware.func

# Copy Docusaurus build output to static directory
cp -r build/* .vercel/output/static/

echo "=== Step 4: Adding Edge Middleware for A/B testing ==="
cp ab-testing/vercel-middleware/middleware-edge.js .vercel/output/functions/_middleware.func/index.js

cat > .vercel/output/functions/_middleware.func/.vc-config.json << 'VCCONFIG'
{
  "runtime": "edge",
  "entrypoint": "index.js"
}
VCCONFIG

echo "=== Step 5: Copying API functions ==="
for func_file in api/*.js api/*.ts; do
  if [ -f "$func_file" ]; then
    func_name=$(basename "$func_file" | sed 's/\.[^.]*$//')
    func_dir=".vercel/output/functions/api/${func_name}.func"

    # Skip if already exists (avoid conflicts)
    if [ -d "$func_dir" ]; then
      echo "  Skipping $func_name (already exists)"
      continue
    fi

    mkdir -p "$func_dir"
    cp "$func_file" "$func_dir/index.js"
    cat > "$func_dir/.vc-config.json" << FUNCCONFIG
{
  "runtime": "nodejs20.x",
  "handler": "index.js",
  "launcherType": "Nodejs",
  "maxDuration": 10
}
FUNCCONFIG
    echo "  Copied $func_name"
  fi
done

echo "=== Step 6: Creating Build Output config ==="
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
echo "Static files: .vercel/output/static/"
echo "Edge Middleware: .vercel/output/functions/_middleware.func/"
echo "A/B testing is ENABLED"
