---
id: sms-details
title: Campaign SMS Details
sidebar_label: SMS Details
---

# Get SMS Details for a Campaign

Retrieve individual SMS delivery details for a specific campaign.

## HTTP Request

```
GET /v2/accounts/<account_sid>/message-campaigns/<campaign_id>/message-details?channel=sms
```

## Query Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `channel` | Yes | Must be `"sms"` |
| `offset` | No | Zero-based starting position |
| `limit` | No | Records per page (default: `20`) |
| `number` | No | Search by phone number (exact match) |
| `sort_by` | No | Sort order, e.g., `date_created:desc` |

## Response Fields

| Field | Description |
|-------|-------------|
| `number` | Recipient phone number |
| `name` | Contact name |
| `message` | SMS content sent |
| `status` | Delivery status |
| `detailed_status` | Detailed delivery status |
| `schedule_time` | Scheduled send time |
| `sender_id` | Sender ID used |
| `direction` | Message direction |
| `sid` | Unique message SID |

## SMS Status Values

| Status | Description |
|--------|-------------|
| `sent` | Message delivered successfully |
| `failed` | Message delivery failed |
| `failed_dnd` | Failed due to DND (Do Not Disturb) |
| `failed_spam_detected` | Failed due to spam detection |
| `invalid` | Invalid phone number |
