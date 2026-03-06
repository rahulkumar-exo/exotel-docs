---
title: Combined Analytics
description: Monitor chatbot KPIs, session data, user behavior, and content effectiveness with the Combined Analytics dashboard in the Exo-Chatbot platform.
sidebar_label: Combined Analytics
---

# Combined Analytics

## Overview

The Combined Analytics module is a comprehensive dashboard that provides a 360-degree view of your chatbot's performance, user engagement, and overall effectiveness. It serves as the central hub for data-driven insights, allowing administrators to move beyond anecdotal evidence and make informed decisions based on quantitative metrics. The dashboard visualizes key data points through a series of interactive cards and graphs, covering everything from high-level user traffic to the granular performance of individual intents.

This feature is critical for understanding how users are interacting with your bot, identifying areas of success, and pinpointing opportunities for improvement.

Key capabilities include:

- **Performance KPIs** -- At-a-glance metrics for Customer Satisfaction (CSAT), total queries, and user interactions.
- **Session and Message Analysis** -- Detailed breakdowns of session duration, messages per session, and the ratio of answered to unanswered queries.
- **User Behavior Insights** -- Analytics on user traffic sources, channel usage, device types (mobile vs. desktop), and hour-wise traffic patterns.
- **Content Effectiveness** -- Reports on the most and least frequent questions, category-wise usage, and intuitive query performance to understand what content is resonating with users.
- **Flow Analysis** -- A visual, intent-wise chat flow diagram to trace user journeys and identify drop-off points within conversations.

## How to Use Combined Analytics

This guide explains how to navigate and interpret the data presented in the Bot Analytics dashboard.

### Navigating to the Analytics Dashboard

1. From the main console menu, select **Analytics**.
2. You will land on the main Combined Analytics dashboard, which provides a comprehensive overview.

### Using Global Filters

At the top of the dashboard, you can use global filters to refine the data you are viewing:

- **Filter by Date** -- Select a specific date range to analyze performance during that period.
- **Filter by Channel** -- Narrow down the analytics to a specific channel (e.g., Web, WhatsApp) to see how it performs in isolation.
- **Filter by Language** -- View metrics for a specific language to understand the performance for different linguistic user groups.

### Understanding the Analytics Cards

The dashboard is composed of several key cards, each displaying specific information:

#### Top-Level KPIs

- **CSAT Score** -- Shows the overall customer satisfaction rating based on user feedback.
- **Queries Answered/Asked Today** -- A real-time count of bot-user interactions for the current day.
- **Users Interacted Today** -- The number of unique users who have engaged with the bot today.

#### Message Analytics Graph

A visual representation of total messages over time, broken down into answered, unanswered, and projected messages. This helps you spot trends in conversation volume.

#### Session Analytics

Provides metrics like:
- Average number of messages per session
- Average session duration
- Percentage of likes (positive intent-level feedback)

#### Hour-wise Analytics

A graph showing the busiest times of day for bot interactions, helping you identify peak usage hours.

#### Device-specific Analytics

A breakdown of users and queries based on whether they are using a mobile or desktop device.

#### Most/Least Frequent Questions

Lists the top intents being triggered, helping you understand what your users are most interested in.

#### Unanswered Questions

A critical list of queries the bot could not understand, highlighting immediate opportunities for content creation.

:::note
Regularly reviewing the Unanswered Questions card is one of the most effective ways to continuously improve your bot's coverage and helpfulness.
:::

#### Word Cloud

An immediate visual representation of the most frequently used words and phrases in user queries. The larger the word, the more often it has been used.

#### Category Wise Usage

A donut chart providing a high-level breakdown of bot conversations by their assigned business function or category.

#### Intuitive Questions

Lists user queries that were not a perfect match for an existing intent but were successfully understood by the bot's AI. It highlights where the bot is effectively "connecting the dots" and identifies opportunities to add new training phrases for more direct recognition.

#### Intent-wise Chartflow

