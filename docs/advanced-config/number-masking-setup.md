---
id: number-masking-setup
title: Number Masking Setup
description: "Configure Exotel number masking to protect privacy in two-party calls by hiding real phone numbers of customers and agents."
sidebar_label: Number Masking
sidebar_position: 5
---

# Number Masking Setup

Number masking (also called number privacy or number anonymization) hides the real phone numbers of both parties during a call. Instead of seeing each other's actual numbers, both the customer and agent see a virtual number (ExoPhone). This protects privacy and prevents unauthorized direct contact.

:::tip
Number masking is available on Growth and Enterprise plans. It is commonly used by marketplaces, ride-sharing apps, delivery platforms, and healthcare services.
:::

## How Number Masking Works

```
Customer (real: +919876543210)        Agent (real: +919876543211)
         │                                       │
         │ Sees: +914412345678                   │ Sees: +914412345678
         │ (ExoPhone)                            │ (ExoPhone)
         │                                       │
         └───────── Exotel (bridges call) ───────┘
                    via ExoPhone
```

1. Customer calls the ExoPhone (virtual number)
2. Exotel identifies the customer-agent mapping
3. Exotel connects the call to the assigned agent
4. Both parties see the ExoPhone number, not each other's real number
5. After the engagement ends, the mapping can be deactivated

## Use Cases

| Industry | Scenario | Privacy Need |
|----------|----------|-------------|
| **E-commerce / Delivery** | Delivery person calls customer | Prevent post-delivery harassment |
| **Ride-sharing** | Driver calls passenger | Protect both parties' numbers |
| **Healthcare** | Doctor calls patient | Maintain patient privacy |
| **Real estate** | Agent calls property owner | Prevent direct dealing without platform |
| **Recruitment** | Recruiter calls candidate | Protect candidate contact info |
| **Service marketplace** | Plumber calls homeowner | Prevent platform bypass |

## Setup Methods

### Method 1: Lead Assist API (Recommended)

The [Lead Assist API](/docs/lead-assist/overview) provides a managed number masking solution:

1. **Create an allocation** -- Map a customer number to an agent number via an ExoPhone
2. **Calls are masked** -- When either party calls the ExoPhone, they are connected with masked numbers
3. **Deactivate when done** -- Remove the allocation when the engagement is complete

#### Creating a Number Mask Allocation

```bash
curl -X POST \
  https://api.exotel.com/v1/Accounts/{account_sid}/CustomerNumbers/allocate \
  -u {api_key}:{api_token} \
  -d "VirtualNumber=+914412345678" \
  -d "CustomerNumber=+919876543210" \
  -d "AgentNumber=+919876543211"
```

#### Allocation Lifecycle

| Step | Action | API |
|------|--------|-----|
| 1. Create | Map customer to agent via ExoPhone | [Create Allocation](/docs/lead-assist/api-reference/create-allocation) |
| 2. Active | Both parties can call each other via the ExoPhone | Automatic |
| 3. Update | Change the agent number if reassigned | [Update Allocation](/docs/lead-assist/api-reference/update-allocation) |
| 4. Deactivate | Remove the mapping when the engagement ends | [Delete Allocation](/docs/lead-assist/api-reference/delete-allocation) |

### Method 2: Click-to-Call with Masked CallerID

Use the Voice API to initiate calls where both parties see the ExoPhone:

```bash
curl -X POST \
  https://api.exotel.com/v1/Accounts/{account_sid}/Calls/connect.json \
  -u {api_key}:{api_token} \
  -d "From=+919876543210" \
  -d "To=+919876543211" \
  -d "CallerId=+914412345678"
```

Both the customer and agent see `+914412345678` (the ExoPhone) as the caller ID.

## Configuration Options

### Allocation Settings

| Setting | Description | Default |
|---------|-------------|---------|
| **Virtual Number** | The ExoPhone used for masking | Required |
| **Customer Number** | Customer's real phone number | Required |
| **Agent Number** | Agent's real phone number | Required |
| **Expiry** | When the allocation automatically deactivates | No expiry (manual deactivation) |
| **Call Recording** | Whether masked calls are recorded | Inherit from ExoPhone settings |

