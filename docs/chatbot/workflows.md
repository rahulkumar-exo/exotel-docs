---
title: Workflows
description: Manage all conversation flows from the central Workflows dashboard in the Exo-Chatbot platform. Create, edit, organize, and monitor your chatbot flows.
sidebar_label: Workflows
---

# Workflows

## Overview

The Flows page is the central dashboard and command center within the Workflow module of the Exo-Chatbot platform. It serves as the primary interface for managing all the individual conversational paths, or "flows," that make up your chatbot's intelligence. A flow can be anything from a simple, single-answer FAQ to a complex, multi-step user journey.

From this page, you can create new flows, edit existing ones, organize them into categories, and get a high-level view of their status. The page is designed to give you a complete picture of your bot's conversational architecture and provide all the tools needed for its management.

The page features a main table listing all your flows and is surrounded by a suite of powerful tools accessible via buttons and tabs, including the Flow Builder, Database management, API integration, and more.

## How to Use Workflow

This guide explains the functionalities available on the Flows page, which acts as the starting point for most bot-building activities.

### Navigating to the Flows Page

1. Log in to the Exo-Chatbot console.
2. On the main navigation menu on the left, click on **Workflow**. You will land on the **Flows** tab by default.

### The Flow Manager Dashboard

The main part of the page is the Flow Manager, which contains the list of all your flows and the tools to manage them.

**The Flows Table** provides an at-a-glance summary of every flow in your bot:

| Column | Description |
|--------|-------------|
| **Name** | The unique name of the flow, which is often used to trigger it |
| **Category** | The category the flow belongs to (e.g., "FAQ," "Service Request") |
| **Last Edited On** | The date and time the flow was last modified |
| **Flow Type** | Specifies how the flow was created (e.g., "Flow," "FAQ") |
| **Status** | A critical indicator of the flow's health |
| **Actions** | A menu (...) with options to Edit, Delete, or Duplicate the flow |

The **Status** column can show:
- **Ready to Go** -- The flow is complete and operational.
- **Needs Attention** -- The flow is incomplete or has an error that needs to be fixed.

### Core Actions and Buttons

- **Create Flow** -- The primary button that launches the Flow Builder, where you can design a new conversational journey from scratch.
- **Configure Messages** -- Allows you to set the global default messages for the bot, including the initial Welcome Message and the Failure Message (shown when the bot does not understand a query).
- **Filter and Search** -- Use the Filter dropdown to sort flows by Status or Category, and use the Search bar to find a specific flow by name.
- **Import / Export** -- These buttons allow you to export your bot's flows for backup or migration, and import them into another bot.
- **Delete Flow** -- Allows you to delete one or more selected flows in bulk.

### Navigating to Other Workflow Tools

The tabs at the top of the page provide direct access to other critical parts of the Workflow module:

- **Database** -- Create and manage tables for storing user data.
- **APIs** -- Integrate with external systems.
- **Functions** -- Write custom Python code.
- **GenAI / Self Learning / Bot Testing** -- Advanced AI capabilities and quality assurance.

### The Main Navigation Panel

The panel on the left side of the screen is your primary navigation hub for the entire platform:

- **Workflow** -- Contains all the tools for building your bot's conversational logic.
- **Integrations** -- Manage and configure connections to various channels like Web, WhatsApp, and Facebook.
- **Campaign** -- Create and manage outbound messaging campaigns.
- **Analytics** -- Access detailed reports and dashboards on your bot's performance and user interactions.
- **Users** -- Manage user accounts, roles, and permissions for the console.
- **Settings** -- Configure global settings for your bot, including its name, security options, and enabling major features.
- **Message History** -- View and search detailed conversation logs.
- **Document** -- Access API documentation and support guides.
- **Collapse** -- Minimize the navigation panel to expand your workspace.

## Common Use Cases

- **Finding and Fixing Broken Flows** -- Use the Filter to show only flows with the status "Needs Attention." Click the Edit button on each one to go into the Flow Builder and resolve the errors.
- **Organizing a New Bot** -- Create different categories like "Sales Queries" and "Support Issues," then assign each new flow to the appropriate category to keep the list organized.
- **Creating a New Lead Generation Flow** -- Click **+ Create Flow**, which takes you to the Flow Builder to design a conversation that asks for the user's name, email, and phone number.
- **Updating the Welcome Message** -- Click **Configure Messages** and edit the text in the Welcome Message section.

## Best Practices

:::tip
- **Use Clear Naming Conventions** -- Give your flows descriptive names (e.g., `check_order_status` instead of `flow_123`) so you can easily identify them in the list.
- **Categorize Everything** -- As your bot grows, having dozens or hundreds of uncategorized flows becomes unmanageable. Use categories from the beginning.
- **Regularly Monitor Flow Status** -- Periodically check the Flows page for any flows that "Need Attention" and fix them promptly to ensure a good user experience.
- **Use the "Duplicate" Action for Templates** -- If you need to create several similar flows, build one complete flow and then use the Duplicate action to create copies that you can modify slightly.
:::

## Common Mistakes

:::warning Avoid these pitfalls
- **Ignoring "Needs Attention" Status** -- Letting flows with errors remain broken leads to dead ends and user frustration.
- **Not Using Categories** -- Having a single, long, uncategorized list of flows makes it very difficult to find and manage specific conversations as the bot scales.
- **Poor Naming** -- Using vague or temporary names for flows makes it hard for you or your teammates to understand what each flow does later on.
- **Forgetting to Set a Welcome Message** -- Not using the Configure Messages button results in a generic or missing greeting for users.
:::

## Related

- [Chatbot Platform Overview](./overview.md)
- [Flow Builder](./flow-builder.md)
- [Categories](./categories.md)
- [Bot Messages](./bot-messages.md)
- [Bot Prompts](./bot-prompts.md)
- [Actions](./actions.md)
