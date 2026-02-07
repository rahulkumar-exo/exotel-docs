---
id: list-numbers
title: List All ExoPhones
sidebar_label: List Numbers
---

# List All ExoPhones

Retrieve all ExoPhones in your account.

## HTTP Request

```
GET /v2_beta/Accounts/<account_sid>/IncomingPhoneNumbers
```

## Response

```json
{
  "page": 0,
  "page_size": 50,
  "incoming_phone_numbers": [
    {
      "sid": "011XXXXXXX1",
      "phone_number": "+9111XXXXXXX6",
      "friendly_name": "011XXXXXXX6",
      "capabilities": {
        "voice": true,
        "sms": true
      },
      "country": "IN",
      "region": "DL"
    }
  ]
}
```

### Response Fields

| Field | Description |
|-------|-------------|
| `page` | Current page number |
| `page_size` | Number of records per page |
| `incoming_phone_numbers` | Array of ExoPhone objects |
