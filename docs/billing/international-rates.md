---
id: international-rates
title: International Rates
description: "Exotel international calling and SMS rates organized by country and zone, with rate lookup and cost optimization guidance."
sidebar_label: International Rates
sidebar_position: 8
---

# International Rates

Exotel supports international voice calls and SMS to over 200 countries. International rates vary by destination country, call type, and your plan. This guide explains how international billing works and provides rate references by zone.

## How International Billing Works

International calls and SMS are billed at destination-specific rates that are separate from your domestic rate card. Key differences from domestic billing:

| Aspect | Domestic | International |
|--------|----------|---------------|
| **Voice pulse duration** | 60 seconds (standard) | 60 seconds (standard) |
| **Per-pulse rate** | Plan-based flat rate | Varies by destination country |
| **SMS rate** | Flat per-message rate | Varies by destination country |
| **Caller ID** | ExoPhone number displayed | May be modified by destination carrier |
| **Call quality** | Domestic routing | International routing via carrier partners |

:::info
International calling must be enabled on your account. Contact your account manager or raise a support ticket to activate international calling capabilities.
:::

## Rate Zones

Exotel organizes international destinations into zones for simplified rate management:

### Zone 1 -- South Asia

| Country | Voice (per pulse, INR) | SMS (per message, INR) |
|---------|----------------------|----------------------|
| Bangladesh | 3.00 -- 5.00 | 1.50 -- 2.50 |
| Sri Lanka | 4.00 -- 6.00 | 1.50 -- 2.50 |
| Nepal | 3.50 -- 5.50 | 1.50 -- 2.50 |
| Pakistan | 4.00 -- 6.00 | 2.00 -- 3.00 |
| Bhutan | 4.00 -- 6.00 | 2.00 -- 3.00 |

### Zone 2 -- Southeast Asia

| Country | Voice (per pulse, INR) | SMS (per message, INR) |
|---------|----------------------|----------------------|
| Singapore | 2.50 -- 4.00 | 1.00 -- 2.00 |
| Malaysia | 3.00 -- 5.00 | 1.50 -- 2.50 |
| Indonesia | 3.50 -- 5.50 | 1.50 -- 2.50 |
| Thailand | 3.00 -- 5.00 | 1.50 -- 2.50 |
| Philippines | 4.00 -- 6.00 | 2.00 -- 3.00 |
| Vietnam | 3.50 -- 5.50 | 1.50 -- 2.50 |

### Zone 3 -- Middle East

| Country | Voice (per pulse, INR) | SMS (per message, INR) |
|---------|----------------------|----------------------|
| UAE | 3.00 -- 5.00 | 1.00 -- 2.00 |
| Saudi Arabia | 4.00 -- 6.00 | 1.50 -- 2.50 |
| Qatar | 4.00 -- 6.00 | 1.50 -- 2.50 |
| Oman | 5.00 -- 7.00 | 2.00 -- 3.00 |
| Kuwait | 4.00 -- 6.00 | 1.50 -- 2.50 |
| Bahrain | 4.00 -- 6.00 | 1.50 -- 2.50 |

### Zone 4 -- North America & Europe

| Country | Voice (per pulse, INR) | SMS (per message, INR) |
|---------|----------------------|----------------------|
| United States | 2.00 -- 3.50 | 1.00 -- 2.00 |
| Canada | 2.00 -- 3.50 | 1.00 -- 2.00 |
| United Kingdom | 2.50 -- 4.00 | 1.00 -- 2.00 |
| Germany | 3.00 -- 5.00 | 1.50 -- 2.50 |
| France | 3.00 -- 5.00 | 1.50 -- 2.50 |
| Australia | 3.00 -- 5.00 | 1.50 -- 2.50 |

### Zone 5 -- Africa & Others

