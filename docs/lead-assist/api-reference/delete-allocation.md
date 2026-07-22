---
id: delete-allocation
title: Delete an Allocation
description: Delete a VN allocation to remove the mapping from the GreenVN via the Exotel Lead Assist API.
sidebar_label: Delete Allocation
---

# Delete an Allocation

A de-allocation request removes the mapping from the VN.

```
DELETE https://leadassist.exotel.in/v1/tenants/<your_sid>/greenvn/<greenvn_id>
```

Replace `<your_sid>` with your tenant ID and `<greenvn_id>` with the same received in the allocation request.

## Example Request

```bash
curl -X DELETE https://leadassist.exotel.in/v1/tenants/<your_sid>/greenvn/<greenvn_id>
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
    "state": "vault",
    "green_vn": "+918012345678",
    "greenvn_id": "123456"
  }
}
```

The parameters in the above request are same as described in the response of the allocation request.
