---
title: Testing Guide
description: "Test your Exotel setup with test calls, test SMS, sandbox mode, and webhook verification before going live in production."
sidebar_label: Testing Guide
sidebar_position: 11
---

# Testing Guide

Before going live, thoroughly test your Exotel setup to ensure calls route correctly, SMS deliver as expected, webhooks fire reliably, and your integrations work end to end. This guide covers testing strategies for each channel.

## Testing Checklist

| Test | Channel | Priority | Status |
|------|---------|----------|--------|
| API credential validation | All | Required | |
| Outbound voice call | Voice | Required | |
| Inbound voice call | Voice | Required | |
| IVR flow navigation | Voice | Required | |
| Call recording playback | Voice | Recommended | |
| Outbound SMS delivery | SMS | Required | |
| DLT template validation | SMS | Required (India) | |
| Webhook delivery | All | Required | |
| CRM integration | All | If applicable | |
| Campaign test run | Campaigns | Recommended | |
| Error handling | All | Recommended | |

## Step 1: Validate API Credentials

Before testing any feature, confirm your credentials work:

```bash
curl -u '<api_key>:<api_token>' -v "https://api.exotel.com/v2/accounts/<account_sid>/calls?limit=1"
```

**Expected result:** HTTP 200 with a JSON response.

If you get HTTP 401, verify your credentials in **Dashboard > Settings > API Settings**.

## Step 2: Test Outbound Voice Calls

### Make a Test Call via API

Place a call from your ExoPhone to your own mobile number:

```bash
curl -u '<api_key>:<api_token>' -X POST "https://api.exotel.com/v2/accounts/<account_sid>/calls/connect" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+919876543210",
    "to": "+919876543211",
    "caller_id": "0XXXXXX4890",
    "url": "http://my.exotel.com/<account_sid>/exoml/start_voice/<app_id>"
  }'
```

**Replace:**
- `from`: Your own phone number (the first person called)
- `to`: Another phone number (the second person called)
- `caller_id`: Your ExoPhone
- `url`: Your call flow URL

### What to Verify

| Check | Expected |
|-------|----------|
| Your phone rings first | Yes |
| After you answer, the second number rings | Yes |
| Both parties can hear each other | Yes |
| Call appears in Dashboard > Calls | Yes |
| Call SID is returned in API response | Yes |

### Make a Test Call via Dashboard

1. Go to the dashboard home screen
2. Click **Make a Call** in the quick actions area
3. Enter the destination number
4. Select the ExoPhone to use
5. Click **Call**

## Step 3: Test Inbound Voice Calls

### Test Your Call Flow

1. Call your ExoPhone from your personal mobile phone
2. Verify the call connects and your greeting plays
3. If you have an IVR menu, test each key option:

| Key | Expected Behavior | Test Result |
|-----|-------------------|-------------|
| 1 | Routes to Sales number | |
| 2 | Routes to Support number | |
| 0 | Routes to Operator | |
| No input | Menu replays or default action | |
| Invalid key (e.g., 9) | Error message plays, menu replays | |

4. Verify call recording is working (if enabled)
5. Test the voicemail fallback (let the call ring without answering)

:::tip
Test each path through your IVR flow, including edge cases like invalid inputs and timeouts. Call flows that work in simple cases often fail on unexpected inputs.
:::

## Step 4: Test SMS Delivery

### Send a Test SMS

```bash
curl -u '<api_key>:<api_token>' -X POST "https://api.exotel.com/v2/accounts/<account_sid>/sms/send" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+919876543210",
    "body": "This is a test message from Exotel. If you received this, your SMS setup is working correctly.",
    "sender_id": "EXOTL",
    "dlt_entity_id": "1234567890123456789",
    "dlt_template_id": "9876543210123456789"
  }'
```

### What to Verify

| Check | Expected |
|-------|----------|
| API returns HTTP 200 with SmsSid | Yes |
| SMS received on your phone | Yes |
| Correct Sender ID displayed | Yes |
| Message content matches template | Yes |
| Delivery status updates via API | Yes |

### Test DLT Template Matching

If your SMS is rejected with a DLT error:

1. Verify your DLT Entity ID is correct
2. Verify your DLT Template ID is approved on the DLT portal
3. Ensure the message body matches the template exactly (character by character)
4. Check that the Sender ID is associated with this template
5. Wait 24-48 hours for template propagation if recently approved

## Step 5: Test Webhooks

### Set Up a Test Webhook Endpoint

Use a webhook inspection tool to capture and examine payloads:

