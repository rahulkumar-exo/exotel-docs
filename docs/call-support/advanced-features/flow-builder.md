---
id: flow-builder
title: Exotel Flow Builder
description: "Design complex call flows visually with Exotel's drag-and-drop Flow Builder using applets, branches, and API connectors."
sidebar_label: Flow Builder
sidebar_position: 2
---

# Exotel Flow Builder

The Exotel Flow Builder is a visual, drag-and-drop tool for designing call flows without writing code. It provides a canvas where you arrange applets (building blocks), connect them with branches, and define how calls are handled from start to finish.

## Accessing the Flow Builder

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Navigate to **App Bazaar** (or **Call Flows**) in the left sidebar.
3. Click **Create New Flow** to start a new flow, or click on an existing flow to edit it.

The Flow Builder interface consists of:

| Component | Description |
|---|---|
| **Canvas** | The main workspace where you arrange applets |
| **Applet palette** | The library of available applets (left panel) |
| **Configuration panel** | Settings for the selected applet (right panel) |
| **Toolbar** | Save, publish, undo, redo, zoom controls |
| **Connection lines** | Visual links between applets showing call flow paths |

## Available Applets

### Communication Applets

| Applet | Purpose | Outputs |
|---|---|---|
| **Greeting** | Play an audio message to the caller | Single output (proceeds to next) |
| **IVR Menu** | Present options and route by DTMF keypress | One output per key + timeout + invalid |
| **Connect** | Route the call to one or more agents | Answered, no answer, busy |
| **Voicemail** | Record a message from the caller | Single output (after recording) |
| **Transfer** | Transfer the call to another flow | Single output |
| **Hangup** | End the call | No output (terminal) |

### Notification Applets

| Applet | Purpose | Outputs |
|---|---|---|
| **SMS** | Send an SMS to the caller or another number | Single output |
| **Email** | Send an email notification | Single output |

### Logic Applets

| Applet | Purpose | Outputs |
|---|---|---|
| **Passthru** | Make an HTTP request to your server mid-call | Multiple outputs based on response |
| **Business Hours** | Check if current time is within schedule | Within hours, outside hours |
| **Condition** | Branch based on a variable or expression | True, false |

See: [Voice v1 Applets](/docs/voice-v1/overview)

## Building a Call Flow

### Step 1: Plan Your Flow

Before using the builder, sketch your call flow on paper or a whiteboard:

```
Start → Greeting → IVR (Sales/Support/Billing)
    Sales → Connect (Sales team) → No answer → Voicemail → Email
    Support → Connect (Support team) → No answer → Queue → Overflow → Voicemail
    Billing → Connect (Billing) → No answer → Voicemail
```

### Step 2: Drag Applets onto the Canvas

1. From the **Applet Palette** on the left, drag each applet you need onto the canvas.
2. Arrange them in a logical sequence from left to right (or top to bottom).

### Step 3: Connect Applets

1. Hover over the output port of an applet (small circle on the right side).
2. Click and drag a connection line to the input port of the next applet.
3. For applets with multiple outputs (IVR, Connect), connect each output to the appropriate destination.

### Step 4: Configure Each Applet

Click on an applet to open its configuration panel:

**Greeting Configuration:**
- Audio source: Record, upload, or TTS
- Audio content: The message to play

**IVR Menu Configuration:**
- Prompt audio: The menu options
- Key mappings: Which key goes where
- Timeout: Seconds to wait for input
- Max retries: Times to repeat on invalid input

**Connect Configuration:**
- Agent numbers: Phone numbers to ring
- Ring strategy: Parallel, sequential, or round-robin
- Ring timeout: Seconds before moving to next output
- Recording: Enable or disable call recording
- Sticky agent: Enable or disable
- Queue: Enable with hold music and max wait time

**Passthru Configuration:**
- HTTP URL: Your server endpoint
- HTTP method: GET or POST
- Parameters: Data to send with the request
- Response handling: How to interpret the server response

### Step 5: Test the Flow

1. Click **Save** to save your draft.
2. Click **Test** (if available) or temporarily assign the flow to an ExoPhone.
3. Call the ExoPhone from an external number.
4. Navigate through each path to verify correct behavior.

### Step 6: Publish

1. Click **Publish** to make the flow active.
2. Assign the flow to your ExoPhone(s).

:::warning
Changes to a published flow take effect immediately for all calls on the assigned ExoPhones. Test thoroughly before publishing, especially during business hours.
:::

## Advanced Flow Patterns

### Branching with Passthru

Use the Passthru applet to implement dynamic routing based on external data:

```
Start → Passthru (POST to your CRM)
    → CRM returns "VIP" → Connect (VIP team)
    → CRM returns "Standard" → IVR (standard menu)
    → CRM returns "Blocked" → Greeting ("Sorry, this service is unavailable") → Hangup
```

The Passthru applet sends the caller's number to your server, which looks up the caller in your CRM and returns a routing decision.

### Nested Flows with Transfer

Break complex flows into smaller, reusable modules:

```
Main Flow:
    Greeting → IVR
        → 1: Transfer (Sales Flow)
        → 2: Transfer (Support Flow)
        → 3: Transfer (Billing Flow)

Sales Flow:
    Greeting (Sales welcome) → Connect (Sales team) → Voicemail

Support Flow:
    Greeting (Support welcome) → Queue → Connect (Support team) → Voicemail

Billing Flow:
    Greeting (Billing welcome) → Connect (Billing) → Voicemail
```

This keeps each flow simple and easy to maintain.

### Error Handling

Always design for failure scenarios:

```
Connect (Agent group)
    → Answered: Call connected
    → No Answer: Voicemail → Email → Hangup
    → Busy: Queue → Voicemail → Email → Hangup
    → Failed: Greeting ("We are experiencing issues. Please try again later.") → Hangup
```

### Looping (Repeat IVR)

To repeat an IVR menu after invalid input:

1. From the **Invalid** and **Timeout** outputs of the IVR Menu, connect back to the same IVR Menu applet.
2. Set a **Max Retries** limit to prevent infinite loops.
3. After max retries, connect to a fallback (e.g., Connect to operator, Voicemail).

## Flow Versioning

### Draft vs. Published

| State | Description | Live Calls |
|---|---|---|
| **Draft** | Saved but not active | Not affected |
| **Published** | Active and handling calls | All incoming calls use this version |

### Reverting Changes

If a published flow has issues:

1. Open the flow in the builder.
2. Make corrections.
3. Save and republish.

:::tip
Before making significant changes to a production flow, clone it first. Work on the clone, test it with a test ExoPhone, and only publish to your main ExoPhone when verified.
:::

## Flow Templates

Exotel provides pre-built flow templates for common scenarios:

| Template | Description |
|---|---|
| **Basic IVR** | Greeting + IVR Menu + Connect |
| **Support Line** | Greeting + IVR + Queue + Connect + Voicemail |
| **After-Hours** | Business Hours check + Live agents / Voicemail |
| **Missed Call Callback** | Auto-callback on missed calls |
| **Survey** | Outbound IVR with keypress collection |

Access templates from the **Create New Flow** dialog in App Bazaar.

## Performance Considerations

| Factor | Impact | Recommendation |
|---|---|---|
| **Number of applets** | More applets = more processing time | Keep flows under 15 applets |
| **Passthru response time** | Slow server = delayed routing | Keep Passthru responses under 2 seconds |
| **Audio file size** | Large files = longer load time | Keep greetings under 30 seconds |
| **Nested transfers** | Multiple transfers add latency | Limit to 2 levels of transfer |

## Best Practices

- **Start simple** -- Begin with a basic flow and add complexity incrementally.
- **Name applets clearly** -- Give each applet a descriptive name (e.g., "Sales IVR Menu", "Support Connect") for easy identification.
- **Always have a terminal** -- Every flow path must end with a Hangup, Voicemail, or Transfer. No path should lead to a dead end.
- **Test every path** -- Call your ExoPhone and test every IVR option, timeout, busy, and no-answer scenario.
- **Use templates** -- Start with a template and customize rather than building from scratch.
- **Document your flows** -- Maintain a document or diagram of your call flows for team reference.
- **Clone before editing** -- Clone production flows before making changes.

## Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| Flow will not publish | Validation errors | Check for unconnected applets or missing configurations |
| Call hangs after greeting | Next applet not connected | Wire the Greeting output to the next applet |
| IVR not responding to keys | Key mappings not configured | Verify each key is mapped to an applet |
| Passthru timeout | Server response too slow | Optimize server response time |
| Flow not assigned to ExoPhone | Forgot to assign | Go to ExoPhones and select the flow |

## Related

- [Setting Up a Call Flow](/docs/call-support/call-features/setting-up-call-flow)
- [IVR Setup](/docs/call-support/call-features/ivr-setup)
- [Multi-Level IVR](/docs/call-support/advanced-features/multi-level-ivr)
- [Smart Routing](/docs/call-support/advanced-features/smart-routing)
- [Voice v1 Applets](/docs/voice-v1/overview)
