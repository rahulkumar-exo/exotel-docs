---
id: long-sms
title: Long SMS (Concatenated Messages)
description: "Understand how long SMS works on Exotel -- message concatenation, segment counting, character limits, and billing for multi-part messages."
sidebar_label: Long SMS
sidebar_position: 15
---

# Long SMS (Concatenated Messages)

When an SMS message exceeds the single-message character limit, it is automatically split into multiple segments that are reassembled on the recipient's device. This guide explains how concatenation works, how to count segments, and how it affects billing.

## How Concatenation Works

When a message is too long for a single SMS, Exotel automatically splits it into multiple segments. Each segment includes a User Data Header (UDH) that contains information for the recipient's phone to reassemble the segments in the correct order.

```
Long Message (320 characters, GSM-7)
        ↓
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ Segment 1 (153)  │  │ Segment 2 (153)  │  │ Segment 3 (14)   │
│ + UDH (7 bytes)  │  │ + UDH (7 bytes)  │  │ + UDH (7 bytes)  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
        ↓                     ↓                     ↓
   Delivered as 3 separate SMS, reassembled on the handset
```

The UDH consumes part of each segment's capacity, which is why the per-segment character limit is lower for concatenated messages than for a single SMS.

## Character Limits

### GSM-7 Encoding (Plain Text / English)

| Message Type | Character Limit |
|-------------|----------------|
| Single SMS | 160 characters |
| Concatenated segment | 153 characters per segment |

### UCS-2 Encoding (Unicode / Regional Languages)

| Message Type | Character Limit |
|-------------|----------------|
| Single SMS | 70 characters |
| Concatenated segment | 67 characters per segment |

## Segment Calculation

### GSM-7 (Plain Text)

| Characters | Segments |
|-----------|----------|
| 1-160 | 1 |
| 161-306 | 2 |
| 307-459 | 3 |
| 460-612 | 4 |
| 613-765 | 5 |
| 766-918 | 6 |
| 919-1071 | 7 |
| 1072-1224 | 8 |

**Formula:** For messages over 160 characters: `segments = ceil(characters / 153)`

### UCS-2 (Unicode)

| Characters | Segments |
|-----------|----------|
| 1-70 | 1 |
| 71-134 | 2 |
| 135-201 | 3 |
| 202-268 | 4 |
| 269-335 | 5 |
| 336-402 | 6 |
| 403-469 | 7 |
| 470-536 | 8 |

**Formula:** For messages over 70 characters: `segments = ceil(characters / 67)`

:::tip
Exotel supports a maximum of 10 concatenated segments per message. This means the maximum message length is 1,530 characters (GSM-7) or 670 characters (Unicode).
:::

## Segment Counting in Practice

### Example 1: English Message (GSM-7)

```
"Dear Rahul, your order #ORD12345 has been successfully placed.
Your estimated delivery date is January 25, 2025.
You can track your order at https://example.com/track/ORD12345.
If you have any questions, contact us at support@example.com."
```

- Character count: 248 characters
- Encoding: GSM-7
- Segments: ceil(248 / 153) = **2 segments**

### Example 2: Hindi Message (Unicode)

```
"प्रिय राहुल, आपका ऑर्डर #ORD12345 सफलतापूर्वक प्लेस हो गया है। अनुमानित डिलीवरी 25 जनवरी 2025 है।"
```

- Character count: 88 characters
- Encoding: UCS-2 (Unicode)
- Segments: ceil(88 / 67) = **2 segments**

### Example 3: Message with Extended GSM Characters

```
"Your balance is €500. Amount {deducted} = €50 | Remaining = €450 [Ref: TXN~123]"
```

- Extended characters: `€` (3 occurrences, 2 chars each), `{`, `}`, `|`, `[`, `]`, `~` (1 each, 2 chars each)
- Visible: 80 characters
- Encoded length: 80 + 3 (extra for €) + 6 (extra for extended chars) = 89 characters
- Segments: **1 segment** (under 160)

:::warning
Extended GSM-7 characters (`{ } [ ] | \ ~ ^ €`) count as 2 characters each. A message that appears to be under 160 characters may actually exceed the limit when these characters are present.
:::

## Billing for Long SMS

