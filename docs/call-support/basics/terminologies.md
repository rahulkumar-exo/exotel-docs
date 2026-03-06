---
id: terminologies
title: Terminologies
description: "Glossary of key terms used in Exotel's cloud telephony platform including ExoPhone, call flow, applet, IVR, and more."
sidebar_label: Terminologies
sidebar_position: 3
---

# Terminologies

This glossary covers the key terms used across the Exotel platform. Understanding these terms will help you navigate the dashboard, configure call flows, and work with the APIs.

## Core Concepts

### ExoPhone

A virtual phone number provided by Exotel. Customers dial this number to reach your business. Each ExoPhone is assigned to a call flow that determines how incoming calls are handled. ExoPhones can be landline, mobile, or toll-free numbers.

See: [What is an ExoPhone?](/docs/call-support/basics/virtual-numbers) | [ExoPhones API](/docs/exophones/overview)

### Call Flow (App)

A visual sequence of applets that defines how a call is handled from start to finish. Call flows are created and managed in the Exotel Dashboard using a drag-and-drop flow builder. Each ExoPhone is mapped to one call flow.

See: [Setting Up a Call Flow](/docs/call-support/call-features/setting-up-call-flow)

### Applet

A building block within a call flow. Each applet performs a specific action such as playing a greeting, presenting an IVR menu, connecting to an agent, or recording a voicemail. Applets are chained together to create the complete call experience.

See: [Voice v1 Applets](/docs/voice-v1/overview)

### IVR (Interactive Voice Response)

An automated phone menu that lets callers interact using their phone keypad (DTMF tones). For example, "Press 1 for Sales, Press 2 for Support." Exotel supports single-level and multi-level IVR configurations.

See: [IVR Setup](/docs/call-support/call-features/ivr-setup) | [Multi-Level IVR](/docs/call-support/advanced-features/multi-level-ivr)

### DTMF (Dual-Tone Multi-Frequency)

The tones generated when a caller presses keys on their phone keypad. Used by IVR menus to detect caller input (0-9, *, #).

## Call-Related Terms

### Call Leg

A single connection between two parties in a call. An incoming call has two legs: the customer-to-Exotel leg, and the Exotel-to-agent leg. Each leg has its own SID, status, duration, and recording.

See: [Legs API](/docs/legs/overview)

### CallSid

A unique identifier assigned to every call processed by Exotel. Use the CallSid to look up call details, recordings, and status via the API.

### Call Status

The current state of a call. Common statuses include:

| Status | Description |
|---|---|
| `ringing` | The phone is ringing |
| `in-progress` | The call is active and connected |
| `completed` | The call ended normally |
| `busy` | The called party was busy |
| `no-answer` | The called party did not answer |
| `failed` | The call could not be connected |
| `canceled` | The call was canceled before being answered |

### Call Recording

An audio recording of the conversation between two connected parties. Recordings can be enabled at the flow level or via API. Recording URLs are available in the call detail response and status callbacks.

See: [Call Recording](/docs/call-support/call-features/call-recording)

### Status Callback

An HTTP POST request sent by Exotel to your application URL when a call event occurs (e.g., call answered, call completed). Callbacks include call details such as CallSid, status, duration, and recording URL.

See: [Status Callback](/docs/voice-v1/api-reference/status-callback)

## Routing Terms

### Sticky Agent

A feature that routes a returning caller to the same agent they previously spoke with. This ensures continuity in customer interactions.

See: [Sticky Agent](/docs/call-support/call-features/sticky-agent)

### Parallel Ringing

When an incoming call rings multiple agents simultaneously. The first agent to answer gets connected. Also known as "simultaneous ringing."

See: [Parallel Ringing](/docs/call-support/call-features/parallel-ringing)

### Sequential Ringing

When an incoming call rings agents one by one in a defined order. If the first agent does not answer, the call moves to the next agent.

### Call Queue

A holding queue for callers when all agents are busy. Callers hear hold music or a message while waiting for the next available agent.

See: [Call Queue](/docs/call-support/call-features/call-queue)

### Smart Routing

Dynamic call routing based on rules such as caller location, time of day, agent availability, or CRM data. Can be configured using the Passthru applet for API-based routing.

See: [Smart Routing](/docs/call-support/advanced-features/smart-routing)

### Call Forwarding

Redirecting an incoming call from one number or agent to another. Useful for after-hours routing or agent unavailability.

See: [Call Forwarding](/docs/call-support/call-features/call-forwarding)

## Business Features

### Business Hours

Define the operating hours for your call flow. Calls received outside business hours can be routed to voicemail, a different message, or an alternate flow.

See: [Business Hours](/docs/call-support/call-features/business-hours)

### Number Masking

Connecting two parties (e.g., a delivery driver and a customer) without revealing their personal phone numbers. Both parties see the ExoPhone as the caller ID.

See: [Number Masking](/docs/call-support/advanced-features/number-masking)

### Missed Call Solution

A setup where a customer gives a missed call to your ExoPhone, and your system automatically calls them back or triggers an action (e.g., sending an SMS, registering a vote, or generating a lead).

See: [Missed Call Solution](/docs/call-support/call-features/missed-call)

## Campaign Terms

### Campaign

A bulk outbound calling operation where Exotel dials a list of phone numbers and connects them to an IVR flow or agent. Campaigns support scheduling, retries, and real-time reporting.

See: [Campaigns API](/docs/campaigns/overview)

### Outbound Dialer

An automated system that dials a list of numbers for outbound campaigns such as sales calls, reminders, or surveys.

See: [Outbound Dialer Setup](/docs/call-support/advanced-features/outbound-dialer)

## Dashboard Terms

### Exotel Dashboard

The web-based management interface at [my.exotel.com](https://my.exotel.com). Used for configuring ExoPhones, building call flows, viewing analytics, managing users, and accessing API credentials.

### Account SID

A unique identifier for your Exotel account. Required for all API calls. Found in the Exotel Dashboard under Settings > API Settings.

### API Key / API Token

Credentials used for authenticating API requests via HTTP Basic Authentication. Found in the Exotel Dashboard under Settings > API Settings.

## Next Steps

- [What is an ExoPhone?](/docs/call-support/basics/virtual-numbers)
- [Services Provided by Exotel](/docs/call-support/basics/services)
- [Getting Started with Exotel](/docs/call-support/basics/getting-started)
