---
title: SMS Campaign Templates
description: "Manage DLT-compliant SMS templates for Exotel campaigns. Learn template registration, approval workflows, and variable substitution."
sidebar_label: SMS Campaign Templates
sidebar_position: 9
---

# SMS Campaign Templates

Every SMS sent through Exotel in India must use a pre-approved DLT (Distributed Ledger Technology) template. This guide covers the DLT template registration process, approval workflow, variable substitution for dynamic campaigns, and template management best practices.

## Understanding DLT Templates

DLT is India's regulatory framework for commercial SMS, mandated by TRAI. Every SMS message must be matched against a registered template before delivery. The telecom operator verifies the message content against the template, and messages that do not match are blocked.

### Template Components

| Component | Description | Example |
|-----------|-------------|---------|
| **Entity ID** | Your unique DLT registration identifier | `1234567890123456789` |
| **Template ID** | Unique identifier for each registered template | `9876543210123456789` |
| **Sender ID** | The header/brand name shown to recipients | `EXOTL` |
| **Template body** | The message text with variable placeholders | `Dear {#var#}, your order {#var#} is confirmed.` |
| **Template type** | Category determining delivery rules | Transactional, Promotional, Service |

## DLT Template Types

| Type | Code | Delivery Hours | DND Filtering | Use Case |
|------|------|---------------|---------------|----------|
| **Transactional** | `trans` | 24/7 | Not filtered | OTPs, order updates, alerts, account notifications |
| **Promotional** | `promo` | 9 AM -- 9 PM IST | Filtered (blocked for DND numbers) | Marketing offers, discounts, advertisements |
| **Service Implicit** | `si` | 24/7 | Partially filtered | Updates to existing customers (e.g., plan changes) |
| **Service Explicit** | `se` | 24/7 | Partially filtered | Communications to users who gave explicit consent |

:::tip
Choose the correct template type during registration. Using a promotional template for transactional messages wastes delivery capability (DND filtering applies unnecessarily), while using a transactional template for promotional content violates DLT regulations.
:::

## Registering a DLT Template

### Step 1: Access Your DLT Portal

Each telecom operator in India has its own DLT portal. Register with at least one:

| Operator | DLT Portal URL |
|----------|---------------|
| Jio | `trueconnect.jio.com` |
| Airtel | `www.airtel.in/business/commercial-communications` |
| Vodafone-Idea | `www.vilpower.in` |
| BSNL | `www.ucc-bsnl.co.in` |

:::info
You only need to register on one operator's DLT portal. Template registrations are shared across operators through the DLT blockchain network. However, propagation to all operators may take 24-48 hours after approval.
:::

### Step 2: Create the Template

1. Log in to your DLT portal
2. Navigate to **Templates > Create New Template**
3. Fill in the template details:

| Field | Description | Guidelines |
|-------|-------------|-----------|
| **Template name** | Internal reference name | Descriptive, e.g., `order_shipment_notification` |
| **Template type** | Message category | Select the appropriate type (see table above) |
| **Content type** | Text or Unicode | Use Unicode for regional languages |
| **Message body** | Template text with variables | Use `{#var#}` for dynamic placeholders |
| **Associated Sender ID** | The header to use | Must be a registered and approved Sender ID |

### Step 3: Write the Template Body

Use `{#var#}` as the placeholder for any dynamic content:

**Example templates:**

**Order confirmation:**
```
Dear {#var#}, your order {#var#} has been confirmed. Expected delivery: {#var#}. Track at {#var#}. Thank you for shopping with {#var#}.
```

**Appointment reminder:**
```
Hi {#var#}, this is a reminder for your appointment on {#var#} at {#var#}. Please arrive 15 minutes early. Call {#var#} to reschedule.
```

**Payment reminder:**
```
Dear {#var#}, your payment of INR {#var#} for invoice {#var#} is due on {#var#}. Pay now at {#var#}. Ignore if already paid.
```

**OTP verification:**
```
{#var#} is your OTP for {#var#}. Valid for {#var#} minutes. Do not share this code with anyone. - {#var#}
```

### Step 4: Submit for Approval

After submitting, the DLT portal reviews your template:

| Status | Meaning | Typical Timeline |
|--------|---------|-----------------|
| Pending | Under review | -- |
| Approved | Ready to use | 1-3 business days |
| Rejected | Does not meet DLT guidelines | Immediate (with rejection reason) |

### Common Rejection Reasons

| Reason | Fix |
|--------|-----|
| Template contains URL without `{#var#}` | Replace hardcoded URLs with `{#var#}` placeholders |
| Template type mismatch | Change template type to match actual use case |
| Missing opt-out language | Add opt-out instructions for promotional templates |
| Brand name not registered | Register your brand name as a Sender ID first |
| Excessive variables | Reduce `{#var#}` count; templates with mostly variables are flagged |

## Using Templates in Exotel Campaigns

### Mapping DLT Variables to CSV Columns

DLT templates use `{#var#}` for all variables. In Exotel campaigns, you map these to specific CSV column values using the `@@column_header` syntax.

