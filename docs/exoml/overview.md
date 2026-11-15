---
id: overview
title: ExoML
description: ExoML (Exotel Markup Language) is Exotel's programmatic call control API. Build dynamic IVRs, leg-level media control, and AI voice flows entirely in code.
sidebar_label: Overview
sidebar_position: 1
displayed_sidebar: voiceSidebar
---

# ExoML

ExoML (Exotel Markup Language) is Exotel's event-driven call control API. Instead of building flows in the dashboard, you write code that responds to live call events and issues XML actions to control each call leg in real time.

## How it works

```
Your app creates a Leg via REST API
        │
        ▼
Exotel dials the call
        │
        ▼
Exotel POSTs event to your HTTPS endpoint (leg_ringing, leg_answered, …)
        │
        ▼
Your endpoint returns HTTP 200 (ack)
        │
        ▼
Your app calls POST /legs/{leg_sid}/actions with ExoML XML
        │
        ▼
Exotel executes the action (play audio, gather DTMF, dial, record, …)
        │
        ▼
Exotel POSTs the result event to your endpoint
```

Your HTTP response to Exotel is just an acknowledgement — return HTTP 200 immediately. The next call instruction is a separate REST API call you make after the ack, not the response body.

## When to use ExoML vs dashboard applets

| Requirement | Use |
|---|---|
| Dynamic IVR built from code / git | ExoML |
| Leg-level control (hold one party, talk to another) | ExoML |
| AI voicebot / streaming | ExoML |
| Simple fixed call flow, no code dependency | Dashboard Applets |
| Click-to-call with a fixed IVR | Dashboard Applets + Voice V1 |

## Base URL

| Data Center | Base URL |
|---|---|
| Singapore | `https://cpaas-api.exotel.com/v2/accounts/{account_sid}` |
| Mumbai | `https://cpaas-api.in.exotel.com/v2/accounts/{account_sid}` |

## Authentication

HTTP Basic Authentication using your API key and token.

```bash
curl -u "<api_key>:<api_token>" \
  -H "Content-Type: application/json" \
  https://cpaas-api.in.exotel.com/v2/accounts/<account_sid>/legs
```

Get credentials from [my.exotel.com](https://my.exotel.com) → Developer Settings → API Settings.

## Core resources

| Resource | Endpoint | Description |
|---|---|---|
| Leg | `POST /legs` | Create a call leg (outbound or inbound) |
| Leg actions | `POST /legs/{leg_sid}/actions` | Execute an ExoML action on a leg |
| Leg details | `GET /legs/{leg_sid}` | Get leg state and metadata |
| Bridge | `POST /bridges` | Create a multi-party conference |
| Bridge actions | `POST /bridges/{bridge_sid}/actions` | Execute an action on a bridge |

## ExoML action structure

Every action request sends an ExoML XML string in the `exoml` field:

```json
POST /v2/accounts/{account_sid}/legs/{leg_sid}/actions

{
  "action_custom_param": "optional-tracking-value",
  "exoml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Flow><Hangup></Hangup></Flow>"
}
```

The `<Flow>` element is the root wrapper. Inside it goes one action verb.

## Available actions

**Leg actions**

| Action | Verb | What it does |
|---|---|---|
| Play audio | `<StartPlay>` / `<StopPlay>` | Play a WAV/MP3 URL on the leg |
| Text-to-speech | `<StartSay>` / `<StopSay>` | Speak text using TTS (Polly or Google TTS) |
| Collect DTMF | `<Gather>` | Wait for keypad digits |
| Dial | `<Dial>` | Dial another number and bridge the legs |
| Record | `<StartRecording>` / `<StopRecording>` | Record the leg audio |
| Hold | `<Hold>` / `<UnHold>` | Put the leg on hold with music |
| Mute | `<Mute>` / `<Unmute>` | Mute/unmute audio direction |
| Join bridge | `<JoinBridge>` | Add this leg to a conference bridge |
| Leave bridge | `<LeaveBridge>` | Remove from conference bridge |
| Hang up | `<Hangup>` | End the leg |
| Stream | `<StartStream>` / `<StopStream>` | Pipe audio to a WebSocket (AI/transcription) |

**Bridge actions**

| Action | Verb | What it does |
|---|---|---|
| Play to conference | `<StartPlay>` / `<StopPlay>` | Play audio to all bridge participants |
| TTS to conference | `<StartSay>` / `<StopSay>` | Speak text to all participants |
| Record conference | `<StartRecording>` / `<StopRecording>` | Record the full bridge |

## Events

Exotel emits events to your HTTPS endpoint throughout the call lifecycle.

**Leg lifecycle events** (`leg_lifecycle_event`)
- `leg_connecting`, `leg_ringing`, `leg_answered`, `leg_terminated`, `leg_incoming`

**Leg action events** (`leg_action_event`)
- `play_started`, `play_completed`, `play_interrupted`, `play_failed_to_start`
- `gather_success`, `gather_failed`, `gather_interrupted`
- `dial_initiated`, `dial_success`, `dial_completed`, `dial_failed`
- `recording_started`, `recording_stopped`, `recording_available`
- `hold_success`, `hold_failed`

## Next steps

- [Set up your event endpoint](/docs/exoml/event-endpoint) — receive live call events
- [ExoML action reference](/docs/exoml/actions) — full XML syntax for every action
- [Quickstart](/docs/exoml/quickstart) — make your first ExoML-controlled call
