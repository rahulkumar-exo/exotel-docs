---
id: account-setup
title: Account Setup & KYC FAQs
description: "Frequently asked questions about Exotel account creation, KYC verification, onboarding, and account configuration."
sidebar_label: Account Setup & KYC
sidebar_position: 2
---

# Account Setup & KYC FAQs

Common questions about creating your Exotel account, completing KYC verification, and configuring your account for production use.

---

## How do I create an Exotel account?

Visit [exotel.com](https://exotel.com) and click **Sign Up**. You will need to provide:

- Business email address
- Company name and registered address
- Contact phone number
- Business PAN (for Indian entities)

After signup, you receive a trial account with limited credits to test the platform before going live.

:::tip
Use a company email address (not a personal one like Gmail or Yahoo) to speed up the verification process.
:::

---

## What is KYC and why is it required?

KYC (Know Your Customer) is a mandatory verification process required by Indian telecom regulations (TRAI) before you can use Exotel services in production. It verifies your business identity and ensures compliance with telecommunications licensing requirements.

Without completing KYC, your account remains in trial mode with restricted capabilities including limited call minutes, SMS credits, and no access to production virtual numbers.

---

## What documents are required for KYC?

The documents required depend on your business type:

| Business Type | Required Documents |
|---|---|
| **Private Limited / LLP** | Certificate of Incorporation, GST certificate, PAN card, authorized signatory ID proof |
| **Partnership Firm** | Partnership deed, GST certificate, PAN card, partner ID proof |
| **Sole Proprietorship** | GST certificate or Shop & Establishment license, PAN card, proprietor ID proof |
| **Trust / Society** | Registration certificate, PAN card, authorized person ID proof |

:::info
All documents must be self-attested and uploaded as clear scanned copies in PDF or image format. File size should not exceed 5 MB per document.
:::

---

## How long does KYC verification take?

KYC verification typically takes **2-3 business days** after all documents are submitted correctly. Common reasons for delays include:

- Blurred or incomplete document uploads
- Mismatch between company name on documents and account registration
- Missing GST certificate or PAN card
- Incomplete authorized signatory information

You will receive email notifications at each stage of the verification process.

---

## Can I use Exotel during the KYC review period?

Yes. Your trial account remains active during KYC review. However, trial accounts have the following restrictions:

| Feature | Trial Limitation |
|---|---|
| Outbound calls | Limited minutes |
| SMS | Limited credits |
| Virtual numbers | Shared trial numbers only |
| API rate limits | Reduced limits |
| WhatsApp | Not available |

Once KYC is approved, all restrictions are lifted based on your selected plan.

---

## How do I find my API credentials?

After your account is set up, you can find your API credentials in the Exotel Dashboard:

1. Log in to [my.exotel.com](https://my.exotel.com)
2. Navigate to **Settings** in the left sidebar
3. Click **API Settings**
4. Your **API Key**, **API Token**, and **Account SID** are displayed on the [API Credentials](https://my.exotel.com/apisettings/site#api-credentials) page

For detailed authentication setup, see the [Authentication & Security](/docs/references/authentication) guide.

:::warning
Never share your API Token publicly or commit it to version control. Treat it as a password.
:::

---

## Can I have multiple users on one Exotel account?

Yes. Exotel supports multiple users under a single account with role-based access control. You can add users from the Exotel Dashboard under **Settings > Users**. Available roles include:

- **Admin** -- Full access to all settings, billing, and API credentials
- **Manager** -- Access to call logs, reports, and agent management
- **Agent** -- Access to call handling features only

See the [Users API](/docs/users/overview) for managing users programmatically.

---

## How do I switch from a trial account to a paid plan?

To upgrade from trial to a paid plan:

1. Complete KYC verification
2. Navigate to **Settings > Billing** in the dashboard
3. Select your preferred plan (pay-as-you-go or a bundled plan)
4. Add a payment method (credit card, debit card, or net banking)
5. Make the initial payment

Your account is upgraded immediately after payment confirmation. All trial restrictions are removed, and you can purchase production virtual numbers.

---

## Can I change my account region after creation?

No. Your account region (Singapore or Mumbai data center) is set during account creation and cannot be changed afterward. The region determines:

- Which API subdomain you use (`api.exotel.com` for Singapore, `api.in.exotel.com` for Mumbai)
- Data residency for call recordings and logs
- Network latency for API requests

:::caution
Choose your region carefully during signup. If you need to switch regions, you will need to create a new account and migrate your configuration.
:::

---

## What happens if my KYC is rejected?

If your KYC application is rejected, you will receive an email with the specific reasons. Common rejection reasons and fixes:

| Reason | Resolution |
|---|---|
| Document not readable | Re-upload a clear, high-resolution scan |
| Name mismatch | Ensure the company name matches across all documents |
| Expired document | Upload a current, valid document |
| Missing document | Upload all required documents for your business type |

You can resubmit your KYC application from the dashboard after addressing the issues. There is no limit on the number of resubmissions.

---

## How do I delete my Exotel account?

Account deletion must be requested through Exotel support. Contact **hello@exotel.com** or your account manager. Before requesting deletion, ensure:

- All pending invoices are cleared
- Active virtual numbers are released
- Call recordings and data are downloaded (they will be permanently deleted)
- Any integrated services are disconnected

:::warning
Account deletion is permanent and irreversible. All data including call logs, recordings, SMS history, and configurations will be permanently removed.
:::

---

## Related Resources

- [Authentication & Security](/docs/references/authentication) -- API credentials and authentication setup
- [Users API](/docs/users/overview) -- Manage account users programmatically
- [Billing FAQs](/docs/faqs/billing-faqs) -- Billing cycles, invoices, and payment questions
- [Pricing & Plans](/docs/faqs/pricing-plans) -- Plan comparison and pricing details
