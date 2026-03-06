---
title: Go-Live Checklist
description: "Production readiness checklist for launching Exotel in production. Verify DNS, scaling, monitoring, security, and compliance before go-live."
sidebar_label: Go-Live Checklist
sidebar_position: 12
---

# Go-Live Checklist

Before launching your Exotel integration in production, work through this checklist to ensure your setup is reliable, secure, and scalable. Each section covers critical areas that should be verified before handling live customer traffic.

## Account & Compliance

| Item | Status | Notes |
|------|--------|-------|
| KYC verification complete | | Required for production access |
| Account upgraded from trial to paid plan | | Trial limitations removed |
| Billing payment method configured | | Credit card, debit card, or net banking |
| Auto-recharge enabled | | Prevents service interruptions |
| Sufficient credits loaded | | Budget for first month of expected usage |
| DLT Entity ID registered (SMS, India) | | Required for all SMS in India |
| DLT templates approved (SMS, India) | | All message templates must be pre-approved |
| DLT Sender IDs registered | | Associated with your templates |
| TRAI calling hours configured | | Campaigns scheduled within 9 AM -- 9 PM IST |
| DND/NDNC filtering verified | | Contact lists scrubbed against NDNC registry |

## ExoPhones & Call Flows

| Item | Status | Notes |
|------|--------|-------|
| Production ExoPhones purchased | | Replace trial numbers with production DIDs |
| Call flows assigned to all ExoPhones | | Every ExoPhone must have an active flow |
| Call flows tested end-to-end | | Test every IVR path, routing option, and fallback |
| Call recording consent configured | | Greeting plays consent message before recording |
| Voicemail fallback configured | | Calls are handled when agents are unavailable |
| Agent phone numbers verified | | All agent numbers correct and active |
| Ring timeouts appropriate | | 15-30 seconds recommended |

:::tip
Create dedicated production ExoPhones separate from your trial numbers. If you used trial numbers during development, switch to production numbers before publishing them to customers.
:::

## API Integration

| Item | Status | Notes |
|------|--------|-------|
| Production API credentials configured | | Not trial credentials |
| Correct regional API base URL | | `api.exotel.com` (Singapore) or `api.in.exotel.com` (India) |
| Credentials stored securely | | Environment variables or secrets manager; not in code |
| `.env` file added to `.gitignore` | | Prevents credential exposure |
| API error handling implemented | | Handle 401, 403, 404, 429, 500 responses |
| Rate limiting / retry logic in code | | Exponential backoff for 429 errors |
| Timeout handling configured | | Set reasonable HTTP timeouts (30 seconds) |
| API response validation | | Verify expected response structure before processing |

## Webhooks

| Item | Status | Notes |
|------|--------|-------|
| Webhook endpoints publicly accessible | | No firewall or VPN blocking |
| HTTPS endpoints (not HTTP) | | Encrypted transport required |
| Endpoints return HTTP 200 within 5 seconds | | Fast acknowledgment prevents delivery failures |
| Async processing implemented | | Queue webhook payloads; process asynchronously |
| Idempotency handling | | Use CallSid/SmsSid as dedup keys |
| Webhook failure alerting | | Monitor for delivery failures |
| All callback URLs configured | | `call_status_callback`, `sms_status_callback`, `status_callback` |

:::warning
Webhook endpoints that consistently fail (non-200 responses or timeouts) may be deactivated by Exotel. Monitor your webhook endpoint's health with uptime checks and error alerts.
:::

## Security

| Item | Status | Notes |
|------|--------|-------|
| API credentials not in source code | | Use environment variables |
| API Token rotated from development token | | Generate fresh production token |
| IP allowlisting configured (if applicable) | | Enterprise feature for additional security |
| Webhook signature validation | | Verify webhook authenticity |
| Call recording access restricted | | Only authorized personnel can access recordings |
| SSO configured (if applicable) | | Enterprise SAML/OAuth integration |
| Team access review completed | | Verify user roles and permissions |

## Scaling & Performance

| Item | Status | Notes |
|------|--------|-------|
| Expected call volume estimated | | Concurrent calls and calls per minute |
| Account capacity sufficient | | Default: 60 calls/min, 300 SMS/min |
| Capacity increase requested (if needed) | | Contact support before go-live |
| Campaign throttle settings configured | | Prevent capacity overload |
| Database sized for webhook volume | | Each call generates 3-5 webhook events |
| Webhook endpoint can handle peak load | | Test with expected concurrent connections |
| Auto-scaling configured for your servers | | Handle traffic spikes from large campaigns |

