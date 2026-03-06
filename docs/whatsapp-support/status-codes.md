---
id: status-codes
title: WhatsApp Status Codes
description: "Complete reference of WhatsApp delivery statuses, error codes, and troubleshooting steps for message failures on Exotel."
sidebar_label: Status Codes
sidebar_position: 17
---

# WhatsApp Status Codes

This reference documents all WhatsApp message statuses and error codes returned by the Exotel platform. Use these codes to track message delivery, diagnose failures, and implement automated error handling.

## Message Delivery Statuses

| Status | Description | Finality |
|--------|-------------|----------|
| `accepted` | Message accepted by Exotel for processing | Intermediate |
| `queued` | Message queued for delivery to WhatsApp | Intermediate |
| `sent` | Message sent to WhatsApp servers | Intermediate |
| `delivered` | Message delivered to the recipient's device | Final (positive) |
| `read` | Recipient opened and viewed the message | Final (positive) |
| `failed` | Message delivery failed | Final (negative) |

### Status Flow

```
accepted → queued → sent → delivered → read
                       ↘ failed
```

:::note
The `read` status is only sent when the recipient has read receipts enabled. If read receipts are turned off, the last status you receive is `delivered`.
:::

## Error Code Categories

| Range | Category | Description |
|-------|----------|-------------|
| 0-99 | Authorization | Authentication and permission errors |
| 100-199 | Invalid Request | Malformed or incorrect request parameters |
| 400-499 | Rate Limiting | Throughput and rate limit errors |
| 1000-1099 | Account Issues | Account configuration or billing errors |
| 2000-2099 | Template Errors | Template-related failures |
| 130xxx | WhatsApp Cloud API | Errors from Meta's Cloud API |
| 131xxx | WhatsApp Messaging | Messaging-specific errors from Meta |

## Authorization Errors (0-99)

| Code | Title | Description | Resolution |
|------|-------|-------------|------------|
| 0 | Auth Error | Authentication credentials are invalid | Verify your API key and token |
| 1 | API Key Missing | No API key provided in the request | Include API key in request authentication |
| 2 | Account Suspended | Your Exotel account is suspended | Contact Exotel support |

## Invalid Request Errors (100-199)

| Code | Title | Description | Resolution |
|------|-------|-------------|------------|
| 100 | Invalid Parameter | One or more request parameters are invalid | Check all parameter values and formats |
| 101 | Missing Parameter | A required parameter is missing | Include all required fields in your request |
| 102 | Invalid Phone Format | Phone number is not in E.164 format | Use format: `+919876543210` |
| 103 | Invalid Content Type | Request content type is not supported | Use `Content-Type: application/json` |
| 104 | Invalid Message Type | Unsupported message type specified | Use a valid message type (text, template, etc.) |
| 105 | Invalid Media URL | Media URL is not accessible or invalid | Ensure URL is HTTPS and publicly accessible |

## Rate Limiting Errors (400-499)

| Code | Title | Description | Resolution |
|------|-------|-------------|------------|
| 400 | Rate Limit | API rate limit exceeded | Reduce request frequency; implement backoff |
| 401 | Throughput Limit | Message throughput limit exceeded | Contact account manager for higher throughput |
| 470 | Messaging Limit | Reached business messaging limit for the day | Wait for the 24-hour window to roll over |

## Account Errors (1000-1099)

| Code | Title | Description | Resolution |
|------|-------|-------------|------------|
| 1000 | Insufficient Balance | Account balance too low to send messages | Recharge your Exotel account |
| 1001 | WhatsApp Not Enabled | WhatsApp is not enabled on your account | Contact Exotel to enable WhatsApp |
| 1002 | Number Not Registered | Phone number not registered for WhatsApp Business | Register the number in the Exotel dashboard |
| 1003 | WABA Not Connected | WhatsApp Business Account not connected | Complete WABA setup in the dashboard |

## Template Errors (2000-2099)

| Code | Title | Description | Resolution |
|------|-------|-------------|------------|
| 2000 | Template Not Found | Template name does not exist | Verify template name (case-sensitive, lowercase) |
| 2001 | Template Not Approved | Template is not yet approved by Meta | Wait for approval or use a different template |
| 2002 | Template Paused | Template is paused due to quality issues | Improve quality; see [Quality Rating](/docs/whatsapp-support/quality-rating) |
| 2003 | Template Disabled | Template permanently disabled | Create a new template |
| 2004 | Parameter Mismatch | Number of parameters does not match template | Provide the correct number of parameters |
| 2005 | Invalid Language | Template language code is incorrect | Use the correct language code (e.g., `en`, `hi`) |
| 2006 | Invalid Category | Template category mismatch | Verify the template category |

## WhatsApp Cloud API Errors (130xxx)

These errors originate from Meta's WhatsApp Cloud API:

