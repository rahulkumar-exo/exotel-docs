---
title: Creating a Voice Campaign
description: "Step-by-step guide to create an outbound voice campaign on Exotel with contact uploads, IVR configuration, and scheduling."
sidebar_label: Creating a Voice Campaign
sidebar_position: 2
---

# Creating a Voice Campaign

This guide walks you through the complete process of creating an outbound voice campaign on Exotel, from preparing your contact list to launching the campaign and monitoring its progress.

## Prerequisites

Before you begin, make sure you have:

- An active Exotel account with API access enabled
- Your API key and API token (available in **Dashboard > Settings > API**)
- At least one ExoPhone (virtual number) configured in your account
- An IVR flow or greeting message ready (created in the Exotel dashboard)
- A contact list in CSV format or existing contact list SIDs

## Step 1: Prepare Your Contact List

You can provide contacts for a voice campaign in two ways:

### Option A: Inline Phone Numbers

Pass up to 5,000 comma-separated phone numbers directly in the API request using the `from` parameter. This is best for quick, one-off campaigns.

```
+919876543210,+919876543211,+919876543212
```

### Option B: Upload a CSV Contact List (Recommended)

For larger campaigns or when you need to track contact metadata, upload a CSV file to create a reusable contact list.

**Required CSV format:**

```csv
number,first_name,last_name,company_name,email,tag
+919876543210,Rahul,Kumar,Acme Corp,rahul@acme.com,premium
+919876543211,Priya,Sharma,Beta Inc,priya@beta.com,standard
+919876543212,Amit,Patel,Gamma Ltd,amit@gamma.com,premium
```

| Column | Required | Description |
|--------|----------|-------------|
| `number` | Yes | Phone number in E.164 format (e.g., `+919876543210`) |
| `first_name` | No | Contact's first name |
| `last_name` | No | Contact's last name |
| `company_name` | No | Company name |
| `email` | No | Email address |
| `tag` | No | Custom tag for segmentation |

**Upload the CSV:**

```bash
curl -X POST "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/contacts/csv-upload" \
  -F "list_name=January_Promo_List" \
  -F "file_name=@contacts.csv" \
  -F "type=static"
```

**Check upload status:**

```bash
curl "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/csv-status/<upload_id>"
```

The response shows upload progress including counts for duplicates, successes, and failures.

:::tip
Upload your contact list well before the campaign start time. Large CSV files (up to 60 MB) may take several minutes to process. Check the upload status endpoint to confirm completion before creating your campaign.
:::

> **API Reference:** See the [Campaign Lists API](/docs/campaign-lists/overview) for complete list management endpoints.

## Step 2: Create or Select an IVR Flow

Voice campaigns connect each call to either an IVR flow or a greeting message.

### IVR Flow (`flow_type: "ivr"`)

An IVR flow presents an interactive voice menu. Recipients can press keys (DTMF input) to navigate options. Create your IVR flow in the Exotel dashboard under **App Bazaar > Create Flow**.

The flow URL follows this pattern:

```
http://my.exotel.com/<account_sid>/exoml/start_voice/<app_id>
```

### Greeting Message (`flow_type: "greeting"`)

A greeting plays a text-to-speech or pre-recorded message to the recipient. Use the `read_via_text` parameter to specify the message content.

For dynamic campaigns, you can personalize the greeting using column variables:

```
Hello @@first_name, this is a reminder about your appointment on @@date.
```

## Step 3: Configure Campaign Settings

### Essential Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| `caller_id` | `0XXXXXX4890` | The ExoPhone that will appear as the caller ID |
| `flow_type` | `ivr` or `greeting` | Type of call flow |
| `url` | Flow URL | Required for IVR campaigns |
| `read_via_text` | Message text | Required for greeting campaigns |
| `name` | `January Promo Campaign` | Descriptive campaign name (min 3 characters) |
| `campaign_type` | `static` or `dynamic` | Static for fixed lists; dynamic for list SID-based |

### Duplicate Handling

By default, Exotel deduplicates phone numbers within a campaign. If you want to call the same number multiple times (e.g., different contacts at a shared number), set:

