---
id: create-list
title: Create List
description: Use the Exotel API to create a new contact list for campaigns. Learn about request parameters, endpoints, and how to add contacts to lists.
sidebar_label: Create List
---

# Create a List

Create a new contact list for use in campaigns.

## HTTP Request

```
POST /v2/accounts/<account_sid>/lists
```

## Request Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `name` | Yes | Unique list name within your account |
| `tag` | No | Optional tag for categorization |

## Response

Returns the created list with its SID, creation timestamp, and contact count.

---

## Add Contacts to List

### HTTP Request

```
POST /v2/accounts/<account_sid>/lists/<list_sid>/contacts
```

### Request Parameters

| Parameter | Description |
|-----------|-------------|
| `contact_references` | Array of contact SIDs to add (max 5,000 per request) |

### Response

Returns success/failure status for each contact.

---

## Upload Contacts via CSV

### HTTP Request

```
POST /v2/accounts/<account_sid>/contacts/csv-upload
```

### Request Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `list_name` | Yes | Target list name |
| `file_name` | Yes | Local CSV file path |
| `type` | No | `"static"` or `"dynamic"` |

### Check Upload Status

```
GET /v2/accounts/<account_sid>/csv-status/<upload_id>
```

Returns upload progress: `in-progress` or `completed`, with stats on duplicates, successes, and failures.
