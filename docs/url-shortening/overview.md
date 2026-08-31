---
id: overview
title: URL Shortening
description: Overview of the Exotel URL Shortening API for creating trackable short links with click tracking, custom domains, and DLT support.
sidebar_label: Overview
slug: /url-shortening/overview
---

# URL Shortening API

The Exotel URL Shortening API converts long URLs into trackable short links, ideal for SMS campaigns and link analytics.

## Key Features

- **Short Links** — Convert long URLs to compact `exo.tl` links
- **Click Tracking** — Monitor total clicks and last viewed timestamps
- **Custom Domains** — Use your own domain instead of the default `exo.tl`
- **Expiration Control** — Set link expiry from 60 seconds to 365 days
- **DLT Compliance** — Support for DLT-registered URL shortening headers
- **Callback Webhooks** — Get notified when links are clicked

## Base URL

| Data Center | Subdomain |
|------------|-----------|
| Singapore | `@api.exotel.com` |
| Mumbai | `@api.in.exotel.com` |

```
https://<subdomain>/v2/accounts/<account_sid>/links
```

## Authentication

All requests require **HTTP Basic Authentication** using your API key and token from the Exotel Dashboard.
