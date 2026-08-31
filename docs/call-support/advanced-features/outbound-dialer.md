---
id: outbound-dialer
title: Outbound Dialer
description: "Set up Exotel's outbound dialer for automated calling campaigns with agent allocation, scheduling, and retry logic."
sidebar_label: Outbound Dialer
sidebar_position: 3
---

# Outbound Dialer

The outbound dialer automates the process of calling large lists of phone numbers for sales outreach, customer surveys, payment reminders, and other campaign-driven use cases. Instead of agents manually dialing each number, the dialer handles call placement, retry logic, and agent allocation automatically.

## Dialer Types

| Type | How It Works | Best For |
|---|---|---|
| **Progressive Dialer** | Dials the next number when an agent becomes available | Agent-assisted calls with personal touch |
| **Preview Dialer** | Shows agent the contact info before dialing | Complex sales calls needing preparation |
| **Automated Dialer (Robocall)** | Dials numbers and plays an IVR or recorded message | Reminders, surveys, notifications |
| **Predictive Dialer** | Dials multiple numbers simultaneously based on agent availability predictions | High-volume call centers |

## How the Outbound Dialer Works

### Progressive Dialer Flow

```
Campaign starts
        |
        v
Agent becomes available
        |
        v
Dialer picks next number from the list
        |
        v
Exotel calls the customer
        |
        v
Customer answers → Connected to agent
        |
Customer does not answer → Mark for retry → Move to next number
```

### Automated Dialer Flow

```
Campaign starts
        |
        v
Dialer picks next number from the list
        |
        v
Exotel calls the customer
        |
        v
Customer answers → IVR flow plays
        (e.g., "Your payment of Rs. 500 is due. Press 1 to pay now.")
        |
Customer does not answer → Mark for retry
```

## Setting Up an Outbound Campaign

### Step 1: Prepare Your Contact List

Create a CSV file with phone numbers and optional metadata:

```csv
phone_number,name,amount_due,due_date
+919876543210,Rahul Kumar,500,2025-01-20
+919876543211,Priya Sharma,1200,2025-01-22
+919876543212,Amit Patel,750,2025-01-25
```

**Requirements:**

| Field | Required | Description |
|---|---|---|
| `phone_number` | Yes | Customer phone number in E.164 or 10-digit format |
| Additional fields | No | Custom data for personalized IVR or agent screen pop |

### Step 2: Create a Campaign

#### Via Dashboard

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Navigate to **Campaigns** in the left sidebar.
3. Click **Create Campaign**.
4. Enter the campaign details:
   - **Campaign name**: Descriptive name (e.g., "January Payment Reminders")
   - **Campaign type**: Progressive, Automated, or Preview
   - **ExoPhone**: Select the caller ID number
   - **Call flow**: Select the IVR flow for automated campaigns, or the agent connect flow for progressive campaigns
5. Upload your contact list (CSV).
6. Configure scheduling and retry settings.
7. Save.

#### Via API

```bash
curl -u '<api_key>:<api_token>' -X POST 'https://api.exotel.com/v1/Accounts/<account_sid>/Campaigns' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "January_Payment_Reminders",
    "caller_id": "<exophone>",
    "call_flow_id": "<flow_id>",
    "type": "automated",
    "numbers": [
      "+919876543210",
      "+919876543211",
      "+919876543212"
    ],
    "schedule": {
      "start_time": "2025-01-20T09:00:00+05:30",
      "end_time": "2025-01-20T18:00:00+05:30"
    },
    "retry": {
      "max_attempts": 3,
      "interval_minutes": 60
    }
  }'
```

See: [Campaigns API](/docs/campaigns/overview)

### Step 3: Configure Scheduling

| Setting | Description | Example |
|---|---|---|
| **Start date/time** | When the campaign begins dialing | Jan 20, 9:00 AM IST |
| **End date/time** | When the campaign stops dialing | Jan 20, 6:00 PM IST |
| **Daily window** | Allowed calling hours each day | 9:00 AM - 9:00 PM |
| **Days of week** | Which days to dial | Monday - Saturday |
| **Concurrency** | Maximum simultaneous calls | 10-50 (depends on agents/capacity) |

:::warning
Adhere to TRAI regulations for commercial calling hours (9 AM - 9 PM IST). Calls placed outside these hours may result in penalties. Always filter out DND-registered numbers before starting campaigns.
:::

### Step 4: Configure Retry Logic

| Setting | Description | Recommended Value |
|---|---|---|
| **Max retry attempts** | Total call attempts per number | 2-3 |
| **Retry interval** | Time between retries | 30-60 minutes |
| **Retry on busy** | Retry if the line is busy | Yes |
| **Retry on no answer** | Retry if no one answers | Yes |
| **Retry on failed** | Retry if the call failed to connect | Yes (once) |
| **Do not retry on** | Conditions to stop retrying | DND, invalid number |

