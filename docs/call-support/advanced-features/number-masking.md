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
Your app triggers a connect (Party A, Party B, CallerId = ExoPhone)
        |
        v
Exotel calls Party A, showing the ExoPhone
        |
        v
Party A answers; Exotel calls Party B, showing the ExoPhone
        |
        v
Both legs are bridged
Party B sees ExoPhone as caller ID (not Customer's number)
Party A sees ExoPhone as caller ID (not Driver's number)
```

Neither party sees the other's personal phone number. Both see the ExoPhone.

The A-to-B relationship lives in your application, not in Exotel — there is no
pair-registration API. Each masked conversation is a connect request.

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

### Step 2: Connect the Two Parties

There is no pair-registration API. Masking is done per call: your application
calls [Connect Two Numbers](/docs/voice-v1/api-reference/connect-two-numbers)
with the ExoPhone as `CallerId`, so neither party sees the other's number.

```bash
curl -u '<api_key>:<api_token>' -X POST 'https://api.exotel.com/v1/Accounts/<account_sid>/Calls/connect.json' \
  -d 'From=<party_a_number>' \
  -d 'To=<party_b_number>' \
  -d 'CallerId=<exophone>'
```

Your application holds the A-to-B relationship (trip, order, booking) in its own
database and supplies both numbers at call time.

:::note
Standing A-to-B mappings that let either party dial the ExoPhone and be routed
automatically are a managed setup, not self-serve. Talk to your Exotel account
manager if you need that rather than per-call connects.
:::

### Step 3: Share the ExoPhone with Both Parties

Instead of sharing personal numbers, share the ExoPhone:

- **To Party A**: "Call +91-80-4712XXXX to reach your driver."
- **To Party B**: "If the customer calls, it will come from +91-80-4712XXXX."

### Step 4: Handle the Call

When your application triggers the connect:

1. Exotel calls Party A and shows the ExoPhone as the caller ID.
2. When Party A answers, Exotel calls Party B, also showing the ExoPhone.
3. Both legs are bridged. Neither party sees the other's number.

If you need Party B to be able to call back, trigger a fresh connect from your
application. An inbound call to the ExoPhone will not route to Party B on its own.

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

## Number Pool Management

For high-volume masking, you need a pool of ExoPhones:

| Volume | Recommended Pool Size |
|---|---|
| Up to 50 concurrent masked calls | 5-10 ExoPhones |
| 50-200 concurrent masked calls | 10-25 ExoPhones |
| 200-1000 concurrent masked calls | 25-100 ExoPhones |
| 1000+ concurrent masked calls | Contact Exotel for enterprise setup |

### Pool Allocation Logic

When starting a masked interaction, select an ExoPhone from the pool that:

1. Is not already at maximum concurrent call capacity.
2. Is not already in use for an interaction involving either number.
3. Has the appropriate region or caller ID type.

Implement this logic on your server or contact Exotel for managed pool allocation.

## Call Recording with Number Masking

Call recording works normally with number masking. Enable recording to:

- Maintain quality assurance records
- Resolve disputes between parties
- Comply with regulatory requirements

Enable recording on the connect request or at the account level.

## Privacy Compliance

Number masking helps with regulatory compliance:

| Regulation | How Number Masking Helps |
|---|---|
| **Data privacy laws** | Personal phone numbers are not shared between parties |
| **GDPR (EU)** | Minimizes personal data exposure |
| **IT Act (India)** | Protects personal information of users |
| **Platform liability** | Platforms avoid liability from number misuse |

## Best Practices

- **Use dedicated ExoPhones** -- Do not mix masking ExoPhones with your regular incoming call ExoPhones.
- **Monitor ExoPhone utilisation** -- Track concurrent masked calls per ExoPhone and plan capacity accordingly.
- **Handle edge cases** -- Define what happens when a number calls the ExoPhone but has no active pair (play an error message or route to support).
- **Log everything** -- Store the A-to-B mapping your application used, call logs, and recordings for audit purposes.
- **Trigger call-backs from your application** -- An inbound call to the ExoPhone is not routed to the other party automatically.

## Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| Call not connecting | Party A did not answer, so leg 2 was never placed | Check the call status callback for the first leg |
| Wrong party connected | Your application supplied the wrong `To` | Verify the A-to-B mapping in your own database |
| Caller hears an error on dialling the ExoPhone | Inbound calls are not routed to the other party | Trigger a connect from your application instead |
| ExoPhone capacity exceeded | Too many concurrent masked calls | Add more ExoPhones to the pool |
| Party B sees Party A's number | `CallerId` was not set to the ExoPhone | Set `CallerId` to the masking ExoPhone on every connect |

## Related

- [Outgoing Calls](/docs/call-support/call-features/outgoing-calls)
- [Call Recording](/docs/call-support/call-features/call-recording)
- [Voice v1 API](/docs/voice-v1/overview)
- [Voice v2 API](/docs/voice-api/getting-started/overview)
