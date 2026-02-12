---
id: outgoing-call-to-flow
title: Outgoing Call to a Call Flow
sidebar_label: Call to Flow
---

# Outgoing Call to a Call Flow

Make an outbound call and connect the recipient to an IVR flow or applet instead of another phone number. The `From` number is called first, and once they answer, they are routed to the specified call flow.

## Endpoint

```
POST /v1/Accounts/<your_sid>/Calls/connect
```

### Regional URLs

| Region | URL |
|--------|-----|
| Singapore | `https://<api_key>:<api_token>@api.exotel.com/v1/Accounts/<your_sid>/Calls/connect` |
| Mumbai | `https://<api_key>:<api_token>@api.in.exotel.com/v1/Accounts/<your_sid>/Calls/connect` |

## Request Parameters

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `From` | Yes | String | The phone number to call. Preferably in E.164 format. For landlines, prefix with STD code. |
| `CallerId` | Yes | String | Your ExoPhone (virtual number) from the Exotel dashboard. |
| `Url` | Yes | String | The call flow URL. Format: `http://my.exotel.com/{your_sid}/exoml/start_voice/{app_id}` where `app_id` is the flow/applet ID. |
| `CallType` | No | String | Set to `trans` for transactional calls. |
| `TimeLimit` | No | Integer | Maximum call duration in seconds. Max: `14400` (4 hours). |
| `TimeOut` | No | Integer | Ring timeout in seconds for both call legs. |
| `StatusCallback` | No | String | Webhook URL that receives CallSid, Status, RecordingUrl, DateUpdated when the call completes. |
| `CustomField` | No | String | Custom data passed to Passthru or Greeting applets. |

:::info
The `Url` parameter should point to a call flow (applet) configured in your Exotel dashboard. The `app_id` is the flow ID found in **App Bazaar > My Apps**.
:::

## Code Examples

### cURL

```bash
curl -X POST 'https://<your_api_key>:<your_api_token>@api.exotel.com/v1/Accounts/<your_sid>/Calls/connect' \
  -d 'From=09876543210' \
  -d 'CallerId=0XXXXXX4890' \
  -d 'Url=http://my.exotel.com/<your_sid>/exoml/start_voice/926'
```

### Python

```python
import requests

data = {
    'From': '09876543210',
    'CallerId': '0XXXXXX4890',
    'Url': 'http://my.exotel.com/<your_sid>/exoml/start_voice/926',
    'CallType': 'trans',
    'StatusCallback': 'https://yoururl.com/callback'
}

response = requests.post(
    'https://<your_api_key>:<your_api_token>@api.exotel.com/v1/Accounts/<your_sid>/Calls/connect',
    data=data
)

print(response.json())
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

:::note
When using a flow URL, the `To` field in the response will be the ExoPhone since the destination is a flow rather than a phone number. The call proceeds to the applet after the `From` party answers.
:::

:::note
A `200 OK` response means the request was accepted — it does not confirm the call was successfully delivered. Use [StatusCallback](/docs/voice-v1/api-reference/call-details#status-callback-webhook) or the [Call Details API](/docs/voice-v1/api-reference/call-details) to verify the final call status.
:::
