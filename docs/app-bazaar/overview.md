---
id: overview
title: App Bazaar Overview
description: "Explore Exotel App Bazaar: a marketplace of pre-built telephony apps and applets for call flows, IVR, SMS, and integrations."
sidebar_label: Overview
sidebar_position: 0
---

# App Bazaar Overview

App Bazaar is Exotel's marketplace for pre-built telephony applications and applets. It provides ready-to-use building blocks that you can combine to create sophisticated call flows, IVR systems, and communication workflows without writing code.

:::tip
New to Exotel call flows? Start with the [App Builder](/docs/app-bazaar/app-builder) to create your first call flow using a visual drag-and-drop interface.
:::

## What Is App Bazaar?

App Bazaar is a collection of **applets** -- modular components that handle specific telephony tasks. You connect applets together to build call flows (called **Apps** in Exotel terminology) that define how incoming and outgoing calls are processed.

```
┌─────────────────────────────────────────────────────┐
│                    App Bazaar                        │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Greeting  │  │   IVR    │  │ Connect  │          │
│  │ Applet    │──│  Applet  │──│ Applet   │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Passthru  │  │   SMS    │  │ Voicemail│          │
│  │ Applet    │  │  Applet  │  │ Applet   │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Transfer  │  │  Email   │  │ Hangup   │          │
│  │ Applet    │  │  Applet  │  │ Applet   │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└─────────────────────────────────────────────────────┘
```

## Available Applets

| Applet | Purpose | Common Use Case |
|--------|---------|----------------|
| [**Greeting**](/docs/app-bazaar/greeting-applet-guide) | Play audio messages to callers | Welcome message, hold music, announcements |
| [**IVR**](/docs/app-bazaar/ivr-applet-guide) | Create interactive voice response menus | "Press 1 for Sales, 2 for Support" |
| [**Connect**](/docs/app-bazaar/connect-applet-guide) | Route calls to agents, groups, or numbers | Agent routing, round-robin distribution |
| [**Passthru**](/docs/app-bazaar/passthru-applet-guide) | Make HTTP requests during call flow | CRM lookup, dynamic routing, data logging |
| [**SMS**](/docs/app-bazaar/sms-applet-guide) | Send SMS during a call flow | Post-call SMS confirmation, missed call alerts |
| **Transfer** | Transfer an active call to another number or flow | Escalation to supervisor, department transfer |
| **Voicemail** | Capture voice messages from callers | After-hours voicemail, overflow handling |
| **Email** | Send email notifications during a call | Missed call email alerts, lead capture |
| **Hangup** | End the call | Graceful call termination after a flow |

## How Apps and Applets Work Together

An **App** is a complete call flow built by connecting multiple applets in sequence. When a call hits an ExoPhone, the assigned App determines how the call is handled.

### Example: Customer Support Flow

```
Incoming Call
    │
    ▼
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Greeting  │────►│   IVR    │────►│ Connect  │
│ "Welcome" │     │ Menu     │     │ to Agent │
└──────────┘     └──────────┘     └──────────┘
                      │                 │
                      │ Press 2         │ If busy
                      ▼                 ▼
                 ┌──────────┐     ┌──────────┐
                 │ Passthru  │     │ Voicemail│
                 │ CRM Check │     │ Leave msg│
                 └──────────┘     └──────────┘
```

### Example: Lead Capture Flow

```
Missed Call
    │
    ▼
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Greeting  │────►│   SMS    │────►│  Email   │
│ "Thanks"  │     │ Send SMS │     │ Notify   │
└──────────┘     └──────────┘     └──────────┘
```

## Getting Started

### Creating Your First App

1. Log in to [my.exotel.com](https://my.exotel.com)
2. Navigate to **App Bazaar** in the left sidebar
3. Click **Create New App**
4. Choose a starting template or start from scratch
5. Use the [Flow Builder](/docs/app-bazaar/flow-builder-guide) to drag and connect applets
6. Configure each applet's settings
7. Save and assign the app to an ExoPhone

### Assigning an App to an ExoPhone

After creating your app:

1. Navigate to **ExoPhones** in the left sidebar
2. Select the virtual number you want to configure
3. Under **Incoming Call Flow**, select your app
4. Click **Save**

Now, every incoming call to that ExoPhone will follow the flow defined in your app.

## App Categories

### Pre-Built Templates

Exotel provides pre-built app templates for common use cases:

| Template | Description | Applets Used |
|----------|-------------|-------------|
| **Basic IVR** | Simple menu with department routing | Greeting + IVR + Connect |
| **Customer Support** | Multi-level IVR with agent groups | Greeting + IVR + Connect + Voicemail |
| **Lead Capture** | Missed call to SMS/email notification | Greeting + SMS + Email |
| **Click-to-Call** | Connect two parties via API | Connect (two legs) |
| **Survey** | Post-call DTMF survey | Greeting + IVR + Passthru |

### Custom Apps

Build custom apps for advanced use cases:

- Dynamic routing based on CRM data (using [Passthru applet](/docs/app-bazaar/passthru-applet-guide))
- Time-based routing (business hours vs. after hours)
- Multi-level IVR with fallback options
- Hybrid flows combining voice, SMS, and HTTP integrations

## App Management

| Action | How To |
|--------|--------|
| **Edit an app** | App Bazaar > Select app > Edit |
| **Duplicate an app** | App Bazaar > Select app > Duplicate |
| **Delete an app** | App Bazaar > Select app > Delete (only if not assigned to any ExoPhone) |
| **Version history** | App Bazaar > Select app > Versions (Enterprise plan) |
| **Test an app** | Make a test call to the assigned ExoPhone |

:::warning
Editing a live app affects all incoming calls immediately. For critical changes, create a duplicate, test it with a separate ExoPhone, and then swap the app assignment once verified.
:::

## Related Topics

- [App Builder](/docs/app-bazaar/app-builder) -- Create custom apps without coding
- [Flow Builder Guide](/docs/app-bazaar/flow-builder-guide) -- Visual drag-and-drop call flow design
- [Voice API](/docs/voice-api/getting-started/overview) -- Trigger apps programmatically via API
- [ExoPhones](/docs/exophones/overview) -- Manage virtual numbers and app assignments
