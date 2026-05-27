---
sidebar_label: Salesforce Secure Recording
title: "Adding Secure Recording Component in Exotel's SFDC Connector"
description: "Add secure call recording playback to Exotel's Salesforce (SFDC) connector for compliant recording access within CRM."
sidebar_position: 18
---

# Adding Secure Recording Component in Exotel's SFDC Connector

## Overview

Add secure call recording playback capabilities to Exotel's Salesforce (SFDC) connector, ensuring recordings are accessed in a compliant and secure manner within your CRM. The Secure Recording component uses a token-based signed URL mechanism so that only authenticated Salesforce users can play back recordings — the recording file is never exposed via a direct, unprotected link.

## Key Capabilities

- Recordings are embedded in Salesforce activity records and playable only by authenticated Salesforce users
- Signed, time-limited URLs prevent direct link sharing or external playback outside of Salesforce
- Works with both Visualforce page layouts and Lightning Experience page layouts
- Integrates with Salesforce's object-level and field-level security so recording access can be restricted by role or profile
- Supports inbound, outbound, and transferred call recordings logged by the Exotel CTI connector
- No separate login or external portal needed — agents play recordings directly within the Salesforce record

## Prerequisites

- The base Exotel Salesforce CTI integration must already be installed and configured in your Salesforce org (see the [Salesforce integration guide](/docs/integrations/salesforce))
- Call recording must be enabled on your Exotel account and appearing on activity records in Salesforce
- A **Secure Recording Token** from Exotel — contact support@exotel.in or your account manager to provision one for your account
- Salesforce admin access to install managed package components and modify page layouts
- The Exotel SFDC Connector package installed in your Salesforce org (available from Exotel during onboarding)

## Setup Steps

1. Verify the base integration is working: make a test call, confirm the call activity is logged in Salesforce, and check that a recording link appears on the activity record.
2. Obtain your **Secure Recording Token** from Exotel support. This is a shared secret used to generate and validate signed playback URLs.
3. In Salesforce, go to **Setup → Custom Settings** (or **App Manager → Exotel CTI Settings** depending on your connector version) and locate the Exotel connector configuration.
4. Enter your Secure Recording Token in the designated field within the Exotel SFDC connector settings. Save the configuration.
5. Navigate to the Salesforce page layout for the object where recordings are displayed (typically the **Activity** or **Task** object layout). Add the **Exotel Secure Recording** Visualforce component (or Lightning component) to the layout.
6. Save the page layout changes and reload the Salesforce record page for an agent user (not the admin) to confirm the component appears correctly.
7. Test recording playback: open a logged call activity, click the secure recording component, and verify the recording plays without errors for an authenticated user.
8. Test access control: copy the recording URL from the component and attempt to open it in a private browser window or without a Salesforce session. The URL should fail with an access denied or token expired error.

## Configuration Notes

- The Secure Recording Token is a sensitive credential. Store it only within the Salesforce custom settings field — do not include it in code, logs, or documentation.
- If your Salesforce org uses a custom domain (My Domain), ensure the Exotel SFDC connector's callback and content security policy (CSP) settings are updated to reference the custom domain URL.
- Token expiry windows for signed URLs are configured on the Exotel side. If you need a shorter or longer expiry window (e.g., to comply with internal data access policies), contact your Exotel account manager.
- In Lightning Experience, use the Lightning Aura or LWC version of the secure recording component rather than the Visualforce version for best compatibility with the Salesforce LEX interface.

## Related Integrations

- [Salesforce](/docs/integrations/salesforce)
- [Freshdesk Secure Recording](/docs/integrations/freshdesk-secure-recording)
- [Integrations Overview](/docs/integrations/overview)
