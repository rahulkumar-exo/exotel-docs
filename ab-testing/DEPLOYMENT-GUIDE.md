# A/B Testing Deployment Guide

**Last Updated:** March 6, 2026
**Time to Deploy:** ~2-4 hours (Cloudflare) or ~4-6 hours (Vercel Middleware)

---

## Quick Decision: Which Approach?

```
Is developer.exotel.com on Cloudflare?
├── YES ──> Use Approach A: Cloudflare Worker (recommended)
├── NO, but can migrate ──> Migrate DNS to Cloudflare, then Approach A
└── NO, can't migrate ──> Use Approach B: Vercel Edge Middleware
```

---

## Approach A: Cloudflare Worker (Recommended)

### Prerequisites

- [ ] Cloudflare account with developer.exotel.com zone
- [ ] Node.js 18+ installed
- [ ] `wrangler` CLI installed (`npm install -g wrangler`)
- [ ] Cloudflare API token with Worker permissions

### Step 1: Authenticate Wrangler

```bash
wrangler login
# This opens a browser for Cloudflare OAuth
```

### Step 2: Update Configuration

Edit `ab-testing/cloudflare-worker/wrangler.toml`:

```toml
name = "exotel-docs-ab-test"
main = "worker.js"
compatibility_date = "2024-01-01"

# REQUIRED: Add your Cloudflare zone ID
routes = [
  { pattern = "developer.exotel.com/*", zone_id = "YOUR_ZONE_ID_HERE" }
]
```

**To find your Zone ID:**
1. Go to Cloudflare Dashboard > developer.exotel.com
2. On the Overview page, find "Zone ID" in the right sidebar
3. Copy and paste it into `wrangler.toml`

### Step 3: Configure Traffic Split

Edit `ab-testing/cloudflare-worker/worker.js`, line ~25:

```javascript
const CONFIG = {
  SPLIT_PERCENTAGE: 10,  // Start at 10% for Week 1
  NEW_SITE_ORIGIN: 'https://exotel-docs.vercel.app',
  // ... rest of config
};
```

### Step 4: Test Locally

```bash
cd ab-testing/cloudflare-worker
wrangler dev
# Worker runs at http://localhost:8787
# Test: http://localhost:8787/?force_variant=new
# Test: http://localhost:8787/?force_variant=old
```

### Step 5: Deploy to Production

```bash
# Deploy to staging first
wrangler deploy --env staging

# Verify staging works, then deploy to production
wrangler deploy --env production
```

### Step 6: Verify Deployment

```bash
# Check response headers to confirm worker is active
curl -sI https://developer.exotel.com | grep -i "x-docs"
# Expected output:
# X-Docs-Variant: old  (or 'new' if you're in the 10%)
# X-Docs-Split: 10%

# Force new variant to test
curl -sI "https://developer.exotel.com?force_variant=new" | grep -i "x-docs"
# X-Docs-Variant: new

# Force old variant to test
curl -sI "https://developer.exotel.com?force_variant=old" | grep -i "x-docs"
# X-Docs-Variant: old
```

### Changing Traffic Split (Weekly)

```bash
# Edit worker.js, change SPLIT_PERCENTAGE
# Week 1: 10, Week 2: 25, Week 3: 50, Week 4: 100

cd ab-testing/cloudflare-worker
# Edit SPLIT_PERCENTAGE in worker.js
wrangler deploy --env production

# Changes take effect in < 30 seconds globally
```

### Instant Rollback

```bash
# Set SPLIT_PERCENTAGE to 0 and redeploy
# OR delete the worker entirely:
wrangler delete --env production
```

---

## Approach B: Vercel Edge Middleware

### Prerequisites

- [ ] Vercel CLI installed (`npm install -g vercel`)
- [ ] Ability to change DNS A/CNAME records for developer.exotel.com
- [ ] WordPress site accessible via backup domain (e.g., old-developer.exotel.com)

### Step 1: Add Custom Domain to Vercel

```bash
cd "/Users/rahul.kumar/Claude code/exotel-docs"
vercel domains add developer.exotel.com
```

Vercel will provide DNS records. Add them:
- **Option A (CNAME):** `developer.exotel.com` -> `cname.vercel-dns.com`
- **Option B (A Record):** `developer.exotel.com` -> `76.76.21.21`

