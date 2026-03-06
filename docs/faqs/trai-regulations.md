---
title: TRAI Regulations Overview
description: "Overview of India's TRAI telecom regulations affecting Exotel users, including calling hours, DLT, DND, and commercial communication rules."
sidebar_label: TRAI Regulations
sidebar_position: 10
---

# TRAI Regulations Overview

The Telecom Regulatory Authority of India (TRAI) sets the rules governing commercial voice calls, SMS, and other telecom services in India. As an Exotel user operating in India, understanding these regulations is essential for compliant communication.

---

## What is TRAI?

TRAI is India's independent regulatory body for the telecommunications sector. Established in 1997, TRAI sets policies and regulations that govern:

- Commercial communication (voice calls and SMS) to consumers
- Do Not Disturb (DND) registries and preferences
- SMS sender registration through DLT
- Calling hours and frequency restrictions
- Spam prevention and penalties
- Telecom service quality standards

---

## Key Regulations Affecting Exotel Users

| Regulation | Year | Impact | Related Guide |
|-----------|------|--------|---------------|
| **TCCCPR** | 2018 | Governs all commercial communication; requires consent and preference registration | [TCCCPR 2018](/docs/faqs/tcccpr-2018) |
| **DLT Framework** | 2021 | Mandatory SMS sender and template registration | [DLT Compliance](/docs/faqs/dlt-compliance) |
| **NDNC/DND Registry** | 2007 (updated) | Do Not Call registry compliance for commercial calls and SMS | [NDNC/DND](/docs/faqs/ndnc-dnd) |
| **Calling Hours** | Part of TCCCPR | Commercial calls restricted to 9 AM -- 9 PM | [Calling Hours](/docs/faqs/calling-hours) |
| **UCC Regulations** | Ongoing | Anti-spam rules, penalties for violations | [Spam Prevention](/docs/faqs/spam-prevention) |

---

## Commercial Communication Categories

TRAI classifies commercial communication into categories that determine delivery rules:

| Category | Description | DND Filtering | Time Restriction |
|----------|-------------|--------------|-----------------|
| **Transactional** | OTPs, order updates, account alerts | Not filtered | 24/7 |
| **Service - Implicit** | Updates to existing customers | Partially filtered | 24/7 |
| **Service - Explicit** | Communication to explicitly consenting users | Partially filtered | 24/7 |
| **Promotional** | Marketing, offers, advertisements | Fully filtered (DND applies) | 9 AM -- 9 PM IST |

:::info
Correctly categorizing your communication is critical. Sending promotional content through transactional channels is a regulatory violation and can result in penalties, account suspension, or blacklisting by telecom operators.
:::

---

## Consent Requirements

TRAI mandates that businesses obtain and maintain consent records for commercial communication:

### Types of Consent

| Type | Meaning | Required For | Evidence |
|------|---------|-------------|----------|
| **Explicit consent** | Customer directly opted in | Promotional communication | Written record, opt-in form, digital consent |
| **Implicit consent** | Existing business relationship | Service communication | Transaction records, account history |
| **No consent needed** | Purely transactional | OTPs, order confirmations | Transaction trigger (order placed, payment initiated) |

### Consent Best Practices

1. Maintain a consent database with timestamps and source of consent
2. Provide clear opt-out mechanisms in every communication
3. Honor opt-out requests within 7 days
4. Do not purchase or share consent lists
5. Regularly audit your consent records for compliance

---

## DLT (Distributed Ledger Technology) Requirements

Since 2021, TRAI requires all commercial SMS in India to be sent through the DLT framework:

### What You Need

| Requirement | Description | Where to Register |
|-------------|-------------|-------------------|
| **Entity registration** | Register your business on a DLT portal | Jio, Airtel, VI, or BSNL DLT portals |
| **Entity ID** | Unique identifier assigned to your business | Issued by the DLT portal |
| **Sender ID (Header)** | The name shown as the SMS sender | Registered on DLT portal |
| **Template registration** | Pre-approve every message template | Registered on DLT portal |
| **Template ID** | Unique identifier for each approved template | Issued by the DLT portal |

For detailed DLT setup instructions, see [DLT Compliance](/docs/faqs/dlt-compliance).

---

## DND/NDNC Compliance

The National Do Not Call (NDNC) registry allows Indian consumers to block unsolicited commercial communication:

### How It Affects Your Campaigns

| Communication Type | DND Impact |
|-------------------|------------|
| Promotional calls | Blocked for DND-registered numbers |
| Promotional SMS | Blocked for DND-registered numbers |
| Transactional calls | Generally allowed (with valid consent) |
| Transactional SMS | Allowed (sent via DLT transactional route) |
| Service messages | Partially affected based on DND preferences |

For detailed NDNC information, see [NDNC/DND Compliance](/docs/faqs/ndnc-dnd).

---

## Penalties for Non-Compliance

TRAI enforces penalties for regulatory violations:

| Violation | Penalty |
|-----------|---------|
| Calling DND-registered numbers (promotional) | Up to INR 1,000 per complaint per day |
| Sending SMS without DLT registration | Messages blocked; potential blacklisting |
| Commercial calls outside 9 AM -- 9 PM | Fines and potential service suspension |
| Sending more than permitted volume | Temporary blocking by operator |
| Repeated violations | Disconnection of telecom resources |

:::warning
TRAI penalties are imposed on the sender (your business), not on Exotel. Ensure your campaigns comply with all regulations. Exotel provides tools for DND filtering and scheduling compliance, but the responsibility for regulatory compliance lies with you.
:::

---

## How Exotel Helps with Compliance

Exotel provides built-in features to support TRAI compliance:

| Feature | How It Helps |
|---------|-------------|
| **DND/NDNC filtering** | Automatically filters DND numbers from campaigns |
| **DLT integration** | Validates Entity ID and Template ID for every SMS |
| **Campaign scheduling** | Lets you restrict campaigns to compliant hours |
| **Consent tracking** | Webhook data for building consent audit trails |
| **Call recording consent** | IVR applets for playing consent notifications |

---

## Staying Updated

TRAI regulations evolve regularly. Stay informed through:

- **TRAI website**: [trai.gov.in](https://trai.gov.in) for official notifications and consultation papers
- **Exotel blog**: Platform updates reflecting regulatory changes
- **Account manager**: Your Exotel account manager can advise on compliance requirements

---

## Related Resources

- [TCCCPR 2018](/docs/faqs/tcccpr-2018) -- Telecom Commercial Communications Customer Preference Regulations
- [DLT Compliance](/docs/faqs/dlt-compliance) -- DLT registration and template management
- [NDNC/DND](/docs/faqs/ndnc-dnd) -- National Do Not Call registry compliance
- [Calling Hours](/docs/faqs/calling-hours) -- Commercial calling hour restrictions
- [Spam Prevention](/docs/faqs/spam-prevention) -- Anti-spam rules and bulk limits
