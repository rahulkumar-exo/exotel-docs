---
id: manage-legs
title: Manage Legs & Bridges
sidebar_label: Manage Legs & Bridges
---

# Manage Legs & Bridges

## Get Leg Details

```
GET /v2/accounts/<account_sid>/legs/<leg_sid>
```

### Optional Query Parameters

| Parameter | Description |
|-----------|-------------|
| `bridge_status` | Include bridge information |
| `recording_status` | Include recording details |
| `tx_audio_status` | Include transmit audio status |
| `rx_audio_status` | Include receive audio status |
| `hold_status` | Include hold information |
| `gather_status` | Include DTMF gather status |
| `play_status` | Include audio playback status |

### Response Fields

| Field | Description |
|-------|-------------|
| `leg_sid` | Unique leg identifier |
| `contact_uri` | Endpoint address |
| `exophone` | Outbound number used |
| `caller_id` | Caller ID displayed |
| `direction` | Call direction |
| `network_type` | PSTN or VoIP |
| `state` | Current leg state |
| `terminal_status` | Final status if terminated |

---

## Create Bridge

Connect two or more active legs together.

```
POST /v2/accounts/<account_sid>/bridges
```

### Required Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `leg_sids` | Array | Array of active leg identifiers |
| `bridge_event_endpoint` | String | gRPC endpoint for events |

### Optional Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `absorb_dtmf` | Boolean | Suppress DTMF propagation |

### Response

```json
{
  "bridge_sid": "bridge_unique_id",
  "created_at": "2024-01-15T10:30:00Z",
  "account_sid": "account_id",
  "leg_sids": ["leg_1", "leg_2"],
  "bridge_event_endpoint": "grpc://your-endpoint"
}
```

---

## Get Bridge Details

```
GET /v2/accounts/<account_sid>/bridges/<bridge_sid>
```

Returns bridge state, active legs, and timestamps.

---

## Stop Bridge

```
PUT /v2/accounts/<account_sid>/bridges/<bridge_sid>
```

### Request Body

```json
{
  "action": "stop"
}
```

Stops the bridge and disconnects all legs.
