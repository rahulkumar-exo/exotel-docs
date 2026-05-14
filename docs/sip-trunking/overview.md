---
id: overview
title: SIP Trunking
description: Overview of Exotel's SIP Trunking for enterprise PBX/SBC integration with PSTN via SIP over TCP or TLS.
sidebar_label: Overview
sidebar_position: 1
---

# SIP Trunking

Exotel's SIP Trunking enables enterprise PBX, SBC, and SIP-based platforms to connect directly with Exotel's voice infrastructure using SIP over TCP or TLS. It supports both inbound and outbound PSTN calling through IP connectivity, with optional FQDN-based flexibility.

:::note Alpha Release
SIP Trunking is currently in Alpha. Features and configurations may change before General Availability (GA). Alpha deployments are not covered by production-grade SLAs.
:::

## Supported Use Cases

| Use Case | Description |
|----------|-------------|
| **Outbound SIP (IP to PSTN)** | Calls from customer SIP infra routed to Exotel, then to PSTN |
| **Inbound SIP (PSTN to IP)** | Incoming calls to Exophone routed to customer SIP server |
| **IP-PSTN Intermix** | Bi-directional call routing between IP infra and Exotel VNs |
| **SIP Bot Integration** | Direct SIP-to-Bot integration with no agent involvement |
| **FQDN-based Load Balanced SIP** | FQDNs resolve dynamically to multiple IPs for cloud/hybrid setups |
| **Native SIP Voicebot Integration** | Direct SIP call to customer-hosted SIP-native voicebot platform |

## Transport Options

| Transport | Port | Encryption | DNS Support | Recommended For |
|-----------|------|------------|-------------|-----------------|
| TCP | 5070 | No | Yes | Default, legacy infrastructure |
| TLS | 443 | Yes (SIP + SRTP) | Yes | Encrypted SIP + SRTP flows |
| FQDN | Any | TCP/TLS | Required | Cloud, autoscaling, HA SIP infra |

## Getting Started

1. **Create your Exotel account** via [my.in.exotel.com](https://my.in.exotel.com)
2. **Complete KYC** and upgrade the account with your Exotel Account Manager
3. **Procure Exophones** by emailing hello@exotel.com (mention region-specific needs)
4. **Decide trunking mode**: TCP or TLS, Static IP or FQDN
5. **Share configuration details** with Exotel:
   - Account SID
   - Exophones
   - Trunk source IPs (for outbound trunking)
   - Trunk destination IPs/FQDN (for inbound trunking)
   - Chosen transport protocol (TCP/TLS)

Once provisioned, your SIP traffic will be routed via Exotel's regional edge PoP.

## Integration Guides

Choose the guide that matches your deployment:

- **[Master Support Guide](./master-guide.md)** -- Complete overview of all SIP Trunking integration options
- **[TCP Integration (Mumbai)](./tcp-integration.md)** -- SIP over TCP setup via Mumbai PoP
- **[TLS Integration (Mumbai)](./tls-integration.md)** -- Encrypted SIP over TLS via Mumbai PoP
- **[FQDN-based Integration](./fqdn-integration.md)** -- DNS-based trunking for cloud/HA setups
- **[Flow Integration](./flow-integration.md)** -- Route SIP calls into Exotel IVR/agent flows
- **[Flow and API Configuration](./flow-api-configuration.md)** -- Full API-driven setup for Voice AI and CC platforms
- **[SIP-Native Voicebot Integration](./voicebot-integration.md)** -- Direct SIP integration for voicebot partners

## Edge PoPs and IPs

| Region | SIP Proxy FQDN | Media IPs |
|--------|----------------|-----------|
| Karnataka | `pstn.in1.exotel.com` | 14.194.10.247, 61.246.82.75 |
| Mumbai | `pstn.in2.exotel.com` | 182.76.143.61, 122.15.8.184 |
| Mumbai Cloud | `pstn.in4.exotel.com` | -- |
| Singapore | `pstn.sgp1.exotel.com` | 18.142.150.245, 122.248.223.73 |

## Support

- **Provisioning**: Contact your Exotel CSM or email hello@exotel.com
- **Technical Support**: Visit [support.exotel.com](https://support.exotel.com) and share:
  - Account SID
  - Trunk transport type (TCP/TLS/FQDN)
  - Sample Call SIDs
  - SIP trace logs (from sngrep/Wireshark)
