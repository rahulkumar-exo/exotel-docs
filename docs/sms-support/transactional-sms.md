---
id: transactional-sms
title: Transactional SMS
description: "Guide to sending transactional SMS via Exotel including OTPs, alerts, and order updates with 24/7 delivery and DND bypass."
sidebar_label: Transactional SMS
sidebar_position: 7
---

# Transactional SMS

Transactional SMS are messages triggered by a user action or system event, such as OTPs, order confirmations, account alerts, and payment notifications. Unlike promotional SMS, transactional messages can be delivered 24/7 and bypass the DND (Do Not Disturb) registry.

## What Is Transactional SMS?

Transactional SMS is used for time-sensitive, informational messages that are essential for the recipient. These messages are non-marketing in nature and serve a functional purpose.

### Characteristics

| Feature | Transactional SMS |
|---------|-------------------|
| **Delivery Window** | 24 hours / 7 days (no time restriction) |
| **DND Bypass** | Yes -- delivered to DND-registered numbers |
| **Sender ID Format** | 6 alphabetic characters (e.g., `EXOTL`) |
| **DLT Template Type** | Transactional (`T`) |
| **Use Cases** | OTPs, alerts, confirmations, statements |

## Common Use Cases

| Use Case | Example Message |
|----------|-----------------|
| **OTP Verification** | "Your OTP is 456789. Valid for 5 minutes. Do not share with anyone." |
| **Order Confirmation** | "Your order #12345 has been confirmed. Expected delivery: 5 Mar 2026." |
| **Shipping Update** | "Your order #12345 has been shipped via BlueDart. Tracking ID: BD123456." |
| **Payment Alert** | "Rs. 5,000 debited from your account ending XX1234. Balance: Rs. 25,000." |
| **Appointment Reminder** | "Reminder: Your appointment with Dr. Sharma is scheduled for tomorrow at 10 AM." |
| **Account Alert** | "Login detected from a new device. If not you, call 1800-XXX-XXXX immediately." |

## Sending Transactional SMS

### Via API

Use the [Send SMS API](/docs/sms-api/api-reference/send-sms) with `SmsType=transactional`:

```bash
curl -X POST "https://<api_key>:<api_token>@api.exotel.com/v1/Accounts/<account_sid>/Sms/send" \
  -d "From=EXOTL" \
  -d "To=+919876543210" \
  -d "Body=Your OTP is 456789. Valid for 5 minutes. Do not share with anyone." \
  -d "SmsType=transactional" \
  -d "DltEntityId=1234567890123" \
  -d "DltTemplateId=1107160000000012345" \
  -d "StatusCallback=https://your-server.com/sms-status"
```

### Via Dashboard

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Go to **App Bazaar** > **SMS** > **Send SMS**.
3. Select your transactional sender ID.
4. Choose a transactional template.
5. Enter the recipient number and send.

## Transactional SMS vs Promotional SMS

| Feature | Transactional | Promotional |
|---------|---------------|-------------|
| Purpose | Informational, user-initiated | Marketing, offers |
| Delivery Time | 24/7 | 9 AM -- 9 PM only |
| DND Bypass | Yes | No |
| Sender ID | Alphabetic (6 chars) | Numeric (6 digits) |
| DLT Template Type | `T` | `P` |
| Content Restrictions | Must be non-promotional | Can contain offers/discounts |

:::warning
Do not use transactional SMS routes for promotional content. TRAI and telecom operators actively monitor message content. Misuse can result in your sender ID being blocked and your DLT entity suspended.
:::

## Transactional SMS Sub-types

Exotel supports two sub-types of transactional SMS:

### Standard Transactional (`transactional`)

- Triggered by system events or user actions.
- Does not require explicit user opt-in.
- Example: OTPs, order updates, payment alerts.

### Transactional Opt-in (`transactional_opt_in`)

- Requires verifiable user opt-in.
- Used for service-related messages where consent is needed.
- Example: Subscription renewal reminders, service updates.

## DLT Configuration for Transactional SMS

1. **Template Type**: Register templates as `Transactional` on your DLT portal.
2. **Header Type**: Use a `Transactional` type header (6 alphabetic characters).
3. **Content Guidelines**: Message content must be strictly informational and non-promotional.

## Best Practices

1. **Keep OTPs short-lived** -- Set OTP expiry to 5-10 minutes and mention the validity in the message.
2. **Include context** -- Always mention what the OTP or alert is for (e.g., "OTP for order #12345" rather than just "Your OTP is 456789").
3. **Use priority flag** -- For time-critical messages like OTPs, set `Priority=high` in the API call.
4. **Set up status callbacks** -- Configure webhooks to track delivery in real time. See [SMS Webhooks](/docs/sms-support/sms-webhooks).
5. **Handle failures gracefully** -- Implement retry logic for failed messages, especially for OTPs.
6. **Do not include URLs in OTP messages** -- This can trigger spam filters.

## Delivery Rates

Transactional SMS typically have higher delivery rates than promotional SMS because:

- They bypass DND filters.
- They are prioritized by telecom operators.
- They have no time-window restrictions.

Expected delivery rate for transactional SMS: **95-99%** (depending on network conditions and number validity).

## Next Steps

- [Promotional SMS](/docs/sms-support/promotional-sms) -- Learn about promotional messaging
- [SMS Delivery Reports](/docs/sms-support/sms-delivery-reports) -- Track delivery status
- [SMS Templates](/docs/sms-support/sms-templates) -- Manage message templates
- [SMS API Reference](/docs/sms-api/api-reference/send-sms) -- API documentation
