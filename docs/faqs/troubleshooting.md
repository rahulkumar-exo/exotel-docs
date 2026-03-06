---
id: troubleshooting
title: Troubleshooting FAQs
description: "Common Exotel issues and solutions for call drops, SMS failures, API errors, webhook problems, and audio quality."
sidebar_label: Troubleshooting
sidebar_position: 7
---

# Troubleshooting FAQs

Solutions to common issues encountered when using Exotel's voice, SMS, and API services.

---

## My outbound calls are failing. What should I check?

If outbound calls are not connecting, verify the following in order:

1. **Account balance** -- Ensure you have sufficient credits. Check balance in the Exotel Dashboard under **Billing**.
2. **KYC status** -- Outbound calls require completed KYC verification.
3. **Number format** -- Use the full 10-digit Indian mobile number without country code prefix (e.g., `9876543210`, not `+919876543210` for v1 APIs).
4. **API credentials** -- Verify your API Key and Token are correct. Test with a simple GET request first.
5. **Rate limits** -- Check if you are exceeding 200 requests/min. A `429` response indicates rate limiting.
6. **ExoPhone status** -- Ensure the virtual number used as caller ID is active and not expired.

```bash
# Test your credentials with a simple API call
curl -u '<api_key>:<api_token>' \
  'https://api.exotel.com/v1/Accounts/<account_sid>/Calls.json'
```

:::tip
Check the call status using the [Call Details API](/docs/voice-v1/api-reference/call-details) with the CallSid to see the exact failure reason.
:::

---

## Why are my calls getting disconnected after a few seconds?

Common causes for premature call disconnection:

| Cause | Solution |
|---|---|
| **Insufficient balance** | Recharge your account |
| **Call flow misconfiguration** | Check for missing applets or broken flow paths in your IVR |
| **StatusCallback timeout** | Ensure your webhook endpoint responds within 15 seconds |
| **Passthru applet timeout** | Your application URL must respond within the configured timeout |
| **Carrier issues** | Temporary carrier routing problems -- retry after a few minutes |

If using the Passthru applet, your server must return a valid response within the timeout period. Slow responses cause the call to drop.

---

## My SMS messages are not being delivered. Why?

SMS delivery failures can occur for several reasons:

1. **DLT registration** -- For Indian numbers, DLT Entity ID and Template ID are mandatory. Missing or incorrect DLT parameters cause immediate rejection.
2. **DND/NDNC** -- The recipient may be on the National Do Not Call registry. Promotional SMS cannot be sent to DND-registered numbers. See [NDNC/DND Compliance](/docs/faqs/ndnc-dnd).
3. **Template mismatch** -- The message body must exactly match the approved DLT template, including variable placeholders.
4. **Character encoding** -- Unicode messages (Hindi, regional languages) have a 70-character limit per segment vs. 160 for GSM-7.
5. **Time window restrictions** -- Promotional SMS can only be sent between 9 AM and 9 PM IST. See [Calling Hours](/docs/faqs/calling-hours).

:::warning
Always include both `DltEntityId` and `DltTemplateId` parameters when sending SMS to Indian numbers. Omitting these results in delivery failure with no error at the API level.
:::

---

## I am getting HTTP 401 Unauthorized errors. How do I fix this?

HTTP 401 indicates an authentication failure. Check:

1. **API Key and Token** -- Verify they are correct in **Settings > API Settings** on the dashboard
2. **Encoding** -- If using the Authorization header, ensure credentials are properly Base64-encoded
3. **Regional endpoint** -- Use the correct subdomain for your account region (`api.exotel.com` or `api.in.exotel.com`)
4. **Account status** -- Suspended or deactivated accounts return 401
5. **Special characters** -- If your API key or token contains special characters, ensure they are properly URL-encoded when embedded in the URL

```bash
# Verify credentials with verbose output
curl -v -u '<api_key>:<api_token>' \
  'https://api.exotel.com/v1/Accounts/<account_sid>/Calls.json'
```

---

## My webhook (StatusCallback) is not receiving data. What is wrong?

Troubleshoot webhook issues step by step:

1. **URL accessibility** -- Ensure your endpoint is publicly accessible from the internet (not localhost)
2. **HTTPS** -- Exotel strongly recommends HTTPS endpoints. HTTP may work but is not recommended.
3. **Response code** -- Your endpoint must return HTTP 200 within 15 seconds
4. **Firewall rules** -- Whitelist Exotel's IP ranges in your firewall (contact support for current IP list)
5. **URL encoding** -- Ensure the callback URL is properly encoded in your API request
6. **POST handling** -- Webhooks are sent as `application/x-www-form-urlencoded` POST requests, not JSON

