---
id: unicode-sms
title: Unicode SMS
description: "Send multi-language SMS using Unicode encoding on Exotel -- character limits, encoding types, Hindi and regional language support."
sidebar_label: Unicode SMS
sidebar_position: 14
---

# Unicode SMS

Unicode SMS allows you to send messages in non-Latin scripts including Hindi, Tamil, Telugu, Bengali, Marathi, and other regional Indian languages. This guide covers encoding types, character limits, and how to send Unicode messages through Exotel.

## What Is Unicode SMS?

Standard SMS uses GSM-7 encoding, which supports 160 characters from the basic Latin alphabet, digits, and common symbols. Unicode (UCS-2) encoding supports characters from virtually all languages and scripts, but reduces the character limit per segment.

| Encoding | Characters Supported | Single SMS Limit | Concatenated Segment Limit |
|----------|---------------------|-------------------|---------------------------|
| **GSM-7 (Plain)** | English, digits, basic symbols | 160 characters | 153 characters |
| **UCS-2 (Unicode)** | All languages, emojis, special symbols | 70 characters | 67 characters |

:::tip
If your message contains even a single Unicode character (e.g., a Hindi letter or an emoji), the entire message switches to UCS-2 encoding, reducing the character limit. Plan your template length accordingly.
:::

## GSM-7 Character Set

The GSM-7 encoding supports the following characters without triggering Unicode mode:

**Standard characters (1 character each):**

Letters A-Z, a-z; digits 0-9; and symbols: `@ $ _ ! " # % & ' ( ) * + , - . / : ; < = > ? space`

**Extended characters (2 characters each):**

`| ^ { } [ ] ~ \ €`

:::warning
Extended GSM-7 characters like `{`, `}`, `[`, `]`, `\`, `~`, `^`, `|`, and the Euro sign (€) consume 2 character positions each. Account for this when calculating message length.
:::

## When to Use Unicode

Use Unicode encoding when your message contains:

- **Regional Indian languages** -- Hindi (Devanagari), Tamil, Telugu, Kannada, Malayalam, Bengali, Gujarati, Marathi, Odia, Punjabi (Gurmukhi)
- **Arabic, Chinese, Japanese, Korean** -- Any non-Latin script
- **Special symbols** -- Characters outside the GSM-7 set
- **Emojis** -- All emoji characters require Unicode encoding

### Examples

**Hindi (Devanagari):**
```
आपका OTP 123456 है। इसे किसी के साथ साझा न करें।
```

**Tamil:**
```
உங்கள் OTP 123456. யாரிடமும் பகிர வேண்டாம்.
```

**Mixed (Hindi + English):**
```
Dear ग्राहक, आपका order #12345 ship हो गया है।
```

## Sending Unicode SMS via API

Set the `EncodingType` parameter to `unicode` when sending via the [Send SMS API](/docs/sms-api/api-reference/send-sms):

```bash
curl -X POST "https://<api_key>:<api_token>@api.exotel.com/v1/Accounts/<account_sid>/Sms/send" \
  -d "From=EXOTL" \
  -d "To=+919876543210" \
  -d "Body=आपका OTP 123456 है। इसे किसी के साथ साझा न करें।" \
  -d "DltEntityId=1234567890123" \
  -d "DltTemplateId=1107160000000012345" \
  -d "EncodingType=unicode"
