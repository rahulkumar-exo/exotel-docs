---
id: ivr-setup
title: IVR Setup Guide
description: "Learn how to create single and multi-level IVR menus with DTMF input handling, routing rules, and best practices in Exotel."
sidebar_label: IVR Setup
sidebar_position: 3
---

# IVR Setup Guide

An IVR (Interactive Voice Response) lets callers navigate a phone menu using their keypad (DTMF tones). Instead of routing every call to an agent, an IVR enables callers to self-serve or reach the right department on their own.

## How IVR Works in Exotel

When a caller dials your ExoPhone, the call flow triggers the IVR Menu applet. The caller hears a prompt (e.g., "Press 1 for Sales, Press 2 for Support") and presses a key. Exotel detects the DTMF tone and routes the call to the corresponding applet in the flow.

```
Caller dials ExoPhone
        |
        v
  Greeting (optional)
        |
        v
  IVR Menu: "Press 1 for Sales, 2 for Support"
        |
    1 pressed → Connect (Sales team)
    2 pressed → Connect (Support team)
    Timeout   → Repeat or Voicemail
    Invalid   → "Invalid input, try again"
```

## Prerequisites

- An active ExoPhone. See [What is an ExoPhone?](/docs/call-support/basics/virtual-numbers)
- A call flow created in the dashboard. See [Setting Up a Call Flow](/docs/call-support/call-features/setting-up-call-flow)

## Creating a Single-Level IVR

### Step 1: Add the IVR Menu Applet

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Go to **App Bazaar** and open your call flow.
3. Drag the **IVR Menu** applet onto the canvas.
4. Place it after your Greeting applet (if you have one).

### Step 2: Record or Upload the IVR Prompt

The IVR prompt is the audio the caller hears before pressing a key. You have three options:

| Method | Description | Best For |
|---|---|---|
| **Record via phone** | Exotel calls you and records your voice | Quick setup |
| **Upload audio file** | Upload a pre-recorded `.wav` file (8000 Hz, Mono) | Professional recordings |
| **Text-to-Speech (TTS)** | Type the message and Exotel converts it to speech | Rapid prototyping |

:::tip
For production use, upload a professionally recorded audio file. TTS is useful for testing, but a human-recorded message sounds more natural to callers.
:::

### Step 3: Map DTMF Keys to Actions

In the IVR Menu configuration, map each key to the next applet:

| Key | Action | Connected Applet |
|---|---|---|
| 1 | Sales | Connect (Sales team numbers) |
| 2 | Support | Connect (Support team numbers) |
| 3 | Billing | Connect (Billing team number) |
| 0 | Speak to operator | Connect (Receptionist) |
| Timeout | No input detected | Repeat IVR or Voicemail |
| Invalid | Unrecognized key | Play error message, repeat IVR |

Available DTMF keys: `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `*`, `#`

### Step 4: Configure Timeout and Invalid Input

- **Timeout duration**: How long Exotel waits for a keypress (default: 5 seconds). Increase for elderly or less tech-savvy callers.
- **Maximum retries**: How many times the IVR repeats after invalid input or timeout before taking a fallback action.
- **Fallback action**: What happens after max retries (e.g., connect to operator, voicemail, hangup).

### Step 5: Save and Publish

1. Click **Save** to save the flow.
2. Click **Publish** to make it live.
3. Test by calling your ExoPhone and pressing different keys.

## Creating a Multi-Level IVR

A multi-level IVR has nested menus -- the caller presses a key at the first level and hears a second set of options.

```
Level 1: "Press 1 for Sales, 2 for Support"
    |
    1 → Level 2: "Press 1 for New Inquiry, 2 for Existing Order"
    |       |
    |       1 → Connect (New Sales team)
    |       2 → Connect (Order team)
    |
    2 → Level 2: "Press 1 for Technical, 2 for Billing"
            |
            1 → Connect (Tech support)
            2 → Connect (Billing)
```

### How to Build It

1. Create the first IVR Menu applet with top-level options.
2. For each key that needs a sub-menu, connect it to another IVR Menu applet.
3. Configure the second-level IVR Menu with its own prompt and key mappings.
4. Connect the second-level keys to Connect, Voicemail, or other applets.

See: [Multi-Level IVR](/docs/call-support/advanced-features/multi-level-ivr) for advanced nested IVR configurations.

## DTMF Input Collection

Beyond menu navigation, you can use DTMF to collect data from callers (e.g., order numbers, account IDs).

### Using the Passthru Applet for Dynamic IVR

1. Add a **Passthru** applet after the IVR Menu.
2. The Passthru applet sends an HTTP request to your server with the caller's input.
3. Your server responds with instructions (e.g., which applet to route to next).

```bash
# Exotel sends to your server:
POST https://your-app.com/ivr-handler
Content-Type: application/x-www-form-urlencoded

CallSid=<call_sid>&digits=1&From=<caller_number>

# Your server responds with routing instructions
```

See: [Voice v1 Passthru Applet](/docs/voice-v1/applets/passthru)

## IVR Configuration Options

| Setting | Description | Recommended Value |
|---|---|---|
| **Prompt audio** | The message played to the caller | Clear, concise recording |
| **Key mappings** | Which applet each key routes to | Map only the keys you need |
| **Timeout** | Seconds to wait for input | 5-7 seconds |
| **Max retries** | Times to repeat on invalid/timeout | 2-3 retries |
| **Invalid input message** | Audio played for wrong keypress | "That is not a valid option" |
| **Timeout message** | Audio played when no input | "We did not receive your input" |

## Best Practices

- **Keep menus short** -- Limit IVR options to 4-5 per level. Callers struggle to remember more than 5 options.
- **Put the most common option first** -- If 70% of callers want Sales, make it option 1.
- **Always offer a human option** -- Include "Press 0 to speak to an operator" as a fallback.
- **Avoid deep nesting** -- Limit your IVR to 2 levels. More than 2 levels frustrates callers.
- **Repeat the menu** -- If the caller does not press a key, repeat the menu at least once before routing to a fallback.
- **Use consistent language** -- Say "Press 1" not "Dial 1" or "Hit 1" throughout your prompts.

:::warning
Do not use IVR as a barrier to reaching a human agent. Regulatory guidelines in many countries require that callers can reach a live person within a reasonable number of steps.
:::

## Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| Caller hears nothing after greeting | IVR applet not connected | Connect Greeting output to IVR Menu |
| DTMF not detected | Audio overlap with keypress | Add a brief pause before the IVR prompt |
| Wrong department connected | Key mapping incorrect | Verify key-to-applet connections in the flow |
| IVR repeats endlessly | No max retry limit set | Set max retries to 2-3 |
| Caller drops off at IVR | Too many options or levels | Simplify the menu |

## Related

- [Multi-Level IVR](/docs/call-support/advanced-features/multi-level-ivr)
- [Setting Up a Call Flow](/docs/call-support/call-features/setting-up-call-flow)
- [Greeting Message](/docs/call-support/call-features/greeting-message)
- [Smart Routing](/docs/call-support/advanced-features/smart-routing)
- [Voice v1 API](/docs/voice-v1/overview)
