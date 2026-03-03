---
id: greeting
title: Greeting Applet
description: Play recorded voice messages or text-to-speech greetings to callers using the Exotel Greeting applet in your call flow.
sidebar_label: Greeting
sidebar_position: 1
---

# Greeting Applet

The Greeting applet plays a recorded voice message to greet your callers. Use it as the first step in your call flow to welcome callers before routing them.

## Features

- **Phone recording** — Record a greeting using your own phone
- **File upload** — Upload a pre-recorded audio file (8000 Hz Mono `.wav` format)
- **Text-to-speech** — Enter text and let the system generate speech automatically (Robocop)

## Usage

The Greeting applet is typically the first applet in an incoming call flow:

```
Incoming Call → Greeting → IVR Menu → Connect
```

## Configuration

1. In the Exotel Dashboard, open your call flow editor
2. Drag the **Greeting** applet into your flow
3. Choose your greeting method:
   - **Record via phone**: Enter your phone number and Exotel will call you to record
   - **Upload file**: Upload an 8000 Hz Mono `.wav` file
   - **Text-to-speech**: Type your greeting message

## Best Practices

- Keep greetings short and clear (under 15 seconds)
- If recording calls, use the Greeting applet to inform callers: *"This call may be recorded for quality assurance purposes"*
- Use text-to-speech for quick prototyping, then switch to professional recordings for production
