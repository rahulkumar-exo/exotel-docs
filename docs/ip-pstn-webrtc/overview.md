---
id: overview
title: "IP-PSTN intermix: WebRTC SDK integration"
description: Integrate browser-to-phone and browser-to-browser calling into your apps with the Exotel WebRTC SDK and IP-PSTN APIs.
sidebar_label: Overview
slug: /ip-pstn-webrtc/overview
---

# IP-PSTN Intermix: WebRTC SDK Integration

Integrate WebRTC-based calling into your web and mobile applications, enabling browser-to-phone and browser-to-browser calls through Exotel's platform.

## Key Features

- **Browser-to-Phone** -- Make calls from web apps to PSTN numbers
- **Browser-to-Browser** -- VoIP calls between web clients
- **Authentication Tokens** -- Secure token-based access valid for 90 days
- **Application Management** -- Register, configure, and manage calling applications
- **User Management** -- Map users under applications with SIP credentials
- **Call Notifications** -- Handle inbound and outbound call events via webhooks
- **Device Management** -- Toggle phone/SIP device status per user
- **App Settings** -- Configure webhooks for popups, missed calls, callbacks, recording, and streaming

## Base URL

```
https://integrationscore.mum1.exotel.com/v2/integrations
```

## Authentication Flow

1. **Customer Token** -- Authenticate with customer ID and secret (`Entity: "customer"`)
2. **Register App** -- Create an application using the customer token, receive `AppID` and `AppSecret`
3. **App Token** -- Authenticate with AppID and AppSecret (`Entity: "app"`)
4. **Manage Users & Settings** -- Use the app token for all subsequent operations

Tokens are valid for **90 days**.

## Integration APIs

| API | Description |
|-----|-------------|
| **[Authentication](/docs/ip-pstn-webrtc/api-reference/authentication)** | Create auth tokens for customers or apps |
| **[Applications](/docs/ip-pstn-webrtc/api-reference/applications)** | Register, list, retrieve, and delete calling applications |
| **[App Settings](/docs/ip-pstn-webrtc/api-reference/app-settings)** | Configure webhooks for call events, recording, and streaming |
| **[Users](/docs/ip-pstn-webrtc/api-reference/users)** | Map, list, and manage users within applications |
| **[Device Management](/docs/ip-pstn-webrtc/api-reference/device-management)** | Toggle phone/SIP devices for users |
| **[Call Notifications](/docs/ip-pstn-webrtc/api-reference/call-notifications)** | Handle inbound and outbound call notification callbacks |
| **[Customer Management](/docs/ip-pstn-webrtc/api-reference/customer-management)** | Retrieve and delete customer accounts |

## Resources

- [Exotel Postman Collection](https://www.postman.com/universal-star-324650/workspace/exotel-apis/collection/22379282-0fc09e6e-8fdf-4dbd-8228-6b1888c109e6) -- Complete API examples
- Contact your Exotel account manager for SDK access and documentation

## HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `400` | Bad request / Invalid parameters |
| `401` | Unauthorized / Invalid token |
| `500` | Internal server error |
