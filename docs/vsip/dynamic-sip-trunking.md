---
id: dynamic-sip-trunking
title: Dynamic SIP Trunking
description: API reference for Exotel Dynamic SIP Trunking — create and manage SIP trunks, whitelist IPs, configure destination URIs, and handle inbound/outbound PSTN calls programmatically.
sidebar_label: Dynamic SIP Trunking
slug: /vsip/dynamic-sip-trunking
sidebar_position: 2
---

# Dynamic SIP Trunking

Connect your SIP system to Exotel's PSTN infrastructure via REST API. Create trunks, whitelist IPs, map phone numbers, and configure routing — all programmatically.

---

## How it works

```
Outbound:  Your SIP system → Exotel SIP trunk → PSTN
Inbound:   PSTN → Exotel → Flow (Connect applet) → SIP trunk → Your SIP system
```

---

## Call directions

| Direction | Path | Requires |
|-----------|------|----------|
| **Outbound** (SIP → PSTN) | Your SIP → Exotel → PSTN | Whitelisted IP (ACL) + phone number mapped to trunk |
| **Inbound** (PSTN → SIP) | PSTN → Exotel Flow → SIP trunk → Your system | Destination URI + Flow with Connect applet using `sip:<trunk_sid>` |
| **Bidirectional** | Both above | Both above |

### Routing modes

| Mode | Use when |
|------|----------|
| `pstn` | Standard PSTN inbound/outbound (default) |
| `flow` | Route calls through a Voice AI / StreamKit flow |

---

## Quick setup

```
1. Create trunk           →  get trunk_sid
2. Map phone number       →  get phone_number_id
3. Whitelist your IP      →  enables outbound
4. Set destination URI    →  enables inbound
```

---

## API reference

**Base URLs**

| Region | URL |
|--------|-----|
| Mumbai | `https://api.in.exotel.com` |
| Singapore | `https://api.exotel.com` |

**Auth:** HTTP Basic — API key as username, API token as password.

**Rate limit:** 200 requests/minute.

All endpoints are prefixed with `/v2/accounts/{account_sid}`.

---

### Create trunk

```
POST /v2/accounts/{account_sid}/trunks
```

| Parameter | Required | Description |
|-----------|----------|-------------|
| `trunk_name` | Yes | Alphanumeric + underscores, max 16 chars |
| `nso_code` | Yes | Use `"any any"` |
| `domain_name` | Yes | `{account_sid}.pstn.exotel.com` |

```bash
curl -X POST \
  'https://<api_key>:<api_token>@api.in.exotel.com/v2/accounts/<account_sid>/trunks' \
  -H 'Content-Type: application/json' \
  -d '{
    "trunk_name": "outbound_trunk",
    "nso_code": "any any",
    "domain_name": "<account_sid>.pstn.exotel.com"
  }'
```

```json
{
  "trunk_sid": "TKxxxxxxxxxxxxxxxx",
  "trunk_name": "outbound_trunk",
  "status": "active",
  "auth_type": "ip whitelist",
  "domain_name": "<account_sid>.pstn.exotel.com",
  "date_created": "2026-05-14T10:00:00Z"
}
```

:::note
Save `trunk_sid` — required for all subsequent API calls.
:::

---

### Map phone number

```
POST /v2/accounts/{account_sid}/trunks/{trunk_sid}/phone_numbers
```

| Parameter | Required | Description |
|-----------|----------|-------------|
| `phone_number` | Yes | E.164 format (`+919876543210`) |
| `mode` | No | `pstn` (default) or `flow` (Voice AI) |

```bash
curl -X POST \
  'https://<api_key>:<api_token>@api.in.exotel.com/v2/accounts/<account_sid>/trunks/<trunk_sid>/phone_numbers' \
  -H 'Content-Type: application/json' \
  -d '{
    "phone_number": "+919876543210",
    "mode": "pstn"
  }'
```

```json
{
  "id": 41523,
  "phone_number": "+919876543210",
  "trunk_sid": "TKxxxxxxxxxxxxxxxx",
  "mode": "pstn"
}
```

