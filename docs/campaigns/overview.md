---
id: overview
title: Call Campaigns Overview
sidebar_label: Overview
sidebar_position: 1
---

# Call Campaigns

Create and manage outbound call campaigns with IVR flows, automatic retries, scheduling, and detailed reporting.

## Base URL

```
https://<api_key>:<api_token><subdomain>/v2/accounts/<account_sid>/campaigns
```

### Regional Endpoints

| Region    | Subdomain              |
|-----------|------------------------|
| Singapore | `@api.exotel.com`      |
| Mumbai    | `@api.in.exotel.com`   |

## Capabilities

- **Bulk outbound calls** — Up to 5,000 phone numbers per campaign
- **IVR flows** — Connect campaigns to interactive voice menus
- **Auto-retries** — Retry failed/busy/no-answer calls up to 3 times
- **Scheduling** — Schedule campaigns for future execution
- **Real-time webhooks** — Per-call and per-campaign status callbacks
- **Campaign controls** — Pause, resume, complete, and archive campaigns

## Rate Limits

| Limit                    | Value            |
|--------------------------|------------------|
| Default call capacity    | 60 calls/minute  |
| Max numbers per campaign | 5,000            |
| Max retries              | 3                |
| Campaign duration        | 30 days (default) |

:::note
Contact Exotel support to increase your call capacity beyond 60 calls/minute.
:::

## Campaign Types

| Type      | Description |
|-----------|-------------|
| `static`  | Fixed list of numbers provided at creation |
| `dynamic` | Numbers sourced from a list SID (can be updated) |

## Campaign Status Flow

```
Created → InProgress → Completed
                     → Paused → Resumed → Completed
                              → Completed (force, marks remaining as failed)
Completed → Archived
```

## Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| [Create Campaign](/docs/campaigns/api-reference/create-campaign) | POST | Create a new call campaign |
| [Manage Campaign](/docs/campaigns/api-reference/manage-campaign) | GET/PUT/DELETE | Get details, pause/resume, delete |
| [Call Details](/docs/campaigns/api-reference/campaign-call-details) | GET | Get individual call records |
| [Webhooks](/docs/campaigns/api-reference/webhooks) | — | Webhook reference |
