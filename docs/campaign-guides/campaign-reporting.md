---
title: Campaign Reports & Analytics
description: "Analyze voice campaign performance on Exotel with CDR downloads, call status breakdowns, webhook data, and the analytics dashboard."
sidebar_label: Campaign Reports
sidebar_position: 5
---

# Campaign Reports & Analytics

Campaign reporting gives you visibility into how your outbound voice campaigns are performing. This guide covers how to access campaign statistics, download CDRs (Call Detail Records), interpret call status breakdowns, and use webhook data for real-time monitoring.

## Campaign Status Overview

Every campaign tracks aggregate statistics that update in real time as calls are processed.

### Retrieving Campaign Stats

```bash
curl "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/campaigns/<campaign_id>"
```

The response includes a `stats` object:

```json
{
  "response": [{
    "code": 200,
    "status": "success",
    "data": {
      "id": "camp_abc123",
      "name": "Payment Reminder Q1",
      "status": "Completed",
      "stats": {
        "created": 2500,
        "completed": 1875,
        "failed": 425,
        "pending": 0,
        "in_progress": 0,
        "busy": 87,
        "no_answer": 113
      }
    }
  }]
}
```

### Stats Field Reference

| Field | Description |
|-------|-------------|
| `created` | Total contacts in the campaign |
| `completed` | Contacts successfully reached (call answered) |
| `failed` | Contacts not reached after all attempts (including retries) |
| `pending` | Contacts waiting to be processed |
| `in_progress` | Calls currently active |
| `busy` | Last attempt resulted in a busy signal |
| `no_answer` | Last attempt was not answered |

:::tip
Poll the campaign stats endpoint periodically during the campaign to build a real-time monitoring dashboard. A 30-second polling interval provides near-real-time visibility without excessive API calls.
:::

## Call Detail Records (CDRs)

CDRs provide granular, per-call information for every attempt in your campaign, including retries.

### Retrieving CDRs via API

Use the Campaign Call Details endpoint to list all call attempts:

```bash
curl "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/campaigns/<campaign_id>/call-details?offset=0&limit=50"
```

> **API Reference:** See [Campaign Call Details](/docs/campaigns/api-reference/campaign-call-details) for complete endpoint documentation.

### CDR Fields

Each call detail record contains:

| Field | Description | Example |
|-------|-------------|---------|
| `call_sid` | Unique identifier for the call attempt | `a1b2c3d4e5f6` |
| `to` | Recipient phone number | `+919876543210` |
| `from` | ExoPhone (caller ID) | `0XXXXXX4890` |
| `status` | Call outcome | `completed`, `busy`, `no-answer`, `failed` |
| `start_time` | When the call was initiated | `2024-02-01T10:05:32+05:30` |
| `end_time` | When the call ended | `2024-02-01T10:06:15+05:30` |
| `duration` | Call duration in seconds | `43` |
| `recording_url` | URL to the call recording (if enabled) | `https://...` |
| `attempt_number` | Which attempt this was (1 = first, 2+ = retry) | `1` |
| `price` | Cost of this call attempt in pulses | `2` |

### Pagination

CDR results are paginated. Use `offset` and `limit` parameters to iterate through all records:

```bash
# First page
curl "https://.../campaigns/<campaign_id>/call-details?offset=0&limit=100"

# Second page
curl "https://.../campaigns/<campaign_id>/call-details?offset=100&limit=100"
```

Continue incrementing `offset` until the response contains fewer records than the `limit`.

## Call Status Breakdown

Understanding call status distribution helps you identify issues and optimize future campaigns.

### Status Categories

| Status | Category | Description |
|--------|----------|-------------|
| `completed` | Success | Call was answered; IVR or greeting was played |
| `busy` | Retriable | Recipient's line was engaged |
| `no-answer` | Retriable | Call rang but was not picked up within the ring timeout |
| `failed` | Terminal | Call could not connect (invalid number, network error, DND) |
| `canceled` | Terminal | Call was cancelled before connecting (campaign paused or force-completed) |

### Calculating Key Metrics

Use CDR data to calculate campaign performance metrics:

| Metric | Formula | Healthy Range |
|--------|---------|---------------|
| **Connect Rate** | (completed / created) x 100 | 40--70% |
| **Answer Rate** | (completed / (completed + no_answer + busy)) x 100 | 50--80% |
| **Failure Rate** | (failed / created) x 100 | Below 15% |
| **Retry Success Rate** | (completed on retries / total retried) x 100 | 20--40% |
| **Average Call Duration** | Sum of durations / completed calls | Varies by use case |

:::info
Connect rates vary significantly by industry, time of day, and audience type. B2B campaigns during business hours typically achieve higher connect rates than B2C campaigns. Track your own benchmarks over time rather than relying solely on industry averages.
:::

## Real-Time Monitoring with Webhooks

Webhooks provide push-based reporting. Configure callback URLs when creating your campaign to receive real-time updates.

### Call Status Callback

