---
id: message-types
title: WhatsApp Message Types
description: "Understand WhatsApp message types available on Exotel -- text, media, template, interactive, and list messages with usage guidelines."
sidebar_label: Message Types
sidebar_position: 6
---

# WhatsApp Message Types

The WhatsApp Business API supports a variety of message types to enable rich, interactive customer communication. This guide covers all available message types, when to use each one, and how they work within the Exotel platform.

## Message Type Overview

| Message Type | Requires Template | Session Required | Description |
|-------------|-------------------|-----------------|-------------|
| **Template** | Yes | No | Pre-approved messages to initiate conversations |
| **Text** | No | Yes | Plain text messages within a session |
| **Media** | No | Yes | Images, videos, documents, audio, stickers |
| **Interactive** | No | Yes | Buttons, list menus, quick replies |
| **Location** | No | Yes | Share GPS coordinates with a map preview |
| **Contact** | No | Yes | Share contact cards (vCard) |
| **Reaction** | No | Yes | React to a message with an emoji |

:::tip
Template messages are the only type that can be sent outside the 24-hour session window. All other message types require an active session initiated by the customer. See [Session Messages](/docs/whatsapp-support/session-messages) for details.
:::

## Template Messages

Template messages are pre-approved message formats required for initiating business-to-customer conversations. They are reviewed by Meta before they can be used.

### Structure

| Component | Required | Description |
|-----------|----------|-------------|
| **Header** | No | Text, image, video, or document |
| **Body** | Yes | Main message text with `{{1}}`, `{{2}}` parameters |
| **Footer** | No | Short footer text (max 60 characters) |
| **Buttons** | No | Quick Reply or Call-to-Action buttons (max 3) |

### API Example

```bash
curl -X POST "https://<api_key>:<api_token>@api.in.exotel.com/v2/accounts/<account_sid>/messages" \
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
              { "type": "text", "text": "ORD-12345" }
            ]
          }
        ]
      }
    }
  }'
```

For detailed template guidance, see [Template Messages](/docs/whatsapp-support/template-messages).

## Text Messages

Simple plain-text messages sent within an active 24-hour session window.

### Specifications

| Property | Limit |
|----------|-------|
| Max length | 4,096 characters |
| Formatting | Bold (`*text*`), italic (`_text_`), strikethrough (`~text~`), monospace (`` ```text``` ``) |
| URLs | Automatically rendered as clickable links |
| Emojis | Supported |

### API Example

```bash
curl -X POST "https://<api_key>:<api_token>@api.in.exotel.com/v2/accounts/<account_sid>/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+919876500001",
    "to": "+919876543210",
    "content": {
      "type": "text",
      "text": {
        "body": "Thank you for contacting us! How can we help you today?",
        "preview_url": false
      }
    }
  }'
```

### Text Formatting

| Format | Syntax | Result |
|--------|--------|--------|
| Bold | `*bold text*` | **bold text** |
| Italic | `_italic text_` | _italic text_ |
| Strikethrough | `~strikethrough~` | ~~strikethrough~~ |
| Monospace | `` ```code``` `` | `code` |

## Media Messages

Share images, videos, documents, audio files, and stickers within a session.

| Media Type | Supported Formats | Max Size |
|-----------|-------------------|----------|
| **Image** | JPEG, PNG | 5 MB |
| **Video** | MP4, 3GPP | 16 MB |
| **Audio** | AAC, MP3, AMR, OGG | 16 MB |
| **Document** | PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT | 100 MB |
| **Sticker** | WebP (static), WebP (animated) | 100 KB (static), 500 KB (animated) |

For detailed media messaging guidance, see [Media Messages](/docs/whatsapp-support/media-messages).

## Interactive Messages

Interactive messages allow customers to take action directly within the chat using buttons and menus.

### Types of Interactive Messages

