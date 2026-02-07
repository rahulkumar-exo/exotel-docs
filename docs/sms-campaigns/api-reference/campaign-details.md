---
id: campaign-details
title: Get Campaign Details
sidebar_label: Campaign Details
---

# Get SMS Campaign Details

Retrieve details and statistics for a specific SMS campaign.

## HTTP Request

```
GET /v2/accounts/<account_sid>/message-campaigns/<campaign_id>
```

## Path Parameters

| Parameter | Description |
|-----------|-------------|
| `campaign_id` | The unique SID of the SMS campaign |

## Response

The response includes complete campaign details with delivery statistics:

| Field | Description |
|-------|-------------|
| `sid` | Campaign unique identifier |
| `name` | Campaign name |
| `status` | Current status (scheduled, in-progress, completed, etc.) |
| `scheduled` | Number of messages scheduled |
| `submitted` | Number of messages submitted |
| `sent` | Number of messages successfully sent |
| `failed` | Number of failed messages |
| `invalid` | Number of invalid contacts |
| `date_created` | Campaign creation timestamp |
| `report_url` | URL to download campaign report (available after completion) |
