---
id: streamkit-sip
title: StreamKit Cloud SIP trunking setup
description: Configure Dynamic SIP Trunking for StreamKit so contact centre SIP traffic can reach AgentStream Voice AI.
sidebar_label: StreamKit SIP setup
slug: /sip-trunking/streamkit-sip
sidebar_position: 6
---

# StreamKit Cloud SIP trunking setup

Use Dynamic SIP Trunking so your contact centre can send SIP to Exotel, and StreamKit bridges media to your AgentStream WebSocket bot.

```
Customer → CC (SIP) → Exotel StreamKit → AgentStream WSS ↔ bot
```

## Steps

1. **Create trunk, map DID, ACL/credentials, destination URI** — follow [Quickstart](./quickstart) and [Dynamic SIP API](./dynamic-sip-trunking)
2. **Open firewall** — [Network & firewall](./network-firewall)
3. **Build the App Bazaar flow** — Greeting → Voicebot (or Stream) → optional Passthru / Connect  
4. **Map VoIP Exophone** to the flow  
5. **Send SIP INVITE** with `X-Exotel-AccountSid: <Account_SID>` (mandatory for routing)  
6. **Implement the bot** — [AgentStream WebSocket protocol](/docs/agentstream/websocket-protocol)

Full bridge walkthrough (headers, Passthru escalate, modes): [AgentStream StreamKit Cloud](/docs/agentstream/streamkit-cloud).

## Mode

For Voicebot / StreamKit App Bazaar journeys, map the phone number with `"mode": "flow"`. For Connect-to-SIP only, use `pstn`. See [Call directions](./call-directions).

## Related

- [Connect Applet inbound](./connect-applet-inbound)
- [AgentStream overview](/docs/agentstream/overview)
- Docs portal: [StreamKit Cloud SIP trunking](https://docs.exotel.com/dynamic-sip-trunking/streamkit-cloud-sip-trunking-setup)
