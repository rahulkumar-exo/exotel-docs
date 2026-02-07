---
id: overview
title: WhatsApp API Overview
sidebar_label: Overview
sidebar_position: 1
---

# WhatsApp API

Send and receive WhatsApp messages programmatically using Exotel's WhatsApp Business API. Supports text, media, templates, interactive messages, and payments.

## Base URL

```
https://<api_key>:<api_token><subdomain>/v2/accounts/<account_sid>/messages
```

### Regional Endpoints

| Region    | Subdomain              |
|-----------|------------------------|
| Singapore | `@api.exotel.com`      |
| Mumbai    | `@api.in.exotel.com`   |

## Supported Message Types

| Type          | Description |
|---------------|-------------|
| `text`        | Plain text messages |
| `image`       | Image with optional caption |
| `audio`       | Audio files |
| `video`       | Video with optional caption |
| `document`    | PDF, DOC, and other document types |
| `sticker`     | WhatsApp stickers |
| `location`    | Geographic coordinates with address |
| `contact`     | Contact cards (vCard) |
| `interactive` | Buttons and list menus |
| `template`    | Pre-approved message templates |

## Key Features

- **Template Messages** — Send pre-approved templates with dynamic parameters
- **Interactive Messages** — Buttons, list menus, and call-to-action
- **Bulk Messaging** — Up to 100 messages per API call
- **Payment Collection** — Collect payments via WhatsApp (India, UPI/RazorPay/PayU)
- **Flows** — Interactive multi-step forms (Beta)
- **Webhooks** — Real-time delivery reports and inbound message notifications

## Delivery Status Codes

| Code  | Status       | Description |
|-------|--------------|-------------|
| 30001 | Sent         | Message sent to WhatsApp |
| 30002 | Delivered    | Message delivered to recipient |
| 30003 | Seen         | Recipient read the message |
| 30004–30041 | Failed | Various error conditions |

## Quick Start

1. Get your API credentials from the [Exotel Dashboard](https://my.exotel.com/apisettings/site#api-credentials)
2. Get a WhatsApp-enabled phone number from Exotel
3. Create message templates in the WhatsApp Business Manager
4. Use the [Send Message](/docs/whatsapp-api/api-reference/send-message) endpoint
