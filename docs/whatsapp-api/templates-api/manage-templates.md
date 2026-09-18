---
id: manage-templates
title: Manage Templates
description: Retrieve, upload samples, and manage WhatsApp message templates programmatically using the Exotel Template Management API.
sidebar_label: Manage Templates
---

# Manage WhatsApp Templates

## Get Templates

```
GET /v2/accounts/<account_sid>/templates
```

### Query Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `waba_id` | Yes | WhatsApp Business Account ID |
| `name` | No | Filter by template name |
| `status` | No | Filter by status |
| `language` | No | Filter by language |
| `category` | No | Filter by category |
| `limit` | No | Results per page |
| `before` / `after` | No | Pagination cursors |

---

## Upload Template Sample

Upload media files for use in templates.

```
POST /v2/accounts/<account_sid>/templates/sample?file_length=<bytes>&file_type=<type>
```

Supported types: `application/pdf`, `image/jpeg`, `image/png`, `video/mp4`

Returns a `file_handle` ID for use in template creation.

---

## Create Template

```
POST /v2/accounts/<account_sid>/templates?waba_id=<waba_id>
```

**ComponentObject fields:**

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | String | Yes | `HEADER`, `BODY`, `FOOTER`, `BUTTONS`, `CAROUSEL`, `LIMITED_TIME_OFFER`, `call_permission_request` |
| `text` | String | Conditional | Required for FOOTER, BODY, and TEXT HEADER |
| `format` | String | Conditional | Required for HEADER type |
| `buttons` | Array | Conditional | Required for BUTTONS type |
| `example` | Object | Conditional | Required for dynamic variables or media headers |

**ExampleObject:**

| Field | Description |
|---|---|
| `body_text` | `[][]String` — example values for body `{{N}}` variables |
| `header_text` | `[]String` — example values for text header variables |
| `header_handle` | `[]String` — file handle from Upload Template Sample API (for media headers) |

**Create Template Response:**

```json
{
  "request_id": "72f3624613a84932823f838fcecf7389",
  "method": "POST",
  "http_code": 200,
  "metadata": { "failed": 0, "total": 1, "success": 1 },
  "response": {
    "whatsapp": {
      "templates": [
        { "code": 200, "error_data": null, "status": "success", "data": { "id": "903269234317278" } }
      ]
    }
  }
}
```

### Create Text Template

```bash
curl --location --request POST 'https://<api_key>:<api_token><subdomain>/v2/accounts/<sid>/templates?waba_id=<waba_id>' \
--header 'Content-Type: application/json' \
--data '{
  "whatsapp": {
    "templates": [{
      "template": {
        "category": "TRANSACTIONAL",
        "name": "test_template_001",
        "language": "en",
        "components": [
          { "type": "HEADER", "format": "TEXT", "text": "Greetings from Exotel {{1}}", "example": { "header_text": ["John Doe"] } },
          { "type": "BODY", "text": "Hi {{1}}, your one time password is {{2}}.", "example": { "body_text": [["John", "1234"]] } },
          { "type": "FOOTER", "text": "Thanks" }
        ]
      }
    }]
  }
}'
```

### Create Calling Permission Template

Lets a business request WhatsApp calling permission from a user. The `call_permission_request` component is static and not editable. Only text headers supported.

**Limits per business+user pair:**
- Temporary permissions: valid 7 days
- Permanent permissions: do not expire
- Max 10 connected calls / 24 hours per user
- Max 1 permission request per user per 24 hours; max 2 per 7 days
- 4 consecutive unanswered calls → permission auto-revoked

```bash
curl --location 'https://<api_key>:<api_token><subdomain>/v2/accounts/<sid>/templates?waba_id=<waba_id>' \
--header 'Content-Type: application/json' \
--data '{
  "whatsapp": {
    "templates": [{
      "template": {
        "category": "utility",
        "name": "calling_permission_request",
        "language": "en",
        "components": [
          { "type": "HEADER", "format": "TEXT", "text": "Greetings from Exotel {{1}}", "example": { "header_text": ["User"] } },
          { "type": "BODY", "text": "Hi {{1}}. Please accept the calling request from our end.", "example": { "body_text": [["Exotel user"]] } },
          { "type": "call_permission_request" },
          { "type": "FOOTER", "text": "Thanks" }
        ]
      }
    }]
  }
}'
```

### Create Carousel Templates

Sends up to 10 horizontally scrollable cards in a single message. Only MARKETING category. No footer. Each card must have: media header (image or video), body text, and 1–2 buttons. Media format and button types must be consistent across all cards.

