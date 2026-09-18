---
id: auto-retry
title: Auto Retry on Busy
description: "Configure automatic retry logic in Exotel for busy, no-answer, and failed calls with intervals and max attempt limits."
sidebar_label: Auto Retry
sidebar_position: 7
---

# Auto Retry on Busy

Auto retry automatically redials a phone number when the initial call attempt fails due to a busy signal, no answer, or network failure. This is essential for outbound campaigns and callback scenarios where reaching the customer is critical.

## How Auto Retry Works

```
Call attempt 1 → Customer busy / no answer
        |
        v
Wait (retry interval, e.g., 30 minutes)
        |
        v
Call attempt 2 → Customer busy / no answer
        |
        v
Wait (retry interval)
        |
        v
Call attempt 3 → Customer answers → Connected
        (or max attempts reached → Mark as unreachable)
```

## Retry Triggers

Auto retry activates based on the call outcome:

| Outcome | Should Retry? | Reason |
|---|---|---|
| **Busy** | Yes | Customer is on another call; they may be free later |
| **No answer** | Yes | Customer may have been away from the phone |
| **Failed** | Yes (once) | Network issue may be temporary |
| **Completed** | No | Call was successful |
| **Canceled** | No | Call was canceled by the system or user |
| **Invalid number** | No | Number does not exist; retry will not help |
| **DND** | No | Number is on the Do Not Disturb registry |

## Configuring Auto Retry

### For Outbound Campaigns

When setting up a campaign via the dashboard or [Campaigns API](/docs/campaigns/overview), configure the retry settings:

| Setting | Description | Recommended Value |
|---|---|---|
| **Max retry attempts** | Maximum number of additional attempts after the first | 2-3 |
| **Retry interval** | Time between retry attempts | 30-60 minutes |
| **Retry on busy** | Retry when the line is busy | Yes |
| **Retry on no answer** | Retry when no one answers | Yes |
| **Retry on failed** | Retry on network/connection failure | Yes (1 attempt) |
| **Retry time window** | Restrict retries to certain hours | 9 AM - 9 PM |
| **Total attempts** | First attempt + retries | 3-4 total |

#### Via Dashboard

1. Go to **Campaigns** > **Create Campaign** (or edit existing).
2. In the **Retry Settings** section:
   - Enable **Auto Retry**.
   - Set **Max Retry Attempts** (e.g., 2).
   - Set **Retry Interval** (e.g., 60 minutes).
   - Select which outcomes trigger a retry.
3. Save.

#### Via API

```bash
curl -u '<api_key>:<api_token>' -X POST 'https://api.exotel.com/v1/Accounts/<account_sid>/Campaigns' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Payment_Reminders",
    "caller_id": "<exophone>",
    "call_flow_id": "<flow_id>",
    "numbers": ["+919876543210", "+919876543211"],
    "retry": {
      "max_attempts": 3,
      "interval_minutes": 60,
      "retry_on": ["busy", "no-answer", "failed"]
    },
    "schedule": {
      "daily_start": "09:00",
      "daily_end": "21:00"
    }
  }'
```

### For Individual API Calls

When using the [Connect Two Numbers API](/docs/voice-v1/api-reference/connect-two-numbers) or [Connect to Flow API](/docs/voice-v1/api-reference/connect-to-flow), implement retry logic in your application:

```python
import time
import requests

def call_with_retry(customer_number, max_retries=3, interval_seconds=1800):
    for attempt in range(1, max_retries + 1):
        response = exotel_api.connect_call(
            from_number=agent_number,
            to_number=customer_number,
            caller_id=exophone
        )

        call_sid = response['Call']['Sid']

        # Wait for call to complete
        call_status = wait_for_completion(call_sid)

        if call_status in ['completed', 'in-progress']:
            print(f"Call connected on attempt {attempt}")
            return call_sid

        if call_status in ['busy', 'no-answer']:
            if attempt < max_retries:
                print(f"Attempt {attempt} failed ({call_status}). Retrying in {interval_seconds}s...")
                time.sleep(interval_seconds)
            else:
                print(f"All {max_retries} attempts exhausted. Customer unreachable.")
                return None

        if call_status == 'failed':
            # Only retry once for failures
            if attempt == 1:
                time.sleep(60)
                continue
            return None

    return None
```

### Using Status Callbacks for Retry Triggers

Instead of polling for call status, use [Status Callbacks](/docs/voice-v1/api-reference/status-callback) to trigger retries:

```python
# Your webhook endpoint
def handle_call_callback(request):
    call_sid = request.POST['CallSid']
    status = request.POST['Status']
    customer_number = request.POST['To']

    if status in ['busy', 'no-answer']:
        # Check retry count
        retry_count = db.get_retry_count(customer_number)

        if retry_count < MAX_RETRIES:
            # Schedule retry
            scheduler.schedule(
                func=make_call,
                args=[customer_number],
                delay=timedelta(minutes=60)
            )
            db.increment_retry_count(customer_number)
        else:
            db.mark_as_unreachable(customer_number)

    elif status == 'completed':
        db.mark_as_contacted(customer_number)

    return Response(status=200)
```

