---
id: quickstart
title: SIP Trunking quickstart
description: Make your first outbound and inbound call with Exotel Dynamic SIP Trunking.
sidebar_label: Quickstart
slug: /sip-trunking/quickstart
sidebar_position: 2
---

# SIP Trunking quickstart

Get your first **SIP Trunking** calls working using **Dynamic SIP Trunking** APIs.

- Make outbound calls from your SIP system to PSTN
- Receive inbound calls from PSTN to your SIP system

## Prerequisites

- Exotel account with KYC completed
- API Key, API Token, Account SID
- At least one Exophone (DID)
- SIP system (PBX / SBC / contact centre) with public IP or digest credentials, TCP or TLS
- Firewall ready — see [Network & firewall](./network-firewall)

```bash
export EXOTEL_API_KEY="your_api_key"
export EXOTEL_API_TOKEN="your_api_token"
export EXOTEL_ACCOUNT_SID="your_account_sid"
# India: api.in.exotel.com · Singapore: api.exotel.com
export EXOTEL_SUBDOMAIN="api.in.exotel.com"
```

## Step 1 — Create SIP trunk

```bash
curl -s -u "$EXOTEL_API_KEY:$EXOTEL_API_TOKEN" -X POST \
  "https://$EXOTEL_SUBDOMAIN/v2/accounts/$EXOTEL_ACCOUNT_SID/trunks" \
  -H "Content-Type: application/json" \
  -d '{
    "trunk_name": "my_trunk",
    "nso_code": "ANY-ANY",
    "domain_name": "'"$EXOTEL_ACCOUNT_SID"'.pstn.exotel.com"
  }'
```

Save `trunk_sid`.

## Step 2 — Map phone number

```bash
curl -s -u "$EXOTEL_API_KEY:$EXOTEL_API_TOKEN" -X POST \
  "https://$EXOTEL_SUBDOMAIN/v2/accounts/$EXOTEL_ACCOUNT_SID/trunks/<trunk_sid>/phone-numbers" \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+919876543210",
    "mode": "pstn"
  }'
```

Default mode is `pstn`. Save the numeric `id` from the response.

## Step 3a — Whitelist IP (outbound)

Required when your system has a static egress IP.

```bash
curl -s -u "$EXOTEL_API_KEY:$EXOTEL_API_TOKEN" -X POST \
  "https://$EXOTEL_SUBDOMAIN/v2/accounts/$EXOTEL_ACCOUNT_SID/trunks/<trunk_sid>/whitelisted-ips" \
  -H "Content-Type: application/json" \
  -d '{ "ip": "<your_public_ip>", "mask": 32 }'
```

## Step 3b — Digest credentials (optional)

Use for cloud platforms with dynamic IPs.

```bash
curl -s -u "$EXOTEL_API_KEY:$EXOTEL_API_TOKEN" -X POST \
  "https://$EXOTEL_SUBDOMAIN/v2/accounts/$EXOTEL_ACCOUNT_SID/trunks/<trunk_sid>/credentials" \
  -H "Content-Type: application/json" \
  -d '{
    "user_name": "SIP_USER",
    "password": "SIP_PASS",
    "friendly_name": "voice_ai_platform"
  }'
```

## Step 4 — Destination URI (inbound)

```bash
# IP (must be whitelisted if using IP auth)
curl -s -u "$EXOTEL_API_KEY:$EXOTEL_API_TOKEN" -X POST \
  "https://$EXOTEL_SUBDOMAIN/v2/accounts/$EXOTEL_ACCOUNT_SID/trunks/<trunk_sid>/destination-uris" \
  -H "Content-Type: application/json" \
  -d '{
    "destinations": [
      { "destination": "<your_public_ip>:5061;transport=tls" }
    ]
  }'
```

Or FQDN (no IP whitelist required for destination):

```bash
curl -s -u "$EXOTEL_API_KEY:$EXOTEL_API_TOKEN" -X POST \
  "https://$EXOTEL_SUBDOMAIN/v2/accounts/$EXOTEL_ACCOUNT_SID/trunks/<trunk_sid>/destination-uris" \
  -H "Content-Type: application/json" \
  -d '{
    "destinations": [
      { "destination": "sip.yourcompany.com:5061;transport=tls" }
    ]
  }'
```

## Step 5 — Flow with Connect applet (inbound)

1. App Bazaar → create a flow  
2. Add **Connect** applet  
3. Dial Whom: `sip:<trunk_sid>`  
4. Map your Exophone to this flow  

Path: `PSTN → Exotel DID → Flow (Connect) → SIP trunk → Destination URI → your SIP`

Details: [Connect Applet for inbound SIP](./connect-applet-inbound)

## Step 6 — Configure your SIP system

| Setting | Value |
|---------|-------|
| SIP Domain | `<account_sid>.pstn.exotel.com` |
| Port | `443` (TLS) or `5070` (TCP) |
| Transport | TLS (recommended) or TCP |
| Authentication | IP ACL and/or digest credentials |

Open RTP **UDP 10000–40000**.

## Step 7 — Test

| Direction | Test |
|-----------|------|
| Outbound | Dial any PSTN number from your SIP system |
| Inbound | Call your Exophone from a mobile |

## Mode clarification

| Flow type | Phone number mode |
|-----------|-------------------|
| Connect applet (`sip:<trunk_sid>`) | `pstn` |
| Voicebot / other App Bazaar applets | `flow` |

Destination URI is required in all cases.

## Next

- [Dynamic SIP Trunking API](./dynamic-sip-trunking) — full endpoint reference  
- [Network & firewall](./network-firewall)  
- [Errors & troubleshooting](./errors-troubleshooting)  
