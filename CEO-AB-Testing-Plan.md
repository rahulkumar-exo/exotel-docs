# A/B Testing Plan: Exotel Developer Documentation Migration

**Prepared for:** CEO Review
**Date:** March 6, 2026 (Updated)
**Status:** Ready for Approval
**Owner:** Engineering / Developer Experience Team
**Companion Document:** [Comparative Study — Three Platform Analysis](./COMPARATIVE-STUDY-Three-Platform-Analysis.md)

---

## 1. Executive Summary

We are replacing the legacy developer documentation site (`developer.exotel.com`, ~105 pages) **and consolidating content from `support.exotel.com` (~200+ articles)** into a modern Docusaurus-based platform (`exotel-docs.vercel.app`, **302 pages**) that includes AI-powered search, an interactive API console, and significantly faster load times.

Rather than a risky big-bang cutover, we will use **A/B traffic splitting** to gradually route visitors from the old site to the new site over four weeks. This approach lets us:

- **Validate performance** under real traffic before committing
- **Catch broken links and 404s** before they affect all users
- **Measure developer engagement** (search usage, API console, time on site)
- **Roll back instantly** if any metric degrades beyond acceptable thresholds

**Timeline:** 4 weeks from launch to full cutover
**Starting split:** 10% of traffic to the new site in Week 1
**Success criteria:** Page load < 2s, 404 rate < 1%, no increase in support tickets
**New site page count:** 302 pages (93 API docs + 209 support/guide docs) — 3x the original developer.exotel.com

---

## 2. Traffic Split Strategy

The rollout follows a gated progression. Each gate requires that KPIs from the previous phase meet or exceed baseline thresholds before advancing.

| Phase | Traffic to New Site | Duration | Gate to Advance |
|-------|:-------------------:|----------|-----------------|
| Pre-launch | 0% | 3-5 days | Analytics verified, all redirects confirmed |
| Week 1 | 10% | 7 days | All KPIs at or above baseline |
| Week 2 | 25% | 7 days | All KPIs stable, no critical bugs |
| Week 3 | 50% | 7 days | Positive trend on engagement metrics |
| Week 4 | 100% | Ongoing | Full DNS cutover, decommission old site |

**Sticky sessions:** Once a visitor is assigned to the new site (via cookie), they remain on the new site for the duration of their session and subsequent visits. This prevents confusion from being bounced between two different UIs.

---

## 3. Implementation Options

### Option A: DNS-Level Split via Cloudflare Workers (Recommended)

**How it works:** A Cloudflare Worker sits in front of `developer.exotel.com`. On each incoming request, it checks for an existing assignment cookie. If none exists, it assigns the visitor to the new site (with the configured probability, e.g., 10%) and sets a persistent cookie. Requests assigned to the new site are proxied to `exotel-docs.vercel.app`; all others pass through to the existing origin.

```
Visitor --> developer.exotel.com (Cloudflare DNS)
                |
          Cloudflare Worker
           /            \
     90% old site     10% proxied to
     (pass-through)   exotel-docs.vercel.app
```

**Sample Cloudflare Worker (pseudocode):**

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const cookie = getCookie(request, 'docs_variant')
  let variant = cookie

  if (!variant) {
    variant = Math.random() < 0.10 ? 'new' : 'old'
  }

  if (variant === 'new') {
    const newUrl = request.url.replace(
      'developer.exotel.com',
      'exotel-docs.vercel.app'
    )
    const response = await fetch(newUrl, request)
    const modifiedResponse = new Response(response.body, response)
    modifiedResponse.headers.set(
      'Set-Cookie',
      'docs_variant=new; Path=/; Max-Age=2592000'
    )
    return modifiedResponse
  }

  const response = await fetch(request)
  const modifiedResponse = new Response(response.body, response)
  modifiedResponse.headers.set(
    'Set-Cookie',
    'docs_variant=old; Path=/; Max-Age=2592000'
  )
  return modifiedResponse
}
```

| Pros | Cons |
|------|------|
| No changes required on either site | Requires `developer.exotel.com` DNS to be on Cloudflare |
| Instant rollback (change one number) | Minor Cloudflare Workers cost (~$5/mo for typical docs traffic) |
| Transparent to end users (same URL) | Requires engineering time to set up Worker (~2-4 hours) |
| Handles sticky sessions via cookie | |
| No SEO impact (URL stays the same) | |

---

### Option B: Vercel Edge Middleware

**How it works:** Deploy a Vercel Edge Middleware function on a shared domain (or on the new site's domain mapped to `developer.exotel.com`). The middleware inspects incoming requests, assigns visitors to a cohort, and either serves the new Docusaurus content or reverse-proxies to the old site.

```
Visitor --> developer.exotel.com (pointed to Vercel)
                |
          Vercel Edge Middleware
           /            \
     90% proxied to    10% served from
     old origin        new Docusaurus site
