---
sidebar_label: HubSpot
title: "Exotel HubSpot Calling Integration"
description: "Set up Exotel calling integration with HubSpot for click-to-call, automatic call logging, and CRM activity tracking."
sidebar_position: 7
---

# Exotel HubSpot Calling Integration

## Overview

Enable Exotel calling integration within HubSpot for click-to-call functionality, automatic call activity logging, and seamless CRM-embedded telephony.

## Key Capabilities

- **Click-to-call from contacts, companies, and deals** — Agents can call any HubSpot record directly from the contact timeline or deal view without switching tools
- **Automatic call logging to HubSpot timeline** — Completed calls are logged as activities on the contact and deal timeline, including call duration, direction, and outcome
- **Call notes and dispositions** — Agents are prompted post-call to add notes and select a disposition (e.g., Connected, Left Voicemail, No Answer), all saved to the HubSpot record
- **Inbound caller identification** — When a known contact calls in, HubSpot surfaces their record and timeline so agents can respond with full context
- **Call recordings linked in timeline** — Recording links are stored directly in the HubSpot call activity, making it easy for managers to review conversations
- **Works across HubSpot hubs** — Compatible with HubSpot Sales Hub, Service Hub, and CRM Free plans

## Prerequisites

Before configuring this integration, make sure you have:

- An active Exotel account with at least one ExoPhone provisioned
- Your Exotel **Account SID**, **API Key**, and **API Token** — available under **Settings > API** in the [Exotel Dashboard](https://my.exotel.com)
- A HubSpot account with **Super Admin** or **App Marketplace** permissions to install integrations
- Agents configured in the Exotel Dashboard; for browser-based calling, agents need Chrome or Edge with microphone permissions granted

## Setup Steps

1. **Log in to HubSpot** as a Super Admin and navigate to the **App Marketplace** (click the grid icon in the top navigation).
2. Search for **Exotel** and select the Exotel Calling integration listing.
3. Click **Install** and authorize HubSpot to connect with your Exotel account when prompted.
4. In the Exotel integration settings page within HubSpot, enter your **Account SID**, **API Key**, and **API Token**.
5. Select the ExoPhone(s) you want to use for outbound calling from HubSpot, and configure your inbound routing in the Exotel Dashboard to direct calls to your support or sales queue.
6. Map HubSpot users to their corresponding Exotel agent IDs under the **Agent Mapping** section of the integration settings.
7. Configure call logging preferences — choose which call properties (outcome, notes, recording URL) should sync automatically to the HubSpot contact timeline.
8. Save the configuration. Agents should reload HubSpot; the Exotel dialer widget will appear in the HubSpot calling interface.

## What Agents See

After setup, agents see a **Call** button on every HubSpot contact, company, and deal record. Clicking it opens the Exotel softphone panel embedded within HubSpot. The call connects directly through the browser, and the contact's name, company, and recent activity are visible during the call. After the call ends, agents fill in a short note and disposition in the same panel, and the completed activity — with duration, recording link, and notes — appears immediately on the contact's HubSpot timeline.

## Related Integrations

- [Salesforce](/docs/integrations/salesforce)
- [Zoho CRM](/docs/integrations/zoho-crm)
- [Integrations Overview](/docs/integrations/overview)
