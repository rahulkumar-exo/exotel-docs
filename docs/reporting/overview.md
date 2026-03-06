---
id: overview
title: Reporting Overview
description: "Explore Exotel reporting capabilities: call logs, CDRs, SMS reports, real-time dashboards, analytics, and scheduled exports."
sidebar_label: Overview
sidebar_position: 0
---

# Reporting Overview

Exotel provides a comprehensive reporting suite that gives you full visibility into your communication operations. From real-time dashboards to scheduled CSV exports, you can track every call, SMS, and agent interaction across your account.

## Available Report Types

| Report Type | What It Covers | Access Method |
|-------------|---------------|---------------|
| [Call Logs](/docs/reporting/call-logs) | All inbound and outbound calls with status, duration, timestamps | Dashboard, API |
| [CDR Reports](/docs/reporting/cdr-reports) | Detailed call detail records with full metadata | Dashboard export, API |
| [SMS Reports](/docs/reporting/sms-reports) | SMS delivery status, DLT compliance, error tracking | Dashboard, API |
| [Real-Time Dashboard](/docs/reporting/real-time-dashboard) | Live call monitoring, agent availability, queue status | Dashboard |
| [Scheduled Reports](/docs/reporting/scheduled-reports) | Automated email delivery of reports on a recurring basis | Dashboard |
| [Custom Reports](/docs/reporting/custom-reports) | Filtered, date-ranged exports in CSV/Excel format | Dashboard |
| [Analytics Dashboard](/docs/reporting/analytics-dashboard) | KPIs, trends, visualizations for business intelligence | Dashboard |
| [Recording Access](/docs/reporting/recording-access) | Call recording playback, download, and retention management | Dashboard, API |

## Reporting Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Exotel Platform                       │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Voice    │  │   SMS    │  │  Contact │             │
│  │  Engine   │  │  Gateway │  │  Center  │             │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
│       │              │              │                    │
│       ▼              ▼              ▼                    │
│  ┌─────────────────────────────────────────┐           │
│  │         Unified Reporting Engine         │           │
│  └────────────────┬────────────────────────┘           │
│                   │                                     │
│    ┌──────────────┼──────────────┐                     │
│    ▼              ▼              ▼                      │
│  Dashboard      API          Scheduled                  │
│  Reports      Endpoints      Exports                    │
└────────────────────────────────────────────────────────┘
```

## Accessing Reports

### Via the Dashboard

1. Log in to [my.exotel.com](https://my.exotel.com)
2. Navigate to **Reports** in the left sidebar
3. Select the report type you need
4. Apply filters (date range, phone number, status, direction)
5. View inline or export to CSV/Excel

### Via the API

Use the following API endpoints to fetch reporting data programmatically:

| Endpoint | Description |
|----------|-------------|
| `GET /v1/Accounts/{sid}/Calls.json` | Fetch call detail records |
| `GET /v1/Accounts/{sid}/Calls/{callSid}.json` | Fetch a single call's details |
| `GET /v1/Accounts/{sid}/SMS/Messages.json` | Fetch SMS delivery records |
| `GET /v1/Accounts/{sid}/SMS/Messages/{smsSid}.json` | Fetch a single SMS status |

See [Voice API - Call Details](/docs/voice-v1/api-reference/call-details) and [SMS API - SMS Details](/docs/sms-api/api-reference/sms-details) for full parameter documentation.

## Data Retention

| Data Type | Retention Period | Notes |
|-----------|-----------------|-------|
| Call logs | 18 months | Accessible via dashboard and API |
| CDR records | 18 months | Downloadable as CSV |
| SMS logs | 12 months | Includes DLT status |
| Call recordings | 90 days (default) | Extendable with custom retention plans |
| Real-time data | Live + 24 hours | Historical data moves to call logs |

:::info Custom Retention
Need longer retention periods for call recordings or logs? Contact your Exotel account manager to discuss custom retention plans tailored to your compliance requirements.
:::

## Timezone Handling

All timestamps in Exotel reports use **IST (Indian Standard Time, UTC+5:30)** by default for India-based accounts. For accounts on the Singapore cluster, timestamps use **SGT (Singapore Time, UTC+8)**.

:::tip
When fetching data via the API, always specify date ranges with explicit timestamps (e.g., `2026-03-01 00:00:00` to `2026-03-01 23:59:59`) to avoid timezone ambiguity.
:::

## Common Reporting Workflows

### Track Call Quality Metrics

1. Use [Call Logs](/docs/reporting/call-logs) to filter by status (`completed`, `no-answer`, `busy`, `failed`)
2. Calculate answer rate: `completed / total calls * 100`
3. Set up [Scheduled Reports](/docs/reporting/scheduled-reports) for daily summaries

### Monitor SMS Delivery

1. Use [SMS Reports](/docs/reporting/sms-reports) to track delivery rates
2. Filter by DLT status to identify compliance issues
3. Export failed messages for troubleshooting

### Build Custom Dashboards

1. Use the [Call Details API](/docs/voice-v1/api-reference/call-details) for programmatic access
2. See [Business Monitoring Dashboard](/docs/use-cases/business-monitoring-dashboard) for a complete implementation guide
3. Combine with [Heartbeat webhooks](/docs/heartbeat/overview) for real-time health monitoring

## What's Next

- [Call Logs](/docs/reporting/call-logs) -- Get started with viewing and filtering call data
- [CDR Reports](/docs/reporting/cdr-reports) -- Download detailed call records
- [Real-Time Dashboard](/docs/reporting/real-time-dashboard) -- Monitor live call activity
- [Analytics Dashboard](/docs/reporting/analytics-dashboard) -- Explore KPIs and trends
