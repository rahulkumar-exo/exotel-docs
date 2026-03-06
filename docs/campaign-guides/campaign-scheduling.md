---
title: Campaign Scheduling
description: "Configure campaign schedules on Exotel with time zones, business hours, and strategies for multi-day and recurring campaigns."
sidebar_label: Campaign Scheduling
sidebar_position: 3
---

# Campaign Scheduling

Scheduling determines when your campaign starts and stops making calls or sending messages. Proper scheduling ensures you reach contacts during optimal hours, comply with regulatory calling windows, and manage your account's throughput capacity across multiple campaigns.

## How Scheduling Works

Every campaign accepts an optional `schedule` object with two fields:

```json
"schedule": {
  "send_at": "2024-02-01T09:00:00+05:30",
  "end_at": "2024-02-01T18:00:00+05:30"
}
```

| Field | Format | Description |
|-------|--------|-------------|
| `send_at` | RFC 3339 | When the campaign begins processing contacts |
| `end_at` | RFC 3339 | When the campaign stops processing (remaining contacts are paused) |

If no schedule is provided, the campaign starts immediately and runs until all contacts are processed or the campaign is manually paused/completed.

## Time Zone Handling

All schedule timestamps use RFC 3339 format, which includes an explicit timezone offset. This means you must specify the timezone for your campaign's target audience.

### Common Indian Standard Time (IST) Format

```
2024-02-01T09:00:00+05:30
```

### Other Time Zone Examples

| Region | Offset | Example |
|--------|--------|---------|
| India (IST) | `+05:30` | `2024-02-01T09:00:00+05:30` |
| Singapore (SGT) | `+08:00` | `2024-02-01T09:00:00+08:00` |
| UAE (GST) | `+04:00` | `2024-02-01T09:00:00+04:00` |
| UK (GMT) | `+00:00` | `2024-02-01T09:00:00+00:00` |
| US Eastern (EST) | `-05:00` | `2024-02-01T09:00:00-05:00` |

:::warning
The Exotel API does not automatically convert between time zones. If your contacts span multiple time zones, you must create separate campaigns for each zone with appropriate schedules. Calling contacts at 9 AM IST would mean calling Singapore contacts at 11:30 AM SGT and UAE contacts at 7:30 AM GST.
:::

## Scheduling for Business Hours

Most campaigns perform best when calls are made during business hours. Here are recommended scheduling windows:

### Voice Campaign Windows

| Audience Type | Recommended Window | Rationale |
|---------------|-------------------|-----------|
| B2B (business contacts) | 10:00 AM -- 5:00 PM | Avoids early morning and end-of-day rush |
| B2C (consumer contacts) | 10:00 AM -- 7:00 PM | Catches people after morning routines |
| Emergency/urgent | 8:00 AM -- 9:00 PM | Extended window for time-sensitive campaigns |

### SMS Campaign Windows

| SMS Type | Recommended Window | Notes |
|----------|-------------------|-------|
| Transactional | Any time (24/7) | Order updates, OTPs, alerts |
| Promotional | 9:00 AM -- 9:00 PM | TRAI regulations for India |

:::tip
For voice campaigns targeting consumers in India, avoid calling before 9:00 AM and after 9:00 PM. While Exotel does not enforce this restriction at the API level, TRAI regulations prohibit unsolicited commercial calls outside this window. Configure your schedule accordingly.
:::

### Example: Business Hours Voice Campaign

```json
"schedule": {
  "send_at": "2024-02-01T10:00:00+05:30",
  "end_at": "2024-02-01T17:00:00+05:30"
}
```

## Multi-Day Campaigns

When your contact list is too large to complete in a single business-hours window, you need to plan a multi-day strategy.

### Understanding End-Time Behavior

When a campaign reaches its `end_at` time:

1. **In-progress calls** complete normally (calls already ringing or connected are not interrupted)
2. **Pending contacts** remain in the queue but are not dialed
3. **Pending retries** are not attempted after `end_at`
4. The campaign status changes to `Paused`

### Strategy: Update Schedule for Next Day

After the first day's window ends, update the campaign schedule to resume the next day:

**Step 1:** Wait for the campaign to be paused after `end_at`.

**Step 2:** Update the schedule with new times:

```bash
curl -X PUT "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/campaigns/<campaign_id>" \
  -H "Content-Type: application/json" \
  -d '{
    "schedule": {
      "send_at": "2024-02-02T10:00:00+05:30",
      "end_at": "2024-02-02T17:00:00+05:30"
    },
    "action": "resume"
  }'
```

**Step 3:** The campaign resumes at the new `send_at` time and processes remaining contacts.

