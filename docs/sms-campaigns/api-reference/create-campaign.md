---
id: create-campaign
title: Create SMS Campaign
description: Create a new SMS campaign with the Exotel API to send bulk static or dynamic messages to contact lists with DLT compliance.
sidebar_label: Create Campaign
---

# Create SMS Campaign

Create a new SMS campaign to send bulk messages to your contact lists.

## HTTP Request

```
POST /v2/accounts/<account_sid>/message-campaigns
```

## Request Parameters

### Required Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `content_type` | String | `"static"` or `"dynamic"` |
| `lists` | Array | List SIDs — up to 5 for static, single for dynamic |
| `channel` | String | `"SMS"` |
| `dlt_entity_id` | Numeric | DLT-approved entity ID |
| `dlt_template_id` | Numeric | DLT-approved template ID |
| `sender_id` | String | Alphabetical (transactional) or numeric (promotional) |
| `sms_type` | String | `"Transactional"` or `"Promotional"` |
| `template` | String | SMS body (max 2000 characters) |

### Optional Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | String | Campaign name (min 3 characters) |
| `schedule` | Object | Contains `start_time` and `end_time` in RFC 3339 format |
| `status_callback` | URL | Webhook for campaign-level status updates |
| `sms_status_callback` | URL | Webhook for individual SMS delivery updates |

:::info Dynamic Templates
For dynamic campaigns, use `@@column_header` syntax to insert personalized values from your contact list columns.
:::

### Schedule Object

| Field | Description |
|-------|-------------|
| `start_time` | RFC 3339 format — must be at least 10 minutes in the future |
| `end_time` | RFC 3339 format — must be at least 2 hours after `start_time` |

## Response

```json
{
  "request_id": "745d624f47004b71bf72e6cb7d58a25b",
  "http_code": 200,
  "response": [
    {
      "status": "success",
      "data": {
        "sid": "909d2a2ba53ce07f3784668b938eb44914bo",
        "name": "test_campaign",
        "status": "scheduled",
        "date_created": "2019-01-20T21:10:00+05:30"
      }
    }
  ]
}
```

## Notes

- Minimum 10-minute lead time required for scheduled campaigns
- Variables in dynamic templates must match column headers exactly
- Default SMS capacity is 300 per minute
