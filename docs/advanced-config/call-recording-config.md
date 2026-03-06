---
id: call-recording-config
title: Call Recording Configuration
description: "Configure Exotel call recording settings including dual-channel recording, storage options, retention policies, and encryption."
sidebar_label: Call Recording Config
sidebar_position: 6
---

# Call Recording Configuration

Call recording captures the audio of voice calls for quality assurance, compliance, training, and dispute resolution. This guide covers advanced recording configuration options beyond the basic on/off setting.

:::tip
For accessing and downloading existing recordings, see [Recording Access](/docs/reporting/recording-access).
:::

## Recording Modes

### Single-Channel (Default)

Both parties' audio is mixed into a single audio track:

- **Format**: MP3 (default) or WAV
- **Audio**: Both caller and agent on the same channel
- **File size**: ~1 MB per minute (MP3)
- **Use case**: General call recording, quality review

### Dual-Channel

Each party's audio is recorded on a separate channel:

- **Format**: Stereo WAV
- **Audio**: Left channel = Agent, Right channel = Customer
- **File size**: ~20 MB per minute (WAV)
- **Use case**: Speech analytics, advanced QA, compliance audits

| Feature | Single-Channel | Dual-Channel |
|---------|---------------|-------------|
| **Party separation** | No -- mixed audio | Yes -- separate channels |
| **File size** | Smaller (~1 MB/min) | Larger (~20 MB/min) |
| **Speech analytics** | Limited (overlapping speech is hard to analyze) | Ideal (each party isolated) |
| **Availability** | All plans | Growth and Enterprise |
| **Format** | MP3 or WAV | WAV only (stereo) |

:::info
Dual-channel recording is available on Growth and Enterprise plans. Contact your account manager to enable it.
:::

## Configuring Recording Settings

### Account-Level Settings

