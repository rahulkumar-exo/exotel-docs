---
id: send-sms
title: Send SMS
sidebar_label: Send SMS
sidebar_position: 1
---

# Send SMS

Send a single SMS message to a phone number.

## Endpoint

```
POST https://<api_key>:<api_token><subdomain>/v1/Accounts/<account_sid>/Sms/send
```

## Request Parameters

| Parameter        | Required  | Type   | Description |
|------------------|-----------|--------|-------------|
| `From`           | Mandatory | String | ExoPhone or approved Sender ID |
| `To`             | Mandatory | String | Recipient mobile number, preferably E.164 format |
| `Body`           | Mandatory | String | Message content, max 2000 characters |
| `EncodingType`   | Optional  | String | `plain` (default) or `unicode` |
| `StatusCallback` | Optional  | String | URL to receive delivery status notifications |
| `DltEntityId`    | Mandatory (India) | String | DLT entity registration ID |
| `DltTemplateId`  | Optional  | String | DLT-approved template ID |
| `SmsType`        | Optional  | String | `transactional`, `transactional_opt_in`, or `promotional` |
| `CustomField`    | Optional  | String | Reference identifier for your application |
| `Priority`       | Optional  | String | `normal` (default) or `high` |

## Code Examples

### cURL

```bash
curl -X POST https://<your_api_key>:<your_api_token>@api.exotel.com/v1/Accounts/<your_sid>/Sms/send \
  -d "From=EXOTEL" \
  -d "To=+919876543210" \
  -d "Body=Your OTP is 123456" \
  -d "DltEntityId=1234567890" \
  -d "DltTemplateId=9876543210"
```

### Node.js

```javascript
const request = require('request');

const options = {
  url: 'https://<your_api_key>:<your_api_token>@api.exotel.com/v1/Accounts/<your_sid>/Sms/send',
  method: 'POST',
  form: {
    From: 'EXOTEL',
    To: '+919876543210',
    Body: 'Your OTP is 123456',
    DltEntityId: '1234567890',
    DltTemplateId: '9876543210'
  }
};

request(options, function (error, response, body) {
  if (!error) {
    console.log(body);
  }
});
```

### Python

```python
import requests

data = {
    'From': 'EXOTEL',
    'To': '+919876543210',
    'Body': 'Your OTP is 123456',
    'DltEntityId': '1234567890',
    'DltTemplateId': '9876543210'
}

response = requests.post(
    'https://<your_api_key>:<your_api_token>@api.exotel.com/v1/Accounts/<your_sid>/Sms/send',
    data=data
)

print(response.json())
```

### PHP

```php
<?php
$data = array(
    'From' => 'EXOTEL',
    'To' => '+919876543210',
    'Body' => 'Your OTP is 123456',
    'DltEntityId' => '1234567890',
    'DltTemplateId' => '9876543210'
);

$response = Requests::post(
    'https://<your_api_key>:<your_api_token>@api.exotel.com/v1/Accounts/<your_sid>/Sms/send',
    array(),
    $data
);
?>
```

### Ruby

```ruby
require 'net/http'
require 'uri'

uri = URI.parse('https://<your_api_key>:<your_api_token>@api.exotel.com/v1/Accounts/<your_sid>/Sms/send')
request = Net::HTTP::Post.new(uri)
request.set_form_data(
  'From' => 'EXOTEL',
  'To' => '+919876543210',
  'Body' => 'Your OTP is 123456',
  'DltEntityId' => '1234567890',
  'DltTemplateId' => '9876543210'
)

response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
  http.request(request)
end

puts response.body
```

## Response

```json
{
  "SMSMessage": {
    "Sid": "sms_sid_value",
    "AccountSid": "your_sid",
    "From": "EXOTEL",
    "To": "+919876543210",
    "Body": "Your OTP is 123456",
    "Status": "queued",
    "DateCreated": "2024-01-15 10:30:00",
    "DateUpdated": "2024-01-15 10:30:00",
    "DateSent": null,
    "Price": null,
    "Uri": "/v1/Accounts/your_sid/SMS/Messages/sms_sid_value"
  }
}
```

## Response Fields

| Field         | Type     | Description |
|---------------|----------|-------------|
| `Sid`         | String   | Unique SMS identifier |
| `AccountSid`  | String   | Your Exotel account SID |
| `From`        | String   | Sender ID or ExoPhone |
| `To`          | String   | Recipient number |
| `Body`        | String   | Message content |
| `Status`      | String   | Current SMS status (see [Status Codes](/docs/sms-api/api-reference/status-codes)) |
| `DateCreated` | DateTime | When the request was received |
| `DateSent`    | DateTime | When the SMS was sent to the operator |
| `Price`       | Double   | Amount charged |

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200  | Request accepted successfully |
| 400  | Bad request — missing or invalid parameters |
| 401  | Authentication failed |
| 403  | Forbidden — insufficient permissions |
| 429  | Rate limit exceeded |
| 500  | Internal server error |

:::note
A 200 response means the SMS request was accepted, not that it was delivered. Use the `StatusCallback` webhook or the [SMS Details](/docs/sms-api/api-reference/sms-details) endpoint to confirm delivery.
:::
