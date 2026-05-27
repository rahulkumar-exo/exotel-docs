---
sidebar_label: Freshchat
title: "Exotel Integration with Freshchat"
description: "Configure Exotel integration with Freshchat to add voice calling capabilities within your live chat support workflows."
sidebar_position: 4
---

# Exotel Integration with Freshchat

## Overview

Connect Exotel with Freshchat to enable voice calling capabilities within your live chat workflows, allowing agents to seamlessly switch between chat and voice communication.

## Key Capabilities

- **Voice escalation from active chat threads** — Agents can initiate an Exotel call directly from an ongoing Freshchat conversation without losing the chat context or switching tools
- **Click-to-call from chat contact profiles** — Phone numbers on Freshchat contact profiles become one-click dialers, making outbound follow-up calls fast and trackable
- **Unified conversation history** — Call activity and recordings are linked back to the Freshchat conversation thread, giving a single view of all customer interactions across voice and chat
- **Agent availability sync** — Agent availability status in the Exotel widget can reflect in Freshchat, so customers in chat can be informed when an agent is on a call
- **Post-call notes added to chat thread** — Notes and outcomes captured in the Exotel widget after the call are appended to the related Freshchat conversation
- **Automatic contact matching** — When a call comes in or goes out, Exotel matches the phone number to an existing Freshchat contact and links the activity automatically

## Prerequisites

Before configuring this integration, make sure you have:

- An active Exotel account with at least one ExoPhone provisioned
- Your Exotel **Account SID**, **API Key**, and **API Token** — available under **Settings > API** in the [Exotel Dashboard](https://my.exotel.com)
- Administrator access to your Freshchat account (Admin role required to install apps from the Freshchat Marketplace)
- Agents configured in the Exotel Dashboard; for browser-based calling, agents need Chrome or Edge with microphone permissions granted
- A Freshchat plan that supports third-party integrations (check your Freshchat plan's marketplace access)

## Setup Steps

1. **Log in to Freshchat** as an administrator and navigate to **Settings > Integrations & Apps > Marketplace**.
2. Search for **Exotel** and click **Install** on the Exotel integration.
3. Enter your Exotel **Account SID**, **API Key**, and **API Token** when prompted during the installation flow.
4. Map your ExoPhone(s) to the Freshchat inbox or team that handles voice-escalated conversations.
5. Configure agent mappings: associate each Freshchat agent with their Exotel agent ID so calls and chat threads link to the same agent record.
6. Choose your escalation preferences — decide whether agents can initiate calls from the chat thread action menu, from contact profiles, or both.
7. In the Exotel Dashboard, confirm that your inbound call AppLet routes calls to the correct agent group, and enable call recording under **Settings > Call Recording** if needed.
8. Save the configuration and ask agents to reload Freshchat. The Exotel CTI widget will appear within the Freshchat interface.

## What Agents See

After setup, agents handling a live chat conversation see a **Call** button in the chat action menu. Clicking it opens the Exotel softphone widget and dials the customer's phone number, while the chat thread stays open in the same browser tab. The agent can speak on the call and still reference the chat history for context. Once the call ends, the agent adds a brief note in the Exotel widget, and this note — along with call duration and the recording link — is appended to the Freshchat conversation thread, giving a complete omnichannel record of the interaction.

## Related Integrations

- [Freshdesk](/docs/integrations/freshdesk)
- [FreshSales](/docs/integrations/freshsales)
- [Freshdesk Secure Recording](/docs/integrations/freshdesk-secure-recording)
- [Integrations Overview](/docs/integrations/overview)
