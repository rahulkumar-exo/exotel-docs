---
id: call-notifications
title: Call Notifications
sidebar_label: Call Notifications
---

# Call Notifications

Handle inbound and outbound call event notifications for your WebRTC application. Call notifications are delivered as webhooks to URLs configured in your [App Settings](/docs/ip-pstn-webrtc/api-reference/app-settings).

## Inbound Call Notification

When an inbound call arrives for a user, a POST request is sent to your configured `popup_url`:

### Webhook Payload

```json
{
  "event": "incoming_call",
  "call_sid": "call_in_abc123",
  "direction": "inbound",
  "from": "+919876543210",
  "to": "sip:agent_001@app.exotel.com",
  "app_id": "app_abc123",
  "user_id": "agent_001",
  "exophone": "+911234567890",
  "timestamp": "2024-06-15T10:30:00.000Z",
  "caller_info": {
    "name": "John Customer",
    "custom_field": "CRM_ID_12345"
  }
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `event` | String | Event type: `incoming_call` |
| `call_sid` | String | Unique call identifier |
| `direction` | String | Always `inbound` for this event |
| `from` | String | Caller's phone number |
| `to` | String | SIP URI or phone number of the user |
| `app_id` | String | Application receiving the call |
| `user_id` | String | User receiving the call |
| `exophone` | String | Exotel number dialed by the caller |
| `timestamp` | String | ISO 8601 timestamp |
| `caller_info` | Object | Additional caller information if available |

---

## Outbound Call Notification

When an outbound call is initiated by a user:

### Webhook Payload

```json
{
  "event": "outbound_call",
  "call_sid": "call_out_def456",
  "direction": "outbound",
  "from": "sip:agent_001@app.exotel.com",
  "to": "+919876543210",
  "app_id": "app_abc123",
  "user_id": "agent_001",
  "exophone": "+911234567890",
  "timestamp": "2024-06-15T10:35:00.000Z"
}
```

---

## Call Status Updates

Status updates throughout the call lifecycle:

### Ringing

```json
{
  "event": "call_ringing",
  "call_sid": "call_in_abc123",
  "status": "ringing",
  "timestamp": "2024-06-15T10:30:01.000Z"
}
```

### Answered

```json
{
  "event": "call_answered",
  "call_sid": "call_in_abc123",
  "status": "in-progress",
  "answered_by": "agent_001",
  "device": "sip",
  "timestamp": "2024-06-15T10:30:05.000Z"
}
```

### Completed

```json
{
  "event": "call_completed",
  "call_sid": "call_in_abc123",
  "status": "completed",
  "duration": 300,
  "talk_time": 295,
  "recording_available": true,
  "timestamp": "2024-06-15T10:35:05.000Z"
}
```

### Missed

```json
{
  "event": "call_missed",
  "call_sid": "call_in_abc123",
  "status": "no-answer",
  "ring_time": 30,
  "timestamp": "2024-06-15T10:30:31.000Z"
}
```

---

## Missed Call Notification

Sent to your `missed_call_url` when a call goes unanswered:

```json
{
  "event": "missed_call",
  "call_sid": "call_in_abc123",
  "from": "+919876543210",
  "to": "sip:agent_001@app.exotel.com",
  "exophone": "+911234567890",
  "ring_duration": 30,
  "timestamp": "2024-06-15T10:30:31.000Z"
}
```

## Webhook Response

Your server must respond with HTTP `200` to acknowledge receipt. Non-200 responses trigger retries:

| Retry | Delay |
|-------|-------|
| 1st | 5 seconds |
| 2nd | 30 seconds |
| 3rd | 5 minutes |

After 3 failed retries, the notification is dropped and logged.

## Event Types Summary

| Event | Description | Webhook URL |
|-------|-------------|-------------|
| `incoming_call` | Inbound call arrives | `popup_url` |
| `outbound_call` | Outbound call initiated | `callback_url` |
| `call_ringing` | Call is ringing | `callback_url` |
| `call_answered` | Call was answered | `callback_url` |
| `call_completed` | Call ended normally | `callback_url` |
| `call_missed` | Call was not answered | `missed_call_url` |
