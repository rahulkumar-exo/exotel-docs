---
id: number-requirements
title: WhatsApp Number Requirements
description: "Phone number requirements for WhatsApp Business API -- supported formats, migration from WhatsApp app, multi-number setup, and number quality guidelines."
sidebar_label: Number Requirements
sidebar_position: 4
---

# WhatsApp Number Requirements

Your phone number is the identity of your WhatsApp Business API account. This guide covers the requirements, registration process, and best practices for managing your WhatsApp business numbers.

## Basic Requirements

| Requirement | Details |
|-------------|---------|
| **Format** | E.164 international format (e.g., +919876543210) |
| **Capability** | Must be able to receive SMS or voice calls (for one-time verification) |
| **WhatsApp Status** | Must NOT be currently registered on WhatsApp (personal or business app) |
| **Number Type** | Mobile or landline (with SMS/voice capability) |
| **Ownership** | You must own or have legal rights to the number |

## Supported Number Types

| Type | Supported | Notes |
|------|-----------|-------|
| Mobile numbers | Yes | Most common choice |
| Landline numbers | Yes | Must be able to receive voice call for verification |
| Toll-free numbers | Yes | Subject to regional availability |
| Virtual numbers (Exophones) | Yes | Check with Exotel for WhatsApp-eligible Exophones |
| Shared short codes | No | Not supported by Meta |

:::tip
If you plan to use WhatsApp alongside voice or SMS, discuss number strategy with your Exotel account manager. In some cases, you can use the same Exophone for WhatsApp and voice calls.
:::

## Number Registration Process

### New Number (Never Used on WhatsApp)

1. Navigate to **WhatsApp > Phone Numbers** in the Exotel dashboard
2. Click **Add Phone Number**
3. Enter the number in E.164 format
4. Choose verification method:
   - **SMS** -- A 6-digit code is sent via SMS
   - **Voice Call** -- An automated call reads out the 6-digit code
5. Enter the verification code within 10 minutes
6. Your number is now registered

### Migrating an Existing WhatsApp Number

If your number is currently registered on WhatsApp (personal app or Business app), you must deregister it first:

#### From WhatsApp Personal App
1. Open WhatsApp on your phone
2. Go to **Settings > Account > Delete my account**
3. Confirm the deletion
4. Wait **5 minutes** for Meta's systems to update
5. Proceed with registration on Exotel

#### From WhatsApp Business App
1. Open WhatsApp Business on your phone
2. Go to **Settings > Account > Delete my account**
3. Confirm the deletion
4. Wait **5 minutes** for Meta's systems to update
5. Proceed with registration on Exotel

#### From Another BSP
If your number is currently hosted with a different BSP (not Exotel):

1. Initiate a **number migration** request through Exotel support
2. Exotel coordinates the migration with the existing BSP
3. A 2-factor authentication code is generated
4. The number is transferred to Exotel's hosting
5. Your existing templates and quality rating are preserved

:::warning
Migrating from another BSP does NOT require deleting your WhatsApp account. Exotel handles the migration through Meta's official process. Deleting the account would cause you to lose your templates and messaging tier.
:::

## Multi-Number Setup

You can register multiple phone numbers under a single WABA:

| Feature | Details |
|---------|---------|
| **Maximum numbers per WABA** | Up to 20 (can be increased on request) |
| **Shared templates** | All numbers under a WABA share the same templates |
| **Independent quality** | Each number has its own quality rating |
| **Independent limits** | Each number has its own messaging limit tier |
| **Display name** | Each number can have a different display name |

### When to Use Multiple Numbers

- **Departments**: Different numbers for sales, support, and notifications
- **Regions**: Separate numbers for different countries or states
- **Brands**: Different numbers for different product lines
- **Use cases**: Separate transactional (utility) and marketing communications

## Number Quality and Restrictions

### Quality Rating

Each number has a quality rating that affects your messaging limits:

| Rating | Color | Impact |
|--------|-------|--------|
| **High** | Green | Eligible for messaging limit upgrades |
| **Medium** | Yellow | Current messaging limit maintained |
| **Low** | Red | Messaging limit may be downgraded |

Quality rating is determined by:
- Customer feedback (blocks and reports)
- Message delivery rates
- Template quality scores

For details, see [WhatsApp Quality Rating](/docs/whatsapp-support/quality-rating).

### Number Restrictions

| Restriction | Details |
|-------------|---------|
| **One platform per number** | A number can only be on one platform at a time (personal, business app, or API) |
| **No simultaneous use** | Cannot use the same number for both WhatsApp API and WhatsApp Business App |
| **Verification required** | Every new number must be verified via SMS or voice call |
| **Cool-down period** | After deregistering, wait at least 5 minutes before re-registering |

## Phone Number Formatting

Always use E.164 format when interacting with the Exotel API:

| Country | Example | E.164 Format |
|---------|---------|-------------|
| India | 98765 43210 | +919876543210 |
| Singapore | 8123 4567 | +6581234567 |
| Indonesia | 812-345-6789 | +628123456789 |
| Malaysia | 012-345 6789 | +60123456789 |
| Philippines | 0917 123 4567 | +639171234567 |

:::warning
Do not include leading zeros, spaces, dashes, or parentheses in the API. Always use the full international format with the `+` prefix and country code.
:::

## Number Deletion and Deregistration

To remove a number from WhatsApp Business API:

1. Navigate to **WhatsApp > Phone Numbers** in the Exotel dashboard
2. Select the number you want to remove
3. Click **Deregister Number**
4. Confirm the action

After deregistration:
- The number is released from the WhatsApp Business Platform
- You can re-register it on WhatsApp (personal, business app, or API) after 5 minutes
- Templates are retained at the WABA level but the number's quality rating is reset
- Active conversations may be disrupted

## Troubleshooting

| Issue | Resolution |
|-------|-----------|
| Verification code not received | Ensure the number can receive SMS/calls; try the alternate method (voice if SMS fails) |
| "Number already registered" error | Delete the WhatsApp account from the phone first, wait 5 minutes |
| Number migration stuck | Contact Exotel support; may require coordination with the previous BSP |
| Quality rating dropped to red | Review recent campaigns, check template feedback, pause marketing messages temporarily |

## Related Resources

- [Getting Started with WhatsApp](/docs/whatsapp-support/getting-started)
- [Display Name Guidelines](/docs/whatsapp-support/display-name-guidelines)
- [Quality Rating](/docs/whatsapp-support/quality-rating)
- [Messaging Limits](/docs/whatsapp-support/messaging-limits)
