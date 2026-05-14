---
id: developer-guide
title: AgentStream Developer Guide
description: A complete technical reference for building real-time voice bots and streaming applications with Exotel AgentStream — WebSocket protocol, audio format, code examples, and Programmable API.
sidebar_label: Developer Guide
slug: /agentstream/developer-guide
sidebar_position: 3
---

# AgentStream Developer Guide

Exotel AgentStream lets you stream real-time audio from a live phone call directly to your server over a persistent WebSocket connection. Your server receives raw PCM audio as the caller speaks and — for bidirectional streams — can send audio back to be played to the caller with minimal latency.

No recording, no polling, no batching. Every 100 ms of audio arrives as a single WebSocket frame.

---

## How it works

```
Caller → Exophone (PSTN / SIP)
              │
    Exotel infrastructure
              │
    VoiceBot Applet (WSS) ◄──────► Your bot server
                                         │
                               LLM / ASR / TTS / custom logic
```

When a call is answered, Exotel opens a WebSocket connection to **your** URL. From that point:

- Every ~100 ms of caller audio arrives as a base64-encoded PCM frame (`media` event).
- You can send `media` events back on the same socket — Exotel plays them out to the caller.
- When the call ends, Exotel sends a `stop` event and closes the socket.

---

## Applet types

| Applet | Direction | Best for |
|--------|-----------|----------|
| **Stream Applet** | Exotel → Your server | Live transcription, agent assist, call monitoring |
| **Voicebot Applet** | Exotel ↔ Your server | Conversational AI, IVR replacement, outbound bots |

---

## Voicebot Applet — configuration

Configure via the Exotel dashboard or ExoML. Six parameters:

| # | Parameter | Required | Description |
|---|-----------|----------|-------------|
| 1 | **URL** | Yes | Your `wss://` endpoint. Or an `https://` URL that returns `{"url": "wss://..."}` for dynamic routing. |
| 2 | **Authentication** | No | **IP whitelist** (email hello@exotel.com for Exotel IP ranges), or **Basic auth**: pass `Authorization: Basic base64(api_key:api_token)` in the WebSocket headers. |
| 3 | **Sample Rate** | No | `8000` (default, PSTN quality), `16000` (recommended for ASR), `24000` (HD). Append as query param: `?sample-rate=16000` |
| 4 | **Custom Parameters** | No | Up to 3 key-value pairs appended to the URL: `?session_type=support&agent_id=42`. Max 256 chars total. Arrive in the `start` event. |
| 5 | **Record** | No | Enable to generate a recording URL in the subsequent Passthru applet. |
| 6 | **Next Applet** | No | The stream auto-closes before the next applet executes — no explicit Stop applet needed. |

---

## WebSocket protocol reference

### Connection lifecycle

```
Call answered
    │
    ▼
Exotel opens WebSocket → YOUR_WSS_URL
    │
    ├─ Exotel sends: connected
    ├─ Exotel sends: start       ← one-time session metadata
    ├─ Exotel sends: media       ← repeating, ~100ms per chunk
    ├─ You send:     media       ← your bot's audio (bidirectional only)
    ├─ Exotel sends: mark        ← confirms your audio finished playing
    └─ Exotel sends: stop        ← call ended
```

:::warning 10-second timeout
If your server does not respond to the WebSocket handshake within **10 seconds**, Exotel drops the session.
:::

---

### Events: Exotel → Your server

#### `connected`

Sent immediately after the WebSocket handshake. No payload.

```json
{
  "event": "connected"
}
```

#### `start`

Sent once, before any audio. Contains call context and your custom parameters.

```json
{
  "event": "start",
  "sequence_number": 1,
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "start": {
    "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "call_sid": "CAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "account_sid": "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "from": "+918012345678",
    "to": "+918047491899",
    "custom_parameters": {
      "session_type": "support",
      "agent_id": "42"
    },
    "media_format": {
      "encoding": "audio/x-raw",
      "sample_rate": "8000",
      "bit_rate": "16"
    }
  }
}
```

#### `media`

An audio chunk from the caller. Arrives roughly every 100 ms.

```json
{
  "event": "media",
  "sequence_number": 3,
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "media": {
    "chunk": 2,
    "timestamp": "200",
    "payload": "<base64-encoded PCM>"
  }
}
```

#### `dtmf` _(bidirectional only)_

A keypress from the caller.

