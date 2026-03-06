---
id: ivr-applet-guide
title: IVR Applet Guide
description: "Build single and multi-level IVR menus with the Exotel IVR applet using DTMF input, timeouts, and dynamic routing options."
sidebar_label: IVR Applet
sidebar_position: 6
---

# IVR Applet Guide

The IVR (Interactive Voice Response) applet creates phone menus that let callers navigate options using DTMF (keypad) input. Callers hear a prompt and press a key to select their desired option, which routes them to the appropriate next step in the call flow.

:::tip
For the API-level technical reference, see [IVR Menu Applet](/docs/voice-v1/applets/ivr-menu).
:::

## How the IVR Applet Works

1. The caller hears an audio prompt (e.g., "Press 1 for Sales, Press 2 for Support")
2. The caller presses a key on their phone (DTMF input)
3. The IVR applet matches the input to a configured option
4. The call is routed to the applet connected to that option
5. If the input is invalid or no input is received, the fallback behavior is triggered

```
Caller hears menu ──► Presses key ──► Matched to option ──► Routed to next applet
                                   ──► No match / timeout ──► Replay or fallback
```

## Configuration

### Basic Setup

1. Drag the **IVR** applet onto the [Flow Builder](/docs/app-bazaar/flow-builder-guide) canvas
2. Click the applet to open the Properties Panel
3. Configure the audio prompt
4. Add menu options with DTMF key assignments
5. Configure timeout and fallback behavior
6. Connect each option's output to the next applet in the flow

### Audio Prompt

The IVR prompt is the audio that tells callers what options are available. Configure it the same way as the [Greeting applet](/docs/app-bazaar/greeting-applet-guide):

| Source | Description |
|--------|-------------|
| **Phone recording** | Record the prompt by phone |
| **File upload** | Upload a pre-recorded WAV or MP3 file (8000 Hz Mono recommended) |
| **Text-to-Speech** | Enter text and select a language/voice |

**Example prompt text:** "Thank you for calling Acme Corp. Press 1 for Sales. Press 2 for Customer Support. Press 3 for Billing. Press 0 to speak to an operator."

### Menu Options

Each menu option maps a DTMF key to a specific flow path:

