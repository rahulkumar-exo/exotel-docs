---
id: developer-guide
title: AgentStream
description: Complete developer reference for Exotel AgentStream — three connection methods, WebSocket protocol, audio spec, Passthru Applet, stream monitoring, and WSS error handling.
sidebar_label: AgentStream
slug: /agentstream/developer-guide
sidebar_position: 3
---

# AgentStream

Real-time, bidirectional audio between live phone calls and your bot server over WebSocket. Exotel manages PSTN — you own the logic.

---

## How it works

```
Caller ──► Exophone (PSTN / SIP)
                  │
       Exotel infrastructure
                  │
     ┌────────────▼────────────┐
     │    VoiceBot Applet      │ ◄──── wss://your-bot-server
     └────────────┬────────────┘
                  │  (after stream ends)
     ┌────────────▼────────────┐
     │    Passthru Applet      │ ──POST──► your-callback-url
     └─────────────────────────┘
```

**Call lifecycle**

| Phase | What happens |
|-------|-------------|
| Call answered | Exotel opens WebSocket to your `wss://` endpoint |
| `connected` | WebSocket handshake confirmed |
| `start` | One-time session metadata — call SID, custom params, audio format |
| `media` _(loop)_ | ~100 ms PCM audio chunks flow both ways |
| `stop` | Call ended; socket closed |
| Passthru POST | Stream outcome + metadata posted to your callback URL |

**Limits**

| Constraint | Value |
|-----------|-------|
| Max session duration | 60 minutes |
| Handshake timeout | 10 seconds (one automatic retry) |
| Max custom URL params | 3 key-value pairs, ≤ 256 chars total |
| Max `streamurl` length | 600 characters (including query string) |
| Max `streamname` | 32 characters |

---

## Three ways to connect

