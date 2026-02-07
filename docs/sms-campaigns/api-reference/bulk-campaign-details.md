---
id: bulk-campaign-details
title: List All Campaigns
sidebar_label: List Campaigns
---

# List All SMS Campaigns

Retrieve a paginated list of all SMS campaigns in your account.

## HTTP Request

```
GET /v2/accounts/<account_sid>/message-campaigns?channel=sms&limit=10&offset=0
```

## Query Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `channel` | Yes | Must be `"SMS"` |
| `offset` | No | Zero-based starting position (default: `0`) |
| `limit` | No | Records per page (default: `20`, max: `50`) |
| `name` | No | Search campaigns by name (min 3 characters) |
| `status` | No | Filter by status: `in-progress`, `scheduled`, `completed`, `paused`, `archived` |
| `sort_by` | No | Sort field and order, e.g., `schedule.start_time:asc`, `name:desc` |

## Response

```json
{
  "request_id": "string",
  "http_code": 200,
  "metadata": {
    "count": 20,
    "offset": 0,
    "total": 108,
    "limit": 20
  },
  "response": [
    {
      "status": "success",
      "data": {
        "sid": "campaign_sid",
        "name": "campaign_name",
        "status": "completed",
        "date_created": "2019-01-20T21:10:00+05:30"
      }
    }
  ]
}
```

### Metadata Fields

| Field | Description |
|-------|-------------|
| `count` | Number of records in current response |
| `offset` | Current offset position |
| `total` | Total number of campaigns matching the query |
| `limit` | Number of records per page |
