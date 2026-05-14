---
id: flow-api-configuration
title: Flow and API Configuration for Voice AI & CC Platforms
description: API-driven configuration guide for Voice AI and Contact Centre platforms integrating with Exotel SIP Trunking for PSTN connectivity in India.
sidebar_label: Flow & API Configuration
sidebar_position: 3
---

# Flow and API Configuration Guide for Voice AI & Contact Centre Platforms via Exotel SIP Trunking

This guide provides a comprehensive, API-driven setup for Voice AI and Contact Center (CC) platforms to integrate with Exotel's SIP Trunking for compliant PSTN connectivity in India.

## Background & Objective

Voice AI and Contact Center (CC) platforms often operate robust SIP-based (SIP Trunking) infrastructures for AI-led and agent-assisted conversations. However, they typically lack direct access to India's PSTN (landline and mobile networks) due to licensing and regulatory restrictions.

Exotel, operating as a Unified License (UL) Virtual Network Operator (VNO), bridges this gap by offering compliant PSTN ingress/egress via its SIP Trunking solution.

### Objectives

- Enable Voice AI and Contact Center platforms to access Indian PSTN via Exotel's UL VNO
- Provide a plug-and-play SIP trunking layer without disrupting existing bot or agent logic
- Support both inbound and outbound PSTN call flows using Exotel's SIP Trunking infrastructure
- Streamline onboarding via APIs for trunk creation, DID mapping, and IP whitelisting

### Ideal For

- Voice AI platforms using SIP-based infrastructure (e.g., FreeSWITCH, Kamailio, Asterisk, custom SBCs)
- Contact Center platforms with on-prem or cloud SIP setups requiring PSTN termination or origination
- Companies seeking elastic and compliant PSTN connectivity without managing telco licensing
- AI-led and hybrid inbound/outbound voice workflows

## Solution Overview

### Architecture

- **Partner Side**: Existing SIP Trunking Endpoint / SBC / PBX (Voice AI or CC layer)
- **Exotel Side**: UL VNO SIP Gateway connected to Indian PSTN via multiple telcos

**Connectivity Options:**
- Public Internet (default)
- MPLS or VPN (optional for BFSI/secure deployments; contact CSM)

**Media:** RTP/SRTP, supporting PCMA (G.711 A-law) and PCMU (G.711 u-law)

**Signaling:** SIP over TCP or TLS

**Call Flow:**
- **Outbound:** Partner SBC sends SIP INVITE (only from static IP) -> Exotel SIP Gateway -> Indian PSTN -> Customer Phone
- **Inbound:** PSTN Call -> Exotel DID -> SIP INVITE (from static IP or FQDN) to Partner SBC (for bot or agent)

:::tip
For detailed SIP message format and header reference, see:
- [TCP Integration Guide](./tcp-integration.md)
- [TLS Integration Guide](./tls-integration.md)
:::

### Key Capabilities

- Dynamic Channel Allocation for scale management
- Multi-Telco Failover with 100% connectivity SLA
- DID Management: Purchase & KYC compliant with Indian regulations
- Secure Interconnects: IP whitelisting, TLS support
- Regulatory Compliance: SDCA mapping, lawful interception readiness

## Onboarding & Integration

### Step 1: Exotel Account Setup & KYC

