---
id: customer-callbacks
title: Customer Callbacks
sidebar_label: Customer Callbacks
---

# Customer Callbacks

Schedule and manage callback requests from customers. When customers request a callback, this API queues the request and connects an available agent at the scheduled time.

## Create Callback Request

```
POST /v4/accounts/<account_sid>/callbacks
```

### Request Body

```json
{
  "customer_number": "+919876543210",
  "customer_name": "John Doe",
  "priority": "high",
  "scheduled_time": "2024-06-15T14:00:00.000Z",
  "exophone": "+911234567890",
  "team_id": "support_team",
  "custom_field": "ticket_12345",
  "max_retry": 3,
  "retry_interval": 300
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `customer_number` | String | Yes | Customer phone number in E.164 format |
| `customer_name` | String | No | Customer's name |
| `priority` | String | No | `low`, `normal` (default), `high` |
| `scheduled_time` | String | No | ISO 8601 timestamp (default: immediate) |
| `exophone` | String | Yes | ExoPhone to use for the callback |
| `team_id` | String | No | Route to specific team |
| `agent_id` | String | No | Assign to specific agent |
| `custom_field` | String | No | Application-specific data (e.g., ticket ID) |
| `max_retry` | Integer | No | Maximum retry attempts (default: 3) |
| `retry_interval` | Integer | No | Seconds between retries (default: 300) |

### Example Request

```bash
curl -X POST \
  'https://ccm-api.exotel.com/v4/accounts/<account_sid>/callbacks' \
  -H 'Authorization: Bearer <session_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "customer_number": "+919876543210",
    "exophone": "+911234567890",
    "priority": "high",
    "team_id": "support_team"
  }'
```

```python
import requests

response = requests.post(
    f"https://ccm-api.exotel.com/v4/accounts/{account_sid}/callbacks",
    headers={
        "Authorization": f"Bearer {session_token}",
        "Content-Type": "application/json"
    },
    json={
        "customer_number": "+919876543210",
        "exophone": "+911234567890",
        "priority": "high",
        "team_id": "support_team"
    }
)
```

### Response

```json
{
  "response": {
    "code": 201,
    "status": "success",
    "data": {
      "callback_id": "cb_abc123",
      "customer_number": "+919876543210",
      "status": "scheduled",
      "scheduled_time": "2024-06-15T14:00:00.000Z",
      "priority": "high",
      "created_at": "2024-06-15T10:30:00.000Z"
    }
  }
}
```

---

## Get Callback Details

```
GET /v4/accounts/<account_sid>/callbacks/<callback_id>
```

### Response

```json
{
  "response": {
    "data": {
      "callback_id": "cb_abc123",
      "customer_number": "+919876543210",
      "customer_name": "John Doe",
      "status": "completed",
      "attempts": [
        {
          "attempt_number": 1,
          "time": "2024-06-15T14:00:00.000Z",
          "status": "no-answer",
          "call_sid": null
        },
        {
          "attempt_number": 2,
          "time": "2024-06-15T14:05:00.000Z",
          "status": "connected",
          "call_sid": "call_xyz789",
          "agent_id": "agent_001",
          "duration": 180
        }
      ]
    }
  }
}
```

---

## List Callbacks

```
GET /v4/accounts/<account_sid>/callbacks
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | String | `scheduled`, `in-progress`, `completed`, `failed`, `canceled` |
| `priority` | String | `low`, `normal`, `high` |
| `start_date` | String | Filter by date range (ISO 8601) |
| `end_date` | String | End date filter |
| `limit` | Integer | Results per page |
| `offset` | Integer | Pagination offset |

---

## Cancel Callback

```
PUT /v4/accounts/<account_sid>/callbacks/<callback_id>
```

### Request Body

```json
{
  "status": "canceled",
  "reason": "Customer resolved issue via chat"
}
```

## Callback Status Values

| Status | Description |
|--------|-------------|
| `scheduled` | Callback is queued for the scheduled time |
| `in-progress` | System is attempting to connect agent and customer |
| `completed` | Callback was successful |
| `failed` | All retry attempts exhausted |
| `canceled` | Callback was manually canceled |

## HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `429` | Rate Limited |
