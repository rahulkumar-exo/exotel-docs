---
id: overview
title: WhatsApp Template Management
sidebar_label: Overview
slug: /whatsapp-api/templates-api/overview
---

# WhatsApp Template Management APIs

Create, retrieve, edit, and delete message templates for your WhatsApp Business Account (WABA).

## Base URL

```
https://<api_key>:<api_token>@<subdomain>/v2/accounts/<account_sid>/templates
```

## Supported Template Types

| Type | Description |
|------|-------------|
| **Text** | Standard text with header, body, footer and variables |
| **Carousel** | Up to 10 scrollable cards with media and buttons (Marketing only) |
| **Limited-Time Offer** | Includes expiration timer (Marketing only) |
| **Authentication** | OTP delivery with One-Tap, Copy Code, or Zero-Tap |
| **Calling Permission** | Request consent for business-initiated calls |

## Template Components

| Component | Description |
|-----------|-------------|
| `HEADER` | Text, image, video, or document |
| `BODY` | Main message content with variables (`{{1}}`, `{{2}}`) |
| `FOOTER` | Optional footer text |
| `BUTTONS` | Quick reply, URL, or call-to-action buttons |
