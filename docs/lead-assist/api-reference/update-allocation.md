---
id: update-allocation
title: Update Party Numbers & Pins
description: Update party numbers, pins, and usage in an existing active allocation via the Exotel Lead Assist API.
sidebar_label: Update Party Numbers & Pins
---

# Update Party Numbers & Pins

This API allows to update following parameters in an existing **active** allocation:

- A-party numbers
- B-party numbers
- A-party pins
- B-party pins
- Usage (can be changed from 'oneway' to 'twoway' and vice versa)

Other parameters will be inherited from the original allocation.

In the Update API request body, make sure that at least one of the A-party number or B-party number, is present.

A-party pin, B-party pin and usage are optional parameters and should be passed if intended to update.

:::info Pricing
The Update API will be charged equivalent to that of a new allocation, as per the price plan. At the time of deallocation, the duration will be computed from the time of original allocation and charged as per the price plan. Deallocation policy can not be overruled with the update API.
:::

```
PUT https://leadassist.exotel.in/v1/tenants/<your_sid>/greenvn/<greenvn_id>/call-party
```

Replace `<your_sid>` with your tenant ID.

Please refer [Create an Allocation](/docs/lead-assist/api-reference/create-allocation) (POST) API for details on request parameters.

## Example Request

```bash
curl --location --request PUT 'https://<your_api_key>:<your_api_token>@leadassist.exotel.in/v1/tenants/<your_sid>/greenvn/<greenvn_id>/call-party' \
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
