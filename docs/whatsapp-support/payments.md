---
id: payments
title: WhatsApp Payments
description: "Collect payments on WhatsApp via Exotel -- UPI integration, payment collection flows, order-to-payment workflows for Indian businesses."
sidebar_label: Payments
sidebar_position: 21
---

# WhatsApp Payments

WhatsApp Payments enables businesses to collect payments directly within WhatsApp conversations using UPI (Unified Payments Interface) in India. Customers can complete purchases without leaving the app, creating a seamless conversational commerce experience.

## What Is WhatsApp Payments?

WhatsApp Payments allows businesses to send payment requests that customers can fulfill using UPI-based payment apps. The entire payment flow happens within WhatsApp, from order confirmation to payment completion.

### Payment Flow

```
Business sends order message → Customer reviews order
       ↓
Business sends payment request → Customer pays via UPI
       ↓
Payment confirmation → Business receives webhook
       ↓
Business sends receipt → Order fulfilled
```

## Availability and Requirements

| Requirement | Details |
|-------------|---------|
| **Market** | India only (as of current release) |
| **Payment method** | UPI (Unified Payments Interface) |
| **Business requirements** | Verified Meta Business Manager, approved WABA, payment provider setup |
| **Customer requirements** | UPI-enabled bank account, UPI app (GPay, PhonePe, Paytm, etc.) |
| **Currency** | INR (Indian Rupees) only |
| **Exotel plan** | WhatsApp Commerce plan enabled |

:::note
WhatsApp Payments for business is currently available in India with UPI integration. Availability in other markets and with other payment methods may expand over time. Contact your Exotel account manager for the latest availability.
:::

## Setting Up Payments

### Step 1: Onboard with a Payment Provider

WhatsApp Payments requires integration with an approved payment gateway. Exotel facilitates the connection:

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Navigate to **WhatsApp** > **Payments**.
3. Select your preferred payment provider from the available options.
4. Complete the payment provider onboarding (KYC, bank account verification).
5. Once approved, payment capabilities are activated on your WABA.

### Step 2: Configure Payment Settings

| Setting | Description |
|---------|-------------|
| Business UPI ID | Your registered UPI VPA for receiving payments |
| Payment provider | Approved payment gateway |
| Webhook URL | Endpoint to receive payment status notifications |
| Default currency | INR |

### Step 3: Test Payments

1. Send a test payment request to your own number.
2. Complete the payment using a UPI app.
3. Verify the webhook callback is received.
4. Check the payment status in the Exotel Dashboard.

## Sending a Payment Request

### Order Message with Payment

Send an order summary with a payment request:

```bash
curl -u '<api_key>:<api_token>' -X POST "https://api.in.exotel.com/v2/accounts/<account_sid>/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+919876500001",
    "to": "+919876543210",
    "content": {
      "type": "interactive",
      "interactive": {
        "type": "order_details",
        "header": {
          "type": "text",
          "text": "Your Order"
        },
        "body": {
          "text": "Thank you for your order! Please complete the payment below."
        },
        "action": {
          "name": "review_and_pay",
          "parameters": {
            "reference_id": "ORD-12345",
            "type": "digital-goods",
            "payment_settings": [
              {
                "type": "payment_gateway",
                "payment_gateway": {
                  "type": "upi",
                  "configuration_name": "your_payment_config"
                }
              }
            ],
            "currency": "INR",
            "total_amount": {
              "value": 189700,
              "offset": 100
            },
            "order": {
              "status": "pending",
              "items": [
                {
                  "retailer_id": "SKU-001",
                  "name": "Wireless Earbuds Pro",
                  "amount": {
                    "value": 249900,
                    "offset": 100
                  },
                  "quantity": 1
                },
                {
                  "retailer_id": "SKU-002",
                  "name": "Phone Case Ultra",
                  "amount": {
                    "value": 79900,
                    "offset": 100
                  },
                  "quantity": 1
                }
              ],
              "subtotal": {
                "value": 329800,
                "offset": 100
              },
              "discount": {
                "value": 50000,
                "offset": 100,
                "description": "10% off on first order"
              },
              "tax": {
                "value": 59382,
                "offset": 100,
                "description": "GST 18%"
              },
              "shipping": {
                "value": 0,
                "offset": 100,
                "description": "Free shipping"
              }
            }
          }
        }
      }
    }
  }'
```

:::note
Amounts use an integer representation with an `offset` field. An offset of 100 means the value is in paise (e.g., `189700` with offset `100` = Rs. 1,897.00).
:::

### Amount Calculation

| Item | Value (paise) | Display |
|------|---------------|---------|
| Earbuds | 249900 | Rs. 2,499.00 |
| Phone Case | 79900 | Rs. 799.00 |
| **Subtotal** | 329800 | Rs. 3,298.00 |
| Discount (10%) | -50000 | -Rs. 500.00 |
| Tax (18%) | 59382 | Rs. 593.82 |
| Shipping | 0 | Free |
| **Total** | 189700 | Rs. 1,897.00 |

## Handling Payment Callbacks

### Payment Status Webhook

When a payment is completed or fails, Exotel sends a callback to your webhook:

#### Successful Payment

