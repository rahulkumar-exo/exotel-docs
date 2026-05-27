---
sidebar_label: WebRTC SDK
title: "IP-PSTN Intermix - Customer Onboarding and WebRTC SDK Integration"
description: "Guide for IP-PSTN intermix customer onboarding and WebRTC SDK integration with Exotel for browser-based calling."
sidebar_position: 19
---

# IP-PSTN Intermix - Customer Onboarding and WebRTC SDK Integration

## Overview

This guide covers the customer onboarding process for IP-PSTN intermix and WebRTC SDK integration, enabling browser-based calling alongside traditional PSTN telephony. IP-PSTN intermix allows your agents to make and receive calls directly from a browser using WebRTC while Exotel bridges those calls to regular phone numbers over the PSTN network.

## Key Capabilities

- Browser-based softphone for agents — no desk phone or separate telephony client required
- Full PSTN bridging: agents on a browser can call or receive calls from any mobile or landline number
- SIP credential-based authentication for each agent session
- Embed the Exotel WebRTC softphone widget directly into your web application or CRM
- Supports call controls: hold, mute, transfer, and DTMF within the browser
- Works alongside existing Exotel features: call recording, IVR, and call analytics

## Prerequisites

- An active Exotel account with IP-PSTN intermix enabled — this feature requires explicit activation by Exotel; contact your account manager or support@exotel.in to onboard
- SIP credentials (SIP username, password, and SIP server domain) provisioned by Exotel for your account
- An Exotel virtual phone number (ExoPhone) that will be the caller ID for outbound PSTN calls
- A web application where you will embed the softphone widget (any modern browser-based app works)
- The Exotel WebRTC SDK package (provided by Exotel during onboarding)

## Setup Steps

1. Contact Exotel support or your account manager to initiate IP-PSTN intermix onboarding. Provide your use case (contact centre, field agent app, etc.) and expected concurrent call volume.
2. Exotel will provision your account and issue **SIP credentials**: a SIP username, SIP password, and SIP server hostname specific to your account.
3. Install the Exotel WebRTC SDK in your web project. The SDK is typically distributed as a JavaScript package; add it via your package manager or include the provided script bundle.
4. Initialise the SDK in your application with your SIP credentials:
   - Pass the SIP username, password, and server domain to the SDK's initialisation method
   - Set the ExoPhone number as the default caller ID for outbound calls
5. Embed the softphone widget component into your web application's agent interface. The widget exposes call controls (dial, answer, end, mute, hold) as UI elements or JavaScript methods you can bind to your own UI.
6. Test an outbound call from the browser to a real phone number. Confirm that the call connects and that audio flows correctly in both directions.
7. Test an inbound call by dialling your ExoPhone from a mobile phone; verify the browser softphone rings and can answer the call.
8. Configure call recording and logging in your Exotel dashboard if needed, and verify that recordings appear under **Call Logs** after each test call.

## Configuration Notes

- WebRTC requires a secure context — your web application must be served over HTTPS for the browser to grant microphone access. Local development on `localhost` is an exception and will work without HTTPS.
- Ensure your network allows WebRTC traffic: UDP ports 10000–60000 and the SIP signalling port (typically 5060 or 5061 TLS) must not be blocked by corporate firewalls or NAT configurations.
- If agents work behind strict enterprise firewalls, configure TURN server details (provided by Exotel during onboarding) in the SDK to relay media through the firewall.
- SIP credentials are per-agent or per-session depending on your provisioning. Do not share credentials across concurrent sessions as this will cause registration conflicts and dropped calls.

## Related Integrations

- [LeadSquared IP-PSTN Connector](/docs/integrations/leadsquared-ip-pstn)
- [WebRTC SDK (IP-PSTN) API Reference](/docs/ip-pstn-webrtc/overview)
- [Integrations Overview](/docs/integrations/overview)