### Step 2: Set Up WordPress Backup Domain

Before changing DNS, ensure WordPress is accessible via a backup URL:

1. Create a DNS record: `old-developer.exotel.com` -> (current WordPress server IP)
2. Update WordPress `WP_HOME` and `WP_SITEURL` to accept the backup domain
3. Verify WordPress loads at `https://old-developer.exotel.com`

### Step 3: Install Middleware

```bash
# Copy middleware to project root
cp ab-testing/vercel-middleware/middleware.ts middleware.ts
```

Edit `middleware.ts` to set the WordPress backup URL:

```typescript
const CONFIG = {
  SPLIT_PERCENTAGE: 10,
  OLD_SITE_ORIGIN: 'https://old-developer.exotel.com',  // <-- Your WordPress backup URL
  // ...
};
```

### Step 4: Deploy

```bash
cd "/Users/rahul.kumar/Claude code/exotel-docs"
git add middleware.ts
git commit -m "feat: add A/B test edge middleware"
git push origin main
# Auto-deploys via Vercel
```

### Step 5: Update DNS

Change DNS for `developer.exotel.com` to point to Vercel:

```
Type: CNAME
Name: developer
Value: cname.vercel-dns.com
TTL: 300 (5 minutes for faster propagation during rollout)
```

### Step 6: Verify

```bash
# Wait for DNS propagation (5-60 minutes)
dig developer.exotel.com

# Check headers
curl -sI https://developer.exotel.com | grep -i "x-docs"
```

### Changing Traffic Split (Weekly)

```bash
# Edit SPLIT_PERCENTAGE in middleware.ts
# Commit and push - auto-deploys in ~2 minutes
```

### Instant Rollback

**Option 1 (fastest):** Set `SPLIT_PERCENTAGE = 0` and push
**Option 2 (nuclear):** Revert DNS to point back to WordPress

---

## Monitoring Setup

### 1. Response Header Verification

Every response from the A/B test includes these headers:

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Docs-Variant` | `new` or `old` | Which version the user sees |
| `X-Docs-Split` | `10%` | Current split percentage |

### 2. Health Check Endpoint

```bash
# Check A/B test status
curl "https://exotel-docs.vercel.app/api/ab-status?token=exotel-ab-monitor-2026"
```

Returns JSON with current configuration, health status, and content stats.

### 3. Set Up Uptime Monitoring

Add these checks to your monitoring tool (UptimeRobot, Pingdom, etc.):

| Check | URL | Expected |
|-------|-----|----------|
| New site health | `https://exotel-docs.vercel.app` | 200 OK |
| AB status API | `https://exotel-docs.vercel.app/api/ab-status?token=...` | 200 OK |
| Old site health | `https://developer.exotel.com?force_variant=old` | 200 OK |
| New variant works | `https://developer.exotel.com?force_variant=new` | 200 OK |

### 4. Google Analytics 4 Setup

Add GA4 tracking to the new site. In `docusaurus.config.ts`:

```typescript
// Add to presets > classic > gtag
presets: [
  ['classic', {
    gtag: {
      trackingID: 'G-XXXXXXXXXX',  // Your GA4 Measurement ID
      anonymizeIP: true,
    },
    // ... existing config
  }],
],
```

### 5. Custom Event Tracking

Add to `src/theme/Root.tsx` to track A/B variant:

```typescript
useEffect(() => {
  // Read variant cookie
  const variant = document.cookie
    .split(';')
    .find(c => c.trim().startsWith('exo_docs_variant='))
    ?.split('=')[1] || 'unknown';

  // Send to GA4
  if (typeof gtag !== 'undefined') {
    gtag('event', 'docs_variant', {
      variant: variant,
      page_path: window.location.pathname,
    });
  }
}, []);
```

---

## Weekly Operations Runbook

### Daily Checks (5 minutes)

```bash
# 1. Check new site is up
curl -so /dev/null -w "%{http_code}" https://exotel-docs.vercel.app
# Expected: 200

# 2. Check AB headers are present
curl -sI https://developer.exotel.com | grep "X-Docs"
# Expected: X-Docs-Variant and X-Docs-Split headers

# 3. Check AB status API
curl -s "https://exotel-docs.vercel.app/api/ab-status?token=exotel-ab-monitor-2026" | python3 -m json.tool | head -20
```

