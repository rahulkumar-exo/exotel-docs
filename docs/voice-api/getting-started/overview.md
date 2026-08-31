---
id: overview
title: Voice v2
description: Overview of the Exotel Voice v2 (CCM) API for making calls with agent context, including key differences from Voice v1 and base URLs.
sidebar_label: Overview
sidebar_position: 1
displayed_sidebar: voiceSidebar
---

# Voice v2 API (CCM)

:::note
To connect an agent to a customer, see [Connect Agent to Customer](/docs/voice-v3/api-reference/make-a-call). For other Voice work, start at [Voice](/docs/voice).
:::

Voice v2 APIs use the Contact Center Management (CCM) platform to make calls with **agent/user context**. Unlike Voice v1 (which works without user context), Voice v2 requires users to be added as co-workers in the Exotel dashboard.

:::info Deprecated
Voice v2 is deprecated. For new integrations, use [Voice v3](/docs/voice-v3/overview) for enhanced call details. Existing v2 integrations continue to work.
:::

## Key Differences from Voice v1

| Feature | Voice v1 | Voice v2 (CCM) |
|---------|----------|-----------------|
| **Endpoint prefix** | `/v1/Accounts/` | `/v2/accounts/` |
| **Base domain** | `api.exotel.com` | `ccm-api.exotel.com` |
| **User context** | Not required | Required — agents must be in dashboard |
| **Agent devices** | N/A | Phone, SIP, or WebRTC |
| **Request format** | Form-encoded | JSON |
| **Call direction** | Agent→Customer (From→To) | Agent→Customer (from→to as JSON objects) |

## Base URL

```
https://<api_key>:<api_token>@<ccm_subdomain>/v2/accounts/<account_sid>/
```

### Regional Endpoints

| Region | CCM Subdomain |
|--------|---------------|
| Singapore | `ccm-api.exotel.com` |
| Mumbai | `ccm-api.in.exotel.com` |

## Authentication

HTTP Basic Authentication using your API key and token from **Exotel Dashboard > Settings > API Settings**.

## Prerequisites

1. Users must be added as **co-workers** in the Exotel dashboard
2. Agent devices must be **ON** and in **available** status (not busy)
3. Phone numbers must be in **E.164 format**
4. Audio files should be **WAV format**, recommended under 2MB

## API Reference

| API | Method | Description |
|-----|--------|-------------|
| [Connect Agent to Customer](/docs/voice-v3/api-reference/make-a-call) | POST | Connect an agent to a customer |
| [Call Details](/docs/voice-api/api-reference/call-details) | GET | Get call details by call SID |

## Call States

| State | Description |
|-------|-------------|
| `active` | Call is ongoing or post-call processing pending |
| `terminal` | Call completed and all data processed |

## Call Statuses

| Status | Description |
|--------|-------------|
| `completed` | Call connected and ended normally |
| `agent_unanswered` | Agent did not answer |
| `customer_unanswered` | Customer did not answer |
| `agent_canceled` | Agent canceled the call |
| `customer_no_dial` | Could not dial customer |
| `agent_no_dial` | Could not dial agent |

## Error Codes

| HTTP Code | Error Code | Description |
|-----------|-----------|-------------|
| `401` | `1010` | Authentication failed |
| `404` | `10731` | User not found |
| `409` | `1012` | User device unavailable |
| `409` | `10705` | User device unverified |
| `409` | `10706` | User device busy |
| `404` | `10716` | Virtual number not found |
| `500` | `1100` | Internal Server Error |

## Related APIs

- [Voice v1](/docs/voice-v1/overview) — Legacy voice APIs (no user context required)
- [Voice v3 (Beta)](/docs/voice-v3/overview) — Enhanced call details
