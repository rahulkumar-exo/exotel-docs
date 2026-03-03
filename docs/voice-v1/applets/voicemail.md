---
id: voicemail
title: Voicemail Applet
description: Let callers leave recorded voice messages using the Exotel Voicemail applet. Route voicemails to specific groups or users for follow-up.
sidebar_label: Voicemail
sidebar_position: 6
---

# Voicemail Applet

The Voicemail applet allows callers to leave a recorded voice message when no one is available to take the call. Messages are routed to specified groups or users.

## How It Works

1. A call reaches the Voicemail applet (typically after a failed Connect attempt)
2. The caller hears a prompt to leave a message
3. The caller records their message and hangs up
4. The voicemail is stored and routed to the configured recipients

## Features

- **Route to groups or users** — Send voicemail notifications to specific teams or individuals
- **Tracking** — All voicemails are traced and tracked in the system
- **Integration** — Combine with the [Email applet](/docs/voice-v1/applets/email) to send voicemail notifications

## Configuration

1. In the Exotel Dashboard, open your call flow editor
2. Drag the **Voicemail** applet into your flow
3. Configure the recipient group or user
4. Optionally add a [Greeting applet](/docs/voice-v1/applets/greeting) before it with a custom prompt

## Example Flow

```
Incoming Call → Connect (to support team)
             → (no answer) → Greeting ("Please leave a message after the beep")
             → Voicemail
```
