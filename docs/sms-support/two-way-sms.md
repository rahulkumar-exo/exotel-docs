---
id: two-way-sms
title: Two-Way SMS
description: "Set up two-way SMS with Exotel to receive customer replies, configure inbound webhooks, and build interactive messaging workflows."
sidebar_label: Two-Way SMS
sidebar_position: 12
---

# Two-Way SMS

Two-way SMS enables your business to both send messages and receive replies from customers. This creates interactive communication channels for surveys, feedback collection, opt-in/opt-out management, and conversational workflows.

## How Two-Way SMS Works

```
Your Business                Exotel                 Customer
     |                         |                       |
     |--- Send SMS ----------->|--- Deliver SMS ------>|
     |                         |                       |
     |                         |<-- Customer replies --|
     |<-- Inbound webhook -----|                       |
     |                         |                       |
     |--- Process reply        |                       |
     |--- Send follow-up ----->|--- Deliver SMS ------>|
```

1. You send an outbound SMS to the customer via Exotel.
2. The customer replies to the message.
3. Exotel receives the inbound SMS and forwards it to your configured webhook URL.
4. Your application processes the reply and optionally sends a follow-up message.

## Prerequisites

| Requirement | Details |
|-------------|---------|
| Exotel account | Active account with two-way SMS enabled |
| Virtual number | A dedicated Exotel virtual number for receiving replies |
| Webhook endpoint | An HTTPS URL on your server to receive inbound messages |
| DLT setup | Completed DLT registration with approved templates |

:::note
Two-way SMS requires a dedicated virtual number (long code or short code). Contact your Exotel account manager to enable inbound SMS on your account.
:::

## Setting Up Inbound SMS

### Step 1: Get a Virtual Number

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Navigate to **Phone Numbers** > **Buy Numbers** or contact your account manager.
3. Select a number with SMS capability.
4. Note the virtual number assigned to your account.

### Step 2: Configure Your Webhook

1. Go to **Settings** > **SMS Settings** > **Inbound SMS**.
2. Enter your webhook URL (must be HTTPS).
3. Select the HTTP method: **POST** (recommended) or **GET**.
4. Save the configuration.

### Step 3: Build Your Webhook Endpoint

Your webhook endpoint must accept incoming HTTP requests from Exotel. Here is an example:

**Node.js (Express):**

```javascript
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/sms/inbound', (req, res) => {
  const { From, To, Body, SmsSid, DateCreated } = req.body;

  console.log(`Received SMS from ${From}: ${Body}`);

  // Process the inbound message
  // Example: Check for opt-out keywords
  if (Body.trim().toUpperCase() === 'STOP') {
    // Handle unsubscribe
    unsubscribeUser(From);
  }

  // Respond with 200 to acknowledge receipt
  res.status(200).send('OK');
});

app.listen(3000);
```

**Python (Flask):**

```python
from flask import Flask, request

app = Flask(__name__)

@app.route('/sms/inbound', methods=['POST'])
def inbound_sms():
    from_number = request.form.get('From')
    body = request.form.get('Body')
    sms_sid = request.form.get('SmsSid')

    print(f"Received SMS from {from_number}: {body}")

    # Process the inbound message
    if body.strip().upper() == 'STOP':
        unsubscribe_user(from_number)

    return 'OK', 200
```

## Inbound SMS Webhook Payload

Exotel sends the following parameters to your webhook when an inbound SMS is received:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `SmsSid` | Unique identifier for the inbound SMS | `inb_sms_abc123` |
| `From` | Sender's phone number (the customer) | `+919876543210` |
| `To` | Your Exotel virtual number | `+911140XXXXXX` |
| `Body` | Content of the inbound SMS | `YES` |
| `DateCreated` | Timestamp of the inbound message | `2025-01-15T10:30:00+05:30` |
| `AccountSid` | Your Exotel account SID | `your_account_sid` |

## Common Two-Way SMS Use Cases

