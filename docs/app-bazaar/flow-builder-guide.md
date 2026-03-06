---
id: flow-builder-guide
title: Flow Builder Guide
description: "Design call flows visually with Exotel's drag-and-drop Flow Builder. Connect applets, configure branching, and deploy apps."
sidebar_label: Flow Builder Guide
sidebar_position: 2
---

# Flow Builder Guide

The Flow Builder is the visual drag-and-drop interface within the [App Builder](/docs/app-bazaar/app-builder) where you design call flows by placing and connecting applets on a canvas. This guide covers all the features and techniques for building effective call flows.

## Flow Builder Interface

### Canvas Navigation

| Action | Mouse | Keyboard |
|--------|-------|----------|
| **Pan** | Click and drag on empty canvas | Arrow keys |
| **Zoom in** | Scroll wheel up | `Ctrl/Cmd` + `+` |
| **Zoom out** | Scroll wheel down | `Ctrl/Cmd` + `-` |
| **Fit to screen** | Double-click empty canvas | `Ctrl/Cmd` + `0` |
| **Select applet** | Click on applet | Tab to cycle through applets |
| **Multi-select** | `Shift` + click, or drag selection box | `Ctrl/Cmd` + `A` (select all) |
| **Delete** | Select + `Delete` key | `Backspace` |
| **Undo** | -- | `Ctrl/Cmd` + `Z` |
| **Redo** | -- | `Ctrl/Cmd` + `Shift` + `Z` |

### Canvas Layout

```
┌──────────────────────────────────────────────────────────────┐
│  Toolbar: [Save] [Validate] [Undo] [Redo] [Zoom] [Settings] │
├───────────┬──────────────────────────────────┬───────────────┤
│           │                                   │               │
│  Applet   │        Flow Canvas                │  Properties   │
│  Palette  │                                   │  Panel        │
│           │   ┌────────┐    ┌────────┐        │               │
│  Greeting │   │Greeting│───►│  IVR   │───►    │  [Config      │
│  IVR      │   └────────┘    └────────┘        │   fields      │
│  Connect  │                                   │   for          │
│  Passthru │                                   │   selected     │
│  SMS      │                                   │   applet]      │
│  Transfer │                                   │               │
│  ...      │                                   │               │
│           │                                   │               │
├───────────┴──────────────────────────────────┴───────────────┤
│  Status Bar: ✓ Flow valid | 5 applets | Last saved 2 min ago │
└──────────────────────────────────────────────────────────────┘
```

## Placing Applets

### Drag from Palette

1. In the **Applet Palette** (left sidebar), find the applet you need
2. Click and hold the applet
3. Drag it onto the canvas
4. Release to place it at the desired position

### Applet Indicators

Each applet on the canvas displays:

| Element | Meaning |
|---------|---------|
| **Applet icon** | Visual identifier for the applet type |
| **Applet name** | The configured name (e.g., "Welcome Greeting") |
| **Input connector** (top/left circle) | Where incoming flow connects |
| **Output connector(s)** (bottom/right circle) | Where outgoing flow connects |
| **Status indicator** | Green (configured), Yellow (incomplete), Red (error) |

## Connecting Applets

### Creating Connections

1. Hover over the source applet to reveal output connectors
2. Click and drag from an **output connector**
3. Drag the connection line to the target applet's **input connector**
4. Release to create the connection

### Connection Types

| Connection Type | Applets | Description |
|----------------|---------|-------------|
| **Sequential** | Most applets | Single output to single input; flow proceeds in order |
| **Branching** | IVR, Passthru | Multiple outputs, each leading to a different path |
| **Fallback** | Connect, Passthru | Secondary output for error/timeout conditions |

### Removing Connections

1. Click on the connection line to select it
2. Press `Delete` or `Backspace`
3. The connection is removed; both applets remain on the canvas

## Branching Logic

### IVR Branching

The IVR applet creates branches based on caller DTMF input:

```
             ┌────────────────► [Sales Connect]     (Press 1)
             │
[IVR Menu] ──┼────────────────► [Support Connect]   (Press 2)
             │
             ├────────────────► [Billing Connect]    (Press 3)
             │
             └────────────────► [Replay IVR]         (No input / invalid)
```

Each IVR option corresponds to a separate output connector. Connect each to the appropriate next applet.

### Passthru Branching

The Passthru applet branches based on the HTTP response:

```
                 ┌──────────────► [VIP Agent]    (HTTP 200 + VIP flag)
                 │
[Passthru] ──────┼──────────────► [Regular Queue] (HTTP 200 + regular flag)
                 │
                 └──────────────► [Default Queue]  (HTTP error / timeout)
```

### Time-Based Branching

