---
id: overview
title: Users
sidebar_label: Overview
slug: /users/overview
---

# Users API

The Users API enables management of users and their associated devices in Exotel's Contact Center Management (CCM) system. Users are agents who handle calls through the Exotel platform.

## Key Features

- **User Management** — Create, update, and delete contact center users
- **Device Management** — Manage user devices (phone, SIP) and availability
- **Role-Based Access** — Assign admin, supervisor, or user roles
- **SIP Support** — Configure SIP passwords for softphone integration
- **Bulk Operations** — List and filter users with pagination

## Base URL

| Data Center | Base URL |
|------------|----------|
| Singapore | `https://<api_key>:<api_token>@ccm-api.exotel.com/v2/accounts/<sid>/users` |
| Mumbai | `https://<api_key>:<api_token>@ccm-api.in.exotel.com/v2/accounts/<sid>/users` |

## Authentication

All requests require **HTTP Basic Authentication** using your API key and token from the Exotel Dashboard.

```
Content-Type: application/json
```

## User Roles

| Role | Description |
|------|-------------|
| `admin` | Full account access |
| `supervisor` | Team management capabilities |
| `user` | Standard agent role (default) |

## Device Types

| Type | Description |
|------|-------------|
| `tel` | Standard telephone (PSTN) |
| `sip` | SIP-based softphone |
