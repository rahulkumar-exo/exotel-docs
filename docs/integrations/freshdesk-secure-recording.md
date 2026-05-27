---
sidebar_label: Freshdesk Secure Recording
title: "Freshdesk Secure Recording Enablement"
description: "Enable secure call recording playback within the Exotel-Freshdesk integration for compliant call recording access."
sidebar_position: 6
---

# Freshdesk Secure Recording Enablement

## Overview

Enable secure call recording playback within your Freshdesk integration. This guide covers the configuration steps to ensure call recordings are accessed securely and in compliance with your organization's policies. Secure recording uses signed URLs with time-limited expiry tokens, so recordings can only be played by authenticated Freshdesk agents — direct URL access by unauthenticated users is blocked.

## Key Capabilities

- Call recordings embedded in Freshdesk tickets are accessible only to authenticated agents
- Signed URLs expire after a configurable time window, preventing link sharing or external playback
- Agents play recordings directly within the Freshdesk ticket interface without needing to leave the CRM
- No recording file is exposed via a permanent public URL — each playback request generates a fresh signed token
- Compliant with data security policies that require access controls on recorded calls
- Works with all call types logged by the Exotel–Freshdesk integration (inbound, outbound, and transfers)

## Prerequisites

- The base Exotel–Freshdesk integration must already be set up and working; recordings must be appearing on tickets before enabling secure access (see the [Freshdesk integration guide](/docs/integrations/freshdesk))
- An active Exotel account with call recording enabled on your ExoPhone(s)
- A **Secure Recording Token** from Exotel — this is a shared secret used to sign playback URLs; contact support@exotel.in or your account manager to have one provisioned for your account
- Freshdesk admin access to modify integration settings

## Setup Steps

1. Confirm that the standard Exotel–Freshdesk integration is working: place a test call, check that a ticket is created in Freshdesk, and verify a recording link appears on the ticket.
2. Contact Exotel support (support@exotel.in) to enable secure recording for your account and obtain your **Secure Recording Token** (a long alphanumeric secret string).
3. Log in to [my.exotel.com](https://my.exotel.com) and navigate to **Integrations → Freshdesk**.
4. In the Freshdesk integration settings, locate the **Secure Recording** section and paste your Secure Recording Token into the designated field.
5. Save the integration settings. From this point, Exotel will generate signed, expiring URLs for all new recording links sent to Freshdesk.
6. In Freshdesk, open a ticket that was created after saving the new settings and click the recording playback link. Confirm that the recording plays correctly for an authenticated agent.
7. Test access control: copy the recording URL and attempt to open it in a browser where you are not logged in to Freshdesk. The URL should return an access denied or expired response.
8. Optionally, configure the URL expiry duration in the Exotel integration settings (if your account supports this) to match your organisation's data retention and access policy requirements.

## Configuration Notes

- Secure recording tokens are sensitive credentials. Store the token securely and do not commit it to version control. If a token is compromised, contact Exotel support to rotate it.
- Only recordings created after enabling secure mode will have signed URLs. Existing recording links on older tickets will continue to use the previous (non-signed) URL format until those recordings are re-linked or the integration is re-synced.
- Signed URLs include an expiry timestamp. If agents report that recordings fail to play after a period of inactivity, the URL may have expired — refreshing the Freshdesk ticket page typically generates a new valid URL.
- If your Freshdesk instance uses Single Sign-On (SSO), ensure SSO is correctly configured so agents are authenticated before attempting to access recording links.

## Related Integrations

- [Freshdesk](/docs/integrations/freshdesk)
- [Freshchat](/docs/integrations/freshchat)
- [FreshSales](/docs/integrations/freshsales)
- [Salesforce Secure Recording](/docs/integrations/salesforce-secure-recording)
- [Integrations Overview](/docs/integrations/overview)
