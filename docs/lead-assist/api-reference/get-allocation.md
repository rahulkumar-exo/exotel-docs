---
id: get-allocation
title: Get Allocation Details
sidebar_label: Get Allocation
---

# Get Pin Allocation Details

Retrieve details of a specific GreenPin allocation.

## HTTP Request

```
GET https://leadassist.exotel.in/v1/tenants/<tenant_id>/greenpin/<greenpin_id>
```

## Path Parameters

| Parameter | Description |
|-----------|-------------|
| `greenpin_id` | The unique identifier of the GreenPin allocation |

## Response

Returns the complete allocation details including virtual number assignment, PIN, parties involved, and current status.

## Getting Call Metadata

You can get call metadata for calls between two parties in an active allocation using:

1. **Events Callbacks (Push)** — Configure a webhook endpoint to receive real-time call data
2. **GET Call API (Pull)** — Query call details using the CallSID
