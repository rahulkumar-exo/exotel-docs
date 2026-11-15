---
id: event-endpoint
title: HTTPS Event Endpoint
description: Implement your HTTPS event endpoint to receive real-time ExoML call events from Exotel.
sidebar_label: Event Endpoint
sidebar_position: 2
displayed_sidebar: voiceSidebar
---

# HTTPS Event Endpoint

Exotel delivers live call events to a public HTTPS endpoint you host. Your server acknowledges each event with an HTTP 2xx response, then issues the next action via the ExoML actions API.

## Request contract

| Item | Value |
|---|---|
| Method | POST |
| Content-Type | `application/json` |
| TLS | HTTPS required |
| Success ack | Any HTTP 2xx (response body is ignored) |
| Retries | Up to 3 attempts for 408, 429, 5xx, timeouts, and connection errors |

Exotel waits up to ~1 second per delivery attempt. Acknowledge quickly and do heavy work (CRM lookups, LLM calls) asynchronously after the ack.

## Request headers

| Header | Value |
|---|---|
| `Content-Type` | `application/json` |
| `User-Agent` | `Exotel-Hermix/<version>` |
| `X-Exotel-Event-Sid` | Same as `event_sid` in the body |
| `X-Exotel-Request-Id` | `<event_sid>-<attempt_number>` (1–3) |
| `Authorization` | `Basic …` when Basic Auth is configured |

## Payload fields

```json
{
  "event_sid": "<event_sid>",
  "event_type": "leg_action_event",
  "event_name": "leg_answered",
  "event_timestamp": "2024-01-15T10:30:00.529Z",
  "action_sid": "<action_sid>",
  "action_custom_parameter": "your-tracking-value",
  "event_data": {
    "data": {},
    "error": null
  },
  "data": {
    "leg_sid": "<leg_sid>",
    "account_sid": "<account_sid>",
    "contact_uri": "+91XXXXXXXXXX",
    "exophone": "+91YYYYYYYYYY",
    "state": "active",
    "start_time": "2024-01-15T10:29:59.312Z",
    "date_created": "2024-01-15T10:29:59.339Z"
  }
}
```

| Field | Type | Description |
|---|---|---|
| `event_sid` | string | Unique event ID |
| `event_type` | string | Coarse group: `leg_lifecycle_event`, `leg_action_event`, `bridge_lifecycle_event`, `bridge_action_event` |
| `event_name` | string | Specific event (e.g. `leg_answered`, `gather_success`) |
| `event_timestamp` | string | RFC 3339 UTC with millisecond precision |
| `action_sid` | string | Present when an action triggered this event |
| `action_custom_parameter` | string | Echo of `action_custom_param` from your action request |
| `event_data` | object | Action or error details |
| `data` | object | Leg/bridge context (sid, state, timestamps, etc.) |

## Event names

**Leg lifecycle**
- `leg_connecting` — Exotel is dialling
- `leg_ringing` — Ringing on the recipient's end
- `leg_answered` — Call picked up
- `leg_incoming` — Inbound call received
- `leg_terminated` — Call ended
- `leg_failed_to_create` — Leg creation failed

**Leg action outcomes**
- `play_started`, `play_completed`, `play_interrupted`, `play_failed_to_start`
- `gather_initiated`, `gather_started`, `gather_success` (includes `digits`), `gather_failed`, `gather_interrupted`
- `dial_initiated`, `dial_success`, `dial_completed`, `dial_failed`
- `recording_started`, `recording_stopped`, `recording_available`
- `hold_success`, `hold_failed`

## Example handler (Node.js / Express)

```js
const express = require('express');
const app = express();
app.use(express.json());

app.post('/exotel/events', async (req, res) => {
  // Acknowledge immediately
  res.sendStatus(200);

  const { event_name, data } = req.body;

  if (event_name === 'leg_answered') {
    // Issue the first action after ack
    await sendExomlAction(data.leg_sid, `
      <?xml version="1.0" encoding="UTF-8"?>
      <Flow>
        <StartSay language="en" preferredTTSEngine="polly">
          Welcome. Press 1 for sales, 2 for support.
        </StartSay>
      </Flow>
    `);
  }

  if (event_name === 'gather_success') {
    const digit = req.body.event_data?.data?.digits;
    if (digit === '1') {
      await sendExomlAction(data.leg_sid, buildDialAction('+918030752400'));
    }
  }
});
```

## Registering the endpoint

**Outbound / API-driven calls** — Pass the URL when creating the leg:

```json
POST /v2/accounts/{account_sid}/legs

{
  "contact_uri": "+91XXXXXXXXXX",
  "exophone": "+91YYYYYYYYYY",
  "leg_event_endpoint": "https://voice.example.com/exotel/events"
}
```

**Inbound calls (ExoPhone)** — Contact Exotel support to attach the URL to your ExoPhone.

## Authentication (optional)

If you want Exotel to authenticate when calling your endpoint, share Basic Auth credentials with Exotel support. Exotel then includes:

```
Authorization: Basic <base64(username:password)>
```

on every POST. Validate this header on your server and reject requests without valid credentials.

## IP allowlist

If you restrict inbound traffic by IP, contact your Exotel Customer Success Manager for the current list of callback source IP addresses.
