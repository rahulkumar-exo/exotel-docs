---
id: number-details
title: ExoPhone Details
description: Get detailed configuration and metadata for a specific ExoPhone using the Exotel API. Retrieve capabilities, flow URLs, and number properties.
sidebar_label: Number Details
---

# Get ExoPhone Details

Retrieve details for a specific ExoPhone.

## HTTP Request

```
GET /v2_beta/Accounts/<account_sid>/IncomingPhoneNumbers/<exophone_sid>
```

## Path Parameters

| Parameter | Description |
|-----------|-------------|
| `exophone_sid` | The unique SID of the ExoPhone |

## Response

Returns a single ExoPhone object with all configuration details.

```json
{
  "sid": "011XXXXXXX1",
  "phone_number": "+9111XXXXXXX6",
  "friendly_name": "011XXXXXXX6",
  "capabilities": {
    "voice": true,
    "sms": true
  },
  "country": "IN",
  "region": "DL",
  "voice_url": "https://my.exotel.com/exoml/start/flow_id",
  "sms_url": null
}
```
