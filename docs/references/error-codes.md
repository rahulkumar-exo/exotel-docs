---
id: error-codes
title: Error Code Dictionary
sidebar_label: Error Codes
sidebar_position: 1
---

# Error Code Dictionary

Centralized reference for all HTTP and application-level error codes across Exotel APIs.

## HTTP Status Codes

These standard HTTP codes apply to **all** Exotel API endpoints.

| Code | Status | Description | How to Fix |
|------|--------|-------------|------------|
| `200` | OK | Request succeeded | — |
| `202` | Accepted | Request accepted for processing (async) | Check status via callback or polling |
| `400` | Bad Request | Missing or invalid parameters | Check required fields and parameter formats |
| `401` | Unauthorized | Invalid API key or token | Verify your API key and token in the [dashboard](https://my.exotel.com) |
| `402` | Payment Required | Plan limit exceeded or insufficient balance | Top up your account or upgrade your plan |
| `403` | Forbidden | Account suspended or insufficient permissions | Contact support to check account status |
| `404` | Not Found | Resource does not exist | Verify the resource SID/ID in the URL |
| `409` | Conflict | Resource state conflict | Check the resource's current state before retrying |
| `429` | Too Many Requests | Rate limit exceeded | Implement exponential backoff; max 200 req/min for most endpoints |
| `500` | Internal Server Error | Server-side failure | Retry with exponential backoff |
| `502` | Bad Gateway | Upstream service unavailable | Retry after a few seconds |
| `503` | Service Unavailable | Service temporarily down | Check [status.exotel.com](https://status.exotel.com) and retry later |

---

## Voice API Error Codes

### Call Status Values

| Status | Description |
|--------|-------------|
| `queued` | Call is waiting to be sent to the operator |
| `ringing` | Phone is ringing |
| `in-progress` | Call is active |
| `completed` | Call ended normally |
| `failed` | Call could not be completed |
| `busy` | Called party returned a busy signal |
| `no-answer` | Called party did not answer within the timeout |
| `canceled` | Call was canceled before being answered |

### Voice v2 (CCM) Error Codes

| HTTP Code | Error Code | Description | How to Fix |
|-----------|-----------|-------------|------------|
| `401` | `1010` | Authentication failed | Verify API key and token |
| `404` | `10731` | User (agent) not found | Add the agent as a co-worker in the dashboard |
| `409` | `1012` | User device unavailable (OFF) | Ask agent to turn on their device |
| `409` | `10705` | User device unverified | Agent must verify their device in the dashboard |
| `409` | `10706` | User device busy | Agent is on another call; wait and retry |
| `404` | `10716` | Virtual number not found | Check the ExoPhone SID or number format |
| `500` | `1100` | Internal server error | Retry the request |

---

## SMS Error Codes

### Delivery Status Codes

#### Intermediate Statuses

| Code | Status | Description |
|------|--------|-------------|
| `21010` | `queued` | SMS is queued for sending |
| `21015` | `sending` | SMS is being sent to the operator |
| `21020` | `submitted` | SMS has been submitted to the operator |

#### Success Statuses

| Code | Status | Description |
|------|--------|-------------|
| `20005` | `DELIVERED_TO_HANDSET` | SMS delivered to the recipient's phone |
| `20006` | `DELIVERED_TO_OPERATOR` | SMS delivered to the operator (handset confirmation pending) |

#### Failure Statuses

| Code | Status | Description | How to Fix |
|------|--------|-------------|------------|
| `23005` | `FAILED_DND` | Recipient is on Do Not Disturb registry | Use transactional route or remove DND |
| `23010` | `FAILED_INVALID_NUMBER` | Phone number is invalid | Verify the number format (E.164 recommended) |
| `23015` | `FAILED_SPAM` | Message flagged as spam | Review message content; avoid spam-like patterns |
| `23020` | `FAILED_BLACKLISTED` | Recipient number is blacklisted | Contact support to review blacklist |
| `23072` | `FAILED_INVALID_SENDER` | Sender ID not approved | Register your Sender ID in the dashboard |
| `23080` | `FAILED_DLT_SCRUBBING` | Blocked by DLT scrubbing | Ensure DLT registration is complete |
| `23081` | `FAILED_DLT_ENTITY` | DLT entity ID invalid | Register/verify your DLT entity ID |
| `23082` | `FAILED_DLT_TEMPLATE` | DLT template mismatch | Ensure template ID matches message content |
| `23083` | `FAILED_DLT_CONSENT` | DLT consent not found | Register consent for the recipient number |

### SMS Status Flow

```
queued → sending → submitted → DELIVERED_TO_OPERATOR → DELIVERED_TO_HANDSET
                             → FAILED_* (any failure status)
```

:::note
DLT-related failures (23080-23083) are specific to **India** and occur when DLT registration, template, or consent requirements are not met.
:::

---

## WhatsApp Error Codes

### Delivery Statuses

| Code | Status | Description |
|------|--------|-------------|
| `30001` | Sent | Message sent to WhatsApp servers |
| `30002` | Delivered | Message delivered to recipient's device |
| `30003` | Seen | Recipient opened/read the message |

### Error Statuses

| Code | Description | How to Fix |
|------|-------------|------------|
| `30004` | Rate limit exceeded | Reduce message frequency; implement backoff |
| `30005` | Unknown error | Retry the request |
| `30006` | Message expired (TTL exceeded) | Increase TTL or send again |
| `30007` | Message blocked by WhatsApp | Review message content for policy violations |
| `30008` | Invalid phone number | Verify the number is valid and on WhatsApp |
| `30009` | Media download failed | Check the media URL is accessible and valid |
| `30010` | Invalid template name | Verify template name matches approved template |
| `30011` | Template parameter mismatch | Ensure parameters match template placeholders |
| `30012` | Template not approved | Submit template for approval first |
| `30013` | Recipient not on WhatsApp | Fall back to SMS for this number |
| `30014` | Message too long | Reduce message length |
| `30020` | Account not registered for WhatsApp | Complete WhatsApp Business setup |
| `30030` | Business account restricted | Contact Meta/WhatsApp support |
| `30040` | Recipient blocked your number | Cannot message this recipient |
| `30041` | Spam detected | Review message content and sending patterns |

### WhatsApp Payment Statuses (India Only)

| Code | Status | Description |
|------|--------|-------------|
| `30050` | Payment Success | Payment completed by recipient |
| `30049` | Payment Pending | Payment initiated but not completed |

---

## Contact Center Error Codes

### Contact Upload Errors

| Error Code | Description | How to Fix |
|------------|-------------|------------|
| `INVALID_PHONE` | Phone number format is invalid | Use E.164 format |
| `DUPLICATE_ENTRY` | Contact already exists in the list | Remove duplicates from CSV |
| `MISSING_REQUIRED` | Required field is empty | Fill in all mandatory columns |
| `INVALID_FORMAT` | Field value format is wrong | Check data types (string, number, date) |
| `QUOTA_EXCEEDED` | Contact list limit reached | Delete old contacts or upgrade plan |
| `INVALID_EMAIL` | Email address format is invalid | Fix the email format |

---

## Rate Limits

| API | Rate Limit | Notes |
|-----|-----------|-------|
| SMS API | 200 requests/min | Per account |
| Voice v1 API | 200 requests/min | Per account |
| Voice v2 (CCM) API | 200 requests/min | Per account |
| WhatsApp API | Varies by tier | Based on WhatsApp Business API tier |
| ExoPhone Details | Throttled | Excessive requests return HTTP `429` |

:::tip Best Practices for Rate Limits
1. Implement **exponential backoff** when you receive HTTP `429`
2. Use **bulk endpoints** (Bulk SMS, Campaign APIs) for high-volume operations
3. Cache API responses where possible (e.g., ExoPhone details, number metadata)
4. Use **webhooks/callbacks** instead of polling for status updates
:::
