---
title: Call Details & Bulk Calls
id: call-details
sidebar_label: Call Details
---
# Call Details API (v1)

#### test Retrieve details of a specific call, or query bulk call records with filters.

## Single Call Details

```
GET /v1/Accounts/<your_sid>/Calls/<CallSid>
```

### Optional Query Parameter

| Parameter | Description                                    |
| --------- | ---------------------------------------------- |
| `details` | Set to `true` to include leg-level information |

### Example Request

```bash
curl 'https://<api_key>:<api_token>@api.exotel.com/v1/Accounts/<your_sid>/Calls/<CallSid>.json?details=true'
```

### Response (with details=true)

```json
{
  "Call": {
    "Sid": "b6cfaf5f5cef3ca0fc937749ef96d245",
    "ParentCallSid": null,
    "DateCreated": "2017-03-03 10:48:33",
    "DateUpdated": "2017-03-03 10:53:33",
    "AccountSid": "your_sid",
    "To": "0XXXXX38847",
    "From": "0XXXXX30240",
    "PhoneNumberSid": "0XXXXXX4890",
    "Status": "completed",
    "StartTime": "2017-03-03 10:48:33",
    "EndTime": "2017-03-03 10:49:50",
    "Duration": "17",
    "Price": "1.500",
    "Direction": "outbound-api",
    "AnsweredBy": null,
    "RecordingUrl": "https://s3-ap-southeast-1.amazonaws.com/.../recording.mp3",
    "Details": {
      "ConversationDuration": 8,
      "Leg1Status": "completed",
      "Leg2Status": "completed",
      "Legs": [
        {
          "Leg": {
            "Id": 1,
            "OnCallDuration": 21
          }
        },
        {
          "Leg": {
            "Id": 2,
            "OnCallDuration": 8
          }
        }
      ]
    }
  }
}
```

- - -

## Bulk Call Details

```
GET /v1/Accounts/<your_sid>/Calls
```

### Query Filters

| Parameter              | Type    | Description                                       |
| ---------------------- | ------- | ------------------------------------------------- |
| `Sid`                  | String  | Single or comma-separated call SIDs (max 100)     |
| `DateCreated`          | Range   | `gte:2019-01-01 00:00:00;lte:2019-01-31 23:59:59` |
| `To`                   | String  | E.164 format, max 5 comma-separated numbers       |
| `From`                 | String  | E.164 format, max 5 comma-separated numbers       |
| `Status`               | String  | `completed`, `failed`, `busy`, `no-answer`        |
| `Duration`             | Range   | `gte:10s;lte:45s` or `eq:30s`                     |
| `Price`                | Range   | `gte:0.10;lte:1.0`                                |
| `Direction`            | String  | `inbound`, `outbound-dial`, `outbound-api`        |
| `PhoneNumber`          | String  | Virtual number, max 5 comma-separated             |
| `PageSize`             | Integer | Default 50, max 100                               |
| `SortBy`               | String  | `DateCreated:asc` (default: `desc`)               |
| `Before`               | String  | Cursor from `PrevPageUri`                         |
| `After`                | String  | Cursor from `NextPageUri`                         |
| `RecordingUrlValidity` | Integer | 5–60 minutes for pre-signed recording URL         |

### Example Request

```bash
curl 'https://<api_key>:<api_token>@api.exotel.com/v1/Accounts/<your_sid>/Calls.json?DateCreated=gte:2019-12-03+00:00:00%3Blte:2019-12-04+00:00:00&Status=completed&PageSize=20'
```

### Response

```json
{
  "Metadata": {
    "Total": 1027,
    "PageSize": 20,
    "FirstPageUri": "/v1/Accounts/<sid>/Calls.json?...",
    "PrevPageUri": "/v1/Accounts/<sid>/Calls.json?Before=abc...",
    "NextPageUri": "/v1/Accounts/<sid>/Calls.json?After=xyz..."
  },
  "Calls": [
    {
      "Sid": "c5797dcbaaeed7678c4062a4a3ed2f8a",
      "DateCreated": "2019-12-03 10:48:33",
      "Status": "completed",
      "Duration": "45",
      "Price": "1.500",
      "Direction": "outbound-api",
      "To": "0XXXXX38847",
      "From": "0XXXXX30240",
      "RecordingUrl": "https://..."
    }
  ]
}
```

