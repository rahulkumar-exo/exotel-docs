---
id: sms-applet-guide
title: SMS Applet Guide
description: "Send SMS messages during Exotel call flows using the SMS applet for confirmations, missed call alerts, and post-call notifications."
sidebar_label: SMS Applet
sidebar_position: 7
---

# SMS Applet Guide

The SMS applet sends an SMS message to the caller or a specified number during a call flow. Use it for post-call confirmations, missed call notifications, appointment reminders, or any scenario where you need to send a text message as part of a voice call workflow.

:::tip
For sending SMS programmatically outside of call flows, use the [SMS API](/docs/sms-api/overview). The SMS applet is specifically for sending messages as part of an active call flow.
:::

## How the SMS Applet Works

When a call reaches the SMS applet in your flow:

1. The applet composes an SMS message using the configured template
2. The message is sent to the specified recipient (caller's number by default)
3. The call flow immediately continues to the next applet (SMS sending is asynchronous)
4. The SMS is delivered independently of the call -- even if the call ends, the SMS still arrives

```
Call Flow ──► SMS Applet (sends SMS) ──► Next Applet (continues immediately)
                    │
                    └──► SMS delivered to recipient's phone (asynchronous)
```

:::info
The SMS applet does not pause the call flow. The message is queued for delivery and the flow proceeds to the next step without waiting for SMS delivery confirmation.
:::

## Configuration

### Basic Setup

1. Drag the **SMS** applet onto the [Flow Builder](/docs/app-bazaar/flow-builder-guide) canvas
2. Click the applet to open the Properties Panel
3. Configure the recipient, sender, and message content
4. Click **Apply**

### Configuration Fields

| Setting | Required | Description |
|---------|----------|-------------|
| **To Number** | Yes | Recipient's phone number (default: caller's number) |
| **Sender ID** | Yes | DLT-registered sender ID for the SMS |
| **Message Body** | Yes | The text content of the SMS |
| **DLT Template ID** | Yes | The DLT-registered template ID for the message |
| **DLT Entity ID** | Yes | Your DLT-registered entity ID |

### Recipient Options

| Option | Description |
|--------|-------------|
| **Caller's number** | Sends the SMS to the person who called (default) |
| **Called number** | Sends to the ExoPhone number (rarely used) |
| **Custom number** | Sends to a specific phone number you configure |
| **Dynamic** | Uses a number from a Passthru applet response (advanced) |

### Message Body

The message body supports static text and dynamic variables:

| Variable | Replaced With | Example |
|----------|--------------|---------|
| `{CallFrom}` | Caller's phone number | +919876543210 |
| `{CallTo}` | Called number (ExoPhone) | +914412345678 |
| `{CallSid}` | Unique call identifier | abc123def456 |
| `{DateTime}` | Current date and time | 2024-01-15 10:30 |

**Example message:**

```
Thank you for calling Acme Corp. Your reference number is {CallSid}.
For further assistance, call us at 1800-XXX-XXXX.
```

:::warning DLT Compliance Required
All SMS sent through the SMS applet must comply with TRAI's DLT regulations. This means:
1. Your entity must be registered on the DLT platform
2. The message template must be pre-approved
3. The sender ID must be registered
4. The actual message content must match the registered template

Messages that fail DLT validation will not be delivered. See the [DLT Guide](/docs/sms-support/dlt-guide) for registration instructions.
:::

## Use Cases

### 1. Post-Call Confirmation

Send a summary SMS after a successful call:

```
Greeting ──► Connect (agent) ──► SMS ("Thanks for contacting us. Ref: {CallSid}") ──► Hangup
```

### 2. Missed Call Alert

Send an SMS when the caller could not reach an agent:

```
Greeting ──► Connect (agent) ──► (no answer) SMS ("We missed your call. We'll call back soon.") ──► Hangup
```

### 3. Appointment Reminder

After booking an appointment via IVR, confirm with an SMS:

```
IVR ──► Passthru (book appointment) ──► SMS ("Your appointment is confirmed for...") ──► Hangup
```

### 4. Lead Capture from Missed Call

For missed call lead generation campaigns:

```
Greeting (brief ring) ──► SMS ("Thanks for your interest! Visit acme.com/offer") ──► Hangup
```

### 5. Post-Survey Thank You

After a caller completes an IVR survey:

```
IVR (survey questions) ──► Passthru (save responses) ──► SMS ("Thank you for your feedback!") ──► Hangup
```

## DLT Template Setup

Before using the SMS applet, register your templates with the DLT platform:

### Step 1: Register Your Entity

If not already done, register your business entity on the DLT platform. See [DLT Registration](/docs/sms-support/dlt-registration).

### Step 2: Create a Template

Register a message template with variables:

```
Template: "Thank you for calling {#var#}. Your reference number is {#var#}. For support, call {#var#}."
Template ID: 1107166XXXXXX
Category: Transactional
```

### Step 3: Get Template Approved

Submit the template for approval. Approval typically takes 1 -- 3 business days.

### Step 4: Configure in SMS Applet

Enter the Template ID and Entity ID in the SMS applet configuration.

## SMS Delivery and Billing

| Aspect | Details |
|--------|---------|
| **Delivery timing** | SMS is queued immediately; delivery depends on carrier (typically 1 -- 30 seconds) |
| **Billing** | SMS is billed at your standard per-SMS rate |
| **DND handling** | Transactional SMS is delivered to DND numbers; promotional SMS is blocked |
| **Character limit** | 160 characters (GSM-7) or 70 characters (Unicode) per segment |
| **Long messages** | Messages exceeding the limit are split and billed as multiple segments |
| **Delivery status** | Available via [SMS API](/docs/sms-api/overview) or [SMS Reports](/docs/reporting/sms-reports) |

## Error Handling

| Error | Cause | Impact on Call Flow |
|-------|-------|-------------------|
| DLT validation failure | Template or entity not registered | SMS not sent; call flow continues |
| Invalid recipient number | Number format incorrect | SMS not sent; call flow continues |
| Insufficient balance | Account credits depleted | SMS not sent; call flow continues |
| Carrier rejection | Carrier-level filtering or DND block | SMS not sent; call flow continues |

:::info
SMS applet errors do not affect the call flow. If an SMS fails to send, the call flow continues to the next applet as normal. Check [SMS Reports](/docs/reporting/sms-reports) to track delivery status of SMS sent from call flows.
:::

## Best Practices

1. **Keep messages short** -- Stay within 160 characters to avoid multi-segment billing
2. **Use transactional SMS** -- For call-flow-triggered messages, transactional SMS ensures delivery to DND numbers
3. **Register templates in advance** -- DLT template approval takes time; register templates before building the flow
4. **Test with a real number** -- Make a test call and verify the SMS arrives
5. **Include a reference number** -- Use `{CallSid}` so the recipient can reference the call
6. **Do not spam** -- Only send relevant, expected messages as part of the call interaction

## Related Topics

- [SMS Applet API Reference](/docs/voice-v1/applets/sms) -- Technical API details
- [SMS API](/docs/sms-api/overview) -- Sending SMS outside of call flows
- [DLT Guide](/docs/sms-support/dlt-guide) -- DLT compliance requirements
- [SMS Reports](/docs/reporting/sms-reports) -- Track SMS delivery status
- [Flow Builder Guide](/docs/app-bazaar/flow-builder-guide) -- Visual flow design
