---
id: status-codes
title: SMS Status Codes
description: Complete reference of Exotel SMS API detailed status codes and HTTP error codes for SMS delivery tracking and troubleshooting.
sidebar_label: Status Codes
sidebar_position: 4
---

# SMS Status Codes

Complete reference for SMS delivery status codes returned by the Exotel SMS API in the `DetailedStatusCode` and `DetailedStatus` fields.

:::note
Status codes in the range 23084–24000 are reserved and may be expanded for future use.
:::

## Intermediate Statuses

These statuses indicate the SMS is still in progress and may change.

| DetailedStatusCode | Status | DetailedStatus | Description |
|---|---|---|---|
| 21010 | `queued` | `PENDING_TO_OPERATOR` | SMS is queued and being processed by Exotel |
| 21015 | `sending` | `SENDING_TO_OPERATOR` | SMS has been processed and is en-route to the operator |
| 21020 | `submitted` | `PENDING_ON_OPERATOR` | SMS submitted to the operator, pending delivery. In India, promotional SMS may remain here if submitted outside 10AM–9PM |

## Success Statuses

| DetailedStatusCode | Status | DetailedStatus | Description |
|---|---|---|---|
| 20005 | `sent` | `DELIVERED_TO_HANDSET` | Delivered to the recipient's handset (confirmed) |
| 20006 | `sent` | `DELIVERED_TO_OPERATOR` | Delivered to operator. In some regions, handset confirmation is not available and this is the final status |

## Failure Statuses

### DND / Blacklist

| DetailedStatusCode | Status | DetailedStatus | Description |
|---|---|---|---|
| 23005 | `failed-dnd` | `FAILED_REJECTED_DND` | Rejected — recipient is on the DND (Do Not Disturb) registry |
| 23020 | `failed` | `FAILED_REJECTED_BLACKLIST` | Recipient is blacklisted — they have opted out (STOP/DND) |
| 23060 | `failed` | `FAILED_REJECTED` | Rejected by Exotel or the operator for unspecified reasons |

### Delivery Failures

| DetailedStatusCode | Status | DetailedStatus | Description |
|---|---|---|---|
| 23010 | `failed` | `FAILED_INVALID_DESTINATION_NUMBER` | Destination number is incorrect, not SMS-enabled, or is a PSTN landline |
| 23015 | `failed` | `FAILED_SPAM_DETECTED` | Blocked by carrier spam filters. Filters vary by carrier and can change without notice |
| 23030 | `failed` | `FAILED_UNAVAILABLE_ROUTE` | No route available from the carrier or fallback carriers |
| 23035 | `failed` | `FAILED_SUBSCRIBER_UNAVAILABLE` | Subscriber temporarily unavailable (out of coverage, switched off). A retry later may succeed |
| 23040 | `failed` | `FAILED_SUBSCRIBER_UNKNOWN` | Subscriber unknown to operators or no longer active |
| 23050 | `failed` | `FAILED_EXPIRED` | Message expired — submitted to operator and retried within the network expiration window with no success |
| 23072 | `failed` | `FAILED_INVALID_SENDER_ID` | Invalid or unregistered Sender ID. In India: Sender ID (header) not registered on operator's DLT platform |
| 24105 | `failed` | `FAILED_HANDSET_ERROR` | Not delivered due to handset failure |
| 24110 | `failed` | `FAILED_OPERATOR_ERROR` | Failed due to an issue at the operator end |
| 24120 | `failed` | `FAILED_SUBSCRIBER_ERROR` | Subscriber-side issues unrelated to the handset (e.g., insufficient mobile balance) |
| 24990 | `failed` | `FAILED_UNKNOWN_ERROR` | Failed for unknown reasons. Contact support if this appears frequently |

### System Errors

| DetailedStatusCode | Status | DetailedStatus | Description |
|---|---|---|---|
| 24010 | `failed` | `FAILED_SYSTEM_ERROR` | Failed while processing within Exotel's system |

### DLT Failures (India only)

Applicable only to SMS sent to Indian destination numbers via domestic lines.

