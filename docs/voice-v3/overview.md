---
id: overview
title: Voice v3
description: Overview of the Exotel Voice v3 API (Beta) with enhanced call details, active stream monitoring, voice log downloads, and Legs API integration.
sidebar_label: Overview
slug: /voice-v3/overview
---

# Voice v3 (Beta)

Voice v3 is the latest iteration of the Exotel Voice API, providing enhanced call management capabilities with improved call detail reporting, active stream monitoring, and voice log downloads.

:::note Beta
Voice v3 APIs are currently in **Beta**. Some features may change as we finalize the API contracts.
:::

## Key Features

- **Call Details (Beta)** — Enhanced call detail records with richer metadata including recordings, DTMF digits, and flow information
- **Active Stream Monitoring** — Real-time monitoring of active call streams
- **Voice Log Download** — Download voice recordings and call logs programmatically
- **Legs API Integration** — Works with the Legs & Bridges API for advanced call flows

## Base URL

| Data Center | Base URL |
|------------|----------|
| Singapore | `https://<api_key>:<api_token>@ccm-api.exotel.com/v3/accounts/<account_sid>` |
| Mumbai | `https://<api_key>:<api_token>@ccm-api.in.exotel.com/v3/accounts/<account_sid>` |

## Authentication

All requests require **HTTP Basic Authentication** using your API key and token from the [Exotel Dashboard](https://my.exotel.com) → **Settings → API Settings**.

```bash
curl -X GET \
  'https://<api_key>:<api_token>@ccm-api.exotel.com/v3/accounts/<account_sid>/calls/<call_sid>' \
  -H 'Content-Type: application/json'
```

## API Endpoints

| API | Method | Endpoint | Description |
|-----|--------|----------|-------------|
| [Call Details](/docs/voice-v3/api-reference/call-details) | GET | `/v3/accounts/{sid}/calls/{call_sid}` | Get enhanced call details |
| [Active Streams](/docs/voice-v3/api-reference/active-stream-monitoring) | GET | `/v3/accounts/{sid}/calls/active` | Monitor active call streams |
| [Voice Logs](/docs/voice-v3/api-reference/voice-log-download) | GET | `/v3/accounts/{sid}/calls/{call_sid}/voice-logs` | Download voice recordings |

## Call States

| State | Description |
|-------|-------------|
| `active` | Call is ongoing or post-call processing pending |
| `terminal` | Call completed and all data processed |

## Call Statuses

| Status | Description |
|--------|-------------|
| `completed` | Call connected and ended normally |
| `from_leg_unanswered` | From-leg (agent) did not answer |
| `to_leg_unanswered` | To-leg (customer) did not answer |
| `from_leg_cancelled` | From-leg canceled the call |
| `to_leg_no_dial` | Could not dial the to-leg |
| `from_leg_no_dial` | Could not dial the from-leg |

## Migration from v2

Voice v3 uses the same `ccm-api` domain as v2. Key differences:

| Feature | v2 | v3 |
|---------|----|----|
| Endpoint prefix | `/v2/accounts/` | `/v3/accounts/` |
| Call detail fields | Standard | Enhanced with `app_id`, `app_name`, `digits`, `recordings` |
| Active monitoring | Not available | Real-time stream monitoring |
| Voice log download | Via recording URL only | Dedicated API endpoint |
| Status naming | `agent_unanswered` | `from_leg_unanswered` |

## Related APIs

- [Voice v2 (CCM)](/docs/voice-api/getting-started/overview) — Deprecated but still functional
- [Voice v1](/docs/voice-v1/overview) — Legacy voice APIs
- [Legs & Bridges](/docs/legs/overview) — Low-level call leg management