Create business-hours routing using the Passthru applet:

1. Add a Passthru applet at the start of the flow
2. Configure it to call your server endpoint that returns the current time status
3. Branch to "Business Hours" flow (e.g., Connect to agents) or "After Hours" flow (e.g., Voicemail)

## Configuring Applets

### Configuration Workflow

1. Click an applet on the canvas to select it
2. The **Properties Panel** opens on the right
3. Fill in the required fields (marked with an asterisk)
4. Optionally configure advanced settings
5. Click **Apply** to save the applet configuration

### Common Configuration Fields

| Field | Found In | Description |
|-------|----------|-------------|
| **Applet Name** | All applets | Custom label for identification on the canvas |
| **Audio File** | Greeting, IVR | Audio to play (upload, record, or TTS) |
| **Phone Number** | Connect | Number or group to route calls to |
| **URL** | Passthru | HTTP endpoint to call during the flow |
| **Timeout** | Connect, IVR | Seconds to wait before moving to next step |
| **Retries** | IVR, Passthru | Number of retry attempts on failure |

## Flow Validation

### Automatic Validation

The Flow Builder continuously validates your flow and shows issues in the status bar:

| Severity | Icon | Description |
|----------|------|-------------|
| **Error** | Red circle | Must be fixed before saving (e.g., disconnected applet, missing required field) |
| **Warning** | Yellow triangle | Should be reviewed (e.g., dead-end path, unusually long timeout) |
| **Info** | Blue circle | Suggestions for improvement (e.g., consider adding a greeting) |

### Common Validation Errors

| Error | Cause | Fix |
|-------|-------|-----|
| "Disconnected applet" | Applet not connected to any flow path | Connect it or remove it from the canvas |
| "Missing required field" | A required configuration field is empty | Click the applet and fill in the missing field |
| "Dead-end path" | A branch does not terminate with Hangup or Connect | Add a Hangup applet at the end of the path |
| "Circular reference" | Flow creates an infinite loop | Break the loop by redirecting the connection |
| "No entry point" | No applet is marked as the first step | Ensure the first applet has no incoming connections |

## Advanced Flow Patterns

### Sequential Flow

The simplest pattern -- applets execute one after another:

```
Greeting ──► Connect ──► Hangup
```

### Menu-Based Routing

Caller selects options via DTMF:

```
Greeting ──► IVR ──► (1) Connect Sales
                  ──► (2) Connect Support
                  ──► (3) Greeting (account info)
                  ──► (*) Replay IVR
```

### Dynamic Routing with HTTP

Use Passthru to make routing decisions based on external data:

```
Greeting ──► Passthru (check CRM) ──► (VIP) Connect to VIP agent
                                   ──► (Regular) Connect to queue
                                   ──► (Error) Connect to default
```

### Multi-Level IVR

Nested IVR menus for complex menu trees:

```
Greeting ──► IVR Level 1 ──► (1) IVR Level 2 (Sales) ──► (1) Connect Sales India
                                                       ──► (2) Connect Sales APAC
                          ──► (2) IVR Level 2 (Support) ──► (1) Connect Tech Support
                                                         ──► (2) Connect Billing
                          ──► (0) Connect Operator
```

### Fallback with Voicemail

Handle cases where agents are unavailable:

```
Greeting ──► Connect Agent ──► (answered) [call proceeds]
                            ──► (busy/no-answer) Greeting ("Please leave a message")
                                                 ──► Voicemail ──► Email Notify ──► Hangup
```

## Best Practices

1. **Keep flows readable** -- Arrange applets left-to-right or top-to-bottom for visual clarity
2. **Name your applets** -- Use descriptive names like "Welcome Greeting" instead of "Greeting 1"
3. **Limit IVR depth** -- Maximum 2 -- 3 levels of IVR menus to avoid caller frustration
4. **Always handle errors** -- Every branching applet should have a fallback/default path
5. **Test all branches** -- Walk through every possible path during testing
6. **Use the mini-map** -- For large flows, enable the mini-map to navigate quickly
7. **Save frequently** -- The builder supports auto-save, but manual saves create version checkpoints

## Related Topics

- [App Builder](/docs/app-bazaar/app-builder) -- Overall app creation guide
- [Greeting Applet Guide](/docs/app-bazaar/greeting-applet-guide) -- Configure audio greetings
- [IVR Applet Guide](/docs/app-bazaar/ivr-applet-guide) -- Build IVR menus
- [Connect Applet Guide](/docs/app-bazaar/connect-applet-guide) -- Route calls to agents
- [Passthru Applet Guide](/docs/app-bazaar/passthru-applet-guide) -- HTTP integrations in call flows
