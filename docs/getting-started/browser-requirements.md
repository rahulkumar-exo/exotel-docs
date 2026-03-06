---
title: Browser & Network Requirements
description: "Browser compatibility, WebRTC requirements, and network port configurations for the Exotel dashboard and browser-based calling."
sidebar_label: Browser Requirements
sidebar_position: 14
---

# Browser & Network Requirements

The Exotel dashboard and WebRTC-based calling require specific browser capabilities and network configurations. This guide covers supported browsers, WebRTC requirements, and network setup for optimal performance.

## Dashboard Browser Compatibility

The Exotel dashboard at [my.exotel.com](https://my.exotel.com) supports the following browsers:

| Browser | Minimum Version | Recommended | Status |
|---------|----------------|-------------|--------|
| **Google Chrome** | 90+ | Latest stable | Fully supported |
| **Mozilla Firefox** | 90+ | Latest stable | Fully supported |
| **Microsoft Edge** | 90+ (Chromium-based) | Latest stable | Fully supported |
| **Safari** | 14+ | Latest stable | Supported (minor limitations) |
| **Opera** | 76+ | Latest stable | Supported |
| **Internet Explorer** | -- | -- | Not supported |

:::tip
Google Chrome is the recommended browser for the best experience with the Exotel dashboard and WebRTC calling. It receives the most testing and has the most reliable WebRTC implementation.
:::

### Browser Settings

Ensure the following settings are enabled:

| Setting | Required For | How to Verify |
|---------|-------------|---------------|
| JavaScript enabled | Dashboard functionality | Browser settings > Privacy & Security |
| Cookies enabled | Session management | Browser settings > Privacy & Security |
| Pop-ups allowed for `my.exotel.com` | Some dashboard features | Browser settings > Site permissions |
| Notifications allowed | Real-time call alerts | Browser settings > Site permissions |

## WebRTC Requirements

If your agents use browser-based calling (WebRTC), additional requirements apply:

### Browser WebRTC Support

| Browser | WebRTC Support | Audio | Video |
|---------|---------------|-------|-------|
| Chrome 90+ | Full | Yes | Yes |
| Firefox 90+ | Full | Yes | Yes |
| Edge 90+ | Full | Yes | Yes |
| Safari 14+ | Partial | Yes | Limited |
| Safari (iOS) | Partial | Yes | Limited |
| Chrome (Android) | Full | Yes | Yes |

### Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **Microphone** | Built-in or USB microphone | USB headset with noise cancellation |
| **Speakers** | Built-in or external | USB headset (to avoid echo) |
| **Processor** | Dual-core 2.0 GHz | Quad-core 2.5 GHz+ |
| **RAM** | 4 GB | 8 GB+ |
| **Internet** | 512 kbps per call | 1 Mbps per call |

:::warning
Using laptop speakers and built-in microphone simultaneously often causes echo. Use a headset for WebRTC calls to ensure clear audio for both parties.
:::

### Browser Permissions

WebRTC calling requires the following browser permissions:

| Permission | Purpose | How to Grant |
|-----------|---------|-------------|
| **Microphone access** | Capture agent's voice | Click "Allow" when browser prompts |
| **Notifications** | Incoming call alerts | Browser settings > Site permissions > Notifications |
| **Audio autoplay** | Play ringtone for incoming calls | Browser settings > Site permissions > Sound |

To check permissions for `my.exotel.com`:

**Chrome:**
1. Click the lock icon in the address bar
2. Click **Site settings**
3. Verify Microphone is set to "Allow"

**Firefox:**
1. Click the lock icon in the address bar
2. Click **Connection secure > More information**
3. Go to **Permissions** tab
4. Verify Microphone is set to "Allow"

## Network Requirements

### Required Ports and Protocols

Configure your firewall and network to allow the following traffic:

| Protocol | Port | Direction | Purpose |
|----------|------|-----------|---------|
| **HTTPS** | 443 | Outbound | API calls, dashboard access |
| **WSS** | 443 | Outbound | WebSocket signaling for WebRTC |
| **UDP** | 10000--60000 | Outbound + Inbound | RTP/SRTP voice media |
| **TCP** | 443 | Outbound | Fallback for media (if UDP blocked) |
| **STUN/TURN** | 3478 | Outbound | NAT traversal for WebRTC |
| **STUN/TURN (TLS)** | 5349 | Outbound | Secure NAT traversal |

:::warning
Many corporate networks and VPNs block UDP traffic on high ports (10000-60000). This is the most common cause of one-way audio or no audio in WebRTC calls. Work with your network team to allow UDP traffic to Exotel's media servers.
:::

### DNS Domains to Allowlist

If your network uses DNS-level filtering, allowlist the following domains:

| Domain | Purpose |
|--------|---------|
| `*.exotel.com` | API endpoints and dashboard |
| `*.exotel.in` | Additional service endpoints |
| `*.twilio.com` | Some media relay services |
| `*.amazonaws.com` | Infrastructure services |

### Bandwidth Requirements

| Use Case | Minimum Bandwidth | Recommended Bandwidth |
|----------|-------------------|----------------------|
| Dashboard browsing | 1 Mbps | 5 Mbps |
| Single WebRTC call | 100 kbps (G.729) / 256 kbps (Opus) | 512 kbps |
| Multiple concurrent calls (per agent) | 256 kbps per call | 512 kbps per call |
| Dashboard + WebRTC call | 1.5 Mbps | 5 Mbps |

### Network Quality Recommendations

| Metric | Acceptable | Ideal |
|--------|-----------|-------|
| Latency | Below 200 ms | Below 100 ms |
| Jitter | Below 30 ms | Below 15 ms |
| Packet loss | Below 3% | Below 1% |

## Testing Your Network

### WebRTC Compatibility Test

Use these tools to verify your browser and network support WebRTC:

1. **Browser test**: Visit [test.webrtc.org](https://test.webrtc.org) to verify WebRTC capability
2. **Network test**: Test UDP connectivity and bandwidth
3. **Audio test**: Make a test call to verify audio quality

### Firewall Verification

Test if your network allows the required traffic:

```bash
# Test HTTPS connectivity
curl -v https://api.exotel.com/v2/

# Test WebSocket connectivity (requires wscat or similar)
wscat -c wss://api.exotel.com/ws
```

If either test fails, work with your network team to open the required ports.

## VPN Considerations

| VPN Type | Impact on WebRTC | Recommendation |
|----------|-----------------|---------------|
| **Split tunnel** | May work if Exotel domains bypass VPN | Configure split tunneling for Exotel domains |
| **Full tunnel** | Often blocks UDP media traffic | Request UDP port exceptions or use TCP fallback |
| **Corporate proxy** | May block WebSocket connections | Allowlist Exotel domains in the proxy |

:::tip
If your agents use a VPN, test WebRTC calling through the VPN before rollout. The most reliable approach is to configure split tunneling so Exotel traffic bypasses the VPN and goes directly to the internet.
:::

## Mobile Browser Support

For agents who need to access the dashboard on mobile devices:

| Browser | Platform | Dashboard | WebRTC Calls |
|---------|----------|-----------|-------------|
| Chrome | Android | Full support | Supported |
| Safari | iOS | Full support | Limited |
| Firefox | Android | Full support | Supported |
| Samsung Internet | Android | Basic support | Not tested |

:::info
For the best mobile calling experience, consider using Exotel's mobile SDK or routing calls to the agent's phone number instead of relying on mobile WebRTC.
:::

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Dashboard loads slowly | Browser cache or extensions | Clear cache; disable extensions; try incognito mode |
| Cannot log in | Cookies blocked | Enable cookies for `my.exotel.com` |
| No audio on WebRTC call | Microphone blocked by browser | Grant microphone permission |
| One-way audio | UDP ports blocked by firewall | Open ports 10000-60000 for UDP |
| Call drops frequently | Network instability | Check bandwidth and packet loss; use wired connection |
| Echo on calls | Speaker and microphone interference | Use a headset; disable speakerphone |
| WebRTC call does not ring | Notifications blocked | Allow notifications for `my.exotel.com` |
| "Unsupported browser" message | Old browser version | Update to the latest version |

## Next Steps

- [Dashboard Overview](/docs/getting-started/dashboard-overview) -- Navigate the Exotel dashboard
- [First Call Flow](/docs/getting-started/first-call-flow) -- Build your first call flow
- [Team Management](/docs/getting-started/team-management) -- Set up agent devices
- [WebRTC SDK](/docs/integrations/webrtc-sdk) -- Integrate browser-based calling
