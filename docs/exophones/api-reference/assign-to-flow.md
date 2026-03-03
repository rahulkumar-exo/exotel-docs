---
id: assign-to-flow
title: Assign to Flow
description: Assign an ExoPhone to a call or SMS flow using the Exotel API. Update voice and SMS routing URLs and friendly names for your phone numbers.
sidebar_label: Assign to Flow
---

# Assign ExoPhone to a Flow

Update an ExoPhone's configuration to route calls or SMS to specific flows.

## HTTP Request

```
PUT /v2_beta/Accounts/<account_sid>/IncomingPhoneNumbers/<exophone_sid>
```

## Path Parameters

| Parameter | Description |
|-----------|-------------|
| `exophone_sid` | The unique SID of the ExoPhone |

## Request Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `VoiceUrl` | No | Updated flow URL for incoming voice calls |
| `SMSUrl` | No | Updated flow URL for incoming SMS |
| `FriendlyName` | No | Updated friendly name |

## Response

Returns the updated ExoPhone object with the new configuration.

```json
{
  "sid": "9eeafc8ab479a386dc95f854f9d7cd8a",
  "phone_number": "+91XXXX30240",
  "friendly_name": "My Sales Line",
  "voice_url": "https://my.exotel.com/exoml/start/flow_id",
  "sms_url": "https://my.exotel.com/exoml/start/sms_flow_id",
  "capabilities": {
    "voice": true,
    "sms": true
  }
}
```