### ExoPhone Pool Management

For high-volume number masking, maintain a pool of ExoPhones:

| Strategy | Description | Best For |
|----------|-------------|----------|
| **Dedicated per pair** | One ExoPhone per customer-agent pair | Low volume, long engagements |
| **Shared pool** | Rotate ExoPhones across multiple pairs | High volume, short engagements |
| **Regional** | Use ExoPhones from the customer's region | Regional businesses, local presence |

:::warning
Each ExoPhone can only have one active allocation at a time. If you need to mask calls for 1,000 concurrent customer-agent pairs, you need at least 1,000 ExoPhones in your pool. Plan your ExoPhone inventory accordingly.
:::

### Allocation Expiry

Set automatic expiry to ensure privacy allocations do not remain active indefinitely:

| Engagement Type | Recommended Expiry |
|----------------|-------------------|
| **Food delivery** | 2 hours after order placement |
| **Ride-sharing** | 1 hour after trip completion |
| **Service appointment** | 24 hours after appointment |
| **Property viewing** | 7 days after lead creation |

## Call Flow with Number Masking

### Inbound Masked Call

```
Customer dials ExoPhone (+914412345678)
   │
   ▼
Exotel looks up allocation
   │
   ├── Allocation found ──► Connect to agent (+919876543211)
   │                         Agent sees: +914412345678 (masked)
   │
   └── No allocation found ──► Play message ("This number is not active") ──► Hangup
```

### Outbound Masked Call (API-Initiated)

```
Your application triggers a call via API
   │
   ▼
Exotel calls Customer (+919876543210)
   Customer sees: +914412345678 (ExoPhone)
   │
   ▼ (Customer answers)
   │
Exotel calls Agent (+919876543211)
   Agent sees: +914412345678 (ExoPhone)
   │
   ▼ (Agent answers)
   │
Both parties connected (masked)
```

## Monitoring Masked Calls

### Call Logs

Masked calls appear in your call logs with the actual phone numbers (not masked). This allows you to:

- Track which customer-agent pairs communicated
- Review call duration and status
- Access call recordings (if enabled)

### Reporting

Use [CDR Reports](/docs/reporting/cdr-reports) to analyze number masking usage:

- Total masked calls per period
- Average call duration for masked calls
- Allocation utilization (active allocations vs. ExoPhone pool size)

## Best Practices

1. **Set allocation expiry** -- Do not leave allocations active indefinitely; set expiry based on your engagement lifecycle
2. **Monitor ExoPhone pool** -- Track pool utilization and add ExoPhones before you run out
3. **Handle "no allocation" calls** -- Configure a greeting for calls to ExoPhones without an active allocation
4. **Deactivate promptly** -- Remove allocations as soon as the engagement is complete
5. **Use regional numbers** -- Customers are more likely to answer calls from local numbers
6. **Enable call recording** -- Record masked calls for quality and dispute resolution (with consent)
7. **Audit allocations regularly** -- Clean up stale allocations that were not properly deactivated

## Troubleshooting

| Issue | Possible Cause | Resolution |
|-------|---------------|------------|
| Call not connecting | No active allocation for the ExoPhone | Verify allocation exists via the API |
| Wrong agent connected | Allocation mapped to incorrect agent | Update the allocation with the correct agent number |
| Customer sees real number | CallerID not set to ExoPhone in API call | Ensure `CallerId` parameter is set to the ExoPhone |
| ExoPhone busy | ExoPhone already in use for another call | Use a larger ExoPhone pool or shared pool strategy |
| Allocation not deactivating | Expiry not set; manual deactivation missed | Implement automated cleanup using the API |

## Related Topics

- [Lead Assist API](/docs/lead-assist/overview) -- Managed number masking API
- [Voice API](/docs/voice-api/getting-started/overview) -- Making masked API calls
- [ExoPhones](/docs/exophones/overview) -- Managing virtual numbers
