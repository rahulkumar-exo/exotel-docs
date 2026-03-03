---
id: purchase-number
title: Purchase ExoPhone
description: Purchase a new ExoPhone and add it to your Exotel account using the API. Configure voice and SMS flow URLs during number provisioning.
sidebar_label: Purchase Number
---

# Purchase an ExoPhone

Purchase a new ExoPhone and add it to your account.

## HTTP Request

```
POST /v2_beta/Accounts/<account_sid>/IncomingPhoneNumbers
```

## Request Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `PhoneNumber` | Yes | The phone number to purchase (from available numbers list) |
| `VoiceUrl` | No | Flow URL to handle incoming voice calls |
| `SMSUrl` | No | Flow URL to handle incoming SMS |
| `FriendlyName` | No | A friendly identifier for the number |

## Response

```json
{
  "sid": "9eeafc8ab479a386dc95f854f9d7cd8a",
  "phone_number": "+91XXXX30240",
  "friendly_name": "XXXXX30240",
  "capabilities": {
    "voice": true,
    "sms": true
  },
  "country": "IN",
  "rental_price": "499.000000",
  "currency": "INR"
}
```

### Response Fields

| Field | Description |
|-------|-------------|
| `sid` | Unique ExoPhone identifier |
| `phone_number` | Purchased phone number |
| `friendly_name` | Display name |
| `capabilities` | Voice and SMS support flags |
| `country` | Country of the number |
| `rental_price` | Monthly rental cost |
| `currency` | Price currency |
