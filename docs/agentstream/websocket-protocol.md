---
id: websocket-protocol
title: AgentStream WebSocket protocol
description: Event reference for AgentStream — connected, start, media, DTMF, mark, stop, clear — plus audio format.
sidebar_label: WebSocket protocol
slug: /agentstream/websocket-protocol
sidebar_position: 7
---

# WebSocket protocol

When a call hits Stream or Voicebot, Exotel opens a WebSocket to your endpoint and streams raw PCM audio every ~100 ms. Bidirectional (Voicebot) sessions can send audio back on the same socket.

## Event support by applet

| Event | Stream (unidirectional) | Voicebot (bidirectional) |
|-------|-------------------------|--------------------------|
| `connected` | ✓ | ✓ |
| `start` | ✓ | ✓ |
| `media` (receive) | ✓ | ✓ |
| `dtmf` (receive) | ✗ | ✓ |
| `mark` (receive) | ✗ | ✓ |
| `stop` | ✓ | ✓ |
| `media` (send) | ✗ | ✓ |
| `mark` (send) | ✗ | ✓ |
| `clear` (send) | ✗ | ✓ |

## Events — Exotel → your server

### `connected`

```json
{ "event": "connected" }
```

### `start`

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

### `media`

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

### `dtmf` (Voicebot only)

```json
{
  "event": "dtmf",
  "sequence_number": "7",
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxx",
  "dtmf": { "digit": "5", "duration": "100" }
}
```

### `mark` (Voicebot only)

Sent when audio you previously sent has finished playing.

```json
{
  "event": "mark",
  "sequence_number": "15",
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxx",
  "mark": { "name": "my-label" }
}
```

### `stop`

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

## Events — your server → Exotel (Voicebot only)

### `media` — send audio to caller

```json
{
  "event": "media",
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxx",
  "media": { "payload": "<base64-encoded PCM>" }
}
```

### `mark` — tag a playback position

```json
{
  "event": "mark",
  "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxx",
  "mark": { "name": "turn-3-end" }
}
```

### `clear` — flush buffered audio (barge-in)

```json
{ "event": "clear", "stream_sid": "MZxxxxxxxxxxxxxxxxxxxxxxxx" }
```

## Audio format

| Property | Value |
|----------|-------|
| Codec | Raw PCM (linear16) — uncompressed |
| Bit depth | 16-bit signed, little-endian |
| Channels | Mono |
| Default sample rate | 8 000 Hz |
| Supported rates | 8 000 · 16 000 · 24 000 Hz |
| Transport | Base64 |
| Chunk size | 3 200–100 000 bytes, multiple of 320 |
| Max session duration | 60 minutes |

## Echo server

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

## Related

- [Stream & Voicebot applet](./stream-voicebot-applet)
- [WSS errors & monitoring](./wss-errors-monitoring)
- [Getting started](./getting-started)
