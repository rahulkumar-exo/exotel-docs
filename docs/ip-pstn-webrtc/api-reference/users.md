---
id: users
title: Users
description: Map and manage users within your Exotel WebRTC application using the User Mapping API.
sidebar_label: Users
---

# Users

Map users from your application to Exotel accounts for WebRTC/IP-PSTN calling. Each mapping associates your app's user with an Exotel account, agent number, and virtual number.

## Base URL

```
https://integrationscore.mum1.exotel.com/v2/integrations
```

## Create User Mapping

Map a new user to an Exotel account.

```
POST /usermapping
```

### Headers

| Header | Value |
|--------|-------|
| `Authorization` | Your AuthCode |
| `Content-Type` | `application/json` |

### Request Body

```json
[
  {
    "AppUserId": "123",
    "AppUsername": "ABC",
    "Email": "xyz@exotel.in",
    "ExotelAccountSid": "<your_account_sid>",
    "ExotelUserName": "ABC XYZ",
    "AgentNumber": "956190XXXX",
    "VirtualNumber": "0113512XXXX"
  }
]
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `AppUserId` | String | Yes | Unique user ID in your application |
| `AppUsername` | String | Yes | Username in your application |
| `Email` | String | Yes | User's email address |
| `ExotelAccountSid` | String | Yes | Your Exotel Account SID |
| `ExotelUserName` | String | Yes | Display name for the Exotel user |
| `AgentNumber` | String | Yes | Agent's PSTN phone number |
| `VirtualNumber` | String | Yes | Virtual number assigned to this user |

### Example Request

```bash
curl --location --request POST \
  'https://integrationscore.mum1.exotel.com/v2/integrations/usermapping' \
  --header 'Authorization: <your_auth_code>' \
  --header 'Content-Type: application/json' \
  --data-raw '[
    {
      "AppUserId": "123",
      "AppUsername": "ABC",
      "Email": "xyz@exotel.in",
      "ExotelAccountSid": "<your_account_sid>",
      "ExotelUserName": "ABC XYZ",
      "AgentNumber": "956190XXXX",
      "VirtualNumber": "0113512XXXX"
    }
  ]'
```

## HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | User mapped successfully |
| `400` | Bad Request — Invalid parameters or duplicate user |
| `401` | Unauthorized — Invalid or expired auth code |
| `404` | Not Found — Account SID or virtual number not found |
| `500` | Internal Server Error |
