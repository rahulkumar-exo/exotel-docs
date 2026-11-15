---
id: say
title: Say
description: ExoML Say verb — convert text to speech and play it to the caller.
sidebar_label: Say
sidebar_position: 1
displayed_sidebar: voiceSidebar
---

# `<Say>`

Converts text to speech and plays it to the caller. Supports plain text and SSML tags.

## Attributes

| Attribute | Required | Default | Description |
|-----------|----------|---------|-------------|
| `voice` | No | `woman` | Voice to use: `man` or `woman` |
| `language` | No | `en` | Language code (e.g., `en`, `hi`, `ta`, `te`, `kn`, `ml`, `bn`, `mr`) |
| `loop` | No | `1` | Number of times to repeat. `0` = repeat indefinitely until interrupted |

## Syntax

```xml
<Say voice="woman" language="en">Hello, welcome to Acme Corp.</Say>
```

```xml
<!-- Hindi greeting -->
<Say language="hi">नमस्ते, एक्सोटेल में आपका स्वागत है।</Say>
```

## Inside Gather

`<Say>` can appear inside `<Gather>` to prompt callers before collecting input:

```xml
<Gather numDigits="1" action="https://your-app.example.com/ivr">
  <Say>Press 1 for Sales, 2 for Support.</Say>
</Gather>
```

## SSML support

Exotel's TTS engine supports a subset of SSML for controlling speech:

```xml
<Say>
  Your order total is <say-as interpret-as="currency">INR 1500</say-as>.
  <break time="500ms"/>
  Thank you for your purchase.
</Say>
```

## Legs API — StartSay / StopSay

For mid-call text-to-speech on an active leg, use the Legs API actions:

```bash
# Start TTS on an active leg
curl -u '<api_key>:<api_token>' -X POST \
  'https://cpaas-api.in.exotel.com/v2/accounts/<account_sid>/legs/<leg_sid>/actions/start_say' \
  -H 'Content-Type: application/json' \
  -d '{"text": "Please hold while we connect you.", "loop": 0}'

# Stop TTS
curl -u '<api_key>:<api_token>' -X POST \
  'https://cpaas-api.in.exotel.com/v2/accounts/<account_sid>/legs/<leg_sid>/actions/stop_say'
```

Or using ExoML in a Legs API action:

```bash
curl -u '<api_key>:<api_token>' -X POST \
  'https://cpaas-api.in.exotel.com/v2/accounts/<account_sid>/legs/<leg_sid>/actions' \
  -H 'Content-Type: application/json' \
  -d '{
    "exoml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Flow><StartSay>Please hold while we connect you.</StartSay></Flow>"
  }'
```

### StartSay parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `text` | Yes | Text to speak. Plain text or SSML. |
| `loop` | No | Repeat count (`0` = once, `-1` = indefinitely) |

### Events emitted

| Event | Description |
|-------|-------------|
| `say_started` | TTS playback has begun |
| `say_completed` | TTS playback finished |
| `say_stopped` | TTS playback stopped early via `stop_say` |

## Best practices

- Keep messages under 30 seconds — callers lose focus on long prompts
- Use `loop: 0` for hold music equivalents, then call `stop_say` when ready to proceed
- For multilingual deployments, detect the caller's language from your CRM before returning the greeting verb
