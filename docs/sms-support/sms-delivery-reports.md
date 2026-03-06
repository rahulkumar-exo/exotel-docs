---
id: sms-delivery-reports
title: SMS Delivery Reports
description: "Understand SMS delivery reports (DLRs) on Exotel -- track message status, configure callbacks, and interpret delivery statuses in real time."
sidebar_label: Delivery Reports
sidebar_position: 10
---

# SMS Delivery Reports

Delivery reports (DLRs) provide real-time feedback on the status of every SMS you send through Exotel. This guide covers how to configure, receive, and interpret delivery reports.

## What Are Delivery Reports?

A delivery report is a status notification that tells you whether an SMS was successfully delivered to the recipient's handset, is still in transit, or has failed. Exotel supports two methods for receiving delivery reports:

| Method | Description | Best For |
|--------|-------------|----------|
| **Webhook Callbacks** | Exotel pushes status updates to your server | Real-time processing, production systems |
| **API Polling** | You query the SMS Details API for status | Ad-hoc checks, debugging |
| **Dashboard** | View reports in the Exotel web console | Manual review, reporting |

:::tip
Webhook callbacks are the recommended approach for production systems. They provide near-instant status updates without the overhead of polling. See [SMS Webhooks](/docs/sms-support/sms-webhooks) for detailed setup instructions.
:::

## Delivery Report Flow

```
Your App → Exotel API → Operator → Handset
                ↓
         Status Callback ← Operator DLR
                ↓
         Your Webhook Endpoint
```

1. **Message Submitted** -- Your app sends an SMS via the Exotel API.
2. **Queued** -- Exotel accepts the message and queues it for delivery.
3. **Sent to Operator** -- Exotel transmits the message to the telecom operator.
4. **Delivered / Failed** -- The operator confirms delivery to the handset or reports a failure.
5. **Callback Sent** -- Exotel forwards the delivery status to your configured webhook URL.

## Configuring Delivery Report Callbacks

### Per-Message Callback

Set the `StatusCallback` parameter when sending an SMS to receive the delivery report at a specific URL:

```bash
curl -X POST "https://<api_key>:<api_token>@api.exotel.com/v1/Accounts/<account_sid>/Sms/send" \
  -d "From=EXOTL" \
  -d "To=+919876543210" \
  -d "Body=Your OTP is 123456" \
  -d "DltEntityId=1234567890123" \
  -d "DltTemplateId=1107160000000012345" \
  -d "StatusCallback=https://your-server.com/sms/status"
```

### Account-Level Callback

Configure a default callback URL for all SMS in your Exotel dashboard:

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Navigate to **Settings** > **SMS Settings**.
3. Enter your default **Status Callback URL**.
4. Save the settings.

:::note
Per-message callbacks override the account-level callback URL. If you set `StatusCallback` in the API request, it takes precedence.
:::

## Delivery Report Payload

When Exotel sends a delivery report to your webhook, the payload includes the following fields:

| Field | Description | Example |
|-------|-------------|---------|
| `SmsSid` | Unique identifier for the SMS | `sms_sid_value` |
| `To` | Recipient phone number | `+919876543210` |
| `From` | Sender ID | `EXOTL` |
| `Status` | Current delivery status | `delivered` |
| `DetailedStatus` | Detailed status description | `DELIVERED_TO_HANDSET` |
| `DetailedStatusCode` | Numeric status code | `20000` |
| `SentAt` | Timestamp when SMS was sent | `2025-01-15 10:30:00` |
| `UpdatedAt` | Timestamp of the status update | `2025-01-15 10:30:05` |

### Sample Callback Payload

```json
{
  "SmsSid": "a1b2c3d4e5f6",
  "AccountSid": "your_account_sid",
  "From": "EXOTL",
  "To": "+919876543210",
  "Body": "Your OTP is 123456",
  "Status": "delivered",
  "DetailedStatus": "DELIVERED_TO_HANDSET",
  "DetailedStatusCode": 20000,
  "SentAt": "2025-01-15T10:30:00+05:30",
  "UpdatedAt": "2025-01-15T10:30:05+05:30"
}
```

## Delivery Statuses

