---
sidebar_label: LeadSquared UTC
title: "Exotel LeadSquared UTC Connector"
description: "Configure the Exotel-LeadSquared Universal Telephony Connector (UTC) for CRM-integrated calling and lead management."
sidebar_position: 8
---

# Exotel LeadSquared UTC Connector

## Overview

The Exotel-LeadSquared Universal Telephony Connector (UTC) embeds an Exotel dialer widget directly inside the LeadSquared CRM interface. Agents can make and receive calls without leaving the CRM, and every call is automatically logged as a lead activity — eliminating manual data entry and giving sales managers complete call visibility from within LeadSquared.

## Key Capabilities

- **Click-to-call from lead records** — dial any lead directly from the LeadSquared contact page with a single click
- **Automatic call logging** — call duration, recording link, and outcome are written back to the lead timeline automatically
- **Inbound call pop-ups** — screen-pop shows the matching lead record when an incoming call arrives
- **Virtual number mapping** — assign different Exotel numbers to teams or users for routing and reporting
- **Call recordings in CRM** — recordings are accessible directly from the lead activity feed

## Prerequisites

- An active Exotel account with at least one virtual number provisioned
- Exotel API credentials: **Account SID**, **API Key**, and **API Token** (available under **Settings → API Credentials** in the Exotel dashboard at [my.exotel.com](https://my.exotel.com))
- A LeadSquared account with administrator access
- The Exotel app installed from the LeadSquared Marketplace (requires a LeadSquared plan that supports third-party telephony connectors)

## Setup Steps

1. **Install the Exotel app in LeadSquared.** Log into LeadSquared as an administrator, navigate to **Apps & Integrations → Marketplace**, search for "Exotel", and click **Install**.

2. **Open the Exotel connector settings.** After installation, go to **Apps & Integrations → Installed Apps → Exotel UTC** and click **Configure**.

3. **Enter your Exotel API credentials.** Paste in your Account SID, API Key, and API Token. These are found under **Settings → API Credentials** in the Exotel dashboard. Click **Verify** to confirm the credentials are accepted.

4. **Map virtual numbers to LeadSquared users.** Under the **User Mapping** section, assign each Exotel virtual number to the corresponding LeadSquared agent. Each agent should have a unique number for accurate call attribution.

5. **Enable click-to-call on lead records.** In **LeadSquared → Settings → Telephony**, set the telephony provider to **Exotel UTC** and enable the **Click-to-Call** toggle. Save the settings.

6. **Configure call flow in the Exotel dashboard (optional).** If you need IVR, call recording, or routing rules, set these up in the Exotel dashboard under **ExoPhone → Call Flow** before agents begin using the integration.

7. **Test the integration.** Have an agent log into LeadSquared, open a lead record, and click the phone icon. Confirm the call connects and that a call activity appears on the lead timeline after the call ends.

8. **Distribute the Exotel dialer widget.** The embedded widget appears automatically in the LeadSquared interface once the connector is active — no browser extension or separate app is needed for desktop users.

## Configuration Notes

- **Call recording:** Enable call recording inside the Exotel call flow. Recordings will appear as a playable link in the LeadSquared lead activity.
- **Missed call handling:** Set up a missed-call callback flow in Exotel so that unanswered inbound calls are automatically logged in LeadSquared and trigger a follow-up task.
- **Multi-team setups:** Use separate Exotel virtual numbers per team and map them to LeadSquared user groups for segmented reporting.
- **Credential rotation:** If you regenerate your Exotel API Token, update it in the LeadSquared connector settings immediately to avoid call failures.

## Related Integrations

- [LeadSquared Mobile App](/docs/integrations/leadsquared-mobile)
- [LeadSquared IP-PSTN Connector](/docs/integrations/leadsquared-ip-pstn)
- [LeadSquared WhatsApp](/docs/integrations/leadsquared-whatsapp)
- [Integrations Overview](/docs/integrations/overview)
