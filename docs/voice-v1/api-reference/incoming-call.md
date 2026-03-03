---
id: incoming-call
title: Incoming Call
description: Learn how Exotel handles incoming calls on your ExoPhone, including call flow configuration using applets like Greeting, IVR Menu, and Connect.
sidebar_label: Incoming Call
---

# Incoming Call

When an incoming call lands on your ExoPhone, a call flow is automatically initiated. You configure what happens during that call flow using **Applets** — modular building blocks that handle greeting, routing, IVR menus, and more.

## How It Works

1. A caller dials your ExoPhone (virtual number)
2. Exotel triggers the call flow configured for that ExoPhone
3. The call flow executes applets in sequence (e.g., Greeting → IVR Menu → Connect)

## Configuring a Call Flow

To set up or modify the call flow for your ExoPhone:

1. Log in to your [Exotel Dashboard](https://my.exotel.com)
2. Navigate to **App Bazaar** or **ExoPhones** section
3. Select the ExoPhone you want to configure
4. Build your call flow by chaining applets together

## Available Applets

| Applet | Purpose |
|--------|---------|
| [Greeting](/docs/voice-v1/applets/greeting) | Play a recorded voice message or text-to-speech greeting |
| [Connect](/docs/voice-v1/applets/connect) | Route the call to a group or list of phone numbers |
| [Passthru](/docs/voice-v1/applets/passthru) | Send call details to your application URL for dynamic routing |
| [Transfer](/docs/voice-v1/applets/transfer) | Transfer between multiple call flows |
| [IVR Menu](/docs/voice-v1/applets/ivr-menu) | Present an interactive voice menu with DTMF input |
| [Voicemail](/docs/voice-v1/applets/voicemail) | Allow callers to leave a voice message |
| [Hangup](/docs/voice-v1/applets/hangup) | Terminate the call |

## Example Flow

A typical incoming call flow might look like:

```
Incoming Call → Greeting ("Welcome to Acme Corp")
             → IVR Menu ("Press 1 for Sales, 2 for Support")
             → Connect (route to the appropriate team)
```

:::tip
For detailed configuration of each applet, see the [Applets documentation](/docs/voice-v1/applets/greeting).
:::
