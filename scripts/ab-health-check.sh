#!/bin/bash
# ============================================================
# A/B Test Health Check Script
#
# Run daily during the A/B test to verify everything is working.
# Usage: bash scripts/ab-health-check.sh
# ============================================================

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

check() {
  local label="$1"
  local status="$2"
  local expected="$3"

  if [ "$status" = "$expected" ]; then
    echo -e "  ${GREEN}[PASS]${NC} $label: $status"
  else
    echo -e "  ${RED}[FAIL]${NC} $label: $status (expected: $expected)"
  fi
}

echo ""
echo "========================================"
echo "  Exotel Docs A/B Test Health Check"
echo "  $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "========================================"
echo ""

# --- 1. Origin Health ---
echo "1. Origin Health"
NEW_STATUS=$(curl -so /dev/null -w "%{http_code}" --max-time 10 https://exotel-docs.vercel.app 2>/dev/null)
check "New site (Vercel)" "$NEW_STATUS" "200"

OLD_STATUS=$(curl -so /dev/null -w "%{http_code}" --max-time 10 https://legacy-developer.exotel.com 2>/dev/null || echo "TIMEOUT")
if [ "$OLD_STATUS" = "200" ] || [ "$OLD_STATUS" = "301" ] || [ "$OLD_STATUS" = "302" ]; then
  echo -e "  ${GREEN}[PASS]${NC} Old site (WordPress): $OLD_STATUS"
else
  echo -e "  ${YELLOW}[WARN]${NC} Old site (WordPress): $OLD_STATUS (may not be set up yet)"
fi
echo ""

# --- 2. A/B Routing ---
echo "2. A/B Routing Headers"
HEADERS=$(curl -sI --max-time 10 https://developer.exotel.com 2>/dev/null)
VARIANT=$(echo "$HEADERS" | grep -i "x-docs-variant" | awk '{print $2}' | tr -d '\r\n')
SPLIT=$(echo "$HEADERS" | grep -i "x-docs-split" | awk '{print $2}' | tr -d '\r\n')

if [ -n "$VARIANT" ]; then
  echo -e "  ${GREEN}[PASS]${NC} A/B routing active"
  echo -e "         Variant: $VARIANT"
  echo -e "         Split:   $SPLIT"
else
  echo -e "  ${YELLOW}[INFO]${NC} A/B routing not detected (middleware may not be deployed yet)"
fi
echo ""

# --- 3. Force Variant Test ---
echo "3. Force Variant Test"
NEW_FORCE=$(curl -so /dev/null -w "%{http_code}" --max-time 10 "https://developer.exotel.com?force_variant=new" 2>/dev/null)
OLD_FORCE=$(curl -so /dev/null -w "%{http_code}" --max-time 10 "https://developer.exotel.com?force_variant=old" 2>/dev/null)

if [ "$NEW_FORCE" = "200" ]; then
  echo -e "  ${GREEN}[PASS]${NC} Force new variant: HTTP $NEW_FORCE"
else
  echo -e "  ${YELLOW}[WARN]${NC} Force new variant: HTTP $NEW_FORCE"
fi

if [ "$OLD_FORCE" = "200" ]; then
  echo -e "  ${GREEN}[PASS]${NC} Force old variant: HTTP $OLD_FORCE"
else
  echo -e "  ${YELLOW}[WARN]${NC} Force old variant: HTTP $OLD_FORCE"
fi
echo ""

# --- 4. API Health ---
echo "4. API Endpoints"
AB_API=$(curl -so /dev/null -w "%{http_code}" --max-time 10 "https://exotel-docs.vercel.app/api/ab-status?token=exotel-ab-monitor-2026" 2>/dev/null)
check "AB Status API" "$AB_API" "200"

CHAT_API=$(curl -so /dev/null -w "%{http_code}" --max-time 10 "https://exotel-docs.vercel.app/api/chat" 2>/dev/null)
# Chat API returns 405 for GET (expects POST), which is correct
if [ "$CHAT_API" = "405" ] || [ "$CHAT_API" = "200" ]; then
  echo -e "  ${GREEN}[PASS]${NC} Chat API: HTTP $CHAT_API (expected 405 for GET)"
else
  echo -e "  ${YELLOW}[WARN]${NC} Chat API: HTTP $CHAT_API"
fi
echo ""

# --- 5. Key Pages ---
echo "5. Key Page Checks (new site)"
PAGES=(
  "/docs/voice-v1/overview"
  "/docs/sms-api/overview"
  "/docs/getting-started/overview"
  "/docs/call-support/basics/cloud-telephony-overview"
  "/docs/chatbot/overview"
  "/docs/references/changelog"
)

for page in "${PAGES[@]}"; do
  STATUS=$(curl -so /dev/null -w "%{http_code}" --max-time 10 "https://exotel-docs.vercel.app${page}" 2>/dev/null)
  PAGE_NAME=$(echo "$page" | sed 's|/docs/||' | cut -d'/' -f1-2)
  check "$PAGE_NAME" "$STATUS" "200"
done
echo ""

# --- 6. Performance ---
echo "6. Performance (new site homepage)"
PERF=$(curl -so /dev/null -w "TTFB: %{time_starttransfer}s  Total: %{time_total}s" --max-time 10 https://exotel-docs.vercel.app 2>/dev/null)
echo -e "  ${GREEN}[INFO]${NC} $PERF"
echo ""

echo "========================================"
echo "  Health check complete"
echo "========================================"
echo ""
