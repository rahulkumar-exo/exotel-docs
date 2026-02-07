---
id: url-shortening
title: URL Shortening & Click Tracking
sidebar_label: URL Shortening
sidebar_position: 5
---

# URL Shortening & Click Tracking

Shorten URLs in your SMS messages and track click-through analytics.

## How It Works

When you enable URL shortening, Exotel replaces long URLs in your SMS body with short links. You can optionally track when recipients click these links.

## Parameters

Add these parameters to any [Send SMS](/docs/sms-api/api-reference/send-sms) request:

| Parameter                                 | Required | Type    | Description |
|-------------------------------------------|----------|---------|-------------|
| `ShortenUrl`                              | Yes      | Boolean | `true` to enable URL shortening |
| `ShortenUrlParams[Header]`                | Yes      | String  | DLT-registered header for the short URL domain |
| `ShortenUrlParams[Tracking]`              | Optional | Boolean | `true` to enable click tracking analytics |
| `ShortenUrlParams[ClickTrackingCallbackUrl]` | Optional | String | Webhook URL to receive click events |
| `ShortenUrlParams[TimeToExpiry]`          | Optional | Integer | Link validity in minutes (after which the link expires) |

## Example Request

```bash
curl -X POST https://<your_api_key>:<your_api_token>@api.exotel.com/v1/Accounts/<your_sid>/Sms/send \
  -d "From=EXOTEL" \
  -d "To=+919876543210" \
  -d "Body=Check out our sale: https://shop.example.com/sale/winter-2024?utm_source=sms" \
  -d "DltEntityId=1234567890" \
  -d "ShortenUrl=true" \
  -d "ShortenUrlParams[Header]=EXOTEL" \
  -d "ShortenUrlParams[Tracking]=true" \
  -d "ShortenUrlParams[ClickTrackingCallbackUrl]=https://your-server.com/sms-clicks" \
  -d "ShortenUrlParams[TimeToExpiry]=4320"
```

The long URL in the Body will be replaced with a short link like `https://exo.tl/abc123`.

## Click Tracking Callback

When a recipient clicks the shortened link, Exotel sends a POST request to your `ClickTrackingCallbackUrl` with:

| Field         | Description |
|---------------|-------------|
| `SmsSid`      | The SMS message identifier |
| `To`          | Recipient phone number |
| `ShortenedUrl`| The short URL that was clicked |
| `OriginalUrl` | The original long URL |
| `ClickedAt`   | Timestamp of the click |
| `UserAgent`   | Browser/device user agent string |

## Best Practices

- Set `TimeToExpiry` to match your campaign duration — expired links show a generic page
- Use click tracking to measure SMS campaign effectiveness
- The DLT-registered header in `ShortenUrlParams[Header]` must match your approved sender ID
- Short URLs count toward the 2000-character Body limit but are significantly shorter than the original
