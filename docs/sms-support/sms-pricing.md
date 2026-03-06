---
id: sms-pricing
title: SMS Pricing
description: "Understand Exotel SMS pricing models including per-message costs, bulk discounts, Unicode charges, and billing for Indian operators."
sidebar_label: SMS Pricing
sidebar_position: 9
---

# SMS Pricing

This guide explains Exotel's SMS pricing structure, including per-message costs, bulk discounts, and factors that affect your SMS bill.

## Pricing Model

Exotel uses a **per-message pricing model** where you are charged for each SMS sent. The cost varies based on:

- **SMS Type** -- Transactional, promotional, or OTP
- **Volume** -- Higher volumes qualify for lower per-message rates
- **Message Length** -- Multi-part messages (long SMS) cost more
- **Encoding** -- Unicode messages have lower character limits and may result in more parts

:::note
For current pricing details specific to your account, contact [Exotel Sales](https://exotel.com/contact/) or check your account dashboard. Prices are subject to change and may vary by plan.
:::

## Pricing Factors

### 1. SMS Type

| SMS Type | Typical Pricing Tier | Notes |
|----------|---------------------|-------|
| Transactional | Standard rate | 24/7 delivery, DND bypass |
| Promotional | Lower than transactional | Time-window restricted, DND filtered |
| OTP | May have premium rate | Priority delivery, shorter TTL |

### 2. Message Length and Parts

A single SMS can contain up to 160 characters (plain text) or 70 characters (Unicode). Longer messages are split into multiple parts:

| Encoding | Single SMS | Multi-part SMS (per part) |
|----------|-----------|--------------------------|
| **Plain Text (GSM 7-bit)** | Up to 160 characters | 153 characters per part |
| **Unicode (UCS-2)** | Up to 70 characters | 67 characters per part |

Each part is billed as a separate SMS. For example, a 300-character plain text message is split into 2 parts and billed as 2 SMS.

### 3. Volume Discounts

Exotel offers volume-based pricing tiers. The more SMS you send, the lower your per-message cost:

| Monthly Volume | Pricing Tier |
|----------------|-------------|
| Up to 10,000 | Standard |
| 10,001 -- 100,000 | Volume discount |
| 100,001 -- 1,000,000 | Enterprise |
| 1,000,000+ | Custom pricing |

:::tip
Contact your Exotel account manager to negotiate volume pricing for high-volume use cases.
:::

## Billing Details

### What You Are Charged For

| Scenario | Charged? |
|----------|----------|
| SMS delivered to handset | Yes |
| SMS delivered to operator | Yes |
| SMS failed (invalid number) | No |
| SMS failed (DLT scrubbing) | No |
| SMS failed (DND blocked) | No |
| SMS queued but not delivered | Depends on final status |
| Multi-part SMS | Charged per part |

### What You Are NOT Charged For

- Failed messages that were rejected before submission to the operator.
- Messages blocked by DND filtering (for promotional SMS).
- Messages rejected due to invalid DLT configuration.

## Understanding Your Bill

Your SMS bill in the Exotel dashboard includes:

1. **Total SMS Sent** -- Number of messages submitted.
2. **Total SMS Delivered** -- Number of successfully delivered messages.
3. **Total Parts** -- Total message parts (relevant for long SMS).
4. **Total Cost** -- Computed as: delivered parts x per-part rate.

### Viewing SMS Usage

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Navigate to **Reports** > **SMS Reports**.
3. Filter by date range, sender ID, or status.
4. Export reports in CSV format for detailed analysis.

## Cost Optimization Tips

1. **Keep messages short** -- Stay within 160 characters (plain text) to avoid multi-part charges.
2. **Use plain text** -- Unicode messages have a 70-character limit and cost more per message. Use Unicode only when necessary (e.g., regional languages). See [Unicode SMS](/docs/sms-support/unicode-sms).
3. **Clean your contact lists** -- Remove invalid numbers to avoid wasted API calls.
4. **Use URL shortening** -- Shorten long URLs to save characters. See [URL Shortening](/docs/sms-api/api-reference/url-shortening).
5. **Monitor DND lists** -- For promotional campaigns, pre-filter DND numbers to avoid unnecessary attempts.
6. **Negotiate volume pricing** -- If you send over 100,000 SMS/month, contact sales for better rates.
7. **Use bulk endpoints** -- The [Bulk SMS API](/docs/sms-api/api-reference/bulk-sms) is more efficient and may qualify for bulk pricing.

## Prepaid vs Postpaid

| Plan Type | Description | Best For |
|-----------|-------------|----------|
| **Prepaid** | Buy credits in advance; deducted per SMS sent | Small to medium volumes, testing |
| **Postpaid** | Billed monthly based on usage | High volumes, enterprise customers |

## Next Steps

- [SMS Overview](/docs/sms-support/overview) -- Platform overview
- [Bulk SMS](/docs/sms-support/bulk-sms) -- Send at scale
- [Long SMS](/docs/sms-support/long-sms) -- Understand multi-part messaging
- [SMS API Reference](/docs/sms-api/overview) -- API documentation
