---
id: transfer
title: Transfer Applet
description: Build modular call flows with the Exotel Transfer applet. Transfer calls between separate reusable flows instead of duplicating logic.
sidebar_label: Transfer
sidebar_position: 4
---

# Transfer Applet

The Transfer applet lets you build modular call flows by transferring between multiple flows. Instead of creating one large, complex flow, you can break it into smaller reusable flows and use the Transfer applet to connect them.

## How It Works

1. Create separate call flows for different functions (e.g., Voicemail flow, Support flow)
2. In your main flow, use the Transfer applet to jump to another flow
3. The call continues in the target flow

## Use Case: Reusable Voicemail

Instead of duplicating voicemail configuration in every branch of a complex IVR:

**Without Transfer** (repetitive):
```
IVR Menu → Press 1 → Connect → (no answer) → Voicemail setup
         → Press 2 → Connect → (no answer) → Voicemail setup (duplicate)
         → Press 3 → Connect → (no answer) → Voicemail setup (duplicate)
```

**With Transfer** (modular):
```
Voicemail Flow: Greeting → Voicemail

IVR Menu → Press 1 → Connect → (no answer) → Transfer to Voicemail Flow
         → Press 2 → Connect → (no answer) → Transfer to Voicemail Flow
         → Press 3 → Connect → (no answer) → Transfer to Voicemail Flow
```

## Configuration

1. Create the target flow (e.g., a "Voicemail" flow) in the Exotel Dashboard
2. In your main flow, drag the **Transfer** applet
3. Select the target flow from the dropdown

## Best Practices

- Use Transfer for any functionality that repeats across multiple flows
- Keep individual flows focused on a single responsibility
- Name your flows clearly so they're easy to reference
