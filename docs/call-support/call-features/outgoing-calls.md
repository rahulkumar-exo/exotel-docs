---
id: outgoing-calls
title: Making Outgoing Calls
description: "Guide to making outgoing calls with Exotel using click-to-call, progressive dialer, API-triggered calls, and campaigns."
sidebar_label: Outgoing Calls
sidebar_position: 11
---

# Making Outgoing Calls

Outgoing calls (outbound calls) let your team proactively reach customers for sales follow-ups, appointment reminders, order confirmations, and support callbacks. Exotel offers multiple methods for making outgoing calls, from manual dashboard dialing to fully automated API-driven campaigns.

## How Outgoing Calls Work in Exotel

In every outgoing call through Exotel, the platform acts as an intermediary:

```
Your application or agent triggers a call
        |
        v
Exotel calls the agent first (Leg A)
        |
        v
Agent answers
        |
        v
Exotel calls the customer (Leg B)
        |
        v
Customer answers → Both connected
Customer sees ExoPhone as caller ID (not agent's personal number)
```

This two-leg architecture ensures:

- **Agent privacy** -- The customer never sees the agent's personal number.
- **Professional caller ID** -- The customer sees your business number (ExoPhone).
- **Call recording and analytics** -- Both legs are tracked and can be recorded.

## Methods for Making Outgoing Calls

### Method 1: Click-to-Call (Dashboard)

The simplest way to make an outgoing call.

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Navigate to the **Dialer** or use the click-to-call widget.
3. Enter the customer's phone number.
4. Select the ExoPhone to use as caller ID.
5. Click **Call**.

Exotel calls your agent number first. When you answer, it calls the customer.

### Method 2: Click-to-Call (API)

Integrate click-to-call into your CRM, helpdesk, or custom application using the [Connect Two Numbers API](/docs/voice-v1/api-reference/connect-two-numbers):

```bash
curl -X POST 'https://<api_key>:<api_token>@api.exotel.com/v1/Accounts/<account_sid>/Calls/connect.json' \
  -d 'From=<agent_number>' \
  -d 'To=<customer_number>' \
  -d 'CallerId=<exophone>' \
  -d 'Record=true' \
  -d 'StatusCallback=https://your-app.com/call-status'
```

**Parameters:**

| Parameter | Required | Description |
|---|---|---|
| `From` | Yes | Agent's phone number (called first) |
| `To` | Yes | Customer's phone number |
| `CallerId` | Yes | ExoPhone displayed as caller ID |
| `Record` | No | `true` to record the call |
| `StatusCallback` | No | URL to receive call status updates |
| `StatusCallbackEvents` | No | Events to notify: `initiated`, `ringing`, `answered`, `completed` |
| `TimeLimit` | No | Maximum call duration in seconds |
| `TimeOut` | No | Time in seconds to ring the called parties (both the From and To legs). The timer runs only during ringing and stops once each leg is answered. |

**Response:**

```json
{
  "Call": {
    "Sid": "call_sid_here",
    "Status": "queued",
    "DateCreated": "2025-01-15 10:30:00"
  }
}
```

### Method 3: Connect to Flow (API)

Call a customer and connect them to an IVR flow instead of a live agent. Useful for automated reminders, surveys, and verifications.

```bash
curl -X POST 'https://<api_key>:<api_token>@api.exotel.com/v1/Accounts/<account_sid>/Calls/connect.json' \
  -d 'From=<customer_number>' \
  -d 'CallerId=<exophone>' \
  -d 'Url=http://my.exotel.com/exoml/start/<app_id>'
```

| Parameter | Description |
|---|---|
| `From` | Customer number to call |
| `CallerId` | ExoPhone displayed as caller ID |
| `Url` | The call flow (App) URL to execute when the customer answers |

**Common use cases:**

| Use Case | Flow Design |
|---|---|
| **Appointment reminder** | Greeting ("Your appointment is tomorrow at 3 PM. Press 1 to confirm, 2 to reschedule.") |
| **Order confirmation** | Greeting ("Your order #1234 has shipped. Press 1 for details.") |
| **Survey** | IVR ("How would you rate your experience? Press 1 for Great, 2 for Good, 3 for Poor.") |
| **Payment reminder** | Greeting ("Your payment of Rs. 500 is due on Jan 20. Press 1 to pay now.") |

### Method 4: Bulk Outbound Campaigns

For calling large lists of numbers, use the [Campaigns API](/docs/campaigns/overview) or the [Outbound Dialer](/docs/call-support/advanced-features/outbound-dialer):

1. Upload a list of phone numbers (CSV or via API).
2. Assign an IVR flow or agent group to handle the calls.
3. Configure scheduling, retries, and concurrency.
4. Start the campaign.

