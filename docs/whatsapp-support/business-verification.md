---
id: business-verification
title: WhatsApp Business Verification
description: "Complete guide to Meta Business Verification for WhatsApp Business API -- required documents, step-by-step process, and troubleshooting tips."
sidebar_label: Business Verification
sidebar_position: 3
---

# WhatsApp Business Verification

Meta requires all businesses using the WhatsApp Business API to complete Business Verification. This process confirms your business is a registered legal entity and unlocks higher messaging limits.

## Why Is Business Verification Required?

| Benefit | Without Verification | With Verification |
|---------|---------------------|-------------------|
| **Messaging Limit** | 250 business-initiated conversations/day | Up to unlimited (tier-based) |
| **Official Business Account** | Not eligible | Eligible for green checkmark |
| **Template Submission** | Limited | Full access |
| **API Access** | Restricted | Full access |

:::warning
Without completing business verification, your WhatsApp Business API account is limited to 250 business-initiated conversations per 24-hour period. This limit cannot be increased until verification is complete.
:::

## Prerequisites

Before starting the verification process, ensure:

- You have admin access to your Meta Business Manager
- Your Meta Business Manager has complete business details (legal name, address, phone, website)
- Your business website is live and publicly accessible
- You have access to official business registration documents

## Step-by-Step Verification Process

### Step 1: Access Business Verification

1. Log in to [Meta Business Manager](https://business.facebook.com)
2. Navigate to **Settings** (gear icon in the bottom left)
3. Select **Business Info** from the left menu
4. Click **Start Verification** or **View Details** under the verification section

### Step 2: Confirm Business Details

Meta will display the business details from your Business Manager profile. Verify the following are correct and match your official documents:

| Field | Requirement |
|-------|-------------|
| **Legal Business Name** | Must match your registration documents exactly |
| **Country** | Country where your business is legally registered |
| **Address** | Must match your official business address |
| **Phone Number** | Must be a publicly listed number for your business |
| **Website** | Must be a live website associated with your business |

:::tip
If any details are incorrect, update them in **Business Settings > Business Info** before proceeding with verification. Changes to business details may take 24-48 hours to reflect.
:::

### Step 3: Select Verification Method

Meta offers two verification methods:

#### Option A: Phone Verification
- Meta calls or texts the phone number listed in your Business Manager
- You receive a verification code
- Enter the code in Business Manager

#### Option B: Document Verification
- Upload official business documents
- Meta reviews and verifies the documents against public records

:::tip
Phone verification is faster (instant to a few hours). Use document verification if your phone number is not publicly associated with your business.
:::

### Step 4: Upload Business Documents

If using document verification, you need to upload **one** of the following:

#### Accepted Documents for India

| Document Type | Details |
|--------------|---------|
| **Certificate of Incorporation** | Issued by the Ministry of Corporate Affairs (MCA) |
| **GST Registration Certificate** | GSTIN certificate with business name and address |
| **Udyam Registration Certificate** | For MSMEs registered under Udyam |
| **Shop and Establishment License** | Issued by the local municipal corporation |
| **PAN Card (Business)** | Business PAN card (not personal) |
| **DIPP Certificate** | For startups registered with DIPP |
| **IEC (Import Export Code)** | Issued by DGFT |

#### Accepted Documents for Other Regions

| Document Type | Regions |
|--------------|---------|
| **Business Registration Certificate** | All regions |
| **Tax Registration Document** | All regions |
| **Utility Bill** (business address) | US, EU, UK |
| **Bank Statement** (business account) | All regions |
| **Articles of Incorporation** | US, EU, UK, SEA |

**Document Requirements:**
- Must be clearly legible (no blurry scans)
- Must show the legal business name matching your Business Manager
- Must be a government-issued or official document
- PDF, PNG, or JPEG format
- File size under 10 MB

### Step 5: Domain Verification (Optional but Recommended)

Meta may also require domain verification to confirm you own the website listed in your Business Manager:

1. Go to **Business Settings > Brand Safety > Domains**
2. Click **Add Domain** and enter your website domain
3. Choose a verification method:
   - **DNS TXT Record** -- Add a TXT record to your domain's DNS settings
   - **HTML File Upload** -- Upload a verification file to your website root
   - **Meta Tag** -- Add a meta tag to your website's homepage

### Step 6: Wait for Review

- Review typically takes **2-7 business days**
- You will receive an email notification at your Business Manager email
- Status updates appear in **Business Settings > Business Info**

## Verification Statuses

| Status | Meaning |
|--------|---------|
| **Not Started** | Verification has not been initiated |
| **Pending** | Documents submitted, under review |
| **Verified** | Business verification is complete |
| **Rejected** | Verification failed; check the reason and resubmit |

## Common Rejection Reasons

| Reason | How to Fix |
|--------|-----------|
| **Name mismatch** | Ensure your Business Manager legal name exactly matches your registration documents (including Pvt. Ltd., LLP, etc.) |
| **Document illegible** | Upload a higher-quality scan; avoid photos of documents taken with a phone |
| **Document expired** | Submit a currently valid document |
| **Website mismatch** | Your website domain must be associated with the business name in your documents |
| **Insufficient documentation** | Try a different document type that more clearly shows your business name and registration |
| **Business not found** | Ensure your business is registered with the relevant government authority and the details are publicly available |

## After Verification

Once verified, your account unlocks:

1. **Higher messaging limits** -- Automatically starts at Tier 1 (1,000 conversations/day) and scales based on quality. See [Messaging Limits](/docs/whatsapp-support/messaging-limits).
2. **Official Business Account** eligibility -- You can apply for the green checkmark badge
3. **Full template access** -- Submit templates across all categories
4. **Advanced features** -- Access to WhatsApp Flows, Commerce, and Payments

## Applying for Official Business Account (Green Checkmark)

After business verification, you can apply for an Official Business Account (OBA):

1. Go to **WhatsApp Manager** in Meta Business Manager
2. Select your phone number
3. Click **Submit Request** under Official Business Account
4. Meta reviews based on:
   - Business verification status
   - Account quality rating
   - Brand notability and search presence

:::warning
The green checkmark (OBA) is not guaranteed even after business verification. Meta grants it based on brand notability and other criteria. Most businesses can operate fully without the green checkmark.
:::

## Troubleshooting

### Verification stuck on "Pending" for more than 7 days
- Contact Exotel support at support@exotel.com with your Meta Business Manager ID
- Exotel can escalate the verification request through Meta's BSP support channel

### Cannot find the verification option
- Ensure you have **Admin** access to the Meta Business Manager
- The verification option is under **Settings > Business Info**, not under individual pages or ad accounts

### Documents keep getting rejected
- Try a different document type
- Ensure the document is in English or the official language of your business country
- If the document is in a regional language, provide a notarized English translation

## Related Resources

- [Getting Started with WhatsApp](/docs/whatsapp-support/getting-started)
- [WhatsApp Number Requirements](/docs/whatsapp-support/number-requirements)
- [WhatsApp Display Name Guidelines](/docs/whatsapp-support/display-name-guidelines)
- [WhatsApp Messaging Limits](/docs/whatsapp-support/messaging-limits)
