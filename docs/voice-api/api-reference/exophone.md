---
id: exophone
title: ExoPhone API
sidebar_label: ExoPhone
sidebar_position: 8
---

# ExoPhone API

Manage your ExoPhones (virtual phone numbers) — provision new numbers, assign them to call flows, list existing numbers, and release numbers you no longer need.

:::note
ExoPhone APIs use the **v2_beta** base URL, unlike other Voice APIs which use v1.
:::

## Base URL

```
https://<api_key>:<api_token><subdomain>/v2_beta/Accounts/<account_sid>/
```

---

## List Available Numbers

Get available phone numbers filtered by country and type.

### All Countries & Types

```
GET /v2_beta/Accounts/<account_sid>/AvailablePhoneNumbers
```

### By Country & Type

```
GET /v2_beta/Accounts/<account_sid>/AvailablePhoneNumbers/<ISOCountryCode>/Landline
```

#### Query Parameters

| Parameter        | Required | Description |
|------------------|----------|-------------|
| `ISOCountryCode` | Mandatory | ISO 3166-1 alpha-2 country code (e.g., `IN` for India) |
| `IncomingSMS`    | Optional  | Filter for SMS-capable numbers |
| `InRegion`       | Optional  | Filter by telecom circle (India only). Values: `AP`, `AS`, `BR`, `DL`, `GJ`, `HP`, `HR`, `JK`, `KA`, `KL`, `KO`, `MH`, `MP`, `MU`, `NE`, `OR`, `PB`, `RJ`, `TN`, `UE`, `UW`, `WB` |
| `Contains`       | Optional  | Filter by substring match |

---

## Provision a Number

Acquire a new ExoPhone and assign it to voice and SMS flows.

```
POST /v2_beta/Accounts/<account_sid>/IncomingPhoneNumbers
```

### Request Parameters

| Parameter      | Required  | Type   | Description |
|----------------|-----------|--------|-------------|
| `PhoneNumber`  | Mandatory | String | The desired phone number |
| `VoiceUrl`     | Mandatory | String | Voice flow URL. Format: `http://my.exotel.com/{sid}/exoml/start_voice/{app_id}` |
| `SMSUrl`       | Mandatory | String | SMS flow URL. Format: `http://my.exotel.com/{sid}/exoml/start_sms/{app_id}` |
| `FriendlyName` | Mandatory | String | A human-readable label for the number |

---

## Assign to a Flow

Update the voice/SMS flow and friendly name for an existing ExoPhone.

```
PUT /v2_beta/Accounts/<account_sid>/IncomingPhoneNumbers/<exophone_sid>
```

### Request Parameters

| Parameter      | Required | Type   | Description |
|----------------|----------|--------|-------------|
| `VoiceUrl`     | Optional | String | New voice flow URL |
| `SMSUrl`       | Optional | String | New SMS flow URL |
| `FriendlyName` | Optional | String | Updated label |

---

## List Your ExoPhones

Retrieve all ExoPhones on your account.

```
GET /v2_beta/Accounts/<account_sid>/IncomingPhoneNumbers
```

---

## Get ExoPhone Details

Retrieve details for a specific ExoPhone.

```
GET /v2_beta/Accounts/<account_sid>/IncomingPhoneNumbers/<exophone_sid>
```

| Parameter       | Required  | Description |
|-----------------|-----------|-------------|
| `exophone_sid`  | Mandatory | The unique ExoPhone identifier |

---

## Delete an ExoPhone

Release a number from your account.

```
DELETE /v2_beta/Accounts/<account_sid>/IncomingPhoneNumbers/<exophone_sid>
```

| Parameter       | Required  | Description |
|-----------------|-----------|-------------|
| `exophone_sid`  | Mandatory | The unique ExoPhone identifier |

---

## Response Format

All ExoPhone API endpoints return `application/json` responses.
