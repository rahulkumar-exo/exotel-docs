---
id: hangup
title: Hangup Applet
description: Terminate calls cleanly using the Exotel Hangup applet. Place it at the end of call flow branches to properly disconnect calls.
sidebar_label: Hangup
sidebar_position: 7
---

# Hangup Applet

The Hangup applet terminates a call. Use it as the final step in a call flow to cleanly end the conversation.

## How It Works

When a call reaches the Hangup applet, the call is immediately disconnected.

## Usage

Place the Hangup applet at the end of any branch in your call flow where you want the call to terminate:

```
Incoming Call → Greeting → IVR Menu
                           ├── 1 → Connect → Hangup
                           ├── 2 → Connect → Hangup
                           └── No input → Greeting ("Goodbye") → Hangup
```

## When to Use

- At the end of every call flow branch to ensure calls are properly terminated
- After a [Greeting applet](/docs/voice-v1/applets/greeting) that plays a final message
- As a fallback for unhandled IVR inputs
