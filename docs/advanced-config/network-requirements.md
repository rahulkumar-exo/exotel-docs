---
id: network-requirements
title: Network Requirements
description: "Exotel network requirements for firewall rules, ports, protocols, bandwidth, DNS, and connectivity for voice, SMS, and WebRTC."
sidebar_label: Network Requirements
sidebar_position: 10
---

# Network Requirements

This guide details the network requirements for integrating with Exotel, including firewall rules, ports, protocols, bandwidth recommendations, and DNS configuration. Ensure your network meets these requirements for reliable voice, SMS, and API communication.

## API Connectivity

### Exotel API Endpoints

| Service | Endpoint | Protocol | Port |
|---------|----------|----------|------|
| **REST API (v1)** | `api.exotel.com` | HTTPS | 443 |
| **REST API (v2)** | `api.exotel.com/v2` | HTTPS | 443 |
| **REST API (v3)** | `api.exotel.com/v3` | HTTPS | 443 |
| **Dashboard** | `my.exotel.com` | HTTPS | 443 |
| **Call Recordings** | `*.amazonaws.com` (S3) | HTTPS | 443 |

### Firewall Rules for API Access

Allow **outbound** traffic from your servers to the following:

| Destination | Protocol | Port | Purpose |
|-------------|----------|------|---------|
| `api.exotel.com` | TCP (HTTPS) | 443 | API requests |
| `my.exotel.com` | TCP (HTTPS) | 443 | Dashboard access |
| `*.amazonaws.com` | TCP (HTTPS) | 443 | Recording downloads |

### Firewall Rules for Webhooks (Inbound)

Allow **inbound** traffic from Exotel's servers to your webhook endpoints:

| Source | Protocol | Port | Purpose |
|--------|----------|------|---------|
| Exotel IP ranges | TCP (HTTPS) | 443 (or your custom port) | Webhook deliveries |

:::info
Contact Exotel support or your account manager for the current list of Exotel IP ranges to whitelist. See also [IP Whitelisting](/docs/advanced-config/ip-whitelisting).
:::

## WebRTC Requirements

If you are using Exotel's WebRTC SDK for browser-based calling, the following additional network requirements apply.

### Ports and Protocols

| Protocol | Port Range | Direction | Purpose |
|----------|-----------|-----------|---------|
| **HTTPS** | 443 | Outbound | WebRTC signaling (WSS) |
| **STUN/TURN** | 3478 | Outbound | NAT traversal |
| **TURN (TLS)** | 443, 5349 | Outbound | NAT traversal over TLS |
| **UDP** | 10000 -- 60000 | Outbound | Media (RTP/SRTP) |
| **TCP** | 443 | Outbound | Media fallback (TURN over TCP) |

### WebRTC Media Flow

```
Browser (Agent)
    │
    ├── WSS (443) ──► Signaling Server (WebSocket)
    │
    ├── STUN (3478) ──► STUN Server (NAT discovery)
    │
    └── UDP (10000-60000) ──► Media Server (voice audio)
         or
        TCP (443) ──► TURN Server (media relay, if UDP blocked)
```

:::warning
If your corporate network blocks UDP traffic or uses a restrictive firewall, WebRTC calls will fall back to TURN over TCP (port 443). This may increase latency. For the best call quality, allow UDP traffic on ports 10000 -- 60000.
:::

### WebRTC Domains to Whitelist

| Domain | Purpose |
|--------|---------|
| `*.exotel.com` | Signaling and API |
| `*.twilio.com` | Media servers (if Twilio-based WebRTC) |
| `global.stun.twilio.com` | STUN server |
| `global.turn.twilio.com` | TURN server |

## SIP Trunk Requirements

For SIP trunk integrations (see [VSIP documentation](/docs/vsip/overview)):

### Ports and Protocols

| Protocol | Port | Direction | Purpose |
|----------|------|-----------|---------|
| **SIP (UDP)** | 5060 | Bidirectional | SIP signaling |
| **SIP (TCP)** | 5060 | Bidirectional | SIP signaling (TCP) |
| **SIP (TLS)** | 5061 | Bidirectional | Secure SIP signaling |
| **RTP (UDP)** | 10000 -- 60000 | Bidirectional | Voice media |
| **SRTP (UDP)** | 10000 -- 60000 | Bidirectional | Encrypted voice media |

### SIP Codec Support

| Codec | Bandwidth | Quality | Recommended |
|-------|-----------|---------|-------------|
| **G.711 (PCMU/PCMA)** | 64 kbps | Toll quality | Yes (preferred) |
| **G.729** | 8 kbps | Good | Yes (low bandwidth environments) |
| **Opus** | 6 -- 510 kbps (variable) | Excellent | Yes (WebRTC) |

## Bandwidth Requirements

### Voice Calls

| Codec | Bandwidth per Call | 10 Concurrent Calls | 50 Concurrent Calls |
|-------|-------------------|---------------------|---------------------|
| **G.711** | 80 -- 100 kbps | 0.8 -- 1 Mbps | 4 -- 5 Mbps |
| **G.729** | 24 -- 32 kbps | 0.24 -- 0.32 Mbps | 1.2 -- 1.6 Mbps |
| **Opus** | 32 -- 64 kbps | 0.32 -- 0.64 Mbps | 1.6 -- 3.2 Mbps |

