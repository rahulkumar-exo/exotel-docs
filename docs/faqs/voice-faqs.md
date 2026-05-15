---
title: Voice API FAQs
description: "Frequently asked questions about Exotel Voice API including call quality, codecs, concurrent call limits, recording, and troubleshooting."
sidebar_label: Voice FAQs
sidebar_position: 18
---

# Voice API FAQs

Common questions about Exotel's Voice API, call quality, call flows, recording, capacity, and troubleshooting.

---

## What voice codecs does Exotel support?

Exotel supports standard telephony codecs for voice calls:

| Codec | Bitrate | Quality | Use Case |
|-------|---------|---------|----------|
| **G.711 (a-law/mu-law)** | 64 kbps | High (toll quality) | Standard PSTN calls |
| **G.729** | 8 kbps | Good | Bandwidth-optimized calls |
| **Opus** | Variable | High | WebRTC-based calls |

Codec selection is handled automatically based on the call type (PSTN, SIP, or WebRTC). You do not need to configure codecs manually.

---

## How many concurrent calls can I make?

Concurrent call limits depend on your plan:

| Plan | Default Concurrent Calls | Can Be Increased? |
|------|-------------------------|-------------------|
| Starter | 10 | Yes (contact support) |
| Growth | 30 | Yes (contact support) |
| Enterprise | Custom (50-500+) | Yes (as per agreement) |

To check your current concurrency limit, go to **Dashboard > Settings > Account Details** or contact your account manager.

:::tip
If you regularly hit your concurrent call limit, calls will be queued or rejected with a busy signal. Monitor your peak concurrent usage in the Analytics section and request a capacity increase before launching large campaigns.
:::

---

## What is the maximum call duration?

| Call Type | Default Max Duration | Configurable? |
|-----------|---------------------|--------------|
| Standard calls | 60 minutes | Yes (contact support) |
| Campaign calls | 60 minutes | Yes |
| Conference calls | 60 minutes | Yes |

Calls exceeding the maximum duration are automatically disconnected. If your use case requires longer calls (e.g., extended support sessions), contact your account manager to increase the limit.

---

## How do I improve call quality?

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Echo or feedback | Audio loop in the call path | Enable echo cancellation; use headsets instead of speakerphone |
| Low volume | Network or codec issue | Check agent's internet bandwidth; verify audio input levels |
| Call drops | Network instability | Ensure stable internet connection; check for packet loss |
| One-way audio | Firewall blocking media | Open required ports (see network requirements below) |
| Choppy audio | Insufficient bandwidth | Ensure minimum 100 kbps per concurrent call |
| Latency / delay | Geographic distance | Use the Exotel region closest to your agents |

### Network Requirements for Voice Quality

| Protocol | Port | Purpose |
|----------|------|---------|
| HTTPS | 443 | API calls and dashboard |
| RTP (UDP) | 10000--60000 | Voice media (for WebRTC/SIP) |
| SRTP (UDP) | 10000--60000 | Encrypted voice media |
| WSS | 443 | WebSocket signaling (for WebRTC) |

---

## How does call recording work?

Call recording captures audio from both parties (agent and customer) and stores it as a downloadable file.

### Enabling Recording

| Method | How |
|--------|-----|
| Call flow (dashboard) | Enable recording in the Connect applet settings |
| API | Set `record=true` in the API call request |
| Campaign | Configure recording in campaign settings |

### Recording Details

| Feature | Details |
|---------|---------|
| Format | MP3 (default) or WAV |
| Storage | Exotel servers (90 days default retention) |
| Access | Dashboard playback, API download URL, webhook delivery |
| Dual-channel | Both parties recorded in stereo (one per channel) |

### Accessing Recordings

```bash
# Get call details with recording URL
curl "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/calls/<call_sid>"
```

The response includes a `recording_url` field with a time-limited download URL.

:::warning
Always play a consent announcement before recording. Recording without notification may violate privacy laws. See [Data Privacy](/docs/faqs/data-privacy) for consent requirements.
:::

