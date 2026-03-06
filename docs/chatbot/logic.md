---
title: Logic
description: Add conditional branching and channel-based filtering to your Exo-Chatbot conversations using Condition and Channel Filter logic elements.
sidebar_label: Logic
---

# Logic

## Overview

Logic elements are the decision-making components of the Flow Builder. They allow you to create dynamic, intelligent, and personalized conversational paths by directing the user's journey based on specific criteria. While other elements send messages or perform actions, Logic elements control the flow itself, determining which step comes next.

These elements are essential for building chatbots that can adapt to different situations, user inputs, and contexts. Instead of following a single, linear path, a conversation can branch into multiple directions, creating a more responsive and human-like interaction.

The Exo-Chatbot platform provides two primary Logic elements:

- **Condition** -- Acts as an "if/else" statement for your conversation. It evaluates the value of a variable and directs the user down different paths depending on whether the condition is met.
- **Channel Filter** -- Allows you to tailor the conversational experience for different communication channels (e.g., Web, WhatsApp, Facebook). You can create unique branches to leverage the specific capabilities of each platform.

By mastering Logic elements, you move from building simple, static bots to creating sophisticated, context-aware virtual assistants.

## How to Use Logic

Logic elements are added inside a node to create branching points in your conversation.

### Adding a Logic Element

1. On the Flow Builder canvas, click the **+** icon on a node where you want the decision to be made.
2. From the element menu, select the **Logic** category.
3. Choose either **Condition** or **Channel Filter**.

### Condition

The Condition element creates **If** and **Else** output connectors on your node, allowing you to build branching paths.

#### If Condition

- **Select Variable** -- Choose the variable you want to evaluate from the dropdown list.
- **Select Operator** -- Choose the comparison operator (e.g., Equal to, Greater than, Contains, Is not empty).
- **Enter Value** -- Enter the static value or select another variable `{}` to compare against.

#### Adding More Conditions

- Click **+ Add Additional Condition** to create nested AND/OR statements.
- Click **+ Add Another Condition** to create **Else If** branches, allowing for multiple possible outcomes.

#### Connecting Paths

- Drag the connector from the **If** branch to the node that should execute when the condition is true.
- Drag the connector from the **Else** branch to the node that should execute when the condition is false.

:::warning Important
You must always connect the **Else** path. Leaving it disconnected creates a dead end for users whose data does not match any of your conditions.
:::

### Channel Filter

The Channel Filter element creates a unique output connector for each channel or group of channels you define.

- **If Condition** -- The first branch is created by default. Click the dropdown and select one or more channels (e.g., check the box for Web).
- **Elseif Condition** -- Click **+ Add Another Condition** to create a new branch. Select one or more different channels for this branch (e.g., check the box for WhatsApp).
- **Else** -- This branch will execute for any channel that you have not explicitly defined a path for. It is crucial to connect this path as a fallback.

## Common Use Cases

### Loan Eligibility Check (Condition)

1. An API action checks a user's credit score and stores it in a `{credit_score}` variable.
2. A Condition node checks: If `{credit_score}` is Greater than 700.
3. The **If** path leads to a message: "Congratulations, you are pre-approved!"
4. The **Else** path leads to a message: "We need a bit more information to process your application."

### Omnichannel Product Display (Channel Filter)

1. A user asks to see product categories.
2. A Channel Filter node directs the flow:
   - The **Web and Facebook** branch connects to a node with a rich Carousel message, which is highly visual.
   - The **WhatsApp** branch connects to a node with a WhatsApp List prompt, which is native to that platform.
   - The **Else** branch (for SMS, etc.) connects to a simple Text message listing the categories.

## Best Practices

:::tip
- **Always Define a Fallback** -- For both Condition and Channel Filter, always connect the Else path. This prevents your user from getting stuck if their situation does not match any of your specific branches.
- **Keep Conditions Simple** -- If you find yourself creating a Condition node with many nested AND/OR statements, consider breaking the logic into multiple, sequential Condition nodes. This makes the flow easier to read and debug.
:::

## Common Mistakes

:::warning Avoid these pitfalls
- **Not Handling All Channels** -- When using Channel Filter, if you only define paths for Web and WhatsApp but forget the Else path, a user on Facebook Messenger might hit a dead end.
- **Comparing the Wrong Data Types** -- Trying to use a "Greater than" operator on a text variable (e.g., If `{user_name}` is Greater than 100) will not work as expected. Ensure your variable types and operators match.
:::

## Related

- [Flow Builder](./flow-builder.md)
- [Actions](./actions.md)
- [Bot Messages](./bot-messages.md)
- [Bot Prompts](./bot-prompts.md)
