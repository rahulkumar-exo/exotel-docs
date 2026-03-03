---
id: templates
title: Template Messages
description: Send pre-approved WhatsApp message templates with dynamic parameters using the Exotel API. Includes text, media, and interactive templates.
sidebar_label: Templates
sidebar_position: 2
---

# Template Messages

Send pre-approved WhatsApp message templates with dynamic parameter substitution. Templates must be approved in the WhatsApp Business Manager before use.

## Endpoint

```
POST https://<api_key>:<api_token><subdomain>/v2/accounts/<account_sid>/messages
```

## Template Content Object

```json
{
  "from": "+919876500001",
  "to": "+919876543210",
  "content": {
    "recipient_type": "individual",
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
            { "type": "text", "text": "#ORD-12345" },
            { "type": "text", "text": "Feb 10, 2024" }
          ]
        }
      ]
    }
  }
}
```

## Template Parameters

| Field                        | Required  | Description |
|------------------------------|-----------|-------------|
| `template.name`              | Mandatory | Approved template name |
| `template.language.code`     | Mandatory | Language code (e.g., `en`, `hi`, `ta`) |
| `template.language.policy`   | Mandatory | `deterministic` (recommended) |
| `template.components`        | Optional  | Array of component objects for dynamic values |

### Component Types

| Type     | Description |
|----------|-------------|
| `header` | Template header parameters (text, image, video, document) |
| `body`   | Template body text parameters |
| `button` | Button parameters (URL suffix, quick reply payload) |

### Parameter Types

| Type       | Fields | Description |
|------------|--------|-------------|
| `text`     | `text` | Dynamic text value |
| `image`    | `link` | Image URL for header |
| `video`    | `link` | Video URL for header |
| `document` | `link`, `filename` | Document URL for header |

## Example: Template with Header Image

```json
{
  "from": "+919876500001",
  "to": "+919876543210",
  "content": {
    "recipient_type": "individual",
    "type": "template",
    "template": {
      "name": "promo_with_image",
      "language": { "code": "en", "policy": "deterministic" },
      "components": [
        {
          "type": "header",
          "parameters": [
            { "type": "image", "image": { "link": "https://example.com/promo.jpg" } }
          ]
        },
        {
          "type": "body",
          "parameters": [
            { "type": "text", "text": "50%" },
            { "type": "text", "text": "Feb 28" }
          ]
        }
      ]
    }
  }
}
```

## cURL Example

```bash
curl -X POST "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<sid>/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+919876500001",
    "to": "+919876543210",
    "content": {
      "recipient_type": "individual",
      "type": "template",
      "template": {
        "name": "order_confirmation",
        "language": { "code": "en", "policy": "deterministic" },
        "components": [{
          "type": "body",
          "parameters": [
            { "type": "text", "text": "Rahul" },
            { "type": "text", "text": "#ORD-12345" }
          ]
        }]
      }
    }
  }'
```

:::note
Templates must be approved by Meta before they can be used. Unapproved templates will result in a 400 error. Create and manage templates in the [WhatsApp Business Manager](https://business.facebook.com/wa/manage/message-templates/).
:::
