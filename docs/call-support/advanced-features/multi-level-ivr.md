---
id: multi-level-ivr
title: Multi-Level IVR
description: "Build nested IVR menus with sub-flows and multiple navigation levels in Exotel for complex call routing scenarios."
sidebar_label: Multi-Level IVR
sidebar_position: 6
---

# Multi-Level IVR

A multi-level IVR extends the standard IVR menu by adding nested layers of options. Callers navigate through a hierarchy of menus to reach the right department, service, or information. While a single-level IVR offers one set of options (e.g., "Press 1 for Sales, 2 for Support"), a multi-level IVR provides sub-menus under each option.

## Single-Level vs. Multi-Level IVR

### Single-Level

```
"Press 1 for Sales, Press 2 for Support"
    → 1: Connect (Sales)
    → 2: Connect (Support)
```

### Multi-Level (2 Levels)

```
Level 1: "Press 1 for Sales, Press 2 for Support"
    → 1: Level 2: "Press 1 for New Inquiry, Press 2 for Existing Order"
        → 1: Connect (New Sales team)
        → 2: Connect (Order team)
    → 2: Level 2: "Press 1 for Technical, Press 2 for Billing"
        → 1: Connect (Tech support)
        → 2: Connect (Billing team)
```

### Multi-Level (3 Levels)

```
Level 1: "Press 1 for Products, Press 2 for Services"
    → 1: Level 2: "Press 1 for Electronics, Press 2 for Appliances"
        → 1: Level 3: "Press 1 for TVs, Press 2 for Phones, Press 3 for Laptops"
            → 1: Connect (TV support)
            → 2: Connect (Phone support)
            → 3: Connect (Laptop support)
        → 2: Connect (Appliance support)
    → 2: Level 2: "Press 1 for Installation, Press 2 for Repair"
        → 1: Connect (Installation team)
        → 2: Connect (Repair team)
```

## When to Use Multi-Level IVR

| Scenario | Number of Levels | Example |
|---|---|---|
| Small business with 2-3 departments | 1 level | Sales, Support |
| Mid-size business with specialized teams | 2 levels | Department > Sub-team |
| Large enterprise with many products/services | 2-3 levels | Category > Product > Issue type |
| Multi-language support | 2 levels | Language > Department |
| Multi-region business | 2 levels | Region > Department |

:::warning
Limit your IVR to a maximum of 3 levels. Research shows that caller satisfaction drops significantly with each additional level. If you need more than 3 levels, consider using smart routing instead.
:::

## Building a Multi-Level IVR in Exotel

### Step 1: Plan the Menu Structure

Map out every level, option, and destination before building:

```
Root
├── 1: Sales
│   ├── 1: New Inquiry → Connect (New Sales)
│   ├── 2: Existing Order → Connect (Orders)
│   └── 3: Partnerships → Connect (BD team)
├── 2: Support
│   ├── 1: Technical → Connect (Tech L1)
│   ├── 2: Billing → Connect (Billing)
│   └── 3: Account Issues → Connect (Account team)
├── 3: Information
│   ├── 1: Business Hours → Greeting (hours info) → Hangup
│   ├── 2: Office Location → Greeting (address) → Hangup
│   └── 3: Website → SMS (URL) → Hangup
└── 0: Speak to Operator → Connect (Receptionist)
```

### Step 2: Create the Call Flow

1. Open the **Flow Builder** in App Bazaar.
2. Add a **Greeting** applet for the welcome message.
3. Add an **IVR Menu** applet for Level 1.
4. For each Level 1 option that needs a sub-menu, add another **IVR Menu** applet for Level 2.
5. Connect each Level 2 option to its destination (Connect, Voicemail, Greeting, etc.).

### Step 3: Configure Level 1 IVR

- **Prompt**: "Welcome to Acme Corp. Press 1 for Sales, Press 2 for Support, Press 3 for Information, or Press 0 for an operator."
- **Key mappings**:

| Key | Routes To |
|---|---|
| 1 | Level 2: Sales sub-menu |
| 2 | Level 2: Support sub-menu |
| 3 | Level 2: Information sub-menu |
| 0 | Connect (Receptionist) |
| Timeout | Repeat Level 1 (max 2 retries) |
| Invalid | "That is not a valid option" → Repeat Level 1 |

### Step 4: Configure Level 2 IVR (Sales)

- **Prompt**: "For new inquiries, press 1. For an existing order, press 2. For partnerships, press 3. To go back, press star."
- **Key mappings**:

| Key | Routes To |
|---|---|
| 1 | Connect (New Sales team) |
| 2 | Connect (Orders team) |
| 3 | Connect (BD team) |
| * | Back to Level 1 IVR |
| Timeout | Repeat Level 2 |
| Invalid | "That is not a valid option" → Repeat Level 2 |

### Step 5: Configure Level 2 IVR (Support)

- **Prompt**: "For technical support, press 1. For billing, press 2. For account issues, press 3. To go back, press star."
- **Key mappings**: Similar structure, each key routing to the appropriate Connect applet.

### Step 6: Add "Go Back" Navigation

