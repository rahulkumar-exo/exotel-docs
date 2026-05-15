---
id: tcp-integration
title: SIP Trunking TCP Integration Guide (Mumbai)
description: Technical guide for integrating Exotel SIP Trunking over TCP via the Mumbai PoP, including SIP headers, configuration, and testing steps.
sidebar_label: TCP Integration (Mumbai)
sidebar_position: 5
---

# Exotel SIP Trunking -- TCP (Mumbai) -- Customer Integration Guide

This guide provides enterprise customers with technical steps to integrate Exotel's SIP Trunking with your PBX, SIP server, or SBC over TCP via the Mumbai PoP. It outlines configuration practices, header formats, best practices, and validation techniques.

:::note Alpha Release
This Alpha release is intended for controlled pilots and is not SLA-backed for production workloads.
:::

## Product Overview

Exotel's SIP Trunking (Alpha) allows secure SIP-based PSTN call origination and termination between your SIP infrastructure and Exotel's platform using IP authentication.

| Parameter | Value |
|-----------|-------|
| **Call Type** | PSTN \<-\> SIP Gateway Interconnect |
| **Transport** | SIP over TCP (Port 5070) |
| **Media** | RTP over UDP (Ports 10000-40000) |
| **Authentication** | IP Whitelisting (Registration-based auth not supported) |
| **Edge Location** | Mumbai PoP (India) |

:::caution SIP Trunking Throttling
Exotel enforces a default SIP Trunking rate-limit of **200 calls per minute (CPM)** per trunk to safeguard carrier capacity and call quality.

If your traffic profile requires a higher burst rate, raise a request via your CSM or Support ticket. The capacity-planning team will review historical traffic, carrier limits, and QoS requirements and can increase the throttling threshold accordingly.
:::

## Required Configuration

### IP Whitelisting

- Your static public IP must be whitelisted by Exotel.
- Registration (SIP REGISTER) is not supported.

### Ports to Open

| Type | Port Range | Protocol | Purpose |
|------|------------|----------|---------|
| Signaling | 5070 | TCP | SIP signaling |
| Media | 10000-40000 | UDP | RTP streams |

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

Use this proxy for configuring Exotel as a peer/trunk on your SBC or PBX.

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
port = 5070
transport = tcp
disallow = all
allow = alaw
allow = ulaw
nat = force_rport
insecure = port
canreinvite = no
sendrpid = yes
trustrpid = yes
relaxdtmf = yes
```

## SIP Message Format

### A. INVITE from Exotel Trunk (Exotel to Customer)

This is triggered when Exotel routes an inbound call to the customer SIP gateway over TCP.

#### Sample SIP INVITE

```sip
INVITE sip:+91XXXXXXXXXX@<customer-ip>:5061;transport=tcp SIP/2.0
Record-Route: sip:<exotel-ip>:443;transport=tls;lr
Via: SIP/2.0/TCP <exotel-ip>:443;branch=z9hG4bK2414...
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
Contact: <sip:+91AAAAAAAAAA@<public-ip>:port;transport=tcp>
Content-Type: application/sdp
Content-Length: 1168
Max-Forwards: 67

