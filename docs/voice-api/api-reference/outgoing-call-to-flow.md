---
id: outgoing-call-to-flow
title: Outgoing Call to a Call Flow
sidebar_label: Call to Flow
sidebar_position: 2
---

# Outgoing Call to a Call Flow

Make an outbound call and connect the recipient to an IVR flow or applet instead of another phone number. The `From` number is called first, and once they answer, they are routed to the specified call flow.

## Endpoint

```
POST https://<api_key>:<api_token><subdomain>/v1/Accounts/<account_sid>/Calls/connect
```

## Request Parameters

| Parameter          | Required  | Type   | Description |
|--------------------|-----------|--------|-------------|
| `From`             | Mandatory | String | The phone number to call. Preferably in E.164 format. For landlines, prefix with STD code. |
| `CallerId`         | Mandatory | String | Your ExoPhone (virtual number) from the Exotel dashboard. |
| `Url`              | Mandatory | String | The call flow URL. Format: `http://my.exotel.com/{your_sid}/exoml/start_voice/{app_id}` where `app_id` is the flow/applet ID. |
| `CallType`         | Optional  | String | Set to `trans` for transactional calls. |
| `TimeLimit`        | Optional  | Integer | Maximum call duration in seconds. Max: `14400` (4 hours). |
| `TimeOut`          | Optional  | Integer | Ring timeout in seconds for both call legs. |
| `StatusCallback`   | Optional  | String | Webhook URL that receives CallSid, Status, RecordingUrl, DateUpdated when the call completes. |
| `CustomField`      | Optional  | String | Custom data passed to Passthru or Greeting applets. |

## Code Examples

### cURL

```bash
curl -X POST https://<your_api_key>:<your_api_token>@api.exotel.com/v1/Accounts/<your_sid>/Calls/connect \
  -d "From=09876543210" \
  -d "CallerId=0XXXXXX4890" \
  -d "Url=http://my.exotel.com/<your_sid>/exoml/start_voice/926"
```

### Node.js

```javascript
const request = require('request');

const options = {
  url: 'https://<your_api_key>:<your_api_token>@api.exotel.com/v1/Accounts/<your_sid>/Calls/connect',
  method: 'POST',
  form: {
    From: '09876543210',
    CallerId: '0XXXXXX4890',
    Url: 'http://my.exotel.com/<your_sid>/exoml/start_voice/926'
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
    'From': '09876543210',
    'CallerId': '0XXXXXX4890',
    'Url': 'http://my.exotel.com/<your_sid>/exoml/start_voice/926'
}

response = requests.post(
    'https://<your_api_key>:<your_api_token>@api.exotel.com/v1/Accounts/<your_sid>/Calls/connect',
    data=data
)

print(response.json())
```

### PHP

```php
<?php
$data = array(
    'From' => '09876543210',
    'CallerId' => '0XXXXXX4890',
    'Url' => 'http://my.exotel.com/<your_sid>/exoml/start_voice/926'
);

$ch = curl_init('https://<your_api_key>:<your_api_token>@api.exotel.com/v1/Accounts/<your_sid>/Calls/connect');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
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

uri = URI.parse('https://<your_api_key>:<your_api_token>@api.exotel.com/v1/Accounts/<your_sid>/Calls/connect')
request = Net::HTTP::Post.new(uri)
request.set_form_data(
  'From' => '09876543210',
  'CallerId' => '0XXXXXX4890',
  'Url' => 'http://my.exotel.com/<your_sid>/exoml/start_voice/926'
)

response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
  http.request(request)
end

puts response.body
```

## Response

```json
{
  "Call": {
    "Sid": "80bfbec2d78bbbf10fb851f4fa165211",
    "ParentCallSid": null,
    "DateCreated": "2017-03-03 12:30:24",
    "DateUpdated": "2017-03-03 12:30:27",
    "AccountSid": "your_sid",
    "To": "0XXXXX40682",
    "From": "09876543210",
    "PhoneNumberSid": "0XXXXXX4890",
    "Status": "in-progress",
    "StartTime": "2017-03-03 12:30:27",
    "EndTime": null,
    "Duration": null,
    "Price": null,
    "Direction": "outbound-api",
    "AnsweredBy": null,
    "ForwardedFrom": null,
    "CallerName": null,
    "Uri": "/v1/Accounts/your_sid/Calls.json/80bfbec2d78bbbf10fb851f4fa165211",
    "RecordingUrl": null
  }
}
```

## Response Fields

| Field            | Type     | Description |
|------------------|----------|-------------|
| `Sid`            | String   | Unique alpha-numeric call identifier |
| `DateCreated`    | DateTime | When the API request was initiated |
| `DateUpdated`    | DateTime | Last status update timestamp |
| `AccountSid`     | String   | Your Exotel Account SID |
| `To`             | String   | The destination phone number |
| `From`           | String   | The number called first |
| `PhoneNumberSid` | String   | The ExoPhone used for the call |
| `Status`         | String   | `queued`, `in-progress`, `completed`, `failed`, `busy`, `no-answer` |
| `StartTime`      | DateTime | When the call request was sent to the operator |
| `EndTime`        | DateTime | When the call ended |
| `Duration`       | Integer  | Call duration in seconds |
| `Price`          | Double   | Amount charged (INR/USD) |
| `Direction`      | String   | `inbound`, `outbound-dial`, `outbound-api` |
| `RecordingUrl`   | String   | URL to the call recording (if enabled) |

:::note
A `200 OK` response means the request was accepted — it does not confirm the call was successfully delivered. Use [StatusCallback](/docs/voice-api/api-reference/status-callback) or the [Call Details API](/docs/voice-api/api-reference/call-details) to verify the final call status.
:::
