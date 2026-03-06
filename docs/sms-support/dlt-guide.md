---
id: dlt-guide
title: DLT Registration Guide
description: "Detailed step-by-step DLT registration walkthrough for Jio, Airtel, and Vodafone-Idea portals to enable SMS sending via Exotel."
sidebar_label: DLT Registration Guide
sidebar_position: 6
---

# DLT Registration Guide

This guide provides a detailed, step-by-step walkthrough of the DLT registration process on major DLT portals. If you are new to DLT, read [What is DLT?](/docs/sms-support/what-is-dlt) and the [DLT Registration overview](/docs/sms-support/dlt-registration) first.

## Registration on Jio TrueConnect

Jio TrueConnect is one of the most widely used DLT portals. Follow these steps to register:

### Step 1: Create an Account

1. Visit [https://trueconnect.jio.com](https://trueconnect.jio.com).
2. Click **Register** or **Sign Up**.
3. Select **Enterprise** as the entity type (select **Aggregator** only if you are an SMS service provider).
4. Enter your mobile number to receive an OTP.
5. Verify the OTP and set your password.

### Step 2: Fill Entity Details

1. **Company Name**: Enter your registered business name exactly as it appears on your PAN card.
2. **Company Type**: Select Private Limited, LLP, Sole Proprietorship, etc.
3. **PAN Number**: Enter your company PAN.
4. **GST Number**: Enter your GSTIN.
5. **Registered Address**: Enter your company's registered address.
6. **Authorized Person Details**: Name, email, and phone number of the person managing the account.

### Step 3: Upload Documents

Upload the following documents in PDF or image format:

| Document | Format | Max Size |
|----------|--------|----------|
| PAN Card | PDF/JPG | 2 MB |
| Certificate of Incorporation | PDF | 2 MB |
| GST Certificate | PDF | 2 MB |
| Authorization Letter | PDF | 2 MB |
| Identity Proof | PDF/JPG | 2 MB |

### Step 4: Submit and Pay

1. Review all details for accuracy.
2. Accept the terms and conditions.
3. Submit the registration.
4. Complete the payment (if applicable).

### Step 5: Track Approval

1. Check your email for the registration confirmation.
2. Log in to the portal to track approval status.
3. Once approved, note your **Entity ID** from the dashboard.

## Registration on Airtel

### Step 1: Create an Account

1. Visit [https://www.airtel.in/business/commercial-communication](https://www.airtel.in/business/commercial-communication).
2. Click **Register as Enterprise**.
3. Enter your business email and mobile number.
4. Verify OTP and set up your account.

### Step 2: Complete Entity Registration

1. Fill in company details: name, type, PAN, GST.
2. Upload required documents.
3. Provide authorized person details.
4. Submit the registration form.

### Step 3: Approval

1. Airtel reviews your registration within 3-7 business days.
2. You receive an email notification upon approval.
3. Your Entity ID is available in the portal dashboard.

## Registration on Vodafone-Idea (ViLPower)

### Step 1: Create an Account

1. Visit [https://www.vilpower.in](https://www.vilpower.in).
2. Click **Sign Up** and select **Enterprise**.
3. Enter required details and verify via OTP.

### Step 2: Entity Registration

1. Fill in all business information.
2. Upload supporting documents.
3. Submit for review.

### Step 3: Approval

1. ViLPower processes registrations within 3-7 business days.
2. Entity ID is issued upon approval.

## Registering Headers After Entity Approval

Once your entity is approved on any DLT portal, register your sender IDs (headers):

1. Log in to your DLT portal.
2. Navigate to **Headers** or **Sender ID** section.
3. Click **Add Header**.
4. Select the header type:
   - **Transactional**: 6 alphabetic characters (e.g., `EXOTL`)
   - **Promotional**: 6 numeric digits
5. Enter the header value.
6. Submit for approval (typically 1-3 days).

## Registering Templates After Header Approval

After your headers are approved:

1. Navigate to **Templates** or **Content Templates** section.
2. Click **Add Template**.
3. Select the template category:
   - Transactional
   - Promotional
   - Service Implicit
   - Service Explicit
4. Enter the template name and message body using `{#var#}` for dynamic content.
5. Link the template to an approved header.
6. Submit for approval (typically 1-3 days).

:::tip
Register templates for all common use cases upfront, including OTPs, order updates, shipping notifications, and marketing messages. This avoids delays when you need to launch new campaigns.
:::

## Configuring DLT in Exotel

After all three registrations are approved:

### Step 1: Add DLT Entity ID

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Go to **Settings** > **SMS Settings**.
3. Enter your DLT Entity ID in the designated field.
4. Save the settings.

### Step 2: Map Sender IDs

1. In the SMS Settings, go to the **Sender IDs** section.
2. Add each DLT-approved sender ID.
3. Verify the sender IDs are active.

### Step 3: Test Your Setup

1. Go to **App Bazaar** > **SMS** > **Send SMS**.
2. Select a sender ID and template.
3. Send a test message to your own number.
4. Verify delivery.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Entity registration pending for more than 7 days | Contact the DLT portal's support team with your registration reference number |
| Documents rejected | Ensure documents are clear, legible, and match the entity name exactly |
| Header not approved | Verify the header does not conflict with existing registrations; try an alternative |
| Template rejected | Review DLT content guidelines; ensure the message does not contain prohibited content |
| Entity ID not recognized by Exotel | Wait for cross-portal sync (5-7 days); contact Exotel support if the issue persists |

## Next Steps

- [What is DLT?](/docs/sms-support/what-is-dlt) -- Understanding the DLT framework
- [DLT Entity Registration](/docs/sms-support/dlt-entity-registration) -- Detailed entity registration
- [DLT Header Registration](/docs/sms-support/dlt-header-registration) -- Detailed header registration
- [DLT Template Registration](/docs/sms-support/dlt-template-registration) -- Detailed template registration
- [SMS API Reference](/docs/sms-api/overview) -- API documentation
