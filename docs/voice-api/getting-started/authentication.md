---
id: authentication
title: Authentication
description: Learn how to authenticate with the Exotel Voice API using HTTP Basic Auth credentials including API key, token, and account SID.
sidebar_label: Authentication
sidebar_position: 2
---

# Authentication

Exotel uses HTTP Basic Authentication for all Voice endpoints. The same API key and token work on `api.exotel.com` and `ccm-api.exotel.com`.

## Credentials

| Credential | Description |
|------------|-------------|
| **API Key** | Your username for HTTP Basic Auth |
| **API Token** | Your password for HTTP Basic Auth |
| **Account SID** | Your account identifier used in URL paths |

All credentials are available on your [Exotel Dashboard](https://my.exotel.com/apisettings/site#api-credentials) under **Settings > API Settings**.

## Base URLs

### Place a call, applets, older records

```
https://<subdomain>/v1/Accounts/<account_sid>/
```

| Region | Subdomain |
|--------|-----------|
| Singapore | `api.exotel.com` |
| Mumbai | `api.in.exotel.com` |

### Agent calls and richer reports

CCM is Contact Center Management. Use these hosts if you run contact center operations on `my*.exotel.com`.

```
https://<ccm_subdomain>/v2/accounts/<account_sid>/
https://<ccm_subdomain>/v3/accounts/<account_sid>/
```

| Region | CCM Subdomain |
|--------|---------------|
| Singapore | `ccm-api.exotel.com` |
| Mumbai | `ccm-api.in.exotel.com` |

Use `api.exotel.com` to place a call, connect to a flow, or read the older call record. Use `ccm-api.exotel.com` to [connect an agent](/docs/voice-v3/api-reference/make-a-call) or to fetch the [CCM call record](/docs/voice-v3/api-reference/call-details).

## Making Authenticated Requests

Use HTTP Basic Auth. cURL `-u` sets the `Authorization` header.

```bash
# Place a call
curl -u '<api_key>:<api_token>' \
  https://api.exotel.com/v1/Accounts/<account_sid>/Calls.json

# Agent call or call details
curl -u '<api_key>:<api_token>' \
  https://ccm-api.exotel.com/v2/accounts/<account_sid>/calls
```

## Don't Have Credentials?

If you don't have an Exotel account yet, [create one here](https://my.exotel.com/auth/register).