```

| Pros | Cons |
|------|------|
| Full control within Vercel ecosystem | Requires pointing DNS to Vercel first |
| Native Vercel Analytics integration | Proxying to old site adds latency |
| Can use Vercel's built-in A/B features | More complex setup (~4-8 hours) |
| No third-party dependency | Old site must allow proxy headers |

---

### Option C: Application-Level JavaScript Redirect

**How it works:** Inject a small JavaScript snippet into the old site's pages. On first visit, the script generates a random number, assigns the user to a cohort, sets a cookie, and redirects users in the test group to the corresponding page on `exotel-docs.vercel.app`.

```
Visitor --> developer.exotel.com (old site loads)
                |
          JavaScript executes
           /            \
     90% stay on       10% redirect to
     old site          exotel-docs.vercel.app
```

| Pros | Cons |
|------|------|
| Simplest to implement (~1 hour) | Flash of old content before redirect (poor UX) |
| No DNS or infrastructure changes | URL changes visibly (breaks "same domain" experience) |
| Works regardless of hosting setup | Negative SEO impact (redirect to different domain) |
| | JavaScript-disabled users never get redirected |
| | Cannot proxy -- users see the Vercel URL |

---

### Recommendation

| Priority | Approach | When to Use |
|----------|----------|-------------|
| **First choice** | **Option A: Cloudflare Workers** | If `developer.exotel.com` DNS is already on Cloudflare or can be migrated |
| **Second choice** | **Option B: Vercel Edge Middleware** | If Cloudflare is not available and team is comfortable with Vercel Edge |
| **Fallback only** | **Option C: JS Redirect** | Only if Options A and B are blocked; not recommended for production |

**Decision required:** Confirm current DNS provider for `developer.exotel.com` to finalize implementation path.

---

## 4. Key Performance Indicators (KPIs)

All metrics are compared against a 2-week baseline measured on the old site before the rollout begins.

| Metric | Measurement Tool | Baseline (Old Site) | Target (New Site) | Threshold to Rollback |
|--------|-----------------|--------------------:|------------------:|----------------------:|
| Page load time (P95) | Vercel Analytics + Lighthouse | ~4.0s | < 2.0s | > 3.0s |
| Bounce rate | Google Analytics 4 | ~55% (est.) | < 40% | > 65% |
| Avg. time on site | Google Analytics 4 | ~2.0 min (est.) | > 3.0 min | < 1.5 min |
| Pages per session | Google Analytics 4 | ~2.0 (est.) | > 3.0 | < 1.5 |
| 404 error rate | Vercel Logs + Monitoring | N/A | < 0.5% | > 2.0% |
| AI search queries | Custom event tracking | N/A (new feature) | Track adoption rate | N/A |
| API Console usage ("Try It" clicks) | Custom event tracking | N/A (new feature) | Track adoption rate | N/A |
| Code copy button clicks | Custom event tracking | N/A | Track adoption rate | N/A |
| Newsletter signups | Newsletter API logs | Current baseline | No decrease | > 30% decrease |
| Support ticket volume (docs-related) | Support system (Freshdesk/Zendesk) | Current weekly avg. | Decrease or flat | > 20% increase |

**Note:** "Est." values must be confirmed by installing analytics on the old site during the pre-launch phase if not already present.

---

## 5. Rollback Plan

### Trigger Conditions

Initiate rollback if **any** of the following occur:

1. Any KPI degrades more than 20% from baseline for 24+ consecutive hours
2. 404 error rate exceeds 2% at any point
3. Critical functionality is broken (API Console, search, navigation)
4. Significant increase in docs-related support tickets (> 20% above baseline)
5. Reported security or availability issue on the new site

### Rollback Procedure

| Step | Action | Owner | Time to Execute |
|------|--------|-------|:---------------:|
| 1 | Change traffic split to 0% (new site) | DevOps / Infra | < 1 minute |
| 2 | Verify all traffic is routing to old site | DevOps / Infra | < 5 minutes |
| 3 | Document the incident and root cause | Engineering Lead | Within 2 hours |
| 4 | Notify stakeholders (Slack + email) | Engineering Lead | Within 1 hour |
| 5 | Fix root cause and verify in staging | Engineering Team | As needed |
| 6 | Resume rollout at previous split percentage | Engineering Lead | After fix verified |

**Rollback is instant** for Options A and B -- changing a single configuration value (the split percentage) immediately routes 100% of traffic back to the old site. No deployment, no DNS propagation delay.

---

## 6. Analytics Setup

### Pre-Launch Checklist

The following must be completed **before** Week 1 begins:

- [ ] **Google Analytics 4** property created for the new site
- [ ] **GA4 measurement ID** added to Docusaurus configuration
- [ ] **Vercel Analytics** enabled on the project (built-in, zero config)
- [ ] **Vercel Web Vitals** tracking enabled
- [ ] **Baseline metrics** captured from old site (minimum 2 weeks of data)

### Custom Event Tracking

Implement the following custom events on the new site:

| Event Name | Trigger | Data Captured |
|------------|---------|---------------|
| `ai_search_query` | User submits AI search | Query text, results count, click-through |
| `api_console_try_it` | User clicks "Try It" in API Console | Endpoint name, HTTP method, response status |
| `code_copy_click` | User clicks code copy button | Page URL, code block language |
| `newsletter_signup` | User submits newsletter form | Source page, timestamp |
| `nav_click` | User clicks sidebar navigation | Source page, destination page, nav depth |
| `feedback_submitted` | User submits page feedback | Page URL, rating, comment (if any) |
| `docs_variant` | Page load (for A/B tracking) | Variant assignment (old/new), page URL |

### Dashboard Requirements

Create a real-time monitoring dashboard (Vercel or Google Analytics) showing:

1. **Traffic split verification** -- confirm actual ratio matches configured ratio
2. **Error rate by variant** -- 404s, 5xx errors, client-side errors
3. **Core Web Vitals by variant** -- LCP, FID, CLS comparison
4. **Engagement by variant** -- bounce rate, session duration, pages per session
5. **Feature adoption** -- AI search usage, API Console usage, code copy clicks

---

## 7. Communication Plan

### Internal Communication

| Audience | Channel | Timing | Message |
|----------|---------|--------|---------|
| Engineering team | Slack #engineering | Pre-launch (Day -3) | Technical briefing: architecture, rollback procedure, on-call rotation |
| Support team | Slack #support + training session | Pre-launch (Day -2) | What's changing, how to identify which site a user is on, escalation path |
| Marketing team | Slack #marketing + email | Pre-launch (Day -1) | Timeline, what to communicate externally (if anything), SEO considerations |
| Leadership / CEO | Email + this document | Pre-launch (Day -5) | Approval request, timeline, risk assessment |
| All hands | Company Slack #general | Week 1 Day 1 | Brief announcement: "We're starting a phased rollout of our new developer docs" |

### External Communication

| Phase | Action |
|-------|--------|
| 0-25% traffic | **No external communication.** The redirect is transparent; users see the same domain. |
| 50% traffic | **Optional:** Add a subtle banner on the new site: "Welcome to our upgraded docs. Share feedback." with a feedback link. |
| 100% cutover | **Blog post / changelog entry:** "We've rebuilt our developer documentation from the ground up." Highlight AI search, API Console, faster load times. |
| Post-cutover | **Social media announcement** + email to developer mailing list (if applicable). |

---

## 8. Go/No-Go Criteria for Full Cutover (Week 4)

All criteria must be met before switching to 100% traffic on the new site.

### Must-Have (Blocking)

| # | Criterion | How to Verify | Status |
|---|-----------|---------------|--------|
| 1 | All URL redirects working (old paths to new paths) | Automated redirect test suite (run daily) | Pending |
| 2 | 404 error rate < 1% for 7 consecutive days | Vercel logs dashboard | Pending |
| 3 | Page load time P95 < 2.0s for 7 consecutive days | Vercel Analytics | Pending |
| 4 | No increase in docs-related support tickets | Support system weekly report | Pending |
| 5 | Core Web Vitals all "Good" (LCP < 2.5s, FID < 100ms, CLS < 0.1) | Google Search Console | Pending |
| 6 | SSL certificate valid on `developer.exotel.com` pointing to Vercel | Certificate check | Pending |
| 7 | All 302 pages rendering correctly | Automated page screenshot comparison | Pending |
| 8 | Search functionality operational (both standard and AI) | Manual QA + automated tests | Pending |

### Should-Have (Non-Blocking but Tracked)

| # | Criterion | How to Verify |
|---|-----------|---------------|
| 1 | Positive developer feedback from optional survey | Survey results |
| 2 | SEO: No significant drop in organic traffic to doc pages | Google Search Console (compare 30-day periods) |
| 3 | API Console tested against all documented endpoints | QA test report |
| 4 | Bounce rate on new site lower than old site | GA4 comparison report |

---

## 9. Detailed Timeline

### Pre-Launch Phase (Week 0)

| Day | Task | Owner | Deliverable |
|-----|------|-------|-------------|
| Day 1 | Confirm DNS provider for `developer.exotel.com` | Infra / DevOps | Decision on Option A vs B |
| Day 1 | Install GA4 on old site (if not present) to capture baseline | Engineering | GA4 tracking live on old site |
| Day 2 | Implement Cloudflare Worker or Vercel Edge Middleware | Engineering | Worker/middleware deployed to staging |
| Day 2 | Set up analytics and custom event tracking on new site | Engineering | Events firing in GA4 |
| Day 3 | Build monitoring dashboard | Engineering | Dashboard URL shared with team |
| Day 3 | Run full redirect test suite | QA | All redirects verified |
| Day 4 | Internal team briefings (engineering, support, marketing) | Engineering Lead | Teams briefed and prepared |
| Day 5 | Final sign-off from Engineering Lead and CEO | Engineering Lead | Go/No-Go decision |

### Rollout Phase (Weeks 1-4)

| Week | Traffic Split | Daily Actions | Weekly Review |
|------|:------------:|---------------|---------------|
| **Week 1** | **10%** | Monitor dashboard 2x daily. Check 404 logs every morning. Respond to any support escalations within 2 hours. | Friday review: compare KPIs against baseline. Go/No-Go for 25%. |
| **Week 2** | **25%** | Monitor dashboard 1x daily. Continue 404 log review. Collect any user feedback. | Friday review: compare KPIs. Check SEO impact in Search Console. Go/No-Go for 50%. |
| **Week 3** | **50%** | Standard monitoring. Enable feedback banner on new site. Begin DNS cutover planning. | Friday review: full KPI review. Prepare DNS migration plan. Go/No-Go for 100%. |
| **Week 4** | **100%** | Execute DNS cutover: point `developer.exotel.com` to Vercel. Remove traffic splitting infrastructure. | Confirm full cutover successful. Begin old site decommission planning. |

### Post-Cutover Phase (Week 5+)

| Task | Timeline | Owner |
|------|----------|-------|
| Monitor SEO rankings and organic traffic | Weeks 5-8 | Marketing / SEO |
| Decommission old site infrastructure | Week 6 (after 2 weeks at 100%) | DevOps |
| Publish blog post / changelog | Week 5 | Marketing |
| Review support ticket trends (30-day comparison) | Week 8 | Support Lead |
| Final retrospective | Week 8 | Engineering Lead |

---

## 10. Risk Assessment

| # | Risk | Likelihood | Impact | Mitigation Strategy |
|---|------|:----------:|:------:|---------------------|
| 1 | **SEO ranking drop** after domain migration | Medium | High | Implement 301 redirects for all old URLs. Set canonical tags. Submit updated sitemap to Google Search Console. Monitor rankings weekly. |
| 2 | **Broken inbound links** from external sites, blog posts, Stack Overflow answers | Medium | Medium | Implement catch-all redirect rule: any unmatched old URL redirects to the closest matching new page or to the docs homepage. Monitor 404 logs daily. |
| 3 | **API Console bugs** on new site causing developer friction | Low | Medium | Extensive QA before launch. Maintain ability to link to old API reference as fallback during rollout. |
| 4 | **User confusion** from seeing two different UIs | Low | Low | Cookie-based sticky sessions ensure a user always sees the same version. Session cookie lasts 30 days. |
| 5 | **Cloudflare Worker / Edge Middleware failure** | Low | High | Set up health check monitoring on the Worker/middleware. If it fails, traffic falls through to old site by default (fail-safe). |
| 6 | **Analytics discrepancy** between old and new site | Medium | Low | Use the `docs_variant` custom event to segment all analytics by variant. Verify data integrity in Week 0. |
| 7 | **SSL certificate issues** when mapping custom domain to Vercel | Low | High | Provision and verify SSL certificate in pre-launch phase. Vercel handles automatic SSL for custom domains. |
| 8 | **Performance regression** under increased traffic load | Low | Medium | Vercel's edge network handles scaling automatically. Run load test at 2x expected traffic before Week 3. |

---

## 11. Resource Requirements

| Resource | Estimated Effort | Who |
|----------|:----------------:|-----|
| Cloudflare Worker / Edge Middleware implementation | 4-8 hours | Backend / DevOps Engineer |
| Analytics and custom event setup | 4-6 hours | Frontend Engineer |
| Monitoring dashboard creation | 2-4 hours | Frontend / DevOps Engineer |
| Redirect test suite (automated) | 4-6 hours | QA Engineer |
| Daily monitoring (Weeks 1-4) | 30 min/day | On-call Engineer (rotating) |
| Weekly review meetings | 1 hour/week | Engineering Lead + stakeholders |
| **Total estimated effort** | **~30-40 hours** | Spread across 2-3 engineers over 5 weeks |

---

## 12. Decision Log

Use this table to record decisions made at each phase gate.

| Date | Phase | Decision | Rationale | Decided By |
|------|-------|----------|-----------|------------|
| _TBD_ | Pre-launch | Implementation approach (A, B, or C) | _Based on DNS provider_ | Engineering Lead |
| _TBD_ | Week 1 review | Advance to 25% / Hold / Rollback | _Based on KPI review_ | Engineering Lead + CEO |
| _TBD_ | Week 2 review | Advance to 50% / Hold / Rollback | _Based on KPI review_ | Engineering Lead + CEO |
| _TBD_ | Week 3 review | Advance to 100% / Hold / Rollback | _Based on KPI review_ | Engineering Lead + CEO |
| _TBD_ | Week 4 | Full cutover complete | _All Go/No-Go criteria met_ | Engineering Lead + CEO |

---

## 13. Three-Site Consolidation Context (Updated March 6, 2026)

This A/B test is the first phase of a broader three-site consolidation:

### Current State: 3 Separate Platforms

| Platform | Technology | Pages | Monthly Cost | Status |
|----------|-----------|:-----:|:------------:|--------|
| developer.exotel.com | WordPress | ~105 | $50-100 | **A/B test target (Phase 1)** |
| support.exotel.com | Freshdesk KB | ~200 | Included in Freshdesk | **Content already migrated** |
| docs.exotel.com | Archbee SaaS | ~150 | $300-500 | Phase 2 (product-specific docs) |

### Target State: 1 Unified Platform

| Platform | Technology | Pages | Monthly Cost | Status |
|----------|-----------|:-----:|:------------:|--------|
| developer.exotel.com | Docusaurus on Vercel | **302** | $0-10 | **Ready for A/B test** |

### Content Migration Status

| Source | Pages Migrated | Status |
|--------|:--------------:|--------|
| developer.exotel.com (93 API docs) | 93/93 (100%) | Complete |
| support.exotel.com (209 articles) | 209/209 (100%) | Complete |
| docs.exotel.com (Contact Center, AI) | 0/~120 | Phase 2 (weeks 5-8) |

### What the A/B Test Validates

1. **URL compatibility** — All old developer.exotel.com paths redirect correctly to new paths
2. **Performance improvement** — Page load drops from ~4s to < 1.5s under real traffic
3. **Developer engagement** — AI search, API Console, multi-language tabs increase time-on-site
4. **SEO preservation** — No ranking drop during transition (monitored via Search Console)
5. **Support ticket impact** — Combined developer + support content reduces ticket volume

See the [Comparative Study](./COMPARATIVE-STUDY-Three-Platform-Analysis.md) for the full business and engineering analysis comparing all three platforms.

---

## Appendix A: Redirect Map (Sample)

The complete redirect map should be maintained as a separate document. Below is a representative sample:

| Old URL Path | New URL Path | Status |
|-------------|-------------|:------:|
| `/getting-started` | `/docs/getting-started` | Verified |
| `/rest-api/call` | `/docs/api-reference/calls` | Verified |
| `/rest-api/sms` | `/docs/api-reference/sms` | Verified |
| `/exoml/` | `/docs/exoml/overview` | Verified |
| `/faq` | `/docs/faq` | Verified |
| `/applet/connect` | `/docs/app-bazaar/connect-applet-guide` | Verified |
| `/applet/passthru` | `/docs/app-bazaar/passthru-applet-guide` | Verified |
| _... (42+ total redirects for developer.exotel.com)_ | | |
| _... (200+ support.exotel.com paths mapped to /docs/ equivalents)_ | | |

---

## Appendix B: Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| CEO | | | |
| VP Engineering | | | |
| Engineering Lead | | | |
| DevOps Lead | | | |

---

*This document is version 2.0. Last updated March 6, 2026. Updated to reflect 302-page site consolidating developer.exotel.com + support.exotel.com.*
