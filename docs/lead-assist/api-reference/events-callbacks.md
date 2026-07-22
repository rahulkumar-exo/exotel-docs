---
id: events-callbacks
title: Events Call Backs
description: Event callbacks triggered by ExoBridge for calls, deallocations, and PIN verification events on Lead Assist allocations.
sidebar_label: Events Call Backs
---

# Events Call Backs

There are multiple call backs that ExoBridge solution provides for the events happening on the allocation.

## Call Event

On every call that happens in an allocation, ExoBridge will make a HTTP POST request to the specified endpoint with the call details. The HTTP body will consist of the following parameters as shown below:

:::info
Note: Additionally call parameters as per Exotel will be included in this event.

Please visit our [Support Article](http://support.exotel.in/support/solutions/articles/48283-working-with-passthru-applet) for more details.
:::

| Parameter Name | Type & Value |
|---|---|
| `connection_id` | connection_id that was part of the request. |
| `call_sid` | string; an alpha-numeric unique identifier of the call |
| `greenvn` | The VN on which the call landed. |
| `greenvn_id` | The unique identifier of the allocation. |
| `from` | The phone number that is calling into the allocation |
| `to` | The phone number that is being called out by the VN |
| `call_type` | This is the same as call type parameter passed in passthru applet. [Read here](https://support.exotel.com/support/solutions/articles/48283-working-with-passthru-applet). |
| `start_time` | Time in format YYYY-MM-DD HH:mm:ss; Start time of the call. |
| `current_time` | Time in format YYYY-MM-DD HH:mm:ss; Current time |
| `dial_call_duration` | Duration of the second leg of the call in seconds |
| `recording_url` | Link to the recording of the call conversation if enabled. |
| `dial_call_status` | Second leg status |

### Sample Response

```json
{
  "start_time": "2021-01-19T19:17:03+50:30",
  "direction": "incoming",
  "source": "exotel",
  "dial_call_duration": "32",
  "connection_id": "YOUR_CONNECTION_ID",
  "dial_call_status": "completed",
  "greenvn": "+91804XXXX513",
  "recording_url": "https://s3-ap-southeast-1.amazonaws.com/exotelrecordings/<your_sid>/CALL_SID.mp3",
  "on_call_duration": 27,
  "greenvn_id": "d12638b6-28b8-488d-8cf3-c60619ac2280",
  "call_type": "completed",
  "call_sid": "53fa8e40bb1XXXXXXXXXX257c439151k",
  "to": "+91776XXXX969",
  "current_time": "2021-01-19T19:17:44+50:30",
  "from": "+91959XXXX342"
}
```

## Call Event with Call Insights Enabled

In addition to the above parameters, ExoBridge will pass Call Insights data if a client chooses to subscribe to them. Please refer to this [Support Article](https://support.exotel.com/support/solutions/articles/3000102851-call-insights-private-beta-) to get additional details. The below sample response shows the additional 'insights' nested JSON block that will be included when a client subscribes to Call Insights. Please reach out to your Account Manager to get it enabled.

### Sample Response

```json
{
  "start_time": "2021-09-24 07:05:28",
  "insights": {
    "DisconnectedBy": "Caller",
    "Status": "completed",
    "DetailedStatus": "CALL_COMPLETED",
    "RingingDuration": "4.58"
  },
  "direction": "incoming",
  "source": "monotel",
  "dial_call_duration": "11",
  "connection_id": "Sample_ID",
  "dial_call_status": "completed",
  "greenvn": "+9120XXXXX531",
  "on_call_duration": 4,
  "recording_url": "null",
  "greenvn_id": "6360bbb7-XXXX-410c-XXXX-0c6ec70cc442",
  "call_type": "completed",
  "call_sid": "8a4d92198hy678hgt0fd9c1f2063159o",
  "to": "+9198XXXXX940",
  "current_time": "2021-09-24 07:05:44",
  "from": "+91XXXXX99814"
}
```

## Deallocation Callback Event

When deallocation of GreenVN is triggered via the deallocation policy as defined in the Allocation API, this callback will be triggered to let the user know that the deallocation has happened. The callback will NOT be triggered if the user calls the deallocation API manually.

| Parameter | Description |
|---|---|
| `connection_id` | connection_id that was part of the request |
| `greenvn` | The VN that is allocated |
| `greenvn_id` | The unique identifier of the allocation. |
| `usage` | usage as provided in allocation API (default twoway) |
| `aparty_numbers` | List of aparty numbers as provided in allocation api |
| `bparty_numbers` | List of bparty numbers as provided in allocation api |
| `aparty_pins` | List of aparty pins as provided in allocation api |
| `bparty_pins` | List of bparty pins as provided in allocation api |
| `state` | This is the current state of the allocation which can have the following values:<br/>- "active" - The state when the allocation is active<br/>- "vault" - The state when the allocation was deallocated |

### Sample Response

```json
{
  "connection_id": "YOUR_CONNECTION_ID",
  "aparty_numbers": [
    "+917317678172"
  ],
  "bparty_numbers": [
    "+918400047000"
  ],
  "aparty_pins": [null],
  "bparty_pins": [null],
  "usage": "twoway",
  "state": "vault",
  "greenvn": "+91983XXXX195",
  "greenvn_id": "fffe1797-b738-483f-a5a6-757ddfb15e78"
}
```

## Successful Verification Event

If an unregistered caller calls a VN, he will be prompted to enter the pin number. If the user identifies himself with the correct pin, we connect him to the other party. This will trigger an HTTP POST request to a specified endpoint with the HTTP body containing the following parameters.

| Parameter Name | Type & Value |
|---|---|
| `connection_id` | connection id to which the new user has been added. |
| `greenvn` | the VN to which the new user has been added. |
| `greenvn_id` | the unique identifier of the allocation to which the user has been added |
| `caller` | the phone number of the new user. |
| `pin` | Pin entered by the user. |

### Sample Response

```json
{
  "caller": "+917XXXXX6144",
  "greenvn_id": "XXXXXe3-105f-4fba-89c0-7842df249313",
  "greenvn": "+91629XXXXX71",
  "connection_id": "order-id",
  "pin": "4321"
}
```

## Failed Verification Event

If an unregistered caller fails to verify himself (incorrect pin entry etc.), a failed verification event is triggered.

| Parameter Name | Type & Value |
|---|---|
| `call_sid` | Unique identifier of the call made by the caller to the VN |
| `greenvn` | The GreenVN to which the caller called |
| `start_time` | Time in format YYYY-MM-DD HH:mm:ss; Start time of the call. |
| `caller` | The phone number of the new user. |
| `pin` | Pin entered by the user. |

### Sample Response

```json
{
  "start_time": "2021-11-09T10:09:15+05:30",
  "caller": "+917XXXXX6144",
  "greenvn": "+9162921XXXXX",
  "call_sid": "XXXXfdea48XXX49bd4b700fce9d165p",
  "pin": "1234"
}
```

## Appendix 1 — Status Codes

| Status Code | Description | HTTP Code |
|---|---|---|
| 0 | Internal Service Error | 500 |
| 1 | Could not find the given GreenVN | 404 |
| 2 | One or more unsupported search filters provided | 400 |
| 3 | One or more mandatory parameters not present in request | 400 |
| 4 | No free GreenVNs are available for allocation | 452 |
| 5 | Bad or missing parameters in Request | 400 |
| 7 | Authentication not provided or failed | 401 |
| 8 | Not permitted to do this operation. | 403 |
| 9 | Version header not specified or supported for this API | 400 |
| 13 | All numbers in the group are duplicates | 409 |
| 14 | a-party numbers and b-party numbers cannot contain the same number for an allocation. | 409 |
| 15 | The region code specified is not supported | 403 |
| 16 | Invalid Number Received. | 400 |
| 17 | Too many allocation requests in bulk. | 413 |
| 18 | Allocation exists for this connection id | 409 |
| 19 | One or more of the numbers is already registered with another pin | 409 |
| 20 | Group and number mapping doesn't exist | 404 |
| 22 | This greenvn is already deleted | 410 |
| 23 | An invalid date range was provided in the query | 400 |
| 50 | An invalid call flow is configured | 422 |
