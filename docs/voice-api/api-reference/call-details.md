---
id: call-details
title: Call Details
sidebar_label: Call Details
sidebar_position: 4
---

# Call Details

Retrieve detailed information about a specific call, including status, duration, pricing, and recording URL.

## Endpoint

```
GET https://<api_key>:<api_token><subdomain>/v1/Accounts/<account_sid>/Calls/<CallSid>
```

Append `.json` for JSON response format.

## Path Parameters

| Parameter      | Required  | Description |
|----------------|-----------|-------------|
| `<CallSid>`    | Mandatory | The unique alpha-numeric identifier for the call |

## Query Parameters

| Parameter             | Required | Description |
|-----------------------|----------|-------------|
| `details`             | Optional | Set to `true` to get leg-wise call details |
| `RecordingUrlValidity`| Optional | TTL for the pre-signed recording URL in minutes. Range: `5` to `60`. |

## Code Examples

### cURL

```bash
curl https://<your_api_key>:<your_api_token>@api.exotel.com/v1/Accounts/<your_sid>/Calls/<CallSid>.json
```

### Node.js

```javascript
const request = require('request');

const options = {
  url: 'https://<your_api_key>:<your_api_token>@api.exotel.com/v1/Accounts/<your_sid>/Calls/<CallSid>.json',
  method: 'GET'
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

response = requests.get(
    'https://<your_api_key>:<your_api_token>@api.exotel.com/v1/Accounts/<your_sid>/Calls/<CallSid>.json'
)

print(response.json())
```

### PHP

```php
<?php
$ch = curl_init('https://<your_api_key>:<your_api_token>@api.exotel.com/v1/Accounts/<your_sid>/Calls/<CallSid>.json');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>
```

### Ruby

```ruby
require 'net/http'
require 'uri'

uri = URI.parse('https://<your_api_key>:<your_api_token>@api.exotel.com/v1/Accounts/<your_sid>/Calls/<CallSid>.json')
response = Net::HTTP.get(uri)

puts response
```

## Response

```json
{
  "Call": {
    "Sid": "80bfbec2d78bbbf10fb851f4fa165211",
    "ParentCallSid": null,
    "DateCreated": "2017-03-03 12:30:24",
    "DateUpdated": "2017-03-03 12:35:10",
    "AccountSid": "your_sid",
    "To": "09123456789",
    "From": "09876543210",
    "PhoneNumberSid": "0XXXXXX4890",
    "Status": "completed",
    "StartTime": "2017-03-03 12:30:27",
    "EndTime": "2017-03-03 12:35:10",
    "Duration": 283,
    "Price": 1.5,
    "Direction": "outbound-api",
    "AnsweredBy": null,
    "ForwardedFrom": null,
    "CallerName": null,
    "Uri": "/v1/Accounts/your_sid/Calls.json/80bfbec2d78bbbf10fb851f4fa165211",
    "RecordingUrl": "https://s3-ap-southeast-1.amazonaws.com/...",
    "PreSignedRecordingUrl": "https://s3-ap-southeast-1.amazonaws.com/...?X-Amz-..."
  }
}
```

## Response Fields

| Field                   | Type     | Description |
|-------------------------|----------|-------------|
| `Sid`                   | String   | Unique call identifier |
| `ParentCallSid`         | String   | Parent call SID (for nested calls) |
| `DateCreated`           | DateTime | When the call was created |
| `DateUpdated`           | DateTime | Last status update timestamp |
| `AccountSid`            | String   | Your Exotel Account SID |
| `To`                    | String   | Destination phone number |
| `From`                  | String   | Originating phone number |
| `PhoneNumberSid`        | String   | The ExoPhone used |
| `Status`                | String   | `queued`, `ringing`, `in-progress`, `completed`, `failed`, `busy`, `no-answer` |
| `StartTime`             | DateTime | When the call started ringing |
| `EndTime`               | DateTime | When the call ended |
| `Duration`              | Integer  | Total call duration in seconds |
| `Price`                 | Double   | Amount charged (INR/USD) |
| `Direction`             | String   | `inbound`, `outbound-dial`, `outbound-api` |
| `RecordingUrl`          | String   | Permanent recording URL |
| `PreSignedRecordingUrl` | String   | Time-limited pre-signed AWS recording URL |

## Detailed Call Information

Append `?details=true` to get leg-specific data for multi-party calls:

| Field                  | Type    | Description |
|------------------------|---------|-------------|
| `ConversationDuration` | Integer | Seconds both parties were connected |
| `Leg1Status`           | String  | Status of the first call leg |
| `Leg2Status`           | String  | Status of the second call leg |
| `OnCallDuration`       | Integer | Duration per leg in seconds |

### Call Status Values

| Status        | Description |
|---------------|-------------|
| `queued`      | Call is in the queue |
| `ringing`     | Call is ringing |
| `in-progress` | Call is active |
| `completed`   | Call completed successfully |
| `failed`      | Call failed |
| `busy`        | Called party was busy |
| `no-answer`   | Called party did not answer |

:::note
Duration and pricing fields are updated asynchronously — typically within ~2 minutes after the call ends.
:::
