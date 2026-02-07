---
id: manage-devices
title: Manage Devices
sidebar_label: Manage Devices
---

# Manage User Devices

Update user device settings including availability and SIP passwords.

## Update User Device

### HTTP Request

```
PUT /v2/accounts/<account_sid>/users/<user_id>/devices/<device_id>
```

### Request Parameters

| Parameter | Description |
|-----------|-------------|
| `available` | Boolean — `true` (ON) or `false` (OFF). Only 1 device can be ON at a time |
| `contact_uri` | Phone number in E.164 format. Changing requires re-verification |

### Response

```json
{
  "request_id": "string",
  "method": "PUT",
  "http_code": 200,
  "response": {
    "code": 200,
    "status": "success",
    "data": {
      "id": 1,
      "name": "Agent Phone",
      "contact_uri": "+919999999999",
      "type": "tel",
      "available": true,
      "verified": true,
      "status": "free"
    }
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `10809` | 409 | Device is unverified |
| `10810` | 403 | Another device is already ON |
| `10811` | 409 | Device already exists |
| `10817` | 403 | Non-PSTN device cannot be updated |

---

## Create/Update SIP Password

### HTTP Request

```
PUT /v2/accounts/<account_sid>/users/<user_id>/devices/<device_id>/password
```

### Request Body

```json
{
  "password": "SecureP@ss1"
}
```

### Password Requirements

- Minimum **8 characters**
- At least **3 of the following 4 categories:**
  - Lowercase letters
  - Uppercase letters
  - Numbers
  - Special characters (`!@#$%^&*`)

### Response

```json
{
  "request_id": "string",
  "method": "PUT",
  "http_code": 200,
  "response": {
    "code": 200,
    "status": "success",
    "data": null
  }
}
```