| Type | Max Options | Description |
|------|-------------|-------------|
| **Reply Buttons** | 3 buttons | Up to 3 quick action buttons |
| **List Message** | 10 items in up to 10 sections | Scrollable menu of options |
| **CTA URL Button** | 2 buttons | Buttons that open a URL |

### Reply Buttons Example

```json
{
  "type": "interactive",
  "interactive": {
    "type": "button",
    "body": {
      "text": "How would you like to proceed with your order?"
    },
    "action": {
      "buttons": [
        { "type": "reply", "reply": { "id": "track", "title": "Track Order" } },
        { "type": "reply", "reply": { "id": "cancel", "title": "Cancel Order" } },
        { "type": "reply", "reply": { "id": "support", "title": "Talk to Agent" } }
      ]
    }
  }
}
```

### List Message Example

```json
{
  "type": "interactive",
  "interactive": {
    "type": "list",
    "body": {
      "text": "Please select your issue category:"
    },
    "action": {
      "button": "View Options",
      "sections": [
        {
          "title": "Order Issues",
          "rows": [
            { "id": "order_status", "title": "Order Status", "description": "Check your order delivery status" },
            { "id": "order_return", "title": "Return/Refund", "description": "Initiate a return or refund" }
          ]
        },
        {
          "title": "Account",
          "rows": [
            { "id": "profile", "title": "Update Profile", "description": "Change your account details" },
            { "id": "password", "title": "Reset Password", "description": "Reset your login credentials" }
          ]
        }
      ]
    }
  }
}
```

For detailed interactive messaging guidance, see [Interactive Messages](/docs/whatsapp-support/interactive-messages).

## Location Messages

Share a location with GPS coordinates, displayed as a map preview in the chat.

### API Example

```json
{
  "type": "location",
  "location": {
    "latitude": 12.9716,
    "longitude": 77.5946,
    "name": "Exotel Office",
    "address": "Bengaluru, Karnataka, India"
  }
}
```

## Contact Messages

Share a contact card (vCard) containing phone numbers, email addresses, and other details.

### API Example

```json
{
  "type": "contacts",
  "contacts": [
    {
      "name": {
        "formatted_name": "Exotel Support",
        "first_name": "Exotel",
        "last_name": "Support"
      },
      "phones": [
        { "phone": "+919876500001", "type": "WORK" }
      ],
      "emails": [
        { "email": "support@exotel.com", "type": "WORK" }
      ]
    }
  ]
}
```

## Reaction Messages

React to a specific message with an emoji. Useful for acknowledgments.

### API Example

```json
{
  "type": "reaction",
  "reaction": {
    "message_id": "wamid.xxxxxxxxxxxx",
    "emoji": "\ud83d\udc4d"
  }
}
```

## Choosing the Right Message Type

| Use Case | Recommended Type | Why |
|----------|-----------------|-----|
| Initiate conversation | Template | Required outside session window |
| Simple response | Text | Fast, lightweight |
| Send invoice or report | Media (Document) | Supports PDFs up to 100 MB |
| Offer choices | Interactive (Buttons) | Clear, clickable options |
| Category selection | Interactive (List) | Organized, scrollable menu |
| Product showcase | Media (Image/Video) | Visual engagement |
| Store location | Location | Map preview included |
| Share contact details | Contact | Native vCard format |
| Acknowledge a message | Reaction | Quick, non-intrusive |

:::warning
Sending non-template messages outside the 24-hour session window will result in an error. Always check if a session is active before sending free-form messages. Use the [WhatsApp API](/docs/whatsapp-api/overview) to check session status.
:::

## Next Steps

- [Template Messages](/docs/whatsapp-support/template-messages) -- Deep dive into templates
- [Session Messages](/docs/whatsapp-support/session-messages) -- 24-hour window explained
- [Interactive Messages](/docs/whatsapp-support/interactive-messages) -- Buttons and lists
- [Media Messages](/docs/whatsapp-support/media-messages) -- Sending media content
- [WhatsApp API Reference](/docs/whatsapp-api/overview) -- API documentation
