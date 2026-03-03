---
id: device-management
title: Device Management
description: Toggle phone and SIP device status for users in your Exotel WebRTC application using the Device Management API.
sidebar_label: Device Management
---

# Device Management

Toggle phone and SIP device status for users in your WebRTC application. Control whether a user receives calls on their PSTN phone, SIP endpoint, or both.

## Base URL

```
https://integrationscore.mum1.exotel.com/v2/integrations
```

## Update Device Status

Toggle a user's phone or SIP device on/off.

```
PUT /{customer_id}/apps/{app_id}/users/{user_id}/devices
```

### Headers

| Header | Value |
|--------|-------|
| `Authorization` | `Bearer <app_token>` |
| `Content-Type` | `application/json` |

### Request Body

```json
{
  "phone": true,
  "sip": true
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `phone` | Boolean | No | Enable/disable PSTN phone device |
| `sip` | Boolean | No | Enable/disable SIP/WebRTC device |

:::info
At least one device must remain enabled. The API will reject requests that disable all devices.
:::

### Example Request

```bash
curl -X PUT \
  'https://integrationscore.mum1.exotel.com/v2/integrations/{customer_id}/apps/{app_id}/users/{user_id}/devices' \
  -H 'Authorization: Bearer <app_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "phone": false,
    "sip": true
  }'
```

### Response

```json
{
  "success": true,
  "data": {
    "user_id": "agent_001",
    "devices": {
      "phone": {
        "enabled": false,
        "number": "+919876543210"
      },
      "sip": {
        "enabled": true,
        "username": "agent_001@app_abc123.exotel.com"
      }
    },
    "updated_at": "2024-06-15T10:30:00.000Z"
  }
}
```

---

## Get Device Status

```
GET /{customer_id}/apps/{app_id}/users/{user_id}/devices
```

### Example Request

```bash
curl -X GET \
  'https://integrationscore.mum1.exotel.com/v2/integrations/{customer_id}/apps/{app_id}/users/{user_id}/devices' \
  -H 'Authorization: Bearer <app_token>'
```

### Response

```json
{
  "success": true,
  "data": {
    "user_id": "agent_001",
    "devices": {
      "phone": {
        "enabled": false,
        "number": "+919876543210"
      },
      "sip": {
        "enabled": true,
        "username": "agent_001@app_abc123.exotel.com",
        "registered": true,
        "last_seen": "2024-06-15T10:25:00.000Z"
      }
    }
  }
}
```

## Device Behavior

| phone | sip | Behavior |
|-------|-----|----------|
| `true` | `true` | Calls ring on both PSTN phone and WebRTC client |
| `true` | `false` | Calls ring only on PSTN phone |
| `false` | `true` | Calls ring only on WebRTC/SIP client |
| `false` | `false` | ❌ Not allowed — at least one device must be enabled |

## HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `400` | Bad Request — Invalid parameters or all devices disabled |
| `401` | Unauthorized — Invalid or expired token |
| `404` | Not Found — User doesn't exist |
| `500` | Internal Server Error |
