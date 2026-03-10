# A/B Testing Deployment Guide (AWS Route 53)

**Last Updated:** March 8, 2026
**DNS Provider:** AWS Route 53
**Problem Solved:** Session-consistent A/B testing (same user always sees same version)

---

## Why Not DNS-Level Splitting?

Route 53 weighted routing splits at the **DNS layer** — it resolves the domain to different IPs. This means:

- No cookies, no session awareness
- Same user can see different versions on refresh
- No way to force a specific user to a variant
- Cache TTL causes unpredictable behavior

**Both approaches below solve this** by splitting at the **application layer** with cookie-based sticky sessions.

---

## Side-by-Side Comparison

| Factor | Approach A: Vercel Middleware | Approach B: CloudFront + Lambda@Edge |
|--------|:---:|:---:|
| **Where split happens** | Vercel Edge (global) | CloudFront Edge (global) |
| **Session consistency** | Cookie-based (30 days) | Cookie-based (30 days) |
| **Setup time** | ~2-3 hours | ~4-6 hours |
| **AWS dependency** | Route 53 only (DNS change) | Route 53 + CloudFront + Lambda + IAM + ACM |
| **Cost** | $0 (Vercel free tier) | ~$10-50/mo (CloudFront) + Lambda@Edge (minimal) |
| **Rollback speed** | ~2 min (git push) | ~5 min (Lambda update + CF propagation) |
| **Infra complexity** | Low (1 config change) | Medium (CloudFormation stack, 2 Lambdas) |
| **Keeps everything in AWS** | No (DNS points to Vercel) | **Yes** |
| **WordPress access during A/B** | Via backup domain | Via CloudFront (same domain) |
| **Monitoring** | Vercel Analytics + custom headers | CloudWatch + CloudFront metrics + custom headers |
| **Best for** | Teams comfortable with Vercel | Teams that prefer AWS-native solutions |

### Recommendation

- **Choose Vercel Middleware** if you want the simplest, fastest setup and are OK pointing DNS to Vercel
- **Choose CloudFront + Lambda@Edge** if you want everything in AWS or need CloudFront caching/WAF features

---

## Approach A: Vercel Edge Middleware

### Architecture

```
Internet
   │
   ▼
developer.exotel.com
   │ (Route 53 CNAME → cname.vercel-dns.com)
   ▼
┌─────────────────────────────────────┐
│  Vercel Edge (global, <10ms)        │
│                                     │
│  Edge Middleware runs FIRST:        │
│  ┌─────────────────────────────┐    │
│  │ 1. Read exo_docs_variant    │    │
│  │    cookie                   │    │
│  │ 2. If no cookie → assign    │    │
│  │    randomly (10/90 split)   │    │
│  │ 3. Set sticky cookie        │    │
│  │    (30 day expiry)          │    │
│  │ 4. Route to variant         │    │
│  └──────────┬──────────────────┘    │
│             │                       │
│       ┌─────┴─────┐                │
│       │           │                 │
│       ▼           ▼                 │
│  ┌─────────┐ ┌─────────────┐       │
│  │ Proxy   │ │ Serve from  │       │
│  │ to WP   │ │ Docusaurus  │       │
│  │ origin  │ │ (static)    │       │
│  └─────────┘ └─────────────┘       │
│     90%          10%                │
└─────────────────────────────────────┘
         │
         ▼
legacy-developer.exotel.com (WordPress)
```

### Prerequisites

- [ ] Vercel project for exotel-docs (already set up)
- [ ] WordPress accessible via a backup domain (e.g., `legacy-developer.exotel.com`)
- [ ] AWS Route 53 access to update DNS records

### Step 1: Create WordPress Backup Domain

Before changing DNS, ensure WordPress remains accessible:

```bash
# In Route 53, create a new A record:
# Name: legacy-developer.exotel.com
# Type: A
# Value: <current WordPress server IP>
# TTL: 300

# Verify WordPress loads on the backup domain:
curl -sI https://legacy-developer.exotel.com
```

