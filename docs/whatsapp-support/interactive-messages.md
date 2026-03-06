---
id: interactive-messages
title: WhatsApp Interactive Messages
description: "Build WhatsApp interactive messages with Exotel -- reply buttons, list menus, quick replies, and CTA buttons for engaging conversations."
sidebar_label: Interactive Messages
sidebar_position: 9
---

# WhatsApp Interactive Messages

Interactive messages allow customers to respond with structured actions -- tapping buttons, selecting from menus, or clicking links -- instead of typing free-form text. This improves response rates, reduces errors, and enables automated workflows.

## Interactive Message Types

| Type | Description | Max Options | Best For |
|------|-------------|-------------|----------|
| **Reply Buttons** | Up to 3 clickable buttons | 3 buttons | Simple choices (Yes/No, options) |
| **List Messages** | Scrollable menu with sections | 10 rows across 10 sections | Complex selections (categories, products) |
| **CTA URL Buttons** | Buttons that open a web URL | 2 buttons | Linking to websites, tracking pages |
| **CTA Phone Buttons** | Buttons that initiate a phone call | 1 button | Direct call support |

:::note
Interactive messages can only be sent within a 24-hour session window (session messages) or as part of a template. See [Session Messages](/docs/whatsapp-support/session-messages) for session details.
:::

## Reply Buttons

Reply buttons present up to 3 quick-action options. When a customer taps a button, the button text is sent as their response.

### Specifications

| Property | Limit |
|----------|-------|
| Body text | Required, max 1,024 characters |
| Header | Optional (text, image, video, document) |
| Footer | Optional, max 60 characters |
| Buttons | 1-3 buttons |
| Button title | Max 20 characters each |
| Button ID | Max 256 characters (used in webhook callback) |

### API Example

```bash
curl -X POST "https://<api_key>:<api_token>@api.in.exotel.com/v2/accounts/<account_sid>/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+919876500001",
    "to": "+919876543210",
    "content": {
      "type": "interactive",
      "interactive": {
        "type": "button",
        "header": {
          "type": "text",
          "text": "Order Update"
        },
        "body": {
          "text": "Your order #ORD-12345 has been delivered. How was your experience?"
        },
        "footer": {
          "text": "Tap a button to respond"
        },
        "action": {
          "buttons": [
            {
              "type": "reply",
              "reply": {
                "id": "rating_great",
                "title": "Great!"
              }
            },
            {
              "type": "reply",
              "reply": {
                "id": "rating_ok",
                "title": "It was okay"
              }
            },
            {
              "type": "reply",
              "reply": {
                "id": "rating_bad",
                "title": "Not satisfied"
              }
            }
          ]
        }
      }
    }
  }'
```

### Handling Button Responses

When a customer taps a button, your webhook receives the button ID and title:

```json
{
  "from": "+919876543210",
  "type": "interactive",
  "interactive": {
    "type": "button_reply",
    "button_reply": {
      "id": "rating_great",
      "title": "Great!"
    }
  }
}
```

## List Messages

List messages display a scrollable menu organized into sections. Customers tap a button to open the list, browse options, and select one.

### Specifications

| Property | Limit |
|----------|-------|
| Body text | Required, max 1,024 characters |
| Header | Optional, text only, max 60 characters |
| Footer | Optional, max 60 characters |
| Button text | Required, max 20 characters (the button that opens the list) |
| Sections | 1-10 sections |
| Rows per section | 1-10 rows |
| Total rows | Max 10 across all sections |
| Row title | Max 24 characters |
| Row description | Optional, max 72 characters |
| Row ID | Max 200 characters |

### API Example

```bash
curl -X POST "https://<api_key>:<api_token>@api.in.exotel.com/v2/accounts/<account_sid>/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+919876500001",
    "to": "+919876543210",
    "content": {
      "type": "interactive",
      "interactive": {
        "type": "list",
        "header": {
          "type": "text",
          "text": "Help Center"
        },
        "body": {
          "text": "Welcome to our support center. Please select the topic you need help with:"
        },
        "footer": {
          "text": "Reply AGENT to talk to a human"
        },
        "action": {
          "button": "Select Topic",
          "sections": [
            {
              "title": "Orders",
              "rows": [
                {
                  "id": "track_order",
                  "title": "Track My Order",
                  "description": "Get real-time delivery status"
                },
                {
                  "id": "cancel_order",
                  "title": "Cancel Order",
                  "description": "Cancel a pending order"
                },
                {
                  "id": "return_order",
                  "title": "Return or Exchange",
                  "description": "Initiate a return or exchange"
                }
              ]
            },
            {
              "title": "Payments",
              "rows": [
                {
                  "id": "refund_status",
                  "title": "Refund Status",
                  "description": "Check your refund progress"
                },
                {
                  "id": "payment_issue",
                  "title": "Payment Failed",
                  "description": "Help with payment problems"
                }
              ]
            },
            {
              "title": "Account",
              "rows": [
                {
                  "id": "update_profile",
                  "title": "Update Profile",
                  "description": "Change name, email, or address"
                },
                {
                  "id": "reset_password",
                  "title": "Reset Password",
                  "description": "Reset your login credentials"
                }
              ]
            }
          ]
        }
      }
    }
  }'
```

