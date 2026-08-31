---
title: API Credentials
description: "Find and manage your Exotel API credentials including API key, API token, and Account SID for authenticating API requests."
sidebar_label: API Credentials
sidebar_position: 10
---

# API Credentials

Exotel's APIs use HTTP Basic Authentication with three credentials: API Key, API Token, and Account SID. This guide covers where to find them, how to use them, and best practices for credential management.

## Your Three Credentials

| Credential | Purpose | Example Format |
|-----------|---------|----------------|
| **API Key** | Public identifier (username in Basic Auth) | `2b04c2XXXXXXXXXX` |
| **API Token** | Secret key (password in Basic Auth) | `a1b2c3d4XXXXXXXX` |
| **Account SID** | Unique account identifier (used in API URLs) | `exotel` or custom identifier |

## Finding Your Credentials

### Via Dashboard

1. Log in to [my.exotel.com](https://my.exotel.com)
2. Navigate to **Settings** in the left sidebar
3. Click **API Settings**
4. Your credentials are displayed on the [API Credentials](https://my.exotel.com/apisettings/site#api-credentials) page:
   - **API Key** -- visible in full
   - **API Token** -- click "Show" to reveal
   - **Account SID** -- visible in full

:::warning
Only Admin users can view API credentials. If you have a Supervisor or Agent role, ask your account Admin for the credentials or request a role change.
:::

## Using Credentials in API Calls

Exotel APIs use HTTP Basic Authentication. Include your API Key and API Token in every request.

### cURL Format

Use HTTP Basic Auth. cURL `-u` sets the `Authorization` header.

```bash
curl -u '<api_key>:<api_token>' \
  "https://api.exotel.com/v2/accounts/<account_sid>/calls"
```

### API Endpoint by Region

| Region | API Base URL |
|--------|-------------|
| Singapore | `https://api.exotel.com/v2/accounts/<account_sid>/` |
| India (Mumbai) | `https://api.in.exotel.com/v2/accounts/<account_sid>/` |

:::info
Use the correct API base URL for your account region. Requests to the wrong region will return authentication errors or unexpected results.
:::

## Testing Your Credentials

Verify your credentials work by making a simple API call:

```bash
curl -u '<api_key>:<api_token>' -v "https://api.exotel.com/v2/accounts/<account_sid>/calls?limit=1"
```

| Response | Meaning |
|----------|---------|
| HTTP 200 | Credentials are valid |
| HTTP 401 | Invalid API Key or Token |
| HTTP 403 | Account suspended or IP restricted |
| HTTP 404 | Incorrect Account SID or region |

## Using Credentials in Code

### Python

```python
import requests

API_KEY = "your_api_key"
API_TOKEN = "your_api_token"
ACCOUNT_SID = "your_account_sid"

url = f"https://api.exotel.com/v2/accounts/{ACCOUNT_SID}/calls"
response = requests.get(url, auth=(API_KEY, API_TOKEN))
print(response.json())
```

### Node.js

```javascript
const axios = require('axios');

const API_KEY = 'your_api_key';
const API_TOKEN = 'your_api_token';
const ACCOUNT_SID = 'your_account_sid';

axios.get(`https://api.exotel.com/v2/accounts/${ACCOUNT_SID}/calls`, {
  auth: { username: API_KEY, password: API_TOKEN }
}).then(response => {
  console.log(response.data);
});
```

### PHP

```php
$api_key = 'your_api_key';
$api_token = 'your_api_token';
$account_sid = 'your_account_sid';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.exotel.com/v2/accounts/{$account_sid}/calls");
curl_setopt($ch, CURLOPT_USERPWD, "{$api_key}:{$api_token}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

echo $response;
```

## Regenerating Your API Token

If your API Token is compromised or you need to rotate it:

1. Go to **Settings > API Settings** in the dashboard
2. Click **Regenerate Token**
3. Confirm the regeneration
4. Copy the new token immediately
5. Update all applications and integrations with the new token

:::warning
Regenerating your API Token **immediately invalidates** the old token. All active integrations using the old token will fail with HTTP 401 errors. Plan token rotation during a maintenance window and update all services promptly.
:::

## Security Best Practices

### Storage

| Do | Do Not |
|----|--------|
| Store credentials in environment variables | Hardcode credentials in source code |
| Use a secrets manager (AWS Secrets Manager, HashiCorp Vault) | Commit credentials to version control (Git) |
| Encrypt credentials at rest | Store in plain-text configuration files |
| Use separate credentials for dev and production | Share one set of credentials across environments |

### Access Control

| Practice | Description |
|----------|-------------|
| **Principle of least privilege** | Only share credentials with team members who need API access |
| **IP allowlisting** | Restrict API access to known IP addresses (enterprise feature) |
| **Regular rotation** | Rotate API Token every 90 days |
| **Audit access** | Review who has access to credentials quarterly |
| **Revoke on departure** | Regenerate tokens when team members with access leave |

### Environment Variables

Store credentials as environment variables rather than in code:

```bash
# .env file (do NOT commit to Git)
EXOTEL_API_KEY=your_api_key
EXOTEL_API_TOKEN=your_api_token
EXOTEL_ACCOUNT_SID=your_account_sid
```

```python
import os

API_KEY = os.environ['EXOTEL_API_KEY']
API_TOKEN = os.environ['EXOTEL_API_TOKEN']
ACCOUNT_SID = os.environ['EXOTEL_ACCOUNT_SID']
```

:::tip
Add `.env` to your `.gitignore` file to prevent accidentally committing credentials. Use a `.env.example` file with placeholder values as a template for team members.
:::

## API Rate Limits

| Limit | Default | Notes |
|-------|---------|-------|
| Requests per minute | 200 | Per account, across all API endpoints |
| Concurrent connections | 50 | Maximum simultaneous connections |

When you exceed the rate limit, the API returns HTTP 429 (Too Many Requests). Implement exponential backoff in your application to handle rate limiting gracefully.

For higher rate limits, contact your account manager.

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| HTTP 401 Unauthorized | Invalid API Key or Token | Verify credentials in Dashboard > Settings > API |
| HTTP 403 Forbidden | IP not allowlisted or account suspended | Check IP restrictions; contact support |
| HTTP 404 Not Found | Wrong Account SID or region URL | Verify Account SID; use correct regional base URL |
| HTTP 429 Too Many Requests | Rate limit exceeded | Implement backoff; request limit increase |
| Credentials not visible | Not an Admin user | Ask your account Admin for credentials |

## Next Steps

- [Testing Guide](/docs/getting-started/testing-guide) -- Test your API setup with calls and SMS
- [Authentication Reference](/docs/references/authentication) -- Detailed authentication documentation
- [Voice API](/docs/voice) -- Start making API calls
- [SMS API](/docs/sms-api/overview) -- Send your first SMS via API
