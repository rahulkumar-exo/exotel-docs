---
id: users
title: Users
sidebar_label: Users
---

# Users

Map and manage users within your WebRTC applications. Users are assigned SIP credentials and can make/receive calls through the application.

## Base URL

```
https://integrationscore.mum1.exotel.com/v2/integrations
```

## Create User

Map a new user under an application.

```
POST /{customer_id}/apps/{app_id}/users
```

### Headers

| Header | Value |
|--------|-------|
| `Authorization` | `Bearer <app_token>` |
| `Content-Type` | `application/json` |

### Request Body

```json
{
  "user_id": "agent_001",
  "name": "John Agent",
  "phone": "+919876543210",
  "sip_enabled": true
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | String | Yes | Unique identifier for the user |
| `name` | String | Yes | Display name |
| `phone` | String | No | PSTN phone number for fallback |
| `sip_enabled` | Boolean | No | Enable SIP/WebRTC calling (default: `true`) |

### Example Request

```bash
curl -X POST \
  'https://integrationscore.mum1.exotel.com/v2/integrations/{customer_id}/apps/{app_id}/users' \
  -H 'Authorization: Bearer <app_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "user_id": "agent_001",
    "name": "John Agent",
    "phone": "+919876543210",
    "sip_enabled": true
  }'
```

### Response

```json
{
  "success": true,
  "data": {
    "user_id": "agent_001",
    "name": "John Agent",
    "phone": "+919876543210",
    "sip_enabled": true,
    "sip_credentials": {
      "username": "agent_001@app_abc123.exotel.com",
      "domain": "sip.exotel.com"
    },
    "status": "active",
    "created_at": "2024-06-15T10:30:00.000Z"
  }
}
```

---

## List Users

```
GET /{customer_id}/apps/{app_id}/users
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | Integer | No | Results per page (default: 20) |
| `offset` | Integer | No | Pagination offset |

### Example Request

```bash
curl -X GET \
  'https://integrationscore.mum1.exotel.com/v2/integrations/{customer_id}/apps/{app_id}/users?limit=50' \
  -H 'Authorization: Bearer <app_token>'
```

### Response

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "user_id": "agent_001",
        "name": "John Agent",
        "phone": "+919876543210",
        "sip_enabled": true,
        "status": "active",
        "device_status": {
          "phone": true,
          "sip": true
        }
      },
      {
        "user_id": "agent_002",
        "name": "Jane Support",
        "phone": "+919876543211",
        "sip_enabled": true,
        "status": "active",
        "device_status": {
          "phone": true,
          "sip": false
        }
      }
    ],
    "total": 2,
    "limit": 50,
    "offset": 0
  }
}
```

---

## Get User Details

```
GET /{customer_id}/apps/{app_id}/users/{user_id}
```

### Response

```json
{
  "success": true,
  "data": {
    "user_id": "agent_001",
    "name": "John Agent",
    "phone": "+919876543210",
    "sip_enabled": true,
    "sip_credentials": {
      "username": "agent_001@app_abc123.exotel.com",
      "domain": "sip.exotel.com"
    },
    "status": "active",
    "device_status": {
      "phone": true,
      "sip": true
    },
    "created_at": "2024-06-15T10:30:00.000Z",
    "updated_at": "2024-06-15T10:30:00.000Z"
  }
}
```

---

## Delete User

```
DELETE /{customer_id}/apps/{app_id}/users/{user_id}
```

### Example Request

```bash
curl -X DELETE \
  'https://integrationscore.mum1.exotel.com/v2/integrations/{customer_id}/apps/{app_id}/users/{user_id}' \
  -H 'Authorization: Bearer <app_token>'
```

### Response

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

## HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | User created successfully |
| `400` | Bad Request — Invalid parameters or duplicate user_id |
| `401` | Unauthorized — Invalid or expired token |
| `404` | Not Found — User doesn't exist |
| `500` | Internal Server Error |