```json
"call_duplicate_numbers": true
```

### Throttle Control

Control the call rate to manage your call capacity:

| Mode | Behavior |
|------|----------|
| `auto` (default) | Uses your full account call capacity |
| `custom` | Set a specific calls-per-minute rate |

```json
"mode": "custom",
"throttle": 30
```

:::warning
Setting the throttle too high can exceed your account's call capacity limit (default: 60 calls/minute). If you need higher throughput, contact Exotel support to increase your limit before launching the campaign.
:::

## Step 4: Configure Retry Logic

Retry logic automatically re-attempts calls to contacts who were unreachable on the first attempt. This significantly improves your campaign's overall connect rate.

```json
"retries": {
  "number_of_retries": 2,
  "interval_mins": 15,
  "mechanism": "Linear",
  "on_status": ["busy", "no-answer", "failed"]
}
```

| Parameter | Range | Description |
|-----------|-------|-------------|
| `number_of_retries` | 0--3 | Maximum retry attempts per contact |
| `interval_mins` | Integer | Minutes between retry attempts |
| `mechanism` | `Linear` or `Exponential` | Spacing pattern between retries |
| `on_status` | Array | Which call outcomes trigger a retry |

**Retry trigger statuses:**

| Status | Meaning |
|--------|---------|
| `busy` | Recipient's line was busy |
| `no-answer` | Call rang but was not answered |
| `failed` | Call could not be connected (network issue, invalid number) |

:::tip
For most campaigns, 2 retries with 15-minute linear intervals on `busy` and `no-answer` statuses provide a good balance between connect rate and cost. See the [Retry Configuration Guide](./campaign-retry-logic) for advanced strategies.
:::

## Step 5: Set the Schedule

Schedule your campaign to run during optimal hours. Both `send_at` and `end_at` use RFC 3339 format with timezone offset.

```json
"schedule": {
  "send_at": "2024-02-01T09:00:00+05:30",
  "end_at": "2024-02-01T18:00:00+05:30"
}
```

| Parameter | Description |
|-----------|-------------|
| `send_at` | When the campaign starts dialing |
| `end_at` | When the campaign stops dialing (remaining contacts are paused) |

If no schedule is provided, the campaign starts immediately upon creation and runs until all contacts are processed.

:::warning
If the campaign does not finish all contacts before `end_at`, the remaining contacts are **not** automatically rescheduled. You will need to create a new campaign or update the schedule. See the [Campaign Scheduling Guide](./campaign-scheduling) for strategies around multi-day campaigns.
:::

## Step 6: Configure Webhooks

Set up webhook URLs to receive real-time campaign and call status updates:

```json
"call_status_callback": "https://your-server.com/webhooks/call-status",
"call_schedule_callback": "https://your-server.com/webhooks/call-schedule",
"status_callback": "https://your-server.com/webhooks/campaign-status"
```

| Webhook | Fires When | Use Case |
|---------|-----------|----------|
| `call_status_callback` | Each individual call attempt completes | Real-time monitoring dashboard |
| `call_schedule_callback` | All retries for a number are exhausted | Trigger follow-up actions (e.g., SMS fallback) |
| `status_callback` | Entire campaign completes | Download final report, send summary notification |

> **API Reference:** See the [Campaign Webhooks reference](/docs/campaigns/api-reference/webhooks) for complete payload details.

## Step 7: Launch the Campaign

Combine all configurations into a single API request:

```bash
curl -X POST "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/campaigns" \
  -H "Content-Type: application/json" \
  -d '{
    "lists": ["list_sid_1"],
    "caller_id": "0XXXXXX4890",
    "flow_type": "ivr",
    "url": "http://my.exotel.com/<account_sid>/exoml/start_voice/926",
    "name": "January Promo Campaign",
    "campaign_type": "static",
    "retries": {
      "number_of_retries": 2,
      "interval_mins": 15,
      "mechanism": "Linear",
      "on_status": ["busy", "no-answer"]
    },
    "schedule": {
      "send_at": "2024-02-01T09:00:00+05:30",
      "end_at": "2024-02-01T18:00:00+05:30"
    },
    "call_status_callback": "https://your-server.com/webhooks/call-status",
    "call_schedule_callback": "https://your-server.com/webhooks/call-schedule",
    "status_callback": "https://your-server.com/webhooks/campaign-status"
  }'
```