| Setting | Description |
|---------|-------------|
| **Key** | The DTMF digit (0 -- 9, *, #) |
| **Label** | Description of what this option does (for your reference) |
| **Next Applet** | The applet to route to when this key is pressed |

#### Available DTMF Keys

| Key | Commonly Used For |
|-----|------------------|
| `1` | Primary option (Sales, English, etc.) |
| `2` | Secondary option (Support, Hindi, etc.) |
| `3` | Third option (Billing, etc.) |
| `4` -- `9` | Additional options |
| `0` | Speak to operator / agent |
| `*` | Go back to previous menu |
| `#` | Confirm selection or skip |

### Timeout and Retry Settings

| Setting | Default | Description |
|---------|---------|-------------|
| **Input Timeout** | 5 seconds | Time to wait for DTMF input after the prompt finishes |
| **Max Retries** | 2 | Number of times to replay the menu if no valid input is received |
| **Retry Message** | Replay original prompt | Audio to play before replaying the menu |
| **Final Timeout Action** | Hangup | What happens after all retries are exhausted |

## Single-Level IVR

A single-level IVR provides one menu with direct routing to each option:

```
Greeting ──► IVR Menu
              ├──► (Press 1) Connect Sales Group
              ├──► (Press 2) Connect Support Group
              ├──► (Press 3) Connect Billing
              ├──► (Press 0) Connect Operator
              └──► (No input) Replay IVR / Hangup
```

### Configuration Example

| Key | Label | Routes To |
|-----|-------|-----------|
| 1 | Sales | Connect applet (Sales agent group) |
| 2 | Support | Connect applet (Support agent group) |
| 3 | Billing | Connect applet (Billing team) |
| 0 | Operator | Connect applet (Reception) |

## Multi-Level IVR

Multi-level IVR creates nested menus where one IVR leads to another:

```
IVR Level 1 ("Select department")
  ├──► (Press 1) IVR Level 2 ("Select Sales region")
  │                 ├──► (Press 1) Connect Sales India
  │                 ├──► (Press 2) Connect Sales APAC
  │                 └──► (Press *) Go back to Level 1
  │
  ├──► (Press 2) IVR Level 2 ("Select Support type")
  │                 ├──► (Press 1) Connect Technical Support
  │                 ├──► (Press 2) Connect Account Support
  │                 └──► (Press *) Go back to Level 1
  │
  └──► (Press 0) Connect Operator
```

:::warning
Limit IVR menus to a maximum of **2 -- 3 levels deep**. Callers become frustrated with too many nested menus and may hang up. If your menu tree is growing beyond 3 levels, consider simplifying or using a [Passthru applet](/docs/app-bazaar/passthru-applet-guide) for dynamic routing instead.
:::

### Building Multi-Level IVR

1. Place the first IVR applet (Level 1 menu)
2. For each option that needs a sub-menu, place another IVR applet
3. Connect the Level 1 option output to the Level 2 IVR input
4. Configure the Level 2 IVR with its own options
5. Use `*` or `#` to allow callers to go back to the previous menu (connect to Level 1)

## Advanced Features

### Dynamic IVR with Passthru

Combine IVR with the [Passthru applet](/docs/app-bazaar/passthru-applet-guide) to create data-driven menus:

```
IVR ("Enter your order number") ──► Passthru (look up order)
                                     ──► Greeting (read order status via TTS)
                                     ──► Connect (to support agent)
```

### Collecting Multi-Digit Input

For collecting account numbers, order IDs, or PINs:

1. Configure the IVR to accept **multi-digit input**
2. Set the **termination key** to `#` (caller presses # after entering digits)
3. The collected digits are passed to the next applet (typically Passthru)

| Setting | Description |
|---------|-------------|
| **Multi-digit mode** | Enable to accept more than one keypress |
| **Max digits** | Maximum number of digits to collect (e.g., 10 for a phone number) |
| **Termination key** | Key that signals end of input (typically `#`) |

### DTMF During Greeting

If a Greeting applet precedes the IVR and the caller already knows the menu options, they can press a key during the greeting to skip directly to their choice:

1. On the Greeting applet, enable **Interruptible**
2. The IVR applet receives the DTMF input and routes accordingly
3. This speeds up the experience for repeat callers

## IVR Best Practices

1. **Keep it short** -- Limit to 4 -- 5 options per menu level
2. **Put the most common option first** -- If 70% of callers choose Support, make it option 1
3. **Always offer a human option** -- Include "Press 0 to speak to an agent" as a fallback
4. **Allow back navigation** -- In multi-level menus, use `*` to go back
5. **Handle invalid input gracefully** -- Replay the menu with a helpful message
6. **Test with real users** -- Have colleagues or test callers navigate the menu
7. **Review IVR analytics** -- Track which options are selected most and optimize accordingly

## Troubleshooting

| Issue | Possible Cause | Resolution |
|-------|---------------|------------|
| Caller's input not detected | DTMF not transmitted properly | Test with different phones; check carrier support |
| Wrong option selected | Key mapping misconfigured | Verify the key-to-applet connections in the flow |
| Menu replays endlessly | Max retries set to 0 (infinite) or very high | Set max retries to 2 -- 3 |
| Caller hangs up during IVR | Menu too long or too many levels | Simplify the menu structure |
| Multi-digit input not working | Multi-digit mode not enabled | Enable multi-digit mode in IVR settings |

## Related Topics

- [IVR Menu Applet API Reference](/docs/voice-v1/applets/ivr-menu) -- Technical API details
- [Greeting Applet Guide](/docs/app-bazaar/greeting-applet-guide) -- Play prompts before IVR
- [Connect Applet Guide](/docs/app-bazaar/connect-applet-guide) -- Route calls after IVR selection
- [Passthru Applet Guide](/docs/app-bazaar/passthru-applet-guide) -- Dynamic routing after IVR input
- [Flow Builder Guide](/docs/app-bazaar/flow-builder-guide) -- Visual flow design
