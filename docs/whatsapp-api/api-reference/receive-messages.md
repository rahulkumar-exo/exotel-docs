---
id: receive-messages
title: Receive Messages
description: Configure webhooks to receive incoming WhatsApp messages and delivery status updates in real-time using the Exotel WhatsApp API.
sidebar_label: Receive Messages
---

# Receive Messages (Webhooks)

Configure webhooks to receive incoming WhatsApp messages and status updates from customers. Exotel delivers message events to your server in real-time.

## Webhook Configuration

Configure your webhook URL in the Exotel Dashboard under **WhatsApp > Settings > Webhooks**, or via API:

```
PUT /v2/accounts/<account_sid>/whatsapp/webhook
```

### Request Body

```json
{
  "whatsapp": {
    "webhook": {
      "incoming_message_url": "https://your-server.com/webhook/whatsapp/incoming",
      "status_callback_url": "https://your-server.com/webhook/whatsapp/status",
      "verify_token": "your_verification_token"
    }
  }
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `incoming_message_url` | String | Yes | URL to receive incoming messages |
| `status_callback_url` | String | No | URL to receive delivery/read receipts |
| `verify_token` | String | No | Token for webhook verification handshake |

---

## Incoming Message Webhook Payload

When a customer sends a WhatsApp message, Exotel POST's the following to your `incoming_message_url`:

### Text Message

```json
{
  "event": "incoming_message",
  "timestamp": "2024-06-15T10:30:00.000Z",
  "account_sid": "your_account_sid",
  "message": {
    "id": "msg_in_001",
    "from": "+919876543210",
    "to": "your_waba_number",
    "timestamp": "2024-06-15T10:30:00.000Z",
    "type": "text",
    "text": {
      "body": "Hello, I need help with my order"
    }
  },
  "contact": {
    "wa_id": "919876543210",
    "profile": {
      "name": "John Doe"
    }
  }
}
```

### Image Message

```json
{
  "event": "incoming_message",
  "message": {
    "id": "msg_in_002",
    "from": "+919876543210",
    "type": "image",
    "image": {
      "id": "media_abc123",
      "mime_type": "image/jpeg",
      "sha256": "abc123...",
      "caption": "Screenshot of the issue"
    }
  }
}
```

### Location Message

```json
{
  "event": "incoming_message",
  "message": {
    "id": "msg_in_003",
    "from": "+919876543210",
    "type": "location",
    "location": {
      "latitude": 12.9716,
      "longitude": 77.5946,
      "name": "Bangalore Office",
      "address": "123 MG Road, Bangalore"
    }
  }
}
```

### Button Reply

```json
{
  "event": "incoming_message",
  "message": {
    "id": "msg_in_004",
    "from": "+919876543210",
    "type": "button",
    "button": {
      "text": "Yes, I confirm",
      "payload": "confirm_order_12345"
    },
    "context": {
      "from": "your_waba_number",
      "id": "original_msg_id"
    }
  }
}
```

---

## Status Callback Webhook

Delivery and read status updates are sent to your `status_callback` URL (set per-message or configured as default during onboarding):

```json
{
  "whatsapp": {
    "messages": [
      {
        "callback_type": "dlr",
        "sid": "2FdiiEQUosckPhpZfuVwfjxiSlc16a4",
        "to": "919876543210",
        "exo_status_code": 30002,
        "exo_detailed_status": "EX_MESSAGE_DELIVERED",
        "description": "Message delivered",
        "timestamp": "2024-01-15T10:30:05.000+05:30",
        "custom_data": "Order12"
      }
    ]
  }
}
```

### Callback Fields

| Field | Description |
|-------|-------------|
| `callback_type` | `dlr` for delivery reports, `icm` for incoming messages |
| `sid` | Unique message identifier |
| `to` | Recipient phone number |
| `exo_status_code` | Exotel status code — see [Status Codes](/docs/whatsapp-api/api-reference/status-codes) |
| `exo_detailed_status` | Status string (e.g., `EX_MESSAGE_DELIVERED`) |
| `description` | Human-readable description |
| `timestamp` | ISO 8601 timestamp of the event |
| `custom_data` | Echoed back from the original API request (if provided) |

:::note
If `status_callback` is set both per-message in the API request and as a default, the per-message URL takes precedence. A callback is delivered to only one URL at a time.
:::

---

## Supported Message Types

| Type | Description |
|------|-------------|
| `text` | Plain text messages |
| `image` | Image with optional caption |
| `video` | Video with optional caption |
| `audio` | Audio messages |
| `document` | Document files (PDF, DOC, etc.) |
| `location` | Location coordinates |
| `contacts` | Contact cards |
| `sticker` | Sticker messages |
| `button` | Button reply from interactive messages |
| `list_reply` | List selection from interactive messages |
| `order` | Order details from catalog messages |

## Webhook Response

Your server must return HTTP `200` within **5 seconds** to acknowledge receipt. If Exotel doesn't receive a 200 response, it will retry:

| Retry | Delay |
|-------|-------|
| 1st | 30 seconds |
| 2nd | 2 minutes |
| 3rd | 10 minutes |
| 4th | 1 hour |

After 4 failed retries, the webhook is marked as failing and alerts are sent.

## Security

Verify incoming webhooks using the signature header:

```
X-Exotel-Signature: sha256=<hmac_signature>
```

```python
import hmac
import hashlib

def verify_webhook(payload, signature, secret):
    expected = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)
```
