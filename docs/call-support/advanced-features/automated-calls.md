---
id: automated-calls
title: Automated Calls
description: "Set up automated voice calls in Exotel for reminders, notifications, surveys, and robocalls using APIs and campaigns."
sidebar_label: Automated Calls
sidebar_position: 8
---

# Automated Calls

Automated calls (also known as robocalls or voice broadcasts) are outbound calls initiated programmatically without a live agent on the line. When the recipient answers, they hear a pre-recorded message or interact with an IVR flow. Automated calls are used for appointment reminders, payment notifications, surveys, alerts, and marketing messages.

## How Automated Calls Work

```
Your application triggers a call via API
        |
        v
Exotel calls the customer
        |
        v
Customer answers
        |
        v
Pre-recorded message plays (or IVR flow starts)
        |
        v
Customer interacts (presses keys) or listens
        |
        v
Call ends → Status callback sent to your server
```

Unlike agent-assisted calls, automated calls do not involve a human agent. The entire interaction is handled by the call flow.

## Common Use Cases

| Use Case | Description | Example Message |
|---|---|---|
| **Appointment reminders** | Remind customers of upcoming appointments | "Your appointment is tomorrow at 3 PM. Press 1 to confirm, 2 to reschedule." |
| **Payment reminders** | Notify about due or overdue payments | "Your payment of Rs. 500 is due on January 20. Press 1 for payment options." |
| **Order updates** | Inform about order status changes | "Your order #1234 has been shipped and will arrive by January 22." |
| **Delivery notifications** | Alert about upcoming deliveries | "Your delivery is scheduled between 2-4 PM today. Press 1 if someone will be available." |
| **OTP / Verification** | Deliver one-time passwords via voice | "Your verification code is 4-5-7-8. Repeating: 4-5-7-8." |
| **Surveys** | Collect customer feedback via DTMF | "How would you rate your experience? Press 1 for excellent, 2 for good, 3 for poor." |
| **Emergency alerts** | Broadcast urgent notifications | "Severe weather alert for your area. Stay indoors and follow safety guidelines." |
| **Marketing promotions** | Promote offers to opted-in customers | "Exclusive offer: 30% off on all electronics this weekend. Press 1 for details." |
| **Event reminders** | Remind about upcoming events | "Reminder: The webinar starts in 1 hour. Join at example.com/webinar." |

## Setting Up Automated Calls

### Method 1: Single Automated Call (API)

Use the [Connect to Flow API](/docs/voice-v1/api-reference/connect-to-flow) to call a single number and connect them to an IVR flow:

```bash
curl -X POST 'https://<api_key>:<api_token>@api.exotel.com/v1/Accounts/<account_sid>/Calls/connect.json' \
  -d 'From=<customer_number>' \
  -d 'CallerId=<exophone>' \
  -d 'Url=http://my.exotel.com/exoml/start/<app_id>' \
  -d 'StatusCallback=https://your-app.com/call-status'
```

**Parameters:**

| Parameter | Required | Description |
|---|---|---|
| `From` | Yes | Customer's phone number |
| `CallerId` | Yes | ExoPhone to display as caller ID |
| `Url` | Yes | The call flow (App) URL to execute when the customer answers |
| `StatusCallback` | No | URL to receive call completion details |
| `TimeLimit` | No | Maximum call duration in seconds |
| `TimeOut` | No | How long to ring before giving up |

### Method 2: Bulk Automated Calls (Campaign)

For calling large lists, use the [Campaigns API](/docs/campaigns/overview):

```bash
curl -X POST 'https://<api_key>:<api_token>@api.exotel.com/v1/Accounts/<account_sid>/Campaigns' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Appointment_Reminders_Jan20",
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
      "max_attempts": 2,
      "interval_minutes": 60
    },
    "concurrency": 10
  }'
```

See: [Outbound Dialer](/docs/call-support/advanced-features/outbound-dialer) for detailed campaign setup.

### Method 3: Event-Triggered Automated Calls

Trigger automated calls from your application when specific events occur:

