---
id: create-allocation
title: Create Pin Allocation
sidebar_label: Create Allocation
---

# Create a Pin Allocation

Generate a PIN and map it to users via a virtual number for secure communication.

## HTTP Request

```
POST https://leadassist.exotel.in/v1/tenants/<tenant_id>/greenpin
```

## Headers

```
Content-Type: application/json
```

## Authentication

Requires Account SID and ExoBridge token in the request.

## Request Body

The request body should be in JSON format with the allocation parameters as specified in the Lead Assist API documentation.

## Response

Returns the created GreenPin allocation details including:

| Field | Description |
|-------|-------------|
| `greenpin_id` | Unique identifier for the allocation |
| `virtual_number` | The assigned virtual number |
| `pin` | Generated PIN for verification |
| `status` | Allocation status |
| `created_at` | Creation timestamp |

## Notes

- The default maximum allocation duration is **170 days** at the service level
- Account-level configurations allow customization from as low as **5 minutes** up to 170 days
