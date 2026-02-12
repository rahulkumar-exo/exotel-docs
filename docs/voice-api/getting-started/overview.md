---
id: overview
title: Voice v2
sidebar_label: Overview
sidebar_position: 1
---

# Voice API Overview

Exotel's Voice API lets you programmatically make and receive phone calls, build interactive voice response (IVR) systems, and manage call flows using a simple REST API.

## What You Can Do

- **Make outbound calls** — Connect two phone numbers or route a call to an IVR flow
- **Handle inbound calls** — Configure call flows on your ExoPhones using applets
- **Get call details** — Retrieve call status, duration, recordings, and pricing
- **Manage ExoPhones** — Provision, configure, and release virtual phone numbers
- **Build IVR flows** — Combine applets (Greeting, Connect, Passthru, Transfer, etc.) to create complex call workflows
- **Receive webhooks** — Get real-time notifications when calls complete via StatusCallback

## Base URL

All API requests use HTTP Basic authentication and are made to one of the following regional endpoints:

| Region    | Subdomain              |
|-----------|------------------------|
| Singapore | `@api.exotel.com`      |
| Mumbai    | `@api.in.exotel.com`   |

```
https://<api_key>:<api_token><subdomain>/v1/Accounts/<account_sid>/
```

## Rate Limits

Voice APIs are rate-limited to **200 requests per minute**. Exceeding this limit returns HTTP `429 Too Many Requests`.

## Response Formats

All endpoints support both **JSON** and **XML** responses. Append `.json` to the endpoint URL for JSON format.

## Next Steps

- [Set up authentication](/docs/voice-api/getting-started/authentication) to make your first API call
- [Make a call](/docs/voice-api/api-reference/make-a-call) to connect two phone numbers
- Learn about [Applets](/docs/voice-api/applets/greeting) to build IVR call flows
