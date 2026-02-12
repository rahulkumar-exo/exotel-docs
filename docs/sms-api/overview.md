---
id: overview
title: SMS
sidebar_label: Overview
sidebar_position: 1
---

# SMS API

Send single and bulk SMS messages programmatically using Exotel's SMS API. Supports transactional, promotional, and OTP messages with DLT compliance for India.

## Base URL

```
https://<api_key>:<api_token><subdomain>/v1/Accounts/<account_sid>/Sms/send
```

### Regional Endpoints

| Region    | Subdomain              |
|-----------|------------------------|
| Singapore | `@api.exotel.com`      |
| Mumbai    | `@api.in.exotel.com`   |

## Capabilities

- **Single SMS** — Send a message to one recipient
- **Bulk SMS (Static)** — Same message to multiple recipients
- **Bulk SMS (Dynamic)** — Unique messages to different recipients (max 100 per request)
- **URL Shortening** — Shorten links and track clicks
- **Delivery Status** — Real-time webhooks for delivery confirmation

## Rate Limits

| Limit                | Value              |
|----------------------|--------------------|
| API calls            | 200 requests/min   |
| Bulk SMS per request | 100 messages max   |

## DLT Compliance (India)

For sending SMS in India, you must register with a DLT (Distributed Ledger Technology) portal and provide:

- **DLT Entity ID** — Your registered entity ID (mandatory)
- **DLT Template ID** — Approved template ID (required for template-based messages)
- **Sender ID** — Approved header registered with DLT

:::note
DLT registration is mandatory for all SMS sent to Indian phone numbers as per TRAI regulations.
:::

## SMS Types

| Type                    | Description                                      |
|-------------------------|--------------------------------------------------|
| `transactional`         | OTP, alerts, order updates — sent anytime        |
| `transactional_opt_in`  | Transactional with user opt-in                   |
| `promotional`           | Marketing messages — time-window restricted       |

## Quick Start

1. Get your API credentials from the [Exotel Dashboard](https://my.exotel.com/apisettings/site#api-credentials)
2. Register for DLT (India only)
3. Use the [Send SMS](/docs/sms-api/api-reference/send-sms) endpoint to send your first message
