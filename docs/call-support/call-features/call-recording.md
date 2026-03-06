---
id: call-recording
title: Call Recording
description: "Guide to enabling call recording in Exotel, managing recordings, playback, storage policies, and regulatory compliance."
sidebar_label: Call Recording
sidebar_position: 4
---

# Call Recording

Call recording captures audio of conversations between callers and agents. Recordings are valuable for quality assurance, agent training, dispute resolution, and compliance. Exotel supports recording for both incoming and outgoing calls.

## How Call Recording Works

When recording is enabled, Exotel records the audio of the connected call leg (the conversation between two parties). The recording is stored securely on Exotel's servers and is accessible through the dashboard, API, and status callbacks.

```
Call Connected
    |
    v
Recording starts automatically
    |
    v
Call ends
    |
    v
Recording saved → URL available in:
    - Dashboard (Call Logs)
    - API (Call Details)
    - Status Callback (webhook)
```

## Enabling Call Recording

### Method 1: Via the Call Flow (Dashboard)

1. Open your call flow in the **App Bazaar**.
2. Click on the **Connect** applet.
3. In the applet settings, enable **Record Call**.
4. Save and publish the flow.

All calls routed through this Connect applet will now be recorded.

### Method 2: Via the API

When making outbound calls using the API, include the `Record` parameter:

```bash
curl -X POST 'https://<api_key>:<api_token>@api.exotel.com/v1/Accounts/<account_sid>/Calls/connect.json' \
  -d 'From=<agent_number>' \
  -d 'To=<customer_number>' \
  -d 'CallerId=<exophone>' \
  -d 'Record=true'
```

| Parameter | Value | Description |
|---|---|---|
| `Record` | `true` | Enable recording for this call |
| `Record` | `false` | Disable recording for this call |
| `RecordingChannels` | `single` | Record both parties in a single audio channel (default) |
| `RecordingChannels` | `dual` | Record each party in a separate audio channel |

See: [Connect Two Numbers API](/docs/voice-v1/api-reference/connect-two-numbers)

### Method 3: Account-Level Recording

Contact your Exotel account manager to enable recording by default for all calls on your account. This overrides per-flow and per-API settings.

## Accessing Recordings

### Via Dashboard

1. Go to **Call Logs** in the Exotel Dashboard.
2. Find the call you want to review.
3. Click the **Play** button to listen to the recording inline.
4. Click **Download** to save the recording as an audio file.

### Via API

Use the [Call Details API](/docs/voice-v1/api-reference/call-details) to fetch the recording URL:

```bash
curl 'https://<api_key>:<api_token>@api.exotel.com/v1/Accounts/<account_sid>/Calls/<call_sid>.json'
```

The response includes:

```json
{
  "Call": {
    "Sid": "call_sid_here",
    "RecordingUrl": "https://s3-ap-southeast-1.amazonaws.com/...",
    "Status": "completed",
    "Duration": "120"
  }
}
```

### Via Status Callback (Webhook)

If you have configured a [Status Callback URL](/docs/voice-v1/api-reference/status-callback), Exotel sends the recording URL in the callback payload when the call completes:

```
POST https://your-app.com/call-callback
Content-Type: application/x-www-form-urlencoded

CallSid=<call_sid>&RecordingUrl=<recording_url>&Status=completed
```

## Recording Storage

| Aspect | Details |
|---|---|
| **Format** | MP3 or WAV |
| **Storage location** | Exotel cloud (AWS S3) |
| **Default retention** | As per your plan (typically 30-90 days) |
| **Extended retention** | Available on enterprise plans |
| **Access control** | Secured with authentication; URLs are time-limited |
| **Download** | Available via dashboard or API |

:::warning
Recording URLs are time-limited for security. If you need to store recordings permanently, download them to your own storage within the retention period. Do not rely on Exotel URLs for long-term access.
:::

## Dual-Channel Recording

Standard recording captures both parties in a single audio channel. Dual-channel recording separates each party into its own channel, which is useful for:

- **Speech analytics** -- Analyze what the agent and customer said independently
- **Quality scoring** -- Evaluate agent performance without customer audio interference
- **Transcription** -- More accurate transcription when voices are separated

To enable dual-channel recording, set `RecordingChannels=dual` in the API call or contact Exotel support for flow-level configuration.

## Disabling Recording

### For Specific Calls

Set `Record=false` in the API call, or configure the Connect applet with recording disabled.

### Mid-Call Pause/Resume

For compliance scenarios where sensitive information (e.g., credit card numbers) should not be recorded, use the [Recording Control API](/docs/voice-api/api-reference/recording-control) to pause and resume recording mid-call:

```bash
# Pause recording
curl -X PUT 'https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/calls/<call_sid>/recording' \
  -d 'Status=paused'

# Resume recording
curl -X PUT 'https://<api_key>:<api_token>@api.exotel.com/v2/accounts/<account_sid>/calls/<call_sid>/recording' \
  -d 'Status=in-progress'
```

## Compliance Considerations

### Call Recording Consent

Recording laws vary by country and region. Common requirements include:

| Jurisdiction | Requirement |
|---|---|
| **India** | One-party consent (generally sufficient to inform one party) |
| **United States** | Varies by state -- some require all-party consent |
| **European Union** | GDPR requires informing the data subject and having a lawful basis |
| **Australia** | Generally requires informing all parties |

### Best Practices for Compliance

1. **Inform callers at the start of the call** -- Add a Greeting applet that says: "This call may be recorded for quality and training purposes."
2. **Provide an opt-out option** -- In some jurisdictions, callers must have the option to decline recording.
3. **Store recordings securely** -- If you download recordings to your own storage, encrypt them at rest and in transit.
4. **Define retention policies** -- Delete recordings after the required retention period.
5. **Restrict access** -- Only authorized personnel should access call recordings.

:::tip
Use the Greeting applet as the first step in every call flow to play a recording disclosure message. This ensures compliance regardless of which department the caller reaches.
:::

## Recording Quality

| Factor | Impact | Recommendation |
|---|---|---|
| **Network quality** | Poor mobile signal degrades audio | Use VoLTE or landline agents for critical calls |
| **Background noise** | Agent environment noise captured | Use headsets and quiet workspaces |
| **Audio format** | Higher quality takes more storage | MP3 is a good balance of quality and size |
| **Dual-channel** | Cleaner separation of voices | Use for analytics and transcription workloads |

## Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| No recording URL in callback | Recording not enabled | Check Connect applet or API `Record` parameter |
| Recording URL returns 403 | URL expired | Fetch a new URL from the API within retention period |
| Recording is blank or silent | Call was not answered | Recording only captures connected calls |
| Only one party audible | Network issue on one leg | Check agent network connectivity |
| Recording too short | Call duration was short | Verify call was fully connected before hangup |

## Related

- [Call Analytics](/docs/call-support/call-features/call-analytics)
- [Voice v1 API](/docs/voice-v1/overview)
- [Voice v2 API -- Recording Control](/docs/voice-api/api-reference/recording-control)
- [Call Details API](/docs/voice-v1/api-reference/call-details)
- [Status Callback](/docs/voice-v1/api-reference/status-callback)