**DLT template (registered):**
```
Dear {#var#}, your order {#var#} has been shipped. Track at {#var#}. Thank you for shopping with {#var#}.
```

**CSV file:**
```csv
number,first_name,order_id,tracking_url,company_name
+919876543210,Rahul,ORD-001,https://track.example.com/001,Acme Store
+919876543211,Priya,ORD-002,https://track.example.com/002,Acme Store
```

**Exotel campaign body:**
```
Dear @@first_name, your order @@order_id has been shipped. Track at @@tracking_url. Thank you for shopping with @@company_name.
```

**Resulting SMS for Rahul:**
```
Dear Rahul, your order ORD-001 has been shipped. Track at https://track.example.com/001. Thank you for shopping with Acme Store.
```

### Variable Substitution Rules

| Rule | Description |
|------|-------------|
| Variable syntax | `@@column_header` (double @ followed by exact CSV column name) |
| Case sensitivity | Column headers are case-sensitive; `@@First_Name` does not match `first_name` |
| Missing values | If a CSV cell is empty, the variable is replaced with an empty string |
| No spaces in headers | Use underscores (`first_name`), not spaces (`first name`) |
| Special characters | Avoid special characters in column headers; use alphanumeric and underscores only |

:::warning
The final substituted message must match your DLT template structure. If the variable values cause the message to deviate from the approved template pattern, the telecom operator will reject the message. Ensure your CSV data does not introduce unexpected characters or formatting.
:::

### Static Campaign Templates

For static campaigns (same message to all recipients), the body is a literal string without `@@` variables:

```json
{
  "body": "Your subscription has been renewed for another month. Thank you for being a valued customer. - Acme Corp",
  "campaign_type": "static"
}
```

The static body must still match a registered DLT template exactly (with the variable positions filled with the actual values).

## Template Management Best Practices

### Naming Convention

Use a consistent naming convention for your DLT templates:

```
<category>_<purpose>_<version>
```

**Examples:**
- `trans_order_confirmation_v1`
- `promo_festive_sale_oct2024`
- `si_subscription_renewal_v2`
- `trans_otp_verification_v1`

### Template Versioning

When you need to update a template:

1. Create a new template with updated content (DLT templates cannot be edited after approval)
2. Submit for approval
3. Update your campaign configuration to use the new Template ID
4. Keep the old template active until all in-flight campaigns using it are complete

### Template Inventory

Maintain an inventory of your approved templates:

| Template Name | Template ID | Type | Sender ID | Status | Last Used |
|--------------|-------------|------|-----------|--------|-----------|
| order_confirmation_v1 | `98765...` | Transactional | EXOTL | Active | 2024-02-10 |
| payment_reminder_v2 | `98766...` | Transactional | EXOTL | Active | 2024-02-08 |
| festive_sale_jan | `98767...` | Promotional | 567890 | Active | 2024-01-15 |

### Character Limits

| Message Type | Character Limit | Notes |
|-------------|----------------|-------|
| Single SMS (GSM) | 160 characters | Standard Latin characters |
| Single SMS (Unicode) | 70 characters | Regional languages (Hindi, Tamil, etc.) |
| Multi-part SMS (GSM) | 153 characters per part | Header bytes reduce per-part limit |
| Multi-part SMS (Unicode) | 67 characters per part | Header bytes reduce per-part limit |

:::info
Multi-part SMS messages are billed as multiple messages. A 320-character GSM message is billed as 3 SMS (ceil(320/153) = 3). Keep messages concise to control costs.
:::

### URL Shortening

Long URLs in SMS consume valuable character space. Use Exotel's URL shortening feature to reduce URL length:

```bash
curl -u '<api_key>:<api_token>' -X POST "https://api.exotel.com/v2/accounts/<account_sid>/url-shortener" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.example.com/track/order/ORD-2024-001"}'
```

> **API Reference:** See the [URL Shortening API](/docs/url-shortening/overview) for complete documentation.

## Troubleshooting Template Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| SMS rejected with "Template not found" | Template ID not approved or not propagated | Verify template is approved on DLT portal; wait 24-48 hours for propagation |
| SMS rejected with "Content mismatch" | Message body does not match template | Ensure variable substitutions produce text matching the template pattern |
| Template rejected during registration | Content violates DLT guidelines | Review rejection reason; fix and resubmit |
| Unicode characters displaying incorrectly | Wrong content type selected | Register template as Unicode type for regional languages |
| Variable not replaced in message | Column header mismatch or typo | Verify `@@variable` names match CSV headers exactly (case-sensitive) |
| Multi-part message charged extra | Message exceeds single SMS limit | Shorten message text; use URL shortening for long URLs |

## Next Steps

- [Creating an SMS Campaign](./creating-sms-campaign) -- Use your templates in a campaign
- [SMS Campaign Reports](./sms-campaign-reporting) -- Track template-level delivery metrics
- [DLT Compliance](/docs/faqs/dlt-compliance) -- Detailed DLT registration guide
- [SMS API](/docs/sms-api/overview) -- Send individual SMS with templates via API
