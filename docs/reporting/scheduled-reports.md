---
id: scheduled-reports
title: Scheduled Reports
description: "Set up automated Exotel report delivery via email on daily, weekly, or monthly schedules with custom filters and recipients."
sidebar_label: Scheduled Reports
sidebar_position: 5
---

# Scheduled Reports

Scheduled reports automate the delivery of Exotel call logs, CDRs, SMS reports, and usage summaries directly to your inbox. Instead of manually exporting data each day, configure a schedule and receive reports at the frequency you need.

:::tip
Scheduled reports are available on Growth and Enterprise plans. Starter plan users can manually export reports from the [Call Logs](/docs/reporting/call-logs) and [CDR Reports](/docs/reporting/cdr-reports) pages.
:::

## Creating a Scheduled Report

### Step-by-Step Setup

1. Log in to [my.exotel.com](https://my.exotel.com)
2. Navigate to **Reports** > **Scheduled Reports**
3. Click **Create Schedule**
4. Configure the report parameters (see sections below)
5. Click **Save Schedule**

### Report Configuration Options

| Setting | Description | Options |
|---------|-------------|---------|
| **Report Name** | A descriptive name for identification | Free text (e.g., "Daily Call Summary") |
| **Report Type** | The type of data to include | Call Logs, CDR, SMS Report, Usage Summary |
| **Frequency** | How often to generate and send | Daily, Weekly, Monthly |
| **Time** | When to generate the report | Select hour (IST) |
| **Day of Week** | For weekly reports, which day | Monday -- Sunday |
| **Day of Month** | For monthly reports, which date | 1 -- 28 (or "Last Day") |
| **Format** | File format for the attachment | CSV, Excel (.xlsx) |
| **Recipients** | Email addresses to receive the report | Up to 10 email addresses |

## Frequency Options

### Daily Reports

- Generated every day at your specified time
- Covers the **previous 24 hours** of data (midnight to midnight IST)
- Delivered as an email attachment by the configured time

**Best for:** Operations teams monitoring daily call volumes, support teams tracking daily SLA compliance.

### Weekly Reports

- Generated once per week on your specified day
- Covers the **previous 7 days** (Monday -- Sunday or your configured week start)
- Delivered as an email attachment on the configured day and time

**Best for:** Managers reviewing weekly performance trends, finance teams tracking weekly spending.

### Monthly Reports

- Generated once per month on your specified date
- Covers the **entire previous calendar month**
- Delivered as an email attachment on the configured date

**Best for:** Finance teams for billing reconciliation, leadership for monthly business reviews.

## Filtering Scheduled Reports

Apply filters to narrow the data included in each scheduled report:

| Filter | Description | Applicable Report Types |
|--------|-------------|------------------------|
| **Date Range** | Automatically set based on frequency | All |
| **Direction** | Inbound, outbound, or both | Call Logs, CDR |
| **Status** | Completed, failed, busy, no-answer, etc. | Call Logs, CDR |
| **ExoPhone** | Specific virtual number(s) | Call Logs, CDR, SMS |
| **SMS Type** | Transactional, promotional, OTP | SMS Report |
| **Agent/User** | Specific agent or user | Call Logs, CDR |
| **Minimum Duration** | Only include calls above a duration threshold | Call Logs, CDR |

:::info
Filters are applied at report generation time. If you change filters on an existing schedule, the changes take effect starting with the next scheduled generation.
:::

## Managing Recipients

### Adding Recipients

Each scheduled report can have up to 10 email recipients:

1. In the scheduled report configuration, find the **Recipients** field
2. Enter email addresses separated by commas
3. Both internal and external email addresses are supported
4. All recipients receive the same report attachment

### Recipient Notifications

Recipients receive:

| Notification | Content |
|-------------|---------|
| **Email with attachment** | The report file (CSV or Excel) attached to the email |
| **Email body summary** | High-level summary including record count, date range, and key metrics |
| **Error notification** | If the report fails to generate, recipients are notified with the error reason |

:::warning
Email attachments are limited to **10 MB**. If your report exceeds this size, the email will contain a **download link** instead of an attachment. The download link expires after 7 days.
:::

## Managing Scheduled Reports

### Viewing All Schedules

1. Navigate to **Reports** > **Scheduled Reports**
2. View the list of all active and paused schedules
3. Each schedule shows: name, type, frequency, next run time, last run status

### Editing a Schedule

1. Click the **Edit** icon next to the schedule
2. Modify any configuration parameter
3. Click **Save Changes**
4. Changes take effect from the next scheduled run

### Pausing and Resuming

- **Pause**: Temporarily stop a schedule without deleting it. Click the **Pause** button.
- **Resume**: Re-activate a paused schedule. Click the **Resume** button.

### Deleting a Schedule

1. Click the **Delete** icon next to the schedule
2. Confirm the deletion
3. Deleted schedules cannot be recovered

## Scheduled Report Data Fields

### Call Log Report Fields

| Field | Description |
|-------|-------------|
| Call SID | Unique identifier for the call |
| Date/Time | Call initiation timestamp |
| From | Originating number |
| To | Destination number |
| ExoPhone | Virtual number used |
| Direction | Inbound or outbound |
| Status | Final call disposition |
| Duration (seconds) | Total call duration |
| Pulses | Number of billable pulses |
| Cost | Charge for the call |
| Recording URL | Link to call recording (if available) |

### SMS Report Fields

| Field | Description |
|-------|-------------|
| SMS SID | Unique identifier for the message |
| Date/Time | Message submission timestamp |
| From | Sender ID |
| To | Recipient number |
| Type | Transactional, promotional, or OTP |
| Status | Sent, delivered, failed, etc. |
| DLT Template ID | DLT-registered template identifier |
| Cost | Charge for the message |

## Troubleshooting

| Issue | Possible Cause | Resolution |
|-------|---------------|------------|
| Report not received | Email in spam/junk folder | Whitelist Exotel's email domain |
| Empty report | Filters too restrictive for the period | Broaden filters or check date range |
| Report delayed | High system load during generation | Wait 1 -- 2 hours; reports may be delayed during peak times |
| Download link expired | More than 7 days since generation | Re-generate the report manually from the dashboard |
| Attachment too large | Report data exceeds 10 MB | Narrow filters or split into multiple schedules |

## Related Topics

- [Call Logs](/docs/reporting/call-logs) -- Manual call log viewing and filtering
- [CDR Reports](/docs/reporting/cdr-reports) -- Detailed call detail records
- [SMS Reports](/docs/reporting/sms-reports) -- SMS delivery and status reports
- [Custom Reports](/docs/reporting/custom-reports) -- Build ad-hoc reports with custom filters
