---
id: create-user
title: Create User
sidebar_label: Create User
---

# Create User

Add a new user to your Exotel Contact Center account.

## HTTP Request

```
POST /v2/accounts/<account_sid>/users
```

## Request Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `first_name` | Yes | 3–20 characters, alphanumeric and special chars (. ' -) |
| `last_name` | Yes | 3–20 characters, alphanumeric and special chars (. ' -) |
| `email` | No | Unique valid email address |
| `device_contact_uri` | Conditional | Phone number in E.164 format |
| `role` | No | `admin`, `supervisor`, or `user` (default: `user`) |
| `device_name` | No | Friendly device identifier |

## Response

```json
{
  "request_id": "string",
  "method": "POST",
  "http_code": 200,
  "response": {
    "code": 200,
    "status": "success",
    "data": {
      "id": "user_uuid",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "email_verified": false,
      "role": "user",
      "devices": [
        {
          "id": 1,
          "name": "John's Phone",
          "contact_uri": "+919999999999",
          "type": "tel",
          "available": false,
          "verified": false,
          "status": null
        }
      ]
    }
  }
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `1001` | 400 | `first_name` is mandatory |
| `1402` | 400 | `device_contact_uri` is mandatory |
| `1401` | 400 | Invalid phone number format |
| `10812` | 409 | Device already exists |
| `10813` | 409 | Email conflicts with another account |
| `10814` | 403 | Incomplete KYC |
| `10815` | 403 | Trial account limitation |
