---
id: enterprise-billing
title: Enterprise Billing
description: "Enterprise billing on Exotel: custom pricing, volume discounts, committed-use plans, dedicated invoicing, and SLA-backed terms."
sidebar_label: Enterprise Billing
sidebar_position: 7
---

# Enterprise Billing

Enterprise accounts on Exotel benefit from custom pricing, dedicated billing support, and flexible payment terms. This guide covers the billing features and options available to enterprise customers.

## Custom Pricing

Enterprise pricing is tailored to your specific usage patterns and volume requirements. Unlike standard plans with fixed per-pulse and per-SMS rates, enterprise pricing is negotiated based on:

| Factor | How It Affects Pricing |
|--------|----------------------|
| **Monthly call volume** | Higher volumes qualify for lower per-pulse rates |
| **Monthly SMS volume** | Bulk SMS usage qualifies for discounted rates |
| **Commitment duration** | Longer contracts (12 -- 36 months) unlock deeper discounts |
| **Service mix** | Combined voice + SMS + WhatsApp usage may qualify for bundled pricing |
| **Geographic distribution** | Domestic-only vs. international usage affects rate cards |
| **Feature requirements** | Advanced features like number masking, dedicated trunks affect pricing |

### Rate Card Structure

Enterprise accounts receive a custom rate card that includes:

```
Enterprise Rate Card
├── Voice Rates
│   ├── Inbound (landline / mobile / toll-free)
│   ├── Outbound (landline / mobile)
│   ├── Click-to-call (per leg)
│   └── International (by country/zone)
├── SMS Rates
│   ├── Transactional
│   ├── Promotional
│   └── OTP
├── WhatsApp Rates
│   ├── Utility conversations
│   ├── Authentication conversations
│   └── Marketing conversations
├── ExoPhone Rentals
│   ├── Landline
│   ├── Mobile
│   └── Toll-free
└── Contact Center
    └── Per-agent seat pricing
```

:::tip
To request a custom rate card, contact your account manager or [reach out to Exotel Sales](https://exotel.com/contact/). Be prepared to share your estimated monthly volumes by service type.
:::

## Volume Discounts

### Tiered Pricing

Enterprise accounts can opt for tiered pricing where the per-unit rate decreases as usage increases:

| Monthly Voice Usage (Pulses) | Discount Level |
|------------------------------|----------------|
| Up to 100,000 | Standard rate |
| 100,001 -- 500,000 | 10 -- 15% discount |
| 500,001 -- 1,000,000 | 15 -- 25% discount |
| 1,000,001 -- 5,000,000 | 25 -- 35% discount |
| 5,000,000+ | Custom negotiated rate |

:::info
The discount tiers shown above are illustrative. Your actual discount tiers are defined in your enterprise agreement and may differ based on your negotiated terms.
:::

### Volume Commitment Discounts

Commit to a minimum monthly usage to lock in discounted rates:

| Commitment Type | Discount Range | Billing Impact |
|----------------|---------------|----------------|
| **Minimum monthly spend** | 10 -- 20% off standard rates | Minimum charge applies even if usage is lower |
| **Minimum pulse commitment** | 15 -- 25% off per-pulse rate | Committed pulses charged regardless of actual usage |
| **Annual prepayment** | 20 -- 30% off total | Full year paid upfront at discounted rate |

:::warning
Volume commitments are binding. If your actual usage falls below the committed level, you are still charged the committed minimum. Ensure your forecasts are accurate before committing.
:::

## Committed-Use Plans

Committed-use plans offer the deepest discounts in exchange for guaranteed minimum usage over a contract term.

### How Committed-Use Works

1. **Forecast your usage** -- Work with your account manager to estimate monthly volumes
2. **Select a commitment level** -- Choose a pulse/SMS commitment that matches your forecast
3. **Sign the agreement** -- Lock in the discounted rate for the contract duration
4. **Monthly billing** -- Each month you are charged the higher of:
   - Actual usage at the committed rate
   - The committed minimum amount

### Contract Terms

| Term | Options |
|------|---------|
| **Duration** | 12, 24, or 36 months |
| **Payment frequency** | Monthly, quarterly, or annual |
| **Rate lock** | Committed rates are locked for the contract duration |
| **Overage** | Usage above commitment is billed at the committed rate (or a separately agreed overage rate) |
| **Early termination** | Subject to early termination fee (typically 3 -- 6 months of committed minimum) |

## Dedicated Invoicing

Enterprise accounts have access to enhanced invoicing features:

### Custom Invoice Fields

| Feature | Description |
|---------|-------------|
| **Purchase Order (PO) number** | Add PO numbers to invoices for procurement tracking |
| **Cost center codes** | Map charges to internal cost centers |
| **Department allocation** | Split charges across departments |
| **Custom billing address** | Use different billing addresses for different entities |

### Consolidated Invoicing

If your organization has multiple Exotel accounts:

1. Request consolidated invoicing through your account manager
2. A single invoice is generated covering all linked accounts
3. Line items are broken down by account/department
4. A master summary provides the aggregate view

### Invoice Delivery

| Method | Details |
|--------|---------|
| **Email** | Automatic delivery to configured billing contacts |
| **Dashboard** | Available for download in PDF and Excel formats |
| **API** | Programmatic access to invoice data (enterprise feature) |
| **ERP integration** | Direct feed into SAP, Oracle, or other ERP systems (custom setup) |

## SLA-Backed Billing Terms

Enterprise SLAs include billing-related commitments:

| SLA Component | Standard Enterprise SLA |
|---------------|------------------------|
| **Platform uptime** | 99.9% monthly uptime guarantee |
| **Service credits for downtime** | Proportional credit for each hour below SLA |
| **Invoice accuracy** | Billing disputes resolved within 5 business days |
| **Rate change notice** | 90-day advance notice for any rate changes |
| **Dedicated billing support** | Named billing contact with direct escalation path |

### Service Credit Calculation

If the monthly uptime falls below the SLA target:

| Monthly Uptime | Service Credit |
|---------------|----------------|
| 99.0% -- 99.9% | 10% of monthly bill |
| 95.0% -- 99.0% | 25% of monthly bill |
| Below 95.0% | 50% of monthly bill |

## Payment Terms

Enterprise accounts have flexible payment options:

| Payment Term | Description |
|-------------|-------------|
| **Net 15** | Payment due within 15 days of invoice date |
| **Net 30** | Payment due within 30 days of invoice date |
| **Net 45** | Payment due within 45 days of invoice date (select accounts) |
| **Prepaid with buffer** | Maintain a credit balance with negotiated buffer period for top-ups |

:::info
Payment terms are established during the enterprise agreement negotiation. Standard enterprise accounts start with Net 30 terms. Extended terms require credit approval.
:::

## Getting Started with Enterprise Billing

1. [Contact Exotel Sales](https://exotel.com/contact/) or your account manager
2. Share your usage forecast (monthly calls, SMS, agents)
3. Receive a custom proposal with enterprise rate card
4. Review and sign the enterprise agreement
5. Your account is upgraded with enterprise billing features

## Related Topics

- [Pricing Model](/docs/billing/pricing-model) -- Understand the base pricing structure
- [Plans Comparison](/docs/billing/plans-comparison) -- Compare with standard plans
- [Invoices](/docs/billing/invoices) -- Standard invoice management
- [International Rates](/docs/billing/international-rates) -- Enterprise international rate cards
