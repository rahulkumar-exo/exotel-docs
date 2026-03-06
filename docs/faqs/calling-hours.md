---
title: Calling Hour Restrictions
description: "Understand India's 9 AM to 9 PM commercial calling hour restrictions under TRAI regulations and how to configure Exotel campaigns accordingly."
sidebar_label: Calling Hours
sidebar_position: 14
---

# Calling Hour Restrictions

India's TRAI regulations restrict unsolicited commercial communication to specific hours. This guide covers the rules, how they apply to different communication types, and how to configure your Exotel campaigns for compliance.

---

## The 9 AM -- 9 PM Rule

TRAI's TCCCPR 2018 mandates that unsolicited commercial communication (UCC) can only be made between **9:00 AM and 9:00 PM Indian Standard Time (IST)**.

| Communication Type | Allowed Hours | Timezone |
|-------------------|--------------|----------|
| Promotional voice calls | 9:00 AM -- 9:00 PM | IST (+05:30) |
| Promotional SMS | 9:00 AM -- 9:00 PM | IST (+05:30) |
| Transactional voice calls | 24/7 | Not restricted |
| Transactional SMS | 24/7 | Not restricted |
| Service messages (implicit/explicit) | 24/7 | Not restricted |

:::warning
Exotel does not automatically enforce calling hour restrictions at the API level. It is your responsibility to configure campaign schedules within the permitted window. Violations can result in TRAI penalties and potential service suspension.
:::

---

## What Counts as Unsolicited Commercial Communication?

| Communication | Classified As | Time Restricted? |
|--------------|--------------|-----------------|
| Marketing offers and promotions | UCC | Yes (9 AM -- 9 PM) |
| Product announcements | UCC | Yes |
| Survey and feedback calls | UCC | Yes |
| Promotional contest notifications | UCC | Yes |
| Appointment reminders | Transactional | No |
| OTP and verification codes | Transactional | No |
| Order status and shipping updates | Transactional | No |
| Payment confirmations and receipts | Transactional | No |
| Account alerts and notifications | Transactional | No |
| Emergency and safety notifications | Transactional | No |

:::info
The classification depends on the content of the communication, not your intent. If the primary purpose is to promote a product or service, it is considered commercial communication regardless of the context.
:::

---

## Configuring Campaign Schedules

### Voice Campaign Schedule for Compliance

```json
"schedule": {
  "send_at": "2024-02-01T09:00:00+05:30",
  "end_at": "2024-02-01T21:00:00+05:30"
}
```

### Recommended Windows by Campaign Type

| Campaign Purpose | Recommended Start | Recommended End | Notes |
|-----------------|-------------------|-----------------|-------|
| B2B promotional | 10:00 AM IST | 6:00 PM IST | Business hours for best connect rate |
| B2C promotional | 10:00 AM IST | 8:00 PM IST | Avoid the edges of the allowed window |
| Transactional alerts | Any time | Any time | Schedule based on business event triggers |
| Appointment reminders | 9:00 AM IST | 7:00 PM IST | During reasonable hours for best experience |
| Emergency notifications | Any time | Any time | Send immediately when triggered |

### Buffer Recommendation

Add a buffer to the end of your scheduled window to account for in-progress calls and retries:

| Scenario | Recommended End Time |
|----------|---------------------|
| Campaign with no retries | 8:45 PM IST (15-minute buffer) |
| Campaign with 1 retry at 15-min interval | 8:30 PM IST |
| Campaign with 2 retries at 15-min intervals | 8:15 PM IST |
| Campaign with 3 retries at 15-min intervals | 8:00 PM IST |

:::tip
Setting `end_at` to 9:00 PM exactly risks in-progress calls extending past the permitted window. Set your end time at least 15 minutes before 9:00 PM to ensure all calls complete within the allowed hours.
:::

---

## Multi-Timezone Considerations

If your contacts span multiple time zones, the 9 AM -- 9 PM restriction applies to the **recipient's local time** as a best practice, even though TRAI technically applies IST.

### India-Focused Campaigns

India has a single timezone (IST, UTC+05:30), so all contacts within India follow the same 9 AM -- 9 PM window.

### International Campaigns

For campaigns targeting countries outside India, be aware of local regulations:

| Country / Region | Calling Hours Regulation | Notes |
|-----------------|-------------------------|-------|
| India | 9 AM -- 9 PM IST (TRAI mandate) | Applies to all commercial calls |
| Singapore | No specific regulation | Follow business etiquette (9 AM -- 6 PM SGT) |
| Malaysia | No specific regulation | Follow business etiquette |
| UAE | No specific regulation | Avoid Friday prayer hours |
| US | 8 AM -- 9 PM recipient's local time (TCPA) | Per-state rules may also apply |
| UK | No specific hours | ICO guidelines recommend reasonable hours |

For detailed international calling information, see [International Calling](/docs/faqs/international-calling).

---

## Enforcement and Penalties

### How Violations Are Detected

1. **Consumer complaints**: Recipients report violations through the TRAI DND app or their operator
2. **Operator monitoring**: Telecom operators can monitor call and SMS timing
3. **Audit trails**: DLT records include timestamps of all commercial SMS

### Penalties for Calling Hour Violations

| Violation | Consequence |
|-----------|------------|
| First occurrence | Warning from operator |
| Repeated violations | Fines as per TRAI regulations |
| Persistent non-compliance | Temporary suspension of telecom resources |
| Severe violations | Disconnection of services for up to 2 years |

---

## Best Practices

1. **Always set explicit schedules**: Never rely on default (immediate) for promotional campaigns
2. **Use RFC 3339 with timezone**: Always include `+05:30` offset for IST
3. **Add end-time buffers**: Set `end_at` 15-30 minutes before 9 PM
4. **Test with transactional first**: Use transactional campaigns for testing (not time-restricted)
5. **Monitor call completion times**: Verify through reports that no calls extended past 9 PM
6. **Document your scheduling logic**: Maintain records showing compliance intent

---

## Frequently Asked Questions

### Can I call at 9:00 PM exactly?

Technically, 9:00 PM falls within the 9 AM -- 9 PM window. However, if a call placed at 9:00 PM rings for 30 seconds and connects at 9:00:30 PM, the conversation extends past 9 PM. To be safe, avoid initiating calls in the last 15 minutes of the window.

### Do calling hour restrictions apply to IVR calls (no live agent)?

Yes. The restriction applies to all unsolicited commercial communication, regardless of whether it involves a live agent, a pre-recorded message, or an IVR system.

### Are reminder calls considered commercial communication?

It depends on the content. An appointment reminder for an existing service is transactional. However, if the reminder also promotes a new service or product, it may be classified as commercial.

### What about calls that the customer requested?

Calls explicitly requested by the customer (e.g., callback requests) are not considered unsolicited and are not subject to the 9 AM -- 9 PM restriction.

---

## Related Resources

- [TRAI Regulations](/docs/faqs/trai-regulations) -- Overview of India's telecom regulations
- [TCCCPR 2018](/docs/faqs/tcccpr-2018) -- Full commercial communication regulations
- [Campaign Scheduling](/docs/campaign-guides/campaign-scheduling) -- Configure campaign time windows
- [Best Practices](/docs/campaign-guides/campaign-best-practices) -- Campaign optimization strategies
