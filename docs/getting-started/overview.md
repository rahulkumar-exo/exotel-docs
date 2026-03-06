---
id: overview
title: Getting Started with Exotel
description: "Start building with Exotel's cloud communication platform. Set up your account, configure ExoPhones, and make your first API call in minutes."
sidebar_label: Overview
sidebar_position: 1
---

# Getting Started with Exotel

Welcome to Exotel, India and Southeast Asia's leading cloud communication platform. This guide walks you through everything you need to go from sign-up to your first live call or SMS.

## Quick Start Path

Follow these steps to get up and running:

| Step | Action | Time Estimate |
|------|--------|---------------|
| 1 | [Create your account](/docs/getting-started/create-account) | 2 minutes |
| 2 | [Complete KYC verification](/docs/getting-started/kyc-verification) | 1-3 business days |
| 3 | [Explore your trial account](/docs/getting-started/trial-account) | Immediate |
| 4 | [Navigate the dashboard](/docs/getting-started/dashboard-overview) | 5 minutes |
| 5 | [Set up an ExoPhone](/docs/getting-started/exophone-setup) | 5 minutes |
| 6 | [Build your first call flow](/docs/getting-started/first-call-flow) | 15 minutes |
| 7 | [Get API credentials](/docs/getting-started/api-credentials) | 2 minutes |
| 8 | [Test your setup](/docs/getting-started/testing-guide) | 10 minutes |
| 9 | [Go live](/docs/getting-started/go-live-checklist) | 30 minutes |

## What You Can Build with Exotel

Exotel provides APIs and dashboard tools for voice, SMS, and WhatsApp communication:

### Voice

- **Click-to-call** -- Connect customers to agents with a single API call
- **IVR systems** -- Build multi-level interactive voice response menus
- **Call campaigns** -- Run outbound dialing campaigns at scale
- **Call recording** -- Record and store calls for quality and compliance
- **Call tracking** -- Track marketing campaigns with virtual numbers

### SMS

- **Transactional SMS** -- Send OTPs, order updates, and alerts
- **Promotional SMS** -- Run marketing campaigns (with DLT compliance in India)
- **Bulk SMS** -- Send thousands of messages via API or dashboard

### WhatsApp Business

- **Template messages** -- Send notifications and updates
- **Interactive messages** -- Buttons, lists, and quick replies
- **Media messages** -- Images, documents, and videos

## Platform Architecture

Exotel's platform consists of three core components:

1. **Dashboard** -- Web interface at [my.exotel.com](https://my.exotel.com) for configuration, monitoring, and analytics
2. **APIs** -- RESTful APIs for programmatic control of calls, SMS, and messaging
3. **ExoPhones** -- Virtual phone numbers (DIDs) that serve as your business phone identity

:::tip Start with the Dashboard
Even if you plan to use APIs exclusively, start by exploring the dashboard. It helps you understand Exotel's concepts (ExoPhones, call flows, applets) before writing code.
:::

## Prerequisites

Before you begin, ensure you have:

- A valid business email address
- Business registration documents for KYC (PAN, GST, or equivalent)
- A phone number for verification
- For India: DLT registration for SMS (Entity ID and Template ID)

## Choose Your Region

Exotel operates in multiple regions. Choose the one closest to your users:

| Region | Dashboard URL | API Subdomain | Best For |
|--------|--------------|---------------|----------|
| India (Mumbai) | `my.exotel.com` | `api.in.exotel.com` | Indian businesses |
| Singapore | `my.exotel.com` | `api.exotel.com` | SEA businesses |

For full region details, see [Regions and Availability](/docs/getting-started/regions-availability).

## Key Concepts

Before diving in, familiarize yourself with these Exotel terms:

| Term | Definition |
|------|-----------|
| **ExoPhone** | A virtual phone number (DID) assigned to your account for making and receiving calls |
| **Call Flow** | A visual workflow that defines how incoming calls are handled (IVR, routing, greetings) |
| **Applet** | A building block within a call flow (e.g., Greeting, Connect, IVR Menu) |
| **Account SID** | Your unique account identifier, used in API calls |
| **API Key / Token** | Credentials for authenticating API requests |
| **Pulse** | The billing unit for voice calls (typically 60 seconds in India) |
| **DLT** | Distributed Ledger Technology -- India's telecom regulatory framework for SMS |

## Next Steps

- [Create your Exotel account](/docs/getting-started/create-account) to get started
- [Explore trial account features](/docs/getting-started/trial-account) to test without commitment
- Jump to the [Voice API quickstart](/docs/voice-v1/quickstart) or [SMS quickstart](/docs/sms-api/quickstart) if you already have an account

## Need Help?

- **Support portal**: [support.exotel.com](https://support.exotel.com)
- **Email**: hello@exotel.com
- **Dashboard chat**: Available in the bottom-right corner of [my.exotel.com](https://my.exotel.com)