```json
{
  "type": "payment_status",
  "data": {
    "reference_id": "ORD-12345",
    "payment_id": "PAY-67890",
    "status": "captured",
    "amount": {
      "value": 189700,
      "offset": 100,
      "currency": "INR"
    },
    "transaction": {
      "id": "TXN-ABCDEF",
      "method": "upi",
      "upi_id": "customer@upi",
      "timestamp": "2025-01-15T10:45:00+05:30"
    },
    "from": "+919876543210"
  }
}
```

#### Failed Payment

```json
{
  "type": "payment_status",
  "data": {
    "reference_id": "ORD-12345",
    "payment_id": "PAY-67891",
    "status": "failed",
    "error": {
      "code": "PAYMENT_DECLINED",
      "message": "Payment was declined by the bank"
    },
    "from": "+919876543210"
  }
}
```

### Payment Statuses

| Status | Description | Action |
|--------|-------------|--------|
| `pending` | Payment initiated, awaiting completion | Wait for final status |
| `captured` | Payment successfully completed | Fulfill the order |
| `failed` | Payment attempt failed | Notify customer; offer retry |
| `refunded` | Payment refunded to customer | Update order status |
| `expired` | Payment request expired without completion | Send a new payment request |

### Processing Payments

```javascript
function handlePaymentCallback(data) {
  const { reference_id, status, payment_id, amount, from } = data;

  switch (status) {
    case 'captured':
      // Payment successful
      fulfillOrder(reference_id, payment_id);
      sendTemplateMessage(from, 'payment_confirmation', {
        orderId: reference_id,
        amount: (amount.value / amount.offset).toFixed(2),
        paymentId: payment_id
      });
      break;

    case 'failed':
      // Payment failed
      logPaymentFailure(reference_id, data.error);
      sendTemplateMessage(from, 'payment_failed', {
        orderId: reference_id,
        reason: data.error.message
      });
      break;

    case 'expired':
      // Payment expired
      sendTemplateMessage(from, 'payment_reminder', {
        orderId: reference_id,
        amount: (amount.value / amount.offset).toFixed(2)
      });
      break;
  }
}
```

## Complete Commerce-to-Payment Flow

```
1. Customer browses catalog       → Multi-product message
2. Customer adds to cart           → Cart message
3. Customer submits order          → Order webhook received
4. Business confirms order         → Order confirmation message
5. Business sends payment request  → Payment order message
6. Customer pays via UPI           → UPI payment flow
7. Payment confirmed               → Payment webhook received
8. Business sends receipt           → Payment confirmation template
9. Business ships order             → Shipping update template
10. Customer receives order        → Delivery confirmation template
```

## Refunds

To process a refund:

1. Use your payment provider's refund API or dashboard.
2. Update the order status in your system.
3. Send a refund confirmation to the customer via a template message.

```json
{
  "type": "template",
  "template": {
    "name": "refund_confirmation",
    "language": { "code": "en", "policy": "deterministic" },
    "components": [
      {
        "type": "body",
        "parameters": [
          { "type": "text", "text": "ORD-12345" },
          { "type": "text", "text": "1,897.00" },
          { "type": "text", "text": "3-5 business days" }
        ]
      }
    ]
  }
}
```

:::warning
Refunds are processed through your payment provider, not through WhatsApp directly. Ensure your refund flow notifies the customer via a WhatsApp template message.
:::

## Security and Compliance

| Aspect | Details |
|--------|---------|
| **Encryption** | All payments processed over encrypted channels |
| **UPI compliance** | Compliant with NPCI (National Payments Corporation of India) guidelines |
| **Data handling** | Payment credentials are never stored or transmitted through WhatsApp messages |
| **PCI DSS** | Payment provider handles card/account data in PCI-compliant infrastructure |
| **Audit trail** | Maintain records of all payment transactions for regulatory compliance |

## Best Practices

1. **Send clear order summaries** -- Show itemized details including tax, discounts, and shipping before requesting payment.
2. **Set reasonable expiry times** -- Payment requests should expire after 24-48 hours.
3. **Handle failures gracefully** -- Offer retry options when payments fail.
4. **Send confirmations immediately** -- Confirm successful payments within seconds.
5. **Provide receipts** -- Send a template message with transaction details after payment.
6. **Support refunds** -- Have a clear refund process and communicate timelines.
7. **Keep amounts accurate** -- Double-check amount calculations, especially with discounts and taxes.
8. **Test thoroughly** -- Test the complete flow from catalog browsing to payment confirmation.

## Common Issues

| Issue | Cause | Resolution |
|-------|-------|------------|
| Payment request not displaying | Payment provider not configured | Complete payment provider onboarding |
| UPI payment failing | Customer's UPI app issue or bank issue | Ask customer to retry or use a different UPI app |
| Webhook not received | Webhook URL misconfigured | Verify webhook URL in Exotel Dashboard |
| Amount mismatch | Incorrect offset calculation | Ensure value/offset calculation is correct (offset 100 = paise) |
| Payment expired | Customer did not complete payment in time | Send a new payment request |

## Next Steps

- [WhatsApp Commerce](/docs/whatsapp-support/commerce) -- Commerce overview
- [WhatsApp Catalog](/docs/whatsapp-support/catalog) -- Product catalog management
- [WhatsApp Webhooks](/docs/whatsapp-support/webhooks) -- Payment callback handling
- [WhatsApp API Reference](/docs/whatsapp-api/overview) -- API documentation
