---
id: developer-guide
title: AgentStream Developer Guide
description: Complete developer reference — three connection methods, WebSocket protocol, audio format, Passthru Applet, stream monitoring, WSS error handling, and a working echo server.
sidebar_label: Developer Guide
slug: /agentstream/developer-guide
sidebar_position: 3
---

# AgentStream Developer Guide

Real-time, bidirectional audio between live phone calls and your bot server over WebSocket. Exotel handles PSTN; you handle the logic.

---

## How AgentStream works

```
Caller → Exophone (PSTN / SIP)
              │
    Exotel infrastructure
              │
    ┌─────────▼──────────┐
    │  VoiceBot Applet   │  ◄──────► wss://your-bot-server
    └────────────────────┘
              │
    ┌─────────▼──────────┐
    │  Passthru Applet   │  ──POST──► your-callback-url
    └────────────────────┘
```

**Call lifecycle**

| Phase | What happens |
|-------|-------------|
| Call answered | Exotel opens WebSocket to your `wss://` endpoint |
| `connected` | Handshake confirmed |
| `start` | One-time metadata — call SID, custom params, audio format |
| `media` (loop) | ~100 ms PCM chunks from caller → your server, and back |
| `stop` | Call ended; socket closed |
| Passthru POST | Stream metadata + outcome sent to your callback URL |

---

## Three ways to connect

