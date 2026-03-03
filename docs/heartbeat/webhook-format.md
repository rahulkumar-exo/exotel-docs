---
id: webhook-format
title: Webhook Format
description: Reference for the Exotel Heartbeat API webhook payload format, including health status fields and retry behavior.
sidebar_label: Webhook Format
---

# Heartbeat Webhook Format

The Heartbeat API sends health status notifications to your configured webhook endpoint via HTTP POST.

## Webhook Configuration

- **Method:** HTTP POST
- **Content-Type:** `application/json`
- **Frequency:** Configurable (in minutes)
- **Timeout:** 15 seconds
- **Retries:** 2 attempts for non-2XX responses or timeouts

Your endpoint **must** return an HTTP `200 OK` status code to acknowledge receipt.

## Webhook Payload

| Parameter | Type | Description |
|-----------|------|-------------|
| `timestamp` | String | RFC 3339 format (e.g., `2018-08-22T15:19:23Z`) |
| `status_type` | String | `OK`, `WARNING`, `CRITICAL`, or `PAYLOAD_TOO_LARGE` |
| `incoming_affected` | Array | SIDs of ExoPhones with incoming call issues |
| `outgoing_affected` | Array | SIDs of ExoPhones with outgoing call issues |
| `data` | Object | Detailed information about affected ExoPhones |

## Get ExoPhone Health Details

You can also query the health status of a specific ExoPhone:

### HTTP Request

```
GET https://<api_key>:<api_token>@<subdomain>/v2/accounts/<sid>/incoming-phone-numbers/<exophone_sid>
```

### Connectivity Fields in Response

| Field | Description |
|-------|-------------|
| `connectivity.incoming_call.status` | `active` or `major_outage` |
| `connectivity.outgoing_call.status` | `active` or `major_outage` |
| `connectivity.*.last_check_time` | RFC 3339 timestamp of last check |
| `connectivity.*.alternate_exophone` | Fallback number suggestions (`null` if unavailable) |

:::warning Rate Limiting
Exotel throttles requests to the ExoPhone Details endpoint. Excessive requests will return HTTP `429` status code.
:::
