---
id: overview
title: Campaigns - Contacts
description: Overview of the Exotel Campaign Contacts API for bulk contact management in call and SMS campaigns. Covers authentication, rate limits, and base URLs.
sidebar_label: Overview
slug: /campaigns-contacts/overview
---

# Campaign Contacts API

The Campaign Contacts API enables bulk contact management for campaign execution. Create, update, retrieve, and delete contacts used in your call and SMS campaigns.

## Base URL

| Data Center | Subdomain |
|------------|-----------|
| Singapore | `@api.exotel.com` |
| Mumbai | `@api.in.exotel.com` |

```
https://<api_key>:<api_token>@<subdomain>/v2/accounts/<account_sid>/contacts
```

## Authentication

HTTP Basic Authentication using your API key and token.

## Limits

- Maximum **5,000 contacts** per single API request
- Pagination: default 20 records, max 20 per page

## Contact Fields

| Field | Description |
|-------|-------------|
| `number` | Phone number in E.164 format (mandatory) |
| `first_name` | Contact's first name |
| `last_name` | Contact's last name |
| `company_name` | Company name |
| `email` | Email address |
| `tag` | Category/classification |
| `custom` | JSON key-value pairs for custom fields |
