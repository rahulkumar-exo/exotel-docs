---
id: authentication
title: Authentication
sidebar_label: Authentication
sidebar_position: 2
---

# Authentication

Each API request must include your access credentials for authentication. Exotel uses **HTTP Basic Authentication** to protect all REST API endpoints.

## Credentials

You need two pieces of information:

| Credential    | Description                          |
|---------------|--------------------------------------|
| **API Key**   | Your username for HTTP Basic Auth    |
| **API Token** | Your password for HTTP Basic Auth    |

Both credentials are available on your [Exotel Dashboard](https://my.exotel.com/apisettings/site#api-credentials) under **API Settings**.

## Making Authenticated Requests

Include your API Key and API Token in the request URL:

```
https://<your_api_key>:<your_api_token><subdomain>/v1/Accounts/<your_sid>/
```

### Parameters

| Parameter        | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| `<your_api_key>` | Your API Key from the Exotel Dashboard                                     |
| `<your_api_token>`| Your API Token from the Exotel Dashboard                                  |
| `<subdomain>`    | Regional endpoint: `@api.exotel.com` (Singapore) or `@api.in.exotel.com` (Mumbai) |
| `<your_sid>`     | Your Account SID from the Exotel Dashboard                                 |

### Example

```bash
curl https://your_api_key:your_api_token@api.exotel.com/v1/Accounts/your_sid/Calls.json
```

## Don't Have Credentials?

If you don't have an Exotel account yet, you can [create one here](https://my.exotel.com/auth/register).
