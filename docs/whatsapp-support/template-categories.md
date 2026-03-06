---
id: template-categories
title: WhatsApp Template Categories
description: "Understand WhatsApp template categories on Exotel -- utility, marketing, and authentication templates with pricing and usage guidelines."
sidebar_label: Template Categories
sidebar_position: 13
---

# WhatsApp Template Categories

Meta classifies WhatsApp message templates into three categories: Utility, Authentication, and Marketing. The category you choose determines pricing, delivery rules, and how Meta reviews your template. This guide explains each category in detail.

## Category Overview

| Category | Purpose | Pricing Tier | Review Speed | Messaging Limits Apply |
|----------|---------|-------------|-------------|----------------------|
| **Utility** | Transaction-related updates | Standard | Fast (minutes to hours) | Yes |
| **Authentication** | OTPs and verification codes | Lower rate | Fast (minutes to hours) | Yes |
| **Marketing** | Promotions and engagement | Higher rate | Standard (up to 24 hours) | Yes |

:::tip
Choose the correct category from the start. Meta may reclassify miscategorized templates, which can affect your billing and delivery. A utility template reclassified as marketing will be billed at the higher marketing rate.
:::

## Utility Templates

Utility templates are for messages related to a specific, agreed-upon transaction or request. They inform customers about ongoing transactions, account updates, or actions they have taken.

### When to Use Utility

| Use Case | Example |
|----------|---------|
| Order confirmations | "Your order #12345 has been confirmed" |
| Shipping updates | "Your package is out for delivery" |
| Payment receipts | "Payment of Rs. 500 received" |
| Appointment reminders | "Your appointment is tomorrow at 3 PM" |
| Account alerts | "Your password was changed successfully" |
| Booking confirmations | "Your flight booking BK-789 is confirmed" |

### Utility Template Rules

- Must relate to a specific customer transaction or request
- Cannot contain promotional content (discounts, offers, upsells)
- Customer must have initiated the transaction or relationship
- Should provide actionable information

### Example

```
Name: order_shipped
Category: Utility

Body:
Hi {{1}}, your order #{{2}} has been shipped!

Courier: {{3}}
Tracking ID: {{4}}
Expected delivery: {{5}}

Track your package using the link below.

Buttons: [Track Order] (URL)
```

### What Not to Include in Utility Templates

- Promotional offers ("While you wait, check out our sale!")
- Upsell suggestions ("Customers also bought...")
- Marketing language ("Don't miss out!")
- Unrelated product information

## Authentication Templates

Authentication templates are specifically for sending one-time passwords (OTPs) and verification codes. They have special pricing and formatting rules.

### When to Use Authentication

| Use Case | Example |
|----------|---------|
| Login OTP | "Your login code is 123456" |
| Two-factor authentication | "Use code 789012 to verify your identity" |
| Account verification | "Verify your account with code 456789" |
| Transaction confirmation | "Confirm your payment with OTP 234567" |

### Authentication Template Rules

- Must contain only the verification code and essential context
- Cannot include promotional content, links, or media
- Must indicate code expiry if applicable
- Should include a security warning (e.g., "Do not share this code")
- Meta provides a pre-built authentication template format

### Pre-Built Authentication Template

Meta offers a standardized authentication template format:

```
{{1}} is your verification code. For your security, do not share this code.
```

This format is pre-approved and can be used immediately.

### Custom Authentication Template Example

```
Name: login_otp
Category: Authentication

Body:
{{1}} is your verification code for {{2}}.
This code expires in {{3}} minutes.
Do not share this code with anyone.

Buttons: [Copy Code] (Quick Reply)
```

### Authentication Template Restrictions

| Allowed | Not Allowed |
|---------|-------------|
| OTP code | Product recommendations |
| Code expiry time | Links to website |
| Security warning | Images or media |
| App/service name | Marketing content |
| Copy code button | Multiple CTAs |

## Marketing Templates

Marketing templates are for promotional messages, offers, product announcements, and re-engagement campaigns. They have the highest pricing tier and the most scrutiny during review.

### When to Use Marketing

