---
id: start-verification
title: Start Verification
sidebar_label: Start Verification
sidebar_position: 1
---

# Start Verification

Send an SMS OTP to a phone number to begin the verification process.

## Endpoint

```
POST https://exoverify.exotel.com/v2/accounts/{account_sid}/verifications/sms
```

## Headers

| Header          | Value |
|-----------------|-------|
| `Authorization` | `Basic <base64(Application_ID:Application_Secret)>` |
| `Content-Type`  | `application/json` |

## Request Parameters

| Parameter        | Required  | Type   | Description |
|------------------|-----------|--------|-------------|
| `application_id` | Mandatory | String | Your ExoVerify SMS App ID |
| `phone_number`   | Mandatory | String | Phone number to verify (E.164 format) |
| `replace_vars`   | Optional  | Array  | Array of strings for template variable substitution |

## Code Examples

### cURL

```bash
curl -X POST "https://exoverify.exotel.com/v2/accounts/<account_sid>/verifications/sms" \
  -H "Authorization: Basic <base64_credentials>" \
  -H "Content-Type: application/json" \
  -d '{
    "application_id": "your_app_id",
    "phone_number": "+919876543210"
  }'
```

### Python

```python
import requests
import base64

credentials = base64.b64encode(b"app_id:app_secret").decode()

response = requests.post(
    "https://exoverify.exotel.com/v2/accounts/<account_sid>/verifications/sms",
    headers={
        "Authorization": f"Basic {credentials}",
        "Content-Type": "application/json"
    },
    json={
        "application_id": "your_app_id",
        "phone_number": "+919876543210"
    }
)

print(response.json())
```

### Node.js

```javascript
const axios = require('axios');

const credentials = Buffer.from('app_id:app_secret').toString('base64');

axios.post(
  'https://exoverify.exotel.com/v2/accounts/<account_sid>/verifications/sms',
  {
    application_id: 'your_app_id',
    phone_number: '+919876543210'
  },
  {
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json'
    }
  }
).then(res => console.log(res.data));
```

## Response

**HTTP 200**

```json
{
  "verification_id": "ver_abc123def456",
  "phone_number": "+91987654XXXX",
  "application_id": "your_app_id",
  "account_sid": "your_account_sid",
  "max_attempts": 10,
  "expiration_in_seconds": 60,
  "date_created": "2024-01-15T10:30:00Z",
  "date_updated": "2024-01-15T10:30:00Z"
}
```

## Response Fields

| Field                    | Type    | Description |
|--------------------------|---------|-------------|
| `verification_id`        | String  | Unique ID — use this to verify the OTP later |
| `phone_number`           | String  | Masked phone number |
| `application_id`         | String  | Your ExoVerify app ID |
| `max_attempts`           | Integer | Maximum OTP entry attempts allowed (10) |
| `expiration_in_seconds`  | Integer | OTP validity window (60 seconds) |

## Error Codes

| HTTP | Code | Description |
|------|------|-------------|
| 400  | 1001 | Missing mandatory parameter |
| 401  | 1010 | Authentication failed — invalid App ID or Secret |
| 429  | 1030 | Throttle limit exceeded — too many requests |

:::note
The `verification_id` is required for the next step — [Verify OTP](/docs/exoverify-api/api-reference/verify-otp). Store it in your session or pass it to your frontend.
:::
