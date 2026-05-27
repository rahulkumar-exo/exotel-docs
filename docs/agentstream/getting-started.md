---
id: getting-started
title: Quick Guide to Get Started with Exotel Streaming Services
description: Learn how to enable and use Exotel AgentStream capabilities via the Voicebot Applet or Stream Applet for real-time audio streaming.
sidebar_label: Getting Started
slug: /agentstream/getting-started
sidebar_position: 2
---

# Quick Guide to Get Started with Exotel Streaming Services

This guide outlines how to enable and use Exotel's AgentStream capabilities via the Voicebot Applet or Stream Applet. These applets allow real-time audio streaming from calls to your server for processing, voicebot interactions, and more.

## Streaming Modes: Stream Applet vs. Voicebot Applet

Before you begin, choose the streaming mode that fits your use case:

| Mode | Direction | Best For |
|---|---|---|
| **Stream Applet** | Unidirectional — audio flows from the call **to your server** | Speech-to-text transcription, call analytics, passive monitoring |
| **Voicebot Applet** | Bidirectional — your server **sends audio back** into the call | AI voicebots, interactive IVR, real-time voice synthesis |

Both applets deliver audio over a WebSocket connection. The Stream Applet is simpler to implement; the Voicebot Applet requires your server to handle both receiving and sending audio frames.

## Prerequisites

- An active Exotel account with AgentStream enabled (contact Exotel support if you do not see AgentStream in your dashboard)
- Access to the Exotel dashboard at [my.exotel.com](https://my.exotel.com)
- A WebSocket server endpoint that can accept an incoming connection from Exotel
- For bidirectional (Voicebot) mode: your WebSocket server must be able to send audio back in the expected format (mulaw or PCM, 8 kHz by default)
- At least one Exotel virtual number to associate with your streaming call flow

## Setup Steps

1. **Log into the Exotel dashboard.** Go to [my.exotel.com](https://my.exotel.com) and sign in with your account credentials.

2. **Navigate to ExoTrunks or the App Bazaar.** In the left sidebar, select **ExoPhone → App Bazaar** (or **ExoTrunks** if you are using SIP-based routing). This is where you build and manage call flows using applets.

3. **Create a new call flow.** Click **Create New App** (or **New Flow**). Give the flow a descriptive name such as "Voicebot Flow - Support" or "Stream Flow - Transcription".

4. **Add the Stream Applet or Voicebot Applet.** Drag the **Stream Applet** or **Voicebot Applet** from the applet panel into your call flow canvas.

5. **Configure the WebSocket URL.** Click the applet to open its settings. Enter the full WebSocket URL of your server (for example, `wss://yourserver.example.com/stream`). If your server requires authentication headers or custom parameters, add them in the **Custom Parameters** field.

6. **Add the Passthru Applet before the streaming applet (recommended).** If your WebSocket server needs advance notice before audio starts (for example, to prepare a session or load a model), add a **Passthru Applet** earlier in the flow. It sends an HTTP POST with call metadata to your server before the WebSocket connection opens. See the [Passthru Applet guide](./passthru-applet) for details.

7. **Assign the call flow to a virtual number.** Save the flow, then go to **ExoPhone → My Numbers**, find your virtual number, and set its inbound call flow to the flow you just created.

8. **Test with a live call.** Dial your virtual number from any phone. Check your WebSocket server logs to confirm the connection is established and audio frames are arriving. For the Voicebot Applet, also verify that audio sent from your server is audible to the caller.

## Configuration Notes

- **Audio format:** The default audio format is mulaw at 8 kHz. If your pipeline requires PCM or 16 kHz audio, configure this in the applet's advanced settings (see the [Extension Guide](./stream-voicebot-extension)).
- **Latency:** Keep your WebSocket server geographically close to Exotel's infrastructure (India region) to minimize round-trip latency, which matters most in bidirectional voicebot mode.
- **Connection lifecycle:** Exotel opens the WebSocket connection when the call connects to the applet and closes it when the call ends. Design your server to handle reconnects gracefully.
- **Firewall:** Ensure your WebSocket server accepts inbound connections from Exotel's IP ranges. Contact Exotel support for the current list of egress IPs if you need to allowlist them.

## Related

- [Stream & Voicebot Applet](./stream-voicebot-applet) -- Detailed guide on Stream and Voicebot Applets
- [Stream & Voicebot Extension Guide](./stream-voicebot-extension) -- Updated extension guide
- [Passthru Applet](./passthru-applet) -- Working with the Passthru Applet
- [AgentStream Overview](./overview) -- Platform overview
