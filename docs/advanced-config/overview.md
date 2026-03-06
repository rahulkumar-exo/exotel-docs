---
id: overview
title: Advanced Configuration Overview
description: "Exotel advanced configuration guide covering webhooks, IP whitelisting, rate limiting, HA setup, recording, TTS, and more."
sidebar_label: Overview
sidebar_position: 0
---

# Advanced Configuration Overview

This section covers advanced configuration options for optimizing, securing, and scaling your Exotel deployment. These configurations go beyond basic setup and are typically used by teams with production workloads that require higher reliability, tighter security, or custom behavior.

## Configuration Areas

| Area | What It Covers | Recommended For |
|------|---------------|-----------------|
| [Webhooks Setup](/docs/advanced-config/webhooks-setup) | Webhook URLs, retry logic, payload formats | All users with server-side integrations |
| [IP Whitelisting](/docs/advanced-config/ip-whitelisting) | Restrict API access to specific IPs | Growth and Enterprise accounts |
| [Rate Limiting](/docs/advanced-config/rate-limiting) | API throttling, concurrent call limits | All API users |
| [High Availability](/docs/advanced-config/high-availability) | Redundancy, failover, multi-region | Enterprise accounts |
| [Number Masking](/docs/advanced-config/number-masking-setup) | Privacy for two-party calls | Marketplace and delivery platforms |
| [Call Recording Config](/docs/advanced-config/call-recording-config) | Dual-channel, storage, retention policies | All accounts with recording enabled |
| [TTS Config](/docs/advanced-config/tts-config) | Text-to-speech languages, voices, SSML | Accounts using TTS in call flows |
| [Custom Caller ID](/docs/advanced-config/custom-caller-id) | Display rules, verified numbers | Growth and Enterprise accounts |
| [Concurrent Calls](/docs/advanced-config/concurrent-calls) | Call limits, scaling, burst capacity | Accounts with high call volumes |
| [Network Requirements](/docs/advanced-config/network-requirements) | Ports, protocols, bandwidth, firewall rules | IT teams setting up Exotel |

## Configuration Access

Most advanced configurations are available through:

| Method | Access |
|--------|--------|
| **Dashboard** | [my.exotel.com](https://my.exotel.com) > **Settings** > **Advanced** |
| **API** | Selected configurations can be managed via the Exotel API |
| **Account Manager** | Enterprise configurations may require your account manager to enable features |

## Plan Availability

| Configuration | Starter | Growth | Enterprise |
|--------------|---------|--------|------------|
| Webhooks | Yes | Yes | Yes |
| IP Whitelisting | -- | Yes | Yes |
| Rate Limit Customization | -- | Limited | Yes |
| High Availability | -- | -- | Yes |
| Number Masking | -- | Yes | Yes |
| Call Recording (basic) | Yes | Yes | Yes |
| Call Recording (dual-channel) | -- | Yes | Yes |
| TTS (basic) | Yes | Yes | Yes |
| TTS (SSML, custom voices) | -- | -- | Yes |
| Custom Caller ID | -- | Yes | Yes |
| Concurrent Call Scaling | Limited | Moderate | Custom |
| Dedicated Infrastructure | -- | -- | Yes |

:::tip
If a configuration is not available on your current plan, consider [upgrading your plan](/docs/billing/plans-comparison) or contacting your account manager to discuss enterprise options.
:::

## Getting Started

### For New Integrations

If you are building a new integration with Exotel, configure these items first:

1. **[Webhooks](/docs/advanced-config/webhooks-setup)** -- Set up status callbacks to receive real-time event notifications
2. **[Network Requirements](/docs/advanced-config/network-requirements)** -- Ensure your firewall and network allow Exotel traffic
3. **[Rate Limiting](/docs/advanced-config/rate-limiting)** -- Understand API rate limits to design your integration correctly

### For Production Hardening

If you are preparing for production deployment:

1. **[IP Whitelisting](/docs/advanced-config/ip-whitelisting)** -- Restrict API access to your servers only
2. **[High Availability](/docs/advanced-config/high-availability)** -- Set up redundancy for critical call flows
3. **[Concurrent Calls](/docs/advanced-config/concurrent-calls)** -- Ensure your limits can handle peak traffic

### For Compliance and Privacy

If your use case has regulatory or privacy requirements:

1. **[Number Masking](/docs/advanced-config/number-masking-setup)** -- Protect customer and agent phone numbers
2. **[Call Recording Config](/docs/advanced-config/call-recording-config)** -- Configure recording retention and encryption
3. **[Custom Caller ID](/docs/advanced-config/custom-caller-id)** -- Control what numbers are displayed to call recipients

## Related Topics

- [Authentication Reference](/docs/references/authentication) -- API authentication setup
- [Error Codes](/docs/references/error-codes) -- API error reference
- [Webhooks Reference](/docs/references/webhooks) -- Webhook payload formats
- [Billing Overview](/docs/billing/overview) -- Plan features and pricing
