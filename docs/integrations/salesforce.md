---
sidebar_label: Salesforce
title: "Exotel Integration with Salesforce"
description: "Set up Exotel integration with Salesforce for click-to-call, automatic call logging, and CRM-embedded telephony features."
sidebar_position: 17
---

# Exotel Integration with Salesforce

## Overview

Integrate Exotel with Salesforce to enable click-to-call, automatic call logging, and CRM-embedded telephony for your sales and support teams.

## Key Capabilities

- **CTI adapter embedded in Salesforce** — The Exotel softphone appears as a docked panel within Salesforce via Salesforce Open CTI, so agents never need to leave the CRM to make or receive calls
- **Click-to-call from any Salesforce record** — Phone numbers on Lead, Contact, Account, Case, and Opportunity records become one-click dialers
- **Screen-pop on inbound calls** — Salesforce automatically opens the matching record (contact, lead, or case) when an inbound call arrives, giving agents full context before they answer
- **Automatic call logging as activities** — Every call is logged as a Salesforce Activity (Task) against the relevant record, with duration, direction, agent, and timestamp
- **Call recording links in activity records** — Recording URLs are stored in the activity so managers can review calls from within Salesforce
- **Works with Salesforce Lightning and Classic** — The Exotel CTI adapter is compatible with both Salesforce Lightning Experience and Salesforce Classic

## Prerequisites

Before configuring this integration, make sure you have:

- An active Exotel account with at least one ExoPhone provisioned
- Your Exotel **Account SID**, **API Key**, and **API Token** — available under **Settings > API** in the [Exotel Dashboard](https://my.exotel.com)
- Salesforce Administrator access to install and configure a CTI adapter (requires permission to manage Call Centers)
- Agents added to the Exotel Dashboard with their phone numbers or SIP endpoints configured

## Setup Steps

1. **Download the Exotel CTI Adapter** package from the Salesforce AppExchange or request the installation URL from Exotel support.
2. **Install the package** in your Salesforce org as a Salesforce Administrator. Choose to install for all users or specific profiles as appropriate.
3. Navigate to **Setup > Call Centers** in Salesforce and open the newly created **Exotel Call Center** definition.
4. Click **Edit** and enter your Exotel **Account SID**, **API Key**, and **API Token** in the call center configuration fields.
5. Go to **Manage Call Center Users** within the Call Center record and add the Salesforce users who will use the integration.
6. In the **Exotel Dashboard**, configure your inbound AppLet to route calls to the agent group connected to Salesforce, and enable call recording if needed.
7. Assign the Exotel softphone to the Salesforce utility bar: go to the relevant Lightning App, click **Edit**, and add the Open CTI Softphone to the utility bar.
8. Ask agents to reload Salesforce. The Exotel CTI panel will appear in the utility bar at the bottom of the screen.

## What Agents See

After setup, agents see the Exotel softphone docked in the Salesforce utility bar. Clicking any phone number on a Lead, Contact, Account, or Case record instantly places a call through the widget. For inbound calls, Salesforce pops the matching record automatically. Post-call, the widget prompts the agent to enter notes and a call outcome, which are saved as a Salesforce Task on the related record — keeping the CRM history accurate and complete without manual effort.

## Related Integrations

- [Salesforce Secure Recording](/docs/integrations/salesforce-secure-recording)
- [HubSpot](/docs/integrations/hubspot)
- [Zoho CRM](/docs/integrations/zoho-crm)
- [Integrations Overview](/docs/integrations/overview)
