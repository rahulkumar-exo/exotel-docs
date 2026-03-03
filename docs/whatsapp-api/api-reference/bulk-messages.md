---
id: bulk-messages
title: Bulk WhatsApp Messages
description: Send up to 100 WhatsApp messages to different recipients in a single Exotel API call. Supports text, media, and template message types.
sidebar_label: Bulk Messages
sidebar_position: 3
---

# Bulk WhatsApp Messages

Send up to 100 WhatsApp messages to different recipients in a single API call.

## Endpoint

```
POST https://<api_key>:<api_token><subdomain>/v2/accounts/<account_sid>/messages
```

## Request Body

Send an array of message objects:

```json
{
  "messages": [
    {
      "from": "+919876500001",
      "to": "+919876543210",
      "content": {
        "recipient_type": "individual",
        "type": "text",
        "text": { "body": "Hi Rahul, your order is ready!" }
      }
    },
    {
      "from": "+919876500001",
      "to": "+919876543211",
      "content": {
        "recipient_type": "individual",
        "type": "text",
        "text": { "body": "Hi Priya, your order is ready!" }
      }
    }
  ]
}
```

## cURL Example

```bash
curl -X POST "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<sid>/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "from": "+919876500001",
        "to": "+919876543210",
        "content": {
          "recipient_type": "individual",
          "type": "template",
          "template": {
            "name": "order_ready",
            "language": { "code": "en", "policy": "deterministic" },
            "components": [{ "type": "body", "parameters": [{ "type": "text", "text": "Rahul" }] }]
          }
        }
      },
      {
        "from": "+919876500001",
        "to": "+919876543211",
        "content": {
          "recipient_type": "individual",
          "type": "template",
          "template": {
            "name": "order_ready",
            "language": { "code": "en", "policy": "deterministic" },
            "components": [{ "type": "body", "parameters": [{ "type": "text", "text": "Priya" }] }]
          }
        }
      }
    ]
  }'
```

## Response

```json
{
  "request_id": "a1b2c3d4",
  "http_code": 202,
  "metadata": {
    "total": 2,
    "success": 2,
    "failed": 0
  },
  "response": {
    "whatsapp": {
      "messages": [
        { "code": 202, "status": "success", "data": { "sid": "msg_sid_1" } },
        { "code": 202, "status": "success", "data": { "sid": "msg_sid_2" } }
      ]
    }
  }
}
```

## Limits

| Limit                     | Value          |
|---------------------------|----------------|
| Max messages per request  | 100            |

:::note
Each message in a bulk request is processed independently. The response includes per-message status so you can identify any individual failures.
:::
