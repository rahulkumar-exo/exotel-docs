---
id: overview
title: ExoPhones
sidebar_label: Overview
slug: /exophones/overview
---

# ExoPhones API

ExoPhones are virtual phone numbers provided by Exotel that enable your business to make and receive calls and SMS. The ExoPhones API allows you to manage these virtual numbers programmatically.

## Key Features

- **Browse Available Numbers** — Search for available phone numbers by country, type, and region
- **Purchase Numbers** — Programmatically acquire new ExoPhones
- **Assign to Flows** — Route incoming calls and SMS to specific IVR flows
- **Manage Numbers** — List, view details, and release ExoPhones

## Base URL

| Data Center | Subdomain |
|------------|-----------|
| Singapore | `@api.exotel.com` |
| Mumbai | `@api.in.exotel.com` |

```
https://<api_key>:<api_token>@<subdomain>/v2_beta/Accounts/<account_sid>/
```

## Authentication

All requests require **HTTP Basic Authentication** using your API key and token from the Exotel Dashboard.

## Number Types

| Type | Description |
|------|-------------|
| `Landline` | Standard landline numbers |
| `Mobile` | Mobile phone numbers |
| `TollFree` | Toll-free numbers |

## Number Capabilities

Each ExoPhone has specific capabilities:

| Capability | Description |
|-----------|-------------|
| `voice` | Can make and receive voice calls |
| `sms` | Can send and receive SMS |
