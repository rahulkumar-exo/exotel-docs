---
id: manage-lists
title: Manage Lists
sidebar_label: Manage Lists
---

# Manage Lists

Update, delete, and query campaign lists.

## Update Single List

```
PUT /v2/accounts/<account_sid>/lists/<list_sid>
```

### Request Parameters

| Parameter | Description |
|-----------|-------------|
| `name` | New list name (must be unique) |

---

## Bulk Update Lists

```
PUT /v2/accounts/<account_sid>/lists
```

### Request Parameters

| Parameter | Description |
|-----------|-------------|
| `lists` | Array of objects with `sid` and `name` (max 5,000 lists) |

---

## Delete List

```
DELETE /v2/accounts/<account_sid>/lists/<list_id>
```

---

## Get List Details

```
GET /v2/accounts/<account_sid>/lists/<list_id>
```

Returns list metadata including contact count.

---

## List All Lists

```
GET /v2/accounts/<account_sid>/lists?limit=<limit>&offset=<offset>
```

### Query Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `offset` | No | Starting position (default: `0`) |
| `limit` | No | Records per page (default: `20`) |
| `name` | No | Search by list name |
| `sort_by` | No | Sort order (e.g., `date_created:asc`, `name:asc`) |

---

## Get Contacts in List

```
GET /v2/accounts/<account_sid>/lists/<list_id>/contacts?offset=<offset>&limit=<limit>
```

Returns paginated contact records.

---

## Delete Contact from List

```
DELETE /v2/accounts/<account_sid>/lists/<list_sid>/contacts/<contact_sid>
```

:::info
This removes the contact from the list only — it does not permanently delete the contact.
:::

## HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `207` | Partial success (some operations succeeded, others failed) |
| `400` | Bad request |
