---
id: number-types
title: Number Types & Virtual Numbers FAQs
description: "FAQs about Exotel virtual numbers, toll-free numbers, DID numbers, mobile numbers, and ExoPhones in India."
sidebar_label: Number Types
sidebar_position: 4
---

# Number Types & Virtual Numbers FAQs

Common questions about the different types of phone numbers available on Exotel, how they work, and how to choose the right number for your use case.

---

## What types of phone numbers does Exotel offer?

Exotel offers several types of virtual phone numbers (called ExoPhones) for Indian businesses:

| Number Type | Format | Best For |
|---|---|---|
| **Landline DID** | 080-XXXXXXX (city-specific STD code) | Local presence, inbound IVR, professional image |
| **Mobile Virtual Number** | 9XX-XXXXXXX | Two-way communication, Lead Assist, number masking |
| **Toll-Free** | 1800-XXX-XXXX | Customer support, inbound-heavy use cases |
| **Vanity Numbers** | Custom patterns (e.g., 1800-XXX-1234) | Brand recall and marketing campaigns |

:::info
All Exotel numbers are virtual numbers. They are not tied to a physical SIM card or phone line. Calls and SMS are routed through Exotel's cloud platform and managed via APIs or the dashboard.
:::

---

## What is an ExoPhone?

An ExoPhone is Exotel's term for a virtual phone number provisioned on the platform. Each ExoPhone can be configured with:

- **Incoming call flows** -- IVR menus, greeting messages, call routing rules
- **Outbound caller ID** -- Used as the displayed number for outbound calls
- **SMS sender** -- Used for sending transactional or promotional SMS

You can manage ExoPhones through the [ExoPhones API](/docs/exophones/overview) or the Exotel Dashboard.

---

## What is the difference between a DID number and a virtual mobile number?

| Feature | Landline DID | Virtual Mobile Number |
|---|---|---|
| **Format** | City STD code + number | 10-digit mobile format |
| **Inbound calls** | Yes | Yes |
| **Outbound calls** | Yes (caller ID) | Yes (caller ID) |
| **SMS sending** | Limited (sender ID based) | Yes (two-way SMS) |
| **Number masking** | Not typically used | Commonly used for Lead Assist |
| **Caller perception** | Business/office number | Personal/mobile number |
| **Monthly rental** | Lower | Higher |

:::tip
Use landline DID numbers for IVR and customer support lines. Use virtual mobile numbers when you need two-way SMS or number masking (such as connecting customers to delivery drivers without revealing personal numbers).
:::

---

## How do toll-free numbers work?

Toll-free numbers (1800 series) allow callers to reach your business without incurring call charges. The receiving business pays for all inbound call minutes. Key characteristics:

- **Caller pays nothing** -- Encourages customers to call
- **Nationwide reach** -- Works across all Indian telecom circles
- **Higher per-minute cost** -- The business pays a premium per-minute rate for inbound calls
- **No outbound calling** -- Toll-free numbers cannot be used to make outbound calls

:::caution
Toll-free numbers have higher per-minute inbound charges compared to DID numbers. Evaluate your expected inbound call volume before selecting a toll-free number.
:::

---

## How many virtual numbers can I have on my account?

There is no hard limit on the number of ExoPhones per account. However:

- Each number incurs a **monthly rental fee**
- Number availability depends on your region and the telecom circle
- Bulk number provisioning (50+ numbers) requires coordination with your account manager
- Lead Assist use cases may require a pool of virtual mobile numbers

---

## Can I port my existing number to Exotel?

Number porting is available for certain number types, subject to telecom operator policies and regulatory approvals. The process typically takes **7-15 business days**. Contact your Exotel account manager to initiate a porting request.

:::info
Not all number types are eligible for porting. Toll-free numbers and certain mobile number series may have restrictions. Exotel support can confirm eligibility for your specific number.
:::

---

## Can I choose a specific number or area code?

Yes, subject to availability. When purchasing a new ExoPhone:

- **Area code selection** -- You can request numbers with a specific city STD code (e.g., 080 for Bangalore, 011 for Delhi)
- **Vanity numbers** -- Custom number patterns are available at a premium
- **Number search** -- The dashboard lets you browse available numbers before purchase

Availability varies by telecom circle and number type. Popular area codes may have limited inventory.

---

## What happens to my number if I cancel my account?

When you cancel your Exotel account or stop paying the monthly rental for a number:

1. The number enters a **grace period** (typically 30 days) during which it can be reactivated
2. After the grace period, the number is **released back to the pool** and may be reassigned
3. Any incoming calls to the released number will no longer reach your account

:::warning
If you stop using a number, update your marketing materials and customer communications to avoid losing inbound calls. Released numbers cannot be guaranteed for re-provisioning.
:::

---

## Can I use Exotel numbers for international calling?

Exotel numbers are primarily Indian numbers and are designed for domestic use. For international calling:

- **Outbound international calls** -- Available on select plans. Pricing varies by destination country. See [International Calling Regulations](/docs/faqs/international-calling).
- **Inbound international calls** -- Indian DID and toll-free numbers can receive calls from international callers, but the caller pays international rates.

---

## How do I configure a number for IVR?

To set up an IVR (Interactive Voice Response) on an ExoPhone:

1. Navigate to **ExoPhones** in the Exotel Dashboard
2. Select the number you want to configure
3. Click **Edit** and choose **Connect to Flow**
4. Build your call flow using applets (Greeting, IVR Menu, Connect, etc.)

For programmatic IVR setup, use the [Connect to Flow API](/docs/voice-v1/api-reference/connect-to-flow) and configure [Applets](/docs/voice-v1/overview#applets-call-flow-building-blocks).

---

## Related Resources

- [ExoPhones API](/docs/exophones/overview) -- Manage virtual numbers programmatically
- [Voice v1 Overview](/docs/voice-v1/overview) -- Voice API and call flow applets
- [Lead Assist](/docs/lead-assist/overview) -- Number masking and virtual number allocation
- [International Calling](/docs/faqs/international-calling) -- International calling regulations
