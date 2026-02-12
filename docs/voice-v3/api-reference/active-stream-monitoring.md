---
id: active-stream-monitoring
title: Active Stream Monitoring
sidebar_label: Active Stream Monitoring
---

# Active Stream Monitoring

Monitor and manage active call streams in real-time. This API allows you to retrieve details about ongoing calls, including agent and customer connection status.

## Get Active Streams

```
GET /v3/accounts/<account_sid>/calls/active
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `agent_id` | String | No | Filter by agent user ID |
| `direction` | String | No | `inbound` or `outbound` |
| `limit` | Integer | No | Results per page (default: 20) |
| `offset` | Integer | No | Pagination offset |

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
        "direction": "outbound-api",
        "status": "in-progress",
        "from": "+911234567890",
        "to": "+919876543210",
        "start_time": "2024-06-15T10:30:00.000Z",
        "duration": 120,
        "agent_details": {
          "user_id": "agent_uuid_001",
          "name": "John Agent",
          "status": "on-call"
        },
        "recording_enabled": true
      },
      {
        "call_sid": "call_active_002",
        "direction": "inbound",
        "status": "ringing",
        "from": "+919876543211",
        "to": "+911234567890",
        "start_time": "2024-06-15T10:35:00.000Z",
        "duration": 0,
        "agent_details": null,
        "recording_enabled": false
      }
    ],
    "total_active": 2
  }
}
```

---

## Get Active Stream Details

Retrieve detailed information about a specific active call.

```
GET /v3/accounts/<account_sid>/calls/<call_sid>/stream
```

### Response

```json
{
  "request_id": "req_stream_001",
  "method": "GET",
  "http_code": 200,
  "response": {
    "stream": {
      "call_sid": "call_active_001",
      "status": "in-progress",
      "duration": 180,
      "legs": [
        {
          "leg_sid": "leg_agent_001",
          "contact_uri": "+911234567890",
          "direction": "outbound",
          "status": "connected",
          "network_type": "pstn",
          "audio_status": {
            "muted": false,
            "hold": false
          }
        },
        {
          "leg_sid": "leg_customer_001",
          "contact_uri": "+919876543210",
          "direction": "outbound",
          "status": "connected",
          "network_type": "pstn",
          "audio_status": {
            "muted": false,
            "hold": false
          }
        }
      ],
      "bridge": {
        "bridge_sid": "bridge_001",
        "status": "active",
        "created_at": "2024-06-15T10:30:05.000Z"
      },
      "recording": {
        "enabled": true,
        "channels": "dual",
        "duration": 175
      }
    }
  }
}
```

## Use Cases

| Use Case | Description |
|----------|-------------|
| **Supervisor Dashboard** | Real-time view of all active calls for supervisors |
| **Load Monitoring** | Track concurrent call volume |
| **Call Quality** | Monitor call duration and connection status |
| **Agent Tracking** | See which agents are on active calls |
