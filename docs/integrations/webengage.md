---
sidebar_label: WebEngage
title: "Use WebEngage via Exotel Native SMS Plugin"
description: "Configure WebEngage to send SMS through Exotel's native SMS plugin for user engagement and retention campaigns."
sidebar_position: 14
---

# Use WebEngage via Exotel Native SMS Plugin

## Overview

Configure WebEngage to use Exotel's native SMS plugin for sending SMS messages as part of your user engagement and retention campaigns. WebEngage supports Exotel as a Custom SMS Provider, letting you route transactional and promotional messages through Exotel's delivery infrastructure without leaving the WebEngage journey builder.

## Key Capabilities

- Send transactional and promotional SMS from WebEngage journeys using your Exotel sender ID
- Trigger SMS on user events, lifecycle milestones, or scheduled campaigns
- Pass dynamic attributes (name, OTP, order ID) as message variables via WebEngage's personalisation engine
- Track delivery status through Exotel's DLT-compliant pipeline
- Supports both individual and bulk SMS dispatch from WebEngage segments
- Use DLT-registered templates automatically enforced at the Exotel API layer

## Prerequisites

- An active Exotel account with SMS enabled (contact support@exotel.in to enable if not active)
- Your Exotel **Account SID**, **API Key**, and **API Token** — available under **API Credentials** on [my.exotel.com](https://my.exotel.com)
- A DLT-registered **Sender ID** and at least one approved message template registered under your Principal Entity
- A WebEngage account with admin access to the **Channel Settings** panel
- SMS use case approved on the TRAI DLT portal (required for Indian traffic)

## Setup Steps

1. Log in to your [my.exotel.com](https://my.exotel.com) dashboard. Go to **Settings → API Credentials** and copy your **Account SID**, **API Key**, and **API Token**.
2. Note the Exotel SMS API endpoint for your account region. For India accounts this is typically `https://api.exotel.com/v1/Accounts/{AccountSID}/Sms/send`.
3. Log in to WebEngage and navigate to **Settings → Integrations → SMS**.
4. Click **Add Provider** and select **Custom SMS Provider** from the provider list.
5. Enter the following values in the provider form:
   - **Provider Name**: Exotel (or any label you prefer)
   - **API Endpoint**: the Exotel SMS send URL from step 2
   - **Authentication**: Basic Auth — enter your API Key as the username and API Token as the password
   - **Account SID**: paste the value from step 1 (used as a path or body parameter depending on WebEngage's template format)
   - **Sender ID**: your DLT-registered sender ID
6. Map the WebEngage message body field to Exotel's `Body` parameter and the recipient field to Exotel's `To` parameter.
7. Send a test SMS from the WebEngage provider settings page to verify the connection. Confirm delivery in your Exotel dashboard under **SMS Logs**.
8. Once verified, add an SMS node to a WebEngage journey and select **Exotel** as the provider.

## Configuration Notes

- WebEngage sends the `To` number in E.164 format (e.g., `+919876543210`). Exotel accepts this format directly — no stripping of the `+` is required.
- Ensure your DLT template content matches the message body exactly, including variable placeholders. Mismatches cause delivery failures at the operator level.
- For promotional SMS, traffic is blocked between 9 PM and 9 AM IST per TRAI regulations; WebEngage journey scheduling should account for this window.
- If you operate multiple Exotel accounts (e.g., separate accounts for transactional vs. promotional), you can add both as separate Custom SMS Providers in WebEngage and route journeys accordingly.

## Related Integrations

- [CleverTap Generic SMS Plugin](/docs/integrations/clevertap-generic)
- [CleverTap Native SMS Plugin](/docs/integrations/clevertap-native)
- [MoEngage SMS Plugin](/docs/integrations/moengage)
- [SMS API](/docs/sms-api/overview)
- [Integrations Overview](/docs/integrations/overview)
