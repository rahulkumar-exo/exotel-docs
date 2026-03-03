---
id: manage-campaign
title: Manage Campaign
description: Get details, pause, resume, complete, archive, and delete campaigns using the Exotel Campaign API. Includes endpoints and request examples.
sidebar_label: Manage Campaign
sidebar_position: 2
---

# Manage Campaign

Get details, update, pause/resume, and delete campaigns.

## Get Campaign Details

```
GET https://<api_key>:<api_token><subdomain>/v2/accounts/<account_sid>/campaigns/<campaign_id>
```

Returns the full campaign object including current stats.

## Update Campaign Action

Pause, resume, complete, or archive a campaign.

```
PUT https://<api_key>:<api_token><subdomain>/v2/accounts/<account_sid>/campaigns/<campaign_id>
```

### Request Body

```json
{ "action": "pause" }
```

### Allowed Actions

| Action     | From Status       | Description |
|------------|-------------------|-------------|
| `pause`    | Created, InProgress | Temporarily stop the campaign |
| `resume`   | Paused            | Resume a paused campaign |
| `complete` | Paused            | Force complete — marks remaining calls as failed |
| `archive`  | Completed         | Archive a completed campaign |

### cURL Example

```bash
curl -X PUT "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<sid>/campaigns/<campaign_id>" \
  -H "Content-Type: application/json" \
  -d '{ "action": "pause" }'
```

## Update Campaign Details

Update campaign parameters before the `send_at` time. After `send_at`, only callbacks and `action` can be updated.

```
PUT https://<api_key>:<api_token><subdomain>/v2/accounts/<account_sid>/campaigns/<campaign_id>
```

Accepts the same parameters as [Create Campaign](/docs/campaigns/api-reference/create-campaign).

**Editable after `send_at`:**
- `action`
- `status_callback`
- `call_status_callback`
- `call_schedule_callback`

## Delete Campaign

```
DELETE https://<api_key>:<api_token><subdomain>/v2/accounts/<account_sid>/campaigns/<campaign_id>
```

Returns HTTP 200 on success.

---

## List All Campaigns

```
GET https://<api_key>:<api_token><subdomain>/v2/accounts/<account_sid>/campaigns
```

### Query Parameters

| Parameter | Type    | Default | Description |
|-----------|---------|---------|-------------|
| `offset`  | Integer | 0       | Zero-based record position |
| `limit`   | Integer | 20      | Records per page (max 500) |
| `name`    | String  | —       | Search by campaign name |
| `status`  | String  | —       | Filter by comma-separated statuses |
| `sort_by` | String  | —       | `date_created:asc`, `date_created:desc`, `name:asc`, `name:desc` |
| `type`    | String  | `trans` | Campaign type |

### cURL Example

```bash
curl "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<sid>/campaigns?limit=10&status=InProgress,Paused&sort_by=date_created:desc"
```

### Response

```json
{
  "request_id": "req_abc123",
  "http_code": 200,
  "metadata": {
    "count": 3,
    "offset": 0,
    "total": 138,
    "limit": 10
  },
  "response": [
    { "...campaign objects..." }
  ]
}
```