| # | Method | Bot URL lives in | Best for |
|---|--------|-----------------|----------|
| 1 | [Connect to Voice AI API](#1-connect-to-voice-ai-api) | API request (`streamurl`) | Simple outbound bot calls, no flow needed |
| 2 | [Connect via Flow](#2-connect-via-flow-with-voice-ai) | Inside the Exotel flow | Flows with IVR menus, greetings, DTMF, agent handoff |
| 3 | [ExoML / Programmable APIs](#3-exoml--programmable-voice-apis) | API request (`url` + Legs API) | Full programmatic control — per-call stream URLs, dynamic routing |

All three result in the same WebSocket connection described in [WebSocket Protocol](#websocket-protocol).

---

## 1. Connect to Voice AI API

One API call — Exotel dials the number and connects the answered call directly to your bot.

**`POST /v1/accounts/{account_sid}/calls/connect`**

| Region | Base URL |
|--------|----------|
| Mumbai | `https://api.in.exotel.com` |
| Singapore | `https://api.exotel.com` |

**Auth:** HTTP Basic — API key as username, API token as password.

### Required parameters

| Parameter | Description |
|-----------|-------------|
| `from` | Number to dial — international format (`+919876543210`) |
| `callerid` | Your Exophone (shown as caller ID) |
| `streamurl` | Your bot's WebSocket URL (`wss://` or `ws://`) |
| `streamtype` | Must be `bidirectional` |

### Optional parameters

| Parameter | Description |
|-----------|-------------|
| `record` | `true` to record (default: `false`) |
| `recordingchannels` | `single` (merged) or `dual` (separate tracks) |
| `timelimit` | Max duration in seconds (max `14400`) |
| `customfield` | Tracking metadata — max 128 chars |
| `statuscallback` | Webhook URL for call status events |
| `statuscallbackevents[]` | `answered` · `terminal` · `ringing` |
| `streamname` | Label for the stream — max 32 chars |

:::warning
`streamurl` must start with `ws://` or `wss://`. Full URL including query params must be **under 600 characters**.
:::

### Request

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

**Status values:** `queued` · `in-progress` · `completed` · `failed` · `busy` · `no-answer`

---

## 2. Connect via Flow with Voice AI

Exotel dials the number, the answered call enters an existing Exotel flow. The flow handles IVR menus, greetings, DTMF collection, and eventually reaches a Voicebot/Stream applet that opens the WebSocket.

**`POST /v1/accounts/{account_sid}/calls/connect`** (same endpoint as above)

### Required parameters

| Parameter | Description |
|-----------|-------------|
| `from` | Number to dial |
| `callerid` | Your Exophone |
| `url` | Flow URL: `https://my.exotel.com/{account_sid}/exoml/start_voice/{flow_id}` |

### Optional parameters

| Parameter | Description |
|-----------|-------------|
| `calltype` | `trans` for transactional |
| `timelimit` | Max duration in seconds (max `14400`) |
| `timeout` | Ring timeout in seconds |
| `statuscallback` | Webhook URL |
| `statuscallbackevents` | `terminal` · `answered` · `both` |
| `customfield` | Passed to your flow via the Passthru applet |

:::note
Do **not** pass `streamurl` or `streamtype` here — those are configured inside the flow's applet.
:::

### Request

```bash
curl -X POST 'https://<api_key>:<api_token>@api.in.exotel.com/v1/accounts/<account_sid>/calls/connect' \
  -d 'from=+919876543210' \
  -d 'callerid=08047491899' \
  -d 'url=https://my.exotel.com/<account_sid>/exoml/start_voice/<flow_id>' \
  -d 'statuscallback=https://your-server.com/callback' \
  -d 'statuscallbackevents=terminal'
```

### Response

Same shape as [Connect to Voice AI API response](#response).

### Flow patterns

| Pattern | Applets in flow |
|---------|----------------|
| IVR menu → bot | Dial → Gather (DTMF) → Voicebot |
| Compliance greeting → bot | Play → Voicebot |
| Bot → human escalation | Voicebot → Transfer |
| Bot → external system | Voicebot → Passthru |

---

## 3. ExoML / Programmable Voice APIs

Full programmatic control using the **Legs API** — create call legs, start streams, and manage greetings in real time. No flow configuration in the dashboard required.

**Prerequisites**

- Account SID, API Key, API Token
- Configured Exophone
- gRPC endpoint to receive leg events (`leg_answered`, etc.)
- Your bot server deployed at a public `wss://` URL

### Approach A — Bot first (stream only)

Best for: inbound IVR, tech support, bot-only journeys.

**Step 1 — Dial the customer**

```http
POST /v2/accounts/{account_sid}/legs
Content-Type: application/json
Authorization: Basic <base64(api_key:api_token)>

{
  "contact_uri": "+919876543210",
  "exophone": "08047491899",
  "leg_event_endpoint": "grpc://your-event-server.example.com",
  "timeout": 30
}
```

Exotel emits: `leg_connecting` → `leg_ringing` → `leg_answered`

**Step 2 — Start stream on `leg_answered`**

```http
POST /v2/accounts/{account_sid}/legs/{leg_sid}/actions/start_stream
Content-Type: application/json

{
  "direction": "bidirectional",
  "url": "wss://bot.example.com/stream",
  "content_type": "audio/x-mulaw;rate=8000"
}
```

### Approach B — Greeting + stream (eliminate dead air)

Best for: outbound sales, collections, contact centre simulation.

**Step 1** — Same as Approach A.

**Step 2 — Fire both in parallel on `leg_answered`**

```http
# Start the stream
POST /v2/accounts/{account_sid}/legs/{leg_sid}/actions/start_stream
{ "direction": "bidirectional", "url": "wss://bot.example.com/stream", "content_type": "audio/x-mulaw;rate=8000" }
```

```http
# Play a short greeting simultaneously
POST /v2/accounts/{account_sid}/legs/{leg_sid}/actions/start_say
{ "text": "Please hold while I connect you.", "loop": 0 }
```

Or use a WAV file instead of TTS:

```http
POST /v2/accounts/{account_sid}/legs/{leg_sid}/actions/start_play
{ "url": "https://example.com/hold-tone.wav", "loop": 0 }
```

**Step 3 — Stop greeting on `stream_started`**

```http
POST /v2/accounts/{account_sid}/legs/{leg_sid}/actions/stop_say
```

:::tip
Keep greeting audio to **200–500 ms**. Stop `say`/`play` immediately on `stream_started` for a seamless transition.
:::

### When to use each approach

| Scenario | Approach |
|----------|----------|
| Bot-first / IVR journey | A |
| Outbound sales / collections | B |
| Contact centre simulation | B |
| Tech support (bot only) | A |

---

## VoiceBot Applet configuration

Used when the Voicebot Applet is placed inside an Exotel flow (dashboard or ExoML).

| # | Parameter | Required | Description |
|---|-----------|----------|-------------|
| 1 | **URL** | Yes | `wss://bot.example.com/stream` — or an `https://` URL that returns `{"url":"wss://..."}` for dynamic routing |
| 2 | **Authentication** | No | IP whitelist (email hello@exotel.com) or Basic auth header |
| 3 | **Sample Rate** | No | `8000` (default) · `16000` (recommended for ASR) · `24000`. Append `?sample-rate=16000` to URL |
| 4 | **Custom Parameters** | No | Up to 3 key-value pairs in URL. Max 256 chars total. Arrive in the `start` event. |
| 5 | **Record** | No | Generates recording URL in the subsequent Passthru applet |
| 6 | **Next Applet** | No | Stream closes automatically — no explicit Stop applet needed |

---

## WebSocket protocol

### Event flow

```
Call answered
    ↓
Exotel sends → connected
Exotel sends → start          (once — metadata)
Exotel sends → media          (every ~100 ms — caller audio)
You send     → media          (your bot's audio)
Exotel sends → mark           (your audio finished playing)
Exotel sends → dtmf           (caller pressed a key)
Exotel sends → stop           (call ended)
```

:::warning 10-second timeout
Exotel drops the session if your server doesn't complete the WebSocket handshake within **10 seconds**.
:::

---

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
    "stream_sid":  "MZxxxxxxxxxxxxxxxxxxxxxxxx",
    "call_sid":    "CAxxxxxxxxxxxxxxxxxxxxxxxx",
    "account_sid": "ACxxxxxxxxxxxxxxxxxxxxxxxx",
    "from": "+919876543210",
    "to":   "+918047491899",
    "custom_parameters": { "key1": "value1", "key2": "value2" },
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

Sent when audio you previously sent has finished playing.

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
    "call_sid":    "CAxxxxxxxxxxxxxxxxxxxxxxxx",
    "account_sid": "ACxxxxxxxxxxxxxxxxxxxxxxxx",
    "reason": "callended"
  }
}
```

`reason`: `stopped` (applet ended) · `callended` (caller hung up)

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

#### `mark` — tag a playback position

Receive a matching `mark` event when that position finishes playing.

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
Send `clear` the moment caller speech is detected mid-response. Use small outgoing chunks (≤ 640 bytes) to minimise how much audio is flushed.
:::

---

### Event field reference

| Field | Type | Notes |
|-------|------|-------|
| `event` | string | `connected` · `start` · `media` · `dtmf` · `mark` · `stop` · `clear` |
| `stream_sid` | string | Unique session ID — log this |
| `sequence_number` | string | Monotonically increasing; detect gaps/drops |
| `start.call_sid` | string | Correlate with status callbacks |
| `start.custom_parameters` | object | Key-value pairs from applet URL |
| `media.payload` | string | Base64 raw PCM |
| `media.chunk` | number | Chunk index within session |
| `media.timestamp` | string | ms since stream start |
| `stop.reason` | string | `stopped` or `callended` |
| `dtmf.digit` | string | `0–9`, `*`, `#` |
| `dtmf.duration` | string | Key hold duration in ms |

---

## Audio format

| Property | Value |
|----------|-------|
| Codec | Raw PCM (linear16 / slin) — uncompressed |
| Bit depth | 16-bit signed, little-endian |
| Channels | Mono |
| Default sample rate | 8 000 Hz |
| Supported rates | 8 000 · 16 000 · 24 000 Hz |
| Transport encoding | Base64 |
| Min chunk | 3 200 bytes (100 ms @ 8 kHz) |
| Max chunk | 100 000 bytes |
| Chunk must be | A multiple of 320 bytes |

:::note Why 320-byte multiples?
320 bytes = 20 ms @ 8 kHz, 16-bit mono. Non-compliant sizes cause 20 ms gaps or audio distortion.
:::

---

## Passthru Applet

Place the Passthru Applet **immediately after** the Voicebot/Stream applet. After the stream ends, Exotel POSTs stream metadata to your callback URL.

### Passthru POST fields

| Field | Description |
|-------|-------------|
| `streamsid` | Stream session ID |
| `streamurl` | The `wss://` URL used |
| `status` | Final stream status |
| `duration` | Stream duration in seconds |
| `recordingurl` | Recording link (if recording was enabled) |
| `error` | Error detail string (treat as opaque; copy for support) |
| `disposition` | Outcome classification |
| `disconnectedby` | `caller` · `bot` · `system` |
| `detailedstatus` | Fine-grained status indicator |
| `callsid` | Parent call SID |
| `legs` | Present when Legs API was used |
| `dialcallstatus` | Final dial status (after escalation) |
| `dialwhomnumber` | Escalation target number |

### Implementation notes

- Make your handler **idempotent** — Exotel may retry on non-200 responses.
- Respond with **HTTP 200** immediately; process async.
- Use `disconnectedby` to classify outcomes: `caller` = normal hang-up, `bot` = bot-initiated, `system` = infrastructure error.
- Trigger fallback logic based on `detailedstatus` or `error`.
- Never log credentials embedded in `streamurl`.

---

## Active Stream Monitoring API

Query how many AgentStream sessions are live on your account right now.

**`GET /v1/accounts/{account_sid}/activestreams`**

| Region | Base URL |
|--------|----------|
| Mumbai | `https://api.in.exotel.com` |
| Singapore | `https://api.exotel.com` |

**Auth:** HTTP Basic (API key : API token).

### Request

```bash
curl -X GET \
  'https://<api_key>:<api_token>@api.in.exotel.com/v1/accounts/<account_sid>/activestreams'
```

### Response

```json
{
  "status": "success",
  "active_streams": 12,
  "max_allowed_streams": 100,
  "account_sid": "<account_sid>"
}
```

| Field | Description |
|-------|-------------|
| `active_streams` | Currently live sessions |
| `max_allowed_streams` | Account concurrency limit |
| `account_sid` | Your account identifier |

:::tip
Poll this endpoint to detect concurrency spikes before they cause dropped sessions. Alert when `active_streams / max_allowed_streams > 0.8`.
:::

---

## WSS errors and handling

Errors surface in two places — WebSocket close codes and the Passthru `error` / `detailedstatus` fields.

### WebSocket close codes

| Code | Meaning | Common causes |
|------|---------|---------------|
| `1000` | Normal closure | Clean disconnect |
| `1001` | Endpoint going away | Server restart, deploy |
| `1002–1003` | Protocol / data type error | Malformed frames |
| `1006` | Abnormal closure (no close frame) | Network drop, TLS failure, LB idle timeout, server crash |
| `1007–1009` | Payload / policy / size violation | Chunk size out of bounds |
| `1011` | Server error | Unhandled exception in your handler |
| `1012–1013` | Restart / retry | Transient infrastructure |

:::warning Code 1006 is the most common
Always validate: WSS URL reachability, TLS certificate validity, firewall rules, and server cold-start time before investigating further.
:::

### Diagnostic checklist by symptom

| Symptom | Check |
|---------|-------|
| Won't connect at all | URL, DNS, TLS cert, firewall, IP allowlist |
| Connects then drops during setup | Cold start latency, CPU, proxy timeout (< 10 s) |
| Drops after first `start`/`media` | Auth headers, WebSocket upgrade path, edge rate limits |
| Random mid-call drops | Back-pressure, event loop blocking, application latency |

### General best practices

- Log `callsid`, `streamsid`, close code, and the full `error` string for every session.
- Correlate close codes with `disconnectedby` and `detailedstatus` from the Passthru POST.
- If `status` and `error` appear inconsistent in the callback, trust `error`.
- Make Passthru handlers idempotent — deduplicate on `callsid` + `streamsid`.

---

## Quick start — Echo server

A minimal Python server that reflects caller audio back. Use it to confirm your setup end-to-end before adding ASR/TTS.

```python
import asyncio, json, websockets

async def handle(ws):
    stream_sid = None
    async for msg in ws:
        ev = json.loads(msg)
        match ev["event"]:
            case "start":
                stream_sid = ev["start"]["stream_sid"]
                print(f"▶ started  stream={stream_sid}  call={ev['start']['call_sid']}")
            case "media":
                await ws.send(json.dumps({
                    "event": "media",
                    "stream_sid": stream_sid,
                    "media": {"payload": ev["media"]["payload"]}
                }))
            case "dtmf":
                print(f"✱ DTMF: {ev['dtmf']['digit']}")
            case "stop":
                print(f"■ stopped  reason={ev['stop']['reason']}")
                break

async def main():
    async with websockets.serve(handle, "0.0.0.0", 5001):
        print("Listening on :5001")
        await asyncio.Future()

asyncio.run(main())
```

For local testing:

```bash
pip install websockets
ngrok http 5001
# Use the https:// URL — Exotel resolves it to wss:// automatically
```

---

## Production checklist

- [ ] Endpoint uses `wss://` (TLS). Plain `ws://` not supported in production.
- [ ] WebSocket handshake completes within **10 seconds** of call answer.
- [ ] Outgoing audio chunks are multiples of **320 bytes** (max 100 KB).
- [ ] `clear` sent on user interruption — barge-in works correctly.
- [ ] `mark` used to track exact playback position.
- [ ] `sample_rate` in applet URL matches ASR/TTS backend rate.
- [ ] `stream_sid` and `call_sid` logged for every session.
- [ ] Async WebSocket server used (asyncio / Node.js / Go goroutines).
- [ ] Passthru handler responds **HTTP 200** immediately; processes async.
- [ ] Passthru handler is **idempotent** (handles retries without side effects).
- [ ] Active streams monitored — alert at ≥ 80 % of `max_allowed_streams`.
- [ ] `streamurl` total length (including query params) is under **600 chars**.

---

## Related

- [Stream & Voicebot Applet](./stream-voicebot-applet) — Full applet reference and all event field details
- [Bot Stream with Legs API](./bot-stream-legs-api) — Legs API programmatic call control
- [Passthru Applet](./passthru-applet) — Passthru applet configuration
- [AgentStream Overview](./overview) — Platform capabilities at a glance
