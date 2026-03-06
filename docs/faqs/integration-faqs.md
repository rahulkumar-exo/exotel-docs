---
title: Integration FAQs
description: "Frequently asked questions about integrating Exotel with CRMs, helpdesks, webhooks, and third-party tools like Zoho, Salesforce, and HubSpot."
sidebar_label: Integrations
sidebar_position: 9
---

# Integration FAQs

Common questions about integrating Exotel with CRMs, helpdesks, marketing platforms, and custom applications.

---

## What CRMs and tools does Exotel integrate with?

Exotel provides native integrations with the following platforms:

| Platform | Integration Type | Features |
|----------|-----------------|----------|
| **Zoho CRM / Bigin** | Native plugin | Click-to-call, call logging, screen pop |
| **Zoho Desk** | Native plugin | Call routing, ticket creation, call recording |
| **Salesforce** | Native plugin | Click-to-call, call logging, secure recording |
| **Freshdesk** | Native plugin | Call handling, ticket integration |
| **Freshsales** | Native plugin | Click-to-call, call logging |
| **Freshchat** | Native plugin | Voice + chat integration |
| **HubSpot** | Native plugin | Click-to-call, contact sync |
| **LeadSquared** | Native plugin | Lead management, click-to-call |
| **Shopify** | Native plugin | Order notifications, customer calls |
| **CleverTap** | SMS integration | Triggered SMS campaigns |
| **WebEngage** | SMS integration | Automated messaging workflows |
| **MoEngage** | SMS integration | Customer engagement SMS |

For setup guides, see the [Integrations documentation](/docs/integrations/overview).

---

## Can I integrate Exotel with my custom application?

Yes. Exotel provides RESTful APIs for all communication features. You can integrate any custom application using:

- **Voice API** -- Make calls, manage call flows, handle recordings
- **SMS API** -- Send individual and bulk SMS
- **WhatsApp API** -- Send template and interactive messages
- **Webhooks** -- Receive real-time event notifications
- **Campaign API** -- Create and manage outbound campaigns

All APIs use standard HTTP with JSON payloads and Basic authentication.

> **API Reference:** See [Authentication & Security](/docs/references/authentication) for API setup.

---

## How do webhooks work in Exotel?

Webhooks are HTTP POST requests sent from Exotel to your server when specific events occur. They provide real-time notifications without polling.

### Webhook Flow

```
Event occurs (e.g., call completed)
  --> Exotel sends HTTP POST to your webhook URL
    --> Your server processes the payload
      --> Your server returns HTTP 200
```

### Configuring Webhooks

Webhooks can be configured at multiple levels:

| Level | Configuration Location | Events |
|-------|----------------------|--------|
| Account-level | Dashboard > Settings > Webhooks | Default callbacks for all calls |
| ExoPhone-level | Dashboard > ExoPhones > Configure | Per-number callbacks |
| API call-level | `StatusCallback` parameter in API requests | Per-call callbacks |
| Campaign-level | Campaign creation API | Campaign and call status events |

### Webhook Best Practices

1. Return HTTP 200 within 5 seconds to acknowledge receipt
2. Process webhook data asynchronously (queue the payload, respond immediately)
3. Implement idempotency using CallSid or SmsSid as unique keys
4. Use HTTPS endpoints to protect webhook data in transit
5. Log all incoming webhook payloads for debugging

:::warning
If your webhook endpoint consistently returns non-200 responses or times out, Exotel may stop sending webhooks to that URL. Monitor your endpoint's health and error rates.
:::

> **API Reference:** See [Webhooks Reference](/docs/references/webhooks) for complete payload specifications.

---

## Can I integrate Exotel with Zapier or other no-code platforms?

Exotel does not have a native Zapier app, but you can integrate using Zapier's webhook trigger:

1. Create a Zap with the **Webhooks by Zapier** trigger (Catch Hook)
2. Copy the Zapier webhook URL
3. Set this URL as your Exotel webhook callback
4. Map the Exotel webhook fields to your desired actions in Zapier

