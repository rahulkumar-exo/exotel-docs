---
sidebar_label: FreshSales
title: "Exotel Integration with FreshSales"
description: "Set up Exotel integration with FreshSales CRM for click-to-call, automatic call logging, and sales workflow automation."
sidebar_position: 5
---

# Exotel Integration with FreshSales

## Overview

Integrate Exotel with FreshSales to add click-to-call functionality and automatic call logging to your sales CRM, streamlining your sales workflow.

## Key Capabilities

- **Click-to-call from leads and contacts** — Sales reps can dial directly from any FreshSales lead or contact record with a single click, keeping them in the CRM throughout the sales process
- **Call disposition logging** — After each call, agents select an outcome (Interested, Not Interested, Callback Requested, etc.) that is saved against the lead record
- **Automatic pipeline advancement** — Configure FreshSales workflows to move leads to the next pipeline stage based on call disposition, reducing manual status updates
- **Call activity on contact timeline** — Every call is logged on the FreshSales activity timeline with duration, timestamp, agent, and notes for full sales history visibility
- **Call recordings linked to leads** — Recording URLs are stored on the call activity, so managers can review conversations during deal reviews or coaching sessions
- **Inbound lead identification** — When a known lead calls in, their FreshSales record surfaces automatically so reps can respond with full context

## Prerequisites

Before configuring this integration, make sure you have:

- An active Exotel account with at least one ExoPhone provisioned
- Your Exotel **Account SID**, **API Key**, and **API Token** — available under **Settings > API** in the [Exotel Dashboard](https://my.exotel.com)
- Administrator access to your FreshSales account (Admin role required to install and configure integrations from the FreshSales Marketplace)
- Agents added to the Exotel Dashboard with their phone numbers or SIP endpoints configured

## Setup Steps

1. **Log in to FreshSales** as an administrator and go to **Admin Settings > Marketplace**.
2. Search for **Exotel** and click **Install** on the Exotel integration listing.
3. Enter your Exotel **Account SID**, **API Key**, and **API Token** in the integration configuration form.
4. Map your ExoPhone(s) to the FreshSales users or teams that will make and receive calls.
5. Configure agent mappings: associate each FreshSales user with their Exotel agent ID or phone number.
6. Set up call disposition options in FreshSales to match your sales process — these will be the choices agents see in the post-call popup.
7. (Optional) Create FreshSales workflow automations that trigger pipeline stage changes or task creation based on specific call dispositions.
8. In the Exotel Dashboard, configure your inbound AppLet to route calls to the relevant agent group, and enable call recording if required.
9. Save the configuration and ask reps to reload FreshSales. The Exotel CTI widget will appear inside the CRM interface.

## What Agents See

After setup, sales reps see the Exotel softphone widget embedded in FreshSales. A click-to-call button appears next to every phone number on lead and contact records. When a call ends, a prompt asks the rep to choose a disposition and add a quick note — this is saved automatically as a call activity on the lead timeline. If pipeline automation is configured, the lead advances to the next stage without any additional manual action, keeping the sales pipeline accurate in real time.

## Related Integrations

- [Freshdesk](/docs/integrations/freshdesk)
- [Freshchat](/docs/integrations/freshchat)
- [Freshdesk Secure Recording](/docs/integrations/freshdesk-secure-recording)
- [Integrations Overview](/docs/integrations/overview)
