---
id: call-queue
title: Call Queue
description: "Configure call queues in Exotel with hold music, queue position announcements, max wait time, and overflow routing."
sidebar_label: Call Queue
sidebar_position: 8
---

# Call Queue

A call queue holds incoming callers in line when all agents are busy. Instead of hearing a busy tone or being disconnected, callers wait in a queue with hold music or periodic announcements until the next agent becomes available. This is essential for businesses that handle high call volumes.

## How Call Queue Works

```
Caller dials ExoPhone → IVR → Connect (all agents busy)
        |
        v
Caller enters queue
        |
        v
Hold music plays + periodic announcements
        |
        v
Agent becomes available → Caller connected
```

When a caller enters the queue:

1. They hear hold music or a custom message.
2. Optionally, they hear their position in the queue ("You are caller number 3").
3. When an agent finishes their current call, the next caller in the queue is connected.
4. If the caller waits beyond the maximum wait time, they are routed to an overflow destination (voicemail, callback, alternate team).

## Setting Up a Call Queue

### Step 1: Enable Queuing in the Connect Applet

1. Open your call flow in **App Bazaar**.
2. Click on the **Connect** applet.
3. In the applet settings, enable **Queue**.
4. Configure the queue settings (see table below).
5. Save and publish.

### Step 2: Configure Queue Settings

| Setting | Description | Recommended Value |
|---|---|---|
| **Queue enabled** | Turn queuing on/off | Enabled |
| **Hold music** | Audio played while caller waits | Upload a custom `.wav` file or use default |
| **Queue position announcement** | Tell callers their position | Enabled |
| **Estimated wait time** | Tell callers the estimated wait | Enabled (if available) |
| **Max queue size** | Maximum number of callers in the queue | 10-50 depending on team size |
| **Max wait time** | Maximum seconds a caller waits before overflow | 120-300 seconds |
| **Overflow destination** | Where to route callers who exceed max wait | Voicemail, callback, or alternate team |

### Step 3: Configure Hold Music

Upload custom hold music or use Exotel's default:

1. In the queue settings, click **Hold Music**.
2. Choose one of:
   - **Default**: Exotel's standard hold music
   - **Upload**: Upload a custom `.wav` file (8000 Hz, Mono)
   - **Text-to-Speech**: Enter a message to be spoken periodically

:::tip
Keep hold music professional and not too loud. Avoid music with lyrics, as it can be distracting. Instrumental music or light jazz works well. Periodically interrupt with a message like "Thank you for your patience. An agent will be with you shortly."
:::

### Step 4: Configure Overflow Routing

Define what happens when a caller exceeds the maximum wait time or the queue is full:

```
Queue overflow → Voicemail
             → Callback request
             → Alternate agent group
             → Greeting ("Please call back later") → Hangup
```

1. From the **Queue Overflow** output of the Connect applet, draw a connection to:
   - A **Voicemail** applet
   - Another **Connect** applet (overflow team)
   - A **Greeting** + **Hangup** combination
2. Configure the overflow applet appropriately.

## Queue Position Announcements

Callers can be informed of their position in the queue periodically:

| Announcement Type | Example |
|---|---|
| **Position** | "You are caller number 3 in the queue." |
| **Wait time estimate** | "Your estimated wait time is 2 minutes." |
| **Combined** | "You are number 3 in line. Estimated wait: 2 minutes." |
| **Periodic reassurance** | "All agents are currently busy. Please hold." |

### Configuring Announcements

1. In the queue settings, enable **Queue Position Announcement**.
2. Set the **Announcement Interval** (e.g., every 30 seconds).
3. Choose the announcement type (position, wait time, or combined).
4. Optionally upload a custom announcement audio.

## Queue Distribution Strategies

When an agent becomes available, the next caller from the queue is connected. The order depends on the distribution strategy:

| Strategy | Behavior |
|---|---|
| **First In, First Out (FIFO)** | The caller who has waited the longest is connected first (default) |
| **Priority-based** | VIP or high-priority callers are served first |
| **Skills-based** | Callers are matched to agents based on skills (requires Smart Routing) |

