---
id: campaign-call-details
title: Campaign Call Details
description: Retrieve individual call records for a specific Exotel campaign. Filter by status, paginate results, and sort call details using the Campaign API.
sidebar_label: Call Details
sidebar_position: 3
---

# Campaign Call Details

Retrieve individual call records for a specific campaign.

## Endpoint

```
GET https://<api_key>:<api_token><subdomain>/v2/accounts/<account_sid>/campaigns/<campaign_id>/call-details
```

## Query Parameters

| Parameter | Type    | Default | Description |
|-----------|---------|---------|-------------|
| `offset`  | Integer | 0       | Zero-based record position |
| `limit`   | Integer | 20      | Records per page |
| `status`  | String  | —       | Filter: `completed`, `failed`, `busy`, `no-answer` |
| `sort_by` | String  | —       | `date_created:asc` or `date_created:desc` |

## cURL Example

```bash
curl "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<sid>/campaigns/<campaign_id>/call-details?limit=50&status=completed"
```

## Response

```json
{
  "request_id": "req_abc123",
  "http_code": 200,
  "metadata": {
    "count": 3,
    "offset": 0,
    "total": 150,
    "limit": 50
  },
  "response": [
    {
      "number": "+919876543210",
      "name": "Rahul Kumar",
      "duration": 45,
      "date_created": "2024-01-15T09:05:00+05:30",
      "status": "completed",
      "digit": "1",
      "recording_url": "https://s3.amazonaws.com/...",
      "start_time": "2024-01-15T09:05:02+05:30",
      "end_time": "2024-01-15T09:05:47+05:30",
      "caller_id": "0XXXXXX4890",
      "direction": "Outgoing",
      "call_sid": "call_abc123"
    }
  ]
}
```

## Response Fields

| Field          | Type    | Description |
|----------------|---------|-------------|
| `number`       | String  | Recipient phone number |
| `name`         | String  | Contact name (if available from list) |
| `duration`     | Integer | Call duration in seconds |
| `date_created` | String  | When the call was initiated |
| `status`       | String  | `completed`, `failed`, `busy`, `no-answer` |
| `digit`        | String  | DTMF digit pressed during IVR (if applicable) |
| `recording_url`| String  | Call recording URL |
| `start_time`   | String  | When the call started ringing |
| `end_time`     | String  | When the call ended |
| `caller_id`    | String  | ExoPhone used |
| `direction`    | String  | `Outgoing` |
| `call_sid`     | String  | Unique call identifier |
