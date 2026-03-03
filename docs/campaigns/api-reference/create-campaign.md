---
id: create-campaign
title: Create Campaign
description: Create outbound call campaigns using the Exotel API. Configure IVR flows, greeting messages, scheduling, retry logic, and caller ID settings.
sidebar_label: Create Campaign
sidebar_position: 1
---

# Create Campaign

Create a new outbound call campaign.

## Endpoint

```
POST https://<api_key>:<api_token><subdomain>/v2/accounts/<account_sid>/campaigns
```

## Request Parameters

| Parameter                 | Required  | Type    | Description |
|---------------------------|-----------|---------|-------------|
| `from`                    | Yes*      | String  | Comma-separated phone numbers (max 5,000). E.164 preferred. *Either `from` or `lists` required |
| `lists`                   | Yes*      | Array   | Up to 5 list SIDs (static) or 1 (dynamic). *Either `from` or `lists` required |
| `caller_id`               | Mandatory | String  | ExoPhone initiating the calls |
| `campaign_type`           | Optional  | String  | `static` (default) or `dynamic` |
| `flow_type`               | Optional  | String  | `ivr` or `greeting` |
| `url`                     | Optional  | String  | Flow URL: `http://my.exotel.com/{sid}/exoml/start_voice/{app_id}` |
| `read_via_text`           | Optional  | String  | Greeting text content. Supports `@@ColumnName` variables |
| `name`                    | Optional  | String  | Campaign name (3+ chars, auto-generated if omitted) |
| `type`                    | Optional  | String  | `trans` (transactional, default) |
| `call_duplicate_numbers`  | Optional  | Boolean | Call duplicate numbers (default: `false`) |
| `retries`                 | Optional  | Object  | Retry configuration (see below) |
| `schedule`                | Optional  | Object  | Scheduling configuration (see below) |
| `call_status_callback`    | Optional  | String  | Webhook URL for per-call status |
| `call_schedule_callback`  | Optional  | String  | Webhook URL after all retries complete |
| `status_callback`         | Optional  | String  | Webhook URL for campaign completion |
| `mode`                    | Optional  | String  | `auto` (default) or `custom` throttle mode |
| `throttle`                | Optional  | Integer | Calls/minute for custom mode (1 to account limit - 1) |
| `custom_field`            | Optional  | String  | Application metadata |
| `repeat_menu_attempts`    | Optional  | Integer | IVR menu repetitions (default: 0) |

### Retries Object

```json
{
  "number_of_retries": 2,
  "interval_mins": 10,
  "mechanism": "Linear",
  "on_status": ["busy", "no-answer", "failed"]
}
```

| Field               | Type    | Description |
|---------------------|---------|-------------|
| `number_of_retries` | Integer | 0–3 retry attempts |
| `interval_mins`     | Integer | Minutes between retries |
| `mechanism`         | String  | `Linear` or `Exponential` spacing |
| `on_status`         | Array   | Retry on: `busy`, `no-answer`, `failed` |

### Schedule Object

```json
{
  "send_at": "2024-02-01T09:00:00+05:30",
  "end_at": "2024-02-01T18:00:00+05:30"
}
```

| Field     | Type   | Description |
|-----------|--------|-------------|
| `send_at` | String | Start time (RFC 3339 format) |
| `end_at`  | String | End time (RFC 3339 format) |

## cURL Example

```bash
curl -X POST "https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<sid>/campaigns" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+919876543210,+919876543211,+919876543212",
    "caller_id": "0XXXXXX4890",
    "flow_type": "ivr",
    "url": "http://my.exotel.com/<sid>/exoml/start_voice/926",
    "name": "January Promo Campaign",
    "retries": {
      "number_of_retries": 2,
      "interval_mins": 15,
      "mechanism": "Linear",
      "on_status": ["busy", "no-answer"]
    },
    "schedule": {
      "send_at": "2024-01-15T09:00:00+05:30",
      "end_at": "2024-01-15T18:00:00+05:30"
    },
    "call_status_callback": "https://your-server.com/call-status",
    "status_callback": "https://your-server.com/campaign-status"
  }'
```

## Response

**HTTP 200**

```json
{
  "request_id": "req_abc123",
  "method": "POST",
  "http_code": 200,
  "response": [{
    "code": 200,
    "status": "success",
    "data": {
      "id": "camp_abc123",
      "account_sid": "your_sid",
      "name": "January Promo Campaign",
      "type": "trans",
      "caller_id": "0XXXXXX4890",
      "campaign_type": "static",
      "url": "http://my.exotel.com/<sid>/exoml/start_voice/926",
      "retries": {
        "number_of_retries": 2,
        "interval_mins": 15,
        "mechanism": "Linear",
        "on_status": ["busy", "no-answer"]
      },
      "schedule": {
        "send_at": "2024-01-15T09:00:00+05:30",
        "end_at": "2024-01-15T18:00:00+05:30"
      },
      "status": "Created",
      "call_duplicate_numbers": false,
      "date_created": "2024-01-14T16:30:00+05:30",
      "date_updated": "2024-01-14T16:30:00+05:30",
      "stats": {
        "created": 3,
        "completed": 0,
        "failed": 0,
        "pending": 3
      }
    }
  }]
}
```
