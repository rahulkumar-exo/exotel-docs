---
title: International Calling Regulations
description: "International calling regulations and restrictions for Exotel users. Supported countries, dialing formats, rates, and compliance considerations."
sidebar_label: International Calling
sidebar_position: 15
---

# International Calling Regulations

Exotel supports international voice calls and SMS to selected countries. This guide covers supported destinations, dialing formats, regulatory requirements, and pricing considerations for international communication.

---

## Supported Regions

Exotel primarily serves businesses in India and Southeast Asia. International calling availability depends on your account region and plan:

| Exotel Region | Primary Coverage | International Support |
|--------------|-----------------|---------------------|
| India (Mumbai) | India | Outbound international calls to select countries |
| Singapore | Singapore, Malaysia, Middle East | Regional and international calls |

:::info
International calling is available on specific plans and may require activation by your account manager. Contact **hello@exotel.com** to enable international calling on your account.
:::

---

## Dialing Format

All international calls and SMS must use the E.164 phone number format:

```
+[country_code][number]
```

| Country | Country Code | Example Number |
|---------|-------------|----------------|
| India | +91 | +919876543210 |
| Singapore | +65 | +6591234567 |
| Malaysia | +60 | +60123456789 |
| UAE | +971 | +971501234567 |
| Saudi Arabia | +966 | +966501234567 |
| United States | +1 | +12025551234 |
| United Kingdom | +44 | +447911123456 |
| Australia | +61 | +61412345678 |

:::warning
Do not include trunk prefixes (leading zeros used for domestic dialing) when making international calls. For example, use `+447911123456` (not `+4407911123456`) for UK mobile numbers.
:::

---

## International Voice Calls

### Making International Calls via API

```bash
curl -u '<api_key>:<api_token>' -X POST "https://api.exotel.com/v2/accounts/<account_sid>/calls/connect" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+919876543210",
    "to": "+6591234567",
    "caller_id": "0XXXXXX4890",
    "url": "http://my.exotel.com/<account_sid>/exoml/start_voice/<app_id>"
  }'
```

### Call Quality Considerations

| Factor | Impact | Recommendation |
|--------|--------|---------------|
| Network routing | International calls route through multiple carriers | Expect slightly higher latency than domestic |
| Codec selection | Call quality depends on codec negotiation | Exotel uses standard codecs (G.711, G.729) |
| Caller ID display | International caller IDs may not display correctly | Some countries suppress foreign caller IDs |
| Call connection time | International routing adds setup time | Allow 5-10 seconds additional ring time |

---

## International SMS

### Sending International SMS

```bash
curl -u '<api_key>:<api_token>' -X POST "https://api.exotel.com/v2/accounts/<account_sid>/sms/send" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+6591234567",
    "body": "Your verification code is 456789. Valid for 5 minutes.",
    "sender_id": "EXOTL"
  }'
```

### DLT Requirements for International SMS

| Scenario | DLT Required? |
|----------|--------------|
| SMS from India to India | Yes (mandatory) |
| SMS from India to international | DLT may still apply for the originating leg |
| SMS from Singapore region | DLT not required (India-specific regulation) |

:::info
When sending international SMS from an Indian Exotel account, DLT registration may still be required because the message originates from Indian telecom infrastructure. Confirm with your account manager for specific routing details.
:::

---

## Country-Specific Regulations

### India (TRAI)

| Rule | Details |
|------|---------|
| Commercial calling hours | 9 AM -- 9 PM IST |
| DND/NDNC | Mandatory filtering for promotional |
| DLT registration | Required for all SMS |
| Call recording consent | Recommended (play consent message) |

### Singapore (IMDA)

| Rule | Details |
|------|---------|
| Do Not Call (DNC) | Singapore has its own DNC registry |
| SMS sender ID | Registration may be required under SSIR |
| Spam Act | Spam Control Act governs commercial messages |
| Calling hours | No specific mandate, but follow business etiquette |

### Malaysia (MCMC)

| Rule | Details |
|------|---------|
| Personal Data Protection Act (PDPA) | Consent required for commercial communication |
| Calling hours | No specific mandate |
| SMS registration | Subject to MCMC regulations |

### UAE (TRA)

| Rule | Details |
|------|---------|
| Commercial SMS | Requires approval from the Telecommunications Regulatory Authority |
| VoIP restrictions | Some VoIP services may be restricted |
| Data residency | Certain data must remain within UAE |

### United States (FCC/FTC)

| Rule | Details |
|------|---------|
| TCPA | Telephone Consumer Protection Act restricts automated calls |
| Calling hours | 8 AM -- 9 PM recipient's local time |
| Do Not Call | FTC National Do Not Call Registry |
| SMS consent | Express written consent required for marketing SMS |

---

## International Calling Rates

International call and SMS rates vary by destination country and are typically higher than domestic rates.

### How Rates Are Structured

| Component | Description |
|-----------|-------------|
| Per-minute rate | Charged per pulse (varies by destination) |
| Connection fee | Some destinations have a one-time connection charge |
| SMS rate | Per-message rate (varies by destination) |

:::tip
Check your current international rates in **Dashboard > Settings > Billing > Rate Card** or contact your account manager for the latest pricing. Rates are subject to change based on carrier agreements.
:::

### Cost Management for International Campaigns

1. **Estimate costs before launch**: Calculate estimated costs based on contact count and destination rates
2. **Use SMS where possible**: International SMS is often cheaper than voice calls
3. **Limit retries**: International retry attempts compound costs quickly
4. **Monitor spending**: Set up balance alerts to track international campaign costs

---

## Caller ID for International Calls

| Scenario | Caller ID Behavior |
|----------|-------------------|
| India to India | ExoPhone number displayed normally |
| India to international | May display ExoPhone or may be suppressed by destination carrier |
| Singapore to regional | ExoPhone number displayed normally |
| International to India | Subject to Indian carrier display rules |

:::warning
Many international carriers suppress or modify foreign caller IDs. Recipients may see a generic number, "Unknown," or a local proxy number instead of your ExoPhone. This behavior is controlled by the destination carrier and cannot be changed by Exotel.
:::

---

## Best Practices for International Communication

1. **Verify number format**: Always use E.164 format with country code
2. **Test before bulk campaigns**: Send test calls/SMS to verify routing and quality
3. **Check destination regulations**: Research local telecom laws before running campaigns
4. **Use appropriate language**: Match message language to the recipient's country
5. **Account for time zones**: Schedule campaigns during the recipient's business hours
6. **Monitor delivery rates**: International delivery rates may be lower than domestic
7. **Plan for higher costs**: International rates are significantly higher; budget accordingly

---

## Frequently Asked Questions

### Can I use an Indian ExoPhone to call international numbers?

Yes, if international calling is enabled on your account. The ExoPhone will be used as the originating number, but the caller ID displayed to the international recipient may vary.

### Can I purchase international phone numbers through Exotel?

Exotel primarily offers Indian and select Southeast Asian virtual numbers. For specific international number requirements, contact your account manager to discuss availability.

### Are international SMS subject to Indian DLT regulations?

When originating from an Indian Exotel account, DLT parameters may be required because the message passes through Indian telecom infrastructure. Check with Exotel support for your specific routing configuration.

---

## Related Resources

- [TRAI Regulations](/docs/faqs/trai-regulations) -- Indian telecom regulations
- [Calling Hours](/docs/faqs/calling-hours) -- Calling hour restrictions
- [Regions & Availability](/docs/getting-started/regions-availability) -- Exotel service regions
- [Voice API](/docs/voice-api/getting-started/overview) -- Voice API reference
