---
id: missed-call
title: Missed Call Solution
description: "Set up missed call solutions in Exotel for automated callbacks, lead capture, opt-ins, and verification workflows."
sidebar_label: Missed Call Solution
sidebar_position: 7
---

# Missed Call Solution

A missed call solution allows customers to give a missed call (a call that is disconnected before being answered) to your ExoPhone. Exotel detects the missed call and triggers an automated action such as a callback, SMS, lead capture, or opt-in registration. This is widely used in India and other markets where customers prefer not to spend on call charges.

## How It Works

```
Customer gives missed call to ExoPhone
        |
        v
Exotel detects missed call (auto-hangup after 1-2 rings)
        |
        v
Trigger action:
    - Automatic callback to customer
    - Send SMS with information
    - Register the number as a lead
    - Trigger webhook to your application
```

## Common Use Cases

| Use Case | How It Works |
|---|---|
| **Lead capture** | Customer gives missed call; their number is captured as a lead in your CRM |
| **Automated callback** | Customer gives missed call; Exotel calls them back and connects to an agent or IVR |
| **Opt-in / subscription** | Customer gives missed call to subscribe to a service or alerts |
| **Voting or polling** | Each missed call counts as a vote; results tracked in real time |
| **Phone number verification** | Customer gives missed call to verify their phone number (ExoVerify) |
| **Information delivery** | Customer gives missed call; system sends an SMS with requested info |

## Setting Up a Missed Call Solution

### Method 1: Callback via Call Flow

This setup automatically calls the customer back after they give a missed call.

#### Step 1: Create a Callback Flow

1. Go to **App Bazaar** in the dashboard.
2. Create a new call flow named "Missed Call Callback".
3. Add applets:
   - **Greeting**: "Thank you for your interest. Please hold while we connect you."
   - **Connect**: Enter the agent numbers who should handle the callback.

#### Step 2: Configure the ExoPhone

1. Go to **ExoPhones** in the dashboard.
2. Select the ExoPhone designated for missed calls.
3. Under **Missed Call Settings**, enable **Auto Callback**.
4. Select the callback flow you created.
5. Set the callback delay (e.g., 30 seconds after the missed call).
6. Save.

```
Customer gives missed call to ExoPhone
        |
        v (30 seconds later)
Exotel calls customer back
        |
        v
Customer answers → Greeting plays → Connected to agent
```

#### Step 3: Test

1. Call your ExoPhone from a test number and hang up after 1-2 rings.
2. Wait for the callback delay period.
3. Your test number should receive a callback.

### Method 2: SMS Response

Send an automated SMS to anyone who gives a missed call.

#### Step 1: Create the SMS Response

1. Go to **ExoPhones** in the dashboard.
2. Select the ExoPhone for missed calls.
3. Under **Missed Call Settings**, enable **Send SMS on Missed Call**.
4. Enter the SMS content (e.g., "Thank you for your interest! Visit https://example.com for more info.").
5. Save.

:::warning
SMS messages in India must comply with DLT regulations. Ensure you have registered DLT templates and entity IDs before configuring SMS responses. See the [SMS API documentation](/docs/sms-api/overview) for DLT compliance details.
:::

### Method 3: Webhook Notification

Trigger a webhook to your application when a missed call is detected. Your application can then perform custom actions.

#### Step 1: Configure the Webhook

1. Go to **ExoPhones** in the dashboard.
2. Select the ExoPhone.
3. Under **Missed Call Settings**, configure the **Webhook URL**.
4. Save.

#### Step 2: Handle the Webhook

Exotel sends an HTTP POST to your webhook URL with the following parameters:

| Parameter | Description |
|---|---|
| `CallSid` | Unique identifier for the call |
| `From` | The caller's phone number |
| `To` | Your ExoPhone number |
| `Status` | `missed-call` |
| `DateCreated` | Timestamp of the missed call |

```bash
# Example webhook payload
POST https://your-app.com/missed-call-webhook
Content-Type: application/x-www-form-urlencoded

CallSid=abc123&From=+919876543210&To=+918047XXXXXX&Status=missed-call
```

