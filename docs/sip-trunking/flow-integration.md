---
id: flow-integration
title: SIP Trunking to Flow Integration Guide
description: Guide for routing inbound SIP calls from external SIP systems into Exotel Flow Applets including IVR and agent connect scenarios.
sidebar_label: Flow Integration
sidebar_position: 7
---

# Exotel SIP Trunking to Flow Integration Guide

This guide outlines how to integrate Exotel's SIP Trunking with your voice application flow (e.g., IVR or agent connect) using SIP signaling. It focuses on the use case of routing inbound SIP calls from external SIP systems into Exotel Flow Applets.

:::note Alpha Release
This guide covers the Alpha release of SIP Trunking-to-Flow integration.
:::

## Use Case: External SIP System to Exotel Flow

This guide is meant for customers who:

- Host their own SIP PBX or Bot Platform
- Want to initiate SIP calls into Exotel to trigger flows (like Connect or IVR)
- Require SIP-over-TLS or TCP transport

### Example Scenarios

| Scenario | Description |
|----------|-------------|
| SIP Bot to Exotel Flow | External SIP bot initiates call to Exotel VN, Exotel triggers IVR flow |
| SIP PBX to Exotel Flow | SIP endpoint dials into Exotel Flow for agent routing or IVR processing |
| Regional SIP to Flow (cross-border PoP) | Enterprise infra routes call to Exotel PoP (SG/Mum/KA) for flow handling |

## SIP Integration Requirements

### What You Need to Share with Exotel

- Account SID
- Exophone (VN) that should route to flow
- Source IP or FQDN from where SIP INVITE will originate
- Transport type (TCP/TLS)

:::caution SIP Trunking Throttling
Exotel enforces a default SIP Trunking rate-limit of **200 calls per minute (CPM)** per trunk to safeguard carrier capacity and call quality.

If your traffic profile requires a higher burst rate, raise a request via your CSM or Support ticket. The capacity-planning team will review historical traffic, carrier limits, and QoS requirements and can increase the throttling threshold accordingly.
:::

### What Exotel Will Do

- Provision SIP trunk mapping on the VN
- Route incoming INVITE on SIP trunk to your assigned Flow (via Connect Applet)

## SIP Configuration Reference (Customer Side)

Here is an Asterisk-style example for TLS:

```ini
[general]
externip = <your_public_ip>
localnet = 192.168.0.0/16

[exotelvsip]
type = friend
context = outgoing
fromdomain = <accountsid>.pstn.exotel.com
host = pstn.sgp1.exotel.com
port = 443
transport = tls
disallow = all
allow = ulaw
allow = alaw
nat = force_rport
insecure = port
canreinvite = no
sendrpid = yes
trustrpid = yes
relaxdtmf = yes
encryption = yes
```

### Ports to Open

| Type | Port | Protocol | Description |
|------|------|----------|-------------|
| SIP | 443 / 5070 | TLS/TCP | SIP signaling |
| RTP Media | 10000-40000 | UDP | Media/audio ports |

## Sample SIP INVITE to Exotel (Flow Integration)

```sip
INVITE sip:+91XXXXXXXXXX@pstn.sgp1.exotel.com SIP/2.0
Via: SIP/2.0/TLS your-sbc.domain.com:5061;branch=z9hG4bK4041f853
From: "+91YYYYYYYYYY" <sip:+91YYYYYYYYYY@exotelt.pstn.exotel.com>;tag=as63e4d7f1
To: <sip:+91XXXXXXXXXX@pstn.sgp1.exotel.com>
Call-ID: abcdef1234567890@exotelt.pstn.exotel.com
CSeq: 102 INVITE
Contact: sip:+91YYYYYYYYYY@your-sbc.domain.com:5061;transport=tls
Allow: INVITE, ACK, CANCEL, OPTIONS, BYE, REFER, SUBSCRIBE, NOTIFY, INFO, PUBLISH, MESSAGE
Supported: replaces, timer
X-Exotel-AccountSid: exotelt
Content-Type: application/sdp
```

