---
id: update-user
title: Update User
description: Update user details such as name and email for an existing user in your Exotel Contact Center account using the Users API.
sidebar_label: Update User
---

# Update User

Update details for an existing user.

## HTTP Request

```
PUT /v2/accounts/<account_sid>/users/<user_id>
```

## Path Parameters

| Parameter | Description |
|-----------|-------------|
| `user_id` | The UUID of the user to update |

## Request Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `first_name` | No | Updated first name (3–20 chars) |
| `last_name` | No | Updated last name (3–20 chars) |
| `email` | No | Can only be set if not provided during creation |

## Response

Returns the updated user object with the same structure as the Create User response.

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `1002` | 400 | Cannot update email (already set) |
| `10814` | 403 | KYC incomplete |
| `10815` | 403 | Trial account limitation |
