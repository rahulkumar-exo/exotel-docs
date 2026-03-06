---
id: sms-webhooks
title: SMS Webhooks
description: "Configure SMS webhooks on Exotel for real-time delivery callbacks and inbound messages -- URL setup, payload format, and security."
sidebar_label: SMS Webhooks
sidebar_position: 13
---

# SMS Webhooks

Webhooks allow Exotel to push real-time SMS events to your server, including delivery status updates and inbound message notifications. This guide covers how to set up, secure, and process SMS webhooks.

## What Are SMS Webhooks?

SMS webhooks are HTTP callbacks that Exotel sends to your configured endpoint when an event occurs. Instead of polling the API for updates, your server receives instant notifications.

| Event Type | Description | Trigger |
|------------|-------------|---------|
| **Delivery Status** | Status updates for outbound SMS | Message delivered, failed, or expired |
| **Inbound SMS** | Customer replies to your messages | New inbound message received |

## Setting Up Webhooks

### Delivery Status Webhook

#### Option 1: Per-Message (API Parameter)

Set the `StatusCallback` parameter when sending an SMS:

```bash
curl -X POST "https://<api_key>:<api_token>@api.exotel.com/v1/Accounts/<account_sid>/Sms/send" \
  -d "From=EXOTL" \
  -d "To=+919876543210" \
  -d "Body=Your order has shipped" \
  -d "DltEntityId=1234567890123" \
  -d "DltTemplateId=1107160000000012345" \
  -d "StatusCallback=https://your-server.com/webhooks/sms-status"
```

#### Option 2: Account-Level (Dashboard)

Configure a default webhook URL for all outbound SMS:

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Navigate to **Settings** > **SMS Settings**.
3. Enter your **Status Callback URL**.
4. Select the HTTP method (**POST** recommended).
5. Save the settings.

### Inbound SMS Webhook

Configure the webhook for receiving customer replies:

1. In the Exotel Dashboard, go to **Settings** > **SMS Settings** > **Inbound SMS**.
2. Enter your **Inbound Webhook URL**.
3. Select the HTTP method (**POST** recommended).
4. Save.

## Webhook URL Requirements

| Requirement | Details |
|-------------|---------|
| Protocol | HTTPS required (HTTP not accepted in production) |
| Response time | Must respond within 10 seconds |
| Response code | Must return 2xx status (200, 201, 202) |
| Availability | Endpoint must be publicly accessible |
| Certificate | Valid SSL/TLS certificate (self-signed not accepted) |

:::warning
If your webhook endpoint is behind a firewall, whitelist Exotel's IP ranges. Contact Exotel support for the current list of IP addresses.
:::

## Delivery Status Webhook Payload

When a message status changes, Exotel sends an HTTP POST to your callback URL:

### Request Format

**Content-Type:** `application/x-www-form-urlencoded`

| Parameter | Type | Description |
|-----------|------|-------------|
| `SmsSid` | string | Unique SMS identifier |
| `AccountSid` | string | Your Exotel account SID |
| `From` | string | Sender ID used |
| `To` | string | Recipient phone number |
| `Status` | string | High-level status (`queued`, `sent`, `delivered`, `failed`) |
| `DetailedStatus` | string | Detailed status code |
| `DetailedStatusCode` | integer | Numeric status code |
| `SentAt` | string | ISO 8601 timestamp of send |
| `UpdatedAt` | string | ISO 8601 timestamp of update |
| `ExternalRef` | string | Your custom reference ID (if provided) |

### Example: Delivered

```
POST /webhooks/sms-status HTTP/1.1
Host: your-server.com
Content-Type: application/x-www-form-urlencoded

SmsSid=sms_abc123&AccountSid=acct_123&From=EXOTL&To=%2B919876543210&Status=delivered&DetailedStatus=DELIVERED_TO_HANDSET&DetailedStatusCode=20000&SentAt=2025-01-15T10%3A30%3A00%2B05%3A30&UpdatedAt=2025-01-15T10%3A30%3A05%2B05%3A30
```

### Example: Failed

```
POST /webhooks/sms-status HTTP/1.1
Host: your-server.com
Content-Type: application/x-www-form-urlencoded

SmsSid=sms_def456&AccountSid=acct_123&From=EXOTL&To=%2B919876543210&Status=failed&DetailedStatus=FAILED_DND&DetailedStatusCode=30004&SentAt=2025-01-15T10%3A30%3A00%2B05%3A30&UpdatedAt=2025-01-15T10%3A30%3A01%2B05%3A30
```

## Inbound SMS Webhook Payload

When a customer sends an SMS to your Exotel number:

| Parameter | Type | Description |
|-----------|------|-------------|
| `SmsSid` | string | Unique identifier for the inbound SMS |
| `From` | string | Customer's phone number |
| `To` | string | Your Exotel virtual number |
| `Body` | string | Message content |
| `DateCreated` | string | ISO 8601 timestamp |
| `AccountSid` | string | Your Exotel account SID |

### Example: Inbound Message