```python
# Example: Trigger appointment reminder 24 hours before
def send_appointment_reminder(appointment):
    if appointment.datetime - now() <= timedelta(hours=24):
        exotel_api.connect_to_flow(
            from_number=appointment.customer_phone,
            caller_id=exophone,
            flow_url=f"http://my.exotel.com/exoml/start/{REMINDER_FLOW_ID}",
            status_callback="https://your-app.com/reminder-status"
        )
```

**Common event triggers:**

| Event | Automated Call Action |
|---|---|
| Appointment created | Schedule reminder call 24 hours before |
| Payment overdue | Trigger payment reminder call |
| Order shipped | Call with delivery ETA |
| Account activity detected | Security alert call |
| Subscription expiring | Renewal reminder call |

## Designing Automated Call Flows

### Informational Call (No Interaction)

A simple call that plays a message and hangs up:

```
Greeting ("Your order #1234 has been shipped. Expected delivery: January 22.")
    → Hangup
```

### Interactive Call (With DTMF Input)

A call that collects caller input via keypress:

```
Greeting ("Your appointment is scheduled for tomorrow at 3 PM.")
    → IVR Menu ("Press 1 to confirm, Press 2 to reschedule, Press 3 to cancel.")
        → 1: Greeting ("Thank you for confirming.") → Hangup
        → 2: Greeting ("We will call you to reschedule.") → SMS (reschedule link) → Hangup
        → 3: Greeting ("Your appointment has been cancelled.") → Hangup
```

### Survey Call

Collect structured feedback:

```
Greeting ("Thank you for being our customer. We would like your feedback.")
    → IVR Q1 ("How would you rate your experience? 1 for excellent, 2 for good, 3 for poor.")
        → IVR Q2 ("Would you recommend us? 1 for yes, 2 for no.")
            → Greeting ("Thank you for your feedback!") → Hangup
```

### OTP Delivery Call

Deliver a verification code via voice:

```
Greeting ("Your verification code is 4. 5. 7. 8. Repeating: 4. 5. 7. 8.")
    → Hangup
```

:::tip
When delivering OTPs via voice, read each digit individually with a pause between them. Repeat the code at least once. This ensures the listener can note it down accurately.
:::

## Personalized Automated Calls

