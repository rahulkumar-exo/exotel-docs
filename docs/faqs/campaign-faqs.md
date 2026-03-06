---
title: Campaign FAQs
description: "Frequently asked questions about Exotel voice and SMS campaigns including scheduling, retries, reporting, contact management, and troubleshooting."
sidebar_label: Campaign FAQs
sidebar_position: 21
---

# Campaign FAQs

Common questions about creating, managing, and troubleshooting voice and SMS campaigns on Exotel.

---

## How many contacts can a campaign have?

| Campaign Type | Method | Max Contacts |
|--------------|--------|-------------|
| Voice (inline numbers) | `from` parameter | 5,000 |
| Voice (CSV list, static) | `lists` parameter | 1,00,000 per list (up to 5 lists) |
| Voice (CSV list, dynamic) | `lists` parameter | 5,00,000 (1 list only) |
| SMS (static) | `lists` parameter | 1,00,000 per list (up to 5 lists) |
| SMS (dynamic) | `lists` parameter | 5,00,000 (1 list only) |

For campaigns exceeding these limits, split your contacts into multiple lists and create separate campaigns.

---

## How do I schedule a campaign?

Include a `schedule` object in your campaign creation request:

```json
"schedule": {
  "send_at": "2024-02-01T09:00:00+05:30",
  "end_at": "2024-02-01T18:00:00+05:30"
}
```

- `send_at`: When the campaign starts processing contacts
- `end_at`: When the campaign stops (remaining contacts are paused)
- Both timestamps use RFC 3339 format with timezone offset
- Omit the schedule object to start immediately

See [Campaign Scheduling](/docs/campaign-guides/campaign-scheduling) for detailed scheduling strategies.

---

## Can I pause and resume a campaign?

Yes. Active campaigns can be paused and resumed:

**Pause:**
```bash
curl -X PUT "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/campaigns/<campaign_id>" \
  -H "Content-Type: application/json" \
  -d '{"action": "pause"}'
```

**Resume:**
```bash
curl -X PUT "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/campaigns/<campaign_id>" \
  -H "Content-Type: application/json" \
  -d '{"action": "resume"}'
```

When paused:
- In-progress calls complete normally
- No new calls are initiated
- Pending contacts and retries are held in queue
- The campaign can be resumed at any time

---

## What happens to pending contacts when a campaign ends?

| Scenario | Behavior |
|----------|----------|
| Campaign reaches `end_at` | Pending contacts remain queued; campaign status changes to Paused |
| Campaign force-completed | Pending contacts are marked as `failed` |
| Campaign paused and not resumed | Contacts remain pending indefinitely until resumed or force-completed |

:::tip
If your campaign pauses at `end_at` with remaining contacts, you can update the schedule and resume to process them the next day. See [Campaign Scheduling](/docs/campaign-guides/campaign-scheduling) for multi-day strategies.
:::

---

## How do retries work?

Retries automatically re-dial contacts who were not reached on the first attempt:

```json
"retries": {
  "number_of_retries": 2,
  "interval_mins": 15,
  "mechanism": "Linear",
  "on_status": ["busy", "no-answer"]
}
```

| Setting | Description | Range |
|---------|-------------|-------|
| `number_of_retries` | Max retry attempts | 0--3 |
| `interval_mins` | Minutes between attempts | 1+ |
| `mechanism` | `Linear` (fixed interval) or `Exponential` (doubling interval) | -- |
| `on_status` | Which outcomes trigger retries | `busy`, `no-answer`, `failed` |

See [Retry Configuration](/docs/campaign-guides/campaign-retry-logic) for detailed retry strategies.

---

## How do I get campaign reports?

### Via API

```bash
curl "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/campaigns/<campaign_id>"
```

### Via Dashboard

1. Navigate to **Campaigns** in the left sidebar
2. Click on a specific campaign
3. View stats, contact status, and call details
4. Click **Export** to download as CSV

### Via Webhooks

Configure callback URLs when creating the campaign:
- `call_status_callback` -- Per-call updates (voice campaigns)
- `sms_status_callback` -- Per-SMS delivery updates (SMS campaigns)
- `status_callback` -- Campaign-level status changes

