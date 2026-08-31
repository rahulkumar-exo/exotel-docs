---
id: sticky-agent
title: Sticky Agent
description: "Route returning callers to the same agent they previously spoke with using Exotel's sticky agent feature for continuity."
sidebar_label: Sticky Agent
sidebar_position: 6
---

# Sticky Agent

Sticky Agent is a call routing feature that ensures a returning caller is connected to the same agent they previously interacted with. This provides continuity in customer conversations, reduces context-switching, and improves customer satisfaction.

## How Sticky Agent Works

When Sticky Agent is enabled, Exotel maintains a mapping between a caller's phone number and the last agent who handled their call. On subsequent calls from the same number, Exotel attempts to route the call directly to that agent.

```
First Call:
Customer A calls → IVR → Connect → Agent 3 answers
    Exotel saves: Customer A ↔ Agent 3

Second Call (within sticky period):
Customer A calls → IVR → Connect → Agent 3 rings first
    If Agent 3 answers → Connected (continuity maintained)
    If Agent 3 busy/no answer → Falls back to other agents
```

## When to Use Sticky Agent

| Scenario | Why Sticky Agent Helps |
|---|---|
| **Ongoing support tickets** | Customer resumes conversation without repeating the issue |
| **Sales follow-ups** | Prospect speaks to the same sales rep who understands their needs |
| **Account management** | Dedicated agent relationship for high-value customers |
| **Complex issue resolution** | Multi-call issues stay with the agent who has context |
| **Healthcare or legal** | Continuity is critical for sensitive conversations |

## Setting Up Sticky Agent

### Via the Dashboard

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Open your call flow in **App Bazaar**.
3. Click on the **Connect** applet that routes calls to your agents.
4. In the applet settings, enable **Sticky Agent**.
5. Configure the sticky duration (how long the caller-agent mapping persists).
6. Save and publish the flow.

### Configuration Options

| Setting | Description | Recommended Value |
|---|---|---|
| **Sticky Agent** | Enable/disable the feature | Enabled |
| **Sticky Duration** | How long the mapping persists (in days) | 7-30 days |
| **Fallback behavior** | What happens if the sticky agent is unavailable | Route to other agents in the group |
| **Priority** | Whether sticky agent gets priority or exclusive access | Priority (with fallback) |

### Via the API

When using the [Connect Two Numbers API](/docs/voice-v1/api-reference/connect-two-numbers) or [Connect to Flow API](/docs/voice-v1/api-reference/connect-to-flow), you can implement sticky agent logic on your server:

1. Before making the API call, look up the caller's number in your database to find their assigned agent.
2. Set the `From` parameter to the assigned agent's number.
3. If the agent is unavailable, fall back to a general queue or round-robin.

```bash
# Route to sticky agent
curl -u '<api_key>:<api_token>' -X POST 'https://api.exotel.com/v1/Accounts/<account_sid>/Calls/connect.json' \
  -d 'From=<sticky_agent_number>' \
  -d 'To=<customer_number>' \
  -d 'CallerId=<exophone>'
```

### Using Passthru for Dynamic Sticky Routing

For more control, use the **Passthru** applet to implement sticky agent logic on your server:

1. Add a **Passthru** applet before the **Connect** applet in your flow.
2. The Passthru calls your server with the caller's number.
3. Your server looks up the assigned agent and returns the routing instruction.
4. The flow routes accordingly.

```
Incoming Call → Passthru (lookup sticky agent)
                    |
                    Agent found → Connect (specific agent)
                    |
                    No agent → Connect (general agent group)
```

## Sticky Agent Behavior

### When the Sticky Agent is Available

The call is routed directly to the mapped agent. The agent's phone rings, and if they answer, the call is connected.

### When the Sticky Agent is Unavailable

If the sticky agent does not answer, is busy, or is offline, the system falls back based on your configuration:

| Fallback Strategy | Behavior |
|---|---|
| **Round-robin to group** | Call is distributed to the next available agent in the group |
| **Sequential ringing** | Call rings the remaining agents one by one |
| **Parallel ringing** | Call rings all remaining agents simultaneously |
| **Voicemail** | Caller is sent to voicemail for the sticky agent |
| **Callback** | System captures the caller's number for a callback from the sticky agent |

:::tip
Use the "round-robin to group" fallback for high-volume support teams. This ensures callers are not left waiting when their sticky agent is busy.
:::

### Sticky Duration Expiry

When the sticky duration expires, the mapping is cleared and the caller is routed through standard logic (round-robin, IVR, etc.) on their next call. A new mapping is created when they connect with an agent.

## Sticky Agent with Multiple Teams

If you have multiple teams (e.g., Sales, Support, Billing), sticky agent works within each team independently:

- A caller who spoke to Agent A in Sales will be routed to Agent A when they call Sales again.
- If the same caller calls the Support line, they are routed through the Support team's normal routing (no cross-team stickiness).

To implement cross-team stickiness, use the Passthru applet with a centralized CRM lookup.

## Monitoring Sticky Agent Performance

Track how often sticky routing succeeds:

| Metric | What It Measures |
|---|---|
| **Sticky hit rate** | Percentage of calls successfully routed to the sticky agent |
| **Sticky miss rate** | Percentage of calls where the sticky agent was unavailable |
| **Repeat caller rate** | Percentage of callers who call back within the sticky period |
| **First-call resolution** | Whether sticky routing reduces repeat calls |

Use [Call Analytics](/docs/call-support/call-features/call-analytics) to monitor these metrics.

## Best Practices

- **Set an appropriate sticky duration** -- For sales, 30 days works well. For support, 7 days may be sufficient unless issues are long-running.
- **Always configure fallback** -- Never leave a caller waiting indefinitely for a specific agent. Always provide a fallback route.
- **Combine with agent status** -- If your agents log in and out, combine sticky agent with agent availability checks so calls are not routed to offline agents.
- **Review mappings periodically** -- If an agent leaves the team, their sticky mappings should be cleared or reassigned.
- **Use with parallel ringing** -- Set the sticky agent as the first to ring, but ring the rest of the group simultaneously after a short delay (e.g., 5 seconds).

:::warning
Sticky agent can overload popular agents if many callers are mapped to the same person. Monitor agent workload and consider rebalancing if one agent consistently receives more calls than others.
:::

## Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| Caller not routed to sticky agent | Sticky duration expired | Increase the sticky duration |
| Same agent always gets calls | Many callers mapped to one agent | Review and rebalance sticky mappings |
| Sticky agent rings but no answer | Agent is AFK or busy | Configure fallback to route to other agents after timeout |
| New caller routed to specific agent | Sticky mapping exists from a previous interaction | Clear mapping if the agent reassignment is needed |
| Sticky not working after flow change | Flow republished without sticky enabled | Re-enable sticky agent in the Connect applet |

## Related

- [Parallel Ringing](/docs/call-support/call-features/parallel-ringing)
- [Call Queue](/docs/call-support/call-features/call-queue)
- [Smart Routing](/docs/call-support/advanced-features/smart-routing)
- [Call Analytics](/docs/call-support/call-features/call-analytics)
- [Setting Up a Call Flow](/docs/call-support/call-features/setting-up-call-flow)
