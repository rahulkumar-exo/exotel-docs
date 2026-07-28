---
id: manage-allocations
title: Manage VN Allocations
description: Create, retrieve, update, and delete GreenVN virtual number allocations using the Exotel ExoBridge Lead Assist API.
sidebar_label: Manage Allocations
---

# Create an Allocation

An allocation request maps a set of numbers (a-party) to another set of numbers (b-party) using a Variable Virtual Number or a GreenVN. Both parties can optionally have pins (any integer number, preferably limited to 6 digits) associated with the allocation to enable new callers (whose numbers were not passed in the allocation request) to join either party at any time by entering the pin when calling for the first time on the VN since it was allocated. If the `usage` parameter is set to `oneway` in the request, only the a-party may call the b-party. For `twoway` usage, both parties can call each other using the GreenVN.

```
POST https://leadassist.exotel.in/v1/tenants/<your_sid>/greenvn
```

Replace `<your_sid>` with your tenant ID. The following are the POST parameters:

| Parameter Name | Mandatory/Optional | Value / Description |
|---|---|---|
| `connection_id` | mandatory | Unique identifier for the specific mapping. This can be any random string. |
| `aparty_numbers` | mandatory | List of numbers in E164 format for one side of the allocation. In the event that the allocation is oneway, only these numbers will be able to connect to the other party. |
| `bparty_numbers` | mandatory | List of numbers in E164 format for the other side of the allocation. In the event that the allocation is two-way, these numbers can connect to the a-party using the greenvn. |
| `aparty_pins` | optional | List of pins to be used for unregistered aparty_caller. This can be any positive integer. We recommend using 4 digit UNIQUE pins. |
| `bparty_pins` | optional | List of pins to be used for unregistered bparty_caller. This can be any positive integer. We recommend using 4 digit UNIQUE pins. |
| `usage` | mandatory | `"oneway"` allocations only permit a-party callers to talk to the b-party. `"twoway"` allocations permit both sides to call the other. |
| `strictness` | optional | If strictness is true, the allocation is only performed if all specified conditions are met. This includes the preferred greenvn, region, and number type. If strictness is off, a number is returned which satisfies most maximum possible preferences. The default value is false. |
| `preferences` | optional | Preferences are a set of preferred options that the returned greenvn should satisfy. <br/>- `greenvn` (optional): To request a specific number to be allocated. <br/>- `region` (optional): To request a greenvn that belongs to a specific region. Valid values are: DL, MU, MH, WB, AP, TN, GJ, KA, KL, RJ, MP <br/>- `pin_code` (optional): To request a greenvn that belongs to one of the above regions, a pin code can be passed. If a pin code belongs to a region not present in the above list, a VN from the closest supported region is returned. <br/>- `type` (optional): To request either a `"mobile"` or `"landline"` number as greenvn. <br/>These can be satisfied based on the available greenvns in the account. |
| `deallocation_policy` | optional | This parameter is used to schedule an automatic deallocation. If not set, the default deallocation period configured in your account is used. <br/>- `duration`: Duration can be specified in any unit (d, m, s). Eg: `"20s"`. If not set, the default deallocation period configured in your account is used. |
| `flow_id` | optional* | A unique identifier of the call flow, which is required to be associated with the VN at the time of allocation. *It is required in the allocation request if there are multiple call flows created at the account level and the expectation is to associate a particular call flow to the allocated VN. |

**HTTP Response:** On success, the HTTP response status code will be 200. The `connection_id` is the unique identifier of the allocation.

```bash title="Example Request"
curl -X POST \
  https://leadassist.exotel.in/v1/tenants/<your_sid>/greenvn \
  -H 'Authorization: Basic <Base64 encoded username:password>' \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{
    "connection_id": "Sample_Connection",
    "aparty_numbers": [
      "+91917XXX6528"
    ],
    "bparty_numbers": [
      "+9181XXXX6620"
    ],
    "aparty_pins": [
      1234
    ],
    "bparty_pins": [
      2345
    ],
    "strictness": "false",
    "preferences": {
      "pin_code": "560041"
    },
    "usage": "twoway",
    "flow_id": "44XX8X",
    "deallocation_policy": {
      "duration": "600s"
    }
  }'
```

