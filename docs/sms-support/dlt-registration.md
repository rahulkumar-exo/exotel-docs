---
id: dlt-registration
title: DLT Registration
description: "Complete guide to registering your business on a DLT portal for sending SMS in India, including entity, header, and template setup."
sidebar_label: DLT Registration
sidebar_position: 5
---

# DLT Registration

DLT (Distributed Ledger Technology) registration is mandatory for all businesses sending SMS in India. This guide walks you through the complete registration process, from entity registration to template approval.

## Why Is DLT Registration Required?

In 2021, TRAI (Telecom Regulatory Authority of India) mandated that all businesses sending commercial SMS must register on a DLT platform. This regulation aims to:

- **Reduce spam** -- Only registered entities can send SMS.
- **Protect consumers** -- Messages must match approved templates.
- **Ensure transparency** -- All senders are traceable through their entity registration.
- **Enforce consent** -- Businesses must maintain verifiable consent for promotional messages.

:::warning
Without DLT registration, your SMS will be blocked by telecom operators. This applies to all message types, including transactional, promotional, and OTP SMS.
:::

## Registration Overview

The DLT registration process involves three steps:

```
1. Entity Registration → 2. Header (Sender ID) Registration → 3. Template Registration
```

| Step | What You Register | Approval Time | Required For |
|------|-------------------|---------------|-------------|
| Entity Registration | Your business identity | 3-7 days | All SMS sending |
| Header Registration | Sender IDs (e.g., EXOTL) | 1-3 days | All SMS sending |
| Template Registration | Message templates | 1-3 days | All SMS sending |

## Step 1: Choose a DLT Portal

Register on any one of the approved DLT portals. Your registration is shared across all operators via the DLT blockchain.

| Operator | Portal | Registration Link |
|----------|--------|-------------------|
| Jio TrueConnect | [trueconnect.jio.com](https://trueconnect.jio.com) | Sign up on portal |
| Airtel | [airtel.in/business](https://www.airtel.in/business/commercial-communication) | Sign up on portal |
| Vodafone-Idea (ViLPower) | [vilpower.in](https://www.vilpower.in) | Sign up on portal |
| BSNL | [ucc-bsnl.co.in](https://www.ucc-bsnl.co.in) | Sign up on portal |
| MTNL | [ucc-mtnl.in](https://www.ucc-mtnl.in) | Sign up on portal |
| Smartping (Videocon) | [smartping.live](https://smartping.live) | Sign up on portal |

:::tip
Most businesses register on **Jio TrueConnect** or **Vodafone-Idea (ViLPower)** as these portals have a smoother registration process and faster approval times.
:::

## Step 2: Entity Registration

### Documents Required

| Document | Details |
|----------|---------|
| PAN Card | Company PAN card or individual PAN |
| Certificate of Incorporation | For companies and LLPs |
| GST Certificate | GST registration certificate |
| Authorization Letter | On company letterhead, authorizing the person registering |
| Proof of Address | Utility bill or bank statement |
| Identity Proof | Aadhaar, passport, or voter ID of authorized person |

### Registration Process

1. Visit your chosen DLT portal and click **Register** or **Sign Up**.
2. Select entity type: **Enterprise** (if sending SMS for your own business) or **Aggregator** (if sending on behalf of others).
3. Fill in business details:
   - Company name
   - Registered address
   - Contact details
   - PAN number
   - GST number
4. Upload required documents.
5. Provide authorized signatory details.
6. Review and submit the registration.
7. Pay the registration fee (varies by portal, typically Rs. 5,000 -- Rs. 10,000 as a one-time fee).

### After Submission

- You will receive a confirmation email with your application reference number.
- Approval typically takes **3-7 business days**.
- Once approved, you receive your **DLT Entity ID** (also called Principal Entity ID or PE ID).

:::note
Your DLT Entity ID is a unique numeric identifier (e.g., `1101567890000012345`) that you need to provide when sending SMS through Exotel. Save this securely.
:::

## Step 3: Register Sender IDs (Headers)

After entity registration is approved, register your sender IDs. See the detailed [Sender ID guide](/docs/sms-support/sender-id) for step-by-step instructions.

## Step 4: Register Templates

With your entity and headers approved, register message templates. See the detailed [SMS Templates guide](/docs/sms-support/sms-templates) for step-by-step instructions.

## Step 5: Configure Exotel

After all DLT registrations are approved:

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Navigate to **Settings** > **SMS Settings**.
3. Enter your **DLT Entity ID**.
4. Map your approved sender IDs (headers).
5. Your approved templates will be automatically validated when you send SMS.

## Registration Fees

| Portal | One-time Fee | Annual Renewal |
|--------|-------------|----------------|
| Jio TrueConnect | Rs. 5,000 - Rs. 10,000 | Varies |
| Vodafone-Idea | Rs. 5,000 - Rs. 10,000 | Varies |
| Airtel | Rs. 5,000 - Rs. 10,000 | Varies |
| BSNL | Rs. 5,000 - Rs. 10,000 | Varies |

:::note
Fees vary by portal and entity type. Check the respective DLT portal for current pricing.
:::

## Common Registration Issues

| Issue | Cause | Resolution |
|-------|-------|------------|
| Registration rejected | Incomplete documents or mismatched details | Verify all documents match your company's legal records. Resubmit with corrections. |
| Long approval delay | High volume of applications | Follow up with the DLT portal's support team. Typical SLA is 7 business days. |
| Entity ID not working | Entity approved but not synced across operators | Allow 5-7 days for cross-portal synchronization. Contact Exotel support if the issue persists. |
| Multiple registrations | Registered on multiple portals | You only need to register on one portal. The registration propagates to all operators. |

## Next Steps

- [DLT Registration Guide](/docs/sms-support/dlt-guide) -- Detailed step-by-step walkthrough with screenshots
- [What is DLT?](/docs/sms-support/what-is-dlt) -- Understanding the DLT framework
- [Sender ID](/docs/sms-support/sender-id) -- Register sender IDs
- [SMS Templates](/docs/sms-support/sms-templates) -- Register message templates
- [SMS API Reference](/docs/sms-api/overview) -- API documentation
