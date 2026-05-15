---
id: master-guide
title: SIP Trunking Master Support Guide
description: Complete guide for integrating with Exotel's SIP Trunking including TCP, TLS, and FQDN configuration options and best practices.
sidebar_label: Master Guide
sidebar_position: 2
---

# Exotel SIP Trunking -- Master Support Guide

This guide provides a complete overview of how enterprises can integrate with Exotel's SIP Trunking. It includes configuration options (TCP, TLS, FQDN), onboarding steps, best practices, and supported use cases.

:::note Alpha Release
SIP Trunking is currently in Alpha. Features and configurations may change before General Availability.
:::

## What is SIP Trunking?

SIP Trunking allows enterprise PBX/SBC systems to connect directly with Exotel's voice infrastructure using SIP over TCP or TLS. It supports both inbound and outbound PSTN calling through IP connectivity, with optional FQDN-based flexibility.

## Supported Use Cases

| Use Case | Description |
|----------|-------------|
| Outbound SIP (IP to PSTN) | Calls from customer SIP infra routed to Exotel, then to PSTN |
| Inbound SIP (PSTN to IP) | Incoming calls to Exophone routed to customer SIP server |
| IP-PSTN Intermix | Bi-directional call routing between IP infra and Exotel VNs |
| SIP Bot Integration | Direct SIP-to-Bot integration with no agent involvement |
| FQDN-based Load Balanced SIP | FQDNs resolve dynamically to multiple IPs for cloud/hybrid setups |
| Native SIP Voicebot Integration | Direct SIP call to customer-hosted SIP-native voicebot platform |

## Transport Options

| Transport | Port | Encryption | DNS Support | Recommended For |
|-----------|------|------------|-------------|-----------------|
| TCP | 5070 | No | Yes | Default, legacy infra |
| TLS | 443 | Yes | Yes | Encrypted SIP + SRTP flows |
| FQDN | Any | TCP/TLS | Required | Cloud, autoscaling, HA SIP infra |

## Integration Path -- High-Level Flow

### What is Supported

- SIP Trunking with TCP and TLS transport
- SIP trunk routing using static IPs or FQDN
- Bi-directional call support (IP to PSTN and PSTN to IP)
- Exophones (Virtual Numbers) mapped to SIP trunks
- SIP-to-Flow integration using Connect or IVR -- See: [SIP-to-Flow Integration Guide](./flow-integration.md)
- SIP-to-SIP integration for native voicebot routing -- See: [Native SIP Voicebot Integration Guide](./voicebot-integration.md)

:::caution SIP Trunking Throttling
Exotel enforces a default SIP Trunking rate-limit of **200 calls per minute (CPM)** per trunk to safeguard carrier capacity and call quality.

If your traffic profile requires a higher burst rate, raise a request via your CSM or Support ticket. The capacity-planning team will review historical traffic, carrier limits, and QoS requirements and can increase the throttling threshold accordingly.
:::

### What is Not Supported

- SIP over UDP (not supported)
- SIP registration-based authentication
- SIP traffic without prior account upgrade/KYC

### Supported Regional Exophones for Mumbai SIP Setup

- Veeno KA, DL, Mum, AP, GJ

## Getting Started with Exotel SIP Trunking (Veeno Accounts)

