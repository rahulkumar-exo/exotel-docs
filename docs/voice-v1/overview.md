---
id: overview
title: Voice v1 (Legacy)
sidebar_label: Overview
slug: /voice-v1/overview
---

# Voice v1 API (Legacy)

:::caution Legacy API
Voice v1 APIs are legacy and will not be enhanced further. Please use the [Voice API (v2)](/docs/voice-api/getting-started/overview) for new integrations.
:::

Voice v1 APIs work without any user (call centre agent) context — they don't need a user to be added to the Exotel dashboard.

## Base URL

```
https://<api_key>:<api_token>@<subdomain>/v1/Accounts/<account_sid>/
```

| Data Center | Subdomain |
|------------|-----------|
| Singapore | `@api.exotel.com` |
| Mumbai | `@api.in.exotel.com` |

## Authentication

HTTP Basic Authentication using your API key and token from the Exotel Dashboard.

## Rate Limits

Voice APIs are limited to **200 calls per minute**. Exceeding this returns HTTP `429`.
