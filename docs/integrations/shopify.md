---
sidebar_label: Shopify
title: "Exotel Shopify Integration - Verify Customer Number & Confirm Orders"
description: "Use Exotel with Shopify to verify customer phone numbers and confirm orders automatically via voice calls or SMS."
sidebar_position: 16
---

# Exotel Shopify Integration - Verify Customer Number & Confirm Orders Automatically

## Overview

Use Exotel with Shopify to verify customer phone numbers and confirm orders automatically via voice calls or SMS, reducing fraudulent orders and improving delivery success rates. The integration works by connecting Shopify's webhook system to a custom server (or serverless function) that calls Exotel's Voice and SMS APIs when order events occur.

## Key Capabilities

- Send automated order confirmation SMS to customers immediately after purchase
- Make automated outbound voice calls to verify Cash-on-Delivery (CoD) orders before dispatch
- Verify customer phone numbers at checkout using Exotel's OTP or missed-call verification
- Reduce CoD return-to-origin (RTO) rates by confirming delivery intent before shipment
- Trigger different flows for different order types (prepaid vs. CoD, first-time vs. repeat customer)
- Log call outcomes and SMS delivery status back to your order management system

## Prerequisites

- An active Exotel account with both Voice and SMS enabled
- Your Exotel **Account SID**, **API Key**, and **API Token** from **Settings → API Credentials** on [my.exotel.com](https://my.exotel.com)
- An Exotel virtual phone number (ExoPhone) configured for outbound calls
- A DLT-registered Sender ID and approved SMS templates for order confirmation messages
- A Shopify store with admin access to configure webhooks
- A server or serverless environment (AWS Lambda, Google Cloud Functions, or a hosted Node.js/Python app) to receive Shopify webhooks and call Exotel's API

## Setup Steps

1. Log in to [my.exotel.com](https://my.exotel.com) and copy your **Account SID**, **API Key**, and **API Token** from **Settings → API Credentials**. Note your ExoPhone number for outbound calls.
2. Deploy a webhook handler (server or serverless function) that will receive Shopify order events. This handler needs a publicly accessible HTTPS URL.
3. In your handler, implement the following logic on `orders/create` events:
   - Extract the customer's phone number from the order payload
   - For prepaid orders: call Exotel's SMS API (`POST /v1/Accounts/{AccountSID}/Sms/send`) with your order confirmation template
   - For CoD orders: call Exotel's Calls API (`POST /v1/Accounts/{AccountSID}/Calls/connect`) to initiate an outbound IVR call asking the customer to confirm the order
4. In your Shopify admin, go to **Settings → Notifications → Webhooks** and add a new webhook:
   - **Event**: Order creation
   - **URL**: your webhook handler's HTTPS endpoint
   - **Format**: JSON
5. Test by placing a test order in Shopify. Confirm the webhook fires, your handler receives it, and Exotel dispatches the SMS or call. Check **SMS Logs** and **Call Logs** on your Exotel dashboard.
6. Optionally, add a second webhook for `orders/cancelled` or `orders/fulfilled` to send status update SMS at each stage.
7. Implement error handling in your webhook handler: log failed Exotel API responses and set up alerts so operations teams can follow up on unconfirmed CoD orders manually.
8. Monitor the CoD confirmation rate in your order management system to measure RTO reduction over time.

## Configuration Notes

- Shopify sends webhook payloads with a `X-Shopify-Hmac-SHA256` header. Validate this signature in your handler to reject spoofed requests before calling Exotel's API.
- Exotel's outbound call API is asynchronous — the call is queued and the API returns immediately. Use Exotel's call status callback URL to receive the final call disposition (answered, not answered, busy) and update your order system accordingly.
- Phone numbers in Shopify orders may not always be in E.164 format. Normalise the number (add `+91` prefix for Indian numbers, strip spaces and dashes) before passing it to Exotel's API.
- For IVR-based CoD confirmation, create an Exotel App (flow) on my.exotel.com that plays a confirmation prompt and records the keypress outcome, then pass the `app_id` in the Calls API request.

## Related Integrations

- [SMS API](/docs/sms-api/overview)
- [Voice API](/docs/voice-api/getting-started/overview)
- [Integrations Overview](/docs/integrations/overview)
