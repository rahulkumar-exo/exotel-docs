---
id: voicemail
title: Voicemail
description: "Set up voicemail in Exotel for recording caller messages, email notifications, voicemail transcription, and playback."
sidebar_label: Voicemail
sidebar_position: 12
---

# Voicemail

Voicemail lets callers leave a recorded message when agents are unavailable, busy, or outside business hours. Exotel stores the voicemail recording and can notify your team via email, webhook, or dashboard alert so they can follow up promptly.

## How Voicemail Works

```
Caller reaches Connect applet → All agents busy / no answer
        |
        v
Voicemail applet triggers
        |
        v
Greeting: "Please leave a message after the beep."
        |
        v
Beep → Caller records message → Caller hangs up (or presses #)
        |
        v
Recording saved → Notification sent (email, webhook)
```

## Setting Up Voicemail

### Step 1: Add the Voicemail Applet

1. Open your call flow in **App Bazaar**.
2. Drag the **Voicemail** applet onto the canvas.
3. Connect it to the appropriate output of your Connect applet:
   - **No Answer** output: When agents do not pick up
   - **Busy** output: When all agents are busy
   - **After-Hours** flow: When outside business hours

### Step 2: Configure the Voicemail Greeting

The voicemail greeting is played before the caller begins recording. Configure it in the Voicemail applet settings:

| Option | Description |
|---|---|
| **Record via phone** | Exotel calls you to record the greeting |
| **Upload audio** | Upload a pre-recorded `.wav` file (8000 Hz, Mono) |
| **Text-to-Speech** | Type a message and Exotel converts it to speech |
| **Default greeting** | Use Exotel's built-in voicemail greeting |

**Example greeting text:**
"We are sorry we missed your call. Please leave your name, phone number, and a brief message after the beep, and we will get back to you as soon as possible."

### Step 3: Configure Recording Settings

| Setting | Description | Recommended Value |
|---|---|---|
| **Max recording duration** | Maximum length of the voicemail | 60-120 seconds |
| **Silence timeout** | End recording after this duration of silence | 5 seconds |
| **End key** | Key the caller presses to end recording | `#` |
| **Beep** | Play a beep before recording starts | Enabled |

### Step 4: Configure Notifications

Set up how your team is notified about new voicemails:

#### Email Notification

1. In the Voicemail applet settings, enable **Email Notification**.
2. Enter the email addresses to notify (e.g., support@yourcompany.com).
3. The email includes:
   - Caller's phone number
   - Date and time of the voicemail
   - Duration of the recording
   - A link to play or download the recording

#### Webhook Notification

1. Add an HTTP callback URL in the Voicemail settings.
2. Exotel sends a POST request when a voicemail is recorded:

```bash
POST https://your-app.com/voicemail-webhook
Content-Type: application/x-www-form-urlencoded

CallSid=<call_sid>&From=<caller_number>&RecordingUrl=<url>&Duration=<seconds>
```

3. Your application can:
   - Create a follow-up task in your CRM
   - Send a Slack notification to the team
   - Add the caller to a callback queue

### Step 5: Connect Follow-Up Applets

After the voicemail recording, you can chain additional applets:

```
Voicemail
    → Email (notify support team)
    → SMS (to caller: "We received your message and will call back soon.")
    → Hangup
```

## Accessing Voicemails

### Via Dashboard

1. Go to **Call Logs** in the Exotel Dashboard.
2. Filter by calls with voicemail recordings.
3. Click **Play** to listen to the voicemail inline.
4. Click **Download** to save the recording.

### Via API

Use the [Call Details API](/docs/voice-v1/api-reference/call-details) to retrieve the voicemail recording URL:

```bash
curl 'https://<api_key>:<api_token>@api.exotel.com/v1/Accounts/<account_sid>/Calls/<call_sid>.json'
```

The `RecordingUrl` field contains the voicemail audio URL.

### Via Email

If email notifications are configured, each voicemail triggers an email with a playback link.

## Voicemail Transcription

Convert voicemail audio to text so your team can quickly read the message without listening to the full recording.

### How Transcription Works

