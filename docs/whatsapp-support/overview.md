---
id: whatsapp-overview
title: WhatsApp Business API Overview
description: "Learn how Exotel's WhatsApp Business API works as a BSP, key features, messaging capabilities, and how to get started with WhatsApp for business."
sidebar_label: Overview
sidebar_position: 1
---

# WhatsApp Business API Overview

Exotel is an official WhatsApp Business Solution Provider (BSP) authorized by Meta, enabling businesses across India and Southeast Asia to leverage the WhatsApp Business Platform for customer engagement at scale.

## What Is the WhatsApp Business API?

The WhatsApp Business API (also called the WhatsApp Business Platform) is Meta's enterprise-grade solution that allows medium and large businesses to communicate with customers on WhatsApp programmatically. Unlike the WhatsApp Business App (designed for small businesses), the API supports:

- **High-volume messaging** -- Send thousands of messages per second
- **System integration** -- Connect WhatsApp to your CRM, helpdesk, or custom applications
- **Automation** -- Build chatbots, auto-replies, and workflow triggers
- **Multi-agent support** -- Multiple team members can handle conversations simultaneously
- **Rich messaging** -- Templates, interactive buttons, media, catalogs, flows, and payments

## How Exotel Works as a WhatsApp BSP

As a Business Solution Provider, Exotel acts as the bridge between your business and Meta's WhatsApp infrastructure.

```
Your Application  -->  Exotel API  -->  Meta Cloud API  -->  WhatsApp User
                  <--             <--                   <--
```

### What Exotel Provides

| Capability | Description |
|------------|-------------|
| **API Access** | REST APIs for sending and receiving messages |
| **Onboarding** | Assisted setup of your WhatsApp Business Account (WABA) |
| **Template Management** | Create and submit message templates for approval |
| **Number Hosting** | Host your phone number on the WhatsApp Business Platform |
| **Webhooks** | Real-time delivery reports and inbound message notifications |
| **Dashboard** | Web-based console for analytics, template management, and configuration |
| **Compliance** | DLT registration support and regulatory compliance for India |

## Key Concepts

### WhatsApp Business Account (WABA)

A WABA is your business identity on WhatsApp. It is linked to your Meta Business Manager account and holds your:

- Business display name and profile
- Phone numbers registered for WhatsApp
- Message templates
- Quality rating and messaging limits

### Conversation Types

WhatsApp uses a conversation-based pricing model. There are two broad categories:

| Category | Initiated By | Window | Example |
|----------|-------------|--------|---------|
| **Business-initiated** | Your business | Requires a pre-approved template | Order confirmations, appointment reminders |
| **User-initiated** | The customer | 24-hour session window | Customer inquiries, support requests |

Business-initiated conversations are further classified by Meta into:

- **Utility** -- Transaction updates, order confirmations, account alerts
- **Authentication** -- OTPs, verification codes, login notifications
- **Marketing** -- Promotions, offers, product announcements, re-engagement
- **Service** -- Responses to user-initiated conversations (free tier available)

:::tip
Service conversations (user-initiated) are currently offered at no charge by Meta in many markets, making WhatsApp a cost-effective support channel. Check the latest Meta pricing for your region.
:::

### Message Templates

Templates are pre-approved message formats required for initiating conversations with customers. They can include:

- Dynamic parameters (e.g., customer name, order ID)
- Media headers (images, videos, documents)
- Interactive buttons (quick replies, call-to-action URLs)
- Multiple languages

For details on creating and managing templates, see [Creating WhatsApp Templates](/docs/whatsapp-support/creating-templates) and the [Templates API Reference](/docs/whatsapp-api/api-reference/templates).

### 24-Hour Session Window

When a customer sends a message to your business, a 24-hour session window opens. During this window, you can send free-form messages (text, media, interactive) without needing a template. Once the window expires, you must use an approved template to re-initiate the conversation.

For more details, see [WhatsApp Session Messages](/docs/whatsapp-support/session-messages).

## Architecture Overview

```
                    +-------------------+
                    |  Your Application |
                    +--------+----------+
                             |
                    REST API (HTTPS)
                             |
                    +--------v----------+
                    |   Exotel Platform  |
                    |  - Message routing |
                    |  - Template mgmt  |
                    |  - Analytics       |
                    +--------+----------+
                             |
                    Meta Cloud API
                             |
                    +--------v----------+
                    |  WhatsApp Network  |
                    |  - Delivery        |
                    |  - Encryption      |
                    +--------+----------+
                             |
                    +--------v----------+
                    |   End Customer     |
                    |   (WhatsApp App)   |
                    +-------------------+
```

## Regional Availability

Exotel's WhatsApp Business API is available across the following regions:

| Region | API Endpoint | Data Residency |
|--------|-------------|----------------|
| India (Mumbai) | `api.in.exotel.com` | India |
| Singapore | `api.exotel.com` | Singapore |

## Use Cases

### Customer Support
Route inbound WhatsApp messages to your helpdesk or contact center. Use interactive messages for quick issue categorization and session messages for real-time support.

### Transactional Notifications
Send order confirmations, shipping updates, payment receipts, and appointment reminders using approved templates.

### Marketing Campaigns
Reach opted-in customers with promotional messages, product launches, and special offers using marketing templates.

### Authentication
Send OTPs and verification codes via WhatsApp for a secure, high-delivery-rate authentication channel.

### Commerce
Enable product browsing, catalog sharing, and in-chat payments (India) directly within WhatsApp.

## What's Next?

| Step | Guide |
|------|-------|
| 1 | [Getting Started with WhatsApp](/docs/whatsapp-support/getting-started) |
| 2 | [Business Verification](/docs/whatsapp-support/business-verification) |
| 3 | [Number Requirements](/docs/whatsapp-support/number-requirements) |
| 4 | [Send Your First Message](/docs/whatsapp-api/api-reference/send-message) |

:::warning
Before you can send messages, your Meta Business Manager must be verified, your phone number must be registered, and you must have at least one approved message template. See the [Getting Started](/docs/whatsapp-support/getting-started) guide for the complete onboarding flow.
:::
