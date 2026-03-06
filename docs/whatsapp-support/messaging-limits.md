---
id: messaging-limits
title: WhatsApp Messaging Limits
description: "Understand WhatsApp Business messaging limits on Exotel -- tier 1 to tier 4, how to increase limits, and what counts toward the limit."
sidebar_label: Messaging Limits
sidebar_position: 15
---

# WhatsApp Messaging Limits

Meta enforces messaging limits that control how many unique customers your business can message within a rolling 24-hour period. These limits help maintain the quality of the WhatsApp ecosystem and prevent spam. This guide explains the tier system, how to increase your limits, and strategies for working within them.

## Messaging Limit Tiers

| Tier | Unique Customers per 24 Hours | Typical Stage |
|------|-------------------------------|---------------|
| **Unverified** | 250 | Before business verification |
| **Tier 1** | 1,000 | After business verification |
| **Tier 2** | 10,000 | Growing messaging volume |
| **Tier 3** | 100,000 | Established messaging operations |
| **Tier 4 (Unlimited)** | Unlimited | High-volume, high-quality senders |

:::note
The messaging limit applies to the number of **unique customers** you can initiate conversations with, not the total number of messages. You can send multiple messages to the same customer within a conversation without it counting as additional unique customers.
:::

## What Counts Toward the Limit

| Counts | Does Not Count |
|--------|---------------|
| Sending a template message to a new customer (initiating a conversation) | Messages within an existing 24-hour conversation |
| Each unique phone number you initiate contact with | Customer-initiated messages (inbound) |
| Re-initiating after a conversation expires | Replies within a session window |

### Example

If your limit is 1,000:

- You can send template messages to 1,000 unique customers in 24 hours.
- If you send 5 follow-up messages to each customer within their session, that still counts as 1,000 (not 5,000).
- If 500 customers message you first, those do not count toward your limit.

## Starting Tier

After setting up your WhatsApp Business API:

| Status | Starting Limit |
|--------|---------------|
| Business **not** verified | 250 unique customers per 24 hours |
| Business verified | 1,000 unique customers per 24 hours (Tier 1) |

:::warning
Without business verification, you are limited to 250 unique customers. Complete your [Business Verification](/docs/whatsapp-support/business-verification) to unlock Tier 1 (1,000 customers).
:::

## How to Increase Your Tier

Meta automatically increases your messaging tier when you meet the following criteria:

### Automatic Tier Upgrade Criteria

| Requirement | Details |
|-------------|---------|
| **Quality rating** | Must be Green (not Yellow or Red) |
| **Messaging volume** | Must reach at least 50% of current tier limit within 7 days |
| **No quality issues** | No templates paused or disabled |
| **Account age** | Must have been active for the minimum period |

### Tier Progression

```
Unverified (250) → Verify Business → Tier 1 (1,000)
                                          ↓
                                    Send to 500+ unique users in 7 days
                                    Quality stays Green
                                          ↓
                                     Tier 2 (10,000)
                                          ↓
                                    Send to 5,000+ unique users in 7 days
                                    Quality stays Green
                                          ↓
                                     Tier 3 (100,000)
                                          ↓
                                    Send to 50,000+ unique users in 7 days
                                    Quality stays Green
                                          ↓
                                     Tier 4 (Unlimited)
```

### Timeline Estimates

| Tier Change | Minimum Time | Typical Time |
|-------------|-------------|-------------|
| Unverified to Tier 1 | Immediate (upon verification) | 2-7 business days for verification |
| Tier 1 to Tier 2 | 7 days | 1-2 weeks |
| Tier 2 to Tier 3 | 7 days | 2-4 weeks |
| Tier 3 to Tier 4 | 7 days | 4-8 weeks |

## Tier Downgrades

Your tier can be reduced if quality drops:

| Quality Change | Impact |
|----------------|--------|
| Green to Yellow | Tier remains the same; cannot upgrade |
| Green to Red | Tier may be reduced by one level |
| Sustained Red | Tier may be reduced further |

### Recovery from Downgrade

1. Improve your quality rating to Green. See [Quality Rating](/docs/whatsapp-support/quality-rating).
2. Once quality is Green, meet the tier upgrade criteria again.
3. Tier upgrades resume as normal.

## Checking Your Current Limit

### Via Exotel Dashboard

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Navigate to **WhatsApp** > **Phone Numbers**.
3. View the messaging limit next to your registered number.

### Via Meta Business Manager

1. Go to [business.facebook.com](https://business.facebook.com).
2. Navigate to **WhatsApp Account** > **Phone Numbers**.
3. The messaging limit tier is displayed for each number.

## Strategies for Working Within Limits

### For Tier 1 (1,000 Limit)

| Strategy | Details |
|----------|---------|
| Prioritize high-value customers | Send to customers most likely to engage |
| Use customer-initiated conversations | Encourage customers to message you first (no limit on inbound) |
| Batch sends across days | Spread campaigns over multiple days |
| Focus on engagement | High engagement helps you tier up faster |

### For Tier 2 (10,000 Limit)

| Strategy | Details |
|----------|---------|
| Segment campaigns | Break large campaigns into daily batches |
| Monitor quality closely | Maintain Green rating to reach Tier 3 |
| Optimize templates | Use high-performing templates for better engagement |
| Plan capacity | Schedule campaigns to stay within daily limits |

### For Tier 3+ (100,000+ Limit)

| Strategy | Details |
|----------|---------|
| Scale gradually | Do not send to all 100,000 on day one |
| Maintain quality | Quality becomes even more critical at high volumes |
| Use multiple numbers | Consider distributing sends across multiple numbers |
| Monitor in real time | Track delivery rates and quality metrics during large campaigns |

## Frequently Asked Questions

**Q: Can I request a manual tier increase?**
A: No. Tier increases are automatic based on volume and quality. You cannot request a manual upgrade through Meta or Exotel.

**Q: Does customer-initiated messaging count toward my limit?**
A: No. Only business-initiated conversations (where you send the first message using a template) count toward your messaging limit.

**Q: Can I have different limits on different numbers?**
A: Yes. Each WhatsApp Business number has its own messaging limit tier, based on its individual quality and volume history.

**Q: What happens if I hit my limit?**
A: New business-initiated messages will fail with an error until the 24-hour rolling window resets. You can still respond to customer-initiated messages.

**Q: Do test messages count toward the limit?**
A: Yes, if they are sent to real phone numbers. Messages sent to your own test numbers count as unique customers.

:::tip
To tier up as quickly as possible: verify your business, maintain Green quality, and consistently send to at least 50% of your current limit within each 7-day window.
:::

## Common Errors

| Error | Cause | Resolution |
|-------|-------|------------|
| `MESSAGING_LIMIT_REACHED` | Hit the unique customer limit for the rolling 24-hour window | Wait for the window to roll; optimize sending schedule |
| `BUSINESS_NOT_VERIFIED` | Cannot exceed 250 limit without verification | Complete business verification |
| `QUALITY_TOO_LOW` | Quality issues preventing tier upgrade | Improve quality rating |

## Next Steps

- [Quality Rating](/docs/whatsapp-support/quality-rating) -- Improve your quality score
- [Business Verification](/docs/whatsapp-support/business-verification) -- Verify your business
- [Template Messages](/docs/whatsapp-support/template-messages) -- Send business-initiated messages
- [WhatsApp API Reference](/docs/whatsapp-api/overview) -- API documentation
