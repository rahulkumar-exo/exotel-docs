---
id: custom-reports
title: Custom Reports
description: "Build custom Exotel reports with advanced filters, date ranges, and column selection. Export to CSV or Excel for analysis."
sidebar_label: Custom Reports
sidebar_position: 6
---

# Custom Reports

Custom reports let you build tailored views of your Exotel data by combining filters, selecting specific columns, and choosing date ranges that match your analysis needs. Export the results in CSV or Excel format for further processing.

:::tip
Custom reports are available on Growth and Enterprise plans. For automated recurring reports, see [Scheduled Reports](/docs/reporting/scheduled-reports).
:::

## Creating a Custom Report

### Step-by-Step Process

1. Log in to [my.exotel.com](https://my.exotel.com)
2. Navigate to **Reports** > **Custom Reports**
3. Click **Create Report**
4. Select the data source (calls, SMS, or usage)
5. Configure filters, columns, and date range
6. Click **Preview** to verify the data
7. Click **Export** to download the report

## Data Sources

| Data Source | Description | Key Fields |
|-------------|-------------|------------|
| **Voice Calls** | All inbound and outbound call records | Call SID, duration, status, cost, recording |
| **SMS Messages** | All sent SMS with delivery status | SMS SID, type, status, DLT template, cost |
| **Usage Summary** | Aggregated usage by service and time period | Service type, volume, cost, date |
| **Agent Activity** | Agent call handling and availability data | Agent name, calls handled, talk time, availability |
| **Campaign Calls** | Campaign-specific call records | Campaign name, call SID, status, attempts |

## Available Filters

### Call Report Filters

| Filter | Type | Options |
|--------|------|---------|
| **Date Range** | Date picker | Custom start and end date (up to 90 days) |
| **Direction** | Multi-select | Inbound, Outbound API, Outbound Dial |
| **Status** | Multi-select | Completed, No-answer, Busy, Failed, Canceled |
| **ExoPhone** | Multi-select | Select one or more virtual numbers |
| **From Number** | Text search | Filter by caller number (partial match supported) |
| **To Number** | Text search | Filter by destination number (partial match supported) |
| **Duration** | Range | Minimum and maximum duration in seconds |
| **Cost** | Range | Minimum and maximum cost |
| **Has Recording** | Boolean | Yes / No |
| **Agent** | Multi-select | Filter by specific agents (contact center) |

### SMS Report Filters

| Filter | Type | Options |
|--------|------|---------|
| **Date Range** | Date picker | Custom start and end date (up to 90 days) |
| **SMS Type** | Multi-select | Transactional, Promotional, OTP |
| **Status** | Multi-select | Sent, Delivered, Failed, Rejected, Expired |
| **From (Sender ID)** | Text search | Filter by sender ID |
| **To Number** | Text search | Filter by recipient number |
| **DLT Template ID** | Text search | Filter by specific DLT template |
| **Cost** | Range | Minimum and maximum cost |

:::info
The maximum date range for a single custom report is **90 days**. For longer periods, create multiple reports and combine the exported files.
:::

## Column Selection

Choose which columns to include in your exported report. Available columns depend on the data source:

### Voice Call Columns

| Column | Description | Default |
|--------|-------------|---------|
| Call SID | Unique call identifier | Yes |
| Date/Time | Call initiation timestamp | Yes |
| From | Originating number | Yes |
| To | Destination number | Yes |
| ExoPhone | Virtual number used | Yes |
| Direction | Inbound / Outbound | Yes |
| Status | Final call disposition | Yes |
| Duration (seconds) | Total call duration | Yes |
| Pulses | Billable pulse count | Yes |
| Cost | Call cost | Yes |
| Recording URL | Link to recording file | No |
| Legs | Number of call legs | No |
| Start Time | Exact call start time | No |
| Answer Time | When the call was answered | No |
| End Time | When the call ended | No |
| Ring Duration | Time spent ringing | No |
| Flow ID | Associated call flow | No |

### SMS Columns

| Column | Description | Default |
|--------|-------------|---------|
| SMS SID | Unique message identifier | Yes |
| Date/Time | Submission timestamp | Yes |
| From | Sender ID | Yes |
| To | Recipient number | Yes |
| Type | Transactional / Promotional / OTP | Yes |
| Status | Delivery status | Yes |
| Status Timestamp | When the status was last updated | No |
| DLT Template ID | Registered template identifier | No |
| DLT Entity ID | Registered entity identifier | No |
| Message Body | Content of the SMS (if enabled) | No |
| Cost | Message cost | Yes |
| Error Code | Error code for failed messages | No |

:::warning
Including **Message Body** in SMS exports may significantly increase file size. Use this column only when you need to audit message content.
:::

## Exporting Reports

### Export Formats

| Format | File Extension | Best For |
|--------|---------------|----------|
| **CSV** | `.csv` | Data analysis in any spreadsheet tool, database import, programmatic processing |
| **Excel** | `.xlsx` | Formatted workbook with headers, data types, and summary row |

### Export Limits

| Parameter | Limit |
|-----------|-------|
| Maximum rows per export | 100,000 |
| Maximum date range | 90 days |
| Maximum file size | 50 MB |
| Export timeout | 5 minutes |

If your report exceeds 100,000 rows:

1. Narrow your filters to reduce the result set
2. Split the date range into smaller periods
3. Use the API for bulk data extraction (see [Voice API Call Details](/docs/voice-api/api-reference/call-details))

### Downloading Exported Files

1. After clicking **Export**, the report generation begins
2. A progress indicator shows the generation status
3. Once complete, click **Download** to save the file
4. The file is also available in **Reports** > **Export History** for 30 days

## Saved Report Templates

Save frequently used filter combinations as templates for quick access:

### Saving a Template

1. Configure your report filters and columns
2. Click **Save as Template**
3. Enter a template name (e.g., "Weekly Failed Calls Report")
4. Click **Save**

### Using a Saved Template

1. Navigate to **Reports** > **Custom Reports**
2. Click **Load Template**
3. Select the saved template
4. Modify filters if needed (e.g., update date range)
5. Click **Preview** or **Export**

### Managing Templates

- **Edit**: Update the template name or default filters
- **Delete**: Remove templates you no longer need
- **Share**: Share templates with other users in your account (Enterprise plan)

## Use Cases

### Daily Operations Review

```
Data Source: Voice Calls
Date Range: Yesterday
Direction: All
Status: All
Columns: Call SID, Date/Time, From, To, Direction, Status, Duration, Cost
Format: CSV
```

### Failed Call Investigation

```
Data Source: Voice Calls
Date Range: Last 7 days
Status: Failed, No-answer, Busy
Columns: Call SID, Date/Time, From, To, ExoPhone, Status, Ring Duration
Format: Excel
```

### SMS Delivery Audit

```
Data Source: SMS Messages
Date Range: Last 30 days
Status: Failed, Rejected
Columns: SMS SID, Date/Time, To, Type, Status, Error Code, DLT Template ID
Format: CSV
```

### Monthly Billing Reconciliation

```
Data Source: Usage Summary
Date Range: Previous calendar month
Columns: Service Type, Volume, Cost, Date
Format: Excel
```

## Related Topics

- [Call Logs](/docs/reporting/call-logs) -- Quick access to call records
- [CDR Reports](/docs/reporting/cdr-reports) -- Detailed call detail records
- [Scheduled Reports](/docs/reporting/scheduled-reports) -- Automate report delivery
- [Analytics Dashboard](/docs/reporting/analytics-dashboard) -- Visual KPIs and trends
