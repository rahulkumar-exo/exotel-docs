---
id: commerce
title: WhatsApp Commerce
description: "Enable WhatsApp Commerce with Exotel -- product catalogs, shopping carts, in-chat checkout, and order management for conversational selling."
sidebar_label: Commerce
sidebar_position: 18
---

# WhatsApp Commerce

WhatsApp Commerce allows businesses to showcase products, manage shopping carts, and complete purchases directly within WhatsApp conversations. This guide covers how to set up and use WhatsApp Commerce features through Exotel.

## What Is WhatsApp Commerce?

WhatsApp Commerce transforms WhatsApp from a messaging channel into a sales channel. Customers can browse products, add items to a cart, and check out without leaving the app.

### Commerce Features

| Feature | Description | Availability |
|---------|-------------|-------------|
| **Product Catalog** | Showcase your products within WhatsApp | All markets |
| **Product Messages** | Share single or multiple products in chat | All markets |
| **Shopping Cart** | Customers add items and manage quantities | All markets |
| **Checkout** | Complete the purchase in-chat | Select markets |
| **Order Notifications** | Send order updates via templates | All markets |
| **Payments** | Collect payments via UPI (India only) | India |

## Prerequisites

| Requirement | Details |
|-------------|---------|
| Verified Meta Business Manager | Business verification completed |
| WhatsApp Business Account | Connected to Exotel |
| Product Catalog | Created in Meta Commerce Manager |
| Compliance review | Commerce policies accepted |

## Setting Up Commerce

### Step 1: Create a Product Catalog