```bash
curl --location 'https://<api_key>:<api_token><subdomain>/v2/accounts/<sid>/templates?waba_id=<waba_id>' \
--header 'Content-Type: application/json' \
--data '{
  "whatsapp": {
    "templates": [{
      "template": {
        "name": "summer_carousel",
        "language": "en",
        "category": "MARKETING",
        "components": [
          {
            "type": "BODY",
            "text": "Summer is here! Use code {{1}} to get off your next order.",
            "example": { "body_text": [["10OFF"]] }
          },
          {
            "type": "CAROUSEL",
            "cards": [
              {
                "components": [
                  { "type": "HEADER", "format": "IMAGE", "example": { "header_handle": ["<file_handle_from_upload_api>"] } },
                  { "type": "BODY", "text": "Fresh lemons. Use {{1}} to save.", "example": { "body_text": [["10OFF"]] } },
                  {
                    "type": "BUTTONS",
                    "buttons": [
                      { "type": "QUICK_REPLY", "text": "Send more like this" },
                      { "type": "URL", "text": "Buy now", "url": "https://example.com/shop?promo={{1}}", "example": ["https://example.com/shop?promo=summer_lemons"] }
                    ]
                  }
                ]
              },
              {
                "components": [
                  { "type": "HEADER", "format": "IMAGE", "example": { "header_handle": ["<file_handle_from_upload_api>"] } },
                  { "type": "BODY", "text": "Exotic fruits. Use {{1}} to save.", "example": { "body_text": [["20FRUITS"]] } },
                  {
                    "type": "BUTTONS",
                    "buttons": [
                      { "type": "QUICK_REPLY", "text": "Send more like this" },
                      { "type": "URL", "text": "Buy now", "url": "https://example.com/shop?promo={{1}}", "example": ["https://example.com/shop?promo=exotic_2024"] }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    }]
  }
}'
```

### Create Limited-Time Offer Templates

Displays an expiration countdown for offer codes. Only MARKETING category. No footer. Not visible on WhatsApp web/desktop.

```bash
curl --location 'https://<api_key>:<api_token><subdomain>/v2/accounts/<sid>/templates?waba_id=<waba_id>' \
--header 'Content-Type: application/json' \
--data '{
  "whatsapp": {
    "templates": [{
      "template": {
        "name": "summer_lto",
        "language": "en",
        "category": "marketing",
        "components": [
          {
            "type": "limited_time_offer",
            "limited_time_offer": { "text": "Expiring offer!", "has_expiration": false }
          },
          {
            "type": "body",
            "text": "Hi {{1}}! Use code {{2}} to get 25% off all packages.",
            "example": { "body_text": [["Rahul", "SALE25"]] }
          },
          {
            "type": "buttons",
            "buttons": [
              { "type": "copy_code", "example": "SALE25" },
              { "type": "url", "text": "Book now!", "url": "https://example.com/offers?code={{1}}", "example": ["https://example.com/offers?code=SALE25"] }
            ]
          }
        ]
      }
    }]
  }
}'
```

### Create Authentication Templates

Fixed body text: `<VERIFICATION_CODE> is your verification code.` Optional security disclaimer and expiration warning. Three button variants:

#### One-Tap Autofill (Android only)

```bash
curl --location 'https://<api_key>:<api_token><subdomain>/v2/accounts/<sid>/templates?waba_id=<waba_id>' \
--header 'Content-Type: application/json' \
--data '{
  "whatsapp": {
    "templates": [{
      "template": {
        "category": "AUTHENTICATION",
        "message_send_ttl_seconds": 60,
        "name": "otp_one_tap",
        "language": "en_US",
        "components": [
          { "type": "BODY", "add_security_recommendation": true },
          { "type": "FOOTER", "code_expiration_minutes": 15 },
          {
            "type": "BUTTONS",
            "buttons": [{
              "type": "OTP",
              "otp_type": "ONE_TAP",
              "text": "Autofill",
              "supported_apps": [{ "package_name": "com.example.app", "signature_hash": "K8a/AINcGX7" }]
            }]
          }
        ]
      }
    }]
  }
}'
```

#### Copy Code

```bash
curl --location 'https://<api_key>:<api_token><subdomain>/v2/accounts/<sid>/templates?waba_id=<waba_id>' \
--header 'Content-Type: application/json' \
--data '{
  "whatsapp": {
    "templates": [{
      "template": {
        "category": "AUTHENTICATION",
        "name": "otp_copy_code",
        "language": "en",
        "components": [
          { "type": "BODY", "add_security_recommendation": true },
          { "type": "FOOTER", "code_expiration_minutes": 10 },
          { "type": "BUTTONS", "buttons": [{ "type": "OTP", "otp_type": "COPY_CODE" }] }
        ]
      }
    }]
  }
}'
```

#### Zero-Tap (no button — OTP delivered silently to app)

`zero_tap_terms_accepted: true` is mandatory.

```bash
curl --location 'https://<api_key>:<api_token><subdomain>/v2/accounts/<sid>/templates?waba_id=<waba_id>' \
--header 'Content-Type: application/json' \
--data '{
  "whatsapp": {
    "templates": [{
      "template": {
        "category": "AUTHENTICATION",
        "name": "otp_zero_tap",
        "language": "en",
        "components": [
          { "type": "BODY", "add_security_recommendation": true },
          { "type": "FOOTER", "code_expiration_minutes": 15 },
          {
            "type": "BUTTONS",
            "buttons": [{
              "type": "OTP",
              "otp_type": "ZERO_TAP",
              "zero_tap_terms_accepted": true,
              "supported_apps": [{ "package_name": "com.example.app", "signature_hash": "K8a/AINcGX7" }]
            }]
          }
        ]
      }
    }]
  }
}'
```

---

## Edit Template

```
PUT /v2/accounts/<account_sid>/templates
```

Include the `id` field in the template object to identify which template to update.

---

## Delete Template

```
DELETE /v2/accounts/<account_sid>/templates?waba_id=<id>
```

### Request Body

```json
{
  "whatsapp": {
    "templates": [{
      "template": { "name": "template_name" }
    }]
  }
}
```

## HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `400` | Bad Request |
| `401` | Unauthorized |
| `402` | Payment Required |
| `403` | Access Denied |
| `404` | Not Found |
