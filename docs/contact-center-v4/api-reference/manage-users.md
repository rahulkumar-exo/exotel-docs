---
id: manage-users
title: Manage Users
sidebar_label: Manage Users
---

# Manage Contact Center Users

Create, update, retrieve, and delete users (agents) in the Contact Center v4 system.

## Create User

```
POST /v4/accounts/<account_sid>/users
```

### Request Body

```json
{
  "name": "John Agent",
  "email": "john@company.com",
  "phone_number": "+919876543210",
  "role": "agent",
  "team_id": "sales_team",
  "device_type": "softphone",
  "skills": ["english", "sales"]
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String | Yes | Full name of the user |
| `email` | String | Yes | Email address (must be unique) |
| `phone_number` | String | Yes | Phone number in E.164 format |
| `role` | String | Yes | `agent`, `supervisor`, or `admin` |
| `team_id` | String | No | Team assignment |
| `device_type` | String | No | `softphone`, `phone`, or `sip` |
| `skills` | Array | No | Skill tags for routing |

### Example Request

```bash
curl -X POST \
  'https://ccm-api.exotel.com/v4/accounts/<account_sid>/users' \
  -H 'Authorization: Bearer <session_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "John Agent",
    "email": "john@company.com",
    "phone_number": "+919876543210",
    "role": "agent",
    "device_type": "softphone"
  }'
```

### Response

```json
{
  "response": {
    "code": 201,
    "status": "success",
    "data": {
      "user_id": "user_abc123",
      "name": "John Agent",
      "email": "john@company.com",
      "phone_number": "+919876543210",
      "role": "agent",
      "status": "offline",
      "created_at": "2024-06-15T10:00:00.000Z"
    }
  }
}
```

---

## Update User

```
PUT /v4/accounts/<account_sid>/users/<user_id>
```

### Request Body

```json
{
  "name": "John Senior Agent",
  "role": "supervisor",
  "team_id": "sales_leads",
  "skills": ["english", "sales", "escalation"]
}
```

All fields are optional — only include fields you want to update.

### Response

```json
{
  "response": {
    "code": 200,
    "status": "success",
    "data": {
      "user_id": "user_abc123",
      "name": "John Senior Agent",
      "role": "supervisor",
      "updated_at": "2024-06-15T14:00:00.000Z"
    }
  }
}
```

---

## Get User

```
GET /v4/accounts/<account_sid>/users/<user_id>
```

### Response

```json
{
  "response": {
    "code": 200,
    "status": "success",
    "data": {
      "user_id": "user_abc123",
      "name": "John Senior Agent",
      "email": "john@company.com",
      "phone_number": "+919876543210",
      "role": "supervisor",
      "status": "available",
      "team": {
        "team_id": "sales_leads",
        "name": "Sales Leads"
      },
      "skills": ["english", "sales", "escalation"],
      "device": {
        "type": "softphone",
        "contact_uri": "sip:john@company.exotel.com"
      },
      "stats": {
        "calls_today": 15,
        "avg_handle_time": 180,
        "availability_percentage": 85
      },
      "created_at": "2024-06-15T10:00:00.000Z",
      "updated_at": "2024-06-15T14:00:00.000Z"
    }
  }
}
```

---

## List Users

```
GET /v4/accounts/<account_sid>/users
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `role` | String | Filter by role |
| `team_id` | String | Filter by team |
| `status` | String | Filter by status |
| `limit` | Integer | Results per page (default: 20) |
| `offset` | Integer | Pagination offset |

---

## Delete User

```
DELETE /v4/accounts/<account_sid>/users/<user_id>
```

### Response

```json
{
  "response": {
    "code": 200,
    "status": "success",
    "data": {
      "user_id": "user_abc123",
      "deleted": true
    }
  }
}
```

:::warning
Deleting a user is permanent. The user will be immediately logged out of any active sessions and removed from all teams.
:::

## HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request — Invalid parameters |
| `401` | Unauthorized |
| `404` | Not Found — User doesn't exist |
| `409` | Conflict — Email already exists |
| `429` | Rate Limited |
