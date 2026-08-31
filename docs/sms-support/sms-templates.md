---
id: sms-templates
title: SMS Templates
description: "Guide to creating, registering, and managing DLT-compliant SMS templates on Exotel for transactional and promotional messaging."
sidebar_label: SMS Templates
sidebar_position: 3
---

# SMS Templates

All SMS sent in India must use DLT-approved templates as mandated by TRAI. This guide explains how to create, register, and manage SMS templates for use with Exotel.

## What Are SMS Templates?

SMS templates are pre-approved message formats registered on a DLT (Distributed Ledger Technology) portal. Each template has:

- A **Template ID** -- Unique identifier assigned by the DLT portal after approval.
- A **Template Name** -- A descriptive label for your reference.
- A **Message Body** -- The message text with optional variable placeholders.
- A **Template Type** -- Transactional, promotional, or service.
- A **Sender ID (Header)** -- The sender identity linked to the template.

## Template Types

| Type | Code | Description | Example |
|------|------|-------------|---------|
| **Transactional** | `T` | Time-sensitive alerts, OTPs, order updates | "Your OTP is \{#var#\}. Valid for 10 minutes." |
| **Promotional** | `P` | Marketing, offers, discounts | "Flat \{#var#\}% off on all products! Shop now at \{#var#\}" |
| **Service Implicit** | `SI` | Service messages to existing customers | "Dear \{#var#\}, your bill of Rs. \{#var#\} is due on \{#var#\}." |
| **Service Explicit** | `SE` | Service messages with explicit opt-in | "Hi \{#var#\}, based on your interest, check out our new plan at \{#var#\}" |

## Creating a Template

### Step 1: Log in to Your DLT Portal

Access your DLT portal account. Common portals include:

| Operator | Portal URL |
|----------|-----------|
| Jio | [https://trueconnect.jio.com](https://trueconnect.jio.com) |
| Airtel | [https://www.airtel.in/business/commercial-communication](https://www.airtel.in/business/commercial-communication) |
| Vodafone-Idea | [https://www.vilpower.in](https://www.vilpower.in) |
| BSNL | [https://www.ucc-bsnl.co.in](https://www.ucc-bsnl.co.in) |
| MTNL | [https://www.ucc-mtnl.in](https://www.ucc-mtnl.in) |
| Smartping (Videocon) | [https://smartping.live](https://smartping.live) |

### Step 2: Navigate to Template Registration

1. Go to **Templates** or **Content Template** section.
2. Click **Add New Template** or **Register Template**.

### Step 3: Fill in Template Details

| Field | Description | Example |
|-------|-------------|---------|
| Template Name | Descriptive name for identification | `order_otp_verification` |
| Template Type | Select the category | `Transactional` |
| Content Type | Text or Unicode | `Text` |
| Header (Sender ID) | Select your registered header | `EXOTL` |
| Template Content | Message body with variables | `Your OTP for order {#var#} is {#var#}. Do not share this with anyone.` |

### Step 4: Variable Placeholders

Use `{#var#}` as placeholders for dynamic content in your templates:

```
Dear {#var#}, your order #{#var#} has been shipped via {#var#}.
Track at {#var#}. Delivery expected by {#var#}.
```

:::tip
Each `{#var#}` placeholder can be replaced with any value when sending the SMS. The DLT system validates that the static portions of your message match the template.
:::

### Step 5: Submit for Approval

1. Review the template carefully.
2. Click **Submit** to send it for approval.
3. Approval typically takes 1-3 business days.
4. Once approved, note the **Template ID** for use with Exotel.

## Using Templates with Exotel

### In the Dashboard

1. Go to **App Bazaar** > **SMS** > **Send SMS**.
2. Select your sender ID.
3. Choose an approved template from the dropdown.
4. Fill in the variable values.
5. Send the message.

### Via the API

Pass the `DltTemplateId` parameter when sending SMS through the [Send SMS API](/docs/sms-api/api-reference/send-sms):

```bash
curl -u '<api_key>:<api_token>' -X POST "https://api.exotel.com/v1/Accounts/<account_sid>/Sms/send" \
  -d "From=EXOTL" \
  -d "To=+919876543210" \
  -d "Body=Your OTP for order ORD123 is 456789. Do not share this with anyone." \
  -d "DltEntityId=1234567890123" \
  -d "DltTemplateId=1107160000000012345"
```

:::warning
The message body sent via the API must **exactly match** the approved template structure. Only the `{#var#}` placeholders can be replaced with actual values. Any mismatch will result in a `FAILED_DLT_TEMPLATE` error.
:::

## Template Best Practices

1. **Keep templates concise** -- SMS has a 160-character limit for plain text (70 for Unicode). Longer messages are sent as multi-part SMS and cost more.
2. **Use meaningful names** -- Name templates descriptively (e.g., `otp_login`, `order_shipped`) for easy identification.
3. **Minimize variables** -- Use only necessary variable placeholders. Too many variables may cause template rejection.
4. **Include opt-out** -- For promotional templates, include opt-out instructions (e.g., "Reply STOP to unsubscribe").
5. **Avoid special characters** -- Stick to standard ASCII characters in plain-text templates to avoid encoding issues.
6. **Test before production** -- Always test templates with sample data before using in production.

## Managing Templates

### Viewing Templates

- **DLT Portal**: Log in to your DLT portal to see all registered templates and their approval status.
- **Exotel Dashboard**: View mapped templates in the SMS configuration section.

### Template Statuses

| Status | Description |
|--------|-------------|
| `Pending` | Template submitted, awaiting approval |
| `Approved` | Template approved and ready to use |
| `Rejected` | Template rejected; review and resubmit |
| `Blacklisted` | Template blocked due to policy violations |
| `Deactivated` | Template manually disabled |

### Updating a Template

DLT portals generally do not allow editing approved templates. To modify a template:

1. Create a new template with the updated content.
2. Submit the new template for approval.
3. Once approved, update your application to use the new template ID.
4. Optionally, deactivate the old template.

## Common Template Errors

| Error | Cause | Resolution |
|-------|-------|------------|
| `FAILED_DLT_TEMPLATE` | Message body does not match the template | Ensure exact match with approved template, replacing only `{#var#}` placeholders |
| `FAILED_DLT_SCRUBBING` | Template not found in DLT registry | Verify the template ID and ensure it is approved on your DLT portal |
| Template Rejected | Content violates DLT guidelines | Review DLT content guidelines and resubmit with compliant content |

## Next Steps

- [Sender ID](/docs/sms-support/sender-id) -- Register your sender ID
- [DLT Registration](/docs/sms-support/dlt-registration) -- Complete DLT setup
- [How to Send SMS](/docs/sms-support/how-to-send-sms) -- Send your first message
- [SMS API Reference](/docs/sms-api/api-reference/send-sms) -- API documentation
