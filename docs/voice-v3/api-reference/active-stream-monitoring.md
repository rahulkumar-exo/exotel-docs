---
id: active-stream-monitoring
title: Active Stream Monitoring
description: Monitor active call streams in real-time using the Exotel Voice v3 API. Retrieve ongoing call details and connection status.
sidebar_label: Active Stream Monitoring
---

# Active Stream Monitoring

Monitor active call streams in real-time. This API returns the list of ongoing calls currently in progress on your account.

## Get Active Streams

```
GET /v3/accounts/<account_sid>/calls/active
```

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `account_sid` | String | Your Exotel account SID |

### Example Request

```bash
curl -X GET \
  'https://<api_key>:<api_token>@api.exotel.com/v3/accounts/<account_sid>/calls/active' \
  -H 'Content-Type: application/json'
```

### Response

```json
{
  "request_id": "req_xyz789",
  "method": "GET",
  "http_code": 200,
  "response": {
    "active_calls": [
      {
        "call_sid": "call_active_001",
        "status": "in-progress",
        "from": "+911234567890",
        "to": "+919876543210",
        "start_time": "2024-06-15T10:30:00.000Z",
        "duration": 120,
        "recording_enabled": true
      },
      {
        "call_sid": "call_active_002",
        "status": "ringing",
        "from": "+919876543211",
        "to": "+911234567890",
        "start_time": "2024-06-15T10:35:00.000Z",
        "duration": 0,
        "recording_enabled": false
      }
    ],
    "total_active": 2
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `active_calls` | Array | List of currently active call objects |
| `call_sid` | String | Unique identifier of the active call |
| `status` | String | Current status: `ringing` or `in-progress` |
| `from` | String | Originating phone number in E.164 format |
| `to` | String | Destination phone number in E.164 format |
| `start_time` | DateTime | ISO 8601 timestamp when the call was initiated |
| `duration` | Integer | Elapsed call time in seconds |
| `recording_enabled` | Boolean | Whether call recording is active for this call |
| `total_active` | Integer | Total number of active calls on the account |

## Use Cases

| Use Case | Description |
|----------|-------------|
| **Supervisor Dashboard** | Real-time view of all active calls for supervisors |
| **Load Monitoring** | Track concurrent call volume across the account |
| **Call Quality** | Monitor call duration and connection status |
| **Capacity Planning** | Detect peak periods and adjust routing accordingly |
