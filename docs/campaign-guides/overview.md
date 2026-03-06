---
title: Campaign Guides Overview
description: "Learn how to create, manage, and optimize voice and SMS campaigns on Exotel with step-by-step how-to guides."
sidebar_label: Overview
sidebar_position: 1
---

# Campaign Guides

This section provides step-by-step how-to guides for creating, managing, and optimizing outbound campaigns on Exotel. Whether you are running voice campaigns with IVR flows or sending bulk SMS with DLT-compliant templates, these guides walk you through every stage of the campaign lifecycle.

## What Are Campaigns?

Campaigns on Exotel let you reach large groups of contacts through automated outbound voice calls or SMS messages. Instead of initiating individual calls or messages one at a time, campaigns allow you to:

- **Upload thousands of contacts** and reach them in a single operation
- **Schedule delivery** during optimal business hours
- **Automate retries** for unanswered or failed voice calls
- **Track results** through real-time webhooks and downloadable reports
- **Personalize messages** using dynamic variables from your contact lists

## Campaign Types

Exotel supports two primary campaign channels:

### Voice Campaigns

Voice campaigns place automated outbound calls to your contact list. Each call can connect the recipient to:

- **An IVR flow** -- an interactive voice menu where recipients press keys to navigate options, confirm details, or connect to an agent
- **A greeting message** -- a pre-recorded or text-to-speech message played to the recipient

| Feature | Details |
|---------|---------|
| Max contacts per campaign | 5,000 |
| Default call capacity | 60 calls/minute |
| Retry attempts | Up to 3 |
| Scheduling | RFC 3339, with start and end times |
| Campaign types | `static` (fixed list) or `dynamic` (list SID) |

Voice campaigns are ideal for appointment reminders, payment collection calls, surveys, promotional offers, and emergency notifications.

> **API Reference:** See the [Call Campaigns API](/docs/campaigns/overview) for endpoint details and request/response formats.

### SMS Campaigns

SMS campaigns send bulk text messages to your contact lists with full DLT compliance for Indian regulations. Messages can be:

- **Static** -- the same message sent to all recipients (up to 5 contact lists)
- **Dynamic** -- personalized messages using `@@column_header` variables from a single contact list

| Feature | Details |
|---------|---------|
| Max contacts per list | 1,00,000 (static) / 5,00,000 (dynamic) |
| Default SMS capacity | 300 SMS/minute |
| DLT compliance | Entity ID + Template ID required |
| Sender ID | Alphabetical (transactional) or numeric (promotional) |
| Scheduling | RFC 3339, min 10-min lead time |

SMS campaigns are ideal for transactional alerts, OTP delivery, promotional offers, order updates, and bulk notifications.

> **API Reference:** See the [SMS Campaigns API](/docs/sms-campaigns/overview) for endpoint details and request/response formats.

## When to Use Each Channel

| Use Case | Recommended Channel | Why |
|----------|-------------------|-----|
| Appointment reminders | Voice | Higher engagement; recipients can confirm via IVR |
| Payment collection | Voice | Personal touch; can connect to agent for resolution |
| Order status updates | SMS | Quick, non-intrusive; recipient reads at their convenience |
| Promotional offers | SMS | Cost-effective for large audiences; includes clickable links |
| Surveys and feedback | Voice | Interactive IVR captures structured responses in real time |
| Emergency alerts | Voice + SMS | Dual-channel ensures maximum reach |
| OTP / verification codes | SMS | Instant delivery; standard user expectation |
| Event invitations | SMS | Scalable; supports personalized details via dynamic templates |

## Campaign Lifecycle

Both voice and SMS campaigns follow a similar lifecycle:

```
Created --> InProgress --> Completed
                       --> Paused --> Resumed --> Completed
                                  --> Completed (forced; remaining marked as failed)
Completed --> Archived
```

1. **Created** -- Campaign is configured and contacts are queued
2. **InProgress** -- Calls or messages are actively being sent
3. **Paused** -- Campaign is temporarily stopped; can be resumed
4. **Completed** -- All contacts have been processed (or campaign was force-completed)
5. **Archived** -- Campaign is moved to archive for long-term storage

## Guides in This Section

### Voice Campaign Guides

| Guide | Description |
|-------|-------------|
| [Creating a Voice Campaign](./creating-voice-campaign) | Step-by-step walkthrough: upload contacts, configure IVR, set schedule and retries |
| [Campaign Scheduling](./campaign-scheduling) | Time zones, business hours windows, and recurring campaign patterns |
| [Retry Configuration](./campaign-retry-logic) | Max attempts, retry intervals, linear vs. exponential backoff |
| [Campaign Reports](./campaign-reporting) | Call status breakdown, CDR downloads, and analytics dashboard |
| [Contact List Management](./campaign-contacts-management) | CSV uploads, deduplication, DND filtering, and list operations |
| [Best Practices](./campaign-best-practices) | Optimize connect rates, manage throughput, and avoid common pitfalls |

### SMS Campaign Guides

| Guide | Description |
|-------|-------------|
| [Creating an SMS Campaign](./creating-sms-campaign) | End-to-end guide: DLT templates, sender ID, contact lists, and scheduling |
| [SMS Campaign Templates](./sms-campaign-templates) | DLT approval workflow, variable substitution, and template management |
| [SMS Campaign Reports](./sms-campaign-reporting) | Delivery status tracking, DLT rejection analysis, and report downloads |

## Prerequisites

Before creating campaigns, ensure you have:

- An active Exotel account with API credentials (API key and token)
- At least one ExoPhone (virtual number) for voice campaigns
- DLT Entity ID and approved Template IDs for SMS campaigns (India)
- Contact lists prepared in the required CSV format
- Webhook endpoints configured for real-time status updates (recommended)

:::tip
If you are new to Exotel campaigns, start with the [Creating a Voice Campaign](./creating-voice-campaign) or [Creating an SMS Campaign](./creating-sms-campaign) guide for a complete end-to-end walkthrough.
:::
