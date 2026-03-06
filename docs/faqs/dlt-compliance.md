---
title: DLT Compliance
description: "Complete guide to DLT registration requirements for sending SMS in India through Exotel. Entity registration, Sender IDs, and template approval."
sidebar_label: DLT Compliance
sidebar_position: 12
---

# DLT Compliance

DLT (Distributed Ledger Technology) is India's regulatory framework for commercial SMS, mandated by TRAI. Every business sending SMS in India must register on a DLT portal and get their message templates pre-approved. This guide covers the registration process, requirements, and how DLT integrates with Exotel.

---

## What is DLT?

DLT is a blockchain-based registration system that tracks every commercial SMS in India. It was introduced by TRAI to reduce SMS spam and ensure accountability. The system requires:

1. **Business registration** (Entity registration) on a DLT portal
2. **Sender ID registration** (the header/brand name shown to recipients)
3. **Template registration** (pre-approval of every message content)

Without DLT registration, SMS messages sent through any Indian telecom operator are blocked at the operator level.

---

## DLT Registration Steps

### Step 1: Choose a DLT Portal

Register on any one operator's DLT portal. Your registration propagates to all operators:

| Operator | Portal | URL |
|----------|--------|-----|
| Jio | JioTrueConnect | `trueconnect.jio.com` |
| Airtel | Airtel IQ DLT | `www.airtel.in/business/commercial-communications` |
| Vodafone-Idea | VIL Power | `www.vilpower.in` |
| BSNL | BSNL UCC | `www.ucc-bsnl.co.in` |

:::tip
You only need to register on one DLT portal. Registrations are shared across all operators via the blockchain. However, propagation may take 24-48 hours.
:::

### Step 2: Register Your Entity

Entity registration creates your business identity on the DLT platform:

**Required information:**

| Field | Description | Example |
|-------|-------------|---------|
| Business name | Registered company name | Acme Technologies Pvt Ltd |
| Business type | Company, Partnership, Proprietorship, etc. | Private Limited |
| Registration number | CIN, GST, or equivalent | U74999KA2015PTC123456 |
| Business PAN | Permanent Account Number | AABCA1234B |
| Authorized signatory | Name and contact of authorized person | Rahul Kumar, +919876543210 |
| Email | Business email for communications | admin@acmetech.com |
| Address | Registered business address | Full postal address |

**Documents required:**

| Document | Format | Max Size |
|----------|--------|----------|
| Certificate of Incorporation | PDF | 5 MB |
| PAN card | PDF or image | 5 MB |
| GST certificate | PDF | 5 MB |
| Authorized signatory ID proof | PDF or image | 5 MB |
| Letter of authorization | PDF | 5 MB |

After submission, the DLT portal reviews and approves your entity registration. This typically takes **3-5 business days**.

Upon approval, you receive your **Entity ID** -- a unique numeric identifier required for all SMS API calls.

### Step 3: Register Sender IDs (Headers)

Sender IDs are the names that appear as the SMS sender on the recipient's phone.

| Sender Type | Format | Example | Use Case |
|------------|--------|---------|----------|
| Alphabetical (6 chars) | Letters only | `EXOTL` | Transactional and service messages |
| Numeric (6 digits) | Numbers only | `567890` | Promotional messages |

**Registration process:**

1. Log in to your DLT portal
2. Navigate to **Headers / Sender IDs**
3. Enter the desired Sender ID
4. Select the associated template category
5. Submit for approval (typically 1-2 business days)

:::warning
Sender IDs must be unique across the DLT ecosystem. If your desired Sender ID is already taken by another entity, you will need to choose a different one. Abbreviations of your brand name are commonly used.
:::

### Step 4: Register Message Templates

Every unique message you plan to send must be registered as a template:

1. Log in to your DLT portal
2. Navigate to **Templates > Create New Template**
3. Select template type (Transactional, Promotional, Service Implicit, Service Explicit)
4. Associate the template with a registered Sender ID
5. Enter the message body using `{#var#}` for variable placeholders
6. Submit for approval (typically 1-3 business days)

**Template example:**

```
Dear {#var#}, your payment of INR {#var#} has been received for invoice {#var#}.
Thank you for your business. - {#var#}
```

For detailed template management, see [SMS Campaign Templates](/docs/campaign-guides/sms-campaign-templates).

---

## Using DLT Credentials with Exotel

### SMS API

When sending individual SMS via the Exotel API, include DLT parameters:

