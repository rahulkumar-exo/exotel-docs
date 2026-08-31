---
title: SMS FAQs
description: "Frequently asked questions about Exotel SMS API including DLT requirements, delivery rates, character limits, sender IDs, and troubleshooting."
sidebar_label: SMS FAQs
sidebar_position: 19
---

# SMS FAQs

Common questions about Exotel's SMS API, DLT compliance, delivery rates, character limits, sender IDs, and troubleshooting.

---

## Do I need DLT registration to send SMS?

**For India:** Yes. DLT registration is mandatory for all commercial SMS in India. You need:

- **Entity ID** (business registration on a DLT portal)
- **Sender ID** (registered header/brand name)
- **Template ID** (pre-approved message template)

**For other regions:** DLT is an India-specific regulation. SMS sent from the Singapore region to non-Indian numbers does not require DLT. However, other local regulations may apply.

See [DLT Compliance](/docs/faqs/dlt-compliance) for the complete registration guide.

---

## Why is my SMS not being delivered?

Common delivery failure reasons and solutions:

| Symptom | Likely Cause | Solution |
|---------|-------------|----------|
| All SMS failing | Invalid DLT Entity ID or Template ID | Verify credentials on DLT portal |
| SMS to specific numbers failing | Number is DND-registered (promotional SMS) | Use transactional route or remove DND numbers |
| "Content mismatch" error | Message body does not match DLT template | Ensure exact template match after variable substitution |
| SMS stuck in "submitted" | Operator delivery delay | Wait; check status after 5-10 minutes |
| SMS showing "expired" | Handset was off during validity period | Recipient's phone was unreachable |
| "Sender ID mismatch" | Sender ID not associated with template | Use the correct Sender ID for this template |
| SMS blocked by operator | Content flagged as spam or violation | Review message content; contact operator |

:::tip
When debugging SMS delivery issues, start by sending a single test message to your own phone number. If the test succeeds, the issue is likely with specific recipient numbers (DND, invalid) rather than your configuration.
:::

---

## What are the SMS character limits?

| Encoding | Single SMS | Multi-Part Per Segment |
|----------|-----------|----------------------|
| **GSM 7-bit** (Latin characters) | 160 characters | 153 characters |
| **Unicode** (regional languages, special characters) | 70 characters | 67 characters |

### When Unicode Is Used

Unicode encoding is automatically applied when your message contains:

- Regional language characters (Hindi, Tamil, Bengali, etc.)
- Certain special characters not in the GSM 7-bit alphabet
- Emoji characters

:::warning
Unicode messages have significantly lower character limits. A message that fits in 1 SMS using GSM encoding may require 2-3 SMS using Unicode. Each part is billed separately. Keep messages concise and avoid unnecessary special characters.
:::

### Multi-Part SMS Billing

| Message Length (GSM) | SMS Parts | Billed As |
|---------------------|-----------|-----------|
| 1--160 characters | 1 | 1 SMS |
| 161--306 characters | 2 | 2 SMS |
| 307--459 characters | 3 | 3 SMS |

| Message Length (Unicode) | SMS Parts | Billed As |
|-------------------------|-----------|-----------|
| 1--70 characters | 1 | 1 SMS |
| 71--134 characters | 2 | 2 SMS |
| 135--201 characters | 3 | 3 SMS |

---

## What is a Sender ID and how do I register one?

A Sender ID (also called a Header) is the name that appears as the message sender on the recipient's phone.

| Type | Format | Example | Use Case |
|------|--------|---------|----------|
| Alphabetical | 6 letters | `EXOTL` | Transactional messages |
| Numeric | 6 digits | `567890` | Promotional messages |

### Registration Process

1. Log in to your DLT portal
2. Navigate to **Headers / Sender IDs**
3. Submit your desired Sender ID
4. Wait for approval (1-2 business days)
5. Associate the Sender ID with your templates

:::info
Sender IDs must be unique across the DLT ecosystem. If your first choice is taken, try abbreviations or variations of your brand name.
:::

---

## Can I send SMS in regional languages?

Yes. Exotel supports Unicode SMS for all Indian regional languages including Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, and others.

**Requirements:**

1. Register your DLT template with **Unicode content type** on the DLT portal
2. Ensure your API request sends the message in proper UTF-8 encoding
3. Be aware of the lower character limit (70 characters per SMS for Unicode)