| Country | Voice (per pulse, INR) | SMS (per message, INR) |
|---------|----------------------|----------------------|
| South Africa | 4.00 -- 6.00 | 2.00 -- 3.00 |
| Kenya | 5.00 -- 8.00 | 2.50 -- 4.00 |
| Nigeria | 5.00 -- 8.00 | 2.50 -- 4.00 |
| Egypt | 5.00 -- 7.00 | 2.00 -- 3.00 |

:::warning
Rates shown are indicative ranges and may vary based on your plan, volume commitments, and the specific carrier route. Always check your account dashboard or contact your account manager for your exact rates.
:::

## Checking Your Exact Rates

### Via Dashboard

1. Log in to [my.exotel.com](https://my.exotel.com)
2. Navigate to **Billing** > **Rate Card**
3. Select **International** tab
4. Search by country name or country code
5. View your per-pulse voice rate and per-SMS rate for that destination

### Via Account Manager

For enterprise accounts with custom international rate cards, contact your account manager for:

- Complete rate card in Excel format
- Country-specific routing options (premium vs. standard routes)
- Volume discount eligibility for international destinations

## International Call Behavior

### Caller ID Display

| Scenario | What the Recipient Sees |
|----------|------------------------|
| **Standard international call** | Your ExoPhone number or a generic international prefix |
| **Country-specific CLI** | A local number in the destination country (where available) |
| **CLI restricted** | "International" or "Unknown" depending on the destination carrier |

:::info
Caller ID display for international calls depends on the destination country's regulations and the terminating carrier's policies. Not all countries support full CLI pass-through.
:::

### International Call Quality

Exotel partners with multiple international carriers to ensure reliable call quality:

| Route Type | Quality | Rate |
|-----------|---------|------|
| **Premium** | Highest quality, direct carrier interconnects | Higher per-pulse rate |
| **Standard** | Good quality, multi-hop routing | Standard per-pulse rate |
| **CLI route** | Displays your number to the recipient | Premium rate applies |
| **Non-CLI route** | May show "Unknown" to recipient | Standard rate |

## International SMS Considerations

### Sender ID

- International SMS sender IDs are subject to destination country regulations
- Some countries require pre-registered alphanumeric sender IDs
- Others may override your sender ID with a short code or long code

### Character Encoding

- GSM-7 encoding (standard Latin characters): 160 characters per SMS
- UCS-2 encoding (Unicode, non-Latin scripts): 70 characters per SMS
- Concatenated messages are billed as multiple SMS units

### Country-Specific Restrictions

| Country | Restriction |
|---------|-------------|
| **China** | Requires pre-approved templates and sender registration |
| **UAE** | Marketing SMS requires prior recipient consent |
| **Saudi Arabia** | Sender ID registration mandatory |
| **United States** | 10DLC registration required for A2P messaging |

## Cost Optimization for International Usage

1. **Use premium routes selectively** -- Reserve premium routes for critical business calls where call quality and CLI display are essential
2. **Batch international SMS** -- Send international SMS in batches to qualify for volume discounts
3. **Consider WhatsApp** -- For countries with high SMS costs, WhatsApp Business API may be more cost-effective for customer communication
4. **Monitor usage patterns** -- Review international usage reports monthly to identify optimization opportunities
5. **Negotiate enterprise rates** -- If your international volume exceeds 10,000 pulses/month, request an [enterprise rate card](/docs/billing/enterprise-billing)

## Enabling International Calling

International calling is not enabled by default. To activate:

1. Raise a support ticket or contact your account manager
2. Specify the countries you need to reach
3. Choose your preferred route type (premium or standard)
4. International calling is typically activated within 24 -- 48 hours

## Related Topics

- [Pricing Model](/docs/billing/pricing-model) -- Domestic pricing structure
- [Enterprise Billing](/docs/billing/enterprise-billing) -- Custom international rate cards
- [Voice API](/docs/voice-api/getting-started/overview) -- Making international calls via the API
- [SMS API](/docs/sms-api/overview) -- Sending international SMS via the API
