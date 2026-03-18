#!/bin/bash
# ============================================================
# Build script for Exotel Docs
#
# Docusaurus build + Vercel handles middleware.js natively
# (middleware.js at project root is auto-detected by Vercel)
# ============================================================

set -e

echo "=== Building Docusaurus ==="
npm run build

# Clean any old Build Output API artifacts that conflict
rm -rf .vercel/output

echo "=== Build complete ==="
echo "A/B testing via middleware.js (Vercel native edge middleware)"
