---
id: call-details
title: Call Details
description: Retrieve comprehensive details for a specific Exotel Contact Center call using the API. Access call state, duration, recordings, and metadata.
sidebar_label: Call Details
---

# Get Call Details

Retrieve comprehensive details for a specific contact center call.

## HTTP Request

```
GET /v2/accounts/<account_sid>/calls/<call_sid>
```

## Regional URLs

| Region | Base URL |
|--------|----------|
| India | `https://ccm-api.exotel.com` |
| Singapore | `https://ccm-api.exotel.sg` |

## Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `account_sid` | String | Your Exotel account SID |
| `call_sid` | String | The unique identifier of the call |

## Authentication

Use your API key as the username and API token as the password in HTTP Basic Auth.

## Example Request

```bash
curl -u '<api_key>:<api_token>' -X GET \
  'https://ccm-api.exotel.com/v2/accounts/<account_sid>/calls/<call_sid>' \
  -H 'Content-Type: application/json'
```

## Example Response

```json
{
  "request_id": "req_abc123",
  "http_code": 200,
  "response": {
    "code": 200,
    "status": "success",
    "call_details": {
      "call_sid": "cabfb1dfa8c5e1c7f2c458423b7716b3",
      "call_state": "terminal",
      "call_status": "completed",
      "direction": "outbound",
      "virtual_number": "+911414941199",
      "from": "+919900XXXXXX",
      "to": "+918800XXXXXX",
      "start_time": "2024-06-15T10:30:00+05:30",
      "end_time": "2024-06-15T10:35:12+05:30",
      "duration": 312,
      "talk_time": 295,
      "recording_url": "https://s3-ap-south-1.amazonaws.com/exotel-recordings/.../recording.mp3",
      "custom_field": "agent_id=A001",
      "agent_details": {
        "user_id": "agent_uuid_001",
        "name": "John Agent",
        "email": "john@company.com"
      },
      "customer_details": {
        "number": "+918800XXXXXX"
      }
    }
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `call_sid` | String | Unique identifier for the call |
| `call_state` | String | Lifecycle state of the call. See [Call State Values](#call-state-values) |
| `call_status` | String | Outcome of the call. See [Call Status Values](#call-status-values) |
| `direction` | String | `inbound` or `outbound` |
| `virtual_number` | String | The Exotel virtual number used for the call |
| `from` | String | Caller's phone number in E.164 format |
| `to` | String | Recipient's phone number in E.164 format |
| `start_time` | DateTime | ISO 8601 timestamp when the call started |
| `end_time` | DateTime | ISO 8601 timestamp when the call ended |
| `duration` | Integer | Total elapsed time of the call in seconds (from dial to disconnect) |
| `talk_time` | Integer | Actual connected conversation time in seconds |
| `recording_url` | String | URL of the call recording MP3 file (present only if recording was enabled) |
| `custom_field` | String | Custom metadata attached to the call at initiation |
| `agent_details.user_id` | String | Unique identifier of the agent who handled the call |
| `agent_details.name` | String | Display name of the agent |
| `agent_details.email` | String | Email address of the agent |
| `customer_details.number` | String | Customer's phone number in E.164 format |

## Call State Values

| Value | Description |
|-------|-------------|
| `active` | Call is currently in progress |
| `terminal` | Call has ended (final state) |

## Call Status Values

| Value | Description |
|-------|-------------|
| `completed` | Call was answered and ended normally |
| `agent_unanswered` | Agent did not answer the call |
| `customer_unanswered` | Customer did not answer the call |
| `agent_cancelled` | Call was cancelled by the agent before connection |
| `failed` | Call could not be established due to a system or network error |

## Status Callback Webhook Payload

When a status callback URL is configured on the call, the following data is sent to your webhook at each event:

| Field | Type | Description |
|-------|------|-------------|
| `call_sid` | String | Call identifier |
| `event_type` | String | `answered` when connected; `terminal` when the call ends |
| `call_state` | String | Current call state at the time of the event |
| `duration` | Integer | Call duration in seconds at the time of the event |
| `recording_url` | String | Recording URL (included on `terminal` event if recording was enabled) |

## HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `400` | Bad Request — Invalid parameters |
| `401` | Unauthorized — Invalid API credentials |
| `404` | Not Found — `call_sid` does not exist for this account |
| `429` | Too Many Requests — Rate limit exceeded |
| `500` | Internal Server Error |
