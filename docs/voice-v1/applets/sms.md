---
id: sms
title: SMS Applet
sidebar_label: SMS
sidebar_position: 8
---

# SMS Applet

The SMS applet sends an SMS message during a call flow. Use it to send confirmation messages, follow-up information, or notifications triggered by call events.

## Modes

### Static Mode

Send a fixed, pre-configured message to the caller.

- Configure the message text directly in the applet
- The same message is sent every time

### Dynamic Mode

Fetch the message content from your application URL.

- The applet sends a GET request to your configured URL
- Your application returns the SMS content as plain text
- Enables personalized messages based on caller data or call context

## Configuration

1. In the Exotel Dashboard, open your call flow editor
2. Drag the **SMS** applet into your flow
3. Choose the mode:
   - **Static**: Enter the message text
   - **Dynamic**: Provide your application URL

## Example Flows

**Post-call confirmation:**
```
Incoming Call → Connect (to agent) → SMS ("Thank you for calling. Your ticket #12345 has been created.")
```

**Dynamic follow-up:**
```
Incoming Call → Passthru (look up order) → SMS (fetch order status from URL) → Hangup
```

## Dynamic Mode Response Format

Your application URL should return the SMS content as **plain text** in the response body. The applet sends a GET request and expects a simple text response.
