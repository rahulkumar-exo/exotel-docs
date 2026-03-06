---
id: business-hours
title: Business Hours
description: "Configure business hours routing in Exotel with schedule-based call handling, holiday calendars, and time-zone support."
sidebar_label: Business Hours
sidebar_position: 10
---

# Business Hours

Business hours routing lets you define when your team is available and automatically handle calls differently based on the time of day, day of the week, and holidays. Calls during business hours are routed to live agents, while after-hours calls can go to voicemail, a recorded message, or an alternate team.

## How Business Hours Routing Works

```
Caller dials ExoPhone
        |
        v
Exotel checks current time against business hours schedule
        |
        ├── Within business hours → Route to live agents (primary flow)
        |
        └── Outside business hours → Route to after-hours handling
                                        (voicemail, greeting, alternate team)
```

## Setting Up Business Hours

### Step 1: Define Your Schedule

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Navigate to **Settings** > **Business Hours** (or configure within your call flow).
3. Set your weekly operating schedule:

| Day | Start Time | End Time | Status |
|---|---|---|---|
| Monday | 9:00 AM | 6:00 PM | Open |
| Tuesday | 9:00 AM | 6:00 PM | Open |
| Wednesday | 9:00 AM | 6:00 PM | Open |
| Thursday | 9:00 AM | 6:00 PM | Open |
| Friday | 9:00 AM | 6:00 PM | Open |
| Saturday | 10:00 AM | 2:00 PM | Open |
| Sunday | -- | -- | Closed |

4. Select your time zone (e.g., IST, SGT).

### Step 2: Create Business Hours and After-Hours Flows

Create two separate call flows:

**Business Hours Flow:**
```
Greeting ("Welcome to Acme Corp")
    → IVR Menu ("Press 1 for Sales, 2 for Support")
        → Connect (Agent group)
            → No Answer → Call Queue → Voicemail
```

**After-Hours Flow:**
```
Greeting ("Thank you for calling. Our office hours are Monday to Friday, 9 AM to 6 PM.")
    → Greeting ("Please leave a message after the beep.")
        → Voicemail
            → Email notification to team
```

### Step 3: Configure Time-Based Routing

There are multiple ways to route based on business hours:

#### Option A: ExoPhone-Level Configuration

1. Go to **ExoPhones** in the dashboard.
2. Select your ExoPhone.
3. Under **Business Hours Flow**, select your business hours call flow.
4. Under **After-Hours Flow**, select your after-hours call flow.
5. Under **Schedule**, select the business hours schedule you defined.
6. Save.

#### Option B: Using the Passthru Applet

For custom time-based logic:

1. Add a **Passthru** applet as the first step in your flow.
2. Configure it to call your server with the current call details.
3. Your server checks the time and returns routing instructions.

```bash
# Your server receives:
POST https://your-app.com/check-hours
CallSid=<call_sid>&From=<caller_number>

# Your server responds:
# If within business hours:
{"action": "continue"}  # Flow proceeds to next applet (Connect)

# If outside business hours:
{"action": "redirect", "flow_id": "<after_hours_flow_id>"}
```

## Holiday Calendar

Configure holidays so calls are routed to the after-hours flow even on regular business days.

### Adding Holidays

1. Go to **Settings** > **Business Hours** > **Holidays**.
2. Click **Add Holiday**.
3. Enter the holiday details:

| Field | Description | Example |
|---|---|---|
| **Name** | Holiday name | Republic Day |
| **Date** | The holiday date | January 26 |
| **Recurring** | Repeats every year | Yes |
| **Flow** | Which flow to use on this day | After-Hours Flow |

4. Save.

### Example Holiday Calendar

| Holiday | Date | Recurring | Flow |
|---|---|---|---|
| Republic Day | January 26 | Yes | After-Hours |
| Holi | March 14, 2025 | No (date varies) | After-Hours |
| Independence Day | August 15 | Yes | After-Hours |
| Diwali | November 1, 2025 | No (date varies) | After-Hours |
| Christmas | December 25 | Yes | After-Hours |
| Company Annual Day | June 15 | Yes | Reduced Hours Flow |

