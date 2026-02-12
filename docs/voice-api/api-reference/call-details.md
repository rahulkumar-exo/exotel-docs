---
id: call-details
title: Call Details
sidebar_label: Call Details
sidebar_position: 4
---

# Call Details (v2)

Retrieve detailed information about a specific call made via the Voice v2 (CCM) API.

## Endpoint

```
GET /v2/accounts/<account_sid>/calls/<call_sid>
```

### Regional URLs

| Region | URL |
|--------|-----|
| Singapore | `https://<api_key>:<api_token>@ccm-api.exotel.com/v2/accounts/<account_sid>/calls/<call_sid>` |
| Mumbai | `https://<api_key>:<api_token>@ccm-api.in.exotel.com/v2/accounts/<account_sid>/calls/<call_sid>` |

## Path Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `call_sid` | Yes | The unique call identifier from the Make Call response |

## Code Examples

### cURL

```bash
curl 'https://<api_key>:<api_token>@ccm-api.exotel.com/v2/accounts/<account_sid>/calls/<call_sid>'
```

### Python

```python
import requests

response = requests.get(
    f"https://ccm-api.exotel.com/v2/accounts/{account_sid}/calls/{call_sid}",
    auth=(api_key, api_token)
)

print(response.json())
```

### Node.js

```javascript
const axios = require('axios');

const response = await axios.get(
  `https://ccm-api.exotel.com/v2/accounts/${accountSid}/calls/${callSid}`,
  { auth: { username: apiKey, password: apiToken } }
);

console.log(response.data);
```

## Response

```json
{
  "request_id": "req_abc123",
  "method": "GET",
  "http_code": 200,
  "response": {
    "call_details": {
      "sid": "unique_call_identifier",
      "direction": "outbound-api",
      "virtual_number": "+911234567890",
      "state": "terminal",
      "status": "completed",
      "assigned_agent_details": {
        "user_id": "agent-uuid",
        "contact_uri": "sip:agent@exotel.com"
      },
      "customer_details": {
        "number": "+919876543210"
      },
      "created_time": "2024-06-15T10:30:00.000Z",
      "updated_time": "2024-06-15T10:35:05.000Z",
      "start_time": "2024-06-15T10:30:01.000Z",
      "end_time": "2024-06-15T10:35:00.000Z",
      "total_duration": 300,
      "total_talk_time": 280,
      "recording": {
        "available": true,
        "url": "https://s3-ap-southeast-1.amazonaws.com/.../recording.mp3"
      },
      "custom_field": "ticket_12345",
      "legs": "/v2/accounts/<account_sid>/calls/<call_sid>/legs"
    }
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `sid` | String | Unique call identifier |
| `direction` | String | `inbound`, `outbound-dial`, `outbound-api` |
| `virtual_number` | String | ExoPhone used |
| `state` | String | `active` or `terminal` |
| `status` | String | Call status (see below) |
| `assigned_agent_details` | Object | Agent user_id and contact_uri |
| `customer_details` | Object | Customer phone number |
| `created_time` | DateTime | API request timestamp |
| `updated_time` | DateTime | Last status update |
| `start_time` | DateTime | Call start time |
| `end_time` | DateTime | Call end time |
| `total_duration` | Integer | Total duration in seconds |
| `total_talk_time` | Integer | Customer conversation time in seconds |
| `recording` | Object | Recording availability and URL |
| `custom_field` | String | Custom metadata |
| `legs` | String | URL to fetch call leg details |

## Call States & Statuses

### States

| State | Description |
|-------|-------------|
| `active` | Call is ongoing or post-call processing pending |
| `terminal` | Call completed and all data processed |

### Statuses

| Status | Description |
|--------|-------------|
| `completed` | Call connected and ended normally |
| `agent_unanswered` | Agent did not answer |
| `customer_unanswered` | Customer did not answer |
| `agent_canceled` | Agent canceled the call |
| `customer_no_dial` | Could not dial customer |
| `agent_no_dial` | Could not dial agent |