**Important:** Update WordPress settings to accept the backup domain too (add to `WP_HOME` / `WP_SITEURL` or use a plugin that handles multiple domains).

### Step 2: Update Middleware Config

Edit `ab-testing/vercel-middleware/middleware-edge.js`:

```javascript
const OLD_SITE_ORIGIN = 'https://legacy-developer.exotel.com';  // ← Your WordPress backup domain
const SPLIT_PERCENTAGE = 10;  // Start at 10% for Week 1
```

### Step 3: Enable A/B Build

Change the build command in `vercel.json`:

```json
{
  "buildCommand": "bash scripts/build-with-ab.sh"
}
```

Commit and push:
```bash
git add vercel.json ab-testing/vercel-middleware/middleware-edge.js
git commit -m "feat: enable A/B testing middleware"
git push origin main
```

### Step 4: Add Custom Domain to Vercel

```bash
# Via Vercel CLI
vercel domains add developer.exotel.com

# Or via Vercel Dashboard:
# Project Settings → Domains → Add Domain → developer.exotel.com
```

Vercel will show you the DNS records to add.

### Step 5: Update Route 53 DNS

In AWS Route 53 console (or CLI):

```bash
# Change the existing developer.exotel.com record:
# Type: CNAME
# Value: cname.vercel-dns.com
# TTL: 300

# AWS CLI example:
aws route53 change-resource-record-sets \
  --hosted-zone-id YOUR_HOSTED_ZONE_ID \
  --change-batch '{
    "Changes": [{
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "developer.exotel.com",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecords": [{ "Value": "cname.vercel-dns.com" }]
      }
    }]
  }'
```

### Step 6: Verify

```bash
# Wait 5-15 minutes for DNS propagation
dig developer.exotel.com

# Check A/B headers
curl -sI https://developer.exotel.com | grep -i "x-docs"
# Expected: X-Docs-Variant: old (or new)  +  X-Docs-Split: 10%

# Force new variant
curl -sI "https://developer.exotel.com?force_variant=new" | grep -i "x-docs"

# Force old variant
curl -sI "https://developer.exotel.com?force_variant=old" | grep -i "x-docs"
```

### Changing Traffic Split (Vercel)

```bash
# Edit SPLIT_PERCENTAGE in ab-testing/vercel-middleware/middleware-edge.js
# Commit and push — auto-deploys in ~2 minutes
git commit -am "chore: advance A/B split to 25%" && git push
```

### Rollback (Vercel)

```bash
# Option 1: Set split to 0%
# Edit SPLIT_PERCENTAGE = 0 in middleware-edge.js, push

# Option 2: Disable middleware entirely
# Change vercel.json buildCommand back to "npm run build", push

# Option 3: Revert DNS (nuclear)
# Point developer.exotel.com back to WordPress IP in Route 53
```

---

## Approach B: AWS CloudFront + Lambda@Edge

### Architecture

```
Internet
   │
   ▼
developer.exotel.com
   │ (Route 53 Alias → CloudFront)
   ▼
┌──────────────────────────────────────────┐
│  CloudFront Distribution (global edge)    │
│                                          │
│  Lambda@Edge: Viewer Request             │
│  ┌────────────────────────────────┐      │
│  │ 1. Read exo_docs_variant      │      │
│  │    cookie from request         │      │
│  │ 2. If no cookie → assign      │      │
│  │    randomly (10/90 split)      │      │
│  │ 3. Set origin dynamically:     │      │
│  │    "new" → Vercel origin       │      │
│  │    "old" → WordPress origin    │      │
│  │ 4. Tag request for cookie      │      │
│  └──────────┬─────────────────────┘      │
│             │                            │
│       ┌─────┴─────┐                     │
│       │           │                      │
│       ▼           ▼                      │
│  WordPress    Vercel                     │
│  Origin       Origin                     │
│  (90%)        (10%)                      │
│       │           │                      │
│       └─────┬─────┘                     │
│             ▼                            │
│  Lambda@Edge: Origin Response            │
│  ┌────────────────────────────────┐      │
│  │ Read X-AB-Set-Cookie header    │      │
│  │ → Set-Cookie: exo_docs_variant │      │
│  │ → Add X-Docs-Variant header    │      │
│  └────────────────────────────────┘      │
│             │                            │
└─────────────┼────────────────────────────┘
              ▼
          User Browser
          (cookie persists 30 days)
```