:::warning
You can only update the schedule while the campaign is in `Paused` status. If the campaign has already been force-completed or archived, you will need to create a new campaign for the remaining contacts.
:::

### Strategy: Create Daily Campaigns with Segmented Lists

For predictable multi-day execution, segment your contact list and create a separate campaign for each day:

| Day | List | Schedule |
|-----|------|----------|
| Monday | `list_monday` | 10:00 AM -- 5:00 PM |
| Tuesday | `list_tuesday` | 10:00 AM -- 5:00 PM |
| Wednesday | `list_wednesday` | 10:00 AM -- 5:00 PM |

This approach gives you cleaner per-day reporting and makes it easier to pause or cancel individual days.

## Recurring Campaign Patterns

Exotel does not natively support recurring campaign schedules (e.g., "every Monday at 10 AM"). To implement recurring campaigns, use one of these approaches:

### Approach 1: API Automation with Cron Jobs

Set up a cron job or scheduled task on your server that calls the Exotel API to create a new campaign at your desired interval:

```bash
# Example cron entry: Create campaign every Monday at 9:55 AM IST
55 9 * * 1 /usr/local/bin/create-weekly-campaign.sh
```

Your script should:

1. Fetch or generate the contact list for the current week
2. Upload the list via CSV if needed
3. Create the campaign with the appropriate schedule
4. Store the campaign ID for tracking

### Approach 2: Webhook-Driven Chaining

Use the campaign `status_callback` webhook to trigger the next campaign:

1. Campaign A completes and fires the `status_callback`
2. Your webhook handler receives the completion event
3. Handler creates Campaign B with the next batch of contacts and schedule
4. Repeat as needed

```json
"status_callback": "https://your-server.com/webhooks/campaign-complete"
```

## Scheduling and Retries Interaction

Retries operate within the campaign's scheduled window. This has important implications:

| Scenario | Behavior |
|----------|----------|
| Retry scheduled before `end_at` | Retry executes normally |
| Retry scheduled after `end_at` | Retry is **not** attempted; contact status reflects last attempt |
| Campaign paused before retry | Retry waits until campaign is resumed |

### Example Timeline

Campaign schedule: 10:00 AM to 5:00 PM with 2 retries at 30-minute intervals.

```
10:00 AM - First attempt to Contact A: no-answer
10:30 AM - Retry 1 to Contact A: busy
11:00 AM - Retry 2 to Contact A: completed

4:30 PM  - First attempt to Contact B: no-answer
5:00 PM  - Campaign window ends
           Retry 1 for Contact B: NOT attempted (past end_at)
```

:::tip
If retries are important for your campaign, ensure your scheduling window is long enough to accommodate all retry attempts. With 2 retries at 30-minute intervals, your window needs at least 1 extra hour beyond when the last first-attempt call is placed.
:::

## Calculating Required Campaign Duration

Use this formula to estimate how long your campaign window needs to be:

```
Required minutes = (total_contacts / calls_per_minute) + (retries x interval_mins)
```

**Example:**

- 3,000 contacts at 60 calls/minute = 50 minutes for first attempts
- 2 retries at 15-minute intervals = 30 minutes additional
- Estimated time: ~80 minutes (plus buffer for call duration)

For a comfortable window, add a 50% buffer:

```
Recommended window = Required minutes x 1.5
```

In this example: ~120 minutes = 2 hours.

## Scheduling Configuration Reference

| Setting | Description | Constraints |
|---------|-------------|-------------|
| `send_at` | Campaign start time | Must be in the future; RFC 3339 format |
| `end_at` | Campaign end time | Must be after `send_at`; RFC 3339 format |
| Immediate start | Omit `schedule` entirely | Campaign starts as soon as it is created |
| Schedule update | Modify via PUT endpoint | Only when campaign is in `Created` or `Paused` status |

## Common Scheduling Mistakes

| Mistake | Impact | Fix |
|---------|--------|-----|
| Using UTC without offset | Campaign runs at wrong local time | Always include timezone offset (e.g., `+05:30`) |
| Window too short for retries | Retries never execute | Calculate required duration including retry intervals |
| No `end_at` specified | Campaign runs indefinitely, may call at odd hours | Always set `end_at` for voice campaigns |
| Scheduling past midnight | Calls placed during sleeping hours | Ensure `end_at` falls before 9 PM local time |
| Same schedule for multi-timezone audience | Some contacts called at inappropriate times | Create separate campaigns per timezone |

## Next Steps

- [Creating a Voice Campaign](./creating-voice-campaign) -- Full campaign setup walkthrough
- [Retry Configuration](./campaign-retry-logic) -- Optimize retry timing within your schedule
- [Best Practices](./campaign-best-practices) -- Throughput management across concurrent campaigns
