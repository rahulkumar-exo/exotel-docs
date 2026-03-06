---
id: setting-up-call-flow
title: Setting Up a Call Flow
description: "Step-by-step guide to creating and configuring call flows in the Exotel dashboard using the drag-and-drop flow builder."
sidebar_label: Setting Up a Call Flow
sidebar_position: 1
---

# Setting Up a Call Flow

A call flow (also called an App) is a visual sequence of steps that defines how incoming or outgoing calls are handled. This guide walks you through creating a call flow in the Exotel Dashboard.

## What is a Call Flow?

A call flow is built from **applets** -- individual building blocks that each perform a specific action. Applets are connected in sequence to create the full call handling logic.

```
Incoming Call → Greeting → IVR Menu → Connect to Agent
                                    → Voicemail (if no answer)
```

## Creating a Call Flow

### Step 1: Access the Flow Builder

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Navigate to **App Bazaar** (or **Call Flows**) in the left sidebar.
3. Click **Create New Flow** (or **Create New App**).

![Flow Builder](/img/call-support/call-flow-builder.png)

### Step 2: Name Your Flow

Enter a descriptive name for your flow (e.g., "Sales Incoming", "Support After Hours"). This name helps you identify the flow when assigning it to an ExoPhone.

### Step 3: Add Applets

Drag and drop applets from the applet palette onto the canvas. Available applets include:

| Applet | Function | Use Case |
|---|---|---|
| **Greeting** | Play a recorded message | Welcome message, compliance announcements |
| **IVR Menu** | Present options, route by keypress | Department selection, language selection |
| **Connect** | Route call to agent(s) | Connect to a person or group |
| **Voicemail** | Record a voice message | After-hours, agent unavailable |
| **Transfer** | Transfer to another flow | Redirect to a different department's flow |
| **Passthru** | HTTP request to your app | Dynamic routing, CRM lookup |
| **Hangup** | End the call | After a message or voicemail |
| **SMS** | Send an SMS | Send confirmation or follow-up |
| **Email** | Send an email notification | Notify team about a missed call |

See: [Voice v1 Applets](/docs/voice-v1/overview)

### Step 4: Configure Each Applet

Click on an applet to configure it:

**Greeting Applet:**
- Choose input method: Record via phone, upload audio file (8000 Hz Mono `.wav`), or text-to-speech
- Set the greeting message content

**IVR Menu Applet:**
- Record or upload the menu prompt
- Map each key (0-9, *, #) to the next applet
- Configure timeout and invalid input behavior

**Connect Applet:**
- Enter agent phone numbers (or provide a URL for dynamic numbers)
- Set ring timeout duration
- Enable or disable call recording

### Step 5: Connect Applets

Draw connections between applets to define the call flow path. Each applet can have one or more output paths:

- **Greeting** has one output (proceeds to the next applet after playing)
- **IVR Menu** has multiple outputs (one per key option, plus timeout/invalid)
- **Connect** has outputs for answered, no answer, and busy

### Step 6: Save and Publish

1. Click **Save** to save your flow as a draft.
2. Click **Publish** to make the flow active.

:::note
Only published flows can be assigned to ExoPhones and handle live calls.
:::

## Assigning a Flow to an ExoPhone

1. Go to **ExoPhones** in the dashboard.
2. Click on the ExoPhone you want to configure.
3. Under **Incoming Call Flow**, select your newly created flow.
4. Click **Save**.

Incoming calls to this ExoPhone will now be handled by your flow.

## Example: Basic Support Flow

Here is a complete example for a customer support line:

```
Greeting: "Welcome to Acme Support. This call may be recorded."
    ↓
IVR Menu: "Press 1 for technical support, 2 for billing, 3 for sales."
    ├── 1 → Connect (Tech support team: +91-98XXXXXXX1, +91-98XXXXXXX2)
    │         └── No answer → Voicemail → Email notification
    ├── 2 → Connect (Billing team: +91-98XXXXXXX3)
    │         └── No answer → Voicemail
    ├── 3 → Connect (Sales team: +91-98XXXXXXX4, +91-98XXXXXXX5)
    │         └── No answer → Voicemail
    └── Timeout/Invalid → Greeting ("Invalid input") → IVR Menu (repeat)
```

## Example: After-Hours Flow

```
Greeting: "Thank you for calling Acme Corp. Our office hours are 9 AM to 6 PM."
    ↓
Greeting: "Please leave a message after the beep and we will call you back."
    ↓
Voicemail
    ↓
Email (notify support@acme.com)
```

## Best Practices

- **Keep flows simple** -- Minimize the number of steps a caller must go through to reach an agent.
- **Always have a fallback** -- If no agent answers, route to voicemail or a callback mechanism.
- **Use Greeting for compliance** -- If you record calls, inform callers at the start of the flow.
- **Test before publishing** -- Call your ExoPhone from an external number to verify the flow.
- **Name flows descriptively** -- Use names like "Sales Inbound" or "Support After-Hours" for easy identification.
- **Use the Passthru applet** for dynamic routing when you need to make routing decisions based on CRM data or business logic.

## Modifying an Existing Flow

1. Go to **App Bazaar** in the dashboard.
2. Find the flow you want to edit.
3. Click **Edit**.
4. Make your changes.
5. Save and publish.

:::caution
Changes to a published flow take effect immediately for all incoming calls on the assigned ExoPhone.
:::

## Related

- [IVR Setup](/docs/call-support/call-features/ivr-setup)
- [Greeting Message](/docs/call-support/call-features/greeting-message)
- [Call Forwarding](/docs/call-support/call-features/call-forwarding)
- [Flow Builder](/docs/call-support/advanced-features/flow-builder) -- Advanced visual builder
- [Voice v1 Applets](/docs/voice-v1/overview)
