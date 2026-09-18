---
id: developer-guide
title: AgentStream
description: Developer reference for Exotel AgentStream — connect calls to your bot over WebSocket using three methods, with full protocol and error reference.
sidebar_label: AgentStream
slug: /agentstream/developer-guide
sidebar_position: 3
---

# AgentStream

Stream real-time audio between live phone calls and your bot server over WebSocket. Three ways to connect — pick the one that fits your setup.

---

## How it works

```
Caller → Exophone → Exotel → wss://your-bot-server
```

When a call is answered, Exotel opens a WebSocket to your endpoint and streams raw PCM audio every ~100 ms. Send audio back on the same socket to speak to the caller.

---

## Connect Voice AI

Dial a number and connect the answered call directly to your bot. No flow setup needed.

**`POST /v1/accounts/{account_sid}/calls/connect`**

| Region | Base URL |
|--------|----------|
| Mumbai | `https://api.in.exotel.com` |
| Singapore | `https://api.exotel.com` |

**Auth:** HTTP Basic — API key as username, API token as password.

### Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `from` | Yes | Number to dial — E.164 format (`+919876543210`) |
| `callerid` | Yes | Your Exophone (shown as caller ID) |
| `streamurl` | Yes | Bot WebSocket URL — `wss://` or `ws://`, max 600 chars |
| `streamtype` | Yes | `bidirectional` |
| `record` | No | `true` to record the call |
| `recordingchannels` | No | `single` (merged) or `dual` (separate tracks) |
| `timelimit` | No | Max duration in seconds (max `14400`) |
| `customfield` | No | Metadata string, max 128 chars |
| `statuscallback` | No | Webhook URL for call status events |
| `statuscallbackevents[]` | No | `answered` · `terminal` · `ringing` |
| `streamname` | No | Label for the stream, max 32 chars |

### Request

```bash
curl -u '<api_key>:<api_token>' -X POST \
  'https://api.in.exotel.com/v1/accounts/<account_sid>/calls/connect' \
  -F 'from=+919876543210' \
  -F 'callerid=08047491899' \
  -F 'streamurl=wss://bot.example.com/media' \
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

**Status values:** `queued` · `in-progress` · `completed` · `failed` · `busy` · `no-answer`

---

## Connect Voice API with Flow

Dial a number and run the call through an Exotel flow — IVR menus, greetings, DTMF collection — before reaching your bot.

**Same endpoint:**
```
POST /v1/accounts/{account_sid}/calls/connect
```

### Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `from` | Yes | Number to dial — E.164 format |
| `callerid` | Yes | Your Exophone |
| `url` | Yes | Flow URL: `https://my.exotel.com/{account_sid}/exoml/start_voice/{flow_id}` |
| `calltype` | No | `trans` for transactional calls |
| `timelimit` | No | Max duration in seconds (max `14400`) |
| `timeout` | No | Ring timeout in seconds |
| `statuscallback` | No | Webhook URL for status events |
| `statuscallbackevents` | No | `terminal` · `answered` · `both` |
| `customfield` | No | Passed into the flow via the Passthru applet |

:::note
Don't pass `streamurl` or `streamtype` here — the WebSocket URL is configured inside the flow's Voicebot/Stream applet.
:::

### Request

```bash
curl -u '<api_key>:<api_token>' -X POST \
  'https://api.in.exotel.com/v1/accounts/<account_sid>/calls/connect' \
  -d 'from=+919876543210' \
  -d 'callerid=08047491899' \
  -d 'url=https://my.exotel.com/<account_sid>/exoml/start_voice/<flow_id>' \
  -d 'statuscallback=https://your-server.com/callback' \
  -d 'statuscallbackevents=terminal'
```

### Response