### Prerequisites

- [ ] AWS CLI configured with admin permissions
- [ ] ACM certificate for `developer.exotel.com` in **us-east-1** (Lambda@Edge requirement)
- [ ] Route 53 hosted zone for `developer.exotel.com`
- [ ] WordPress accessible via backup domain

### Step 1: Create ACM Certificate (if needed)

```bash
# Must be in us-east-1 for CloudFront!
aws acm request-certificate \
  --region us-east-1 \
  --domain-name developer.exotel.com \
  --validation-method DNS \
  --query 'CertificateArn' --output text

# Follow DNS validation instructions from ACM
# (add CNAME record to Route 53)
```

### Step 2: Create WordPress Backup Domain

Same as Vercel approach — ensure WordPress is accessible at `legacy-developer.exotel.com`.

### Step 3: Deploy CloudFormation Stack

```bash
cd ab-testing/aws-cloudfront
./deploy.sh deploy

# You'll be prompted for:
# - WordPress origin domain (e.g., legacy-developer.exotel.com)
# - ACM Certificate ARN
# - Route 53 Hosted Zone ID
```

This creates:
- CloudFront Distribution with 2 origins (WordPress + Vercel)
- Lambda@Edge Viewer Request function (routes traffic)
- Lambda@Edge Origin Response function (sets cookies)
- IAM Role for Lambda execution
- Route 53 A record pointing to CloudFront

### Step 4: Upload Lambda Code

```bash
# The deploy.sh script does this automatically, but you can also run:
./deploy.sh update-lambda
```

### Step 5: Verify

```bash
# Check deployment status
./deploy.sh status

# Test headers
curl -sI https://developer.exotel.com | grep -i "x-docs"

# Force variants
curl -sI "https://developer.exotel.com?force_variant=new" | grep -i "x-docs"
curl -sI "https://developer.exotel.com?force_variant=old" | grep -i "x-docs"
```

### Changing Traffic Split (AWS)

```bash
# One command to update the split:
./deploy.sh update-split 25   # Week 2: 25%
./deploy.sh update-split 50   # Week 3: 50%
./deploy.sh update-split 100  # Week 4: 100%
```

### Rollback (AWS)

```bash
# Instant rollback — sets split to 0%
./deploy.sh rollback

# All traffic immediately goes to WordPress
# Takes effect after CloudFront propagation (~5 min)
```

---

## Monitoring (Both Approaches)

### Response Headers

Every response includes these headers for debugging:

| Header | Example | Purpose |
|--------|---------|---------|
| `X-Docs-Variant` | `new` or `old` | Which version this user sees |
| `X-Docs-Split` | `10%` | Current traffic split setting |

### Daily Health Check (5 minutes)

