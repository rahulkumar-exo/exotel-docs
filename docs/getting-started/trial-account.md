---
id: trial-account
title: Trial Account Features and Limitations
description: "Understand Exotel trial account features, free credits, limitations, and duration. Test voice, SMS, and APIs before upgrading."
sidebar_label: Trial Account
sidebar_position: 4
---

# Trial Account

Every new Exotel account starts with a free trial that lets you test voice, SMS, and API features before committing to a paid plan. This page covers what is included, what is restricted, and how long the trial lasts.

## What is Included in the Trial

| Feature | Trial Availability | Details |
|---------|-------------------|---------|
| **Free credits** | Yes | Complimentary credits added at signup for testing calls and SMS |
| **Dashboard access** | Full | Complete access to the Exotel dashboard |
| **Trial ExoPhone** | 1 number | A test virtual number assigned automatically |
| **Outbound calls** | Limited | Calls only to verified (whitelisted) numbers |
| **Inbound calls** | Limited | Receive calls on your trial ExoPhone |
| **SMS sending** | Limited | SMS only to verified numbers |
| **Call flows** | Full | Create and configure call flows with all applets |
| **API access** | Full | Full access to all Exotel APIs |
| **Call recording** | Yes | Available on trial calls |
| **Dashboard analytics** | Yes | View call logs, reports, and analytics |

:::tip Make the Most of Your Trial
Use the trial period to build and test your full integration. Everything you configure during the trial (call flows, API integrations, team setup) carries over when you upgrade to a paid plan.
:::

## Trial Limitations

### Number Whitelisting

During the trial, you can only make calls and send SMS to numbers that you have explicitly verified (whitelisted) in the dashboard.

**To whitelist a number:**

1. Go to **Settings** > **Whitelist Numbers** in the dashboard
2. Enter the phone number with country code (e.g., +91 9876543210)
3. The number will receive a verification OTP
4. Enter the OTP to confirm the whitelisting
5. You can whitelist up to 10 numbers during the trial

### Feature Restrictions

| Feature | Restriction |
|---------|------------|
| **ExoPhones** | Limited to 1 trial number; cannot purchase production numbers |
| **Outbound calls/SMS** | Only to whitelisted numbers (max 10) |
| **Bulk SMS** | Not available during trial |
| **Campaigns** | Not available during trial |
| **WhatsApp API** | Not available during trial |
| **Custom caller ID** | Not available; calls show the trial ExoPhone number |
| **Number porting** | Not available during trial |
| **DLT templates** | Cannot register new templates; test templates provided |

### Credit Limitations

- Trial credits are non-transferable and non-refundable
- Credits expire at the end of the trial period
- Additional trial credits are not available; upgrade to add more credits
- Credit usage is visible in the dashboard under **Billing** > **Usage**

## Trial Duration

| Aspect | Details |
|--------|---------|
| **Default duration** | 7 days from account activation |
| **Extension** | Contact support to request a trial extension (case-by-case) |
| **Expiration** | Trial account is deactivated after the trial period ends |
| **Data retention** | Call logs, configurations, and flows are preserved for 30 days after trial expiry |

:::warning Trial Expiry
When your trial expires, inbound and outbound calls stop working immediately. Your dashboard configurations and call logs are preserved for 30 days, giving you time to upgrade to a paid plan without losing your setup.
:::

## What You Should Test During the Trial

Use this checklist to make the most of your trial period:

1. **Dashboard exploration** -- Navigate all sections: Calls, SMS, ExoPhones, App Bazaar, Analytics
2. **Call flow creation** -- Build at least one call flow with IVR, greeting, and connect applets
3. **Inbound call test** -- Call your trial ExoPhone to verify the call flow works
4. **Outbound call test** -- Make an outbound call via the dashboard or API
5. **SMS test** -- Send a test SMS via the dashboard or API
6. **API integration** -- Make API calls using your credentials to verify connectivity
7. **Webhook setup** -- Configure and test status callback URLs
8. **Team setup** -- Add team members and assign roles
9. **Recording playback** -- Verify call recordings are captured and accessible
10. **Analytics review** -- Check call logs and SMS reports for data accuracy

## Trial vs. Paid Account Comparison

| Feature | Trial | Starter | Growth | Enterprise |
|---------|-------|---------|--------|------------|
| ExoPhones | 1 (trial) | Multiple | Multiple | Unlimited |
| Outbound calling | Whitelisted only | Any number | Any number | Any number |
| SMS | Whitelisted only | Full access | Full access | Full access |
| Campaigns | No | Yes | Yes | Yes |
| WhatsApp | No | Add-on | Included | Included |
| API rate limits | Standard | Standard | Higher | Custom |
| Support | Email | Email + Chat | Priority | Dedicated |
| Analytics | Basic | Standard | Advanced | Custom |
| SLA | None | 99.5% | 99.9% | Custom |

## Upgrading from Trial

When you are ready to upgrade:

1. Navigate to **Billing** > **Plans** in the dashboard
2. Select a plan that fits your needs
3. Complete the payment process
4. Your trial configuration is automatically migrated to the paid account

See [Upgrade Account](/docs/getting-started/upgrade-account) for detailed instructions.

## Frequently Asked Questions

**Can I extend my trial?**
Contact support at hello@exotel.com with your use case. Extensions are granted on a case-by-case basis.

**What happens to my data after the trial expires?**
Your configurations, call logs, and flows are retained for 30 days. After 30 days, the data is permanently deleted.

**Can I get additional trial credits?**
Additional trial credits are not available. Upgrade to a paid plan to add credits.

**Do I need KYC for the trial?**
You can start the trial without KYC, but KYC is required to purchase production ExoPhones and go live.

## Next Steps

- [Upgrade to a paid plan](/docs/getting-started/upgrade-account) when you are ready
- [Complete KYC verification](/docs/getting-started/kyc-verification) to prepare for production
- [Set up your first call flow](/docs/getting-started/first-call-flow) to test the platform
