---
id: overview
title: SMS Campaigns
description: "Exotel SMS Campaigns API — create and manage bulk SMS campaigns with scheduling and personalization."
sidebar_label: Overview
slug: /sms-campaigns/overview
---

# SMS Campaigns API

The Exotel SMS Campaigns API enables you to create, manage, and track bulk SMS campaigns with scheduling, personalization, and real-time callback capabilities.

## Key Features

- **Bulk SMS Delivery** — Send SMS to large contact lists efficiently
- **Dynamic Personalization** — Use variables from contact lists to personalize messages
- **Campaign Scheduling** — Schedule campaigns with specific start and end times
- **Real-time Callbacks** — Get delivery status updates via webhooks
- **Campaign Management** — Pause, resume, complete, or archive campaigns

## Base URL

| Data Center | Subdomain |
|------------|-----------|
| Singapore | `@api.exotel.com` |
| Mumbai | `@api.in.exotel.com` |

```
https://<subdomain>/v2/accounts/<account_sid>/message-campaigns
```

## Authentication

All API requests require **HTTP Basic Authentication** using your API key and API token, available from your Exotel Dashboard API settings.

```
Authorization: Basic <base64(api_key:api_token)>
```

## Rate Limits

- Default SMS capacity: **300 SMS per minute**
- Contact Exotel support to increase this limit

## Content Types

| Type | Description |
|------|-------------|
| `static` | Same message to all recipients (up to 5 lists) |
| `dynamic` | Personalized messages using list column variables (single list only) |

## DLT Compliance

All SMS campaigns in India require:
- **DLT Entity ID** — Your DLT-approved entity ID
- **DLT Template ID** — Your DLT-approved template ID
- **Sender ID** — Alphabetical (transactional) or numeric (promotional)
