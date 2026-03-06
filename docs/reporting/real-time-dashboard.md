---
id: real-time-dashboard
title: Real-Time Dashboard
description: "Monitor live call activity, agent availability, queue status, and ExoPhone health with Exotel's real-time dashboard."
sidebar_label: Real-Time Dashboard
sidebar_position: 4
---

# Real-Time Dashboard

The real-time dashboard provides a live view of your Exotel communication operations. Monitor active calls, agent availability, queue metrics, and ExoPhone health as events happen.

## Accessing the Real-Time Dashboard

1. Log in to [my.exotel.com](https://my.exotel.com)
2. Navigate to **Dashboard** in the left sidebar
3. The real-time view loads automatically with live data

## Dashboard Panels

### Active Calls Panel

Displays all currently active calls across your account:

| Metric | Description |
|--------|-------------|
| **Active Calls** | Total number of calls currently in progress |
| **Inbound Active** | Active inbound calls |
| **Outbound Active** | Active outbound calls (API + dashboard) |
| **Longest Active** | Duration of the longest currently active call |
| **Calls in Queue** | Calls waiting to be connected to an agent |

### Call Volume Panel

Real-time call volume metrics updated every 30 seconds:

| Metric | Description |
|--------|-------------|
| **Calls Today** | Total calls since midnight |
| **Answered** | Calls with `completed` status |
| **Missed** | Calls with `no-answer` status |
| **Busy** | Calls with `busy` status |
| **Failed** | Calls with `failed` status |
| **Answer Rate** | Percentage of answered calls (`completed / total * 100`) |

### Agent Status Panel

:::info Contact Center Required
The agent status panel requires the Exotel Contact Center module. See [Contact Center Overview](/docs/contact-center/overview) for setup.
:::

For contact center accounts, the agent panel shows:

| Metric | Description |
|--------|-------------|
| **Total Agents** | Number of registered agents |
| **Available** | Agents in available/ready state |
| **On Call** | Agents currently handling calls |
| **On Break** | Agents in break/away state |
| **Offline** | Agents who are logged out |
| **Avg Handle Time** | Average call duration for the current day |

### ExoPhone Health Panel

Monitors the health status of your virtual numbers using the [Heartbeat API](/docs/heartbeat/overview):

| Status | Indicator | Meaning |
|--------|-----------|---------|
| **OK** | Green | All ExoPhones are healthy and operational |
| **WARNING** | Yellow | One or more ExoPhones may have issues |
| **CRITICAL** | Red | Significant ExoPhone issues detected |

:::tip
Set up Heartbeat webhooks to receive proactive alerts when ExoPhone health changes. See [Heartbeat Webhook Format](/docs/heartbeat/webhook-format) for configuration.
:::

## Real-Time Metrics Refresh

| Data Type | Refresh Interval |
|-----------|-----------------|
| Active calls count | 10 seconds |
| Call volume metrics | 30 seconds |
| Agent status | 15 seconds |
| ExoPhone health | 60 seconds |
| Queue metrics | 10 seconds |

## Building a Custom Real-Time Dashboard

For custom dashboards, use the following APIs and webhooks:

### Using StatusCallback Webhooks

Configure real-time webhooks to receive call events as they happen:

```bash
curl -X POST "https://$EXOTEL_API_KEY:$EXOTEL_API_TOKEN@$EXOTEL_SUBDOMAIN/v1/Accounts/$EXOTEL_ACCOUNT_SID/Calls/connect" \
  -d "From=+919876543210" \
  -d "To=+919123456789" \
  -d "CallerId=YOUR_EXOPHONE" \
  -d "StatusCallback=https://your-server.com/call-events" \
  -d "StatusCallbackEvents=terminal,answered" \
  -d "StatusCallbackContentType=application/json"
```

This sends events when the call is answered and when it reaches a terminal state.

### Using the Bulk Call Details API

Poll the Call Details API for batch updates:

```bash
curl "https://$EXOTEL_API_KEY:$EXOTEL_API_TOKEN@$EXOTEL_SUBDOMAIN/v1/Accounts/$EXOTEL_ACCOUNT_SID/Calls.json?DateCreated=gte:2026-03-05%2000:00:00;lte:2026-03-05%2023:59:59&PageSize=100"
```

### Using the Heartbeat API

Configure Heartbeat webhooks for ExoPhone health monitoring:

1. Navigate to **Settings** > **Notifications** in the Exotel Dashboard
2. Enter your webhook endpoint URL
3. Exotel sends periodic health updates to your endpoint

See [Heartbeat Overview](/docs/heartbeat/overview) for full configuration.

### Combining Data Sources

For a comprehensive custom dashboard, combine:

1. **StatusCallback webhooks** for real-time call events
2. **Heartbeat webhooks** for ExoPhone health
3. **Call Details API** for historical metrics and aggregation
4. **Contact Center API** for agent status (if applicable)

See [Business Monitoring Dashboard](/docs/use-cases/business-monitoring-dashboard) for a complete implementation guide.

## Dashboard Best Practices

- **Set up alerts** -- Configure Heartbeat alerts and StatusCallback monitoring for immediate notification of issues
- **Monitor answer rate** -- An answer rate below 70% may indicate capacity issues or agent shortages
- **Track peak hours** -- Use the hourly distribution to plan agent scheduling
- **Watch queue depth** -- Rising queue counts indicate insufficient agent capacity
- **Review failed calls** -- A spike in `failed` status calls may indicate network or number issues

:::warning
The real-time dashboard shows data from the current session. If you reload the page, counters reset to the current state. For persistent historical data, use [Call Logs](/docs/reporting/call-logs) or [CDR Reports](/docs/reporting/cdr-reports).
:::

## Related Resources

- [Call Logs](/docs/reporting/call-logs) -- Historical call data
- [Analytics Dashboard](/docs/reporting/analytics-dashboard) -- KPIs and trend analysis
- [Heartbeat Overview](/docs/heartbeat/overview) -- ExoPhone health monitoring
- [Business Monitoring Dashboard](/docs/use-cases/business-monitoring-dashboard) -- Build a custom monitoring dashboard
- [Contact Center Overview](/docs/contact-center/overview) -- Agent management and monitoring
