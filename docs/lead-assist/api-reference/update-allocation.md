---
id: update-allocation
title: Update Allocation
sidebar_label: Update Allocation
---

# Update GreenPin Allocation

Update parameters of an active GreenPin allocation.

:::note Beta
This endpoint is currently in **Beta**.
:::

## HTTP Request

```
PUT https://leadassist.exotel.in/v1/tenants/<tenant_id>/greenpin/<greenpin_id>
```

## Path Parameters

| Parameter | Description |
|-----------|-------------|
| `greenpin_id` | The unique identifier of the GreenPin allocation |

## Request Body

JSON format with the parameters to update.

### Updatable Parameters

The following parameters can be updated for an active allocation:

- A-party number
- B-party number
- PINs
- Usage settings
- GreenVN allocations

## Bulk Update

To update multiple allocations at once:

```
PUT https://leadassist.exotel.in/v1/tenants/<tenant_id>/greenpin
```

This endpoint accepts an array of allocation updates in the request body.
