---
id: verify-otp
title: Verify OTP
sidebar_label: Verify OTP
sidebar_position: 2
---

# Verify OTP

Validate the OTP code entered by the user against the verification that was started.

## Endpoint

```
POST https://exoverify.exotel.com/v2/accounts/{account_sid}/verifications/sms/{verification_id}
```

## Headers

| Header          | Value |
|-----------------|-------|
| `Authorization` | `Basic <base64(Application_ID:Application_Secret)>` |
| `Content-Type`  | `application/json` |

## Request Parameters

| Parameter | Required  | Type   | Description |
|-----------|-----------|--------|-------------|
| `OTP`     | Mandatory | String | The OTP code entered by the user |

## Code Examples

### cURL

```bash
curl -X POST "https://exoverify.exotel.com/v2/accounts/<account_sid>/verifications/sms/<verification_id>" \
  -H "Authorization: Basic <base64_credentials>" \
  -H "Content-Type: application/json" \
  -d '{ "OTP": "123456" }'
```

### Python

```python
import requests
import base64

credentials = base64.b64encode(b"app_id:app_secret").decode()

response = requests.post(
    "https://exoverify.exotel.com/v2/accounts/<account_sid>/verifications/sms/<verification_id>",
    headers={
        "Authorization": f"Basic {credentials}",
        "Content-Type": "application/json"
    },
    json={"OTP": "123456"}
)

print(response.json())
```

### Node.js

```javascript
const axios = require('axios');

const credentials = Buffer.from('app_id:app_secret').toString('base64');

axios.post(
  'https://exoverify.exotel.com/v2/accounts/<account_sid>/verifications/sms/<verification_id>',
  { OTP: '123456' },
  {
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json'
    }
  }
).then(res => console.log(res.data));
```

## Success Response

**HTTP 200**

```json
{
  "verification_id": "ver_abc123def456",
  "application_id": "your_app_id",
  "account_sid": "your_account_sid",
  "status": "success",
  "date_created": "2024-01-15T10:30:00Z",
  "date_updated": "2024-01-15T10:30:45Z"
}
```

## Error Codes

| HTTP | Code | Description |
|------|------|-------------|
| 400  | 1210 | OTP expired — the 60-second window has passed |
| 400  | 1211 | Invalid OTP — the code entered is incorrect |
| 403  | 1016 | Max attempts exceeded — user tried more than 10 times |
| 403  | 1017 | Verification already completed |

## Flow Summary

```
Start Verification → User receives OTP → User enters OTP → Verify OTP
                                                          → success ✓
                                                          → 1211 (wrong OTP, try again)
                                                          → 1210 (expired, start new verification)
                                                          → 1016 (too many attempts, start new)
```

:::note
After a successful verification, the same `verification_id` cannot be used again. If you need to re-verify, call [Start Verification](/docs/exoverify-api/api-reference/start-verification) to get a new `verification_id`.
:::