```bash
# Create a campaign via API
curl -X POST 'https://<api_key>:<api_token>@api.exotel.com/v1/Accounts/<account_sid>/Campaigns' \
  -d 'Name=January_Sales_Outreach' \
  -d 'CallFlowId=<flow_id>' \
  -d 'Numbers=+919876543210,+919876543211,+919876543212' \
  -d 'Schedule=2025-01-20T09:00:00'
```

See: [Outbound Dialer](/docs/call-support/advanced-features/outbound-dialer)

### Method 5: Progressive Dialer

A progressive dialer automatically dials the next number from a list when an agent becomes available. This maximizes agent utilization by eliminating idle time between calls.

```
Agent finishes call → System dials next number → Agent hears ring → Customer answers → Connected
```

**Advantages over manual dialing:**

| Aspect | Manual Dialing | Progressive Dialer |
|---|---|---|
| Agent idle time | High (searching, dialing) | Minimal (auto-dial) |
| Calls per hour | 15-20 | 30-50 |
| Misdials | Common | Zero |
| Agent effort | High | Low (system does the work) |

See: [Outbound Dialer](/docs/call-support/advanced-features/outbound-dialer)

## Outgoing Call via Voice v2 API

The [Voice v2 API](/docs/voice-api/getting-started/overview) provides enhanced control over outgoing calls:

```bash
curl -X POST 'https://api.exotel.com/v2/accounts/<account_sid>/calls' \
  -H 'Authorization: Basic <base64(api_key:api_token)>' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": {
      "number": "<agent_number>"
    },
    "to": {
      "number": "<customer_number>"
    },
    "caller_id": "<exophone>",
    "record": true,
    "status_callback": "https://your-app.com/call-status"
  }'
```

## Caller ID Management

| Scenario | Caller ID Shown to Customer |
|---|---|
| Standard outgoing call | ExoPhone number |
| With Truecaller verification | Business name (verified) |
| Without ExoPhone | Not possible -- ExoPhone is required |

:::tip
Enable [Truecaller Verified Caller ID](/docs/call-support/advanced-features/truecaller-verified-caller-id) to display your business name instead of just a phone number. This significantly improves answer rates.
:::

## Call Status Tracking

Track the progress of outgoing calls using status callbacks:

| Event | Description |
|---|---|
| `initiated` | Call request received by Exotel |
| `ringing` | Agent or customer phone is ringing |
| `in-progress` | Both parties connected |
| `completed` | Call ended normally |
| `busy` | Customer's line was busy |
| `no-answer` | Customer did not answer |
| `failed` | Call could not be placed |
| `canceled` | Call was canceled before connection |

Configure the `StatusCallback` URL in your API request to receive these events in real time.

## Best Practices

- **Call during appropriate hours** -- Respect business hours and local regulations. In India, TRAI regulations restrict commercial calls to 9 AM - 9 PM.
- **Use Truecaller verification** -- Verified business caller ID increases answer rates by 30-50%.
- **Set reasonable timeouts** -- A 30-second ring timeout gives customers time to answer without wasting agent time.
- **Enable call recording** -- Record outbound calls for quality assurance and compliance.
- **Implement retry logic** -- For unanswered calls, schedule retries at different times of day. See [Auto Retry](/docs/call-support/advanced-features/auto-retry).
- **Monitor call analytics** -- Track answer rates, call duration, and outcomes. See [Call Analytics](/docs/call-support/call-features/call-analytics).
- **Use the right method** -- Use click-to-call for ad-hoc calls, Connect to Flow for automated messages, and campaigns for bulk outreach.

:::warning
Ensure compliance with local telecom regulations when making outbound calls. In India, calls to numbers on the DND (Do Not Disturb) registry require prior consent. Non-compliance can result in penalties.
:::

## Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| Agent number not ringing | Incorrect `From` number | Verify agent number format |
| Customer sees unknown number | ExoPhone not set as CallerID | Set `CallerId` parameter |
| Call fails immediately | Invalid customer number | Use E.164 format or 10-digit number |
| Low answer rate | Caller ID not recognized | Enable Truecaller verified caller ID |
| Both parties hear hold music | Flow misconfigured | Use Connect Two Numbers, not Connect to Flow |
| Call recorded but no audio | Only one leg was connected | Ensure both parties answered |

## Related

- [Make or Receive Calls](/docs/call-support/call-features/make-receive-calls)
- [Outbound Dialer](/docs/call-support/advanced-features/outbound-dialer)
- [Auto Retry](/docs/call-support/advanced-features/auto-retry)
- [Automated Calls](/docs/call-support/advanced-features/automated-calls)
- [Truecaller Verified Caller ID](/docs/call-support/advanced-features/truecaller-verified-caller-id)
- [Voice v1 API](/docs/voice-v1/overview)
- [Voice v2 API](/docs/voice-api/getting-started/overview)
