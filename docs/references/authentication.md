---
id: authentication
title: Authentication & Security
description: "Exotel API authentication guide. HTTP Basic Auth, API credentials, regional endpoints, and security best practices."
sidebar_label: Authentication
sidebar_position: 0
---

# Authentication & Security

Every request to the Exotel API must be authenticated. This guide covers how to obtain your credentials, authenticate requests, and follow security best practices to keep your integration safe.

---

## Getting Your Credentials

To interact with Exotel APIs, you need three values:

| Credential | Description |
|------------|-------------|
| **API Key** | Your unique API username |
| **API Token** | Your secret API password |
| **Account SID** | Your unique account identifier, used in all API paths |

### Where to Find Them

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Navigate to **Settings** in the left sidebar.
3. Click **API Settings**.
4. Your API Key, API Token, and Account SID are displayed on the [API Credentials](https://my.exotel.com/apisettings/site#api-credentials) page.

:::tip
Bookmark the [API Settings page](https://my.exotel.com/apisettings/site#api-credentials) for quick access. If you do not see the API Settings option, contact your account administrator to ensure your user role has the necessary permissions.
:::

---

## HTTP Basic Authentication

All Exotel APIs use **HTTP Basic Authentication** as defined in [RFC 7617](https://datatracker.ietf.org/doc/html/rfc7617). Your API Key acts as the username and your API Token acts as the password. The credentials are Base64-encoded and transmitted in the `Authorization` header with every request.

### Approach 1: Credentials in the URL

You can embed credentials directly in the request URL:

```
https://<api_key>:<api_token>@<subdomain>/v1/Accounts/<account_sid>/<resource>
```

For example:

```
https://myapikey:myapitoken@api.exotel.com/v1/Accounts/exotel/Calls.json
```

### Approach 2: Authorization Header

Alternatively, pass credentials via the `Authorization` header. The header value is the word `Basic` followed by a space and the Base64-encoded string `<api_key>:<api_token>`:

```
Authorization: Basic base64(<api_key>:<api_token>)
```

:::note
Both approaches are functionally identical. The Authorization header approach is generally preferred in production code because it avoids exposing credentials in URLs, which can appear in server logs and browser history.
:::

### Code Examples

#### cURL

```bash
# Approach 1: Credentials in URL
curl 'https://<api_key>:<api_token>@api.exotel.com/v1/Accounts/<account_sid>/Calls.json'

# Approach 2: Using the -u flag (cURL handles Basic Auth encoding automatically)
curl -u '<api_key>:<api_token>' \
  'https://api.exotel.com/v1/Accounts/<account_sid>/Calls.json'
```

#### Node.js (using fetch)

```javascript
const API_KEY = process.env.EXOTEL_API_KEY;
const API_TOKEN = process.env.EXOTEL_API_TOKEN;
const ACCOUNT_SID = process.env.EXOTEL_ACCOUNT_SID;
const SUBDOMAIN = "api.exotel.com";

const credentials = Buffer.from(`${API_KEY}:${API_TOKEN}`).toString("base64");

const response = await fetch(
  `https://${SUBDOMAIN}/v1/Accounts/${ACCOUNT_SID}/Calls.json`,
  {
    method: "GET",
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  }
);

const data = await response.json();
console.log(data);
```

#### Python

```python
import os
import requests

api_key = os.environ["EXOTEL_API_KEY"]
api_token = os.environ["EXOTEL_API_TOKEN"]
account_sid = os.environ["EXOTEL_ACCOUNT_SID"]
subdomain = "api.exotel.com"

url = f"https://{subdomain}/v1/Accounts/{account_sid}/Calls.json"

response = requests.get(url, auth=(api_key, api_token))
print(response.json())
```

---

## Regional Endpoints (Subdomains)

Exotel operates data centers in multiple regions. Use the subdomain that matches your account's region for optimal latency and data residency compliance.

| Region | Subdomain | Use When |
|--------|-----------|----------|
| Singapore | `api.exotel.com` | Default for most accounts |
| Mumbai | `api.in.exotel.com` | India-based accounts for lower latency |

:::warning
Using the wrong regional endpoint will result in authentication failures. If you are unsure which region your account belongs to, check the Exotel Dashboard or contact Exotel support.
:::

Your full base URL follows this pattern:

```
https://<subdomain>/v1/Accounts/<account_sid>/
```

For example, an India-based account would use:

```
https://api.in.exotel.com/v1/Accounts/your_sid/Calls.json
```

---

## Account SID

Your **Account SID** (Session Identifier) is the unique identifier for your Exotel account. It appears in every API endpoint path as a URL segment:

```
/v1/Accounts/{account_sid}/Calls.json
/v1/Accounts/{account_sid}/Sms/send.json
/v2/accounts/{account_sid}/calls
```

You can find your Account SID in the **Exotel Dashboard** under **Settings > API Settings**, displayed alongside your API Key and API Token.

:::note
The Account SID is not a secret, but it should still be treated as internal information. Avoid exposing it in client-side code or public repositories.
:::

---

## Security Best Practices

Protecting your API credentials is critical. A leaked API key and token can allow unauthorized parties to make calls, send messages, and access account data on your behalf.

### Never Hardcode Credentials

:::danger
Never hardcode your API Key or API Token directly in your source code. Hardcoded secrets are one of the most common causes of credential leaks.
:::

```javascript
// BAD - credentials are exposed in source code
const API_KEY = "f81f2a5027e1463d812c4d2b36ea2d7a";
const API_TOKEN = "9c3e8a1b4f6d2e0a7c5b3d9f1e8a2c4d";

// GOOD - credentials are loaded from environment variables
const API_KEY = process.env.EXOTEL_API_KEY;
const API_TOKEN = process.env.EXOTEL_API_TOKEN;
```

### Use Environment Variables

:::tip
Store credentials in environment variables or a secrets manager. This keeps them out of your codebase entirely.
:::

**Setting environment variables (Linux/macOS):**

```bash
export EXOTEL_API_KEY="your_api_key"
export EXOTEL_API_TOKEN="your_api_token"
export EXOTEL_ACCOUNT_SID="your_account_sid"
```

**Reading them in Node.js:**

```javascript
const apiKey = process.env.EXOTEL_API_KEY;
const apiToken = process.env.EXOTEL_API_TOKEN;
const accountSid = process.env.EXOTEL_ACCOUNT_SID;

if (!apiKey || !apiToken || !accountSid) {
  throw new Error("Missing required Exotel environment variables");
}
```

**Reading them in Python:**

```python
import os

api_key = os.environ.get("EXOTEL_API_KEY")
api_token = os.environ.get("EXOTEL_API_TOKEN")
account_sid = os.environ.get("EXOTEL_ACCOUNT_SID")

if not all([api_key, api_token, account_sid]):
    raise ValueError("Missing required Exotel environment variables")
```

### Additional Recommendations

- **Never commit credentials to version control.** Add `.env` files and configuration files containing secrets to your `.gitignore`.
- **Rotate API tokens periodically.** You can regenerate your API Token from the [Exotel Dashboard](https://my.exotel.com/apisettings/site#api-credentials). After rotation, update all services that use the old token.
- **Always use HTTPS.** All Exotel API endpoints require TLS encryption. Never attempt to make requests over plain HTTP.
- **Restrict API access by IP address** if your account plan supports IP allowlisting. This adds a layer of defense even if credentials are compromised.
- **Use a secrets manager** (such as AWS Secrets Manager, HashiCorp Vault, or Google Secret Manager) in production environments for centralized credential management and automatic rotation.

---

## Webhook Security

When you configure **StatusCallback URLs** for calls, SMS, or other resources, Exotel sends HTTP requests (webhooks) to your server with event data. Securing these endpoints is essential to prevent spoofed or malicious requests.

### Best Practices

- **Use HTTPS for all callback URLs.** This ensures webhook payloads are encrypted in transit and prevents man-in-the-middle attacks.
- **Verify source IP ranges.** Exotel sends webhooks from its infrastructure IP addresses. Configure your firewall or application to accept webhook requests only from known Exotel IP ranges. Contact Exotel support for the current list of IP addresses.
- **Always respond with HTTP 200.** Return an HTTP `200 OK` response promptly to acknowledge receipt. If your endpoint does not respond with a 2xx status, Exotel may retry the webhook delivery.
- **Validate payload structure.** Confirm that incoming webhook payloads match the expected format before processing. Reject any requests with unexpected or malformed data.
- **Implement idempotency.** Webhooks may be retried if your server does not acknowledge them in time. Use a unique identifier from the payload (such as `CallSid` or `SmsSid`) to detect and handle duplicate deliveries gracefully.

:::warning
Never rely solely on URL obscurity (such as a hard-to-guess callback path) for webhook security. Always combine it with IP verification and payload validation.
:::

### Example: Webhook Endpoint (Node.js / Express)

```javascript
const express = require("express");
const app = express();

// Track processed events for idempotency
const processedEvents = new Set();

app.post("/webhooks/exotel/call-status", express.urlencoded({ extended: true }), (req, res) => {
  const callSid = req.body.CallSid;

  // Deduplicate retried webhooks
  if (processedEvents.has(callSid)) {
    return res.sendStatus(200);
  }

  // Validate expected fields are present
  if (!callSid || !req.body.Status) {
    return res.sendStatus(400);
  }

  // Process the webhook
  console.log(`Call ${callSid} status: ${req.body.Status}`);
  processedEvents.add(callSid);

  // Always respond with 200 to acknowledge receipt
  res.sendStatus(200);
});
```

---

## Rate Limits

Exotel enforces rate limits to ensure platform stability. If you exceed the allowed request rate, the API returns an **HTTP 429 Too Many Requests** response.

| API | Rate Limit | Scope |
|-----|------------|-------|
| Voice v1 | 200 requests/min | Per account |
| Voice v2 | 200 requests/min | Per account |
| SMS | 200 requests/min | Per account |
| WhatsApp | Varies by tier | Per account |

### Handling Rate Limits

When you receive an HTTP 429 response, implement **exponential backoff** to retry the request after increasing intervals:

```python
import time
import requests

def make_request_with_backoff(url, auth, max_retries=5):
    for attempt in range(max_retries):
        response = requests.get(url, auth=auth)

        if response.status_code != 429:
            return response

        # Exponential backoff: 1s, 2s, 4s, 8s, 16s
        wait_time = 2 ** attempt
        print(f"Rate limited. Retrying in {wait_time}s (attempt {attempt + 1}/{max_retries})")
        time.sleep(wait_time)

    raise Exception("Max retries exceeded due to rate limiting")
```

:::tip
Design your application to stay well below rate limits during normal operation. If you consistently hit limits, consider batching requests or contacting Exotel support to discuss higher-tier plans.
:::

---

## Error Responses

When authentication fails or another error occurs, the Exotel API returns a JSON error response in the following format:

```json
{
  "RestException": {
    "Status": 401,
    "Message": "Authentication failed. Check your API key and token."
  }
}
```

### Common Authentication Errors

| HTTP Status | Meaning | What to Check |
|-------------|---------|---------------|
| `401 Unauthorized` | Invalid or missing credentials | Verify your API Key and API Token are correct |
| `403 Forbidden` | Credentials valid but access denied | Check that your account has permission for the requested resource |
| `404 Not Found` | Invalid Account SID or resource path | Verify the Account SID and endpoint URL are correct |
| `429 Too Many Requests` | Rate limit exceeded | Implement backoff and retry logic (see [Rate Limits](#rate-limits)) |

For a complete reference of all error codes and their resolutions, see the [Full Error Reference](/docs/references/error-codes).

---

## Testing Your Credentials

Run this cURL command to verify your credentials are set up correctly. A successful response confirms that your API Key, API Token, Account SID, and regional endpoint are all valid.

```bash
curl -v -u '<api_key>:<api_token>' \
  'https://api.exotel.com/v1/Accounts/<account_sid>/Calls.json'
```

**What to look for:**

- **HTTP 200** -- Credentials are valid. You will see a JSON response with call data (or an empty list if you have no calls).
- **HTTP 401** -- Authentication failed. Double-check your API Key and API Token.
- **HTTP 404** -- Account SID is incorrect, or you are using the wrong regional endpoint.

:::tip
Replace `api.exotel.com` with `api.in.exotel.com` if your account is based in India.
:::

---

## Related Resources

- [Error Code Dictionary](/docs/references/error-codes) -- Complete reference for all API error codes and troubleshooting steps.
- [Webhooks Hub](/docs/references/webhooks) -- In-depth guide to configuring and managing webhooks.
- [Exotel Dashboard](https://my.exotel.com) -- Manage your account, credentials, and API settings.
