---
id: overview
title: Heartbeat
description: "Exotel Heartbeat API — real-time ExoPhone health monitoring with webhook notifications."
sidebar_label: Overview
slug: /heartbeat/overview
---

# Heartbeat API

The Heartbeat API monitors the health of your ExoPhones in real time and notifies you via webhooks when issues are detected. This allows you to take immediate action such as routing calls to alternate numbers.

:::note Beta
The Heartbeat API is currently available in **Beta**.
:::

## Key Features

- **Real-time Monitoring** — Continuous health checks on all ExoPhones
- **Webhook Notifications** — Receive POST callbacks with health status
- **Configurable Frequency** — Set monitoring interval in minutes
- **Alternate Numbers** — Get fallback ExoPhone suggestions when issues occur

## Setup

1. Navigate to **Notifications Settings** in your Exotel Dashboard
2. Configure a working HTTP endpoint URL
3. Ensure your endpoint returns `200 OK` on POST requests
4. Set the notification frequency (in minutes)

:::info
Heartbeat is subscribed for **all ExoPhones** in your account. Individual ExoPhone monitoring cannot be configured separately.
:::

## Status Types

| Status | Description |
|--------|-------------|
| `OK` | All ExoPhones are healthy |
| `WARNING` | One or more ExoPhones have issues (incoming, outgoing, or both) |
| `CRITICAL` | All ExoPhones are affected |
| `PAYLOAD_TOO_LARGE` | Payload exceeds 10MB limit |
