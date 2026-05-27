---
id: manage-exotrunks
title: Manage ExoTrunks
description: Create, configure, and manage SIP trunks in the Exotel Platform Dashboard for routing PSTN calls through SIP infrastructure.
sidebar_label: Manage ExoTrunks
slug: /agentstream/manage-exotrunks
sidebar_position: 10
---

# Manage ExoTrunks

## Overview

The ExoTrunk Management section in your Exotel Platform Dashboard allows you to create, configure, and manage SIP trunks for your account. SIP trunks enable routing of PSTN calls through SIP infrastructure for integration with external platforms such as LiveKit, ElevenLabs, and custom SIP servers. Each ExoTrunk acts as a bridge between the PSTN telephone network and your SIP-based application.

## Key Capabilities

- **Outbound PSTN calling from SIP infrastructure** — route calls originating in LiveKit, ElevenLabs, or a custom SIP server out to real phone numbers via Exotel
- **Inbound call delivery to SIP endpoints** — receive calls made to an Exotel virtual number and deliver them to your SIP URI
- **Multiple transport protocols** — choose UDP, TCP, or TLS depending on your security and network requirements
- **Per-trunk credential management** — each trunk has its own SIP username and password for secure authentication
- **Trunk-level call routing** — configure inbound routing rules independently per trunk

## Prerequisites

- An active Exotel account with SIP trunking enabled (contact Exotel support if ExoTrunks does not appear in your dashboard)
- Administrator access to the Exotel dashboard at [my.exotel.com](https://my.exotel.com)
- The SIP URI or IP address of your external SIP server, LiveKit SIP component, or ElevenLabs SIP endpoint
- Outbound firewall rules on your SIP server permitting traffic to Exotel's SIP infrastructure

## Setup Steps

1. **Log into the Exotel dashboard.** Go to [my.exotel.com](https://my.exotel.com) and sign in.

2. **Navigate to ExoTrunks.** In the left sidebar, select **AgentStream → ExoTrunks** (or **ExoPhone → ExoTrunks** depending on your account layout). You will see a list of any existing trunks and an option to create a new one.

3. **Create a new ExoTrunk.** Click **Create Trunk** (or **Add New Trunk**). Enter a descriptive name for the trunk, such as "LiveKit Production" or "ElevenLabs Agent Trunk".

4. **Configure the SIP URI.** Enter the SIP URI for your external platform. This is the address Exotel will use to deliver inbound calls to your server. The format is typically `sip:username@your-server-hostname-or-ip`.

5. **Set authentication credentials.** Enter a SIP **username** and **password** for this trunk. These credentials will be used by your external SIP server to authenticate outbound calls through Exotel. Store them securely.

6. **Select the transport protocol.** Choose **UDP**, **TCP**, or **TLS** based on your server's supported transports. TLS is recommended for production deployments handling sensitive calls.

7. **Configure inbound call routing.** In the **Inbound Settings** section, specify which Exotel virtual number should deliver calls to this trunk, and optionally set a call flow (IVR, recording, etc.) to apply before the call reaches your SIP endpoint.

8. **Save and test the trunk.** Click **Save**. To verify, place a test call to the assigned virtual number and confirm it arrives at your SIP server, or trigger an outbound call from your SIP server through the trunk and verify it reaches the destination PSTN number.

## ExoTrunk Configuration Fields

| Field | Description | Example / Allowed Values |
|---|---|---|
| **Trunk Name** | Human-readable label for this trunk | `LiveKit Production`, `ElevenLabs Dev` |
| **SIP URI** | SIP address of your external server | `sip:agent@sip.example.com` |
| **Username** | SIP authentication username | Alphanumeric string |
| **Password** | SIP authentication password | Strong password, 12+ characters |
| **Transport Protocol** | Network protocol for SIP signaling | `UDP`, `TCP`, `TLS` |
| **Inbound Virtual Number** | Exotel number that routes calls to this trunk | Your provisioned Exotel number |
| **Codec** | Audio codec for media (if configurable) | `PCMU` (G.711 mulaw), `PCMA` (G.711 alaw) |

## Configuration Notes

- **TLS for production:** UDP is acceptable for quick testing, but use TLS in production to encrypt SIP signaling and prevent eavesdropping.
- **NAT traversal:** If your SIP server is behind NAT, configure STUN/TURN or use a public SIP proxy. Exotel does not perform NAT traversal on behalf of your server.
- **Codec alignment:** Ensure the codec configured on the ExoTrunk matches what your SIP server advertises in the SDP offer. Mismatched codecs result in one-way or no audio.
- **Multiple trunks:** You can create separate trunks for development, staging, and production environments and assign different virtual numbers to each.

## Related

- [LiveKit Integration](./livekit-integration) -- LiveKit SIP Trunking integration
- [ElevenLabs Integration](./elevenlabs-integration) -- ElevenLabs SIP Trunking integration
- [AgentStream Overview](./overview) -- Platform overview