### API Traffic

| Activity | Bandwidth | Notes |
|----------|-----------|-------|
| **API calls** | Minimal (< 1 Mbps) | Small JSON payloads |
| **Webhook delivery** | Minimal (< 1 Mbps) | Small POST payloads |
| **Recording download** | 10 -- 50 Mbps (during bulk download) | Depends on file size and concurrency |
| **Dashboard access** | Standard web (1 -- 5 Mbps) | Browser-based |

### Network Quality Requirements

| Metric | Acceptable Range | Impact of Poor Performance |
|--------|-----------------|---------------------------|
| **Latency** | < 150 ms (one-way) | Noticeable delay in conversation |
| **Jitter** | < 30 ms | Audio distortion, choppy speech |
| **Packet loss** | < 1% | Dropped audio, gaps in speech |
| **Bandwidth** | See codec table above | Audio quality degradation |

:::tip
For the best voice quality, use a dedicated internet connection for voice traffic, or implement QoS (Quality of Service) rules to prioritize voice packets over other traffic.
:::

## DNS Configuration

### Required DNS Resolution

Ensure your DNS servers can resolve the following domains:

| Domain | Purpose |
|--------|---------|
| `api.exotel.com` | REST API |
| `my.exotel.com` | Dashboard |
| `*.exotel.com` | All Exotel services |
| `*.amazonaws.com` | Recording storage (S3) |

### DNS Best Practices

1. **Use multiple DNS servers** -- Configure at least two DNS resolvers for redundancy
2. **Low TTL awareness** -- Exotel may update DNS records; respect TTL values
3. **No DNS caching of resolved IPs** -- Do not hard-code resolved IP addresses; always use domain names

## Proxy and Firewall Considerations

### HTTP Proxy

If your network routes outbound traffic through an HTTP proxy:

| Requirement | Details |
|-------------|---------|
| **HTTPS CONNECT support** | Proxy must support the HTTP CONNECT method for TLS tunneling |
| **Certificate inspection** | If your proxy performs SSL inspection, ensure it does not break Exotel's TLS certificates |
| **Timeout** | Proxy timeout must be > 60 seconds for long-running API calls |

### Corporate Firewall

| Rule | Direction | Source | Destination | Port | Protocol |
|------|-----------|--------|-------------|------|----------|
| API access | Outbound | Your servers | `api.exotel.com` | 443 | TCP |
| Dashboard | Outbound | User browsers | `my.exotel.com` | 443 | TCP |
| Webhooks | Inbound | Exotel IPs | Your servers | 443 | TCP |
| WebRTC signaling | Outbound | Agent browsers | `*.exotel.com` | 443 | TCP |
| WebRTC media | Outbound | Agent browsers | Media servers | 10000-60000 | UDP |
| WebRTC fallback | Outbound | Agent browsers | TURN servers | 443 | TCP |
| SIP signaling | Bidirectional | Your PBX | Exotel SIP proxy | 5060/5061 | UDP/TCP |
| SIP media | Bidirectional | Your PBX | Exotel media servers | 10000-60000 | UDP |

## Network Testing

### Connectivity Test

Verify basic connectivity to Exotel services:

```bash
# Test API connectivity
curl -v https://api.exotel.com/v1/

# Test DNS resolution
nslookup api.exotel.com

# Test HTTPS connectivity
openssl s_client -connect api.exotel.com:443

# Test latency
ping api.exotel.com
```

### Voice Quality Test

For WebRTC or SIP deployments, test voice quality:

1. Make a test call through Exotel
2. Check for audio clarity, echo, delay, and one-way audio
3. Monitor network metrics (latency, jitter, packet loss) during the call
4. Use tools like `iperf` or `traceroute` to diagnose network issues

## Troubleshooting

| Issue | Possible Cause | Resolution |
|-------|---------------|------------|
| API requests timeout | Firewall blocking port 443 outbound | Allow outbound TCP 443 to `api.exotel.com` |
| Webhooks not received | Firewall blocking Exotel's inbound IPs | Whitelist Exotel IP ranges for inbound 443 |
| WebRTC no audio | UDP blocked on network | Open UDP 10000-60000 or enable TURN fallback |
| WebRTC one-way audio | Asymmetric NAT or firewall | Configure TURN server; check NAT type |
| SIP registration fails | Port 5060/5061 blocked | Allow SIP ports bidirectionally |
| Poor voice quality | High latency, jitter, or packet loss | Check network metrics; enable QoS |
| Recording download fails | S3 domain blocked | Whitelist `*.amazonaws.com` on port 443 |

## Related Topics

- [IP Whitelisting](/docs/advanced-config/ip-whitelisting) -- Restrict API access by IP
- [High Availability](/docs/advanced-config/high-availability) -- Redundancy and failover
- [WebRTC SDK](/docs/integrations/webrtc-sdk) -- Browser-based calling
- [VSIP](/docs/vsip/overview) -- SIP trunk integration
