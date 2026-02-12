---
id: overview
title: Lead Assist (ExoBridge - Settings)
sidebar_label: Overview
slug: /lead-assist-settings/overview
---

# ExoBridge Lead Assist - Settings

Manage configuration settings for your ExoBridge (Lead Assist) account, including webhook endpoints, PIN settings, and regional configurations.

## Endpoints

### Update Settings

```
PUT https://leadassist.exotel.in/v1/tenants/<tenant_id>/settings
```

Updates settings parameters for an active ExoBridge account.

### Get Settings

```
GET https://leadassist.exotel.in/v1/tenants/<tenant_id>/settings
```

Retrieves all settings for your ExoBridge account.

## Common Settings (GreenVN & GreenPin)

| Parameter | Description |
|-----------|-------------|
| `country` | Country configuration |
| `intl_num_sup` | International number support |
| `max_deallocation_time` | Maximum allocation duration |
| `timezone` | Account timezone |
| `deletion_time` | Auto-deletion time |
| `tag_enabled` | Enable tagging |
| `aparty_tag` / `bparty_tag` | Party-specific tags |
| `sms_config` | SMS configuration |
| `sticky_agent_enabled` | Sticky agent routing |
| `lcr_enabled` | Least cost routing |
| `default_region` | Default telecom region |

## GreenVN-Specific Settings

| Parameter | Description |
|-----------|-------------|
| `greencall_complete_event_endpoint` | Call completion webhook |
| `failed_verification_event_endpoint` | Failed verification webhook |
| `verified_caller_event_endpoint` | Verified caller webhook |
| `deallocation_callback_event_endpoint` | Deallocation webhook |
| `default_flow_id` | Default IVR flow |

## GreenPin-Specific Settings

| Parameter | Description |
|-----------|-------------|
| `greenpin_call_complete_event_endpoint` | Call completion webhook |
| `aparty_pin_length` / `bparty_pin_length` | PIN lengths |
| `aparty_pin_enabled` / `bparty_pin_enabled` | Enable/disable PINs per party |
| `common_pin_length` / `common_pin_enabled` | Shared PIN settings |
