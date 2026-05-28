---
id: manage-allocations
title: Manage VN Allocations
description: Create, retrieve, update, and delete GreenVN virtual number allocations using the Exotel Lead Assist API.
sidebar_label: Manage Allocations
---

# Manage GreenVN Allocations

GreenVN maps an A-party and a B-party to a shared virtual number without requiring a PIN. Either party can call the virtual number and be connected directly to the other. This page covers all five allocation management operations.

## Authentication

All requests use HTTP Basic Auth. Use your **Account SID** as the username and your **ExoBridge token** as the password.

**Base URL:** `https://leadassist.exotel.in/v1/tenants/<tenant_id>/greenvn`

---

## 1. Create VN Allocation

Maps a set of A-party numbers to a set of B-party numbers using a virtual number from your pool.

```
POST https://leadassist.exotel.in/v1/tenants/<tenant_id>/greenvn
```

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `caller_id_number` | String | Yes | Virtual number from your VN pool (E.164 format) |
| `from` | Array | Yes | A-party number(s) in E.164 format |
| `to` | Array | Yes | B-party number(s) in E.164 format |
| `duration` | Integer | No | Validity in seconds (default: `86400`, max: `14688000`) |
| `record` | Boolean | No | Enable call recording for calls on this allocation |
| `custom_field` | String | No | Custom metadata string (max 256 characters) |

### Example Request

```bash
curl -X POST \
  'https://<account_sid>:<exobridge_token>@leadassist.exotel.in/v1/tenants/<tenant_id>/greenvn' \
  -H 'Content-Type: application/json' \
  -d '{
    "caller_id_number": "+914000XXXXXX",
    "from": ["+919900XXXXXX"],
    "to": ["+918800XXXXXX"],
    "duration": 86400,
    "record": true,
    "custom_field": "order_id=ORD-20240615"
  }'
```

### Example Response

```json
{
  "response": {
    "greenvn_id": "gvn_abc123",
    "virtual_number": "+914000XXXXXX",
    "from": ["+919900XXXXXX"],
    "to": ["+918800XXXXXX"],
    "status": "active",
    "record": true,
    "custom_field": "order_id=ORD-20240615",
    "created_at": "2024-06-15T10:30:00+05:30",
    "expires_at": "2024-06-16T10:30:00+05:30"
  }
}
```

---

## 2. Get VN Allocation Details

Retrieve the current state of an existing GreenVN allocation.

```
GET https://leadassist.exotel.in/v1/tenants/<tenant_id>/greenvn/<greenvn_id>
```

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `greenvn_id` | String | Unique identifier of the allocation returned at creation |

### Example Request

```bash
curl -X GET \
  'https://<account_sid>:<exobridge_token>@leadassist.exotel.in/v1/tenants/<tenant_id>/greenvn/gvn_abc123' \
  -H 'Content-Type: application/json'
```

### Example Response

```json
{
  "response": {
    "greenvn_id": "gvn_abc123",
    "virtual_number": "+914000XXXXXX",
    "from": ["+919900XXXXXX"],
    "to": ["+918800XXXXXX"],
    "status": "active",
    "record": true,
    "custom_field": "order_id=ORD-20240615",
    "call_count": 3,
    "created_at": "2024-06-15T10:30:00+05:30",
    "expires_at": "2024-06-16T10:30:00+05:30"
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `greenvn_id` | String | Unique allocation identifier |
| `virtual_number` | String | The virtual number assigned to this allocation |
| `from` | Array | A-party number(s) associated with this allocation |
| `to` | Array | B-party number(s) associated with this allocation |
| `status` | String | Current status: `active` or `deleted` |
| `record` | Boolean | Whether call recording is enabled |
| `custom_field` | String | Custom metadata attached at creation |
| `call_count` | Integer | Total number of calls made through this allocation |
| `created_at` | DateTime | ISO 8601 timestamp when the allocation was created |
| `expires_at` | DateTime | ISO 8601 timestamp when the allocation expires |

---

## 3. Delete VN Allocation

Immediately removes the virtual number mapping. Any subsequent calls to the virtual number will not be routed.

```
DELETE https://leadassist.exotel.in/v1/tenants/<tenant_id>/greenvn/<greenvn_id>
```

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `greenvn_id` | String | Unique identifier of the allocation to delete |

### Example Request

```bash
curl -X DELETE \
  'https://<account_sid>:<exobridge_token>@leadassist.exotel.in/v1/tenants/<tenant_id>/greenvn/gvn_abc123' \
  -H 'Content-Type: application/json'
