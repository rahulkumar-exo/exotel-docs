---
id: greeting-message
title: Greeting Messages
description: "Configure greeting messages in Exotel using text-to-speech, audio upload, and dynamic greetings for professional calls."
sidebar_label: Greeting Messages
sidebar_position: 13
---

# Greeting Messages

A greeting message is the first audio a caller hears when they dial your ExoPhone. It sets the tone for the call experience, provides essential information, and can serve compliance requirements such as call recording disclosure. Exotel supports multiple methods for creating greetings including audio file upload, text-to-speech (TTS), and dynamic greetings.

## Types of Greetings

| Type | Description | Best For |
|---|---|---|
| **Welcome greeting** | First message the caller hears | Brand identity, professionalism |
| **IVR prompt** | Menu options for caller navigation | Department routing |
| **Hold message** | Played while caller is in queue | Keeping callers informed |
| **Recording disclosure** | "This call may be recorded" | Legal compliance |
| **After-hours message** | Played outside business hours | Informing about availability |
| **Transfer message** | "Please hold while we transfer your call" | During call transfers |
| **Custom announcement** | Campaign-specific or seasonal messages | Promotions, alerts |

## Creating Greeting Messages

### Method 1: Upload Audio File

Upload a pre-recorded audio file for the highest quality greeting.

**File Requirements:**

| Property | Requirement |
|---|---|
| **Format** | WAV |
| **Sample rate** | 8000 Hz |
| **Channels** | Mono |
| **Bit depth** | 16-bit |
| **Max file size** | 5 MB |
| **Max duration** | No hard limit, but keep under 30 seconds |

**Steps:**

1. Record your greeting using professional recording software or a studio.
2. Convert the file to the required format (8000 Hz, Mono, WAV).
3. In the Exotel Dashboard, open your call flow.
4. Click on the **Greeting** applet.
5. Select **Upload Audio File**.
6. Upload your `.wav` file.
7. Preview the audio to verify quality.
8. Save and publish.

:::tip
Use a professional voice-over artist for customer-facing greetings. A polished greeting creates a strong first impression. Services like Fiverr or Voices.com offer affordable voice-over recording.
:::

**Converting Audio Format:**

If your recording is in a different format, convert it using FFmpeg:

```bash
ffmpeg -i input.mp3 -ar 8000 -ac 1 -sample_fmt s16 output.wav
```

### Method 2: Text-to-Speech (TTS)

Type a message and Exotel converts it to speech automatically.

**Steps:**

1. In the Greeting applet settings, select **Text-to-Speech**.
2. Type your greeting text.
3. Select the language and voice.
4. Preview the audio.
5. Save.

**Available Languages:**

| Language | Voices |
|---|---|
| English (India) | Male, Female |
| Hindi | Male, Female |
| Tamil | Female |
| Telugu | Female |
| Kannada | Female |
| Malayalam | Female |
| Bengali | Female |
| Marathi | Female |
| Gujarati | Female |

:::warning
TTS quality varies by language and voice. Always preview the audio before publishing. For customer-facing greetings, professional audio recordings are recommended over TTS.
:::

### Method 3: Record via Phone

Record the greeting by speaking into your phone.

**Steps:**

1. In the Greeting applet settings, select **Record via Phone**.
2. Enter the phone number Exotel should call.
3. Click **Call Me**.
4. When your phone rings, answer and speak your greeting.
5. Press `#` to end the recording.
6. Preview and save.

## Dynamic Greetings

Dynamic greetings change based on caller data, time of day, or other variables. This creates a personalized experience for each caller.

### Using the Passthru Applet

1. Add a **Passthru** applet before the Greeting applet.
2. The Passthru sends the caller's number to your server.
3. Your server returns the appropriate greeting URL or text.