v=0
o=root 1683048786 1683048786 IN IP4 <exotel-media-ip>
c=IN IP4 <exotel-media-ip>
t=0 0
m=audio 37456 RTP/AVP 8 0 96
a=rtpmap:8 PCMA/8000
a=rtpmap:0 PCMU/8000
a=rtpmap:96 telephone-event/8000
a=fmtp:96 0-15
a=sendrecv
a=rtcp:37457
a=ptime:20
```

#### Header Reference -- INVITE from Exotel

| Header | Mandatory | Description |
|--------|-----------|-------------|
| Request URI | Yes | Destination SIP URI (Exophone mapped to customer SIP IP) |
| Via | Yes | Routing path for SIP responses. Uses TCP in this case |
| Record-Route | Optional | Ensures Exotel remains in signaling path for subsequent requests |
| From | Yes | Caller party number (CLI) received by Exotel (e.g., end-user) |
| To | Yes | Exophone provisioned by Exotel for this customer |
| Call-ID | Yes | Unique identifier for the call |
| CSeq | Yes | Command sequence number, must increment with each new transaction |
| Allow | Yes | List of SIP methods supported by Exotel |
| Supported | Optional | SIP extensions like `replaces`, `timer` |
| X-Exotel-CallSid | Yes | Unique ID for the call session (tracking/debugging) |
| X-Exotel-LegSid | Optional | Call leg identifier; unique to this direction of the call |
| X-Exotel-TrunkSid | Optional | Identifies which SIP trunk was used |
| P-Asserted-Identity | Optional | Validated caller ID presented to customer SIP server |
| P-Early-Media | Optional | Indicates support for early media before call is answered |
| Contact | Optional | Where Exotel can be reached for further in-dialog SIP messages |
| Content-Type | Yes | Indicates media description follows (SDP) |
| Content-Length | Yes | Length of the SDP body |
| Max-Forwards | Yes | Prevents infinite loops by limiting hop count |
| SDP (v=...) | Yes | Contains RTP setup: IP, codecs (PCMA/PCMU), RTP/DTMF, etc. (unencrypted RTP) |

### B. INVITE to Exotel Trunk (Customer to Exotel)

Customer initiates an outbound call over TCP, using a registered Exophone as the CLI and targeting any mobile/landline via Exotel.

#### Sample SIP INVITE

```sip
INVITE sip:+91YYYYYYYYYY@<exotel-ip>:5070 SIP/2.0
Via: SIP/2.0/TCP <customer-ip>:5061;branch=z9hG4bKbK4041f853
Max-Forwards: 70
From: "+91XXXXXXXXXX" <sip:+91XXXXXXXXXX@exotelt.pstn.exotel.com>;tag=as63e4d7f1
To: <sip:+91YYYYYYYYYY@<exotel-ip>>
Contact: <sip:+91XXXXXXXXXX@<customer-ip>:5061;transport=tcp>
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
m=audio 18232 RTP/AVP 8 0 101
a=rtpmap:8 PCMA/8000
a=rtpmap:0 PCMU/8000
a=rtpmap:101 telephone-event/8000
a=fmtp:101 0-16
a=ptime:20
a=maxptime:150
a=sendrecv
```

#### Header Reference -- INVITE to Exotel

| Header | Mandatory | Description |
|--------|-----------|-------------|
| Request URI | Yes | Final destination number (callee) to be dialed via Exotel trunk |
| Via | Yes | Describes how to return SIP responses to customer (over TCP) |
| From | Yes | CLI being used -- must be a valid Exophone registered with Exotel |
| To | Yes | Destination number (callee, Called Party Number); not used for routing |
| Call-ID | Yes | Unique identifier for the call session |
| CSeq | Yes | SIP sequence number and method (e.g., INVITE) |
| Contact | Optional | Where Exotel can reach back for in-dialog requests |
| Allow | Yes | Methods supported by customer |
| Supported | Optional | SIP extensions |
| Content-Type | Yes | MIME type of message body (SDP) |
| Content-Length | Yes | Byte length of SDP content |
| Max-Forwards | Yes | Used to control and limit SIP hops |
| SDP (v=...) | Yes | Media negotiation block, including codecs and ports. RTP only (unencrypted) |

### CLI and Exophone Roles

| Direction | From (CLI) | Request URI (Destination) | Notes |
|-----------|-----------|--------------------------|-------|
| Exotel to You | Customer's end-user CLI | Your SIP URI (Exophone) | Used in inbound flows to your system |
| You to Exotel | Your Exophone (CLI) | Final user number to dial | Must use registered CLI in From, else call will be rejected |

## Best Practices and Pre-checks

### Before Configuration

- Confirm you have a static public IP with no CG-NAT or port masking
- Make sure your firewall allows TCP 5070 and UDP 10000-40000 bidirectionally
- Validate that your PBX/SBC supports SIP over TCP and G.711 codecs (PCMA/PCMU)

### During Configuration

- Prefer PCMA as the first codec in media negotiations; PCMU as fallback
- Disable registration and use static peer trunking
- Use `nat=force_rport` for NAT traversal if behind a firewall
- Monitor and log `Call-ID`, `X-Exotel-*` headers for debugging

### After Configuration

- Run test calls and inspect SIP INVITEs and RTP
- Monitor audio quality, latency, and early media (ringback)
- Use `tcpdump` or `sngrep` to validate SIP dialogues and media ports

:::tip Quick Sanity Checks
- **Transport match** -- your `Via: ...;transport=tcp` must align with port 5070
- **Caller-ID hygiene** -- the `From:` number in your outbound INVITE must be an authorised CLI/Exophone
- **Log Exotel headers** -- `X-Exotel-CallSid`, `LegSid`, `TrunkSid` are read-only but invaluable for troubleshooting
:::

## How to Test Your Setup

### Inbound Test (Exotel to Your SIP Server)

1. Trigger a call to your Exotel VN mapped to the SIP trunk
2. Check if your server receives an INVITE from `pstn.in2.exotel.com`
3. Confirm RTP is flowing from `182.76.143.61` or `122.15.8.184`

### Outbound Test (Your Server to Exotel)

1. Send a SIP INVITE to `pstn.in2.exotel.com:5070` with the To URI set to a valid destination (e.g., mobile number)
2. Ensure correct formatting of headers and the contact field
3. Look for 100/180/200 OK responses and RTP flow

## Troubleshooting

| Issue | Potential Cause | Resolution |
|-------|----------------|------------|
| No INVITE received | IP not whitelisted | Contact Exotel to confirm IP ACL |
| Call drops in 30s | NAT binding lost | Enable symmetric RTP / `force_rport` |
| One-way audio | Media ports blocked | Open UDP 10000-40000 |
| 403 Forbidden | Incorrect domain or auth | Use correct `fromdomain` and no auth creds |

## Support and Next Steps

This guide covers Exotel SIP Trunking over TCP via the Mumbai PoP under the Alpha release. Production deployment readiness (with TLS, SRTP, failover, dashboards) will be announced during the GA phase.

For support:
- Contact your Exotel account manager
- Or raise a ticket via [hello@exotel.com](mailto:hello@exotel.com) with:
  - Account SID
  - Call time and number
  - SIP trace logs (.pcap or .txt)

---

## Related

- [SIP Trunking Overview](./overview.md)
- [Master Support Guide](./master-guide.md)
- [TLS Integration Guide](./tls-integration.md)
- [FQDN-based Integration](./fqdn-integration.md)
- [Flow Integration Guide](./flow-integration.md)
