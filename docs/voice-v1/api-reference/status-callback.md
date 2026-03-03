---
id: status-callback
title: StatusCallback
description: Configure Exotel StatusCallback webhooks to receive real-time HTTP POST notifications with call details when a call completes.
sidebar_label: StatusCallback
---

# StatusCallback

StatusCallback is an asynchronous webhook mechanism that notifies your application when a call completes. Exotel sends an HTTP POST to your specified URL with call details.

## How It Works

1. When making a call via the API, pass a `StatusCallback` URL parameter
2. When the call reaches a terminal state, Exotel sends a POST request to that URL
3. Your server receives call details including status, duration, and recording URL

:::caution
StatusCallback delivery may be delayed or fail due to network issues, server problems, or webhook downtime. Implement fallback logic using the [Call Details API](/docs/voice-v1/api-reference/call-details) to ensure you capture all call data.
:::

## Default Parameters

These parameters are always included in the webhook POST:

| Parameter | Type | Description |
|-----------|------|-------------|
| `CallSid` | String | Unique alpha-numeric call identifier |
| `DateUpdated` | DateTime | Last status update timestamp (format: `YYYY-MM-DD HH:mm:ss`) |
| `Status` | String | Terminal call status: `completed`, `failed`, `busy`, or `no-answer` |
| `RecordingUrl` | String | Call recording URL (if recording was enabled) |

## Event-Specific Parameters

When you subscribe to specific events via `StatusCallbackEvents` (supports `terminal` and `answered`), these additional parameters are included:

| Parameter | Type | Description |
|-----------|------|-------------|
| `EventType` | String | The event type (e.g., `terminal`, `answered`) |
| `DateCreated` | DateTime | When the call was initiated |
| `To` | String | Recipient phone number |
| `From` | String | Calling phone number |
| `PhoneNumberSid` | String | ExoPhone identifier |
| `StartTime` | DateTime | When the call started |
| `EndTime` | DateTime | When the call ended |
| `ConversationDuration` | Integer | Seconds both parties were connected |
| `Direction` | String | `inbound`, `outbound-dial`, or `outbound-api` |
| `CustomField` | String | Custom data passed during the original API request |
| `Legs` | Array | Per-leg attempt details with `OnCallDuration` and `Status` |

## Leg Information

```json
{
  "Legs": [
    {
      "OnCallDuration": 41,
      "Status": "completed",
      "AnsweredBy": "NA"
    },
    {
      "OnCallDuration": 32,
      "Status": "completed",
      "AnsweredBy": "HUMAN"
    }
  ]
}
```

### AnsweredBy Values

| Value | Description |
|-------|-------------|
| `Human` | Answered by a person |
| `Machine` | Answered by voicemail/IVR |
| `NotSure` | Could not determine |
| `NA` | Not applicable (first leg) |

## Leg Status Values

Individual call legs can have the following statuses:

| Status | Description |
|--------|-------------|
| `completed` | Leg completed successfully |
| `busy` | Called party was busy |
| `failed` | Leg failed |
| `no-answer` | Called party did not answer |
| `canceled` | Leg was canceled |
| `null` | Leg was not attempted |

## Example Webhook Payload

```json
{
  "CallSid": "80bfbec2d78bbbf10fb851f4fa165211",
  "DateUpdated": "2024-01-15 14:30:45",
  "Status": "completed",
  "RecordingUrl": "https://s3-ap-southeast-1.amazonaws.com/...",
  "EventType": "terminal",
  "DateCreated": "2024-01-15 14:25:10",
  "To": "09123456789",
  "From": "09876543210",
  "PhoneNumberSid": "0XXXXXX4890",
  "StartTime": "2024-01-15 14:25:12",
  "EndTime": "2024-01-15 14:30:45",
  "ConversationDuration": 320,
  "Direction": "outbound-api",
  "CustomField": "order_12345",
  "Legs": [
    {
      "OnCallDuration": 335,
      "Status": "completed"
    },
    {
      "OnCallDuration": 320,
      "Status": "completed"
    }
  ]
}
```

## Usage Notes

- Additional StatusCallback fields (event-specific parameters) require both `From` and `To` parameters in the original call request
- `StatusCallbackEvents` does not apply when using `VoiceUrl` — use the [Passthru applet](/docs/voice-v1/applets/passthru) instead
- Your webhook endpoint should respond with HTTP `200` to acknowledge receipt
