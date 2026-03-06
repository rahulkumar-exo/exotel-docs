---
title: TCCCPR 2018
description: "Overview of India's Telecom Commercial Communications Customer Preference Regulations 2018 and how they affect Exotel users."
sidebar_label: TCCCPR 2018
sidebar_position: 13
---

# TCCCPR 2018 -- Telecom Commercial Communications Customer Preference Regulations

The Telecom Commercial Communications Customer Preference Regulations, 2018 (TCCCPR 2018) is TRAI's comprehensive framework governing all commercial communication in India. It replaced the earlier TCCCPR 2010 with stricter rules, mandatory DLT registration, and enhanced consumer protection.

---

## What is TCCCPR 2018?

TCCCPR 2018 is the regulatory framework that:

- Defines what constitutes commercial communication
- Establishes the DLT-based registration system for SMS senders
- Mandates consumer consent and preference management
- Sets rules for calling and messaging hours
- Defines penalties for non-compliance
- Requires telecom operators to block non-compliant messages

---

## Key Provisions

### 1. Mandatory Sender Registration

Every business sending commercial SMS must register on a DLT portal:

| Registration | What It Covers | Mandatory? |
|-------------|---------------|------------|
| Entity registration | Your business identity | Yes |
| Sender ID (Header) | The brand name shown to recipients | Yes |
| Template registration | Pre-approved message content | Yes |
| Content provider | Third-party senders (e.g., Exotel) | Yes |

### 2. Communication Categories

TCCCPR 2018 defines specific message categories with different rules:

| Category | Description | Consent Required | Time Restriction | DND Filtered |
|----------|-------------|-----------------|-----------------|-------------|
| Transactional | OTPs, alerts, updates | Implied (transaction trigger) | None (24/7) | No |
| Service - Implicit | Existing customer updates | Implicit (business relationship) | None (24/7) | Partially |
| Service - Explicit | Consented service messages | Explicit (opt-in) | None (24/7) | Partially |
| Promotional | Marketing, offers, ads | Explicit (opt-in) | 9 AM -- 9 PM IST | Yes |

### 3. Consumer Preferences

Consumers can register preferences to control what commercial communication they receive:

- **Full DND**: Block all commercial communication
- **Category-specific DND**: Block specific categories (real estate, education, banking, etc.)
- **Mode preference**: Block voice calls only, SMS only, or both
- **Opt-out**: Unsubscribe from specific senders

### 4. Consent Management

TCCCPR 2018 requires businesses to:

- Obtain explicit consent for promotional communication
- Maintain consent records with timestamps
- Register consent purposes on the DLT platform
- Honor consumer opt-out requests within 7 days
- Not share or transfer consent to third parties

### 5. Content Matching

All SMS must match a pre-registered DLT template. The telecom operator performs real-time content matching:

```
Registered template: "Dear {#var#}, your OTP is {#var#}. Valid for {#var#} minutes."
Sent message:        "Dear Rahul, your OTP is 456789. Valid for 5 minutes."
Result:              MATCH --> Delivered
```

```
Registered template: "Dear {#var#}, your OTP is {#var#}. Valid for {#var#} minutes."
Sent message:        "Hi Rahul, use code 456789 to login. Expires in 5 min."
Result:              MISMATCH --> Blocked
```

---

## Implications for Exotel Users

### SMS Campaigns

| Requirement | How to Comply |
|-------------|--------------|
| DLT Entity ID | Register on a DLT portal and include Entity ID in API calls |
| DLT Template ID | Register and approve templates; include Template ID in API calls |
| Correct Sender ID | Use registered Sender IDs associated with your templates |
| Category compliance | Use the correct SMS type (`trans`, `promo`, `si`, `se`) |
| Content matching | Ensure variable substitutions match the template structure |

### Voice Campaigns

| Requirement | How to Comply |
|-------------|--------------|
| Calling hours | Schedule campaigns within 9 AM -- 9 PM IST for commercial calls |
| DND compliance | Use Exotel's DND filtering for promotional campaigns |
| Consent records | Maintain records of consent for recipients |
| Caller ID | Use valid, registered ExoPhones |

### Consent Documentation

Maintain a consent database with the following fields:

| Field | Description | Example |
|-------|-------------|---------|
| Phone number | Consumer's phone number | `+919876543210` |
| Consent type | Explicit or implicit | `explicit` |
| Consent source | How consent was obtained | `website_signup_form` |
| Consent date | When consent was given | `2024-01-15T10:30:00+05:30` |
| Purpose | What the consent covers | `promotional_offers` |
| Opt-out date | When consent was revoked (if applicable) | `null` |

---

## Penalties Under TCCCPR 2018

| Violation | Penalty |
|-----------|---------|
| Sending UCC to DND-registered numbers | Up to INR 1,000 per message/call per day |
| Not registering on DLT | All SMS blocked |
| Using unregistered templates | Messages blocked |
| Sending outside permitted hours (promotional) | Fines and potential suspension |
| Failure to honor opt-out | Penalties and potential blacklisting |
| Repeated violations (7+ complaints in a month) | Disconnection of telecom resources for up to 2 years |

:::warning
Under TCCCPR 2018, penalties are cumulative. A single campaign that violates DND for 1,000 numbers could theoretically result in penalties of up to INR 10,00,000. Ensure strict compliance with all provisions.
:::

---

## Compliance Checklist for Exotel Users

1. Register your business on a DLT portal (Entity registration)
2. Register all Sender IDs (Headers) you plan to use
3. Register and get approval for all message templates
4. Configure DLT Entity ID and Template IDs in your Exotel account
5. Set correct SMS types (`trans`, `promo`) for each campaign
6. Schedule promotional campaigns within 9 AM -- 9 PM IST
7. Enable DND filtering for promotional campaigns
8. Maintain consent records with timestamps and sources
9. Provide opt-out mechanisms in promotional communications
10. Monitor and respond to DND complaints promptly

---

## Related Resources

- [TRAI Regulations](/docs/faqs/trai-regulations) -- Overview of Indian telecom regulatory landscape
- [DLT Compliance](/docs/faqs/dlt-compliance) -- Step-by-step DLT registration guide
- [NDNC/DND](/docs/faqs/ndnc-dnd) -- Do Not Call registry compliance
- [Calling Hours](/docs/faqs/calling-hours) -- Commercial calling hour restrictions
- [Spam Prevention](/docs/faqs/spam-prevention) -- Anti-spam rules and bulk limits
