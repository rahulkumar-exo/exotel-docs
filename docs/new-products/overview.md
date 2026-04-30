---
id: overview
title: New Products
description: Documentation pages for products being scaffolded by Product Managers via the CMS, before they graduate to dedicated top-level collections.
sidebar_label: New Products
slug: /new-products/overview
---

# New Products

This section is a launchpad for **brand-new product documentation** that PMs are building out, before the product graduates to its own top-level collection in the CMS and a dedicated navbar entry.

Pages here are added through the **"✨ Add New Product Documentation"** collection in the CMS at [developer.exotel.com/admin/](https://developer.exotel.com/admin/). Once a product is mature enough to deserve its own dedicated section in the navbar, an engineer will:

1. Move its folder out of `docs/new-products/<product>/` into `docs/<product>/`
2. Create a top-level CMS collection for it
3. Add a dedicated sidebar in `sidebars.ts`
4. Add a dropdown entry in `docusaurus.config.ts`
5. Set up redirects from the old path

Until then, everything lives here.

## Currently in incubation

Browse the left sidebar to see all products currently being documented in this section. Each product gets its own folder; pages auto-discover into the sidebar.

## For PMs — How to add a new product

1. Open https://developer.exotel.com/admin/ and sign in
2. In the left sidebar of the CMS, scroll to **"✨ Add New Product Documentation"**
3. Click **"New ✨ Add New Product Documentation"** (button top right)
4. In the **Path** field, enter `<product-slug>/<page-name>` — e.g. `my-product/overview` for the landing page, `my-product/api-reference/send` for an API endpoint
5. Fill in Title, optional Sidebar Label, and the Body in markdown
6. **Save** → goes into review queue → click **Publish** when ready

Your page goes live at `/docs/new-products/<product-slug>/<page-name>` and auto-appears in this section's left sidebar within a couple of minutes after Vercel's auto-build completes.

## Promoting to a top-level product

When you're ready for your product to have:
- Its own dedicated CMS collection
- Its own navbar dropdown entry
- A homepage card
- Custom redirects from old URLs

…ping **rahul.kumar@exotel.com** with your product slug and we'll graduate it.
