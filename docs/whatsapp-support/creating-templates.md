---
id: creating-templates
title: Creating WhatsApp Templates
description: "Step-by-step guide to creating WhatsApp message templates via Exotel dashboard and Meta Business Manager with approval tips."
sidebar_label: Creating Templates
sidebar_position: 11
---

# Creating WhatsApp Templates

This guide walks you through creating WhatsApp message templates, from planning your template content to submitting it for Meta's review. Templates can be created via the Exotel Dashboard or directly in Meta Business Manager.

## Before You Start

Ensure you have:

| Prerequisite | Details |
|-------------|---------|
| Verified Meta Business Manager | Business verification approved |
| WhatsApp Business Account (WABA) | Connected to Exotel |
| Registered phone number | At least one active WhatsApp number |

## Template Naming Rules

| Rule | Details |
|------|---------|
| Characters | Lowercase letters, digits, and underscores only |
| No spaces | Use underscores instead of spaces |
| No special characters | No hyphens, periods, or other symbols |
| Max length | 512 characters |
| Unique per WABA | Each template name must be unique within your account |

**Good names:** `order_confirmation`, `otp_verification`, `delivery_update_v2`
**Bad names:** `Order Confirmation`, `otp-verification`, `delivery.update`

## Creating Templates via Exotel Dashboard

### Step 1: Navigate to Templates

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Go to **WhatsApp** > **Templates**.
3. Click **Create Template**.

### Step 2: Basic Information

| Field | Description | Example |
|-------|-------------|---------|
| Template Name | Unique identifier (lowercase, underscores) | `order_shipped` |
| Category | Utility, Authentication, or Marketing | `Utility` |
| Language | Primary language | `English (en)` |

### Step 3: Configure Header (Optional)

Choose a header type:

| Header Type | Description | Example |
|------------|-------------|---------|
| **None** | No header | -- |
| **Text** | Static or dynamic text (max 60 characters) | `Order Update` |
| **Image** | Dynamic image placeholder | Product photo |
| **Video** | Dynamic video placeholder | Tutorial video |
| **Document** | Dynamic document placeholder | Invoice PDF |

For media headers, you provide a sample file during creation and the actual media URL when sending.

### Step 4: Write the Body

Write your message body using `{{1}}`, `{{2}}`, etc. for dynamic content:

```
Hello {{1}}, your order #{{2}} has been shipped!

Courier: {{3}}
Tracking ID: {{4}}
Expected delivery: {{5}}

Track your order at {{6}}.
```

**Body rules:**

| Rule | Details |
|------|---------|
| Max length | 1,024 characters |
| Parameters | Numbered sequentially: `{{1}}`, `{{2}}`, `{{3}}` |
| Formatting | Supports bold, italic, strikethrough, monospace |
| Links | URLs are auto-linked |
| Line breaks | Supported |
| Emojis | Supported |

### Step 5: Add Footer (Optional)

A short text line below the body:

| Rule | Details |
|------|---------|
| Max length | 60 characters |
| Dynamic content | Not supported (static text only) |
| Formatting | No formatting supported |

Example: `Thank you for shopping with us!`

### Step 6: Add Buttons (Optional)

#### Quick Reply Buttons

Customers tap to respond with a predefined message.

| Property | Limit |
|----------|-------|
| Max buttons | 3 |
| Button text | Max 20 characters |
| Button type | `QUICK_REPLY` |

Example buttons: `Track Order`, `Contact Support`, `View Details`

#### Call-to-Action Buttons

Buttons that trigger an action:

| Button Type | Description | Max Count |
|------------|-------------|-----------|
| **Visit Website** | Opens a URL | 2 |
| **Call Phone Number** | Initiates a phone call | 1 |

For URL buttons, you can include a dynamic suffix:

```
Static URL: https://example.com/track/
Dynamic suffix: {{1}} → resolves to order ID
Full URL: https://example.com/track/ORD-12345
```

### Step 7: Provide Sample Content

Meta requires sample values for all parameters to understand the template context:

| Parameter | Sample Value |
|-----------|-------------|
| `{{1}}` | Rahul |
| `{{2}}` | ORD-12345 |
| `{{3}}` | BlueDart |
| `{{4}}` | BD123456789 |
| `{{5}}` | January 25, 2025 |
| `{{6}}` | https://example.com/track/ORD-12345 |

:::tip
Provide realistic sample values. Meta reviewers use these to understand the template's purpose. Generic samples like "test" or "123" may lead to rejection.
:::

