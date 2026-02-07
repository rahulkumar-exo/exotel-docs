---
id: delete-user
title: Delete User
sidebar_label: Delete User
---

# Delete User

Remove a user from your Exotel Contact Center account.

## HTTP Request

```
DELETE /v2/accounts/<account_sid>/users/<user_id>
```

## Path Parameters

| Parameter | Description |
|-----------|-------------|
| `user_id` | The UUID of the user to delete |

## Response

```json
{
  "request_id": "string",
  "method": "DELETE",
  "http_code": 200,
  "response": {
    "code": 200,
    "status": "success",
    "data": null
  }
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `10801` | 404 | User not found |
| `1010` | 401 | Authentication failed |
| `1003` | 403 | Unauthorized credentials |

## Common Error Codes

These errors apply across all Users API endpoints:

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `1004` | 500 | Internal server error |
| `1007` | 400 | Invalid request format |
| `1010` | 401 | Authentication failure |
| `429` | 429 | Too many requests (rate limited) |
