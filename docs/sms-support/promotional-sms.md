---
id: promotional-sms
title: Promotional SMS
description: "Guide to sending promotional SMS via Exotel including marketing campaigns, DND restrictions, time windows, and compliance rules."
sidebar_label: Promotional SMS
sidebar_position: 8
---

# Promotional SMS

Promotional SMS are marketing messages used to send offers, discounts, product announcements, and campaign communications. These messages are subject to specific delivery restrictions in India, including time windows and DND filtering.

## What Is Promotional SMS?

Promotional SMS includes any message with a commercial or marketing intent. These messages are regulated by TRAI and have stricter delivery rules compared to transactional SMS.

### Characteristics

| Feature | Promotional SMS |
|---------|-----------------|
| **Delivery Window** | 9:00 AM -- 9:00 PM IST only |
| **DND Bypass** | No -- blocked for DND-registered numbers |
| **Sender ID Format** | 6 numeric digits (e.g., `777888`) |
| **DLT Template Type** | Promotional (`P`) |
| **Use Cases** | Offers, discounts, campaigns, event invites |

:::warning
Promotional SMS sent outside the 9 AM -- 9 PM window will be queued by the operator and delivered when the window reopens. They will **not** be delivered to numbers on the DND registry.
:::

## Common Use Cases

| Use Case | Example Message |
|----------|-----------------|
| **Flash Sale** | "Flash Sale! Flat 50% off on all electronics. Shop now at example.com. Use code FLASH50." |
| **New Product Launch** | "Introducing our new range of smartphones! Check out the latest models at example.com." |
| **Festival Offers** | "Diwali Special! Get up to 70% off on fashion, electronics & more. Offer valid till 31 Oct." |
| **Event Invite** | "You are invited to our exclusive product launch event on 15 Mar. RSVP at example.com/event." |
| **Reactivation** | "We miss you! Come back and enjoy 20% off on your next purchase. Use code COMEBACK20." |

## Sending Promotional SMS

### Via API

Use the [Send SMS API](/docs/sms-api/api-reference/send-sms) with `SmsType=promotional`:

```bash
curl -X POST "https://<api_key>:<api_token>@api.exotel.com/v1/Accounts/<account_sid>/Sms/send" \
  -d "From=777888" \
  -d "To=+919876543210" \
  -d "Body=Flash Sale! Flat 50% off on all electronics. Shop now at example.com. Reply STOP to opt out." \
  -d "SmsType=promotional" \
  -d "DltEntityId=1234567890123" \
  -d "DltTemplateId=1107160000000012345" \
  -d "StatusCallback=https://your-server.com/sms-status"
```

### Via Dashboard

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Go to **App Bazaar** > **SMS** > **Send SMS**.
3. Select your promotional sender ID (numeric).
4. Choose a promotional template.
5. Enter recipient numbers and send.

## DND (Do Not Disturb) Impact

The National Do Not Disturb (NDNC) registry allows Indian consumers to opt out of receiving promotional messages. Key points:

| DND Category | Description | Blocked Content |
|-------------|-------------|-----------------|
| **Fully Blocked** | All categories blocked | All promotional SMS |
| **Partially Blocked** | Specific categories blocked | Only blocked categories |
| **Not Registered** | No DND preference | Receives all promotional SMS |

### DND Categories

Consumers can selectively block promotional messages by category:

| Category | Code | Example |
|----------|------|---------|
| Banking/Insurance/Finance | 1 | Loan offers, credit card promotions |
| Real Estate | 2 | Property ads, flat sale notifications |
| Education | 3 | Course promotions, coaching center ads |
| Health | 4 | Healthcare product ads |
| Consumer Goods & Automobiles | 5 | Product launches, auto deals |
| Communication/Broadcasting/IT | 6 | Telecom offers, broadband plans |
| Tourism & Leisure | 7 | Travel deals, hotel offers |

:::tip
To maximize delivery, ask your customers to register their category preferences on the DND portal, or use transactional SMS for critical communications that should not be blocked.
:::

## Time Window Restrictions

| Parameter | Value |
|-----------|-------|
| Start Time | 9:00 AM IST |
| End Time | 9:00 PM IST |
| SMS sent before 9 AM | Queued and delivered at 9 AM |
| SMS sent after 9 PM | Queued and delivered next day at 9 AM |
| Weekend delivery | Same window (9 AM -- 9 PM) |
| Holiday delivery | Same window (9 AM -- 9 PM) |

## Promotional vs Transactional SMS

| Feature | Promotional | Transactional |
|---------|-------------|---------------|
| Purpose | Marketing, offers | Alerts, OTPs, updates |
| Delivery Time | 9 AM -- 9 PM only | 24/7 |
| DND Filtering | Yes | No (bypass) |
| Sender ID | Numeric (6 digits) | Alphabetic (6 chars) |
| DLT Type | `P` | `T` |
| Opt-out Required | Yes (recommended) | No |

## Compliance Requirements

1. **Opt-out Mechanism** -- Include opt-out instructions in promotional messages (e.g., "Reply STOP to unsubscribe").
2. **Consent Management** -- Maintain records of user consent for promotional communications. See [DLT Consent Template](/docs/sms-support/dlt-consent-template).
3. **Content Accuracy** -- Do not include misleading offers or false claims.
4. **Frequency Control** -- Avoid sending excessive messages to the same recipient.

## Best Practices

1. **Segment your audience** -- Target specific user groups for better engagement and lower opt-out rates.
2. **Time your campaigns** -- Send promotional SMS during business hours (10 AM -- 6 PM) for higher open rates.
3. **Personalize messages** -- Use template variables to personalize content (e.g., include the recipient's name).
4. **Include a clear CTA** -- Every promotional SMS should have a clear call-to-action.
5. **Track delivery** -- Use [SMS delivery reports](/docs/sms-support/sms-delivery-reports) to monitor campaign performance.
6. **Respect opt-outs** -- Promptly remove opted-out numbers from your campaign lists.
7. **Use URL shortening** -- Shorten long URLs to save character space. See the [URL Shortening API](/docs/sms-api/api-reference/url-shortening).

## Expected Delivery Rates

| Audience | Expected Delivery Rate |
|----------|----------------------|
| Non-DND numbers | 85-95% |
| DND numbers | 0% (blocked) |
| Overall (mixed list) | 50-70% (depending on DND ratio) |

:::note
Approximately 30-40% of Indian mobile numbers are registered on the DND registry. Factor this into your campaign planning.
:::

## Next Steps

- [Transactional SMS](/docs/sms-support/transactional-sms) -- Learn about transactional messaging
- [Bulk SMS](/docs/sms-support/bulk-sms) -- Send promotional campaigns at scale
- [SMS Pricing](/docs/sms-support/sms-pricing) -- Understand SMS costs
- [SMS API Reference](/docs/sms-api/api-reference/send-sms) -- API documentation
