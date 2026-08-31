---
title: Campaign Retry Configuration
description: "Configure retry logic for voice campaigns on Exotel. Set max attempts, retry intervals, linear vs exponential backoff, and trigger conditions."
sidebar_label: Retry Configuration
sidebar_position: 4
---

# Campaign Retry Configuration

Retry logic automatically re-dials contacts who were not reached on the first attempt. Configuring retries correctly is one of the most effective ways to improve your campaign's overall connect rate without increasing your contact list size.

## How Retries Work

When a call attempt results in a retriable outcome (busy, no-answer, or failed), the campaign engine queues the contact for another attempt after the configured interval. This process repeats until the contact is reached or the maximum retry count is exhausted.

```
First attempt --> busy
  Wait 15 min --> Retry 1 --> no-answer
    Wait 15 min --> Retry 2 --> completed (connected)
```

Retries are processed alongside first-attempt calls. The campaign engine interleaves retries with new contacts based on when each retry becomes eligible, maintaining the configured calls-per-minute throughput.

## Retry Configuration Object

The `retries` object is an optional parameter in the campaign creation request:

```json
"retries": {
  "number_of_retries": 2,
  "interval_mins": 15,
  "mechanism": "Linear",
  "on_status": ["busy", "no-answer", "failed"]
}
```

### Parameters

| Parameter | Type | Range | Default | Description |
|-----------|------|-------|---------|-------------|
| `number_of_retries` | Integer | 0--3 | 0 | Maximum number of retry attempts per contact |
| `interval_mins` | Integer | 1+ | -- | Minutes between retry attempts |
| `mechanism` | String | `Linear`, `Exponential` | `Linear` | How the interval scales across retries |
| `on_status` | Array | `busy`, `no-answer`, `failed` | -- | Which call outcomes trigger a retry |

## Retry Trigger Statuses

Not every unsuccessful call outcome should trigger a retry. Choose trigger statuses based on your campaign goals:

| Status | Meaning | Retry Recommended? | Rationale |
|--------|---------|-------------------|-----------|
| `busy` | Recipient's line was engaged | Yes | Contact is likely available shortly |
| `no-answer` | Call rang but was not picked up | Yes | Contact may be temporarily unavailable |
| `failed` | Call could not connect (network error, invalid number) | Sometimes | Useful for transient network failures; wastes retries on permanently invalid numbers |
| `completed` | Call was answered | No | Contact was reached; no retry needed |

:::tip
For most campaigns, configure retries on `busy` and `no-answer` only. Adding `failed` to the trigger list can waste retry attempts on numbers that are permanently unreachable (disconnected, invalid, or out of service).
:::

## Retry Mechanisms

### Linear Backoff

With linear backoff, each retry waits the same fixed interval:

```json
"mechanism": "Linear",
"interval_mins": 15,
"number_of_retries": 3
```

**Timeline example:**

| Event | Time | Interval |
|-------|------|----------|
| First attempt | 10:00 AM | -- |
| Retry 1 | 10:15 AM | +15 min |
| Retry 2 | 10:30 AM | +15 min |
| Retry 3 | 10:45 AM | +15 min |

**Best for:** Standard campaigns where you want consistent spacing between attempts.

### Exponential Backoff

With exponential backoff, each retry waits progressively longer. The interval doubles with each attempt:

```json
"mechanism": "Exponential",
"interval_mins": 10,
"number_of_retries": 3
```

**Timeline example:**

| Event | Time | Interval |
|-------|------|----------|
| First attempt | 10:00 AM | -- |
| Retry 1 | 10:10 AM | +10 min (10 x 2^0) |
| Retry 2 | 10:30 AM | +20 min (10 x 2^1) |
| Retry 3 | 11:10 AM | +40 min (10 x 2^2) |

**Best for:** Campaigns where you want to spread retries over a longer period, increasing the chance of catching the contact at a different time of day.

## Recommended Retry Configurations

### Appointment Reminders

```json
"retries": {
  "number_of_retries": 2,
  "interval_mins": 30,
  "mechanism": "Linear",
  "on_status": ["busy", "no-answer"]
}
```

Rationale: Two retries at 30-minute intervals give the recipient time to become available without being too aggressive.

### Payment Collection

```json
"retries": {
  "number_of_retries": 3,
  "interval_mins": 60,
  "mechanism": "Linear",
  "on_status": ["busy", "no-answer"]
}
```

Rationale: Payment calls benefit from maximum retries spread over a longer window to catch contacts at different times.

### Emergency Notifications

```json
"retries": {
  "number_of_retries": 3,
  "interval_mins": 5,
  "mechanism": "Linear",
  "on_status": ["busy", "no-answer", "failed"]
}
```

Rationale: Urgent notifications need rapid retries. Include `failed` status to handle transient network issues.

### Survey / Feedback Campaigns

```json
"retries": {
  "number_of_retries": 2,
  "interval_mins": 20,
  "mechanism": "Exponential",
  "on_status": ["busy", "no-answer"]
}
```

Rationale: Exponential backoff spreads retries across a wider window, reducing the perception of repeated calling.

## Retries and Scheduling Interaction

Retries are constrained by the campaign's scheduling window. If a retry is due after the `end_at` time, it is **not** attempted.

