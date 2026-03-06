---
id: app-builder
title: App Builder
description: "Use Exotel App Builder to create custom call flow applications without coding using a visual drag-and-drop interface."
sidebar_label: App Builder
sidebar_position: 1
---

# App Builder

The App Builder is Exotel's no-code tool for creating call flow applications. Using a visual drag-and-drop interface, you can design complex call flows by connecting applets together, configure each step, and deploy your app -- all without writing a single line of code.

## Accessing the App Builder

1. Log in to [my.exotel.com](https://my.exotel.com)
2. Navigate to **App Bazaar** in the left sidebar
3. Click **Create New App** to start from scratch, or select an existing app and click **Edit**
4. The App Builder opens with the visual [Flow Builder](/docs/app-bazaar/flow-builder-guide)

## App Builder Interface

The App Builder interface consists of the following sections:

| Section | Location | Purpose |
|---------|----------|---------|
| **Applet Palette** | Left sidebar | Library of available applets to drag into the canvas |
| **Flow Canvas** | Center area | Visual workspace where you design the call flow |
| **Properties Panel** | Right sidebar | Configuration panel for the selected applet |
| **Toolbar** | Top bar | Save, test, undo/redo, zoom, and version controls |
| **Status Bar** | Bottom bar | Validation status, warnings, and flow summary |

## Creating an App

### Step 1: Start a New App

1. Click **Create New App**
2. Enter an **App Name** (e.g., "Customer Support IVR")
3. Optionally add a description
4. Click **Create**

### Step 2: Add Applets to the Canvas

1. From the **Applet Palette**, drag an applet onto the canvas
2. The first applet you place becomes the **entry point** of the flow
3. Continue adding applets by dragging them from the palette

### Step 3: Connect Applets

1. Hover over an applet to reveal its **output connectors** (small circles on the edges)
2. Click and drag from an output connector to the next applet's **input connector**
3. A connecting line appears, showing the flow path
4. For applets with multiple outputs (e.g., IVR), each output can connect to a different next step

### Step 4: Configure Each Applet

1. Click on an applet in the canvas
2. The **Properties Panel** opens on the right
3. Configure the applet's settings (see individual applet guides for details)
4. Click **Save** in the properties panel

### Step 5: Validate and Save

1. Click the **Validate** button in the toolbar
2. The builder checks for:
   - Disconnected applets (not linked to the flow)
   - Missing required configurations
   - Circular references
   - Dead-end paths without a Hangup applet
3. Fix any validation errors highlighted in red
4. Click **Save App**

## App Configuration Options

### General Settings

| Setting | Description |
|---------|-------------|
| **App Name** | Display name for identification |
| **Description** | Optional text describing the app's purpose |
| **Incoming Call Handling** | Defines the entry point for inbound calls |
| **Timeout** | Maximum call duration before automatic hangup (default: 3600 seconds) |

### Call Recording

| Setting | Options |
|---------|---------|
| **Recording enabled** | Yes / No |
| **Recording format** | MP3 (default) or WAV |
| **Dual-channel** | Record agent and customer on separate channels |
| **Recording consent** | Add a Greeting applet at the start to announce recording |

### Fallback Behavior

Configure what happens when the flow encounters an error:

| Scenario | Default Behavior | Configurable |
|----------|-----------------|-------------|
| **Applet fails** | Move to next applet in sequence | Yes -- route to a specific fallback applet |
| **No agent available** | Play busy message and hang up | Yes -- route to voicemail or queue |
| **HTTP timeout** (Passthru) | Continue to next applet | Yes -- route to fallback path |
| **Invalid DTMF input** (IVR) | Replay the IVR menu | Yes -- route to default option or agent |

## Working with the Flow Builder

The visual flow builder is the core of the App Builder. See the [Flow Builder Guide](/docs/app-bazaar/flow-builder-guide) for detailed instructions on:

- Navigating the canvas (zoom, pan, fit-to-screen)
- Connecting and disconnecting applets
- Creating branching logic (IVR menus, conditional routing)
- Using the mini-map for large flows
- Keyboard shortcuts for faster editing

## Testing Your App

### Test Call Method

1. Save your app
2. Assign it to an ExoPhone (or use a test ExoPhone)
3. Make a call to the assigned ExoPhone
4. Walk through the flow as a caller
5. Check call logs to verify the flow executed correctly

### Validation Checks

The App Builder performs the following validation checks:

| Check | What It Verifies |
|-------|-----------------|
| **Connectivity** | All applets are connected to the flow |
| **Configuration** | All required fields are filled in |
| **Termination** | Every path ends with a Hangup applet or a Connect applet |
| **Circular reference** | No infinite loops in the flow |
| **Applet compatibility** | Connected applets are compatible with each other |

:::tip
Always test with at least three scenarios: the happy path (caller follows expected flow), an edge case (unusual input), and a failure case (timeout or error condition).
:::

## App Templates

Start from a pre-built template to save time:

| Template | Flow Structure | Best For |
|----------|---------------|----------|
| **Basic IVR** | Greeting > IVR (3 options) > Connect | Simple department routing |
| **Support Queue** | Greeting > Connect (with queue) > Voicemail | Customer support teams |
| **Lead Capture** | Greeting > SMS > Email > Hangup | Missed call lead capture |
| **Survey** | Greeting > IVR (CSAT) > Passthru > Hangup | Post-call feedback |
| **After Hours** | Time Check > Greeting > Voicemail | Business hours routing |

### Using a Template

1. Click **Create New App**
2. Select **Start from Template**
3. Choose a template
4. The template flow loads in the canvas
5. Customize the applet configurations for your needs
6. Save the app

## App Versioning (Enterprise)

Enterprise accounts have access to app versioning:

| Feature | Description |
|---------|-------------|
| **Version history** | View all saved versions of an app |
| **Rollback** | Revert to a previous version instantly |
| **Compare** | Side-by-side comparison of two versions |
| **Comments** | Add notes to each version describing changes |

:::info
Every time you save an app, a new version is created. Version history is retained for 90 days (Growth plan) or indefinitely (Enterprise plan).
:::

## Best Practices

1. **Start simple** -- Begin with a basic flow and add complexity incrementally
2. **Always add a Greeting** -- Welcome callers before routing them
3. **Handle every path** -- Ensure every branch has a termination point (Hangup or Connect)
4. **Use Passthru for dynamic routing** -- Integrate with your CRM or business logic via HTTP
5. **Test before going live** -- Use a test ExoPhone to validate the entire flow
6. **Document your flows** -- Add descriptions to each applet explaining its purpose
7. **Use templates for common patterns** -- Do not reinvent standard flows

## Related Topics

- [Flow Builder Guide](/docs/app-bazaar/flow-builder-guide) -- Detailed flow builder instructions
- [App Bazaar Overview](/docs/app-bazaar/overview) -- Complete applet catalog
- [ExoPhones](/docs/exophones/overview) -- Assign apps to virtual numbers
- [Voice API](/docs/voice-api/getting-started/overview) -- Trigger apps programmatically
