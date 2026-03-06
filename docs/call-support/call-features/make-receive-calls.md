---
id: make-receive-calls
title: How to Make or Receive Calls
description: "Guide to making outbound calls and receiving inbound calls using Exotel's dashboard and APIs with ExoPhones."
sidebar_label: Make or Receive Calls
sidebar_position: 2
---

# How to Make or Receive Calls

This guide covers how to handle both inbound and outbound calls using Exotel.

## Receiving Incoming Calls

### Prerequisites

- An active ExoPhone (virtual number). See [What is an ExoPhone?](/docs/call-support/basics/virtual-numbers)
- A call flow assigned to the ExoPhone. See [Setting Up a Call Flow](/docs/call-support/call-features/setting-up-call-flow)

### How It Works

1. A customer dials your ExoPhone.
2. Exotel receives the call and triggers the assigned call flow.
3. The call flow processes the call (greeting, IVR, routing).
4. The call is connected to an agent or handled by an automated system.

### Setting Up Incoming Calls

1. **Buy an ExoPhone** -- Go to ExoPhones in the dashboard and purchase a number.
2. **Create a call flow** -- Build a flow with at least a Greeting and Connect applet.
3. **Assign the flow** -- Map the call flow to your ExoPhone.
4. **Add agent numbers** -- In the Connect applet, enter the phone numbers of agents who should receive calls.

![Incoming Call Setup](/img/call-support/incoming-call-setup.png)

### Incoming Call Flow Diagram

```
Customer dials ExoPhone
        ↓
  Exotel Cloud
        ↓
  Call Flow (Greeting → IVR → Connect)
        ↓
  Agent's phone rings
        ↓
  Agent answers → Call connected
```

## Making Outgoing Calls

There are multiple ways to make outgoing calls through Exotel.

### Method 1: Via the Dashboard

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Navigate to the dialer or click-to-call option.
3. Enter the customer's phone number.
4. Select the ExoPhone to use as caller ID.
5. Click **Call**.

Exotel will first call your agent number, and once the agent answers, it will call the customer. The customer sees the ExoPhone as the caller ID.

### Method 2: Via API (Connect Two Numbers)

Use the [Connect Two Numbers API](/docs/voice-v1/api-reference/connect-two-numbers) to programmatically connect an agent to a customer:

```bash
curl -X POST 'https://<api_key>:<api_token>@api.exotel.com/v1/Accounts/<account_sid>/Calls/connect.json' \
  -d 'From=<agent_number>' \
  -d 'To=<customer_number>' \
  -d 'CallerId=<exophone>'
```

**Parameters:**

| Parameter | Description |
|---|---|
| `From` | The agent's phone number (called first) |
| `To` | The customer's phone number (called after agent answers) |
| `CallerId` | The ExoPhone to display as caller ID |

### Method 3: Via API (Connect to Flow)

Use the [Connect to Flow API](/docs/voice-v1/api-reference/connect-to-flow) to call a number and connect them to a call flow (IVR):

```bash
curl -X POST 'https://<api_key>:<api_token>@api.exotel.com/v1/Accounts/<account_sid>/Calls/connect.json' \
  -d 'From=<customer_number>' \
  -d 'CallerId=<exophone>' \
  -d 'Url=http://my.exotel.com/exoml/start/<app_id>'
```

This is useful for scenarios like automated reminders or IVR surveys.

### Method 4: Via Campaigns

For bulk outbound calls, use the [Campaigns API](/docs/campaigns/overview) to call a list of numbers:

1. Create a campaign with a list of phone numbers.
2. Assign an IVR flow to the campaign.
3. Schedule or start the campaign.
4. Exotel dials each number and connects them to the flow.

See: [Outbound Dialer Setup](/docs/call-support/advanced-features/outbound-dialer)

## Outgoing Call Flow Diagram

```
API Request (Connect Two Numbers)
        ↓
  Exotel calls Agent first
        ↓
  Agent answers
        ↓
  Exotel calls Customer
        ↓
  Customer answers → Both connected
        ↓
  Customer sees ExoPhone as caller ID
```

## Call Recording

Both incoming and outgoing calls can be recorded. Enable recording in the Connect applet configuration or via the API `Record` parameter.

See: [Call Recording](/docs/call-support/call-features/call-recording)

## Viewing Call Details

After a call completes, you can view details via:

- **Dashboard**: Go to **Call Logs** to see all calls with timestamps, duration, status, and recordings.
- **API**: Use the [Call Details API](/docs/voice-v1/api-reference/call-details) to fetch call information programmatically.
- **Webhooks**: Configure [Status Callbacks](/docs/voice-v1/api-reference/status-callback) to receive call details in real time.

## Troubleshooting

| Issue | Possible Cause | Solution |
|---|---|---|
| Incoming calls not ringing agents | Flow not assigned to ExoPhone | Check ExoPhone settings |
| Outgoing call fails | Invalid phone number format | Use E.164 format or 10-digit number |
| Customer hears nothing | No Greeting applet in flow | Add a Greeting applet as the first step |
| Call drops immediately | Call flow has no Connect applet | Ensure the flow routes to an agent or voicemail |
| Agent number busy | All agents occupied | Set up [Call Queue](/docs/call-support/call-features/call-queue) or [Voicemail](/docs/call-support/call-features/voicemail) |

## Related

- [Outgoing Calls](/docs/call-support/call-features/outgoing-calls)
- [Setting Up a Call Flow](/docs/call-support/call-features/setting-up-call-flow)
- [Voice v1 API](/docs/voice-v1/overview)
- [Call Analytics](/docs/call-support/call-features/call-analytics)
