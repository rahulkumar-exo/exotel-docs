---
id: dial
title: Dial
description: ExoML Dial verb — connect the caller to a phone number, SIP URI, or agent.
sidebar_label: Dial
sidebar_position: 4
displayed_sidebar: voiceSidebar
---

# `<Dial>`

Connects the inbound caller to another party — a phone number, SIP URI, or a group of numbers.

## Syntax

```xml
<Dial>+919876543210</Dial>
```

The content of `<Dial>` is the number or SIP URI to connect to.

## Attributes

| Attribute | Required | Default | Description |
|-----------|----------|---------|-------------|
| `callerId` | No | Your ExoPhone | The number displayed to the dialled party |
| `timeout` | No | `30` | Seconds to wait for the dialled party to answer |
| `timeLimit` | No | `14400` | Maximum call duration in seconds |
| `record` | No | `false` | `true` to record the call |
| `action` | No | — | URL to POST dial status to when the dial ends |
| `method` | No | `POST` | HTTP method for `action` |

## Examples

### Dial a phone number

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Connecting you to our support team.</Say>
  <Dial timeout="30">+919876543210</Dial>
</Response>
```

### Dial with recording

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial record="true" action="https://your-app.example.com/dial-complete">
    +919876543210
  </Dial>
</Response>
```

### Dial a SIP URI

```xml
<Dial>sip:agent@pbx.example.com</Dial>
```

## Action URL parameters

When the dial ends (call answered and then disconnected, or unanswered), Exotel POSTs to your `action` URL:

| Parameter | Description |
|-----------|-------------|
| `DialCallStatus` | `completed`, `busy`, `no-answer`, `failed` |
| `DialCallSid` | SID of the outbound call leg |
| `DialCallDuration` | Duration in seconds |
| `RecordingUrl` | Recording URL (if `record="true"`) |

## Legs API — Dial action

For mid-call dialling on an active Legs API leg (second leg / warm transfer):

```bash
curl -u '<api_key>:<api_token>' -X POST \
  'https://cpaas-api.in.exotel.com/v2/accounts/<account_sid>/legs/<leg_sid>/actions' \
  -H 'Content-Type: application/json' \
  -d '{
    "exoml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Flow><Dial contactUri=\"+919876543210\" exophone=\"08047491899\"/></Flow>"
  }'
```

### Legs API Dial attributes

| XML Attribute | Required | Description |
|---------------|----------|-------------|
| `contactUri` | Yes | Number or SIP URI to dial |
| `exophone` | Yes | Your ExoPhone (virtual number) |
| `timeout` | No | Ring timeout in seconds |

### Events emitted

| Event | Description |
|-------|-------------|
| `dial_initiated` | Dial has started |
| `dial_success` | Called party answered |
| `dial_terminal` | Dial ended (completed or unanswered) |

## Best practices

- Always set `action` on `<Dial>` so you can handle post-dial flows (e.g., voicemail if no-answer)
- Use `timeLimit` to prevent runaway calls; Exotel's max is 14400 seconds (4 hours)
- For warm transfers, use the Legs API Dial action instead — it gives you gRPC events and mid-call control