```bash
curl -X POST "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/sms/send" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+919876543210",
    "body": "Dear Rahul, your payment of INR 5000 has been received for invoice INV-001. Thank you for your business. - Acme Corp",
    "sender_id": "EXOTL",
    "dlt_entity_id": "1234567890123456789",
    "dlt_template_id": "9876543210123456789"
  }'
```

### SMS Campaigns

When creating bulk SMS campaigns, DLT parameters are part of the campaign configuration:

```json
{
  "dlt_entity_id": "1234567890123456789",
  "dlt_template_id": "9876543210123456789",
  "sender_id": "EXOTL",
  "body": "Dear @@first_name, your payment of INR @@amount has been received..."
}
```

> **API Reference:** See the [SMS API](/docs/sms-api/overview) and [SMS Campaigns API](/docs/sms-campaigns/overview) for complete endpoint documentation.

---

## DLT Validation and Delivery

### How DLT Validation Works

```
Your application sends SMS via Exotel API
  --> Exotel validates Entity ID and Template ID
    --> Message submitted to telecom operator
      --> Operator validates message body against DLT template
        --> Message delivered (or rejected if mismatch)
```

### Common DLT Validation Failures

| Error | Description | Fix |
|-------|-------------|-----|
| Entity ID not found | Entity ID is invalid or not yet propagated | Verify your Entity ID on the DLT portal |
| Template ID not found | Template not approved or not propagated | Check template approval status; wait 24-48 hours |
| Content mismatch | Message body does not match the registered template | Ensure static text and variable positions match exactly |
| Sender ID mismatch | Sender ID not associated with the template | Use the Sender ID registered with this specific template |
| Entity blacklisted | Your entity has been blocked by the operator | Contact the DLT portal for resolution |

:::info
DLT template matching is strict. The telecom operator compares your message character-by-character against the template, with `{#var#}` positions accepting any content. Even minor differences in punctuation, spacing, or capitalization can cause a mismatch.
:::

---

## Managing DLT Templates

### Template Lifecycle

| Stage | Status | Action Needed |
|-------|--------|---------------|
| Submitted | Pending review | Wait for DLT portal approval |
| Approved | Active and usable | Use in Exotel API with the Template ID |
| Rejected | Cannot be used | Review rejection reason; fix and resubmit |
| Deactivated | No longer usable | Resubmit if needed or create a new template |

### Template Modification

DLT templates **cannot be edited** after approval. To change a template:

1. Create a new template with the updated content
2. Submit for approval
3. Update your application to use the new Template ID
4. The old template remains active (do not delete it until all campaigns using it are complete)

### Template Limits

Most DLT portals allow unlimited template registrations per entity. However, templates with excessive variables (mostly `{#var#}` with very little static text) may be flagged for review.

---

## DLT Compliance Checklist

Before sending any SMS through Exotel in India, verify:

| Requirement | Status |
|-------------|--------|
| Entity registered on a DLT portal | Required |
| Entity ID available and valid | Required |
| Sender ID(s) registered and approved | Required |
| Message template(s) registered and approved | Required per message type |
| Template body matches your API message content | Required |
| Correct template type for your use case | Required |
| DLT credentials configured in Exotel | Required |

---

## Frequently Asked Questions

### Do I need separate DLT registrations for voice and SMS?

No. DLT registration is only required for SMS. Voice calls do not require DLT templates or Entity IDs. However, voice campaigns must still comply with other TRAI regulations (calling hours, DND filtering).

### Can I use one DLT registration for multiple Exotel accounts?

Yes. Your DLT Entity ID is tied to your business, not to your Exotel account. You can use the same Entity ID and templates across multiple Exotel accounts.

### How long does DLT template propagation take?

After approval on one operator's portal, templates typically propagate to all operators within 24-48 hours. During this period, messages may fail on operators where the template has not yet propagated.

### Is DLT required for WhatsApp messages?

No. WhatsApp messages use Meta's template approval system, not DLT. However, DLT registration may be needed if you send SMS as a fallback when WhatsApp delivery fails.

---

## Related Resources

- [SMS Campaign Templates](/docs/campaign-guides/sms-campaign-templates) -- Template management for Exotel campaigns
- [TRAI Regulations](/docs/faqs/trai-regulations) -- Overview of Indian telecom regulations
- [NDNC/DND](/docs/faqs/ndnc-dnd) -- Do Not Call registry compliance
- [SMS API](/docs/sms-api/overview) -- Exotel SMS API reference
