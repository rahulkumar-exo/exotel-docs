---
id: concurrent-calls
title: Concurrent Call Management
description: "Manage Exotel concurrent call limits, scale capacity for peak traffic, handle burst scenarios, and monitor active call usage."
sidebar_label: Concurrent Calls
sidebar_position: 9
---

# Concurrent Call Management

Concurrent calls represent the number of active voice calls on your Exotel account at any given moment. Managing concurrent call capacity is critical for ensuring callers can always reach your business, especially during peak hours and traffic spikes.

## Understanding Concurrent Calls

### What Counts as a Concurrent Call

| Call State | Concurrent? | Details |
|-----------|------------|---------|
| **Ringing** (not yet answered) | Yes | Counts from the moment Exotel initiates the call |
| **IVR navigation** | Yes | Caller is in an active call session |
| **In queue** (waiting for agent) | Yes | Caller is on hold in a queue |
| **Connected** (parties talking) | Yes | Active conversation |
| **On hold** (mid-call hold) | Yes | Call is still active |
| **Post-processing** (brief state after hangup) | Briefly | Released within seconds of hangup |
| **Completed / Failed** | No | Call has ended |

### Two-Leg Calls

Click-to-call and connect-two-number scenarios consume two concurrent call slots:

```
Click-to-Call:
  Leg A (Exotel → Agent) = 1 concurrent slot
  Leg B (Exotel → Customer) = 1 concurrent slot
  Total = 2 concurrent calls consumed
```

## Default Limits

| Plan | Default Limit | Typical Range |
|------|--------------|---------------|
| **Starter** | 10 concurrent calls | 5 -- 25 |
| **Growth** | 50 concurrent calls | 25 -- 200 |
| **Enterprise** | Custom (starting at 100) | 100 -- 5,000+ |

:::info
Default limits are set during account activation and can be increased based on your needs. Contact your account manager or raise a support ticket to request a limit increase.
:::

## Monitoring Concurrent Calls

### Real-Time Dashboard

Monitor your current concurrent call count in real time:

1. Navigate to **Reports** > **Real-Time Dashboard** (see [Real-Time Dashboard](/docs/reporting/real-time-dashboard))
2. The **Active Calls** widget shows the current count
3. The concurrent call gauge shows utilization as a percentage of your limit

### Key Metrics to Track

| Metric | Description | Where to Find |
|--------|-------------|---------------|
| **Current concurrent calls** | Active calls right now | Real-Time Dashboard |
| **Peak concurrent calls** | Highest count in a period | Analytics Dashboard |
| **Average concurrent calls** | Mean active calls over time | Analytics Dashboard |
| **Concurrent limit utilization** | Current / Limit as percentage | Real-Time Dashboard |
| **Rejected calls (limit exceeded)** | Calls that failed due to limit | Call Logs (status: `failed`) |

### Setting Up Alerts

Configure alerts to notify you before hitting the limit:

| Alert Level | Threshold | Recommended Action |
|-------------|-----------|-------------------|
| **Warning** | 70% of limit | Monitor closely; plan for increase |
| **Urgent** | 85% of limit | Request limit increase immediately |
| **Critical** | 95% of limit | Emergency increase or traffic management |

## Scaling Concurrent Calls

### Requesting a Limit Increase

1. Contact your account manager or raise a support ticket
2. Provide:
   - Current limit and plan
   - Desired new limit
   - Expected peak usage and timing
   - Business justification
3. Limit increases are typically processed within 24 -- 48 hours

### Capacity Planning

Use the following formula to estimate your required concurrent call limit:

```
Required Concurrent Calls = (Calls per Hour / 60) x Average Call Duration (minutes)

Example:
- 1,000 calls per hour
- Average call duration: 3 minutes
- Required: (1000 / 60) x 3 = 50 concurrent calls

Add 30-50% buffer for peaks:
- Recommended limit: 50 x 1.5 = 75 concurrent calls
```

### Traffic Pattern Analysis

| Traffic Pattern | Concurrent Need | Strategy |
|-----------------|----------------|----------|
| **Steady throughout the day** | Moderate, consistent | Set limit to average + 30% buffer |
| **Peak hours (10AM--12PM, 2PM--5PM)** | High during peaks | Set limit to peak + 20% buffer |
| **Campaign-driven spikes** | Very high during campaigns | Request temporary increase before campaign |
| **Seasonal (festivals, sales events)** | Variable | Pre-plan capacity for known events |