```json
{
  "event": "dtmf",
  "sequence_number": 7,
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "dtmf": {
    "digit": "5",
    "duration": "100"
  }
}
```

#### `mark`

Confirmation that a chunk of audio you sent has **finished playing** to the caller.

```json
{
  "event": "mark",
  "sequence_number": 15,
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "mark": {
    "name": "my-label"
  }
}
```

#### `stop`

Sent when the call ends or the stream is closed.

```json
{
  "event": "stop",
  "sequence_number": 20,
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "stop": {
    "call_sid": "CAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "account_sid": "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "reason": "callended"
  }
}
```

`reason` is either `"stopped"` (applet ended) or `"callended"` (caller hung up).

---

### Events: Your server → Exotel

#### `media` — Send audio to the caller

```json
{
  "event": "media",
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "media": {
    "payload": "<base64-encoded PCM>"
  }
}
```

#### `mark` — Tag a position in your audio stream

Exotel echoes this back (as an incoming `mark` event) once the labelled chunk finishes playing. Use it to know exactly when your response finished playing — useful for timing interruption handling.

```json
{
  "event": "mark",
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "mark": {
    "name": "response-turn-3"
  }
}
```

#### `clear` — Flush unplayed audio (barge-in / interruption)

Removes all queued audio from Exotel's playout buffer. Send this when the caller speaks mid-response to stop the bot from talking over them.

```json
{
  "event": "clear",
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

:::tip
`clear` only removes audio that hasn't started playing yet. Send audio in small chunks (≤ 640 bytes) so there's less buffered audio to clear when an interruption occurs.
:::

---

### Event field reference

| Field | Type | Present in | Description |
|-------|------|------------|-------------|
| `event` | string | all | Event type identifier |
| `stream_sid` | string | all except `connected` | Unique stream session ID |
| `sequence_number` | string | Exotel → server | Monotonically increasing; use to detect dropped frames |
| `start` | object | `start` | Call metadata and custom parameters |
| `media` | object | `media` | Audio payload (`chunk`, `timestamp`, `payload`) |
| `stop` | object | `stop` | Call SID, account SID, reason |
| `dtmf` | object | `dtmf` | `digit` (0–9, *, #) and `duration` (ms) |
| `mark` | object | `mark` | `name` label you set |

---

## Audio format

| Property | Value |
|----------|-------|
| Codec | Raw PCM (linear16 / slin) — no compression |
| Bit depth | 16-bit, signed, little-endian |
| Channels | Mono |
| Default sample rate | 8 000 Hz |
| Transport encoding | Base64 |
| Min chunk size | 3 200 bytes (100 ms at 8 kHz) |
| Max chunk size | 100 000 bytes |
| Chunk size constraint | Must be a multiple of 320 bytes |

:::note Why 320-byte multiples?
320 bytes = 20 ms of audio at 8 kHz, 16-bit mono. Non-compliant sizes cause 20 ms gaps or audio distortion.
:::

---

## Minimal Python echo bot

A complete working server that echoes every audio frame back to the caller:

```python
import asyncio
import json
import websockets

async def handle(websocket):
    stream_sid = None

    async for message in websocket:
        data = json.loads(message)
        event = data.get("event")

        if event == "connected":
            print("WebSocket connected")

        elif event == "start":
            stream_sid = data["start"]["stream_sid"]
            call_sid = data["start"]["call_sid"]
            custom = data["start"].get("custom_parameters", {})
            print(f"Stream started | stream={stream_sid} call={call_sid} params={custom}")

        elif event == "media":
            # Echo audio straight back to the caller
            await websocket.send(json.dumps({
                "event": "media",
                "stream_sid": stream_sid,
                "media": {"payload": data["media"]["payload"]}
            }))

        elif event == "dtmf":
            digit = data["dtmf"]["digit"]
            print(f"DTMF: {digit}")

        elif event == "stop":
            reason = data["stop"]["reason"]
            print(f"Stream stopped: {reason}")
            break

async def main():
    async with websockets.serve(handle, "0.0.0.0", 5001):
        print("Listening on wss://0.0.0.0:5001")
        await asyncio.Future()  # run forever

asyncio.run(main())
```

Your endpoint **must be publicly reachable** over `wss://`. Use [ngrok](https://ngrok.com/) for local development:

```bash
ngrok http 5001
# Use the https:// URL shown — Exotel accepts https:// and resolves it to wss://
```