Quantifies how often each specific conversational flow or "intent" is being triggered. It helps you identify the most popular and valuable automated processes your bot is handling.

#### Most Frequent Questions (Category Wise)

Ranks the most popular intents or questions asked by users. Provides a clear, data-driven view of what your users are most interested in, helping you prioritize improvements and new feature development.

#### Intent-wise Chat Flow

A visual diagram showing how users navigate from one intent to another, helping you analyze user journeys.

## Common Use Cases

- **Identifying Peak Hours for Support** -- A support manager reviews the Hour-wise Analytics card and discovers that bot traffic peaks between 2 PM and 4 PM. They use this data to ensure live agents are available during these hours to handle escalations.
- **Improving Bot Knowledge** -- An administrator regularly reviews the Unanswered Questions card. They notice many users are asking about "return policy," an intent that does not exist. They create a new flow to address this, directly improving the bot's helpfulness.
- **Optimizing User Journeys** -- A product manager analyzes the Intent-wise chat flow for the "Account Opening" process and sees a significant drop-off at the "Upload Documents" step. They investigate and simplify that step in the Flow Builder to improve the completion rate.
- **Measuring Channel Performance** -- After launching on WhatsApp, a marketing team uses the Channel Usage filter to compare the volume of conversations and user satisfaction on WhatsApp versus the Web channel.

## Best Practices

:::tip
- **Review the Dashboard Daily** -- Make it a habit to check the top-level KPIs (CSAT, Queries Answered, Users Interacted) every morning. This helps you catch anomalies early before they impact a large number of users.
- **Prioritize Unanswered Questions** -- The Unanswered Questions card is the most actionable insight on the dashboard. Schedule a weekly session to review the top unanswered queries and create new flows or add training phrases to address them.
- **Use Hour-wise Analytics to Plan Agent Coverage** -- If you have LiveChat enabled, use the Hour-wise Analytics graph to identify peak interaction times. Schedule human agents to be available during these windows to minimize wait times.
- **Compare Channels Regularly** -- Use the Channel filter to compare performance across Web, WhatsApp, and other platforms. Different channels may require different conversation designs or message formats.
- **Track Intuitive Questions** -- The Intuitive Questions card reveals queries the bot handled correctly even without an exact match. Use this data to add those phrases as training questions, turning "intuitive" matches into confident, direct matches.
- **Export Data for Stakeholder Reports** -- Use the date range filter and export features to generate reports for management or clients that demonstrate the bot's impact over time.
:::

## Common Mistakes

:::warning Avoid these pitfalls
- **Ignoring the Unanswered Questions Card** -- This is the most common oversight. A growing list of unanswered queries directly correlates with declining user satisfaction. Treat every unanswered query as an opportunity to improve the bot.
- **Relying Only on Total Query Volume** -- A high number of queries does not mean the bot is performing well. Always correlate volume with quality metrics like the ratio of answered to unanswered queries and the CSAT score.
- **Not Using Date Filters** -- Viewing all-time analytics can mask recent trends. A sudden increase in unanswered queries over the past week will be hidden if you are looking at three months of aggregated data. Always set an appropriate date range.
- **Overlooking Device-Specific Analytics** -- If a significant portion of your users are on mobile, but you have only tested and optimized the bot for desktop, you may be missing device-specific usability issues.
- **Confusing Intent-wise Chartflow with Conversion Data** -- The Intent-wise Chartflow shows how often intents are triggered, not whether users completed their goals. For completion tracking, use [Conversion Analytics](./conversion-analytics.md).
- **Not Acting on Word Cloud Insights** -- The Word Cloud reveals the language your users actually use. If you see unexpected terms appearing frequently, it may indicate a mismatch between your training phrases and real user vocabulary.
:::

## Related

- [Analytics Overview](./analytics.md)
- [Conversion Analytics](./conversion-analytics.md)
- [Download Reports](./download-reports.md)
- [AI Agents](./ai-agents.md)
- [Workflows](./workflows.md)
