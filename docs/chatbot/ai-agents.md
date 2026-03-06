---
title: AI Agents
description: Track GenAI Bot Mandate node performance with node-level analytics and category mapping in the Exo-Chatbot platform for a complete view of bot performance.
sidebar_label: AI Agents
---

# AI Agents (Bot Mandate Node Analytics)

## Overview

This feature introduces **node-level visibility** and **category mapping** for GenAI (Bot Mandate) nodes in Chatbot Analytics.

With this feature:

- Each **Bot Mandate Subgoal** is tracked individually under Most Frequent Questions, Least Frequent Questions, and Unanswered Frequent Questions.
- **Category Mapping** ensures Bot Mandate nodes appear in Category-wise Usage charts, alongside Workflow (NLP) nodes.
- Businesses gain a **complete view of bot performance** across both Workflow and GenAI nodes.

## How to Use This Feature

### Creating or Editing AI Agent Nodes

1. Log in to your Chatbot console and select the Bot where Gen AI is enabled.
2. Navigate to **Flow Builder**, then go to **AI Agents** from the left-hand navigation bar.
3. **Create a Subgoal node**.
4. Enter a **Node Name** (mandatory) -- This will appear in Analytics.
5. Select a **Category** (mandatory):
   - Choose from the dropdown list of existing categories, or
   - Create a new category on the go.
   - If unsure, select **"Others."**
6. Add the **Objective** to the Subgoal of that node.
7. Click **Save**.

:::warning Important
The system will not allow saving if the Node Name or Category is missing. Both fields are mandatory.
:::

### Viewing Analytics

#### Node-Level Analytics

1. Go to **Chatbot Analytics > Questions Section**.
2. You can now view **Most Answered**, **Least Answered**, and **Unanswered Questions**.
3. Counts for **all nodes** (Workflow + GenAI) are displayed, with Bot Mandate nodes tracked individually.

#### Category-wise Usage

1. Navigate to **Chatbot Analytics > Category-wise Usage**.
2. View combined counts of Workflow + GenAI queries, broken down by categories.
3. Uncategorized nodes are automatically grouped under **"Others."**

## Best Practices

:::tip
- **Use clear, descriptive names for Nodes** -- This makes analytics easier to interpret.
- **Always assign a Category** -- It is a mandatory field. If unsure, use "Others."
- **Regularly review analytics** -- Optimize prompts and improve GenAI accuracy based on data.
- **Compare Workflows vs Bot Mandate performance** -- Use this data to guide the transition toward GenAI-first bot design.
:::

## Related

- [Analytics Overview](./analytics.md)
- [Combined Analytics](./combined-analytics.md)
- [Flow Builder](./flow-builder.md)
- [Categories](./categories.md)
