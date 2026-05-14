---
id: voicebot-integration
title: Exotel SIP Trunking to SIP-Native Voicebot Integration
description: Comprehensive guide for SIP-native voicebot partners to integrate their SIP infrastructure with Exotel's SIP Trunking for direct voice routing.
sidebar_label: Voicebot Integration
sidebar_position: 8
---

# Integration Guide: Exotel SIP Trunking to SIP-Native Voicebot

This guide provides a comprehensive overview for SIP-native voicebot partners on how to integrate their SIP infrastructure with Exotel's SIP Trunking setup. It covers supported transport types (TCP, TLS, FQDN), setup best practices, media expectations, SIP header guidelines, and testing checklists.

:::note Alpha Release
This guide covers the Alpha release of SIP Trunking-to-Voicebot integration.
:::

## Overview

Exotel's SIP Trunking integration enables bot providers to connect their SIP-based voicebot platforms directly with Exotel's PSTN and IP network. It allows:

- Receiving inbound calls from Exophone directly into the bot
- SIP signaling over TCP or TLS
- RTP or SRTP media handoff
- Routing using either static IP or FQDN (DNS-based)

This supports scalable, secure, cloud-native bot deployments without requiring traditional contact center infrastructure.

## Supported Use Cases

| Scenario | Description |
|----------|-------------|
| Exophone to SIP Bot | Caller dials an Exophone; Exotel routes to voicebot via SIP |
| Secure AI Bot Deployment | TLS + SRTP-based encrypted SIP flows |
| FQDN Load-Balanced Bot Gateway | DNS-based bot infra handling SIP load across instances |
| Bot with DTMF Logic | Voicebot uses keypad input (RFC2833) for interaction |
| NLP-based Voicebot | Uses STT/TTS stack for open-ended dialogue over RTP |
| API Outbound Call to SIP Bot | Exotel dials user and connects to SIP bot as second leg |

## Supported Transport and Routing Options

| Mode | Port | Transport | Encryption | DNS/FQDN | Best For |
|------|------|-----------|------------|----------|----------|
| TCP | 5070 | SIP/TCP | No | Optional | Legacy/static IP setups |
| TLS | 443 | SIP/TLS | Yes | Optional | Secure environments (recommended) |
| FQDN (TCP) | Any | SIP/TCP | Optional | Required | Cloud-native, scalable setups |
| FQDN (TLS) | Any | SIP/TLS | Yes | Required | Encrypted cloud deployments |

:::tip
For detailed setup instructions per transport type, see:
- [TCP Integration Guide](./tcp-integration.md)
- [TLS Integration Guide](./tls-integration.md)
- [FQDN-based Integration](./fqdn-integration.md)
:::

## Architecture Flow

```
Inbound Call -> Exophone (Exotel) -> SIP Trunking Trunk (TCP/TLS/FQDN) -> SIP Bot Server -> RTP Media Exchange -> Bot Response
```

## Pre-Integration Checklist

| Requirement | Description |
|-------------|-------------|
| SIP Server | Must respond to SIP INVITEs with 200 OK + SDP |
| Transport Choice | TCP or TLS required |
| NAT Traversal | Use `nat=force_rport`, `externip`, or symmetric RTP config |
| Codec Support | G.711 PCMA (preferred) and PCMU |
| RTP Media Ports | Allow UDP 10000-20000 |
| SIP Ports | TCP 5070, TLS 443 |
| Logging | Enable SIP and RTP logs (`sngrep`, Wireshark) |

## SIP INVITE Format (Exotel to Bot)

```sip
INVITE sip:+911234567890@yourbot.fqdn.com:443;transport=tls SIP/2.0
From: "+918888888888" <sip:+918888888888@exotelt.pstn.exotel.com>
To: <sip:+911234567890@yourbot.fqdn.com>
Contact: <sip:+918888888888@182.76.143.61:5060;transport=tls>
```

## SDP Media Format Example

```
v=0
o=root 1683048786 1683048786 IN IP4 182.76.143.61
c=IN IP4 182.76.143.61
t=0 0
m=audio 37456 RTP/AVP 8 0 96
a=rtpmap:8 PCMA/8000
a=rtpmap:0 PCMU/8000
a=rtpmap:96 telephone-event/8000
a=fmtp:96 0-15
a=sendrecv
a=ptime:20
```

Ensure your bot:

- Accepts PCMA/PCMU codecs
- Handles RTP and optionally DTMF (RFC 2833)
- Responds with 200 OK containing valid SDP

