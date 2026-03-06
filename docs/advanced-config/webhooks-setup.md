---
id: webhooks-setup
title: Webhook Configuration
description: "Configure Exotel webhooks with URL setup, retry logic, payload formats, signature verification, and troubleshooting guidance."
sidebar_label: Webhooks Setup
sidebar_position: 1
---

# Webhook Configuration

Webhooks allow Exotel to notify your application about events in real time. When a call completes, an SMS is delivered, or a campaign finishes, Exotel sends an HTTP POST request to your configured URL with event data.

:::tip
For the complete webhook payload reference for all event types, see [Webhooks & Callbacks](/docs/references/webhooks).
:::

## How Webhooks Work

```
1. Event occurs (call completes, SMS delivered, etc.)
2. Exotel sends HTTP POST to your configured URL
3. Your server processes the data
4. Your server responds with HTTP 200 to acknowledge
5. If no 200 response, Exotel retries (up to 2 times)
```

## Configuring Webhook URLs

### Per-Call Webhooks (StatusCallback)

Set a webhook URL when making an API call. The URL receives a callback when the call status changes:

```bash
curl -X POST \
  https://api.exotel.com/v1/Accounts/{account_sid}/Calls/connect.json \
  -u {api_key}:{api_token} \
  -d "From=+919876543210" \
  -d "To=+919876543211" \
  -d "CallerId=+914412345678" \
  -d "StatusCallback=https://your-server.com/exotel/callback" \
  -d "StatusCallbackEvents[]=terminal"
```

### Account-Level Webhooks

Configure a default webhook URL for all events on your account:

