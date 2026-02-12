---
id: call-details
title: Call Details (Beta)
sidebar_label: Call Details
---

# Call Details (Beta)

Retrieve enhanced call detail records with richer metadata including leg-level information, recording details, and custom fields.

## Get Single Call Details

```
GET /v3/accounts/<account_sid>/calls/<call_sid>
```

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `account_sid` | String | Your Exotel account SID |
| `call_sid` | String | Unique identifier of the call |

### Example Request

```bash
curl -X GET \
  'https://<api_key>:<api_token>@api.exotel.com/v3/accounts/<account_sid>/calls/abc123def456' \
  -H 'Content-Type: application/json'
```

### Response

```json
{
  "request_id": "a1b2c3d4e5f6",
  "method": "GET",
  "http_code": 200,
  "response": {
    "call": {
      "sid": "abc123def456",
      "date_created": "2024-06-15T10:30:00.000Z",
      "date_updated": "2024-06-15T10:35:00.000Z",
      "account_sid": "your_account_sid",
      "to": "+919876543210",
      "from": "+911234567890",
      "phone_number_sid": "exophone_sid",
      "status": "completed",
      "start_time": "2024-06-15T10:30:05.000Z",
      "end_time": "2024-06-15T10:35:00.000Z",
      "duration": 295,
      "price": 1.50,
      "direction": "outbound-api",
      "answered_by": "human",
      "recording_url": "https://s3-ap-southeast-1.amazonaws.com/...",
      "recording_duration": 290,
      "legs": [
        {
          "leg_sid": "leg_001",
          "contact_uri": "+919876543210",
          "direction": "outbound",
          "status": "completed",
          "duration": 295,
          "network_type": "pstn"
        }
      ],
      "custom_field": "order_id_12345"
    }
  }
}
```

---

## Get Bulk Call Details

Retrieve multiple call records with filtering and pagination.

```
GET /v3/accounts/<account_sid>/calls
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `start_time` | String | No | Filter by start time (ISO 8601) |
| `end_time` | String | No | Filter by end time (ISO 8601) |
| `status` | String | No | Filter by call status: `queued`, `ringing`, `in-progress`, `completed`, `failed`, `busy`, `no-answer` |
| `direction` | String | No | `inbound`, `outbound-api`, `outbound-dial` |
| `to` | String | No | Filter by destination number |
| `from` | String | No | Filter by source number |
| `limit` | Integer | No | Results per page (default: 20, max: 200) |
| `offset` | Integer | No | Pagination offset |
| `sort_by` | String | No | Sort field and direction, e.g., `date_created:desc` |

### Example Request

```bash
curl -X GET \
  'https://<api_key>:<api_token>@api.exotel.com/v3/accounts/<account_sid>/calls?status=completed&limit=50&sort_by=date_created:desc' \
  -H 'Content-Type: application/json'
```

### Response

```json
{
  "request_id": "req_abc123",
  "method": "GET",
  "http_code": 200,
  "metadata": {
    "total": 1250,
    "limit": 50,
    "offset": 0,
    "has_next": true
  },
  "response": {
    "calls": [
      {
        "sid": "call_001",
        "to": "+919876543210",
        "from": "+911234567890",
        "status": "completed",
        "duration": 180,
        "direction": "outbound-api",
        "date_created": "2024-06-15T10:30:00.000Z"
      },
      {
        "sid": "call_002",
        "to": "+919876543211",
        "from": "+911234567890",
        "status": "completed",
        "duration": 45,
        "direction": "inbound",
        "date_created": "2024-06-15T10:25:00.000Z"
      }
    ]
  }
}
```

## Call Status Values

| Status | Description |
|--------|-------------|
| `queued` | Call is queued for processing |
| `ringing` | Endpoint is ringing |
| `in-progress` | Call is active |
| `completed` | Call ended normally |
| `failed` | Call failed to connect |
| `busy` | Endpoint was busy |
| `no-answer` | No answer within timeout |
| `canceled` | Call was canceled before connection |

## HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `400` | Bad Request — Invalid parameters |
| `401` | Unauthorized — Invalid credentials |
| `404` | Not Found — Call SID doesn't exist |
| `429` | Rate Limited — Too many requests |
| `500` | Server Error |
