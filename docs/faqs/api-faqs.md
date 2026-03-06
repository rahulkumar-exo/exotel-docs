---
id: api-faqs
title: API FAQs
description: "Common questions about Exotel API rate limits, authentication, SDKs, versioning, webhooks, and error handling."
sidebar_label: API FAQs
sidebar_position: 6
---

# API FAQs

Common questions about using Exotel APIs, including authentication, rate limits, SDKs, error handling, and integration patterns.

---

## What authentication method does Exotel use?

All Exotel APIs use **HTTP Basic Authentication** as defined in RFC 7617. You authenticate using your API Key (username) and API Token (password). Credentials can be passed in two ways:

**In the URL:**
```
https://<api_key>:<api_token>@api.exotel.com/v1/Accounts/<account_sid>/<resource>
```

**In the Authorization header:**
```
Authorization: Basic base64(<api_key>:<api_token>)
```

For complete details, see the [Authentication & Security](/docs/references/authentication) guide.

---

## What are the API rate limits?

Exotel enforces per-account rate limits to ensure platform stability:

| API | Rate Limit | Scope |
|---|---|---|
| Voice v1 | 200 requests/min | Per account |
| Voice v2 | 200 requests/min | Per account |
| SMS | 200 requests/min | Per account |
| WhatsApp | Varies by tier | Per account |
| Bulk SMS (per request) | 100 messages max | Per request |

When you exceed the rate limit, the API returns **HTTP 429 Too Many Requests**.

:::tip
Implement exponential backoff when you receive a 429 response. Start with a 1-second delay and double it with each retry, up to a maximum of 5 retries. See the [Authentication guide](/docs/references/authentication#rate-limits) for a code example.
:::

---

## What API versions are available?

Exotel offers multiple API versions:

| Version | APIs | Status |
|---|---|---|
| **v1** | Voice (basic), SMS, ExoPhones, Number Metadata | Stable, production |
| **v2** | Voice (CCM/agent context), WhatsApp, Contact Center | Stable, production |
| **v3** | Voice (enhanced call details) | Beta |

:::info
v1 APIs work without user/agent context. v2 APIs require users to be added to the Exotel dashboard and support contact center features. Choose the version based on your use case.
:::

---

## Does Exotel provide SDKs?

Exotel provides REST APIs that can be consumed from any programming language. While there are no official SDK libraries, the APIs use standard HTTP and can be easily integrated using:

- **cURL** -- For testing and scripting
- **Python** -- Using the `requests` library
- **Node.js** -- Using `fetch` or `axios`
- **Java** -- Using `HttpClient` or any HTTP library
- **PHP** -- Using `cURL` or `Guzzle`

Example in Python:

```python
import requests
import os

api_key = os.environ["EXOTEL_API_KEY"]
api_token = os.environ["EXOTEL_API_TOKEN"]
account_sid = os.environ["EXOTEL_ACCOUNT_SID"]

response = requests.post(
    f"https://api.exotel.com/v1/Accounts/{account_sid}/Sms/send.json",
    auth=(api_key, api_token),
    data={
        "From": "EXOTEL_VN",
        "To": "9XXXXXXXXX",
        "Body": "Hello from Exotel!",
        "DltEntityId": "your_dlt_entity_id",
        "DltTemplateId": "your_dlt_template_id"
    }
)
print(response.json())
```

---

## How do webhooks (StatusCallbacks) work?

Exotel sends HTTP POST requests to your configured callback URL when events occur (call completed, SMS delivered, etc.). To use webhooks:

1. Set up an HTTPS endpoint on your server
2. Pass the URL as `StatusCallback` parameter in your API request
3. Your endpoint receives a POST with event data
4. Respond with HTTP 200 to acknowledge receipt

```javascript
// Express.js webhook handler
app.post("/webhooks/exotel", express.urlencoded({ extended: true }), (req, res) => {
  const { CallSid, Status, From, To } = req.body;
  console.log(`Call ${CallSid}: ${Status}`);
  res.sendStatus(200);
});
```

:::warning
Always respond with HTTP 200 promptly. If your endpoint does not acknowledge the webhook, Exotel may retry delivery, resulting in duplicate events. Implement idempotency using `CallSid` or `SmsSid` as a deduplication key.
:::

For webhook security best practices, see [Authentication & Security](/docs/references/authentication#webhook-security).

---

## What response format does the API return?

Exotel APIs return responses in **JSON** format. Append `.json` to the endpoint URL if needed:

```
/v1/Accounts/{sid}/Calls.json
/v1/Accounts/{sid}/Sms/send.json
```

Error responses follow a consistent format:

```json
{
  "RestException": {
    "Status": 400,
    "Message": "Invalid parameter: 'To' must be a valid phone number"
  }
}
```

---

## How do I handle API errors?

Common HTTP status codes and their meanings:

| Code | Meaning | Action |
|---|---|---|
| `200` | Success | Process the response |
| `400` | Bad Request | Check request parameters |
| `401` | Unauthorized | Verify API Key and Token |
| `403` | Forbidden | Check account permissions or IP allowlist |
| `404` | Not Found | Verify Account SID and endpoint URL |
| `429` | Rate Limited | Implement exponential backoff |
| `500` | Server Error | Retry after a brief delay |

For a complete list of error codes, see the [Error Code Reference](/docs/references/error-codes).

---

## Can I make API calls from the browser (client-side)?

No. Exotel APIs require your API Key and Token for authentication. Embedding these credentials in client-side JavaScript would expose them to anyone viewing your page source.

:::caution
Never include API credentials in frontend code, mobile apps, or any client-side application. Always make Exotel API calls from your server-side backend.
:::

The recommended architecture is:

1. Your frontend sends a request to your backend server
2. Your backend server makes the Exotel API call with credentials stored securely
3. Your backend returns the result to the frontend

---

## How do I test the API without making real calls?

Options for testing:

- **Trial account** -- Use your trial credits to make real test calls with limited volume
- **Sandbox numbers** -- Some test scenarios can use internal numbers
- **StatusCallback testing** -- Use tools like [webhook.site](https://webhook.site) to inspect webhook payloads without building a server
- **Dry run with cURL** -- Test authentication and parameter formatting with GET requests before making POST calls

---

## Is there an API changelog?

API changes, deprecations, and new features are communicated through:

- **Email notifications** -- Sent to account administrators for breaking changes
- **Dashboard announcements** -- Visible in the Exotel Dashboard
- **Documentation updates** -- Reflected in the API reference docs

:::tip
Subscribe to Exotel's status page and release notes to stay informed about API changes. Major version changes are communicated at least 90 days in advance.
:::

---

## Related Resources

- [Authentication & Security](/docs/references/authentication) -- Complete authentication guide
- [Voice v1 API](/docs/voice-v1/overview) -- Voice API reference
- [SMS API](/docs/sms-api/overview) -- SMS API reference
- [WhatsApp API](/docs/whatsapp-api/overview) -- WhatsApp API reference
- [Error Codes](/docs/references/error-codes) -- Full error code dictionary
