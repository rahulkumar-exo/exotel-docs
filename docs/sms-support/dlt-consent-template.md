---
id: dlt-consent-template
title: DLT Consent Templates
description: "Manage DLT consent templates for SMS opt-in and opt-out compliance -- consent registration, types, and TRAI regulatory requirements."
sidebar_label: DLT Consent Templates
sidebar_position: 22
---

# DLT Consent Templates

Consent management is a critical component of DLT compliance in India. Businesses must register and maintain customer consent records on the DLT platform, especially for promotional and service-explicit messages. This guide covers consent types, registration, and best practices for compliance.

## Why Consent Matters

TRAI's regulations require businesses to obtain and record customer consent before sending commercial messages. The DLT platform enforces this by:

1. **Blocking promotional SMS** to numbers without registered consent.
2. **Allowing customers** to revoke consent at any time.
3. **Maintaining an audit trail** of all consent records.

:::warning
Sending promotional SMS to customers without registered consent is a violation of TRAI regulations. Violations can lead to fines, sender ID blacklisting, and account suspension.
:::

## Consent Types

| Consent Type | Description | Required For | How It Works |
|-------------|-------------|-------------|-------------|
| **Explicit Consent** | Customer actively opts in | Promotional SMS, Service Explicit | Customer provides clear written or digital consent |
| **Implicit Consent** | Inferred from an existing relationship | Transactional SMS, Service Implicit | Customer is an existing customer who has transacted with you |
| **Deemed Consent** | Consent assumed for certain communication types | Essential transactional messages | OTPs, critical alerts for existing customers |

### Explicit Consent Methods

Explicit consent can be collected through:

| Method | Example | Evidence |
|--------|---------|----------|
| **Web form** | Checkbox on website: "I agree to receive promotional SMS" | Database record with timestamp |
| **SMS opt-in** | Customer replies "YES" or "START" to a promotional message | Inbound SMS log |
| **Written form** | Physical registration form with consent checkbox | Scanned document |
| **App consent** | In-app permission prompt for marketing messages | App activity log |
| **IVR consent** | Voice-based opt-in via a phone call flow | Call recording or log |

## Registering Consent on DLT

### Step 1: Navigate to Consent Section

1. Log in to your DLT portal (Jio, Airtel, ViLPower, or BSNL).
2. Navigate to **Consent** or **Consent Management** section.
3. Click **Register Consent** or **Upload Consent**.

### Step 2: Choose Registration Method

| Method | Best For |
|--------|----------|
| **Individual entry** | Adding consent for a single number |
| **Bulk upload (CSV)** | Registering consent for many numbers at once |
| **API integration** | Automated consent registration (portal-specific) |

### Step 3: Individual Consent Registration

| Field | Description | Example |
|-------|-------------|---------|
| Customer Phone Number | Mobile number in E.164 format | `+919876543210` |
| Consent Type | Explicit or Implied | `Explicit` |
| Communication Type | Categories the customer consented to | `Promotional, Service Explicit` |
| Consent Date | Date consent was obtained | `2025-01-15` |
| Consent Evidence | Reference to the consent proof | `Web form ID: WF-2025-001` |
| Consent Expiry | Optional expiry date | `2026-01-15` |

### Step 4: Bulk Consent Upload

For registering consent for multiple numbers:

#### Prepare Your CSV

```csv
phone_number,consent_type,communication_type,consent_date,evidence_reference
+919876543210,explicit,promotional,2025-01-15,WEB-FORM-001
+919876543211,explicit,promotional,2025-01-15,WEB-FORM-002
+919876543212,explicit,service_explicit,2025-01-10,APP-OPT-IN-003
```

#### Upload Steps

1. Navigate to **Consent** > **Bulk Upload**.
2. Download the CSV template provided by the portal (recommended to ensure correct format).
3. Fill in the template with your consent records.
4. Upload the CSV file.
5. Review the upload summary (success/failure count).

:::tip
Upload consent records regularly. If you collect consent through an online form, set up a weekly or daily batch upload process to keep DLT records in sync.
:::

## Consent Template Registration

In addition to registering individual consent records, you must register a **consent template** that defines how you collect consent from customers.

### What Is a Consent Template?

A consent template is a pre-registered format that describes the consent collection mechanism. It tells the DLT platform how and where you obtain customer consent.

### Creating a Consent Template

1. Navigate to **Consent Templates** in your DLT portal.
2. Click **Add Consent Template**.
3. Fill in the details:

| Field | Description | Example |
|-------|-------------|---------|
| Template Name | Descriptive name | `website_signup_consent` |
| Consent Collection Method | How consent is obtained | Web form, SMS opt-in, App, Written |
| Brand Name | Your business name | `Exotel Communications` |
| Content | The consent text shown to customer | See examples below |

### Consent Template Examples

**Web Form Consent:**
```
By signing up, you agree to receive promotional messages and offers from [Company Name]
via SMS. You can opt out at any time by replying STOP to any message.
```