Fires after each individual call attempt:

```json
{
  "CallSid": "a1b2c3d4e5f6",
  "To": "+919876543210",
  "From": "0XXXXXX4890",
  "Status": "completed",
  "Duration": "43",
  "RecordingUrl": "https://...",
  "DateCreated": "2024-02-01T10:05:32+05:30"
}
```

**Use cases:** Real-time dashboard updates, immediate follow-up actions (send SMS after completed call).

### Call Schedule Callback

Fires when all retry attempts for a specific contact are exhausted:

```json
{
  "To": "+919876543210",
  "FinalStatus": "no-answer",
  "AttemptCount": 3,
  "CampaignSid": "camp_abc123"
}
```

**Use cases:** Trigger fallback actions (send SMS if voice failed), flag contacts for manual follow-up.

### Campaign Status Callback

Fires when the entire campaign transitions to a new status (e.g., Completed, Paused):

```json
{
  "CampaignSid": "camp_abc123",
  "Status": "Completed",
  "Stats": {
    "created": 2500,
    "completed": 1875,
    "failed": 425
  }
}
```

**Use cases:** Generate final campaign report, trigger post-campaign workflows, notify stakeholders.

> **API Reference:** See the [Campaign Webhooks reference](/docs/campaigns/api-reference/webhooks) for complete payload specifications.

## Dashboard Reports

The Exotel dashboard provides visual reporting for campaigns without requiring API calls.

### Accessing Campaign Reports

1. Log in to [my.exotel.com](https://my.exotel.com)
2. Navigate to **Campaigns** in the left sidebar
3. Click on a specific campaign to view its details
4. The campaign detail page shows statistics, contact status breakdown, and call logs

### Dashboard Report Features

| Feature | Description |
|---------|-------------|
| **Status pie chart** | Visual breakdown of completed, failed, busy, no-answer, and pending contacts |
| **Timeline graph** | Calls processed over time, showing throughput and patterns |
| **Contact list** | Searchable list of all contacts with their current status and attempt count |
| **Export to CSV** | Download the full campaign report as a CSV file |

### Exporting Campaign Data from Dashboard

1. Open the campaign detail page
2. Click the **Export** button in the top-right corner
3. Select the date range and fields to include
4. Download the CSV file

The exported CSV contains one row per contact with columns for phone number, final status, attempt count, last call duration, and timestamps.

## Building Custom Reports

For advanced reporting needs, combine CDR data with your CRM or analytics platform.

### Step 1: Collect Data via Webhooks

Configure `call_status_callback` to send per-call data to your data warehouse or analytics endpoint.

### Step 2: Enrich with Contact Metadata

If you uploaded contacts via CSV with metadata columns (name, email, tag), join CDR data with your contact list to create enriched reports.

### Step 3: Calculate Business Metrics

| Business Metric | Data Source | Calculation |
|----------------|-------------|-------------|
| Cost per connected contact | CDR price field | Total campaign cost / completed calls |
| Average attempts to connect | CDR attempt_number | Sum of attempt_number for completed / total completed |
| Revenue per campaign | CRM + CDR | Revenue attributed to campaign contacts / campaign cost |
| Best time to call | CDR timestamps | Group completed calls by hour; find peak connect hours |

## Analyzing Retry Effectiveness

Compare connect rates across attempt numbers to evaluate whether your retry configuration is effective:

| Attempt | Contacts | Connected | Connect Rate |
|---------|----------|-----------|-------------|
| 1st attempt | 2,500 | 1,500 | 60% |
| 1st retry | 1,000 | 250 | 25% |
| 2nd retry | 750 | 125 | 17% |
| **Total** | **2,500** | **1,875** | **75%** |

In this example, retries improved the overall connect rate from 60% to 75%, adding 375 connected contacts.

:::tip
If your retry connect rate drops below 10% on a specific retry attempt, the additional retries may not be cost-effective. Consider reducing `number_of_retries` or increasing `interval_mins` to space retries further apart.
:::

## Troubleshooting Report Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| CDR counts do not match campaign stats | Pagination not exhausted | Iterate through all pages using `offset` and `limit` |
| Webhook events missing | Endpoint returned non-200 response | Ensure your webhook endpoint returns HTTP 200 within 5 seconds |
| Recording URL returns 404 | Recording retention expired | Download recordings promptly; default retention is 90 days |
| Status shows "pending" after campaign completed | Campaign was force-completed | Pending contacts in a force-completed campaign are marked as failed |
| CSV export is empty | No contacts processed yet | Wait until the campaign has started processing contacts |

## Next Steps

- [Creating a Voice Campaign](./creating-voice-campaign) -- Set up campaigns with webhook callbacks
- [Retry Configuration](./campaign-retry-logic) -- Optimize retries based on reporting data
- [Campaign Scheduling](./campaign-scheduling) -- Adjust schedules based on time-of-day analysis
- [Best Practices](./campaign-best-practices) -- Use reporting insights to improve future campaigns
