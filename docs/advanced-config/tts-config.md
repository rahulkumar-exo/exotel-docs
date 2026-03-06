---
id: tts-config
title: Text-to-Speech Configuration
description: "Configure Exotel text-to-speech with multiple languages, voice options, SSML support, and speech customization for call flows."
sidebar_label: TTS Config
sidebar_position: 7
---

# Text-to-Speech Configuration

Text-to-Speech (TTS) converts written text into spoken audio during call flows. Instead of pre-recording messages, you can type the text and have the system generate speech automatically. This is especially useful for dynamic messages that change frequently or include personalized data.

## How TTS Works in Exotel

TTS is used within the [Greeting applet](/docs/app-bazaar/greeting-applet-guide) and [IVR applet](/docs/app-bazaar/ivr-applet-guide):

1. You enter text in the applet's TTS configuration
2. When a call reaches the applet, Exotel's TTS engine converts the text to audio in real time
3. The generated audio is played to the caller
4. The call flow continues to the next applet

```
Text input ("Welcome to Acme Corp") ──► TTS Engine ──► Audio played to caller
```

## Available Languages and Voices

### Indian Languages

| Language | Language Code | Female Voice | Male Voice |
|----------|-------------|-------------|-----------|
| **English (India)** | `en-IN` | Yes | Yes |
| **Hindi** | `hi-IN` | Yes | Yes |
| **Tamil** | `ta-IN` | Yes | -- |
| **Telugu** | `te-IN` | Yes | -- |
| **Kannada** | `kn-IN` | Yes | -- |
| **Malayalam** | `ml-IN` | Yes | -- |
| **Bengali** | `bn-IN` | Yes | -- |
| **Marathi** | `mr-IN` | Yes | -- |
| **Gujarati** | `gu-IN` | Yes | -- |
| **Punjabi** | `pa-IN` | Yes | -- |

### International Languages

| Language | Language Code | Female Voice | Male Voice |
|----------|-------------|-------------|-----------|
| **English (US)** | `en-US` | Yes | Yes |
| **English (UK)** | `en-GB` | Yes | Yes |
| **Arabic** | `ar-XA` | Yes | Yes |
| **Malay** | `ms-MY` | Yes | -- |

:::info
Language and voice availability may vary. Check the Exotel dashboard for the most current list of supported languages and voices for your account.
:::

## Configuring TTS in Applets

### Basic TTS Setup

1. In the [Flow Builder](/docs/app-bazaar/flow-builder-guide), click on a Greeting or IVR applet
2. Select **Text-to-Speech** as the audio source
3. Enter the text you want spoken
4. Select the **Language** from the dropdown
5. Select the **Voice** (female or male)
6. Click **Preview** to hear the generated speech
7. Click **Apply** to save

### Configuration Options

| Setting | Description | Default |
|---------|-------------|---------|
| **Language** | The language for speech generation | English (India) |
| **Voice** | The voice persona (female/male) | Female |
| **Speed** | Speech rate (slow, normal, fast) | Normal |
| **Pitch** | Voice pitch (low, normal, high) | Normal |

## SSML Support (Enterprise)

Speech Synthesis Markup Language (SSML) provides fine-grained control over how text is spoken. Enterprise accounts can use SSML tags to customize pronunciation, pauses, emphasis, and more.

### Supported SSML Tags

| Tag | Purpose | Example |
|-----|---------|---------|
| `<speak>` | Root element (required) | `<speak>Hello</speak>` |
| `<break>` | Insert a pause | `<break time="500ms"/>` |
| `<emphasis>` | Emphasize a word | `<emphasis level="strong">important</emphasis>` |
| `<prosody>` | Control rate, pitch, volume | `<prosody rate="slow">Please listen</prosody>` |
| `<say-as>` | Control how text is interpreted | `<say-as interpret-as="telephone">9876543210</say-as>` |
| `<sub>` | Substitute pronunciation | `<sub alias="Exotel">EXOTL</sub>` |
| `<p>` | Paragraph (adds natural pause) | `<p>First paragraph.</p><p>Second.</p>` |
| `<s>` | Sentence (adds brief pause) | `<s>First sentence.</s><s>Second.</s>` |

### SSML Examples

#### Reading a Phone Number

