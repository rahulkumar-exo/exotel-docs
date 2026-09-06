---
id: status-codes
title: WhatsApp Status Codes
description: Reference guide for Exotel WhatsApp API delivery status codes and error codes returned via the status callback webhook.
sidebar_label: Status Codes
sidebar_position: 4
---

# WhatsApp Status Codes

Delivery status codes returned in the `exo_status_code` field of the [status callback webhook](#status-callback-payload).

## Delivery Statuses

| Code  | ExoDetailedStatus       | Description |
|-------|------------------------|-------------|
| 30001 | `EX_MESSAGE_SENT`      | Message sent to the recipient |
| 30002 | `EX_MESSAGE_DELIVERED` | Message delivered to the recipient's device |
| 30003 | `EX_MESSAGE_SEEN`      | Message read by the recipient |

## Error Statuses

| Code  | ExoDetailedStatus              | Description |
|-------|-------------------------------|-------------|
| 30004 | `EX_SYSTEM_ERROR`             | Failed — system issue (authentication, access token, permission, or service unavailability) |
| 30005 | `EX_NUMBER_ERROR`             | Failed — issue with the recipient phone number |
| 30006 | `EX_SETUP_ERROR`              | Failed — account or configuration setup error |
| 30007 | `EX_RATE_LIMIT_HIT`           | Failed — rate limit breached |
| 30008 | `EX_SPAM_RATE_LIMIT_HIT`      | Failed — spam rate limit breached |
| 30009 | `EX_TOO_MANY_REQUEST`         | Failed — too many requests in a short time span |
| 30010 | `EX_INVALID_REQUEST`          | Failed — request is invalid |
| 30011 | `EX_UNKNOWN_ERROR`            | Failed — unknown error |
| 30012 | `EX_INVALID_RECIPIENT`        | Failed — recipient is invalid |
| 30013 | `EX_INCAPABLE_RECIPIENT`      | Failed — recipient is unable to receive the message type |
| 30014 | `EX_RECIPIENT_BLOCKED`        | Failed — recipient is not in the allowed list |
| 30015 | `EX_UNSUPPORTED_MESSAGE`      | Failed — unsupported message type in the request |
| 30016 | `EX_MEDIA_DOWNLOAD_ERROR`     | Failed — WhatsApp could not download the sender's media |
| 30017 | `EX_MEDIA_UPLOAD_ERROR`       | Failed — unsupported media type in the request |
| 30018 | `EX_REENGAGEMENT_ERROR`       | Failed — 24-hour conversation window has expired |
| 30019 | `EX_INVALID_PARAM`            | Failed — invalid parameter in the request body |
| 30020 | `EX_MISSING_PARAM`            | Failed — mandatory parameter missing from the request body |
| 30021 | `EX_INVALID_PARAM_VALUE`      | Failed — invalid parameter value in the request body |
| 30022 | `EX_TEMPLATE_ERROR`           | Failed — template format character policy violated |
| 30023 | `EX_TEMPLATE_PARAM_ERROR`     | Failed — mismatch in template parameter count |
| 30024 | `EX_TEMPLATE_NOT_FOUND`       | Failed — template does not exist |
| 30025 | `EX_TEMPLATE_TEXT_TOO_LONG`   | Failed — translated text from template is too long |
| 30026 | `EX_INVALID_TEMPLATE_NAMESPACE` | Failed — invalid template namespace |
| 30027 | `EX_MESSAGE_PENDING_TOO_LONG` | Failed — message was pending for too long |
| 30028 | `EX_MESSAGE_EXPIRED`          | Failed — message expired |
| 30029 | `EX_MESSAGE_TOO_LONG`         | Failed — message body exceeds 4096 characters |
| 30030 | `EX_WEBHOOK_ERROR`            | Failed — webhook is not configured |
| 30031 | `EX_SECTION_COUNT_ERROR`      | Failed — invalid number of sections in interactive message |
| 30032 | `EX_ROWS_COUNT_ERROR`         | Failed — invalid number of rows in interactive message |
| 30033 | `EX_PRODUCT_COUNT_ERROR`      | Failed — invalid number of products |
| 30034 | `EX_CATALOGUE_NOT_FOUND`      | Failed — catalog ID not found |
| 30035 | `EX_CATALOGUE_NOT_LINKED`     | Failed — catalog ID not linked to the API number |
| 30036 | `EX_MISSING_PRODUCT`          | Failed — product missing in the catalog |
| 30037 | `EX_PRODUCT_NOT_FOUND`        | Failed — product(s) from the request not found in catalog |
| 30038 | `EX_PRODUCT_COMPLIANCE_ERROR` | Failed — listed products failed compliance |
| 30039 | `EX_INVALID_HEADER`           | Failed — invalid header structure |
| 30040 | `EX_MISSING_COMPLIANCE`       | Failed — compliance information missing |
| 30041 | `EX_CHAR_POLICY_VIOLATION`    | Failed — character policy violated |

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 202  | Message accepted for delivery |
| 400  | Malformed request body, or more than 100 messages in a single request |
| 401  | Authentication failed — credentials missing or invalid |
| 402  | Plan limit exceeded or usage limits reached |
| 403  | Valid credentials but access to the resource denied |
| 404  | Resource not found |
| 5xx  | Server error — retry the request |

## Status Callback Payload

When a message reaches a terminal state, Exotel sends a POST to your `status_callback` URL:

```json
{
  "whatsapp": {
    "messages": [
      {
        "callback_type": "dlr",
        "sid": "2FdiiEQUosckPhpZfuVwfjxiSlc16a4",
        "to": "919876543210",
        "exo_status_code": 30002,
        "exo_detailed_status": "EX_MESSAGE_DELIVERED",
        "description": "Message delivered",
        "timestamp": "2024-01-15T10:30:05.000+05:30",
        "custom_data": "Order12"
      }
    ]
  }
}
```

### Callback Fields

| Field                 | Type    | Description |
|-----------------------|---------|-------------|
| `callback_type`       | String  | Type of callback: `dlr` (delivery report) or `icm` (incoming message) |
| `sid`                 | String  | Unique identifier of the message |
| `to`                  | String  | Recipient phone number |
| `exo_status_code`     | Integer | Exotel status code (see tables above) |
| `exo_detailed_status` | String  | Detailed status string corresponding to the code |
| `description`         | String  | Human-readable description of the status |
| `timestamp`           | String  | ISO 8601 timestamp of when the event occurred |
| `custom_data`         | String  | Custom data passed in the original API request (if any) |

:::note
`status_callback` can be set per-message in the API request, or configured as a default during onboarding. If both are set, the per-message URL takes precedence. A callback can only be delivered to one URL at a time.
:::
