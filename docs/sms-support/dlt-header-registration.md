---
id: dlt-header-registration
title: DLT Header Registration
description: "Register SMS sender IDs (headers) on DLT portals -- step-by-step process for transactional and promotional headers with approval guidelines."
sidebar_label: DLT Header Registration
sidebar_position: 20
---

# DLT Header Registration

After your entity is approved on a DLT portal, the next step is to register your headers (sender IDs). A header is the sender name or number displayed to the SMS recipient. This guide walks you through the header registration process across major DLT portals.

## Prerequisites

Before registering a header, you must have:

- An approved DLT entity registration with a valid **Entity ID (PE ID)**
- Access to your DLT portal account
- A planned sender ID that follows DLT naming guidelines

## Header Types

| Type | Format | Characters | Example | Used For |
|------|--------|-----------|---------|----------|
| **Transactional** | Alphabetic | 6 uppercase letters | `EXOTL` | OTPs, alerts, order updates |
| **Promotional** | Numeric | 6 digits | `777888` | Marketing, offers, discounts |

:::note
On the recipient's phone, transactional headers appear with an operator prefix (e.g., `JD-EXOTL` for Jio, `AD-EXOTL` for Airtel). The two-letter prefix is added by the operator and is not part of your registration.
:::

## Header Naming Guidelines

### Rules for Transactional Headers

| Rule | Details |
|------|---------|
| Length | Exactly 6 characters |
| Characters | Uppercase English letters only (A-Z) |
| Brand relevance | Must be related to your brand or company name |
| Uniqueness | Must not duplicate an existing registered header |
| No generic terms | Avoid generic words like `INFORM`, `UPDATE`, `ALERTS` |
| No government names | Cannot use government agency names unless authorized |
| No trademarks | Cannot use another company's registered trademark |

### Good Header Examples

| Header | Company | Reasoning |
|--------|---------|-----------|
| `EXOTL` | Exotel | Clear brand abbreviation |
| `HDFCBK` | HDFC Bank | Recognizable brand abbreviation |
| `SWIGGY` | Swiggy | Exact brand name (6 characters) |
| `AMAZIN` | Amazon India | Brand-related identifier |

### Bad Header Examples

| Header | Issue |
|--------|-------|
| `INFORM` | Too generic; not brand-specific |
| `UPDATE` | Too generic; could be any company |
| `GOVTIN` | Impersonates a government entity |
| `EX@TEL` | Contains special character |
| `exotel` | Lowercase not allowed |

## Registration on Jio TrueConnect

### Step 1: Navigate to Header Registration

1. Log in to [https://trueconnect.jio.com](https://trueconnect.jio.com).
2. Go to **Header** or **Sender ID** in the left menu.
3. Click **Add New Header**.

### Step 2: Fill Header Details

| Field | Value |
|-------|-------|
| Header Type | Select **Transactional** or **Promotional** |
| Header Value | Enter your 6-character sender ID (e.g., `EXOTL`) |
| Category | Select the business category that matches your entity |

### Step 3: Submit

1. Review the header details.
2. Click **Submit** for approval.
3. Note the header registration reference number.

### Approval Timeline

Jio typically approves headers within **1-3 business days**. You receive an email notification upon approval.

## Registration on Airtel

### Step 1: Navigate to Header Section

1. Log in to [https://www.airtel.in/business/commercial-communication](https://www.airtel.in/business/commercial-communication).
2. Navigate to **Headers** > **Register New Header**.

### Step 2: Fill Header Details

1. Select the header type (Transactional/Promotional).
2. Enter the header value.
3. Select the associated entity.
4. Provide the category.

### Step 3: Submit

Submit the header for review. Airtel processes header registrations within **1-3 business days**.

## Registration on Vodafone-Idea (ViLPower)

### Step 1: Navigate to Header Section

1. Log in to [https://www.vilpower.in](https://www.vilpower.in).
2. Go to **Header Management** > **Add Header**.

### Step 2: Fill Header Details

1. Choose the header type.
2. Enter the 6-character header value.
3. Select the category.

### Step 3: Submit

Submit for approval. ViLPower typically processes headers within **1-2 business days**.

## Registration on BSNL

### Step 1: Navigate to Header Section

1. Log in to [https://www.ucc-bsnl.co.in](https://www.ucc-bsnl.co.in).
2. Go to **Header** > **Register Header**.

### Step 2: Fill and Submit

1. Fill in the header type and value.
2. Select the category.
3. Submit for review.

BSNL processes headers within **3-5 business days**.

## Registering Multiple Headers

You can register multiple headers for different purposes:

| Header | Type | Purpose |
|--------|------|---------|
| `EXOTL` | Transactional | General notifications, alerts |
| `EXOOTP` | Transactional | OTP and verification messages |
| `EXOMKT` | Transactional | Service-related marketing |
| `777888` | Promotional | Promotional campaigns |

:::tip
Register all headers you anticipate needing upfront. Adding new headers later requires another 1-3 day approval cycle, which can delay campaigns.
:::

## Linking Headers to Templates

After a header is approved, you must link it to your DLT templates:

1. When creating a template on the DLT portal, you select which header(s) the template is associated with.
2. A template can be linked to one or more headers.
3. When sending an SMS, the combination of header + template must be valid.

:::warning
If you send an SMS with a header that is not linked to the template you are using, the message will fail DLT scrubbing with a `FAILED_DLT_TEMPLATE` or `FAILED_DLT_SCRUBBING` error.
:::

## Mapping Headers in Exotel

After DLT approval, configure the header in your Exotel account:

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Navigate to **Settings** > **SMS Settings** > **Sender IDs**.
3. Click **Add Sender ID**.
4. Enter the DLT-approved header value (e.g., `EXOTL`).
5. Enter your DLT Entity ID.
6. Save the configuration.

You can then use this header as the `From` parameter in the [Send SMS API](/docs/sms-api/api-reference/send-sms).

## Header Deactivation and Modification

### Deactivating a Header

To stop using a header:

1. Log in to your DLT portal.
2. Navigate to the Headers section.
3. Select the header and click **Deactivate**.

:::warning
Deactivating a header makes it permanently unusable. You cannot reactivate a deactivated header. If needed in the future, you must register a new header.
:::

### Modifying a Header

DLT portals do not allow editing the header value after registration. To change your sender ID:

1. Register a new header with the desired value.
2. Wait for approval.
3. Update your application and Exotel configuration to use the new header.
4. Deactivate the old header if no longer needed.

## Common Issues

| Issue | Cause | Resolution |
|-------|-------|------------|
| Header rejected | Name conflicts with existing registration | Choose a different header value that is unique |
| Header pending too long | Portal processing delay | Follow up with portal support after 3 business days |
| Header not working across operators | Cross-portal sync delay | Allow 5-7 days for the DLT blockchain to sync |
| `FAILED_INVALID_SENDER` error | Header not mapped in Exotel | Add the header in Exotel Dashboard > SMS Settings |
| Template fails with valid header | Template not linked to this header | Re-register the template with the correct header association |

## Next Steps

- [DLT Template Registration](/docs/sms-support/dlt-template-registration) -- Register message templates
- [DLT Entity Registration](/docs/sms-support/dlt-entity-registration) -- Entity registration guide
- [Sender ID](/docs/sms-support/sender-id) -- Understanding sender IDs
- [SMS API Reference](/docs/sms-api/overview) -- API documentation