```json title="Example Response on Success"
{
  "success": true,
  "status": 200,
  "code": null,
  "message": null,
  "data": {
    "bparty_numbers": [
      "+9181XXXX6620"
    ],
    "connection_id": "Sample_Connection",
    "greenvn": "+914048212136",
    "state": "active",
    "greenvn_id": "xysysue7-4c2c-b671-d1156d0faf5f",
    "aparty_pins": [
      1234
    ],
    "usage": "twoway",
    "bparty_pins": [
      2345
    ],
    "aparty_numbers": [
      "+91917XXX6528"
    ]
  }
}
```

```json title="Example Response on Error"
{
  "success": false,
  "status": 409,
  "code": 18,
  "message": "Allocation exists for this connection id.",
  "data": null
}
```

**Description of response parameters:**

| Parameter Name | Type & Value |
|---|---|
| `success` | `true` or `false`. Shows whether the request succeeded or not. |
| `status` | HTTP response code of your request: 200 (Successfully allocated), 400 (Bad Request), 402 (Unauthorized Request), 429 (Throttle limit exceeded), 499 (Response timeout exceeded) |
| `data` | JSON object containing: `connection_id`, `aparty_numbers` (array, E164 format), `bparty_numbers` (array, E164 format), `usage` (oneway/twoway), `green_vn` (allocated Exophone in E164 format), `greenvn_id` (unique allocation identifier required for get/deallocation), `flow_id` (optional, present only if passed in request) |
| `code` | Number. Only present on error (non-200). See [Appendix 1](#appendix-1) for error codes. |
| `state` | Current state of the allocation: `"active"` (allocation is active) or `"vault"` (allocation was deallocated) |

---

# Delete an Allocation

A de-allocation request removes the mapping from the VN.

```
DELETE https://leadassist.exotel.in/v1/tenants/<your_sid>/greenvn/<greenvn_id>
```

Replace `<your_sid>` with your tenant ID and `<greenvn_id>` with the ID received in the allocation request.

**HTTP Response:** On success, the HTTP response status code will be 200.

```bash title="Example Request"
curl -X DELETE https://leadassist.exotel.in/v1/tenants/<your_sid>/greenvn/<greenvn_id>
```

```json title="Example Response"
{
  "success": true,
  "status": 200,
  "data": {
    "connection_id": "abcd12345",
    "aparty_numbers": [
      "+000000000000"
    ],
    "bparty_numbers": [
      "+919876543210"
    ],
    "usage": "oneway|twoway",
    "state": "vault",
    "green_vn": "+918012345678",
    "greenvn_id": "123456"
  }
}
```

---

# Get Details of an Allocation

The details of an allocation can be retrieved using this method.

```
GET https://leadassist.exotel.in/v1/tenants/<your_sid>/greenvn/<greenvn_id>
```

**HTTP Response:** On success, the HTTP response status code will be 200.

```bash title="Example Request"
curl -X GET https://leadassist.exotel.in/v1/tenants/<your_sid>/greenvn/<greenvn_id>
```

```json title="Example Response"
{
  "success": true,
  "status": 200,
  "data": {
    "connection_id": "abcd12345",
    "aparty_numbers": [
      "+000000000000"
    ],
    "bparty_numbers": [
      "+919876543210"
    ],
    "usage": "oneway|twoway",
    "state": "active|vault",
    "green_vn": "+918012345678",
    "greenvn_id": "123456"
  }
}
```

The parameters in the above response are the same as described in the response of the [Create an Allocation](#create-an-allocation) request.

---

# Update Party Numbers & Pins

This API allows updating the following parameters in an existing **active** allocation:

- A-party numbers
- B-party numbers
- A-party pins
- B-party pins
- Usage (can be changed from `oneway` to `twoway` and vice versa)

Other parameters will be inherited from the original allocation.

In the Update API request body, at least one of the A-party number or B-party number must be present. A-party pin, B-party pin, and usage are optional parameters and should be passed only if intended to be updated.

:::info Pricing
The Update API will be charged equivalent to that of a new allocation, as per the price plan. At the time of deallocation, the duration will be computed from the time of original allocation and charged as per the price plan. Deallocation policy cannot be overruled with the update API.
:::

```
PUT https://leadassist.exotel.in/v1/tenants/<your_sid>/greenvn/<greenvn_id>/call-party
```

Replace `<your_sid>` with your tenant ID. Please refer to the [Create an Allocation](#create-an-allocation) (POST) API for details on request parameters.

**HTTP Response:** On success, the HTTP response status code will be 200. The `connection_id` is the unique identifier of the original allocation.

```bash title="Example Request"
curl --location --request PUT \
  'https://<your_api_key>:<your_api_token>@leadassist.exotel.in/v1/tenants/<your_sid>/greenvn/<greenvn_id>/call-party' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "aparty_numbers": [
      "+91995xxxx640", "+9199xxxx5641"
    ],
    "bparty_numbers": [
      "+91798xxxx840", "+91798xxxx841"
    ],
    "aparty_pins": [
      12340
    ],
    "bparty_pins": [
      2340
    ],
    "usage": "oneway|twoway"
  }'
```

```json title="Example Response on Success"
{
  "success": true,
  "status": 200,
  "data": {
    "connection_id": "abcd12345",
    "aparty_numbers": [
      "+91995xxxx640", "+9199xxxx5641"
    ],
    "bparty_numbers": [
      "+91798xxxx840", "+91798xxxx841"
    ],
    "aparty_pins": [
      12340
    ],
    "bparty_pins": [
      2340
    ],
    "usage": "oneway|twoway",
    "state": "active",
    "green_vn": "+918012345678",
    "greenvn_id": "123456"
  }
}
```

---

# Update GreenVN

This API allows updating the GreenVN in an existing active allocation.

While placing the request for the new VN, the number and the region can also be provided as a preference. If requested without a request body, the ExoBridge system will allocate an available number from the VN pool.

Other parameters will be inherited from the original allocation and passed in the API response.

:::info Pricing
The Update API will be charged equivalent to that of a new allocation, as per the price plan. At the time of deallocation, the duration will be computed from the time of original allocation and charged as per the price plan. Deallocation policy cannot be overruled with the update API.
:::

```
PUT https://leadassist.exotel.in/v1/tenants/<your_sid>/greenvn/<greenvn_id>/vn
```

Replace `<your_sid>` with your tenant ID. Please refer to the [Create an Allocation](#create-an-allocation) (POST) API for details on request parameters.

**HTTP Response:** On success, the HTTP response status code will be 200.

```bash title="Example Request"
curl --location --request PUT \
  'https://<your_api_key>:<your_api_token>@leadassist.exotel.in/v1/tenants/<your_sid>/greenvn/<greenvn_id>/vn' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "strictness": "false",
    "preferences": {
      "greenvn": "+917205827365",
      "region": "KA",
      "number_type": "landline"
    }
  }'
```

```json title="Example Response on Success"
{
  "success": true,
  "status": 200,
  "data": {
    "connection_id": "abcd12345",
    "aparty_numbers": [
      "+919176226528", "+911234567891"
    ],
    "bparty_numbers": [
      "+918136966620"
    ],
    "usage": "oneway|twoway",
    "state": "active",
    "green_vn": "+917205827365",
    "greenvn_id": "123456"
  }
}
```

---

# Events Call Backs

There are multiple callbacks that the ExoBridge solution provides for events happening on the allocation.

## Call Event

On every call that happens in an allocation, ExoBridge will make an HTTP POST request to the specified endpoint with the call details.

:::info
Additionally, call parameters as per Exotel will be included in this event. Please visit the [Support Article](https://support.exotel.com/support/solutions/articles/48283-working-with-passthru-applet) for more details.
:::

| Parameter Name | Type & Value |
|---|---|
| `connection_id` | `connection_id` that was part of the request. |
| `call_sid` | String; an alpha-numeric unique identifier of the call. |
| `greenvn` | The VN on which the call landed. |
| `greenvn_id` | The unique identifier of the allocation. |
| `from` | The phone number that is calling into the allocation. |
| `to` | The phone number that is being called out by the VN. |
| `call_type` | This is the same as the call type parameter passed in the passthru applet. |
| `start_time` | Time in format `YYYY-MM-DD HH:mm:ss`; Start time of the call. |
| `current_time` | Time in format `YYYY-MM-DD HH:mm:ss`; Current time. |
| `dial_call_duration` | Duration of the second leg of the call in seconds. |
| `recording_url` | Link to the recording of the call conversation if enabled. |
| `dial_call_status` | Second leg status. |

```json title="Sample Response"
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

## Deallocation Callback Event

When deallocation of GreenVN is triggered via the deallocation policy as defined in the Allocation API, this callback will be triggered to let the user know that the deallocation has happened. The callback will **NOT** be triggered if the user calls the deallocation API manually.

| Parameter | Description |
|---|---|
| `connection_id` | `connection_id` that was part of the request. |
| `greenvn` | The VN that is allocated. |
| `greenvn_id` | The unique identifier of the allocation. |
| `usage` | Usage as provided in allocation API (default `twoway`). |
| `aparty_numbers` | List of aparty numbers as provided in allocation API. |
| `bparty_numbers` | List of bparty numbers as provided in allocation API. |
| `aparty_pins` | List of aparty pins as provided in allocation API. |
| `bparty_pins` | List of bparty pins as provided in allocation API. |
| `state` | Current state: `"active"` (allocation is active) or `"vault"` (allocation was deallocated). |

```json title="Sample Response"
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

If an unregistered caller calls a VN, they will be prompted to enter the pin number. If the user identifies with the correct pin, the system connects them to the other party. This triggers an HTTP POST request to a specified endpoint.

| Parameter Name | Type & Value |
|---|---|
| `connection_id` | Connection ID to which the new user has been added. |
| `greenvn` | The VN to which the new user has been added. |
| `greenvn_id` | The unique identifier of the allocation to which the user has been added. |
| `caller` | The phone number of the new user. |
| `pin` | Pin entered by the user. |

```json title="Sample Response"
{
  "caller": "+917XXXXX6144",
  "greenvn_id": "XXXXXe3-105f-4fba-89c0-7842df249313",
  "greenvn": "+91629XXXXX71",
  "connection_id": "order-id",
  "pin": "4321"
}
```

## Failed Verification Event

If an unregistered caller fails to verify (incorrect pin entry etc.), a failed verification event is triggered.

| Parameter Name | Type & Value |
|---|---|
| `call_sid` | Unique identifier of the call made by the caller to the VN. |
| `greenvn` | The GreenVN to which the caller called. |
| `start_time` | Time in format `YYYY-MM-DD HH:mm:ss`; Start time of the call. |
| `caller` | The phone number of the new user. |
| `pin` | Pin entered by the user. |

```json title="Sample Response"
{
  "start_time": "2021-11-09T10:09:15+05:30",
  "caller": "+917XXXXX6144",
  "greenvn": "+9162921XXXXX",
  "call_sid": "XXXXfdea48XXX49bd4b700fce9d165p",
  "pin": "1234"
}
```

---

# Appendix 1

List of status codes and their definition:

| Status Code | Description | HTTP Code |
|---|---|---|
| 0 | Internal Service Error | 500 |
| 1 | Could not find the given GreenVN | 404 |
| 2 | One or more unsupported search filters provided | 400 |
| 3 | One or more mandatory parameters not present in request | 400 |
| 4 | No free GreenVNs are available for allocation | 452 |
| 5 | Bad or missing parameters in Request | 400 |
| 7 | Authentication not provided or failed | 401 |
| 8 | Not permitted to do this operation | 403 |
| 9 | Version header not specified or supported for this API | 400 |
| 13 | All numbers in the group are duplicates | 409 |
| 14 | a-party numbers and b-party numbers cannot contain the same number for an allocation | 409 |
| 15 | The region code specified is not supported | 403 |
| 16 | Invalid Number Received | 400 |
| 17 | Too many allocation requests in bulk | 413 |
| 18 | Allocation exists for this connection id | 409 |
| 19 | One or more of the numbers is already registered with another pin | 409 |
| 20 | Group and number mapping doesn't exist | 404 |
| 22 | This greenvn is already deleted | 410 |
| 23 | An invalid date range was provided in the query | 400 |
| 50 | An invalid call flow is configured | 422 |