| DetailedStatusCode | Status | DetailedStatus | Description |
|---|---|---|---|
| 23070 | `failed` | `FAILED_INVALID_MESSAGE` | Rejected as invalid by the operator. Causes: message exceeds 2000 characters, unidentified character, or missing DLT Entity ID |
| 23080 | `failed` | `SENDER_BLOCKED_BY_DLT` | Sender ID (header) blocked at DLT — mismatch, non-registration, or template not linked to sender |
| 23081 | `failed` | `ENTITY_BLOCKED_BY_DLT` | DLT Entity ID blocked or missing — not passed in API or configured on dashboard, or values mismatching |
| 23082 | `failed` | `TEMPLATE_BLOCKED_BY_DLT` | Template ID blocked at DLT — not set, content mismatch, or template not registered |
| 23083 | `failed` | `FAILED_DLT_SCRUBBING_ERROR` | Blocked at DLT even after registration — Sender ID blocked for spam, consent issues, or other DLT platform issues |
| 23084 | `failed` | `FAILED_DLT_CONSENT_ERROR` | DLT consent registration required to send to this recipient |
| 23181 | `failed` | `DLT_TEMPLATE_ID_INVALID` | Template is invalid. Some operators may report this as `23182: DLT_TEMPLATE_NOT_FOUND` |
| 23182 | `failed` | `DLT_TEMPLATE_NOT_FOUND` | Template was not found on the DLT portal |
| 23183 | `failed` | `DLT_TEMPLATE_ID_INACTIVE` | Template is inactive |
| 23184 | `failed` | `DLT_TEMPLATE_ID_BLACKLISTED` | Template blacklisted — may occur when users report the message |
| 23185 | `failed` | `DLT_TEMPLATE_DOES_NOT_MATCH` | Message body does not match the registered DLT template. Some operators may also report `23186` as this code |
| 23186 | `failed` | `DLT_LENGTH_EXCEEDED` | Message exceeds the 2000-character maximum |
| 23281 | `failed` | `DLT_ENTITY_NOT_FOUND` | Entity ID not found on the DLT portal. Some operators may report this as `23081: ENTITY_BLOCKED_BY_DLT` |

## HTTP API Error Codes

### POST errors (`/send`, `/bulksend`)

| HTTP Code | API Error Code | Scenario |
|-----------|---------------|----------|
| 403 | 40000 | Trial account attempting to send promotional SMS |
| 403 | 340030 | Trial account not KYC-compliant (number not whitelisted or wrong whitelist type) |
| 403 | 40001 | Insufficient account balance |
| 403 | 40002 | Account inactive |
| 403 | 40003 | Account not configured to send SMS to the recipient's country |
| 500 | 35000 | Internal server error — contact support |
| 500 | 40100 | Error processing the request |
| 400 | 40200 | Message body is empty or missing (single send) |
| 400 | 40201 | `Messages` is a mandatory field (bulk send) |
| 400 | 40202 | Message body is invalid |
| 400 | 40203 | All destination numbers are invalid |
| 400 | 40204 | `SmsType` not set correctly |
| 400 | 40205 | `From` field is empty |
| 400 | 40206 | `From` format does not match `SmsType` |
| 400 | 40207 | Array passed where string expected |
| 400 | 40208 | `Messages` must be an array |
| 400 | 40209 | `EncodingType` not set correctly |
| 400 | 40210 | `From` is a mandatory field |
| 400 | 40300 | Indian promotional account: no numeric sender ID found |
| 400 | 40301 | International account: no transactional sender ID found |
| 400 | 40400 | More than 100 messages in a dynamic bulk request |
| 400 | 40406 | More than 100 numbers in a static bulk request |
| 429 | 40402 | Too many POST requests |
| 429 | 40404 | Trial account SMS limit exceeded (max 10) |
| 503 | 40405 | Throttle limit exceeded |
| 405 | 40502 | POST to unrecognized SMS endpoint |

### GET errors (`/SMS/Messages/{SmsSid}`)

| HTTP Code | API Error Code | Scenario |
|-----------|---------------|----------|
| 200 | — | SID not found — returns `"No matching results"` |
| 429 | 40403 | Too many GET requests |
| 400 | 40501 | Invalid parameters in GET request |

### Common errors (all methods)

| HTTP Code | API Error Code | Scenario |
|-----------|---------------|----------|
| 403 | 40002 | Account inactive |
| 400 | 40500 | Invalid parameters (e.g., call to `/v1/Accounts/<sid>/Sms` without a valid action) |
| 400 | — | Unsupported API version |
| 400 | — | `/Accounts/` missing from URL |
| 403 | 34009 | Account SID missing from URL or action forbidden on resource |
| 401 | — | Auth key or token missing |
| 401 | 34010 | Invalid auth key or token |
| 400 | 34001 | Non-alphanumeric auth key or token |

## Status Flow

```
queued (21010) → sending (21015) → submitted (21020) → DELIVERED_TO_HANDSET (20005)
                                                      → DELIVERED_TO_OPERATOR (20006)
                                                      → FAILED_* (any failure)
```

:::tip
- If the SMS body contains special characters (like `-`, `&`, `%`), URL-encode the text before sending.
- If `EncodingType` is not set, Exotel auto-detects whether the message is `plain` or `unicode`.
:::
