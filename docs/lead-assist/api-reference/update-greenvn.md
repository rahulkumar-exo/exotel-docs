---
id: update-greenvn
title: Update GreenVN in an Allocation
description: Update the GreenVN assigned to an existing active allocation via the Exotel Lead Assist API.
sidebar_label: Update GreenVN
---

# Update GreenVN in an Allocation

This API allows to update GreenVN in an existing **active** allocation.

While placing the request for the new VN, the number and the region can also be provided as a preference. If requested, without a request body, ExoBridge system will allocate an available number from the VN pool.

Other parameters will be inherited from the original allocation and passed in the API response.

:::info Pricing
The Update API will be charged equivalent to that of a new allocation, as per the price plan. At the time of deallocation, the duration will be computed from the time of original allocation and charged as per the price plan. Deallocation policy can not be overruled with the update API.
:::

```
PUT https://leadassist.exotel.in/v1/tenants/<your_sid>/greenvn/<greenvn_id>/vn
```

Replace `<your_sid>` with your tenant ID.

Please refer [Create an Allocation](/docs/lead-assist/api-reference/create-allocation) (POST) API for details on request parameters.

## Example Request

```bash
curl --location --request PUT 'https://<your_api_key>:<your_api_token>@leadassist.exotel.in/v1/tenants/<your_sid>/greenvn/<greenvn_id>/vn' \
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

## HTTP Response

- On success, the HTTP response status code will be 200.
- The `connection_id` is the unique identifier of the original allocation, and it will be referred in HTTP body will contain a JSON similar to the one below.

## Example Response on Success

```json
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
