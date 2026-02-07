---
id: call-details
title: Call Details
sidebar_label: Call Details
---

# Get Call Details

Retrieve comprehensive details for a specific contact center call.

## HTTP Request

```
GET /v2/accounts/<account_sid>/calls/<call_sid>
```

## Path Parameters

| Parameter | Description |
|-----------|-------------|
| `call_sid` | The unique identifier of the call |

## Response

Returns comprehensive call metadata including:

| Field | Description |
|-------|-------------|
| `call_sid` | Unique call identifier |
| `call_state` | Current state of the call |
| `duration` | Total call duration |
| `talk_time` | Actual conversation time |
| `recording_url` | URL to access the call recording (if enabled) |
| `agent_details` | Information about the assigned agent |
| `customer_details` | Customer phone number and details |
| `status_callbacks` | Webhook delivery status |

## Status Callback Webhook Payload

When configured, the following data is sent to your webhook URL:

| Field | Description |
|-------|-------------|
| `call_sid` | Call identifier |
| `event_type` | `answered` or `terminal` |
| `call_state` | Current call state |
| `duration` | Call duration at event time |
| `recording_url` | Recording URL (on terminal event) |
