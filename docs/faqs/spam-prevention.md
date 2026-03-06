---
title: Anti-Spam & Bulk Limits
description: "Exotel anti-spam policies, bulk calling and SMS limits, TRAI penalties for spam, and best practices to avoid account suspension."
sidebar_label: Spam Prevention
sidebar_position: 17
---

# Anti-Spam & Bulk Limits

Exotel enforces anti-spam measures to protect recipients, maintain telecom quality, and ensure compliance with TRAI regulations. This guide covers bulk limits, spam detection, penalties, and best practices to keep your account in good standing.

---

## Account Rate Limits

Exotel applies default rate limits to all accounts to prevent abuse and ensure platform stability:

### Voice Call Limits

| Limit | Default | Enterprise |
|-------|---------|-----------|
| Outbound calls per minute | 60 | Custom (up to 500+) |
| Concurrent calls | Plan-dependent | Custom |
| API requests per minute | 200 | Custom |
| Campaign contacts (per campaign) | 5,000 (inline) / 1,00,000 (CSV) | Custom |

### SMS Limits

| Limit | Default | Enterprise |
|-------|---------|-----------|
| SMS per minute | 300 | Custom (up to 5,000+) |
| API requests per minute | 200 | Custom |
| Campaign contacts | 1,00,000 (static) / 5,00,000 (dynamic) | Custom |

### WhatsApp Limits

| Limit | Default | Notes |
|-------|---------|-------|
| Messages per second | Tier-based | Increases with quality rating |
| Template messages per day | Meta-defined | Based on business verification status |

:::info
To increase your rate limits, contact your account manager or **hello@exotel.com** with your expected volumes and use case. Capacity increases are reviewed and approved based on account history and compliance record.
:::

---

## Spam Detection

Exotel and telecom operators monitor for spam patterns. The following behaviors may trigger spam detection:

### Voice Spam Indicators

| Pattern | Risk Level | Description |
|---------|-----------|-------------|
| High call volume to DND numbers | High | Indicates list quality issues or intentional DND violation |
| Very short call duration (< 5 sec) | Medium | May indicate robo-calling or flash calls |
| Extremely high retry rate | Medium | Aggressive retries annoy recipients |
| Calls outside 9 AM -- 9 PM (promotional) | High | Regulatory violation |
| High complaint rate | High | Recipients reporting unsolicited calls |
| Consistent call drops after connect | Medium | May indicate pre-recorded spam |

### SMS Spam Indicators

| Pattern | Risk Level | Description |
|---------|-----------|-------------|
| DLT template mismatch (high rate) | High | Indicates incorrect or abusive template use |
| High DND rejection rate | Medium | List not properly scrubbed |
| Sending outside promotional hours | High | Regulatory violation |
| High undelivered rate | Medium | Poor list quality or invalid numbers |
| Content flagged by operator | High | Message content violates operator policies |

---

## TRAI Penalties for Spam

TRAI imposes escalating penalties for spam violations:

| Violation Level | Trigger | Consequence |
|----------------|---------|-------------|
| **Level 1** | 1-5 complaints in a month | Warning from operator |
| **Level 2** | 6 complaints in a month | Temporary disconnection (up to 7 days) |
| **Level 3** | 7+ complaints in a month | Disconnection for up to 2 years |
| **Financial penalty** | Per violation | Up to INR 1,000 per complaint per day |

:::warning
TRAI penalties apply to your business, not to Exotel. A single campaign that generates multiple complaints can quickly escalate to Level 2 or Level 3 consequences. Monitor your complaint rate closely and stop campaigns that generate complaints.
:::

---

## Exotel Account Compliance

### Account Health Indicators

Exotel monitors account health and may take action based on the following:

| Metric | Healthy | Warning | Action Threshold |
|--------|---------|---------|-----------------|
| DND complaint rate | < 0.1% | 0.1 -- 0.5% | > 0.5% |
| SMS delivery rate | > 92% | 80 -- 92% | < 80% |
| Call connect rate | > 30% | 15 -- 30% | < 15% |
| DLT rejection rate | < 5% | 5 -- 15% | > 15% |