```
POST /webhooks/sms-inbound HTTP/1.1
Host: your-server.com
Content-Type: application/x-www-form-urlencoded

SmsSid=inb_xyz789&AccountSid=acct_123&From=%2B919876543210&To=%2B911140XXXXXX&Body=YES&DateCreated=2025-01-15T10%3A35%3A00%2B05%3A30
```

## Handling Webhooks

### Node.js (Express)

```javascript
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));

// Delivery status webhook
app.post('/webhooks/sms-status', (req, res) => {
  const { SmsSid, Status, DetailedStatus, To } = req.body;
  console.log(`SMS ${SmsSid} to ${To}: ${Status} (${DetailedStatus})`);

  // Update your database with the delivery status
  updateSmsStatus(SmsSid, Status, DetailedStatus);

  res.status(200).send('OK');
});

// Inbound SMS webhook
app.post('/webhooks/sms-inbound', (req, res) => {
  const { From, Body, SmsSid } = req.body;
  console.log(`Inbound SMS from ${From}: ${Body}`);

  // Process the inbound message asynchronously
  processInboundSms(From, Body, SmsSid);

  res.status(200).send('OK');
});

app.listen(3000);
```

### Python (Flask)

```python
from flask import Flask, request

app = Flask(__name__)

@app.route('/webhooks/sms-status', methods=['POST'])
def sms_status():
    sms_sid = request.form.get('SmsSid')
    status = request.form.get('Status')
    detailed = request.form.get('DetailedStatus')
    to_number = request.form.get('To')

    print(f"SMS {sms_sid} to {to_number}: {status} ({detailed})")
    update_sms_status(sms_sid, status, detailed)

    return 'OK', 200

@app.route('/webhooks/sms-inbound', methods=['POST'])
def sms_inbound():
    from_number = request.form.get('From')
    body = request.form.get('Body')

    print(f"Inbound from {from_number}: {body}")
    process_inbound(from_number, body)

    return 'OK', 200
```

## Retry Policy

If your webhook endpoint does not respond with a 2xx status code, Exotel retries:

| Attempt | Delay After Previous |
|---------|---------------------|
| 1st retry | 30 seconds |
| 2nd retry | 2 minutes |
| 3rd retry | 10 minutes |
| Final (4th) | 30 minutes |

After all retries are exhausted, the callback is marked as failed. You can retrieve missed events from the dashboard or via the [SMS Details API](/docs/sms-api/api-reference/sms-details).

## Securing Your Webhooks

### IP Whitelisting

Restrict incoming requests to Exotel's IP ranges:

1. Contact Exotel support to obtain the current IP whitelist.
2. Configure your firewall or web server to accept requests only from those IPs.

### HTTPS Enforcement

Always use HTTPS endpoints. Exotel does not send webhooks to plain HTTP URLs in production environments.

### Request Validation

Validate that incoming requests contain expected parameters and originate from Exotel:

```javascript
app.post('/webhooks/sms-status', (req, res) => {
  // Validate required fields
  if (!req.body.SmsSid || !req.body.AccountSid) {
    return res.status(400).send('Invalid payload');
  }

  // Validate account SID matches your account
  if (req.body.AccountSid !== process.env.EXOTEL_ACCOUNT_SID) {
    return res.status(403).send('Unauthorized');
  }

  // Process the webhook
  // ...
  res.status(200).send('OK');
});
```

:::tip
Process webhook payloads asynchronously. Acknowledge receipt immediately with a 200 response, then handle the business logic in a background job or queue. This prevents timeouts and ensures reliable delivery.
:::

## Testing Webhooks

### Using ngrok for Local Development

During development, use [ngrok](https://ngrok.com) to expose your local server:

```bash
ngrok http 3000
```

Use the generated HTTPS URL (e.g., `https://abc123.ngrok.io/webhooks/sms-status`) as your webhook URL in the Exotel dashboard or API.

### Verifying Webhook Delivery

1. Send a test SMS via the Exotel API or dashboard.
2. Check your server logs for the incoming webhook request.
3. Verify the payload fields match the expected format.
4. Confirm your endpoint returned a 200 response.

## Best Practices

1. **Always respond quickly** -- Return a 2xx response within 5 seconds; process data asynchronously.
2. **Be idempotent** -- The same callback may be delivered multiple times; use `SmsSid` as a deduplication key.
3. **Log all webhooks** -- Store raw webhook payloads for debugging and audit trails.
4. **Monitor webhook failures** -- Set up alerts if your endpoint starts failing to respond.
5. **Use a queue** -- Push incoming webhooks to a message queue (RabbitMQ, SQS, Redis) for reliable processing.
6. **Handle all statuses** -- Your code should handle every possible status, not just `delivered` and `failed`.

## Next Steps

- [SMS Delivery Reports](/docs/sms-support/sms-delivery-reports) -- Understand delivery statuses
- [Two-Way SMS](/docs/sms-support/two-way-sms) -- Build interactive SMS workflows
- [SMS Status Codes](/docs/sms-support/sms-status-codes) -- Complete status code reference
- [SMS API Reference](/docs/sms-api/overview) -- API documentation
