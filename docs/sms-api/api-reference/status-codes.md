---
id: status-codes
title: SMS Status Codes
sidebar_label: Status Codes
sidebar_position: 4
---

# SMS Status Codes

Complete reference for SMS delivery status codes returned by the Exotel SMS API.

## Intermediate Statuses

These statuses indicate the SMS is still being processed:

| Code  | Status           | Description |
|-------|------------------|-------------|
| 21010 | `queued`         | SMS is queued for sending |
| 21015 | `sending`        | SMS is being sent to the operator |
| 21020 | `submitted`      | SMS has been submitted to the operator |

## Success Statuses

| Code  | Status                    | Description |
|-------|---------------------------|-------------|
| 20005 | `DELIVERED_TO_HANDSET`    | SMS delivered to the recipient's phone |
| 20006 | `DELIVERED_TO_OPERATOR`   | SMS delivered to the operator (handset confirmation pending) |

## Failure Statuses

| Code  | Status                    | Description |
|-------|---------------------------|-------------|
| 23005 | `FAILED_DND`              | Recipient is on Do Not Disturb (DND) registry |
| 23010 | `FAILED_INVALID_NUMBER`   | Phone number is invalid or does not exist |
| 23015 | `FAILED_SPAM`             | Message flagged as spam by the operator |
| 23020 | `FAILED_BLACKLISTED`      | Recipient number is blacklisted |
| 23072 | `FAILED_INVALID_SENDER`   | Sender ID is not approved or registered |
| 23080 | `FAILED_DLT_SCRUBBING`   | Message blocked by DLT scrubbing |
| 23081 | `FAILED_DLT_ENTITY`      | DLT entity ID is invalid or not registered |
| 23082 | `FAILED_DLT_TEMPLATE`    | DLT template ID mismatch or not approved |
| 23083 | `FAILED_DLT_CONSENT`     | DLT consent not found for recipient |

## HTTP Error Codes

| Code | Description |
|------|-------------|
| 400  | Bad request — missing or invalid parameters |
| 401  | Authentication failed — invalid API key or token |
| 403  | Forbidden — account suspended or insufficient permissions |
| 429  | Rate limit exceeded — max 200 requests/minute |
| 500  | Internal server error — retry the request |

## Status Flow

```
queued → sending → submitted → DELIVERED_TO_OPERATOR → DELIVERED_TO_HANDSET
                             → FAILED_* (any failure status)
```

:::note
DLT-related failures (23080–23083) are specific to India and occur when DLT registration, template, or consent requirements are not met. Ensure your DLT entity and templates are properly registered before sending.
:::
