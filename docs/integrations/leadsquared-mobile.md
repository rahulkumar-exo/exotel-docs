---
sidebar_label: LeadSquared Mobile
title: "Exotel LeadSquared Mobile App Integration"
description: "Integrate Exotel with the LeadSquared mobile app for on-the-go calling, call logging, and lead management."
sidebar_position: 9
---

# Exotel LeadSquared Mobile App Integration

## Overview

The Exotel LeadSquared Mobile App Integration lets field sales agents make and receive business calls directly from the LeadSquared iOS or Android app. Calls are routed through Exotel rather than the device's native dialer, so they are automatically logged against the correct lead record, can be recorded, and appear in CRM reports — even when agents are away from the office.

## Key Capabilities

- **In-app calling on iOS and Android** — agents tap a lead's phone number in the LeadSquared app and the call goes out through Exotel, not the device SIM
- **Automatic call logging** — call start time, duration, direction (inbound/outbound), and recording link are written to the lead timeline without any manual input
- **Virtual number display** — outbound calls show the company's Exotel virtual number as the caller ID, keeping personal mobile numbers private
- **Call recording** — conversations are recorded and stored in Exotel; a playback link appears in the lead activity in LeadSquared
- **Inbound call routing** — incoming calls to a virtual number can be forwarded to the agent's mobile through the LeadSquared app

## Prerequisites

- An active Exotel account with at least one virtual number
- Exotel API credentials: **Account SID**, **API Key**, and **API Token** (found under **Settings → API Credentials** at [my.exotel.com](https://my.exotel.com))
- LeadSquared account with administrator access and mobile calling enabled on your plan
- LeadSquared mobile app installed on iOS (13+) or Android (8+) on each agent's device
- Stable mobile data or Wi-Fi connection on agent devices (calls use VoIP over the internet)

## Setup Steps

1. **Verify mobile calling is enabled on your LeadSquared plan.** Log in as an administrator, go to **Settings → Telephony**, and confirm that mobile calling is listed as an active feature. If not, contact LeadSquared support to enable it.

2. **Connect Exotel as the telephony provider.** In **Settings → Telephony**, select **Exotel** as the provider and enter your Account SID, API Key, and API Token. Save and validate the credentials.

3. **Assign virtual numbers to mobile users.** Under **Settings → Telephony → User Mapping**, assign each agent's Exotel virtual number to their LeadSquared user account. Each agent should have a dedicated number for accurate call attribution in reports.

4. **Enable call recording (optional but recommended).** In the Exotel dashboard at [my.exotel.com](https://my.exotel.com), open the call flow associated with your virtual numbers and enable the **Record Call** applet. Recordings will automatically surface in LeadSquared lead activities.

5. **Configure inbound routing in Exotel.** If agents should receive inbound calls through the app, set up a call flow in Exotel that forwards calls to the agent's Exotel number, which the LeadSquared mobile app will ring.

6. **Have agents log in and test.** Ask each agent to open the LeadSquared mobile app, navigate to a test lead record, and tap the call button. Verify the call goes out with the Exotel virtual number as caller ID and that a call activity appears on the lead after the call ends.

7. **Confirm push notifications for inbound calls.** For agents to receive incoming calls in the app, push notifications must be enabled on their device. Have each agent check their device notification settings for the LeadSquared app.

## Configuration Notes

- **Caller ID privacy:** Outbound calls always show the Exotel virtual number, not the agent's personal SIM number. This is by design and cannot be overridden from within LeadSquared.
- **Data usage:** Each call uses approximately 1–2 MB of mobile data per minute. Advise agents on high-volume plans to use Wi-Fi where possible.
- **App version:** Ensure agents are on the latest version of the LeadSquared mobile app. Older versions may not support Exotel-based calling.
- **Battery and background permissions:** On Android, grant the LeadSquared app permission to run in the background and disable battery optimization for it, so inbound call push notifications arrive reliably.

## Related Integrations

- [LeadSquared UTC Connector](/docs/integrations/leadsquared-utc)
- [LeadSquared IP-PSTN Connector](/docs/integrations/leadsquared-ip-pstn)
- [LeadSquared WhatsApp](/docs/integrations/leadsquared-whatsapp)
- [Integrations Overview](/docs/integrations/overview)
