---
id: status-codes
title: WhatsApp Status Codes
sidebar_label: Status Codes
sidebar_position: 4
---

# WhatsApp Status Codes

Delivery status codes returned via the `status_callback` webhook.

## Delivery Statuses

| Code  | Status    | Description |
|-------|-----------|-------------|
| 30001 | Sent      | Message sent to WhatsApp servers |
| 30002 | Delivered | Message delivered to recipient's device |
| 30003 | Seen      | Recipient opened/read the message |

## Error Statuses

| Code  | Description |
|-------|-------------|
| 30004 | Rate limit exceeded |
| 30005 | Unknown error |
| 30006 | Message expired (not delivered within TTL) |
| 30007 | Message blocked by WhatsApp |
| 30008 | Invalid phone number |
| 30009 | Media download failed |
| 30010 | Invalid template name |
| 30011 | Template parameter mismatch |
| 30012 | Template not approved |
| 30013 | Recipient not on WhatsApp |
| 30014 | Message too long |
| 30020 | Account not registered for WhatsApp |
| 30030 | Business account restricted |
| 30040 | Recipient blocked your number |
| 30041 | Spam detected |

## Payment Statuses (India Only)

| Code  | Status           | Description |
|-------|------------------|-------------|
| 30050 | Payment Success  | Payment completed by recipient |
| 30049 | Payment Pending  | Payment initiated but not completed |

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 202  | Message accepted for delivery |
| 400  | Malformed request body |
| 401  | Authentication failed |
| 402  | Plan limit exceeded |
| 403  | Access denied |
| 404  | Resource not found |
| 5xx  | Server error |

## Webhook Payload

When a status update occurs, Exotel sends a POST to your `status_callback` URL:

```json
{
  "sid": "msg_sid_value",
  "from": "+919876500001",
  "to": "+919876543210",
  "status": "delivered",
  "exo_status_code": 30002,
  "timestamp": "2024-01-15T10:30:05Z"
}
```
