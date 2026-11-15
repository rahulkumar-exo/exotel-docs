---
id: hold
title: Hold / UnHold
description: ExoML Hold verb — put a call leg on hold with optional music, then resume it.
sidebar_label: Hold / UnHold
sidebar_position: 7
displayed_sidebar: voiceSidebar
---

# `<Hold>` / `<UnHold>`

Puts a call leg on hold (optionally with custom music) and resumes it. Used in agent-transfer and call-park scenarios.

## Hold

Pauses the caller's audio. Optionally plays custom music while they wait.

```bash
# Hold with default silence
curl -u '<api_key>:<api_token>' -X POST \
  'https://cpaas-api.in.exotel.com/v2/accounts/<account_sid>/legs/<leg_sid>/actions/hold' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### Hold with custom music on hold

Pass a `StartPlay` ExoML inside the `Hold` action to play audio during the hold:

```bash
curl -u '<api_key>:<api_token>' -X POST \
  'https://cpaas-api.in.exotel.com/v2/accounts/<account_sid>/legs/<leg_sid>/actions' \
  -H 'Content-Type: application/json' \
  -d '{
    "exoml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Flow><Hold><StartPlay>sound://https://cdn.example.com/hold-music.wav</StartPlay></Hold></Flow>"
  }'
```

### Hold ExoML structure

```xml
<Hold>
  <StartPlay>sound://https://cdn.example.com/hold-music.wav</StartPlay>
</Hold>
```

The inner `<StartPlay>` follows the same spec as the [Play verb](/docs/exoml/verbs/play) for Legs API.

## UnHold

Resumes a held leg.

```bash
curl -u '<api_key>:<api_token>' -X POST \
  'https://cpaas-api.in.exotel.com/v2/accounts/<account_sid>/legs/<leg_sid>/actions/unhold' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

## Events emitted

| Event | Description |
|-------|-------------|
| `hold_started` | Leg is now on hold |
| `hold_ended` | Leg resumed from hold |

## Common use case — warm transfer

1. Agent A is talking to the customer
2. Agent A puts the customer on hold (`Hold`)
3. Agent A consults Agent B in a separate leg
4. Agent A connects Agent B to the customer (`JoinBridge`)
5. Customer comes off hold automatically when bridged

```
Customer Leg ──────────────── [Hold] ────── [JoinBridge] ──── Bridge ──► Agent B
Agent A Leg  ── [Dial Agent B] ──────────────────────────────────────────────────
```

See [Legs & Bridges API](/docs/legs/overview) for the bridge flow.
