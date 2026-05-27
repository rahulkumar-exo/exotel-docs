---
sidebar_label: MoEngage
title: "Use MoEngage via Exotel Generic SMS Plugin"
description: "Configure MoEngage to send SMS through Exotel's generic SMS plugin for customer engagement and marketing automation."
sidebar_position: 15
---

# Use MoEngage via Exotel Generic SMS Plugin

## Overview

Configure MoEngage to use Exotel's generic SMS plugin for sending SMS messages as part of your customer engagement and marketing automation workflows. Exotel is added as a Generic SMS Provider in MoEngage's SMS channel settings, allowing MoEngage's campaign engine to dispatch messages through Exotel's delivery infrastructure.

## Key Capabilities

- Route transactional and promotional SMS through Exotel from MoEngage flows and campaigns
- Leverage MoEngage's segmentation and A/B testing while Exotel handles delivery and DLT compliance
- Support for both single and bulk SMS triggered by user behaviour events
- Pass personalised variables (name, coupon code, order status) via MoEngage's template engine
- Monitor delivery reports within MoEngage using Exotel's status callback responses
- Works across MoEngage campaign types: Push, Triggered, and Scheduled flows

## Prerequisites

- An active Exotel account with SMS enabled; contact support@exotel.in if SMS is not yet active on your plan
- Your Exotel **Account SID**, **API Key**, and **API Token** from the **API Credentials** section on [my.exotel.com](https://my.exotel.com)
- A DLT-registered **Sender ID** and approved message templates registered on the TRAI DLT portal
- MoEngage account with **Admin** or **Channel Settings** access
- Recipient phone numbers stored in E.164 format (`+91XXXXXXXXXX`) in MoEngage's user profiles

## Setup Steps

1. Log in to [my.exotel.com](https://my.exotel.com) and go to **Settings → API Credentials**. Copy your **Account SID**, **API Key**, and **API Token**.
2. Identify the Exotel bulk SMS endpoint for your region. For India, the standard endpoint is `https://api.exotel.com/v1/Accounts/{AccountSID}/Sms/send`.
3. In MoEngage, navigate to **Settings → Channel → SMS**.
4. Click **Add SMS Provider** and choose **Generic** from the provider type list.
5. Fill in the configuration form:
   - **Provider Name**: Exotel
   - **API URL**: the bulk SMS endpoint from step 2 with your Account SID substituted
   - **HTTP Method**: POST
   - **Authentication**: Basic Auth — API Key as username, API Token as password
   - **Sender ID field**: map to Exotel's `From` parameter using your DLT sender ID
   - **Message field**: map to Exotel's `Body` parameter
   - **Recipient field**: map to Exotel's `To` parameter
6. Configure the response parser to read Exotel's JSON response and map the `Status` field so MoEngage can track delivery outcomes.
7. Save the provider and send a test message to a verified number. Check **SMS Logs** in your Exotel dashboard to confirm delivery.
8. Set the new Exotel provider as the default (or per-campaign) SMS provider in your MoEngage channel settings.

## Configuration Notes

- MoEngage's generic SMS plugin sends requests one message at a time; use MoEngage's campaign throttling settings if you need to control send rate against Exotel's API rate limits.
- DLT template IDs must match exactly. If MoEngage allows passing custom headers or body fields, include the `DLTTemplateId` parameter in the request body to ensure operator-level compliance.
- Delivery receipts from Exotel are returned synchronously in the API response. If MoEngage requires a webhook-based delivery callback, configure the Exotel **Status Callback URL** in your SMS settings on my.exotel.com to point to MoEngage's callback endpoint.
- For promotional SMS, Indian regulations restrict delivery to 9 AM – 9 PM IST. Schedule MoEngage campaigns accordingly.

## Related Integrations

- [CleverTap Generic SMS Plugin](/docs/integrations/clevertap-generic)
- [CleverTap Native SMS Plugin](/docs/integrations/clevertap-native)
- [WebEngage SMS Plugin](/docs/integrations/webengage)
- [SMS API](/docs/sms-api/overview)
- [Integrations Overview](/docs/integrations/overview)
