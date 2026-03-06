---
id: parallel-ringing
title: Parallel Ringing
description: "Configure parallel ringing in Exotel to ring multiple agents simultaneously so the first available agent answers."
sidebar_label: Parallel Ringing
sidebar_position: 9
---

# Parallel Ringing

Parallel ringing (also called simultaneous ringing) rings multiple agents at the same time when a call comes in. The first agent to pick up gets connected to the caller. All other agents' phones stop ringing. This minimizes wait time for callers and maximizes the chances of the call being answered.

## How Parallel Ringing Works

```
Caller dials ExoPhone
        |
        v
Call flow triggers Connect applet
        |
        v
All agent phones ring simultaneously:
    Agent 1: Ring... Ring...
    Agent 2: Ring... Ring...
    Agent 3: Ring... Ring...
        |
        v
Agent 2 answers first
        |
        v
Agent 1 and Agent 3 stop ringing
Caller connected to Agent 2
```

## Parallel vs. Sequential Ringing

| Feature | Parallel Ringing | Sequential Ringing |
|---|---|---|
| **How it works** | All agents ring at once | Agents ring one by one in order |
| **Speed to answer** | Fastest -- first available answers | Slower -- each agent gets a timeout before next |
| **Best for** | Teams where any agent can handle the call | Teams with tiered escalation |
| **Caller experience** | Minimal wait | Potentially longer wait |
| **Agent workload distribution** | May be uneven (fastest responders get more calls) | More predictable distribution |
| **Configuration complexity** | Simple | More complex (requires ordering and timeouts) |

## Setting Up Parallel Ringing

### Step 1: Configure the Connect Applet

1. Open your call flow in **App Bazaar**.
2. Click on the **Connect** applet.
3. Set the **Ring Strategy** to **Parallel** (or **Simultaneous**).
4. Enter the phone numbers of all agents who should ring:

| Agent | Phone Number |
|---|---|
| Agent 1 | +91-98XXXXXXX1 |
| Agent 2 | +91-98XXXXXXX2 |
| Agent 3 | +91-98XXXXXXX3 |
| Agent 4 | +91-98XXXXXXX4 |

5. Set the **Ring Timeout** (how long all phones ring before moving to the next action).
6. Save and publish.

### Step 2: Set the Ring Timeout

The ring timeout defines how long all agents' phones ring before the call moves to the next step in the flow (e.g., voicemail, another group).

| Timeout | Use Case |
|---|---|
| 15 seconds | Quick answer required, high-urgency calls |
| 20 seconds | Standard timeout for most teams |
| 30 seconds | Relaxed timeout for smaller teams |
| 45 seconds | Maximum -- use only for low-volume lines |

### Step 3: Configure Fallback

If no agent answers within the timeout, route the call to a fallback:

```
Connect (Parallel Ringing, 20s timeout)
    |
    ├── Answered → Call connected
    |
    ├── No Answer → Voicemail
    |                 └── Email notification
    |
    └── All Busy → Call Queue
                     └── Overflow → Voicemail
```

1. From the **No Answer** output of the Connect applet, draw a connection to a Voicemail, another Connect, or a Greeting applet.
2. From the **Busy** output, route to a Call Queue or alternate team.

## Advanced Parallel Ringing Configurations

### Parallel Ringing with Delay (Staggered)

Ring the primary agent first, and if they do not answer within a few seconds, add additional agents to the ring group:

```
0 seconds: Agent 1 rings
5 seconds: Agent 1 + Agent 2 ring
10 seconds: Agent 1 + Agent 2 + Agent 3 ring
20 seconds: Timeout → Voicemail
```

This is useful for giving priority agents a head start while ensuring backup agents are available.

To implement staggered ringing, use multiple Connect applets with short timeouts chained together, or use the [Voice v2 API](/docs/voice-api/getting-started/overview) for more granular control.

### Parallel Ringing with Sticky Agent

Combine parallel ringing with [Sticky Agent](/docs/call-support/call-features/sticky-agent):

1. The sticky agent's phone rings first (for 5-10 seconds).
2. If the sticky agent does not answer, all agents ring in parallel.
3. The first to answer gets connected.

```
Passthru (lookup sticky agent)
    |
    Agent found → Connect (Sticky Agent, 10s timeout)
    |                 |
    |                 ├── Answered → Connected
    |                 └── No Answer → Connect (All Agents, Parallel, 20s)
    |
    No agent → Connect (All Agents, Parallel, 20s)
```

### Parallel Ringing Across Teams

Ring agents from multiple teams simultaneously for overflow scenarios:

```
Connect (Support Team, Parallel, 20s)
    |
    └── No Answer → Connect (Backup Team, Parallel, 15s)
                        |
                        └── No Answer → Voicemail
```

## Dynamic Agent Lists

Instead of hardcoding agent numbers in the Connect applet, use a dynamic URL to fetch the list of available agents at runtime:

1. In the Connect applet, select **Dynamic Numbers (URL)**.
2. Enter a URL that returns a list of phone numbers.
3. Exotel calls the URL and rings the returned numbers in parallel.

```bash
# Exotel calls your server:
GET https://your-app.com/available-agents?team=support

# Your server responds:
+919876543210,+919876543211,+919876543212
```

This is useful for teams with shifting schedules, remote workers, or agents who log in and out dynamically.

## Ring Strategy Comparison

| Strategy | Configuration | Best For |
|---|---|---|
| **Parallel (all at once)** | All agents ring simultaneously | Small teams, urgent calls |
| **Sequential (round-robin)** | Agents ring one by one | Even workload distribution |
| **Staggered** | Primary first, then add more | Priority agents with backup |
| **Random** | Randomly select agents to ring | Large teams, even distribution |
| **Skill-based** | Ring agents with matching skills | Specialized support teams |

## Best Practices

- **Limit parallel ring group size** -- Ringing more than 5-7 agents simultaneously can cause network delays. For larger teams, use a combination of parallel and sequential.
- **Set appropriate timeouts** -- 20 seconds is standard. Shorter timeouts lead to faster fallback but may not give agents enough time to answer.
- **Combine with call queue** -- For high-volume lines, use parallel ringing with a queue fallback so callers wait instead of being sent to voicemail.
- **Monitor answer patterns** -- If the same agent always answers first, consider sequential or round-robin distribution for more balanced workload.
- **Use dynamic agent lists** -- For teams where agent availability changes frequently, dynamic lists ensure only available agents are rung.

:::warning
Parallel ringing can lead to uneven call distribution. Agents who are fastest to pick up will handle more calls. If balanced workload is important, consider round-robin or skills-based routing instead. See [Smart Routing](/docs/call-support/advanced-features/smart-routing).
:::

## Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| Only one agent rings | Ring strategy set to Sequential | Change to Parallel in Connect applet |
| Agent phone does not ring | Incorrect phone number | Verify agent number in Connect settings |
| All agents ring but none answer | Ring timeout too short | Increase ring timeout |
| Caller hears ringing for too long | Ring timeout too long | Decrease timeout and add fallback |
| Same agent always answers | Fastest responder bias | Consider round-robin for balance |

## Related

- [Call Forwarding](/docs/call-support/call-features/call-forwarding)
- [Call Queue](/docs/call-support/call-features/call-queue)
- [Sticky Agent](/docs/call-support/call-features/sticky-agent)
- [Smart Routing](/docs/call-support/advanced-features/smart-routing)
- [Setting Up a Call Flow](/docs/call-support/call-features/setting-up-call-flow)
