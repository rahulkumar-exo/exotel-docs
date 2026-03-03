---
id: ivr-menu
title: IVR Menu Applet
description: Build interactive voice menus with the Exotel IVR Menu applet. Route callers based on DTMF keypad input to different call flow branches.
sidebar_label: IVR Menu
sidebar_position: 5
---

# IVR Menu Applet

The IVR (Interactive Voice Response) Menu applet presents callers with a voice menu and routes them based on their DTMF (keypad) input.

## How It Works

1. The applet plays a recorded prompt (e.g., "Press 1 for Sales, Press 2 for Support")
2. The caller presses a key on their phone
3. The call is routed to the applet or flow connected to that key

## Configuration

1. In the Exotel Dashboard, open your call flow editor
2. Drag the **IVR Menu** applet into your flow
3. Configure the voice prompt (record, upload, or text-to-speech)
4. Map each key (0-9, *, #) to the next applet in the flow

## Example Flow

```
Incoming Call → Greeting ("Welcome to Acme Corp")
             → IVR Menu ("Press 1 for Sales, 2 for Support, 3 for Billing")
                ├── 1 → Connect (Sales team)
                ├── 2 → Connect (Support team)
                ├── 3 → Connect (Billing team)
                └── No input / Invalid → Repeat or Hangup
```

## Best Practices

- Keep menus simple — no more than 4-5 options
- Always provide a fallback for invalid input or no input
- Put the most common option first
- Use the [Greeting applet](/docs/voice-v1/applets/greeting) before the IVR Menu to welcome callers
