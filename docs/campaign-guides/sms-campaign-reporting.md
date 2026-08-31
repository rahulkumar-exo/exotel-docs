---
title: SMS Campaign Reports & Analytics
description: "Track SMS campaign performance on Exotel. View delivery status breakdowns, DLT rejection analysis, and export campaign reports."
sidebar_label: SMS Campaign Reports
sidebar_position: 10
---

# SMS Campaign Reports & Analytics

SMS campaign reporting provides visibility into message delivery status, DLT compliance outcomes, and overall campaign effectiveness. This guide covers how to retrieve campaign statistics, interpret delivery statuses, analyze failures, and export reports.

## Campaign Status Overview

Every SMS campaign tracks aggregate delivery statistics that update in real time as messages are processed.

### Retrieving Campaign Stats

```bash
curl -u '<api_key>:<api_token>' "https://api.exotel.com/v2/accounts/<account_sid>/sms-campaigns/<campaign_id>"
```

**Response:**

```json
{
  "response": [{
    "code": 200,
    "status": "success",
    "data": {
      "id": "sms_camp_xyz789",
      "name": "Order Shipment Feb",
      "status": "Completed",
      "stats": {
        "total": 5000,
        "submitted": 4950,
        "delivered": 4720,
        "failed": 230,
        "pending": 0,
        "rejected": 50
      }
    }
  }]
}
```

### Stats Field Reference

| Field | Description |
|-------|-------------|
| `total` | Total contacts in the campaign |
| `submitted` | Messages successfully submitted to the telecom operator |
| `delivered` | Messages confirmed delivered to the recipient's handset |
| `failed` | Messages that failed delivery (network error, handset off, etc.) |
| `pending` | Messages still being processed or awaiting delivery confirmation |
| `rejected` | Messages rejected before submission (DLT mismatch, DND, invalid number) |

## SMS Delivery Status Lifecycle

Each SMS message progresses through a series of statuses:

```
Queued --> Submitted --> Delivered
                     --> Failed (delivery failure)
       --> Rejected (DLT/DND/validation failure)
```

### Detailed Status Codes

| Status | Category | Description |
|--------|----------|-------------|
| `queued` | In Progress | Message is in the send queue |
| `submitted` | In Progress | Message handed off to the telecom operator |
| `delivered` | Success | Delivery confirmed by the recipient's handset |
| `failed` | Terminal | Delivery failed after submission (handset off, network error) |
| `rejected` | Terminal | Message rejected before submission (DLT, DND, validation) |
| `expired` | Terminal | Message could not be delivered within the validity period |

## Individual SMS Details

Retrieve delivery details for individual messages within a campaign:

```bash
curl -u '<api_key>:<api_token>' "https://api.exotel.com/v2/accounts/<account_sid>/sms-campaigns/<campaign_id>/sms-details?offset=0&limit=50"
```

### SMS Detail Fields

| Field | Description | Example |
|-------|-------------|---------|
| `sms_sid` | Unique identifier for the message | `sm_a1b2c3d4` |
| `to` | Recipient phone number | `+919876543210` |
| `status` | Current delivery status | `delivered` |
| `submitted_at` | When the message was submitted | `2024-02-15T10:05:32+05:30` |
| `delivered_at` | When delivery was confirmed | `2024-02-15T10:05:35+05:30` |
| `error_code` | Error code if failed/rejected | `DLT_TEMPLATE_MISMATCH` |
| `error_message` | Human-readable error description | `Message body does not match registered template` |
| `parts` | Number of SMS parts (for long messages) | `1` |
| `cost` | Cost in credits for this message | `1` |

> **API Reference:** See [SMS Campaign SMS Details](/docs/sms-campaigns/api-reference/sms-details) for complete endpoint documentation.

### Pagination

Results are paginated. Use `offset` and `limit` to iterate:

```bash
# Page 1
curl "https://.../sms-campaigns/<campaign_id>/sms-details?offset=0&limit=100"

# Page 2
curl "https://.../sms-campaigns/<campaign_id>/sms-details?offset=100&limit=100"
```

## Calculating Key Metrics

Use campaign data to calculate performance metrics:

| Metric | Formula | Healthy Range |
|--------|---------|---------------|
| **Delivery Rate** | (delivered / submitted) x 100 | 92--98% |
| **Rejection Rate** | (rejected / total) x 100 | Below 5% |
| **Failure Rate** | (failed / submitted) x 100 | Below 8% |
| **Effective Reach** | (delivered / total) x 100 | 85--95% |
| **Cost per Delivered Message** | Total cost / delivered count | Varies by plan |

:::info
Delivery rates above 95% indicate a healthy campaign with clean contact lists and correct DLT configuration. Rates below 90% warrant investigation into failure causes.
:::

## Analyzing Delivery Failures

### Common Failure Categories

| Category | Typical Causes | Impact | Resolution |
|----------|---------------|--------|------------|
| **DLT Rejection** | Template mismatch, Entity ID error | Message never sent | Fix template alignment |
| **DND/NDNC Block** | Recipient on Do Not Disturb registry | Promotional SMS blocked | Use transactional type if applicable; remove DND numbers |
| **Invalid Number** | Wrong format, disconnected number | Permanent failure | Clean contact list |
| **Network Failure** | Operator outage, congestion | Temporary failure | Retry in next campaign |
| **Handset Off** | Recipient's phone is switched off | Temporary failure | Message may deliver when handset is back online (within validity period) |
| **Expired** | Delivery window exceeded | Message discarded | Reduce delay between submit and delivery |

### DLT-Specific Rejection Codes

