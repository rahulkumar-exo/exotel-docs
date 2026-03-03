---
id: overview
title: Lead Assist (ExoBridge - GreenPin)
description: "Exotel Lead Assist (GreenPin) — privacy-protected communication with PIN verification and virtual numbers."
sidebar_label: Overview
slug: /lead-assist/overview
---

# Lead Assist (GreenPin) API

Lead Assist (formerly GreenPin) enables secure, privacy-protected communication between two parties using virtual numbers and PINs. It's commonly used for delivery verification, on-demand services, and marketplace communications.

## Key Features

- **Privacy Masking** — Connect parties without revealing their actual phone numbers
- **PIN Verification** — Generate PINs mapped to virtual numbers for secure verification
- **Dynamic Allocation** — Automatically manage virtual number pools
- **Flexible Duration** — Allocations can last from 5 minutes to 170 days

## Base URL

```
https://leadassist.exotel.in/v1/tenants/<tenant_id>/greenpin
```

## Authentication

Lead Assist uses a separate authentication from the standard Exotel API:
- **Account SID** — Your Exotel account SID
- **ExoBridge Token** — Separate token for Lead Assist APIs

:::info
Lead Assist is an account-level feature that must be enabled by your account manager or by contacting hello@exotel.com. The API credentials are different from your default Exotel API credentials.
:::

## How It Works

1. **Create Allocation** — Generate a PIN and map it to users via a virtual number
2. **Share PIN** — Provide the PIN to the relevant party for verification
3. **Verify** — The party calls the virtual number and enters the PIN
4. **Connect** — On successful verification, parties are connected
5. **Release** — Delete the allocation when no longer needed
