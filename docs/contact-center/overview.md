---
id: overview
title: Contact Center APIs v6
description: "Exotel Contact Center v6 API — build custom agent interfaces with outbound calling and call management."
sidebar_label: Overview
slug: /contact-center/overview
---

# Contact Center API

The Contact Center Management (CCM) API enables agents to connect with customers through programmatic voice call management. Build custom agent interfaces and CRM integrations with full control over call flows.

:::note Beta
The Contact Center API is currently in **Beta**.
:::

## Key Features

- **Outbound Calling** — Initiate calls from agents to customers programmatically
- **Call Recording** — Record calls with single or dual channel options
- **Status Callbacks** — Receive real-time call state updates via webhooks
- **Agent Management** — Integrates with the Users API for agent setup
- **Custom Metadata** — Attach application-specific data to calls

## Base URL

| Data Center | Base URL |
|------------|----------|
| Singapore | `https://<api_key>:<api_token>@ccm-api.exotel.com/v2/accounts/<sid>/calls` |
| Mumbai | `https://<api_key>:<api_token>@ccm-api.in.exotel.com/v2/accounts/<sid>/calls` |

## Authentication

All requests require **HTTP Basic Authentication** using your API key and token from the Exotel Dashboard.

## Prerequisites

- Agents must be added as users in Exotel (see [Users API](/docs/users/overview))
- Agents must be in **available** status to receive calls
- An ExoPhone must be assigned for the call
