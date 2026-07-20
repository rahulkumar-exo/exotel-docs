---
id: recording-access
title: Call Recording Access
description: "Access, play, download, and manage Exotel call recordings with retention policies, storage options, and API-based retrieval."
sidebar_label: Recording Access
sidebar_position: 8
---

# Call Recording Access

Exotel automatically records calls when recording is enabled on your account or call flow. This guide covers how to access recordings through the dashboard and API, configure retention policies, and manage recording storage.

## How Call Recording Works

When recording is enabled:

1. The call audio is captured from the moment the call is answered
2. Both parties' audio is recorded (or in dual-channel mode, each party on a separate channel)
3. The recording is processed and stored after the call ends
4. A recording URL is generated and associated with the Call SID
5. The URL is included in the call detail record and status callback

```
Call Answered → Audio Captured → Call Ends → Recording Processed → URL Available
                                              (typically 1-5 minutes)
```

:::info
Recording URLs are typically available within **1 -- 5 minutes** after the call ends. For high-volume accounts during peak hours, processing may take up to 15 minutes.
:::

## Accessing Recordings via Dashboard

### From Call Logs

1. Navigate to **Reports** > **Call Logs**
2. Locate the call record you want
3. Click the **Play** icon in the Recording column
4. The recording plays in an inline audio player

### Recording Player Controls

| Control | Function |
|---------|----------|
| **Play / Pause** | Start or pause playback |
| **Seek** | Click or drag the progress bar to jump to a specific point |
| **Speed** | Adjust playback speed (0.5x, 1x, 1.5x, 2x) |
| **Volume** | Adjust playback volume |
| **Download** | Download the recording file to your device |

### Searching for Recordings

Use the call log filters to find specific recordings:

| Filter | How to Use |
|--------|-----------|
| **Date Range** | Narrow to the date/time of the call |
| **Phone Number** | Search by the caller or recipient number |
| **Call SID** | If you have the Call SID, search directly |
| **ExoPhone** | Filter by the virtual number used |
| **Has Recording** | Toggle to show only calls with recordings |

## Accessing Recordings via API

### Get Recording URL from Call Details

Use the [Voice API Call Details endpoint](/docs/voice-api/api-reference/call-details) to retrieve the recording URL:

```bash
curl -X GET \
  https://api.exotel.com/v1/Accounts/{account_sid}/Calls/{call_sid}.json \
  -u {api_key}:{api_token}
```

The response includes a `RecordingUrl` field:

```json
{
  "Call": {
    "Sid": "abc123def456",
    "RecordingUrl": "https://s3-ap-southeast-1.amazonaws.com/exotelrecordings/...",
    "Status": "completed",
    "Duration": 120
  }
}
```

### Recording URL Format

| Component | Description |
|-----------|-------------|
| **Base URL** | Exotel's cloud storage endpoint |
| **Account path** | Your account SID in the path |
| **File name** | Call SID-based unique file name |
| **Format** | `.mp3` (default) or `.wav` (if configured) |

:::warning
Recording URLs are time-limited for security. URLs retrieved via the API are valid for **24 hours** by default. Request a fresh URL if the link has expired.
:::

### Downloading Recordings Programmatically

```bash
# Get the recording URL
RECORDING_URL=$(curl -s -u {api_key}:{api_token} \
  https://api.exotel.com/v1/Accounts/{account_sid}/Calls/{call_sid}.json \
  | jq -r '.Call.RecordingUrl')

# Download the recording
curl -o recording.mp3 "$RECORDING_URL"
```

### Bulk Recording Download

For downloading multiple recordings:

1. Export call logs with recording URLs using [Custom Reports](/docs/reporting/custom-reports)
2. Use the exported CSV to script bulk downloads
3. Or use the API to iterate through calls and download recordings

:::tip
For large-scale recording access, consider setting up a [webhook](/docs/references/webhooks) to receive recording URLs in real time as calls complete. This avoids the need to poll the API.
:::

