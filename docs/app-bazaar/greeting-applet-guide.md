---
id: greeting-applet-guide
title: Greeting Applet Guide
description: "Configure the Exotel Greeting applet to play recorded audio, uploaded files, or text-to-speech messages in your call flows."
sidebar_label: Greeting Applet
sidebar_position: 4
---

# Greeting Applet Guide

The Greeting applet plays an audio message to the caller. It is typically the first step in any call flow, used to welcome callers, provide information, announce recording consent, or play hold music before routing.

:::tip
For the API-level technical reference on the Greeting applet, see [Greeting Applet](/docs/voice-v1/applets/greeting).
:::

## When to Use the Greeting Applet

| Scenario | Example Message |
|----------|----------------|
| **Welcome message** | "Welcome to Acme Corp. Your call is important to us." |
| **Recording consent** | "This call may be recorded for quality and training purposes." |
| **Business hours announcement** | "Our office hours are Monday to Friday, 9 AM to 6 PM." |
| **After-hours message** | "We are currently closed. Please call back during business hours." |
| **Hold music** | Plays background music while the caller waits |
| **Account information** | "Your account balance is..." (using TTS with dynamic data) |
| **Promotional message** | "Check out our new product launch at acme.com" |

## Configuration

### Adding the Greeting Applet

1. In the [Flow Builder](/docs/app-bazaar/flow-builder-guide), drag the **Greeting** applet onto the canvas
2. Click the applet to open the Properties Panel
3. Select the audio source (see below)
4. Configure additional options
5. Click **Apply**

### Audio Source Options

| Source | How It Works | Best For |
|--------|-------------|----------|
| **Phone recording** | Exotel calls your phone; you record the greeting by speaking | Quick, natural-sounding greetings |
| **File upload** | Upload a pre-recorded audio file | Professionally produced audio |
| **Text-to-Speech (TTS)** | Enter text; the system generates speech | Dynamic messages, quick setup |

### Option 1: Phone Recording

1. Select **Record via Phone**
2. Enter your phone number
3. Click **Call Me**
4. Exotel calls you -- record your greeting when prompted
5. Press `#` when finished
6. Preview the recording and re-record if needed
7. Click **Save**

### Option 2: File Upload

1. Select **Upload File**
2. Click **Choose File** and select your audio file
3. Supported formats:

| Format | Sample Rate | Channels | Max Size |
|--------|------------|----------|----------|
| **WAV** | 8000 Hz | Mono | 5 MB |
| **MP3** | 8000 -- 44100 Hz | Mono or Stereo | 5 MB |

4. Preview the uploaded audio
5. Click **Save**

:::warning
Audio files must be in **8000 Hz Mono WAV** format for the best quality on phone networks. Files in other formats are automatically converted, which may reduce audio quality. Use an audio editor like Audacity to convert files before uploading.
:::

### Option 3: Text-to-Speech (TTS)

1. Select **Text-to-Speech**
2. Enter the text you want spoken
3. Select the **Language** and **Voice** (see TTS options below)
4. Click **Preview** to hear the generated speech
5. Adjust the text if needed
6. Click **Save**

#### Available TTS Languages

| Language | Voice Options | Notes |
|----------|--------------|-------|
| **English (India)** | Female, Male | Default for Indian accounts |
| **English (US)** | Female, Male | American English pronunciation |
| **Hindi** | Female, Male | Devanagari script supported |
| **Tamil** | Female | Regional language support |
| **Telugu** | Female | Regional language support |
| **Kannada** | Female | Regional language support |
| **Malayalam** | Female | Regional language support |
| **Bengali** | Female | Regional language support |

:::info
For advanced TTS configuration including SSML support and custom voices, see [TTS Configuration](/docs/advanced-config/tts-config).
:::

## Advanced Settings

| Setting | Default | Description |
|---------|---------|-------------|
| **Loop** | 1 | Number of times to play the greeting (set to 0 for infinite loop) |
| **Max Duration** | 120 seconds | Maximum total playback time before moving to next applet |
| **Allow DTMF Skip** | No | Allow the caller to press any key to skip the greeting |
| **Interruptible** | No | Whether DTMF input during greeting triggers the next IVR applet |

### Using Loop for Hold Music

To play continuous hold music while a caller waits:

1. Set **Loop** to `0` (infinite)
2. Upload a longer audio file (30 -- 60 seconds of music)
3. The music plays on repeat until the next applet (e.g., Connect) picks up

## Flow Design Patterns

### Welcome + IVR

```
Greeting ("Welcome to Acme Corp") ──► IVR (Press 1 for Sales...)
```

### Recording Consent + Support

```
Greeting ("This call is recorded") ──► Greeting ("Please hold") ──► Connect
```

### After-Hours Message

```
Passthru (check hours) ──► (after hours) Greeting ("We are closed") ──► Voicemail
                        ──► (business hours) Greeting ("Welcome") ──► Connect
```

### Sequential Announcements

Chain multiple Greeting applets for complex announcements:

```
Greeting (consent) ──► Greeting (promotion) ──► Greeting (hold music, looped) ──► Connect
```

## Audio Quality Best Practices

1. **Use 8000 Hz Mono WAV** -- This is the native format for telephone audio and produces the clearest results
2. **Keep recordings concise** -- Callers lose patience with long greetings; aim for under 15 seconds for welcome messages
3. **Speak clearly and at moderate pace** -- Phone compression can distort fast or mumbled speech
4. **Avoid background noise** -- Record in a quiet environment
5. **Test on a real phone** -- Audio that sounds good on computer speakers may sound different over a phone line
6. **Use professional recordings for customer-facing flows** -- Consider hiring a voice-over artist for production flows

## Troubleshooting

| Issue | Possible Cause | Resolution |
|-------|---------------|------------|
| No audio plays | Audio file not saved correctly | Re-upload the file and verify it plays in preview |
| Audio quality is poor | File not in 8000 Hz Mono WAV format | Convert the file to the correct format and re-upload |
| TTS sounds robotic | Default TTS engine quality | Try different voices or use a custom audio file instead |
| Greeting plays too many times | Loop count set too high | Set the loop count to 1 for single playback |
| Caller cannot skip greeting | "Allow DTMF Skip" is disabled | Enable the option in advanced settings |

## Related Topics

- [Greeting Applet API Reference](/docs/voice-v1/applets/greeting) -- Technical API details
- [IVR Applet Guide](/docs/app-bazaar/ivr-applet-guide) -- Build IVR menus after the greeting
- [TTS Configuration](/docs/advanced-config/tts-config) -- Advanced text-to-speech settings
- [Flow Builder Guide](/docs/app-bazaar/flow-builder-guide) -- Visual flow design