:::tip
For holidays with variable dates (e.g., Eid, Diwali), update your holiday calendar at the beginning of each year. Alternatively, use the Passthru applet to check against a holiday API on your server.
:::

## Time-Zone Support

If your business serves customers across multiple time zones:

### Single-Team, Multiple Regions

If your team operates in one time zone (e.g., IST) but serves customers across India:

- Set business hours based on your team's local time zone.
- All routing decisions use the configured time zone.

### Distributed Teams Across Time Zones

If you have teams in different time zones:

1. Create separate ExoPhones for each region.
2. Set different business hours for each ExoPhone based on the local team's schedule.
3. Use IVR or smart routing to direct callers to the appropriate regional team.

```
Caller dials main ExoPhone
    → IVR: "Press 1 for India support, Press 2 for SE Asia support"
        → 1: Check India business hours → Route to India team or after-hours
        → 2: Check SE Asia business hours → Route to SE Asia team or after-hours
```

### Follow-the-Sun Routing

Route calls to whichever team is currently within business hours:

```
Passthru (check which team is active)
    |
    IST 9 AM - 6 PM → Connect (India team)
    SGT 9 AM - 6 PM → Connect (Singapore team)
    No team active → Voicemail
```

Implement this using the Passthru applet with server-side time-zone logic.

## Multiple Schedules

You may need different schedules for different departments:

| Department | Hours | Saturday |
|---|---|---|
| Sales | 9 AM - 8 PM | 10 AM - 4 PM |
| Support | 8 AM - 10 PM | 9 AM - 6 PM |
| Billing | 10 AM - 5 PM | Closed |

Create a separate business hours schedule for each department and assign the appropriate schedule to each department's call flow.

## After-Hours Handling Options

| Option | Description | Best For |
|---|---|---|
| **Voicemail** | Caller leaves a message | Standard after-hours |
| **Recorded message** | Play a message with hours and alternate contact info | Information only |
| **SMS response** | Send SMS with business hours or self-service link | Mobile callers |
| **Callback registration** | Capture number for next-day callback | Lead capture |
| **Alternate team** | Route to an outsourced or night-shift team | 24/7 coverage |
| **Emergency routing** | Route critical calls to an on-call person | Healthcare, IT support |

:::warning
If you provide essential services (healthcare, emergency support), ensure your after-hours flow includes an option to reach an on-call agent for urgent matters. Do not rely solely on voicemail for time-sensitive scenarios.
:::

## Best Practices

- **Inform callers of your hours** -- Play a greeting that states your business hours so callers know when to call back.
- **Offer alternatives after hours** -- Provide a website URL, email address, or FAQ in your after-hours message.
- **Update holiday calendar proactively** -- Add holidays for the entire year at the start of the year.
- **Test time-based routing** -- Temporarily set your business hours to a narrow window and test that the after-hours flow works correctly.
- **Use voicemail with email notifications** -- Ensure after-hours voicemails are emailed to your team so they are addressed first thing in the morning.
- **Monitor after-hours call volume** -- If you receive a significant volume of after-hours calls, consider extending your business hours or adding a night-shift team.

## Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| After-hours flow not triggering | Business hours not configured | Set up business hours schedule |
| Wrong flow at the right time | Time zone incorrect | Verify time zone in settings |
| Holiday not recognized | Holiday not added to calendar | Add the date to the holiday list |
| Calls go to after-hours during business hours | Schedule start/end times wrong | Check AM/PM and 24-hour format |
| Weekend calls go to agents | Saturday/Sunday marked as Open | Update schedule for weekends |

## Related

- [Call Forwarding](/docs/call-support/call-features/call-forwarding)
- [Voicemail](/docs/call-support/call-features/voicemail)
- [Call Queue](/docs/call-support/call-features/call-queue)
- [Setting Up a Call Flow](/docs/call-support/call-features/setting-up-call-flow)
- [Smart Routing](/docs/call-support/advanced-features/smart-routing)