### Step 8: Submit for Review

1. Review all template components.
2. Click **Submit**.
3. The template enters `PENDING` status while Meta reviews it.

## Creating Templates via Meta Business Manager

### Step 1: Access Template Manager

1. Go to [business.facebook.com](https://business.facebook.com).
2. Navigate to your **WhatsApp Account**.
3. Click **Message Templates** > **Create Template**.

### Step 2: Select Category

Choose the template category:

- **Utility** -- Order updates, account alerts, payment confirmations
- **Authentication** -- OTPs, verification codes
- **Marketing** -- Promotions, offers, re-engagement

See [Template Categories](/docs/whatsapp-support/template-categories) for detailed guidance.

### Step 3: Configure Template

Follow the same steps as the Exotel dashboard: name, language, header, body, footer, and buttons.

### Step 4: Submit

Click **Submit** to send for Meta review.

## Template Examples

### Utility: Order Confirmation

```
Name: order_confirmation
Category: Utility
Language: English

Header: (none)
Body: Hi {{1}}, your order #{{2}} has been confirmed!

Amount: Rs. {{3}}
Payment method: {{4}}

We'll notify you when it ships.
Footer: Thank you for your purchase!
Buttons: [Track Order] (URL), [Contact Support] (Quick Reply)
```

### Authentication: OTP

```
Name: login_otp
Category: Authentication
Language: English

Header: (none)
Body: {{1}} is your verification code. This code expires in {{2}} minutes. Do not share this code with anyone.
Footer: (none)
Buttons: [Copy Code] (Quick Reply)
```

### Marketing: Promotional Offer

```
Name: seasonal_sale
Category: Marketing
Language: English

Header: (Image - sale banner)
Body: Hi {{1}}, our biggest sale of the year is here!

Get up to {{2}}% off on {{3}}.
Offer valid until {{4}}.

Shop now and save big!
Footer: Reply STOP to unsubscribe
Buttons: [Shop Now] (URL)
```

### Multi-Language: Hindi Order Update

```
Name: order_update_hindi
Category: Utility
Language: Hindi (hi)

Header: (none)
Body: नमस्ते {{1}}, आपका ऑर्डर #{{2}} शिप कर दिया गया है।

कूरियर: {{3}}
ट्रैकिंग ID: {{4}}
डिलीवरी: {{5}}
Footer: धन्यवाद!
Buttons: [ट्रैक करें] (URL)
```

## Multi-Language Templates

You can create the same template in multiple languages:

1. Create the template in your primary language.
2. After approval, click **Add Language** on the template.
3. Select the additional language.
4. Translate the body, header, footer, and button text.
5. Submit the language variant for review.

Supported languages include English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, and 60+ others.

## Template Review Process

| Step | Description | Duration |
|------|-------------|----------|
| Submitted | Template enters review queue | Immediate |
| Automated checks | Meta's system checks for policy violations | Minutes |
| Manual review (if needed) | Human reviewer checks content | Up to 24 hours |
| Decision | Approved or Rejected | -- |

### After Approval

- Template status changes to `APPROVED`.
- You can immediately use it to send messages.
- Monitor the template's quality rating in the dashboard.

### After Rejection

- Review the rejection reason provided by Meta.
- Common reasons: see [Template Guidelines](/docs/whatsapp-support/template-guidelines).
- Create a new template with the corrected content and resubmit.

:::warning
You cannot edit an approved or rejected template. To make changes, create a new template with a different name (e.g., `order_confirmation_v2`) and submit for review.
:::

## Best Practices

1. **Start with utility templates** -- They have the highest approval rate.
2. **Use clear, specific language** -- Avoid vague or generic messages.
3. **Provide realistic samples** -- Help reviewers understand the template's purpose.
4. **Keep it concise** -- Shorter templates are easier to read on mobile.
5. **Include a clear CTA** -- Tell customers what to do next with buttons or links.
6. **Add opt-out for marketing** -- Include "Reply STOP to unsubscribe" in marketing templates.
7. **Test approved templates** -- Send a test message before launching a campaign.

## Next Steps

- [Template Guidelines](/docs/whatsapp-support/template-guidelines) -- Approval and rejection criteria
- [Template Categories](/docs/whatsapp-support/template-categories) -- Category details
- [Template Messages](/docs/whatsapp-support/template-messages) -- Sending templates via API
- [WhatsApp API Reference](/docs/whatsapp-api/overview) -- API documentation