## Sample TLS Configuration (Asterisk)

```ini
[general]
externip = YOUR.PUBLIC.IP
localnet = 192.168.0.0/16

[exotelvsip]
type = friend
context = incoming
host = pstn.in2.exotel.com
port = 443
transport = tls
disallow = all
allow = alaw
allow = ulaw
encryption = yes
canreinvite = no
nat = force_rport
insecure = port
```

## Network & Firewall Settings

| Type | Protocol | Direction | Ports |
|------|----------|-----------|-------|
| SIP Signaling | TCP | Bi-directional | 5070 |
| SIP Signaling | TLS | Bi-directional | 443 |
| RTP Media | UDP | Bi-directional | 10000-20000 |

:::warning
Ensure Exotel edge PoP IPs are whitelisted (Mumbai, KA, Singapore). See the [Overview](./overview.md) for the full IP list.
:::

## Bot Behavior Checklist

- Accept INVITE, send 200 OK with SDP
- Accept and decode RTP (PCMA or PCMU)
- Handle DTMF (RFC 2833) if applicable
- Return bot-generated TTS response over RTP
- Respond to BYE or issue BYE on hang-up

## Testing Checklist

| Component | What to Verify |
|-----------|----------------|
| INVITE Reception | Bot receives Exotel INVITE |
| SDP Parsing | Correct codec/media negotiation |
| RTP Inbound | Audio from caller reaches bot |
| RTP Outbound | Bot sends TTS response |
| DTMF Processing | Keypress inputs via RFC2833 parsed correctly |
| BYE Handling | Call cleanly terminated from both ends |

## Debugging Tools

- `sip set debug on` (Asterisk) or `trace` (FreeSWITCH)
- **Wireshark**: SIP ladder + RTP stream validation
- **sngrep**: Dialogs, SDP, and DTMF traces

## Best Practices

- Use FQDN for DNS-based routing in cloud infra
- TLS + SRTP for encrypted sessions
- Short DNS TTL (30-60s) for fast failover
- Validate PAI header integrity (Leg1 CLI)
- Prefer PCMA codec (G.711 A-law)

:::tip RTP Media Guidelines
- Limit media ports to 10000-20000 (10K ports)
- Each session uses 2 ports
- Media infra supports 3000 concurrent calls
- 50% buffer ensures capacity for retries/failovers
:::

## Recommended SIP Clients for Bots

| Client | Description | Usage Scenario |
|--------|-------------|----------------|
| Asterisk | Full SIP server; used internally by Exotel | Production-grade bot orchestration |
| PJSIP | Lightweight SIP + media stack with bindings for C++, Python | Direct integration with AI pipeline |
| baresip | Minimal SIP CLI client for automation | Quick testing / CI / Dev workflows |

Ensure support for:
- G.711 A-law (PCMA)
- DTMF via RFC 2833
- TLS + SRTP (optional but recommended)
- SIP FQDN handling if hosted in cloud

## Outbound Call Integration via Exotel Flow

When outbound calling is required from Exotel to a SIP bot:

### Supported Pattern

1. Use Exotel's **Make-a-Call API** to dial the customer
2. Use a **Connect Applet** in the assigned Flow to bridge the call to a SIP bot (as Leg B)

### API Call (Make-a-Call)

```
POST /v1/Accounts/<AccountSid>/Calls/connect.json

{
  "From": "+919999999999",
  "To": "+918888888888",
  "CallerId": "+912261234567",
  "Url": "https://my.exotel.com/flow-control/flow/<flow-id>"
}
```

### In Flow

- Use **Connect Applet**
- Configure "Dial Whom":

```
sip:+918888888888@sip.botplatform.com:5070;transport=tcp
```

### Call Flow

1. Exotel dials Leg A (customer)
2. On answer, Leg B is initiated to SIP bot
3. SIP INVITE goes from Exotel to the bot

:::warning
This is the only supported outbound architecture. Direct SIP to Exotel for outbound is not supported in this mode.
:::

---

## Related

- [SIP Trunking Overview](./overview.md)
- [Master Support Guide](./master-guide.md)
- [Flow Integration Guide](./flow-integration.md)
- [Flow and API Configuration](./flow-api-configuration.md)
- [TCP Integration Guide](./tcp-integration.md)
- [TLS Integration Guide](./tls-integration.md)
- [FQDN-based Integration](./fqdn-integration.md)
