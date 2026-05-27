---
sidebar_label: Freshdesk
title: "Exotel Integration with Freshdesk"
description: "Set up Exotel integration with Freshdesk to enable click-to-call, call logging, and telephony features in your support tickets."
sidebar_position: 3
---

# Exotel Integration with Freshdesk

## Overview

Integrate Exotel with Freshdesk to enable telephony features directly within your support ticket workflow, including click-to-call and automatic call logging.

## Key Capabilities

- **Click-to-call from contacts and tickets** — Agents can call customers directly from any Freshdesk contact or ticket record without switching to a separate phone
- **Automatic ticket creation from calls** — Inbound calls from unknown numbers can trigger a new Freshdesk ticket automatically, so every customer interaction is tracked
- **Call logging as ticket notes** — Completed calls are logged as private or public notes on the relevant ticket, including call duration, direction, and agent-entered summary
- **Call recordings attached to tickets** — Recording links are appended to the ticket thread, giving support managers easy access to review conversations
- **Screen-pop on inbound calls** — When a known contact calls in, their Freshdesk contact record and open tickets surface automatically so agents can respond with full context
- **Disposition and note capture** — Agents are prompted after each call to add notes and tag the outcome, keeping ticket history complete

## Prerequisites

Before configuring this integration, make sure you have:

- An active Exotel account with at least one ExoPhone provisioned
- Your Exotel **Account SID**, **API Key**, and **API Token** — available under **Settings > API** in the [Exotel Dashboard](https://my.exotel.com)
- Administrator access to your Freshdesk account (Admin role required to install apps from the Freshdesk Marketplace)
- Agents added to the Exotel Dashboard with their phone numbers or SIP endpoints configured

## Setup Steps

1. **Log in to Freshdesk** as an administrator and navigate to **Admin > Support Operations > Apps**.
2. Search for **Exotel** in the Freshdesk Marketplace and click **Install**.
3. In the installation screen, enter your Exotel **Account SID**, **API Key**, and **API Token**.
4. Map your ExoPhone(s) to the Freshdesk groups or agents that should handle inbound calls.
5. Configure agent mappings: match each Freshdesk agent email to their Exotel agent ID or phone number in the app settings.
6. Set your ticket creation rules — decide whether inbound calls from unknown numbers should create new tickets, and choose the default ticket type, priority, and group.
7. In the Exotel Dashboard, configure your inbound call AppLet to route calls to the appropriate agent group connected to Freshdesk, and enable call recording under **Settings > Call Recording** if needed.
8. Save the settings and ask agents to reload Freshdesk. The Exotel CTI widget will appear docked within the Freshdesk interface.

## What Agents See

After setup, agents see the Exotel softphone widget docked inside Freshdesk. A click-to-call button appears next to every phone number on contact and ticket records. When a call completes, the widget prompts the agent to add a call note and disposition. This note is automatically appended to the ticket thread along with call metadata (duration, recording link, timestamp) — so the support history is always up to date without any manual copy-pasting.

## Related Integrations

- [Freshchat](/docs/integrations/freshchat)
- [FreshSales](/docs/integrations/freshsales)
- [Freshdesk Secure Recording](/docs/integrations/freshdesk-secure-recording)
- [Integrations Overview](/docs/integrations/overview)