---

## Can I use Exotel for conference calls?

Yes. Exotel supports multi-party calling through the Legs API:

- Add participants to an active call
- Create conference bridges with multiple parties
- Control individual participant settings (mute, hold, disconnect)

> **API Reference:** See the [Legs API](/docs/legs/overview) for conference call setup.

---

## What happens when a call fails?

Call failures can occur for various reasons:

| Failure Reason | Status | Retriable? | Resolution |
|---------------|--------|-----------|------------|
| Invalid number | `failed` | No | Verify the phone number format |
| Network unavailable | `failed` | Yes | Retry after a few minutes |
| Number busy | `busy` | Yes | Retry after configured interval |
| No answer (ring timeout) | `no-answer` | Yes | Retry at a different time |
| Insufficient credits | `failed` | No | Add credits to your account |
| ExoPhone not active | `failed` | No | Verify ExoPhone status in dashboard |
| Call flow error | `failed` | No | Check call flow configuration |
| Rate limit exceeded | `429` error | Yes | Reduce call rate or request capacity increase |

---

## How do I track calls in real time?

| Method | Use Case | Setup |
|--------|----------|-------|
| **Webhooks** | Automated processing | Configure `StatusCallback` URL |
| **Dashboard** | Manual monitoring | View Calls section in real time |
| **API polling** | Custom dashboards | Call the Call Details API periodically |
| **Heartbeat** | Account-level monitoring | Configure heartbeat webhooks |

> **API Reference:** See [Status Callback](/docs/voice-v1/api-reference/status-callback) for webhook payload details.

---

## Can I transfer calls between agents?

Yes. Exotel supports call transfers through:

1. **Transfer applet** in call flows: Route calls to another number or flow
2. **Legs API**: Programmatically add new participants and disconnect the original agent
3. **Agent dashboard**: If using Exotel's contact center solution, agents can transfer via the dashboard

---

## What is a Call SID?

A Call SID (Session Identifier) is a unique identifier assigned to every call on Exotel. Use it to:

- Track a specific call through your system
- Query call details via the API
- Correlate webhook events with specific calls
- Debug issues with Exotel support

Call SIDs follow the format: `a1b2c3d4e5f6g7h8i9j0` (alphanumeric string).

---

## How do I handle DTMF input?

DTMF (Dual-Tone Multi-Frequency) input allows callers to press keys during a call. Exotel handles DTMF through:

1. **IVR Menu applet**: Capture key presses and route calls based on input
2. **Passthru applet**: Forward DTMF data to your server via HTTP for custom handling
3. **API**: Receive DTMF events through webhooks

---

## Frequently Asked Questions

### Can I make calls from a browser?

Yes. Exotel supports WebRTC for browser-based calling. See the [WebRTC SDK integration](/docs/integrations/webrtc-sdk) and [IP/PSTN/WebRTC API](/docs/ip-pstn-webrtc/overview) for setup details.

### Does Exotel support SIP trunking?

Yes. Enterprise accounts can configure SIP trunking for direct PBX integration. See the [SIP Trunking documentation](/docs/sip-trunking/overview) for details.

### Can I use text-to-speech in call flows?

Yes. The Greeting applet supports text-to-speech (TTS) for dynamically generated messages. Specify the text content and Exotel converts it to speech during the call.

### What is the ring timeout for outbound calls?

The default ring timeout is 30 seconds. If the call is not answered within this period, it is marked as `no-answer`. Custom ring timeouts can be configured for specific use cases.

---

## Related Resources

- [Voice API Overview](/docs/voice-api/getting-started/overview) -- Complete Voice API documentation
- [Voice V1 Quickstart](/docs/voice-v1/quickstart) -- Quick start guide for voice calls
- [Call Flows (App Bazaar)](/docs/getting-started/first-call-flow) -- Build interactive call flows
- [Troubleshooting](/docs/faqs/troubleshooting) -- General troubleshooting guide
