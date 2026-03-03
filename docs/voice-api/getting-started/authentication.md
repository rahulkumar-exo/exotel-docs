---
id: authentication
title: Authentication
description: Learn how to authenticate with the Exotel Voice API using HTTP Basic Auth credentials including API key, token, and account SID.
sidebar_label: Authentication
sidebar_position: 2
---

# Authentication

Exotel uses **HTTP Basic Authentication** for all Voice API endpoints. The same credentials work for both Voice v1 and Voice v2 (CCM) APIs.

## Credentials

| Credential | Description |
|------------|-------------|
| **API Key** | Your username for HTTP Basic Auth |
| **API Token** | Your password for HTTP Basic Auth |
| **Account SID** | Your account identifier used in URL paths |

All credentials are available on your [Exotel Dashboard](https://my.exotel.com/apisettings/site#api-credentials) under **Settings > API Settings**.

## Base URLs

### Voice v1 (Standard)

```
https://<api_key>:<api_token>@<subdomain>/v1/Accounts/<account_sid>/
```

| Region | Subdomain |
|--------|-----------|
| Singapore | `api.exotel.com` |
| Mumbai | `api.in.exotel.com` |

### Voice v2 (CCM)

```
https://<api_key>:<api_token>@<ccm_subdomain>/v2/accounts/<account_sid>/
```

| Region | CCM Subdomain |
|--------|---------------|
| Singapore | `ccm-api.exotel.com` |
| Mumbai | `ccm-api.in.exotel.com` |

## Making Authenticated Requests

### Using URL credentials

```bash
# Voice v1
curl https://your_api_key:your_api_token@api.exotel.com/v1/Accounts/your_sid/Calls.json

# Voice v2 (CCM)
curl https://your_api_key:your_api_token@ccm-api.exotel.com/v2/accounts/your_sid/calls
```

### Using Authorization header

```bash
# Base64 encode "api_key:api_token"
curl -H 'Authorization: Basic <base64_encoded_credentials>' \
  https://ccm-api.exotel.com/v2/accounts/your_sid/calls
```

## Don't Have Credentials?

If you don't have an Exotel account yet, [create one here](https://my.exotel.com/auth/register).