## Recording Storage and Retention

### Default Retention Periods

| Plan | Default Retention | Maximum Retention |
|------|-------------------|-------------------|
| **Starter** | 30 days | 90 days |
| **Growth** | 90 days | 180 days |
| **Enterprise** | Custom (up to 365 days) | Custom (negotiate with account manager) |

:::warning
Recordings are **permanently deleted** after the retention period expires. There is no recovery option. Download critical recordings before they expire or configure extended retention.
:::

### Configuring Retention Period

1. Navigate to **Settings** > **Recording Settings**
2. Select the desired retention period from the dropdown
3. Click **Save**

Changes apply to new recordings only. Existing recordings retain their original expiry date.

### Storage Costs

| Storage Tier | Monthly Cost (Indicative) |
|-------------|--------------------------|
| **Included storage** | Included in plan (varies by plan) |
| **Extended storage** (beyond plan limits) | INR 0.50 -- 1.00 per recording per month |
| **Custom storage** (enterprise) | Negotiated based on volume |

## Recording Formats

| Format | Quality | File Size (per minute) | Use Case |
|--------|---------|----------------------|----------|
| **MP3** (default) | Good (128 kbps) | ~1 MB | General playback and storage |
| **WAV** | Lossless | ~10 MB | Quality-critical analysis, compliance |
| **Dual-channel WAV** | Lossless, stereo | ~20 MB | Agent and customer on separate channels |

### Dual-Channel Recording

Dual-channel recording captures each party on a separate audio channel:

- **Left channel**: Agent / first party
- **Right channel**: Customer / second party

This is useful for:
- Quality analysis tools that need to evaluate agent and customer separately
- Speech analytics where overlapping speech needs to be distinguished
- Compliance audits that need to verify each party's consent

For recording configuration, contact your account manager or visit [Exotel Support](https://support.exotel.com).

## Recording Security

### Access Control

| Security Feature | Description |
|-----------------|-------------|
| **Authenticated URLs** | Recording URLs require valid API credentials to access |
| **Time-limited URLs** | URLs expire after 24 hours (configurable) |
| **IP Whitelisting** | Restrict recording access to specific IP addresses |
| **Encryption at rest** | Recordings are encrypted in cloud storage (AES-256) |
| **Encryption in transit** | All recording transfers use HTTPS/TLS |

### Compliance Considerations

| Requirement | Exotel Feature |
|-------------|---------------|
| **Consent notification** | Use the [Greeting applet](/docs/voice-v1/applets/greeting) to play a recording consent message |
| **Selective recording** | Enable/disable recording per call flow or per call via API |
| **Data residency** | Recordings stored in regional data centers (India, Singapore) |
| **Right to deletion** | Enterprise accounts can request early deletion of specific recordings |
| **Audit trail** | All recording access events are logged |

:::info
In India, it is a best practice to inform callers that the call is being recorded. Use the Greeting applet at the start of your call flow to play a message such as "This call may be recorded for quality and training purposes."
:::

## Troubleshooting

| Issue | Possible Cause | Resolution |
|-------|---------------|------------|
| No recording available | Recording not enabled for this flow | Enable recording in call flow settings |
| Recording URL returns 403 | URL expired or invalid credentials | Request a fresh URL via the API |
| Recording is empty | Call was very short or disconnected immediately | Check call duration; very short calls may not generate recordings |
| Poor recording quality | Network issues during the call | Check call quality metrics in the CDR |
| Recording takes too long to appear | High volume processing delay | Wait up to 15 minutes; check again later |

## Related Topics

- [Call Logs](/docs/reporting/call-logs) -- Find calls with recordings
- [CDR Reports](/docs/reporting/cdr-reports) -- Detailed call records with recording metadata
- [Webhooks](/docs/references/webhooks) -- Receive recording URLs via callbacks
