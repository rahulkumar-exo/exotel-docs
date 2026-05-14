---
title: AgentStream
sidebar_label: Overview
sidebar_position: 2
---
# Connect to Voice AI API

Use this API to call a phone number and connect it to your AI bot in real time. Audio flows both ways over a secure WebSocket.

---

## When to Use Which

| | Connect to Voice AI API | Connect Voice AI (via Flow) |
|---------------|---------|-----------|
| **Use when** | Direct bot connection | IVR, disclosures, or agent fallback needed first |
| **Setup** | API call only | Flow configured in dashboard |

---

## Endpoint
POST /v1/Accounts/{AccountSid}/Calls/connect

| Region | Base URL |
|---|---|
| Singapore | `https://api.exotel.com` |
| Mumbai | `https://api.in.exotel.com` |

**Auth:** HTTP Basic — API Key as username, API Token as password.

---

## Parameters

**Required**

| Parameter | Description |
|---|---|
| `From` | Number to dial, e.g. `+919876543210` |
| `CallerId` | Your Exotel virtual number |
| `StreamUrl` | Your bot's WebSocket URL (`wss://`) |
| `StreamType` | Set to `bidirectional` |

**Optional**

| Parameter | Description |
|---|---|
| `Record` | `true` to record. Default: `false` |
| `RecordingChannels` | `single` or `dual`. Default: `single` |
| `TimeLimit` | Max call duration in seconds (up to 14,400) |
| `StatusCallback` | URL to receive call status updates |
| `StatusCallbackEvents` | `answered`, `terminal`, or `ringing` |
| `CustomField` | Attach metadata to the call (max 128 chars) |
| `StreamName` | Label for the stream (max 32 chars) |

---

## Example

```bash
curl -X POST 'https://<api_key>:<api_token>@api.exotel.com/v1/Accounts/<AccountSid>/Calls/connect' \
  -F 'From=+91xxxxxxxxxx' \
  -F 'CallerId=0xxxxxxxxxx' \
  -F 'StreamType=bidirectional' \
  -F 'StreamUrl=wss://your-bot.example.com/media' \
  -F 'Record=true' \
  -F 'StatusCallback=https://your-server.com/callback' \
  -F 'StatusCallbackEvents[]=terminal'
```

---

## Response

```json
{
  "Call": {
    "Sid": "a1b2c3d4e5f6",
    "Status": "in-progress",
    "From": "+91xxxxxxxxxx",
    "Direction": "outbound-api",
    "DateCreated": "2025-06-01 10:00:00",
    "RecordingUrl": null
  }
}
```

**Call status values:** `queued` · `in-progress` · `completed` · `failed` · `busy` · `no-answer`

---

## WebSocket & Audio

- Default audio: PCM / MuLaw at 8 kHz
- To change sample rate, append to `StreamUrl`: `?sample-rate=16000`
- Supported rates: `8000`, `16000`, `24000`
- To end the call, your bot closes the WebSocket connection

---

## Limits

- `StreamUrl` must use `ws://` or `wss://` and be under 600 characters
- `StreamName` max 32 characters
- Feature must be enabled on your account — contact [hello@exotel.com](mailto:hello@exotel.com)

---

## Connect Voice AI (via Flow)

Same endpoint, but pass a `Url` instead of `StreamUrl`/`StreamType`. The flow controls the call — IVR, disclosures, routing — before handing off to your bot.

**Required parameters:** `From`, `CallerId`, `Url`

```bash
curl -X POST 'https://<api_key>:<api_token>@api.exotel.com/v1/Accounts/<AccountSid>/Calls/connect' \
  -d 'From=+91xxxxxxxxxx' \
  -d 'CallerId=0xxxxxxxxxx' \
  -d 'Url=https://my.exotel.com/<AccountSid>/exoml/start_voice/<FlowId>'
```

> Do not pass `StreamUrl` or `StreamType` in this request — configure them inside the Flow applet in your dashboard.

---

*Need help? Contact [hello@exotel.com](mailto:hello@exotel.com)*