| Error Code | Description | Fix |
|------------|-------------|-----|
| `DLT_TEMPLATE_MISMATCH` | Message body does not match the registered template | Ensure variable substitutions produce text matching the template |
| `DLT_ENTITY_NOT_FOUND` | Entity ID is not valid | Verify your DLT Entity ID in the campaign configuration |
| `DLT_TEMPLATE_NOT_FOUND` | Template ID is not registered or not yet propagated | Check DLT portal for template approval; wait for propagation |
| `DLT_SENDER_MISMATCH` | Sender ID does not match the template's associated Sender ID | Use the Sender ID registered with this template |
| `DLT_BLACKLISTED` | Entity or template has been blacklisted by the operator | Contact your DLT portal for clarification |

:::tip
If you see a high percentage of `DLT_TEMPLATE_MISMATCH` errors, test your message substitution with a few sample records first. The most common cause is variable values that introduce characters or formatting that deviate from the template pattern.
:::

## Real-Time Monitoring with Webhooks

### SMS Delivery Callback

Configure `sms_status_callback` to receive delivery status updates in real time:

```json
{
  "SmsSid": "sm_a1b2c3d4",
  "To": "+919876543210",
  "Status": "delivered",
  "DeliveredAt": "2024-02-15T10:05:35+05:30",
  "ErrorCode": null,
  "CampaignSid": "sms_camp_xyz789"
}
```

**Use cases:**
- Update your CRM with delivery confirmation
- Trigger follow-up actions for failed deliveries
- Build a real-time delivery dashboard

### Campaign Status Callback

Configure `status_callback` for campaign-level events:

```json
{
  "CampaignSid": "sms_camp_xyz789",
  "Status": "Completed",
  "Stats": {
    "total": 5000,
    "delivered": 4720,
    "failed": 230,
    "rejected": 50
  }
}
```

**Use cases:**
- Generate final campaign report
- Trigger post-campaign analysis workflows
- Notify stakeholders of campaign completion

## Dashboard Reports

The Exotel dashboard provides visual SMS campaign reporting without API calls.

### Accessing SMS Campaign Reports

1. Log in to [my.exotel.com](https://my.exotel.com)
2. Navigate to **Campaigns** in the left sidebar
3. Select the **SMS** tab
4. Click on a specific campaign for detailed reporting

### Dashboard Report Features

| Feature | Description |
|---------|-------------|
| **Delivery pie chart** | Visual breakdown of delivered, failed, rejected, and pending |
| **Timeline graph** | Messages sent over time showing throughput patterns |
| **Contact list** | Searchable list of all recipients with delivery status |
| **Error summary** | Grouped view of failure reasons with counts |
| **Export to CSV** | Download the complete campaign report |

### Exporting Campaign Data

1. Open the campaign detail page
2. Click **Export** in the top-right corner
3. Select fields to include (phone number, status, timestamp, error code)
4. Download the CSV file

The exported CSV contains one row per recipient with delivery status, timestamps, error details, and message cost.

## Building Custom Analytics

### Delivery Rate Trends

Track delivery rates across campaigns to identify trends:

| Campaign | Date | Total | Delivered | Delivery Rate | Notes |
|----------|------|-------|-----------|--------------|-------|
| Promo Jan | 2024-01-15 | 10,000 | 9,200 | 92% | Baseline |
| Promo Feb | 2024-02-15 | 12,000 | 11,400 | 95% | Cleaned list |
| Promo Mar | 2024-03-15 | 15,000 | 14,550 | 97% | Added DND pre-filter |

### Error Category Distribution

Group failures by category to prioritize fixes:

| Error Category | Count | Percentage | Action |
|----------------|-------|-----------|--------|
| DND blocked | 120 | 48% | Pre-filter DND numbers |
| Invalid number | 75 | 30% | Improve number validation at collection |
| Network failure | 35 | 14% | Temporary; no action needed |
| DLT rejection | 20 | 8% | Review template alignment |
| **Total Failures** | **250** | **100%** | |

### Time-of-Day Analysis

Track delivery speed by submission time to find optimal send windows:

| Send Time | Avg Delivery Time | Delivery Rate | Notes |
|-----------|-------------------|---------------|-------|
| 9:00 AM | 3 seconds | 96% | Low congestion |
| 12:00 PM | 5 seconds | 95% | Moderate traffic |
| 3:00 PM | 4 seconds | 95% | Moderate traffic |
| 6:00 PM | 8 seconds | 93% | Peak hours |

## Bulk Campaign Details

For accounts running many campaigns, use the bulk campaign details endpoint to retrieve summary data across multiple campaigns:

```bash
curl -u '<api_key>:<api_token>' "https://api.exotel.com/v2/accounts/<account_sid>/sms-campaigns?status=Completed&offset=0&limit=20"
```

> **API Reference:** See [Bulk Campaign Details](/docs/sms-campaigns/api-reference/bulk-campaign-details) for filtering and pagination options.

## Troubleshooting Report Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Stats show `pending` after campaign completed | Delivery receipts still being processed | Wait 15-30 minutes for final delivery confirmations |
| Delivery count lower than expected | Messages still in operator queue | Check again after the message validity period expires |
| Webhook not receiving delivery updates | Endpoint returning non-200 response | Ensure webhook endpoint returns HTTP 200 within 5 seconds |
| CSV export is incomplete | Export initiated before campaign completed | Wait for campaign status to be `Completed` before exporting |
| Error codes not showing | Operator did not provide detailed failure reason | Some operators return generic failure codes; no additional detail available |

## Next Steps

- [Creating an SMS Campaign](./creating-sms-campaign) -- Set up campaigns with delivery callbacks
- [SMS Campaign Templates](./sms-campaign-templates) -- Manage templates to reduce DLT rejections
- [Contact List Management](./campaign-contacts-management) -- Improve list quality for higher delivery rates
- [Best Practices](./campaign-best-practices) -- Optimize SMS campaign performance