**Option 1: webhook.site**
1. Visit [webhook.site](https://webhook.site)
2. Copy the unique URL provided
3. Use it as your callback URL in API requests

**Option 2: ngrok (for local development)**
1. Start your local webhook handler on a port (e.g., 3000)
2. Run: `ngrok http 3000`
3. Use the ngrok HTTPS URL as your callback URL

### Test Call Status Webhook

Make an API call with a webhook URL:

```bash
curl -u '<api_key>:<api_token>' -X POST "https://api.exotel.com/v2/accounts/<account_sid>/calls/connect" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+919876543210",
    "to": "+919876543211",
    "caller_id": "0XXXXXX4890",
    "url": "http://my.exotel.com/<account_sid>/exoml/start_voice/<app_id>",
    "status_callback": "https://your-webhook-endpoint.com/callback"
  }'
```

### What to Verify

| Check | Expected |
|-------|----------|
| Webhook received within seconds of call status change | Yes |
| Payload contains CallSid, Status, Duration | Yes |
| Your endpoint returns HTTP 200 | Yes |
| Multiple status updates received (ringing, in-progress, completed) | Yes |

:::warning
If your webhook endpoint is not publicly accessible (e.g., behind a firewall or VPN), Exotel cannot deliver webhooks. Use ngrok or a similar tool during development to expose your local server.
:::

## Step 6: Test Campaign (Small Batch)

Before running a full campaign, test with a small contact list:

### Create a Test Contact List

```csv
number,first_name
+919876543210,Test User 1
+919876543211,Test User 2
+919876543212,Test User 3
```

Upload this as a test list and create a campaign with 3-5 contacts.

### Campaign Test Settings

| Setting | Test Value | Production Value |
|---------|-----------|-----------------|
| Contacts | 3-5 | Full list |
| Throttle | 5 calls/min | 30-60 calls/min |
| Retries | 1 | 2-3 |
| Schedule | Immediate | Business hours |
| Webhooks | Test endpoint | Production endpoint |

### What to Verify

| Check | Expected |
|-------|----------|
| Campaign created successfully | Yes |
| Calls placed to all test contacts | Yes |
| Retry logic works for unanswered calls | Yes |
| Webhooks fire for each call | Yes |
| Campaign report shows correct stats | Yes |
| Recording URLs work (if enabled) | Yes |

## Step 7: Test Error Handling

Deliberately trigger error conditions to verify your application handles them correctly:

| Error Scenario | How to Trigger | Expected Handling |
|---------------|---------------|-------------------|
| Invalid number | Call/SMS to `+910000000000` | API returns error; your app logs it |
| Rate limit exceeded | Send 200+ requests in 1 minute | HTTP 429; your app implements backoff |
| Insufficient credits | Reduce balance to zero (or test with known limit) | API returns error; your app alerts |
| Invalid credentials | Use wrong API Token | HTTP 401; your app reports auth failure |
| Webhook timeout | Configure a slow endpoint (> 5 sec response) | Verify Exotel retries or skips |

## Step 8: Integration Testing

If you integrated Exotel with a CRM or other tools:

| Integration Test | Verification |
|-----------------|-------------|
| Click-to-call from CRM | Call initiates and logs in CRM |
| Inbound call screen pop | Caller info displays in CRM |
| Call recording in CRM | Recording link appears in call record |
| SMS sent from CRM | SMS delivers and logs in CRM |
| Webhook data in CRM | Call details create/update CRM records |

## Testing Environment Notes

### Trial Account Limitations

| Feature | Trial Limitation |
|---------|-----------------|
| Outbound calls | Limited minutes |
| SMS | Limited credits |
| Virtual numbers | Shared trial numbers |
| API rate limits | Reduced |
| Call recording | Limited storage |
| WhatsApp | Not available |

### Sandbox vs. Production

| Environment | API Base URL | Purpose |
|-------------|-------------|---------|
| Production (Singapore) | `api.exotel.com` | Live traffic |
| Production (India) | `api.in.exotel.com` | Live traffic |

:::info
Exotel does not have a separate sandbox environment. Testing is done on the production API with your trial or production credentials. Use your trial account for initial testing, then switch to production credentials for final validation.
:::

## Common Test Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Test call does not connect | ExoPhone not assigned to a flow | Assign a call flow to your ExoPhone |
| SMS not delivered | DLT template not approved | Check template status on DLT portal |
| Webhook not received | Endpoint not publicly accessible | Use ngrok or similar tunneling tool |
| Call recordings missing | Recording not enabled in call flow | Enable recording in the Connect applet |
| API returns 404 | Wrong region URL or Account SID | Use the correct regional base URL |

## Next Steps

- [Go-Live Checklist](/docs/getting-started/go-live-checklist) -- Production readiness checklist
- [API Credentials](/docs/getting-started/api-credentials) -- Credential management
- [Troubleshooting](/docs/faqs/troubleshooting) -- Common issues and solutions
