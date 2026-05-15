---
id: passthru
title: Passthru Applet
description: Enable dynamic call routing with the Exotel Passthru applet. Send call details to your application URL and branch the flow based on your response.
sidebar_label: Passthru
sidebar_position: 3
---

# Passthru Applet

The Passthru applet enables dynamic call flow control by communicating with your application in real-time. When a call reaches this applet, Exotel sends call details to your application URL and uses your response to determine the next step.

## How It Works

1. A call reaches the Passthru applet in your flow
2. Exotel sends an HTTP request to your Application URL with incoming call details
3. Your application processes the data (e.g., looks up the caller in a CRM)
4. Your application responds with an HTTP status code
5. The call flow branches based on your response

## Decision Making

The Passthru applet supports **binary decisions** using HTTP status codes:

| Response Code | Action |
|---------------|--------|
| `200 OK`      | Route to **Choice A** (the applet connected to the "200" branch) |
| `302 Found`   | Route to **Choice B** (the applet connected to the "302" branch) |

## Parameters Sent to Your URL

When a call reaches the Passthru applet, Exotel sends details about the incoming call to your Application URL. For the complete list of parameters, refer to the [Passthru applet documentation](mailto:hello@exotel.com).

## Use Cases

- **VIP routing** — Check if the caller is a premium customer and route to priority support
- **Business hours** — Check if it's within office hours and route accordingly
- **CRM integration** — Look up the caller and route to their assigned account manager
- **Load balancing** — Distribute calls based on agent availability

## Example Flow

```
Incoming Call → Passthru (check CRM)
                ├── 200 OK → Connect (to assigned agent)
                └── 302 Found → IVR Menu (general support)
```

:::tip
Use the Passthru applet instead of `StatusCallbackEvents` when you're using `VoiceUrl` for call flows.
:::
