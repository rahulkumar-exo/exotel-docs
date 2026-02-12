---
id: flows
title: Flows
sidebar_label: Flows
---

# WhatsApp Flows

WhatsApp Flows allow you to create interactive, multi-step experiences directly within WhatsApp. Build forms, surveys, appointment booking, and other structured interactions.

:::note
WhatsApp Flows is a newer feature and requires WABA approval. Contact your Exotel account manager for setup.
:::

## Send Flow Message

```
POST /v2/accounts/<account_sid>/messages
```

### Request Body

```json
{
  "whatsapp": {
    "messages": [{
      "from": "your_waba_number",
      "to": "+919876543210",
      "content": {
        "type": "interactive",
        "interactive": {
          "type": "flow",
          "header": {
            "type": "text",
            "text": "Book an Appointment"
          },
          "body": {
            "text": "Schedule your consultation with our team."
          },
          "footer": {
            "text": "Tap the button to proceed"
          },
          "action": {
            "name": "flow",
            "parameters": {
              "flow_message_version": "3",
              "flow_token": "your_flow_token",
              "flow_id": "flow_abc123",
              "flow_cta": "Book Now",
              "flow_action": "navigate",
              "flow_action_payload": {
                "screen": "APPOINTMENT_FORM",
                "data": {
                  "customer_name": "John Doe",
                  "available_slots": ["10:00 AM", "2:00 PM", "4:00 PM"]
                }
              }
            }
          }
        }
      }
    }]
  }
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `flow_id` | String | Yes | Unique Flow identifier from WABA |
| `flow_cta` | String | Yes | Button text (max 20 chars) |
| `flow_action` | String | Yes | `navigate` or `data_exchange` |
| `flow_token` | String | Yes | Your flow authentication token |
| `flow_message_version` | String | Yes | Flow version (currently `"3"`) |
| `flow_action_payload` | Object | No | Initial data to pass to the flow |

### Response

```json
{
  "response": {
    "code": 200,
    "status": "success",
    "data": {
      "message_id": "msg_flow_001",
      "status": "sent"
    }
  }
}
```

---

## Flow Response Webhook

When a user completes a flow, you receive the collected data:

```json
{
  "event": "flow_response",
  "message_id": "msg_flow_001",
  "from": "+919876543210",
  "flow_id": "flow_abc123",
  "flow_token": "your_flow_token",
  "response_json": {
    "appointment_date": "2024-06-20",
    "appointment_time": "2:00 PM",
    "reason": "Product consultation",
    "preferred_language": "English"
  },
  "timestamp": "2024-06-15T10:40:00.000Z"
}
```

## Flow Types

| Type | Description | Use Case |
|------|-------------|----------|
| **Form** | Collect structured data | Lead capture, registrations |
| **Survey** | Multiple choice questions | Customer feedback, NPS |
| **Appointment** | Date/time selection | Booking, scheduling |
| **Product Catalog** | Browse and select items | Order placement |
| **Custom** | Build any multi-screen flow | Complex workflows |

## Flow Actions

| Action | Description |
|--------|-------------|
| `navigate` | Open the flow on a specific screen |
| `data_exchange` | Send/receive data without opening a screen |

## HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `400` | Bad Request — Invalid flow parameters |
| `401` | Unauthorized |
| `403` | Flows not enabled on WABA |
| `404` | Flow ID not found |
