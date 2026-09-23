---
id: network-firewall
title: Network and firewall
description: Why firewall and security rules matter for Exotel SIP Trunking — then use the docs portal for the authoritative IP, port, and allowlist reference.
sidebar_label: Network & firewall
slug: /sip-trunking/network-firewall
sidebar_position: 5
---

# Network and firewall

Before you create trunks or place test calls, your network path between **your SIP system** and **Exotel** must be open and intentional. SIP Trunking fails most often on firewall and security gaps — not on API syntax.

## Why this matters

| Risk | What happens |
|------|----------------|
| Signaling blocked | INVITEs never reach Exotel or your PBX — calls never set up |
| Media (RTP) blocked | Call “connects” with **no audio** or one-way audio |
| Incomplete allowlists | Intermittent failures as traffic hits a PoP or media IP you did not allow |
| Over-restrictive rules | Fixing destination ports but locking **source** ports breaks inbound SIP |

Signaling (SIP control) and media (RTP audio) are **independent**. Both must be allowed for production voice.

## What applies where

| Direction | You must allow | Typical failure if missing |
|-----------|----------------|----------------------------|
| **Outbound** (SIP → PSTN) | Your SIP host → Exotel edge FQDNs (TLS 443 / TCP 5070) + RTP to Exotel media IPs | Cannot dial out; timeouts / 403 |
| **Inbound** (PSTN → SIP) | Exotel signaling source IPs → your SIP port + Exotel media IPs → your RTP range (UDP 10000–40000) | No ring on your side; one-way / no audio |
| **Auth** | IP ACL and/or digest credentials matching how your platform egresses | `401` / `403` on trunk |
| **TLS vs TCP** | Prefer TLS 443 in production; TCP 5070 only if TLS is unavailable | Handshake / connectivity errors |

Use this page to decide **what** to open. Use the docs portal for the **exact** FQDNs, signaling IPs, and media IP pools — those lists change and must stay current.

## Single source of truth

**Authoritative ports, edge FQDNs, signaling source IPs, media pools, and example firewall rules:**

→ **[Network & Firewall Configuration (docs.exotel.com)](https://docs.exotel.com/dynamic-sip-trunking/network-and-firewall-configuration)**

Do not copy IP tables into local runbooks without re-checking that page. Confirm with hello@exotel.com before production allowlists.

## After network is ready

1. [Quickstart](./quickstart) — create trunk and test calls  
2. [Dynamic SIP Trunking API](./dynamic-sip-trunking) — programmatically manage trunks  
3. [Errors & troubleshooting](./errors-troubleshooting) — SIP / API codes when audio or signaling still fails  
