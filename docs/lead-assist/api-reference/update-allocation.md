---
id: update-allocation
title: Update Allocation
description: Update parameters of an active GreenPIN allocation using the Exotel Lead Assist API. Currently in beta.
sidebar_label: Update Allocation
---

# Update GreenPin Allocation

Update parameters of an active GreenPin allocation.

:::note Beta
This endpoint is currently in **Beta**.
:::

## HTTP Request

```
PUT https://leadassist.exotel.in/v1/tenants/<tenant_id>/greenpin/<greenpin_id>
```

## Headers

| Header | Value |
|--------|-------|
| `Content-Type` | `application/json` |
| `Authorization` | HTTP Basic Auth — Account SID as username, ExoBridge token as password |

## Path Parameters

| Parameter | Description |
|-----------|-------------|
| `tenant_id` | Your tenant identifier |
| `greenpin_id` | The unique identifier of the GreenPin allocation to update |

## Request Body Parameters

All parameters are optional. Include only the fields you want to update — omitted fields remain unchanged.

| Parameter | Type | Description |
|-----------|------|-------------|
| `from` | Array of Strings | Replace the A-party number(s). E.164 format. Replaces the entire existing list. |
| `to` | Array of Strings | Replace the B-party number(s). E.164 format. Replaces the entire existing list. Useful for adding a B-party to an allocation created without one. |
| `duration` | Integer | New validity period in seconds, counted from the time of this update request. Min: `300`. Max: `14688000`. |
| `max_pin_attempts` | Integer | Update the maximum number of incorrect PIN attempts allowed before lockout. |
| `record` | Boolean | Enable (`true`) or disable (`false`) call recording for this allocation. |
| `custom_field` | String | Replace the custom metadata string (max 256 characters). |

## Example Request

```bash
curl -X PUT \
  'https://leadassist.exotel.in/v1/tenants/<tenant_id>/greenpin/gp_abc123xyz' \
  -u '<account_sid>:<exobridge_token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "to": ["+917700XXXXXX"],
    "duration": 7200,
    "record": true,
    "custom_field": "order_id=12345&updated=true"
  }'
```

## Example Response

```json
{
  "response": {
    "greenpin_id": "gp_abc123xyz",
    "virtual_number": "+914000XXXXXX",
    "pin": "4821",
    "from": ["+919900XXXXXX"],
    "to": ["+917700XXXXXX"],
    "status": "active",
    "created_at": "2024-06-15T10:30:00+05:30",
    "expires_at": "2024-06-15T13:00:00+05:30",
    "record": true,
    "custom_field": "order_id=12345&updated=true"
  }
}
```

## Bulk Update

To update multiple allocations in a single request:

```
PUT https://leadassist.exotel.in/v1/tenants/<tenant_id>/greenpin
```

The request body must be an array of objects. Each object must include the `greenpin_id` of the allocation to update, plus any fields to change.

**Bulk Update Request Body Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `greenpin_id` | String | Yes | Identifier of the allocation to update |
| `from` | Array of Strings | No | Replace A-party number(s) |
| `to` | Array of Strings | No | Replace B-party number(s) |
| `duration` | Integer | No | New validity in seconds from now |
| `max_pin_attempts` | Integer | No | Update max PIN attempts |
| `record` | Boolean | No | Enable/disable recording |
| `custom_field` | String | No | Replace custom metadata |

**Example Bulk Update Request:**

```bash
curl -X PUT \
  'https://leadassist.exotel.in/v1/tenants/<tenant_id>/greenpin' \
  -u '<account_sid>:<exobridge_token>' \
  -H 'Content-Type: application/json' \
  -d '[
    {
      "greenpin_id": "gp_abc123xyz",
      "to": ["+917700XXXXXX"],
      "duration": 7200
    },
    {
      "greenpin_id": "gp_def456uvw",
      "record": true,
      "custom_field": "campaign=summer_sale"
    }
  ]'
```

**Example Bulk Update Response:**

```json
{
  "response": [
    {
      "greenpin_id": "gp_abc123xyz",
      "status": "updated"
    },
    {
      "greenpin_id": "gp_def456uvw",
      "status": "updated"
    }
  ]
}
```

## HTTP Status Codes

| Status Code | Meaning |
|-------------|---------|
| `200 OK` | Update applied successfully. Response body contains the updated allocation object (or array for bulk). |
| `400 Bad Request` | Missing or invalid parameters. Check field formats and value ranges. |
| `401 Unauthorized` | Authentication failed. Verify your Account SID and ExoBridge token. |
| `403 Forbidden` | You do not have permission to update this allocation. |
| `404 Not Found` | No allocation exists for the given `greenpin_id` under this tenant. |
| `409 Conflict` | The update conflicts with the current state (e.g., attempting to update an expired or deleted allocation). |
| `422 Unprocessable Entity` | Parameters are structurally valid but fail business rules (e.g., `duration` out of range). |
| `500 Internal Server Error` | Unexpected server error. Retry with exponential backoff. |
