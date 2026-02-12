---
id: overview
title: Voice v3
sidebar_label: Overview
slug: /voice-v3/overview
---

# Voice v3 (Beta)

Voice v3 is the latest iteration of the Exotel Voice API, providing enhanced call management capabilities with improved call detail reporting, active stream monitoring, and voice log downloads.

:::note Beta
Voice v3 APIs are currently in **Beta**. Some features may change as we finalize the API contracts.
:::

## Key Features

- **Call Details (Beta)** — Enhanced call detail records with richer metadata
- **Active Stream Monitoring** — Real-time monitoring of active call streams
- **Voice Log Download** — Download voice recordings and call logs programmatically
- **Legs API Integration** — Works with the Legs & Bridges API for advanced call flows

## Base URL

| Data Center | Base URL |
|------------|----------|
| Singapore | `https://<api_key>:<api_token>@api.exotel.com/v3/accounts/<account_sid>` |
| Mumbai | `https://<api_key>:<api_token>@api.in.exotel.com/v3/accounts/<account_sid>` |

## Authentication

All requests require **HTTP Basic Authentication** using your API key and token from the [Exotel Dashboard](https://my.exotel.com).

```bash
curl -X GET \
  https://<api_key>:<api_token>@api.exotel.com/v3/accounts/<account_sid>/calls \
  -H 'Content-Type: application/json'
```

## API Endpoints

| API | Method | Endpoint | Description |
|-----|--------|----------|-------------|
| **Call Details** | GET | `/v3/accounts/{sid}/calls/{call_sid}` | Get enhanced call details |
| **Bulk Call Details** | GET | `/v3/accounts/{sid}/calls` | Retrieve multiple call records |
| **Active Streams** | GET | `/v3/accounts/{sid}/calls/active` | Monitor active call streams |
| **Voice Logs** | GET | `/v3/accounts/{sid}/calls/{call_sid}/voice-logs` | Download voice recordings |

## Migration from v2

Voice v3 is backward-compatible with v2 endpoints. Key differences:

| Feature | v2 | v3 |
|---------|----|----|
| Call detail fields | Standard | Enhanced with additional metadata |
| Active monitoring | Not available | Real-time stream monitoring |
| Voice log download | Via recording URL only | Dedicated API endpoint |
| Response format | JSON | JSON with pagination support |

## Related APIs

- [Voice v2](/docs/voice-api/getting-started/overview) — Production-stable voice APIs
- [Voice v1](/docs/voice-v1/overview) — Legacy voice APIs
- [Legs & Bridges](/docs/legs/overview) — Low-level call leg management
