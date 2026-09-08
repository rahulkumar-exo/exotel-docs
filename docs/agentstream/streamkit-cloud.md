---
id: streamkit-cloud
title: StreamKit Cloud
description: Bridge SIP contact centre traffic to your AgentStream WebSocket bot with Exotel StreamKit Cloud.
sidebar_label: StreamKit Cloud
slug: /agentstream/streamkit-cloud
sidebar_position: 12
---

# StreamKit Cloud

StreamKit is Exotel’s cloud SIP ↔ WSS connector. Connect a SIP contact centre or PBX to any WebSocket Voice AI endpoint in real time.

```
Customer → Contact centre (SIP) → Exotel StreamKit → wss://your-bot
```

## Prerequisites

| Requirement | Description |
|-------------|-------------|
| Exotel account | Account SID, API key, API token |
| VoIP Exophone | Request via hello@exotel.com if needed |
| SIP / IVR system | Can send SIP INVITE with required headers |
| Voicebot endpoint | Public `wss://` URL |
| Firewall | Whitelist Exotel signaling + media — see [Network & firewall](/docs/sip-trunking/network-firewall) |
| Trunk | Create via [Dynamic SIP Trunking API](/docs/sip-trunking/dynamic-sip-trunking) |

## Setup overview

1. **Create trunk + whitelist** — [Dynamic SIP API](/docs/sip-trunking/dynamic-sip-trunking) / [SIP StreamKit setup](/docs/sip-trunking/streamkit-sip)
2. **Build App Bazaar flow** — Greeting (recommended first) → Voicebot or Stream → optional Passthru / Connect
3. **Map VoIP Exophone** to the flow
4. **Send SIP INVITE** from your PBX to the Exotel SIP domain with mandatory `X-Exotel-AccountSid: <Account_SID>`
5. **Pass custom headers** (optional) for bot/campaign routing — appear in Voicebot `start.custom_parameters`
6. **Handle WSS** — implement [WebSocket protocol](./websocket-protocol)
7. **Escalate** — Passthru notify or Connect applet back to SIP (`sip:<trunk_sid>`)

:::tip Greeting applet
If you omit a short greeting/play as the first applet, you may see ~20s of silence and early disconnect. Add a greeting applet first.
:::

## Custom SIP headers

Supported examples (VoIP Exophone): `X-Custom-Header`, `X-UUI` (size limits apply). Values surface in:

- Voicebot/Stream `start` → `custom_parameters`
- Passthru / Connect HTTPS GET → `SIPCustomHeader[...]` query params

## Modes

| Mode | Applet | Direction |
|------|--------|-----------|
| Voicebot | Voicebot | Full-duplex SIP ↔ WSS |
| Agent assist | Stream | Unidirectional listen |
| Escalate to agent | Connect + second trunk | Bot → human on SIP |

## Related

- [SIP StreamKit setup](/docs/sip-trunking/streamkit-sip)
- [Dynamic SIP Trunking API](/docs/sip-trunking/dynamic-sip-trunking)
- [Passthru applet](./passthru-applet)
- Partner recipes: [docs portal ecosystem](https://docs.exotel.com/exotel-agentstream/voice-ai-ecosystem)
- Samples: [github.com/exotel](https://github.com/exotel)
