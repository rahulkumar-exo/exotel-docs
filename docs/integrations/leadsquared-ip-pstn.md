---
sidebar_label: LeadSquared IP-PSTN
title: "LSQ IP-PSTN Connector"
description: "Configure the LeadSquared IP-PSTN connector with Exotel for browser-based and PSTN calling within your CRM."
sidebar_position: 10
---

# LSQ IP-PSTN Connector

## Overview

The LeadSquared IP-PSTN Connector combines Exotel's WebRTC technology with traditional PSTN calling inside the LeadSquared CRM. Agents can make calls directly from their browser without a physical phone or mobile device, while the system falls back to PSTN for connectivity where WebRTC is unavailable. This setup is especially well-suited for remote and work-from-home sales teams who need reliable, low-friction calling from any location.

## Key Capabilities

- **Browser-based calling via WebRTC** — agents dial and receive calls from a Chrome or Firefox tab, no phone hardware required
- **Automatic PSTN fallback** — if the browser connection is poor, calls can route over standard PSTN for reliability
- **SIP extension assignment** — each agent gets a dedicated SIP extension for direct inward dialing and identity-based reporting
- **CRM call logging** — all calls, durations, and recordings are logged to the LeadSquared lead timeline automatically
- **Supervisor monitoring** — call quality metrics and live call status are visible to team leads in the LeadSquared dashboard

## Prerequisites

- An active Exotel account with WebRTC / IP calling enabled (contact Exotel support to confirm your plan includes WebRTC)
- Exotel API credentials: **Account SID**, **API Key**, and **API Token** (available under **Settings → API Credentials** at [my.exotel.com](https://my.exotel.com))
- Exotel WebRTC SDK credentials (a separate set of WebRTC-specific keys provided by Exotel)
- A LeadSquared account with administrator access and the IP-PSTN Connector feature enabled on your plan
- Agents using a supported browser (Google Chrome 90+ or Mozilla Firefox 88+ recommended) with microphone access granted

## Setup Steps

1. **Enable IP-PSTN in LeadSquared.** Log in as a LeadSquared administrator, go to **Settings → Telephony → IP-PSTN Configuration**, and enable the feature. Select **Exotel** as the telephony provider.

2. **Enter Exotel API credentials.** Paste your Exotel Account SID, API Key, and API Token into the designated fields. Click **Validate** to confirm connectivity.

3. **Upload Exotel WebRTC SDK credentials.** In the **WebRTC Settings** section, enter the WebRTC-specific App ID and Secret provided by Exotel. These are separate from the main API credentials and are required for browser-based audio.

4. **Create SIP extensions in the Exotel dashboard.** Navigate to **my.exotel.com → ExoPhone → SIP Extensions** and create an extension for each agent. Note the SIP username and password for each.

5. **Assign SIP extensions to LeadSquared users.** Back in LeadSquared under **Settings → Telephony → User Assignment**, map each agent's LeadSquared user account to their corresponding Exotel SIP extension.

6. **Configure call routing in Exotel.** In the Exotel dashboard, set up the inbound call flow for your virtual number to route calls to the appropriate SIP extension or hunt group.

7. **Test browser calling.** Have an agent open LeadSquared in Chrome, click the soft-phone icon in the toolbar, and place a test call. Verify that audio is clear and that the call appears in the lead activity log.

8. **Confirm PSTN fallback (optional).** To validate fallback behavior, temporarily disable the agent's WebRTC connection and verify the call routes correctly over PSTN.

## Configuration Notes

- **Microphone permissions:** Agents must allow microphone access in their browser the first time they use the soft phone. Blocked permissions are the most common cause of "no audio" issues.
- **Network requirements:** WebRTC requires UDP ports 10000–60000 to be open outbound. In firewalled corporate networks, check with IT before deployment.
- **Headset recommendation:** A USB headset with echo cancellation significantly improves call quality compared to built-in laptop audio.
- **SIP extension security:** Use strong, unique passwords for each SIP extension and avoid sharing credentials between agents.

## Related Integrations

- [LeadSquared UTC Connector](/docs/integrations/leadsquared-utc)
- [LeadSquared Mobile App](/docs/integrations/leadsquared-mobile)
- [LeadSquared WhatsApp](/docs/integrations/leadsquared-whatsapp)
- [WebRTC SDK](/docs/integrations/webrtc-sdk)
- [Integrations Overview](/docs/integrations/overview)
