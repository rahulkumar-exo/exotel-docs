---
id: analytics-dashboard
title: Analytics Dashboard
description: "Use the Exotel analytics dashboard to track KPIs, visualize call and SMS trends, and monitor business communication performance."
sidebar_label: Analytics Dashboard
sidebar_position: 7
---

# Analytics Dashboard

The analytics dashboard provides a visual, data-driven view of your communication operations. Track key performance indicators (KPIs), identify trends, and make informed decisions based on real-time and historical data.

:::tip
The analytics dashboard is available on Growth and Enterprise plans. Starter plan users have access to basic metrics through [Call Logs](/docs/reporting/call-logs) and the [Real-Time Dashboard](/docs/reporting/real-time-dashboard).
:::

## Accessing the Analytics Dashboard

1. Log in to [my.exotel.com](https://my.exotel.com)
2. Navigate to **Reports** > **Analytics** in the left sidebar
3. Select the date range for your analysis
4. The dashboard loads with all KPI widgets and charts

## Key Performance Indicators (KPIs)

The analytics dashboard displays the following KPIs at the top of the page:

### Voice KPIs

| KPI | Description | How It Is Calculated |
|-----|-------------|---------------------|
| **Total Calls** | Total number of calls in the selected period | Count of all call records |
| **Answered Calls** | Calls that were picked up | Count of calls with status `completed` |
| **Answer Rate** | Percentage of calls answered | (Answered Calls / Total Calls) x 100 |
| **Missed Calls** | Calls that were not answered | Count of calls with status `no-answer` or `busy` |
| **Average Call Duration** | Mean duration of answered calls | Sum of durations / Count of answered calls |
| **Total Talk Time** | Aggregate talk time across all calls | Sum of all call durations |
| **Total Cost** | Total voice spend in the period | Sum of all call costs |

### SMS KPIs

| KPI | Description | How It Is Calculated |
|-----|-------------|---------------------|
| **Total SMS Sent** | Total messages submitted | Count of all SMS records |
| **Delivery Rate** | Percentage of messages delivered | (Delivered / Total Sent) x 100 |
| **Failed SMS** | Messages that failed to deliver | Count of SMS with status `failed` or `rejected` |
| **Total SMS Cost** | Total SMS spend in the period | Sum of all SMS costs |

### Operational KPIs (Contact Center)

| KPI | Description | How It Is Calculated |
|-----|-------------|---------------------|
| **Agent Utilization** | Percentage of time agents are on calls | (Total Talk Time / Total Agent Hours) x 100 |
| **Average Wait Time** | Mean time callers wait before being connected | Sum of wait times / Count of inbound calls |
| **First Call Resolution** | Calls resolved without follow-up | Requires custom tagging or CRM integration |
| **Abandonment Rate** | Callers who hung up before being connected | (Abandoned Calls / Total Inbound) x 100 |

## Visualizations

### Call Volume Trends

The **Call Volume** chart shows daily call counts over the selected period:

- **Line chart**: Total calls, answered calls, and missed calls plotted over time
- **Toggle views**: Switch between daily, weekly, and monthly aggregation
- **Overlay**: Compare the current period with the previous period for trend analysis

### Call Distribution

The **Call Distribution** widget breaks down calls by:

| Dimension | Visualization | Insight |
|-----------|--------------|---------|
| **Direction** | Pie chart | Ratio of inbound vs. outbound calls |
| **Status** | Donut chart | Distribution of call outcomes (answered, missed, busy, failed) |
| **Hour of Day** | Bar chart | Peak calling hours for staffing optimization |
| **Day of Week** | Bar chart | Busiest days for capacity planning |
| **ExoPhone** | Horizontal bar | Call volume per virtual number |

### SMS Delivery Funnel

The **SMS Funnel** visualizes the message delivery pipeline:

```
Submitted → Sent to Carrier → Delivered to Handset
   100%         95%                 89%
```

Each stage shows the count and percentage, helping you identify where messages are dropping off.

### Cost Analysis

The **Cost Analysis** section provides:

- **Daily cost trend line** for voice and SMS
- **Service cost breakdown** pie chart (voice, SMS, WhatsApp, rentals)
- **Month-over-month comparison** bar chart
- **Cost per call / Cost per SMS** trend over time

## Filtering and Segmenting Data

### Global Filters

Apply filters that affect all dashboard widgets:

| Filter | Description |
|--------|-------------|
| **Date Range** | Select a custom range or use presets (Today, Last 7 Days, Last 30 Days, This Month, Last Month) |
| **ExoPhone** | Filter all data to a specific virtual number |
| **Direction** | Show only inbound, outbound, or all calls |
| **Agent** | Filter to a specific agent's activity |

### Segmentation

Drill down into specific dimensions by clicking on any chart element:

1. Click a bar in the "Hour of Day" chart to see calls for that specific hour
2. Click a slice in the "Status Distribution" chart to filter all widgets to that status
3. Use the breadcrumb navigation to return to the full view

## Custom KPI Widgets (Enterprise)

Enterprise plan users can create custom KPI widgets:

### Adding a Custom Widget

1. Click **Customize Dashboard**
2. Click **Add Widget**
3. Configure the widget:

| Setting | Description |
|---------|-------------|
| **Widget Type** | Number, Chart (line/bar/pie), Table |
| **Data Source** | Voice calls, SMS, usage, agent activity |
| **Metric** | Count, sum, average, percentage |
| **Dimension** | Time, status, direction, ExoPhone, agent |
| **Filter** | Additional filters specific to this widget |

4. Position the widget on the dashboard by dragging it
5. Click **Save Dashboard**

### Dashboard Sharing

Share your dashboard configuration with team members:

- **View-only access**: Share a read-only view with stakeholders
- **Edit access**: Allow team members to modify the dashboard layout
- **Scheduled email**: Send a dashboard snapshot via email (see [Scheduled Reports](/docs/reporting/scheduled-reports))

## Exporting Analytics Data

### Export Options

| Method | Description |
|--------|-------------|
| **Screenshot** | Click the camera icon to capture the current dashboard view as an image |
| **PDF Export** | Generate a PDF report of the current dashboard state |
| **CSV Export** | Export the underlying data for any individual widget |
| **API Access** | Use the Exotel API to query analytics data programmatically (Enterprise) |

### Embedding Analytics

Enterprise accounts can embed analytics widgets in external dashboards:

1. Navigate to the widget you want to embed
2. Click the **Share** icon
3. Select **Embed**
4. Copy the embed code (iframe or API endpoint)
5. Paste into your internal dashboard or reporting tool

:::info
Embedded widgets require authentication. Ensure your internal dashboard can handle Exotel API authentication. See [Authentication Reference](/docs/references/authentication).
:::

## Best Practices

1. **Set up a daily review cadence** -- Check the analytics dashboard every morning for anomalies
2. **Compare periods** -- Always compare the current period with the previous period to spot trends
3. **Focus on actionable KPIs** -- Track metrics you can act on (answer rate, average wait time) rather than vanity metrics
4. **Set KPI targets** -- Define targets for key metrics and monitor progress
5. **Combine with custom reports** -- Use the dashboard for visual insights and [Custom Reports](/docs/reporting/custom-reports) for detailed data analysis
6. **Share with stakeholders** -- Use scheduled dashboard snapshots to keep leadership informed

## Related Topics

- [Real-Time Dashboard](/docs/reporting/real-time-dashboard) -- Live call monitoring and agent status
- [Call Logs](/docs/reporting/call-logs) -- Detailed individual call records
- [Custom Reports](/docs/reporting/custom-reports) -- Build tailored reports with advanced filters
- [Scheduled Reports](/docs/reporting/scheduled-reports) -- Automate report delivery
