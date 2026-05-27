---
sidebar_label: CleverTap (Native SMS)
title: "Use CleverTap via Exotel Native SMS Plugin"
description: "Configure CleverTap to send SMS through Exotel's native SMS plugin for tighter platform integration and delivery tracking."
sidebar_position: 13
---

# Use CleverTap via Exotel Native SMS Plugin

## Overview

Configure CleverTap to use Exotel's native SMS plugin for tighter platform integration, improved delivery tracking, and seamless messaging within your engagement campaigns. Unlike the generic plugin, the native connector has Exotel's API contract built in, so setup requires only your credentials — no manual field mapping is needed.

## Key Capabilities

- Native connector means CleverTap knows Exotel's API structure out of the box — no custom field mapping required
- Real-time delivery status callbacks surfaced directly within CleverTap campaign analytics
- Supports DLT template enforcement automatically via the Exotel delivery pipeline
- Works with all CleverTap engagement types: campaigns, journeys, and triggered messages
- Faster onboarding compared to the generic plugin approach
- Delivery failure codes from Exotel (e.g., invalid number, DLT rejection) are mapped to CleverTap's reporting layer

## Prerequisites

- An active Exotel account with SMS enabled (contact support@exotel.in to enable)
- Your Exotel **Account SID**, **API Key**, and **API Token** from **Settings → API Credentials** on [my.exotel.com](https://my.exotel.com)
- A DLT-registered **Sender ID** and approved message templates on the TRAI DLT portal
- CleverTap account on a plan that includes the native Exotel SMS connector (verify with your CleverTap account manager)
- Admin access to CleverTap's **Settings → Channels → SMS** section

## Setup Steps

1. Log in to [my.exotel.com](https://my.exotel.com) and navigate to **Settings → API Credentials**. Copy your **Account SID**, **API Key**, and **API Token**.
2. In CleverTap, go to **Settings → Channels → SMS → Provider Settings** and click **Add Provider**.
3. Select **Exotel** from the list of native providers (it will appear as a named option rather than "Generic").
4. Enter your credentials in the native provider form:
   - **Account SID**: your Exotel Account SID
   - **API Key**: your Exotel API Key
   - **API Token**: your Exotel API Token
   - **Sender ID**: your DLT-registered sender ID
5. CleverTap will automatically configure the correct Exotel endpoint and authentication method — no URL entry is needed.
6. Enable the **Delivery Status Callback** toggle if shown; this allows Exotel to post delivery receipts back to CleverTap automatically.
7. Use **Test Send** to dispatch a message to a verified number. Confirm delivery in Exotel's **SMS Logs** and check that CleverTap's campaign report reflects the delivered status.
8. Set Exotel as the default SMS provider (or assign it per campaign) and proceed to build your journeys or campaigns.

## Configuration Notes

- Because the native plugin handles authentication and endpoint configuration internally, ensure the Account SID, API Key, and API Token you enter are from the same Exotel account that owns the Sender ID — mixing credentials across accounts will cause authentication failures.
- Delivery callbacks rely on Exotel's ability to reach CleverTap's webhook endpoint. Ensure no firewall or IP allowlist blocks Exotel's outbound IPs on CleverTap's side.
- DLT template IDs may need to be specified at the campaign level within CleverTap if they are not automatically inferred. Check with your CleverTap support contact whether the native plugin version on your account passes `DLTTemplateId` automatically.
- For high-volume campaigns, notify your Exotel account manager in advance to ensure your SMS throughput limits are provisioned appropriately.

## Related Integrations

- [CleverTap Generic SMS Plugin](/docs/integrations/clevertap-generic)
- [WebEngage SMS Plugin](/docs/integrations/webengage)
- [MoEngage SMS Plugin](/docs/integrations/moengage)
- [SMS API](/docs/sms-api/overview)
- [Integrations Overview](/docs/integrations/overview)