See: [Auto Retry](/docs/call-support/advanced-features/auto-retry)

### Step 5: Assign Agents (Progressive/Preview Dialer)

For agent-assisted campaigns:

1. Add agent phone numbers or agent IDs to the campaign.
2. Set the **Agent Allocation Strategy**:

| Strategy | Behavior |
|---|---|
| **Round-robin** | Distribute calls evenly across agents |
| **Longest idle** | Assign to the agent who has been idle the longest |
| **Skills-based** | Match callers to agents with relevant skills |
| **Manual** | Agent requests the next call when ready |

### Step 6: Start the Campaign

1. Review all campaign settings.
2. Click **Start Campaign** (or schedule for a future time).
3. Monitor progress in the campaign dashboard.

## Campaign Management

### Monitoring a Running Campaign

The campaign dashboard shows:

| Metric | Description |
|---|---|
| **Total numbers** | Total contacts in the campaign |
| **Dialed** | Numbers attempted so far |
| **Connected** | Calls where the customer answered |
| **Not connected** | Busy, no answer, failed |
| **Pending** | Numbers not yet dialed |
| **Pending retry** | Numbers waiting for retry |
| **Completed** | Numbers with all attempts exhausted |
| **Connection rate** | Percentage of calls connected |

### Pausing and Resuming

- **Pause**: Stop dialing temporarily without losing progress. Useful during unexpected issues.
- **Resume**: Continue from where the campaign left off.
- **Stop**: End the campaign permanently. Remaining numbers are not dialed.

### Adding Numbers Mid-Campaign

You can add more phone numbers to an active campaign:

```bash
curl -u '<api_key>:<api_token>' -X POST 'https://api.exotel.com/v1/Accounts/<account_sid>/Campaigns/<campaign_id>/Numbers' \
  -d 'Numbers=+919876543213,+919876543214'
```

## Campaign Reporting

After a campaign completes, access the full report:

| Field | Description |
|---|---|
| **Phone number** | The contact's number |
| **Attempts** | Number of call attempts |
| **Final status** | Connected, no answer, busy, failed, DND |
| **Call duration** | Duration of connected calls |
| **IVR response** | DTMF input from the customer (for automated campaigns) |
| **Recording URL** | Link to the call recording |
| **Agent** | Agent who handled the call (for progressive campaigns) |

### Exporting Reports

1. Go to **Campaigns** > select your campaign.
2. Click **Export Report** (CSV or Excel).
3. The report includes all fields listed above.

## Compliance

### DND (Do Not Disturb) Filtering

Before starting a campaign, filter your contact list against the DND registry:

1. Upload your numbers to the DND checking tool in the dashboard.
2. Remove numbers registered on the DND list.
3. Only include numbers with explicit consent for commercial communication.

### TRAI Regulations

| Requirement | Details |
|---|---|
| **Calling hours** | 9:00 AM - 9:00 PM IST only |
| **DND compliance** | Must not call DND-registered numbers without consent |
| **Caller ID** | Must display a valid registered number |
| **Frequency cap** | Do not call the same number more than 3 times per day |

## Best Practices

- **Clean your lists** -- Validate phone numbers and remove duplicates before uploading.
- **Start small** -- Test with a small batch (50-100 numbers) before scaling up.
- **Monitor connection rates** -- If connection rates are below 30%, review your calling times and caller ID.
- **Use Truecaller** -- Enable [Truecaller Verified Caller ID](/docs/call-support/advanced-features/truecaller-verified-caller-id) to improve answer rates.
- **Respect opt-outs** -- If a customer asks to not be called again, remove them from future campaigns immediately.
- **Time your campaigns** -- Best connection rates are typically between 10 AM - 12 PM and 3 PM - 6 PM.
- **Analyze outcomes** -- Review campaign reports to optimize future campaigns.

:::tip
For automated campaigns, design your IVR flow to be concise and action-oriented. Callers have low patience for automated messages. Get to the point within the first 10 seconds.
:::

## Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| Campaign not starting | Scheduling not configured | Set start time or start manually |
| Low connection rate | Calling at wrong times | Adjust calling window to peak hours |
| Agents not receiving calls | Agents not added to campaign | Add agent numbers to the campaign |
| Numbers not retrying | Retry not configured | Enable retry and set max attempts |
| Campaign stuck at 0% | ExoPhone not assigned | Assign a valid ExoPhone to the campaign |
| DND numbers in list | List not filtered | Run DND check before uploading |

## Related

- [Outgoing Calls](/docs/call-support/call-features/outgoing-calls)
- [Automated Calls](/docs/call-support/advanced-features/automated-calls)
- [Auto Retry](/docs/call-support/advanced-features/auto-retry)
- [Call Analytics](/docs/call-support/call-features/call-analytics)
- [Campaigns API](/docs/campaigns/overview)
