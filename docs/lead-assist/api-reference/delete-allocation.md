---
id: delete-allocation
title: Delete Allocation
description: Delete a GreenPIN allocation to remove the PIN-mapping between users and a virtual number via the Exotel Lead Assist API.
sidebar_label: Delete Allocation
---

# Delete Pin Allocation

Delete a GreenPin allocation, removing the PIN-mapping between users and the assigned virtual number.

## HTTP Request

```
DELETE https://leadassist.exotel.in/v1/tenants/<tenant_id>/greenpin/<greenpin_id>
```

## Headers

| Header | Value |
|--------|-------|
| `Authorization` | HTTP Basic Auth — Account SID as username, ExoBridge token as password |

## Path Parameters

| Parameter | Description |
|-----------|-------------|
| `tenant_id` | Your tenant identifier |
| `greenpin_id` | The unique identifier of the GreenPin allocation to delete |

## Example Request

```bash
curl -X DELETE \
  'https://leadassist.exotel.in/v1/tenants/<tenant_id>/greenpin/gp_abc123xyz' \
  -u '<account_sid>:<exobridge_token>'
```

## Example Response

```json
{
  "response": {
    "greenpin_id": "gp_abc123xyz",
    "status": "deleted",
    "deleted_at": "2024-06-15T11:00:00+05:30"
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `greenpin_id` | String | Identifier of the allocation that was deleted. |
| `status` | String | Always `deleted` on a successful response. |
| `deleted_at` | String | ISO 8601 timestamp of when the deletion was processed. |

## HTTP Status Codes

| Status Code | Meaning |
|-------------|---------|
| `200 OK` | Allocation deleted successfully. |
| `401 Unauthorized` | Authentication failed. Verify your Account SID and ExoBridge token. |
| `403 Forbidden` | You do not have permission to delete this allocation. |
| `404 Not Found` | No allocation exists for the given `greenpin_id` under this tenant. |
| `409 Conflict` | The allocation has already been deleted. |
| `500 Internal Server Error` | Unexpected server error. Retry with exponential backoff. |

:::info Virtual Number Release
Deleting an allocation releases the virtual number back to your pool immediately. The number becomes available for a new allocation right away.
:::
