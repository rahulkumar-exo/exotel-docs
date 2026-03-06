---
title: Campaign Best Practices
description: "Best practices for running high-connect-rate outbound campaigns on Exotel. Optimize timing, throughput, retries, and contact list quality."
sidebar_label: Best Practices
sidebar_position: 7
---

# Campaign Best Practices

This guide compiles proven strategies for maximizing campaign effectiveness on Exotel. Whether you are running voice campaigns or SMS campaigns, these practices help you achieve higher connect rates, lower costs, and better compliance.

## Contact List Quality

The single biggest factor in campaign success is the quality of your contact list. Even perfect timing and retry configuration cannot compensate for a list full of invalid or unreachable numbers.

### Clean Your Lists Before Upload

| Action | Impact | How |
|--------|--------|-----|
| Remove invalid numbers | Reduces wasted call attempts by 10-20% | Validate E.164 format; check digit count |
| Remove known DND numbers | Avoids regulatory penalties | Cross-reference with NDNC database before upload |
| Deduplicate | Prevents redundant calls | Sort by phone number and remove duplicates in your CRM |
| Remove old/stale numbers | Improves connect rate | Exclude contacts not updated in 6+ months |
| Verify number metadata | Ensures correct personalization | Spot-check names, dates, and amounts in dynamic fields |

### Segment Your Audience

Rather than blasting your entire database, segment contacts for targeted campaigns:

| Segment | Criteria | Benefit |
|---------|----------|---------|
| Hot leads | Recent inquiry or interaction in last 7 days | Higher connect and engagement rate |
| Active customers | Transaction in last 90 days | Numbers are more likely to be active |
| Lapsed customers | No activity in 90-180 days | May need different messaging approach |
| Cold contacts | No activity in 180+ days | Consider SMS-first approach before voice |

:::tip
Start campaigns with your highest-quality segment first. This gives you early performance data to refine settings before reaching larger, less-engaged segments.
:::

## Optimal Timing

### Voice Campaign Scheduling

Connect rates vary dramatically based on time of day. Use these windows as starting points and refine based on your own data:

| Time Window | Audience | Expected Connect Rate |
|-------------|----------|----------------------|
| 10:00 AM -- 12:00 PM | B2B (business contacts) | Highest |
| 2:00 PM -- 5:00 PM | B2B (business contacts) | High |
| 5:00 PM -- 7:00 PM | B2C (consumers) | Highest |
| 10:00 AM -- 12:00 PM | B2C (consumers) | Moderate |
| Before 9:00 AM | Any | Low (avoid for commercial calls) |
| After 9:00 PM | Any | Regulatory violation risk |

### Day-of-Week Patterns

| Day | Voice Campaigns | SMS Campaigns |
|-----|----------------|---------------|
| Monday | Good (avoid early morning) | Good |
| Tuesday -- Thursday | Best | Best |
| Friday | Good (morning better than afternoon) | Good |
| Saturday | Moderate (B2C only, morning) | Good for promotional |
| Sunday | Avoid | Limited (transactional only recommended) |

:::warning
TRAI regulations prohibit unsolicited commercial communication (voice and promotional SMS) before 9:00 AM and after 9:00 PM in India. Configure your campaign schedule to comply with these restrictions.
:::

### SMS Campaign Timing

| SMS Type | Optimal Send Time | Notes |
|----------|-------------------|-------|
| Transactional (OTP, alerts) | Immediately (24/7) | Time-sensitive; send as soon as triggered |
| Promotional offers | 10:00 AM -- 12:00 PM or 5:00 PM -- 7:00 PM | Matches peak phone usage |
| Appointment reminders | 24 hours + 1 hour before | Two-touch approach improves attendance |
| Payment reminders | 9:00 AM -- 11:00 AM | Early morning for financial communications |

## Throughput Management

### Right-Size Your Call Rate

Your campaign's call rate (calls per minute) affects both performance and cost:

| Calls/Min | Capacity Impact | Best For |
|-----------|----------------|----------|
| 10--20 | Low | Small campaigns, testing |
| 30--45 | Moderate | Standard production campaigns |
| 60 (default max) | Full capacity | Large campaigns with time pressure |
| 60+ | Requires capacity upgrade | Enterprise campaigns (contact support) |

### Throttle Configuration

```json
"mode": "custom",
"throttle": 30
```

:::info
Setting throttle to `auto` uses your full account capacity. If you run multiple concurrent campaigns, they share this capacity. Manually throttling each campaign prevents them from starving each other.
:::

### Managing Concurrent Campaigns

If you run multiple campaigns simultaneously, allocate throughput intentionally:

| Campaign | Priority | Throttle | Rationale |
|----------|----------|----------|-----------|
| Payment reminders | High | 40 calls/min | Revenue-critical; needs fast completion |
| Survey campaign | Low | 10 calls/min | Can run over multiple days |
| Promo campaign | Medium | 20 calls/min | Important but not urgent |
| **Total** | | **70 calls/min** | **Exceeds 60; must request capacity increase** |

:::warning
If the combined throttle of concurrent campaigns exceeds your account's call capacity, campaigns will experience queuing delays. Contact Exotel support to request a capacity increase before running high-throughput concurrent campaigns.
:::

## Retry Optimization

### Recommended Retry Settings by Use Case

| Use Case | Retries | Interval | Mechanism | Triggers |
|----------|---------|----------|-----------|----------|
| Appointment reminders | 2 | 30 min | Linear | busy, no-answer |
| Payment collection | 3 | 60 min | Linear | busy, no-answer |
| Emergency alerts | 3 | 5 min | Linear | busy, no-answer, failed |
| Surveys | 2 | 20 min | Exponential | busy, no-answer |
| Promotional offers | 1 | 45 min | Linear | busy, no-answer |

### Retry Diminishing Returns

Each successive retry yields fewer connections:

| Attempt | Typical Additional Connect Rate |
|---------|-------------------------------|
| 1st attempt | 50--65% |
| 1st retry | 15--25% additional |
| 2nd retry | 5--15% additional |
| 3rd retry | 2--8% additional |

After the 2nd retry, the marginal cost per additional connection increases significantly. For cost-sensitive campaigns, 2 retries often provide the best ROI.

## Caller ID Best Practices

### Use Consistent Caller IDs

- Use the same ExoPhone for related campaigns so recipients recognize the number
- For critical communications (payment, appointments), use a dedicated ExoPhone
- Avoid rotating caller IDs within a single campaign as this can reduce trust

### Local Numbers

Use local or regional ExoPhones when possible. Recipients are more likely to answer calls from local area codes than unfamiliar or toll-free numbers.

| ExoPhone Type | Answer Rate | Best For |
|--------------|-------------|----------|
| Local DID (city-specific) | Highest | Regional campaigns, local businesses |
| Toll-free (1800) | Moderate | National campaigns, customer service |
| Mobile-format | High | Personal-touch campaigns |

## IVR and Greeting Design

### Keep It Short

- Greetings should be under 30 seconds
- IVR menus should have no more than 4 options at the first level
- State the purpose of the call in the first 5 seconds

### Dynamic Personalization

Use contact metadata for personalized greetings:

```
Hello @@first_name, this is a reminder from @@company about your appointment on @@date.
Press 1 to confirm, press 2 to reschedule.
```

Personalized campaigns consistently outperform generic ones in both engagement and completion rates.

### Repeat Menu Option

Set `repeat_menu_attempts` to allow recipients to hear the IVR menu again:

```json
"repeat_menu_attempts": 2
```

This accommodates recipients who missed the options on the first listen.

## Webhook Best Practices

### Endpoint Reliability

| Practice | Why |
|----------|-----|
| Return HTTP 200 within 5 seconds | Exotel expects a fast response; slow responses may be treated as failures |
| Use a dedicated webhook endpoint | Avoid mixing campaign webhooks with other application traffic |
| Implement idempotency | Webhooks may be delivered more than once; use CallSid as a dedup key |
| Log all payloads | Store raw webhook data for debugging and reconciliation |