---

## What is the SMS delivery rate I should expect?

Delivery rates vary based on several factors:

| Factor | Impact on Delivery Rate |
|--------|----------------------|
| List quality (valid numbers) | High impact |
| DND filtering (promotional SMS) | High impact |
| Time of sending | Moderate impact |
| Network congestion | Low-moderate impact |
| DLT template compliance | High impact |

### Expected Delivery Rates

| SMS Type | Expected Rate | Notes |
|----------|--------------|-------|
| Transactional (clean list) | 95--99% | Highest delivery, no DND filtering |
| Service messages | 90--97% | Some DND impact |
| Promotional (DND-filtered list) | 85--95% | After removing DND numbers |
| Promotional (unfiltered list) | 60--80% | DND numbers cause failures |

---

## How fast are SMS delivered?

| SMS Type | Typical Delivery Time | Notes |
|----------|---------------------|-------|
| Transactional (OTP) | 1--5 seconds | Priority routing |
| Transactional (alerts) | 2--10 seconds | Standard routing |
| Promotional | 5--30 seconds | May queue during peak hours |
| Bulk campaign | Varies | Depends on volume and throttle settings |

:::info
Delivery time is measured from Exotel submitting the message to the operator until the handset acknowledges receipt. Factors like operator load, recipient's network, and handset status affect delivery time.
:::

---

## Can I include URLs in SMS?

Yes, but keep the following in mind:

1. **DLT template**: URLs must be represented as `{#var#}` in your registered template
2. **URL shortening**: Long URLs consume character space; use Exotel's URL shortening feature
3. **HTTPS recommended**: Some operators may block HTTP URLs
4. **Tracking**: Shortened URLs can include click tracking

```bash
# Shorten a URL
curl -u '<api_key>:<api_token>' -X POST "https://api.exotel.com/v2/accounts/<account_sid>/url-shortener" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.example.com/track/order/ORD-2024-001"}'
```

> **API Reference:** See the [URL Shortening API](/docs/url-shortening/overview) for details.

---

## Can I schedule SMS for later delivery?

**Individual SMS (API):** The standard SMS API sends messages immediately. To schedule, implement scheduling in your application and trigger the API at the desired time.

**SMS Campaigns:** Campaign API supports scheduling with `send_at` and `end_at` parameters:

```json
"schedule": {
  "send_at": "2024-02-15T10:00:00+05:30",
  "end_at": "2024-02-15T18:00:00+05:30"
}
```

See [Creating an SMS Campaign](/docs/campaign-guides/creating-sms-campaign) for details.

---

## How do I check SMS delivery status?

### Per-Message Status

```bash
curl -u '<api_key>:<api_token>' "https://api.exotel.com/v2/accounts/<account_sid>/sms/<sms_sid>"
```

### Via Webhook

Configure a `StatusCallback` URL in your SMS API request to receive delivery updates:

```json
{
  "StatusCallback": "https://your-server.com/webhooks/sms-status"
}
```

### In the Dashboard

Navigate to **SMS** in the left sidebar to view all sent messages with delivery status.

---

## What SMS status codes should I monitor?

| Status | Meaning | Action |
|--------|---------|--------|
| `queued` | Message accepted, waiting to be sent | No action; normal processing |
| `sending` | Message being transmitted to operator | No action; in transit |
| `submitted` | Handed off to telecom operator | Wait for delivery confirmation |
| `delivered` | Confirmed delivered to handset | Success |
| `failed` | Delivery failed | Check error code; fix and retry if appropriate |
| `rejected` | Rejected before submission (DLT, DND, validation) | Fix the root cause |

> **API Reference:** See [SMS Status Codes](/docs/sms-api/api-reference/status-codes) for complete status code documentation.

---

## Related Resources

- [SMS API Overview](/docs/sms-api/overview) -- Complete SMS API documentation
- [SMS API Quickstart](/docs/sms-api/quickstart) -- Send your first SMS
- [DLT Compliance](/docs/faqs/dlt-compliance) -- DLT registration guide
- [SMS Campaign Templates](/docs/campaign-guides/sms-campaign-templates) -- Template management
- [Troubleshooting](/docs/faqs/troubleshooting) -- General troubleshooting guide
