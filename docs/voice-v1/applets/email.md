---
id: email
title: Email Applet
sidebar_label: Email
sidebar_position: 9
---

# Email Applet

The Email applet sends an email notification with call details when a call reaches this point in the flow. Use it to alert your team about incoming calls, missed calls, or voicemails.

## What Gets Emailed

The email includes details about the call:

- **Caller information** — The caller's phone number
- **Timestamps** — When the call was received
- **Agent details** — Which agent handled the call (if applicable)
- **Call outcome** — Whether the call was answered, missed, or went to voicemail
- **Voicemail status** — Whether a voicemail was left

## Configuration

1. In the Exotel Dashboard, open your call flow editor
2. Drag the **Email** applet into your flow
3. Enter the recipient email address(es)

## Example Flows

**Missed call notification:**
```
Incoming Call → Connect (to support)
             → (no answer) → Email (notify manager) → Voicemail
```

**Call summary:**
```
Incoming Call → Connect (to sales) → Email (send call details to CRM inbox)
```

## Best Practices

- Use Email applets after Connect failures to ensure missed calls are tracked
- Combine with [Voicemail](/docs/voice-v1/applets/voicemail) for a complete missed-call workflow
- Send emails to shared inboxes or ticketing systems for better tracking
