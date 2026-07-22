---
id: create-allocation
title: Create Pin Allocation
description: Generate a GreenPIN and map users to a virtual number for secure communication using the Exotel Lead Assist API.
sidebar_label: Create Allocation
---

# Create a Pin Allocation

Generate a PIN and map it to users via a virtual number for secure communication.

When you create an allocation, the system assigns a PIN to a virtual number from your pool and associates it with one or more A-party (agent/seller) numbers. The B-party (customer) can then call the virtual number, enter the PIN, and get connected to the A-party — without either side seeing the other's real number.

## HTTP Request

```
POST https://leadassist.exotel.in/v1/tenants/<tenant_id>/greenpin
```

## Headers

| Header | Value |
|--------|-------|
| `Content-Type` | `application/json` |
| `Authorization` | HTTP Basic Auth — Account SID as username, ExoBridge token as password |

## Authentication

Pass credentials using HTTP Basic Auth. Your Account SID is the username and your ExoBridge token is the password. In cURL, use the `user:password@host` format or the `-u` flag.

## Request Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `caller_id_number` | String | Yes | Virtual number for the allocation, in E.164 format. Must be from your provisioned VN pool. |
| `from` | Number | Yes | A-party phone number — the agent or seller side. E.164 format. |
| `to` | Number | No | B-party phone number — the customer side. E.164 format. Can be left empty and set later via the Update endpoint. |
| `duration` | Integer | No | Allocation validity in seconds. Default: `86400` (24 hours). Min: `300` (5 minutes). Max: `14688000` (170 days). |
| `max_pin_attempts` | Integer | No | Maximum number of incorrect PIN attempts before the allocation is locked out. Default: `3`. |
| `record` | Boolean | No | Set to `true` to record all calls on this allocation. Default: `false`. |

## Example Request

```bash
curl -X POST \
  'https://leadassist.exotel.in/v1/tenants/<tenant_id>/greenpin' \
  -u '<account_sid>:<exobridge_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "caller_id_number": "+914000XXXXXX",
    "from": "+919900XXXXXX",
    "to": "+918800XXXXXX",
    "duration": 3600,
    "max_pin_attempts": 3,
    "record": false
  }'
```

## Example Response

```json
{
  "response": {
    "greenpin_id": "gp_abc123xyz",
    "virtual_number": "+914000XXXXXX",
    "pin": "4821",
    "from": "+919900XXXXXX",
    "to": "+918800XXXXXX",
    "status": "active",
    "created_at": "2024-06-15T10:30:00+05:30",
    "expires_at": "2024-06-15T11:30:00+05:30"
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `greenpin_id` | String | Unique identifier for this allocation. Use this ID in subsequent Get, Update, and Delete requests. |
| `virtual_number` | String | The virtual number assigned to this allocation. B-party dials this number to reach A-party. |
| `pin` | String | System-generated PIN. B-party enters this after calling the virtual number. |
| `from` | Number | A-party number associated with this allocation. |
| `to` | Number | B-party number associated with this allocation. Empty if not set at creation. |
| `status` | String | Current state of the allocation. See Status Values below. |
| `created_at` | String | ISO 8601 timestamp when the allocation was created. |
| `expires_at` | String | ISO 8601 timestamp when the allocation will expire, based on the `duration` set. |

## Status Values

| Status | Description |
|--------|-------------|
| `active` | Allocation is live. Calls can be connected. |
| `expired` | Allocation has passed its `expires_at` time. No new calls can be connected. |
| `deleted` | Allocation was explicitly deleted via the Delete endpoint. |

## HTTP Status Codes

| Status Code | Meaning |
|-------------|---------|
| `201 Created` | Allocation created successfully. Response body contains the full allocation object. |
| `400 Bad Request` | Missing or invalid parameters. Check that `caller_id_number` and `from` are present and in E.164 format. |
| `401 Unauthorized` | Authentication failed. Verify your Account SID and ExoBridge token. |
| `403 Forbidden` | The tenant does not have access to the GreenPin feature, or the virtual number is not in your pool. |
| `409 Conflict` | The virtual number is already allocated to another active allocation. |
| `422 Unprocessable Entity` | Parameters are structurally valid but fail business rules (e.g., `duration` out of range). |
| `500 Internal Server Error` | Unexpected server error. Retry with exponential backoff. |

## Notes

- The default maximum allocation duration is **170 days** at the service level
- Account-level configurations allow customization from as low as **5 minutes** up to 170 days
- If `to` is not provided at creation, the allocation is still valid — the B-party number can be added later using the Update endpoint
- PINs are 4-digit numeric codes generated by the system; you cannot specify a custom PIN
