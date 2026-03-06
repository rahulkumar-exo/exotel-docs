---
id: security-compliance
title: Security & Compliance FAQs
description: "FAQs about Exotel data security, ISO 27001 certification, GDPR compliance, SOC2, and enterprise security practices."
sidebar_label: Security & Compliance
sidebar_position: 5
---

# Security & Compliance FAQs

Common questions about Exotel's security posture, compliance certifications, data protection practices, and enterprise security features.

---

## What security certifications does Exotel hold?

Exotel maintains the following security certifications and compliance standards:

| Certification | Scope | Status |
|---|---|---|
| **ISO 27001:2013** | Information Security Management System (ISMS) | Certified |
| **SOC 2 Type II** | Security, Availability, and Confidentiality | Certified |
| **PCI DSS** | Payment card data handling (where applicable) | Compliant |
| **GDPR** | EU data protection for customers with EU data subjects | Compliant |

:::info
Copies of Exotel's compliance certificates and audit reports are available under NDA for enterprise customers. Contact your account manager or **hello@exotel.com** to request them.
:::

---

## Is my data encrypted?

Yes. Exotel encrypts data at multiple levels:

- **In transit** -- All API communications use TLS 1.2 or higher. Plain HTTP requests are rejected.
- **At rest** -- Call recordings, logs, and customer data are encrypted using AES-256 encryption in Exotel's data centers.
- **API credentials** -- API tokens are stored using one-way hashing and are never exposed in plaintext after generation.

---

## Where is my data stored?

Exotel operates data centers in two regions:

| Region | Data Center Location | Subdomain |
|---|---|---|
| **Singapore** | AWS Asia Pacific (Singapore) | `api.exotel.com` |
| **Mumbai** | AWS Asia Pacific (Mumbai) | `api.in.exotel.com` |

Your data is stored in the region selected during account creation. Data does not move between regions unless explicitly requested. Indian businesses subject to data localization requirements should use the Mumbai data center.

---

## Is Exotel GDPR compliant?

Yes. For customers processing data of EU residents, Exotel provides:

- **Data Processing Agreement (DPA)** -- Available on request for enterprise accounts
- **Right to erasure** -- Exotel supports data deletion requests for end-user data
- **Data portability** -- Call logs and recordings can be exported via APIs
- **Breach notification** -- Exotel commits to notifying customers within 72 hours of a confirmed data breach

:::tip
If you process EU personal data through Exotel, request a DPA from your account manager to ensure your compliance obligations are covered.
:::

---

## How does Exotel handle call recording privacy?

Call recording is subject to privacy regulations that vary by jurisdiction. Exotel's approach:

- **Opt-in recording** -- Call recording must be explicitly enabled per call flow or API call. It is not enabled by default.
- **Consent notification** -- You are responsible for informing callers that the call is being recorded (typically via a pre-call greeting).
- **Storage duration** -- Recordings are retained based on your account settings and plan. Default retention is 90 days.
- **Access control** -- Recordings are accessible only to authorized account users and via authenticated API calls.

For detailed information on recording consent and data retention, see [Data Privacy & Retention](/docs/faqs/data-privacy).

:::warning
Recording calls without informing the parties may violate Indian Telegraph Act provisions and other applicable privacy laws. Always play a consent announcement at the beginning of recorded calls.
:::

---

## Can I restrict API access by IP address?

Yes. Enterprise accounts can configure IP allowlisting to restrict API access to specific IP addresses or CIDR ranges. This adds an additional security layer beyond API key authentication.

To configure IP restrictions:

1. Contact your account manager with the list of allowed IP addresses
2. Exotel configures the allowlist at the account level
3. API requests from non-allowed IPs receive a `403 Forbidden` response

---

## How do I rotate my API credentials?

You can regenerate your API Token from the Exotel Dashboard:

1. Go to **Settings > API Settings**
2. Click **Regenerate Token**
3. Update all applications and integrations with the new token

:::caution
Regenerating your API Token immediately invalidates the old token. All active API integrations using the old token will fail. Plan token rotation during a maintenance window and update all services promptly.
:::

See the [Authentication & Security](/docs/references/authentication) guide for credential management best practices.

---

## Does Exotel support Single Sign-On (SSO)?

Yes. Enterprise plans support SSO integration using:

- **SAML 2.0** -- For integration with identity providers like Okta, Azure AD, and OneLogin
- **OAuth 2.0** -- For custom SSO implementations

SSO configuration is managed by Exotel's support team. Contact your account manager to set up SSO for your organization.

---

## How does Exotel handle DDoS protection?

Exotel's infrastructure includes multiple layers of DDoS protection:

- **Network-level protection** -- Traffic scrubbing and rate limiting at the network edge
- **API rate limiting** -- Per-account request limits prevent abuse (200 requests/minute default)
- **WAF (Web Application Firewall)** -- Protection against common web attack vectors
- **Auto-scaling** -- Infrastructure scales to absorb traffic spikes

---

## What is Exotel's uptime SLA?

Exotel provides the following uptime commitments:

| Plan | Uptime SLA |
|---|---|
| **Standard** | 99.5% monthly uptime |
| **Enterprise** | 99.94% monthly uptime |

SLA credits are issued for downtime exceeding the committed thresholds. Enterprise SLAs are defined in your service agreement.

---

## Related Resources

- [Authentication & Security](/docs/references/authentication) -- API authentication and security best practices
- [Data Privacy & Retention](/docs/faqs/data-privacy) -- Data retention policies and privacy compliance
- [TRAI Regulations](/docs/faqs/trai-regulations) -- Indian telecom regulatory overview
- [DLT Compliance](/docs/faqs/dlt-compliance) -- DLT registration for SMS in India