### Opt-In / Opt-Out Management

Allow customers to subscribe or unsubscribe by replying with keywords:

| Keyword | Action |
|---------|--------|
| `START` or `YES` | Subscribe to messages |
| `STOP` or `NO` | Unsubscribe from messages |
| `HELP` | Send help information |

```
Outbound: "Reply YES to receive order updates. Reply STOP to unsubscribe."
Inbound:  "YES"
Outbound: "You are now subscribed to order updates from ExampleStore."
```

### Surveys and Feedback

Collect customer feedback via SMS:

```
Outbound: "How was your experience? Reply 1 for Great, 2 for Good, 3 for Poor."
Inbound:  "1"
Outbound: "Thank you for your feedback! We are glad you had a great experience."
```

### Appointment Confirmations

```
Outbound: "Your appointment is scheduled for Jan 20 at 3 PM. Reply C to confirm, R to reschedule."
Inbound:  "C"
Outbound: "Your appointment on Jan 20 at 3 PM is confirmed. See you then!"
```

### OTP Verification via Reply

```
Outbound: "Your verification code is 456789. Reply with the code to verify your account."
Inbound:  "456789"
Outbound: "Your account has been verified successfully."
```

## Building Conversational Workflows

For multi-step conversations, maintain session state on your server:

```javascript
const sessions = {};

app.post('/sms/inbound', (req, res) => {
  const { From, Body } = req.body;
  const reply = Body.trim().toUpperCase();

  if (!sessions[From]) {
    sessions[From] = { step: 'start' };
  }

  const session = sessions[From];
  let responseMessage = '';

  switch (session.step) {
    case 'start':
      if (reply === 'ORDER') {
        session.step = 'awaiting_order_id';
        responseMessage = 'Please reply with your order ID.';
      }
      break;
    case 'awaiting_order_id':
      session.orderId = Body.trim();
      session.step = 'complete';
      responseMessage = `Your order ${session.orderId} status: Shipped. Expected delivery: Jan 22.`;
      delete sessions[From];
      break;
  }

  // Send the response via Exotel API
  if (responseMessage) {
    sendSms(From, responseMessage);
  }

  res.status(200).send('OK');
});
```

:::tip
For complex conversational flows, consider using a state machine library or a dedicated workflow engine rather than managing state in memory. Persist session data in a database for reliability.
:::

## Webhook Retry Policy

If your webhook endpoint fails to respond with a 2xx status code, Exotel retries the delivery:

| Retry | Delay |
|-------|-------|
| 1st retry | 30 seconds |
| 2nd retry | 2 minutes |
| 3rd retry | 10 minutes |

After three failed attempts, the inbound message is marked as undeliverable. You can retrieve missed messages from the Exotel dashboard.

:::warning
Ensure your webhook endpoint responds within 10 seconds. Long-running processing should be handled asynchronously -- acknowledge the webhook immediately and process the message in a background task.
:::

## Best Practices

1. **Respond promptly** -- Reply to inbound SMS within seconds for a good customer experience.
2. **Handle unknown keywords** -- Send a helpful response when a customer sends an unrecognized keyword.
3. **Implement opt-out** -- Always honor STOP/UNSUBSCRIBE requests to comply with TRAI regulations.
4. **Log all inbound messages** -- Maintain records of inbound SMS for compliance and debugging.
5. **Use idempotent processing** -- Your webhook may receive duplicate callbacks; handle them gracefully.
6. **Secure your webhook** -- Validate incoming requests to ensure they originate from Exotel.

## Next Steps

- [SMS Webhooks](/docs/sms-support/sms-webhooks) -- Webhook configuration and payload details
- [SMS Delivery Reports](/docs/sms-support/sms-delivery-reports) -- Track outbound message delivery
- [How to Send SMS](/docs/sms-support/how-to-send-sms) -- Send outbound messages
- [SMS API Reference](/docs/sms-api/overview) -- API documentation
