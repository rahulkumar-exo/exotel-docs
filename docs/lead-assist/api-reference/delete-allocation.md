---
id: delete-allocation
title: Delete Allocation
description: Delete a GreenPIN allocation to remove the PIN-mapping between users and a virtual number via the Exotel Lead Assist API.
sidebar_label: Delete Allocation
---

# Delete Pin Allocation

Delete a GreenPin allocation, removing the PIN-mapping between users and the assigned virtual number.

## HTTP Request

```
DELETE https://leadassist.exotel.in/v1/tenants/<tenant_id>/greenpin/<greenpin_id>
```

## Path Parameters

| Parameter | Description |
|-----------|-------------|
| `greenpin_id` | The unique identifier of the GreenPin allocation to delete |

## Response

Returns a success confirmation upon deletion.

:::info Virtual Number Charges
For the Lead Assist GreenVN solution, there are **no charges** for virtual numbers associated with your account pool. Other virtual numbers may incur monthly rental fees.
:::
