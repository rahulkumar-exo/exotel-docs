---
title: Flow Builder
description: Design and automate conversational user journeys with the visual Flow Builder. Create nodes, add elements, and connect conversation paths without code.
sidebar_label: Flow Builder
---

# Flow Builder

## Overview

The Flow Builder is the visual heart of the Exo-Chatbot platform, providing a powerful no-code interface for designing and automating conversational user journeys. It is a canvas-based tool where you can map out every step of a conversation by creating and connecting nodes. Each node represents a point in the conversation and can contain various elements, such as sending a message, asking the user for information, performing a backend action, or applying conditional logic.

This visual approach allows you to craft everything from simple, single-turn interactions to complex, branching dialogues that can integrate with APIs, query databases, and execute custom code. The Flow Builder is designed to be intuitive, enabling both technical and non-technical users to build, test, and manage sophisticated chatbot logic without writing a single line of code.

Key components of the Flow Builder include:

- **The Canvas** -- An infinite workspace where you arrange and connect your conversation nodes.
- **Nodes** -- The building blocks of a conversation, representing a step or a state in the user's journey.
- **Elements** -- Specific items you add inside a node, categorized as Bot Messages, Prompts, Actions, and Logic.
- **Connectors** -- The lines you draw between nodes to define the flow of the conversation from one step to the next.

## How to Use the Flow Builder

This guide provides a detailed walkthrough of the Flow Builder interface and its core functionalities.

### Accessing the Flow Builder

- **To create a new flow:** Navigate to **Workflow > Flows** and click the **+ Create Flow** button.
- **To edit an existing flow:** From the **Workflow > Flows** page, locate the flow in the table and click the **Edit** (pencil) icon in its Actions column.

### The Flow Builder Interface

- **Top Navigation Bar** -- Contains the Back button, Flow Status (which indicates errors), a Language Switcher for multilingual bots, and the **Preview Bot** button for real-time testing.
- **The Canvas** -- The main workspace where you build your conversation by adding and connecting nodes.
- **Flow Map** -- A mini-map in the bottom-right corner that helps you navigate large, complex flows.

### Building a Conversation

#### 1. Configuring the Intent Trigger (First Node)

Every flow starts with an **Intent Trigger** node. Click it to configure:

- **Flow Name** -- The primary phrase that triggers the conversation (e.g., "Check Order Status").
- **Training Questions** -- Add alternative user phrases (e.g., "track my package").
- **Select Channels & Category** -- Assign the flow to specific channels and an organizational category.

#### 2. Adding Steps (Nodes) to the Flow

Click the **+** icon on an existing node to add a new step. This opens a menu with four categories of elements:

| Category | Purpose | Examples |
|----------|---------|----------|
| **Bot Messages** | Send information to the user | Text, Image, Carousel |
| **Prompts** | Get information from the user (stored in variables) | Text, Quick Replies, Form |
| **Actions** | Perform backend operations | Call API, Query Database, Transfer to Live Chat |
| **Logic** | Control the conversation path | Condition (If/Else), Channel Filter |

#### 3. Connecting Nodes

Drag the circular connector from one node to the next to define the conversation path. Logic nodes (like Condition) will have separate connectors for different outcomes (e.g., If/Else), allowing for branching paths.

#### 4. Managing Nodes and Elements

- Click the **three-dot menu** on a node to **Copy Step**, **Copy Tree** (node + all subsequent nodes), or **Delete Step**.
- Within a node, you can **Edit**, **Delete**, or **Rearrange** the individual elements.

#### 5. Saving and Testing

The builder auto-saves. Use the **Preview Bot** button frequently to test your logic.

## Common Use Cases

### Restaurant Table Reservation

1. **Intent Trigger:** "Book a table"
2. **Prompt (Form):** Ask for Number of guests, Date, and Time. Store these in variables.
3. **Action (API):** Call the reservation system's API with the collected variables.
4. **Logic (Condition):** Check the API response. If successful, send a confirmation message. If not, inform the user the time is unavailable.

### Customer Support Ticket Creation

1. **Intent Trigger:** "I have a problem"
2. **Prompt (Quick Replies):** "What is this regarding? [Billing] [Technical Issue]"
3. **Prompt (Text):** "Please describe your issue." Store the description in a variable.
4. **Action (Database):** Use Insert Entry to save the details to a "Support Tickets" table.

## Best Practices

:::tip
- **Keep Flows Focused** -- Each flow should accomplish one primary goal. Break complex processes into smaller, reusable flows linked with the Execute Flow action.
- **Name Nodes Clearly** -- Descriptive node names (e.g., "Ask for Email," "Check API for Availability") make large flows much easier to understand and debug.
- **Always Build Failure Paths** -- When using an API or Database action, always connect the Failure path to a node that gives the user a helpful message.
- **Use Variables Extensively** -- Store every piece of user input in a variable. This enables personalization and allows you to pass data between steps and to external systems.
:::

## Common Mistakes

:::warning Avoid these pitfalls
- **Creating "Spaghetti" Flows** -- Avoid crossing connector lines all over the canvas. If a flow becomes too messy, it is a sign it should be broken into smaller, more manageable flows.
- **Forgetting to Store Prompt Responses** -- A common error is asking the user a question with a Prompt but forgetting to select a variable to store their answer in.
- **Dangling Nodes** -- Every node should be part of a complete path. A node that is not connected to anything is a dead end and will break the conversation.
- **Not Setting a Default/Else Condition** -- When using a Condition node, always define the Else path to handle any case that does not match your If conditions.
- **Ignoring Asynchronous Behavior** -- API calls can take time. Design your flow with "Please wait" messages where necessary to manage user expectations.
:::

## Related

- [Workflows](./workflows.md)
- [Bot Messages](./bot-messages.md)
- [Bot Prompts](./bot-prompts.md)
- [Actions](./actions.md)
- [Logic](./logic.md)
