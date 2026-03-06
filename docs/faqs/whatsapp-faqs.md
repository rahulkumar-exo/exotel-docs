---
title: WhatsApp Business FAQs
description: "Frequently asked questions about Exotel WhatsApp Business API including BSP setup, template approval, business verification, and messaging limits."
sidebar_label: WhatsApp FAQs
sidebar_position: 20
---

# WhatsApp Business FAQs

Common questions about using WhatsApp Business API through Exotel, including onboarding, template management, business verification, messaging limits, and pricing.

---

## What is the WhatsApp Business API?

The WhatsApp Business API allows businesses to send and receive WhatsApp messages at scale through Exotel's platform. Unlike the WhatsApp Business App (designed for small businesses), the API supports:

- Automated message sending via API
- Template-based notifications
- Interactive messages (buttons, lists, quick replies)
- Media messages (images, documents, videos)
- High-volume messaging
- Integration with CRMs and business tools

---

## What is a BSP and why is Exotel one?

BSP stands for **Business Solution Provider**. BSPs are companies authorized by Meta (WhatsApp's parent company) to provide access to the WhatsApp Business API. As a BSP, Exotel:

- Manages the technical integration with WhatsApp
- Hosts the WhatsApp Business API infrastructure
- Provides a simplified API for sending and receiving messages
- Handles message queuing, delivery, and status tracking
- Offers combined billing for WhatsApp alongside voice and SMS

---

## How do I set up WhatsApp Business through Exotel?

### Onboarding Steps

1. **Contact Exotel** to enable WhatsApp on your account
2. **Create a Meta Business Manager** account at [business.facebook.com](https://business.facebook.com)
3. **Complete business verification** on Meta Business Manager
4. **Register your phone number** for WhatsApp Business
5. **Verify the phone number** via OTP
6. **Set up your business profile** (name, description, logo)
7. **Create message templates** and submit for Meta approval
8. **Start sending messages** via the Exotel WhatsApp API

:::info
The onboarding process typically takes 3-7 business days, depending on Meta's business verification timeline. Exotel assists with every step of the process.
:::

See the [WhatsApp Onboarding Guide](/docs/whatsapp-api/onboarding/overview) for detailed setup instructions.

---

## What is Meta Business Verification?

Meta Business Verification is a one-time process where Meta confirms your business identity. It requires:

| Document | Purpose |
|----------|---------|
| Business registration certificate | Proves legal entity |
| Tax registration (GST, PAN) | Confirms tax identity |
| Utility bill or bank statement | Verifies business address |
| Business website or social media | Confirms online presence |

### Verification Status Levels

| Status | Meaning | Messaging Capability |
|--------|---------|---------------------|
| Not verified | Business verification not started | Cannot use WhatsApp API |
| Pending | Documents submitted, under review | Limited messaging |
| Verified | Business identity confirmed | Full messaging capability |

---

## How do WhatsApp message templates work?

WhatsApp requires pre-approved templates for business-initiated messages. Templates must be submitted through Exotel and approved by Meta.

### Template Categories

| Category | Use Case | Approval Speed |
|----------|----------|---------------|
| **Utility** | Order updates, shipping alerts, account notifications | Fast (usually < 24 hours) |
| **Authentication** | OTPs and verification codes | Fast |
| **Marketing** | Promotions, offers, re-engagement | Slower (1-3 business days) |

### Template Components

| Component | Description | Example |
|-----------|-------------|---------|
| Header | Optional text, image, video, or document | Company logo image |
| Body | Main message text with variables | `Hello {{1}}, your order {{2}} has shipped.` |
| Footer | Optional small text | `Reply STOP to unsubscribe` |
| Buttons | Optional CTA or quick reply | `Track Order` button with URL |

### Variable Syntax

WhatsApp uses `{{1}}`, `{{2}}`, etc. for variables (unlike DLT's `{#var#}`):

```
Hello {{1}}, your appointment on {{2}} at {{3}} has been confirmed.
Please arrive 15 minutes early. Call {{4}} to reschedule.
```

:::warning
Meta rejects templates that are too generic, misleading, or primarily promotional when categorized as utility. Ensure your template content matches the selected category. Marketing templates have stricter approval criteria and may be rejected if they are too aggressive.
:::

> **API Reference:** See the [WhatsApp Templates API](/docs/whatsapp-api/templates-api/overview) for template management endpoints.

---

## What are WhatsApp messaging limits?

Meta imposes messaging limits based on your business quality and verification status:

### Messaging Tiers

| Tier | Messages per 24 hours | How to Achieve |
|------|----------------------|----------------|
| **Tier 1** | 1,000 unique users | Initial tier after verification |
| **Tier 2** | 10,000 unique users | Maintain high quality rating |
| **Tier 3** | 100,000 unique users | Sustained high-quality messaging |
| **Unlimited** | No limit | Highest quality tier |

### Tier Progression

Tiers increase automatically when:
- Your messaging volume reaches 2x your current tier
- Your quality rating is Medium or High
- You have been at the current tier for at least 48 hours

:::info
Quality rating is based on recipient feedback. If many recipients block or report your messages, your quality rating drops and your tier may decrease. Focus on sending relevant, timely, and expected messages.
:::

---

## How is WhatsApp pricing structured?

WhatsApp Business API uses **conversation-based pricing**:

| Conversation Type | Who Initiates | Pricing |
|------------------|--------------|---------|
| **Business-initiated** | You send a template message | Charged per conversation |
| **User-initiated** | Customer messages you first | Charged per conversation |
| **Free tier** | Customer-initiated | 1,000 free conversations per month |

### Conversation Windows

- A **conversation** is a 24-hour window that opens when a message is sent
- All messages within the 24-hour window are included in one conversation charge
- Business-initiated and user-initiated conversations have separate 24-hour windows

### Rates

Rates vary by country and conversation type. Check your Exotel dashboard or contact your account manager for current rates.

---

## What message types can I send?

| Message Type | Template Required? | 24-Hour Window? |
|-------------|-------------------|-----------------|
| Template messages | Yes | Opens a new business-initiated window |
| Text replies | No | Must be within user-initiated window |
| Interactive (buttons, lists) | Template for outbound; free-form for replies | Depends on initiation |
| Media (image, video, document) | Template for outbound; free-form for replies | Depends on initiation |
| Location messages | No | Must be within conversation window |

:::tip
You can only send template messages outside of an active conversation window. To send free-form messages (text, media, interactive), the customer must have messaged you within the last 24 hours.
:::

---

## Can I receive messages from customers?

Yes. Configure an incoming message webhook to receive customer messages:

```json
{
  "webhook_url": "https://your-server.com/webhooks/whatsapp-incoming"
}
```

When a customer sends a message to your WhatsApp Business number, Exotel forwards it to your webhook endpoint.

> **API Reference:** See [Receive Messages](/docs/whatsapp-api/api-reference/receive-messages) for webhook payload details.

---

## Can I use WhatsApp for OTPs?

Yes. WhatsApp supports **Authentication** templates specifically for OTPs:

- Use the Authentication template category
- Template includes a one-time password button
- Auto-fill capability on Android devices
- High delivery rate and read rate

:::info
WhatsApp OTPs complement SMS OTPs as a delivery channel. Many businesses use WhatsApp as the primary OTP channel with SMS as fallback, or vice versa.
:::

---

## What is the WhatsApp quality rating?

Meta assigns a quality rating to your WhatsApp Business account based on recipient behavior:

| Rating | Meaning | Impact |
|--------|---------|--------|
| **High (Green)** | Recipients engage positively | Tier may increase |
| **Medium (Yellow)** | Neutral engagement | Tier remains stable |
| **Low (Red)** | High block/report rate | Tier may decrease; messaging may be restricted |

### Improving Quality Rating

1. Send messages only to users who expect them
2. Provide clear opt-out mechanisms
3. Personalize messages with relevant content
4. Avoid sending too frequently
5. Respond promptly to customer replies
6. Monitor quality rating in your WhatsApp Business Manager

---

## Frequently Asked Questions

### Can I use WhatsApp and SMS from the same Exotel account?

Yes. Exotel supports voice, SMS, and WhatsApp from a single account. You can use all three channels and manage them through the same API credentials and dashboard.

### Does WhatsApp have DLT requirements like SMS?

No. WhatsApp uses Meta's own template approval system, not India's DLT framework. However, if you use SMS as a fallback channel, DLT registration is required for the SMS component.

### Can I port my existing WhatsApp Business number to Exotel?

Yes. You can migrate your WhatsApp Business number from another BSP to Exotel. The process involves coordinating between your current BSP and Exotel. Contact your account manager to initiate the migration.

### Is WhatsApp available on trial accounts?

WhatsApp is generally not available on trial accounts. You must have a paid plan and complete the WhatsApp onboarding process. Contact your account manager for details.

---

## Related Resources

- [WhatsApp API Overview](/docs/whatsapp-api/overview) -- Complete WhatsApp API documentation
- [WhatsApp Templates](/docs/whatsapp-api/api-reference/templates) -- Template management
- [WhatsApp Onboarding](/docs/whatsapp-api/onboarding/overview) -- Setup and onboarding guide
- [Send WhatsApp Message](/docs/whatsapp-api/api-reference/send-message) -- API reference
