---
id: webhooks
title: WhatsApp Webhooks
description: "Configure WhatsApp webhooks on Exotel for real-time message status updates, inbound messages, and event notifications with payload details."
sidebar_label: Webhooks
sidebar_position: 16
---

# WhatsApp Webhooks

Webhooks deliver real-time notifications from WhatsApp to your server, including message status updates, inbound messages, and other events. This guide covers setup, payload formats, and best practices for processing WhatsApp webhooks on Exotel.

## Webhook Events

| Event Type | Description | Trigger |
|------------|-------------|---------|
| **Message Status** | Delivery status updates for outbound messages | Message sent, delivered, read, or failed |
| **Inbound Message** | Customer sends a message to your number | Text, media, interactive reply, location, contact |
| **Template Status** | Template approval or rejection notification | Template status changes |

## Setting Up Webhooks

### Step 1: Create Your Endpoint

Your webhook endpoint must:

| Requirement | Details |
|-------------|---------|
| Protocol | HTTPS (valid SSL certificate) |
| Response time | Under 10 seconds |
| Response code | 200 OK |
| Availability | Publicly accessible |
| Method | POST |

### Step 2: Configure in Exotel Dashboard

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Navigate to **WhatsApp** > **Settings** > **Webhooks**.
3. Enter your **Webhook URL**.
4. Select the events you want to receive:
   - Message Status Updates
   - Inbound Messages
5. Save the configuration.

### Step 3: Verify Your Endpoint

Exotel may send a verification request to confirm your endpoint is active:

```json
{
  "type": "verification",
  "challenge": "random_challenge_string"
}
```

Respond with the challenge string to verify:

```json
{
  "challenge": "random_challenge_string"
}
```

## Message Status Webhook

When the status of an outbound message changes, Exotel sends a status update to your webhook.

### Status Flow

```
sent → delivered → read
  ↘ failed
```

### Payload Format

```json
{
  "type": "message_status",
  "timestamp": "2025-01-15T10:30:05.000Z",
  "account_sid": "your_account_sid",
  "data": {
    "message_sid": "msg_abc123",
    "from": "+919876500001",
    "to": "+919876543210",
    "status": "delivered",
    "timestamp": "2025-01-15T10:30:05.000Z",
    "conversation": {
      "id": "conv_xyz789",
      "category": "utility",
      "expiration": "2025-01-16T10:30:00.000Z"
    },
    "pricing": {
      "billable": true,
      "category": "utility"
    }
  }
}
```

### Message Statuses

| Status | Description | Timestamp Meaning |
|--------|-------------|-------------------|
| `sent` | Message sent to WhatsApp servers | Time the message left Exotel |
| `delivered` | Message delivered to recipient's device | Time WhatsApp confirmed delivery |
| `read` | Recipient opened and viewed the message | Time the message was read |
| `failed` | Message delivery failed | Time of failure |

### Failed Status Details

When a message fails, additional error information is included:

```json
{
  "type": "message_status",
  "data": {
    "message_sid": "msg_def456",
    "status": "failed",
    "errors": [
      {
        "code": 131047,
        "title": "Re-engagement message",
        "detail": "More than 24 hours have passed since the recipient last replied"
      }
    ]
  }
}
```

## Inbound Message Webhook

When a customer sends a message to your WhatsApp Business number, you receive an inbound message notification.

### Text Message

```json
{
  "type": "inbound_message",
  "timestamp": "2025-01-15T10:35:00.000Z",
  "account_sid": "your_account_sid",
  "data": {
    "message_sid": "inb_msg_001",
    "from": "+919876543210",
    "to": "+919876500001",
    "timestamp": "2025-01-15T10:35:00.000Z",
    "message": {
      "type": "text",
      "text": {
        "body": "What is my order status?"
      }
    },
    "contact": {
      "profile": {
        "name": "Rahul Kumar"
      },
      "wa_id": "919876543210"
    }
  }
}
```

### Image Message

```json
{
  "type": "inbound_message",
  "data": {
    "message_sid": "inb_msg_002",
    "from": "+919876543210",
    "message": {
      "type": "image",
      "image": {
        "id": "media_id_123",
        "mime_type": "image/jpeg",
        "sha256": "hash_value",
        "caption": "Damaged product photo"
      }
    }
  }
}
```

### Interactive Reply (Button)

```json
{
  "type": "inbound_message",
  "data": {
    "message_sid": "inb_msg_003",
    "from": "+919876543210",
    "message": {
      "type": "interactive",
      "interactive": {
        "type": "button_reply",
        "button_reply": {
          "id": "track_order",
          "title": "Track Order"
        }
      }
    }
  }
}
```

### Interactive Reply (List)

```json
{
  "type": "inbound_message",
  "data": {
    "message_sid": "inb_msg_004",
    "from": "+919876543210",
    "message": {
      "type": "interactive",
      "interactive": {
        "type": "list_reply",
        "list_reply": {
          "id": "return_order",
          "title": "Return or Exchange",
          "description": "Initiate a return or exchange"
        }
      }
    }
  }
}
```