```xml
<speak>
  Your reference number is
  <say-as interpret-as="telephone">4412345678</say-as>.
</speak>
```

The TTS engine reads each digit individually instead of treating it as a large number.

#### Adding Pauses

```xml
<speak>
  Welcome to Acme Corporation.
  <break time="1s"/>
  Please select from the following options.
  <break time="500ms"/>
  Press 1 for Sales.
  <break time="300ms"/>
  Press 2 for Support.
</speak>
```

#### Controlling Speed and Pitch

```xml
<speak>
  <prosody rate="slow" pitch="+10%">
    Your order has been confirmed.
  </prosody>
  <break time="500ms"/>
  <prosody rate="medium">
    The delivery will arrive by tomorrow.
  </prosody>
</speak>
```

#### Spelling Out Text

```xml
<speak>
  Your booking code is
  <say-as interpret-as="characters">ABCD1234</say-as>.
</speak>
```

#### Reading Currency

```xml
<speak>
  Your account balance is
  <say-as interpret-as="currency">INR 5000.50</say-as>.
</speak>
```

### Prosody Attributes

| Attribute | Values | Effect |
|-----------|--------|--------|
| **rate** | `x-slow`, `slow`, `medium`, `fast`, `x-fast`, or percentage (e.g., `+20%`) | Speech speed |
| **pitch** | `x-low`, `low`, `medium`, `high`, `x-high`, or semitones (e.g., `+2st`) | Voice pitch |
| **volume** | `silent`, `x-soft`, `soft`, `medium`, `loud`, `x-loud`, or dB (e.g., `+6dB`) | Speech volume |

### Say-As Interpret Types

| Type | Description | Input Example | Spoken As |
|------|-------------|---------------|-----------|
| `cardinal` | Number as quantity | `123` | "one hundred twenty three" |
| `ordinal` | Number as ordinal | `3` | "third" |
| `characters` | Spell out each character | `ABC` | "A B C" |
| `telephone` | Phone number format | `9876543210` | "nine eight seven six five four three two one zero" |
| `date` | Date reading | `2024-01-15` | "January fifteenth, twenty twenty-four" |
| `currency` | Currency amount | `INR 500` | "five hundred Indian rupees" |

## Dynamic TTS with Passthru

Combine TTS with the [Passthru applet](/docs/app-bazaar/passthru-applet-guide) to generate personalized messages:

```
Passthru (fetch customer data) ──► Greeting (TTS: "Hello {CustomerName}, your order {OrderID} is on the way")
```

Your server returns the customer name and order ID, which are inserted into the TTS text before speech generation.

## TTS Best Practices

1. **Keep messages concise** -- Long TTS messages sound monotonous; break them into shorter segments
2. **Use natural phrasing** -- Write text as you would speak it, not as you would write it
3. **Add pauses** -- Use `<break>` tags between sections for a more natural feel
4. **Spell out abbreviations** -- Write "rupees" instead of "INR" unless using SSML `say-as`
5. **Test with real callers** -- Listen to TTS output over a phone line, not just in preview
6. **Consider pre-recorded audio** -- For critical customer-facing greetings, professional voice recordings sound better than TTS
7. **Use appropriate language** -- Match the TTS language to your caller demographics

## Troubleshooting

| Issue | Possible Cause | Resolution |
|-------|---------------|------------|
| TTS not playing | Applet not configured correctly | Verify text and language settings |
| Wrong pronunciation | Language mismatch | Select the correct language for the text |
| Numbers read incorrectly | TTS interprets as quantity | Use SSML `say-as` to control interpretation |
| Robotic sound quality | Default TTS engine | Consider upgrading to premium voices (Enterprise) |
| SSML not working | SSML not enabled on account | Contact account manager to enable SSML support |

## Related Topics

- [Greeting Applet Guide](/docs/app-bazaar/greeting-applet-guide) -- Using TTS in greetings
- [IVR Applet Guide](/docs/app-bazaar/ivr-applet-guide) -- TTS for IVR prompts
- [Passthru Applet Guide](/docs/app-bazaar/passthru-applet-guide) -- Dynamic data for TTS
- [Flow Builder Guide](/docs/app-bazaar/flow-builder-guide) -- Building flows with TTS applets
