---
id: template-messages
title: WhatsApp Template Messages
description: "Send WhatsApp template messages via Exotel -- creating templates, submitting for approval, using variables, and sending with the API."
sidebar_label: Template Messages
sidebar_position: 7
---

# WhatsApp Template Messages

Template messages are pre-approved message formats required to initiate conversations with customers on WhatsApp. This guide covers how templates work, how to create and manage them, and how to send them via the Exotel API.

## Why Templates Are Required

WhatsApp requires businesses to use pre-approved templates when initiating conversations to:

- **Prevent spam** -- Only approved messages can reach customers
- **Ensure quality** -- Meta reviews templates for content compliance
- **Protect users** -- Customers are not bombarded with unsolicited messages
- **Categorize billing** -- Templates determine conversation pricing by category

:::note
Templates are only required when **initiating** a conversation (business-initiated). Once a customer responds and a 24-hour session is open, you can send free-form messages. See [Session Messages](/docs/whatsapp-support/session-messages).
:::

## Template Structure

| Component | Required | Max Length | Description |
|-----------|----------|-----------|-------------|
| **Header** | No | 60 chars (text) | Text, image, video, or document header |
| **Body** | Yes | 1,024 chars | Main message content with `{{1}}` parameters |
| **Footer** | No | 60 chars | Small text below the body |
| **Buttons** | No | 3 max | Quick Reply or Call-to-Action buttons |

### Parameter Syntax

Use `{{1}}`, `{{2}}`, `{{3}}`, etc. as numbered placeholders for dynamic content:

```
Hello {{1}}, your order #{{2}} has been confirmed.
Estimated delivery: {{3}}.
```

When sending, you provide the actual values for each parameter:
- `{{1}}` = "Rahul"
- `{{2}}` = "ORD-12345"
- `{{3}}` = "January 25, 2025"

## Template Categories

Meta classifies templates into categories that determine pricing and delivery rules:

| Category | Use Case | Examples | Pricing |
|----------|----------|---------|---------|
| **Utility** | Transaction updates, account notifications | Order confirmations, shipping updates, payment receipts | Standard |
| **Authentication** | OTPs and verification codes | Login OTP, 2FA codes | Lower rate |
| **Marketing** | Promotions and engagement | Offers, product launches, re-engagement | Higher rate |

:::tip
Choose the correct category when creating your template. Miscategorized templates may be rejected or reclassified by Meta, which can affect your billing.
:::

## Creating a Template

### Via Exotel Dashboard

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Navigate to **WhatsApp** > **Templates**.
3. Click **Create Template**.
4. Fill in the template details (see below).
5. Submit for Meta review.

### Via Meta Business Manager

