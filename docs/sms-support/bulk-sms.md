---
id: bulk-sms
title: Bulk SMS
description: "Send bulk SMS to multiple recipients via Exotel -- API batch sends, CSV uploads, scheduling, and best practices for high-volume messaging."
sidebar_label: Bulk SMS
sidebar_position: 11
---

# Bulk SMS

Exotel's bulk SMS feature allows you to send messages to hundreds or thousands of recipients in a single operation. This guide covers API-based batch sends, CSV uploads via the dashboard, scheduling, and best practices for high-volume messaging.

## Bulk SMS Methods

| Method | Max Recipients | Use Case |
|--------|---------------|----------|
| **API -- Same Message** | 100 per request | Alerts, announcements, OTPs to multiple users |
| **API -- Dynamic Messages** | 100 per request | Personalized messages (name, order ID, etc.) |
| **Dashboard CSV Upload** | 10,000+ per file | Marketing campaigns, promotional blasts |
| **Dashboard Manual Entry** | 100 per send | Quick sends to a small group |

## Sending Bulk SMS via API

### Same Message to Multiple Recipients

Use the [Bulk SMS API](/docs/sms-api/api-reference/bulk-sms) to send the same message to up to 100 recipients in a single request:

```bash
curl -u '<api_key>:<api_token>' -X POST "https://api.exotel.com/v2/Accounts/<account_sid>/Sms/bulksend" \
  -H "Content-Type: application/json" \
  -d '{
    "sms": [
      {
        "From": "EXOTL",
        "To": ["+919876543210", "+919876543211", "+919876543212"],
        "Body": "Flash sale! 50% off on all items this weekend. Shop at https://example.com",
        "DltEntityId": "1234567890123",
        "DltTemplateId": "1107160000000012345"
      }
    ]
  }'
```

### Dynamic Messages (Personalized)

Send unique messages to different recipients in a single API call:

```bash
curl -u '<api_key>:<api_token>' -X POST "https://api.exotel.com/v2/Accounts/<account_sid>/Sms/bulksend" \
  -H "Content-Type: application/json" \
  -d '{
    "sms": [
      {
        "From": "EXOTL",
        "To": "+919876543210",
        "Body": "Hi Rahul, your order #ORD001 has been shipped. Track at https://example.com/ORD001",
        "DltEntityId": "1234567890123",
        "DltTemplateId": "1107160000000012345"
      },
      {
        "From": "EXOTL",
        "To": "+919876543211",
        "Body": "Hi Priya, your order #ORD002 has been shipped. Track at https://example.com/ORD002",
        "DltEntityId": "1234567890123",
        "DltTemplateId": "1107160000000012345"
      }
    ]
  }'
```

:::warning
Each message in a dynamic bulk send must still match an approved DLT template. Only the `{#var#}` placeholders should differ between messages. The static text must be identical to the template.
:::

### Bulk API Response

A successful bulk request returns HTTP 202 with individual status for each message:

```json
{
  "request_id": "req_abc123",
  "http_code": 202,
  "response": {
    "sms": [
      {
        "Sid": "sms_001",
        "To": "+919876543210",
        "Status": "queued",
        "StatusCode": 202
      },
      {
        "Sid": "sms_002",
        "To": "+919876543211",
        "Status": "queued",
        "StatusCode": 202
      }
    ]
  }
}
```

## Sending Bulk SMS via Dashboard

### CSV Upload

For large campaigns, upload a CSV file through the Exotel dashboard:

#### Step 1: Prepare Your CSV

Create a CSV file with the following format:

**Same message to all recipients:**

```csv
phone_number
+919876543210
+919876543211
+919876543212
+919876543213
```

**Personalized messages (with variables):**

```csv
phone_number,var1,var2
+919876543210,Rahul,ORD001
+919876543211,Priya,ORD002
+919876543212,Amit,ORD003
```

#### Step 2: Upload and Configure

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Navigate to **App Bazaar** > **SMS** > **Bulk SMS**.
3. Click **Upload CSV** and select your file.
4. Map columns:
   - **Phone Number Column** -- Select the column containing phone numbers.
   - **Variable Columns** -- Map CSV columns to template variables.
