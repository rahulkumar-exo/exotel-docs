---
id: how-exotel-works
title: How Does Exotel Work?
description: "Understand how Exotel's cloud telephony platform processes incoming and outgoing calls through ExoPhones, call flows, and applets."
sidebar_label: How Does Exotel Work?
sidebar_position: 2
---

# How Does Exotel Work?

Exotel acts as a cloud-based layer between your customers and your team. When a customer calls your business number, Exotel intercepts the call in the cloud, processes it through your configured call flow, and connects it to the right person or system.

## Architecture Overview

![Exotel Architecture Overview](/img/call-support/how-exotel-works-architecture.png)

The high-level flow is:

```
Customer dials your ExoPhone
        |
        v
  Exotel Cloud Platform
  (processes call flow)
        |
        v
  Greeting → IVR Menu → Connect to Agent
```

## Incoming Call Flow

When a customer calls your Exotel virtual number (ExoPhone):

1. **Call arrives at ExoPhone** -- The customer dials your business number. Exotel receives the call on its cloud infrastructure.
2. **Call flow is triggered** -- The ExoPhone is mapped to a call flow (also called an App). Exotel begins executing the flow.
3. **Applets process the call** -- The call passes through a sequence of applets (Greeting, IVR Menu, Connect, Voicemail, etc.) that you configured in the flow builder.
4. **Agent is connected** -- Based on the flow logic, the call is routed to one or more agents. The agent's phone rings and they answer.
5. **Call completes** -- When the conversation ends, Exotel logs the call details including duration, recording URL, and status.
6. **Callbacks fire** -- Exotel sends HTTP callbacks (webhooks) to your application with the call details.

## Outgoing Call Flow

When you want to call a customer from your application:

1. **API request** -- Your application sends a request to the Exotel API (e.g., [Connect Two Numbers](/docs/voice-v1/api-reference/connect-two-numbers) or [Connect to Flow](/docs/voice-v1/api-reference/connect-to-flow)).
2. **Agent leg** -- Exotel first calls the agent (or the "from" number).
3. **Customer leg** -- Once the agent answers, Exotel calls the customer (the "to" number).
4. **Connection** -- Both parties are connected. The customer sees the ExoPhone as the caller ID, not the agent's personal number.
5. **Post-call processing** -- Call details, recordings, and status callbacks are generated.

## Key Components

### ExoPhones (Virtual Numbers)

These are the phone numbers your customers dial. Each ExoPhone is mapped to a call flow. You can have multiple ExoPhones for different departments or regions.

See: [What is an ExoPhone?](/docs/call-support/basics/virtual-numbers)

### Call Flows (Apps)

A call flow is a visual sequence of applets that define how a call is handled. You design flows in the Exotel Dashboard using a drag-and-drop builder.

See: [Setting Up a Call Flow](/docs/call-support/call-features/setting-up-call-flow)

### Applets

Applets are the building blocks of a call flow. Each applet performs a specific action:

| Applet | Purpose |
|---|---|
| [Greeting](/docs/voice-v1/applets/greeting) | Play a welcome message |
| [IVR Menu](/docs/voice-v1/applets/ivr-menu) | Present options and route based on keypress |
| [Connect](/docs/voice-v1/applets/connect) | Route the call to agents or numbers |
| [Voicemail](/docs/voice-v1/applets/voicemail) | Let callers leave a message |
| [Transfer](/docs/voice-v1/applets/transfer) | Transfer to another flow |
| [Passthru](/docs/voice-v1/applets/passthru) | Make an HTTP request to your app mid-call |
| [Hangup](/docs/voice-v1/applets/hangup) | End the call |

### Dashboard

The Exotel Dashboard at [my.exotel.com](https://my.exotel.com) is where you:

- Manage ExoPhones
- Build and edit call flows
- View call logs and analytics
- Configure users and settings
- Access API credentials

### APIs

For programmatic control, Exotel provides REST APIs:

- [Voice v1 API](/docs/voice-v1/overview) -- Simple call automation and IVR
- [Voice v2 API](/docs/voice-api/getting-started/overview) -- Enhanced call management
- [Voice v3 API](/docs/voice-v3/overview) -- Advanced call details and monitoring
- [SMS API](/docs/sms-api/overview) -- Send and manage SMS
- [Campaigns API](/docs/campaigns/overview) -- Bulk outbound calling

## Call Legs

Every call in Exotel consists of one or more "legs":

- **Incoming call**: The first leg is from the customer to the ExoPhone. The second leg is from Exotel to the agent.
- **Outgoing call**: The first leg is from Exotel to the agent. The second leg is from Exotel to the customer.

Each leg has its own status, duration, and recording. See the [Legs API](/docs/legs/overview) for details.

## Status Callbacks

Exotel sends HTTP POST callbacks to your application URL whenever a call event occurs. This allows your application to:

- Update CRM records in real time
- Trigger follow-up actions
- Log call details in your own database

See: [Status Callback](/docs/voice-v1/api-reference/status-callback)

## Next Steps

- [Terminologies](/docs/call-support/basics/terminologies) -- Learn the key terms used across Exotel
- [Getting Started](/docs/call-support/basics/getting-started) -- Set up your first call flow