### Capacity Planning

Estimate your capacity needs:

| Metric | Calculation | Example |
|--------|-------------|---------|
| Peak concurrent calls | (calls per minute) x (avg call duration in minutes) | 60 CPM x 2 min = 120 concurrent |
| Daily call volume | (calls per minute) x (operating hours) x 60 | 60 CPM x 8 hrs x 60 = 28,800 calls |
| Webhook events per day | (daily calls) x 4 events per call | 28,800 x 4 = 115,200 events |
| SMS per day | Campaign volume + transactional volume | Varies |

:::info
If your estimated peak concurrent calls exceed your plan's limit, request a capacity increase at least 1 week before go-live. Exotel needs time to provision additional capacity for your account.
:::

## Monitoring & Alerting

| Item | Status | Notes |
|------|--------|-------|
| Credit balance monitoring | | Alert when balance drops below threshold |
| Webhook delivery monitoring | | Track success/failure rates |
| Call quality monitoring | | Monitor duration, connect rates, error rates |
| API error rate monitoring | | Alert on elevated 4xx or 5xx rates |
| Campaign completion monitoring | | Track campaign progress and failures |
| Uptime monitoring for webhook endpoints | | External health checks every minute |
| Dashboard access for operations team | | Supervisors can monitor real-time activity |

### Recommended Alerts

| Alert | Trigger | Action |
|-------|---------|--------|
| Low credit balance | Balance < INR 1,000 | Add credits immediately |
| High API error rate | > 5% errors in 5 minutes | Investigate; check credentials and rate limits |
| Webhook delivery failures | > 10% failures in 10 minutes | Check endpoint health; fix and re-deploy |
| Campaign connect rate drop | Below 25% for 30 minutes | Pause campaign; review list quality and timing |
| No calls in expected window | Zero calls for 15 minutes during business hours | Verify ExoPhones and call flows are active |

## Documentation & Runbooks

| Item | Status | Notes |
|------|--------|-------|
| Integration architecture documented | | API flow, webhook handling, data flow |
| Runbooks for common issues | | Steps for credential rotation, campaign management |
| Escalation contacts documented | | Exotel support, account manager, internal team |
| Exotel support channel established | | support.exotel.com, hello@exotel.com |
| Team trained on dashboard usage | | Supervisors and agents know their tools |

## Pre-Launch Verification

Before flipping the switch to production:

1. **Run a pilot campaign** with 50-100 real contacts
2. **Verify end-to-end flow** from API call to webhook to CRM
3. **Check all integrations** (CRM, helpdesk, analytics)
4. **Confirm billing** is set up and auto-recharge works
5. **Validate compliance** (DLT, DND, calling hours)
6. **Brief your team** on the new system and escalation procedures

## Post-Launch Monitoring

During the first 48 hours after go-live:

| Check | Frequency | What to Look For |
|-------|-----------|-----------------|
| Credit balance | Every 2 hours | Unexpected depletion rate |
| Call connect rate | Every hour | Sudden drops below baseline |
| SMS delivery rate | Every hour | DLT rejections or delivery failures |
| Webhook health | Continuous | Delivery failures or timeouts |
| Customer complaints | Continuous | Incorrect routing, wrong caller ID, spam reports |
| Campaign progress | Per campaign | On-track completion |

---

## Quick Reference: Support Contacts

| Channel | Contact |
|---------|---------|
| Support portal | [support.exotel.com](https://support.exotel.com) |
| Email support | hello@exotel.com |
| Dashboard chat | Bottom-right corner of [my.exotel.com](https://my.exotel.com) |
| Account manager | As assigned during onboarding |
| Emergency support | Contact your account manager directly |

## Next Steps

- [Regions & Availability](/docs/getting-started/regions-availability) -- Understand regional options
- [Browser Requirements](/docs/getting-started/browser-requirements) -- WebRTC and dashboard compatibility
- [Voice API Quickstart](/docs/voice-v1/quickstart) -- Start building with the Voice API
- [Campaign Guides](/docs/campaign-guides/overview) -- Launch your first production campaign
