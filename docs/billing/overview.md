---
id: overview
title: Billing Overview
description: "Understand how Exotel billing works including credit-based pricing, per-pulse voice billing, SMS rates, and account balance management."
sidebar_label: Overview
sidebar_position: 0
---

# Billing Overview

Exotel operates on a prepaid, credit-based billing model. You purchase credits in advance, and usage is deducted in real time as calls are made and SMS messages are sent. This guide explains how billing works across all Exotel services.

:::tip
To check your current balance or add credits, log in to [my.exotel.com](https://my.exotel.com) and navigate to **Billing** in the left sidebar.
:::

## How Exotel Billing Works

```
┌──────────────────────────────────────────────────────┐
│                  Exotel Billing Flow                  │
│                                                       │
│   Add Credits ──► Account Balance ──► Usage Deducted  │
│   (Prepaid)       (Real-Time)        (Per-Pulse/SMS)  │
│                                                       │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│   │   Voice      │  │    SMS      │  │  ExoPhone   │  │
│   │   Per-pulse  │  │  Per-message│  │  Rental     │  │
│   └─────────────┘  └─────────────┘  └─────────────┘  │
└──────────────────────────────────────────────────────┘
```

### Billing Components

| Component | Billing Model | Frequency |
|-----------|--------------|-----------|
| **Voice Calls** | Per-pulse (typically 60-second pulses) | Real-time deduction |
| **SMS Messages** | Per-message (varies by route/type) | Real-time deduction |
| **ExoPhone Rental** | Monthly rental per virtual number | Monthly charge |
| **WhatsApp Messages** | Per-conversation (24-hour window) | Real-time deduction |
| **Contact Center** | Per-agent seat (monthly) | Monthly charge |
| **Add-on Services** | Varies by feature | As configured |

## Account Balance

Your account balance is the total credit available for usage. It is displayed in real time on the Exotel dashboard and can be queried via the API.

### Balance Deduction Priority

1. **Voice calls** -- Deducted at the end of each pulse during the call
2. **SMS** -- Deducted when the message is submitted to the carrier
3. **Recurring charges** -- Deducted on the renewal date (ExoPhone rental, agent seats)

:::warning
If your account balance reaches zero, all outbound calls and SMS will be blocked immediately. Inbound calls to your ExoPhones will also stop working. Set up [usage alerts](/docs/billing/usage-tracking) to avoid service disruption.
:::

## Billing Cycle

Exotel follows a **calendar month** billing cycle:

1. **Credit Purchase** -- Add credits at any time via the dashboard or bank transfer
2. **Real-Time Usage** -- Credits are consumed as services are used
3. **Monthly Invoice** -- A GST-compliant invoice is generated at the end of each month
4. **Renewal Charges** -- ExoPhone rentals and seat licenses renew on their activation anniversary

## Key Billing Concepts

### Pulse-Based Voice Billing

Voice calls are billed in **pulses**. A pulse is the minimum billable unit for a call, typically 60 seconds. If a call lasts 61 seconds with a 60-second pulse, you are charged for 2 pulses.

See [Pricing Model](/docs/billing/pricing-model) for detailed pulse billing mechanics.

### Per-SMS Billing

SMS messages are billed per message sent, regardless of delivery status. Rates vary based on:

- **Message type** -- Transactional, promotional, or OTP
- **Route** -- DLT-compliant routes have different pricing
- **Volume** -- Higher volumes may qualify for discounted rates

### ExoPhone Rental

Each virtual number (ExoPhone) incurs a monthly rental charge. Rental amounts depend on:

- **Number type** -- Landline, mobile, or toll-free
- **Region** -- Indian or international numbers
- **Features** -- Standard vs. vanity numbers

## Billing Dashboard

Access your billing information at [my.exotel.com](https://my.exotel.com) > **Billing**:

| Section | What You Can Do |
|---------|----------------|
| **Balance** | View current credit balance and recent transactions |
| **Add Credits** | Purchase credits via multiple payment methods |
| **Usage** | View detailed usage breakdown by service type |
| **Invoices** | Download monthly GST-compliant invoices |
| **Alerts** | Configure low-balance and spending alerts |
| **Payment History** | View all past credit purchases and payments |

## Related Topics

- [Pricing Model](/docs/billing/pricing-model) -- Understand per-pulse and per-SMS rate structures
- [Plans Comparison](/docs/billing/plans-comparison) -- Compare Starter, Growth, and Enterprise plans
- [Add Credits](/docs/billing/add-credits) -- Payment methods and auto-recharge setup
- [Usage Tracking](/docs/billing/usage-tracking) -- Real-time balance monitoring and spending limits
- [Invoices](/docs/billing/invoices) -- Monthly invoicing and GST compliance
- [Refund Policy](/docs/billing/refund-policy) -- Cancellation and refund terms
- [Enterprise Billing](/docs/billing/enterprise-billing) -- Custom pricing and volume discounts
- [International Rates](/docs/billing/international-rates) -- Calling and SMS rates by country
