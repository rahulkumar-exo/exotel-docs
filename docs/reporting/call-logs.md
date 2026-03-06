---
id: call-logs
title: Call Logs
description: "View, filter, and search Exotel call logs by date, phone number, status, and direction from the dashboard or API."
sidebar_label: Call Logs
sidebar_position: 1
---

# Call Logs

Call logs provide a chronological record of every voice call processed through your Exotel account. Use them to track call activity, troubleshoot issues, and analyze communication patterns.

## Viewing Call Logs in the Dashboard

1. Log in to [my.exotel.com](https://my.exotel.com)
2. Navigate to **Reports** > **Call Logs** in the left sidebar
3. The default view shows the last 24 hours of call activity

### Call Log Fields

Each call log entry includes the following information:

| Field | Description |
|-------|-------------|
| **Call SID** | Unique identifier for the call |
| **Date/Time** | When the call was initiated (IST/SGT) |
| **From** | Caller number (originating number) |
| **To** | Destination number |
| **ExoPhone** | The virtual number used for the call |
| **Direction** | `inbound`, `outbound-api`, or `outbound-dial` |
| **Status** | Final call disposition |
| **Duration** | Total call duration in seconds |
| **Recording** | Link to call recording (if enabled) |
| **Price** | Call cost in your account currency |

### Call Status Values

| Status | Meaning |
|--------|---------|
| `completed` | Call was answered and ended normally |
| `busy` | Called party returned a busy signal |
| `no-answer` | Called party did not pick up within the ring timeout |
| `failed` | Call could not be connected (network error, invalid number) |
| `canceled` | Call was canceled before being answered |

## Filtering Call Logs

### Date Range Filter

Select a predefined range or specify custom dates:

- **Today** -- Current day's calls
- **Yesterday** -- Previous day's calls
- **Last 7 days** -- Rolling week view
- **Last 30 days** -- Rolling month view
- **Custom range** -- Specify exact start and end dates

:::warning
The maximum date range for a single query is **31 days**. For longer periods, run multiple queries or use [Scheduled Reports](/docs/reporting/scheduled-reports).
:::

### Phone Number Search

Search by any phone number involved in the call:

- **From number** -- Filter by the originating number
- **To number** -- Filter by the destination number
- **ExoPhone** -- Filter by the virtual number used

Enter the number with country code (e.g., `+919876543210`) or without (e.g., `09876543210`).

### Status Filter

Filter calls by their final status:

- Select one or more statuses: `completed`, `busy`, `no-answer`, `failed`, `canceled`
- Combine with date range for targeted analysis

### Direction Filter

Filter by call direction:

| Direction | Description |
|-----------|-------------|
| `inbound` | Calls received on your ExoPhone |
| `outbound-api` | Calls initiated via the API |
| `outbound-dial` | Calls initiated from the dashboard |

## Accessing Call Logs via API

Retrieve call logs programmatically using the Call Details API.

### List All Calls

```bash
curl "https://$EXOTEL_API_KEY:$EXOTEL_API_TOKEN@$EXOTEL_SUBDOMAIN/v1/Accounts/$EXOTEL_ACCOUNT_SID/Calls.json?PageSize=50"
```

### Filter by Date Range

```bash
curl "https://$EXOTEL_API_KEY:$EXOTEL_API_TOKEN@$EXOTEL_SUBDOMAIN/v1/Accounts/$EXOTEL_ACCOUNT_SID/Calls.json?DateCreated=gte:2026-03-01%2000:00:00;lte:2026-03-05%2023:59:59"
```

### Filter by Status

```bash
curl "https://$EXOTEL_API_KEY:$EXOTEL_API_TOKEN@$EXOTEL_SUBDOMAIN/v1/Accounts/$EXOTEL_ACCOUNT_SID/Calls.json?Status=completed"
```

### Filter by Direction

```bash
curl "https://$EXOTEL_API_KEY:$EXOTEL_API_TOKEN@$EXOTEL_SUBDOMAIN/v1/Accounts/$EXOTEL_ACCOUNT_SID/Calls.json?Direction=inbound"
```

### Pagination

The API returns results in pages. Use `PageSize` and cursor-based pagination:

```json
{
  "Calls": [ ... ],
  "Metadata": {
    "PageSize": 50,
    "Page": 0,
    "NextPageUri": "/v1/Accounts/{sid}/Calls.json?PageSize=50&AfterSid=abc123",
    "PrevPageUri": null
  }
}
```

Follow the `NextPageUri` to fetch the next page of results. See [Call Details API](/docs/voice-v1/api-reference/call-details) for full documentation.

:::tip
For large data exports, use cursor-based pagination (`NextPageUri`) rather than offset-based pagination. This is more efficient and avoids duplicate records when new calls arrive during pagination.
:::

## API Response Fields

Each call record in the API response includes:

| Field | Type | Description |
|-------|------|-------------|
| `Sid` | String | Unique call identifier |
| `DateCreated` | DateTime | Call initiation timestamp |
| `DateUpdated` | DateTime | Last status update timestamp |
| `AccountSid` | String | Your account identifier |
| `To` | String | Destination number |
| `From` | String | Originating number |
| `PhoneNumberSid` | String | ExoPhone used |
| `Status` | String | Final call status |
| `StartTime` | DateTime | When the call was answered |
| `EndTime` | DateTime | When the call ended |
| `Duration` | Integer | Call duration in seconds |
| `Price` | Float | Call cost |
| `Direction` | String | Call direction |
| `RecordingUrl` | String | URL to the call recording (if enabled) |

## Exporting Call Logs

### From the Dashboard

1. Apply your desired filters
2. Click the **Export** button in the top-right corner
3. Select format: **CSV** or **Excel**
4. The export downloads to your browser

### Via the API

Fetch all records using pagination and write them to your preferred format. See [Custom Reports](/docs/reporting/custom-reports) for export automation patterns.

## Best Practices

- **Set up daily exports** -- Use [Scheduled Reports](/docs/reporting/scheduled-reports) to receive daily call logs via email
- **Monitor answer rates** -- Track the ratio of `completed` to total calls to measure reachability
- **Investigate failures** -- Filter by `failed` status to identify number-level or network issues
- **Use webhooks for real-time** -- Instead of polling call logs, configure [StatusCallback webhooks](/docs/references/webhooks#voice-call-statuscallback) for real-time status updates

## Related Resources

- [CDR Reports](/docs/reporting/cdr-reports) -- Download comprehensive call detail records
- [Call Details API](/docs/voice-v1/api-reference/call-details) -- Full API reference
- [Business Monitoring Dashboard](/docs/use-cases/business-monitoring-dashboard) -- Build a monitoring dashboard using call logs
