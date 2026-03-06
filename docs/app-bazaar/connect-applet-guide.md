---
id: connect-applet-guide
title: Connect Applet Guide
description: "Use the Exotel Connect applet to route calls to agents, groups, external numbers, or SIP endpoints in your call flows."
sidebar_label: Connect Applet
sidebar_position: 5
---

# Connect Applet Guide

The Connect applet routes incoming calls to agents, agent groups, external phone numbers, or SIP endpoints. It is the core routing component in most call flows, supporting round-robin distribution, simultaneous ring, and fallback routing.

:::tip
For the API-level technical reference, see [Connect Applet](/docs/voice-v1/applets/connect).
:::

## How the Connect Applet Works

When a call reaches the Connect applet:

1. The applet identifies the target (agent, group, or number)
2. It initiates an outbound leg to the target
3. The caller hears ringing (or hold music if configured)
4. If the target answers, both parties are connected
5. If the target does not answer within the timeout, the flow moves to the fallback path

```
Caller ──► Connect Applet ──► Ring target number(s)
                              ──► (Answered) Parties connected
                              ──► (Not answered) Fallback path
```

## Configuration

### Basic Setup

1. Drag the **Connect** applet onto the [Flow Builder](/docs/app-bazaar/flow-builder-guide) canvas
2. Click the applet to open the Properties Panel
3. Configure the routing target and options

### Routing Targets

| Target Type | Description | Configuration |
|-------------|-------------|---------------|
| **Single Number** | Route to one specific phone number | Enter the phone number |
| **Agent** | Route to a specific Exotel user | Select the agent from the dropdown |
| **Agent Group** | Route to a group of agents using a distribution strategy | Select the group |
| **External Number** | Route to any phone number (mobile or landline) | Enter the full number with country code |
| **SIP Endpoint** | Route to a SIP URI | Enter the SIP address |

### Distribution Strategies (Agent Groups)

When routing to an agent group, choose how calls are distributed:

| Strategy | How It Works | Best For |
|----------|-------------|----------|
| **Round-Robin** | Each call goes to the next agent in rotation | Even distribution across agents |
| **Simultaneous Ring** | All agents in the group ring at the same time; first to answer gets the call | Fastest response time |
| **Sequential** | Agents ring one at a time in a defined order | Priority-based routing (most senior first) |
| **Longest Idle** | Call goes to the agent who has been idle the longest | Balanced workload distribution |
| **Least Calls** | Call goes to the agent who has handled the fewest calls in the period | Even call volume distribution |

:::info
Distribution strategies beyond Round-Robin and Simultaneous Ring are available on Growth and Enterprise plans. Contact your account manager for details.
:::

### Configuration Options

| Setting | Default | Description |
|---------|---------|-------------|
| **Ring Timeout** | 30 seconds | Time to ring the target before moving to fallback |
| **Caller ID** | ExoPhone number | The number displayed to the agent (ExoPhone or caller's number) |
| **Hold Music** | Default tone | Audio played to the caller while the agent's phone rings |
| **Max Ring Attempts** | 1 | Number of times to retry ringing (for Sequential strategy) |
| **Whisper Message** | None | Short audio played to the agent before connecting (e.g., "Incoming sales call") |
| **Record Call** | Inherit from app | Override the app-level recording setting |

## Caller ID Configuration

Control what the agent sees on their phone when a call comes in:

| Caller ID Option | What Agent Sees | Use Case |
|-----------------|-----------------|----------|
| **ExoPhone number** | Your virtual number | Agent knows the call is from the business line |
| **Caller's number** | The actual caller's phone number | Agent can identify the caller before answering |
| **Custom number** | A specific number you configure | Number masking or department-specific display |

:::warning
Displaying the caller's actual number requires the caller ID pass-through feature to be enabled on your account. This feature is available on Growth and Enterprise plans.
:::

## Fallback Routing

The Connect applet provides fallback options when the primary target is unavailable:

### Configuring Fallback Paths

| Fallback Trigger | Description | Recommended Next Step |
|-----------------|-------------|----------------------|
| **No answer** | Target did not pick up within the ring timeout | Route to another agent group or voicemail |
| **Busy** | Target's line is busy | Route to next available agent or callback queue |
| **Failed** | Call could not be connected (network error) | Route to a Greeting with apology + fallback number |
| **All agents busy** | All agents in the group are on calls | Route to a queue (hold) or voicemail |

### Example: Multi-Level Fallback

```
Connect (Primary Group) ──► (no answer) Connect (Backup Group)
                                         ──► (no answer) Greeting ("All agents busy")
                                                          ──► Voicemail ──► Hangup
```

## Advanced Features

### Whisper Messages

A whisper message is a short audio clip played to the agent just before they are connected to the caller:

1. Enable **Whisper Message** in the Connect applet settings
2. Upload an audio file or enter TTS text
3. The agent hears the whisper; the caller hears hold music or ringing
4. After the whisper, both parties are connected

**Example whisper messages:**
- "Incoming sales call from website lead"
- "Support call from premium customer"
- "Campaign call for product launch"

### Queue Behavior

When all agents in a group are busy and queue is enabled:

| Setting | Description |
|---------|-------------|
| **Queue enabled** | Yes / No |
| **Queue hold music** | Audio played while the caller waits |
| **Queue position announcement** | Announce the caller's position in the queue |
| **Max queue wait time** | Maximum time before routing to fallback |
| **Max queue size** | Maximum number of callers in the queue |

### Warm Transfer

Transfer a call to another agent with a brief hold for introduction:

1. First Connect applet connects caller to Agent A
2. Agent A initiates transfer (via dashboard or DTMF)
3. Caller is placed on hold
4. Agent A speaks to Agent B (warm introduction)
5. Agent A disconnects; caller is connected to Agent B

## Flow Design Patterns

### Direct Routing

```
Greeting ──► Connect (single number) ──► (no answer) Voicemail
```

### Department Routing

```
IVR ──► (1) Connect (Sales Group, round-robin)
     ──► (2) Connect (Support Group, longest-idle)
     ──► (3) Connect (Billing, sequential)
```

### Overflow Routing

```
Connect (Level 1 Support) ──► (busy) Connect (Level 2 Support)
                           ──► (no answer) Connect (Overflow Group)
                                           ──► (no answer) Voicemail
```

## Troubleshooting

| Issue | Possible Cause | Resolution |
|-------|---------------|------------|
| Call goes directly to fallback | Ring timeout too short | Increase the ring timeout (30 -- 45 seconds) |
| Agent's phone does not ring | Incorrect phone number configured | Verify the agent's number in user settings |
| Caller hears nothing while waiting | No hold music configured | Upload hold music audio file |
| Whisper message plays to caller | Configuration error | Verify whisper is set on the agent-leg only |
| Calls not distributed evenly | Strategy misconfigured | Check the distribution strategy settings |

## Related Topics

- [Connect Applet API Reference](/docs/voice-v1/applets/connect) -- Technical API details
- [IVR Applet Guide](/docs/app-bazaar/ivr-applet-guide) -- Build menus before Connect
- [Greeting Applet Guide](/docs/app-bazaar/greeting-applet-guide) -- Play messages before routing
- [Contact Center](/docs/contact-center/overview) -- Advanced agent management
- [Flow Builder Guide](/docs/app-bazaar/flow-builder-guide) -- Visual flow design
