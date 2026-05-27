---
sidebar_label: Zoho CRM
title: "Exotel Integration with Zoho CRM (PSTN & VoIP)"
description: "Configure Exotel integration with Zoho CRM for PSTN and VoIP calling, call logging, and contact management within your CRM."
sidebar_position: 2
---

# Exotel Integration with Zoho CRM (PSTN & VoIP)

## Overview

Connect Exotel with Zoho CRM to enable PSTN and VoIP calling capabilities, automatic call logging, and seamless contact management within your CRM workflow.

## Key Capabilities

- **Click-to-call from leads, contacts, and deals** — Agents can initiate calls directly from any CRM record without leaving Zoho CRM
- **PSTN and VoIP calling modes** — Choose PSTN (calls routed through agent's mobile or landline) or VoIP (browser-based softphone) depending on your team's setup
- **Automatic call activity logging** — Each call is recorded as an activity against the lead, contact, or deal, capturing duration, direction, and agent notes
- **Inbound screen-pop** — When a contact calls in, their CRM record opens automatically so agents have full context before picking up
- **Call recording and playback** — Recordings are stored and linked to the CRM activity, accessible directly from the record timeline
- **Disposition and note capture** — Agents are prompted to add a call outcome and notes at the end of each call, keeping sales history accurate

## Prerequisites

Before configuring this integration, make sure you have:

- An active Exotel account with at least one ExoPhone (virtual number) provisioned
- Your Exotel **Account SID**, **API Key**, and **API Token** — available under **Settings > API** in the [Exotel Dashboard](https://my.exotel.com)
- Administrator access to your Zoho CRM account
- Agents configured in the Exotel Dashboard with their phone numbers or SIP endpoints; for VoIP mode, agents need a WebRTC-compatible browser (Chrome or Edge recommended)

## Setup Steps

1. **Log in to Zoho CRM** as an administrator and go to **Setup > Marketplace > All Extensions**.
2. Search for **Exotel** and click **Install** on the Exotel Phone Bridge extension.
3. Enter your Exotel **Account SID**, **API Key**, and **API Token** in the extension configuration screen.
4. Select your calling mode: choose **PSTN** if agents will receive calls on a physical phone, or **VoIP** for browser-based calling.
5. Map your ExoPhone(s) to the relevant CRM users or queues under the extension's agent mapping settings.
6. Configure which CRM modules (Leads, Contacts, Deals) should show the click-to-call button and log activities automatically.
7. In your Exotel Dashboard, ensure your inbound call flow (AppLet) routes calls to the appropriate agent group connected to Zoho CRM.
8. Save the configuration and ask agents to reload their Zoho CRM session to activate the Exotel CTI widget.

## What Agents See

After setup, agents see the Exotel CTI widget docked within Zoho CRM. A click-to-call icon appears next to every phone number on lead, contact, and deal records. In VoIP mode, the browser handles the call directly; in PSTN mode, the agent's configured phone rings first and then connects to the customer. At call end, a popup prompts the agent to log a note and disposition, which is then saved as a CRM activity automatically — no copy-pasting or manual entry required.

## Related Integrations

- [Zoho Desk](/docs/integrations/zoho-desk)
- [Integrations Overview](/docs/integrations/overview)
