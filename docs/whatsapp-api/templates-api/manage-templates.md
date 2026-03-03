---
id: manage-templates
title: Manage Templates
description: Retrieve, upload samples, and manage WhatsApp message templates programmatically using the Exotel Template Management API.
sidebar_label: Manage Templates
---

# Manage WhatsApp Templates

## Get Templates

```
GET /v2/accounts/<account_sid>/templates
```

### Query Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `waba_id` | Yes | WhatsApp Business Account ID |
| `name` | No | Filter by template name |
| `status` | No | Filter by status |
| `language` | No | Filter by language |
| `category` | No | Filter by category |
| `limit` | No | Results per page |
| `before` / `after` | No | Pagination cursors |

---

## Upload Template Sample

Upload media files for use in templates.

```
POST /v2/accounts/<account_sid>/templates/sample?file_length=<bytes>&file_type=<type>
```

Supported types: `application/pdf`, `image/jpeg`, `image/png`, `video/mp4`

Returns a `file_handle` ID for use in template creation.

---

## Create Template

```
POST /v2/accounts/<account_sid>/templates
```

### Request Body

```json
{
  "whatsapp": {
    "templates": [{
      "template": {
        "category": "TRANSACTIONAL",
        "name": "order_update",
        "language": "en",
        "components": [
          { "type": "HEADER", "format": "TEXT", "text": "Order Update" },
          { "type": "BODY", "text": "Your order {{1}} has been {{2}}." },
          { "type": "FOOTER", "text": "Thank you for shopping!" }
        ]
      }
    }]
  }
}
```

---

## Edit Template

```
PUT /v2/accounts/<account_sid>/templates
```

Include the `id` field in the template object to identify which template to update.

---

## Delete Template

```
DELETE /v2/accounts/<account_sid>/templates?waba_id=<id>
```

### Request Body

```json
{
  "whatsapp": {
    "templates": [{
      "template": { "name": "template_name" }
    }]
  }
}
```

## HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `400` | Bad Request |
| `401` | Unauthorized |
| `402` | Payment Required |
| `403` | Access Denied |
| `404` | Not Found |