#### Step 3: Implement Your Logic

Your application can:

```python
# Example: Capture lead and trigger callback
def handle_missed_call(request):
    caller_number = request.POST['From']

    # Save as lead in CRM
    create_lead(phone=caller_number, source='missed_call')

    # Trigger callback via Exotel API
    exotel_api.connect_call(
        from_number=agent_number,
        to_number=caller_number,
        caller_id=exophone
    )

    return Response(status=200)
```

### Method 4: Via API (Connect to Flow)

Use the API to programmatically initiate a callback after detecting a missed call:

```bash
curl -u '<api_key>:<api_token>' -X POST 'https://api.exotel.com/v1/Accounts/<account_sid>/Calls/connect.json' \
  -d 'From=<customer_number>' \
  -d 'CallerId=<exophone>' \
  -d 'Url=http://my.exotel.com/exoml/start/<callback_flow_id>'
```

## Configuration Options

| Setting | Description | Recommended Value |
|---|---|---|
| **Auto callback** | Automatically call back the missed caller | Enabled for lead capture |
| **Callback delay** | Seconds to wait before calling back | 15-60 seconds |
| **Callback flow** | The call flow to use for callbacks | A flow with Greeting + Connect |
| **SMS on missed call** | Send SMS after missed call | Enabled if delivering information |
| **Webhook URL** | URL to notify your application | Your backend endpoint |
| **Deduplication window** | Ignore repeat missed calls within this period | 5-10 minutes |
| **Max callbacks per number** | Limit callbacks to prevent spam | 1-2 per hour |

## Deduplication

Customers sometimes give multiple missed calls in quick succession. To avoid triggering multiple callbacks or SMS:

- **Set a deduplication window**: Ignore duplicate missed calls from the same number within a defined period (e.g., 5 minutes).
- **Rate limit callbacks**: Limit the number of callbacks to a single number per hour.

:::tip
Always configure deduplication to prevent your system from calling a customer back multiple times for a single intent. A 5-minute window works well for most use cases.
:::

## Missed Call Analytics

Track the performance of your missed call campaigns:

| Metric | Description |
|---|---|
| **Total missed calls** | Number of missed calls received on the ExoPhone |
| **Unique callers** | Number of distinct phone numbers |
| **Callback success rate** | Percentage of callbacks where the customer answered |
| **Conversion rate** | Percentage of missed call leads that converted |
| **Peak hours** | Time periods with the highest missed call volume |

Access these metrics via [Call Analytics](/docs/call-support/call-features/call-analytics) in the dashboard.

## Best Practices

- **Respond quickly** -- Set callback delays to 15-30 seconds. Longer delays reduce the chance that the customer will answer.
- **Use a dedicated ExoPhone** -- Assign a specific ExoPhone for missed call campaigns so it does not interfere with your regular incoming call traffic.
- **Promote the number** -- Display the missed call number in ads, social media, and print materials with clear instructions (e.g., "Give a missed call to 080-4712XXXX to register").
- **Track conversions** -- Connect missed call data to your CRM to measure campaign ROI.
- **Handle after-hours missed calls** -- Configure different behavior for missed calls received outside business hours (e.g., SMS response instead of callback).

## Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| No callback triggered | Auto callback not enabled | Enable in ExoPhone missed call settings |
| Multiple callbacks for one missed call | Deduplication not configured | Set deduplication window to 5 minutes |
| SMS not delivered | DLT template not registered | Register SMS template for DLT compliance |
| Webhook not received | URL incorrect or server down | Verify webhook URL and server availability |
| Customer does not answer callback | Callback delay too long | Reduce callback delay to 15-30 seconds |

## Related

- [Outgoing Calls](/docs/call-support/call-features/outgoing-calls)
- [Business Hours](/docs/call-support/call-features/business-hours)
- [Call Analytics](/docs/call-support/call-features/call-analytics)
- [Voice v1 API](/docs/voice-v1/overview)
- [SMS API](/docs/sms-api/overview)
