---
id: sms-api-errors
title: Common SMS API Errors
description: "Troubleshoot common Exotel SMS API errors -- HTTP status codes, error responses, authentication issues, and resolution steps."
sidebar_label: API Errors
sidebar_position: 17
---

# Common SMS API Errors

This guide covers the most common errors you may encounter when using the Exotel SMS API, including HTTP-level errors, authentication issues, and request validation failures. For delivery-level status codes, see [SMS Status Codes](/docs/sms-support/sms-status-codes).

## HTTP Error Codes

The Exotel SMS API returns standard HTTP status codes to indicate the result of your request:

| HTTP Code | Meaning | Description |
|-----------|---------|-------------|
| **200** | OK | Request succeeded (used for GET requests) |
| **202** | Accepted | Message accepted and queued for delivery |
| **400** | Bad Request | Invalid request parameters |
| **401** | Unauthorized | Authentication failed |
| **403** | Forbidden | Account does not have permission |
| **404** | Not Found | Resource not found |
| **405** | Method Not Allowed | Incorrect HTTP method used |
| **409** | Conflict | Duplicate request or resource conflict |
| **429** | Too Many Requests | Rate limit exceeded |
| **500** | Internal Server Error | Exotel server error |
| **502** | Bad Gateway | Temporary upstream error |
| **503** | Service Unavailable | Service temporarily down for maintenance |

## Authentication Errors (401)

### Invalid API Key or Token

**Error Response:**
```json
{
  "RestException": {
    "Status": 401,
    "Message": "Authentication failed. Invalid API Key or Token.",
    "Code": "UNAUTHORIZED"
  }
}
```

**Common Causes:**
- API key or token is incorrect
- API credentials have been regenerated
- URL format is wrong (credentials should be in the URL as basic auth)

**Resolution:**
1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Navigate to **Settings** > **API Settings** > **API Credentials**.
3. Copy the latest **API Key** and **API Token**.
4. Update your API call:

```bash
# Correct format
curl -X POST "https://api.exotel.com/v1/Accounts/<account_sid>/Sms/send" \
  -d "..."

# Alternative: Using -u flag
curl -X POST "https://api.exotel.com/v1/Accounts/<account_sid>/Sms/send" \
  -u "<api_key>:<api_token>" \
  -d "..."
```

### Invalid Account SID

**Error Response:**
```json
{
  "RestException": {
    "Status": 401,
    "Message": "Account SID is invalid or does not match credentials.",
    "Code": "INVALID_ACCOUNT_SID"
  }
}
```

**Resolution:**
- Verify your Account SID from the dashboard. It is not the same as the API key.
- Ensure the Account SID in the URL path matches your account.

## Bad Request Errors (400)

### Missing Required Parameters

**Error Response:**
```json
{
  "RestException": {
    "Status": 400,
    "Message": "Missing required parameter: To",
    "Code": "MISSING_PARAMETER"
  }
}
```

**Required parameters for Send SMS:**

| Parameter | Required | Description |
|-----------|----------|-------------|
| `From` | Yes | Approved sender ID |
| `To` | Yes | Recipient phone number |
| `Body` | Yes | Message content |
| `DltEntityId` | Yes | DLT entity registration ID |
| `DltTemplateId` | Yes | DLT template ID |

### Invalid Phone Number

**Error Response:**
```json
{
  "RestException": {
    "Status": 400,
    "Message": "Invalid 'To' number format. Expected E.164 format.",
    "Code": "INVALID_PARAMETER"
  }
}
```

**Resolution:**
- Use E.164 format: `+919876543210` (country code + number)
- Ensure the number is a valid Indian mobile number (10 digits after +91)
- Remove spaces, dashes, or other formatting characters

### Invalid DLT Entity ID

**Error Response:**
```json
{
  "RestException": {
    "Status": 400,
    "Message": "Invalid DltEntityId. Please provide a valid DLT Entity ID.",
    "Code": "INVALID_DLT_ENTITY"
  }
}
```

**Resolution:**
1. Check your DLT entity ID on your DLT portal.
2. Ensure the entity ID is entered without spaces or special characters.
3. Confirm the entity is approved and active on the DLT portal.
4. If recently registered, allow 5-7 days for cross-portal synchronization.

### Invalid DLT Template ID

**Error Response:**
```json
{
  "RestException": {
    "Status": 400,
    "Message": "Invalid DltTemplateId. Template not found or not approved.",
    "Code": "INVALID_DLT_TEMPLATE"
  }
}
```

**Resolution:**
1. Verify the template ID on your DLT portal.
2. Ensure the template status is **Approved** (not Pending or Rejected).
3. Confirm the template is linked to the sender ID you are using.
4. Allow 24-48 hours after approval for the template to propagate.

### Empty Message Body