For personalized messages (e.g., including the customer's name, order number, or balance), use the Passthru applet to dynamically generate greetings:

### Using Dynamic TTS

1. Add a **Passthru** applet at the start of the flow.
2. Your server returns personalized text.
3. A TTS Greeting applet reads the personalized message.

```
Passthru → Your server returns: "Hello Rahul, your balance is Rs. 1,500."
    → Greeting (TTS, dynamic text) → Hangup
```

### Using Pre-Recorded Audio with Variables

1. Pre-record common message segments.
2. Use Passthru to determine which segments to play.
3. Chain multiple Greeting applets with the appropriate segments.

```
Greeting ("Your order") → Greeting (order number audio) → Greeting ("has been shipped") → Hangup
```

## Handling Call Outcomes

Use [Status Callbacks](/docs/voice-v1/api-reference/status-callback) to track the outcome of each automated call:

| Status | Meaning | Your Action |
|---|---|---|
| `completed` | Customer answered and heard the message | Mark as delivered |
| `no-answer` | Customer did not answer | Schedule retry (see [Auto Retry](/docs/call-support/advanced-features/auto-retry)) |
| `busy` | Customer's line was busy | Schedule retry |
| `failed` | Call could not be placed | Check number validity |
| `canceled` | Call was canceled before connection | Review campaign settings |

### Capturing IVR Responses

When the automated call includes an IVR, capture the customer's DTMF input via the Passthru applet or status callback:

```bash
# Status callback with IVR response
POST https://your-app.com/call-status
CallSid=<call_sid>&Status=completed&Digits=1&From=<customer_number>
```

Store the response in your database for follow-up actions:

```python
def handle_reminder_response(request):
    digits = request.POST.get('Digits', '')
    customer = request.POST['From']

    if digits == '1':
        db.confirm_appointment(customer)
    elif digits == '2':
        db.flag_for_reschedule(customer)
    elif digits == '3':
        db.cancel_appointment(customer)
```

## Scheduling Automated Calls

| Scheduling Method | How It Works |
|---|---|
| **Immediate** | Call is placed as soon as the API request is made |
| **Scheduled (campaign)** | Campaign starts at a specified date/time |
| **Event-triggered** | Call is triggered by an application event (cron job, webhook, etc.) |
| **Recurring** | Set up a recurring schedule (daily, weekly) for regular reminders |

### Timing Best Practices

| Time Window | Call Type | Notes |
|---|---|---|
| 9:00 AM - 10:00 AM | Appointment reminders | Start of day, high attention |
| 10:00 AM - 12:00 PM | Surveys, general notifications | Peak answer rates |
| 2:00 PM - 4:00 PM | Payment reminders | Afternoon follow-ups |
| 4:00 PM - 6:00 PM | Delivery confirmations | Before end of business |
| 6:00 PM - 9:00 PM | Marketing, promotions | Evening availability (respect limits) |

:::warning
Comply with TRAI regulations by restricting automated calls to 9 AM - 9 PM IST. Calls outside this window may result in penalties. Always filter out DND-registered numbers unless you have explicit prior consent.
:::

## Compliance for Automated Calls

| Requirement | Details |
|---|---|
| **TRAI calling hours** | 9:00 AM - 9:00 PM IST only |
| **DND compliance** | Must not call DND-registered numbers without consent |
| **Consent** | Obtain prior consent for promotional automated calls |
| **Opt-out** | Provide an option to opt out (e.g., "Press 9 to stop receiving these calls") |
| **Caller ID** | Must display a valid registered ExoPhone |
| **Frequency limits** | Avoid calling the same number more than 2-3 times per day |

### Adding an Opt-Out Option

Include an opt-out key in your IVR:

```
IVR ("Press 1 to confirm, Press 2 to reschedule, or Press 9 to stop receiving these calls.")
    → 9: Greeting ("You have been removed from our call list.") → Hangup
         → Webhook: remove customer from future campaigns
```

## Monitoring and Analytics

Track automated call performance:

| Metric | Description | Target |
|---|---|---|
| **Delivery rate** | Calls where the customer answered | Above 50% |
| **Completion rate** | Calls where the full message was heard | Above 40% |
| **IVR response rate** | Calls where the customer pressed a key | Above 30% |
| **Action rate** | Calls that resulted in the desired action | Depends on use case |
| **Opt-out rate** | Customers who opted out | Below 2% |

See: [Call Analytics](/docs/call-support/call-features/call-analytics)

## Best Practices

- **Keep messages under 30 seconds** -- Automated calls with long messages have high hang-up rates.
- **Get to the point immediately** -- State the purpose within the first 5 seconds.
- **Always provide IVR options** -- Let customers interact rather than just listen.
- **Offer opt-out** -- Include a way to stop receiving automated calls.
- **Personalize when possible** -- Include the customer's name or relevant details.
- **Test before mass deployment** -- Call yourself first to verify the message, audio quality, and IVR flow.
- **Monitor and iterate** -- Review delivery and response rates after each campaign and optimize.
- **Combine with SMS** -- For critical notifications, send an SMS as a backup in case the call is not answered.

## Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| Customer hears nothing | Flow has no Greeting applet | Add a Greeting as the first step |
| Call drops after greeting | No IVR or Hangup applet after greeting | Add the next applet in the flow |
| IVR responses not captured | Passthru or callback not configured | Set up a Passthru or status callback URL |
| Low answer rate | Unknown caller ID | Enable [Truecaller Verification](/docs/call-support/advanced-features/truecaller-verified-caller-id) |
| Calls placed outside allowed hours | Schedule not configured | Set daily start/end times in campaign |
| Too many concurrent calls | Concurrency too high | Reduce concurrency setting |

## Related

- [Outgoing Calls](/docs/call-support/call-features/outgoing-calls)
- [Outbound Dialer](/docs/call-support/advanced-features/outbound-dialer)
- [Auto Retry](/docs/call-support/advanced-features/auto-retry)
- [IVR Setup](/docs/call-support/call-features/ivr-setup)
- [Greeting Message](/docs/call-support/call-features/greeting-message)
- [Campaigns API](/docs/campaigns/overview)
- [Voice v1 API -- Connect to Flow](/docs/voice-v1/api-reference/connect-to-flow)