| | Method | Bot URL configured in | Best for |
|--|--------|----------------------|----------|
| **1** | [Connect Voice AI](#1-connect-voice-ai) | API request (`streamurl`) | Direct outbound bot calls — no dashboard flow needed |
| **2** | [Connect Voice API with Flow](#2-connect-voice-api-with-flow) | Inside the Exotel flow | Flows with IVR menus, greetings, DTMF collection, agent handoff |
| **3** | [Programmable Voice APIs (ExoML)](#3-programmable-voice-apis-exoml) | API request (Legs API) | Full per-call control — dynamic stream URLs, greeting + stream in parallel |

All three result in the same WebSocket session described in [WebSocket Protocol](#websocket-protocol).

---

## 1. Connect Voice AI

One API call — Exotel dials a number and connects the answered call directly to your bot's WebSocket endpoint.

### Endpoint

```
POST /v1/accounts/{account_sid}/calls/connect
```

| Region | Base URL |
|--------|----------|
| Mumbai | `https://api.in.exotel.com` |
| Singapore | `https://api.exotel.com` |

**Auth:** HTTP Basic — API key as username, API token as password.

### Parameters

**Required**

| Parameter | Type | Description |
|-----------|------|-------------|
| `from` | string | Number to dial — E.164 format (`+919876543210`) |
| `callerid` | string | Your Exophone shown as caller ID |
| `streamurl` | string | Bot WebSocket URL — must start with `ws://` or `wss://` |
| `streamtype` | string | Must be `bidirectional` |

**Optional**

| Parameter | Type | Description |
|-----------|------|-------------|
| `record` | boolean | Record the call (default: `false`) |
| `recordingchannels` | string | `single` (merged audio) or `dual` (separate tracks) |
| `timelimit` | integer | Max call duration in seconds — max `14400` |
| `customfield` | string | Tracking metadata — max 128 chars |
| `statuscallback` | string | Webhook URL for call status events |
| `statuscallbackevents[]` | string | `answered` · `terminal` · `ringing` |
| `streamname` | string | Label for the stream — max 32 chars |

### Request

```bash
curl -X POST \
  'https://<api_key>:<api_token>@api.in.exotel.com/v1/accounts/<account_sid>/calls/connect' \
  -F 'from=+919876543210' \
  -F 'callerid=08047491899' \
  -F 'streamurl=wss://bot.example.com/media?sample_rate=16000' \
  -F 'streamtype=bidirectional' \
  -F 'record=true' \
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

**Call status values**

| Status | Meaning |
|--------|---------|
| `queued` | Call is being prepared |
| `in-progress` | Call is active |
| `completed` | Call ended normally |
| `failed` | Could not place call |
| `busy` | Number was busy |
| `no-answer` | No response within timeout |

---

## 2. Connect Voice API with Flow

Exotel dials a number and the answered call enters a pre-built Exotel flow. The flow handles greetings, IVR menus, DTMF collection, and routing — and eventually a Voicebot or Stream applet inside the flow opens the WebSocket connection to your bot.

### Endpoint

Same as above:

```
POST /v1/accounts/{account_sid}/calls/connect
```

### Parameters

**Required**

| Parameter | Type | Description |
|-----------|------|-------------|
| `from` | string | Number to dial — E.164 format |
| `callerid` | string | Your Exophone |
| `url` | string | Flow URL: `https://my.exotel.com/{account_sid}/exoml/start_voice/{flow_id}` |

**Optional**

| Parameter | Type | Description |
|-----------|------|-------------|
| `calltype` | string | `trans` for transactional calls |
| `timelimit` | integer | Max duration in seconds — max `14400` |
| `timeout` | integer | Ring timeout in seconds |
| `statuscallback` | string | Webhook URL for status events |
| `statuscallbackevents` | string | `terminal` · `answered` · `both` |
| `customfield` | string | Passed into your flow via the Passthru applet |

:::note
Do **not** pass `streamurl` or `streamtype` in this request — the WebSocket URL is configured inside the flow's Voicebot/Stream applet.
:::

### Request

```bash
curl -X POST \
  'https://<api_key>:<api_token>@api.in.exotel.com/v1/accounts/<account_sid>/calls/connect' \
  -d 'from=+919876543210' \
  -d 'callerid=08047491899' \
  -d 'url=https://my.exotel.com/<account_sid>/exoml/start_voice/<flow_id>' \
  -d 'statuscallback=https://your-server.com/callback' \
  -d 'statuscallbackevents=terminal'
```

### Response

Same shape as [Connect Voice AI response](#response).

### Flow patterns

| Pattern | Applets used in flow |
|---------|---------------------|
| Compliance disclosure → bot | Play → Voicebot |
| IVR menu → bot | Gather (DTMF) → Voicebot |
| Bot → human escalation | Voicebot → Transfer |
| Bot → external system handoff | Voicebot → Passthru |
| Agent assist (listen only) | Stream → agent dashboard |

---

## 3. Programmable Voice APIs (ExoML)

Full programmatic control via the **Legs API** — create call legs, start streams, and manage greetings dynamically at runtime. No Exotel dashboard flow required.

### Prerequisites

- Account SID, API Key, API Token
- Configured Exophone for outbound calls
- gRPC endpoint to receive leg events
- Bot server deployed at a public `wss://` URL

---

### Approach A — Stream only (bot-first)

Best for: inbound IVR, tech support, any journey where the bot answers immediately.

**Step 1 — Dial the customer**

```http
POST /v2/accounts/{account_sid}/legs
Content-Type: application/json
Authorization: Basic <base64(api_key:api_token)>

{
  "contact_uri": "+919876543210",
  "exophone":    "08047491899",
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
  "direction":    "bidirectional",
  "url":          "wss://bot.example.com/stream",
  "content_type": "audio/x-mulaw;rate=8000"
}
```

---

### Approach B — Greeting + stream (eliminate dead air)

Best for: outbound sales, collections, contact centre simulation.

**Step 1** — Same as Approach A.

**Step 2 — Fire both in parallel on `leg_answered`**

```http
POST /v2/accounts/{account_sid}/legs/{leg_sid}/actions/start_stream
{
  "direction": "bidirectional",
  "url": "wss://bot.example.com/stream",
  "content_type": "audio/x-mulaw;rate=8000"
}
```

```http
POST /v2/accounts/{account_sid}/legs/{leg_sid}/actions/start_say
{ "text": "Please hold while I connect you.", "loop": 0 }
```

Or play an audio file instead of TTS:

```http
POST /v2/accounts/{account_sid}/legs/{leg_sid}/actions/start_play
{ "url": "https://example.com/hold-tone.wav", "loop": 0 }
```

**Step 3 — Stop greeting on `stream_started`**

```http
POST /v2/accounts/{account_sid}/legs/{leg_sid}/actions/stop_say
```

:::tip
Keep greeting audio to **200–500 ms**. Send `stop_say` / `stop_play` immediately upon receiving `stream_started` for a seamless handoff.
:::

### When to use each approach

| Scenario | Approach |
|----------|----------|
| Inbound IVR / bot-first | A |
| Tech support (bot only) | A |
| Outbound sales / collections | B |
| Contact centre simulation | B |

---

## VoiceBot Applet configuration

Used when the Voicebot Applet is placed inside an Exotel flow (dashboard or ExoML).

| # | Parameter | Required | Details |
|---|-----------|----------|---------|
| 1 | **URL** | Yes | `wss://bot.example.com/stream` — or an `https://` endpoint that returns `{"url":"wss://..."}` for dynamic routing per call |
| 2 | **Authentication** | No | **IP whitelist** — email hello@exotel.com for Exotel's IP ranges. Or **Basic Auth**: `Authorization: Basic base64(api_key:api_token)` header |
| 3 | **Sample Rate** | No | `8000` (default, PSTN quality) · `16000` (recommended for ASR) · `24000` (HD). Append as query param: `?sample-rate=16000` |
| 4 | **Custom Parameters** | No | Up to 3 key-value pairs appended to the URL. Max 256 chars total. Values arrive in the `start` event's `custom_parameters` object. |
| 5 | **Record** | No | Enables call recording; generates a recording URL in the subsequent Passthru applet |
| 6 | **Next Applet** | No | Stream closes automatically before the next applet runs — no explicit Stop applet needed |

---

## WebSocket protocol

### Connection lifecycle

```
Call answered
    │
    ├── Exotel → connected          (WebSocket handshake done)
    ├── Exotel → start              (once — call + session metadata)
    ├── Exotel → media              (every ~100 ms — caller audio)
    ├── You    → media              (your bot's audio response)
    ├── Exotel → mark               (confirms your audio finished playing)
    ├── Exotel → dtmf               (caller pressed a key)
    └── Exotel → stop               (call ended — socket closes)
```

:::warning Handshake timeout
Exotel drops the session if your server doesn't complete the WebSocket handshake within **10 seconds**. One automatic retry is attempted before the session is abandoned.
:::

---

### Events: Exotel → your server

#### `connected`

Sent immediately after the WebSocket handshake.

```json
{ "event": "connected" }
```

---

#### `start`

Sent **once**, before any audio. Contains full session context.

```json
{
  "event": "start",
  "sequence_number": "1",
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxx",
  "start": {
    "stream_sid":  "MZxxxxxxxxxxxxxxxxxxxxxxxx",
    "call_sid":    "CAxxxxxxxxxxxxxxxxxxxxxxxx",
    "account_sid": "ACxxxxxxxxxxxxxxxxxxxxxxxx",
    "from": "+919876543210",
    "to":   "+918047491899",
    "custom_parameters": {
      "session_type": "support",
      "agent_id": "42"
    },
    "media_format": {
      "encoding":    "audio/x-raw",
      "sample_rate": "8000",
      "bit_rate":    "16"
    }
  }
}
```

---

#### `media`

An audio chunk from the caller, arriving every ~100 ms.

```json
{
  "event": "media",
  "sequence_number": "3",
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxx",
  "media": {
    "chunk":     "2",
    "timestamp": "200",
    "payload":   "<base64-encoded PCM>"
  }
}
```

---

#### `dtmf` _(bidirectional only)_

A keypress from the caller.

```json
{
  "event": "dtmf",
  "sequence_number": "7",
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxx",
  "dtmf": {
    "digit":    "5",
    "duration": "100"
  }
}
```

---

#### `mark`

Sent when a chunk of audio you previously sent has **finished playing** to the caller.

```json
{
  "event": "mark",
  "sequence_number": "15",
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxx",
  "mark": { "name": "turn-3-end" }
}
```

---

#### `stop`

Sent when the call ends or the stream is closed.

```json
{
  "event": "stop",
  "sequence_number": "20",
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxx",
  "stop": {
    "call_sid":    "CAxxxxxxxxxxxxxxxxxxxxxxxx",
    "account_sid": "ACxxxxxxxxxxxxxxxxxxxxxxxx",
    "reason":      "callended"
  }
}
```

| `reason` value | Meaning |
|---------------|---------|
| `stopped` | Applet ended (next applet in flow ran) |
| `callended` | Caller or bot hung up |

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

---

#### `mark` — tag a playback position

Exotel echoes this back as an incoming `mark` event once that audio finishes playing. Use it for precise interruption timing.

```json
{
  "event": "mark",
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxx",
  "mark": { "name": "turn-3-end" }
}
```

---

#### `clear` — flush buffered audio

Removes all queued, unplayed audio from Exotel's buffer. Send this when the caller starts speaking mid-response (barge-in).

```json
{ "event": "clear", "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxx" }
```

:::tip Barge-in
Send `clear` as soon as you detect caller speech. Send outgoing audio in small chunks (≤ 640 bytes) so the buffer drains faster on interruption.
:::

---

### Event field reference

| Field | Type | Description |
|-------|------|-------------|
| `event` | string | `connected` · `start` · `media` · `dtmf` · `mark` · `stop` · `clear` |
| `stream_sid` | string | Unique stream session ID — always log this |
| `sequence_number` | string | Monotonically increasing; use to detect dropped frames |
| `start.call_sid` | string | Parent call ID — correlate with status callbacks |
| `start.from` / `start.to` | string | Caller and called numbers |
| `start.custom_parameters` | object | Key-value pairs from applet URL |
| `start.media_format.sample_rate` | string | Negotiated sample rate for the session |
| `media.payload` | string | Base64-encoded raw PCM audio |
| `media.chunk` | string | Chunk index within the session |
| `media.timestamp` | string | Milliseconds since stream start |
| `stop.reason` | string | `stopped` or `callended` |
| `dtmf.digit` | string | `0–9` · `*` · `#` |
| `dtmf.duration` | string | Key hold duration in ms |

---

## Audio format

| Property | Value |
|----------|-------|
| Codec | Raw PCM / linear16 (slin) — uncompressed |
| Bit depth | 16-bit signed, little-endian |
| Channels | Mono |
| Default sample rate | 8 000 Hz |
| Supported sample rates | 8 000 · 16 000 · 24 000 Hz |
| Transport encoding | Base64 |
| Min chunk size | 3 200 bytes — 100 ms @ 8 kHz |
| Max chunk size | 100 000 bytes |
| Chunk size must be | A multiple of **320 bytes** |

:::note Why 320-byte multiples?
320 bytes = 20 ms of audio @ 8 kHz, 16-bit mono. Non-compliant sizes introduce 20 ms gaps or audio distortion.
:::

**Setting sample rate**

Append `?sample-rate=<rate>` to the applet URL or `streamurl`:

```
wss://bot.example.com/stream?sample-rate=16000
```

---

## Passthru Applet

Place the Passthru Applet **immediately after** the Voicebot or Stream applet in your flow. When the stream ends, Exotel POSTs session metadata to your callback URL.

### Callback POST fields

| Field | Type | Description |
|-------|------|-------------|
| `callsid` | string | Parent call identifier |
| `streamsid` | string | Stream session identifier |
| `streamurl` | string | The `wss://` URL used for the session |
| `status` | string | Final stream status |
| `duration` | integer | Stream duration in seconds |
| `recordingurl` | string | Recording link — present if recording was enabled |
| `error` | string | Error detail string; treat as opaque — copy full value for support |
| `disposition` | string | Outcome classification |
| `disconnectedby` | string | `caller` · `bot` · `system` |
| `detailedstatus` | string | Fine-grained status indicator |
| `legs` | object | Present when Legs API was used |
| `dialcallstatus` | string | Final dial status (after transfer/escalation) |
| `dialwhomnumber` | string | Escalation target number |

### Interpreting `disconnectedby`

| Value | Meaning |
|-------|---------|
| `caller` | Caller hung up normally |
| `bot` | Bot closed the WebSocket |
| `system` | Infrastructure error or session timeout |

### Implementation requirements

- Respond **HTTP 200** immediately — process async.
- Make your handler **idempotent** — Exotel retries on non-200. Deduplicate on `callsid` + `streamsid`.
- If `status` and `error` appear inconsistent, **trust `error`**.
- Use `detailedstatus` to trigger fallback routing logic.
- Never log credentials embedded in `streamurl`.

### Deployment approach

| Phase | Action |
|-------|--------|
| Dev | Validate handler with mock payloads |
| QA / Staging | Test with real calls; verify all field values |
| Canary | Roll out gradually; watch error rates |
| Production | Expand; keep rollback path ready |

---

## Active Stream Monitoring API

Query how many AgentStream sessions are live on your account right now.

### Endpoint

```
GET /v1/accounts/{account_sid}/activestreams
```

| Region | Base URL |
|--------|----------|
| Mumbai | `https://api.in.exotel.com` |
| Singapore | `https://api.exotel.com` |

**Auth:** HTTP Basic — API key as username, API token as password.

Find your credentials at `https://my.exotel.com/apisettings/site#api-credentials`.

### Request

```bash
curl -X GET \
  'https://<api_key>:<api_token>@api.in.exotel.com/v1/accounts/<account_sid>/activestreams'
```

### Response

```json
{
  "status":              "success",
  "active_streams":      12,
  "max_allowed_streams": 100,
  "account_sid":         "<account_sid>"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | `success` or error indicator |
| `active_streams` | integer | Currently live sessions |
| `max_allowed_streams` | integer | Account concurrency limit |
| `account_sid` | string | Your account identifier |

:::tip Capacity alerting
Alert when `active_streams / max_allowed_streams ≥ 0.8` to avoid hitting the concurrency limit mid-call.
:::

---

## WSS errors and handling

Errors surface in two independent places — always correlate both using `callsid`.

| Source | What it contains |
|--------|-----------------|
| WebSocket close code | RFC 6455 code when socket terminates |
| Passthru `error` + `detailedstatus` | Application-level stream outcome |

### WebSocket close codes

| Code | Meaning | Common causes |
|------|---------|---------------|
| `1000` | Normal closure | Clean disconnect |
| `1001` | Endpoint going away | Server restart, redeploy |
| `1002` | Protocol error | Malformed WebSocket frame |
| `1003` | Unsupported data type | Non-binary/text frame format mismatch |
| `1006` | Abnormal closure (no close frame) | Network drop · TLS failure · LB idle timeout · server crash |
| `1007` | Invalid payload data | Frame encoding violation |
| `1008` | Policy violation | Auth failure or edge rate limit |
| `1009` | Message too large | Chunk exceeded max size |
| `1011` | Server error | Unhandled exception in your handler |
| `1012` | Service restart | Transient infrastructure — retry |
| `1013` | Try again later | Temporary overload |

:::warning Code 1006 is the most common error
Before anything else: check WSS URL reachability, TLS certificate validity, firewall rules, and server cold-start time.
:::

### Diagnose by symptom

| Symptom | Check |
|---------|-------|
| Never connects | URL accessible? DNS resolves? TLS cert valid? Firewall allows Exotel IPs? |
| Connects, drops during setup | Cold start > 10 s? Proxy timeout? CPU spike on boot? |
| Drops immediately after `start` | Auth headers correct? WebSocket upgrade path working? Edge rate limits? |
| Random mid-call drops | Event loop blocked? Back-pressure from ASR/TTS? Audio chunk sizes compliant? |
| `1006` with no pattern | Enable LB keep-alive; check idle connection timeout settings |

### Callback error handling

- Copy the full `error` string — do not try to parse it; value is opaque and changes.
- Correlate `stream error` with `status`, `disconnectedby`, and `disposition` in the Passthru POST.
- If values appear inconsistent, `error` is the authoritative signal.
- Log: `callsid`, `streamsid`, close code, `error`, `detailedstatus`.

---

## Quick start — Echo server

Reflects caller audio back verbatim. Use it to verify your WebSocket setup before integrating ASR/TTS.

```python
import asyncio, json, websockets

async def handle(ws):
    stream_sid = None

    async for msg in ws:
        ev = json.loads(msg)

        match ev["event"]:
            case "connected":
                print("connected")

            case "start":
                stream_sid = ev["start"]["stream_sid"]
                call_sid   = ev["start"]["call_sid"]
                params     = ev["start"].get("custom_parameters", {})
                print(f"start  stream={stream_sid}  call={call_sid}  params={params}")

            case "media":
                # Echo audio back to the caller
                await ws.send(json.dumps({
                    "event": "media",
                    "stream_sid": stream_sid,
                    "media": {"payload": ev["media"]["payload"]}
                }))

            case "dtmf":
                print(f"dtmf  digit={ev['dtmf']['digit']}")

            case "stop":
                print(f"stop  reason={ev['stop']['reason']}")
                break

async def main():
    async with websockets.serve(handle, "0.0.0.0", 5001):
        print("Listening on :5001")
        await asyncio.Future()

asyncio.run(main())
```

**Run it locally**

```bash
pip install websockets
python echo.py

# Expose publicly (Exotel requires a reachable URL)
ngrok http 5001
# Paste the https:// URL into streamurl — Exotel resolves it to wss:// automatically
```

---

## Production checklist

**Connection**
- [ ] Endpoint uses `wss://` with a valid TLS certificate
- [ ] WebSocket handshake completes within **10 seconds**
- [ ] Exotel's IP ranges are allowlisted if using IP whitelisting

**Audio**
- [ ] Outgoing chunks are multiples of **320 bytes** (3 200–100 000 bytes)
- [ ] `sample_rate` in applet URL matches ASR/TTS backend rate
- [ ] Outgoing chunks are ≤ 640 bytes for responsive barge-in

**Session handling**
- [ ] `stream_sid` and `call_sid` logged for every session
- [ ] `clear` sent on user interruption; barge-in tested
- [ ] `mark` used to track exact playback position
- [ ] `stop` event handled gracefully; resources cleaned up

**Passthru & callbacks**
- [ ] Passthru applet placed immediately after Voicebot/Stream applet
- [ ] Callback handler returns **HTTP 200** immediately; processes async
- [ ] Callback handler is **idempotent** — deduplicates on `callsid` + `streamsid`
- [ ] `disconnectedby` used to classify session outcomes

**Scale**
- [ ] Async WebSocket server used (asyncio / Node.js / Go goroutines)
- [ ] Active streams monitored — alert at ≥ 80% of `max_allowed_streams`
- [ ] `streamurl` total length ≤ **600 characters**
- [ ] Session duration ≤ **60 minutes** accounted for in flow design

---

## Related

- [Stream & Voicebot Applet](./stream-voicebot-applet) — Full applet reference and event field details
- [Bot Stream with Legs API](./bot-stream-legs-api) — Legs API programmatic call control
- [Passthru Applet](./passthru-applet) — Passthru applet configuration reference
- [AgentStream Overview](./overview) — Platform capabilities at a glance
