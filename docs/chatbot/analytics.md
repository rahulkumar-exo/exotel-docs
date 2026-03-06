---
title: Analytics
description: Understand and measure your Exo-Chatbot performance with the Analytics module. Access combined dashboards, conversion tracking, and downloadable reports.
sidebar_label: Analytics
---

# Analytics

## Overview

The Analytics module is the central hub for understanding and measuring your chatbot's performance, user engagement, and overall effectiveness. It provides a comprehensive suite of dashboards, graphs, and reports that transform raw interaction data into actionable insights. This module is essential for identifying areas of improvement, proving the bot's ROI, and making data-driven decisions to enhance the user experience.

The Analytics module is broadly divided into three main sections, each serving a distinct analytical purpose:

- **Combined Analytics** -- The main dashboard that provides a high-level, real-time overview of the bot's health. It includes key performance indicators (KPIs) like Customer Satisfaction (CSAT), total queries, user counts, session details, and channel usage. It is designed for quick, daily health checks.
- **Conversion Analytics** -- This section offers a deeper dive into specific user journeys and goal-oriented interactions. It focuses on tracking the success rates of multi-step flows (e.g., lead generation, appointment booking), analyzing where users drop off, and measuring the effectiveness of features like LiveChat transfers and welcome banners.
- **Download Reports** -- A utility section that allows you to export user-submitted form data as CSV or Excel files for offline processing, lead management, and back-office workflows.

By leveraging all three sections, you can move from a broad understanding of "how the bot is doing" to a specific analysis of "why users are succeeding or failing" in key processes, and then extract the underlying data for external tools and teams.

## Analytics Sections

| Section | Purpose | Key Metrics | Details |
|---------|---------|-------------|---------|
| [Combined Analytics](./combined-analytics.md) | High-level performance overview | CSAT, session data, user behavior, content effectiveness, word cloud | KPIs, session and message trends, hour-wise traffic, device breakdown |
| [Conversion Analytics](./conversion-analytics.md) | Goal-oriented journey tracking | Flow completion rates, drop-off points, LiveChat metrics, banner CTR | Funnel analysis, step-level drop-off identification |
| [Download Reports](./download-reports.md) | Export form submission data | Form submissions, user-collected data, date-filtered exports | CSV/Excel exports for offline processing and lead management |

## How to Access Analytics

### Navigating to the Analytics Module

1. Log in to the Exo-Chatbot console.
2. From the main navigation panel on the left, click on **Analytics**.
3. You will land on the **Combined Analytics** dashboard by default, which provides the broadest overview.
4. Use the sub-navigation or tabs at the top to switch between **Combined Analytics**, **Conversion Analytics**, and **Download Reports**.

### Using Global Filters

All analytics sections share a common set of global filters at the top of the page:

| Filter | Description |
|--------|-------------|
| **Date Range** | Select a specific start and end date to analyze performance during that period. Common presets include Today, Last 7 Days, Last 30 Days, and Custom Range. |
| **Channel** | Narrow down analytics to a specific deployment channel (e.g., Web, WhatsApp, Facebook Messenger, All Channels). |
| **Language** | View metrics for a specific language to understand performance across different linguistic user groups. |

### Understanding Key Metrics

Here is a quick reference for the most important metrics you will encounter across the analytics sections:

| Metric | Definition | Found In |
|--------|-----------|----------|
| **CSAT Score** | Average customer satisfaction rating based on post-conversation surveys | Combined Analytics |
| **Total Queries** | Total number of user messages processed by the bot | Combined Analytics |
| **Answered Queries** | Queries the bot successfully matched to an intent and responded to | Combined Analytics |
| **Unanswered Queries** | Queries the bot could not understand or match to any intent | Combined Analytics |
| **Unique Users** | Number of distinct users who interacted with the bot in the selected period | Combined Analytics |
| **Avg Session Duration** | Average time from when a user starts a conversation to when it ends | Combined Analytics |
| **Flow Completion Rate** | Percentage of users who started and successfully finished a multi-step flow | Conversion Analytics |
| **Drop-off Rate** | Percentage of users who abandoned a flow before completing it | Conversion Analytics |
| **Agent Connect Rate** | Percentage of LiveChat transfer requests that resulted in a successful agent connection | Conversion Analytics |

## Recommended Analytics Workflow

For teams new to the Analytics module, the following workflow provides a structured approach to monitoring and improving your chatbot:

1. **Daily Check** -- Open Combined Analytics each morning. Review the top-level KPIs (CSAT, queries answered today, users interacted today) for any anomalies.
2. **Weekly Review** -- Once a week, review the Unanswered Questions list and the Least Frequent Questions. Create new flows or add training phrases to address gaps.
3. **Monthly Deep Dive** -- Each month, open Conversion Analytics and review the Flow Completion Rate for your most important flows. Investigate drop-off points and make targeted improvements in the Flow Builder.
4. **Ongoing Exports** -- Use Download Reports to extract form submission data on whatever cadence your business requires (daily for sales leads, weekly for surveys, etc.).

## Best Practices

:::tip
- **Establish Baseline Metrics** -- Before making changes to your bot, record the current values for key metrics (CSAT, completion rate, unanswered query percentage). This gives you a baseline to measure the impact of your improvements.
- **Monitor Unanswered Queries Regularly** -- The Unanswered Questions card in Combined Analytics is one of the most actionable data points. Reviewing it weekly and creating new flows for frequently asked but unrecognized queries is the fastest way to improve your bot.
- **Use Date Comparisons** -- When analyzing trends, compare the same date range across consecutive periods (e.g., this week vs. last week) to identify whether metrics are improving or declining.
- **Filter by Channel for Channel-Specific Insights** -- A bot may perform well on Web but poorly on WhatsApp due to message format differences. Always review per-channel analytics after launching on a new platform.
- **Set Up Scheduled Email Reports** -- Use the email reporting feature in Settings to have daily or weekly analytics summaries delivered automatically to stakeholders, so no one has to remember to check the dashboard manually.
- **Combine Quantitative and Qualitative Data** -- Use analytics for the numbers and Message History for the qualitative context. If you see a drop-off, read the actual conversations at that step to understand why.
:::

## Common Mistakes

:::warning Avoid these pitfalls
- **Checking Analytics Only After Problems Arise** -- Analytics is most valuable as a proactive tool. By the time users complain, the problem has already been affecting many conversations. Build a regular review cadence.
- **Ignoring Unanswered Queries** -- A growing list of unanswered queries means your bot is failing users. If left unchecked, this leads to poor CSAT scores and increased LiveChat escalations.
- **Focusing Only on Volume Metrics** -- A high number of total queries does not mean the bot is performing well. Always pair volume metrics with quality metrics like CSAT, completion rate, and unanswered query percentage.
- **Not Filtering by Date Range** -- Looking at all-time data can mask recent trends. A drop in completion rate over the last week will be invisible if you are viewing 6 months of aggregated data.
- **Confusing Correlation with Causation** -- A spike in queries might coincide with a new marketing campaign, not a change you made to the bot. Consider external factors when interpreting analytics.
- **Forgetting to Track GenAI Nodes** -- If you are using AI Agent (Bot Mandate) nodes, ensure they are named and categorized so they appear in analytics. Unnamed or uncategorized nodes create blind spots in your data.
:::

## Related

- [Combined Analytics](./combined-analytics.md)
- [Conversion Analytics](./conversion-analytics.md)
- [Download Reports](./download-reports.md)
- [AI Agents](./ai-agents.md)
- [Settings](./settings.md)
