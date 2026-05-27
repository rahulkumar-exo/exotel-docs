---
sidebar_label: Zoho Desk
title: "Exotel Integration with Zoho Desk"
description: "Set up Exotel integration with Zoho Desk for click-to-call, automatic ticket creation, and call logging in your helpdesk."
sidebar_position: 1
---

# Exotel Integration with Zoho Desk

## Overview

Integrate Exotel with Zoho Desk to enable telephony features directly within your helpdesk platform, including click-to-call, automatic ticket creation, and call activity logging.

## Key Capabilities

- **Click-to-call from tickets and contacts** — Agents can dial any phone number in Zoho Desk with a single click, without switching to a separate dialer
- **Automatic call logging** — Every inbound and outbound call is recorded as an activity on the corresponding ticket, with duration, timestamp, and outcome
- **Call recordings attached to tickets** — Recordings are linked directly to the ticket thread, giving supervisors and agents full context for every interaction
- **Screen-pop on inbound calls** — When a customer calls in, Zoho Desk surfaces the matching ticket or contact record so agents can respond with full context
- **New ticket creation from calls** — Calls from unknown numbers can trigger a new ticket automatically, ensuring no customer interaction falls through the cracks
- **Agent availability control** — Agents can set their status (available, busy, offline) from the Exotel CTI widget embedded in Zoho Desk

## Prerequisites

Before configuring this integration, make sure you have:

- An active Exotel account with at least one virtual number (ExoPhone) provisioned
- Your Exotel **Account SID**, **API Key**, and **API Token** — available under **Settings > API** in the [Exotel Dashboard](https://my.exotel.com)
- Administrator access to your Zoho Desk account
- Agents who will use the integration must have a valid Exotel agent mapping (phone number or SIP endpoint configured in the Exotel Dashboard)

## Setup Steps

1. **Log in to Zoho Desk** as an administrator and navigate to **Setup > Marketplace > All**.
2. Search for **Exotel** in the marketplace and click **Install** on the Exotel CTI extension.
3. During installation, enter your Exotel **Account SID**, **API Key**, and **API Token** when prompted.
4. Map your Exotel virtual number (ExoPhone) to the Zoho Desk department or queue that should receive inbound calls.
5. Configure agent mappings: in the extension settings, match each Zoho Desk agent email to their corresponding Exotel agent ID or phone number.
6. Set up your call workflow — choose whether inbound calls should search for existing contacts, open matching tickets, or create new tickets automatically.
7. Enable call recording in your Exotel Dashboard under **Settings > Call Recording** if you want recordings attached to tickets.
8. Ask agents to refresh their Zoho Desk browser session. The Exotel CTI widget will appear in the bottom-left corner of the interface.

## What Agents See

After setup, agents see the Exotel softphone widget docked inside Zoho Desk. From any ticket or contact record, a click-to-call button appears next to phone numbers. When a call is answered or completed, the widget prompts the agent to add a call note and select a disposition. All of this — the note, disposition, duration, and recording link — is saved automatically as a ticket activity, keeping the support history complete without any manual data entry.

## Related Integrations

- [Zoho CRM (PSTN & VoIP)](/docs/integrations/zoho-crm)
- [Integrations Overview](/docs/integrations/overview)
