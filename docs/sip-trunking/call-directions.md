---
id: call-directions
title: Call directions and routing modes
description: Outbound SIP to PSTN, inbound PSTN to SIP, and pstn vs flow routing modes on Exotel Dynamic SIP Trunking.
sidebar_label: Call directions
slug: /sip-trunking/call-directions
sidebar_position: 3
---

# Call directions and routing modes

## Directions

| Direction | Path | Requires |
|-----------|------|----------|
| **Outbound** (SIP → PSTN) | Your SIP → Exotel → PSTN | Whitelisted IP (ACL) and/or digest credentials + phone number mapped to trunk |
| **Inbound** (PSTN → SIP) | PSTN → Exotel Flow → SIP trunk → your system | Destination URI + Flow with Connect applet using `sip:<trunk_sid>` |
| **Bidirectional** | Both | Both |

```
Outbound:  Your SIP system → Exotel SIP trunk → PSTN
Inbound:   PSTN → Exotel → Flow (Connect applet) → SIP trunk → Your SIP system
```

## Routing modes

Set when mapping a phone number to a trunk (`mode` field).

| Mode | Use when |
|------|----------|
| `pstn` | Standard PSTN inbound/outbound (default). Connect applet dials `sip:<trunk_sid>`. |
| `flow` | Route through a Voice AI / StreamKit / App Bazaar journey (Voicebot and related applets). |

Update mode later via the [Dynamic SIP API](./dynamic-sip-trunking#update-phone-number-mode).

## Choosing a path

| Goal | Mode | Next doc |
|------|------|----------|
| Classic PBX ↔ PSTN | `pstn` | [Quickstart](./quickstart) |
| Inbound to your SIP URI | `pstn` | [Connect Applet inbound](./connect-applet-inbound) |
| SIP ↔ AgentStream Voice AI | `flow` + StreamKit | [StreamKit SIP](./streamkit-sip) |

## Related

- [Quickstart](./quickstart)
- [Dynamic SIP Trunking API](./dynamic-sip-trunking)
