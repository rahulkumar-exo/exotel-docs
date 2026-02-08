---
id: call-details
title: Call Details
sidebar_label: Call Details
---

# Get Call Details (v1)

Retrieve details of a specific call or bulk call records.

## Single Call Details

```
GET /v1/Accounts/<account_sid>/Calls/<CallSid>
```

Returns detailed information about a specific call.

## Bulk Call Details

```
GET /v1/Accounts/<account_sid>/Calls
```

### Query Parameters

| Parameter | Description |
|-----------|-------------|
| `StartTime` | Filter calls after this time |
| `EndTime` | Filter calls before this time |
| `Status` | Filter by call status |
| `PageSize` | Number of records per page |

## Number Metadata

```
GET /v1/Accounts/<account_sid>/Numbers/<phone_number>
```

Returns telecom circle, operator, number type, and DND status for an Indian phone number.
