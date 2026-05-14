---
id: developer-guide
title: AgentStream Developer Guide
description: Complete developer reference for Exotel AgentStream — three ways to connect calls to your bot, the full WebSocket protocol, audio specs, and a working echo server.
sidebar_label: Developer Guide
slug: /agentstream/developer-guide
sidebar_position: 3
---

# AgentStream Developer Guide

Real-time, bidirectional audio between live phone calls and your bot server over WebSocket. Exotel handles the PSTN; you handle the logic.

---

## Three ways to connect

| Method | When to use | Bot URL lives… |
|--------|-------------|----------------|
| [Connect to Voice AI API](#connect-to-voice-ai-api) | Direct API call, no flow setup needed | In the API request (`streamurl`) |
| [Connect via Flow](#connect-via-flow-with-voice-ai) | Reuse an existing Exotel flow (IVR → bot, greetings, DTMF) | Configured inside the flow |
| [VoiceBot Applet](#voicebot-applet) | ExoML / dashboard-driven call flows | Configured in the applet |

All three end up at the same place: a persistent `wss://` connection between Exotel and your server.

---

## Connect to Voice AI API

One API call — Exotel dials the number and connects the answered call directly to your bot over WebSocket.

**Endpoint**

```
POST /v1/accounts/{account_sid}/calls/connect
```

| Region | Base URL |
|--------|----------|
| Mumbai | `https://api.in.exotel.com` |
| Singapore | `https://api.exotel.com` |

**Authentication:** HTTP Basic — API key as username, API token as password.

### Parameters

**Required**

| Parameter | Description |
|-----------|-------------|
| `from` | Number to dial — international format (`+919876543210`) |
| `callerid` | Your Exophone (virtual number shown as caller ID) |
| `streamurl` | Your bot's WebSocket URL (`wss://` or `ws://`) |
| `streamtype` | Must be `bidirectional` |

**Optional**

| Parameter | Description |
|-----------|-------------|
| `record` | `true` to record (default: `false`) |
| `recordingchannels` | `single` (merged) or `dual` (separate tracks) |
| `timelimit` | Max call duration in seconds (max `14400`) |
| `customfield` | Tracking metadata, max 128 chars |
| `statuscallback` | Webhook URL for status events |
| `statuscallbackevents[]` | `answered`, `terminal`, `ringing` |
| `streamname` | Label for the stream, max 32 chars |

:::warning Constraints
- `streamurl` must start with `ws://` or `wss://`. Plain `http://` is not accepted.
- Full `streamurl` including query strings must be under **600 characters**.
:::

### Example

```bash
curl -X POST 'https://<api_key>:<api_token>@api.in.exotel.com/v1/accounts/<account_sid>/calls/connect' \
  -F 'from=+919876543210' \
  -F 'callerid=08047491899' \
  -F 'streamurl=wss://bot.example.com/media?sample_rate=16000' \
  -F 'streamtype=bidirectional' \
  -F 'statuscallback=https://your-server.com/callback' \
  -F 'statuscallbackevents[]=terminal'
```

### Response

```json
{
  "call": {
    "sid": "a1b2c3d4e5f6",
    "status": "in-progress",
    "from": "+919876543210",
    "phonenumbersid": "08047491899",
    "direction": "outbound-api",
    "datecreated": "2026-05-14 10:00:00",
    "recordingurl": null
  }
}
```

**Call status values:** `queued` · `in-progress` · `completed` · `failed` · `busy` · `no-answer`

---

## Connect via Flow with Voice AI

Use this when you have an existing Exotel flow — IVR menus, compliance disclosures, DTMF collection — that eventually hands off to a voicebot applet.

**Endpoint** — same as above:

```
POST /v1/accounts/{account_sid}/calls/connect
```

### Parameters

**Required**

| Parameter | Description |
|-----------|-------------|
| `from` | Number to dial |
| `callerid` | Your Exophone |
| `url` | Your flow URL: `https://my.exotel.com/{account_sid}/exoml/start_voice/{flow_id}` |

**Optional**

| Parameter | Description |
|-----------|-------------|
| `calltype` | `trans` for transactional calls |
| `timelimit` | Max duration in seconds (max `14400`) |
| `timeout` | Ring timeout in seconds |
| `statuscallback` | Webhook URL for status events |
| `statuscallbackevents` | `terminal`, `answered`, or `both` |
| `customfield` | Passed to your flow via the Passthru applet |

:::note
Do **not** pass `streamurl` or `streamtype` here — those are configured inside the flow's Voicebot/Stream applet.
:::

### Example

```bash
curl -X POST 'https://<api_key>:<api_token>@api.in.exotel.com/v1/accounts/<account_sid>/calls/connect' \
  -d 'from=+919876543210' \
  -d 'callerid=08047491899' \
  -d 'url=https://my.exotel.com/<account_sid>/exoml/start_voice/<flow_id>' \
  -d 'statuscallback=https://your-server.com/callback' \
  -d 'statuscallbackevents=terminal'
```

### Response

Same shape as the [Voice AI API response](#response) above.

### Flow patterns

| Pattern | Applets used |
|---------|-------------|
| IVR menu → bot | Dial → DTMF collect → Voicebot |
| Compliance greeting → bot | Play → Voicebot |
| Bot → human escalation | Voicebot → Transfer |
| Bot → external system | Voicebot → Passthru |

---

## VoiceBot Applet

Configure in the Exotel dashboard or ExoML when the bot URL is fixed per flow rather than per API call.

| # | Parameter | Required | Description |
|---|-----------|----------|-------------|
| 1 | **URL** | Yes | `wss://bot.example.com/stream` — or an `https://` URL that returns `{"url": "wss://..."}` for dynamic routing |
| 2 | **Authentication** | No | IP whitelist (email hello@exotel.com for IP ranges) or Basic auth header |
| 3 | **Sample Rate** | No | `8000` (default) · `16000` (recommended) · `24000`. Append `?sample-rate=16000` to URL |
| 4 | **Custom Parameters** | No | Up to 3 key-value pairs in the URL. Max 256 chars. Arrive in the `start` event. |
| 5 | **Record** | No | Generates a recording URL in the Passthru applet |
| 6 | **Next Applet** | No | Stream closes automatically before next applet — no Stop applet needed |

---

## WebSocket protocol

### Event flow

```
Call answered
  ↓
Exotel → connected
Exotel → start          (once — session metadata)
Exotel → media          (every ~100 ms — caller audio)
You    → media          (your bot's audio, bidirectional only)
Exotel → mark           (confirms your audio finished playing)
Exotel → stop           (call ended)
```

### Events: Exotel → your server

#### `connected`
```json
{ "event": "connected" }
```

#### `start`
```json
{
  "event": "start",
  "sequence_number": 1,
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxx",
  "start": {
    "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxx",
    "call_sid":   "CAxxxxxxxxxxxxxxxxxxxxxxxx",
    "account_sid": "ACxxxxxxxxxxxxxxxxxxxxxxxx",
    "from": "+919876543210",
    "to":   "+918047491899",
    "custom_parameters": { "key1": "value1" },
    "media_format": {
      "encoding":    "audio/x-raw",
      "sample_rate": "8000",
      "bit_rate":    "16"
    }
  }
}
```

#### `media`
```json
{
  "event": "media",
  "sequence_number": 3,
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxx",
  "media": {
    "chunk": 2,
    "timestamp": "200",
    "payload": "<base64-encoded PCM>"
  }
}
```

#### `dtmf` _(bidirectional only)_
```json
{
  "event": "dtmf",
  "sequence_number": 7,
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxx",
  "dtmf": { "digit": "5", "duration": "100" }
}
```

#### `mark`
```json
{
  "event": "mark",
  "sequence_number": 15,
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxx",
  "mark": { "name": "my-label" }
}
```

#### `stop`
```json
{
  "event": "stop",
  "sequence_number": 20,
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxx",
  "stop": {
    "call_sid": "CAxxxxxxxxxxxxxxxxxxxxxxxx",
    "account_sid": "ACxxxxxxxxxxxxxxxxxxxxxxxx",
    "reason": "callended"
  }
}
```

`reason`: `stopped` (applet ended) or `callended` (caller hung up)

---

### Events: your server → Exotel

#### `media` — send audio to caller
```json
{
  "event": "media",
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxx",
  "media": { "payload": "<base64-encoded PCM>" }
}
```

#### `mark` — track playback position
```json
{
  "event": "mark",
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxx",
  "mark": { "name": "turn-3-end" }
}
```

#### `clear` — flush buffered audio (barge-in)
```json
{ "event": "clear", "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxx" }
```

:::tip Barge-in
Send `clear` the moment the caller speaks mid-response. Use small audio chunks (≤ 640 bytes) so there's less buffered audio to clear.
:::

---

### Event field reference

| Field | Type | Description |
|-------|------|-------------|
| `event` | string | Event type |
| `stream_sid` | string | Unique stream session ID |
| `sequence_number` | string | Monotonically increasing — detect dropped frames |
| `start` | object | Call metadata + custom parameters |
| `media.payload` | string | Base64-encoded raw PCM audio |
| `media.chunk` | number | Chunk index |
| `media.timestamp` | string | ms since stream start |
| `stop.reason` | string | `stopped` or `callended` |
| `dtmf.digit` | string | `0–9`, `*`, `#` |

---

## Audio format

| Property | Value |
|----------|-------|
| Codec | Raw PCM (linear16 / slin) — uncompressed |
| Bit depth | 16-bit signed, little-endian |
| Channels | Mono |
| Default sample rate | 8 000 Hz |
| Supported rates | 8 000 · 16 000 · 24 000 Hz |
| Transport | Base64 encoded |
| Min chunk | 3 200 bytes (100 ms @ 8 kHz) |
| Max chunk | 100 000 bytes |
| Chunk must be | A multiple of 320 bytes |

:::tip Use 16 kHz for better ASR
Append `?sample-rate=16000` to your `streamurl` or applet URL. Most modern ASR engines work best at 16 kHz.
:::

---

## Echo server (Python)

A minimal server that plays caller audio straight back — good for verifying your setup end-to-end:

```python
import asyncio, json, websockets

async def handle(ws):
    stream_sid = None
    async for msg in ws:
        ev = json.loads(msg)
        match ev["event"]:
            case "start":
                stream_sid = ev["start"]["stream_sid"]
                print(f"started  stream={stream_sid}  call={ev['start']['call_sid']}")
            case "media":
                await ws.send(json.dumps({
                    "event": "media",
                    "stream_sid": stream_sid,
                    "media": {"payload": ev["media"]["payload"]}
                }))
            case "stop":
                print(f"stopped  reason={ev['stop']['reason']}")
                break

async def main():
    async with websockets.serve(handle, "0.0.0.0", 5001):
        await asyncio.Future()

asyncio.run(main())
```

For local testing, expose it with ngrok:

```bash
ngrok http 5001
# Use the https:// URL — Exotel resolves it to wss:// automatically
```

:::warning 10-second timeout
Exotel drops the session if your server doesn't complete the WebSocket handshake within **10 seconds** of the call being answered.
:::

---

## Production checklist

- [ ] Endpoint uses `wss://` (TLS required in production)
- [ ] Server handles the WebSocket handshake within 10 s
- [ ] Outgoing audio chunks are multiples of 320 bytes
- [ ] Send `clear` on user interruption — barge-in handled correctly
- [ ] Use `mark` to track when your audio finishes playing
- [ ] `sample_rate` in URL matches your ASR/TTS backend rate
- [ ] Log `stream_sid` and `call_sid` for every session
- [ ] Use an async server (asyncio / Node.js streams) — sync handlers cause audio gaps
- [ ] `streamurl` total length (including query params) is under 600 chars

---

## Related

- [Stream & Voicebot Applet](./stream-voicebot-applet) — Full applet reference and event field details
- [Bot Stream with Legs API](./bot-stream-legs-api) — Programmatic call control with optional greeting
- [AgentStream Overview](./overview) — Platform capabilities at a glance