## Retry Interval Strategies

| Strategy | Interval Pattern | Best For |
|---|---|---|
| **Fixed interval** | 60 min, 60 min, 60 min | Simple, predictable |
| **Increasing interval** | 30 min, 60 min, 120 min | Avoids annoyance from frequent retries |
| **Time-of-day based** | Retry at 10 AM, 2 PM, 5 PM | Targets different parts of the day |
| **Smart interval** | Based on past answer patterns | Data-driven, highest connection rate |

### Fixed Interval

Retries happen at consistent intervals:

```
Attempt 1: 10:00 AM → No answer
Attempt 2: 11:00 AM → Busy
Attempt 3: 12:00 PM → Connected
```

### Increasing Interval (Exponential Backoff)

Each retry waits longer than the previous:

```
Attempt 1: 10:00 AM → No answer
Attempt 2: 10:30 AM → No answer (30 min later)
Attempt 3: 11:30 AM → No answer (60 min later)
Attempt 4: 1:30 PM → Connected (120 min later)
```

This reduces the risk of annoying customers with frequent calls.

### Time-of-Day Based

Retry at specific times known for higher answer rates:

```
Attempt 1: 10:00 AM → No answer
Attempt 2: 2:00 PM → Busy
Attempt 3: 5:00 PM → Connected
```

:::tip
Data from most outbound campaigns shows that answer rates are highest between 10-11 AM and 4-6 PM on weekdays. Schedule your retries to target these windows.
:::

## Retry Limits and Safety

### Maximum Attempts

| Context | Recommended Max | Reason |
|---|---|---|
| **Payment reminders** | 3-4 attempts | Important but not urgent |
| **Delivery confirmations** | 2-3 attempts | Time-sensitive |
| **Sales outreach** | 2-3 attempts | Avoid appearing aggressive |
| **Appointment reminders** | 2 attempts | Single reminder is usually sufficient |
| **Emergency notifications** | 5-6 attempts | Critical to reach the person |

### Regulatory Limits

| Regulation | Limit |
|---|---|
| **TRAI (India)** | Maximum calls during 9 AM - 9 PM only |
| **General best practice** | No more than 3-5 call attempts per number per day |
| **DND compliance** | Do not retry DND-registered numbers |

:::warning
Excessive retries can lead to complaints and your ExoPhone being flagged as spam. Limit total attempts to 3-4 per number per day, and always respect the customer's right to opt out.
:::

## Monitoring Retry Performance

Track these metrics to optimize your retry strategy:

| Metric | Description | Target |
|---|---|---|
| **First-attempt connection rate** | Calls connected on the first try | Above 40% |
| **Retry connection rate** | Calls connected on retry attempts | Above 30% per retry |
| **Total connection rate** | Calls connected across all attempts | Above 70% |
| **Average attempts to connect** | Mean number of attempts before connection | Under 2 |
| **Unreachable rate** | Numbers that could not be reached after all retries | Under 20% |
| **Retry ROI** | Additional connections gained from retries | Positive (each retry should add >10% connections) |

### Diminishing Returns

Track whether additional retries are worth the cost:

| Attempt | Connection Rate (Cumulative) | Incremental Gain |
|---|---|---|
| 1st attempt | 40% | -- |
| 2nd attempt | 60% | +20% |
| 3rd attempt | 70% | +10% |
| 4th attempt | 73% | +3% |
| 5th attempt | 74% | +1% |

In this example, the 4th and 5th attempts yield diminishing returns and may not justify the cost and annoyance.

## Best Practices

- **Start with 2-3 retries** -- This reaches most available customers without excessive attempts.
- **Use increasing intervals** -- Give customers time between attempts.
- **Vary the time of day** -- If the first attempt was morning, retry in the afternoon.
- **Respect opt-outs** -- If a customer indicates they do not want to be called, stop retrying immediately.
- **Monitor connection rates per retry** -- If the 3rd retry adds less than 5% connections, it may not be worth the cost.
- **Combine with SMS** -- After 1-2 failed call attempts, send an SMS asking the customer to call back at their convenience.
- **Filter invalid numbers** -- Do not retry numbers that are invalid, disconnected, or on DND.

## Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| Retries not happening | Auto retry not enabled | Enable in campaign settings |
| Too many retries | Max attempts set too high | Reduce to 2-3 |
| Retries at wrong times | Retry window not configured | Set daily start/end times |
| Same number retried after connection | Status not updated correctly | Check status callback handling |
| Retries flooding agents | Too many concurrent retries | Limit concurrency in campaign settings |

## Related

- [Outbound Dialer](/docs/call-support/advanced-features/outbound-dialer)
- [Outgoing Calls](/docs/call-support/call-features/outgoing-calls)
- [Automated Calls](/docs/call-support/advanced-features/automated-calls)
- [Call Analytics](/docs/call-support/call-features/call-analytics)
- [Campaigns API](/docs/campaigns/overview)
