---
title: Data Privacy & Retention
description: "Exotel data privacy policies including data retention periods, call recording consent, GDPR compliance, and data deletion procedures."
sidebar_label: Data Privacy
sidebar_position: 16
---

# Data Privacy & Retention

This guide covers Exotel's data privacy practices including data retention policies, call recording consent requirements, GDPR compliance, and how to manage your data.

---

## Data Retention Policies

Exotel retains different types of data for different periods based on regulatory requirements and operational needs:

| Data Type | Default Retention | Configurable? | Notes |
|-----------|------------------|--------------|-------|
| Call recordings | 90 days | Yes (plan-dependent) | Downloaded recordings are your responsibility |
| Call detail records (CDRs) | 1 year | No | Required for billing and compliance |
| SMS delivery logs | 1 year | No | Required for DLT compliance |
| Campaign reports | 1 year | No | Available via API and dashboard |
| Contact lists | Until deleted | Yes | You control list lifecycle |
| Account activity logs | 2 years | No | Security audit trail |
| API access logs | 90 days | No | For troubleshooting and security |
| Webhook delivery logs | 30 days | No | For debugging failed deliveries |

:::warning
After the retention period expires, data is permanently deleted and cannot be recovered. Download call recordings, export CDRs, and back up any data you need before the retention period ends.
:::

### Extending Retention

Enterprise plans may offer extended retention periods:

| Plan | Default Recording Retention | Extended Option |
|------|---------------------------|-----------------|
| Starter | 90 days | Not available |
| Growth | 90 days | Up to 180 days |
| Enterprise | 90 days | Custom (up to 365 days) |

Contact your account manager to configure extended retention.

---

## Call Recording Consent

### Legal Requirements

Recording calls without informing the parties may violate privacy laws in most jurisdictions. In India, relevant regulations include:

| Regulation | Requirement |
|-----------|-------------|
| Indian Telegraph Act | Interception and recording must be lawful |
| Information Technology Act, 2000 | Protects personal data and privacy |
| Right to Privacy (Supreme Court ruling) | Privacy is a fundamental right |
| Contract law | Consent can be obtained as part of service terms |

### Best Practices for Recording Consent

1. **Play a consent announcement** at the beginning of every recorded call:

   ```
   "This call may be recorded for quality and training purposes."
   ```

2. **Provide opt-out option** where feasible:

   ```
   "Press 1 to continue with call recording, or press 2 to opt out."
   ```

3. **Configure consent in IVR flows**: Add a Greeting applet at the start of your call flow with the recording consent message.

4. **Document your consent policy**: Include call recording in your terms of service and privacy policy.

### Configuring Recording in Exotel

| Method | How to Enable |
|--------|--------------|
| Per-call flow | Enable recording in the Connect applet settings |
| Per-API call | Set `record=true` in the API request |
| Account-level | Configure default recording in Dashboard > Settings |

:::info
Call recording is **not** enabled by default. You must explicitly enable it for each call flow or API call. This design ensures you are aware of and consent to every recording.
:::

---

## Data Storage and Residency

### Where Data is Stored

| Exotel Region | Data Center | Location |
|--------------|-------------|----------|
| India | AWS Mumbai (ap-south-1) | Mumbai, India |
| Singapore | AWS Singapore (ap-southeast-1) | Singapore |

Data is stored exclusively in the region selected during account creation. There is no automatic cross-region replication.

### Data Residency Compliance

| Requirement | Exotel Support |
|-------------|---------------|
| Indian data localization | Use the Mumbai region for full compliance |
| GDPR data residency | Singapore region; DPA available on request |
| Cross-border data transfers | Data does not move between regions by default |

---

## GDPR Compliance

For customers processing data of EU residents, Exotel supports GDPR requirements:

### Data Subject Rights

