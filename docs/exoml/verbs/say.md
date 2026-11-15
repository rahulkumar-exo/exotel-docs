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

## Legs API — Say / StopSay

On an active leg, send the verb as ExoML to the Legs actions endpoint, `POST /v2/accounts/{account_sid}/legs/{leg_sid}/actions`, in the `exoml` field (optional `action_custom_param` is echoed in the events). There are no per-action paths such as `/actions/{name}`.

```bash
# Speak text on an active leg
curl -u '<api_key>:<api_token>' -X POST \
  'https://cpaas-api.in.exotel.com/v2/accounts/<account_sid>/legs/<leg_sid>/actions' \
  -H 'Content-Type: application/json' \
  -d '{
    "exoml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Flow><Say>Please hold while we connect you.</Say></Flow>"
  }'

# Stop it
curl -u '<api_key>:<api_token>' -X POST \
  'https://cpaas-api.in.exotel.com/v2/accounts/<account_sid>/legs/<leg_sid>/actions' \
  -H 'Content-Type: application/json' \
  -d '{
    "exoml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Flow><StopSay></StopSay></Flow>"
  }'
```

### Say attributes (Legs API)

| Attribute | Required | Description |
|-----------|----------|-------------|
| inner text | Yes | Text to speak. Plain text or SSML. |
| `loop` | No | Number of times to play. Default `0` |
| `language` | No | Default `en` |
| `preferredTTSEngine` | No | `polly` (default) or `googletts` |
| `pollyVoiceId` | No | Amazon Polly voice ID |
| `googlettsVoiceName` | No | Google TTS voice, when the engine is `googletts` |

### Events emitted

| Event | Description |
|-------|-------------|
| `say_started` | TTS playback has begun |
| `say_completed` | TTS playback finished |
| `say_interrupted` | Stopped by `StopSay` or another action |
| `say_failed_to_start` | TTS could not start |
| `say_failed_to_stop` | `StopSay` did not complete |

## Best practices

- Keep messages under 30 seconds — callers lose focus on long prompts
- Use `loop: 0` for hold music equivalents, then send `StopSay` when ready to proceed
- For multilingual deployments, detect the caller's language from your CRM before returning the greeting verb
