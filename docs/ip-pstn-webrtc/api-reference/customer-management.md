---
id: customer-management
title: Customer Management
sidebar_label: Customer Management
---

# Customer Management

Retrieve and manage your customer account details for the WebRTC integration.

## Base URL

```
https://integrationscore.mum1.exotel.com/v2/integrations
```

## Get Customer Details

Retrieve your customer account information.

```
GET /{customer_id}
```

### Headers

| Header | Value |
|--------|-------|
| `Authorization` | `Bearer <customer_token>` |

### Example Request

```bash
curl -X GET \
  'https://integrationscore.mum1.exotel.com/v2/integrations/{customer_id}' \
  -H 'Authorization: Bearer <customer_token>'
```

### Response

```json
{
  "success": true,
  "data": {
    "customer_id": "cust_abc123",
    "name": "Acme Corp",
    "account_sid": "exotel_account_sid",
    "status": "active",
    "apps_count": 3,
    "users_count": 25,
    "plan": {
      "type": "enterprise",
      "max_apps": 10,
      "max_users_per_app": 100
    },
    "created_at": "2024-01-15T09:00:00.000Z",
    "updated_at": "2024-06-15T10:00:00.000Z"
  }
}
```

---

## Delete Customer Account

:::caution
This action is irreversible. All apps, users, and settings under this customer will be permanently deleted.
:::

```
DELETE /{customer_id}
```

### Headers

| Header | Value |
|--------|-------|
| `Authorization` | `Bearer <customer_token>` |

### Example Request

```bash
curl -X DELETE \
  'https://integrationscore.mum1.exotel.com/v2/integrations/{customer_id}' \
  -H 'Authorization: Bearer <customer_token>'
```

### Response

```json
{
  "success": true,
  "message": "Customer account and all associated resources deleted successfully"
}
```

---

## Get Customer Usage

Retrieve usage statistics for your customer account.

```
GET /{customer_id}/usage
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `start_date` | String | No | Start of date range (ISO 8601) |
| `end_date` | String | No | End of date range (ISO 8601) |

### Example Request

```bash
curl -X GET \
  'https://integrationscore.mum1.exotel.com/v2/integrations/{customer_id}/usage?start_date=2024-06-01&end_date=2024-06-30' \
  -H 'Authorization: Bearer <customer_token>'
```

### Response

```json
{
  "success": true,
  "data": {
    "customer_id": "cust_abc123",
    "period": {
      "start": "2024-06-01T00:00:00.000Z",
      "end": "2024-06-30T23:59:59.000Z"
    },
    "usage": {
      "total_calls": 5420,
      "total_minutes": 18350,
      "inbound_calls": 3200,
      "outbound_calls": 2220,
      "sip_calls": 4100,
      "pstn_calls": 1320,
      "active_apps": 3,
      "active_users": 22
    }
  }
}
```

## HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — Invalid or expired token |
| `404` | Not Found — Customer doesn't exist |
| `500` | Internal Server Error |
