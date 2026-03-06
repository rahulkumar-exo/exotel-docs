---
id: sender-id
title: Sender ID (Header)
description: "Learn how to register and manage SMS sender IDs (headers) on DLT portals for use with Exotel's SMS platform in India."
sidebar_label: Sender ID
sidebar_position: 4
---

# Sender ID (Header)

A Sender ID (also called a header) is the name or number that appears as the sender when an SMS is delivered to the recipient. In India, all sender IDs must be registered on a DLT portal before they can be used for sending SMS.

## What Is a Sender ID?

When you receive an SMS from a business, the sender name displayed (e.g., `EXOTL`, `HDFCBK`, `AMZN`) is the Sender ID. It is a 6-character alphabetic identifier for transactional SMS or a 6-digit numeric code for promotional SMS.

### Sender ID Format

| SMS Type | Format | Example |
|----------|--------|---------|
| **Transactional** | 6 uppercase alphabetic characters | `EXOTL`, `HDFCBK` |
| **Promotional** | 6 digits (numeric) | `777888` |

:::note
The first two characters of a transactional sender ID are reserved for the telecom operator prefix, meaning only the last 4 characters are customizable. However, on most DLT portals, you register the full 6-character header.
:::

## Registering a Sender ID

### Step 1: Choose Your DLT Portal

Register your sender ID on the same DLT portal where your entity is registered:

| Operator | Portal |
|----------|--------|
| Jio | [trueconnect.jio.com](https://trueconnect.jio.com) |
| Airtel | [airtel.in/business/commercial-communication](https://www.airtel.in/business/commercial-communication) |
| Vodafone-Idea | [vilpower.in](https://www.vilpower.in) |
| BSNL | [ucc-bsnl.co.in](https://www.ucc-bsnl.co.in) |
| MTNL | [ucc-mtnl.in](https://www.ucc-mtnl.in) |

### Step 2: Navigate to Header Registration

1. Log in to your DLT portal.
2. Go to **Header** or **Sender ID** section.
3. Click **Add New Header** or **Register Header**.

### Step 3: Fill in Header Details

| Field | Description | Example |
|-------|-------------|---------|
| Header Type | Transactional or Promotional | `Transactional` |
| Header Value | 6-character sender ID | `EXOTL` |
| Category | Business category | `E-commerce` |
| Associated Templates | Templates linked to this header | Select applicable templates |

### Step 4: Submit for Approval

1. Submit the header for DLT approval.
2. Approval typically takes 1-3 business days.
3. Once approved, the header can be used to send SMS via Exotel.

## Mapping Sender ID in Exotel

After DLT approval, configure the sender ID in your Exotel account:

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Navigate to **Settings** > **SMS Settings** or **App Bazaar** > **SMS**.
3. Add your DLT-approved sender ID.
4. Enter the associated DLT Entity ID.
5. Save the configuration.

## Using Sender ID When Sending SMS

Pass the sender ID in the `From` parameter when using the [Send SMS API](/docs/sms-api/api-reference/send-sms):

```bash
curl -X POST "https://<api_key>:<api_token>@api.exotel.com/v1/Accounts/<account_sid>/Sms/send" \
  -d "From=EXOTL" \
  -d "To=+919876543210" \
  -d "Body=Your OTP is 123456" \
  -d "DltEntityId=1234567890123" \
  -d "DltTemplateId=1107160000000012345"
```

## Sender ID Guidelines

### Do's

- Use a sender ID that clearly identifies your brand or organization.
- Keep it short and memorable (maximum 6 characters).
- Register multiple headers for different use cases (e.g., `EXOTL` for general, `EXOOTP` for OTPs).
- Ensure the sender ID is linked to the correct DLT templates.

### Don'ts

- Do not use generic or misleading sender IDs (e.g., `INFORM`, `UPDATE`).
- Do not use government entity names unless authorized (e.g., `GOVTIN`).
- Do not use another brand's name or trademark.
- Do not use numbers in transactional sender IDs (alphabetic only).

## Common Issues

| Issue | Cause | Resolution |
|-------|-------|------------|
| `FAILED_INVALID_SENDER` | Sender ID not registered or not approved | Verify the header is approved on your DLT portal and mapped in Exotel |
| Header rejection on DLT | Name conflicts with existing registrations | Try an alternative sender ID that is unique and brand-specific |
| SMS going to wrong operator | Header registered on only one DLT portal | Register the header on all major DLT portals for full coverage |
| Template not linked | Template and header mismatch | Ensure the template is registered under the same header on DLT |

:::warning
A sender ID registered on one DLT portal (e.g., Jio) works across all operators due to inter-portal sharing. However, processing time for cross-operator visibility may take up to 7 days.
:::

## Multiple Sender IDs

You can register multiple sender IDs for different purposes:

| Sender ID | Purpose | Example Use |
|-----------|---------|-------------|
| `EXOTL` | General notifications | Account updates, alerts |
| `EXOOTP` | OTP verification | Login OTPs, transaction confirmations |
| `EXOMKT` | Marketing (promotional) | Offers, campaigns |

## Next Steps

- [SMS Templates](/docs/sms-support/sms-templates) -- Register templates for your sender IDs
- [DLT Registration](/docs/sms-support/dlt-registration) -- Complete entity registration
- [How to Send SMS](/docs/sms-support/how-to-send-sms) -- Send messages using your sender ID
- [SMS API Reference](/docs/sms-api/api-reference/send-sms) -- API documentation