1. After the voicemail is recorded, Exotel's speech-to-text engine transcribes the audio.
2. The transcription is included in the email notification and webhook payload.
3. Transcriptions are also available in the dashboard call log.

:::tip
Voicemail transcription saves agents significant time. Instead of listening to a 2-minute voicemail, they can read the key points in seconds and prioritize callbacks accordingly.
:::

### Enabling Transcription

Contact your Exotel account manager to enable voicemail transcription for your account. Transcription availability depends on your plan and the languages supported.

| Language | Transcription Support |
|---|---|
| English (India) | Available |
| Hindi | Available |
| Other regional languages | Contact Exotel for availability |

## Voicemail Flow Examples

### Basic Voicemail (After No Answer)

```
Greeting ("Welcome to Acme Corp")
    → Connect (Agent group, 20s timeout)
        → Answered: Call connected
        → No Answer: Voicemail → Email → Hangup
        → Busy: Voicemail → Email → Hangup
```

### Voicemail with Callback Confirmation

```
Greeting ("Welcome to Acme Corp")
    → Connect (Agent group, 20s timeout)
        → No Answer:
            Voicemail
                → SMS to caller ("We received your message. We will call you back within 1 hour.")
                → Email to team
                → Hangup
```

### After-Hours Voicemail

```
Business Hours Check
    → Outside hours:
        Greeting ("Our office is closed. Hours are 9 AM to 6 PM, Monday to Friday.")
            → Greeting ("Please leave a message after the beep.")
                → Voicemail → Email → Hangup
```

### Voicemail with Department Selection

```
IVR ("Press 1 for Sales voicemail, 2 for Support voicemail")
    → 1: Voicemail (Sales greeting) → Email (sales@company.com)
    → 2: Voicemail (Support greeting) → Email (support@company.com)
```

## Voicemail Metrics

| Metric | Description |
|---|---|
| **Total voicemails** | Number of voicemails received in a period |
| **Average duration** | Average length of voicemail recordings |
| **Callback rate** | Percentage of voicemails followed up with a callback |
| **Response time** | Average time from voicemail to callback |
| **Repeat callers** | Callers who leave multiple voicemails (indicating unresolved issues) |

## Best Practices

- **Keep the greeting short** -- A 10-15 second greeting is ideal. Long greetings frustrate callers and increase hangups.
- **Ask for key information** -- Prompt the caller to leave their name, number, and reason for calling.
- **Set a reasonable max duration** -- 60-120 seconds is sufficient for most voicemails. Longer recordings rarely contain useful additional information.
- **Follow up promptly** -- Aim to call back within 1 hour during business hours. Include this promise in your greeting.
- **Enable transcription** -- Transcriptions help your team triage voicemails quickly.
- **Send confirmation SMS** -- Let callers know their message was received and a callback is expected.
- **Monitor voicemail volume** -- High voicemail volumes indicate insufficient staffing or long hold times. Address the root cause.

:::warning
Voicemail should be a fallback, not the primary call handling method. If a significant percentage of calls go to voicemail, review your staffing, queue configuration, and business hours to ensure callers can reach a live agent more often.
:::

## Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| Voicemail not triggering | Applet not connected to No Answer/Busy output | Wire the outputs correctly in the flow |
| No greeting before recording | Greeting not configured in Voicemail applet | Add a greeting message |
| Recording too short | Silence timeout too aggressive | Increase silence timeout to 5-7 seconds |
| Email notification not received | Email address incorrect or in spam | Verify email and check spam folder |
| Recording URL expired | Retention period passed | Download recordings within retention period |
| Transcription not available | Feature not enabled on account | Contact Exotel support |

## Related

- [Greeting Message](/docs/call-support/call-features/greeting-message)
- [Business Hours](/docs/call-support/call-features/business-hours)
- [Call Forwarding](/docs/call-support/call-features/call-forwarding)
- [Call Queue](/docs/call-support/call-features/call-queue)
- [Missed Call Solution](/docs/call-support/call-features/missed-call)
- [Call Recording](/docs/call-support/call-features/call-recording)
