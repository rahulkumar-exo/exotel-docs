---
id: make-call
title: Make Call
description: Initiate outbound calls connecting agents to customers using the Exotel Contact Center API. Configure recording, wait audio, timeouts, and webhooks.
sidebar_label: Make Call
---

# CCM Make Call

Initiate an outbound call connecting an agent to a customer.

## HTTP Request

```
POST /v2/accounts/<account_sid>/calls
```

## Request Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `from` | Yes | Agent details — use `user_contact_uri` or `user_id` |
| `to` | Yes | Customer phone number in E.164 format |
| `virtual_number` | Yes | ExoPhone to use for the call |
| `recording` | No | Boolean — enable call recording |
| `recording_channels` | No | `"single"` or `"dual"` channel recording |
| `wait_audio_url` | No | Audio URL to play while agent connects |
| `max_time_limit` | No | Maximum call duration in seconds |
| `attempt_time_out` | No | Time in seconds to ring the called parties (both the agent and customer legs). The timer runs only during ringing and stops once each leg is answered. Default: 30 seconds. |
| `custom_field` | No | Application-specific metadata |
| `status_callback` | No | Array of webhook event configurations |

### Status Callback Events

| Event | Description |
|-------|-------------|
| `answered` | Triggered when the call is answered |
| `terminal` | Triggered when the call ends |

## Response

```json
{
  "call_sid": "unique_call_identifier",
  "call_state": "active",
  "assigned_agent_details": {
    "user_id": "agent_uuid",
    "contact_uri": "+919999999999"
  },
  "customer_details": {
    "number": "+918888888888"
  }
}
```

:::info
Only agents who are added as users on Exotel and are in **available** status can receive calls through this API.
:::