1. **Create Account** -- [Sign up on Exotel](https://my.in.exotel.com/auth/register) and select Browser Calling during setup
2. **Complete KYC/CAF** -- [Upload KYC Documents](https://support.exotel.com/support/solutions/articles/35760)

### Step 2: SIP Trunk Enablement

1. **Enable SIP Trunking** -- Email hello@exotel.com to activate trunking & provision a Virtual Number/Exophone
2. **Retrieve API Credentials** -- Visit [API Settings](https://my.in.exotel.com/apisettings/site#api-credentials) to get `account_sid`, `key`, and `token`

:::note
To configure silence ring or remove ring duration, contact your Exotel CSM or email hello@exotel.com
:::

### Step 3: Trunk Configuration via API

**Resources:**
- [GitHub Repo](https://github.com/exotel/exotel-vsip-trunk-Configuration-API)
- [Postman Collection](https://www.postman.com/grey-star-272776/exotel-vsip-trunk-configuration-apis/collection/u3vmluu/exotel-vsip-trunk-apis)

**API Steps:**

1. **Create Trunk** -- `POST /trunks`
2. **Map DIDs** -- `POST /trunks/{trunk_sid}/phone-numbers`
3. **Whitelist IPs** -- `POST /trunks/{trunk_sid}/whitelisted-ips`
4. **Add Destination URIs** (TCP, TLS)
5. **Set `trunk_external_alias`** for VN-FQDN mapping if required (for VAPI, LiveKit, etc.)

## Inbound Call Setup (PSTN to SIP Platform)

1. Create a Flow using **Connect Applet** in App Bazaar
2. Use `sip:<TrunkID>` in the **Dial Whom** field
3. For custom routing, use a **Dynamic URL** to fetch destination URI and pass headers
4. Supports up to 3 custom SIP headers, e.g., `X-param1=value1` (max 200 bytes total)

:::warning
Headers prefixed with `Exotel-` or `Veeno-` are platform-reserved and cannot be used as custom headers.
:::

### Connect Applet -- Dynamic URL Response Example

```json
{
  "fetch_after_attempt": false,
  "destination": { "trunk": "trunk-2134" },
  "custom_params": "param1=value1&param2=value2",
  "record": true,
  "recording_channels": "dual"
}
```

For more details, see the [Connect Applet -- Dynamic URL documentation](https://support.exotel.com/support/solutions/articles/3000096873).

## Outbound Call Setup (Platform to PSTN)

### Static IP Setup

1. Request IP whitelisting via [Exotel Support](https://support.exotel.com/support/solutions/folders/3000023599) or use the API repo above
2. Once approved, initiate SIP outbound calls to Indian PSTN

### FQDN-based Setup (API-triggered)

1. Configure trunk destination via API (only for FQDN-based use cases)
2. Use [Click-to-Call API](https://developer.exotel.com/api/make-a-call-api#call-customer) or [Connect Customer to Flow API](https://developer.exotel.com/api/make-a-call-api#call-customer)
3. Set destination as `sip:<TrunkID>` in Connect Applet

## Voicebot to Agent Handoff (SIP Trunking Flow)

### Flow

1. Voicebot runs on Connect Applet over SIP Trunking
2. Bot disconnects -> Flow moves to **Passthru Applet** -> calls webhook
3. Webhook Response:
   - **200 OK**: Route to Connect Applet (agent group or SIP trunk)
   - **302/404**: Move to Hangup Applet

**Example:**
User says "Talk to human" -> Bot ends -> Passthru Applet -> webhook (200 OK) -> SwitchCase -> Connect Applet (`sip:<TrunkID>`)

## Benefits for Voice AI and CC Platforms

- **Plug-and-play PSTN access** via Exotel's UL VNO
- **Elastic scaling** with dynamic channel allocation
- **Regulatory assurance** with lawful interception readiness
- **TLS security** for sensitive verticals
- **Real-time programmable call routing**

## Example Use Cases

- AI-led outbound campaigns (sales/NPS)
- Inbound IVR bots or reception assistants
- Agent-bot hybrid support models
- KYC calls and OTP verification for BFSI
- Order confirmations and fraud checks for e-commerce

## Next Steps

1. Share SIP endpoint details: IP/FQDN, transport type, supported codecs
2. Exotel team initiates CAF/KYC validation
3. Integration testing with live traffic
4. Commercial onboarding & production go-live

Contact: hello@exotel.com or your Exotel CSM

---

## Related

- [SIP Trunking Overview](./overview.md)
- [Master Support Guide](./master-guide.md)
- [Flow Integration Guide](./flow-integration.md)
- [TCP Integration Guide](./tcp-integration.md)
- [TLS Integration Guide](./tls-integration.md)
- [FQDN-based Integration](./fqdn-integration.md)
- [SIP-Native Voicebot Integration](./voicebot-integration.md)