```

:::warning
You must set `EncodingType=unicode` explicitly. If you send Unicode content with `EncodingType=plain` (the default), the non-Latin characters may be garbled or the message may fail.
:::

### Via the Dashboard

1. Navigate to **App Bazaar** > **SMS** > **Send SMS**.
2. Select your sender ID.
3. Choose a Unicode-approved DLT template.
4. Enter or paste your message in the regional language.
5. The dashboard automatically detects Unicode content and sets the encoding.

## Character Counting

### Single SMS

| Encoding | Max Characters |
|----------|---------------|
| GSM-7 | 160 |
| Unicode | 70 |

### Concatenated (Long) SMS

When a message exceeds the single SMS limit, it is split into segments. Each segment reserves space for a concatenation header:

| Encoding | Segment 1 | Segment 2+ | Characters per Segment |
|----------|-----------|------------|----------------------|
| GSM-7 | 153 usable | 153 usable | 153 per segment |
| Unicode | 67 usable | 67 usable | 67 per segment |

### Segment Calculation Examples

| Message Length (Unicode) | Segments | Billing Units |
|-------------------------|----------|---------------|
| 1-70 characters | 1 | 1 |
| 71-134 characters | 2 | 2 |
| 135-201 characters | 3 | 3 |
| 202-268 characters | 4 | 4 |

For detailed information on concatenated messaging, see [Long SMS](/docs/sms-support/long-sms).

## DLT Templates for Unicode

When registering templates on the DLT portal for Unicode messages:

### Step 1: Select Unicode Content Type

When creating the template on the DLT portal:

1. Go to **Templates** > **Add New Template**.
2. Set **Content Type** to **Unicode**.
3. Enter the template body in the regional language.
4. Use `{#var#}` for variable placeholders, just like plain-text templates.

### Step 2: Template Example

```
प्रिय {#var#}, आपका ऑर्डर #{#var#} शिप कर दिया गया है। ट्रैक करें: {#var#}
```

### Step 3: Submit for Approval

Submit the Unicode template for DLT approval. Approval timelines are the same as plain-text templates (1-3 business days).

:::tip
Register both a plain-text and a Unicode version of important templates. This gives you flexibility to send in English or regional languages depending on the customer's preference.
:::

## Encoding Detection

Exotel provides automatic encoding detection in the dashboard, but when using the API, you should explicitly set the encoding type:

| Scenario | Recommended `EncodingType` |
|----------|---------------------------|
| English-only message | `plain` |
| Hindi, Tamil, or other regional language | `unicode` |
| Mixed English and regional | `unicode` |
| Message with emojis | `unicode` |

## Billing

Unicode SMS is billed per segment, the same as plain-text SMS. However, because Unicode messages have lower character limits per segment, a message of equal length costs more in Unicode:

| Message | GSM-7 Segments | Unicode Segments |
|---------|---------------|-----------------|
| 100 characters (English) | 1 | 2 |
| 150 characters (English) | 1 | 3 |
| 50 characters (Hindi) | N/A | 1 |
| 100 characters (Hindi) | N/A | 2 |

See [SMS Pricing](/docs/sms-support/sms-pricing) for per-segment rates.

## Best Practices

1. **Keep Unicode messages short** -- With only 70 characters per segment, every character counts. Keep messages concise.
2. **Always set EncodingType** -- Explicitly set `EncodingType=unicode` in API calls to avoid encoding errors.
3. **Register Unicode DLT templates** -- Ensure your DLT templates are registered with the Unicode content type.
4. **Test thoroughly** -- Test Unicode messages on multiple devices and operators to verify correct rendering.
5. **Calculate segments beforehand** -- Use the character count to estimate billing before sending large campaigns.
6. **Avoid mixing scripts unnecessarily** -- Mixing English and regional scripts in the same message still triggers Unicode encoding for the entire message.
7. **Provide language preference** -- Where possible, store and respect customer language preferences to send messages in their preferred language.

## Common Issues

| Issue | Cause | Resolution |
|-------|-------|------------|
| Garbled characters | `EncodingType` not set to `unicode` | Set `EncodingType=unicode` in the API call |
| Message too long | Unicode character limit exceeded | Shorten the message or split into multiple messages |
| Template mismatch | DLT template registered as plain text | Re-register the template with Unicode content type |
| Higher billing | Unicode uses more segments | Shorten messages to reduce segment count |

## Next Steps

- [Long SMS](/docs/sms-support/long-sms) -- Understand concatenated SMS and segment billing
- [SMS Templates](/docs/sms-support/sms-templates) -- Register Unicode templates
- [SMS Pricing](/docs/sms-support/sms-pricing) -- Per-segment pricing
- [SMS API Reference](/docs/sms-api/api-reference/send-sms) -- API documentation
