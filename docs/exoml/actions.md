---
id: actions
title: ExoML Action Reference
description: Complete reference for all ExoML XML actions — Play, Say, Gather, Dial, Record, Hold, Mute, Hangup, Stream, and bridge actions.
sidebar_label: Action Reference
sidebar_position: 4
displayed_sidebar: voiceSidebar
---

# ExoML Action Reference

Every action is a `POST` to `/v2/accounts/{account_sid}/legs/{leg_sid}/actions` with an `exoml` field containing an XML string wrapped in `<Flow>`.

```json
{
  "action_custom_param": "optional-tracking-value",
  "exoml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Flow>... verb ...</Flow>"
}
```

The `action_custom_param` value is echoed back in the resulting event under `action_custom_parameter`.

---

## Play audio — `<StartPlay>` / `<StopPlay>`

Plays a WAV or MP3 file from a URL on the leg.

### `<StartPlay>` attributes

| Attribute | Required | Type | Default | Description |
|---|---|---|---|---|
| `loop` | Optional | integer | 0 (infinite) | Times to repeat. Max 10. |
| `username` | Optional | string | — | Basic auth username for HTTPS URLs |
| `password` | Optional | string | — | Basic auth password for HTTPS URLs |
| (inner text) | **Required** | URL | — | File URL to play. Use prefix `sound:` for Exotel default sounds. |

### Examples

```xml
<!-- Play a WAV from an HTTPS URL -->
<Flow>
  <StartPlay username="abc123" password="securepass">
    https://exotel.s3.mum-1.amazonaws.com/123.wav
  </StartPlay>
</Flow>

<!-- Stop current playback -->
<Flow><StopPlay></StopPlay></Flow>
```

### Events

| Event name | Description |
|---|---|
| `play_started` | Playback started |
| `play_completed` | File fully played |
| `play_interrupted` | Stopped by another action |
| `play_failed_to_start` | File could not be fetched or played |

---

## Text-to-speech — `<StartSay>` / `<StopSay>`

Converts text to speech and plays it on the leg. Supports Polly and Google TTS engines.

### `<StartSay>` attributes