See [Campaign Reporting](/docs/campaign-guides/campaign-reporting) and [SMS Campaign Reporting](/docs/campaign-guides/sms-campaign-reporting) for comprehensive guides.

---

## Can I run multiple campaigns simultaneously?

Yes. You can run multiple campaigns at the same time, but be aware of capacity constraints:

| Consideration | Impact |
|--------------|--------|
| **Shared call capacity** | All concurrent voice campaigns share your calls-per-minute limit |
| **Shared SMS capacity** | All concurrent SMS campaigns share your SMS-per-minute limit |
| **Throttle management** | Set individual throttle rates to prevent campaigns from starving each other |
| **Credit consumption** | Monitor credit balance; multiple campaigns consume credits faster |

:::warning
If the combined throughput of concurrent campaigns exceeds your account capacity, campaigns will experience delays and queuing. Either throttle individual campaigns or contact support to increase your account capacity.
:::

---

## Can I add contacts to a running campaign?

You cannot add contacts to an active campaign. However, you have these alternatives:

1. **Pause the campaign**, add a new contact list, and resume
2. **Create a supplementary campaign** with the additional contacts
3. **Use dynamic lists** (via list SID) that can be updated independently

---

## What is the difference between static and dynamic campaigns?

| Feature | Static Campaign | Dynamic Campaign |
|---------|----------------|-----------------|
| Message content | Same for all recipients | Personalized per recipient using CSV columns |
| Contact lists | Up to 5 lists | 1 list only |
| Variable support | No | Yes (`@@column_header` syntax) |
| Use case | Same notification to all | Personalized messages (names, amounts, dates) |

---

## Why is my campaign stuck in "Created" status?

| Cause | Solution |
|-------|----------|
| `send_at` is in the future | Wait for the scheduled time, or update the schedule |
| Contact list is still processing | Check CSV upload status; wait for completion |
| Insufficient credits | Add credits to your account |
| ExoPhone is not active | Verify ExoPhone status in dashboard |
| IVR flow URL is invalid | Verify the call flow URL is correct and the flow is published |

---

## Why is my campaign's connect rate low?

| Cause | Improvement |
|-------|------------|
| Calling outside business hours | Schedule campaigns between 10 AM -- 6 PM |
| Poor list quality (stale numbers) | Clean and validate contact lists |
| No retries configured | Add 2 retries with 15-min intervals |
| DND numbers in the list | Pre-filter using DND scrubbing |
| Aggressive retry timing | Increase interval to 15-30 minutes |
| Wrong caller ID | Use a local/recognizable ExoPhone |

See [Campaign Best Practices](/docs/campaign-guides/campaign-best-practices) for optimization strategies.

---

## Can I cancel a campaign after creation?

You cannot delete a created campaign, but you can:

1. **Pause** the campaign to stop processing
2. **Force-complete** to mark remaining contacts as failed
3. **Archive** a completed campaign for long-term storage

---

## How are campaign calls billed?

Each call attempt (including retries) is billed as a separate call:

| Billing Event | Charge |
|--------------|--------|
| Call attempt (answered) | Per-pulse charges based on duration |
| Call attempt (unanswered, ringing) | Minimum charge (plan-dependent) |
| Retry attempt | Same as a new call attempt |
| SMS delivery | Per-message charge |

:::info
Budget for worst-case scenario: (1 + max_retries) x contact_count call attempts. In practice, many contacts connect on the first attempt, so actual costs are typically lower.
:::

---

## Related Resources

- [Campaign Guides Overview](/docs/campaign-guides/overview) -- All campaign how-to guides
- [Creating a Voice Campaign](/docs/campaign-guides/creating-voice-campaign) -- Step-by-step voice campaign setup
- [Creating an SMS Campaign](/docs/campaign-guides/creating-sms-campaign) -- Step-by-step SMS campaign setup
- [Campaign API Reference](/docs/campaigns/overview) -- Voice campaign API endpoints
- [SMS Campaign API Reference](/docs/sms-campaigns/overview) -- SMS campaign API endpoints
