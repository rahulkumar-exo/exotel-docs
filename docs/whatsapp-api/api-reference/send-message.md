---
id: send-message
title: Send WhatsApp Message
sidebar_label: Send Message
sidebar_position: 1
---

# Send WhatsApp Message

Send text, media, template, or interactive messages via WhatsApp.

## Endpoint

```
POST https://<api_key>:<api_token><subdomain>/v2/accounts/<account_sid>/messages
```

## Request Parameters

| Parameter         | Required  | Type   | Description |
|-------------------|-----------|--------|-------------|
| `from`            | Mandatory | String | Your WhatsApp-enabled phone number (E.164) |
| `to`              | Mandatory | String | Recipient phone number (E.164) |
| `content`         | Mandatory | Object | Message content object (see below) |
| `status_callback` | Optional  | String | Webhook URL for delivery status updates |
| `custom_data`     | Optional  | String | Application-specific metadata |

### Content Object

```json
{
  "recipient_type": "individual",
  "type": "text",
  "text": {
    "body": "Hello! How can we help you today?"
  }
}
```

### Supported Content Types

**Text:**
```json
{ "type": "text", "text": { "body": "Your message here" } }
```

**Image:**
```json
{ "type": "image", "image": { "link": "https://example.com/image.jpg", "caption": "Check this out" } }
```

**Document:**
```json
{ "type": "document", "document": { "link": "https://example.com/invoice.pdf", "filename": "invoice.pdf" } }
```

**Location:**
```json
{ "type": "location", "location": { "latitude": 12.9716, "longitude": 77.5946, "name": "Exotel Office", "address": "Bangalore, India" } }
```

**Interactive (Buttons):**
```json
{
  "type": "interactive",
  "interactive": {
    "type": "button",
    "body": { "text": "Choose an option:" },
    "action": {
      "buttons": [
        { "type": "reply", "reply": { "id": "btn_yes", "title": "Yes" } },
        { "type": "reply", "reply": { "id": "btn_no", "title": "No" } }
      ]
    }
  }
}
```

## Code Examples

### cURL

```bash
curl -X POST "https://<your_api_key>:<your_api_token>@api.exotel.com/v2/accounts/<your_sid>/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+919876500001",
    "to": "+919876543210",
    "content": {
      "recipient_type": "individual",
      "type": "text",
      "text": { "body": "Hello from Exotel!" }
    },
    "status_callback": "https://your-server.com/wa-status"
  }'
```

### Python

```python
import requests
import json

payload = {
    "from": "+919876500001",
    "to": "+919876543210",
    "content": {
        "recipient_type": "individual",
        "type": "text",
        "text": {"body": "Hello from Exotel!"}
    },
    "status_callback": "https://your-server.com/wa-status"
}

response = requests.post(
    "https://<your_api_key>:<your_api_token>@api.exotel.com/v2/accounts/<your_sid>/messages",
    headers={"Content-Type": "application/json"},
    data=json.dumps(payload)
)

print(response.json())
```

### Node.js

```javascript
const axios = require('axios');

const payload = {
  from: '+919876500001',
  to: '+919876543210',
  content: {
    recipient_type: 'individual',
    type: 'text',
    text: { body: 'Hello from Exotel!' }
  },
  status_callback: 'https://your-server.com/wa-status'
};

axios.post(
  'https://<your_api_key>:<your_api_token>@api.exotel.com/v2/accounts/<your_sid>/messages',
  payload
).then(res => console.log(res.data));
```

## Response

**HTTP 202 Accepted**

```json
{
  "request_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "http_code": 202,
  "metadata": {
    "total": 1,
    "success": 1,
    "failed": 0
  },
  "response": {
    "whatsapp": {
      "messages": [
        {
          "code": 202,
          "status": "success",
          "data": {
            "sid": "msg_sid_value"
          }
        }
      ]
    }
  }
}
```

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 202  | Message accepted for delivery |
| 400  | Malformed request |
| 401  | Authentication failed |
| 402  | Plan limit exceeded |
| 403  | Access denied |
| 404  | Resource not found |
| 5xx  | Server error — retry the request |