```bash
# Exotel sends to your server:
POST https://your-app.com/get-greeting
CallSid=<call_sid>&From=<caller_number>

# Your server responds with a greeting URL:
{
  "greeting_url": "https://your-storage.com/greetings/vip-welcome.wav"
}
```

**Dynamic Greeting Examples:**

| Condition | Greeting |
|---|---|
| VIP customer | "Welcome back, Mr. Sharma. Let me connect you to your account manager." |
| New caller | "Welcome to Acme Corp. Let us help you find what you need." |
| Repeat caller (unresolved) | "Welcome back. We see you called earlier. Let us connect you to our priority support team." |
| Time-based | "Good morning/afternoon/evening, thank you for calling Acme Corp." |
| Campaign caller | "Thank you for responding to our special offer. Let me tell you more about it." |

### Personalized Greetings with Caller Name

If your CRM has the caller's name, you can generate a personalized TTS greeting:

```
Passthru → Your server looks up caller in CRM
    → Returns: "Welcome back, Priya. How can we help you today?"
    → Exotel plays the personalized greeting via TTS
```

## Greeting Message Examples

### Welcome Greeting

"Welcome to Acme Corporation. Your call is important to us."

### Recording Disclosure

"This call may be recorded for quality assurance and training purposes."

### IVR Prompt

"Press 1 for Sales, Press 2 for Customer Support, Press 3 for Billing, or Press 0 to speak to an operator."

### After-Hours

"Thank you for calling Acme Corp. Our office hours are Monday to Friday, 9 AM to 6 PM. Please leave a message after the beep and we will return your call on the next business day."

### Hold Message

"All our agents are currently busy. Please stay on the line and your call will be answered in the order it was received. Thank you for your patience."

### Holiday Greeting

"Season's greetings from Acme Corp! Our offices are closed for the holiday. We will return on January 2nd. For urgent inquiries, please email support@acme.com."

## Chaining Multiple Greetings

You can chain multiple Greeting applets in sequence to play different messages:

```
Greeting 1: "Welcome to Acme Corp."
    → Greeting 2: "This call may be recorded for quality purposes."
        → IVR Menu: "Press 1 for Sales, 2 for Support."
```

This is useful when you want to separate the welcome message from the compliance disclosure.

## Best Practices

- **Keep greetings under 15 seconds** -- Long greetings frustrate callers. Get to the point quickly.
- **State your company name** -- Confirm the caller has reached the right place.
- **Include recording disclosure** -- If you record calls, disclose it before the call is connected.
- **Use a professional tone** -- Match the tone to your brand (formal for finance, friendly for consumer products).
- **Avoid excessive options** -- In IVR prompts, limit options to 4-5 per menu level.
- **Update seasonally** -- Update greetings for holidays, special promotions, or temporary changes.
- **Test on different devices** -- Audio quality can vary between mobile phones and landlines. Test on both.
- **Use consistent voice** -- Use the same voice artist for all greetings across your flows to maintain brand consistency.

:::tip
Record a library of common greeting components (welcome, disclosure, hold message, after-hours) so you can mix and match them across different call flows without re-recording.
:::

## Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| Greeting not playing | Applet not connected in flow | Check the flow connections |
| Audio quality is poor | Wrong file format or sample rate | Convert to 8000 Hz Mono WAV |
| TTS sounds robotic | TTS engine limitations | Switch to uploaded audio file |
| Greeting too quiet | Recording volume too low | Re-record at higher volume or normalize audio |
| Caller hears silence | No audio file uploaded | Upload or record a greeting |
| Greeting plays twice | Two Greeting applets connected unintentionally | Review flow connections |

## Related

- [IVR Setup](/docs/call-support/call-features/ivr-setup)
- [Setting Up a Call Flow](/docs/call-support/call-features/setting-up-call-flow)
- [Voicemail](/docs/call-support/call-features/voicemail)
- [Business Hours](/docs/call-support/call-features/business-hours)
- [Flow Builder](/docs/call-support/advanced-features/flow-builder)
