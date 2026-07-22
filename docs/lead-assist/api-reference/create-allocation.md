---
id: create-allocation
title: Create an Allocation
description: Create a VN allocation mapping a-party numbers to b-party numbers using a GreenVN via the Exotel Lead Assist API.
sidebar_label: Create Allocation
---

# Create an Allocation

An allocation request maps a set of numbers (a-party) to another set of numbers (b-party) using a Variable Virtual Number or a GreenVN. Both parties can optionally have pins (any integer number, preferably limited to 6 digits) associated with the allocation to enable new callers (whose numbers were not passed in the allocation request) to join either party at any time by entering the pin when calling for the first time on the VN since it was allocated. If the *usage* parameter is set to *oneway* in the request, only the a-party may call the b-party. For *twoway* usage, both parties can call each other using the GreenVN.

```
POST https://leadassist.exotel.in/v1/tenants/<your_sid>/greenvn
```

Replace `<your_sid>` with your tenant ID. The following are the POST parameters:

| Parameter Name | Mandatory/Optional | Value / Description |
|---|---|---|
| `connection_id` | mandatory | Unique identifier for the specific mapping. This can be any random string. |
| `aparty_numbers` | mandatory | List of numbers in E164 format for one side of the allocation. In the event that the allocation is oneway, only these numbers will be able to connect to the other party. |
| `bparty_numbers` | mandatory | List of numbers in E164 format for the other side of the allocation. In the event that the allocation is two-way, these numbers can connect to the a_party using the greenvn. |
| `aparty_pins` | optional | List of pins to be used for unregistered aparty_caller. This can be any positive integer. We recommend using 4 digit UNIQUE pins. |
| `bparty_pins` | optional | List of pins to be used for unregistered bparty_caller. This can be any positive integer. We recommend using 4 digit UNIQUE pins. |
| `usage` | mandatory | "oneway" allocations only permit a-party callers to talk to the b-party. "twoway" allocations permit both sides to call the other. |
| `strictness` | optional | If strictness is true, the allocation only performed if all specified conditions are met. This includes the preferred greenvn, region, and number type. If strictness is off, a number is returned which satisfies most maximum possible preferences. The default value is false. |
| `preferences` | optional | preferences are a set of preferred options that the returned greenvn should satisfy.<br/>- **greenvn** (optional): To request a specific number to be allocated.<br/>- **region** (optional): To request a greenvn that belongs to a specific region. Valid values are: DL, MU, MH, WB, AP, TN, GJ, KA, KL, RJ, MP<br/>- **pin_code** (optional): To request a greenvn that belongs to one of the above regions, a pin code can be passed. Please note: If a pin code belongs to a region not present in the above list, we will return a VN from a region in the list that is closest to the passed pin code.<br/>- **type** (optional): To request either a "mobile" or "landline" number as greenvn.<br/><br/>These can be satisfied based on the available greenvn's in the account. |
| `deallocation_policy` (optional) | optional | This parameter is used to schedule an automatic deallocation. If not set, default deallocation period (as in configuration) is used.<br/>- **duration**: Duration can be specified in any unit (d, m, s) Eg: "20s". If not set, default deallocation period configured in your account is used. |
| `flow_id` | optional* | A unique identifier of the call flow, which is required to be associated with the VN, at the time of allocation.<br/><br/>*It is required in the allocation request, if there are multiple call flows created at the account level and the expectation is to associate a particular call flow to the allocated VN. |

## Example Request

```bash
curl -X POST \
  https://leadassist.exotel.in/v1/tenants/<your_sid>/greenvn \
  -H 'Authorization: Basic <your Auth string which is Base64 encoded version of "username:Password">' \
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

## HTTP Response

- On success, the HTTP response status code will be 200.
- The `connection_id` is the unique identifier of the allocation, and it will be referred in HTTP body will contain a JSON similar to the one below.

## Example Response on Success

```json
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

## Example Response on Error

```json
{
  "success": false,
  "status": 409,
  "code": 18,
  "message": "Allocation exists for this connection id.",
  "data": null
}
```

## Response Parameters

| Parameter Name | Type & Value |
|---|---|
| `success` | true or false. This shows whether the request succeeded or not. |
| `status` | HTTP response code of your request.<br/>200: Successfully allocated<br/>400: Bad Request (for example when deallocation request is sent after deallocation has already happened)<br/>402: Unauthorized Request<br/>429: Throttle limit exceeded<br/>499: Response timeout exceeded |
| `data` | JSON array representing the response and contains the below parameters:<br/>- **connection_id**: same string as passed in the allocation request<br/>- **aparty_numbers**: array containing the phone numbers mapped (in E164 format) as the A party of the connection<br/>- **bparty_numbers**: array containing the phone numbers mapped (in E164 format) as the B party of the connection<br/>- **usage**: "oneway" or "twoway" as defined in the allocation request<br/>- **green_vn**: The Exophone number (in E164 format) allocated to this request<br/>- **greenvn_id**: Unique identifier for the allocation. This is required for getting details of the allocation and deallocating<br/>- **flow_id** (optional): A unique identifier of the call flow associated to the allocated VN. It will be present in the response only if this parameter is passed in the request. |
| `code` | number: This parameter only comes in case of an error where the status returned is non-200. The list of possible error codes are as below:<br/>0: Internal Service Error<br/>1: GreenVN not found<br/>2: Unsupported search filters<br/>3: One or more Mandatory parameters missing<br/>4: No free green VN unable allocate<br/>5: Bad or missing parameters in request<br/>7: Authentication failed or not provided<br/>8: Permission denied to do this operation<br/>9: Unsupported denied<br/>13: Duplicate Filter Failed<br/>14: Duplicate in request<br/>15: Region not supported<br/>16: Invalid number<br/>17: Too many requests<br/>18: Duplicate connection ID<br/>19: Duplicate in group |
| `state` | This is the current state of the allocation which can have the following values:<br/>- "active" - This is the state when the allocation is active<br/>- "vault" - This is the state when the allocation was deallocated |