| Attribute | Required | Type | Default | Description |
|---|---|---|---|---|
| `loop` | Optional | integer | 0 (infinite) | Times to repeat. Max 10. |
| `preferredTTSEngine` | Optional | `polly` \| `googletts` | `polly` | TTS engine |
| `language` | Optional | string | `en` | Language code. All regional languages supported. |
| `pollyVoiceId` | Optional | string | `Raveena` | Polly voice ID. See [AWS Polly voices](https://docs.aws.amazon.com/polly/latest/dg/voicelist.html). |
| `googlettsVoiceName` | Optional | string | ssml gender female | Google TTS voice name |
| (inner text) | **Required** | string | — | Text or SSML markup to speak |

### Examples

```xml
<!-- Plain text with Polly -->
<Flow>
  <StartSay language="en" preferredTTSEngine="polly" pollyVoiceId="Aditi">
    Welcome. Press 1 for sales, 2 for support.
  </StartSay>
</Flow>

<!-- SSML with Google TTS -->
<Flow>
  <StartSay preferredTTSEngine="googletts" language="en">
    <speak>Your order <say-as interpret-as="digits">1234</say-as> is ready.</speak>
  </StartSay>
</Flow>

<!-- Stop TTS -->
<Flow><StopSay></StopSay></Flow>
```

### Play + Say sequence (`<PlaySequence>`)

Play an audio file followed by a TTS message in a single action:

```xml
<Flow>
  <PlaySequence>
    <StartPlay>https://exotel.s3.mum-1.amazonaws.com/hold-music.wav</StartPlay>
    <Say>This is spoken quickly.</Say>
  </PlaySequence>
</Flow>
```

---

## Collect DTMF — `<Gather>`

Waits for the caller to press keypad digits.

### `<Gather>` attributes

| Attribute | Required | Type | Description |
|---|---|---|---|
| `numDigits` | Optional | integer | Stop collecting after this many digits |
| `timeoutInSec` | Optional | integer | Seconds to wait for input after the last digit |
| `finishOnKey` | Optional | string | Key that ends collection (e.g. `#`, `*`) |

### Examples

```xml
<!-- Collect up to 5 digits, finish on * -->
<Flow>
  <Gather numDigits="5" timeoutInSec="30" finishOnKey="*"></Gather>
</Flow>

<!-- Play audio while gathering -->
<Flow>
  <Gather numDigits="1" timeoutInSec="10">
    <StartPlay>https://example.com/ivr-prompt.wav</StartPlay>
  </Gather>
</Flow>
```

### Events

| Event name | Description |
|---|---|
| `gather_initiated` | Gather started |
| `gather_started` | First digit received |
| `gather_success` | Completed. `event_data.data.digits` contains the collected digits |
| `gather_failed` | Timed out or error |
| `gather_interrupted` | Leg hung up during gather |

---

## Dial another number — `<Dial>`

Dials a second phone number and bridges both legs together.

### `<Dial>` attributes

| Attribute | Required | Type | Default | Description |
|---|---|---|---|---|
| `contactUri` | **Required** | string | — | Phone number (with country code) or SIP URI to dial |
| `exophone` | **Required** | string | — | Caller ID (ExoPhone virtual number) |
| `networkType` | Optional | `pstn` \| `voip` | `pstn` | Network type |
| `timeout` | Optional | integer (seconds) | 30 | Total timeout |
| `ringTimeout` | Optional | integer (seconds) | 30 | Ring timeout before giving up |
| `timeLimit` | Optional | integer (seconds) | 14400 | Max call duration |
| `absorbDtmf` | Optional | boolean | false | If true, DTMF tones from this leg are not passed to the bridge |
| `customParam` | Optional | string | — | Echoed in dial events |

### Example

```xml
<Flow>
  <Dial
    contactUri="09163816623"
    exophone="08030752400"
    networkType="pstn"
    absorbDtmf="true">
  </Dial>
</Flow>
```

### Events

| Event name | Description |
|---|---|
| `dial_initiated` | Dial started. `event_data.data` includes `bridge_sid` and `second_leg_sid` |
| `dial_success` | Second leg answered and bridged |
| `dial_completed` | Either leg hung up or left the bridge |
| `dial_failed` | Could not connect |

---

## Record — `<StartRecording>` / `<StopRecording>`

Records audio on a leg.

### `<StartRecording>` attributes

| Attribute | Required | Type | Default | Description |
|---|---|---|---|---|
| `direction` | Optional | `in` \| `out` \| `both` | `both` | Which audio stream to record |
| `format` | Optional | `wav` \| `mp3` | `mp3` | Recording format |
| `bitrate` | Optional | `8` \| `24` \| `32` \| `64` \| `128` | `8` | Bitrate (kbps) |
| `channel` | Optional | `mono` \| `stereo` | `mono` | Stereo only available when `direction=both` |
| `storageType` | Optional | `s3` \| `https` | `s3` | Where to store the recording |
| `storageURL` | Required if `storageType=https` | string | — | HTTPS upload endpoint |
| `storageURLKey` | Required if `storageType=https` | string | — | Basic auth key for the upload endpoint |
| `storageURLToken` | Required if `storageType=https` | string | — | Basic auth token for the upload endpoint |

### Examples

```xml
<!-- Record to Exotel S3 -->
<Flow>
  <StartRecording direction="both" format="wav" storageType="s3"></StartRecording>
</Flow>

<!-- Record to your own server -->
<Flow>
  <StartRecording
    direction="both"
    format="wav"
    storageType="https"
    storageURLKey="mykey"
    storageURLToken="mytoken"
    storageURL="https://recordings.example.com/upload">
  </StartRecording>
</Flow>

<!-- Stop recording -->
<Flow><StopRecording></StopRecording></Flow>
```

### Events

| Event name | Description |
|---|---|
| `recording_started` | Recording began |
| `recording_stopped` | Recording stopped |
| `recording_available` | File is ready. `event_data.data.recording_sid` contains the ID |

---

## Hold / Unhold — `<Hold>` / `<UnHold>`

Puts the leg on hold with music-on-hold (MOH).

### Examples

```xml
<!-- Hold with Exotel default MOH -->
<Flow><Hold></Hold></Flow>

<!-- Hold with custom MOH audio -->
<Flow>
  <Hold>
    <StartPlay>https://exotel.s3.mum-1.amazonaws.com/hold-music.wav</StartPlay>
  </Hold>
</Flow>

<!-- Unhold -->
<Flow><UnHold></UnHold></Flow>
```

### Events

| Event name | Description |
|---|---|
| `hold_success` | Leg is on hold |
| `hold_failed` | Hold failed |

---

## Mute / Unmute — `<Mute>` / `<Unmute>`

Mutes a specific audio direction on the leg.

### `<Mute>` attributes

| Attribute | Required | Type | Description |
|---|---|---|---|
| `direction` | Optional | `in` \| `out` \| `both` | Audio direction to mute. Default: `both` |

### Examples

```xml
<!-- Mute caller's microphone -->
<Flow><Mute direction="in"></Mute></Flow>

<!-- Unmute -->
<Flow><Unmute></Unmute></Flow>
```

---

## Hang up — `<Hangup>`

Ends the leg.

```xml
<Flow><Hangup></Hangup></Flow>
```

### Events

| Event name | Description |
|---|---|
| `leg_terminated` | Leg ended. `event_data.data` includes `hangup_cause_code` and `sip_cause_code` |
| `hangup_failed` | Hangup action failed |

---

## Join / Leave bridge — `<JoinBridge>` / `<LeaveBridge>`

Adds or removes a leg from a conference bridge.

### `<JoinBridge>` attributes

| Attribute | Required | Type | Description |
|---|---|---|---|
| `bridgeSid` | **Required** | string | The SID of the target bridge |
| `absorbDtmf` | Optional | boolean | If true, DTMF from this leg is absorbed |

### Examples

```xml
<!-- Join a bridge -->
<Flow>
  <JoinBridge bridgeSid="2NRbUtE18WNlhtNeK03wncca9Po00000" absorbDtmf="true">
  </JoinBridge>
</Flow>

<!-- Leave the bridge -->
<Flow><LeaveBridge></LeaveBridge></Flow>
```

---

## Stream audio — `<StartStream>` / `<StopStream>`

Pipes real-time audio from the leg to a WebSocket server for AI processing or live transcription.

```xml
<!-- Start streaming to your WebSocket server -->
<Flow>
  <StartStream url="wss://ai.example.com/stream" track="both"></StartStream>
</Flow>

<!-- Stop streaming -->
<Flow><StopStream></StopStream></Flow>
```

For the full streaming protocol and message format, see [AgentStream](/docs/agentstream/overview).

---

## Bridge actions

Bridge actions target the whole conference rather than a single leg.

```
POST /v2/accounts/{account_sid}/bridges/{bridge_sid}/actions
```

### Play / Say on bridge

Same `<StartPlay>`, `<StopPlay>`, `<StartSay>`, `<StopSay>` syntax as leg actions. Audio plays to all participants.

### Record bridge

Same `<StartRecording>` / `<StopRecording>` syntax. Records the full mixed audio.

### Warm transfer — `<Refer>`

Transfers a bridge participant to another number while keeping the remaining participants connected.

```xml
<Flow>
  <Refer contactUri="09163816624" exophone="08030752400"></Refer>
</Flow>
```
