---
id: shorten-url
title: Shorten URL
description: Create short URLs with the Exotel URL Shortening API. Supports click tracking, custom domains, expiration, and DLT compliance.
sidebar_label: Shorten URL
---

# Shorten a Long URL

Create a short URL from a long URL with optional tracking and expiration settings.

## HTTP Request

```
POST /v2/accounts/<account_sid>/links
```

## Request Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `long_url` | Yes | The URL to shorten (must be a valid URL) |
| `expire_in` | No | Duration in seconds before expiration (min: 60s, default: 31 days, max: 365 days) |
| `tracking` | No | Enable click tracking: `"true"` or `"false"` |
| `shorten_url_header` | No | DLT header for Indian SMS businesses (must match DLT registration) |
| `callback_url` | No | Webhook URL for click notifications |
| `custom_field` | No | Custom metadata up to 1024 characters (e.g., Order ID, Payment ID) |
| `custom_domain` | No | Use a custom domain instead of default `exo.tl` |

## Response

```json
{
  "sid": "unique_alpha_numeric_id",
  "short_url": "https://exo.tl/abc123",
  "short_code": "abc123",
  "long_url": "https://example.com/very/long/url",
  "tracking": true,
  "expires_at": "2024-02-15 10:30:00",
  "created_time": "2024-01-15 10:30:00",
  "last_viewed": null,
  "total_clicks": 0
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `sid` | String | Unique identifier |
| `short_url` | String | Generated short URL |
| `short_code` | String | URL shortening key |
| `long_url` | String | Original URL |
| `tracking` | Boolean | Whether tracking is enabled |
| `expires_at` | DateTime | Expiration timestamp |
| `created_time` | DateTime | Creation timestamp |
| `last_viewed` | DateTime | Last access timestamp |
| `total_clicks` | Integer | Total view count |

---

## Get Short URL Details

```
GET /v2/accounts/<account_sid>/links/<uuid>
```

Returns the same response structure as the POST endpoint.

## HTTP Status Codes

| Status | Code | Description |
|--------|------|-------------|
| `200` | — | Success |
| `207` | — | Partial success |
| `400` | `1001` | Missing mandatory parameters |
| `400` | `1002` | Invalid parameter values |
| `400` | `1007` | Invalid request body |
| `401` | `1015` | Authentication failed |
| `403` | `1010` | Insufficient permissions |
| `404` | `1012` | Short code not found or expired |
| `5xx` | — | Server errors |
