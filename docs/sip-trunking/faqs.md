---
id: faqs
title: SIP Trunking FAQs
description: Frequently asked questions about Exotel Dynamic SIP Trunking.
sidebar_label: FAQs
slug: /sip-trunking/faqs
sidebar_position: 9
---

# SIP Trunking FAQs

### TCP or TLS?

Prefer **TLS on port 443** for production. Use TCP 5070 only if TLS is not available on your SIP stack.

### Do I need IP whitelist and digest credentials?

| Scenario | Method |
|----------|--------|
| On-prem PBX / SBC with fixed IP | IP whitelist |
| Cloud platforms with dynamic IPs | Digest credentials |
| High-security production | Both |

### What is `pstn` vs `flow` mode?

- **`pstn`** — classic PSTN + Connect applet to `sip:<trunk_sid>`
- **`flow`** — Voice AI / StreamKit / App Bazaar applets (Voicebot, etc.)

See [Call directions](./call-directions).

### Where are TCP / TLS / FQDN setup guides?

On the docs portal under [SIP Trunk Configuration](https://docs.exotel.com/dynamic-sip-trunking/sip-trunk-configuration). The developer portal focuses on APIs and first-call success.

### Calls connect but there is no audio?

Open **UDP 10000–40000** and allow Exotel media IPs — [Network & firewall](./network-firewall).

### How do I get sample code?

[github.com/exotel](https://github.com/exotel) and the [Quickstart](./quickstart) curl examples.

### Who do I contact?

hello@exotel.com — include Account SID, trunk transport, Call SIDs, and SIP traces.
