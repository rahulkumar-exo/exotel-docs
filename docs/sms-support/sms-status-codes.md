---
id: sms-status-codes
title: SMS Status Codes
description: "Complete reference of Exotel SMS delivery status codes, error codes, and troubleshooting steps for failed message delivery."
sidebar_label: Status Codes
sidebar_position: 16
---

# SMS Status Codes

This reference documents all SMS delivery statuses, detailed status codes, and error codes returned by the Exotel platform. Use these codes to diagnose delivery issues and automate error handling.

## High-Level Statuses

Every SMS has a top-level `Status` field that indicates its current state:

| Status | Description |
|--------|-------------|
| `queued` | Message accepted by Exotel and queued for processing |
| `sending` | Message is being transmitted to the telecom operator |
| `submitted` | Message submitted to the carrier network |
| `sent` | Message sent by the carrier (awaiting handset confirmation) |
| `delivered` | Message successfully delivered to the recipient's handset |
| `failed` | Message delivery failed (see DetailedStatus for reason) |
| `expired` | Carrier could not deliver the message within the validity period |
| `undelivered` | Message could not be delivered (final state) |

### Status Flow

```
queued → sending → submitted → sent → delivered
                                    → failed
                                    → expired
                                    → undelivered
```

## Detailed Status Codes

The `DetailedStatus` and `DetailedStatusCode` fields provide granular information about the message outcome.

### Success Codes (2xxxx)

| Code | DetailedStatus | Description |
|------|----------------|-------------|
| 20000 | `DELIVERED_TO_HANDSET` | Message delivered to the recipient's phone |
| 20001 | `DELIVERED_TO_OPERATOR` | Message delivered to the operator (handset confirmation pending) |
| 20002 | `SUBMITTED_TO_CARRIER` | Message submitted to the carrier successfully |

### DLT Failure Codes (30001-30009)

| Code | DetailedStatus | Description | Resolution |
|------|----------------|-------------|------------|
| 30001 | `FAILED_DLT_TEMPLATE` | Message body does not match any approved DLT template | Ensure message exactly matches the template; only `{#var#}` values should change |
| 30002 | `FAILED_DLT_ENTITY` | DLT entity ID is invalid or not registered | Verify your entity ID in the DLT portal; allow 5-7 days for cross-portal sync |
| 30003 | `FAILED_INVALID_SENDER` | Sender ID (header) is not registered or not approved | Register the sender ID on the DLT portal and map it in Exotel |
| 30004 | `FAILED_DND` | Recipient is on the National DND registry | Use transactional SMS type for essential communications |
| 30005 | `FAILED_DLT_SCRUBBING` | Message failed DLT scrubbing validation | Check template ID, entity ID, and sender ID combination |
| 30006 | `FAILED_DLT_CONSENT` | Consent not registered for this recipient | Register consent on the DLT portal for promotional messages |
| 30007 | `FAILED_DLT_PREFERENCE` | Recipient has set category preferences blocking this message | Respect recipient's category preferences |

### Number and Routing Failures (30010-30019)

| Code | DetailedStatus | Description | Resolution |
|------|----------------|-------------|------------|
| 30010 | `FAILED_INVALID_NUMBER` | Phone number is invalid or not a mobile number | Verify the recipient's phone number format |
| 30011 | `FAILED_UNREACHABLE` | Recipient's phone is switched off or out of coverage | Retry after some time |
| 30012 | `FAILED_NETWORK_ERROR` | Temporary network issue with the carrier | Retry the message after a few minutes |
| 30013 | `FAILED_OPERATOR_REJECTED` | Carrier rejected the message | Contact Exotel support for specific operator rejection reason |
| 30014 | `FAILED_SPAM_DETECTED` | Message flagged as spam by the operator | Review message content; avoid spam-like language |

### Expiry and Timeout Codes (30020-30029)

| Code | DetailedStatus | Description | Resolution |
|------|----------------|-------------|------------|
| 30020 | `EXPIRED` | Message validity period expired before delivery | Recipient may be unreachable; resend if the message is still relevant |
| 30021 | `EXPIRED_HANDSET_OFF` | Recipient's phone was off during the validity period | Resend when the recipient is likely available |
| 30022 | `EXPIRED_MEMORY_FULL` | Recipient's phone memory (SMS inbox) is full | Cannot be resolved on your end; recipient needs to clear their inbox |

### Account and System Errors (30030-30049)

