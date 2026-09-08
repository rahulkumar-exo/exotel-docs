---
id: getting-started
title: Getting started with AgentStream
description: Make your first AgentStream connection in minutes — prerequisites, echo server, and Connect Voice AI.
sidebar_label: Getting started
slug: /agentstream/getting-started
sidebar_position: 3
---

# Getting started with AgentStream

Get audio flowing between a live call and your server in minutes.

## Prerequisites

- Exotel account with AgentStream enabled ([sign up](https://my.exotel.com/auth/register))
- API Key, API Token, Account SID — [Authentication](/docs/references/authentication)
- An ExoPhone (virtual number)
- A publicly reachable WebSocket endpoint (`wss://`)

## Step 1 — Run an echo server

```python
# echo.py
import asyncio, json, websockets

async def handle(ws):
    stream_sid = None
    async for msg in ws:
        ev = json.loads(msg)
        match ev["event"]:
            case "start":
                stream_sid = ev["start"]["stream_sid"]
                print("stream started", stream_sid)
            case "media":
                await ws.send(json.dumps({
                    "event": "media",
                    "stream_sid": stream_sid,
                    "media": {"payload": ev["media"]["payload"]},
                }))
            case "stop":
                break

async def main():
    async with websockets.serve(handle, "0.0.0.0", 5001):
        print("listening on :5001")
        await asyncio.Future()

asyncio.run(main())
```

```bash
pip install websockets
python echo.py
# expose with ngrok (or similar): ngrok http 5001
# use the wss:// URL as streamurl
```

## Step 2 — Connect Voice AI (outbound)

```bash
export EXOTEL_API_KEY="your_api_key"
export EXOTEL_API_TOKEN="your_api_token"
export EXOTEL_ACCOUNT_SID="your_account_sid"
# India: api.in.exotel.com · Singapore: api.exotel.com
export EXOTEL_SUBDOMAIN="api.in.exotel.com"

curl -u "$EXOTEL_API_KEY:$EXOTEL_API_TOKEN" -X POST \
  "https://$EXOTEL_SUBDOMAIN/v1/Accounts/$EXOTEL_ACCOUNT_SID/Calls/connect" \
  -F "From=+919876543210" \
  -F "CallerId=YOUR_EXOPHONE" \
  -F "StreamUrl=wss://YOUR_PUBLIC_HOST/media" \
  -F "StreamType=bidirectional"
```

Answer the phone — you should hear your own audio echoed back.

## Step 3 — Confirm success

| Check | Expected |
|-------|----------|
| API response | `call.sid` present, status `queued` / `in-progress` |
| Server logs | `start` then continuous `media` events |
| Call audio | Echo (or your TTS) audible |

## Next paths

| Goal | Go to |
|------|-------|
| Unsure which API to use | [What to use when](./what-to-use-when) |
| IVR / agent handoff | [Connect with Flow](./connect-voice-ai-flow) |
| Build a real bot | [WebSocket protocol](./websocket-protocol) |
| Monitor live streams | [WSS errors & monitoring](./wss-errors-monitoring) |

:::tip Samples
Example servers and SDKs: [github.com/exotel](https://github.com/exotel)
:::
