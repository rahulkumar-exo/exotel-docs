---
id: stream-voicebot-extension
title: "Updated Extension Guide: Working with the Stream and Voicebot Applet (Beta)"
description: Comprehensive guide to using Exotel Stream Applet and Voicebot Applet for media streaming with extended configuration options.
sidebar_label: Extension Guide (Beta)
slug: /agentstream/stream-voicebot-extension
sidebar_position: 5
---

# Updated Extension Guide: Working with the Stream and Voicebot Applet (Beta)

:::warning Beta Feature
This extension guide covers Beta features for the Stream and Voicebot Applet. Features and behavior may change.
:::

## Overview

This guide provides a comprehensive overview of how to use Exotel's Stream Applet (Unidirectional) and Voicebot Applet (Bidirectional) for media streaming, with extended configuration options beyond the base applet guide. If you are new to streaming, start with the [Getting Started guide](./getting-started) and the [base Stream & Voicebot Applet guide](./stream-voicebot-applet) first.

The extended options described here give you fine-grained control over audio format, track selection, metadata, silence handling, and DTMF behavior — critical for production deployments where default settings may not meet your pipeline requirements.

## Extended Configuration Options

### 1. Media Format

By default, Exotel streams audio as **mulaw (G.711) at 8 kHz**. Extended configuration lets you change the encoding and sample rate:

| Option | Description |
|---|---|
| **mulaw 8 kHz** | Default. Compatible with most telephony and STT pipelines. |
| **PCM 8 kHz** | Raw linear PCM at 8 kHz. Use when your pipeline prefers uncompressed audio. |
| **PCM 16 kHz** | Raw linear PCM at 16 kHz. Higher fidelity; preferred by many modern speech-to-text engines (Google STT, Deepgram, Whisper). |

Set the `MediaFormat` parameter in the applet configuration to `audio/x-mulaw;rate=8000`, `audio/L16;rate=8000`, or `audio/L16;rate=16000` as appropriate.

### 2. Track Selection

You can choose which audio tracks to include in the stream:

| Track | Description |
|---|---|
| `inbound` | Audio from the caller (what the caller says) |
| `outbound` | Audio from your side / the bot (what the caller hears) |
| `both` | Both tracks interleaved. Each WebSocket message includes a `track` field indicating `inbound` or `outbound`. |

For transcription-only use cases, select `inbound` to halve your processing load. For full conversation logging, use `both`.

### 3. Custom Metadata Parameters

Pass arbitrary key-value pairs to your WebSocket server via the `CustomParameters` field. These are delivered in the initial `connected` WebSocket message and are useful for:

- Passing a session ID or tenant ID without a separate Passthru Applet call
- Sending the agent's ID or queue name to the streaming server
- Flagging the call as a test or production call

Parameters are defined as a comma-separated list of `key=value` pairs: `sessionId=abc123,agentId=agent_007`.

### 4. Silence Detection Settings

When silence detection is enabled, Exotel can notify your server (or take a configured action) when a period of silence is detected in the audio stream. This is primarily useful in Voicebot mode to detect when the caller has stopped speaking.

| Parameter | Description | Default |
|---|---|---|
| `SilenceTimeout` | Duration of silence (in milliseconds) before a silence event is fired | `2000` ms |
| `SilenceAction` | What to do when silence is detected: `notify` (send a WebSocket event) or `hangup` | `notify` |

When `SilenceAction` is set to `notify`, your server receives a WebSocket message with `event: silence` so you can trigger the bot's next turn.

### 5. DTMF Handling in Voicebot Mode

In Voicebot mode, callers may press keypad digits during a conversation. Extended configuration lets you control how these are handled:

| Option | Description |
|---|---|
| `dtmf: stream` | DTMF tones are delivered to your WebSocket server as discrete events with the digit value (e.g., `{"event":"dtmf","digit":"5"}`). Your server decides how to respond. |
| `dtmf: suppress` | DTMF tones are stripped from the audio stream and not delivered to your server. Use this when key presses should be ignored. |
| `dtmf: passthrough` | DTMF tones are included in the raw audio stream (in-band). Use only if your server processes in-band DTMF directly. |

## Full Configuration Parameters Reference

| Parameter | Allowed Values | Default | Applies To |
|---|---|---|---|
| `MediaFormat` | `audio/x-mulaw;rate=8000`, `audio/L16;rate=8000`, `audio/L16;rate=16000` | `audio/x-mulaw;rate=8000` | Stream, Voicebot |
| `Track` | `inbound`, `outbound`, `both` | `both` | Stream, Voicebot |
| `CustomParameters` | `key=value` pairs, comma-separated | _(none)_ | Stream, Voicebot |
| `SilenceTimeout` | Integer, milliseconds | `2000` | Voicebot |
| `SilenceAction` | `notify`, `hangup` | `notify` | Voicebot |
| `DtmfHandling` | `stream`, `suppress`, `passthrough` | `stream` | Voicebot |
| `WebSocketUrl` | Valid `wss://` URL | _(required)_ | Stream, Voicebot |

## Configuration Notes

- **PCM 16 kHz and bandwidth:** PCM 16 kHz produces roughly twice the data of mulaw 8 kHz per second. Factor this into your WebSocket server's ingest capacity and your downstream STT costs.
- **Track selection and Voicebot latency:** Streaming `both` tracks in Voicebot mode increases data throughput. If your bot only needs to hear the caller, set `Track` to `inbound` to reduce processing overhead.
- **Custom parameters and security:** Do not pass secrets or tokens as custom parameters — they appear in the WebSocket message in plaintext. Use short-lived lookup tokens or session IDs instead.
- **DTMF and speech conflict:** If your voicebot uses both speech recognition and DTMF input, set `DtmfHandling` to `stream` so your server receives discrete digit events and can handle them independently from the audio pipeline.

## Related

- [Stream & Voicebot Applet](./stream-voicebot-applet) -- Base guide for Stream and Voicebot Applets
- [Getting Started](./getting-started) -- Quick guide to streaming services
- [Passthru Applet](./passthru-applet) -- Send call metadata to your server
- [AgentStream Overview](./overview) -- Platform overview
