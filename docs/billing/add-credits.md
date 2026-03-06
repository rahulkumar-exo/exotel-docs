---
id: add-credits
title: Add Credits
description: "Add credits to your Exotel account using credit cards, net banking, UPI, or bank transfer. Set up auto-recharge and invoicing."
sidebar_label: Add Credits
sidebar_position: 3
---

# Add Credits

Exotel uses a prepaid credit system. You must maintain a positive account balance to make calls, send SMS, and use other services. This guide covers all the ways to add credits to your account.

## Payment Methods

| Method | Processing Time | Minimum Amount | Auto-Recharge |
|--------|----------------|----------------|---------------|
| **Credit/Debit Card** | Instant | INR 1,000 | Yes |
| **Net Banking** | Instant | INR 1,000 | No |
| **UPI** | Instant | INR 1,000 | No |
| **Bank Transfer (NEFT/RTGS)** | 1 -- 2 business days | INR 5,000 | No |
| **Cheque** | 3 -- 5 business days | INR 10,000 | No |

:::tip
Credit/debit card payments are recommended for the fastest credit addition and auto-recharge support.
:::

## Adding Credits via Dashboard

### Step-by-Step Process

1. Log in to [my.exotel.com](https://my.exotel.com)
2. Navigate to **Billing** > **Add Credits** in the left sidebar
3. Enter the amount you want to add (minimum INR 1,000)
4. Select your preferred payment method
5. Complete the payment through the payment gateway
6. Credits are added to your account immediately upon successful payment

### Adding Credits via Bank Transfer

For bank transfers, use the following details (available on your dashboard):

1. Navigate to **Billing** > **Add Credits** > **Bank Transfer**
2. Copy the bank account details displayed
3. Initiate a NEFT/RTGS transfer from your bank
4. Include your **Exotel Account SID** in the transfer remarks
5. Credits will be added within 1 -- 2 business days after the transfer clears

:::warning
Always include your Account SID in the bank transfer remarks. Without it, the payment cannot be mapped to your account and will require manual reconciliation, causing delays.
:::

## Auto-Recharge

Auto-recharge automatically tops up your account when the balance falls below a configured threshold. This prevents service disruption due to depleted credits.

### Setting Up Auto-Recharge

1. Navigate to **Billing** > **Auto-Recharge**
2. Toggle **Enable Auto-Recharge** to ON
3. Configure the following:

| Setting | Description | Recommended Value |
|---------|-------------|-------------------|
| **Threshold Amount** | Balance level that triggers auto-recharge | 20% of your monthly usage |
| **Recharge Amount** | Amount to add when triggered | 50% -- 100% of monthly usage |
| **Payment Method** | Card to charge for auto-recharge | Saved credit/debit card |
| **Maximum Recharges per Month** | Cap on auto-recharge frequency | 3 -- 5 times |

4. Save a credit or debit card for auto-recharge
5. Click **Save Settings**

:::info
Auto-recharge only works with saved credit/debit cards. Net banking and UPI cannot be used for automatic recharges.
:::

### Auto-Recharge Notifications

When an auto-recharge is triggered, you receive:

- **Email notification** to the account owner and billing contacts
- **Dashboard alert** confirming the recharge amount and new balance
- **SMS notification** (if configured) to the registered mobile number

### Troubleshooting Auto-Recharge Failures

| Issue | Cause | Resolution |
|-------|-------|------------|
| Card declined | Insufficient funds or card expired | Update the saved card in Billing settings |
| Recharge not triggered | Threshold set too low | Increase the threshold amount |
| Multiple recharges | High-volume usage depletes credits quickly | Increase the recharge amount |
| No notification received | Email not configured | Add billing contacts under Account Settings |

## Promotional Credits and Offers

Exotel occasionally offers promotional credits for new accounts or specific campaigns:

- **Sign-up credits** -- New accounts may receive bonus credits for trial usage
- **Referral credits** -- Earn credits by referring other businesses to Exotel
- **Seasonal offers** -- Special pricing during promotional periods

:::info
Promotional credits have an expiration date and cannot be withdrawn. They are consumed before paid credits.
:::

## Credit Validity

| Credit Type | Validity | Refundable |
|-------------|----------|------------|
| **Paid credits** | No expiration | Yes (subject to [refund policy](/docs/billing/refund-policy)) |
| **Promotional credits** | Typically 30 -- 90 days | No |
| **Sign-up credits** | 30 days | No |

## Bulk Credit Purchase

For large credit purchases (INR 1,00,000+), contact your account manager for:

- **Volume discounts** on the credit purchase amount
- **Dedicated invoice** for the purchase
- **Extended payment terms** (for enterprise accounts)
- **Custom payment schedules** aligned with your budgeting cycle

## Invoicing for Credit Purchases

Every credit purchase generates an invoice:

1. **Proforma invoice** -- Generated immediately at the time of purchase
2. **Tax invoice** -- Generated within 24 hours with GST details
3. Download invoices from **Billing** > **Invoices** (see [Invoices](/docs/billing/invoices))

All invoices include:
- Company name and GSTIN
- Exotel GSTIN and billing address
- HSN/SAC codes for cloud telephony services
- 18% GST breakdown (CGST + SGST or IGST)
