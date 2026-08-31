---
title: ExoPhone Setup
description: "Get your first ExoPhone virtual number on Exotel. Understand DID types, number selection, configuration, and assigning call flows."
sidebar_label: ExoPhone Setup
sidebar_position: 7
---

# ExoPhone Setup

An ExoPhone is a virtual phone number (DID -- Direct Inward Dialing) assigned to your Exotel account. It serves as your business phone identity for making and receiving calls. This guide walks you through selecting, purchasing, and configuring your first ExoPhone.

## What is an ExoPhone?

An ExoPhone is the phone number that:

- **Appears as caller ID** on outbound calls
- **Receives inbound calls** and routes them through your call flow
- **Sends SMS** (when SMS is enabled for the number)
- **Identifies your business** to customers

Every Exotel account needs at least one ExoPhone to make or receive calls.

## ExoPhone Types

Exotel offers different types of virtual numbers depending on your region and use case:

| Type | Format | Example | Best For |
|------|--------|---------|----------|
| **Local DID** | City-specific landline | `080-XXXX-XXXX` (Bangalore) | Regional presence, local trust |
| **Toll-Free** | 1800 prefix | `1800-XXX-XXXX` | Customer support, national reach |
| **Mobile** | Mobile number format | `9XXX-XXX-XXX` | Personal touch, high answer rate |
| **Vanity** | Memorable sequence | `1800-XXX-1234` | Brand recognition, marketing |

### Type Comparison

| Feature | Local DID | Toll-Free | Mobile |
|---------|----------|-----------|--------|
| Caller pays for inbound | Yes | No (free for caller) | Yes |
| National reach | Regional | National | National |
| SMS capability | Limited | No | Yes |
| Answer rate (outbound) | Good | Moderate | Highest |
| Monthly rental | Lowest | Highest | Moderate |

## Selecting Your ExoPhone

### Via Dashboard

1. Log in to [my.exotel.com](https://my.exotel.com)
2. Navigate to **ExoPhones** in the left sidebar
3. Click **Buy New Number**
4. Filter by:
   - **Region**: Select the city or region
   - **Type**: Local, Toll-free, or Mobile
   - **Prefix**: Search for specific number patterns
5. Browse available numbers
6. Click **Purchase** on your preferred number
7. Confirm the purchase (credits will be deducted for the first month's rental)

### Via API

**List available numbers:**

```bash
curl -u '<api_key>:<api_token>' "https://api.exotel.com/v2/accounts/<account_sid>/available-phone-numbers?type=local&region=bangalore"
```

**Purchase a number:**

```bash
curl -u '<api_key>:<api_token>' -X POST "https://api.exotel.com/v2/accounts/<account_sid>/incoming-phone-numbers" \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+918048XXXXXX",
    "friendly_name": "Support Line"
  }'
```

> **API Reference:** See the [ExoPhones API](/docs/exophones/overview) for complete number management endpoints.

:::tip
For outbound campaigns, use a local DID or mobile number as the caller ID. Recipients are more likely to answer calls from recognizable local numbers than toll-free or unfamiliar numbers.
:::

## Configuring Your ExoPhone

After purchase, configure your ExoPhone for inbound and outbound use.

### Assign a Call Flow

Every ExoPhone needs a call flow to handle incoming calls:

1. Go to **ExoPhones** in the dashboard
2. Click the **Configure** icon next to your ExoPhone
3. Under **Incoming Call Flow**, select an existing call flow or create a new one
4. Click **Save**

If you have not created a call flow yet, see [First Call Flow](/docs/getting-started/first-call-flow).

### Via API

```bash
curl -u '<api_key>:<api_token>' -X PUT "https://api.exotel.com/v2/accounts/<account_sid>/incoming-phone-numbers/<exophone_sid>" \
  -H "Content-Type: application/json" \
  -d '{
    "incoming_call_url": "http://my.exotel.com/<account_sid>/exoml/start_voice/<app_id>"
  }'
```

### Configure SMS (if applicable)

For ExoPhones that support SMS:

1. Enable SMS in the ExoPhone configuration
2. Set an incoming SMS webhook URL to receive messages
3. Configure the default Sender ID for outbound SMS

## ExoPhone Billing

| Charge | Frequency | Description |
|--------|-----------|-------------|
| Monthly rental | Monthly (auto-deducted) | Fixed fee for keeping the number active |
| Inbound call charges | Per call | Per-pulse rate for incoming calls |
| Outbound call charges | Per call | Per-pulse rate for outgoing calls |
| SMS charges | Per message | Per-SMS rate (if SMS enabled) |

:::warning
ExoPhone rentals are charged monthly. If your account has insufficient credits on the rental date, the ExoPhone may be released and the number returned to the pool. Set up auto-recharge to prevent losing your numbers.
:::

## Managing Multiple ExoPhones

As your business grows, you may need multiple ExoPhones for different purposes:

| Use Case | ExoPhone Strategy |
|----------|-------------------|
| Support + Sales | Separate ExoPhones for each department |
| Multiple cities | Local DIDs for each city |
| Campaign tracking | Dedicated numbers per marketing campaign |
| IVR + direct calls | One for IVR, one for direct agent routing |

### List All ExoPhones

```bash
curl -u '<api_key>:<api_token>' "https://api.exotel.com/v2/accounts/<account_sid>/incoming-phone-numbers"
```

## ExoPhone Auto-Renewal

ExoPhones are set to auto-renew by default:

| Setting | Behavior |
|---------|----------|
| Auto-renew ON (default) | Rental deducted automatically each month |
| Auto-renew OFF | ExoPhone is released at the end of the billing cycle |

To change auto-renewal settings, go to **ExoPhones > Configure > Renewal Settings** in the dashboard.

## Releasing an ExoPhone

If you no longer need an ExoPhone:

1. Go to **ExoPhones** in the dashboard
2. Click **Configure** on the number you want to release
3. Click **Release Number**
4. Confirm the release

:::warning
Releasing an ExoPhone is permanent. The number is returned to the pool and may be assigned to another customer. If you release a number used in campaigns, API integrations, or published materials, those references will break.
:::

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| No numbers available in my city | Limited inventory | Try nearby cities or different number types |
| ExoPhone not receiving inbound calls | No call flow assigned | Assign a call flow in ExoPhone settings |
| Caller ID not displaying correctly | Operator-specific behavior | Some carriers modify caller ID display; this is not controllable |
| ExoPhone released unexpectedly | Insufficient credits for rental | Set up auto-recharge; contact support to recover the number |
| SMS not working on ExoPhone | SMS not enabled for this number type | Not all ExoPhones support SMS; check number capabilities |

## Next Steps

- [Build your first call flow](/docs/getting-started/first-call-flow) -- Create an IVR for your ExoPhone
- [Get API credentials](/docs/getting-started/api-credentials) -- Set up API access
- [ExoPhones API](/docs/exophones/overview) -- Manage ExoPhones programmatically
