---
id: session-messages
title: WhatsApp Session Messages
description: "Understand WhatsApp session messages and the 24-hour window -- free-form messaging rules, session triggers, and best practices on Exotel."
sidebar_label: Session Messages
sidebar_position: 8
---

# WhatsApp Session Messages

Session messages are free-form messages that can be sent within a 24-hour customer service window on WhatsApp. Unlike template messages, session messages do not require pre-approval and support all message types including text, media, interactive, and location messages.

## What Is a Session Window?

A session window is a 24-hour period that opens when a customer sends a message to your WhatsApp Business number. During this window, you can send any type of message to that customer without using a template.

```
Customer sends message
         ↓
   ┌─────────────────────────────────────────────────┐
   │          24-Hour Session Window                  │
   │                                                  │
   │  You can send:                                   │
   │  - Text messages                                 │
   │  - Media (images, videos, documents)            │
   │  - Interactive messages (buttons, lists)         │
   │  - Location messages                             │
   │  - Contact cards                                 │
   │  - Reactions                                     │
   └─────────────────────────────────────────────────┘
         ↓ (24 hours expire)
   Session closes → Template required to re-initiate
```

## Session Window Rules

| Rule | Details |
|------|---------|
| **Duration** | 24 hours from the customer's last message |
| **Trigger** | Customer sends any message to your business number |
| **Renewal** | Each new customer message resets the 24-hour timer |
| **Expiry** | After 24 hours of customer inactivity, the session closes |
| **Post-expiry** | You must use an approved template to send a new message |

:::tip
The 24-hour window resets every time the customer sends a message. If a customer messages you at 10:00 AM and again at 3:00 PM, the window extends to 3:00 PM the next day.
:::

## Session vs. Template Messages

| Feature | Session Messages | Template Messages |
|---------|-----------------|-------------------|
| Requires pre-approval | No | Yes |
| Available message types | All (text, media, interactive, etc.) | Template format only |
| When to use | Within 24-hour window | Anytime (to initiate conversations) |
| Pricing | Service conversation rate | Category-based rate |
| Character limit | 4,096 (text) | 1,024 (body) |
| Media support | All types | Header media only |
| Interactive elements | Buttons, lists, menus | Template buttons only |

## Sending Session Messages

### Text Message

```bash
curl -X POST "https://<api_key>:<api_token>@api.in.exotel.com/v2/accounts/<account_sid>/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+919876500001",
    "to": "+919876543210",
    "content": {
      "type": "text",
      "text": {
        "body": "Hi Rahul! Thanks for reaching out. Let me check your order status."
      }
    }
  }'
```

### Image Message

```bash
curl -X POST "https://<api_key>:<api_token>@api.in.exotel.com/v2/accounts/<account_sid>/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+919876500001",
    "to": "+919876543210",
    "content": {
      "type": "image",
      "image": {
        "link": "https://example.com/images/order-status.png",
        "caption": "Your order tracking details"
      }
    }
  }'
```

### Interactive Reply Buttons

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
        "body": {
          "text": "Your order #ORD-12345 is out for delivery. Is someone available to receive it?"
        },
        "action": {
          "buttons": [
            { "type": "reply", "reply": { "id": "yes", "title": "Yes, I am available" } },
            { "type": "reply", "reply": { "id": "reschedule", "title": "Reschedule" } }
          ]
        }
      }
    }
  }'
```

## Handling Session Expiry

When a session expires and you need to message the customer, you must use a template:

```javascript
async function sendMessage(from, to, message) {
  try {
    // Try sending a session message first
    const response = await sendSessionMessage(from, to, message);
    return response;
  } catch (error) {
    if (error.code === 'SESSION_EXPIRED') {
      // Session expired - fall back to template message
      const templateResponse = await sendTemplateMessage(from, to, {
        name: 'follow_up',
        language: 'en',
        parameters: [message]
      });
      return templateResponse;
    }
    throw error;
  }
}
```

:::warning
Attempting to send a session message outside the 24-hour window returns an error. Always implement fallback logic to send a template message when the session has expired.
:::

## Session Window Scenarios

### Scenario 1: Customer Initiates and You Respond

```
10:00 AM - Customer: "What's my order status?"
           → Session opens (expires at 10:00 AM next day)

10:05 AM - Business: "Let me check! Your order #12345 is out for delivery."
           → Session message (within window)

10:06 AM - Business: [sends tracking image]
           → Session message (within window)
```

### Scenario 2: Customer Messages Again, Window Extends

```
10:00 AM - Customer: "What's my order status?"
           → Session opens (expires at 10:00 AM next day)

 3:00 PM - Customer: "Any update?"
           → Window extends (expires at 3:00 PM next day)

 3:05 PM - Business: "Your order is arriving tomorrow!"
           → Session message (within extended window)
```

### Scenario 3: Window Expires, Template Required

```
10:00 AM Day 1 - Customer: "I need help"
                 → Session opens

11:00 AM Day 2 - Session expired (24 hours passed)

11:30 AM Day 2 - Business wants to follow up
                 → Must use template message
```

### Scenario 4: Business Initiates with Template, Customer Responds

```
 9:00 AM - Business: [sends template: "Your order has shipped!"]
           → Business-initiated conversation

 9:30 AM - Customer: "When will it arrive?"
           → Session opens (expires at 9:30 AM next day)

 9:35 AM - Business: "Expected delivery is January 25."
           → Session message (within window)
```

## Session Message Pricing

Session messages are part of service conversations (user-initiated). Pricing depends on the market:

| Market | Service Conversation Rate |
|--------|--------------------------|
| India | Varies (check current Meta pricing) |
| Southeast Asia | Varies by country |

:::tip
Service conversations (customer-initiated) are often offered at a lower rate or free in certain markets. Check [Meta's pricing page](https://developers.facebook.com/docs/whatsapp/pricing) for the latest rates.
:::

## Best Practices

1. **Respond quickly** -- Aim to respond within minutes of a customer message to maximize the session window.
2. **Use interactive elements** -- Buttons and list menus help customers navigate faster and reduce the number of messages needed.
3. **Track session windows** -- Maintain a record of when each customer's session window expires so you can plan follow-ups.
4. **Implement template fallback** -- Always have a template ready for cases where the session expires before you can respond.
5. **Maximize the window** -- Use the session window to gather all necessary information and resolve issues without needing to re-initiate with a template.
6. **Do not spam during sessions** -- Just because you can send free-form messages does not mean you should send excessive messages. Respect the customer's time.

## Common Errors

| Error | Cause | Resolution |
|-------|-------|------------|
| `SESSION_EXPIRED` | 24-hour window has closed | Send a template message instead |
| `NO_ACTIVE_SESSION` | Customer has never messaged your number | Initiate with a template message first |
| `MESSAGE_TYPE_NOT_SUPPORTED` | Unsupported message type for session | Check supported message types |

## Next Steps

- [Template Messages](/docs/whatsapp-support/template-messages) -- For initiating conversations
- [Message Types](/docs/whatsapp-support/message-types) -- All available message types
- [Interactive Messages](/docs/whatsapp-support/interactive-messages) -- Buttons and menus
- [WhatsApp Webhooks](/docs/whatsapp-support/webhooks) -- Receive inbound messages
- [WhatsApp API Reference](/docs/whatsapp-api/overview) -- API documentation