:::note

* Query up to **6 months** of historical data with a maximum **1-month range** per request.
* Use cursor-based pagination (`Before`/`After` from `PrevPageUri`/`NextPageUri`) for large result sets.
  :::

- - -

## Number Metadata

Get telecom circle, operator, number type, and DND status for an Indian phone number.

```
GET /v1/Accounts/<your_sid>/Numbers/<phone_number>
```

### Example Request

```bash
curl 'https://<api_key>:<api_token>@api.exotel.com/v1/Accounts/<your_sid>/Numbers/0XXXXX30240.json'
```

### Response

```json
{
  "Numbers": {
    "PhoneNumber": "0XXXXX30240",
    "Circle": "GJ",
    "CircleName": "Gujarat Telecom Circle",
    "Type": "Mobile",
    "Operator": "R",
    "OperatorName": "Reliance",
    "DND": "Yes"
  }
}
```

### Circle Codes (India)

| Code | Circle           |      |                |      |                 |
| ---- | ---------------- | ---- | -------------- | ---- | --------------- |
| `AP` | Andhra Pradesh   | `AS` | Assam          | `BR` | Bihar           |
| `CH` | Chennai          | `DL` | Delhi          | `GJ` | Gujarat         |
| `HP` | Himachal Pradesh | `HR` | Haryana        | `JK` | Jammu & Kashmir |
| `KL` | Kerala           | `KA` | Karnataka      | `KO` | Kolkata         |
| `MH` | Maharashtra      | `MP` | Madhya Pradesh | `MU` | Mumbai          |
| `NE` | North East       | `OR` | Orissa         | `PB` | Punjab          |
| `RJ` | Rajasthan        | `TN` | Tamil Nadu     | `UE` | UP (East)       |
| `UW` | UP (West)        | `WB` | West Bengal    |      |                 |

### Operator Codes

| Code | Operator      |     |          |      |        |
| ---- | ------------- | --- | -------- | ---- | ------ |
| `A`  | Airtel        | `V` | Vodafone | `I`  | Idea   |
| `VI` | Vodafone-Idea | `R` | Reliance | `B`  | BSNL   |
| `MT` | MTNL          | `T` | Tata     | `AL` | Aircel |

- - -

## Status Callback Webhook

When you set `StatusCallback` while making a call, Exotel sends a POST to your URL with these parameters:

| Parameter              | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `CallSid`              | Unique call identifier                         |
| `DateUpdated`          | Last update timestamp                          |
| `Status`               | `completed`, `failed`, `busy`, `no-answer`     |
| `RecordingUrl`         | Recording link (if recording enabled)          |
| `EventType`            | `terminal` or `answered`                       |
| `DateCreated`          | API request timestamp                          |
| `To`                   | Called party number                            |
| `From`                 | Calling party number                           |
| `PhoneNumberSid`       | ExoPhone identifier                            |
| `StartTime`            | Call initiation time                           |
| `EndTime`              | Call completion time                           |
| `ConversationDuration` | Duration both parties were connected (seconds) |
| `Direction`            | `inbound`, `outbound-dial`, `outbound-api`     |
| `CustomField`          | Custom data from original request              |

### Leg Information in Callback

```json
{
  "Legs": [
    {
      "OnCallDuration": 41,
      "Status": "completed",
      "AnsweredBy": "NA"
    },
    {
      "OnCallDuration": 32,
      "Status": "completed",
      "AnsweredBy": "HUMAN"
    }
  ]
}
```

### AnsweredBy Values

| Value     | Description                |
| --------- | -------------------------- |
| `Human`   | Answered by a person       |
| `Machine` | Answered by voicemail/IVR  |
| `NotSure` | Could not determine        |
| `NA`      | Not applicable (first leg) |

## HTTP Status Codes

| Code  | Meaning                          |
| ----- | -------------------------------- |
| `200` | Success                          |
| `400` | Bad Request — Invalid parameters |
| `401` | Unauthorized                     |
| `429` | Rate limit exceeded              |