**Error Response:**
```json
{
  "RestException": {
    "Status": 400,
    "Message": "Message body cannot be empty.",
    "Code": "EMPTY_BODY"
  }
}
```

**Resolution:**
- Provide a non-empty `Body` parameter.
- Ensure the body matches an approved DLT template.

### Encoding Mismatch

**Error Response:**
```json
{
  "RestException": {
    "Status": 400,
    "Message": "Message contains Unicode characters but EncodingType is set to 'plain'.",
    "Code": "ENCODING_MISMATCH"
  }
}
```

**Resolution:**
- Set `EncodingType=unicode` when your message contains non-Latin characters.
- See [Unicode SMS](/docs/sms-support/unicode-sms) for details.

## Rate Limit Errors (429)

**Error Response:**
```json
{
  "RestException": {
    "Status": 429,
    "Message": "Rate limit exceeded. Maximum 200 requests per minute.",
    "Code": "RATE_LIMIT_EXCEEDED"
  }
}
```

**Resolution:**
1. Reduce your API call frequency to stay within 200 requests/minute.
2. Use the [Bulk SMS API](/docs/sms-api/api-reference/bulk-sms) to send up to 100 messages per request.
3. Implement exponential backoff when you receive a 429 response.
4. Contact your account manager if you need a higher rate limit.

**Retry with exponential backoff:**

```javascript
async function sendWithRetry(payload, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await sendSms(payload);
      return response;
    } catch (error) {
      if (error.status === 429 && attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}
```

## Forbidden Errors (403)

### Account Suspended

**Error Response:**
```json
{
  "RestException": {
    "Status": 403,
    "Message": "Your account is suspended. Contact support.",
    "Code": "ACCOUNT_SUSPENDED"
  }
}
```

### Insufficient Balance

**Error Response:**
```json
{
  "RestException": {
    "Status": 403,
    "Message": "Insufficient account balance to send SMS.",
    "Code": "INSUFFICIENT_BALANCE"
  }
}
```

**Resolution:**
- Recharge your Exotel account from the dashboard.
- Set up auto-recharge to prevent balance depletion.

### SMS Not Enabled

**Error Response:**
```json
{
  "RestException": {
    "Status": 403,
    "Message": "SMS service is not enabled on your account.",
    "Code": "SERVICE_NOT_ENABLED"
  }
}
```

**Resolution:**
- Contact your account manager or support@exotel.com to enable SMS on your account.

## Server Errors (5xx)

### Internal Server Error (500)

**Resolution:**
- This indicates an issue on Exotel's side.
- Retry the request after a brief delay.
- If the error persists for more than 15 minutes, contact Exotel support.

### Service Unavailable (503)

**Resolution:**
- The service may be undergoing maintenance.
- Check the [Exotel Status Page](https://status.exotel.com) for ongoing incidents.
- Retry with exponential backoff.

:::warning
Never retry 400-level errors (except 429) without fixing the underlying issue. Repeatedly sending malformed requests may trigger additional rate limiting on your account.
:::

## Debugging API Requests

### Check Request Format

Verify your API request includes all required parameters and correct formatting:

```bash
# Correct example
curl -u '<api_key>:<api_token>' -v -X POST "https://api.exotel.com/v1/Accounts/account_sid/Sms/send" \
  -d "From=EXOTL" \
  -d "To=+919876543210" \
  -d "Body=Your OTP is 123456" \
  -d "DltEntityId=1234567890123" \
  -d "DltTemplateId=1107160000000012345"
```

Use the `-v` flag with curl to see the full request and response headers for debugging.

### Verify Using the Dashboard

1. Try sending the same message through the [Exotel Dashboard](https://my.exotel.com).
2. If it works in the dashboard but not via API, the issue is in your API integration.
3. Compare the parameters used by the dashboard with your API call.

### Check API Logs

1. Navigate to **Reports** > **SMS Logs** in the Exotel Dashboard.
2. Filter by date and phone number.
3. Check the status and error details for your messages.

## Error Handling Best Practices

1. **Always check HTTP status codes** -- Do not assume a 200/202 response; validate it.
2. **Parse error responses** -- Extract `Code` and `Message` fields for programmatic handling.
3. **Implement retry logic** -- For 429 and 5xx errors, retry with exponential backoff.
4. **Log all errors** -- Store error responses with timestamps for debugging.
5. **Set up monitoring** -- Alert on elevated error rates for any error code.
6. **Use the correct endpoint** -- Ensure you are using the correct regional endpoint for your account.

## Next Steps

- [SMS Status Codes](/docs/sms-support/sms-status-codes) -- Delivery-level status codes
- [SMS Delivery Reports](/docs/sms-support/sms-delivery-reports) -- Track message delivery
- [How to Send SMS](/docs/sms-support/how-to-send-sms) -- Sending guide
- [SMS API Reference](/docs/sms-api/overview) -- Full API documentation
