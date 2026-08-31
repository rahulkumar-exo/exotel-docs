---
id: getting-started
title: Getting Started with WhatsApp Business API
description: "Step-by-step guide to set up WhatsApp Business API with Exotel -- account creation, business verification, number setup, and sending your first message."
sidebar_label: Getting Started
sidebar_position: 2
---

# Getting Started with WhatsApp

This guide walks you through the complete onboarding process to start sending and receiving WhatsApp messages through Exotel.

## Prerequisites

Before you begin, ensure you have the following:

| Requirement | Details |
|-------------|---------|
| **Exotel Account** | Active Exotel account with WhatsApp plan enabled |
| **Meta Business Manager** | A Meta Business Manager account at [business.facebook.com](https://business.facebook.com) |
| **Business Documents** | Legal business registration documents for verification |
| **Phone Number** | A phone number that is not already registered on WhatsApp (personal or business app) |
| **Website** | A live website or business page for Meta verification |

## Onboarding Steps

### Step 1: Create or Access Your Exotel Account

1. Sign up at [my.exotel.com](https://my.exotel.com) if you do not have an account
2. Navigate to **WhatsApp** in the left sidebar
3. Click **Get Started** or **Enable WhatsApp**

:::tip
If you already have an Exotel voice or SMS account, WhatsApp can be enabled as an add-on. Contact your account manager or write to support@exotel.com.
:::

### Step 2: Set Up Meta Business Manager

If you do not already have a Meta Business Manager account:

1. Go to [business.facebook.com/overview](https://business.facebook.com/overview)
2. Click **Create Account**
3. Enter your business name, your name, and business email
4. Fill in your business details (address, website, phone number)
5. Complete the email verification

:::warning
Use your official business email domain (e.g., you@yourcompany.com) rather than a personal email. This is important for business verification.
:::

### Step 3: Business Verification

Meta requires all businesses using the WhatsApp Business API to complete business verification. This confirms your business is a legitimate entity.

1. In Meta Business Manager, go to **Settings > Business Info > Business Verification**
2. Upload the required documents (see [Business Verification](/docs/whatsapp-support/business-verification) for the full list)
3. Meta reviews your application (typically 2-7 business days)
4. You will receive an email notification once verified

### Step 4: Register Your Phone Number

Your WhatsApp Business API number must meet specific requirements:

1. The number must be able to receive SMS or voice calls (for one-time verification)
2. The number must **not** be currently registered on WhatsApp (personal or business app)
3. If the number is currently on WhatsApp, you must delete the WhatsApp account first

To register your number with Exotel:

1. Navigate to **WhatsApp > Phone Numbers** in the Exotel dashboard
2. Click **Add Phone Number**
3. Enter your phone number in E.164 format (e.g., +919876543210)
4. Select the verification method: **SMS** or **Voice Call**
5. Enter the 6-digit verification code you receive
6. Set your business display name (see [Display Name Guidelines](/docs/whatsapp-support/display-name-guidelines))

For complete number requirements, see [WhatsApp Number Requirements](/docs/whatsapp-support/number-requirements).

### Step 5: Create Your Business Profile

Configure your WhatsApp Business profile to help customers recognize your business:

| Field | Required | Description |
|-------|----------|-------------|
| **Display Name** | Yes | Your business name shown to customers |
| **About** | No | Short description (max 139 characters) |
| **Profile Photo** | No | Square image, minimum 192x192 pixels |
| **Business Category** | Yes | Industry category (e.g., "E-Commerce", "Healthcare") |
| **Business Description** | No | Detailed description (max 512 characters) |
| **Address** | No | Physical business address |
| **Email** | No | Contact email address |
| **Website** | No | Your business website URL |

### Step 6: Create a Message Template

Before you can send outbound messages, you need at least one approved template:

1. Navigate to **WhatsApp > Templates** in the Exotel dashboard
2. Click **Create Template**
3. Fill in the template details:
   - **Name**: Lowercase, underscores only (e.g., `order_confirmation`)
   - **Category**: Utility, Authentication, or Marketing
   - **Language**: Select the language(s) you need
   - **Header** (optional): Text, image, video, or document
   - **Body**: Your message text with `{{1}}`, `{{2}}` placeholders for dynamic content
   - **Footer** (optional): Short footer text
   - **Buttons** (optional): Quick Reply or Call-to-Action
4. Submit for Meta review

:::tip
Template review typically takes a few minutes to 24 hours. Start with a simple utility template (e.g., order confirmation) as these have the highest approval rate.
:::

For detailed guidance, see [Creating WhatsApp Templates](/docs/whatsapp-support/creating-templates).

### Step 7: Get Your API Credentials

1. Go to [my.exotel.com/apisettings/site#api-credentials](https://my.exotel.com/apisettings/site#api-credentials)
2. Copy your **API Key**, **API Token**, and **Account SID**
3. Note the appropriate endpoint for your region:

| Region | Endpoint |
|--------|----------|
| India | `https://api.in.exotel.com` |
| Singapore | `https://api.exotel.com` |

### Step 8: Send Your First Message

Use the [Send Message API](/docs/whatsapp-api/api-reference/send-message) to send a template message:

```bash
curl -u '<api_key>:<api_token>' -X POST "https://api.in.exotel.com/v2/accounts/<account_sid>/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+919876500001",
    "to": "+919876543210",
    "content": {
      "recipient_type": "individual",
      "type": "template",
      "template": {
        "name": "hello_world",
        "language": {
          "code": "en",
          "policy": "deterministic"
        }
      }
    }
  }'
```

A successful response returns HTTP 202:

```json
{
  "request_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "http_code": 202,
  "response": {
    "whatsapp": {
      "messages": [
        {
          "code": 202,
          "status": "success",
          "data": {
            "sid": "msg_sid_value"
          }
        }
      ]
    }
  }
}
```

### Step 9: Set Up Webhooks

Configure webhooks to receive delivery status updates and inbound messages:

1. Navigate to **WhatsApp > Settings > Webhooks** in the Exotel dashboard
2. Enter your webhook URL (must be HTTPS)
3. Select the events you want to receive:
   - **Message Status** -- Sent, delivered, read, failed
   - **Inbound Messages** -- Messages from customers

For webhook payload details, see [WhatsApp Webhooks](/docs/whatsapp-support/webhooks).

## Onboarding Checklist

Use this checklist to track your progress:

- [ ] Exotel account created and WhatsApp plan enabled
- [ ] Meta Business Manager account created
- [ ] Business verification submitted and approved
- [ ] Phone number registered and verified
- [ ] Business profile configured
- [ ] At least one message template created and approved
- [ ] API credentials obtained
- [ ] First test message sent successfully
- [ ] Webhooks configured for status updates and inbound messages

## Common Onboarding Issues

| Issue | Resolution |
|-------|-----------|
| Business verification rejected | Ensure documents match your Meta Business Manager details exactly. See [Business Verification](/docs/whatsapp-support/business-verification) |
| Phone number already registered | Delete the existing WhatsApp account from the phone, wait 5 minutes, then retry |
| Display name rejected | Follow [Display Name Guidelines](/docs/whatsapp-support/display-name-guidelines). The name must match your business and not contain generic terms |
| Template rejected | Review [Template Guidelines](/docs/whatsapp-support/template-guidelines) for common rejection reasons |
| API returns 401 | Double-check your API key, token, and account SID at the API settings page |

## Next Steps

- [WhatsApp Message Types](/docs/whatsapp-support/message-types) -- Understand the different message types available
- [Template Messages](/docs/whatsapp-support/template-messages) -- Deep dive into template message usage
- [WhatsApp API Reference](/docs/whatsapp-api/overview) -- Full API documentation
