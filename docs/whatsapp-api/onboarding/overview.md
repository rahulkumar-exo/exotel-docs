---
id: overview
title: WhatsApp - Onboarding APIs
sidebar_label: Overview
slug: /whatsapp-api/onboarding/overview
---

# WhatsApp Onboarding APIs

APIs for Independent Software Vendors (ISVs) to create onboarding links and validate tokens for WhatsApp Business Account setup.

## Create Onboarding Link

```
POST /v2/accounts/<account_sid>/isv
```

Generates a unique onboarding URL with token for customer WhatsApp setup.

### Key Constraints

- URLs are valid for **24 hours**
- Up to **50 URLs** can be fetched simultaneously
- A single token can onboard up to **5 customers** within 24 hours

### Response

```json
{
  "request_id": "15dbef467ff34a96b78e67baf63c19bf",
  "response": {
    "whatsapp": {
      "isv": {
        "code": 200,
        "status": "success",
        "data": {
          "onboarding_token_status": "VALID"
        }
      }
    }
  }
}
```

---

## Validate Token

```
GET /v2/accounts/<account_sid>/isv?access_token=<token>
```

Extract the UUID from the onboarding link and use it as the `access_token` parameter.

### Response

Returns token status: `VALID`, `EXPIRED`, or `USED`.

## HTTP Status Codes

| Code | Description |
|------|-------------|
| `202` | Accepted |
| `400` | Bad Request |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not Found |
