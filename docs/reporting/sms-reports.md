---
id: sms-reports
title: SMS Delivery Reports
description: "Track SMS delivery status, DLT compliance, error codes, and delivery rates with Exotel SMS reporting tools."
sidebar_label: SMS Reports
sidebar_position: 3
---

# SMS Delivery Reports

SMS reports provide visibility into the delivery lifecycle of every message sent through Exotel. Track delivery success rates, identify DLT compliance issues, and troubleshoot failed deliveries.

## Viewing SMS Reports in the Dashboard

1. Log in to [my.exotel.com](https://my.exotel.com)
2. Navigate to **Reports** > **SMS Logs**
3. The default view shows the last 24 hours of SMS activity

### SMS Report Fields

| Field | Description |
|-------|-------------|
| **SMS SID** | Unique identifier for the message |
| **Date/Time** | When the SMS was submitted |
| **From** | Sender ID (header) |
| **To** | Recipient phone number |
| **Body** | Message content |
| **Status** | Current delivery status |
| **Detailed Status** | Granular delivery status from the operator |
| **DLT Template ID** | Registered DLT template identifier |
| **DLT Entity ID** | Registered DLT entity identifier |
| **Price** | SMS cost |
| **Units** | Number of SMS units consumed (long messages use multiple units) |

## SMS Status Values

### Primary Status

| Status | Meaning |
|--------|---------|
| `queued` | Message accepted and queued for sending |
| `sending` | Message dispatched to the carrier |
| `submitted` | Message submitted to the operator gateway |
| `sent` | Message sent successfully to the carrier network |
| `delivered` | Message confirmed delivered to the handset |
| `failed` | Message delivery failed |
| `failed-dnd` | Message blocked -- recipient is on the Do Not Disturb list |

### Detailed Status Codes

| Detailed Status | Description |
|----------------|-------------|
| `DELIVERED_TO_HANDSET` | Successfully delivered to the recipient's phone |
| `PENDING` | Awaiting delivery confirmation from the operator |
| `SENT_TO_OPERATOR` | Dispatched to the mobile operator |
| `FAILED_DND` | Blocked by DND (Do Not Disturb) registry |
| `FAILED_INVALID_NUMBER` | Invalid or unreachable phone number |
| `FAILED_OPERATOR_ERROR` | Operator-side delivery failure |
| `FAILED_EXPIRED` | Message TTL expired before delivery |
| `FAILED_DLT_SCRUBBING` | Blocked by DLT template/entity validation |
| `FAILED_CONTENT_MISMATCH` | Message body does not match registered DLT template |

## DLT Status Tracking

For messages sent to Indian numbers, DLT compliance is mandatory. The SMS report includes DLT-specific status information.

### DLT Compliance Fields

| Field | Description |
|-------|-------------|
| `DltEntityId` | Your registered DLT entity ID |
| `DltTemplateId` | The DLT template ID used for the message |
| `DltContentCategory` | Template category (transactional, promotional, service) |
| `DltScrubStatus` | Whether the message passed DLT scrubbing |

### Common DLT Failures

| Issue | Cause | Resolution |
|-------|-------|------------|
| Template mismatch | Message body does not match registered template | Ensure message exactly matches the DLT-registered template, including variables |
| Entity ID invalid | DLT entity ID not recognized | Verify your entity ID is correct and active on the DLT portal |
| Template not approved | Template pending approval or rejected | Check template status on your DLT portal (Jio, Airtel, Vi) |
| Header mismatch | Sender ID not registered for the template | Register the sender header on your DLT portal |

:::warning
DLT scrubbing failures result in permanent message rejection. The message will not be retried. Always validate your DLT template content before sending production messages.
:::

## Filtering SMS Reports

### Available Filters

| Filter | Options |
|--------|---------|
| **Date range** | Today, Yesterday, Last 7 days, Last 30 days, Custom |
| **Status** | Delivered, Failed, Queued, Sent |
| **Phone number** | Search by recipient number |
| **Sender ID** | Filter by sender header |
| **DLT Template ID** | Filter by specific template |

### Search by Phone Number

Enter the recipient's number to view all messages sent to that number:

```
+919876543210
```

or without country code:

```
09876543210
```

## Accessing SMS Reports via API

### Check Single SMS Status

```bash
curl "https://$EXOTEL_API_KEY:$EXOTEL_API_TOKEN@$EXOTEL_SUBDOMAIN/v1/Accounts/$EXOTEL_ACCOUNT_SID/SMS/Messages/YOUR_SMS_SID.json"
```

**Response:**

```json
{
  "SMSMessage": {
    "Sid": "a1b2c3d4e5f6",
    "AccountSid": "your_sid",
    "From": "EXOTEL",
    "To": "+919876543210",
    "Body": "Your OTP is 123456",
    "Status": "sent",
    "DetailedStatus": "DELIVERED_TO_HANDSET",
    "DateCreated": "2026-03-05 14:30:00",
    "DateSent": "2026-03-05 14:30:02",
    "DateUpdated": "2026-03-05 14:30:05",
    "Price": "0.25",
    "Units": 1
  }
}
```

See [SMS Details API](/docs/sms-api/api-reference/sms-details) for full reference.

### Bulk SMS Status

For bulk sends, retrieve status for all messages in a batch:

```bash
curl "https://$EXOTEL_API_KEY:$EXOTEL_API_TOKEN@$EXOTEL_SUBDOMAIN/v1/Accounts/$EXOTEL_ACCOUNT_SID/SMS/Messages.json?DateCreated=gte:2026-03-05%2000:00:00;lte:2026-03-05%2023:59:59&PageSize=100"
```

### Delivery Webhooks

Instead of polling, configure a `StatusCallback` URL when sending SMS to receive real-time delivery notifications:

```bash
curl -X POST "https://$EXOTEL_API_KEY:$EXOTEL_API_TOKEN@$EXOTEL_SUBDOMAIN/v1/Accounts/$EXOTEL_ACCOUNT_SID/Sms/send" \
  -d "From=EXOTEL" \
  -d "To=+919876543210" \
  -d "Body=Your OTP is 123456" \
  -d "StatusCallback=https://your-server.com/sms-status"
```

See [SMS Webhooks](/docs/references/webhooks#sms-delivery-callback) for payload format.

## SMS Delivery Metrics

### Key Metrics to Track

| Metric | Formula | Healthy Range |
|--------|---------|---------------|
| Delivery rate | `delivered / (total - queued) * 100` | >95% |
| DND block rate | `failed_dnd / total * 100` | \<5% (varies by use case) |
| DLT failure rate | `failed_dlt / total * 100` | 0% (fix templates) |
| Average delivery time | `AVG(DateUpdated - DateCreated)` | \<10 seconds |

:::tip
A sudden increase in DLT failure rates usually indicates a template change that no longer matches the registered DLT template. Compare your current message format against the registered template on your DLT portal.
:::

## Exporting SMS Reports

### Dashboard Export

1. Apply your filters in the SMS Logs view
2. Click **Export** > **CSV** or **Excel**
3. Download includes all visible fields plus DLT metadata

### Automated Export

Set up [Scheduled Reports](/docs/reporting/scheduled-reports) to receive daily SMS delivery summaries via email.

## Related Resources

- [Send SMS API](/docs/sms-api/api-reference/send-sms) -- API reference for sending messages
- [Bulk SMS API](/docs/sms-api/api-reference/bulk-sms) -- Send messages at scale
- [SMS Status Codes](/docs/sms-api/api-reference/status-codes) -- Complete status code reference
- [Webhooks](/docs/references/webhooks#sms-delivery-callback) -- Real-time delivery notifications