A successful response returns HTTP 200 with the campaign ID and initial stats:

```json
{
  "response": [{
    "code": 200,
    "status": "success",
    "data": {
      "id": "camp_abc123",
      "name": "January Promo Campaign",
      "status": "Created",
      "stats": {
        "created": 500,
        "completed": 0,
        "failed": 0,
        "pending": 500
      }
    }
  }]
}
```

## Step 8: Monitor and Manage

Once your campaign is running, you can monitor progress and take actions.

### Check Campaign Status

```bash
curl "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/campaigns/<campaign_id>"
```

### Pause the Campaign

```bash
curl -X PUT "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/campaigns/<campaign_id>" \
  -H "Content-Type: application/json" \
  -d '{"action": "pause"}'
```

### Resume a Paused Campaign

```bash
curl -X PUT "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/campaigns/<campaign_id>" \
  -H "Content-Type: application/json" \
  -d '{"action": "resume"}'
```

### Force Complete

Force-completing a paused campaign marks all remaining unprocessed contacts as `failed`:

```bash
curl -X PUT "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/campaigns/<campaign_id>" \
  -H "Content-Type: application/json" \
  -d '{"action": "complete"}'
```

> **API Reference:** See [Manage Campaign](/docs/campaigns/api-reference/manage-campaign) for all management endpoints.

## Complete Configuration Reference

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `from` | Yes* | -- | Comma-separated numbers (max 5,000) |
| `lists` | Yes* | -- | Array of list SIDs (max 5 static, 1 dynamic) |
| `caller_id` | Yes | -- | ExoPhone for caller ID |
| `flow_type` | No | -- | `ivr` or `greeting` |
| `url` | No | -- | IVR flow URL |
| `read_via_text` | No | -- | Greeting TTS text |
| `name` | No | Auto-generated | Campaign name (min 3 chars) |
| `campaign_type` | No | `static` | `static` or `dynamic` |
| `type` | No | `trans` | Campaign type |
| `call_duplicate_numbers` | No | `false` | Allow calling duplicate numbers |
| `retries` | No | No retries | Retry configuration object |
| `schedule` | No | Immediate start | Schedule object with `send_at` and `end_at` |
| `call_status_callback` | No | -- | Per-call webhook URL |
| `call_schedule_callback` | No | -- | Per-number completion webhook URL |
| `status_callback` | No | -- | Campaign completion webhook URL |
| `mode` | No | `auto` | Throttle mode: `auto` or `custom` |
| `throttle` | No | Account limit | Calls/minute (custom mode only) |
| `custom_field` | No | -- | Application metadata |
| `repeat_menu_attempts` | No | `0` | IVR menu repetition count |

*Either `from` or `lists` is required, not both.

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Campaign stuck in "Created" | Schedule `send_at` is in the future | Wait for the scheduled time, or update the schedule |
| All calls showing "failed" | Invalid ExoPhone or IVR flow URL | Verify `caller_id` is active and `url` points to a valid flow |
| Low connect rate | Calling outside business hours | Use scheduling to restrict calls to 9 AM--7 PM local time |
| Duplicate contacts skipped | `call_duplicate_numbers` is false (default) | Set to `true` if intentional, or deduplicate your list |
| Webhook not receiving events | Invalid or unreachable callback URL | Ensure your endpoint is publicly accessible and returns HTTP 200 |

## Next Steps

- [Campaign Scheduling](./campaign-scheduling) -- Configure time windows and recurring patterns
- [Retry Configuration](./campaign-retry-logic) -- Optimize retry strategies for higher connect rates
- [Campaign Reports](./campaign-reporting) -- Analyze campaign performance and download CDRs
- [Best Practices](./campaign-best-practices) -- Tips for maximizing campaign effectiveness
