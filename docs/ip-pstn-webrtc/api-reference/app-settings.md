---
id: app-settings
title: App Settings
description: Configure webhooks for call events, recording, and streaming in your Exotel WebRTC application using the App Settings API.
sidebar_label: App Settings
---

# App Settings

Configure application-level settings for your WebRTC integration including webhooks for call events, recording, and streaming.

## Base URL

```
https://integrationscore.mum1.exotel.com/v2/integrations
```

## Update App Settings

```
PUT /{customer_id}/apps/{app_id}/settings
```

### Headers

| Header | Value |
|--------|-------|
| `Authorization` | `Bearer <app_token>` |
| `Content-Type` | `application/json` |

### Request Body

```json
{
  "popup_url": "https://your-server.com/webhook/popup",
  "missed_call_url": "https://your-server.com/webhook/missed-call",
  "callback_url": "https://your-server.com/webhook/callback",
  "recording_enabled": true,
  "recording_url": "https://your-server.com/webhook/recording",
  "streaming_enabled": false,
  "streaming_url": "https://your-server.com/webhook/stream"
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `popup_url` | String | No | URL to receive screen-pop data when a call arrives |
| `missed_call_url` | String | No | URL notified when an inbound call is missed |
| `callback_url` | String | No | URL for general call status callbacks |
| `recording_enabled` | Boolean | No | Enable or disable call recording |
| `recording_url` | String | No | URL to receive recording-ready notifications |
| `streaming_enabled` | Boolean | No | Enable or disable live audio streaming |
| `streaming_url` | String | No | URL for live audio stream delivery |

### Example Request

```bash
curl -X PUT \
  'https://integrationscore.mum1.exotel.com/v2/integrations/{customer_id}/apps/{app_id}/settings' \
  -H 'Authorization: Bearer <app_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "popup_url": "https://your-server.com/webhook/popup",
    "missed_call_url": "https://your-server.com/webhook/missed-call",
    "recording_enabled": true,
    "recording_url": "https://your-server.com/webhook/recording"
  }'
```

### Response

```json
{
  "success": true,
  "data": {
    "app_id": "app_abc123",
    "settings": {
      "popup_url": "https://your-server.com/webhook/popup",
      "missed_call_url": "https://your-server.com/webhook/missed-call",
      "callback_url": null,
      "recording_enabled": true,
      "recording_url": "https://your-server.com/webhook/recording",
      "streaming_enabled": false,
      "streaming_url": null,
      "updated_at": "2024-06-15T10:30:00.000Z"
    }
  }
}
```

---

## Get App Settings

```
GET /{customer_id}/apps/{app_id}/settings
```

### Example Request

```bash
curl -X GET \
  'https://integrationscore.mum1.exotel.com/v2/integrations/{customer_id}/apps/{app_id}/settings' \
  -H 'Authorization: Bearer <app_token>'
```

### Response

```json
{
  "success": true,
  "data": {
    "app_id": "app_abc123",
    "settings": {
      "popup_url": "https://your-server.com/webhook/popup",
      "missed_call_url": "https://your-server.com/webhook/missed-call",
      "callback_url": null,
      "recording_enabled": true,
      "recording_url": "https://your-server.com/webhook/recording",
      "streaming_enabled": false,
      "streaming_url": null,
      "created_at": "2024-06-01T09:00:00.000Z",
      "updated_at": "2024-06-15T10:30:00.000Z"
    }
  }
}
```

## Webhook Payloads

### Popup Webhook

Sent when an inbound call arrives for a user:

```json
{
  "event": "incoming_call",
  "call_sid": "call_123",
  "from": "+919876543210",
  "to": "sip:user@app.exotel.com",
  "timestamp": "2024-06-15T10:30:00.000Z"
}
```

### Recording Webhook

Sent when a call recording is ready:

```json
{
  "event": "recording_ready",
  "call_sid": "call_123",
  "recording_url": "https://recordings.exotel.com/call_123.mp3",
  "duration": 180,
  "timestamp": "2024-06-15T10:35:00.000Z"
}
```

## HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `400` | Bad Request — Invalid parameters |
| `401` | Unauthorized — Invalid or expired token |
| `404` | Not Found — App doesn't exist |
| `500` | Internal Server Error |
