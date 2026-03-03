---
id: delete-number
title: Delete ExoPhone
description: Release and delete an ExoPhone from your Exotel account using the API. Remove phone numbers you no longer need with a single DELETE request.
sidebar_label: Delete Number
---

# Delete an ExoPhone

Release an ExoPhone from your account.

## HTTP Request

```
DELETE /v2_beta/Accounts/<account_sid>/IncomingPhoneNumbers/<exophone_sid>
```

## Path Parameters

| Parameter | Description |
|-----------|-------------|
| `exophone_sid` | The unique SID of the ExoPhone to delete |

## Response

```json
{
  "Status": 202,
  "Message": "Accepted"
}
```

:::warning
Deleting an ExoPhone is permanent. The number will be released and may be reassigned to another account. Ensure no active flows or campaigns are using this number before deleting.
:::

## HTTP Status Codes

| Code | Description |
|------|-------------|
| `202` | Request accepted, ExoPhone will be released |
| `400` | Bad request |
| `404` | ExoPhone not found |
