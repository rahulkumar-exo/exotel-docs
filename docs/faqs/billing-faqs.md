---
title: Billing FAQs
description: "Frequently asked questions about Exotel billing cycles, invoices, credits, refunds, GST, and payment methods for Indian businesses."
sidebar_label: Billing & Payments
sidebar_position: 8
---

# Billing FAQs

Common questions about Exotel billing, credits, invoices, GST, refunds, and payment management.

---

## How does Exotel billing work?

Exotel uses a **prepaid credit-based** billing model. You purchase credits in advance, and usage is deducted from your credit balance in real time. When your balance runs low, you can manually add credits or configure auto-recharge.

Key billing concepts:

| Concept | Description |
|---------|-------------|
| **Credits** | Prepaid balance used for all Exotel services |
| **Pulse** | Billing unit for voice calls (typically 60 seconds in India) |
| **SMS unit** | One SMS unit = one standard-length message (160 chars GSM / 70 chars Unicode) |
| **Monthly rental** | Fixed charges for ExoPhones, plan fees, and add-ons |

---

## What is a pulse and how are calls billed?

A pulse is the minimum billing increment for voice calls. In India, the standard pulse duration is **60 seconds**.

| Call Duration | Pulses Billed | Explanation |
|--------------|--------------|-------------|
| 0--60 seconds | 1 | First pulse starts at call connection |
| 61--120 seconds | 2 | Second pulse begins at 61 seconds |
| 121--180 seconds | 3 | Third pulse begins at 121 seconds |

:::info
Pulse rates vary by plan, ExoPhone type (local, toll-free, mobile), and call direction (inbound vs. outbound). Check your plan details in **Dashboard > Settings > Billing** for your specific rates.
:::

---

## How do I check my current credit balance?

You can check your credit balance in two ways:

