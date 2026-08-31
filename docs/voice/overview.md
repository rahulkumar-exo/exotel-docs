---
id: overview
title: Programmable Voice
description: Make and receive phone calls with the Exotel Voice API.
sidebar_label: Overview
slug: /voice
---

# Programmable Voice

Make and receive phone calls from your application.

If you have not placed a call yet, use the [quickstart](/docs/voice-v1/quickstart). It connects two numbers in about five minutes.

## Common tasks

| I want to | Start here |
|-----------|------------|
| Connect two phone numbers | [Connect Two Numbers](/docs/voice-v1/api-reference/connect-two-numbers) |
| Connect an agent to a customer | [Connect Agent to Customer](/docs/voice-v3/api-reference/make-a-call) |
| Connect a number to an IVR flow | [Connect Number to Call Flow](/docs/voice-v1/api-reference/connect-to-flow) |
| Handle a call that comes into my ExoPhone | [Program Incoming Call](/docs/voice-v1/api-reference/incoming-call) |
| Build an IVR menu | [IVR Menu Applet](/docs/voice-v1/applets/ivr-menu) |
| Look up a call after it ends | [Call Details](/docs/voice-v1/api-reference/call-details) |
| Download a recording | [Voice Log Download](/docs/voice-v3/api-reference/voice-log-download) |

## How a call works

You send a POST request. Exotel rings the first number. After that person answers, Exotel rings the second number. Both sides talk through your ExoPhone, so the customer sees your business number, not a personal one.

For inbound calls, attach a call flow to the ExoPhone. Exotel follows that flow when someone dials in.

## Which URL to call

Use `api.exotel.com` to connect two numbers, or to connect a number to a flow.

```
POST /v1/Accounts/{account_sid}/Calls/connect
```

Use CCM APIs to connect a number to an agent who is already in your dashboard. The agent needs a device that is on.

```
POST /v3/accounts/{account_sid}/calls
```

CCM is Contact Center Management. CCM hosts start with `ccm-api`.

Pick the host for your account region:

| Job | Singapore | Mumbai |
|-----|-----------|--------|
| Two numbers, or a number to a flow | `api.exotel.com` | `api.in.exotel.com` |
| A number to an agent (CCM) | `ccm-api.exotel.com` | `ccm-api.in.exotel.com` |

To read a CCM call after it ends (legs, digits, recordings):

```
GET /v3/accounts/{account_sid}/calls/{call_sid}
```

Each API page lists the host and path for that request.

## API reference

| Task | Method | Path |
|------|--------|------|
| [Connect Two Numbers](/docs/voice-v1/api-reference/connect-two-numbers) | POST | `/v1/Accounts/{account_sid}/Calls/connect` |
| [Connect Agent to Customer](/docs/voice-v3/api-reference/make-a-call) | POST | `/v3/accounts/{account_sid}/calls` |
| [Connect Number to Call Flow](/docs/voice-v1/api-reference/connect-to-flow) | POST | `/v1/Accounts/{account_sid}/Calls/connect` |
| [Program Incoming Call](/docs/voice-v1/api-reference/incoming-call) | — | Call flow on the ExoPhone |
| [Call Details](/docs/voice-v1/api-reference/call-details) | GET | `/v1/Accounts/{account_sid}/Calls/{call_sid}` |
| [Call Details (CCM)](/docs/voice-v3/api-reference/call-details) | GET | `/v3/accounts/{account_sid}/calls/{call_sid}` |
| [Call legs](/docs/voice-v3/api-reference/call-legs) | GET | `/v3/accounts/{account_sid}/calls/{call_sid}/legs` |
| [Voice logs](/docs/voice-v3/api-reference/voice-log-download) | GET | `/v3/accounts/{account_sid}/calls/{call_sid}/voice-logs` |
| [Number metadata](/docs/voice-v1/api-reference/number-metadata) | GET | `/v1/Accounts/{account_sid}/Numbers/{number}` |
| [Account balance](/docs/voice-v1/api-reference/balance) | GET | `/v1/Accounts/{account_sid}/Balance.json` |
| [Status callback](/docs/voice-v1/api-reference/status-callback) | — | Webhook on your server |

## Applets

Applets are the blocks in a call flow. You use them for greetings, menus, transfers, voicemail, and hangup. See the [Applets](/docs/voice-v1/applets/greeting) list.

Auth is HTTP Basic. Use the API key and token from the [dashboard](https://my.exotel.com) under **Settings → API Settings**. See [Authentication](/docs/voice-api/getting-started/authentication).

Voice APIs allow **200 calls per minute**. A higher rate returns HTTP `429`.