1. Go to [Meta Commerce Manager](https://business.facebook.com/commerce).
2. Click **Add Catalog** > **E-commerce**.
3. Select **Upload product info**.
4. Name your catalog and create it.

### Step 2: Add Products

Add products individually or via bulk upload:

| Field | Required | Description |
|-------|----------|-------------|
| Product name | Yes | Name displayed to customers (max 200 characters) |
| Product image | Yes | High-quality image (min 500x500 pixels) |
| Description | Yes | Product details (max 5,000 characters) |
| Price | Yes | Price in local currency |
| Currency | Yes | Currency code (e.g., `INR`) |
| Content ID | Yes | Unique product identifier |
| URL | Yes | Product page URL |
| Availability | Yes | `in stock` or `out of stock` |
| Condition | No | `new`, `refurbished`, `used` |
| Category | No | Product category |

### Step 3: Connect Catalog to WhatsApp

1. In Meta Business Manager, go to **WhatsApp Account** > **Settings**.
2. Navigate to **Catalog**.
3. Select your catalog from the dropdown.
4. Save.

### Step 4: Enable Commerce in Exotel

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Navigate to **WhatsApp** > **Commerce Settings**.
3. Enable product catalog integration.
4. Verify the catalog connection.

See [WhatsApp Catalog](/docs/whatsapp-support/catalog) for detailed catalog management.

## Sending Product Messages

### Single Product Message

Share a specific product from your catalog:

```bash
curl -X POST "https://<api_key>:<api_token>@api.in.exotel.com/v2/accounts/<account_sid>/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+919876500001",
    "to": "+919876543210",
    "content": {
      "type": "interactive",
      "interactive": {
        "type": "product",
        "body": {
          "text": "Check out this popular item from our store!"
        },
        "action": {
          "catalog_id": "your_catalog_id",
          "product_retailer_id": "SKU-12345"
        }
      }
    }
  }'
```

### Multi-Product Message

Share multiple products organized by sections:

```bash
curl -X POST "https://<api_key>:<api_token>@api.in.exotel.com/v2/accounts/<account_sid>/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+919876500001",
    "to": "+919876543210",
    "content": {
      "type": "interactive",
      "interactive": {
        "type": "product_list",
        "header": {
          "type": "text",
          "text": "Our Top Picks"
        },
        "body": {
          "text": "Browse our best sellers and new arrivals!"
        },
        "action": {
          "catalog_id": "your_catalog_id",
          "sections": [
            {
              "title": "Best Sellers",
              "product_items": [
                { "product_retailer_id": "SKU-001" },
                { "product_retailer_id": "SKU-002" },
                { "product_retailer_id": "SKU-003" }
              ]
            },
            {
              "title": "New Arrivals",
              "product_items": [
                { "product_retailer_id": "SKU-101" },
                { "product_retailer_id": "SKU-102" }
              ]
            }
          ]
        }
      }
    }
  }'
```

### Product Message Limits

| Type | Products | Sections |
|------|----------|----------|
| Single product | 1 | N/A |
| Multi-product | Max 30 | Max 10 sections |

## Shopping Cart

When customers browse your products, they can add items to a cart directly within WhatsApp.

### Cart Flow

```
Customer browses products → Adds to cart → Reviews cart → Sends cart to business
```

### Cart Webhook

When a customer submits their cart, you receive a webhook with the order details:

```json
{
  "type": "inbound_message",
  "data": {
    "from": "+919876543210",
    "message": {
      "type": "order",
      "order": {
        "catalog_id": "your_catalog_id",
        "product_items": [
          {
            "product_retailer_id": "SKU-001",
            "quantity": 2,
            "item_price": 499.00,
            "currency": "INR"
          },
          {
            "product_retailer_id": "SKU-003",
            "quantity": 1,
            "item_price": 899.00,
            "currency": "INR"
          }
        ],
        "text": "Please deliver by tomorrow"
      }
    }
  }
}
```

### Processing Cart Orders

```javascript
function processOrder(orderData) {
  const { product_items, text } = orderData.order;

  let totalAmount = 0;
  const orderItems = product_items.map(item => {
    const subtotal = item.quantity * item.item_price;
    totalAmount += subtotal;
    return {
      sku: item.product_retailer_id,
      quantity: item.quantity,
      price: item.item_price,
      subtotal: subtotal
    };
  });

  // Create order in your system
  const order = createOrder({
    customer: orderData.from,
    items: orderItems,
    total: totalAmount,
    note: text
  });

  // Send confirmation
  sendTemplateMessage(orderData.from, 'order_confirmation', {
    orderId: order.id,
    total: totalAmount,
    itemCount: orderItems.length
  });
}
```

## Commerce Conversation Flow

A typical WhatsApp Commerce conversation:

```
Business: "Welcome! Here are our top products." [Multi-product message]
Customer: [browses products, adds 2 items to cart]
Customer: [sends cart order]
Business: "Thank you! Your order #ORD-789 for Rs. 1,897 is confirmed."
Business: [sends order confirmation template with payment link]
Customer: [makes payment]
Business: "Payment received! Your order will be delivered by tomorrow." [Template]
```

:::tip
Use interactive messages and product catalogs together to create a smooth shopping experience. Send product recommendations based on customer preferences and purchase history.
:::

## Commerce Analytics

Track commerce performance in the Exotel Dashboard:

| Metric | Description |
|--------|-------------|
| Product views | Number of times products were viewed |
| Cart additions | Items added to carts |
| Orders received | Cart orders submitted by customers |
| Conversion rate | Percentage of product views that convert to orders |
| Average order value | Average total amount per order |

## Best Practices

1. **Keep catalogs updated** -- Remove out-of-stock items promptly; update prices regularly.
2. **Use high-quality images** -- Product images should be clear, well-lit, and at least 500x500 pixels.
3. **Write compelling descriptions** -- Include key details like size, color, material, and benefits.
4. **Organize with sections** -- Group products logically (by category, price range, or popularity).
5. **Respond to cart orders quickly** -- Confirm orders within minutes to maintain customer confidence.
6. **Follow up on abandoned carts** -- Send a template message reminding customers about their cart.
7. **Provide order tracking** -- Use template messages to keep customers updated on order status.

## Next Steps

- [WhatsApp Catalog](/docs/whatsapp-support/catalog) -- Detailed catalog management
- [WhatsApp Payments](/docs/whatsapp-support/payments) -- Collect payments in-chat
- [Interactive Messages](/docs/whatsapp-support/interactive-messages) -- Buttons and menus
- [WhatsApp API Reference](/docs/whatsapp-api/overview) -- API documentation
