---
id: number-masking
title: Number Masking
description: "Protect caller privacy with Exotel's number masking to connect two parties without revealing personal phone numbers."
sidebar_label: Number Masking
sidebar_position: 1
---

# Number Masking

Number masking connects two parties (e.g., a customer and a delivery agent, a buyer and a seller) through a virtual number without revealing either party's personal phone number. Both parties see the ExoPhone as the caller ID, ensuring complete privacy.

## How Number Masking Works

```
Party A (Customer: +91-98765XXXXX)
        |
        calls ExoPhone (+91-80-4712XXXX)
        |
        v
Exotel looks up the masking pair
        |
        v
Exotel connects to Party B (Driver: +91-98761XXXXX)
        |
        v
Party B sees ExoPhone as caller ID (not Customer's number)
Party A sees ExoPhone as caller ID (not Driver's number)
```

Neither party sees the other's personal phone number. Both see the ExoPhone.

## Common Use Cases

| Industry | Use Case | Party A | Party B |
|---|---|---|---|
| **Ride-hailing** | Rider calls driver | Rider | Driver |
| **Food delivery** | Customer calls delivery partner | Customer | Delivery partner |
| **E-commerce** | Buyer contacts seller | Buyer | Seller |
| **Real estate** | Prospect contacts broker | Prospect | Broker |
| **Healthcare** | Patient calls doctor | Patient | Doctor |
| **Logistics** | Recipient calls courier | Recipient | Courier |
| **Dating apps** | User calls match | User A | User B |

## Setting Up Number Masking

### Step 1: Get a Masking ExoPhone

Purchase a dedicated ExoPhone for number masking. This number will be displayed to both parties as the caller ID.

:::tip
For high-volume masking, you may need multiple ExoPhones. Each ExoPhone can handle a limited number of concurrent calls. Contact your Exotel account manager for capacity planning.
:::

### Step 2: Create Masking Pairs via API

Use the Exotel API to register number pairs. When Party A calls the ExoPhone, Exotel looks up the mapping and connects to Party B.

```bash
# Register a masking pair
curl -u '<api_key>:<api_token>' -X POST 'https://api.exotel.com/v1/Accounts/<account_sid>/NumberMasking' \
  -d 'VirtualNumber=<exophone>' \
  -d 'NumberA=<customer_number>' \
  -d 'NumberB=<driver_number>' \
  -d 'ExpiresIn=3600'
```

**Parameters:**

| Parameter | Required | Description |
|---|---|---|
| `VirtualNumber` | Yes | The ExoPhone used for masking |
| `NumberA` | Yes | First party's phone number |
| `NumberB` | Yes | Second party's phone number |
| `ExpiresIn` | No | Time in seconds before the pair expires (e.g., 3600 = 1 hour) |
| `CallbackUrl` | No | URL to receive call status updates |

### Step 3: Share the ExoPhone with Both Parties

Instead of sharing personal numbers, share the ExoPhone:

- **To Party A**: "Call +91-80-4712XXXX to reach your driver."
- **To Party B**: "If the customer calls, it will come from +91-80-4712XXXX."

### Step 4: Handle the Call

When Party A dials the ExoPhone:

1. Exotel identifies Party A by their phone number.
2. Exotel looks up the masking pair to find Party B.
3. Exotel connects Party A to Party B.
4. Both parties see the ExoPhone as the caller ID.

When Party B dials the ExoPhone:

1. Exotel identifies Party B and looks up the pair.
2. Exotel connects Party B to Party A.
3. Bidirectional masking works in both directions.

## Lead Assist (Exotel Feature)

Lead Assist is Exotel's productized number masking solution designed specifically for lead generation and sales scenarios.

### How Lead Assist Works

1. A prospect submits their phone number on your website.
2. Your application calls the Exotel API to initiate a masked call.
3. Exotel calls your sales agent first, then the prospect.
4. The prospect sees the ExoPhone as the caller ID.
5. After the call, both numbers are masked and not visible to each other.

### Setting Up Lead Assist