---

## Triggering streams via Programmable API

Use this approach when you want to initiate calls programmatically — outbound campaigns, click-to-call, or custom IVR flows — without configuring an ExoML applet in the dashboard.

### Prerequisites

- Exotel Account SID, API Key, API Token
- A configured Exophone for outbound calls
- A gRPC endpoint to receive leg events (e.g., `leg_answered`)
- Your WebSocket bot server deployed at a public `wss://` URL

### Approach 1 — Bot-first (stream only)

Best for inbound IVR, tech support bots, and any flow where the bot answers immediately.

**Step 1: Dial the customer**

```http
POST https://api.in.exotel.com/v2/accounts/{account_sid}/legs
Content-Type: application/json
Authorization: Basic <base64(api_key:api_token)>

{
  "contact_uri": "07400000000",
  "exophone": "02040000000",
  "leg_event_endpoint": "grpc://your-event-server.example.com",
  "timeout": 30
}
```

**Step 2: Start the stream when the call is answered**

Listen for `leg_answered` on your gRPC endpoint, then:

```http
POST https://api.in.exotel.com/v2/accounts/{account_sid}/legs/{leg_sid}/actions/start_stream
Content-Type: application/json
Authorization: Basic <base64(api_key:api_token)>

{
  "direction": "bidirectional",
  "url": "wss://bot.example.com/stream",
  "content_type": "audio/x-mulaw;rate=8000"
}
```

---

### Approach 2 — Greeting + stream (eliminate dead air)

Best for outbound sales, collections, and contact centre simulations where callers shouldn't hear silence while your bot initialises.

**Step 1**: Same as Approach 1 — dial the customer.

**Step 2**: On `leg_answered`, fire **both** requests simultaneously:

```http
# Start the bot stream
POST .../legs/{leg_sid}/actions/start_stream
{ "direction": "bidirectional", "url": "wss://bot.example.com/stream", ... }

# Play a short greeting in parallel
POST .../legs/{leg_sid}/actions/start_say
{ "text": "Please hold while I connect you.", "loop": 0 }
```

**Step 3**: Stop the greeting as soon as your `stream_started` event arrives:

```http
POST .../legs/{leg_sid}/actions/stop_say
```

Keep the greeting audio to **200–500 ms** for a seamless transition.

---

### Which approach to use

| Scenario | Approach |
|----------|----------|
| Inbound IVR / bot-first | 1 |
| Outbound sales / collections | 2 |
| Contact centre simulation | 2 |
| Tech support (bot-only) | 1 |

---

## Production checklist

- [ ] Endpoint uses `wss://` (TLS). Plain `ws://` is not supported in production.
- [ ] Server responds to the WebSocket handshake within **10 seconds**.
- [ ] Audio chunks sent back are multiples of **320 bytes** (320–100 000 bytes per frame).
- [ ] Send `clear` on user interruption to flush buffered bot audio (barge-in).
- [ ] Use `mark` events to track exact playback position for clean interruption handling.
- [ ] Keep greeting / hold audio to **200–500 ms** to minimise perceived latency.
- [ ] Set `sample_rate` in the applet to match your ASR / TTS backend sample rate.
- [ ] Log `stream_sid` and `call_sid` for every session — essential for debugging.
- [ ] Use an **async WebSocket server** (Python asyncio, Node.js streams, Go goroutines). Synchronous handlers block the event loop and cause audio gaps.
- [ ] Buffer **200–300 ms** of outgoing audio before sending to prevent partial-frame glitches.

---

## Resources

| Resource | Description |
|----------|-------------|
| [exotel/Agent-Stream](https://github.com/exotel/Agent-Stream) | Reference server implementation |
| [exotel/Agent-Stream-echobot](https://github.com/exotel/Agent-Stream-echobot) | Full echo bot example |
| [exotel/voice-streaming](https://github.com/exotel/voice-streaming) | Simulator for testing without a real call |
| [Pipecat integration](https://docs.pipecat.ai/deployment/pipecat-cloud/guides/telephony/exotel-websocket) | Ready-made Pipecat transport layer for AgentStream |
| [Stream & Voicebot Applet reference](./stream-voicebot-applet) | Dashboard configuration and full event reference |
| [Bot Stream with Legs API](./bot-stream-legs-api) | Programmatic call control guide |
