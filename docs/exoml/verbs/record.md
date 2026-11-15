---
id: record
title: Record
description: ExoML Record verb — record the call or a specific leg.
sidebar_label: Record
sidebar_position: 5
displayed_sidebar: voiceSidebar
---

# `<Record>`

Records the caller's audio. At the end of recording, Exotel POSTs the recording URL to your `action` endpoint.

## Syntax

```xml
<Record action="https://your-app.example.com/recording-done" maxLength="60"/>
```

## Attributes

| Attribute | Required | Default | Description |
|-----------|----------|---------|-------------|
| `action` | No | Current URL | URL to POST the recording URL to when done |
| `method` | No | `POST` | HTTP method for `action` |
| `maxLength` | No | `3600` | Maximum recording duration in seconds |
| `timeout` | No | `5` | Seconds of silence before stopping recording |
| `finishOnKey` | No | `1234567890*#` | Key that stops recording |
| `playBeep` | No | `true` | Play a beep before recording starts |

## Example — voicemail recording

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Our team is unavailable. Please leave a message after the beep.</Say>
  <Record
    action="https://your-app.example.com/voicemail"
    maxLength="60"
    finishOnKey="#"
    playBeep="true"
  />
  <Say>Thank you for your message. Goodbye.</Say>
  <Hangup/>
</Response>
```

## Action URL parameters

When recording finishes, Exotel POSTs to `action`:

| Parameter | Description |
|-----------|-------------|
| `RecordingUrl` | URL of the recording file |
| `RecordingDuration` | Duration in seconds |
| `RecordingSid` | Unique recording identifier |
| `CallSid` | Call identifier |

## Legs API — StartRecording / StopRecording

For mid-call recording on an active leg:

```bash
# Start recording
curl -u '<api_key>:<api_token>' -X POST \
  'https://cpaas-api.in.exotel.com/v2/accounts/<account_sid>/legs/<leg_sid>/actions/start_recording' \
  -H 'Content-Type: application/json' \
  -d '{}'

# Stop recording
curl -u '<api_key>:<api_token>' -X POST \
  'https://cpaas-api.in.exotel.com/v2/accounts/<account_sid>/legs/<leg_sid>/actions/stop_recording' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

Using ExoML in a Legs API action:

```bash
# Start recording with silence detection
curl -u '<api_key>:<api_token>' -X POST \
  'https://cpaas-api.in.exotel.com/v2/accounts/<account_sid>/legs/<leg_sid>/actions' \
  -H 'Content-Type: application/json' \
  -d '{
    "exoml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Flow><StartRecording silenceInSec=\"5\" maxDuration=\"300\"/></Flow>"
  }'
```

### StartRecording XML attributes

| Attribute | Required | Default | Description |
|-----------|----------|---------|-------------|
| `silenceInSec` | No | — | Stop recording after N seconds of silence |
| `maxDuration` | No | — | Maximum recording duration in seconds |
| `storageType` | No | `exotel` | Storage backend: `exotel` or `https` (custom URL) |
| `storageUrl` | No | — | Custom storage URL when `storageType="https"` |

### Events emitted

| Event | Description |
|-------|-------------|
| `recording_started` | Recording has begun |
| `recording_completed` | Recording finished; URL in event payload |
| `recording_stopped` | Recording stopped early via `stop_recording` |