Test with a public webhook inspector:

```bash
# Use webhook.site to test callback delivery
curl -X POST \
  -u '<api_key>:<api_token>' \
  "https://api.exotel.com/v1/Accounts/<account_sid>/Calls/connect.json" \
  -d "From=<exophone>" \
  -d "To=<destination>" \
  -d "CallerId=<exophone>" \
  -d "StatusCallback=https://webhook.site/your-unique-id"
```

---

## Calls have poor audio quality. How can I improve it?

Audio quality issues and their solutions:

| Issue | Possible Cause | Solution |
|---|---|---|
| Choppy audio | Network jitter | Ensure stable internet with low latency (\<100ms) |
| Echo | Acoustic feedback | Use headsets instead of speakerphone |
| One-way audio | NAT/firewall blocking | Open required UDP ports and whitelist Exotel IPs |
| Low volume | Recording bitrate | Check audio file encoding for IVR prompts (8kHz, 16-bit, mono WAV recommended) |
| Background noise | Microphone sensitivity | Use noise-canceling headsets for agents |

:::info
For WebRTC-based calling (IP/PSTN), ensure your network allows UDP traffic on the required port ranges. Contact Exotel support for the specific ports and IPs to whitelist.
:::

---

## My Zoho integration is not working. What should I check?

Common Zoho integration issues:

1. **Account name spaces** -- Ensure account names have no blank spaces in Steps 8 and 11 of the integration setup
2. **Phone number format** -- User phone numbers must match exactly across Exotel and Zoho
3. **Click-to-call** -- Verify click-to-call is enabled in the integration settings
4. **KYC and credits** -- Both must be in order for outbound calls to work
5. **Pop-up blocked** -- Browser pop-up blockers may prevent inbound call notifications

For detailed integration setup, see the [Integrations](/docs/integrations/overview) documentation.

---

## API requests are very slow. How do I improve performance?

Strategies to improve API response times:

1. **Use the correct regional endpoint** -- Use `api.in.exotel.com` for India-based accounts to reduce latency
2. **Connection pooling** -- Reuse HTTP connections instead of creating new ones per request
3. **Async processing** -- Use webhooks for status updates instead of polling the API
4. **Batch operations** -- Use bulk SMS endpoints instead of individual sends
5. **Reduce payload size** -- Only request the fields you need where supported

```python
# Use connection pooling with requests.Session
import requests

session = requests.Session()
session.auth = (api_key, api_token)

# All requests in this session reuse the connection
response = session.get(f"https://api.in.exotel.com/v1/Accounts/{sid}/Calls.json")
```

---

## I am seeing "Number not found" or "Invalid number" errors.

This error occurs when the destination number is not valid. Check:

- **Number format** -- Use 10-digit format for Indian numbers (no country code prefix for v1 APIs)
- **Active number** -- The number may be disconnected or out of service
- **Number type** -- Some APIs only work with mobile numbers, not landline
- **Metadata check** -- Use the [Number Metadata API](/docs/voice-v1/api-reference/number-metadata) to verify the number's operator and circle

```bash
# Check number metadata
curl -u '<api_key>:<api_token>' \
  'https://api.exotel.com/v1/Accounts/<account_sid>/Numbers/9876543210.json'
```

---

## How do I contact Exotel support?

Exotel support is available through multiple channels:

| Channel | Details |
|---|---|
| **Email** | hello@exotel.com |
| **Dashboard** | Raise a ticket via **Help > Support** in the dashboard |
| **Account Manager** | Dedicated AM for enterprise customers |
| **Phone** | Available for enterprise plans |

:::tip
When contacting support, include your Account SID, the specific CallSid or SmsSid for the affected transaction, timestamps, and any error messages. This helps the support team diagnose issues faster.
:::

---

## Related Resources

- [Authentication & Security](/docs/references/authentication) -- Credential setup and error handling
- [Voice v1 API](/docs/voice-v1/overview) -- Voice API reference and call status codes
- [SMS API](/docs/sms-api/overview) -- SMS API reference
- [Error Codes](/docs/references/error-codes) -- Complete error code dictionary
- [DLT Compliance](/docs/faqs/dlt-compliance) -- DLT registration requirements for SMS
