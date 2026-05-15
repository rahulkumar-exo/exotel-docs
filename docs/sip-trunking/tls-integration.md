---
id: tls-integration
title: SIP Trunking TLS Integration Guide (Mumbai)
description: Technical guide for integrating Exotel SIP Trunking over TLS via the Mumbai PoP with encrypted SIP signaling and SRTP media.
sidebar_label: TLS Integration (Mumbai)
sidebar_position: 4
---

# Exotel SIP Trunking -- TLS (Mumbai) -- Customer Integration Guide

This guide provides technical integration steps for enterprise customers setting up Exotel's SIP Trunking over TLS via the Mumbai PoP. It includes configuration guidelines, SIP headers, and best practices for secure SIP-based PSTN interconnects.

:::note Alpha Release
The Alpha version is designed for pilot usage and is not covered by production-grade SLAs.
:::

## Product Overview

Exotel's SIP Trunking (Alpha) over TLS enables secure, encrypted PSTN call origination and termination between your SIP infrastructure and Exotel's platform.

| Parameter | Value |
|-----------|-------|
| **Call Type** | PSTN \<-\> SIP Gateway Interconnect |
| **Transport** | SIP over TLS (Port 443) |
| **Media** | Secure RTP (SRTP) over UDP (Ports 10000-40000) |
| **Authentication** | IP Whitelisting (no SIP registration) |
| **Edge Location** | Mumbai PoP (India) |

:::caution SIP Trunking Throttling
Exotel enforces a default SIP Trunking rate-limit of **200 calls per minute (CPM)** per trunk to safeguard carrier capacity and call quality.

If your traffic profile requires a higher burst rate, raise a request via your CSM or Support ticket. The capacity-planning team will review historical traffic, carrier limits, and QoS requirements and can increase the throttling threshold accordingly.
:::

## Required Configuration

### IP Whitelisting

- Provide your static public IP to Exotel for ACL entry
- Dynamic IPs or NAT setups are not recommended

### Ports to Open

| Type | Port Range | Protocol | Purpose |
|------|------------|----------|---------|
| Signaling | 443 | TCP | SIP over TLS |
| Media | 10000-40000 | UDP | SRTP streams |

### SIP Domain and Proxy Details

**Media Server PoP**

| Region | Media IPs |
|--------|-----------|
| Mumbai DC | 182.76.143.61, 122.15.8.184 |
| KA DC | 14.194.10.247, 61.246.82.75 |

**Signaling Server PoP**

| Region | Proxy FQDN |
|--------|------------|
| Mumbai DC | `pstn.in2.exotel.com` |
| Mumbai Cloud | `pstn.in4.exotel.com` |

Use this FQDN in your trunk peer setup.

## Sample Configuration -- Asterisk PBX

```ini
[general]
externip = <your_public_ip>
localnet = 192.168.0.0/16

[exotelvsip]
type = friend
context = incoming
fromdomain = <accountsid>.pstn.exotel.com
host = pstn.in2.exotel.com
port = 443
transport = tls
disallow = all
allow = alaw
allow = ulaw
nat = force_rport
insecure = port
canreinvite = no
sendrpid = yes
trustrpid = yes
relaxdtmf = yes
encryption = yes
```

## SIP Message Format

### A. INVITE from Exotel Trunk (Exotel to Customer)

When a customer receives an inbound call from Exotel over TLS, Exotel uses the customer's SIP URI as the request URI and includes customer CLI, Exophone, and media parameters securely.

#### Sample SIP INVITE (Inbound)

```sip
INVITE sip:+91XXXXXXXXXX@<customer-ip>:5061;transport=tls SIP/2.0
Record-Route: sip:<exotel-ip>:443;transport=tls;lr
Via: SIP/2.0/TLS <exotel-ip>:443;branch=z9hG4bK2414...
From: "+91AAAAAAAAAA" <sip:+91AAAAAAAAAA@exotelt.pstn.exotel.com>;tag=as2aefddf2
To: <sip:+91XXXXXXXXXX@<customer-ip>>
Call-ID: <UUID>@pstn.mum1.exotel.com
CSeq: 102 INVITE
Allow: INVITE, ACK, CANCEL, OPTIONS, BYE, REFER, SUBSCRIBE, NOTIFY, INFO, PUBLISH, MESSAGE
Supported: replaces
X-Exotel-LegSid: <leg-id>
X-Exotel-CallSid: <call-id>
X-Exotel-TrunkSid: <trunk-id>
P-Asserted-Identity: <sip:+91AAAAAAAAAA@exotelt.pstn.exotel.com>
P-Early-Media: supported
Contact: <sip:+91AAAAAAAAAA@<public-ip>:port;transport=tls>
Content-Type: application/sdp
Content-Length: 1168
Max-Forwards: 67

v=0
o=root 1683048786 1683048786 IN IP4 <exotel-media-ip>
c=IN IP4 <exotel-media-ip>
t=0 0
m=audio 37456 RTP/SAVP 8 0 96
a=rtpmap:8 PCMA/8000
a=rtpmap:0 PCMU/8000
a=rtpmap:96 telephone-event/8000
a=fmtp:96 0-15
a=sendrecv
a=rtcp:37457
a=ptime:20
a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:<srtp-key>
```

:::note
Note the use of `RTP/SAVP` (Secure Audio Video Profile) and the `a=crypto` line for SRTP key exchange. This is the key difference from TCP which uses `RTP/AVP`.
:::

#### Header Reference -- INVITE from Exotel

