---
sidebar_label: LeadSquared WhatsApp
title: "Configure Exotel's WhatsApp Cloud Integration with LeadSquared"
description: "Set up Exotel's WhatsApp Cloud integration with LeadSquared for automated messaging workflows and lead engagement."
sidebar_position: 11
---

# Configure Exotel's WhatsApp Cloud Integration with LeadSquared

## Overview

Configure Exotel's WhatsApp Cloud integration with LeadSquared to enable automated messaging workflows and lead engagement through WhatsApp. Once set up, agents can send and receive WhatsApp messages directly from a lead or contact's profile in LeadSquared, and automated workflows can trigger WhatsApp notifications at key stages of the sales or support funnel.

## Key Capabilities

- Agents can send WhatsApp messages to leads and contacts from within the LeadSquared CRM interface
- Receive and view inbound WhatsApp replies on the lead's activity timeline in LeadSquared
- Trigger automated WhatsApp messages from LeadSquared workflows (e.g., on lead creation, stage change, or form submission)
- Send approved WhatsApp Business message templates for outbound notifications (reminders, follow-ups, confirmations)
- Supports both one-way broadcast messages and two-way conversational messaging
- All WhatsApp activity is logged against the lead record for a complete interaction history

## Prerequisites

- An active Exotel account with WhatsApp Business API enabled — contact support@exotel.in or your account manager to activate WhatsApp on your Exotel plan
- An approved **WhatsApp Business Account (WABA)** linked to your Exotel account, with at least one approved message template if you plan to send outbound notifications
- Your Exotel **Account SID**, **API Key**, and **API Token** from **Settings → API Credentials** on [my.exotel.com](https://my.exotel.com)
- The Exotel WhatsApp **webhook URL** and **webhook secret** (generated in the Exotel dashboard) to forward inbound WhatsApp messages to LeadSquared
- LeadSquared account with **Admin** access to the **Settings → Apps & Integrations** section

## Setup Steps

1. Log in to [my.exotel.com](https://my.exotel.com) and confirm your WhatsApp Business Account is active under **Products → WhatsApp**. Copy your **Account SID**, **API Key**, and **API Token**.
2. In the Exotel WhatsApp settings, generate or copy the **Inbound Webhook URL** — this is the URL Exotel will call when a customer replies on WhatsApp.
3. Log in to LeadSquared and go to **Settings → Apps & Integrations → WhatsApp** (or search for "Exotel" in the integrations marketplace).
4. Select Exotel as the WhatsApp provider and enter your credentials:
   - **Account SID**: your Exotel Account SID
   - **API Key**: your Exotel API Key
   - **API Token**: your Exotel API Token
   - **WhatsApp Number**: the WhatsApp Business number provisioned on your Exotel account
5. In the LeadSquared integration settings, locate the **Webhook URL** that LeadSquared generates for receiving inbound messages. Copy this URL.
6. Return to [my.exotel.com](https://my.exotel.com) and paste the LeadSquared webhook URL into the **Inbound Message Webhook** field for your WhatsApp number. This routes customer replies to LeadSquared.
7. Send a test outbound WhatsApp message from LeadSquared to a test lead's phone number. Confirm it delivers on WhatsApp and that the activity is logged on the lead record in LeadSquared.
8. Reply to the test message from the phone. Verify the reply appears on the lead's activity timeline in LeadSquared within a few seconds.

## Configuration Notes

- WhatsApp Business API requires that outbound messages to customers who have not messaged you in the past 24 hours use an approved template. Free-form messages are only permitted within a 24-hour customer-initiated session window.
- Ensure the WhatsApp Business number is not also actively used in the WhatsApp consumer app or WhatsApp Business app — a number can only be registered on one WhatsApp Business API account at a time.
- If LeadSquared workflows should trigger WhatsApp messages, build the workflow action using the WhatsApp integration's "Send Message" activity type and select the approved template and field mappings.
- Webhook delivery from Exotel to LeadSquared requires LeadSquared's webhook endpoint to be publicly accessible. If you have IP allowlisting on your LeadSquared instance, add Exotel's outbound IP ranges (available from your Exotel account manager) to the allowlist.

## Related Integrations

- [LeadSquared UTC Connector](/docs/integrations/leadsquared-utc)
- [LeadSquared Mobile App](/docs/integrations/leadsquared-mobile)
- [LeadSquared IP-PSTN Connector](/docs/integrations/leadsquared-ip-pstn)
- [WhatsApp API](/docs/whatsapp-api/overview)
- [Integrations Overview](/docs/integrations/overview)