| Code | Title | Description | Resolution |
|------|-------|-------------|------------|
| 130429 | Rate Limit Hit | Too many requests to WhatsApp API | Implement exponential backoff |
| 130472 | Experiment Rate Limit | Exceeded experiment rate limit | Wait and retry |
| 130497 | Scheduling Error | Message scheduling failed | Retry the request |

## WhatsApp Messaging Errors (131xxx)

| Code | Title | Description | Resolution |
|------|-------|-------------|------------|
| 131000 | Generic Error | Unknown error from WhatsApp | Retry; contact support if persistent |
| 131005 | Permission Denied | No permission to send this message type | Check WABA permissions |
| 131008 | Required Parameter Missing | Missing parameter in the message | Check all required fields |
| 131009 | Invalid Parameter | A parameter value is not valid | Validate parameter values |
| 131016 | Service Unavailable | WhatsApp service temporarily unavailable | Retry after a few minutes |
| 131021 | Recipient Not on WhatsApp | The recipient number is not on WhatsApp | Verify the recipient has WhatsApp installed |
| 131026 | Message Undeliverable | Cannot deliver message to this number | Check if the number is valid and active |
| 131042 | Business Eligibility | Business is not eligible for this message type | Review Meta business policies |
| 131045 | Incorrect Certificate | SSL certificate issue | Verify your webhook HTTPS configuration |
| 131047 | Re-engagement Message | Session expired (24+ hours since last reply) | Use a template message instead |
| 131048 | Spam Rate Limit | Sent too many messages flagged as spam | Reduce volume; improve content quality |
| 131051 | Unsupported Message Type | Message type not supported | Use a supported message type |
| 131052 | Media Download Error | Could not download the media from your URL | Verify media URL accessibility |
| 131053 | Media Upload Error | Error uploading media to WhatsApp | Re-upload or use a different media file |

## Handling Errors Programmatically

```javascript
function handleWhatsAppError(error) {
  const { code, title, detail } = error;

  // Authorization errors - fix credentials
  if (code < 100) {
    logCritical('Auth error', error);
    return { retry: false, action: 'fix_credentials' };
  }

  // Invalid request - fix parameters
  if (code >= 100 && code < 200) {
    logError('Invalid request', error);
    return { retry: false, action: 'fix_parameters' };
  }

  // Rate limits - retry with backoff
  if (code >= 400 && code < 500) {
    logWarning('Rate limited', error);
    return { retry: true, delay: 60000 }; // Wait 1 minute
  }

  // Account issues - non-retryable
  if (code >= 1000 && code < 1100) {
    logCritical('Account issue', error);
    return { retry: false, action: 'check_account' };
  }

  // Template errors - non-retryable
  if (code >= 2000 && code < 2100) {
    logError('Template error', error);
    return { retry: false, action: 'fix_template' };
  }

  // WhatsApp API errors - some retryable
  if (code === 131016 || code === 130429) {
    return { retry: true, delay: 30000 }; // Retry after 30 seconds
  }

  // Session expired - use template
  if (code === 131047) {
    return { retry: false, action: 'send_template' };
  }

  // Default - log and investigate
  logError('Unknown error', error);
  return { retry: false, action: 'investigate' };
}
```

## Retryable vs. Non-Retryable Errors

| Category | Retryable | Action |
|----------|-----------|--------|
| Auth errors (0-99) | No | Fix credentials |
| Invalid request (100-199) | No | Fix parameters |
| Rate limits (400-499) | Yes | Exponential backoff |
| Account issues (1000-1099) | No | Fix account configuration |
| Template errors (2000-2099) | No | Fix or recreate template |
| Service unavailable (131016) | Yes | Retry after 30 seconds |
| Rate limited (130429) | Yes | Retry after 60 seconds |
| Session expired (131047) | No | Use template message |
| Not on WhatsApp (131021) | No | Verify recipient |
| Spam rate limit (131048) | Yes | Wait, improve quality |

:::tip
Implement a retry mechanism with exponential backoff for retryable errors. Start with a 30-second delay, then double it for each subsequent retry, up to a maximum of 5 minutes.
:::

## Monitoring and Alerting

| Metric | Alert Threshold | Action |
|--------|----------------|--------|
| Failed message rate | > 5% | Investigate error codes |
| Auth errors | Any occurrence | Check credential rotation |
| Template errors | Any occurrence | Review template configuration |
| Rate limit hits | > 10 per hour | Optimize sending rate |
| Session expired errors | > 20% of sends | Review session management logic |

## Next Steps

- [WhatsApp Webhooks](/docs/whatsapp-support/webhooks) -- Receive status callbacks
- [Quality Rating](/docs/whatsapp-support/quality-rating) -- Monitor quality
- [Template Messages](/docs/whatsapp-support/template-messages) -- Template usage
- [WhatsApp API Reference](/docs/whatsapp-api/overview) -- API documentation