| Use Case | Example |
|----------|---------|
| Promotional offers | "Get 30% off this weekend!" |
| Product launches | "Introducing our new collection" |
| Re-engagement | "We miss you! Here's a special offer" |
| Event announcements | "Join our webinar on January 30" |
| Newsletter updates | "This week's top picks for you" |
| Loyalty rewards | "You've earned 500 bonus points!" |
| Cart abandonment | "You left items in your cart" |

### Marketing Template Rules

- Must include opt-out instructions (recommended: "Reply STOP to unsubscribe")
- Content must be truthful and not misleading
- Offers must be genuine and verifiable
- Cannot use aggressive or manipulative language
- Subject to stricter quality monitoring

### Example

```
Name: seasonal_sale
Category: Marketing

Header: (Image - sale banner)

Body:
Hi {{1}}, our end-of-season sale is live!

Get up to {{2}}% off on {{3}}.
Use code {{4}} at checkout for an extra {{5}}% discount.

Offer valid until {{6}}. Don't miss out!

Footer: Reply STOP to unsubscribe
Buttons: [Shop Now] (URL)
```

### Marketing Best Practices

1. **Segment your audience** -- Send relevant offers to interested customers.
2. **Respect frequency** -- Do not send marketing messages too frequently (no more than 2-3 per week).
3. **Provide clear value** -- Every message should offer something the customer wants.
4. **Include opt-out** -- Always provide a way to unsubscribe.
5. **Monitor quality** -- Track quality rating closely; marketing templates are more susceptible to quality drops.

:::warning
Marketing templates are most likely to receive negative quality feedback from users. If too many recipients block or report your messages, your template will be paused. See [Quality Rating](/docs/whatsapp-support/quality-rating).
:::

## Category Pricing

Conversation pricing depends on the template category and the market:

| Conversation Type | Initiated By | Category Trigger |
|-------------------|-------------|-----------------|
| **Utility** | Business (using utility template) | Utility template sent |
| **Authentication** | Business (using auth template) | Authentication template sent |
| **Marketing** | Business (using marketing template) | Marketing template sent |
| **Service** | Customer (customer messages first) | Customer-initiated message |

### Pricing Hierarchy (India Market)

| Category | Relative Cost |
|----------|--------------|
| Authentication | Lowest |
| Service | Low |
| Utility | Standard |
| Marketing | Highest |

:::note
Actual pricing varies by market and is subject to change. Check the [Exotel Dashboard](https://my.exotel.com) or contact your account manager for current rates.
:::

## Category Reclassification

Meta may reclassify your template if the category does not match the content:

| Submitted As | Reclassified To | Reason |
|-------------|----------------|--------|
| Utility | Marketing | Template contains promotional language |
| Authentication | Utility | Template includes non-OTP content |
| Utility | Marketing | Template includes upsell or cross-sell |

### Impact of Reclassification

- **Pricing changes** -- You may be billed at a higher rate.
- **Quality monitoring** -- Different quality thresholds apply.
- **Delivery behavior** -- Marketing messages may be subject to messaging limits.

## Choosing the Right Category

Use this decision tree:

```
Is the message a one-time password or verification code?
  → Yes: Authentication

Is the message about a specific customer transaction or action?
  → Yes: Does it contain any promotional content?
    → No: Utility
    → Yes: Marketing

Is the message promoting a product, offer, or engagement?
  → Yes: Marketing
```

## Conversation Category Examples

| Message Content | Correct Category |
|----------------|-----------------|
| "Your OTP is 123456" | Authentication |
| "Order #ORD-123 has shipped. Track at URL" | Utility |
| "Your appointment is tomorrow at 3 PM" | Utility |
| "Payment of Rs. 500 received. Ref: TXN-456" | Utility |
| "Flash sale! 50% off everything this weekend" | Marketing |
| "We miss you! Come back and get 20% off" | Marketing |
| "New arrivals just dropped. Check them out!" | Marketing |
| "Your reward points are expiring soon. Redeem now" | Marketing |

## Next Steps

- [Creating WhatsApp Templates](/docs/whatsapp-support/creating-templates) -- Create templates
- [Template Guidelines](/docs/whatsapp-support/template-guidelines) -- Approval criteria
- [Quality Rating](/docs/whatsapp-support/quality-rating) -- Quality monitoring
- [Messaging Limits](/docs/whatsapp-support/messaging-limits) -- Sending limits
- [WhatsApp API Reference](/docs/whatsapp-api/overview) -- API documentation