| Right | Exotel Support | Process |
|-------|---------------|---------|
| Right to access | Yes | Export data via API or dashboard |
| Right to rectification | Yes | Update contact records via API |
| Right to erasure | Yes | Delete specific records; request account-level deletion |
| Right to portability | Yes | Export data in machine-readable format (CSV, JSON) |
| Right to restrict processing | Yes | Pause campaigns; disable specific features |
| Right to object | Yes | Remove contacts from campaign lists |

### Data Processing Agreement (DPA)

Enterprise customers processing EU data can request a DPA that covers:

- Data processing scope and purpose
- Sub-processor list and notifications
- Data breach notification procedures (within 72 hours)
- Data deletion upon contract termination
- Security measures and audit rights

Contact your account manager or **hello@exotel.com** to request a DPA.

### Breach Notification

In the event of a data breach affecting personal data:

1. Exotel identifies and contains the breach
2. Affected customers are notified within 72 hours
3. Details provided: nature of breach, data affected, remediation steps
4. Ongoing updates until the breach is resolved

---

## Data Encryption

| Layer | Method | Details |
|-------|--------|---------|
| In transit | TLS 1.2+ | All API calls, webhooks, and dashboard access |
| At rest | AES-256 | Call recordings, CDRs, customer data |
| API credentials | Hashed | Tokens are never stored in plaintext |
| Database | Encrypted volumes | AWS EBS encryption |

---

## Managing Your Data

### Exporting Data

| Data Type | Export Method | Format |
|-----------|-------------|--------|
| Call recordings | Dashboard download or API | MP3 / WAV |
| Call detail records | Dashboard export or API | CSV / JSON |
| SMS logs | Dashboard export or API | CSV / JSON |
| Campaign reports | Dashboard export or API | CSV |
| Contact lists | API | CSV |

### Deleting Data

| Data Type | How to Delete | Reversible? |
|-----------|--------------|-------------|
| Contact lists | API DELETE or Dashboard | No |
| Individual recordings | Contact support | No |
| Account data | Request account deletion | No |
| Campaign data | Automatic after retention period | No |

:::warning
Data deletion is permanent and irreversible. Before requesting deletion, export any data you may need in the future. Exotel cannot recover deleted data after the deletion is processed.
:::

### Account Deletion

To delete your entire Exotel account and all associated data:

1. Export all data you need (recordings, CDRs, reports)
2. Release all active ExoPhones
3. Complete all pending campaigns
4. Clear any outstanding invoices
5. Contact **hello@exotel.com** with your Account SID and deletion request
6. Exotel processes the request within 30 days

---

## Third-Party Data Sharing

Exotel does not sell or share customer data with third parties for marketing purposes. Data may be shared with:

| Third Party | Purpose | Safeguard |
|------------|---------|-----------|
| Telecom operators | Call and SMS routing (required for service) | Operator agreements and regulations |
| Cloud infrastructure (AWS) | Data storage and processing | AWS compliance certifications |
| Payment processors | Billing and transactions | PCI DSS compliance |

---

## Frequently Asked Questions

### Can I download all my call recordings in bulk?

There is no single bulk download endpoint. Use the API to list call details with recording URLs and download them programmatically. For large-volume exports, contact your account manager for assistance.

### How long before deleted data is permanently removed?

Data marked for deletion is typically purged within 30 days. During this period, the data is inaccessible but may exist in backup systems.

### Does Exotel use my data for AI/ML model training?

Exotel does not use your call recordings, CDRs, or communication data for AI or machine learning model training without explicit consent.

### Can I request a data retention extension after data is deleted?

No. Once the retention period expires and data is deleted, it cannot be recovered. Set up automated exports before data reaches its retention limit.

---

## Related Resources

- [Security & Compliance](/docs/faqs/security-compliance) -- Security certifications and practices
- [TRAI Regulations](/docs/faqs/trai-regulations) -- Indian telecom regulatory requirements
- [Authentication & Security](/docs/references/authentication) -- API security best practices