FIFO is the default and most common strategy. For priority-based or skills-based queuing, see [Smart Routing](/docs/call-support/advanced-features/smart-routing).

## Queue Callback (Virtual Queue)

Instead of holding callers on the line, offer them the option to receive a callback when an agent is available:

### How Queue Callback Works

```
Caller enters queue → "Press 1 to hold, Press 2 for a callback"
        |
        1 → Stays in queue with hold music
        |
        2 → "We will call you back shortly" → Hangup
            → Caller's position preserved in queue
            → Agent available → Exotel calls the customer back
```

### Setting Up Queue Callback

1. Before the queue, add an **IVR Menu** applet offering the callback option.
2. For the callback key, add a **Greeting** ("We will call you back") and **Hangup**.
3. Configure a webhook to capture the caller's number and queue position.
4. When an agent is free, trigger a callback via the [Connect Two Numbers API](/docs/voice-v1/api-reference/connect-two-numbers).

:::tip
Queue callback significantly improves customer experience. Studies show that 63% of callers prefer a callback over waiting on hold. Implement this feature for queues with average wait times exceeding 2 minutes.
:::

## Queue Metrics

Monitor queue performance with these key metrics:

| Metric | Description | Target |
|---|---|---|
| **Average wait time** | Mean time callers spend in queue | Under 60 seconds |
| **Max wait time** | Longest wait experienced | Under 5 minutes |
| **Queue abandonment rate** | Percentage of callers who hang up while waiting | Under 5% |
| **Queue overflow rate** | Percentage of callers routed to overflow | Under 10% |
| **Service level** | Percentage of calls answered within target time | 80% within 20 seconds |
| **Queue size (peak)** | Maximum simultaneous callers in queue | Monitor for capacity planning |

Access these metrics in [Call Analytics](/docs/call-support/call-features/call-analytics).

## Queue Sizing Guidelines

| Team Size | Recommended Max Queue | Max Wait Time |
|---|---|---|
| 1-5 agents | 5-10 callers | 120 seconds |
| 5-15 agents | 10-25 callers | 180 seconds |
| 15-50 agents | 25-50 callers | 240 seconds |
| 50+ agents | 50-100 callers | 300 seconds |

:::warning
Setting the max queue size or wait time too high can lead to frustrated callers and high abandonment rates. Monitor your queue metrics regularly and adjust based on actual performance.
:::

## Best Practices

- **Set realistic max wait times** -- If your average handle time is 3 minutes and you have 5 agents, set max wait to 3-5 minutes, not 15 minutes.
- **Offer callbacks for long waits** -- If wait times regularly exceed 2 minutes, implement queue callback.
- **Use periodic announcements** -- Callers who hear their position and estimated wait are more likely to stay on the line.
- **Monitor abandonment** -- If abandonment rate exceeds 5%, reduce wait times or add agents.
- **Route overflows intelligently** -- Send overflow callers to voicemail with a callback promise, not just a hangup.
- **Update hold music regularly** -- Callers who call frequently will notice stale hold music. Rotate it periodically.
- **Staff based on queue data** -- Use historical queue metrics to forecast demand and schedule agents accordingly.

## Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| Callers hear busy tone instead of queue | Queue not enabled | Enable queue in Connect applet settings |
| Hold music not playing | Audio file format incorrect | Use 8000 Hz Mono `.wav` format |
| Callers not hearing position | Announcement not enabled | Enable queue position announcement |
| Queue overflows too quickly | Max wait time too short | Increase max wait time |
| Agents not receiving queued calls | Agent numbers incorrect | Verify numbers in Connect applet |
| All callers go to overflow | No agents available | Check agent availability and scheduling |

## Related

- [Parallel Ringing](/docs/call-support/call-features/parallel-ringing)
- [Call Forwarding](/docs/call-support/call-features/call-forwarding)
- [Business Hours](/docs/call-support/call-features/business-hours)
- [Voicemail](/docs/call-support/call-features/voicemail)
- [Call Analytics](/docs/call-support/call-features/call-analytics)
- [Smart Routing](/docs/call-support/advanced-features/smart-routing)