## Handling Burst Traffic

### What Happens When Limit Is Reached

When your concurrent call limit is reached:

| Call Type | Behavior |
|-----------|----------|
| **Inbound call** | Caller hears busy tone or is routed to a configured busy flow |
| **Outbound API call** | API returns an error response |
| **Campaign call** | Campaign pauses until a slot is free |

### Burst Capacity (Enterprise)

Enterprise accounts can configure burst capacity for temporary spikes:

| Setting | Description |
|---------|-------------|
| **Base limit** | Your standard concurrent call limit |
| **Burst limit** | Temporarily elevated limit (e.g., 2x base) |
| **Burst duration** | Maximum time the burst limit remains active |
| **Auto-burst** | Automatically enable burst when utilization exceeds a threshold |

:::info
Burst capacity is an Enterprise feature and requires pre-approval. Burst usage is billed at a premium rate. Contact your account manager to configure burst capacity.
:::

### Traffic Management Strategies

When approaching your limit, use these strategies to manage traffic:

| Strategy | Implementation |
|----------|---------------|
| **Queue inbound calls** | Use the Connect applet's queue feature to hold callers instead of rejecting |
| **Throttle outbound campaigns** | Reduce the pacing of outbound campaign calls |
| **Redirect to IVR** | Route callers to self-service IVR instead of agent queues |
| **Shorten call duration** | Implement call duration limits for non-critical calls |
| **Schedule callbacks** | Instead of waiting in queue, offer to call back when capacity is available |
| **Deflect to digital** | Route overflow to WhatsApp or SMS-based support |

## Multi-ExoPhone Capacity

Your concurrent call limit is shared across all ExoPhones on your account:

```
Account Concurrent Limit: 50

ExoPhone A: 20 active calls │
ExoPhone B: 15 active calls │ Total: 45 / 50 (90% utilized)
ExoPhone C: 10 active calls │
```

:::warning
The concurrent limit is account-wide, not per-ExoPhone. If one ExoPhone consumes most of the capacity, other ExoPhones may be affected.
:::

### Distributing Load Across ExoPhones

| Strategy | Description |
|----------|-------------|
| **Department-specific numbers** | Assign separate ExoPhones to Sales, Support, and Billing |
| **Regional numbers** | Use different ExoPhones for different geographic regions |
| **Campaign-specific numbers** | Dedicate ExoPhones to campaign traffic to avoid impacting business lines |

## Dedicated Trunks (Enterprise)

Enterprise accounts can provision dedicated SIP trunks for guaranteed capacity:

| Feature | Shared Infrastructure | Dedicated Trunk |
|---------|----------------------|----------------|
| **Capacity** | Shared pool, subject to limits | Guaranteed reserved capacity |
| **Performance** | Standard | Premium, consistent quality |
| **Scaling** | Request-based | Pre-provisioned |
| **Cost** | Usage-based | Fixed monthly + usage |

## Best Practices

1. **Monitor daily** -- Check concurrent call utilization as part of your daily operations routine
2. **Plan for 30% buffer** -- Set your limit to at least 30% above your typical peak
3. **Pre-scale for events** -- Request limit increases before known high-traffic events (sales, campaigns)
4. **Use queues** -- Implement call queues to handle overflow gracefully instead of rejecting calls
5. **Analyze failed calls** -- Regularly check for calls that failed due to concurrent limit
6. **Distribute across ExoPhones** -- Avoid concentrating all traffic on a single number
7. **Implement callback** -- Offer callbacks during peak times to reduce concurrent load
8. **Review quarterly** -- Reassess your concurrent limit as your business grows

## Related Topics

- [Rate Limiting](/docs/advanced-config/rate-limiting) -- API request throttling
- [High Availability](/docs/advanced-config/high-availability) -- Redundancy and failover
- [Real-Time Dashboard](/docs/reporting/real-time-dashboard) -- Live monitoring
- [Plans Comparison](/docs/billing/plans-comparison) -- Plan limits and features
