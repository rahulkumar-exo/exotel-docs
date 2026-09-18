---
id: call-forwarding
title: Call Forwarding
description: "Set up call forwarding in Exotel with unconditional, busy, no-answer, and time-based rules for reliable call routing."
sidebar_label: Call Forwarding
sidebar_position: 5
---

# Call Forwarding

Call forwarding redirects incoming calls from one number or agent to another based on predefined rules. This ensures that customer calls are always answered, even when the primary agent is unavailable, busy, or outside business hours.

## Call Forwarding Types

Exotel supports several call forwarding strategies, each configurable through the call flow builder.

| Type | Triggers When | Example Use Case |
|---|---|---|
| **Unconditional** | All calls, always | Redirect all calls to a centralized team |
| **Busy forwarding** | Agent's line is busy | Forward to next available agent |
| **No-answer forwarding** | Agent does not answer within timeout | Forward to backup agent or voicemail |
| **Time-based forwarding** | Based on schedule or business hours | Forward to after-hours team at 6 PM |
| **Conditional forwarding** | Based on caller data or API logic | Forward VIP callers to a senior agent |

## Setting Up Unconditional Forwarding

Unconditional forwarding routes all incoming calls to a specified number regardless of agent availability.

### Via Call Flow

1. Open your call flow in **App Bazaar**.
2. Add a **Connect** applet.
3. In the Connect configuration, enter the forwarding destination number.
4. Remove or bypass any agent numbers that should no longer receive calls.
5. Save and publish.

```
Incoming Call → Greeting → Connect (Forwarding Number)
```

### Via API

Use the [Connect to Flow API](/docs/voice-v1/api-reference/connect-to-flow) to programmatically forward calls:

```bash
curl -u '<api_key>:<api_token>' -X POST 'https://api.exotel.com/v1/Accounts/<account_sid>/Calls/connect.json' \
  -d 'From=<caller_number>' \
  -d 'To=<forwarding_number>' \
  -d 'CallerId=<exophone>'
```

## Setting Up Busy Forwarding

When the primary agent's line is busy, the call is forwarded to a secondary agent or group.

### Step-by-Step

1. Open your call flow and click on the **Connect** applet.
2. Enter the primary agent number.
3. From the **Busy** output of the Connect applet, draw a connection to a second Connect applet.
4. In the second Connect applet, enter the secondary agent or group number.
5. Save and publish.

```
Incoming Call → Connect (Primary Agent)
                    |
                    Busy → Connect (Secondary Agent)
                    |
                    No Answer → Voicemail
```

## Setting Up No-Answer Forwarding

If the primary agent does not answer within a specified ring timeout, forward the call to another destination.

### Step-by-Step

1. In the **Connect** applet, set the **Ring Timeout** (e.g., 20 seconds).
2. From the **No Answer** output, connect to another applet:
   - Another **Connect** applet for a backup agent
   - A **Voicemail** applet
   - A **Transfer** applet to redirect to a different flow

| Ring Timeout | Recommendation |
|---|---|
| 15 seconds | Quick failover, useful for high-volume support lines |
| 20 seconds | Standard -- gives agent time to answer |
| 30 seconds | Longer wait, suitable for low-volume lines |
| 45 seconds | Maximum recommended -- longer waits frustrate callers |

:::tip
Set the ring timeout based on your typical agent answer time. Monitor your call analytics to find the average time agents take to pick up, and set the timeout slightly above that.
:::

## Setting Up Time-Based Forwarding

Route calls to different destinations based on the time of day, day of the week, or holiday calendar.

### Using Business Hours Routing

1. Create two call flows:
   - **Business hours flow**: Routes to your live agent team.
   - **After-hours flow**: Routes to voicemail, an after-hours message, or an outsourced team.
2. Use the [Business Hours](/docs/call-support/call-features/business-hours) feature to switch between flows automatically based on your schedule.

### Using the Passthru Applet

For custom time-based logic:

1. Add a **Passthru** applet at the beginning of your flow.
2. Configure it to call your server with the current call details.
3. Your server checks the current time and returns routing instructions.

```
Incoming Call → Passthru (Check Time)
                    |
                    9 AM - 6 PM → Connect (Live Agents)
                    |
                    After 6 PM → Greeting ("We are closed") → Voicemail
```

See: [Business Hours](/docs/call-support/call-features/business-hours)

## Setting Up Conditional Forwarding

Route calls based on caller attributes (e.g., VIP status, location, language preference) using the Passthru applet.

### Step-by-Step

1. Add a **Passthru** applet to your flow.
2. Configure the HTTP URL to point to your application server.
3. Your server receives the caller's number and returns routing instructions.
4. Based on the response, the flow routes to different Connect applets.

```bash
# Your server receives:
POST https://your-app.com/route-call
CallSid=<call_sid>&From=<caller_number>

# Your server responds with the destination:
# Route to VIP team
{"route": "vip_team"}
```

## Forwarding Chain Example

You can chain multiple forwarding rules for comprehensive coverage:

```
Incoming Call
    |
    v
Connect (Primary Agent, 20s timeout)
    |
    ├── Answered → Call connected
    |
    ├── Busy → Connect (Secondary Agent, 15s timeout)
    |               |
    |               ├── Answered → Call connected
    |               └── No Answer → Voicemail
    |
    └── No Answer → Connect (Team Lead, 15s timeout)
                        |
                        ├── Answered → Call connected
                        └── No Answer → Voicemail → Email notification
```

## Forwarding to External Numbers

Exotel can forward calls to any valid phone number, including:

- Other mobile or landline numbers
- Numbers in different cities or regions
- International numbers (if enabled on your account)

:::warning
Forwarding to international numbers incurs additional per-minute charges. Check your Exotel plan for international calling rates before enabling this feature.
:::

## Call Forwarding with Caller ID Preservation

When forwarding a call, the agent sees the ExoPhone as the caller ID (not the original caller's number). To pass the original caller's number:

1. Use the **Passthru** applet to capture the caller's number.
2. Send it to your CRM or application before the Connect applet.
3. Your agent's CRM screen pop shows the original caller's details.

Alternatively, use the [Voice v2 API](/docs/voice-api/getting-started/overview) which supports more granular caller ID control.

## Best Practices

- **Always set a fallback** -- Every forwarding chain should end with a voicemail or callback option so callers are never left hanging.
- **Monitor forwarding patterns** -- If calls are frequently forwarded, it may indicate understaffing or routing issues. Use [Call Analytics](/docs/call-support/call-features/call-analytics) to track.
- **Keep forwarding chains short** -- Limit to 2-3 forwarding hops. Longer chains increase the time before a caller reaches a person.
- **Test regularly** -- Call your ExoPhone and verify that forwarding works correctly for each scenario (busy, no answer, after hours).
- **Use parallel ringing for urgency** -- Instead of sequential forwarding (which adds delay), consider [Parallel Ringing](/docs/call-support/call-features/parallel-ringing) to ring multiple agents at once.

## Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| Call not forwarding on busy | Busy output not connected | Wire the Busy output of the Connect applet to the next destination |
| Forward happens too quickly | Ring timeout too short | Increase the ring timeout in the Connect applet |
| Forward happens too slowly | Ring timeout too long | Decrease the ring timeout |
| After-hours not working | Business hours not configured | Set up [Business Hours](/docs/call-support/call-features/business-hours) |
| Caller hears silence during forward | No greeting between hops | Add a short Greeting ("Please hold") between Connect applets |

## Related

- [Business Hours](/docs/call-support/call-features/business-hours)
- [Parallel Ringing](/docs/call-support/call-features/parallel-ringing)
- [Call Queue](/docs/call-support/call-features/call-queue)
- [Setting Up a Call Flow](/docs/call-support/call-features/setting-up-call-flow)
- [Smart Routing](/docs/call-support/advanced-features/smart-routing)