1. Log in to [my.exotel.com](https://my.exotel.com)
2. Navigate to **Settings** > **Recording**
3. Configure the following:

| Setting | Options | Default |
|---------|---------|---------|
| **Recording enabled** | Yes / No | Yes (for supported plans) |
| **Recording mode** | Single-channel / Dual-channel | Single-channel |
| **Recording format** | MP3 / WAV | MP3 |
| **Retention period** | 30, 60, 90, 180, 365 days | Plan-dependent |
| **Recording start point** | On answer / On connect (after IVR) | On answer |
| **Beep notification** | Play a beep when recording starts | Disabled |

### Per-Flow Recording

Override account-level settings at the call flow level:

1. Open your app in the [App Builder](/docs/app-bazaar/app-builder)
2. Click on the app-level settings
3. Configure recording options for this specific flow

| Setting | Description |
|---------|-------------|
| **Override account recording** | Yes / No |
| **Recording for this flow** | Enable / Disable |
| **Recording mode** | Single-channel / Dual-channel |

### Per-Call Recording via API

Control recording on a per-call basis using the API:

```bash
curl -X POST \
  https://api.exotel.com/v1/Accounts/{account_sid}/Calls/connect.json \
  -u {api_key}:{api_token} \
  -d "From=+919876543210" \
  -d "To=+919876543211" \
  -d "CallerId=+914412345678" \
  -d "Record=true" \
  -d "RecordingChannels=dual"
```

| Parameter | Values | Description |
|-----------|--------|-------------|
| `Record` | `true` / `false` | Enable or disable recording for this call |
| `RecordingChannels` | `mono` / `dual` | Single or dual-channel recording |

## Storage Configuration

### Default Storage

Exotel stores recordings in its cloud storage (AWS S3) in the region matching your account:

| Region | Storage Location |
|--------|-----------------|
| **India** | AWS Mumbai (ap-south-1) |
| **Singapore** | AWS Singapore (ap-southeast-1) |

### Custom Storage (Enterprise)

Enterprise accounts can configure recordings to be stored in your own cloud storage:

| Option | Description |
|--------|-------------|
| **Your AWS S3 bucket** | Exotel writes recordings directly to your S3 bucket |
| **Your Azure Blob Storage** | Exotel writes recordings to your Azure container |
| **SFTP upload** | Exotel uploads recordings to your SFTP server |

#### Setting Up Custom Storage (S3)

1. Create an S3 bucket in your AWS account
2. Configure a bucket policy that grants Exotel write access
3. Provide the bucket name, region, and access credentials to your Exotel account manager
4. Exotel validates the connection and begins writing recordings to your bucket

:::warning
When using custom storage, you are responsible for managing access controls, encryption, and retention on your storage. Exotel will not maintain a copy of recordings after successful delivery to your storage.
:::

## Retention Policies

### Default Retention Periods

| Plan | Default Retention | Configurable Range |
|------|-------------------|-------------------|
| **Starter** | 30 days | 7 -- 90 days |
| **Growth** | 90 days | 7 -- 180 days |
| **Enterprise** | Custom | 7 -- 365+ days |

### Configuring Retention

1. Navigate to **Settings** > **Recording** > **Retention**
2. Select the retention period from the dropdown
3. Click **Save**

:::warning
Recordings are **permanently deleted** after the retention period. There is no recovery. If you need recordings beyond the retention period, download them or configure custom storage before they expire.
:::

### Selective Retention

Enterprise accounts can configure different retention periods based on criteria:

| Criteria | Example | Retention |
|----------|---------|-----------|
| **Call flow** | Sales calls | 180 days |
| **Call flow** | Support calls | 90 days |
| **Call outcome** | Completed calls | 90 days |
| **Call outcome** | Disputed calls | 365 days |

## Security and Encryption

### Encryption at Rest

| Storage | Encryption | Details |
|---------|-----------|---------|
| **Exotel storage** | AES-256 | Server-side encryption enabled by default |
| **Custom S3** | AES-256 or KMS | Configure in your S3 bucket settings |
| **Custom Azure** | AES-256 | Configure in your Azure storage settings |

### Encryption in Transit

All recording transfers use HTTPS/TLS 1.2+:

- API retrieval of recording URLs
- Download of recording files
- Transfer to custom storage

### Access Control

| Control | Description |
|---------|-------------|
| **API authentication** | Recording URLs require valid API credentials |
| **Time-limited URLs** | Recording download URLs expire after 24 hours (default) |
| **IP whitelisting** | Restrict recording access to specific IPs ([IP Whitelisting](/docs/advanced-config/ip-whitelisting)) |
| **Role-based access** | Dashboard recording access based on user role |

## Compliance Considerations

### Recording Consent

In most jurisdictions, you must inform callers that the call is being recorded. Implement consent notification:

1. Add a [Greeting applet](/docs/app-bazaar/greeting-applet-guide) at the start of your call flow
2. Play a consent message: "This call may be recorded for quality and training purposes"
3. Optionally provide an opt-out option: "Press * to opt out of recording"

### Data Residency

| Requirement | Exotel Solution |
|-------------|----------------|
| **Data must stay in India** | Recordings stored in AWS Mumbai by default |
| **Data must stay in specific region** | Custom storage in your region |
| **Right to deletion** | Enterprise accounts can request deletion of specific recordings |

### Regulatory Frameworks

| Regulation | Relevant Requirement | Exotel Feature |
|-----------|---------------------|---------------|
| **IT Act (India)** | Reasonable security practices | Encryption at rest and in transit |
| **RBI Guidelines** | Secure storage of financial call recordings | Custom storage, encryption, access control |
| **GDPR** | Data subject access, right to erasure | Recording retrieval API, deletion support |
| **HIPAA** | Protected health information safeguards | Custom storage, BAA available for enterprise |

## Troubleshooting

| Issue | Possible Cause | Resolution |
|-------|---------------|------------|
| No recording for a call | Recording not enabled for the flow | Check flow-level recording settings |
| Recording is empty | Call was too short (< 2 seconds) | Very short calls may not generate recordings |
| Dual-channel not working | Feature not enabled on account | Contact your account manager to enable |
| Recording quality poor | Network issues during the call | Check call quality metrics in CDR |
| Custom storage not receiving files | Permission or configuration error | Verify bucket policy and credentials |

## Related Topics

- [Recording Access](/docs/reporting/recording-access) -- Playback, download, and manage recordings
- [Greeting Applet Guide](/docs/app-bazaar/greeting-applet-guide) -- Recording consent messages
- [IP Whitelisting](/docs/advanced-config/ip-whitelisting) -- Restrict recording access by IP
- [CDR Reports](/docs/reporting/cdr-reports) -- Recording metadata in call detail records