### Handling List Responses

When a customer selects a list item, your webhook receives:

```json
{
  "from": "+919876543210",
  "type": "interactive",
  "interactive": {
    "type": "list_reply",
    "list_reply": {
      "id": "track_order",
      "title": "Track My Order",
      "description": "Get real-time delivery status"
    }
  }
}
```

## CTA URL Buttons

Call-to-action buttons that open a URL in the customer's browser.

### API Example

```json
{
  "type": "interactive",
  "interactive": {
    "type": "cta_url",
    "body": {
      "text": "Your order #ORD-12345 has been shipped! Click below to track your delivery."
    },
    "action": {
      "name": "cta_url",
      "parameters": {
        "display_text": "Track Order",
        "url": "https://example.com/track/ORD-12345"
      }
    }
  }
}
```

## Building Conversational Flows

Interactive messages are most powerful when chained together to create multi-step flows:

```
Step 1: List Message
  "How can we help you today?"
  → Customer selects "Track My Order"

Step 2: Text Message
  "Please enter your order number."
  → Customer types "ORD-12345"

Step 3: Reply Buttons
  "Order #ORD-12345 is out for delivery. ETA: 3 PM.
   Need anything else?"
  [Yes, another question] [No, thanks]
  → Customer taps "No, thanks"

Step 4: Text Message
  "Thank you! Have a great day."
```

### Implementation Example

```javascript
async function handleInbound(message) {
  const { from, type, interactive, text } = message;
  const session = await getSession(from);

  if (type === 'interactive') {
    const reply = interactive.button_reply || interactive.list_reply;

    switch (reply.id) {
      case 'track_order':
        await sendTextMessage(from, 'Please enter your order number.');
        await updateSession(from, { step: 'awaiting_order_id' });
        break;

      case 'cancel_order':
        await sendReplyButtons(from,
          'Are you sure you want to cancel your order?',
          [
            { id: 'confirm_cancel', title: 'Yes, Cancel' },
            { id: 'keep_order', title: 'No, Keep It' }
          ]
        );
        break;

      case 'confirm_cancel':
        await cancelOrder(session.orderId);
        await sendTextMessage(from, 'Your order has been cancelled.');
        break;
    }
  } else if (type === 'text' && session.step === 'awaiting_order_id') {
    const orderStatus = await getOrderStatus(text.body);
    await sendReplyButtons(from,
      `Order #${text.body}: ${orderStatus}. Need anything else?`,
      [
        { id: 'help_more', title: 'Yes, another question' },
        { id: 'done', title: 'No, thanks' }
      ]
    );
  }
}
```

## Design Best Practices

1. **Keep button labels short** -- 20 characters maximum; use clear, action-oriented text.
2. **Use list messages for 4+ options** -- Reply buttons work for 2-3 choices; lists work for more.
3. **Add descriptions to list items** -- Help customers understand each option before selecting.
4. **Organize lists into sections** -- Group related items for easier navigation.
5. **Provide a fallback** -- Always offer a "Talk to Agent" or "Other" option.
6. **Chain messages logically** -- Guide customers through a clear, step-by-step flow.
7. **Handle unexpected responses** -- Customers may type text instead of tapping buttons; handle both.

:::warning
Interactive messages are not supported on WhatsApp Web (desktop) for some older versions. Ensure your customer base primarily uses mobile WhatsApp for the best experience.
:::

## Next Steps

- [Message Types](/docs/whatsapp-support/message-types) -- All WhatsApp message types
- [Media Messages](/docs/whatsapp-support/media-messages) -- Send images, videos, documents
- [Session Messages](/docs/whatsapp-support/session-messages) -- 24-hour session rules
- [WhatsApp Webhooks](/docs/whatsapp-support/webhooks) -- Handle inbound messages
- [WhatsApp API Reference](/docs/whatsapp-api/overview) -- API documentation
