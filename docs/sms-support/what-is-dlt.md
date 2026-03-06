---
id: what-is-dlt
title: What Is DLT?
description: "Understand India's Distributed Ledger Technology (DLT) framework for telecom -- TRAI regulations, registration requirements, and how it works."
sidebar_label: What Is DLT?
sidebar_position: 18
---

# What Is DLT?

DLT (Distributed Ledger Technology) is a blockchain-based regulatory framework mandated by TRAI (Telecom Regulatory Authority of India) to control unsolicited commercial communications (UCC), commonly known as spam SMS and calls. This guide explains how DLT works and why it is essential for sending SMS in India.

## Background

Prior to DLT, Indian consumers were overwhelmed by unsolicited marketing messages and calls. Despite the National Do Not Disturb (DND) registry, spam remained widespread because there was no reliable way to trace and verify the origin of commercial messages.

In 2018, TRAI introduced the Telecom Commercial Communications Customer Preference Regulations (TCCCPR) and mandated all telecom operators to implement a DLT-based system for managing commercial communications. The system went live across all operators by 2021.

## How DLT Works

The DLT platform is a shared, distributed database (blockchain) operated by telecom operators that stores and validates:

```
┌────────────────────┐
│  Entity             │  (Registered businesses)
│  Registration        │
└────────┬───────────┘
         ↓
┌────────────────────┐
│  Header             │  (Sender IDs like EXOTL)
│  Registration        │
└────────┬───────────┘
         ↓
┌────────────────────┐
│  Template            │  (Approved message formats)
│  Registration        │
└────────┬───────────┘
         ↓
┌────────────────────┐
│  Consent             │  (Customer opt-in records)
│  Registration        │
└────────┬───────────┘
         ↓
┌────────────────────┐
│  Message Scrubbing   │  (Real-time validation)
└────────────────────┘
```

### The Scrubbing Process

Every time an SMS is sent in India, the telecom operator performs a real-time validation (called "scrubbing") against the DLT database:

1. **Entity Verification** -- Is the sender a registered business?
2. **Header Validation** -- Is the sender ID (header) approved for this entity?
3. **Template Matching** -- Does the message body match an approved template?
4. **Consent Check** -- For promotional messages, has the recipient given consent?
5. **DND/Preference Check** -- Has the recipient blocked this type of message?

If any check fails, the message is blocked by the operator and never delivered.

## Key Components of DLT

### 1. Entity Registration

Every business that sends SMS must register on a DLT portal as either:

| Entity Type | Description | Example |
|-------------|-------------|---------|
| **Enterprise** | A business sending SMS for its own purposes | E-commerce company, bank, hospital |
| **Aggregator** | A service provider sending SMS on behalf of clients | Exotel, bulk SMS providers |

Upon registration, you receive a **Principal Entity ID (PE ID)**, a unique numeric identifier used in all SMS API calls.

For step-by-step registration, see [DLT Entity Registration](/docs/sms-support/dlt-entity-registration).

### 2. Headers (Sender IDs)

A header is the sender identity displayed on the recipient's phone:

| Type | Format | Example | Visibility |
|------|--------|---------|------------|
| Transactional | 6 alphabetic characters | `EXOTL` | Shows as `XX-EXOTL` (XX = operator prefix) |
| Promotional | 6 numeric digits | `777888` | Shows as numeric code |

See [DLT Header Registration](/docs/sms-support/dlt-header-registration) for details.

### 3. Content Templates

All message content must be pre-registered as templates. Each template specifies:

- The message body with `{#var#}` placeholders for dynamic content
- The template type (transactional, promotional, service implicit, service explicit)
- The associated header

See [DLT Template Registration](/docs/sms-support/dlt-template-registration) for details.

### 4. Consent Records

For promotional messages, businesses must register customer consent on the DLT platform, proving the customer has opted in to receive messages.

See [DLT Consent Templates](/docs/sms-support/dlt-consent-template) for details.

## DLT Portals

DLT platforms are operated by individual telecom operators, but registration on any one portal is shared across all operators via the distributed ledger:

