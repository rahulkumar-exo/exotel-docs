---
id: overview
title: ExoBridge (Lead Assist) - GreenVN
sidebar_label: Overview
slug: /lead-assist-greenvn/overview
---

# ExoBridge Lead Assist - GreenVN

GreenVN (Green Virtual Number) enables privacy-protected communication by mapping parties to virtual numbers without requiring PINs. Unlike GreenPin, GreenVN provides direct call routing through virtual numbers.

## Base URL

```
https://leadassist.exotel.in/v1/tenants/<tenant_id>/greenvn
```

## Authentication

Uses Account SID and ExoBridge token (different from default API credentials).

:::info
Lead Assist must be enabled by your account manager or by contacting hello@exotel.com.
:::

## How It Works

1. **Create Allocation** — Map A-party and B-party numbers via a virtual number
2. **Parties Call VN** — When either party calls the virtual number, they're connected to the other
3. **Update** — Modify party numbers or VN as needed
4. **Delete** — Release the allocation when done
