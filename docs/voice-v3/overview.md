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
| [Connect Two Numbers](/docs/voice-v3/api-reference/connect-two-numbers) | POST | `/v1/accounts/{sid}/Calls/connect` | Initiate an outbound call connecting two numbers |
| [Call Details](/docs/voice-v3/api-reference/call-details) | GET | `/v3/accounts/{sid}/calls/{call_sid}` | Get enhanced call details |
| [Active Streams](/docs/voice-v3/api-reference/active-stream-monitoring) | GET | `/v3/accounts/{sid}/calls/active` | Monitor active call streams |
| [Voice Logs](/docs/voice-v3/api-reference/voice-log-download) | GET | `/v3/accounts/{sid}/calls/{call_sid}/voice-logs` | Download voice recordings |

## Outbound & Inbound Call APIs

Voice v3 focuses on enhanced reporting and monitoring. Call initiation uses the Voice v1 endpoint, which is fully production-grade and compatible alongside v3 reporting.

### Connect Two Numbers {#call-to-connect-two-numbers}

To programmatically connect two phone numbers (e.g., agent ↔ customer), use the **Connect Two Numbers** API.

→ **[Connect Two Numbers — full parameters, code examples & response reference](/docs/voice-v3/api-reference/connect-two-numbers)**

**Quick reference:**

| Parameter | Required | Description |
|-----------|----------|-------------|
| `From` | ✅ | Agent / dialler number (E.164 preferred) |
| `To` | ✅ | Customer phone number (E.164 preferred) |
| `CallerId` | ✅ | Your Exotel ExoPhone / virtual number |
| `Record` | Optional | `true` to record the call |
| `TimeLimit` | Optional | Max duration in seconds (max 14400) |
| `StatusCallback` | Optional | Webhook URL for call status updates |
| `CustomField` | Optional | Custom metadata string (max 128 chars) |
| `WaitUrl` | Optional | Audio played while waiting for answer |
| `StreamUrl` | Optional | WebSocket URL for real-time audio streaming |

**Endpoint:** `POST /v1/Accounts/{sid}/Calls/connect`

After the call is placed, use the returned `CallSid` with [Call Details (v3)](/docs/voice-v3/api-reference/call-details) for enhanced reporting.

Connect-to-Flow is also available if you want to drop the call into an App Bazaar IVR flow:

→ **[Connect to Flow](/docs/voice-v1/api-reference/connect-to-flow)**

### Incoming Calls {#call-incoming}

To handle incoming calls (call routing, ExoML responses, agent forwarding), use the Voice v1 **Incoming Call** API:

→ **[Incoming Call API](/docs/voice-v1/api-reference/incoming-call)**

For real-time delivery status of incoming/outgoing calls, configure the [Status Callback](/docs/voice-v1/api-reference/status-callback) webhook.

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
