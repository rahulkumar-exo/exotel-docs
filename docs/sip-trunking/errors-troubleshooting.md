---
id: errors-troubleshooting
title: SIP error codes and troubleshooting
description: SIP 4xx/5xx codes, API error codes, and audio troubleshooting for Exotel Dynamic SIP Trunking.
sidebar_label: Errors & troubleshooting
slug: /sip-trunking/errors-troubleshooting
sidebar_position: 8
---

# SIP error codes and troubleshooting

## SIP 4xx — client errors

| Code | Meaning | Fix |
|------|---------|-----|
| `400` | Bad request | Review SIP headers / SDP |
| `401` | Unauthorized | Check digest credentials |
| `403` | Forbidden | IP not whitelisted — check ACL |
| `404` | Not found | Verify phone number mapping |
| `408` | Request timeout | Check firewall / reachability |
| `415` | Unsupported media | Enable G.711; disable other codecs |
| `480` | Temporarily unavailable | Check PBX/SBC availability |
| `484` | Address incomplete | Use E.164 for numbers |
| `486` | Busy | Destination busy — normal |
| `488` | Not acceptable | SDP/codec mismatch — G.711 |

## SIP 5xx — server errors

| Code | Meaning | Fix |
|------|---------|-----|
| `500` | Server error | Retry |
| `502` | Bad gateway | Upstream routing — retry |
| `503` | Service unavailable | Check network / routing |
| `504` | Gateway timeout | Check firewall latency |

## Audio issues (no SIP error)

| Symptom | Cause | Fix |
|---------|-------|-----|
| No audio both ways | RTP blocked | Open UDP 10000–40000 |
| One-way audio | NAT / firewall | Public IP in SDP; media allowlist |
| Audio drops mid-call | RTP idle timeout | Adjust firewall timeout |

## API error codes

| Code | HTTP | Meaning | Fix |
|------|------|---------|-----|
| `1000` | 404 | Resource not found | Verify trunk SID / phone number ID |
| `1001` | 400 | Mandatory parameter missing | Check required fields |
| `1002` | 400 | Invalid parameter | Validate E.164, IP, JSON |
| `1007` | 400 | Malformed JSON | Fix JSON syntax |
| `1008` | 409 | Duplicate resource | Already configured — safe to ignore |
| `1011` | 415 | Wrong content type | `Content-Type: application/json` |

## Debug checklist

1. Confirm trunk `status` is active  
2. Outbound: ACL or credentials match the egress IP / digest on your platform  
3. Inbound: destination URI + Connect applet `sip:<trunk_sid>` + DID mapped to flow  
4. Capture SIP traces (sngrep / Wireshark) and Call SIDs for support  

## Related

- [Network & firewall](./network-firewall)
- [Dynamic SIP Trunking API](./dynamic-sip-trunking)
- Docs portal: [SIP Error Codes](https://docs.exotel.com/dynamic-sip-trunking/sip-error-codes-and-troubleshooting-guide)
