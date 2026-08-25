---
id: overview
title: Voice v1
description: "Exotel Voice v1 API — make calls, build IVR flows, connect numbers, and manage call routing programmatically."
sidebar_label: Overview
slug: /voice-v1/overview
displayed_sidebar: voiceSidebar
---

# Voice v1 API

:::note
To place or look up a call, start at [Voice](/docs/voice).
:::

Voice v1 APIs work without any user (call centre agent) context — they don't need a user to be added to the Exotel dashboard. Use these APIs for simple call automation, number-to-number connection, and IVR flows.

## Base URL

```
https://<api_key>:<api_token>@<subdomain>/v1/Accounts/<account_sid>/
```

| Data Center | Subdomain |
|------------|-----------|
| Singapore | `api.exotel.com` |
| Mumbai | `api.in.exotel.com` |

## Authentication

HTTP Basic Authentication using your API key and token from the [Exotel Dashboard](https://my.exotel.com) → **Settings → API Settings**.

```bash
curl 'https://<api_key>:<api_token>@api.exotel.com/v1/Accounts/<your_sid>/Calls.json'
```

## Rate Limits

Voice APIs are limited to **200 calls per minute**. Exceeding this returns HTTP `429`.

## API Reference

| API | Method | Endpoint | Description |
|-----|--------|----------|-------------|
| [Connect Two Numbers](/docs/voice-v1/api-reference/connect-two-numbers) | POST | `/v1/Accounts/{account_sid}/Calls/connect` | Connect two phone numbers |
| [Connect Number to Call Flow](/docs/voice-v1/api-reference/connect-to-flow) | POST | `/v1/Accounts/{account_sid}/Calls/connect` | Connect a number to an IVR flow |
| [Call Details](/docs/voice-v1/api-reference/call-details) | GET | `/v1/Accounts/{account_sid}/Calls/{call_sid}` | Get call details (single & bulk) |
| [Number Metadata](/docs/voice-v1/api-reference/number-metadata) | GET | `/v1/Accounts/{account_sid}/Numbers/{number}` | Get telecom info for Indian numbers |
| [Program Incoming Call](/docs/voice-v1/api-reference/incoming-call) | — | — | Configure incoming call flows with applets |
| [StatusCallback](/docs/voice-v1/api-reference/status-callback) | — | — | Webhook reference for call events |

## Applets (Call Flow Building Blocks)

Applets are modular components used to build call flows for incoming calls:

| Applet | Purpose |
|--------|---------|
| [Greeting](/docs/voice-v1/applets/greeting) | Play a recorded voice message or text-to-speech |
| [Connect](/docs/voice-v1/applets/connect) | Route calls to phone numbers |
| [Passthru](/docs/voice-v1/applets/passthru) | Dynamic routing via your application URL |
| [Transfer](/docs/voice-v1/applets/transfer) | Transfer between call flows |
| [IVR Menu](/docs/voice-v1/applets/ivr-menu) | Interactive voice menu with DTMF input |
| [Voicemail](/docs/voice-v1/applets/voicemail) | Allow callers to leave messages |
| [Hangup](/docs/voice-v1/applets/hangup) | Terminate the call |
| [SMS](/docs/voice-v1/applets/sms) | Send SMS during a call flow |
| [Email](/docs/voice-v1/applets/email) | Send email notifications |

## Call Status Values

| Status | Description |
|--------|-------------|
| `queued` | Waiting to be sent to operator |
| `in-progress` | Call is active |
| `completed` | Ended normally |
| `failed` | Could not be completed |
| `busy` | Busy signal received |
| `no-answer` | Not answered within timeout |

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `400` | Bad Request — Invalid parameters |
| `401` | Unauthorized |
| `429` | Rate limit exceeded |

## Related APIs

- [Voice v2 (CCM)](/docs/voice-api/getting-started/overview) — Agent-context calls via Contact Center Management
- [Voice v3 (Beta)](/docs/voice-v3/overview) — Enhanced call details
- [ExoPhones](/docs/exophones/overview) — Manage virtual phone numbers
