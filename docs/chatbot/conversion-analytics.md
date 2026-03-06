---
title: Conversion Analytics
description: Track flow completion rates, user drop-off points, LiveChat handoff metrics, and welcome banner performance in the Exo-Chatbot Conversion Analytics dashboard.
sidebar_label: Conversion Analytics
---

# Conversion Analytics

## Overview

The Conversion Analytics module provides a deep dive into goal-oriented user journeys and specific, high-value interactions within your chatbot. While the main Analytics dashboard offers a broad overview of the bot's health, Conversion Analytics focuses on measuring the success and failure of key business processes that you have automated. It helps you answer critical questions like, "How many users who started the loan application process actually completed it?" or "Where exactly in the sales funnel are users dropping off?"

This module is designed to track and report on multi-step flows, helping you understand user behavior, identify friction points, and optimize your conversations for better outcomes. It provides granular data on flow completion rates, user drop-offs, the effectiveness of live chat transfers, and the performance of promotional elements like welcome banners.

Key components of Conversion Analytics include:

- **Flow Completion Rate** -- Tracks the number of users who start and successfully finish a specific multi-step conversation.
- **Customer Drop-Off Analytics** -- Pinpoints the exact step or intent where users are most likely to abandon a flow.
- **LiveChat Analytics** -- Measures the performance of your human agent handoff process.
- **Intent Analytics** -- Shows the frequency and usage of individual intents.
- **Welcome Banner Analytics** -- Tracks the click-through rates and effectiveness of promotional banners.

## How to Use Conversion Analytics

This guide explains how to access and interpret the data within the Conversion Analytics dashboard to optimize your key chatbot funnels.

### Navigating to Conversion Analytics

1. From the main console menu, click on **Analyse and Improve**.
2. Select **Conversion Analytics** from the sub-menu.
3. Use the filters at the top of the page to narrow down the data by **Date Range** and **Channel**. The data can also be exported.

### Analyzing the Reports

#### Flow Completion Rate

This table is the most critical for measuring the success of multi-step processes. It displays each flow's name, the number of times it was **Started**, the number of times it was successfully **Ended**, and the resulting completion percentage. A low percentage here indicates a problem with the flow's design or logic.

#### Customer Drop-Off Analytics

This report helps you understand why the completion rate might be low. It shows the **Child Intent** (the specific step) and the **Main Intent** (the overall flow) where users most frequently abandon the conversation. It includes the frequency of drop-offs and the drop-off percentage, allowing you to quickly identify problematic steps.

#### Live Chat Analytics

If your bot transfers users to human agents, this table tracks the entire funnel. It shows how many times the "Chat with an expert" flow was initiated, how many times a formal **Request was Raised**, and the final **Agent Connect Count**.

#### Welcome Banner Click Rate

This report measures the performance of your welcome banners. You can see a preview of each banner image, its redirection URL or triggered intent, and the number of **User Clicks** and click-through percentage it received.

## Common Use Cases

- **Optimizing a Sales Funnel** -- You notice in the Flow Completion Rate report that your "Product Purchase" flow has only a 20% completion rate. You then check Customer Drop-Off Analytics and discover that 70% of users are abandoning the flow at the "Enter Shipping Details" step. This insight allows you to investigate and simplify that specific part of the conversation.
- **Improving Agent Handoff** -- The Live Chat Analytics report shows that while "Chat with an expert" is triggered 100 times a day, only 30 requests are raised. This suggests that the pre-transfer form or questions are too complex, and you can streamline them to increase successful handoffs.
- **A/B Testing Welcome Banners** -- You create two different welcome banners for a new promotion. By monitoring the Welcome Banner Click Rate, you can determine which image and call-to-action is more effective at driving user engagement.

## Configuration Options

### Setting Up Flow Tracking

For flows to appear in the Flow Completion Rate report, they must meet the following criteria:

| Requirement | Description |
|-------------|-------------|
| **Complete Flow Path** | The flow must have a clearly defined start node (Intent Trigger) and at least one end node that the bot reaches upon successful completion |
| **No Dangling Nodes** | All paths in the flow must terminate at a connected node. Unconnected nodes will not register completions |
| **Published Status** | Only published flows generate analytics data. Draft or unpublished flows are not tracked |

### Date Range and Export

| Feature | Description |
|---------|-------------|
| **Date Range Filter** | Select a start and end date to view conversion data for a specific period |
| **Channel Filter** | View conversion metrics for a specific channel (Web, WhatsApp, etc.) |
| **Export** | Download the current view as a CSV file for offline analysis or sharing with stakeholders |

## Best Practices

:::tip
- **Focus on High-Value Flows First** -- Prioritize analyzing flows that directly impact revenue or customer satisfaction, such as purchase flows, lead generation forms, or appointment bookings. Improving completion rates on these flows has the highest business impact.
- **Set Completion Rate Targets** -- Establish target completion rates for your most important flows (e.g., 70% for lead generation, 80% for FAQs). Track progress against these targets weekly to ensure continuous improvement.
- **Investigate Drop-Offs Immediately** -- When you see a step with a high drop-off percentage, open the Flow Builder and review that specific node. Common causes include confusing prompts, too many required fields, or slow API calls.
- **Use Drop-Off Data to Simplify Flows** -- If users consistently abandon a flow at a particular step, consider whether that step is necessary, whether it can be simplified, or whether it should be moved later in the flow.
- **Monitor LiveChat Analytics for Staffing** -- Use the Agent Connect Count and conversion funnel to ensure you have enough agents available. If many transfer requests are raised but few agents connect, users are waiting too long.
- **A/B Test Welcome Banners** -- Create multiple banner variants with different images and calls to action. Use the Welcome Banner Click Rate to determine which version drives the most engagement, then keep the winner.
- **Compare Conversion Rates Across Channels** -- A flow may have a high completion rate on Web but a low rate on WhatsApp. This could indicate that certain UI elements (carousels, forms) are not rendering well on specific channels.
:::

## Common Mistakes

:::warning Avoid these pitfalls
- **Ignoring Low Completion Rates** -- A flow with a 15% completion rate means 85% of users who started it did not achieve their goal. This is a significant problem that demands immediate investigation, not a metric to overlook.
- **Blaming Users for Drop-Offs** -- When users abandon a flow, the issue is almost always with the flow design, not the user. Complex forms, confusing language, ambiguous prompts, or unnecessary steps are the typical culprits.
- **Not Connecting Completion Data to Business Outcomes** -- Conversion Analytics is most powerful when tied to real business results. Track how improvements in flow completion rates correlate with increases in leads captured, tickets resolved, or sales completed.
- **Overlooking the Pre-Transfer Steps in LiveChat** -- If LiveChat Analytics shows a low request-to-connect ratio, the problem may not be agent availability. It could be that the pre-transfer information-gathering steps are too complex, causing users to abandon before the transfer even happens.
- **Comparing Flows Without Context** -- A 50% completion rate for a 10-step loan application flow is very different from a 50% rate for a 2-step FAQ flow. Consider the complexity and length of the flow when setting expectations.
- **Not Reviewing Banner Analytics** -- Welcome banners take up prime screen real estate. If a banner has a very low click-through rate, it is wasting that space. Either improve the banner or remove it and let the conversation begin immediately.
:::

## Related

- [Analytics Overview](./analytics.md)
- [Combined Analytics](./combined-analytics.md)
- [Download Reports](./download-reports.md)
- [Flow Builder](./flow-builder.md)
- [Actions](./actions.md)
