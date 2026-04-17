---
id: overview
title: RCS - Omnichannel APIs
description: Overview of Exotel RCS Omnichannel APIs for sending rich media messages, carousels, and branded content with SMS fallback.
sidebar_label: Overview
slug: /rcs-omnichannel/overview
---

# RCS - Omnichannel APIs

Rich Communication Services (RCS) enables rich messaging experiences including images, carousels, suggested actions, and branded messages — all within the native messaging app.

:::note
RCS Omnichannel APIs are available on request. Contact your Exotel account manager to enable this feature on your account.
:::

## Key Features

- **Rich Media** — Send images, videos, and carousels
- **Branded Messages** — Company logo and verified sender identity
- **Suggested Actions** — Interactive buttons and quick replies
- **Read Receipts** — Know when messages are delivered and read
- **SMS Fallback** — Automatic SMS fallback for non-RCS capable devices
- **Template Messages** — Pre-approved templates with dynamic variable substitution
- **Delivery Callbacks** — Real-time status updates via webhooks (sent, delivered, seen)

## Base URL

| Data Center | Base URL |
|------------|----------|
| Singapore | `https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<your_sid>/messages` |
| Mumbai | `https://<api_key>:<api_token>@api.in.exotel.com/v2/accounts/<your_sid>/messages` |

## Authentication

All requests require **HTTP Basic Authentication** using your API key and API token from the Exotel Dashboard.

## Getting Started

1. Contact your Exotel account manager or write to **hello@exotel.com** to enable RCS
2. Register your business profile for RCS verification
3. Get your BotID and API credentials
4. Create and get templates approved
5. Start sending messages via the [Send Message API](/docs/rcs-omnichannel/api-reference/send-message)