### Weekly Review (Friday)

1. **Check GA4 dashboard** — Compare metrics by variant (use `docs_variant` custom dimension)
2. **Check Vercel Analytics** — Core Web Vitals for the new site
3. **Check support tickets** — Any increase in docs-related tickets?
4. **Check 404 logs** — `vercel logs --filter "status=404"` or Vercel dashboard
5. **Make Go/No-Go decision** — Advance to next split percentage or hold

### Advancing Traffic Split

```bash
# Week 1 -> Week 2 (10% -> 25%)
# Edit SPLIT_PERCENTAGE in worker.js (Cloudflare) or middleware.ts (Vercel)
# Change: SPLIT_PERCENTAGE: 25

# Cloudflare approach:
cd ab-testing/cloudflare-worker
wrangler deploy --env production

# Vercel approach:
git add middleware.ts && git commit -m "chore: advance A/B split to 25%" && git push
```

### Rollback Procedure

```
SEVERITY: CRITICAL (site down or data loss)
├── Action: Set SPLIT_PERCENTAGE = 0 and deploy immediately
├── Time: < 1 minute (Cloudflare) or < 2 minutes (Vercel)
└── Notification: Slack #engineering + email to stakeholders

SEVERITY: HIGH (broken functionality, high 404 rate)
├── Action: Set SPLIT_PERCENTAGE = 0, investigate
├── Time: < 5 minutes
└── Notification: Slack #engineering

SEVERITY: MEDIUM (degraded metrics but functional)
├── Action: Hold current split, investigate
├── Time: No rush
└── Notification: Weekly review discussion

SEVERITY: LOW (minor issues)
├── Action: Fix and continue
├── Time: Next business day
└── Notification: Add to weekly review notes
```

---

## Appendix: Architecture Diagrams

### Cloudflare Worker Architecture

```
Internet
   │
   ▼
developer.exotel.com (Cloudflare DNS)
   │
   ▼
┌─────────────────────────────┐
│   Cloudflare Worker         │
│   (edge, <1ms overhead)    │
│                             │
│   1. Check cookie           │
│   2. Assign variant         │
│   3. Set sticky cookie      │
│   4. Route request          │
└──────────┬──────────────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌─────────┐ ┌──────────────────┐
│ WordPress│ │ Vercel Edge CDN  │
│ Origin   │ │ (Docusaurus)     │
│ (old)    │ │ (new, 302 pages) │
└─────────┘ └──────────────────┘
   90%           10%
```

### Vercel Middleware Architecture

```
Internet
   │
   ▼
developer.exotel.com (DNS -> Vercel)
   │
   ▼
┌─────────────────────────────┐
│   Vercel Edge Middleware     │
│   (runs before page render)  │
│                             │
│   1. Check cookie           │
│   2. Assign variant         │
│   3. Set sticky cookie      │
│   4. Rewrite or next()      │
└──────────┬──────────────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌──────────┐ ┌──────────────────┐
│ WordPress │ │ Docusaurus SSG   │
│ (rewrite  │ │ (serve directly) │
│  proxy)   │ │                  │
└──────────┘ └──────────────────┘
   90%           10%
```

---

## FAQ

**Q: What happens if the Cloudflare Worker crashes?**
A: Cloudflare's default behavior is to pass requests through to the origin (WordPress). So a worker crash = all traffic goes to old site. This is fail-safe by design.

**Q: Will users see a flash/redirect?**
A: No. Both approaches work at the network layer (proxy/rewrite). The user always sees `developer.exotel.com` in their browser. There is no visible redirect.

**Q: How do I test a specific variant without affecting others?**
A: Add `?force_variant=new` or `?force_variant=old` to any URL. This overrides the random assignment for your session only.

**Q: What about SEO during the A/B test?**
A: Since the URL stays the same (`developer.exotel.com`), Google sees the same domain. The Worker/Middleware serves the same canonical URL. No SEO impact during the test. After full cutover, submit updated sitemap to Search Console.

**Q: Can I reset a user's variant assignment?**
A: Users can clear their `exo_docs_variant` cookie, or you can change the cookie name in config to reset all assignments.

**Q: How long does a DNS change take to propagate?**
A: With TTL set to 300 seconds, most users see the change within 5-15 minutes. Some ISPs may cache for up to 24 hours.