```bash
# Initiate a Lead Assist call
curl -u '<api_key>:<api_token>' -X POST 'https://api.exotel.com/v1/Accounts/<account_sid>/Calls/connect.json' \
  -d 'From=<agent_number>' \
  -d 'To=<prospect_number>' \
  -d 'CallerId=<exophone>'
```

This uses the standard Connect Two Numbers API but with the ExoPhone as the caller ID, effectively masking both numbers.

## Masking Pair Management

### Listing Active Pairs

```bash
curl -u '<api_key>:<api_token>' 'https://api.exotel.com/v1/Accounts/<account_sid>/NumberMasking?VirtualNumber=<exophone>'
```

### Deleting a Pair

```bash
curl -u '<api_key>:<api_token>' -X DELETE 'https://api.exotel.com/v1/Accounts/<account_sid>/NumberMasking/<pair_id>'
```

### Auto-Expiry

Set `ExpiresIn` when creating pairs to auto-delete them after a time period. This is essential for temporary interactions:

| Scenario | Recommended Expiry |
|---|---|
| **Ride-hailing trip** | 30 minutes after trip completion |
| **Food delivery** | 1 hour after delivery confirmation |
| **Real estate viewing** | 24 hours after scheduled viewing |
| **E-commerce order** | 48 hours after delivery |

:::warning
Always set an expiry for masking pairs. Orphaned pairs consume ExoPhone capacity and may allow unintended calls between parties long after the interaction is complete.
:::

## Number Pool Management

For high-volume masking, you need a pool of ExoPhones:

| Volume | Recommended Pool Size |
|---|---|
| Up to 50 concurrent masked calls | 5-10 ExoPhones |
| 50-200 concurrent masked calls | 10-25 ExoPhones |
| 200-1000 concurrent masked calls | 25-100 ExoPhones |
| 1000+ concurrent masked calls | Contact Exotel for enterprise setup |

### Pool Allocation Logic

When creating a masking pair, select an ExoPhone from the pool that:

1. Is not already at maximum concurrent call capacity.
2. Is not already assigned to a pair involving either number.
3. Has the appropriate region or caller ID type.

Implement this logic on your server or contact Exotel for managed pool allocation.

## Call Recording with Number Masking

Call recording works normally with number masking. Enable recording to:

- Maintain quality assurance records
- Resolve disputes between parties
- Comply with regulatory requirements

Configure recording in the masking pair setup or at the account level.

## Privacy Compliance

Number masking helps with regulatory compliance:

| Regulation | How Number Masking Helps |
|---|---|
| **Data privacy laws** | Personal phone numbers are not shared between parties |
| **GDPR (EU)** | Minimizes personal data exposure |
| **IT Act (India)** | Protects personal information of users |
| **Platform liability** | Platforms avoid liability from number misuse |

## Best Practices

- **Always set expiry times** -- Clean up masking pairs after the interaction is complete.
- **Use dedicated ExoPhones** -- Do not mix masking ExoPhones with your regular incoming call ExoPhones.
- **Monitor pair utilization** -- Track how many active pairs you have and plan ExoPhone capacity accordingly.
- **Handle edge cases** -- Define what happens when a number calls the ExoPhone but has no active pair (play an error message or route to support).
- **Log everything** -- Store masking pair creation/deletion events, call logs, and recordings for audit purposes.
- **Implement bidirectional masking** -- Ensure both Party A and Party B can call each other through the ExoPhone.

## Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| Call not connecting | Masking pair expired | Check pair status and recreate if needed |
| Wrong party connected | Number mapped to wrong pair | Verify pair configuration |
| Caller hears error message | No active pair for this number | Create a masking pair before the call |
| ExoPhone capacity exceeded | Too many concurrent masked calls | Add more ExoPhones to the pool |
| One-directional only | Pair not set up for bidirectional | Ensure both numbers are registered in the pair |

## Related

- [Outgoing Calls](/docs/call-support/call-features/outgoing-calls)
- [Call Recording](/docs/call-support/call-features/call-recording)
- [Voice v1 API](/docs/voice-v1/overview)
- [Voice v2 API](/docs/voice-api/getting-started/overview)
