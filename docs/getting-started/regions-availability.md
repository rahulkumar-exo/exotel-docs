---
title: Regions & Availability
description: "Exotel service regions including India, Singapore, Malaysia, and Middle East. Data residency, API endpoints, and available features by region."
sidebar_label: Regions & Availability
sidebar_position: 13
---

# Regions & Availability

Exotel operates across multiple regions in Asia and the Middle East. Your account region determines your API endpoints, data storage location, available phone number types, and applicable regulations. This guide covers all available regions and their characteristics.

## Available Regions

| Region | Data Center | API Base URL | Dashboard |
|--------|------------|-------------|-----------|
| **India (Mumbai)** | AWS ap-south-1, Mumbai | `api.in.exotel.com` | [my.exotel.com](https://my.exotel.com) |
| **Singapore** | AWS ap-southeast-1, Singapore | `api.exotel.com` | [my.exotel.com](https://my.exotel.com) |

:::info
Your account region is selected during account creation and **cannot be changed** afterward. Choose the region closest to your primary user base for optimal performance and regulatory compliance.
:::

## Region Comparison

| Feature | India (Mumbai) | Singapore |
|---------|---------------|-----------|
| **API base URL** | `api.in.exotel.com` | `api.exotel.com` |
| **Data residency** | India | Singapore |
| **Voice calls** | India, limited international | Southeast Asia, Middle East, international |
| **SMS** | India (DLT required) | Singapore, Malaysia, regional |
| **WhatsApp** | Available | Available |
| **Phone number types** | Local DID, Toll-free, Mobile | Local DID, regional |
| **Regulations** | TRAI, DLT, NDNC | IMDA (Singapore), local regulations |
| **Currency** | INR | USD |
| **Support hours** | IST business hours + priority support | SGT business hours + priority support |

## Countries Served by Region

### India Region

The India region primarily serves businesses operating within India:

| Country | Voice | SMS | Phone Numbers |
|---------|-------|-----|---------------|
| India | Full support | Full (DLT required) | Local DID, Toll-free, Mobile |

**Outbound international calling** from the India region is available to select countries on specific plans. Contact your account manager for international calling enablement.

### Singapore Region

The Singapore region serves businesses across Southeast Asia and the Middle East:

| Country | Voice | SMS | Phone Numbers |
|---------|-------|-----|---------------|
| Singapore | Full support | Full | Local DID |
| Malaysia | Full support | Full | Local DID |
| UAE | Available | Limited | Subject to TRA regulations |
| Saudi Arabia | Available | Limited | Subject to CITC regulations |
| Indonesia | Available | Available | Subject to local regulations |
| Thailand | Available | Available | Subject to local regulations |

:::info
Feature availability in specific countries may change based on local telecom regulations and carrier partnerships. Contact your account manager for the latest availability in your target country.
:::

## Choosing Your Region

### Decision Factors

| Factor | Choose India (Mumbai) | Choose Singapore |
|--------|----------------------|-----------------|
| **Primary audience** | Indian customers | SEA / Middle East customers |
| **Data residency** | Indian data localization required | No India data residency requirement |
| **Phone numbers** | Need Indian phone numbers | Need SEA/ME phone numbers |
| **Regulations** | Subject to TRAI/DLT | Subject to IMDA or regional regulations |
| **Latency** | Optimized for India | Optimized for Singapore/SEA |
| **Multi-country** | India-only operations | Multi-country operations in Asia |

### Common Scenarios

| Business Type | Recommended Region | Reason |
|--------------|-------------------|--------|
| Indian SaaS company | India (Mumbai) | Data localization, Indian phone numbers, DLT compliance |
| Indian company with global customers | Singapore | Better international connectivity |
| Singapore-based startup | Singapore | Local numbers, SEA coverage |
| Multi-national (India + SEA) | Both (separate accounts) | Comply with local regulations in each market |
| Middle East focused | Singapore | Regional carrier connectivity |

## Multi-Region Strategy

If your business operates across multiple regions, create separate Exotel accounts for each:

| Region Account | Purpose | API Base URL |
|---------------|---------|-------------|
| India account | Indian customers, DLT-compliant SMS | `api.in.exotel.com` |
| Singapore account | SEA and ME customers | `api.exotel.com` |

### Managing Multiple Accounts

- Use different API credentials for each region
- Configure region-specific webhook endpoints
- Maintain separate contact lists per region
- Follow local regulations for each region
- Use a unified CRM with region-specific integrations

:::tip
If you maintain multiple Exotel accounts across regions, use a consistent naming convention for campaigns, contact lists, and call flows to make cross-region management easier.
:::

## Data Residency

| Region | Data Stored In | Compliant With |
|--------|---------------|---------------|
| India (Mumbai) | AWS Mumbai (ap-south-1) | Indian data localization, RBI guidelines |
| Singapore | AWS Singapore (ap-southeast-1) | PDPA (Singapore), GDPR (with DPA) |

### What Data is Stored

| Data Type | Location | Retention |
|-----------|----------|-----------|
| Call recordings | Account region | 90 days (default) |
| CDRs (call detail records) | Account region | 1 year |
| SMS logs | Account region | 1 year |
| Contact lists | Account region | Until deleted |
| Account configuration | Account region | Active while account exists |

Data never moves between regions unless explicitly requested through a data export.

## API Endpoint Reference

### India Region Endpoints

| Service | Base URL |
|---------|----------|
| Voice API | `https://api.in.exotel.com/v2/accounts/<sid>/` |
| SMS API | `https://api.in.exotel.com/v2/accounts/<sid>/` |
| Campaign API | `https://api.in.exotel.com/v2/accounts/<sid>/` |
| WhatsApp API | `https://api.in.exotel.com/v2/accounts/<sid>/` |

### Singapore Region Endpoints

| Service | Base URL |
|---------|----------|
| Voice API | `https://api.exotel.com/v2/accounts/<sid>/` |
| SMS API | `https://api.exotel.com/v2/accounts/<sid>/` |
| Campaign API | `https://api.exotel.com/v2/accounts/<sid>/` |
| WhatsApp API | `https://api.exotel.com/v2/accounts/<sid>/` |

:::warning
Using the wrong regional API endpoint results in authentication errors or unexpected behavior. Always verify your API base URL matches your account region.
:::

## Regional Pricing

Pricing varies by region due to different telecom costs and currency:

| Region | Currency | Voice Pricing | SMS Pricing |
|--------|----------|--------------|-------------|
| India | INR | Per-pulse (60-second pulse) | Per-message |
| Singapore | USD | Per-minute | Per-message |

Specific rates depend on your plan, call direction (inbound/outbound), number type, and destination. Check your rate card in **Dashboard > Settings > Billing** or contact your account manager.

## Frequently Asked Questions

### Can I switch regions after account creation?

No. The region is set during account creation and cannot be changed. If you need to operate in a different region, create a new account in that region and migrate your configuration.

### Can I make calls from India to Singapore using an Indian account?

Yes, if international calling is enabled on your Indian account. The call originates from your Indian ExoPhone and routes to the Singapore number. International calling rates apply.

### Do both regions support all Exotel features?

Most features are available in both regions. However, some features may have regional variations:

| Feature | India | Singapore | Notes |
|---------|-------|-----------|-------|
| DLT SMS compliance | Required | Not applicable | India-specific regulation |
| NDNC/DND filtering | Available | Not applicable | India-specific regulation |
| Toll-free numbers | Available | Limited | Depends on local availability |
| Contact center | Available | Available | Feature parity |
| WebRTC | Available | Available | Feature parity |
| WhatsApp | Available | Available | Feature parity |

---

## Related Resources

- [Create Account](/docs/getting-started/create-account) -- Select your region during signup
- [API Credentials](/docs/getting-started/api-credentials) -- Region-specific API endpoints
- [ExoPhone Setup](/docs/getting-started/exophone-setup) -- Available number types by region
- [International Calling](/docs/faqs/international-calling) -- Cross-region calling details
