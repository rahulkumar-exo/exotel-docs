---
id: dashboard-overview
title: Dashboard Overview
description: "Navigate the Exotel dashboard. Learn the home screen layout, key metrics, navigation menu, and essential configuration sections."
sidebar_label: Dashboard Overview
sidebar_position: 6
---

# Dashboard Overview

The Exotel dashboard at [my.exotel.com](https://my.exotel.com) is your central hub for configuring, monitoring, and managing all communication services. This guide covers the layout, key sections, and how to find what you need.

## Home Screen

When you log in, the dashboard home screen displays:

- **Account summary** -- Account SID, plan type, and remaining credits
- **Today's metrics** -- Total calls, successful calls, SMS sent, and call duration for the current day
- **Quick actions** -- Buttons to make a call, send an SMS, or create a call flow
- **Recent activity** -- Last 10 call and SMS events with status indicators

## Main Navigation

The left sidebar provides access to all dashboard sections:

| Section | Description | Key Actions |
|---------|-------------|-------------|
| **Home** | Overview with metrics and quick actions | View daily stats, account summary |
| **Calls** | Voice call logs and analytics | Search calls, listen to recordings, view details |
| **SMS** | SMS delivery logs | View delivery status, search by number |
| **ExoPhones** | Manage virtual phone numbers | Purchase, configure, assign to call flows |
| **App Bazaar** | Call flow builder and applet marketplace | Create/edit call flows, browse applets |
| **Campaigns** | Outbound call and SMS campaigns | Create campaigns, upload contact lists |
| **Contacts** | Contact management | Import contacts, manage groups |
| **Analytics** | Detailed reports and dashboards | Call reports, SMS reports, agent performance |
| **Settings** | Account and system configuration | API credentials, KYC, team, billing |

## Calls Section

The Calls section provides a detailed view of all voice activity:

### Call Logs

- **Filter by date range** -- Select custom date ranges or quick filters (today, last 7 days, last 30 days)
- **Filter by status** -- Filter by completed, missed, failed, or busy
- **Search by number** -- Find calls by caller or callee phone number
- **Search by Call SID** -- Look up a specific call using its unique identifier

### Call Detail View

Click any call to see:

- Call SID, start time, end time, and duration
- Caller and callee numbers
- Call status and disposition
- Call recording (playback and download)
- Call flow path (which applets were triggered)
- Status callback data

:::tip Exporting Call Data
Use the **Export** button in the Calls section to download call logs as a CSV file. You can export up to 90 days of data at a time.
:::

## SMS Section

The SMS section displays all sent and received messages:

- **Delivery status** -- Track delivery for each message (delivered, failed, pending)
- **DLT details** -- View DLT template ID and entity ID used (India only)
- **Search** -- Filter by phone number, date range, or status

## ExoPhones Section

Manage your virtual phone numbers:

- **Active numbers** -- List of all purchased ExoPhones with their assigned call flows
- **Purchase new** -- Browse available numbers by region, type (local, toll-free), or prefix
- **Configure** -- Assign or change the call flow for any ExoPhone
- **Renew** -- View renewal dates and manage auto-renewal settings

See [ExoPhone Setup](/docs/getting-started/exophone-setup) for detailed setup instructions.

## App Bazaar (Call Flow Builder)

The App Bazaar is where you build and manage call flows:

### Creating a Call Flow

1. Click **Create New Flow**
2. Give your flow a name and description
3. Use the visual builder to add applets (Greeting, IVR Menu, Connect, etc.)
4. Connect applets to define the call path
5. Save and assign the flow to an ExoPhone

### Available Applets

| Applet | Function |
|--------|----------|
| **Greeting** | Play a pre-recorded audio message or text-to-speech greeting |
| **IVR Menu** | Present options to the caller (press 1 for sales, 2 for support) |
| **Connect** | Route the call to an agent, phone number, or SIP endpoint |
| **Voicemail** | Record a voicemail if no agent is available |
| **Passthru** | Send an HTTP request to your server mid-call for dynamic routing |
| **Transfer** | Transfer the call to another number or flow |
| **Hangup** | End the call |
| **SMS** | Send an SMS during or after the call |
| **Email** | Send an email notification during or after the call |

See [First Call Flow](/docs/getting-started/first-call-flow) for a step-by-step guide.

## Settings Section

The Settings section contains critical configuration:

### API Settings

- **API Key** -- Your public API identifier
- **API Token** -- Your secret API token (keep this confidential)
- **Account SID** -- Your unique account identifier
- **Webhook URLs** -- Configure default callback URLs

See [API Credentials](/docs/getting-started/api-credentials) for details.

### Team Management

- **Add users** -- Invite team members by email
- **Assign roles** -- Admin, Supervisor, or Agent
- **Manage devices** -- Configure agent phone numbers, SIP, or WebRTC devices

See [Team Management](/docs/getting-started/team-management) for details.

### KYC / Company Details

- **Business information** -- Company name, registration number, address
- **Document uploads** -- KYC documents for verification
- **Verification status** -- Current KYC status

### Billing

- **Plan details** -- Current plan, renewal date, features
- **Credits** -- Remaining balance, usage history, add credits
- **Invoices** -- Download monthly invoices
- **Auto-recharge** -- Configure automatic credit top-ups

## Dashboard Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `/` | Open global search |
| `G` then `H` | Go to Home |
| `G` then `C` | Go to Calls |
| `G` then `S` | Go to Settings |

## Dashboard URL Structure

Understanding the URL structure helps with bookmarking and direct navigation:

| URL Pattern | Section |
|------------|---------|
| `my.exotel.com/home` | Home dashboard |
| `my.exotel.com/calls` | Call logs |
| `my.exotel.com/sms` | SMS logs |
| `my.exotel.com/exophones` | ExoPhone management |
| `my.exotel.com/appbazaar` | Call flow builder |
| `my.exotel.com/settings` | Account settings |
| `my.exotel.com/billing` | Billing and credits |

## Next Steps

- [Set up your first ExoPhone](/docs/getting-started/exophone-setup)
- [Build your first call flow](/docs/getting-started/first-call-flow)
- [Get your API credentials](/docs/getting-started/api-credentials)
