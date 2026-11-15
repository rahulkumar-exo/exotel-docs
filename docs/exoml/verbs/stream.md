---
id: stream
title: Stream
description: ExoML Stream verb — pipe live call audio to a WebSocket for real-time AI processing.
sidebar_label: Stream
sidebar_position: 8
displayed_sidebar: voiceSidebar
---

# `<Stream>` / StartStream / StopStream

Pipes live call audio to a WebSocket endpoint in real time. Used for AI transcription, voicebots, and sentiment analysis.

## StartStream

Opens a WebSocket connection and begins sending audio from the leg.

```bash
curl -u '<api_key>:<api_token>' -X POST \
  'https://cpaas-api.in.exotel.com/v2/accounts/<account_sid>/legs/<leg_sid>/actions/start_stream' \
  -H 'Content-Type: application/json' \
  -d '{
    "direction": "bidirectional",
    "url": "wss://your-ai-server.example.com/stream",
    "content_type": "audio/x-mulaw;rate=8000"
  }'
```

### Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `url` | Yes | WebSocket URL (`wss://`) to receive audio |
| `direction` | Yes | `unidirectional` (send only) or `bidirectional` (send + receive) |
| `content_type` | No | Audio format. Default: `audio/x-mulaw;rate=8000` |

### ExoML equivalent

```bash
curl -u '<api_key>:<api_token>' -X POST \
  'https://cpaas-api.in.exotel.com/v2/accounts/<account_sid>/legs/<leg_sid>/actions' \
  -H 'Content-Type: application/json' \
  -d '{
    "exoml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Flow><StartStream streamType=\"bidirectional\" url=\"wss://your-ai-server.example.com/stream\" contentType=\"audio/x-mulaw;rate=8000\"/></Flow>"
  }'
```

### StartStream XML attributes

| Attribute | Required | Description |
|-----------|----------|-------------|
| `url` | Yes | WebSocket URL |
| `streamType` | Yes | `unidirectional` or `bidirectional` |
| `contentType` | No | Audio content type (default: `audio/x-mulaw;rate=8000`) |

## StopStream

Closes the WebSocket connection and stops audio delivery.

```bash
curl -u '<api_key>:<api_token>' -X POST \
  'https://cpaas-api.in.exotel.com/v2/accounts/<account_sid>/legs/<leg_sid>/actions/stop_stream' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

## WebSocket message format

### From Exotel → Your server

Exotel sends audio frames as binary WebSocket messages:

```json
{
  "event": "media",
  "sequence_number": 1,
  "media": {
    "chunk": "<base64-encoded-audio>",
    "timestamp": "1699001234567",
    "payload": "<base64-encoded-audio>"
  },
  "stream_sid": "MZ..."
}
```

Exotel also sends control events:

| Event | Description |
|-------|-------------|
| `connected` | WebSocket connected, stream started |
| `start` | Stream initialized; metadata in payload |
| `media` | Audio chunk |
| `stop` | Stream ending |

### From your server → Exotel (bidirectional only)

Send audio back to play to the caller:

```json
{
  "event": "media",
  "media": {
    "payload": "<base64-encoded-mulaw-audio>"
  }
}
```

## Events emitted (gRPC)

| Event | Description |
|-------|-------------|
| `stream_started` | WebSocket connected; audio flowing |
| `stream_stopped` | Stream closed |

## Example — bidirectional AI voicebot

```python
import asyncio, websockets, base64, json

async def handle_stream(ws, path):
    async for message in ws:
        data = json.loads(message)
        if data['event'] == 'media':
            audio_bytes = base64.b64decode(data['media']['payload'])
            # Send to your ASR engine
            # Get TTS response back
            response_audio = your_tts_engine.speak("How can I help you?")
            await ws.send(json.dumps({
                "event": "media",
                "media": {"payload": base64.b64encode(response_audio).decode()}
            }))

asyncio.get_event_loop().run_until_complete(
    websockets.serve(handle_stream, '0.0.0.0', 8765)
)
```

## Related

- [AgentStream — Programmable Voice](/docs/agentstream/programmable-voice) — full voicebot integration guide
- [Legs & Bridges API](/docs/legs/overview)
