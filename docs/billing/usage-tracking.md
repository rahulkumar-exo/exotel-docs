---
id: usage-tracking
title: Usage Tracking
description: "Track your Exotel account balance in real time, configure low-balance alerts, set spending limits, and monitor usage trends."
sidebar_label: Usage Tracking
sidebar_position: 4
---

# Usage Tracking

Exotel provides real-time visibility into your account usage across voice, SMS, and other services. Monitor your balance, set alerts, and configure spending limits to stay in control of your communication costs.

## Real-Time Balance

Your current account balance is always visible in the Exotel dashboard header bar. It updates in real time as calls are made and SMS messages are sent.

### Checking Balance via Dashboard

1. Log in to [my.exotel.com](https://my.exotel.com)
2. Your current balance is displayed in the top navigation bar
3. Click the balance amount for a detailed breakdown

### Balance Breakdown

The detailed balance view shows:

| Item | Description |
|------|-------------|
| **Available Balance** | Total credits available for use |
| **Paid Credits** | Credits purchased via payment |
| **Promotional Credits** | Free/bonus credits (with expiry dates) |
| **Reserved Amount** | Credits reserved for active calls in progress |
| **Today's Usage** | Total credits consumed today |
| **This Month's Usage** | Total credits consumed in the current billing cycle |

:::info
The **Reserved Amount** represents credits temporarily held for calls that are currently in progress. These credits are either deducted (if the call completes) or released back (if the call fails) once the call ends.
:::

## Usage Alerts

Configure alerts to receive notifications when your balance or usage reaches specific thresholds.

### Setting Up Low-Balance Alerts

1. Navigate to **Billing** > **Alerts**
2. Click **Add Alert**
3. Configure the alert:

| Setting | Description | Example |
|---------|-------------|---------|
| **Alert Type** | Low balance or usage threshold | Low Balance |
| **Threshold** | Amount that triggers the alert | INR 5,000 |
| **Recipients** | Email addresses to notify | billing@yourcompany.com |
| **Channels** | Notification channels | Email, SMS, Dashboard |
| **Frequency** | How often to repeat the alert | Once, or every 24 hours |

4. Click **Save Alert**

### Recommended Alert Levels

Set up multiple alerts at decreasing thresholds for progressive warnings:

| Alert Level | Threshold | Action |
|-------------|-----------|--------|
| **Warning** | 30% of average monthly usage | Plan to add credits soon |
| **Urgent** | 15% of average monthly usage | Add credits immediately |
| **Critical** | 5% of average monthly usage | Service disruption imminent |

:::warning
When your balance reaches zero, all outbound services (calls, SMS) stop immediately. Inbound services may also be affected. Always maintain a buffer above zero.
:::

## Spending Limits

Spending limits help you control costs by capping the maximum usage per day, week, or month.

### Configuring Spending Limits

1. Navigate to **Billing** > **Spending Limits**
2. Enable spending limits
3. Configure caps:

| Limit Type | Description | What Happens When Hit |
|------------|-------------|----------------------|
| **Daily Spending Cap** | Maximum credits consumed per day | Outbound services paused until next day |
| **Monthly Spending Cap** | Maximum credits consumed per month | Outbound services paused until next month |
| **Per-Call Cap** | Maximum duration/cost per individual call | Call disconnected at limit |
| **Per-Campaign Cap** | Maximum budget per campaign | Campaign paused at limit |

:::tip
Spending limits are especially useful for development and testing environments where runaway API calls could consume credits unexpectedly. Set conservative daily limits for non-production accounts.
:::

## Usage Reports

### Dashboard Usage Summary

The **Billing** > **Usage** section provides:

- **Daily usage chart** -- Visual representation of daily credit consumption
- **Service breakdown** -- Usage split by voice, SMS, WhatsApp, and other services
- **Top consumers** -- Users or applications with the highest usage
- **Trend analysis** -- Month-over-month usage comparison

### Usage by Service Type

| Service | Metrics Tracked |
|---------|----------------|
| **Voice** | Total calls, total pulses, total cost, average call duration |
| **SMS** | Total messages, messages by type, total cost, delivery rate |
| **ExoPhone** | Number of active numbers, total rental cost |
| **WhatsApp** | Total conversations, conversations by type, total cost |
| **Contact Center** | Active agents, agent hours, seat license cost |

### Exporting Usage Data

Export your usage data for internal reporting or reconciliation:

1. Navigate to **Billing** > **Usage**
2. Select the date range
3. Choose the service type (or all services)
4. Click **Export** and select the format:
   - **CSV** -- Raw data for spreadsheet analysis
   - **Excel** -- Formatted workbook with summary sheet
   - **PDF** -- Printable summary report

## Monitoring Best Practices

1. **Set up auto-recharge** -- Prevent service disruption with automatic credit top-ups ([Add Credits](/docs/billing/add-credits))
2. **Configure multi-level alerts** -- Use warning, urgent, and critical thresholds
3. **Review usage weekly** -- Identify trends and anomalies before they become issues
4. **Set spending limits for dev/test** -- Protect against accidental high usage
5. **Export monthly reports** -- Maintain records for financial reconciliation
6. **Use the API for programmatic monitoring** -- Build custom dashboards and alerts using the [Voice API](/docs/voice-api/getting-started/overview) and [SMS API](/docs/sms-api/overview) detail endpoints
