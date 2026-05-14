---
id: overview
title: AgentStream
description: Exotel AgentStream enables real-time audio streaming for voicebot integrations, media processing, and SIP trunking solutions.
sidebar_label: Overview
slug: /agentstream/overview
sidebar_position: 1
---

# AgentStream

AgentStream is Exotel's real-time audio streaming platform that enables voicebot integrations, media processing, and SIP trunking solutions. It provides applets and APIs for unidirectional and bidirectional audio streaming during active calls.

## Key Capabilities

- **Real-time Audio Streaming** -- Stream call audio to external services for processing
- **Voicebot Integration** -- Connect calls to AI voicebots via bidirectional streams
- **SIP Trunking** -- Route PSTN calls through SIP infrastructure (LiveKit, ElevenLabs)
- **Passthru Metadata** -- Send call and streaming metadata to your server
- **Legs API Integration** -- Programmatically control bot streams with optional greetings

## Applets

| Applet | Description |
|--------|-------------|
| **Stream Applet** | Unidirectional audio streaming from calls to your server |
| **Voicebot Applet** | Bidirectional audio streaming for interactive voice bots |
| **Passthru Applet** | Sends call and streaming metadata to your server endpoint |

## Guides

| Guide | Description |
|-------|-------------|
| [Getting Started](./getting-started) | Quick guide to enable and use Exotel streaming services |
| [Passthru Applet](./passthru-applet) | Working with the Passthru Applet for AgentStream |
| [Stream & Voicebot Applet](./stream-voicebot-applet) | Working with Stream and Voicebot Applets |
| [Stream & Voicebot Extension Guide](./stream-voicebot-extension) | Updated extension guide for Stream and Voicebot Applet |
| [Bot Stream with Legs API](./bot-stream-legs-api) | Using Legs APIs to start a bot stream with optional greeting |

## Integration Guides

| Integration | Description |
|-------------|-------------|
| [OmniDimension Voicebot](./omnidimension-integration) | Integrate Exotel with OmniDimension voicebot |
| [LiveKit SIP Trunking](./livekit-integration) | Integrate Exotel PSTN calls with LiveKit SIP infrastructure |
| [ElevenLabs SIP Trunking](./elevenlabs-integration) | Integrate Exotel with ElevenLabs voice AI via SIP trunking |
| [Manage ExoTrunks](./manage-exotrunks) | Create, configure, and manage SIP trunks |

## Related

- [Legs API](/docs/legs/overview) -- Create and manage individual call legs
- [Voice v1 Applets](/docs/voice-v1/overview) -- Voice applet reference
