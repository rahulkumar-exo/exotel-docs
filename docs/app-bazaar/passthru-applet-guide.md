---
id: passthru-applet-guide
title: Passthru Applet Guide
description: "Use the Exotel Passthru applet to make HTTP requests during call flows for dynamic routing, CRM lookups, and data logging."
sidebar_label: Passthru Applet
sidebar_position: 3
---

# Passthru Applet Guide

The Passthru applet makes HTTP requests to your server during an active call flow. It enables dynamic call routing, real-time CRM lookups, data logging, and integration with any external system that exposes an HTTP API.

:::tip
The Passthru applet is one of Exotel's most powerful features. It transforms static call flows into dynamic, data-driven workflows. For API-level details on the Passthru applet, see the [Passthru Applet API reference](/docs/voice-v1/applets/passthru).
:::

## How Passthru Works

When a call reaches the Passthru applet in your flow:

1. Exotel sends an HTTP request (GET or POST) to your configured URL
2. Your server processes the request and returns a response
3. Based on the response, the call flow continues to the appropriate next applet
4. The entire round trip happens while the caller waits (typically hears hold music or silence)

```
Caller on hold ──► Exotel sends HTTP request to your server
                   ──► Your server processes and responds
                   ──► Exotel routes call based on response
                   ──► Caller connected to next step
```

## Configuration

### Basic Setup

1. Drag the **Passthru** applet onto the [Flow Builder](/docs/app-bazaar/flow-builder-guide) canvas
2. Click the applet to open the Properties Panel
3. Configure the following:

| Setting | Required | Description |
|---------|----------|-------------|
| **URL** | Yes | The HTTP endpoint Exotel will call |
| **HTTP Method** | Yes | GET or POST |
| **Timeout** | No | Maximum time to wait for a response (default: 15 seconds) |
| **On Timeout** | No | Which applet to route to if the request times out |
| **Hold Music** | No | Audio to play while the HTTP request is in progress |

### Request Parameters

Exotel sends the following parameters in the HTTP request to your server:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `CallSid` | Unique identifier for the call | `abc123def456` |
| `CallFrom` | Caller's phone number | `+919876543210` |
| `CallTo` | Called number (ExoPhone) | `+914412345678` |
| `Direction` | Call direction | `incoming` or `outgoing` |
| `CurrentTime` | Current timestamp | `2024-01-15T10:30:00+05:30` |
| `DialWhomNumber` | Number being dialed (for outbound) | `+919876543210` |

:::info
For POST requests, parameters are sent as form-encoded body parameters. For GET requests, they are appended as query string parameters.
:::

### Response Format

Your server must respond with a valid HTTP response. The response body can be used to control the call flow:

```
HTTP/1.1 200 OK
Content-Type: application/plain

applet_name_or_url
```

#### Response-Based Routing

| Your Response | Call Flow Behavior |
|--------------|-------------------|
| **HTTP 200 with applet URL** | Route to the specified applet or external flow |
| **HTTP 200 with empty body** | Continue to the default next applet |
| **HTTP 4xx/5xx** | Route to the "On Error" path |
| **Timeout (no response)** | Route to the "On Timeout" path |

## Use Cases

### 1. CRM Lookup for VIP Routing

Look up the caller in your CRM and route VIP customers to a priority queue:

**Your server logic:**

```
Receive CallFrom → Look up in CRM database
  → If VIP customer: return "vip-connect" applet
  → If regular customer: return "standard-queue" applet
  → If unknown: return "new-customer" applet
```

**Flow design:**

```
Greeting ──► Passthru (CRM Lookup) ──► VIP Connect (priority agent)
                                    ──► Standard Queue (round-robin)
                                    ──► New Customer (greeting + IVR)
```

### 2. Order Status via DTMF

Collect an order number via IVR, then look up the status via Passthru:

```
IVR ("Enter order number") ──► Passthru (order lookup) ──► Greeting (read status via TTS)
```

### 3. Call Data Logging

Log every call to your database without affecting the flow:

```
Passthru (log call data) ──► Connect (proceed to agent)
```

Your server receives the call details, stores them, and returns HTTP 200 immediately.

### 4. Dynamic Business Hours Check

Check if the current time is within business hours:

```
Passthru (time check) ──► (business hours) Connect to agents
                       ──► (after hours) Greeting + Voicemail
```

### 5. Language Selection Based on Caller Location

Look up the caller's location and play greetings in their language:

```
Passthru (location lookup) ──► (Hindi) Hindi Greeting ──► Hindi IVR
                            ──► (English) English Greeting ──► English IVR
                            ──► (Tamil) Tamil Greeting ──► Tamil IVR
```

## Server Implementation

### Example: Node.js Server

```javascript
// Express server handling Passthru requests
app.post('/exotel/passthru', (req, res) => {
  const callerNumber = req.body.CallFrom;
  const callSid = req.body.CallSid;

  // Look up caller in your database
  const customer = db.findByPhone(callerNumber);

  if (customer && customer.isVIP) {
    // Route to VIP flow
    res.status(200).send('https://my.exotel.com/exoml/start/vip-flow');
  } else {
    // Route to standard flow
    res.status(200).send('https://my.exotel.com/exoml/start/standard-flow');
  }
});
```

### Server Requirements

| Requirement | Details |
|------------|---------|
| **HTTPS** | Your endpoint must support HTTPS (TLS 1.2+) |
| **Response time** | Must respond within the configured timeout (default 15 seconds) |
| **HTTP status** | Return 200 for success; 4xx/5xx triggers the error path |
| **Availability** | Must be publicly accessible from Exotel's servers |
| **Content-Type** | Return `text/plain` or `application/json` |

:::warning
If your server does not respond within the timeout period, the call is routed to the "On Timeout" path. Callers hear silence or hold music during this wait. Keep your server response time under 3 seconds for the best caller experience.
:::

## Error Handling

### Configuring Fallback Paths

Always configure fallback paths for Passthru applets:

| Scenario | Recommended Fallback |
|----------|---------------------|
| **Server timeout** | Route to a default Connect applet (general queue) |
| **Server error (5xx)** | Route to a Greeting with an apology message, then Connect |
| **Server returns unexpected data** | Route to default flow |

### Monitoring Passthru Performance

Track Passthru applet performance in your call logs:

- **Response time**: Available in CDR reports under the Passthru leg
- **Success/failure rate**: Filter call logs by calls that went through the error/timeout path
- **Server errors**: Monitor your server logs for Exotel-originated requests

## Best Practices

1. **Keep response times fast** -- Aim for under 3 seconds; callers are waiting on the line
2. **Always configure fallbacks** -- Never leave the timeout or error path unconnected
3. **Use hold music** -- Play music while the HTTP request is in progress
4. **Implement server-side logging** -- Log all Passthru requests for debugging
5. **Use HTTPS** -- Secure your endpoint with a valid SSL certificate
6. **Validate the request** -- Verify that requests come from Exotel's IP ranges
7. **Handle concurrent requests** -- Your server must handle multiple simultaneous Passthru calls

## Related Topics

- [Passthru Applet API Reference](/docs/voice-v1/applets/passthru) -- Technical API details
- [Flow Builder Guide](/docs/app-bazaar/flow-builder-guide) -- Visual flow design
- [Webhooks](/docs/references/webhooks) -- General webhook configuration
- [Connect Applet Guide](/docs/app-bazaar/connect-applet-guide) -- Route calls to agents
