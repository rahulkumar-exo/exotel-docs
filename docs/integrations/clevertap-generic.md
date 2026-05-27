---
sidebar_label: CleverTap (Generic SMS)
title: "Use CleverTap via Exotel Generic SMS Plugin"
description: "Configure CleverTap to send SMS through Exotel's generic SMS plugin for marketing automation and customer engagement."
sidebar_position: 12
---

# Use CleverTap via Exotel Generic SMS Plugin

## Overview

Configure CleverTap to use Exotel's generic SMS plugin for sending SMS messages as part of your marketing automation and customer engagement campaigns. The generic plugin approach is suitable when you need to connect Exotel to CleverTap without relying on a pre-built native connector, giving you full control over the API parameters.

## Key Capabilities

- Send campaign and journey-triggered SMS through Exotel from CleverTap
- Use CleverTap's segmentation, personalisation, and A/B testing features with Exotel handling delivery
- Configure custom HTTP request parameters to match Exotel's API contract
- Works with both transactional and promotional Exotel sender IDs
- Supports variable substitution for dynamic message content (name, OTP, order ID)
- Useful as a fallback or testing path before migrating to the native CleverTap–Exotel plugin

## Prerequisites

- An active Exotel account with SMS enabled
- Your Exotel **Account SID**, **API Key**, and **API Token** from **Settings → API Credentials** on [my.exotel.com](https://my.exotel.com)
- A DLT-registered **Sender ID** and at least one approved message template on the TRAI DLT portal
- CleverTap account with **Admin** access to the **Settings → Channels → SMS** section
- User phone numbers stored in E.164 format in CleverTap user profiles

## Setup Steps

1. Log in to [my.exotel.com](https://my.exotel.com). Go to **Settings → API Credentials** and copy your **Account SID**, **API Key**, and **API Token**.
2. Note the Exotel SMS API endpoint: `https://api.exotel.com/v1/Accounts/{AccountSID}/Sms/send` (replace `{AccountSID}` with your actual Account SID).
3. In CleverTap, go to **Settings → Channels → SMS → Provider Settings**.
4. Click **Add Provider** and select **Generic SMS Provider**.
5. Configure the provider with the following values:
   - **Provider Name**: Exotel
   - **Endpoint URL**: the full Exotel SMS send URL from step 2
   - **HTTP Method**: POST
   - **Authorization**: Basic Auth using your API Key (username) and API Token (password)
   - **Body parameters**: add `To` (mapped to the user's phone attribute), `From` (your DLT sender ID), and `Body` (mapped to the message content field)
6. Add any required DLT parameters such as `DLTTemplateId` as additional body fields if your message templates require them for operator compliance.
7. Use the **Test Send** feature in CleverTap to dispatch a message to a test number. Verify delivery in Exotel's **SMS Logs** under your dashboard.
8. Once verified, select Exotel as the SMS provider when creating CleverTap campaigns or journey nodes.

## Configuration Notes

- The generic plugin sends one API call per recipient. For large-scale sends, ensure your Exotel account has sufficient API throughput provisioned; contact your Exotel account manager to increase rate limits if needed.
- CleverTap's generic provider does not natively parse delivery callbacks. To get delivery status back in CleverTap, configure a Status Callback URL in Exotel's dashboard pointing to CleverTap's SMS delivery webhook endpoint.
- If your message templates contain special characters or Unicode (e.g., for regional language SMS), set the encoding parameter in the request body as required by Exotel's API.
- Consider upgrading to the native CleverTap–Exotel plugin once it is available on your CleverTap plan, as it offers built-in delivery tracking and simpler configuration.

## Related Integrations

- [CleverTap Native SMS Plugin](/docs/integrations/clevertap-native)
- [WebEngage SMS Plugin](/docs/integrations/webengage)
- [MoEngage SMS Plugin](/docs/integrations/moengage)
- [SMS API](/docs/sms-api/overview)
- [Integrations Overview](/docs/integrations/overview)
