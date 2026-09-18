---
id: getting-started
title: Getting Started with Exotel
description: "Step-by-step guide to setting up your Exotel account, buying an ExoPhone, creating your first call flow, and making your first call."
sidebar_label: Getting Started
sidebar_position: 6
---

# Getting Started with Exotel

This guide walks you through the initial setup of your Exotel account -- from signing up to handling your first call.

## Prerequisites

- A valid business email address
- A phone number for verification
- KYC documents (for Indian regulations)

## Step 1: Create Your Account

1. Go to [exotel.com](https://exotel.com) and click **Sign Up** or **Get Started**.
2. Enter your business details including company name, email, and phone number.
3. Verify your email address and phone number.
4. Complete the KYC (Know Your Customer) process if required for your region.

![Exotel Signup](/img/call-support/getting-started-signup.png)

Once your account is approved, you can log in to the [Exotel Dashboard](https://my.exotel.com).

## Step 2: Get Your API Credentials

If you plan to use the APIs:

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Go to **Settings** > **API Settings**.
3. Note down your:
   - **Account SID** -- Your unique account identifier
   - **API Key** -- Your authentication key
   - **API Token** -- Your authentication token

These credentials are required for all API calls. See [Authentication](/docs/references/authentication) for details.

## Step 3: Buy an ExoPhone

You need at least one ExoPhone (virtual number) to start making and receiving calls.

1. In the dashboard, go to **ExoPhones** in the left sidebar.
2. Click **Buy New ExoPhone**.
3. Select the type of number:
   - **Landline** -- For professional business identity
   - **Mobile** -- For outbound campaigns with higher answer rates
   - **Toll-Free** -- For customer support (caller does not pay)
4. Choose a region and select a number.
5. Complete the purchase.

![Buy ExoPhone](/img/call-support/getting-started-buy-exophone.png)

See: [What is an ExoPhone?](/docs/call-support/basics/virtual-numbers)

## Step 4: Create Your First Call Flow

A call flow defines how incoming calls are handled.

1. Go to **App Bazaar** (or **Call Flows**) in the dashboard.
2. Click **Create New Flow**.
3. Give your flow a name (e.g., "Sales Incoming").
4. Use the drag-and-drop builder to add applets:

### Basic Flow Example

```
Greeting ("Welcome to Acme Corp")
    → IVR Menu ("Press 1 for Sales, 2 for Support")
        → 1: Connect (Sales team numbers)
        → 2: Connect (Support team numbers)
        → No input: Voicemail
```

5. Configure each applet:
   - **Greeting**: Record or upload your welcome message
   - **IVR Menu**: Set up the menu options and map keys to applets
   - **Connect**: Enter the phone numbers of your agents
6. Save and publish the flow.

![Create Call Flow](/img/call-support/getting-started-create-flow.png)

See: [Setting Up a Call Flow](/docs/call-support/call-features/setting-up-call-flow)

## Step 5: Assign the Flow to Your ExoPhone

1. Go to **ExoPhones** in the dashboard.
2. Click on your ExoPhone.
3. Under **Incoming Call Flow**, select the flow you just created.
4. Click **Save**.

## Step 6: Test Your Setup

1. Dial your ExoPhone from any phone.
2. You should hear your greeting message.
3. Press a key to navigate the IVR menu.
4. Verify that the call is routed to the correct agent.

:::tip
Use a phone that is not listed as an agent number to test the full customer experience.
:::

## Step 7: Make an Outgoing Call (Optional)

To test outbound calling via the API:

```bash
curl -u '<api_key>:<api_token>' -X POST 'https://api.exotel.com/v1/Accounts/<account_sid>/Calls/connect.json' \
  -d 'From=<agent_number>' \
  -d 'To=<customer_number>' \
  -d 'CallerId=<exophone>'
```

This will first call the agent, and when they answer, call the customer. Both parties are connected with the ExoPhone as the caller ID.

See: [Connect Two Numbers API](/docs/voice-v1/api-reference/connect-two-numbers)

## What to Set Up Next

| Feature | Description | Guide |
|---|---|---|
| Business Hours | Define when calls should be answered vs. go to voicemail | [Business Hours](/docs/call-support/call-features/business-hours) |
| Call Recording | Record calls for QA and compliance | [Call Recording](/docs/call-support/call-features/call-recording) |
| Call Analytics | Monitor call performance and agent productivity | [Call Analytics](/docs/call-support/call-features/call-analytics) |
| SMS | Send transactional or promotional SMS | [SMS API](/docs/sms-api/overview) |
| Integrations | Connect with your CRM or helpdesk | [Integrations](/docs/integrations/overview) |

## Next Steps

- [How to Make or Receive Calls](/docs/call-support/call-features/make-receive-calls) -- Detailed guide on call handling
- [IVR Setup](/docs/call-support/call-features/ivr-setup) -- Build interactive voice menus
- [Voice API](/docs/voice) -- Start using the API
