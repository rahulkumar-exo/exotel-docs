---
id: connect-two-numbers
title: Connect Two Numbers
sidebar_label: Connect Two Numbers
---

# Connect Two Numbers

Connect a `From` number to a `To` number. The platform calls the `From` number first, then connects to the `To` number once answered.

## HTTP Request

```
POST /v1/Accounts/<account_sid>/Calls/connect
```

## Request Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `From` | Yes | The phone number to call first |
| `To` | Yes | The phone number to connect to |
| `CallerId` | Yes | Your ExoPhone |
| `CallType` | No | `trans` (transactional) or `promo` (promotional) |
| `TimeLimit` | No | Max call duration in seconds |
| `TimeOut` | No | Ring timeout in seconds |
| `StatusCallback` | No | Webhook URL for call status updates |
| `Record` | No | `true` to record the call |
| `RecordingChannels` | No | `single` or `dual` |
| `CustomField` | No | Custom metadata |

## Response

Returns a Call object with `CallSid`, status, and call details.
