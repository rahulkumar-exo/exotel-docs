---
id: overview
title: Campaigns - Lists
sidebar_label: Overview
slug: /campaign-lists/overview
---

# Campaign Lists API

The Campaign Lists API enables you to create and manage contact lists used in call and SMS campaigns. Lists serve as the foundation for targeting contacts in your campaigns.

## Key Features

- **Contact Management** — Add, remove, and manage contacts in lists
- **CSV Upload** — Bulk import contacts from CSV files
- **List Operations** — Create, update, delete, and search lists
- **Pagination** — Efficient retrieval of large contact lists

## Base URL

| Data Center | Subdomain |
|------------|-----------|
| Singapore | `@api.exotel.com` |
| Mumbai | `@api.in.exotel.com` |

```
https://<api_key>:<api_token>@<subdomain>/v2/accounts/<account_sid>/lists
```

## Authentication

All requests require **HTTP Basic Authentication** using your API key and token.

## List Limits

| Type | Max Contacts |
|------|-------------|
| Static | 1,00,000 (1 lakh) |
| Dynamic | 5,00,000 (5 lakh) |
| CSV File Size | 60 MB max |
| Contacts per API call | 5,000 max |

## CSV Format

When uploading contacts via CSV, use these columns:

| Column | Required | Description |
|--------|----------|-------------|
| `number` | Yes | Phone number in E.164 format |
| `first_name` | No | Contact's first name |
| `last_name` | No | Contact's last name |
| `company_name` | No | Company name |
| `email` | No | Email address |
| `tag` | No | Custom tag |
