---
id: manage-campaign
title: Manage Campaign
sidebar_label: Manage Campaign
---

# Manage SMS Campaign

Update the status of an existing SMS campaign — pause, resume, complete, or archive it.

## HTTP Request

```
PUT /v2/accounts/<account_sid>/message-campaigns/<campaign_id>
```

## Request Body

```json
{
  "action": "<action>"
}
```

## Available Actions

| Action | Applicable When | Description |
|--------|----------------|-------------|
| `pause` | Created or in-progress | Temporarily stops the campaign |
| `resume` | Paused | Resumes a paused campaign |
| `complete` | Paused | Marks campaign as complete; remaining messages are marked as failed |
| `archive` | Completed | Archives the campaign |

## Response

Returns the updated campaign details with the new status.

```json
{
  "request_id": "string",
  "http_code": 200,
  "response": [
    {
      "status": "success",
      "data": {
        "sid": "campaign_sid",
        "status": "paused"
      }
    }
  ]
}
```
