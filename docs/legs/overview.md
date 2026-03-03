---
id: overview
title: Legs
description: Overview of the Exotel Legs and Bridges API for creating and managing individual call legs across PSTN and VoIP networks.
sidebar_label: Overview
slug: /legs/overview
---

# Legs & Bridges API

The Legs API enables creation and management of individual call legs within the Exotel platform, supporting both PSTN and VoIP networks. Bridges connect multiple legs together.

## Key Concepts

- **Leg** — A single call connection to one endpoint (phone number or SIP URI)
- **Bridge** — Connects two or more active legs together for conversation

## Base URL

```
https://<base_url>/v2/accounts/<account_sid>/
```

## Authentication

HTTP Basic Authentication using your API key and token.

## Network Types

| Type | Description |
|------|-------------|
| `pstn` | Standard phone network (default) |
| `voip` | VoIP/SIP connection |

## Leg Events

Events are delivered via gRPC to your configured endpoint:

| Event | Description |
|-------|-------------|
| `leg_connecting` | Leg is being established |
| `leg_ringing` | Endpoint is ringing |
| `leg_answered` | Call was answered |
| `leg_terminated` | Call ended |
| `leg_failed_to_create` | Leg creation failed |
| `amd_result_success` | Answering machine detection result |

## Bridge Events

| Event | Description |
|-------|-------------|
| `bridge_created` | Bridge established |
| `bridge_terminal` | Bridge ended |
| `leg_joined_bridge` | A leg joined the bridge |
| `leg_left_bridge` | A leg left the bridge |
