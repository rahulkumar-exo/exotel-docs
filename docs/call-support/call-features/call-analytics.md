---
id: call-analytics
title: Call Analytics
description: "Monitor call performance with Exotel's analytics dashboards, KPIs, custom reports, and data export for business insights."
sidebar_label: Call Analytics
sidebar_position: 14
---

# Call Analytics

Exotel's call analytics provide real-time and historical insights into your call operations. Track key performance indicators (KPIs), monitor agent productivity, identify trends, and make data-driven decisions to improve customer experience.

## Accessing Call Analytics

### Via Dashboard

1. Log in to the [Exotel Dashboard](https://my.exotel.com).
2. Navigate to **Analytics** or **Reports** in the left sidebar.
3. Select the date range and filters.
4. View charts, tables, and summary metrics.

### Via API

Use the [Call Details API](/docs/voice-v1/api-reference/call-details) or [Call Logs API](/docs/voice-v1/overview) to fetch call data programmatically for custom reporting and integration with your BI tools.

## Key Metrics and KPIs

### Call Volume Metrics

| Metric | Description | Why It Matters |
|---|---|---|
| **Total calls** | Total number of incoming and outgoing calls | Measures overall call traffic |
| **Incoming calls** | Calls received on your ExoPhones | Tracks customer demand |
| **Outgoing calls** | Calls initiated by your team or API | Tracks outreach activity |
| **Missed calls** | Calls where no agent answered | Identifies lost opportunities |
| **Abandoned calls** | Calls where the caller hung up before connecting | Indicates long wait times |
| **Calls per hour/day** | Call volume distribution over time | Helps with staffing decisions |

### Call Quality Metrics

| Metric | Description | Target |
|---|---|---|
| **Answer rate** | Percentage of calls answered by agents | Above 90% |
| **Average handle time (AHT)** | Average duration of a connected call | Depends on use case |
| **Average ring time** | Average time before an agent answers | Under 15 seconds |
| **First call resolution (FCR)** | Percentage of issues resolved in one call | Above 70% |
| **Call transfer rate** | Percentage of calls transferred to another agent/team | Under 15% |
| **Call drop rate** | Percentage of calls disconnected unexpectedly | Under 2% |

### Agent Performance Metrics

| Metric | Description | What It Reveals |
|---|---|---|
| **Calls handled** | Number of calls each agent answered | Agent workload |
| **Average talk time** | Average duration of agent conversations | Efficiency and thoroughness |
| **Availability** | Percentage of time agent was available for calls | Staffing utilization |
| **Missed calls per agent** | Calls the agent did not answer | Agent responsiveness |
| **After-call work time** | Time spent on post-call activities | Process efficiency |
| **Queue time per agent** | How long callers wait for each agent | Agent speed |

### IVR Metrics

| Metric | Description | Insight |
|---|---|---|
| **IVR completion rate** | Percentage of callers who successfully navigate the IVR | Menu usability |
| **Drop-off by option** | Where callers hang up in the IVR | Identifies confusing menu options |
| **Most selected option** | Which IVR keys are pressed most | Department demand |
| **IVR-to-agent rate** | Percentage of IVR callers who reach an agent | Self-service vs. agent ratio |
| **Average IVR time** | Time spent in the IVR before connecting | Menu complexity |

## Dashboard Views

### Real-Time Dashboard

Monitor live call activity:

- **Active calls** -- Number of calls currently in progress
- **Callers in queue** -- Number of callers waiting for an agent
- **Available agents** -- Number of agents ready to take calls
- **Average wait time (live)** -- Current average wait time in queue

### Historical Reports

Analyze past performance:

| Report | Time Range | Key Data |
|---|---|---|
| **Daily summary** | Single day | Calls, answer rate, AHT, missed calls |
| **Weekly trend** | 7 days | Volume trends, peak hours, agent load |
| **Monthly report** | 30 days | KPIs, month-over-month comparison |
| **Custom range** | Any range | Flexible analysis |

### Filters

Narrow your analysis with these filters:

| Filter | Options |
|---|---|
| **Date range** | Today, yesterday, last 7 days, last 30 days, custom |
| **ExoPhone** | Filter by specific virtual number |
| **Call direction** | Incoming, outgoing, or both |
| **Call status** | Completed, missed, busy, no-answer, failed |
| **Agent** | Filter by specific agent |
| **Call flow** | Filter by specific call flow (App) |

## Call Logs

The call logs table provides a detailed record of every call:

| Field | Description |
|---|---|
| **CallSid** | Unique call identifier |
| **From** | Caller's phone number |
| **To** | Called number (ExoPhone or customer) |
| **Direction** | Incoming or Outgoing |
| **Status** | Completed, missed, busy, no-answer, failed |
| **Start time** | When the call started |
| **Duration** | Total call duration in seconds |
| **Agent** | Agent who handled the call |
| **Recording** | Link to play or download the recording |
| **Flow** | The call flow (App) that handled the call |

### Exporting Call Logs

1. Go to **Call Logs** in the dashboard.
2. Apply your desired filters.
3. Click **Export** (CSV or Excel).
4. The file downloads with all matching call records.

### Via API

```bash
# Fetch call logs for a date range
curl -u '<api_key>:<api_token>' 'https://api.exotel.com/v1/Accounts/<account_sid>/Calls.json?StartTime=2025-01-01&EndTime=2025-01-31&PageSize=50'
```

See: [Call Logs API](/docs/voice-v1/overview)

## Custom Reports and Integrations

### Webhooks for Real-Time Data

Configure [Status Callbacks](/docs/voice-v1/api-reference/status-callback) to receive call data in real time. Your application can:

- Store call records in your own database
- Feed data into a BI tool (Tableau, Power BI, Metabase)
- Trigger alerts based on KPI thresholds
- Update CRM records automatically

### Building Custom Dashboards

1. Set up status callbacks to send call data to your server.
2. Store the data in a database (PostgreSQL, MySQL, BigQuery).
3. Connect your BI tool to the database.
4. Build custom dashboards with your specific KPIs and visualizations.

```
Exotel → Status Callback → Your Server → Database → BI Dashboard
```

### Common Integration Patterns

| Integration | Purpose |
|---|---|
| **CRM (Salesforce, Zoho, HubSpot)** | Log calls against contacts and leads |
| **BI tools (Tableau, Power BI)** | Advanced visualization and reporting |
| **Slack/Teams** | Real-time alerts for missed calls or KPI breaches |
| **Google Sheets** | Simple reporting for small teams |
| **Data warehouse (BigQuery, Redshift)** | Long-term storage and analysis |

## Interpreting Analytics

### High Missed Call Rate

A missed call rate above 10% indicates issues:

| Possible Cause | Solution |
|---|---|
| Not enough agents | Hire more agents or extend hours |
| Long ring timeout | Reduce ring timeout to fail over faster |
| No call queue | Enable [Call Queue](/docs/call-support/call-features/call-queue) |
| Peak hour understaffing | Adjust schedules based on call volume patterns |

### Low Answer Rate for Outgoing Calls

If outbound answer rates are below 40%:

| Possible Cause | Solution |
|---|---|
| Unknown caller ID | Enable [Truecaller Verified Caller ID](/docs/call-support/advanced-features/truecaller-verified-caller-id) |
| Calling during off-hours | Schedule calls during 10 AM - 12 PM and 3 PM - 6 PM |
| Wrong numbers in list | Validate numbers before campaigns |
| DND numbers | Filter out DND-registered numbers |

### High IVR Drop-Off

If callers hang up during the IVR:

| Possible Cause | Solution |
|---|---|
| Too many menu options | Reduce to 4-5 options per level |
| Confusing language | Simplify and test the IVR prompt |
| No operator option | Add "Press 0 for an operator" |
| Long greeting before IVR | Shorten the greeting |

:::tip
Review your IVR drop-off analytics monthly. If a particular menu option has a high drop-off rate, that option may be confusing or unnecessary. Consider removing or rewording it.
:::

## Scheduled Reports

Set up automatic reports delivered to your inbox:

1. Go to **Analytics** > **Scheduled Reports**.
2. Click **Create New Report**.
3. Select the metrics, filters, and format.
4. Set the schedule (daily, weekly, monthly).
5. Enter the recipient email addresses.
6. Save.

## Best Practices

- **Define your KPIs** -- Decide which 5-7 metrics matter most for your business and focus on those.
- **Set targets** -- Establish target values for each KPI (e.g., answer rate above 90%, AHT under 4 minutes).
- **Review weekly** -- Hold a weekly review of call analytics with your team to identify trends and issues.
- **Act on insights** -- Analytics are only useful if they drive action. High missed calls should lead to staffing changes, not just a report.
- **Compare periods** -- Compare week-over-week and month-over-month to spot trends.
- **Correlate with business outcomes** -- Connect call metrics to business results (sales, CSAT, retention) for a complete picture.
- **Export and archive** -- Export historical data periodically for long-term analysis and compliance.

:::warning
Do not rely solely on average metrics. A "good" average handle time can hide problems if some calls are extremely long while others are extremely short. Look at distributions and outliers in addition to averages.
:::

## Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| Dashboard shows no data | Date range filter too narrow | Expand the date range |
| Call count does not match | Filters excluding some calls | Check status and direction filters |
| Agent data missing | Agent numbers not mapped to names | Map agent numbers in dashboard settings |
| Export fails | Too many records | Narrow the date range or add filters |
| Real-time data delayed | Callback URL unreachable | Check server availability and webhook configuration |

## Related

- [Call Recording](/docs/call-support/call-features/call-recording)
- [Call Queue](/docs/call-support/call-features/call-queue)
- [Voice v1 API -- Call Logs](/docs/voice-v1/overview)
- [Voice v1 API -- Call Details](/docs/voice-v1/api-reference/call-details)
- [Status Callback](/docs/voice-v1/api-reference/status-callback)