:::note
Save the numeric `id` — needed for mode updates.
:::

---

### Whitelist IP (outbound)

Registers your server's IP for outbound call authentication.

```
POST /v2/accounts/{account_sid}/trunks/{trunk_sid}/whitelisted_ips
```

| Parameter | Required | Description |
|-----------|----------|-------------|
| `ip` | Yes | Your server's public IPv4 address |
| `mask` | No | CIDR subnet mask (default: `32`) |

```bash
curl -X POST \
  'https://<api_key>:<api_token>@api.in.exotel.com/v2/accounts/<account_sid>/trunks/<trunk_sid>/whitelisted_ips' \
  -H 'Content-Type: application/json' \
  -d '{
    "ip": "44.248.146.11",
    "mask": 32
  }'
```

```json
{
  "id": 123,
  "ip": "44.248.146.11",
  "mask": 32,
  "trunk_sid": "TKxxxxxxxxxxxxxxxx"
}
```

---

### Set destination URI (inbound)

Configures where Exotel routes incoming calls.

```
POST /v2/accounts/{account_sid}/trunks/{trunk_sid}/destination_uris
```

| Parameter | Required | Description |
|-----------|----------|-------------|
| `destinations[].destination` | Yes | SIP URI: `<ip_or_fqdn>:<port>;transport=<tls\|tcp>` |

**Supported transports:** `tls` (port 5061, recommended) · `tcp` (port 5060)

```bash
# IP-based
curl -X POST \
  'https://<api_key>:<api_token>@api.in.exotel.com/v2/accounts/<account_sid>/trunks/<trunk_sid>/destination_uris' \
  -H 'Content-Type: application/json' \
  -d '{
    "destinations": [
      { "destination": "44.248.146.11:5061;transport=tls" }
    ]
  }'
```

```bash
# FQDN-based
curl -X POST \
  'https://<api_key>:<api_token>@api.in.exotel.com/v2/accounts/<account_sid>/trunks/<trunk_sid>/destination_uris' \
  -H 'Content-Type: application/json' \
  -d '{
    "destinations": [
      { "destination": "sip.yourcompany.com:5061;transport=tls" }
    ]
  }'
```

```json
{
  "id": 456,
  "destination": "sip:44.248.146.11:5061;transport=tls",
  "type": "public",
  "priority": 0,
  "weight": 1,
  "trunk_sid": "TKxxxxxxxxxxxxxxxx"
}
```

---

### SIP digest credentials

Use instead of (or alongside) IP whitelisting for cloud platforms with dynamic IPs (e.g. ElevenLabs, LiveKit).

```
POST /v2/accounts/{account_sid}/trunks/{trunk_sid}/credentials
```

| Parameter | Required | Description |
|-----------|----------|-------------|
| `user_name` | Yes | SIP digest username |
| `password` | Yes | Strong password |
| `friendly_name` | No | Label, max 32 chars |

```bash
curl -X POST \
  'https://<api_key>:<api_token>@api.in.exotel.com/v2/accounts/<account_sid>/trunks/<trunk_sid>/credentials' \
  -H 'Content-Type: application/json' \
  -d '{
    "user_name": "voice_ai_user",
    "password": "strong_password_here",
    "friendly_name": "elevenlabs_prod"
  }'
```

**List credentials**

```bash
curl 'https://<api_key>:<api_token>@api.in.exotel.com/v2/accounts/<account_sid>/trunks/<trunk_sid>/credentials'
```

**Delete credentials**

```bash
curl -X DELETE \
  'https://<api_key>:<api_token>@api.in.exotel.com/v2/accounts/<account_sid>/trunks/<trunk_sid>/credentials?id=<credential_id>'
```

---

### Update phone number mode

Switch a mapped number between PSTN and Flow (Voice AI) routing.

```
PUT /v2/accounts/{account_sid}/trunks/{trunk_sid}/phone_numbers/{phone_number_id}
```

```bash
curl -X PUT \
  'https://<api_key>:<api_token>@api.in.exotel.com/v2/accounts/<account_sid>/trunks/<trunk_sid>/phone_numbers/41523' \
  -H 'Content-Type: application/json' \
  -d '{
    "phone_number": "+919876543210",
    "mode": "flow"
  }'
```