```bash
#!/bin/bash
# Save as: scripts/ab-health-check.sh

echo "=== A/B Test Health Check ==="
echo ""

# 1. Check new site is up
NEW_STATUS=$(curl -so /dev/null -w "%{http_code}" https://exotel-docs.vercel.app 2>/dev/null)
echo "New site (Vercel):     HTTP $NEW_STATUS"

# 2. Check old site is up
OLD_STATUS=$(curl -so /dev/null -w "%{http_code}" https://legacy-developer.exotel.com 2>/dev/null)
echo "Old site (WordPress):  HTTP $OLD_STATUS"

# 3. Check A/B routing
HEADERS=$(curl -sI https://developer.exotel.com 2>/dev/null)
VARIANT=$(echo "$HEADERS" | grep -i "x-docs-variant" | awk '{print $2}' | tr -d '\r')
SPLIT=$(echo "$HEADERS" | grep -i "x-docs-split" | awk '{print $2}' | tr -d '\r')

echo ""
echo "A/B Test active:       $([ -n "$VARIANT" ] && echo 'YES' || echo 'NO')"
echo "Current variant:       ${VARIANT:-N/A}"
echo "Traffic split:         ${SPLIT:-N/A}"

# 4. Test force variants
NEW_OK=$(curl -so /dev/null -w "%{http_code}" "https://developer.exotel.com?force_variant=new" 2>/dev/null)
OLD_OK=$(curl -so /dev/null -w "%{http_code}" "https://developer.exotel.com?force_variant=old" 2>/dev/null)
echo ""
echo "Force new variant:     HTTP $NEW_OK"
echo "Force old variant:     HTTP $OLD_OK"

# 5. Check AB status API
AB_API=$(curl -so /dev/null -w "%{http_code}" "https://exotel-docs.vercel.app/api/ab-status?token=exotel-ab-monitor-2026" 2>/dev/null)
echo "AB Status API:         HTTP $AB_API"
```

### Weekly Review Checklist

| # | Check | Tool | Action if Red |
|---|-------|------|---------------|
| 1 | Both origins returning 200 | Health check script | Investigate, consider rollback |
| 2 | A/B headers present on responses | `curl -sI` | Check middleware/Lambda deployment |
| 3 | Cookie being set on new visitors | Browser DevTools | Check middleware cookie logic |
| 4 | Returning visitors get same variant | Clear cookie, revisit, check | Fix cookie path/domain settings |
| 5 | 404 error rate < 1% | Vercel logs / CloudWatch | Fix broken links, add redirects |
| 6 | Page load < 2s (new site) | Vercel Analytics | Investigate performance regression |
| 7 | No increase in support tickets | Freshdesk | Review tickets, fix content gaps |
| 8 | Core Web Vitals "Good" | PageSpeed Insights | Optimize LCP/CLS/FID |

### Traffic Split Schedule

```
Week 1: 10% new / 90% old
  ├── Monitor daily
  ├── Check 404 logs
  └── Friday: Go/No-Go for 25%

Week 2: 25% new / 75% old
  ├── Monitor daily
  ├── Compare GA4 metrics by variant
  └── Friday: Go/No-Go for 50%

Week 3: 50% new / 50% old
  ├── Enable feedback banner
  ├── Begin DNS cutover planning
  └── Friday: Go/No-Go for 100%

Week 4: 100% new / 0% old
  ├── Full cutover
  ├── Remove A/B infrastructure
  └── Decommission WordPress
```

---

## FAQ

**Q: Why do we need TWO Lambda functions for the AWS approach?**
A: Lambda@Edge "Viewer Request" can modify the request (change origin, add headers) but CANNOT set response cookies. So we use "Origin Response" as a companion to translate a custom header into a Set-Cookie header.

**Q: What happens if the new site goes down?**
A: Both approaches have built-in fallback. If Vercel is unreachable, the middleware/Lambda catches the error and routes to WordPress. Users may see a brief delay but won't see an error.

**Q: Can I test a specific variant without affecting metrics?**
A: Yes. Add `?force_variant=new` or `?force_variant=old` to any URL. This sets a cookie for your session without affecting the random assignment for other users.

**Q: How do I clear my variant assignment?**
A: Clear the `exo_docs_variant` cookie in your browser. On your next visit, you'll be randomly reassigned.

**Q: What about Google crawlers during the A/B test?**
A: Google respects cookies, so Googlebot will be assigned a variant and stay on it. Since both versions serve the same canonical URL (`developer.exotel.com`), there's no SEO impact. After full cutover, submit an updated sitemap.

**Q: How much does the CloudFront approach cost?**
A: For a documentation site (~100K page views/month): CloudFront ~$5-10/mo, Lambda@Edge ~$1-2/mo. Total: ~$10-15/mo during the 4-week test period.

**Q: Can we run both approaches simultaneously?**
A: No. Both approaches require controlling the `developer.exotel.com` DNS. Choose one.