**SMS Opt-In Consent:**
```
Reply YES to subscribe to exclusive offers and updates from [Company Name].
Reply STOP to unsubscribe at any time. Standard messaging rates apply.
```

**App Consent:**
```
Allow [Company Name] to send you promotional messages and updates via SMS?
You can disable this in your app settings at any time.
```

## Managing Opt-Out (Revocation)

Customers must be able to revoke their consent at any time. You are required to:

### Provide Opt-Out Mechanisms

| Mechanism | Implementation |
|-----------|----------------|
| **SMS keyword** | Accept `STOP`, `UNSUBSCRIBE`, `CANCEL`, or `NO` as opt-out keywords |
| **Web portal** | Provide a preference center URL where customers can manage subscriptions |
| **Customer support** | Process opt-out requests received via phone or email |
| **In-app settings** | Allow users to disable SMS notifications in your app |

### Process Opt-Outs on DLT

When a customer opts out:

1. **Remove consent from DLT** -- Update the consent record on your DLT portal.
2. **Stop sending immediately** -- Do not send any more promotional messages to the number.
3. **Confirm opt-out** -- Send a final confirmation message (transactional): "You have been unsubscribed from [Company Name] promotional messages."

### Handling Opt-Out via Two-Way SMS

If you use [Two-Way SMS](/docs/sms-support/two-way-sms) to handle opt-outs:

```javascript
app.post('/sms/inbound', (req, res) => {
  const { From, Body } = req.body;
  const keyword = Body.trim().toUpperCase();

  const optOutKeywords = ['STOP', 'UNSUBSCRIBE', 'CANCEL', 'NO', 'OPTOUT'];

  if (optOutKeywords.includes(keyword)) {
    // Remove consent from your database
    removeConsent(From);

    // Remove consent from DLT portal (via portal API or manual process)
    removeDltConsent(From);

    // Send confirmation
    sendTransactionalSms(From,
      'You have been unsubscribed from promotional messages. You will no longer receive offers from us.');
  }

  res.status(200).send('OK');
});
```

:::warning
TRAI regulations require that opt-out requests are honored within 7 days. Best practice is to process them immediately.
:::

## Consent Audit and Compliance

### Record Keeping

Maintain detailed records of all consent activities:

| Record | Details |
|--------|---------|
| Consent date | When the customer opted in |
| Consent method | How consent was collected (web, SMS, app) |
| Consent evidence | Proof of consent (form submission ID, SMS log) |
| Revocation date | When the customer opted out (if applicable) |
| Communication types | What types of messages the customer consented to |

### Compliance Checklist

- [ ] Consent records uploaded to DLT portal for all promotional SMS recipients
- [ ] Consent templates registered on DLT portal
- [ ] Opt-out mechanism implemented and tested (STOP keyword at minimum)
- [ ] Opt-out requests processed within 7 days
- [ ] Consent records maintained for at least 1 year after revocation
- [ ] Promotional SMS only sent during 9 AM - 9 PM IST
- [ ] Promotional SMS not sent to DND numbers without explicit consent

## Category Preferences

Under TRAI regulations, customers can set preferences for the types of commercial communications they wish to receive. These categories include:

| Category | Code | Examples |
|----------|------|---------|
| Banking/Insurance/Financial | 1 | Loan offers, insurance plans, credit card promotions |
| Real Estate | 2 | Property listings, home loan offers |
| Education | 3 | Course promotions, admission offers |
| Health | 4 | Health plans, medical offers |
| Consumer Goods/Automobiles | 5 | Product launches, automotive deals |
| Communication/Broadcasting/Entertainment/IT | 6 | OTT offers, telecom plans |
| Tourism/Leisure | 7 | Travel deals, hotel offers |

When a customer registers preferences on their operator's DND portal, promotional messages must respect these preferences. Messages outside the consented categories will be blocked.

## Common Issues

| Issue | Cause | Resolution |
|-------|-------|------------|
| `FAILED_DLT_CONSENT` | No consent registered for recipient | Upload consent for the number on DLT portal |
| Promotional SMS blocked | Recipient on DND without explicit consent | Register explicit consent or switch to transactional SMS type |
| `FAILED_DLT_PREFERENCE` | Customer's category preference does not include your message type | Respect category preferences; send only consented categories |
| Consent upload fails | CSV format error | Use the portal's template CSV; ensure correct date formats |
| Old consent expired | Consent record past expiry date | Re-obtain consent and upload fresh records |

## Next Steps

- [DLT Template Registration](/docs/sms-support/dlt-template-registration) -- Register message templates
- [DLT Entity Registration](/docs/sms-support/dlt-entity-registration) -- Entity registration guide
- [Promotional SMS](/docs/sms-support/promotional-sms) -- Sending promotional messages
- [Two-Way SMS](/docs/sms-support/two-way-sms) -- Handle opt-in/opt-out via SMS
