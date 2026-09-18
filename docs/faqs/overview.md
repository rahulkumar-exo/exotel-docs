---
id: overview
title: FAQs
description: "Frequently asked questions about Exotel APIs, integration, and troubleshooting."
sidebar_label: FAQs
slug: /faqs/overview
---

# Frequently Asked Questions

## Lead Assist & API Access

### I signed up for an Exotel Account but can't use Lead Assist GreenVN APIs. What am I missing?

Lead Assist is an account-level feature that must be enabled on request. Contact your account manager or write to **hello@exotel.com**. Note that Lead Assist API credentials are different from your default API credentials.

### How can I get the call metadata for a call between two parties?

You have two options:
1. **Events Callbacks (Push)** — Configure a webhook endpoint to receive real-time call data
2. **GET Call API (Pull)** — Use the CallSID to pull call details

### What is the default maximum allocation duration?

At the service level, the default maximum allocation duration is **170 days**. Account-level configurations allow customization from as low as **5 minutes** up to 170 days.

### What parameters can be updated for an active allocation?

You can update: A-party and B-party numbers, PINs, usage settings, and GreenVN allocations.

### Do we have to pay for Virtual Numbers used in Lead Assist?

For the Lead Assist GreenVN solution, there are **no charges** for virtual numbers associated with your account pool. Other virtual numbers may incur monthly rental fees.

---

## Zoho Integration

### Can I integrate two Exotel accounts with Zoho CRM/Bigin or Zoho Desk?

No. The integration follows a **one-to-one mapping** — only one Exotel account can be integrated per Zoho instance.

### Can I integrate both Zoho CRM/Bigin and Zoho Desk with Exotel?

Yes, both platforms can be integrated simultaneously with the same Exotel account.

### My inbound call and missed call details are not updating in Zoho.

Verify that account names have **no blank spaces** in Steps 8 and 11 of the integration setup.

### I'm not getting the pop-up for inbound calls in Zoho Integration.

Confirm that user phone numbers match across both platforms and verify Step 7 configuration accuracy.

### I'm unable to make outbound calls in Zoho Integration.

Check the following:
- Click-to-call is enabled
- User phone numbers match across platforms
- KYC is complete
- Account credits are available
