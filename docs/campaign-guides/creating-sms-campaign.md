---
title: Creating an SMS Campaign
description: "Step-by-step guide to create a bulk SMS campaign on Exotel with DLT-compliant templates, sender IDs, contact lists, and scheduling."
sidebar_label: Creating an SMS Campaign
sidebar_position: 8
---

# Creating an SMS Campaign

This guide walks you through the complete process of creating a bulk SMS campaign on Exotel, from DLT template preparation to launching and monitoring your campaign.

## Prerequisites

Before creating an SMS campaign, ensure you have:

- An active Exotel account with API access enabled
- Your API key and API token (available in **Dashboard > Settings > API**)
- A registered DLT Entity ID (required for SMS in India)
- At least one approved DLT template (with Template ID)
- An approved Sender ID (alphabetical for transactional, numeric for promotional)
- A contact list in CSV format or existing contact list SIDs

:::info
DLT (Distributed Ledger Technology) registration is mandatory for sending SMS in India. All SMS must use pre-approved templates registered with your DLT portal. For DLT setup details, see [DLT Compliance](/docs/faqs/dlt-compliance).
:::

## Step 1: Register Your DLT Template

Before you can use a message in a campaign, it must be registered and approved on your DLT portal.

### Template Registration Process

1. Log in to your DLT portal (Jio, Airtel, Vodafone-Idea, or BSNL)
2. Navigate to **Templates > Add Template**
3. Select the template type:
   - **Transactional** -- OTPs, order updates, alerts (can be sent 24/7)
   - **Promotional** -- Marketing offers, promotions (restricted to 9 AM -- 9 PM)
   - **Service Implicit** -- Existing customer communications
   - **Service Explicit** -- Communications with explicit consent
4. Enter your message content with variables marked as `{#var#}`
5. Submit for approval (typically takes 1-3 business days)

### Template Example

**DLT template:**
```
Dear {#var#}, your order {#var#} has been shipped. Track at {#var#}. Thank you for shopping with {#var#}.
```

**Exotel campaign message (using CSV column headers):**
```
Dear @@first_name, your order @@order_id has been shipped. Track at @@tracking_url. Thank you for shopping with @@company_name.
```

For complete template management details, see [SMS Campaign Templates](./sms-campaign-templates).

## Step 2: Prepare Your Contact List

### CSV Format for SMS Campaigns

```csv
number,first_name,order_id,tracking_url,company_name
+919876543210,Rahul,ORD-2024-001,https://track.example.com/001,Acme Store
+919876543211,Priya,ORD-2024-002,https://track.example.com/002,Acme Store
+919876543212,Amit,ORD-2024-003,https://track.example.com/003,Acme Store
```

| Column | Required | Description |
|--------|----------|-------------|
| `number` | Yes | Recipient phone number in E.164 format |
| Custom columns | For dynamic campaigns | Any columns referenced by `@@variable` in your message template |

### Upload the Contact List

```bash
curl -X POST "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/contacts/csv-upload" \
  -F "list_name=Order_Shipment_Feb" \
  -F "file_name=@contacts.csv" \
  -F "type=static"
```

For dynamic (personalized) campaigns, set `type=dynamic`:

```bash
curl -X POST "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/contacts/csv-upload" \
  -F "list_name=Personalized_Shipment_Feb" \
  -F "file_name=@contacts.csv" \
  -F "type=dynamic"
```

:::tip
Verify the upload is complete by checking the upload status endpoint before creating your campaign. See [Contact List Management](./campaign-contacts-management) for detailed upload instructions.
:::

## Step 3: Configure Campaign Settings

### Essential Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `lists` | Yes | Array of contact list SIDs |
| `sender_id` | Yes | Approved Sender ID (e.g., `EXOTL` for transactional) |
| `sms_type` | Yes | `trans` (transactional) or `promo` (promotional) |
| `dlt_entity_id` | Yes | Your DLT Entity ID |
| `dlt_template_id` | Yes | Approved DLT Template ID for this message |
| `body` | Yes | Message content matching the DLT template |
| `name` | No | Campaign name for identification |
| `campaign_type` | No | `static` (same message) or `dynamic` (personalized) |

### Sender ID Types

| Type | Format | Example | Use Case |
|------|--------|---------|----------|
| Alphabetical (6 chars) | Letters only | `EXOTL` | Transactional, service messages |
| Numeric | Numbers | `567890` | Promotional campaigns |

:::warning
Your Sender ID must be registered with your DLT portal and approved before use. Using an unregistered Sender ID will cause all messages to fail delivery.
:::

### Static vs. Dynamic Campaigns

**Static campaigns** send the identical message to all recipients:

```json
{
  "lists": ["list_sid_1", "list_sid_2"],
  "body": "Your subscription renewal is due. Please visit our website to renew. Thank you.",
  "campaign_type": "static"
}
```

- Supports up to 5 contact lists
- Maximum 1,00,000 contacts per list
- All recipients receive the same message

**Dynamic campaigns** personalize the message for each recipient using CSV column values:

```json
{
  "lists": ["list_sid_1"],
  "body": "Dear @@first_name, your order @@order_id has been shipped. Track at @@tracking_url.",
  "campaign_type": "dynamic"
}
```

- Supports 1 contact list only
- Maximum 5,00,000 contacts
- Each recipient gets a personalized message

## Step 4: Set the Schedule

### Immediate Send

Omit the `schedule` object to send messages immediately:

```json
{
  "lists": ["list_sid_1"],
  "body": "Your OTP is 123456. Valid for 5 minutes.",
  "sender_id": "EXOTL",
  "sms_type": "trans"
}
```

### Scheduled Send