1. **Dashboard**: Log in to [my.exotel.com](https://my.exotel.com). Your credit balance is displayed on the home screen and in **Settings > Billing**.
2. **API**: Use the Account Details API to retrieve your current balance programmatically.

---

## How do I add credits to my account?

1. Navigate to **Settings > Billing > Add Credits** in the dashboard
2. Enter the amount you want to add (minimum amount depends on your plan)
3. Select a payment method:
   - Credit card
   - Debit card
   - Net banking
   - UPI
   - Wire transfer (for enterprise accounts)
4. Complete the payment
5. Credits are added immediately after payment confirmation

---

## Does Exotel support auto-recharge?

Yes. Auto-recharge automatically adds credits when your balance drops below a threshold:

1. Go to **Settings > Billing > Auto-Recharge**
2. Enable auto-recharge
3. Set the **threshold amount** (e.g., INR 500)
4. Set the **recharge amount** (e.g., INR 5,000)
5. Confirm your payment method

When your balance falls below the threshold, Exotel automatically charges your payment method for the recharge amount.

:::tip
Configure auto-recharge to avoid campaign interruptions. If your credit balance reaches zero during an active campaign, the campaign will pause until credits are added.
:::

---

## What is the billing cycle?

Exotel generates invoices on a **monthly billing cycle**:

| Item | Billing Date | Details |
|------|-------------|---------|
| Usage credits | Real-time deduction | Deducted per call/SMS as consumed |
| Monthly rental (ExoPhones) | 1st of each month | Charged for all active ExoPhones |
| Plan subscription | Anniversary date | Charged on your plan renewal date |
| Add-on features | 1st of each month | Charged monthly for enabled features |

---

## How do I download invoices?

1. Log in to [my.exotel.com](https://my.exotel.com)
2. Navigate to **Settings > Billing > Invoices**
3. Select the billing period (month and year)
4. Click **Download** to get the invoice as a PDF

Invoices include:
- Credit purchase summary
- Usage breakdown (voice, SMS, WhatsApp)
- Monthly rental charges
- GST details
- Payment receipt information

---

## Is GST included in Exotel pricing?

Yes. Exotel charges **18% GST** (Goods and Services Tax) on all services as mandated by Indian tax regulations.

| Component | GST Treatment |
|-----------|--------------|
| Credit purchases | 18% GST added to the purchase amount |
| Monthly rentals | 18% GST included in the invoice |
| Plan subscriptions | 18% GST applied |
| One-time setup fees | 18% GST applied |

**Example:** If you purchase INR 10,000 in credits, the total charge is INR 11,800 (INR 10,000 + INR 1,800 GST).

:::info
Exotel's GST registration number (GSTIN) is included on all invoices. If your business is GST-registered, you can claim input tax credit on Exotel invoices. Ensure your GST details are updated in **Settings > Company Details**.
:::

---

## Can I get a GST-compliant invoice?

Yes. All Exotel invoices are GST-compliant and include:

- Exotel's GSTIN
- Your company GSTIN (if provided)
- SAC code for telecom services
- Taxable amount and GST breakup (CGST + SGST or IGST)
- Invoice number and date

To ensure correct GST invoicing, update your GSTIN in **Settings > Company Details > Tax Information**.

---

## What happens when my credits run out?

| Service | Behavior |
|---------|----------|
| Outbound calls | New calls are blocked; in-progress calls continue |
| Outbound SMS | New messages are blocked |
| Active campaigns | Campaigns are paused automatically |
| Inbound calls | Depend on your plan; may continue on some plans |
| ExoPhone rental | ExoPhones remain active until the next billing cycle |

:::warning
If your account has zero credits for an extended period, your ExoPhones may be released and your account may be suspended. Set up auto-recharge to prevent service interruptions.
:::

---

## How do refunds work?

Refund policies vary by the type of charge:

| Charge Type | Refund Eligible? | Process |
|-------------|-----------------|---------|
| Unused credits | Yes (within refund policy terms) | Contact support |
| Monthly rental (ExoPhone) | No (charged at start of cycle) | Not refundable for partial months |
| Plan downgrade | Prorated credit | Applied to account as credits |
| Failed calls/SMS | Depends on failure type | Automatic for platform-side failures |
| Setup fees | No | Non-refundable |

To request a refund:
1. Email **hello@exotel.com** with your Account SID and details
2. Exotel support will review your request within 3-5 business days
3. Approved refunds are typically processed to your original payment method or as account credits

---

## Can I get a custom billing arrangement?

Enterprise customers can negotiate custom billing terms including:

- Post-paid billing (monthly invoicing based on usage)
- Volume-based discounts
- Custom pulse rates
- Dedicated account management
- Custom payment terms (NET 30, NET 60)

Contact your account manager or **hello@exotel.com** to discuss enterprise billing options.

---

## How are multi-part SMS billed?

Long SMS messages are split into multiple parts, each billed separately:

| Encoding | Single SMS | Multi-part SMS |
|----------|-----------|----------------|
| GSM (Latin) | Up to 160 chars = 1 unit | 153 chars per part |
| Unicode (regional) | Up to 70 chars = 1 unit | 67 chars per part |

**Example:** A 320-character GSM message is split into 3 parts (ceil(320/153) = 3) and billed as 3 SMS units.

---

## How are WhatsApp messages billed?

WhatsApp Business API messages follow Meta's conversation-based pricing:

| Conversation Type | Billing |
|------------------|---------|
| Business-initiated | Charged per conversation (24-hour window) |
| User-initiated | Charged per conversation (24-hour window) |
| Free-tier | 1,000 free user-initiated conversations per month |

Rates vary by country. See your plan details for specific WhatsApp pricing.

---

## Related Resources

- [Pricing & Plans](/docs/faqs/pricing-plans) -- Compare Exotel plans and features
- [Account Setup](/docs/faqs/account-setup) -- Account creation and payment setup
- [Upgrade Account](/docs/getting-started/upgrade-account) -- Move from trial to paid plan