1. Log in to [my.exotel.com](https://my.exotel.com)
2. Navigate to **Settings** > **Webhooks**
3. Enter your webhook URL for each event type:

| Event Type | Description | URL Field |
|-----------|-------------|-----------|
| **Voice StatusCallback** | Called when a voice call status changes | Voice Callback URL |
| **SMS StatusCallback** | Called when an SMS delivery status changes | SMS Callback URL |
| **Heartbeat** | Periodic health check for your endpoints | Heartbeat URL |

4. Click **Save**

:::info
Per-call webhook URLs (set in the API request) override account-level defaults. This lets you route different calls to different endpoints.
:::

## Webhook URL Requirements

| Requirement | Details |
|-------------|---------|
| **Protocol** | HTTPS required (TLS 1.2 or higher) |
| **Response time** | Must respond within **15 seconds** |
| **Response code** | Must return HTTP **200** to acknowledge receipt |
| **Availability** | Must be publicly accessible from Exotel servers |
| **Content handling** | Must accept `application/x-www-form-urlencoded` POST body |

:::warning
If your endpoint does not respond with HTTP 200 within 15 seconds, Exotel considers the delivery failed and initiates retries.
:::

## Retry Logic

When a webhook delivery fails, Exotel retries with the following schedule:

| Attempt | Timing | Behavior |
|---------|--------|----------|
| **First attempt** | Immediate | Sends the webhook as soon as the event occurs |
| **First retry** | 5 minutes after failure | Resends the same payload |
| **Second retry** | 15 minutes after first retry | Final attempt with the same payload |

### What Counts as Failure

| Scenario | Treated As |
|----------|-----------|
| HTTP 200 response | Success (no retry) |
| HTTP 2xx (other than 200) | Success (no retry) |
| HTTP 3xx (redirect) | Failure (retry triggered) |
| HTTP 4xx (client error) | Failure (retry triggered) |
| HTTP 5xx (server error) | Failure (retry triggered) |
| Connection timeout | Failure (retry triggered) |
| DNS resolution failure | Failure (retry triggered) |
| SSL/TLS handshake failure | Failure (retry triggered) |

### After All Retries Fail

If all retry attempts fail:

1. The webhook event is **dropped** -- it will not be retried further
2. You can retrieve the event data manually using the respective API endpoint:
   - [Voice Call Details API](/docs/voice-api/api-reference/call-details) for call events
   - [SMS Details API](/docs/sms-api/api-reference/sms-details) for SMS events

:::tip
Implement a reconciliation process that periodically polls the Exotel API to catch any events missed due to webhook failures. This ensures no data is lost.
:::

## Webhook Payload Format

### Voice Call Callback

Exotel sends the following fields as form-encoded POST parameters:

| Field | Description | Example |
|-------|-------------|---------|
| `CallSid` | Unique call identifier | `abc123def456` |
| `CallFrom` | Caller's number | `+919876543210` |
| `CallTo` | Destination number | `+919876543211` |
| `Direction` | Call direction | `outbound-api` |
| `CallType` | Type of call | `completed` |
| `Status` | Final call status | `completed` |
| `StartTime` | When the call started | `2024-01-15 10:30:00` |
| `EndTime` | When the call ended | `2024-01-15 10:35:00` |
| `Duration` | Call duration in seconds | `300` |
| `RecordingUrl` | URL to the call recording | `https://...` |
| `Price` | Call cost | `2.50` |

### SMS Callback

| Field | Description | Example |
|-------|-------------|---------|
| `SmsSid` | Unique message identifier | `sms789xyz` |
| `To` | Recipient number | `+919876543210` |
| `From` | Sender ID | `ACMECORP` |
| `Status` | Delivery status | `delivered` |
| `DateSent` | When the message was sent | `2024-01-15 10:30:00` |
| `ErrorCode` | Error code if failed | `null` |

## Securing Your Webhooks

### IP Whitelisting

Accept webhook requests only from Exotel's IP ranges. See [IP Whitelisting](/docs/advanced-config/ip-whitelisting) for the list of Exotel IP addresses.

### Webhook Signature Verification

Verify that webhook requests genuinely come from Exotel:

1. Exotel includes a signature header in each webhook request
2. Use your API token to compute the expected signature
3. Compare the computed signature with the header value
4. Reject requests where signatures do not match

### HTTPS Only

Always use HTTPS for your webhook URLs. This encrypts the webhook payload in transit and prevents man-in-the-middle attacks.

## Testing Webhooks

### Using a Test Endpoint

For development and testing, use a service like ngrok to expose your local server:

1. Start your local server on port 3000
2. Run ngrok to create a public HTTPS URL
3. Configure the ngrok URL as your webhook endpoint
4. Make a test API call
5. Observe the webhook delivery on your local server

### Webhook Logs

Check webhook delivery status in the Exotel dashboard:

1. Navigate to **Settings** > **Webhooks** > **Logs**
2. View the delivery status, response code, and response time for each webhook event
3. Filter by date, event type, and delivery status

## Troubleshooting

| Issue | Possible Cause | Resolution |
|-------|---------------|------------|
| Webhook not received | URL incorrect or unreachable | Verify the URL is publicly accessible and correct |
| HTTP 403 response | Server rejecting Exotel's IP | Whitelist Exotel's IP addresses |
| HTTP 500 response | Server-side error in your handler | Check your server logs for errors |
| SSL error | Invalid or expired SSL certificate | Renew your SSL certificate; ensure TLS 1.2+ |
| Timeout | Server processing takes too long | Respond with 200 immediately; process asynchronously |
| Duplicate events | Retries after a slow response | Implement idempotency using CallSid/SmsSid as a key |

### Best Practice: Respond Fast, Process Later

To avoid timeouts, separate webhook receipt from processing:

```
1. Receive webhook POST
2. Immediately respond HTTP 200
3. Queue the event data for async processing
4. Process the event in a background worker
```

This ensures Exotel receives the acknowledgement quickly, even if your business logic takes longer to execute.

## Related Topics

- [Webhooks Reference](/docs/references/webhooks) -- Complete payload documentation
- [IP Whitelisting](/docs/advanced-config/ip-whitelisting) -- Secure webhook endpoints
- [Voice API](/docs/voice-api/getting-started/overview) -- Setting StatusCallback in API calls
- [Heartbeat](/docs/heartbeat/overview) -- Health monitoring for your endpoints
