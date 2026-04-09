---
id: stream-voicebot-applet
title: Working with the Stream and Voicebot Applet
description: Configure and use Exotel Stream Applet for unidirectional and Voicebot Applet for bidirectional real-time audio streaming over WebSockets.
sidebar_label: Stream & Voicebot Applet
slug: /agentstream/stream-voicebot-applet
sidebar_position: 4
---

# Working with the Stream and Voicebot Applet

Exotel provides real-time audio streaming via WebSockets, enabling you to build intelligent conversational bots, live transcription, call monitoring, and agent coaching solutions.

## Types of Streams

| Type | Applet | Direction | Use Case |
|------|--------|-----------|----------|
| **Unidirectional** | Stream Applet | Exotel → Your Server | Transcription, monitoring, coaching |
| **Bidirectional** | Voicebot Applet | Exotel ↔ Your Server | Conversational bots, interactive voice AI |

---

## Voicebot Applet (Bidirectional)

Bidirectional streams allow two-way flow of voice data over a WebSocket. Exotel sends the caller's voice data to your WebSocket endpoint, and your endpoint can return voice data back — which Exotel plays out to the caller in real time.

### Configuration Parameters

| # | Parameter | Description |
|---|-----------|-------------|
| 1 | **URL** | WebSocket URL (e.g., `ws://127.0.0.1:5001/media`) or an HTTPS endpoint that dynamically returns the WSS URL |
| 2 | **Authentication** | IP Whitelisting (contact hello@exotel.com) or Basic Auth: `wss://<API_KEY>:<API_TOKEN>@stream.yourdomain.com/<path>` — transmitted as `Authorization: Basic base64(API_KEY:API_TOKEN)` header |
| 3 | **Sample Rate** | `8000` (default, PSTN quality), `16000` (enhanced), or `24000` (HD). Pass as query param: `?sample-rate=16000` |
| 4 | **Custom Parameters** | Up to 3 key-value pairs appended to the URL: `?param1=value1&param2=value2` (max 256 chars total) |
| 5 | **Record** | Enable to generate a recording URL in the subsequent Passthru applet |
| 6 | **Next Applet** | The stream auto-closes before the next applet executes; no explicit Stop applet needed |

### Audio Format

All audio payloads are sent as **raw/slin (16-bit, 8kHz, mono PCM little-endian)** encoded in **base64**.

### Chunk Size Requirements

| Constraint | Value |
|-----------|-------|
| Minimum | 3.2 KB (100ms of data) |
| Maximum | 100 KB |
| Must be a multiple of | 320 bytes |

:::warning
Smaller chunks risk audio distortion. Larger chunks cause timeouts. Non-compliant sizes create gaps in audio playback.
:::

---

## WebSocket Message Protocol

### Messages FROM Exotel (Incoming)

#### Connected

Sent when the WebSocket connection is established.

```json
{
  "event": "connected"
}
```

#### Start

Contains stream metadata, call context, and any custom parameters.

```json
{
  "event": "start",
  "sequence_number": 1,
  "stream_sid": "<stream_sid>",
  "start": {
    "stream_sid": "<stream_sid>",
    "call_sid": "<call_sid>",
    "account_sid": "<account_sid>",
    "from": "+919876543210",
    "to": "+911234567890",
    "custom_parameters": {
      "key1": "value1",
      "key2": "value2"
    },
    "media_format": {
      "encoding": "raw",
      "sample_rate": "8000",
      "bit_rate": "128"
    }
  }
}
```

#### Media

Audio data packets from the caller.

```json
{
  "event": "media",
  "sequence_number": 3,
  "stream_sid": "<stream_sid>",
  "media": {
    "chunk": 2,
    "timestamp": "10",
    "payload": "<base64_encoded_audio>"
  }
}
```

#### DTMF (Bidirectional only)

Key press events from the caller.

```json
{
  "event": "dtmf",
  "sequence_number": 1,
  "stream_sid": "<stream_sid>",
  "dtmf": {
    "duration": "200",
    "digit": "5"
  }
}
```

