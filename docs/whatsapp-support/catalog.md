---
id: catalog
title: WhatsApp Catalog
description: "Set up and manage WhatsApp product catalogs on Exotel -- create catalogs, add products, sync inventory, and share with customers."
sidebar_label: Catalog
sidebar_position: 19
---

# WhatsApp Catalog

A WhatsApp Catalog is your product or service showcase within WhatsApp. Customers can browse your catalog directly in the chat, view product details, and add items to their cart. This guide covers catalog creation, product management, and sharing catalogs with customers.

## What Is a WhatsApp Catalog?

A catalog is a structured collection of your products or services that is displayed within WhatsApp. It is hosted on Meta's infrastructure and linked to your WhatsApp Business Account.

### Catalog Components

| Component | Description | Limit |
|-----------|-------------|-------|
| **Catalog** | The container for all your products | 1 catalog per WABA |
| **Products** | Individual items in your catalog | Up to 500 products |
| **Sections** | Groupings for organizing products | Used in multi-product messages |

## Creating a Catalog

### Via Meta Commerce Manager

1. Go to [Meta Commerce Manager](https://business.facebook.com/commerce).
2. Click **Add Catalog**.
3. Select **E-commerce** as the catalog type.
4. Choose **Upload product info** (manual) or **Connect a partner platform** (automated).
5. Name your catalog (e.g., "My Store Products").
6. Click **Create**.

### Via Meta Business Manager

1. Go to [business.facebook.com](https://business.facebook.com).
2. Navigate to **Data Sources** > **Catalogs**.
3. Click **Create Catalog**.
4. Follow the setup wizard.

## Adding Products

### Manual Entry

1. In Commerce Manager, go to your catalog.
2. Click **Add Items** > **Add Manually**.
3. Fill in product details:

| Field | Required | Max Length | Description |
|-------|----------|-----------|-------------|
| Product name | Yes | 200 chars | Clear, descriptive name |
| Product image | Yes | 8 MB | Min 500x500 px, JPEG or PNG |
| Description | Yes | 5,000 chars | Detailed product information |
| Price | Yes | -- | Numeric value in local currency |
| Currency | Yes | -- | ISO currency code (e.g., `INR`) |
| Content ID (SKU) | Yes | 100 chars | Unique product identifier |
| Product URL | Yes | -- | Link to product on your website |
| Availability | Yes | -- | `in stock` or `out of stock` |
| Condition | No | -- | `new`, `refurbished`, or `used` |
| Brand | No | 100 chars | Brand or manufacturer name |

### Bulk Upload via Data Feed

For catalogs with many products, use a CSV or TSV data feed:

#### CSV Format

```csv
id,title,description,availability,condition,price,link,image_link,brand
SKU-001,Wireless Earbuds Pro,Premium wireless earbuds with ANC,in stock,new,2499 INR,https://example.com/earbuds,https://example.com/images/earbuds.jpg,AudioTech
SKU-002,Phone Case Ultra,Shockproof case for smartphones,in stock,new,799 INR,https://example.com/case,https://example.com/images/case.jpg,CasePro
SKU-003,USB-C Fast Charger,65W GaN fast charger,out of stock,new,1499 INR,https://example.com/charger,https://example.com/images/charger.jpg,ChargeTech
```

#### Upload Steps

1. In Commerce Manager, go to **Data Sources** > **Data Feed**.
2. Click **Add Data Feed**.
3. Choose **File Upload** or **Scheduled Feed** (for automatic sync).
4. Upload your CSV/TSV file.
5. Map columns to catalog fields.
6. Submit for processing.

### API-Based Product Management

Use Meta's Catalog API to manage products programmatically:

```bash
# Add a product
curl -X POST "https://graph.facebook.com/v18.0/<catalog_id>/products" \
  -H "Authorization: Bearer <access_token>" \
  -F "retailer_id=SKU-001" \
  -F "name=Wireless Earbuds Pro" \
  -F "description=Premium wireless earbuds with ANC" \
  -F "price=2499" \
  -F "currency=INR" \
  -F "availability=in stock" \
  -F "url=https://example.com/earbuds" \
  -F "image_url=https://example.com/images/earbuds.jpg"
```

## Connecting Catalog to WhatsApp

### Step 1: Link Catalog to WABA

1. In Meta Business Manager, go to **WhatsApp Account** > **Settings**.
2. Under **Catalog**, select your catalog.
3. Click **Save**.

### Step 2: Verify in Exotel

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Navigate to **WhatsApp** > **Commerce**.
3. Verify that your catalog is connected.

:::note
Only one catalog can be linked to a WhatsApp Business Account at a time. To switch catalogs, disconnect the current one first.
:::

## Sharing Catalog with Customers

### Full Catalog Link

Customers can access your full catalog through your WhatsApp Business profile.

### Single Product Message

Share a specific product from your catalog in a conversation:

```json
{
  "type": "interactive",
  "interactive": {
    "type": "product",
    "body": {
      "text": "Here's the product you asked about:"
    },
    "action": {
      "catalog_id": "your_catalog_id",
      "product_retailer_id": "SKU-001"
    }
  }
}
```

### Multi-Product Message

Share a curated selection of products:

```json
{
  "type": "interactive",
  "interactive": {
    "type": "product_list",
    "header": {
      "type": "text",
      "text": "Recommended For You"
    },
    "body": {
      "text": "Based on your preferences, here are some products you might like:"
    },
    "action": {
      "catalog_id": "your_catalog_id",
      "sections": [
        {
          "title": "Audio",
          "product_items": [
            { "product_retailer_id": "SKU-001" },
            { "product_retailer_id": "SKU-004" }
          ]
        },
        {
          "title": "Accessories",
          "product_items": [
            { "product_retailer_id": "SKU-002" },
            { "product_retailer_id": "SKU-005" }
          ]
        }
      ]
    }
  }
}
```

## Inventory Synchronization

Keep your WhatsApp catalog in sync with your inventory system:

### Manual Sync

1. Update product availability in Commerce Manager when stock changes.
2. Remove or mark products as "out of stock" when unavailable.

### Automated Sync via Data Feed

1. Set up a scheduled data feed in Commerce Manager.
2. Configure the feed URL pointing to your product data export endpoint.
3. Set the update frequency (daily or hourly).
4. Commerce Manager automatically pulls the latest product data.

### Automated Sync via API

```javascript
async function syncInventory() {
  const products = await getProductsFromDatabase();

  for (const product of products) {
    await updateCatalogProduct(product.sku, {
      availability: product.stock > 0 ? 'in stock' : 'out of stock',
      price: product.price,
      name: product.name,
      description: product.description
    });
  }
}

// Run every hour
setInterval(syncInventory, 3600000);
```

:::warning
Out-of-stock products should be promptly updated in your catalog. Customers ordering unavailable products leads to poor experiences and potential quality rating drops.
:::

## Product Image Guidelines

| Guideline | Details |
|-----------|---------|
| Minimum resolution | 500x500 pixels |
| Recommended resolution | 1024x1024 pixels |
| Aspect ratio | 1:1 (square) for best display |
| Format | JPEG or PNG |
| Max file size | 8 MB |
| Background | Clean, white or light background preferred |
| Content | Product should be clearly visible and fill most of the frame |
| Text | Avoid text overlays on product images |

## Catalog Policies

Meta enforces policies on catalog content:

| Rule | Details |
|------|---------|
| Accurate pricing | Prices must match your website |
| Real products | No placeholder or stock photos for non-existent products |
| Prohibited items | No weapons, drugs, tobacco, adult content, or counterfeit goods |
| Image quality | Clear, professional product images required |
| Description accuracy | Descriptions must accurately represent the product |

## Best Practices

1. **Use high-quality images** -- Professional product photos significantly improve engagement and conversion.
2. **Write detailed descriptions** -- Include size, color, material, and key features.
3. **Keep prices current** -- Regularly sync prices between your website and catalog.
4. **Organize thoughtfully** -- Group related products in sections for multi-product messages.
5. **Update stock regularly** -- Mark out-of-stock items immediately.
6. **Use unique SKUs** -- Ensure every product has a unique Content ID for reliable referencing.
7. **Automate sync** -- Set up scheduled data feeds or API-based sync for large catalogs.

## Common Issues

| Issue | Cause | Resolution |
|-------|-------|------------|
| Product not showing | Product not approved by Meta | Check Commerce Manager for approval status |
| Image not loading | Image URL broken or too large | Use a reliable CDN; keep images under 8 MB |
| Catalog not linked | WABA not connected to catalog | Link catalog in WhatsApp Account settings |
| Product message fails | Invalid product_retailer_id | Verify the SKU exists in your catalog |

## Next Steps

- [WhatsApp Commerce](/docs/whatsapp-support/commerce) -- Commerce overview
- [WhatsApp Payments](/docs/whatsapp-support/payments) -- In-chat payments
- [Interactive Messages](/docs/whatsapp-support/interactive-messages) -- Product sharing
- [WhatsApp API Reference](/docs/whatsapp-api/overview) -- API documentation