| Code | DetailedStatus | Description | Resolution |
|------|----------------|-------------|------------|
| 30030 | `FAILED_INSUFFICIENT_BALANCE` | Account does not have enough SMS credits | Recharge your Exotel account |
| 30031 | `FAILED_ACCOUNT_SUSPENDED` | Your Exotel account is suspended | Contact Exotel support to resolve account issues |
| 30032 | `FAILED_RATE_LIMITED` | API rate limit exceeded | Reduce request rate; stay within 200 requests/minute |
| 30033 | `FAILED_SYSTEM_ERROR` | Internal Exotel system error | Retry the message; contact support if it persists |

### Content Errors (30050-30059)

| Code | DetailedStatus | Description | Resolution |
|------|----------------|-------------|------------|
| 30050 | `FAILED_ENCODING_ERROR` | Message encoding mismatch | Set `EncodingType=unicode` for non-Latin scripts |
| 30051 | `FAILED_MESSAGE_TOO_LONG` | Message exceeds maximum allowed length | Shorten the message (max 10 concatenated segments) |
| 30052 | `FAILED_EMPTY_BODY` | Message body is empty | Provide a message body |

### Unknown and Other Codes (30099)

| Code | DetailedStatus | Description | Resolution |
|------|----------------|-------------|------------|
| 30099 | `FAILED_UNKNOWN` | Unknown failure reason | Contact Exotel support with the SmsSid for investigation |

## Interpreting Status Codes in Callbacks

When you receive a delivery callback, the status code helps determine the appropriate action:

```javascript
function handleDeliveryCallback(payload) {
  const { SmsSid, DetailedStatusCode, DetailedStatus } = payload;

  if (DetailedStatusCode >= 20000 && DetailedStatusCode < 30000) {
    // Success - message delivered
    markAsDelivered(SmsSid);
  } else if (DetailedStatusCode >= 30001 && DetailedStatusCode <= 30007) {
    // DLT failure - configuration issue
    logDltError(SmsSid, DetailedStatus);
    alertAdmin('DLT configuration error', DetailedStatus);
  } else if (DetailedStatusCode >= 30010 && DetailedStatusCode <= 30014) {
    // Delivery failure - may be retryable
    if (DetailedStatusCode === 30011 || DetailedStatusCode === 30012) {
      scheduleRetry(SmsSid);
    } else {
      markAsFailed(SmsSid, DetailedStatus);
    }
  } else if (DetailedStatusCode >= 30020 && DetailedStatusCode <= 30029) {
    // Expired - consider resending
    markAsExpired(SmsSid);
  } else if (DetailedStatusCode >= 30030 && DetailedStatusCode <= 30049) {
    // Account/system issue - needs attention
    alertAdmin('Account or system error', DetailedStatus);
  } else {
    // Unknown - log and investigate
    logUnknownStatus(SmsSid, DetailedStatusCode, DetailedStatus);
  }
}
```

## Retryable vs. Non-Retryable Failures

| Category | Retryable | Codes | Action |
|----------|-----------|-------|--------|
| DLT failures | No | 30001-30007 | Fix DLT configuration, then resend |
| Invalid number | No | 30010 | Remove from contact list |
| Unreachable / Network | Yes | 30011, 30012 | Retry after 15-30 minutes |
| Operator rejected | Maybe | 30013 | Investigate; contact support |
| Spam detected | No | 30014 | Revise message content |
| Expired | Yes | 30020-30022 | Resend if still relevant |
| Insufficient balance | No | 30030 | Recharge, then resend |
| Rate limited | Yes | 30032 | Wait, then retry with backoff |
| System error | Yes | 30033 | Retry after a few minutes |

:::tip
Implement an automatic retry mechanism for retryable failures. Use exponential backoff (e.g., 1 minute, 5 minutes, 15 minutes) to avoid overwhelming the system.
:::

## Monitoring and Alerting

Set up alerts for the following conditions:

| Condition | Threshold | Action |
|-----------|-----------|--------|
| DLT failures spike | > 5% of sends | Check DLT configuration |
| Delivery rate drops | < 90% | Investigate carrier issues |
| Insufficient balance | Any occurrence | Recharge immediately |
| System errors | > 1% of sends | Contact Exotel support |
| Unknown failures | Any occurrence | Log and investigate |

## Next Steps

- [SMS API Errors](/docs/sms-support/sms-api-errors) -- HTTP-level API error codes
- [SMS Delivery Reports](/docs/sms-support/sms-delivery-reports) -- Configure delivery tracking
- [SMS Webhooks](/docs/sms-support/sms-webhooks) -- Receive status callbacks
- [SMS API Reference](/docs/sms-api/overview) -- API documentation