Same shape as [Connect Voice AI response](#response).

### Common flow patterns

| Pattern | Applets in flow |
|---------|----------------|
| Greeting → bot | Play → Voicebot |
| IVR menu → bot | Gather (DTMF) → Voicebot |
| Bot → human agent | Voicebot → Transfer |
| Listen-only (transcription) | Stream → Passthru |

---

## Programmable Voice APIs (ExoML)

Full runtime control via Legs API — per-call stream URLs, dynamic routing, greeting + stream in parallel.

### Step 1 — Dial the customer

```bash
curl -u '<api_key>:<api_token>' -X POST \
  'https://api.in.exotel.com/v2/accounts/<account_sid>/legs' \
  -H 'Content-Type: application/json' \
  -d '{
    "contact_uri": "+919876543210",
    "exophone": "08047491899",
    "leg_event_endpoint": "grpc://your-event-server.example.com",
    "timeout": 30
  }'
```

Exotel emits: `leg_connecting` → `leg_ringing` → `leg_answered`

### Step 2 — Start stream on `leg_answered`

```bash
curl -u '<api_key>:<api_token>' -X POST \
  'https://api.in.exotel.com/v2/accounts/<account_sid>/legs/<leg_sid>/actions/start_stream' \
  -H 'Content-Type: application/json' \
  -d '{
    "direction": "bidirectional",
    "url": "wss://bot.example.com/stream",
    "content_type": "audio/x-mulaw;rate=8000"
  }'
```

### Optional — Play greeting while stream initialises

Fire both requests simultaneously on `leg_answered` to eliminate dead air:

```bash
# Start say in parallel with start_stream
curl -X POST \
  '.../legs/<leg_sid>/actions/start_say' \
  -H 'Content-Type: application/json' \
  -d '{ "text": "Please hold.", "loop": 0 }'
```

Stop it as soon as `stream_started` fires:

```bash
curl -X POST '.../legs/<leg_sid>/actions/stop_say'
```

| Scenario | Use greeting? |
|----------|--------------|
| Inbound IVR / tech support | No |
| Outbound sales / collections | Yes |

---

## Applet configuration

### Stream Applet — Unidirectional (Exotel → your server)

Audio flows **one way only** — from the caller to your server. Your server cannot send audio back. Use for transcription, agent assist, call monitoring.

| # | Parameter | Required | Description |
|---|-----------|----------|-------------|
| 1 | **Action** | Yes | `Start` to begin streaming · `Stop` to end it |
| 2 | **URL** | Yes | `wss://your-server.com/stream` — or `https://` endpoint returning `{"url":"wss://..."}` |
| 3 | **Next Applet** | No | Call flow continues to next applet immediately after stream creation |

:::note
Unidirectional streams fork audio immediately. If used with a Connect applet that rings multiple agents, audio from all ringing legs is sent — filter on your end.
:::

---

### VoiceBot Applet — Bidirectional (Exotel ↔ your server)

Audio flows **both ways** — your server receives caller audio and can send audio back in real time. Use for conversational AI, IVR replacement, outbound bots.

| # | Parameter | Required | Description |
|---|-----------|----------|-------------|
| 1 | **URL** | Yes | `wss://bot.example.com/stream` — or `https://` endpoint returning `{"url":"wss://..."}` for dynamic routing |
| 2 | **Authentication** | No | IP whitelist or Basic auth header. Email hello@exotel.com for Exotel's IP ranges. |
| 3 | **Sample Rate** | No | `8000` (default) · `16000` (recommended) · `24000`. Append `?sample-rate=16000` to URL. |
| 4 | **Custom Parameters** | No | Up to 3 key-value pairs in URL, max 256 chars total. Arrive in the `start` event. |
| 5 | **Record** | No | Generates recording URL in the Passthru applet |
| 6 | **Next Applet** | No | Stream closes automatically — no Stop applet needed |

---

## WebSocket protocol

### Event support by applet type

| Event | Stream Applet (Unidirectional) | VoiceBot Applet (Bidirectional) |
|-------|-------------------------------|--------------------------------|
| `connected` | ✓ | ✓ |
| `start` | ✓ | ✓ |
| `media` (receive) | ✓ | ✓ |
| `dtmf` (receive) | ✗ | ✓ |
| `mark` (receive) | ✗ | ✓ |
| `stop` | ✓ | ✓ |
| `media` (send) | ✗ | ✓ |
| `mark` (send) | ✗ | ✓ |
| `clear` (send) | ✗ | ✓ |

---

### Events — Exotel → your server

#### `connected`
```json
{ "event": "connected" }
```

#### `start`
```json
{
  "event": "start",
  "sequence_number": "1",
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxx",
  "start": {
    "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxx",
    "call_sid": "CAxxxxxxxxxxxxxxxxxxxxxxxx",
    "account_sid": "ACxxxxxxxxxxxxxxxxxxxxxxxx",
    "from": "+919876543210",
    "to": "+918047491899",
    "custom_parameters": { "key1": "value1" },
    "media_format": {
      "encoding": "audio/x-raw",
      "sample_rate": "8000",
      "bit_rate": "16"
    }
  }
}
```

#### `media`
```json
{
  "event": "media",
  "sequence_number": "3",
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxx",
  "media": {
    "chunk": "2",
    "timestamp": "200",
    "payload": "<base64-encoded PCM>"
  }
}
```

#### `dtmf` _(VoiceBot Applet only)_
```json
{
  "event": "dtmf",
  "sequence_number": "7",
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxx",
  "dtmf": { "digit": "5", "duration": "100" }
}
```

#### `mark` _(VoiceBot Applet only)_

Sent when audio you previously sent has finished playing.

```json
{
  "event": "mark",
  "sequence_number": "15",
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxx",
  "mark": { "name": "my-label" }
}
```

#### `stop`
```json
{
  "event": "stop",
  "sequence_number": "20",
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxx",
  "stop": {
    "call_sid": "CAxxxxxxxxxxxxxxxxxxxxxxxx",
    "account_sid": "ACxxxxxxxxxxxxxxxxxxxxxxxx",
    "reason": "callended"
  }
}
```

`reason`: `stopped` (applet ended) · `callended` (caller hung up)

---

### Events — your server → Exotel _(VoiceBot Applet only)_

:::note
These events only apply to the **VoiceBot Applet (bidirectional)**. The Stream Applet is receive-only — your server cannot send any events back.
:::

#### `media` — send audio to caller
```json
{
  "event": "media",
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxx",
  "media": { "payload": "<base64-encoded PCM>" }
}
```

#### `mark` — tag a playback position
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

---

## Audio format

| Property | Value |
|----------|-------|
| Codec | Raw PCM (linear16) — uncompressed |
| Bit depth | 16-bit signed, little-endian |
| Channels | Mono |
| Default sample rate | 8 000 Hz |
| Supported rates | 8 000 · 16 000 · 24 000 Hz |
| Transport | Base64 |
| Chunk size | 3 200–100 000 bytes, must be a multiple of 320 |
| Max session duration | 60 minutes |

---

## Passthru Applet

Place immediately after the Voicebot/Stream applet. Exotel sends a **GET** request with stream metadata as query parameters to your callback URL when the stream ends.

| Field | Description |
|-------|-------------|
| `callsid` | Parent call ID |
| `streamsid` | Stream session ID |
| `streamurl` | WebSocket URL used |
| `status` | Final stream status |
| `duration` | Stream duration in seconds |
| `recordingurl` | Recording link (if enabled) |
| `error` | Error detail — copy as-is for support |
| `disposition` | Outcome classification |
| `disconnectedby` | `caller` · `bot` · `system` |
| `detailedstatus` | Fine-grained status |

---

## Active Stream Monitoring

Check how many streams are live on your account.

```bash
curl -u '<api_key>:<api_token>' -X GET \
  'https://api.in.exotel.com/v1/accounts/<account_sid>/activestreams'
```

```json
{
  "status": "success",
  "active_streams": 12,
  "max_allowed_streams": 100,
  "account_sid": "<account_sid>"
}
```

---

## WSS error codes

| Code | Meaning | Common cause |
|------|---------|--------------|
| `1000` | Normal closure | Clean disconnect |
| `1001` | Endpoint going away | Server restart |
| `1002–1003` | Protocol / data error | Malformed frames |
| `1006` | Abnormal closure | Network drop · TLS failure · server crash |
| `1007–1009` | Payload / policy / size | Chunk out of bounds |
| `1011` | Server error | Unhandled exception |
| `1012–1013` | Restart / retry | Transient — retry |

**1006 checklist:** WSS URL reachable → TLS cert valid → firewall allows Exotel IPs → handshake completes within 10 s.

---

## Echo server _(VoiceBot Applet / bidirectional only)_

```python
import asyncio, json, websockets

async def handle(ws):
    stream_sid = None
    async for msg in ws:
        ev = json.loads(msg)
        match ev["event"]:
            case "start":
                stream_sid = ev["start"]["stream_sid"]
            case "media":
                await ws.send(json.dumps({
                    "event": "media",
                    "stream_sid": stream_sid,
                    "media": {"payload": ev["media"]["payload"]}
                }))
            case "stop":
                break

async def main():
    async with websockets.serve(handle, "0.0.0.0", 5001):
        await asyncio.Future()

asyncio.run(main())
```

```bash
pip install websockets && python echo.py
ngrok http 5001  # use the https:// URL as streamurl
```

---

## Related

- [Stream & Voicebot Applet](./stream-voicebot-applet) — Full applet and event reference
- [Bot Stream with Legs API](./bot-stream-legs-api) — Legs API reference
- [Passthru Applet](./passthru-applet) — Passthru configuration