This approach works with any no-code platform that supports incoming webhooks (Zapier, Make/Integromat, n8n, etc.).

---

## Can I integrate two Exotel accounts with one CRM instance?

No. Native CRM integrations follow a **one-to-one mapping**: one Exotel account per CRM instance. If you need to connect multiple Exotel accounts, you will need separate CRM instances or a custom API-based integration.

---

## My CRM integration is not logging calls. What should I check?

Follow this troubleshooting checklist:

| Check | How | Fix |
|-------|-----|-----|
| Integration is active | Dashboard > Integrations | Re-enable if disabled |
| User mapping | CRM user phone matches Exotel user phone | Update phone numbers to match |
| Webhook URL is reachable | Test URL with curl or Postman | Fix firewall or DNS issues |
| Account names match | No blank spaces in configuration | Remove extra spaces |
| API credentials are valid | Test with a basic API call | Regenerate token if expired |
| KYC is complete | Dashboard > Settings > KYC | Complete verification |

---

## How do I set up click-to-call in my CRM?

Click-to-call allows CRM users to initiate calls directly from contact records:

1. Install the Exotel integration plugin for your CRM
2. Configure API credentials (API key, token, Account SID)
3. Map CRM users to Exotel agent phone numbers
4. Enable click-to-call in the integration settings
5. Users can now click phone numbers in the CRM to initiate calls

The call flow for click-to-call:
1. Exotel calls the agent's phone first
2. Once the agent answers, Exotel calls the customer
3. Both parties are connected
4. Call details and recording are logged in the CRM

---

## Can I receive real-time call notifications in Slack or Teams?

Yes, using webhooks. Configure Exotel webhooks to send to a middleware that forwards notifications to Slack or Microsoft Teams:

**Option 1: Direct Slack webhook**
1. Create a Slack incoming webhook URL
2. Build a middleware endpoint that receives Exotel webhooks and formats them for Slack
3. Set the middleware URL as your Exotel callback

**Option 2: Using a no-code platform**
1. Use Zapier, Make, or n8n as middleware
2. Trigger on Exotel webhook
3. Action sends a formatted message to Slack or Teams

---

## How do I integrate Exotel with my IVR or call routing system?

Exotel's **Passthru applet** enables real-time integration with external systems during a call:

1. Add a Passthru applet to your call flow in **App Bazaar**
2. Configure it to send an HTTP request to your server
3. Your server processes the call data and returns routing instructions
4. Exotel routes the call based on your server's response

This allows dynamic call routing based on CRM data, customer history, agent availability, or any custom logic.

---

## What data formats does Exotel use?

| Data Type | Format |
|-----------|--------|
| API requests/responses | JSON |
| Authentication | HTTP Basic Auth (API key:token) |
| Timestamps | RFC 3339 (e.g., `2024-02-01T10:00:00+05:30`) |
| Phone numbers | E.164 (e.g., `+919876543210`) |
| Webhook payloads | Form-encoded or JSON (configurable) |
| CSV uploads | UTF-8 encoded, comma-delimited |

---

## How do I test integrations before going live?

1. **Use a trial account**: Test with limited credits before production
2. **Use test phone numbers**: Call your own numbers to verify call flow and webhook delivery
3. **Check webhook payloads**: Use tools like [webhook.site](https://webhook.site) or ngrok to inspect incoming webhooks
4. **Verify CRM logging**: Make test calls and confirm data appears in your CRM
5. **Test error handling**: Simulate failures (invalid numbers, network errors) to verify your error handling

See [Testing Guide](/docs/getting-started/testing-guide) for a comprehensive testing checklist.

---

## Related Resources

- [Integrations Overview](/docs/integrations/overview) -- All native integrations and setup guides
- [Webhooks Reference](/docs/references/webhooks) -- Webhook payload formats and configuration
- [Voice API](/docs/voice-api/getting-started/overview) -- Programmatic voice integration
- [SMS API](/docs/sms-api/overview) -- Programmatic SMS integration