Each segment of a concatenated message is billed as a separate SMS unit. There is no discount for multi-segment messages.

| Scenario | Segments | Billed As |
|----------|----------|-----------|
| English message, 150 characters | 1 | 1 SMS |
| English message, 200 characters | 2 | 2 SMS |
| English message, 500 characters | 4 | 4 SMS |
| Hindi message, 60 characters | 1 | 1 SMS |
| Hindi message, 100 characters | 2 | 2 SMS |
| Hindi message, 200 characters | 3 | 3 SMS |

### Cost Impact

If your per-SMS rate is Rs. 0.20:

| Message | Segments | Cost |
|---------|----------|------|
| 160-character English SMS | 1 | Rs. 0.20 |
| 320-character English SMS | 3 | Rs. 0.60 |
| 70-character Hindi SMS | 1 | Rs. 0.20 |
| 140-character Hindi SMS | 3 | Rs. 0.60 |

See [SMS Pricing](/docs/sms-support/sms-pricing) for current per-segment rates.

## DLT Template Considerations

When registering DLT templates for long messages:

1. **Template length** -- DLT portals accept templates of any length, but keep in mind the segment billing impact.
2. **Variable placeholders** -- `{#var#}` placeholders are replaced with actual values when sending. The final message length (after variable substitution) determines the segment count, not the template length.
3. **Plan for variable lengths** -- If your template has variables like customer names or URLs, estimate the maximum possible message length to predict segment count.

### Example

Template:
```
Dear {#var#}, your order #{#var#} has been shipped via {#var#}.
Track at {#var#}. Expected delivery: {#var#}.
Contact us at {#var#} for any queries.
```

With short variables: ~180 characters = 2 segments
With long variables: ~250 characters = 2 segments
With very long URLs: ~350 characters = 3 segments

## Handling Long SMS in Your Application

### Pre-Send Segment Estimation

Calculate segments before sending to estimate costs:

```javascript
function countSegments(message, isUnicode) {
  const length = message.length;

  if (isUnicode) {
    if (length <= 70) return 1;
    return Math.ceil(length / 67);
  } else {
    // Account for extended GSM characters
    const extendedChars = /[|^{}[\]~\\€]/g;
    const extendedCount = (message.match(extendedChars) || []).length;
    const effectiveLength = length + extendedCount;

    if (effectiveLength <= 160) return 1;
    return Math.ceil(effectiveLength / 153);
  }
}
```

### Encoding Detection

```javascript
function isUnicodeRequired(message) {
  // GSM-7 basic character set regex
  const gsm7Regex = /^[@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞ\x1B !"#¤%&'()*+,\-.\/0-9:;<=>?¡A-ZÄÖÑÜa-zäöñüà]*$/;
  return !gsm7Regex.test(message);
}
```

## Delivery and Reassembly

- All segments are sent as individual SMS through the telecom operator.
- The recipient's phone uses the UDH to reassemble segments in the correct order.
- If one segment fails to deliver, the entire message may appear incomplete.
- Delivery reports are sent per-segment; monitor all segments for a complete picture.

:::note
Modern smartphones handle concatenated SMS seamlessly and display the full message as a single entity. However, very old phones or some feature phones may display each segment separately.
:::

## Best Practices

1. **Keep messages concise** -- Every extra segment doubles or triples your cost. Aim for single-segment messages where possible.
2. **Use URL shorteners** -- Long URLs inflate message length. Use Exotel's built-in URL shortening or a third-party shortener.
3. **Estimate with real data** -- Calculate segment counts using actual variable values, not template placeholders.
4. **Monitor segment usage** -- Track how many segments your messages typically consume and optimize templates to reduce them.
5. **Test on multiple devices** -- Verify that long messages are properly reassembled on different phone models and operating systems.
6. **Set character limit warnings** -- In your application's message composer, display real-time character counts and segment estimates.

## Next Steps

- [Unicode SMS](/docs/sms-support/unicode-sms) -- Multi-language SMS support
- [SMS Templates](/docs/sms-support/sms-templates) -- Template registration and management
- [SMS Pricing](/docs/sms-support/sms-pricing) -- Understand per-segment billing
- [SMS API Reference](/docs/sms-api/api-reference/send-sms) -- API documentation