### Consequences of Non-Compliance

| Severity | Action |
|----------|--------|
| Warning | Email notification with compliance recommendations |
| Temporary restriction | Reduced rate limits or campaign pausing |
| Account suspension | Account access disabled pending investigation |
| Account termination | Permanent account closure for severe violations |

---

## Best Practices to Avoid Spam Flags

### Contact List Hygiene

1. **Scrub against DND/NDNC registry** before every campaign
2. **Remove invalid numbers** (disconnected, out of format)
3. **Remove contacts who opted out** of your communications
4. **Do not purchase contact lists** from third parties
5. **Validate consent records** for all promotional communications
6. **Regularly clean stale data** (contacts not updated in 6+ months)

### Campaign Configuration

1. **Use correct campaign types** (`trans` for transactional, `promo` for promotional)
2. **Schedule within allowed hours** (9 AM -- 9 PM for promotional)
3. **Limit retry attempts** to 2-3 maximum
4. **Use reasonable retry intervals** (15+ minutes between attempts)
5. **Set appropriate throttle rates** (do not max out capacity unnecessarily)
6. **Test with small batches first** before full-scale campaigns

### Message Content

1. **Include your business identity** in every message
2. **Provide opt-out instructions** in promotional SMS
3. **Do not use misleading sender IDs** or content
4. **Match DLT templates exactly** for SMS campaigns
5. **Keep IVR greetings concise and professional**
6. **State the call purpose within the first 5 seconds**

### Monitoring and Response

1. **Monitor campaign reports** for unusual failure patterns
2. **Track DND complaint rates** in your dashboard
3. **Respond to complaints promptly** (within 48 hours)
4. **Pause campaigns with high complaint rates** immediately
5. **Review and adjust** campaigns based on reporting data
6. **Maintain compliance documentation** (consent records, opt-out logs)

---

## Opt-Out Management

### SMS Opt-Out

Include opt-out instructions in every promotional SMS:

```
Reply STOP to unsubscribe from future messages.
```

When a recipient replies STOP:

1. Record the opt-out request with timestamp
2. Remove the contact from all promotional lists within 7 days
3. Do not send further promotional messages to this number
4. Transactional messages (OTPs, order updates) may still be sent

### Voice Call Opt-Out

Provide opt-out during IVR flows:

```
Press 9 to be removed from our calling list.
```

Process opt-out requests the same way as SMS opt-outs.

---

## Reporting Abuse

If you receive spam through Exotel or notice abuse of the platform:

- Email **abuse@exotel.com** with details
- Include the sender's phone number, message content, and timestamp
- Exotel investigates and takes appropriate action

---

## Frequently Asked Questions

### Can I increase my rate limits for a specific campaign?

Yes. Contact your account manager before the campaign with your expected volume, use case, and campaign timeline. Temporary capacity increases can be provisioned for specific campaigns.

### What happens if my account is suspended for spam?

Contact **hello@exotel.com** immediately. Provide compliance documentation (consent records, campaign details, corrective actions). Exotel reviews your case and may reinstate your account with conditions.

### Are transactional messages subject to spam limits?

Transactional messages have less restrictive limits but are still monitored. Abusing transactional routes for promotional content will result in penalties and potential account action.

### How do I check my current complaint rate?

Monitor your complaint rate in the Exotel dashboard under **Analytics > Compliance** or contact your account manager for a compliance report.

---

## Related Resources

- [TRAI Regulations](/docs/faqs/trai-regulations) -- Indian telecom regulatory framework
- [NDNC/DND](/docs/faqs/ndnc-dnd) -- Do Not Call registry compliance
- [TCCCPR 2018](/docs/faqs/tcccpr-2018) -- Commercial communication regulations
- [Campaign Best Practices](/docs/campaign-guides/campaign-best-practices) -- Optimize campaigns for compliance
