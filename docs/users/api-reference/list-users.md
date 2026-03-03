---
id: list-users
title: List Users
description: Retrieve a paginated list of users in your Exotel account with optional filtering by email, phone number, and device details.
sidebar_label: List Users
---

# List Users

Retrieve a paginated list of users in your account with optional filtering.

## HTTP Request

```
GET /v2/accounts/<account_sid>/users
```

## Query Parameters

| Parameter | Description |
|-----------|-------------|
| `fields` | Comma-separated additional fields: `devices`, `active_call`, `last_login` |
| `devices.contact_uri` | Filter by phone number (E.164 format, URL encoded) |
| `email` | Filter by email address |
| `offset` | Pagination start position (default: `0`) |
| `limit` | Records per page (default: `20`, max: `50`) |

## Response

```json
{
  "request_id": "string",
  "method": "GET",
  "http_code": 200,
  "metadata": {
    "total": 45,
    "count": 20,
    "offset": 0,
    "limit": 20
  },
  "response": [
    {
      "code": 200,
      "status": "success",
      "data": {
        "id": "user_uuid",
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "email_verified": true,
        "role": "user",
        "active_call": null,
        "last_login": "2024-01-15T10:30:00Z",
        "date_created": "2024-01-01T00:00:00Z",
        "date_updated": "2024-01-15T10:30:00Z",
        "devices": [
          {
            "id": 1,
            "name": "Agent Phone",
            "contact_uri": "+919999999999",
            "type": "tel",
            "available": true,
            "verified": true,
            "status": "free"
          }
        ]
      }
    }
  ]
}
```

---

## Get Single User

```
GET /v2/accounts/<account_sid>/users/<user_id>
```

Returns the same structure as the list response, but for a single user object.
