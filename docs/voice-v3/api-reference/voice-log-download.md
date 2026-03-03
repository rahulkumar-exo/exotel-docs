---
id: voice-log-download
title: Voice Log Download
description: Download voice recordings and call logs programmatically using the Exotel Voice v3 API. Supports MP3, WAV, and dual-channel formats.
sidebar_label: Voice Log Download
---

# Voice Log Download

Download voice recordings and detailed call logs for completed calls. This API provides programmatic access to call recordings in various formats.

## Download Voice Recording

```
GET /v3/accounts/<account_sid>/calls/<call_sid>/voice-logs
```

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `account_sid` | String | Your Exotel account SID |
| `call_sid` | String | Unique identifier of the call |

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `format` | String | No | Audio format: `mp3` (default), `wav` |
| `channel` | String | No | `single` (mixed) or `dual` (separate agent/customer) |
| `include_metadata` | Boolean | No | Include call metadata in response (default: `false`) |

### Example Request

```bash
curl -X GET \
  'https://<api_key>:<api_token>@api.exotel.com/v3/accounts/<account_sid>/calls/abc123/voice-logs?format=mp3' \
  -H 'Content-Type: application/json'
```

### Response

```json
{
  "request_id": "req_log_001",
  "method": "GET",
  "http_code": 200,
  "response": {
    "voice_log": {
      "call_sid": "abc123",
      "recording_url": "https://s3-ap-southeast-1.amazonaws.com/exotelrecordings/your_account_sid/abc123.mp3",
      "recording_duration": 295,
      "recording_size_bytes": 472000,
      "format": "mp3",
      "channel": "single",
      "created_at": "2024-06-15T10:35:00.000Z",
      "expires_at": "2024-09-15T10:35:00.000Z"
    }
  }
}
```

:::info
Recording URLs are time-limited signed URLs. They expire after the period shown in `expires_at`. Request a new URL if the link has expired.
:::

---

## Bulk Voice Log Download

Download voice logs for multiple calls at once.

```
POST /v3/accounts/<account_sid>/voice-logs/bulk
```

### Request Body

```json
{
  "call_sids": ["call_001", "call_002", "call_003"],
  "format": "mp3",
  "channel": "single"
}
```

### Response

```json
{
  "request_id": "req_bulk_001",
  "method": "POST",
  "http_code": 200,
  "response": {
    "voice_logs": [
      {
        "call_sid": "call_001",
        "recording_url": "https://s3-ap-southeast-1.amazonaws.com/.../call_001.mp3",
        "recording_duration": 180,
        "status": "available"
      },
      {
        "call_sid": "call_002",
        "recording_url": "https://s3-ap-southeast-1.amazonaws.com/.../call_002.mp3",
        "recording_duration": 45,
        "status": "available"
      },
      {
        "call_sid": "call_003",
        "recording_url": null,
        "recording_duration": 0,
        "status": "not_available"
      }
    ]
  }
}
```

---

## Date Range Export

Request a bulk export of voice logs for a date range. Returns a download link when ready.

```
POST /v3/accounts/<account_sid>/voice-logs/export
```

### Request Body

```json
{
  "start_date": "2024-06-01T00:00:00Z",
  "end_date": "2024-06-30T23:59:59Z",
  "format": "mp3",
  "callback_url": "https://your-server.com/webhook/export-ready"
}
```

### Response

```json
{
  "request_id": "req_export_001",
  "method": "POST",
  "http_code": 202,
  "response": {
    "export": {
      "export_id": "export_abc123",
      "status": "processing",
      "estimated_time_seconds": 300,
      "callback_url": "https://your-server.com/webhook/export-ready"
    }
  }
}
```

The callback URL receives a POST when the export is ready with a download link.

## Recording Status Values

| Status | Description |
|--------|-------------|
| `available` | Recording is ready for download |
| `processing` | Recording is being processed |
| `not_available` | No recording exists for this call |
| `expired` | Recording URL has expired, request again |

## HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success — Recording available |
| `202` | Accepted — Export is being processed |
| `400` | Bad Request — Invalid parameters |
| `401` | Unauthorized — Invalid credentials |
| `404` | Not Found — Call or recording doesn't exist |
| `429` | Rate Limited |
