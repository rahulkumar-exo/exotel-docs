---
id: payment-messages
title: Payment Messages
description: Send payment request messages to customers via WhatsApp using the Exotel API. Collect payments through integrated payment gateway partners.
sidebar_label: Payment Messages
---

# WhatsApp Payment Messages

Send payment request messages to customers via WhatsApp, enabling seamless payment collection through integrated payment gateways.

:::note
Payment Messages are available for WhatsApp Business API accounts with an approved payment partner. Contact your Exotel account manager to enable this feature.
:::

## Send Payment Request

```
POST /v2/accounts/<account_sid>/messages
```

### Request Body

```json
{
  "whatsapp": {
    "messages": [{
      "from": "your_waba_number",
      "to": "+919876543210",
      "content": {
        "type": "order_details",
        "header": {
          "type": "text",
          "text": "Payment Request"
        },
        "body": {
          "text": "Please complete payment for your order"
        },
        "footer": {
          "text": "Powered by Exotel"
        },
        "action": {
          "name": "review_and_pay",
          "parameters": {
            "reference_id": "order_12345",
            "type": "digital-goods",
            "payment_settings": [{
              "type": "payment_gateway",
              "payment_gateway": {
                "type": "razorpay",
                "configuration_name": "your_payment_config"
              }
            }],
            "currency": "INR",
            "total_amount": {
              "value": 50000,
              "offset": 100
            },
            "order": {
              "status": "pending",
              "items": [
                {
                  "retailer_id": "SKU001",
                  "name": "Premium Plan - Monthly",
                  "amount": {
                    "value": 50000,
                    "offset": 100
                  },
                  "quantity": 1
                }
              ]
            }
          }
        }
      }
    }]
  }
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `from` | String | Yes | Your WhatsApp Business number |
| `to` | String | Yes | Recipient number in E.164 format |
| `content.type` | String | Yes | Must be `order_details` |
| `action.name` | String | Yes | Must be `review_and_pay` |
| `reference_id` | String | Yes | Your unique order/payment reference |
| `type` | String | Yes | `digital-goods` or `physical-goods` |
| `currency` | String | Yes | ISO 4217 currency code (e.g., `INR`) |
| `total_amount.value` | Integer | Yes | Amount in smallest currency unit (paise) |
| `total_amount.offset` | Integer | Yes | Decimal offset (100 for INR) |

### Response

```json
{
  "request_id": "req_pay_001",
  "method": "POST",
  "http_code": 200,
  "response": {
    "code": 200,
    "status": "success",
    "data": {
      "message_id": "msg_pay_abc123",
      "status": "sent",
      "to": "+919876543210"
    }
  }
}
```

## Payment Status Webhook

When a payment is completed, you receive a webhook:

```json
{
  "event": "payment_status",
  "message_id": "msg_pay_abc123",
  "reference_id": "order_12345",
  "payment_status": "captured",
  "amount": {
    "value": 50000,
    "offset": 100,
    "currency": "INR"
  },
  "transaction_id": "txn_xyz789",
  "timestamp": "2024-06-15T10:35:00.000Z"
}
```

### Payment Status Values

| Status | Description |
|--------|-------------|
| `pending` | Payment request sent, awaiting customer action |
| `captured` | Payment successfully completed |
| `failed` | Payment failed |
| `canceled` | Customer canceled the payment |

## Supported Payment Gateways

| Gateway | Configuration |
|---------|---------------|
| Razorpay | `type: "razorpay"` |
| PayU | `type: "payu"` |
| Zaakpay | `type: "zaakpay"` |

## UPI Intent Example

For UPI-based payments (India only), set `payment_type` to `"upi"` and provide a `payment_configuration` name. Unlike payment gateway mode, payment status updates must be retrieved from your payment gateway (Exotel/Meta does not send native callbacks for UPI Intent).

```json
{
  "whatsapp": {
    "messages": [{
      "from": "+918047109880",
      "to": "+919876543210",
      "content": {
        "type": "interactive",
        "interactive": {
          "type": "order_details",
          "header": { "type": "image", "image": { "link": "https://example.com/product.jpg" } },
          "body": { "text": "Click Pay Now to complete your order." },
          "footer": { "text": "Thank You!" },
          "action": {
            "name": "review_and_pay",
            "parameters": {
              "type": "digital-goods",
              "currency": "INR",
              "reference_id": "ORD-1033",
              "payment_type": "upi",
              "payment_configuration": "your_upi_config_name",
              "total_amount": { "value": 1100, "offset": 100 },
              "order": {
                "status": "pending",
                "items": [{
                  "retailer_id": "SKU001",
                  "name": "Premium Plan",
                  "amount": { "value": 1500, "offset": 100 },
                  "sale_amount": { "value": 1000, "offset": 100 },
                  "quantity": 1
                }],
                "subtotal": { "value": 1000, "offset": 100 },
                "tax": { "value": 100, "offset": 100, "description": "GST" },
                "shipping": { "value": 100, "offset": 100, "description": "Via Postal" },
                "discount": { "value": 100, "offset": 100, "description": "Premium discount" }
              }
            }
          }
        }
      }
    }]
  }
}
```

## Update Order Status

After receiving a payment signal from the gateway, send an order status update to the user. Use `type: "order_status"` with `action.name: "review_order"`.

```
POST /v2/accounts/<account_sid>/messages
```

```json
{
  "whatsapp": {
    "messages": [{
      "from": "+918047109880",
      "to": "+919876543210",
      "content": {
        "type": "interactive",
        "interactive": {
          "type": "order_status",
          "body": { "text": "Your order has been confirmed!" },
          "action": {
            "name": "review_order",
            "parameters": {
              "reference_id": "ORD-1033",
              "order": {
                "status": "processing",
                "description": "We are preparing your order."
              }
            }
          }
        }
      }
    }]
  }
}
```

### Order Status Values

| Status | Description |
|--------|-------------|
| `pending` | User has not successfully paid yet |
| `processing` | Payment authorized; fulfilling the order |
| `partially-shipped` | Some products shipped |
| `shipped` | All products shipped |
| `completed` | Order complete; no further action expected |
| `canceled` | Order canceled (fails if payment is already successful or pending) |

## HTTP Status Codes

| Code | Description |
|------|-------------|
| `202` | Accepted |
| `400` | Bad Request — Invalid payment parameters |
| `401` | Unauthorized |
| `402` | Payment Gateway not configured |
| `403` | Payment messages not enabled |
