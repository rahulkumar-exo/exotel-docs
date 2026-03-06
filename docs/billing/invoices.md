---
id: invoices
title: Invoices
description: "Access and download Exotel monthly invoices with GST details, understand invoice line items, and manage your billing records."
sidebar_label: Invoices
sidebar_position: 5
---

# Invoices

Exotel generates GST-compliant invoices for all charges on your account. This guide explains how to access, understand, and download your invoices.

## Invoice Types

| Invoice Type | When Generated | Purpose |
|-------------|---------------|---------|
| **Tax Invoice** | Monthly (1st of following month) | Official invoice for all usage and charges in the billing period |
| **Proforma Invoice** | At time of credit purchase | Preliminary invoice for advance payment |
| **Credit Note** | When a refund or adjustment is issued | Documents credit adjustments to your account |
| **Debit Note** | When additional charges apply | Documents additional charges or corrections |

## Monthly Tax Invoice

### What Is Included

Each monthly tax invoice covers all charges incurred during the calendar month:

| Line Item | Description |
|-----------|-------------|
| **Voice Usage** | Total pulse charges for all inbound and outbound calls |
| **SMS Usage** | Total message charges broken down by type (transactional, promotional, OTP) |
| **ExoPhone Rentals** | Monthly rental for each active virtual number |
| **WhatsApp Usage** | Conversation charges by category |
| **Contact Center Licenses** | Per-agent seat charges |
| **Add-on Services** | Any additional features or premium services |
| **Subtotal** | Sum of all charges before tax |
| **GST (18%)** | Goods and Services Tax |
| **Total** | Final amount inclusive of taxes |

### GST Details

All Exotel invoices are compliant with Indian GST regulations:

| Field | Description |
|-------|-------------|
| **Exotel GSTIN** | Exotel's Goods and Services Tax Identification Number |
| **Customer GSTIN** | Your GSTIN (if registered and provided) |
| **SAC Code** | Service Accounting Code for cloud telephony services |
| **Place of Supply** | State where the service is deemed to be supplied |
| **Tax Breakdown** | CGST + SGST (intra-state) or IGST (inter-state) |

:::info
If your business is GST-registered, add your GSTIN in **Account Settings** > **Company Details** to ensure it appears on all invoices. This is required for claiming Input Tax Credit (ITC).
:::

### Tax Rate Applicability

| Scenario | Tax Type | Rate |
|----------|----------|------|
| **Same state** (customer and Exotel in same state) | CGST + SGST | 9% + 9% = 18% |
| **Different state** (inter-state supply) | IGST | 18% |
| **SEZ / Export** | IGST (with LUT) | 0% (subject to documentation) |

## Accessing Invoices

### Via the Dashboard

1. Log in to [my.exotel.com](https://my.exotel.com)
2. Navigate to **Billing** > **Invoices**
3. View the list of all invoices sorted by date (most recent first)
4. Use filters to narrow by:
   - Date range
   - Invoice type (tax invoice, proforma, credit note)
   - Payment status (paid, pending)

### Downloading Invoices

1. In the **Invoices** list, locate the invoice you need
2. Click the **Download** icon next to the invoice
3. Select the format:
   - **PDF** -- Standard invoice format for records and submission
   - **Excel** -- Detailed line-item breakdown for accounting

:::tip
Download all invoices for a financial year in bulk by selecting a date range and clicking **Download All**. This is useful for annual tax filing and audits.
:::

## Invoice Schedule

| Event | Timing |
|-------|--------|
| **Usage period** | 1st to last day of the calendar month |
| **Invoice generation** | Within 5 business days of month end |
| **Invoice email** | Sent to registered billing email addresses |
| **Payment due** | Prepaid model -- already paid via credits |

:::info
Since Exotel uses a prepaid model, monthly invoices are for record-keeping and tax purposes. The charges have already been deducted from your credit balance during the month.
:::

## Managing Billing Contacts

Add multiple email addresses to receive invoice notifications:

1. Navigate to **Account Settings** > **Billing Contacts**
2. Click **Add Contact**
3. Enter the email address and name
4. Select notification preferences:
   - Invoice generated
   - Payment confirmation
   - Low balance alerts
   - Auto-recharge notifications
5. Click **Save**

## Updating Company Details on Invoices

Ensure your invoices display the correct company information:

1. Navigate to **Account Settings** > **Company Details**
2. Update the following fields:

| Field | Description |
|-------|-------------|
| **Company Name** | Legal entity name as per GST registration |
| **GSTIN** | Your 15-digit Goods and Services Tax Identification Number |
| **Billing Address** | Registered business address |
| **State** | State of registration (determines CGST/SGST vs. IGST) |
| **PAN** | Permanent Account Number |

3. Click **Save Changes**

:::warning
Changes to company details apply to future invoices only. Previously generated invoices cannot be modified. If you need a correction on a past invoice, contact Exotel support to issue a credit note and revised invoice.
:::

## Common Invoice Questions

### Why does my invoice show a different amount than my credit purchase?

Your monthly tax invoice reflects actual **usage** during the month, not the credit amount purchased. Credits are like a prepaid balance -- the invoice documents what was consumed.

### Can I get a consolidated invoice for multiple accounts?

Enterprise customers with multiple Exotel accounts can request consolidated invoicing. Contact your account manager to set this up.

### How do I claim Input Tax Credit (ITC)?

Ensure your GSTIN is correctly entered in your account settings. The GST amount shown on Exotel invoices can be claimed as ITC in your GST return filing, subject to applicable GST rules.

## Related Topics

- [Add Credits](/docs/billing/add-credits) -- Payment methods and credit purchase
- [Usage Tracking](/docs/billing/usage-tracking) -- Monitor your real-time usage and spending
- [Enterprise Billing](/docs/billing/enterprise-billing) -- Custom invoicing for enterprise accounts