Allow callers to return to the previous menu:

- Reserve the `*` key for "go back to the previous menu."
- Connect the `*` output of each Level 2 IVR to the Level 1 IVR applet.

```
Level 2 (Sales sub-menu)
    → * pressed → Level 1 IVR (main menu)
```

:::tip
Always offer a "go back" option. Callers who accidentally choose the wrong option should not have to hang up and redial. Reserving `*` for "go back" and `0` for "speak to an operator" across all levels creates a consistent, intuitive navigation experience.
:::

### Step 7: Add Fallback at Every Level

Every IVR level should have:

| Scenario | Action |
|---|---|
| **Timeout** (no input) | Repeat the prompt (max 2-3 times), then route to operator |
| **Invalid input** | Play error message, repeat the prompt |
| **Max retries exceeded** | Route to operator or voicemail |

## Using Sub-Flows for Complex IVR

For very large IVR structures, break each department's sub-menu into a separate call flow and use the **Transfer** applet to connect them:

```
Main Flow:
    Greeting → Level 1 IVR
        → 1: Transfer (Sales Sub-Flow)
        → 2: Transfer (Support Sub-Flow)
        → 3: Transfer (Information Sub-Flow)

Sales Sub-Flow:
    Level 2 IVR → Connect (various sales teams)

Support Sub-Flow:
    Level 2 IVR → Connect (various support teams)
```

**Advantages of sub-flows:**

- Each flow is simpler and easier to maintain.
- Different teams can manage their own sub-flows independently.
- Changes to one department's menu do not affect others.

## Dynamic Multi-Level IVR

For businesses with frequently changing menus (e.g., seasonal products, dynamic teams), build the IVR dynamically using the Passthru applet:

```
Level 1 IVR → Caller presses 1
    → Passthru (send selection to your server)
    → Your server returns the Level 2 menu options
    → Level 2 IVR plays dynamically
```

This allows you to update menu options on your server without modifying the Exotel call flow.

## Multi-Language IVR

Use the first IVR level for language selection:

```
Level 1: "For English, press 1. Hindi ke liye 2 dabayein."
    → 1: Level 2 (English): "Press 1 for Sales, 2 for Support"
    → 2: Level 2 (Hindi): "Bikri ke liye 1 dabayein, sahayata ke liye 2 dabayein"
```

Each language path leads to the appropriate language-specific agents.

## IVR Menu Design Guidelines

| Guideline | Recommendation |
|---|---|
| **Options per level** | Maximum 5 (ideally 3-4) |
| **Total levels** | Maximum 3 (ideally 2) |
| **Prompt length** | Under 15 seconds per level |
| **Most common option** | Listed first |
| **Operator option** | Available at every level (Press 0) |
| **Go back option** | Available at Level 2+ (Press *) |
| **Timeout** | 5-7 seconds per level |
| **Max retries** | 2-3 per level |

## Measuring IVR Effectiveness

Track these metrics to optimize your multi-level IVR:

| Metric | What It Reveals | Action If Poor |
|---|---|---|
| **Completion rate** | Percentage of callers who reach an agent | Simplify the menu if below 80% |
| **Drop-off rate per level** | Where callers hang up | Reduce options or levels where drop-off is high |
| **Average time in IVR** | How long callers spend navigating | Shorten prompts or reduce levels |
| **Option distribution** | Which options are most popular | Put popular options first |
| **Zero-out rate** | How often callers press 0 for operator | High rate suggests IVR is frustrating |

## Best Practices

- **Put the most popular option first** -- If 60% of callers want Support, make it option 1.
- **Keep prompts concise** -- "Press 1 for Sales" is better than "If you would like to speak with our sales department, please press 1 now."
- **Maintain consistent conventions** -- Use `*` for back and `0` for operator at every level.
- **Offer a shortcut for repeat callers** -- If a caller always selects the same path, use [Sticky Agent](/docs/call-support/call-features/sticky-agent) or [Smart Routing](/docs/call-support/advanced-features/smart-routing) to skip the IVR.
- **Test with real users** -- Ask team members or customers to navigate the IVR and provide feedback.
- **Review analytics monthly** -- Use drop-off data to identify and fix problem areas.

## Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| Caller gets stuck in a loop | Back navigation connects to wrong IVR | Verify `*` key connections in the flow |
| Level 2 prompt not playing | Connection between Level 1 and Level 2 IVR missing | Check flow connections |
| Caller reaches wrong department | Key mapping incorrect | Verify key-to-applet mappings at each level |
| IVR feels too long | Too many options or levels | Reduce to 2 levels with 4 options each |
| Callers always press 0 | IVR menu not helpful | Redesign menu structure based on caller needs |

## Related

- [IVR Setup](/docs/call-support/call-features/ivr-setup)
- [Setting Up a Call Flow](/docs/call-support/call-features/setting-up-call-flow)
- [Flow Builder](/docs/call-support/advanced-features/flow-builder)
- [Smart Routing](/docs/call-support/advanced-features/smart-routing)
- [Greeting Message](/docs/call-support/call-features/greeting-message)
