---
id: webhooks
title: Campaign Webhooks
sidebar_label: Webhooks
sidebar_position: 4
---

# Campaign Webhooks

Receive real-time notifications about call and campaign status changes.

## Webhook Types

| Webhook                     | Fires When | Configured Via |
|-----------------------------|------------|----------------|
| **Call Status Callback**    | Each call attempt completes | `call_status_callback` |
| **Call Schedule Callback**  | All retries for a number are exhausted | `call_schedule_callback` |
| **Campaign Status Callback**| Campaign finishes | `status_callback` |

---

## Call Status Callback

Fires on **every individual call attempt** (including retries).

### Payload

```json
{
  "campaign_sid": "camp_abc123",
  "call_sid": "call_def456",
  "date_created": "2024-01-15T09:05:00+05:30",
  "date_updated": "2024-01-15T09:05:47+05:30",
  "number": "+919876543210",
  "status": "completed"
}
```

### Fields

| Field          | Description |
|----------------|-------------|
| `campaign_sid` | Campaign identifier |
| `call_sid`     | Unique call identifier |
| `number`       | Called phone number |
| `status`       | `completed`, `failed`, `busy`, `no-answer` |
| `date_created` | Call creation timestamp |
| `date_updated` | Last status update timestamp |

---

## Call Schedule Callback

Fires after **all retries for a specific number are exhausted** — whether the call ultimately succeeded or failed.

### Payload

```json
{
  "campaign_sid": "camp_abc123",
  "to": "+919876543210",
  "from": "0XXXXXX4890",
  "call_sids": ["call_def456", "call_ghi789", "call_jkl012"],
  "status": "failed",
  "date_created": "2024-01-15T09:05:00+05:30",
  "date_updated": "2024-01-15T09:35:00+05:30"
}
```

### Fields

| Field          | Description |
|----------------|-------------|
| `campaign_sid` | Campaign identifier |
| `to`           | Called phone number |
| `from`         | ExoPhone used |
| `call_sids`    | Array of all call attempt SIDs for this number |
| `status`       | Final status after all retries |

---

## Campaign Status Callback

Fires **once when the entire campaign completes** (all numbers processed).

### Payload

```json
{
  "campaign_sid": "camp_abc123",
  "status": "Completed",
  "date_created": "2024-01-14T16:30:00+05:30",
  "date_updated": "2024-01-15T18:00:00+05:30",
  "report_url": "https://s3.amazonaws.com/.../campaign_report.csv"
}
```

### Fields

| Field          | Description |
|----------------|-------------|
| `campaign_sid` | Campaign identifier |
| `status`       | Final campaign status: `Completed`, `Failed`, `Canceled` |
| `report_url`   | URL to download the full campaign report (CSV) |

---

## Best Practices

- Always respond with **HTTP 200** to webhook requests to prevent retries
- Process webhooks asynchronously — don't block the response
- Use `call_status_callback` for real-time monitoring dashboards
- Use `call_schedule_callback` to trigger follow-up actions (e.g., SMS to unreachable numbers)
- Use `status_callback` to get the final campaign report URL
