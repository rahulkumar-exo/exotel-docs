---
id: overview
title: SMS Overview
description: "Complete overview of Exotel SMS services including transactional, promotional, and OTP messaging with DLT compliance in India."
sidebar_label: SMS Overview
sidebar_position: 1
---

# SMS Overview

Exotel provides a reliable SMS platform that enables businesses to send transactional, promotional, and OTP messages across India. This guide covers the fundamentals of Exotel's SMS service, including message types, delivery infrastructure, and regulatory compliance.

:::tip
For API-level documentation on sending SMS programmatically, see the [SMS API Reference](/docs/sms-api/overview).
:::

## How Exotel SMS Works

Exotel acts as an aggregator between your application and Indian telecom operators. When you send an SMS through Exotel, the message flows through the following path:

```
Your Application → Exotel API → DLT Scrubbing → Telecom Operator → Recipient Handset
```

1. **Message Submission** -- Your application sends an SMS request via the Exotel API or dashboard.
2. **DLT Validation** -- The message is validated against your registered DLT templates and sender IDs.
3. **Operator Routing** -- Exotel routes the message to the appropriate telecom operator.
4. **Delivery** -- The operator delivers the message to the recipient's handset.
5. **Status Callback** -- Exotel sends a delivery report back to your configured webhook.

## SMS Types

Exotel supports three categories of SMS, each with different delivery rules and regulations:

| Type | Use Case | Delivery Window | DND Applicable |
|------|----------|-----------------|----------------|
| **Transactional** | OTPs, alerts, order updates, banking notifications | 24/7 | No |
| **Transactional Opt-in** | Transactional messages requiring user consent | 24/7 | No |
| **Promotional** | Marketing offers, discount campaigns, product launches | 9 AM -- 9 PM | Yes |

:::warning
Promotional SMS cannot be delivered to numbers registered on the National Do Not Disturb (NDNC/DND) registry. Use transactional SMS for critical communications.
:::

## Key Features

- **High Throughput** -- Send thousands of messages per second with Exotel's enterprise-grade infrastructure.
- **DLT Compliance** -- Built-in support for TRAI's DLT regulations including entity registration, template approval, and consent management.
- **Delivery Reports** -- Real-time delivery status via webhooks or API polling.
- **Bulk Messaging** -- Send the same or unique messages to up to 100 recipients in a single API call.
- **URL Shortening** -- Shorten and track links within your SMS messages.
- **Unicode Support** -- Send messages in Hindi, Tamil, and other regional languages.
- **Two-Way SMS** -- Receive inbound SMS and build interactive workflows.

## Prerequisites

Before you start sending SMS with Exotel, ensure you have:

1. **An active Exotel account** -- [Sign up here](https://my.exotel.com/auth/register) if you do not have one.
2. **DLT Registration** -- Register as an entity on a DLT portal (Jio, Airtel, Vodafone-Idea, or BSNL). See [DLT Registration](/docs/sms-support/dlt-registration).
3. **Approved Sender ID** -- Register your sender ID (header) on the DLT portal. See [Sender ID](/docs/sms-support/sender-id).
4. **Approved Templates** -- Get your message templates approved on the DLT portal. See [SMS Templates](/docs/sms-support/sms-templates).
5. **API Credentials** -- Obtain your API key and token from the [Exotel Dashboard](https://my.exotel.com/apisettings/site#api-credentials).

## Sending Your First SMS

You can send SMS through Exotel in two ways:

### Via the Dashboard

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Navigate to **App Bazaar** > **SMS**.
3. Select **Send SMS**.
4. Choose the sender ID, enter the recipient number, select a template, and click **Send**.

### Via the API

Use the [Send SMS API](/docs/sms-api/api-reference/send-sms) to send messages programmatically:

```bash
curl -u '<api_key>:<api_token>' -X POST "https://api.exotel.com/v1/Accounts/<account_sid>/Sms/send" \
  -d "From=EXOTEL" \
  -d "To=+91XXXXXXXXXX" \
  -d "Body=Your OTP is 123456" \
  -d "DltEntityId=XXXXXXXXXXXXX" \
  -d "DltTemplateId=XXXXXXXXXXXXX"
```

## Rate Limits

| Limit | Value |
|-------|-------|
| API calls | 200 requests/minute |
| Bulk SMS per request | 100 messages max |

## Regional Endpoints

| Region | Subdomain |
|--------|-----------|
| Singapore | `api.exotel.com` |
| Mumbai | `api.in.exotel.com` |

## Next Steps

- [How to Send SMS](/docs/sms-support/how-to-send-sms) -- Step-by-step sending guide
- [SMS Templates](/docs/sms-support/sms-templates) -- Create and manage message templates
- [DLT Registration](/docs/sms-support/dlt-registration) -- Register with a DLT portal
- [SMS Delivery Reports](/docs/sms-support/sms-delivery-reports) -- Track message delivery
- [SMS API Reference](/docs/sms-api/overview) -- API documentation
