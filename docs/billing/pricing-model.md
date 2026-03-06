---
id: pricing-model
title: Pricing Model
description: "Exotel pricing explained: per-pulse voice billing, pulse durations, per-SMS rates, and how charges are calculated for each service."
sidebar_label: Pricing Model
sidebar_position: 1
---

# Pricing Model

Exotel uses a usage-based pricing model where you pay only for what you use. Voice calls are billed per pulse, SMS messages are billed per message, and recurring services are billed monthly.

## Voice Call Pricing

### Pulse-Based Billing

Voice calls are charged in **pulses** -- fixed time intervals that represent the minimum billable unit. The pulse duration depends on your plan and the type of call.

| Call Type | Default Pulse Duration | Billing Trigger |
|-----------|----------------------|-----------------|
| Outbound API calls | 60 seconds | When the callee answers |
| Inbound calls | 60 seconds | When the call is connected |
| Click-to-call | 60 seconds per leg | When each leg connects |
| Campaign calls | 60 seconds | When the callee answers |

:::info How Pulse Billing Works
If your pulse duration is 60 seconds:
- A 30-second call = **1 pulse** charged
- A 60-second call = **1 pulse** charged
- A 61-second call = **2 pulses** charged
- A 120-second call = **2 pulses** charged
- A 121-second call = **3 pulses** charged

The formula: `Pulses = CEIL(call_duration / pulse_duration)`
:::

### What Is Billable

| Scenario | Billable? | Notes |
|----------|-----------|-------|
| Call answered and conversation happens | Yes | Charged from answer to hangup |
| Call rings but not answered | No | No charge for unanswered calls |
| Call goes to voicemail (carrier) | Depends | Charged if carrier answers on behalf |
| Call fails (network error) | No | No charge for failed calls |
| IVR navigation before agent connect | Yes | IVR time is billable |
| Hold time during a call | Yes | Hold duration counts toward billing |
| Call recording | No extra charge | Included in the per-pulse rate |

### Per-Pulse Rate Calculation

Your per-pulse rate depends on:

1. **Plan type** -- Starter, Growth, or Enterprise
2. **Call direction** -- Inbound vs. outbound
3. **Number type** -- Landline, mobile, or toll-free
4. **Destination** -- Domestic or international

**Example calculation:**

```
Call duration: 3 minutes 15 seconds (195 seconds)
Pulse duration: 60 seconds
Pulses charged: CEIL(195 / 60) = 4 pulses
Per-pulse rate: INR 0.50
Total charge: 4 x INR 0.50 = INR 2.00
```

### Two-Leg Call Billing

For click-to-call (connect two numbers) scenarios, both legs are billed independently:

```
Leg A: Your agent answers → Agent talk time billed
Leg B: Customer answers → Customer talk time billed
Total cost = (Leg A pulses x rate) + (Leg B pulses x rate)
```

:::tip
Use the [Voice API Call Details endpoint](/docs/voice-api/api-reference/call-details) to retrieve the exact pulse count and cost for any call. The response includes `Price` and `Legs` fields with per-leg billing details.
:::

## SMS Pricing

### Per-Message Rates

SMS messages are billed per message submitted, with rates varying by type and route:

| SMS Type | Rate Range (INR) | DND Delivery | Time Restriction |
|----------|-----------------|--------------|------------------|
| **Transactional** | 0.15 -- 0.25 | Delivered | None (24/7) |
| **Promotional** | 0.12 -- 0.20 | Blocked | 9 AM -- 9 PM only |
| **OTP / Service Implicit** | 0.12 -- 0.20 | Delivered | None (24/7) |

:::warning
Rates shown above are indicative. Actual rates depend on your plan and any volume commitments. Contact your account manager or check the dashboard for your exact rates.
:::

### Long SMS and Concatenation

Standard SMS supports 160 characters (GSM-7 encoding) or 70 characters (Unicode/UCS-2). Messages exceeding these limits are split into multiple segments:

| Encoding | Single SMS Limit | Concatenated Part Size | Example |
|----------|-----------------|----------------------|---------|
| **GSM-7** (English, basic Latin) | 160 characters | 153 characters per part | 320 chars = 3 parts |
| **UCS-2** (Unicode, Hindi, etc.) | 70 characters | 67 characters per part | 150 chars = 3 parts |

Each concatenated part is billed as a separate SMS.

### SMS Billing Events

| Event | Charged? | Notes |
|-------|----------|-------|
| Message submitted to carrier | Yes | Charged at submission |
| Message delivered to handset | No extra charge | Delivery confirmation is free |
| Message failed at carrier | Yes | Charge applies even if delivery fails |
| Message blocked by DND | Yes | Promotional SMS blocked by DND is still charged |
| Message rejected by DLT | No | Template/entity validation failures are not charged |

## ExoPhone Rental Pricing

| Number Type | Monthly Rental (Indicative) | Setup Fee |
|-------------|---------------------------|-----------|
| **Landline** | INR 500 -- 1,000 | Varies |
| **Mobile** | INR 500 -- 1,000 | Varies |
| **Toll-Free** | INR 1,500 -- 3,000 | Varies |
| **Vanity Number** | Premium pricing | Varies |

:::info
ExoPhone rentals are charged on the activation anniversary date each month. If a number is purchased on the 15th, rental renews on the 15th of each subsequent month.
:::

## WhatsApp Pricing

WhatsApp messages follow Meta's conversation-based pricing model. A conversation is a 24-hour window triggered by either a business-initiated or user-initiated message.

| Conversation Type | Description | Rate (Indicative) |
|-------------------|-------------|-------------------|
| **Utility** | Transaction updates, account alerts | INR 0.30 -- 0.50 |
| **Authentication** | OTPs and verification codes | INR 0.30 -- 0.50 |
| **Marketing** | Promotional messages, offers | INR 0.70 -- 1.00 |
| **Service** | User-initiated conversations | Free (first 1,000/month) |

See the [WhatsApp API documentation](/docs/whatsapp-api/overview) for detailed pricing and conversation rules.

## Understanding Your Bill

Your monthly invoice includes the following line items:

1. **Voice usage** -- Total pulses consumed, broken down by call type
2. **SMS usage** -- Total messages sent, broken down by SMS type
3. **ExoPhone rentals** -- Monthly rental for each active virtual number
4. **WhatsApp conversations** -- Conversation charges by category
5. **Contact Center seats** -- Per-agent monthly license fees
6. **Add-on services** -- Any additional features or premium services
7. **Taxes** -- GST at 18% on the total amount

See [Invoices](/docs/billing/invoices) for details on accessing and downloading your monthly bills.
