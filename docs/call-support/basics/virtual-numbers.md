---
id: virtual-numbers
title: What is an ExoPhone (Virtual Number)?
description: "Learn what ExoPhones are, the types of virtual numbers available, and how to set up and manage them in your Exotel account."
sidebar_label: Virtual Numbers (ExoPhones)
sidebar_position: 4
---

# What is an ExoPhone (Virtual Number)?

An ExoPhone is a virtual phone number provided by Exotel that serves as your business phone number. Customers dial this number to reach your business, and you use it as the caller ID for outbound calls. ExoPhones are not tied to any physical phone line or SIM card -- they exist entirely in the cloud.

## Why Use ExoPhones?

- **Professional business identity** -- Present a consistent business number to all customers regardless of which agent handles the call.
- **Privacy protection** -- Agents never need to share their personal phone numbers with customers.
- **Centralized routing** -- All calls to the ExoPhone are routed through your configured call flow, ensuring consistent customer experience.
- **Portability** -- Since the number lives in the cloud, your team can handle calls from any location or device.
- **Multiple numbers** -- Use different ExoPhones for different departments, campaigns, or regions.

## Types of ExoPhones

| Type | Description | Best For |
|---|---|---|
| **Landline** | Standard landline numbers (e.g., 080-XXXXXXX) | Professional business identity, local presence |
| **Mobile** | Mobile phone numbers (e.g., 9XXXXXXXXX) | Outbound calls where mobile caller ID improves answer rates |
| **Toll-Free** | Numbers where the called party (your business) pays for the call (e.g., 1800-XXX-XXXX) | Customer support lines, sales hotlines |

## How ExoPhones Work

```
Customer dials ExoPhone (e.g., 080-4712XXXX)
        |
        v
  Exotel receives the call
        |
        v
  Mapped call flow is triggered
        |
        v
  Greeting → IVR → Connect to Agent
```

Each ExoPhone is mapped to a **call flow** (also called an App). When a customer dials the ExoPhone, Exotel triggers the mapped call flow to handle the call.

## Setting Up an ExoPhone

### Step 1: Purchase a Number

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Navigate to **ExoPhones** from the left sidebar.
3. Click **Buy New ExoPhone**.
4. Select the number type (Landline, Mobile, or Toll-Free).
5. Choose your preferred region or circle.
6. Select a number from the available options.
7. Complete the purchase.

![ExoPhone Purchase](/img/call-support/exophone-purchase.png)

:::tip
You can also purchase ExoPhones programmatically using the [ExoPhones API](/docs/exophones/api-reference/purchase-number).
:::

### Step 2: Assign to a Call Flow

1. Go to **ExoPhones** in the dashboard.
2. Click on the ExoPhone you want to configure.
3. Under **Incoming Call Flow**, select the call flow to handle incoming calls.
4. Under **Incoming SMS Flow**, optionally configure SMS handling.
5. Click **Save**.

![ExoPhone Configuration](/img/call-support/exophone-configuration.png)

### Step 3: Test

Dial your ExoPhone from any phone to verify the call flow works as expected.

## Managing ExoPhones

### Via Dashboard

- **View all numbers** -- Go to ExoPhones in the left sidebar to see all your numbers, their types, and assigned flows.
- **Change call flow** -- Click on any ExoPhone to update its incoming call flow or SMS flow assignment.
- **View call logs** -- See all calls received on a specific ExoPhone.

### Via API

Use the [ExoPhones API](/docs/exophones/overview) to programmatically:

- [List available numbers](/docs/exophones/api-reference/available-numbers)
- [Purchase a number](/docs/exophones/api-reference/purchase-number)
- [Assign to a flow](/docs/exophones/api-reference/assign-to-flow)
- [List your numbers](/docs/exophones/api-reference/list-numbers)
- [View number details](/docs/exophones/api-reference/number-details)
- [Release a number](/docs/exophones/api-reference/delete-number)

## ExoPhone Capabilities

Each ExoPhone has specific capabilities depending on its type:

| Capability | Landline | Mobile | Toll-Free |
|---|---|---|---|
| Receive incoming calls | Yes | Yes | Yes |
| Make outbound calls | Yes | Yes | Limited |
| Receive SMS | Yes | Yes | No |
| Send SMS | Yes | Yes | No |
| Use as caller ID | Yes | Yes | Yes |

## Best Practices

- **Use separate ExoPhones for different purposes** -- For example, one for sales and one for support. This helps with call routing and analytics.
- **Choose toll-free for support** -- Customers are more likely to call when they do not have to pay.
- **Use mobile numbers for outbound campaigns** -- Mobile caller IDs generally have higher answer rates than landline numbers.
- **Set up fallback flows** -- Configure what happens when agents are unavailable (voicemail, callback, etc.).

## Next Steps

- [Services Provided by Exotel](/docs/call-support/basics/services)
- [Getting Started with Exotel](/docs/call-support/basics/getting-started)
- [Setting Up a Call Flow](/docs/call-support/call-features/setting-up-call-flow)
