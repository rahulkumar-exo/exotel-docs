---
id: what-to-use-when
title: AgentStream — what to use when
description: Choose Connect Voice AI, Connect with Flow, or ExoML Legs for inbound and outbound Voice AI over AgentStream.
sidebar_label: What to use when
slug: /agentstream/what-to-use-when
sidebar_position: 2
---

# AgentStream: what to use when

Your bot WebSocket (AgentStream) is the same either way. Choose the **telephony control plane**, not a different bot protocol.

## Two control models

| Model | How call logic is defined | Typical entry |
|-------|---------------------------|---------------|
| **Flow (App Bazaar)** | Dashboard applets (Voicebot, Stream, Connect, Passthru, Gather, Greeting) | Exophone → App Bazaar flow |
| **ExoML (Programmable Voice)** | Your code reacts to gRPC leg events and issues leg actions (`start_stream`, `start_say`, …) | Number on gRPC endpoint (inbound), or `POST /legs` (outbound) |

## Quick chooser

| You need… | Use |
|-----------|-----|
| Outbound: answer → bot only | [Connect Voice AI API](./connect-voice-ai) |
| Outbound: greeting / IVR / DTMF / agent handoff via applets | [Connect Voice AI with Flow](./connect-voice-ai-flow) |
| Outbound or inbound: full runtime control, per-call stream URL, parallel greeting | [Programmable Voice (ExoML)](./programmable-voice) |
| Inbound: dashboard flow with Voicebot | Exophone → App Bazaar flow with [Voicebot applet](./stream-voicebot-applet) |
| Inbound: no flow — your app drives the call | Exophone attached to gRPC → ExoML leg actions |

## Outbound

### 1. Connect Voice AI — simplest outbound

Your API dials the customer. On answer, Exotel opens bidirectional WSS to `StreamUrl`.

**Use when:** campaigns, surveys, reminders — bot is the whole experience; fixed bot URL is fine.

**Not for:** menus, disclosure before bot, bot→human, or per-leg programmable actions.

```
Your API → dial → answer → AgentStream WSS ↔ bot
```

### 2. Connect Voice AI with Flow — outbound + App Bazaar

Same connect call, but `Url` points at an App Bazaar flow. Stream URL lives in the Voicebot/Stream applet.

**Use when:** compliance greeting → bot, IVR/DTMF → bot, bot → Connect (human) or Passthru.

```
Your API → dial → answer → App Bazaar → Voicebot/Stream → WSS ↔ bot
```

### 3. ExoML (Programmable Legs) — outbound in code

`POST /legs`, receive gRPC events, then `start_stream` (optional `start_say` / `start_play` while the bot warms).

**Use when:** per-call stream URL, parallel filler, application-owned routing.

```
POST /legs → gRPC events → start_stream (+ say/play) → WSS ↔ bot
```

## Inbound

### A. Flow-based (App Bazaar + Voicebot)

Customer dials Exophone linked to a flow. Voicebot opens AgentStream.

### B. ExoML programmable (no App Bazaar flow)

Exophone attached to a gRPC endpoint. Your app issues leg actions including `start_stream`.

## Side-by-side

| | Connect Voice AI | Connect + Flow | ExoML (Legs) | Inbound Flow | Inbound ExoML |
|--|------------------|----------------|--------------|--------------|---------------|
| Direction | Outbound | Outbound | Both | Inbound | Inbound |
| Control plane | Connect API | App Bazaar | gRPC + leg actions | App Bazaar | gRPC + leg actions |
| Where WSS URL is set | API `StreamUrl` | Voicebot/Stream applet | `start_stream` | Voicebot/Stream applet | `start_stream` |
| Best for | Simple outbound bot | Multi-step outbound | Code-first | Dashboard journeys | Code-first inbound |

## Decision tree

```
Who starts the call?
│
├─ Customer dials (inbound)
│  ├─ Dashboard applets? → Exophone → App Bazaar → Voicebot
│  └─ Logic in your app? → Exophone → gRPC → leg actions (ExoML)
│
└─ You dial (outbound)
   ├─ Bot only, fixed StreamUrl? → Connect Voice AI
   ├─ Need Exotel flow / handoff? → Connect with Flow
   └─ Dynamic stream / parallel say-play? → ExoML Legs
```

## Related

- [Getting started](./getting-started)
- [WebSocket protocol](./websocket-protocol)
- [Connect Voice AI](./connect-voice-ai)
