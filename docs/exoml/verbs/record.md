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

On an active leg, send the verb as ExoML to the Legs actions endpoint, `POST /v2/accounts/{account_sid}/legs/{leg_sid}/actions`, in the `exoml` field (optional `action_custom_param` is echoed in the events). There are no per-action paths such as `/actions/{name}`.

```bash
# Start recording, stopping after 5 s of silence or 300 s
curl -u '<api_key>:<api_token>' -X POST \
  'https://cpaas-api.in.exotel.com/v2/accounts/<account_sid>/legs/<leg_sid>/actions' \
  -H 'Content-Type: application/json' \
  -d '{
    "exoml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Flow><StartRecording silenceInSec=\"5\" timeoutInSec=\"300\"></StartRecording></Flow>"
  }'

# Stop recording
curl -u '<api_key>:<api_token>' -X POST \
  'https://cpaas-api.in.exotel.com/v2/accounts/<account_sid>/legs/<leg_sid>/actions' \
  -H 'Content-Type: application/json' \
  -d '{
    "exoml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Flow><StopRecording></StopRecording></Flow>"
  }'
```

### StartRecording XML attributes

| Attribute | Required | Default | Description |
|-----------|----------|---------|-------------|
| `direction` | No | `both` | `in`, `out` or `both` |
| `format` | No | `mp3` | `mp3` or `wav` |
| `channel` | No | `mono` | `mono` or `stereo` (stereo needs `direction="both"`) |
| `silenceInSec` | No | — | Stop recording after N seconds of silence |
| `timeoutInSec` | No | — | Maximum recording duration in seconds |
| `storageType` | No | `s3` | `s3` (Exotel storage) or `https` (your server) |
| `storageURL`, `storageURLKey`, `storageURLToken` | When `storageType="https"` | — | Upload URL and its Basic-auth key and token |

### Events emitted

| Event | Description |
|-------|-------------|
| `recording_started` | Recording has begun |
| `recording_stopped` | Recording stopped |
| `recording_available` | Recording file uploaded; URL in event payload |
| `recording_failed_to_start` | Recording could not start |
| `recording_failed_to_stop` | `StopRecording` did not complete |