| Status | DetailedStatus | Description |
|--------|----------------|-------------|
| `queued` | `QUEUED` | Message accepted and queued for sending |
| `sending` | `SENDING` | Message is being transmitted to the operator |
| `submitted` | `SUBMITTED_TO_CARRIER` | Message submitted to the telecom operator |
| `sent` | `SENT` | Message sent by the operator (awaiting handset confirmation) |
| `delivered` | `DELIVERED_TO_HANDSET` | Message delivered to the recipient's phone |
| `failed` | Various (see below) | Message delivery failed |
| `expired` | `EXPIRED` | Operator could not deliver within the validity period |

### Failed Status Codes

| DetailedStatus | Code | Cause | Resolution |
|----------------|------|-------|------------|
| `FAILED_DLT_TEMPLATE` | 30001 | Message does not match DLT template | Ensure message body matches the approved template exactly |
| `FAILED_DLT_ENTITY` | 30002 | Invalid DLT entity ID | Verify your entity ID in your DLT portal account |
| `FAILED_INVALID_SENDER` | 30003 | Sender ID not registered | Register and approve your sender ID on the DLT portal |
| `FAILED_DND` | 30004 | Recipient on DND registry | Use transactional SMS for critical messages |
| `FAILED_INVALID_NUMBER` | 30005 | Invalid or unreachable phone number | Verify the recipient's phone number |
| `FAILED_OPERATOR` | 30010 | Operator-side delivery failure | Retry after some time; contact support for persistent failures |
| `FAILED_EXPIRED` | 30011 | Message validity period expired | Recipient may have been out of coverage; resend if needed |
| `FAILED_UNKNOWN` | 30099 | Unknown failure | Contact Exotel support with the SmsSid |

For the complete list of status codes, see [SMS Status Codes](/docs/sms-support/sms-status-codes).

## Polling via API

If you prefer to check delivery status on demand, use the [SMS Details API](/docs/sms-api/api-reference/sms-details):

```bash
curl "https://<api_key>:<api_token>@api.exotel.com/v1/Accounts/<account_sid>/Sms/Messages/<sms_sid>"
```

Response:

```json
{
  "SMSMessage": {
    "Sid": "a1b2c3d4e5f6",
    "Status": "delivered",
    "DetailedStatus": "DELIVERED_TO_HANDSET",
    "DetailedStatusCode": 20000,
    "DateCreated": "2025-01-15T10:30:00+05:30",
    "DateUpdated": "2025-01-15T10:30:05+05:30",
    "From": "EXOTL",
    "To": "+919876543210",
    "Body": "Your OTP is 123456",
    "Direction": "outbound-api",
    "Price": "0.20"
  }
}
```

## Delivery Report Timing

Delivery reports are typically received within seconds, but timing depends on the telecom operator:

| Scenario | Expected Time |
|----------|---------------|
| Successful delivery | 1-15 seconds |
| Handset off / out of coverage | Up to 24-72 hours (then expires) |
| DLT validation failure | Immediate (within seconds) |
| DND rejection | Immediate (within seconds) |
| Operator failure | 1-60 minutes |

:::warning
Do not assume a message has failed if you have not received a delivery report within a few seconds. Some operators may take several minutes to return a DLR, especially during high-traffic periods.
:::

## Best Practices

1. **Always configure status callbacks** -- Do not rely solely on manual checks. Automate delivery tracking with webhooks.
2. **Handle retries gracefully** -- If your webhook endpoint is down, Exotel retries the callback. Ensure your endpoint is idempotent.
3. **Log all delivery reports** -- Store delivery reports with the SmsSid for audit trails and debugging.
4. **Monitor failed statuses** -- Set up alerts for elevated failure rates, which may indicate DLT configuration issues.
5. **Use detailed status codes** -- The `DetailedStatus` field provides more granular information than the top-level `Status` field.

## Next Steps

- [SMS Webhooks](/docs/sms-support/sms-webhooks) -- Configure webhook endpoints
- [SMS Status Codes](/docs/sms-support/sms-status-codes) -- Full status code reference
- [SMS API Errors](/docs/sms-support/sms-api-errors) -- Troubleshoot API errors
- [SMS API Reference](/docs/sms-api/overview) -- API documentation