## Header Reference -- SIP INVITE to Exotel (Flow Integration)

| Header | Mandatory | Example | Description |
|--------|-----------|---------|-------------|
| Request URI | Yes | `sip:+91XXXXXXXXXX@pstn.in2.exotel.com` | Target Exophone (VN) to route the call into a Flow or PSTN leg |
| X-Exotel-AccountSid | Yes | `Exxxxxx` | Identifies your Exotel account. Required for Flow integration (Tenant name) |
| Via | Yes | `SIP/2.0/TLS your-sbc.domain.com:5061` | Your SBC's transport, used by Exotel to route responses |
| From | Yes | Caller number | CLI of Customer (Callee) |
| To | Yes | Exophone number | Exophone |
| Contact | Yes | Your contact URI | Your contact URI for Exotel to send 200 OK, BYE, and other dialog messages |
| Call-ID | Yes | `abc123xyz@your-sbc` | Unique identifier for SIP session; echoed in Exotel response |
| CSeq | Yes | `102 INVITE` | SIP sequence number |
| Max-Forwards | Yes | `70` | Prevents SIP loops by limiting hops |
| Supported | Optional | `replaces, timer` | Advertises SIP extensions your UA supports |
| Allow | Optional | `INVITE, ACK, BYE, CANCEL, OPTIONS` | SIP methods your SBC is willing to process |
| Content-Type | Yes | `application/sdp` | Indicates the message contains SDP for media negotiation |

:::warning Important Notes
- **Only use `X-Exotel-AccountSid` for Flow routing.** This is essential for Exotel to associate the call with the correct Flow.
- **Do not add** `X-Exotel-CallSid`, `X-Exotel-LegSid`, or `X-Exotel-TrunkSid`. These headers are auto-injected by Exotel in the inbound leg.
- Ensure your SIP infrastructure handles:
  - G.711 PCMA (preferred codec)
  - SIP over TLS (port 443)
  - SRTP if TLS is enabled
:::

## Edge PoPs and IPs to Whitelist

| Region | SIP Proxy FQDN | Media IPs |
|--------|----------------|-----------|
| Karnataka | `pstn.in1.exotel.com` | 14.194.10.247, 61.246.82.75 |
| Mumbai | `pstn.in2.exotel.com` | 182.76.143.61, 122.15.8.184 |
| Singapore | `pstn.sgp1.exotel.com` | 18.142.150.245, 122.248.223.73 |
| KSA (upcoming) | coming soon | coming soon |

## Testing Steps

1. Place a SIP INVITE to the Exophone you have been assigned
2. Confirm that the call lands in the expected flow (e.g., Connect applet rings agent)
3. Use `sngrep`, `sip set debug on`, or Wireshark to validate SIP path
4. Ensure RTP is established from your system to Exotel's media IP

## Best Practices

- Ensure Exophone is mapped to a live flow before testing
- Always share your SIP signaling IP/FQDN and transport in advance
- Prefer PCMA (G.711 A-law) for better regional PSTN compatibility
- Use TLS transport when possible to ensure encryption and SRTP
- Confirm DNS resolves FQDN correctly if not using static IP

## Support

- Contact your Exotel Account Manager with:
  - Account SID
  - Flow/Exophone ID
  - SIP signaling IP or FQDN
  - Preferred Transport (TCP or TLS)
- Technical Help:
  - [support.exotel.com](https://support.exotel.com)
  - Share call samples and SIP logs for troubleshooting

---

## Related

- [SIP Trunking Overview](./overview.md)
- [Master Support Guide](./master-guide.md)
- [Flow and API Configuration Guide](./flow-api-configuration.md)
- [TCP Integration Guide](./tcp-integration.md)
- [TLS Integration Guide](./tls-integration.md)