```

### Example Response

```json
{
  "response": {
    "greenvn_id": "gvn_abc123",
    "status": "deleted",
    "deleted_at": "2024-06-15T14:00:00+05:30"
  }
}
```

---

## 4. Update Party Numbers

Update the A-party and/or B-party numbers on an existing active allocation.

```
PUT https://leadassist.exotel.in/v1/tenants/<tenant_id>/greenvn/<greenvn_id>/call-party
```

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `greenvn_id` | String | Unique identifier of the allocation to update |

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `from` | Array | No | Replacement A-party number(s) in E.164 format |
| `to` | Array | No | Replacement B-party number(s) in E.164 format |

At least one of `from` or `to` must be provided.

### Example Request

```bash
curl -X PUT \
  'https://<account_sid>:<exobridge_token>@leadassist.exotel.in/v1/tenants/<tenant_id>/greenvn/gvn_abc123/call-party' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": ["+919911XXXXXX"],
    "to": ["+918822XXXXXX"]
  }'
```

### Example Response

```json
{
  "response": {
    "greenvn_id": "gvn_abc123",
    "virtual_number": "+914000XXXXXX",
    "from": ["+919911XXXXXX"],
    "to": ["+918822XXXXXX"],
    "status": "active",
    "updated_at": "2024-06-15T12:00:00+05:30",
    "expires_at": "2024-06-16T10:30:00+05:30"
  }
}
```

---

## 5. Update Virtual Number

Replace the virtual number in an existing active allocation with another number from your VN pool.

```
PUT https://leadassist.exotel.in/v1/tenants/<tenant_id>/greenvn/<greenvn_id>/vn
```

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `greenvn_id` | String | Unique identifier of the allocation to update |

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `caller_id_number` | String | Yes | New virtual number to assign (must be from your VN pool, E.164 format) |

### Example Request

```bash
curl -X PUT \
  'https://<account_sid>:<exobridge_token>@leadassist.exotel.in/v1/tenants/<tenant_id>/greenvn/gvn_abc123/vn' \
  -H 'Content-Type: application/json' \
  -d '{
    "caller_id_number": "+914001XXXXXX"
  }'
```

### Example Response

```json
{
  "response": {
    "greenvn_id": "gvn_abc123",
    "virtual_number": "+914001XXXXXX",
    "from": ["+919911XXXXXX"],
    "to": ["+918822XXXXXX"],
    "status": "active",
    "updated_at": "2024-06-15T13:00:00+05:30",
    "expires_at": "2024-06-16T10:30:00+05:30"
  }
}
```

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created — Allocation created successfully |
| `400` | Bad Request — Missing or invalid parameters |
| `401` | Unauthorized — Invalid Account SID or ExoBridge token |
| `404` | Not Found — `greenvn_id` or `tenant_id` does not exist |
| `409` | Conflict — Virtual number already in use by another active allocation |
| `429` | Too Many Requests — Rate limit exceeded |
| `500` | Internal Server Error |

---

:::note GreenVN vs GreenPin
**GreenVN** allocations do not use a PIN. Both the A-party and the B-party can initiate a call to the virtual number and be connected directly to each other — no extra digit input is required.

**GreenPin** allocations require the caller to enter a PIN after dialing the virtual number, which allows a single virtual number to serve multiple isolated party pairs simultaneously.
:::