1. **Create your Exotel account** via [my.in.exotel.com](https://my.in.exotel.com)
2. **Complete KYC** and upgrade the account with help from your Exotel Account Manager ([KYC documentation guide](mailto:hello@exotel.com))
3. **Procure Exophones** by emailing hello@exotel.com (mention region-specific need)
4. **Decide trunking mode**: TCP or TLS, Static IP or FQDN
5. **Collect and share** the following with Exotel:
   - Account SID
   - Exophones
   - Trunk source IPs (for outbound trunking)
   - Trunk destination IPs/FQDN (for inbound trunking)
   - Chosen transport protocol (TCP/TLS)

Once provisioned, your SIP traffic will be routed via Exotel's regional edge PoP.

### Provisioning Workflow

1. **KYC Verification** based on the setup required
2. **Convert to Full Account** -- Exotel team upgrades it
3. **Share Configuration Details**:
   - Account SID
   - Exophones (required for PSTN origination)
   - Source IP(s) (for outbound)
   - Destination IP(s) or FQDN (for inbound)
   - Transport type (TCP/TLS)
4. **Provisioning**:
   - VOIP and VOIP-PSTN enabled
   - SIP trunk created in backend by Tech Support
   - Dial Whom URI format configured
5. **Testing**:
   - Inbound and Outbound calls validated
   - SIP packets reviewed using tools like sngrep

## Configuration Types

### TCP Trunking (Port 5070)

- Uses format: `sip:<number>@pstn.in4.exotel.com:5070;transport=tcp`
- Requires static IP whitelisting
- See: [TCP Integration Guide](./tcp-integration.md)

### TLS Trunking (Port 443)

- Uses format: `sip:<number>@pstn.in4.exotel.com:443;transport=tls`
- Encrypted SIP signaling and SRTP media
- Recommended for secure communication
- See: [TLS Integration Guide](./tls-integration.md)

### FQDN-based Trunking

- No IP whitelisting required
- Uses DNS lookup to resolve SIP server IP dynamically
- Ideal for cloud or redundant infrastructure
- See: [FQDN Integration Guide](./fqdn-integration.md)

## FQDN Configuration Guidance

If you are using a DNS-resolvable FQDN instead of a static IP for your SIP server, ensure the following:

- Your SIP server is accessible via a public FQDN (e.g., `sip.customer.com`)
- It resolves to an IP address reachable by Exotel
- Specify the port (e.g., 5070 for TCP or 443 for TLS) and transport protocol
- Share the FQDN, port, and transport protocol with your Exotel Account Manager

Exotel will configure the trunk to use your FQDN. This enables dynamic IP handling and is ideal for cloud-hosted or HA infrastructures.

Once provisioned, you can begin testing:

- Map your VN to the SIP trunk and initiate a test call
- Use tools like `sngrep` or `tcpdump` to validate INVITE requests and SRTP media flow
- In the Dial Whom field, use format: `sip:<number>@<fqdn>:<port>;transport=tcp|tls`
- Confirm the `P-Asserted-Identity` header shows the correct Leg1 number (caller identity)

## Best Practices for SIP Trunking Integration

- Use FQDN if infra is cloud-based, HA, or load-balanced
- Keep DNS TTL between 30-60 seconds for fast recovery
- Avoid SIP ALG in NAT/firewall appliances
- Use PCMA (G.711 A-law) as primary codec
- Use TLS + SRTP for security-sensitive traffic
- Validate trunk reachability before mapping VNs

:::tip RTP Media Port Range
Restrict RTP media port range to **10000-20000** (10K ports only):
- Each SIP call uses 2 ports
- Exotel media servers support 3000 concurrent calls (6000 ports)
- A 50% buffer ensures capacity during retries, hold-ups, or port conflicts
- Helps avoid NAT-related media drops and ensures predictable firewall rules
:::

## Support Channels

### Provisioning Support

Contact your Exotel CSM or email: hello@exotel.com

### Technical Support

Visit [hello@exotel.com](mailto:hello@exotel.com) and share the following:
- Account SID
- Trunk transport type (TCP/TLS/FQDN)
- Sample Call SIDs
- SIP trace logs (from sngrep/Wireshark)

---

## Related

- [SIP Trunking Overview](./overview.md)
- [TCP Integration Guide](./tcp-integration.md)
- [TLS Integration Guide](./tls-integration.md)
- [FQDN-based Integration](./fqdn-integration.md)
- [Flow Integration Guide](./flow-integration.md)
- [Flow and API Configuration](./flow-api-configuration.md)
- [SIP-Native Voicebot Integration](./voicebot-integration.md)
