---
id: manage-contacts
title: Manage Contacts
description: Create, update, and delete campaign contacts using the Exotel API. Supports bulk operations with E.164 formatted numbers and multi-status responses.
sidebar_label: Manage Contacts
---

# Manage Campaign Contacts

## Create Contacts

```
POST /v2/accounts/<account_sid>/contacts
```

### Request Body

Array of contact objects with `number` (mandatory, E.164 format) and optional fields.

### Response

HTTP `207` (Multi-Status) with individual `200`/`400` codes per contact.

---

## Update Single Contact

```
PUT /v2/accounts/<account_sid>/contacts/<contact_sid>
```

Update any contact field. Returns HTTP `200` with updated contact data.

---

## Update Bulk Contacts

```
PUT /v2/accounts/<account_sid>/contacts
```

Array of contacts with `sid` and fields to update. Returns HTTP `207`.

---

## Get Single Contact

```
GET /v2/accounts/<account_sid>/contacts/<contact_sid>
```

---

## Get Bulk Contacts

```
GET /v2/accounts/<account_sid>/contacts?limit=<LIMIT>&offset=<OFFSET>
```

### Query Parameters

| Parameter | Description |
|-----------|-------------|
| `offset` | Zero-based record position |
| `limit` | Records per page (default: 20, max: 20) |
| `name` | Search by name |
| `sort_by` | Field and direction (e.g., `date_created:asc`) |
| `list_sids` | Filter by list |
| `filter` | Use `show_list` to include list associations |

---

## Delete Contact

```
DELETE /v2/accounts/<account_sid>/contacts/<contact_sid>
```

Returns HTTP `200` with deleted contact confirmation.

## Response Structure

All responses include:
- `request_id` — Unique identifier
- `method` — HTTP method
- `http_code` — Status code
- `response` — Data with `code`, `status`, `data`