| Scenario | Behavior |
|----------|----------|
| Retry due before `end_at` | Retry executes normally |
| Retry due after `end_at` | Retry is skipped; contact status reflects the last attempt |
| Campaign paused before retry is due | Retry waits until the campaign is resumed |
| Campaign force-completed | All pending retries are cancelled; contacts marked as failed |

### Example: Window Too Short for Retries

Campaign schedule: 4:00 PM to 5:00 PM with 2 retries at 30-minute intervals.

```
4:00 PM - First attempt to Contact A: no-answer
4:30 PM - Retry 1 to Contact A: busy
5:00 PM - Campaign window ends
           Retry 2 for Contact A: NOT attempted (past end_at)
```

:::warning
Always ensure your campaign scheduling window is long enough to accommodate all retry attempts. Use this formula to estimate the minimum window:

**Minimum window** = (contacts / calls_per_minute) + (number_of_retries x interval_mins)

Add a 50% buffer for call durations and processing overhead.
:::

## Retry Impact on Campaign Duration

Retries extend the effective duration of your campaign. Plan your scheduling window accordingly:

| Contacts | Retries | Interval | Mechanism | Estimated Additional Time |
|----------|---------|----------|-----------|--------------------------|
| 1,000 | 1 | 15 min | Linear | +15 minutes |
| 1,000 | 2 | 15 min | Linear | +30 minutes |
| 1,000 | 3 | 15 min | Linear | +45 minutes |
| 1,000 | 2 | 10 min | Exponential | +30 minutes (10 + 20) |
| 1,000 | 3 | 10 min | Exponential | +70 minutes (10 + 20 + 40) |

:::info
These estimates assume worst-case scenarios where all contacts require retries. In practice, a significant portion of contacts are reached on the first attempt, so actual retry volumes are lower.
:::

## Retry Cost Considerations

Each retry attempt consumes call capacity and incurs billing charges equivalent to a new call attempt:

- **Ringing cost**: Even unanswered calls may incur a minimum pulse charge depending on your plan
- **Capacity usage**: Retries count toward your calls-per-minute limit alongside first attempts
- **Credit consumption**: Budget for (1 + number_of_retries) x contact_count calls in the worst case

:::tip
Monitor your campaign's retry rate in the [Campaign Reports](./campaign-reporting). If more than 60% of contacts require retries, consider improving your contact list quality or adjusting your scheduling window to match your audience's peak availability.
:::

## Retry Reporting

After a campaign completes, you can analyze retry effectiveness through the campaign details endpoint:

```bash
curl -u '<api_key>:<api_token>' "https://api.exotel.com/v2/accounts/<account_sid>/campaigns/<campaign_id>"
```

The response includes per-contact status showing how many attempts were made:

| Metric | Description |
|--------|-------------|
| `completed` | Contacts successfully reached (on any attempt) |
| `failed` | Contacts not reached after all retry attempts exhausted |
| `pending` | Contacts not yet processed (campaign still running or paused) |

For per-call attempt details, use the `call_status_callback` webhook or the [Campaign Call Details API](/docs/campaigns/api-reference/campaign-call-details).

## Common Retry Mistakes

| Mistake | Impact | Fix |
|---------|--------|-----|
| Setting retries to 3 with short intervals | Aggressive calling pattern; may annoy recipients | Use longer intervals (15+ min) or exponential backoff |
| Including `failed` status without filtering invalid numbers | Wastes retries on permanently unreachable numbers | Clean your contact list before upload; use DND filtering |
| No retries configured | Low connect rate; many contacts never reached | Add at least 1-2 retries for most campaigns |
| Scheduling window too short for retries | Retries never execute | Calculate minimum window including retry buffer |
| Same retry config for all campaign types | Suboptimal for specific use cases | Match retry aggressiveness to campaign urgency |

## Full Example: Campaign with Retry Configuration

```bash
curl -u '<api_key>:<api_token>' -X POST "https://api.exotel.com/v2/accounts/<account_sid>/campaigns" \
  -H "Content-Type: application/json" \
  -d '{
    "lists": ["list_sid_1"],
    "caller_id": "0XXXXXX4890",
    "flow_type": "ivr",
    "url": "http://my.exotel.com/<account_sid>/exoml/start_voice/926",
    "name": "Payment Reminder Q1",
    "campaign_type": "static",
    "retries": {
      "number_of_retries": 3,
      "interval_mins": 30,
      "mechanism": "Linear",
      "on_status": ["busy", "no-answer"]
    },
    "schedule": {
      "send_at": "2024-03-01T09:00:00+05:30",
      "end_at": "2024-03-01T18:00:00+05:30"
    },
    "call_status_callback": "https://your-server.com/webhooks/call-status",
    "status_callback": "https://your-server.com/webhooks/campaign-complete"
  }'
```

## Next Steps

- [Campaign Scheduling](./campaign-scheduling) -- Ensure your schedule accommodates retry windows
- [Campaign Reports](./campaign-reporting) -- Analyze retry effectiveness and connect rates
- [Best Practices](./campaign-best-practices) -- Optimize overall campaign performance
- [Contact List Management](./campaign-contacts-management) -- Clean lists to reduce unnecessary retries