## Handling Webhooks

### Node.js (Express)

```javascript
const express = require('express');
const app = express();
app.use(express.json());

app.post('/whatsapp/webhook', (req, res) => {
  const { type, data } = req.body;

  switch (type) {
    case 'message_status':
      handleStatusUpdate(data);
      break;

    case 'inbound_message':
      handleInboundMessage(data);
      break;

    case 'verification':
      res.json({ challenge: req.body.challenge });
      return;
  }

  res.status(200).send('OK');
});

function handleStatusUpdate(data) {
  const { message_sid, status, errors } = data;
  console.log(`Message ${message_sid}: ${status}`);

  if (status === 'failed' && errors) {
    console.error(`Error: ${errors[0].title} - ${errors[0].detail}`);
  }

  // Update your database
  updateMessageStatus(message_sid, status);
}

function handleInboundMessage(data) {
  const { from, message } = data;
  const contactName = data.contact?.profile?.name || 'Unknown';

  console.log(`Message from ${contactName} (${from}): ${message.type}`);

  switch (message.type) {
    case 'text':
      processTextMessage(from, message.text.body);
      break;
    case 'interactive':
      processInteractiveReply(from, message.interactive);
      break;
    case 'image':
    case 'video':
    case 'document':
      processMediaMessage(from, message);
      break;
  }
}

app.listen(3000);
```

### Python (Flask)

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/whatsapp/webhook', methods=['POST'])
def webhook():
    payload = request.json
    event_type = payload.get('type')

    if event_type == 'verification':
        return jsonify({'challenge': payload.get('challenge')})

    if event_type == 'message_status':
        handle_status(payload['data'])

    elif event_type == 'inbound_message':
        handle_inbound(payload['data'])

    return 'OK', 200

def handle_status(data):
    msg_sid = data.get('message_sid')
    status = data.get('status')
    print(f"Message {msg_sid}: {status}")

def handle_inbound(data):
    from_number = data.get('from')
    message = data.get('message', {})
    msg_type = message.get('type')
    print(f"Inbound from {from_number}: {msg_type}")
```

## Retry Policy

If your endpoint fails to respond with a 200 status code:

| Attempt | Delay |
|---------|-------|
| 1st retry | 30 seconds |
| 2nd retry | 2 minutes |
| 3rd retry | 10 minutes |
| 4th retry | 30 minutes |
| 5th retry | 1 hour |

After all retries are exhausted, the event is dropped. Check the Exotel Dashboard for missed events.

## Securing Your Webhook

### IP Whitelisting

Restrict your endpoint to accept requests only from Exotel's IP ranges. Contact Exotel support for the current IP whitelist.

### Request Validation

Validate that incoming requests contain the expected structure:

```javascript
app.post('/whatsapp/webhook', (req, res) => {
  // Validate required fields
  if (!req.body.type || !req.body.account_sid) {
    return res.status(400).send('Invalid payload');
  }

  // Validate account SID
  if (req.body.account_sid !== process.env.EXOTEL_ACCOUNT_SID) {
    return res.status(403).send('Unauthorized');
  }

  // Process webhook
  // ...
  res.status(200).send('OK');
});
```

:::tip
Process webhooks asynchronously. Return a 200 response immediately and handle the business logic in a background worker. This prevents timeouts and ensures Exotel does not retry unnecessarily.
:::

## Testing Webhooks

### Local Development with ngrok

```bash
ngrok http 3000
```

Use the generated HTTPS URL as your webhook URL in the Exotel Dashboard.

### Verification Steps

1. Configure the ngrok URL in the dashboard.
2. Send a test template message to your own number.
3. Check your server logs for incoming webhook payloads.
4. Reply to the message from your phone to test inbound webhooks.
5. Verify all payload fields match the expected format.

## Best Practices

1. **Respond immediately** -- Return 200 within 5 seconds; process asynchronously.
2. **Be idempotent** -- Use `message_sid` to deduplicate; the same event may arrive multiple times.
3. **Log all events** -- Store raw payloads for debugging and compliance.
4. **Handle all message types** -- Your inbound handler should process text, media, interactive, and other types.
5. **Monitor webhook health** -- Alert on failures, timeouts, or unexpected payloads.
6. **Use a message queue** -- Push events to a queue (SQS, RabbitMQ, Redis) for reliable processing.

## Next Steps

- [Status Codes](/docs/whatsapp-support/status-codes) -- Delivery and error codes
- [Interactive Messages](/docs/whatsapp-support/interactive-messages) -- Handle interactive replies
- [Session Messages](/docs/whatsapp-support/session-messages) -- 24-hour session window
- [WhatsApp API Reference](/docs/whatsapp-api/overview) -- API documentation
