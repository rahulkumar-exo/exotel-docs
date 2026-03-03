---
id: create-leg
title: Create Leg
description: Create a new call leg to a phone number or SIP URI endpoint using the Exotel Legs API for PSTN and VoIP networks.
sidebar_label: Create Leg
---

# Create a Leg

Create a new call leg to an endpoint.

## HTTP Request

```
POST /v2/accounts/<account_sid>/legs
```

## Required Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `contact_uri` | String | Phone number or SIP URI |
| `exophone` | String | Outbound number/SIP URI |
| `leg_event_endpoint` | String | gRPC endpoint for events |

## Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `network_type` | String | `pstn` | `pstn` or `voip` |
| `custom_param` | String | — | User-defined parameter |
| `time_limit` | Integer | 14400 | Max duration in seconds (4 hours) |
| `timeout` | Integer | 30 | Connection timeout in seconds |
| `setup_timeout` | Integer | 30 | Initialization timeout |
| `ring_timeout` | Integer | 30 | Ringing timeout |
| `requested_dc_code` | String | — | Data center preference |
| `requested_nso_code` | String | — | Network switching office preference |
| `reference_leg_sid` | String | — | Co-locate with existing leg |
| `amd_enable` | Boolean | false | Enable answering machine detection |
| `async_amd` | Boolean | false | Asynchronous machine detection |
| `priority` | String | `normal` | `normal` or `high` |

## Response

```json
{
  "leg_sid": "leg_unique_id",
  "created_at": "2024-01-15T10:30:00Z",
  "account_sid": "account_id",
  "contact_uri": "+919999999999",
  "network_type": "pstn",
  "exophone": "+918888888888"
}
```
