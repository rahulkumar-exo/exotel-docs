---
id: cdr-reports
title: CDR (Call Detail Records)
description: "Download and analyze Exotel Call Detail Records with full metadata fields, export formats, and API access methods."
sidebar_label: CDR Reports
sidebar_position: 2
---

# CDR (Call Detail Records)

Call Detail Records (CDRs) provide the most comprehensive view of each voice call processed through Exotel. CDRs contain every data point captured during a call's lifecycle, making them essential for billing reconciliation, compliance auditing, and deep call analytics.

## CDR vs. Call Logs

| Feature | Call Logs | CDR Reports |
|---------|-----------|-------------|
| **Detail level** | Summary fields (status, duration, numbers) | Full metadata including legs, recordings, cost breakdown |
| **Access** | Dashboard list view, API | Downloadable CSV/Excel, API |
| **Use case** | Quick lookup, real-time monitoring | Billing, compliance, analytics |
| **Leg-level data** | No | Yes -- includes each call leg |

## CDR Fields

### Standard CDR Fields

| Field | Description | Example |
|-------|-------------|---------|
| `CallSid` | Unique call identifier | `c5797dcbaaeed7678c406...` |
| `DateCreated` | Call initiation timestamp | `2026-03-05 14:30:00` |
| `From` | Originating phone number | `+919876543210` |
| `To` | Destination phone number | `+919123456789` |
| `PhoneNumberSid` | ExoPhone used for the call | `0XXXXXX4890` |
| `Direction` | Call direction | `inbound`, `outbound-api` |
| `Status` | Final call disposition | `completed`, `no-answer` |
| `StartTime` | When the call was answered | `2026-03-05 14:30:05` |
| `EndTime` | When the call ended | `2026-03-05 14:32:19` |
| `Duration` | Total call duration (seconds) | `134` |
| `RecordingUrl` | URL to call recording | `https://s3-ap-...` |
| `Price` | Total call cost | `1.50` |
| `Currency` | Billing currency | `INR` |

### Extended CDR Fields

| Field | Description | Example |
|-------|-------------|---------|
| `ConversationDuration` | Actual talk time (seconds) | `120` |
| `Legs` | Number of call legs | `2` |
| `Leg1Status` | Status of the first leg | `completed` |
| `Leg2Status` | Status of the second leg | `completed` |
| `Leg1Duration` | Duration of first leg (seconds) | `134` |
| `Leg2Duration` | Duration of second leg (seconds) | `120` |
| `Leg1From` | First leg originating number | `0XXXXXX4890` |
| `Leg1To` | First leg destination number | `+919876543210` |
| `Leg2From` | Second leg originating number | `0XXXXXX4890` |
| `Leg2To` | Second leg destination number | `+919123456789` |
| `FlowId` | App/flow used for the call | `12345` |
| `RecordingDuration` | Recording file duration (seconds) | `120` |

## Downloading CDRs from the Dashboard

### Step-by-Step

1. Log in to [my.exotel.com](https://my.exotel.com)
2. Navigate to **Reports** > **CDR / Call Details**
3. Set your date range (maximum 31 days per export)
4. Apply optional filters:
   - **Direction**: Inbound, Outbound, or All
   - **Status**: Completed, Failed, Busy, No-Answer
   - **ExoPhone**: Filter by specific virtual number
5. Click **Download CSV** or **Download Excel**

:::info
CDR exports for large date ranges may take a few minutes to generate. You will receive an email with a download link when the export is ready.
:::

### Export File Format

The exported CSV contains one row per call with all standard and extended CDR fields. The file uses UTF-8 encoding with comma-separated values.

**Sample CSV header:**

```
CallSid,DateCreated,From,To,PhoneNumberSid,Direction,Status,StartTime,EndTime,Duration,ConversationDuration,Price,Currency,RecordingUrl,FlowId
```

## Accessing CDRs via API

### Single Call CDR

Retrieve the full CDR for a specific call:

```bash
curl "https://$EXOTEL_API_KEY:$EXOTEL_API_TOKEN@$EXOTEL_SUBDOMAIN/v1/Accounts/$EXOTEL_ACCOUNT_SID/Calls/YOUR_CALL_SID.json"
```

**Response:**

```json
{
  "Call": {
    "Sid": "c5797dcbaaeed7678c4062a4a3ed2f8a",
    "DateCreated": "2026-03-05 14:30:00",
    "DateUpdated": "2026-03-05 14:32:19",
    "AccountSid": "your_account_sid",
    "To": "+919123456789",
    "From": "+919876543210",
    "PhoneNumberSid": "0XXXXXX4890",
    "Status": "completed",
    "StartTime": "2026-03-05 14:30:05",
    "EndTime": "2026-03-05 14:32:19",
    "Duration": "134",
    "Price": "1.50",
    "Direction": "outbound-api",
    "RecordingUrl": "https://s3-ap-southeast-1.amazonaws.com/recordings/abc123.mp3"
  }
}
```

### Bulk CDR Download

Fetch CDRs for a date range with pagination:

```bash
curl "https://$EXOTEL_API_KEY:$EXOTEL_API_TOKEN@$EXOTEL_SUBDOMAIN/v1/Accounts/$EXOTEL_ACCOUNT_SID/Calls.json?DateCreated=gte:2026-03-01%2000:00:00;lte:2026-03-05%2023:59:59&PageSize=100"
```

:::warning
The bulk CDR API allows querying up to **6 months** of historical data with a maximum **1-month range** per request. For larger exports, break your query into monthly chunks.
:::

### Filtering CDR API Requests

| Parameter | Description | Example |
|-----------|-------------|---------|
| `DateCreated` | Date range filter | `gte:2026-03-01 00:00:00;lte:2026-03-05 23:59:59` |
| `Status` | Call status filter | `completed` |
| `Direction` | Call direction filter | `inbound` |
| `PhoneNumber` | ExoPhone filter | `0XXXXXX4890` |
| `PageSize` | Results per page (max 200) | `100` |

## CDR Use Cases

### Billing Reconciliation

Compare CDR `Price` fields against your invoices to verify billing accuracy:

1. Export CDRs for the billing period
2. Sum the `Price` column
3. Match against your Exotel invoice total

### Compliance Auditing

CDRs provide the audit trail required by many regulatory frameworks:

- **Call timestamps** for regulatory record-keeping
- **Recording URLs** for call quality audits
- **Leg-level data** for verifying call routing compliance

### Performance Analytics

Build performance metrics from CDR data:

| Metric | Calculation |
|--------|-------------|
| Answer rate | `COUNT(completed) / COUNT(total) * 100` |
| Average handle time | `AVG(Duration) WHERE Status = 'completed'` |
| Average talk time | `AVG(ConversationDuration) WHERE Status = 'completed'` |
| Peak hour | `MODE(HOUR(DateCreated))` |

:::tip
For automated analytics, use the API to pull CDRs into your data warehouse (BigQuery, Redshift, Snowflake) on a scheduled basis. See [Custom Reports](/docs/reporting/custom-reports) for automation patterns.
:::

## Related Resources

- [Call Logs](/docs/reporting/call-logs) -- Quick lookup view of calls
- [Call Details API](/docs/voice-v1/api-reference/call-details) -- Full API reference
- [Call Monitoring & Visualization](/docs/use-cases/call-monitoring-visualization) -- Build visualizations with CDR data