### Use All Three Webhook Types

| Webhook | Configure? | Purpose |
|---------|-----------|---------|
| `call_status_callback` | Yes | Real-time per-call monitoring |
| `call_schedule_callback` | Yes | Trigger fallback actions when retries are exhausted |
| `status_callback` | Yes | Final campaign completion notification |

## Cost Optimization

### Reduce Wasted Calls

1. **Clean lists aggressively**: Every invalid number is a wasted pulse
2. **Limit retries on `failed` status**: Most failures are permanent (invalid numbers)
3. **Set appropriate ring timeout**: A 30-second ring timeout prevents excessive ringing charges
4. **Use scheduling windows**: Avoid calling during low-connect-rate hours

### Choose the Right Channel

| Scenario | Channel | Cost Impact |
|----------|---------|-------------|
| Simple notification, no interaction needed | SMS | Lower cost per contact |
| Requires confirmation or input | Voice (IVR) | Higher cost but higher value |
| High-value communication | Voice | Justified by engagement rate |
| First outreach to cold contacts | SMS | Test engagement before voice |

### Multi-Channel Strategy

Combine voice and SMS for maximum effectiveness:

1. **SMS first**: Send an SMS notification about an upcoming call
2. **Voice follow-up**: Call contacts who did not respond to SMS
3. **SMS fallback**: Send a follow-up SMS to contacts not reached by voice

This approach reduces voice campaign costs by filtering out unresponsive contacts early.

## Compliance Checklist

Before launching any campaign, verify:

| Requirement | Check |
|-------------|-------|
| TRAI calling hours | Schedule is within 9 AM -- 9 PM IST for commercial calls |
| DND/NDNC filtering | Contact list is filtered against NDNC registry |
| DLT compliance (SMS) | Entity ID and Template ID are registered and approved |
| Consent documentation | You have records of recipient consent for the communication type |
| Caller ID validity | ExoPhone is active and assigned to your account |
| Recording consent | If recording calls, the IVR includes a consent announcement |

For detailed regulatory information, see [TRAI Regulations](/docs/faqs/trai-regulations) and [DLT Compliance](/docs/faqs/dlt-compliance).

## Campaign Performance Benchmarks

Use these benchmarks to evaluate your campaign health:

| Metric | Poor | Average | Good | Excellent |
|--------|------|---------|------|-----------|
| Voice connect rate | Below 30% | 30--50% | 50--65% | Above 65% |
| SMS delivery rate | Below 85% | 85--92% | 92--97% | Above 97% |
| Retry success rate | Below 10% | 10--20% | 20--35% | Above 35% |
| IVR completion rate | Below 40% | 40--60% | 60--80% | Above 80% |
| Failure rate | Above 25% | 15--25% | 5--15% | Below 5% |

:::info
These benchmarks are general guidelines based on common Exotel campaign patterns. Your actual results will vary based on industry, audience quality, and campaign type. Track your own baselines over time for more meaningful comparisons.
:::

## Quick Reference: Campaign Setup Checklist

1. Prepare and clean your contact list (CSV, UTF-8, E.164 numbers)
2. Upload the list and confirm processing is complete
3. Create or select your IVR flow or greeting message
4. Set a descriptive campaign name
5. Choose the appropriate caller ID (ExoPhone)
6. Configure retries (2 retries, 15-min linear, on busy/no-answer)
7. Set the schedule within business hours (10 AM -- 6 PM IST)
8. Configure all three webhook endpoints
9. Set throttle to avoid exceeding account capacity
10. Launch and monitor via webhooks and dashboard

## Next Steps

- [Creating a Voice Campaign](./creating-voice-campaign) -- Full campaign creation walkthrough
- [Creating an SMS Campaign](./creating-sms-campaign) -- SMS campaign setup guide
- [Campaign Reports](./campaign-reporting) -- Measure campaign performance
- [Retry Configuration](./campaign-retry-logic) -- Fine-tune retry strategies