:::note
Use the numeric `id` from the Map Phone Number response, not the phone number itself.
:::

---

### Set caller ID (trunk alias)

Sets the number displayed to called parties on outbound calls.

```
POST /v2/accounts/{account_sid}/trunks/{trunk_sid}/settings
```

```bash
curl -X POST \
  'https://<api_key>:<api_token>@api.in.exotel.com/v2/accounts/<account_sid>/trunks/<trunk_sid>/settings' \
  -H 'Content-Type: application/json' \
  -d '{
    "settings": [
      { "name": "trunk_external_alias", "value": "+919876543210" }
    ]
  }'
```

---

### Delete trunk

```
DELETE /v2/accounts/{account_sid}/trunks?trunk_sid={trunk_sid}
```

```bash
curl -X DELETE \
  'https://<api_key>:<api_token>@api.in.exotel.com/v2/accounts/<account_sid>/trunks?trunk_sid=<trunk_sid>'
```

:::warning
Permanently deletes the trunk and all associated phone numbers, ACLs, and destination URIs.
:::

---

## IP whitelist vs credentials

| Scenario | Method |
|----------|--------|
| On-premises PBX / SBC with fixed IP | IP whitelist only |
| Cloud AI platforms (ElevenLabs, LiveKit) | Credentials only |
| High-security production | Both |

---

## Network & firewall

For the full list of SIP signaling endpoints, inbound source IPs, media IP ranges, and firewall rules, refer to the official source of truth:

**[Network & Firewall Configuration →](https://docs.exotel.com/dynamic-sip-trunking/network-and-firewall-configuration)**

:::warning No audio?
If calls connect but have no audio or one-way audio — UDP 10 000–40 000 is likely blocked on your firewall.
:::

---

## SIP error codes

### 4xx — Client errors

| Code | Meaning | Fix |
|------|---------|-----|
| `400` | Bad request | Review SIP headers / SDP |
| `401` | Unauthorized | Check digest credentials |
| `403` | Forbidden | IP not whitelisted — check ACL |
| `404` | Not found | Verify phone number mapping |
| `408` | Request timeout | Check firewall / reachability |
| `415` | Unsupported media | Enable G.711 A-Law; disable other codecs |
| `480` | Temporarily unavailable | Check PBX/SBC availability |
| `484` | Address incomplete | Use E.164 format for numbers |
| `486` | Busy | Destination busy — normal |
| `488` | Not acceptable | SDP/codec mismatch — enable G.711 A-Law only |

### 5xx — Server errors

| Code | Meaning | Fix |
|------|---------|-----|
| `500` | Server error | Retry |
| `502` | Bad gateway | Upstream routing issue — retry |
| `503` | Service unavailable | Check network / routing |
| `504` | Gateway timeout | Check firewall latency |

### Audio issues (no SIP error)

| Symptom | Cause | Fix |
|---------|-------|-----|
| No audio both ways | RTP blocked | Open UDP 10 000–40 000 |
| One-way audio | NAT / firewall | Check public IP in SDP |
| Audio drops mid-call | RTP idle timeout | Adjust firewall timeout |

---

## API error codes

| Code | HTTP | Meaning | Fix |
|------|------|---------|-----|
| `1000` | 404 | Resource not found | Verify trunk SID / phone number ID |
| `1001` | 400 | Mandatory parameter missing | Check all required fields |
| `1002` | 400 | Invalid parameter | Validate formats (E.164, IP, etc.) |
| `1007` | 400 | Malformed JSON | Fix JSON syntax |
| `1008` | 409 | Duplicate resource | Already configured — safe to ignore |
| `1011` | 415 | Wrong content type | Add `Content-Type: application/json` |

---

## Related

- [vSIP Overview](./overview) — Static SIP trunking setup
- [Flow API Configuration](./flow-api-configuration) — API-driven Voice AI setup
- [Manage ExoTrunks](../agentstream/manage-exotrunks) — SIP trunk management
