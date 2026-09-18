---
id: dlt-template-registration
title: DLT Template Registration
description: "Register SMS content templates on DLT portals -- template types, variable formats, content approval guidelines, and common rejection reasons."
sidebar_label: DLT Template Registration
sidebar_position: 21
---

# DLT Template Registration

Every SMS sent in India must match a pre-approved DLT content template. This guide covers how to create templates, format variables, navigate the approval process, and avoid common rejection reasons.

## What Are DLT Templates?

A DLT template is a pre-registered message format that defines the exact structure of your SMS. When you send a message, the telecom operator compares it against your registered templates. Only messages that match an approved template are delivered.

### Template Components

| Component | Description | Example |
|-----------|-------------|---------|
| **Template Name** | Internal identifier | `order_shipped_notification` |
| **Template Type** | Category of the message | Transactional |
| **Content Type** | Text or Unicode | Text |
| **Header (Sender ID)** | Associated sender identity | `EXOTL` |
| **Template Body** | Message content with placeholders | `Your order {#var#} has been shipped.` |
| **Template ID** | Unique ID assigned after approval | `1107160000000012345` |

## Template Types

| Type | Code | Description | DND Bypass | Delivery Window |
|------|------|-------------|------------|----------------|
| **Transactional** | T | Time-sensitive alerts, OTPs, account updates | Yes | 24/7 |
| **Service Implicit** | SI | Service messages to existing customers | Yes | 24/7 |
| **Service Explicit** | SE | Service messages to users with explicit consent | Partial | 24/7 |
| **Promotional** | P | Marketing, offers, campaigns | No | 9 AM - 9 PM IST |

:::tip
Use **Transactional** for OTPs and critical alerts, **Service Implicit** for account-related updates to existing customers, and **Promotional** for marketing campaigns.
:::

## Variable Placeholders

DLT templates use `{#var#}` as the placeholder syntax for dynamic content:

```
Dear {#var#}, your order #{#var#} has been shipped via {#var#}.
Track at {#var#}. Expected delivery by {#var#}.
```

### Variable Rules

| Rule | Details |
|------|---------|
| Syntax | Must use `{#var#}` exactly (case-sensitive) |
| Count | No strict limit, but minimize for better approval chances |
| Position | Can appear anywhere in the message |
| Content | The variable is replaced with actual values when sending |
| Length | No fixed limit per variable, but the final message must fit within SMS limits |

### What Variables Can Replace

Variables can be substituted with:
- Customer names
- Order IDs, tracking numbers
- OTP codes
- Dates and times
- URLs and links
- Amounts and quantities
- Any dynamic content

### What Variables Cannot Replace

Variables should not replace the entire static meaning of the message. DLT portals may reject templates where:
- Variables make up more than 30-40% of the total message
- The template has only variables and no meaningful static text
- Variables could change the intent of the message

## Creating a Template: Step-by-Step

### Step 1: Plan Your Template

Before registering, plan the following:

| Decision | Details |
|----------|---------|
| Template purpose | What message does this template serve? |
| Template type | Transactional, promotional, or service? |
| Static text | What text remains constant in every message? |
| Variables | What data changes per recipient? |
| Content type | Plain text (English) or Unicode (regional language)? |
| Header | Which approved sender ID will use this template? |

### Step 2: Register on Your DLT Portal

The process is similar across portals. Using Jio TrueConnect as an example:

