---
title: Your First Call Flow
description: "Step-by-step guide to building your first call flow on Exotel using the App Bazaar visual builder with greeting, IVR menu, and call routing."
sidebar_label: First Call Flow
sidebar_position: 8
---

# Setting Up Your First Call Flow

A call flow defines how incoming calls to your ExoPhone are handled. Using Exotel's visual flow builder (App Bazaar), you can create interactive voice menus, route calls to agents, play greetings, and more -- all without writing code.

## What is a Call Flow?

A call flow is a series of connected applets (building blocks) that process a call from start to finish:

```
Incoming call to ExoPhone
  --> Greeting applet (play welcome message)
    --> IVR Menu applet (press 1 for sales, 2 for support)
      --> Connect applet (route to agent)
        --> Voicemail applet (if agent unavailable)
```

Each applet performs a specific action and passes the call to the next applet in the chain.

## Prerequisites

Before creating a call flow, ensure you have:

- An active Exotel account (trial or paid)
- At least one ExoPhone purchased and active
- Agent phone numbers ready (the numbers your team members will answer on)

## Step 1: Open the Flow Builder

1. Log in to [my.exotel.com](https://my.exotel.com)
2. Navigate to **App Bazaar** in the left sidebar
3. Click **Create New Flow**
4. Enter a name for your flow (e.g., "Main Support Line")
5. Click **Create**

The visual flow builder opens with an empty canvas.

## Step 2: Add a Greeting

A greeting is typically the first applet in any call flow. It plays a message when the caller connects.

1. Drag the **Greeting** applet from the applet panel onto the canvas
2. Configure the greeting:

| Setting | Options | Recommendation |
|---------|---------|---------------|
| **Audio source** | Text-to-speech or upload audio | Start with text-to-speech for quick setup |
| **Message text** | Your greeting message | Keep it under 15 seconds |
| **Language** | English, Hindi, and other Indian languages | Match your audience |

**Example greeting:**

```
Welcome to Acme Technologies. Thank you for calling.
```

:::tip
Keep your greeting short and professional. Callers who wait through a long greeting are more likely to hang up. Aim for 5-10 seconds.
:::

## Step 3: Add an IVR Menu

An IVR (Interactive Voice Response) menu presents options to the caller and routes them based on their key press.

1. Drag the **IVR Menu** applet onto the canvas
2. Connect it to the Greeting applet (drag from the Greeting's output to the IVR's input)
3. Configure the menu:

**IVR prompt:**
```
Press 1 for Sales. Press 2 for Customer Support. Press 0 to speak with an operator.
```

**Key mappings:**

| Key | Action | Connect To |
|-----|--------|-----------|
| 1 | Route to Sales | Connect applet (Sales team) |
| 2 | Route to Support | Connect applet (Support team) |
| 0 | Route to Operator | Connect applet (Reception) |
| No input / Invalid | Replay menu or default action | Repeat or Greeting applet |

### IVR Settings

| Setting | Recommended Value | Description |
|---------|-------------------|-------------|
| Input timeout | 5 seconds | Time to wait for caller input |
| Max retries | 2 | Times to replay menu on no input |
| Invalid input message | "Sorry, that is not a valid option." | Played when an unrecognized key is pressed |

## Step 4: Add Call Routing (Connect)

The Connect applet routes the call to an agent's phone, a SIP endpoint, or a group of agents.

1. Drag a **Connect** applet onto the canvas for each IVR option
2. Connect each IVR key output to its respective Connect applet
3. Configure the Connect applet:

| Setting | Options | Description |
|---------|---------|-------------|
| **Connect to** | Phone number, User, SIP | Where to route the call |
| **Phone numbers** | Agent's mobile or landline | Comma-separated for sequential or simultaneous ring |
| **Ring timeout** | 15-30 seconds | How long to ring before trying next action |
| **Caller ID** | Your ExoPhone | Number displayed to the agent |
| **Recording** | Enabled/Disabled | Record the conversation |

**Example: Sales routing**

| Setting | Value |
|---------|-------|
| Connect to | `+919876543210, +919876543211` |
| Ring strategy | Sequential (try first, then second) |
| Ring timeout | 20 seconds |
| Recording | Enabled |

:::warning
If you enable call recording, add a consent announcement before the Connect applet. For example, add a short Greeting that says "This call may be recorded for quality purposes" before routing to the agent.
:::

## Step 5: Add a Voicemail Fallback

If no agent answers, the Voicemail applet lets the caller leave a message:

1. Drag the **Voicemail** applet onto the canvas
2. Connect it to the Connect applet's "No Answer" output
3. Configure:

| Setting | Value |
|---------|-------|
| Prompt | "Sorry, all agents are busy. Please leave a message after the tone." |
| Max duration | 60 seconds |
| Email notification | Your team email address |

Voicemail recordings are stored in your Exotel account and can be accessed via the dashboard or API.

## Step 6: Connect the Flow

Ensure all applets are properly connected:

```
[Greeting] --> [IVR Menu]
                  |-- Key 1 --> [Connect: Sales] --> [Voicemail]
                  |-- Key 2 --> [Connect: Support] --> [Voicemail]
                  |-- Key 0 --> [Connect: Operator] --> [Voicemail]
                  |-- No input --> [Greeting] (loop back)
```

## Step 7: Save and Test

1. Click **Save** to save your call flow
2. Note the flow's **App ID** (displayed in the flow details)
3. Assign the flow to your ExoPhone:
   - Go to **ExoPhones** in the sidebar
   - Click **Configure** on your ExoPhone
   - Select your new flow from the dropdown
   - Click **Save**
4. Call your ExoPhone from a personal phone to test

### Test Checklist

| Test | Expected Result |
|------|----------------|
| Call the ExoPhone | Greeting plays |
| Press 1 | Routed to Sales number |
| Press 2 | Routed to Support number |
| Press 0 | Routed to Operator |
| Press invalid key | Error message, menu replays |
| No input | Menu replays after timeout |
| No agent answers | Voicemail prompt plays |

## Available Applets Reference

| Applet | Function | Common Use |
|--------|----------|-----------|
| **Greeting** | Play audio or text-to-speech | Welcome messages, announcements |
| **IVR Menu** | Capture DTMF key press and route | Department selection, menu navigation |
| **Connect** | Route call to a phone, user, or SIP | Agent routing, call forwarding |
| **Voicemail** | Record caller's voice message | After-hours, no-answer fallback |
| **Passthru** | HTTP request to your server mid-call | Dynamic routing, CRM lookup |
| **Transfer** | Transfer to another number or flow | Warm and cold transfers |
| **Hangup** | End the call | Terminal action |
| **SMS** | Send an SMS during/after the call | Follow-up messages, confirmation texts |
| **Email** | Send an email notification | Alert team members, send summaries |

## Using the Flow URL in API Calls

Once your flow is created, you can trigger it programmatically:

```
http://my.exotel.com/<account_sid>/exoml/start_voice/<app_id>
```

Use this URL in:
- Voice campaign `url` parameter
- Connect API `url` parameter
- ExoPhone incoming call configuration

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Call goes straight to busy tone | ExoPhone not assigned to a flow | Assign the flow in ExoPhone settings |
| Greeting does not play | Text-to-speech misconfigured | Verify language setting and message text |
| IVR not recognizing key presses | DTMF detection issue | Test from a different phone; check IVR timeout settings |
| Call not routing to agent | Incorrect phone number in Connect | Verify agent numbers include country code |
| Voicemail not recording | Voicemail applet not connected | Check flow connections; ensure "No Answer" output is linked |
| Call flow changes not taking effect | Flow not saved or not published | Save the flow and verify it is assigned to the ExoPhone |

## Next Steps

- [Get API credentials](/docs/getting-started/api-credentials) -- Set up programmatic access
- [Test your setup](/docs/getting-started/testing-guide) -- Comprehensive testing walkthrough
- [ExoPhone Setup](/docs/getting-started/exophone-setup) -- Manage your virtual numbers
- [Dashboard Overview](/docs/getting-started/dashboard-overview) -- Navigate the full dashboard
