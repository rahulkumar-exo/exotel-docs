---
id: passthru-applet
title: Working with Passthru Applet for AgentStream (Beta)
description: Use the Passthru Applet to send call and streaming metadata from Voice Applet flows to your server in AgentStream workflows.
sidebar_label: Passthru Applet
slug: /agentstream/passthru-applet
sidebar_position: 3
---

# Working with Passthru Applet for AgentStream (Beta)

:::warning Beta Feature
The Passthru Applet for AgentStream is currently in Beta. Features and behavior may change.
:::

## Overview

The Passthru Applet sends call and streaming metadata from Voice Applet flows to your server, especially useful when executing:

- **Voicebot Applet** flows
- **Stream Applet** flows

It enables your backend to receive metadata about the current call and streaming session, allowing you to coordinate your streaming server with the call flow.

## How It Works

When a call reaches the Passthru Applet in your call flow, Exotel makes an HTTP POST request to the server URL you configure. The POST body contains a JSON payload with identifiers and context for the current call and stream. Your server responds with a `200 OK`, and the call flow continues to the next applet — typically the Stream or Voicebot Applet.

This gives your server a window of time to prepare before the WebSocket audio connection opens. Common uses include:

- Allocating a session or loading a language model in advance
- Storing the `StreamSid` so you can correlate WebSocket events to call records
- Triggering a downstream service (CRM lookup, agent assignment) before audio begins

## Metadata Payload Fields

Exotel sends the following fields in the HTTP POST body:

| Field | Type | Description |
|---|---|---|
| `CallSid` | string | Unique identifier for the call leg |
| `StreamSid` | string | Unique identifier for the streaming session |
| `StreamUrl` | string | The WebSocket URL Exotel will connect to for streaming |
| `AccountSid` | string | Your Exotel Account SID |
| `EventType` | string | Always `stream-start` for the Passthru Applet trigger |
| `From` | string | The caller's phone number (E.164 format) |
| `To` | string | The Exotel virtual number that received the call |
| `Direction` | string | `inbound` or `outbound` |

## Sample JSON Payload

```json
{
  "CallSid": "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
  "StreamSid": "MZ1234567890abcdef1234567890abcdef",
  "StreamUrl": "wss://yourserver.example.com/stream",
  "AccountSid": "your_account_sid",
  "EventType": "stream-start",
  "From": "+919876543210",
  "To": "+918041234567",
  "Direction": "inbound"
}
```

Your server must respond with HTTP `200 OK`. Any non-200 response or a timeout will cause the call flow to halt at the Passthru Applet.

## When to Use the Passthru Applet

Place the Passthru Applet **before** a Stream or Voicebot Applet in your call flow when:

- Your WebSocket server needs time to initialize a session before audio arrives (for example, to warm up an AI model or create a database record)
- You need the `StreamSid` available in your backend before the WebSocket connection is established
- You want to perform a conditional action (such as routing to a different applet) based on the response from your server

If your WebSocket server can handle the connection immediately without any advance preparation, the Passthru Applet is optional.

## Setup Steps

1. **Open your call flow in the Exotel dashboard.** Go to [my.exotel.com](https://my.exotel.com) → **ExoPhone → App Bazaar** and open the call flow where you are using a Stream or Voicebot Applet.

2. **Add the Passthru Applet to the flow.** From the applet panel, drag the **Passthru Applet** onto the canvas and position it before the Stream or Voicebot Applet.

3. **Configure the callback URL.** Click the Passthru Applet to open its settings. Enter the HTTPS URL of the endpoint on your server that should receive the metadata POST (for example, `https://yourserver.example.com/call-init`).

4. **Set the response timeout.** Configure an appropriate timeout (typically 3–5 seconds). If your server does not respond within this window, the call flow will not advance.

5. **Connect the applet to the stream applet.** Draw a connection from the Passthru Applet's success output to the Stream or Voicebot Applet.

6. **Save and test the flow.** Place a test call to verify that your server receives the POST, logs the `StreamSid`, and responds with `200 OK` before the WebSocket audio connection opens.

## Configuration Notes

- **HTTPS required:** The callback URL must use HTTPS. Plain HTTP endpoints are not accepted.
- **Response body:** The Passthru Applet ignores the body of your server's response — only the HTTP status code matters. Return `200 OK` with an empty body if no action is needed.
- **Idempotency:** Design your handler to be idempotent. In rare cases, Exotel may retry the POST if the initial request times out.

## Related

- [Getting Started](./getting-started) -- Quick guide to streaming services
- [Stream & Voicebot Applet](./stream-voicebot-applet) -- Working with Stream and Voicebot Applets
- [Voice v1 Passthru Applet](/docs/voice-v1/applets/passthru) -- General Passthru Applet reference
- [AgentStream Overview](./overview) -- Platform overview
