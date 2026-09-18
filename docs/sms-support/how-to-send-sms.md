---
id: how-to-send-sms
title: How to Send SMS
description: "Step-by-step guide to sending SMS via the Exotel dashboard and API, including DLT setup, templates, and delivery tracking."
sidebar_label: How to Send SMS
sidebar_position: 2
---

# How to Send SMS

This guide walks you through sending SMS messages using Exotel, covering both the dashboard interface and the API. Before sending, ensure you have completed the [DLT registration process](/docs/sms-support/dlt-registration) and have approved templates.

## Prerequisites

Before sending your first SMS, complete these steps:

| Step | Description | Guide |
|------|-------------|-------|
| 1. DLT Registration | Register as a telemarketer entity on a DLT portal | [DLT Registration](/docs/sms-support/dlt-registration) |
| 2. Sender ID | Register and approve your sender ID (header) | [Sender ID](/docs/sms-support/sender-id) |
| 3. Template Approval | Get your message templates approved on DLT | [SMS Templates](/docs/sms-support/sms-templates) |
| 4. API Credentials | Get your API key and token from the dashboard | [SMS API Overview](/docs/sms-api/overview) |

## Method 1: Send SMS via Dashboard

### Step 1: Navigate to SMS Section

1. Log in to your [Exotel Dashboard](https://my.exotel.com).
2. Go to **App Bazaar** in the left sidebar.
3. Click on **SMS** to open the SMS management section.

### Step 2: Compose Your Message

1. Click **Send SMS** or **New SMS**.
2. **From (Sender ID)**: Select your approved sender ID from the dropdown. This must be a DLT-registered header.
3. **To (Recipient)**: Enter the recipient's phone number with country code (e.g., `+919876543210`). You can add multiple numbers separated by commas for bulk sends.
4. **Message Body**: Select a pre-approved DLT template or type your message. If typing manually, ensure it matches an approved template exactly.

### Step 3: Add DLT Details

1. **DLT Entity ID**: Enter your DLT entity ID (this may be pre-filled from your account settings).
2. **DLT Template ID**: Select or enter the template ID that matches your message content.

### Step 4: Send

1. Review your message details.
2. Click **Send** to dispatch the message.
3. You will see a confirmation with the message SID for tracking.

:::tip
Save frequently used templates in your dashboard for quick access. You can also upload a CSV file for bulk sends.
:::

## Method 2: Send SMS via API

### Single SMS

Send a single message to one recipient using the [Send SMS API](/docs/sms-api/api-reference/send-sms):

```bash
curl -u '<api_key>:<api_token>' -X POST "https://api.exotel.com/v1/Accounts/<account_sid>/Sms/send" \
  -d "From=EXOTEL" \
  -d "To=+919876543210" \
  -d "Body=Your order #12345 has been shipped. Track at https://example.com/track" \
  -d "DltEntityId=1234567890123" \
  -d "DltTemplateId=1234567890123456" \
  -d "EncodingType=plain" \
  -d "Priority=normal" \
  -d "StatusCallback=https://your-server.com/sms-callback"
```

### Required Parameters

| Parameter | Description |
|-----------|-------------|
| `From` | Your approved sender ID (DLT-registered header) |
| `To` | Recipient phone number with country code |
| `Body` | Message content matching a DLT-approved template |
| `DltEntityId` | Your DLT entity registration ID |
| `DltTemplateId` | The approved DLT template ID for this message |

### Optional Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `EncodingType` | `plain` or `unicode` | `plain` |
| `Priority` | `normal` or `high` | `normal` |
| `StatusCallback` | Webhook URL for delivery reports | None |
| `SmsType` | `transactional`, `transactional_opt_in`, or `promotional` | `transactional` |

### Bulk SMS (Same Message)

Send the same message to multiple recipients using the [Bulk SMS API](/docs/sms-api/api-reference/bulk-sms):

```bash
curl -u '<api_key>:<api_token>' -X POST "https://api.exotel.com/v2/Accounts/<account_sid>/Sms/bulksend" \
  -H "Content-Type: application/json" \
  -d '{
    "sms": [
      {
        "From": "EXOTEL",
        "To": ["+919876543210", "+919876543211", "+919876543212"],
        "Body": "Flash sale! 50% off on all items. Visit https://example.com",
        "DltEntityId": "1234567890123",
        "DltTemplateId": "1234567890123456"
      }
    ]
  }'
```

### Bulk SMS (Dynamic Messages)

Send unique messages to different recipients in a single request (max 100 per call):

```bash
curl -u '<api_key>:<api_token>' -X POST "https://api.exotel.com/v2/Accounts/<account_sid>/Sms/bulksend" \
  -H "Content-Type: application/json" \
  -d '{
    "sms": [
      {
        "From": "EXOTEL",
        "To": "+919876543210",
        "Body": "Hi Rahul, your OTP is 123456",
        "DltEntityId": "1234567890123",
        "DltTemplateId": "1234567890123456"
      },
      {
        "From": "EXOTEL",
        "To": "+919876543211",
        "Body": "Hi Priya, your OTP is 654321",
        "DltEntityId": "1234567890123",
        "DltTemplateId": "1234567890123456"
      }
    ]
  }'
```

## Tracking Delivery

After sending, track delivery using one of these methods:

1. **Status Callback (Webhook)**: Set the `StatusCallback` parameter to receive real-time delivery reports at your endpoint. See [SMS Webhooks](/docs/sms-support/sms-webhooks).
2. **API Polling**: Use the [SMS Details API](/docs/sms-api/api-reference/sms-details) to check the status of a specific message by its SID.
3. **Dashboard**: View delivery reports in the SMS section of your Exotel dashboard.

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| `FAILED_DLT_TEMPLATE` | Message does not match approved template | Ensure your message body exactly matches the DLT template, including variable placeholders |
| `FAILED_DLT_ENTITY` | Invalid DLT entity ID | Verify your DLT entity ID in your DLT portal account |
| `FAILED_INVALID_SENDER` | Sender ID not approved | Register your sender ID on the DLT portal and map it in Exotel |
| `FAILED_DND` | Recipient on DND list | Use transactional SMS for essential communications; promotional SMS cannot reach DND numbers |
| Rate limit exceeded | Too many API calls | Stay within 200 requests/minute; use bulk endpoints for high volume |

:::warning
Always test your SMS flow in a staging environment before going live. Verify that your DLT template ID, entity ID, and sender ID are correctly configured.
:::

## Next Steps

- [SMS Templates](/docs/sms-support/sms-templates) -- Create and manage templates
- [Bulk SMS](/docs/sms-support/bulk-sms) -- Advanced bulk messaging guide
- [SMS Delivery Reports](/docs/sms-support/sms-delivery-reports) -- Understand delivery statuses
- [SMS API Reference](/docs/sms-api/api-reference/send-sms) -- Full API documentation
