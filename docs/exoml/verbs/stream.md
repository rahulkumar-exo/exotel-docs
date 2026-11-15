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

## StartStream / StopStream

On an active leg, send the verb as ExoML to the Legs actions endpoint, `POST /v2/accounts/{account_sid}/legs/{leg_sid}/actions`, in the `exoml` field (optional `action_custom_param` is echoed in the events). There are no per-action paths such as `/actions/{name}`.

```bash
# Start a bidirectional stream
curl -u '<api_key>:<api_token>' -X POST \
  'https://cpaas-api.in.exotel.com/v2/accounts/<account_sid>/legs/<leg_sid>/actions' \
  -H 'Content-Type: application/json' \
  -d '{
    "exoml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Flow><StartStream streamType=\"bidirectional\" streamUrl=\"wss://your-ai-server.example.com/stream\"></StartStream></Flow>"
  }'

# Stop it (streamSid optional; without it the active stream stops)
curl -u '<api_key>:<api_token>' -X POST \
  'https://cpaas-api.in.exotel.com/v2/accounts/<account_sid>/legs/<leg_sid>/actions' \
  -H 'Content-Type: application/json' \
  -d '{
    "exoml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Flow><StopStream streamSid=\"<stream_sid>\"></StopStream></Flow>"
  }'
```

### StartStream XML attributes

| Attribute | Required | Description |
|-----------|----------|-------------|
| `streamType` | Yes | `unidirectional` (send only) or `bidirectional` (send + receive) |
| `streamUrl` | Yes | WebSocket URL (`wss://`). Up to 25 custom query parameters, 800 characters in total; write `&` as `&amp;` |
| `sourceDirection` | No | `in`, `out` or `both` (default). Unidirectional streams only |
| `secureDtmf` | No | `true` sends caller DTMF encrypted. Bidirectional streams only |

### StopStream XML attributes

| Attribute | Required | Description |
|-----------|----------|-------------|
| `streamSid` | No | Stream to stop. If omitted, the active stream on the leg is stopped |

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
| `stream_initiated` | Stream action accepted |
| `stream_started` | WebSocket connected; audio flowing |
| `stream_stopped` | Stream closed |
| `stream_failed` | Stream failed to start |
| `stream_failed_to_stop` | `StopStream` did not complete |

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
