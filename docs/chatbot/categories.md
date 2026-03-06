---
title: Categories
description: Organize your Exo-Chatbot conversation flows into logical groups using Categories for easier management, filtering, and team collaboration.
sidebar_label: Categories
---

# Categories

## Overview

The Categories feature is an organizational tool within the Exo-Chatbot platform designed to help you manage and structure your conversation flows (intents). As a chatbot grows in complexity with dozens or even hundreds of flows, it can become difficult to locate and manage specific user journeys. Categories allow you to group related flows into logical, user-defined buckets.

For example, you could create categories for "Sales Queries," "Technical Support," "Account Management," and "General FAQs." By assigning each flow to a relevant category, you create a clean, organized, and easily navigable structure. This makes the bot development process more efficient, especially for teams, as it allows builders to quickly find and work on flows related to a specific business function.

Key capabilities of the Categories module include:

- **Creation and Management** -- Add, rename, and manage a list of custom categories tailored to your business needs.
- **Flow Assignment** -- Assign any flow to a specific category directly from the Flow Builder.
- **Filtering** -- Use the category filter on the main "Flows" page to instantly view only the flows belonging to a specific group.

## How to Use Categories

This guide explains how to create categories and how to assign your conversation flows to them.

### Creating a Category

1. From the main console menu, navigate to **Workflow > Categories**.
2. On this page, you will see a list of all existing categories. To add a new one, click the **Add Category** button.
3. Enter a name for your new category (e.g., `Account Support`) and save it.
4. You can also search for existing categories using the search bar on this page.

### Assigning a Flow to a Category

The primary way to use categories is by assigning them to your flows.

1. Navigate to the Flow Builder by either creating a **+ Create Flow** or editing an existing one from the main Flows page.
2. Click on the first node in your flow, the **Intent Trigger** node, to open its configuration panel.
3. Locate the **Select Category** dropdown field.
4. Choose the desired category from the list. If you have not created any, the default will be "Others."
5. Save the changes to the node.

### Filtering Flows by Category

1. Go to the main flow management page by navigating to **Workflow > Flows**.
2. Click on the **Filter** button located above the table of flows.
3. In the filter options, select the **Category** dropdown and choose the category you wish to view.
4. Click **Apply**. The table will now only display the flows assigned to that specific category.

## Common Use Cases

- **Organizing by Department** -- For a large enterprise bot, create categories like HR, IT Support, Finance, and Facilities to separate departmental queries.
- **Structuring by Product Line** -- An e-commerce bot could have categories for Electronics, Apparel, Home Goods, and Customer Service.
- **Grouping by User Intent** -- A banking bot could be organized into categories such as Check Balance, Fund Transfer, Loan Application, and Report Fraud.
- **Internal vs. External Flows** -- Use categories to distinguish between flows designed for internal employees (e.g., Employee Onboarding) and those for external customers (e.g., Product Inquiry).

## Best Practices

:::tip
- **Establish a Naming Convention** -- Keep category names clear, concise, and consistent. This makes it easier for all team members to understand the structure.
- **Do Not Over-Categorize** -- While useful, having too many categories can be as confusing as having none. Aim for a balanced structure that logically groups your flows without being overly granular.
- **Use a "General" Category Wisely** -- It is okay to have a general or "Others" category, but review it periodically to see if new, more specific categories should be created from the flows within it.
- **Assign Categories Immediately** -- Make it a habit to assign a category as soon as you create a new flow. This prevents a build-up of uncategorized flows that need to be sorted later.
:::

## Common Mistakes

:::warning Avoid these pitfalls
- **Inconsistent Categorization** -- Two developers might create similar flows but assign them to different categories (e.g., putting a "password reset" flow in IT Support while another is in Account Management). This defeats the purpose of organization.
- **Creating Duplicate Categories** -- Forgetting to check if a category already exists and creating a new one with a similar name (e.g., having both "Sales" and "Sales Inquiries").
- **Leaving Everything in "Others"** -- The most common mistake is neglecting to categorize flows at all, leading to a large, unmanageable list in the default "Others" category.
- **Using Categories for Flow Logic** -- Categories are purely for organizational purposes within the console. They have no impact on the bot's runtime behavior or how a user interacts with it. Do not expect filtering by category to change how the bot works for the end-user.
:::

## Related

- [Workflows](./workflows.md)
- [Flow Builder](./flow-builder.md)
- [Analytics](./analytics.md)
