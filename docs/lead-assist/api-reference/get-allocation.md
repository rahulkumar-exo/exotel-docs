---
id: get-allocation
title: Get Details of an Allocation
description: Retrieve the details of an existing VN allocation using the Exotel Lead Assist API.
sidebar_label: Get Allocation
---

# Get Details of an Allocation

The details of an allocation can be retrieved using this method.

```
GET https://leadassist.exotel.in/v1/tenants/<your_sid>/greenvn/<greenvn_id>
```

Replace `<your_sid>` with your tenant ID and `<greenvn_id>` with the same received in the allocation request.

## Example Request

```bash
curl -X GET https://leadassist.exotel.in/v1/tenants/<your_sid>/greenvn/<greenvn_id>
```

## HTTP Response

- On success, the HTTP response status code will be 200.
- The HTTP response body will contain a JSON similar to the one below.

## Example Response

```json
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

The parameters in the above request are the same as described in the response of the allocation request.
