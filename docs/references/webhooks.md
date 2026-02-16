---
id: webhooks
title: Webhooks & Callbacks
sidebar_label: Webhooks & Callbacks
sidebar_position: 2
---

# Webhooks & Callbacks

Exotel uses webhooks (HTTP callbacks) to notify your application about events in real-time. Instead of polling the API, you provide a URL and Exotel sends event data to it as an HTTP POST request.

## How Webhooks Work

```
1. You make an API call with a StatusCallback URL
2. The action happens (call completes, SMS delivered, etc.)
3. Exotel sends an HTTP POST to your URL with event data
4. Your server responds with HTTP 200 to acknowledge receipt
```

:::caution Important
- Your endpoint **must** respond with HTTP `200` within **15 seconds**
- If your server doesn't respond or returns a non-2XX status, Exotel will retry up to **2 times**
- Implement fallback logic using the respective Details API to ensure you don't miss events
:::

---

## Voice Call StatusCallback

Notifies your application when a call reaches a terminal state (completed, failed, busy, no-answer).

**Configured via:** `StatusCallback` parameter when making a call

### Default Payload

Sent for every call completion:

```json
{
  "CallSid": "80bfbec2d78bbbf10fb851f4fa165211",
  "DateUpdated": "2024-01-15 14:30:45",
  "Status": "completed",
  "RecordingUrl": "https://s3-ap-southeast-1.amazonaws.com/recordings/abc123.mp3"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `CallSid` | String | Unique call identifier |
| `DateUpdated` | DateTime | Last status update (`YYYY-MM-DD HH:mm:ss`) |
| `Status` | String | `completed`, `failed`, `busy`, or `no-answer` |
| `RecordingUrl` | String | Recording URL (if recording was enabled, otherwise `null`) |

### Extended Payload (Event-Specific)

When you subscribe to events via `StatusCallbackEvents` (supports `terminal` and `answered`), additional fields are included:

```json
{
  "CallSid": "80bfbec2d78bbbf10fb851f4fa165211",
  "EventType": "terminal",
  "DateCreated": "2024-01-15 14:25:10",
  "DateUpdated": "2024-01-15 14:30:45",
  "To": "09123456789",
  "From": "09876543210",
  "PhoneNumberSid": "0XXXXXX4890",
  "StartTime": "2024-01-15 14:25:12",
  "EndTime": "2024-01-15 14:30:45",
  "Status": "completed",
  "ConversationDuration": 320,
  "Direction": "outbound-api",
  "CustomField": "order_12345",
  "RecordingUrl": "https://s3-ap-southeast-1.amazonaws.com/recordings/abc123.mp3",
  "Legs": [
    {
      "OnCallDuration": 335,
      "Status": "completed",
      "AnsweredBy": "NA"
    },
    {
      "OnCallDuration": 320,
      "Status": "completed",
      "AnsweredBy": "HUMAN"
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `EventType` | String | `terminal` or `answered` |
| `DateCreated` | DateTime | When the call was initiated |
| `To` | String | Recipient phone number |
| `From` | String | Calling phone number |
| `PhoneNumberSid` | String | ExoPhone identifier |
| `StartTime` | DateTime | When the call started |
| `EndTime` | DateTime | When the call ended |
| `ConversationDuration` | Integer | Seconds both parties were connected |
| `Direction` | String | `inbound`, `outbound-dial`, or `outbound-api` |
| `CustomField` | String | Your custom metadata from the original request |
| `Legs` | Array | Per-leg details (see below) |

### Leg Information

Each leg in the `Legs` array contains:

| Field | Type | Description |
|-------|------|-------------|
| `OnCallDuration` | Integer | Duration in seconds |
| `Status` | String | `completed`, `busy`, `failed`, `no-answer`, `canceled`, `null` |
| `AnsweredBy` | String | `Human`, `Machine`, `NotSure`, or `NA` (first leg) |

:::note
Extended callback fields require both `From` and `To` parameters in the original call request. `StatusCallbackEvents` does not apply when using `VoiceUrl`.
:::

---

## SMS Delivery Callback

Notifies your application when an SMS delivery status changes.

**Configured via:** `StatusCallback` parameter when sending an SMS

### Payload

```json
{
  "SmsSid": "sms_abc123def456",
  "To": "+919876543210",
  "From": "EXOTEL",
  "Status": "DELIVERED_TO_HANDSET",
  "ExoStatusCode": 20005,
  "DateUpdated": "2024-01-15 10:35:22"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `SmsSid` | String | Unique SMS identifier |
| `To` | String | Recipient number |
| `From` | String | Sender ID or ExoPhone |
| `Status` | String | Delivery status (see [SMS Status Codes](/docs/sms-api/api-reference/status-codes)) |
| `ExoStatusCode` | Integer | Numeric status code |
| `DateUpdated` | DateTime | When the status changed |

---

## WhatsApp Status Callback

Notifies your application when a WhatsApp message status changes.

**Configured via:** `status_callback` parameter when sending a message

### Payload

```json
{
  "sid": "msg_sid_value",
  "from": "+919876500001",
  "to": "+919876543210",
  "status": "delivered",
  "exo_status_code": 30002,
  "timestamp": "2024-01-15T10:30:05Z"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `sid` | String | Message identifier |
| `from` | String | Sender number |
| `to` | String | Recipient number |
| `status` | String | `sent`, `delivered`, `seen`, or error status |
| `exo_status_code` | Integer | Status code (see [WhatsApp Status Codes](/docs/whatsapp-api/api-reference/status-codes)) |
| `timestamp` | String | ISO 8601 timestamp |

---

## Campaign Webhooks

Campaigns support three webhook types for different granularity levels.

### Call Status Callback

Fires on **every individual call attempt** (including retries).

**Configured via:** `call_status_callback` when creating a campaign

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

| Field | Type | Description |
|-------|------|-------------|
| `campaign_sid` | String | Campaign identifier |
| `call_sid` | String | Unique call identifier |
| `number` | String | Called phone number |
| `status` | String | `completed`, `failed`, `busy`, `no-answer` |

### Call Schedule Callback

Fires after **all retries for a specific number are exhausted**.

**Configured via:** `call_schedule_callback` when creating a campaign

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

| Field | Type | Description |
|-------|------|-------------|
| `campaign_sid` | String | Campaign identifier |
| `to` | String | Called phone number |
| `from` | String | ExoPhone used |
| `call_sids` | Array | All call attempt SIDs for this number |
| `status` | String | Final status after all retries |

### Campaign Status Callback

Fires **once when the entire campaign completes**.

**Configured via:** `status_callback` when creating a campaign

```json
{
  "campaign_sid": "camp_abc123",
  "status": "Completed",
  "date_created": "2024-01-14T16:30:00+05:30",
  "date_updated": "2024-01-15T18:00:00+05:30",
  "report_url": "https://s3.amazonaws.com/.../campaign_report.csv"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `campaign_sid` | String | Campaign identifier |
| `status` | String | `Completed`, `Failed`, or `Canceled` |
| `report_url` | String | URL to download the full campaign report (CSV) |

---

## Heartbeat Webhook

Monitors the health of your ExoPhones and sends notifications when issues are detected.

**Configured via:** Exotel Dashboard (Heartbeat settings)

### Payload

```json
{
  "timestamp": "2024-01-15T15:19:23Z",
  "status_type": "CRITICAL",
  "incoming_affected": ["exophone_sid_1"],
  "outgoing_affected": ["exophone_sid_2"],
  "data": {
    "exophone_sid_1": {
      "incoming_call": {
        "status": "major_outage",
        "last_check_time": "2024-01-15T15:19:00Z"
      }
    }
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | String | RFC 3339 timestamp |
| `status_type` | String | `OK`, `WARNING`, `CRITICAL`, or `PAYLOAD_TOO_LARGE` |
| `incoming_affected` | Array | ExoPhone SIDs with incoming call issues |
| `outgoing_affected` | Array | ExoPhone SIDs with outgoing call issues |
| `data` | Object | Detailed health information per ExoPhone |

---

## Best Practices

1. **Always respond with HTTP `200`** — Acknowledge receipt quickly, then process asynchronously
2. **Implement idempotency** — You may receive duplicate webhooks; use `CallSid`/`SmsSid` to deduplicate
3. **Use HTTPS endpoints** — Secure your callback URLs with TLS
4. **Validate the source** — Verify webhook requests originate from Exotel's IP ranges
5. **Set up fallback polling** — Use the Details API as a backup in case webhooks fail
6. **Log all payloads** — Store raw webhook data for debugging and audit trails
7. **Handle timeouts gracefully** — If processing takes >15 seconds, queue the work and respond immediately

:::tip Quick Reference
| Event | Webhook Parameter | Docs |
|-------|------------------|------|
| Call completes | `StatusCallback` | [Voice StatusCallback](/docs/voice-v1/api-reference/status-callback) |
| SMS delivered | `StatusCallback` | [Send SMS](/docs/sms-api/api-reference/send-sms) |
| WhatsApp status | `status_callback` | [WhatsApp Send Message](/docs/whatsapp-api/api-reference/send-message) |
| Campaign call | `call_status_callback` | [Campaign Webhooks](/docs/campaigns/api-reference/webhooks) |
| Campaign done | `status_callback` | [Campaign Webhooks](/docs/campaigns/api-reference/webhooks) |
| ExoPhone health | Dashboard config | [Heartbeat](/docs/heartbeat/webhook-format) |
:::