#### Stop

Sent when the stream ends.

```json
{
  "event": "stop",
  "sequence_number": 10,
  "stream_sid": "<stream_sid>",
  "stop": {
    "call_sid": "<call_sid>",
    "account_sid": "<account_sid>",
    "reason": "stopped"
  }
}
```

`reason` values: `stopped` (applet ended) or `callended` (caller hung up).

#### Mark

Notification that a previously sent audio chunk has finished playing.

```json
{
  "event": "mark",
  "sequence_number": 15,
  "stream_sid": "<stream_sid>",
  "mark": {
    "name": "<label>"
  }
}
```

---

### Messages TO Exotel (Outgoing — Bidirectional Only)

#### Media

Send audio back to the caller (same format as incoming).

```json
{
  "event": "media",
  "stream_sid": "<stream_sid>",
  "media": {
    "payload": "<base64_encoded_audio>"
  }
}
```

#### Mark

Request a notification when your audio finishes playing.

```json
{
  "event": "mark",
  "stream_sid": "<stream_sid>",
  "mark": {
    "name": "my-label"
  }
}
```

#### Clear

Remove all queued (unplayed) audio from the buffer. Useful for interrupting bot responses when the user speaks.

```json
{
  "event": "clear",
  "stream_sid": "<stream_sid>"
}
```

:::tip
Send audio in smaller chunks for more responsive Clear behavior — the Clear command only removes audio that hasn't started playing yet.
:::

---

### Event Field Reference

| Field | Type | JSON Key | Required | Description |
|-------|------|----------|----------|-------------|
| Event | string | `event` | Yes | `connected`, `start`, `media`, `stop`, `dtmf`, `mark`, `clear` |
| StreamSID | string | `stream_sid` | No | Unique stream session identifier |
| SequenceNumber | string | `sequence_number` | No | Ordering number for media chunks |
| Start | object | `start` | No | Present in `start` events — contains call metadata |
| Media | object | `media` | No | Present in `media` events — contains audio payload |
| Stop | object | `stop` | No | Present in `stop` events — contains reason |
| Mark | object | `mark` | No | Present in `mark` events — contains label |
| Dtmf | object | `dtmf` | No | Present in `dtmf` events — contains digit and duration |

---

## Stream Applet (Unidirectional)

The Stream Applet sends one-way audio from the call to your server. Use this for transcription, monitoring, or coaching scenarios where you don't need to send audio back.

### Configuration Parameters

| # | Parameter | Description |
|---|-----------|-------------|
| 1 | **Action** | `Start` a new stream or `Stop` an existing stream |
| 2 | **URL** | WSS endpoint or HTTPS endpoint that returns JSON: `{"url": "wss://streamhandler.yourdomain.com"}` |
| 3 | **Next Applet** | Call flow proceeds immediately after stream creation |

---

## Sample Code & Resources

| Resource | Link |
|----------|------|
| Agent Stream (reference implementation) | [github.com/exotel/Agent-Stream](https://github.com/exotel/Agent-Stream) |
| Echo Bot (bidirectional example) | [github.com/exotel/Agent-Stream-echobot](https://github.com/exotel/Agent-Stream-echobot) |
| Voice Streaming Simulator | [github.com/exotel/voice-streaming](https://github.com/exotel/voice-streaming) |

---

## Limitations

1. **Unidirectional streams** fork audio immediately; if used with a Connect applet that rings multiple agents, audio from all ringing legs is sent (manual filtering required)
2. **Maximum 3 custom parameters** in the START message
3. **Mono channel** raw audio only — your application handles speaker diarization if needed
4. Audio is **raw PCM 16-bit little-endian** at the configured sample rate — not compressed

---

## Related

- [Getting Started with AgentStream](./getting-started) — Quick guide to streaming services
- [Stream & Voicebot Extension Guide](./stream-voicebot-extension) — Updated extension with additional features
- [Passthru Applet](./passthru-applet) — Send call metadata to your server
- [AgentStream Overview](./overview) — Platform overview