| Header | Mandatory | Description |
|--------|-----------|-------------|
| Request URI | Yes | Destination SIP URI (customer Exophone) |
| From | Yes | Caller CLI shown to customer -- e.g., original end-user number |
| To | Yes | Exophone provisioned in Exotel system |
| X-Exotel-CallSid | Yes | Unique identifier for this call session |
| X-Exotel-LegSid | Optional | Unique identifier for this leg of the call |
| X-Exotel-TrunkSid | Optional | Exotel trunk ID through which the call is routed |
| P-Asserted-Identity | Optional | Caller ID verification (especially for CLI masking) |
| Contact | Optional | Contact URI of SIP UA for future dialog messages |
| Content-Type / SDP | Yes | Contains secure media negotiation (RTP/SAVP with crypto key) |

### B. INVITE to Exotel Trunk (Customer to Exotel)

This message is used when the customer initiates a secure outbound call using their Exophone as CLI. TLS is used for SIP signaling, and SRTP for media encryption.

#### Sample SIP INVITE (Outbound)

```sip
INVITE sip:+91YYYYYYYYYY@<exotel-ip>:5070 SIP/2.0
Via: SIP/2.0/TLS <customer-ip>:5061;branch=z9hG4bKbK4041f853
Max-Forwards: 70
From: "+91XXXXXXXXXX" <sip:+91XXXXXXXXXX@exotelt.pstn.exotel.com>;tag=as63e4d7f1
To: <sip:+91YYYYYYYYYY@<exotel-ip>>
Contact: <sip:+91XXXXXXXXXX@<customer-ip>:5061;transport=tls>
Call-ID: <UUID>@exotelt.pstn.exotel.com
CSeq: 102 INVITE
Allow: INVITE, ACK, CANCEL, OPTIONS, BYE, REFER, SUBSCRIBE, NOTIFY, INFO, PUBLISH, MESSAGE
Supported: replaces, timer
Content-Type: application/sdp
Content-Length: 371

v=0
o=root 1002281923 1002281923 IN IP4 <customer-media-ip>
c=IN IP4 <customer-media-ip>
t=0 0
m=audio 18232 RTP/SAVP 8 0 101
a=rtpmap:8 PCMA/8000
a=rtpmap:0 PCMU/8000
a=rtpmap:101 telephone-event/8000
a=fmtp:101 0-16
a=ptime:20
a=maxptime:150
a=sendrecv
a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:<srtp-key>
```

#### Header Reference -- INVITE to Exotel

| Header | Mandatory | Description |
|--------|-----------|-------------|
| Request URI | Yes | Number to be dialed (callee) via Exotel's SIP IP |
| From | Yes | CLI of customer (must be Exophone registered with Exotel) |
| To | Yes | Callee number (may not affect routing) |
| Contact | Optional | Customer's contact URI for SIP dialog continuation |
| Call-ID | Yes | Unique SIP session ID from the customer's SIP server |
| CSeq | Yes | Command sequence used in SIP transactions |
| Allow | Yes | Supported SIP verbs |
| Supported | Optional | SIP extensions like `replaces`, `timer` |
| Content-Type / SDP | Yes | Secure media parameters, codecs, ports, and SRTP crypto key (RTP/SAVP) |

### Key Identity Fields

| Direction | Caller ID (CLI) in From | Called Number in Request URI | Comment |
|-----------|------------------------|----------------------------|---------|
| Exotel to Customer | Customer's CLI (real caller) | Exophone assigned to the customer | CLI passed to customer via Exotel trunk |
| Customer to Exotel | Exophone (as CLI) | Final user's number | Exotel uses From to verify CLI |

## Best Practices and Pre-checks

- Use only static IPs and TLS-compliant SBCs
- Validate G.711 codec support with PCMA as preferred
- Confirm SRTP support and crypto attribute handling in your SIP stack
- Avoid SIP ALG or NAT devices without explicit RTP pinholes

## How to Test Your Setup

### Inbound Test (Exotel to Your SIP Server)

1. Map a VN to your SIP trunk in the dashboard
2. Dial the VN and capture traffic via `sngrep` or `tcpdump`
3. Confirm receipt of TLS INVITE and correct SRTP flow

### Outbound Test (Your SIP Server to Exotel)

1. Initiate SIP INVITE to `pstn.in2.exotel.com:443`
2. Confirm 200 OK with SRTP attributes negotiated
3. Check the RTP/SAVP audio path and Exotel response headers

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| No INVITE received | IP not whitelisted | Confirm ACL entry with Exotel support |
| 403 Forbidden | Wrong domain or auth config | Check the `fromdomain` and peer trunk settings |
| Call drops in 30s | RTP timeout or NAT | Enable symmetric RTP / `force_rport` |
| No audio | SRTP failure or media block | Confirm UDP 10000-40000 and SRTP config |

## Support and Next Steps

This guide documents Exotel SIP Trunking over TLS via Mumbai PoP under the Alpha release. Future GA versions will include additional security layers, reporting, and failover routing.

For support:
- Contact your Exotel account manager
- Or file a ticket via [hello@exotel.com](mailto:hello@exotel.com) with:
  - Account SID
  - Timestamp of test
  - SIP trace logs (.pcap or raw headers)

---

## Related

- [SIP Trunking Overview](./overview.md)
- [Master Support Guide](./master-guide.md)
- [TCP Integration Guide](./tcp-integration.md)
- [FQDN-based Integration](./fqdn-integration.md)
- [Flow Integration Guide](./flow-integration.md)
