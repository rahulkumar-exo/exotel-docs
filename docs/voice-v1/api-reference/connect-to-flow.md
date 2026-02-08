---
id: connect-to-flow
title: Connect to Call Flow
sidebar_label: Connect to Flow
---

# Connect to Call Flow

Call a number and route them to an applet/IVR flow after they answer.

## HTTP Request

```
POST /v1/Accounts/<account_sid>/Calls/connect
```

## Request Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `From` | Yes | The phone number to call |
| `CallerId` | Yes | Your ExoPhone |
| `Url` | Yes | The flow URL (applet/IVR) to connect to |
| `CallType` | No | `trans` or `promo` |
| `TimeLimit` | No | Max call duration in seconds |
| `TimeOut` | No | Ring timeout in seconds |
| `StatusCallback` | No | Webhook URL for status updates |

## Response

Returns a Call object with the `CallSid` and call status.