5. Select your **Sender ID** and **DLT Template**.
6. Preview a few sample messages to verify correctness.

#### Step 3: Send or Schedule

- Click **Send Now** to dispatch immediately.
- Click **Schedule** to choose a future date and time.

:::tip
Always preview your messages before sending a bulk campaign. Check at least 3-5 sample messages to ensure variables are mapped correctly.
:::

### CSV File Requirements

| Requirement | Details |
|-------------|---------|
| File format | `.csv` (comma-separated values) |
| Encoding | UTF-8 |
| Max file size | 10 MB |
| Phone number format | E.164 format recommended (e.g., `+919876543210`) |
| Header row | Required (column names) |
| Max rows | 10,000 per file (contact support for higher limits) |

## Scheduling Bulk SMS

### Via Dashboard

1. After uploading your CSV and configuring the campaign, click **Schedule**.
2. Select the date and time for delivery.
3. Choose the timezone.
4. Confirm the schedule.

### Via API

The Exotel API does not natively support scheduling. To schedule SMS via API:

1. Use a task scheduler (cron job, cloud scheduler, or message queue) on your server.
2. Trigger the bulk SMS API call at the desired time.

:::warning
Promotional SMS can only be delivered between 9:00 AM and 9:00 PM IST. If you schedule promotional SMS outside this window, they will be queued and delivered when the window opens.
:::

## Rate Limits and Throttling

| Limit | Value |
|-------|-------|
| API calls | 200 requests/minute |
| Messages per bulk request | 100 max |
| Dashboard CSV upload | 10,000 rows per file |
| Throughput | Varies by plan (contact account manager) |

For very high volumes (100,000+ messages), contact your Exotel account manager to discuss throughput optimization and dedicated routing.

## Monitoring Bulk Campaigns

### Dashboard Reports

1. Navigate to **App Bazaar** > **SMS** > **Reports**.
2. Filter by date range and campaign.
3. View aggregate statistics:
   - Total sent
   - Delivered
   - Failed
   - Pending

### API-Based Monitoring

Use the [SMS Details API](/docs/sms-api/api-reference/sms-details) to check individual message statuses by their SID. For bulk campaigns, configure a [Status Callback webhook](/docs/sms-support/sms-webhooks) to receive real-time delivery reports.

## Best Practices

1. **Deduplicate your list** -- Remove duplicate phone numbers before sending to avoid sending multiple messages to the same recipient.
2. **Validate phone numbers** -- Ensure all numbers are in valid E.164 format and are Indian mobile numbers.
3. **Test with a small batch** -- Send to 5-10 numbers first to verify template matching and delivery.
4. **Use dynamic messages for personalization** -- Personalized messages have higher engagement rates.
5. **Monitor delivery rates** -- Track your delivery rate and investigate if it drops below 90%.
6. **Respect DND regulations** -- Promotional SMS cannot be sent to DND numbers. Filter your list accordingly.
7. **Stagger large campaigns** -- For campaigns over 100,000 messages, stagger sends over multiple batches to ensure consistent throughput.
8. **Include opt-out instructions** -- For promotional campaigns, always include unsubscribe instructions in your message template.

## Common Issues

| Issue | Cause | Resolution |
|-------|-------|------------|
| Partial delivery in bulk | Some numbers invalid or on DND | Check delivery reports for individual failures |
| CSV upload fails | Incorrect format or encoding | Ensure UTF-8 encoding and proper CSV formatting |
| Slow delivery | High volume exceeding throughput | Contact account manager for throughput upgrade |
| All messages fail | DLT configuration error | Verify entity ID, template ID, and sender ID |

## Next Steps

- [SMS Delivery Reports](/docs/sms-support/sms-delivery-reports) -- Track bulk campaign delivery
- [SMS Webhooks](/docs/sms-support/sms-webhooks) -- Set up delivery callbacks
- [SMS Pricing](/docs/sms-support/sms-pricing) -- Understand bulk pricing tiers
- [SMS API Reference](/docs/sms-api/api-reference/bulk-sms) -- Bulk SMS API documentation