```json
"schedule": {
  "send_at": "2024-02-15T10:00:00+05:30",
  "end_at": "2024-02-15T18:00:00+05:30"
}
```

| Parameter | Format | Description |
|-----------|--------|-------------|
| `send_at` | RFC 3339 | When to start sending messages |
| `end_at` | RFC 3339 | When to stop sending (remaining contacts are paused) |

:::warning
SMS campaigns must have a minimum 10-minute lead time. The `send_at` time must be at least 10 minutes in the future from the time of campaign creation.
:::

### Scheduling Rules for SMS Types

| SMS Type | Allowed Hours | Notes |
|----------|--------------|-------|
| Transactional | 24/7 | No time restrictions |
| Promotional | 9:00 AM -- 9:00 PM IST | TRAI regulation; messages outside this window will be queued |
| Service Implicit | 24/7 | Subject to DLT category rules |
| Service Explicit | 24/7 | Subject to DLT category rules |

## Step 5: Configure Callbacks

Set up webhook URLs to receive delivery status updates:

```json
"status_callback": "https://your-server.com/webhooks/sms-campaign-status",
"sms_status_callback": "https://your-server.com/webhooks/sms-delivery"
```

| Callback | Fires When | Data Included |
|----------|-----------|---------------|
| `sms_status_callback` | Each individual SMS delivery status changes | To number, delivery status, timestamp, SmsSid |
| `status_callback` | Campaign status changes (completed, paused) | Campaign stats, completion summary |

## Step 6: Launch the Campaign

Combine all settings into the API request:

```bash
curl -X POST "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/sms-campaigns" \
  -H "Content-Type: application/json" \
  -d '{
    "lists": ["list_sid_1"],
    "sender_id": "EXOTL",
    "sms_type": "trans",
    "dlt_entity_id": "1234567890123456789",
    "dlt_template_id": "9876543210123456789",
    "body": "Dear @@first_name, your order @@order_id has been shipped. Track at @@tracking_url. Thank you for shopping with Acme Store.",
    "name": "Order Shipment Notifications Feb",
    "campaign_type": "dynamic",
    "schedule": {
      "send_at": "2024-02-15T10:00:00+05:30",
      "end_at": "2024-02-15T18:00:00+05:30"
    },
    "sms_status_callback": "https://your-server.com/webhooks/sms-delivery",
    "status_callback": "https://your-server.com/webhooks/sms-campaign-status"
  }'
```

**Successful response:**

```json
{
  "response": [{
    "code": 200,
    "status": "success",
    "data": {
      "id": "sms_camp_xyz789",
      "name": "Order Shipment Notifications Feb",
      "status": "Created",
      "stats": {
        "total": 3000,
        "sent": 0,
        "delivered": 0,
        "failed": 0,
        "pending": 3000
      }
    }
  }]
}
```

> **API Reference:** See the [SMS Campaigns API](/docs/sms-campaigns/overview) for complete endpoint documentation.

## Step 7: Monitor and Manage

### Check Campaign Status

```bash
curl "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/sms-campaigns/<campaign_id>"
```

### Pause the Campaign

```bash
curl -X PUT "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/sms-campaigns/<campaign_id>" \
  -H "Content-Type: application/json" \
  -d '{"action": "pause"}'
```

### Resume a Paused Campaign

```bash
curl -X PUT "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/sms-campaigns/<campaign_id>" \
  -H "Content-Type: application/json" \
  -d '{"action": "resume"}'
```

## SMS Delivery Throughput

| Setting | Default | Description |
|---------|---------|-------------|
| SMS capacity | 300 SMS/minute | Default account throughput |
| Throttle mode | `auto` | Uses full account capacity |
| Custom throttle | Set via `throttle` parameter | Limit to specific SMS/minute rate |

:::info
If you need higher throughput than 300 SMS/minute, contact Exotel support to increase your account capacity. Enterprise plans support up to several thousand SMS per minute.
:::

## Complete Configuration Reference

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `lists` | Yes | -- | Array of contact list SIDs |
| `sender_id` | Yes | -- | Approved DLT Sender ID |
| `sms_type` | Yes | -- | `trans` or `promo` |
| `dlt_entity_id` | Yes | -- | DLT Entity ID |
| `dlt_template_id` | Yes | -- | Approved DLT Template ID |
| `body` | Yes | -- | Message content (must match DLT template) |
| `name` | No | Auto-generated | Campaign name |
| `campaign_type` | No | `static` | `static` or `dynamic` |
| `schedule` | No | Immediate | Schedule object with `send_at` and `end_at` |
| `sms_status_callback` | No | -- | Per-SMS delivery webhook URL |
| `status_callback` | No | -- | Campaign-level webhook URL |
| `throttle` | No | Account limit | SMS/minute rate |

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| All SMS failing with DLT error | Template ID or Entity ID mismatch | Verify DLT credentials match your registered values |
| Message body rejected | Body does not match registered template | Ensure variables and static text match the DLT template exactly |
| Promotional SMS not delivered | Sent outside 9 AM -- 9 PM window | Schedule within allowed promotional hours |
| Low delivery rate | DND-registered recipients | Check DND filtering; consider transactional category if applicable |
| Campaign stuck in Created | Schedule `send_at` is in the future | Wait for the scheduled time or update the schedule |
| Dynamic variables showing raw text | Column header mismatch | Verify CSV column headers match `@@variable` names exactly |

## Next Steps

- [SMS Campaign Templates](./sms-campaign-templates) -- DLT template management and variable substitution
- [SMS Campaign Reports](./sms-campaign-reporting) -- Track delivery status and analyze campaign performance
- [Contact List Management](./campaign-contacts-management) -- Prepare and optimize your contact lists
- [Best Practices](./campaign-best-practices) -- Optimize timing, throughput, and content
