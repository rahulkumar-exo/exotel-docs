---
id: missed-call
title: Missed Call Solution
description: "Set up missed call solutions in Exotel for webhook notifications, lead capture, opt-ins, and API-driven callbacks."
sidebar_label: Missed Call Solution
sidebar_position: 7
---

# Missed Call Solution

A missed call solution allows customers to give a missed call (a call that is disconnected before being answered) to your ExoPhone. Exotel detects the missed call and triggers an automated action such as a webhook notification, SMS, lead capture, or opt-in registration. This is widely used in India and other markets where customers prefer not to spend on call charges.

## How It Works

```
Customer gives missed call to ExoPhone
        |
        v
Exotel executes the assigned call flow (auto-hangup after 1-2 rings)
        |
        v
Trigger action:
    - Fire webhook to your application (Passthru)
    - Initiate callback via API
    - Register the number as a lead
```

## Common Use Cases

| Use Case | How It Works |
|---|---|
| **Lead capture** | Customer gives missed call; their number is captured as a lead in your CRM |
| **Automated callback** | Customer gives missed call; your backend receives the webhook and calls them back via the Exotel API |
| **Opt-in / subscription** | Customer gives missed call to subscribe to a service or alerts |
| **Voting or polling** | Each missed call counts as a vote; results tracked in real time |
| **Phone number verification** | Customer gives missed call to verify their phone number (ExoVerify) |
| **Information delivery** | Customer gives missed call; your system sends an SMS with requested info |

## Setting Up a Missed Call Solution

To detect missed calls, assign a call flow to your ExoPhone that includes a brief greeting (or silence) followed by hangup. Exotel executes the flow on every inbound call, including ones that disconnect quickly.

### Method 1: Webhook Notification (Passthru)

Trigger a webhook to your application when a missed call is detected. Your application can then perform any custom action — save a lead, send an SMS, initiate a callback, or anything else.

#### Step 1: Build the Call Flow

1. Go to **App Bazaar** in the dashboard.
2. Create a call flow with a **Passthru** applet as the first step.
3. Configure the Passthru applet with your webhook URL.
4. Add a **Hangup** applet after it.
5. Assign this flow to your ExoPhone.

#### Step 2: Handle the Webhook

Exotel sends an HTTP POST to your webhook URL with the following parameters:

| Parameter | Description |
|---|---|
| `CallSid` | Unique identifier for the call |
| `CallFrom` | The caller's phone number |
| `CallTo` | Your ExoPhone number |
| `Direction` | `inbound` |
| `CallType` | Call type (e.g., `incomplete` for a missed call) |
| `StartTime` | Timestamp of the call |

```bash
# Example webhook payload
POST https://your-app.com/missed-call-webhook
Content-Type: application/x-www-form-urlencoded

CallSid=abc123&CallFrom=+919876543210&CallTo=+918047XXXXXX&Direction=inbound&CallType=incomplete
```

#### Step 3: Implement Your Logic

Your application can take any action after receiving the webhook:

```python
def handle_missed_call(request):
    caller_number = request.POST['CallFrom']

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

### Method 2: API Callback

Use the Exotel API directly from your backend to initiate a callback after detecting a missed call via the webhook above:

```bash
curl -u '<api_key>:<api_token>' -X POST \
  'https://api.exotel.com/v1/Accounts/<account_sid>/Calls/connect.json' \
  -d 'From=<customer_number>' \
  -d 'CallerId=<exophone>' \
  -d 'Url=http://my.exotel.com/exoml/start/<callback_flow_id>'
```

## Best Practices

- **Respond quickly** — Trigger your callback as soon as the webhook is received. Longer delays reduce the chance the customer will answer.
- **Use a dedicated ExoPhone** — Assign a specific ExoPhone for missed call campaigns so it does not interfere with your regular incoming call traffic.
- **Promote the number** — Display the missed call number in ads, social media, and print materials with clear instructions (e.g., "Give a missed call to 080-4712XXXX to register").
- **Track conversions** — Connect missed call data to your CRM to measure campaign ROI.
- **Handle after-hours missed calls** — Configure different behavior for missed calls received outside business hours using the [Business Hours](/docs/call-support/call-features/business-hours) applet in your flow.
- **Deduplicate on your side** — If a customer calls multiple times in quick succession, your backend should deduplicate by number and time window before triggering callbacks or lead creation.

## Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| Webhook not received | URL incorrect, server down, or Passthru applet not in flow | Verify webhook URL, server availability, and flow configuration |
| SMS not delivered | DLT template not registered | Register SMS template for DLT compliance before sending |
| Customer does not answer callback | Callback triggered too long after missed call | Trigger callback immediately on webhook receipt |

## Related

- [Outgoing Calls](/docs/call-support/call-features/outgoing-calls)
- [Business Hours](/docs/call-support/call-features/business-hours)
- [Call Analytics](/docs/call-support/call-features/call-analytics)
- [Voice v1 API](/docs/voice-v1/overview)
- [SMS API](/docs/sms-api/overview)
