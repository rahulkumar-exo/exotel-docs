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

## Where to go

| Goal | Link |
|------|------|
| Step-by-step trunk APIs + Try it | [StreamKit SIP setup](/docs/sip-trunking/streamkit-sip) |
| Full bridge walkthrough (headers, escalate, modes) | [docs portal — StreamKit Cloud SIP](https://docs.exotel.com/dynamic-sip-trunking/streamkit-cloud-sip-trunking-setup) |
| All Dynamic SIP endpoints | [Dynamic SIP Trunking API](/docs/sip-trunking/dynamic-sip-trunking) |
| Bot media protocol | [WebSocket protocol](./websocket-protocol) |
| Firewall / IPs | [Network & firewall](/docs/sip-trunking/network-firewall) |

## Quick checklist

1. Create trunk, map DID with `mode: flow`, whitelist ACL — [StreamKit SIP setup](/docs/sip-trunking/streamkit-sip)  
2. Build App Bazaar flow (Greeting → Voicebot/Stream) and map VoIP Exophone — [docs portal](https://docs.exotel.com/dynamic-sip-trunking/streamkit-cloud-sip-trunking-setup)  
3. Send SIP INVITE with `X-Exotel-AccountSid: <Account_SID>`  
4. Implement WSS — [WebSocket protocol](./websocket-protocol)

:::tip Greeting applet
If you omit a short greeting/play as the first applet, you may see ~20s of silence and early disconnect. Add a greeting applet first.
:::

## Related

- [What to use when](./what-to-use-when)
- Partner recipes: [docs portal ecosystem](https://docs.exotel.com/exotel-agentstream/voice-ai-ecosystem)
- Samples: [github.com/exotel](https://github.com/exotel)