1. Log in to [https://trueconnect.jio.com](https://trueconnect.jio.com).
2. Navigate to **Templates** > **Content Template**.
3. Click **Add New Template**.

### Step 3: Fill Template Details

| Field | How to Fill | Example |
|-------|-------------|---------|
| Template Name | Descriptive, snake_case | `otp_login_verification` |
| Template Type | Select from dropdown | `Transactional` |
| Content Type | Text or Unicode | `Text` |
| Header | Select an approved header | `EXOTL` |
| Template Body | Message with `{#var#}` placeholders | See examples below |

### Step 4: Enter the Template Body

Write the message body with `{#var#}` for each dynamic value:

**OTP Template:**
```
Your OTP for {#var#} is {#var#}. Valid for {#var#} minutes. Do not share this with anyone. - Exotel
```

**Order Update Template:**
```
Dear {#var#}, your order #{#var#} has been shipped via {#var#}. Track at {#var#}. Expected delivery: {#var#}.
```

**Payment Confirmation Template:**
```
Hi {#var#}, payment of Rs. {#var#} received for invoice {#var#}. Transaction ID: {#var#}. Thank you. - {#var#}
```

### Step 5: Submit for Approval

1. Review the template carefully for spelling and grammar.
2. Ensure `{#var#}` placeholders are correctly placed.
3. Click **Submit**.
4. Note the submission reference number.

### Step 6: Track Approval

| Status | Meaning |
|--------|---------|
| Pending | Submitted, awaiting review |
| Approved | Template approved; note the Template ID |
| Rejected | Template rejected; review the reason and resubmit |
| Blacklisted | Template blocked for policy violations |

Approval typically takes **1-3 business days**.

## Content Approval Guidelines

### What Gets Approved

- Messages with clear, specific business purpose
- Templates with adequate static text (at least 60% static content)
- Proper grammar and punctuation
- Relevant sender ID association
- Correct template type classification

### What Gets Rejected

| Rejection Reason | Example | Fix |
|------------------|---------|-----|
| Too many variables | `{#var#} {#var#} {#var#} {#var#} {#var#}` | Add more static text between variables |
| Misleading content | Template that could be used for phishing | Ensure content is clearly from a legitimate business |
| Wrong template type | Marketing offer registered as transactional | Use the correct template type (Promotional for offers) |
| Offensive language | Inappropriate or obscene content | Remove offensive content |
| Impersonation | Content mimicking a government or bank | Ensure content clearly identifies your business |
| URL without context | Just a link with no explanation | Add descriptive text around the URL |
| Vague static text | `{#var#} message from {#var#} about {#var#}` | Provide specific, meaningful static text |

:::warning
Once a template is rejected, you must create a new template with the corrected content and resubmit. Most portals do not allow editing of submitted templates.
:::

## Template Examples by Category

### Transactional Templates

```
# OTP
Your OTP is {#var#}. It is valid for {#var#} minutes. Do not share it with anyone. - {#var#}

# Order Shipped
Hi {#var#}, your order {#var#} has been shipped. Track it here: {#var#}. - {#var#}

# Payment Alert
Dear {#var#}, Rs. {#var#} has been debited from your account on {#var#}. Ref: {#var#}. - {#var#}

# Appointment Reminder
Reminder: You have an appointment with {#var#} on {#var#} at {#var#}. Contact: {#var#}. - {#var#}
```

### Service Implicit Templates

```
# Account Update
Dear {#var#}, your account has been updated. New plan: {#var#}. Effective from {#var#}. - {#var#}

# Bill Reminder
Hi {#var#}, your bill of Rs. {#var#} is due on {#var#}. Pay now at {#var#} to avoid late fees. - {#var#}
```

### Promotional Templates

```
# Sale Announcement
Flat {#var#}% off on all {#var#}! Shop now at {#var#}. Offer valid till {#var#}. T&C apply. Reply STOP to opt out. - {#var#}

# Product Launch
Introducing {#var#}! Starting at Rs. {#var#}. Order now at {#var#}. Reply STOP to unsubscribe. - {#var#}
```

:::tip
For promotional templates, always include opt-out instructions (e.g., "Reply STOP to unsubscribe"). This is a DLT requirement and improves approval chances.
:::

## Unicode Templates

For regional language templates, select **Unicode** as the content type:

```
# Hindi OTP
आपका OTP {#var#} है। यह {#var#} मिनट के लिए वैध है। इसे किसी के साथ साझा न करें। - {#var#}

# Tamil Order Update
வணக்கம் {#var#}, உங்கள் ஆர்டர் {#var#} அனுப்பப்பட்டது. - {#var#}
```

See [Unicode SMS](/docs/sms-support/unicode-sms) for encoding details and character limits.

## Using Approved Templates with Exotel

Once a template is approved, use it with the Exotel API by passing the `DltTemplateId`:

```bash
curl -u '<api_key>:<api_token>' -X POST "https://api.exotel.com/v1/Accounts/<account_sid>/Sms/send" \
  -d "From=EXOTL" \
  -d "To=+919876543210" \
  -d "Body=Your OTP is 456789. It is valid for 10 minutes. Do not share it with anyone. - Exotel" \
  -d "DltEntityId=1101567890000012345" \
  -d "DltTemplateId=1107160000000012345"
```

The `Body` must match the template exactly, with `{#var#}` placeholders replaced by actual values. The static text must be identical character-for-character.

## Managing Templates

### Viewing Registered Templates

Log in to your DLT portal and navigate to the Templates section to view all your templates, their statuses, and template IDs.

### Deactivating a Template

If a template is no longer needed:

1. Navigate to the template in your DLT portal.
2. Click **Deactivate** or **Disable**.
3. The template will no longer be valid for sending.

### Updating a Template

DLT portals do not allow editing approved templates. To change a template:

1. Create a new template with the updated content.
2. Submit for approval.
3. After approval, update your application to use the new template ID.
4. Deactivate the old template.

## Common Issues

| Issue | Cause | Resolution |
|-------|-------|------------|
| `FAILED_DLT_TEMPLATE` | Message body does not match template | Ensure the sent message exactly matches the template; only `{#var#}` values differ |
| Template rejected | Content does not meet guidelines | Review rejection reason; fix and resubmit as a new template |
| Template pending too long | Portal processing delay | Follow up with DLT portal support after 3 business days |
| Template works on one operator but not another | Cross-portal sync delay | Allow 5-7 days for DLT blockchain synchronization |

## Next Steps

- [DLT Header Registration](/docs/sms-support/dlt-header-registration) -- Register sender IDs
- [DLT Consent Templates](/docs/sms-support/dlt-consent-template) -- Consent management
- [SMS Templates](/docs/sms-support/sms-templates) -- Using templates with Exotel
- [SMS API Reference](/docs/sms-api/api-reference/send-sms) -- API documentation
