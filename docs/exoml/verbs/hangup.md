---
id: hangup
title: Hangup
description: ExoML Hangup verb — terminate the call.
sidebar_label: Hangup
sidebar_position: 6
displayed_sidebar: voiceSidebar
---

# `<Hangup>`

Terminates the call. Use it as the last verb in a flow, or as a fallback after a timeout.

## Syntax

```xml
<Hangup/>
```

No attributes. No content.

## Example

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Thank you for calling Acme Corp. Goodbye.</Say>
  <Hangup/>
</Response>
```

## Fallback after timeout

Place `<Hangup/>` after `<Gather>` to terminate calls where the caller doesn't press any key:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather numDigits="1" action="/ivr/route" timeout="5">
    <Say>Press 1 for Sales, 2 for Support.</Say>
  </Gather>
  <!-- Caller did not respond — hang up -->
  <Say>We did not receive your input. Goodbye.</Say>
  <Hangup/>
</Response>
```

## Legs API — Hangup action

To terminate an active leg programmatically:

```bash
curl -u '<api_key>:<api_token>' -X POST \
  'https://cpaas-api.in.exotel.com/v2/accounts/<account_sid>/legs/<leg_sid>/actions/hangup' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

Or using ExoML:

```bash
curl -u '<api_key>:<api_token>' -X POST \
  'https://cpaas-api.in.exotel.com/v2/accounts/<account_sid>/legs/<leg_sid>/actions' \
  -H 'Content-Type: application/json' \
  -d '{
    "exoml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Flow><Hangup/></Flow>"
  }'
```

### Events emitted

| Event | Description |
|-------|-------------|
| `leg_terminated` | Leg has ended |
