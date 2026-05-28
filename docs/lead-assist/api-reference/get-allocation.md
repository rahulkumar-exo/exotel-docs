---
id: get-allocation
title: Get Allocation Details
description: Retrieve details of a specific GreenPIN allocation including virtual number, PIN, and party info via the Exotel Lead Assist API.
sidebar_label: Get Allocation
---

# Get Pin Allocation Details

Retrieve the current details of a specific GreenPin allocation, including its virtual number, PIN, associated parties, status, and call count.

## HTTP Request

```
GET https://leadassist.exotel.in/v1/tenants/<tenant_id>/greenpin/<greenpin_id>
```

## Headers

| Header | Value |
|--------|-------|
| `Authorization` | HTTP Basic Auth — Account SID as username, ExoBridge token as password |

## Path Parameters

| Parameter | Description |
|-----------|-------------|
| `tenant_id` | Your tenant identifier |
| `greenpin_id` | The unique identifier of the GreenPin allocation to retrieve |

## Example Request

```bash
curl -X GET \
  'https://leadassist.exotel.in/v1/tenants/<tenant_id>/greenpin/gp_abc123xyz' \
  -u '<account_sid>:<exobridge_token>'
```

## Example Response

```json
{
  "response": {
    "greenpin_id": "gp_abc123xyz",
    "virtual_number": "+914000XXXXXX",
    "pin": "4821",
    "from": ["+919900XXXXXX"],
    "to": ["+918800XXXXXX"],
    "status": "active",
    "created_at": "2024-06-15T10:30:00+05:30",
    "expires_at": "2024-06-15T11:30:00+05:30",
    "call_count": 2,
    "custom_field": "order_id=12345"
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `greenpin_id` | String | Unique identifier for this allocation. |
| `virtual_number` | String | The virtual number assigned to this allocation. |
| `pin` | String | The PIN the B-party enters after calling the virtual number. |
| `from` | Array of Strings | A-party phone number(s). |
| `to` | Array of Strings | B-party phone number(s). Empty array if not yet assigned. |
| `status` | String | Current state: `active`, `expired`, or `deleted`. |
| `created_at` | String | ISO 8601 timestamp of allocation creation. |
| `expires_at` | String | ISO 8601 timestamp when the allocation expires. |
| `call_count` | Integer | Total number of calls connected through this allocation since creation. |
| `custom_field` | String | Custom metadata string set at creation or last update, if any. |

## HTTP Status Codes

| Status Code | Meaning |
|-------------|---------|
| `200 OK` | Request successful. Response body contains the allocation object. |
| `401 Unauthorized` | Authentication failed. Verify your Account SID and ExoBridge token. |
| `403 Forbidden` | You do not have permission to access this allocation. |
| `404 Not Found` | No allocation exists for the given `greenpin_id` under this tenant. |
| `500 Internal Server Error` | Unexpected server error. Retry with exponential backoff. |

## Getting Call Metadata

You can retrieve metadata for calls that were connected through an allocation using two methods:

### 1. Events Callbacks (Push)

Configure a webhook URL on your account to receive real-time call data as events are triggered. Events are sent as HTTP POST requests to your endpoint for call states such as `initiated`, `ringing`, `answered`, and `completed`.

### 2. GET Call API (Pull)

Query individual call details using the CallSID returned in an event callback or an allocation's call log.

```bash
curl -X GET \
  'https://api.exotel.com/v1/Accounts/<account_sid>/Calls/<call_sid>.json' \
  -u '<account_sid>:<auth_token>'
```

**Example response for a CallSID lookup:**

```json
{
  "Call": {
    "Sid": "b8f3c1d2e4a5",
    "From": "+918800XXXXXX",
    "To": "+914000XXXXXX",
    "Status": "completed",
    "StartTime": "2024-06-15T10:45:00+05:30",
    "EndTime": "2024-06-15T10:48:32+05:30",
    "Duration": "212",
    "RecordingUrl": "https://s3.ap-south-1.amazonaws.com/exorecordings/...",
    "CustomField": "order_id=12345"
  }
}
```

The `CustomField` in the call record reflects the `custom_field` value from the GreenPin allocation that was active at the time of the call.