1. Go to [business.facebook.com](https://business.facebook.com).
2. Navigate to your **WhatsApp Account** > **Message Templates**.
3. Click **Create Template**.
4. Fill in the details and submit.

For detailed creation steps, see [Creating WhatsApp Templates](/docs/whatsapp-support/creating-templates).

## Sending Template Messages via API

### Basic Template (Text Only)

```bash
curl -u '<api_key>:<api_token>' -X POST "https://api.in.exotel.com/v2/accounts/<account_sid>/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+919876500001",
    "to": "+919876543210",
    "content": {
      "type": "template",
      "template": {
        "name": "order_confirmation",
        "language": {
          "code": "en",
          "policy": "deterministic"
        },
        "components": [
          {
            "type": "body",
            "parameters": [
              { "type": "text", "text": "Rahul" },
              { "type": "text", "text": "ORD-12345" },
              { "type": "text", "text": "January 25, 2025" }
            ]
          }
        ]
      }
    }
  }'
```

### Template with Image Header

```bash
curl -u '<api_key>:<api_token>' -X POST "https://api.in.exotel.com/v2/accounts/<account_sid>/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+919876500001",
    "to": "+919876543210",
    "content": {
      "type": "template",
      "template": {
        "name": "product_launch",
        "language": {
          "code": "en",
          "policy": "deterministic"
        },
        "components": [
          {
            "type": "header",
            "parameters": [
              {
                "type": "image",
                "image": {
                  "link": "https://example.com/images/product.jpg"
                }
              }
            ]
          },
          {
            "type": "body",
            "parameters": [
              { "type": "text", "text": "Rahul" },
              { "type": "text", "text": "30%" }
            ]
          }
        ]
      }
    }
  }'
```

### Template with Quick Reply Buttons

```bash
curl -u '<api_key>:<api_token>' -X POST "https://api.in.exotel.com/v2/accounts/<account_sid>/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+919876500001",
    "to": "+919876543210",
    "content": {
      "type": "template",
      "template": {
        "name": "delivery_update",
        "language": {
          "code": "en",
          "policy": "deterministic"
        },
        "components": [
          {
            "type": "body",
            "parameters": [
              { "type": "text", "text": "ORD-12345" },
              { "type": "text", "text": "January 25" }
            ]
          },
          {
            "type": "button",
            "sub_type": "quick_reply",
            "index": "0",
            "parameters": [
              { "type": "payload", "payload": "TRACK_ORDER" }
            ]
          },
          {
            "type": "button",
            "sub_type": "quick_reply",
            "index": "1",
            "parameters": [
              { "type": "payload", "payload": "CONTACT_SUPPORT" }
            ]
          }
        ]
      }
    }
  }'
```

### Template with CTA URL Button

```json
{
  "type": "template",
  "template": {
    "name": "order_tracking",
    "language": { "code": "en", "policy": "deterministic" },
    "components": [
      {
        "type": "body",
        "parameters": [
          { "type": "text", "text": "ORD-12345" }
        ]
      },
      {
        "type": "button",
        "sub_type": "url",
        "index": "0",
        "parameters": [
          { "type": "text", "text": "ORD-12345" }
        ]
      }
    ]
  }
}
```

## Template Statuses

| Status | Description |
|--------|-------------|
| `PENDING` | Submitted and awaiting Meta review |
| `APPROVED` | Approved and ready to use |
| `REJECTED` | Rejected by Meta; review the reason and modify |
| `PAUSED` | Temporarily paused due to quality issues |
| `DISABLED` | Permanently disabled by Meta |

## Template Approval Timeline

| Scenario | Expected Time |
|----------|---------------|
| Utility templates | Minutes to 24 hours |
| Authentication templates | Minutes to 24 hours |
| Marketing templates | Up to 24 hours |
| Templates requiring manual review | 1-3 business days |

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| `Template not found` | Template name or language does not match | Verify the template name is exactly as registered (case-sensitive, lowercase) |
| `Template paused` | Quality rating dropped | Improve template quality; see [Quality Rating](/docs/whatsapp-support/quality-rating) |
| `Parameter count mismatch` | Wrong number of parameters provided | Match parameter count to template placeholders |
| `Invalid parameter type` | Media URL invalid or text too long | Verify media URLs are accessible and text is within limits |
| `Template not approved` | Template is pending or rejected | Wait for approval or create a new template |

:::warning
Template names must be in lowercase with underscores. They cannot contain spaces, uppercase letters, or special characters. Example: `order_confirmation`, not `Order Confirmation`.
:::

## Best Practices

1. **Start with utility templates** -- They have the highest approval rate.
2. **Keep body text concise** -- Under 500 characters for better readability on mobile.
3. **Use meaningful button labels** -- Clear, action-oriented text (e.g., "Track Order", not "Click Here").
4. **Test with sample data** -- Verify that parameters render correctly before sending to customers.
5. **Monitor template quality** -- Check your quality rating regularly to avoid templates being paused.
6. **Create language variants** -- Register templates in multiple languages for diverse customer bases.

## Next Steps

- [Creating WhatsApp Templates](/docs/whatsapp-support/creating-templates) -- Detailed template creation guide
- [Template Guidelines](/docs/whatsapp-support/template-guidelines) -- What gets approved and rejected
- [Template Categories](/docs/whatsapp-support/template-categories) -- Category details and pricing
- [Session Messages](/docs/whatsapp-support/session-messages) -- Free-form messaging
- [WhatsApp API Reference](/docs/whatsapp-api/overview) -- API documentation