| Operator | Portal | URL |
|----------|--------|-----|
| Jio | TrueConnect | [trueconnect.jio.com](https://trueconnect.jio.com) |
| Airtel | Airtel IQ DLT | [airtel.in/business/commercial-communication](https://www.airtel.in/business/commercial-communication) |
| Vodafone-Idea | ViLPower | [vilpower.in](https://www.vilpower.in) |
| BSNL | UCC-BSNL | [ucc-bsnl.co.in](https://www.ucc-bsnl.co.in) |
| MTNL | UCC-MTNL | [ucc-mtnl.in](https://www.ucc-mtnl.in) |
| Smartping | Videocon | [smartping.live](https://smartping.live) |

:::tip
You only need to register on **one** DLT portal. Your registration propagates to all operators via the shared DLT blockchain. Most businesses choose Jio TrueConnect or Vodafone-Idea (ViLPower) for their faster approval processes.
:::

## Message Categories Under DLT

TRAI defines several categories of commercial communication, each with different rules:

| Category | Code | DND Bypass | Timing Restriction | Consent Required |
|----------|------|------------|--------------------|--------------------|
| **Transactional** | T | Yes | 24/7 | Implied (existing relationship) |
| **Service Implicit** | SI | Yes | 24/7 | Implied (existing relationship) |
| **Service Explicit** | SE | Partial | 24/7 | Explicit opt-in |
| **Promotional** | P | No | 9 AM - 9 PM IST | Explicit opt-in |

:::warning
Sending promotional SMS to DND-registered numbers is a violation of TRAI regulations and can result in penalties and account suspension. Always use the correct message category.
:::

## Impact on SMS Delivery

DLT has several effects on how SMS works in India:

### Benefits
- **Reduced spam** -- Consumers receive fewer unsolicited messages
- **Traceability** -- All messages can be traced to the sending entity
- **Consumer control** -- Customers can set preferences for the types of messages they receive
- **Accountability** -- Businesses must register and comply with content rules

### Challenges
- **Setup time** -- Entity registration and template approval can take 1-2 weeks
- **Template rigidity** -- Messages must exactly match approved templates
- **Cross-portal sync delays** -- Registration changes may take 5-7 days to propagate
- **Template rejection** -- Poorly worded templates may be rejected, requiring revision and resubmission

## DLT and Exotel

Exotel integrates seamlessly with the DLT framework:

1. **DLT parameter support** -- The Exotel API accepts `DltEntityId` and `DltTemplateId` parameters.
2. **Template validation** -- Exotel validates your message against DLT templates before submission.
3. **Onboarding assistance** -- Exotel's support team can guide you through the DLT registration process.
4. **Error reporting** -- DLT-specific error codes help you diagnose template and sender ID issues.

## Frequently Asked Questions

**Q: Is DLT required for OTP messages?**
A: Yes. All SMS in India, including OTPs, require DLT registration. OTPs are sent as transactional messages which bypass DND.

**Q: Can I register on multiple DLT portals?**
A: You only need to register on one portal. However, you can register on multiple portals if needed. The registrations sync across the DLT blockchain.

**Q: How long does DLT registration take?**
A: Entity registration takes 3-7 business days. Header and template approvals take 1-3 business days each.

**Q: Does DLT apply to international SMS?**
A: DLT applies only to SMS sent to Indian mobile numbers. International SMS to numbers outside India is not subject to DLT regulations.

**Q: What happens if I send SMS without DLT registration?**
A: The message will be blocked by the telecom operator at the scrubbing stage and will not be delivered.

## Next Steps

- [DLT Registration](/docs/sms-support/dlt-registration) -- Start the DLT registration process
- [DLT Entity Registration](/docs/sms-support/dlt-entity-registration) -- Detailed entity registration guide
- [DLT Guide](/docs/sms-support/dlt-guide) -- Step-by-step walkthrough for major DLT portals
- [SMS API Reference](/docs/sms-api/overview) -- API documentation
