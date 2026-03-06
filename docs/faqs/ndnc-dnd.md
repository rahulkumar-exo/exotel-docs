---
title: NDNC/DND Compliance
description: "Understand India's National Do Not Call registry and DND compliance for Exotel voice campaigns and SMS. Filtering, categories, and penalties."
sidebar_label: NDNC / DND
sidebar_position: 11
---

# NDNC/DND Compliance

The National Do Not Call (NDNC) registry, also referred to as DND (Do Not Disturb), is a TRAI-mandated system that allows Indian consumers to opt out of receiving unsolicited commercial communication. Compliance with NDNC is mandatory for all businesses making commercial calls or sending promotional SMS in India.

---

## What is NDNC/DND?

NDNC is a centralized database maintained by Indian telecom operators where consumers can register their preference to not receive commercial calls and messages. When a consumer registers for DND, their phone number is flagged, and businesses are required to exclude these numbers from promotional communication.

### How Consumers Register for DND

Consumers can register for DND by:

1. Sending an SMS `START DND` to `1909` from their mobile
2. Calling `1909` from their registered number
3. Using the TRAI DND mobile app
4. Registering through their telecom operator's website

---

## DND Preference Categories

Consumers can choose to block all commercial communication or selectively block specific categories:

| Category Code | Category | Examples |
|--------------|----------|----------|
| 0 | **Fully blocked** | All commercial communication blocked |
| 1 | Real Estate | Property listings, construction offers |
| 2 | Education | Courses, training, admissions |
| 3 | Health | Health products, wellness services |
| 4 | Consumer Goods & Automobiles | Product offers, vehicle promotions |
| 5 | Communication / Broadcasting | Media subscriptions, entertainment |
| 6 | Banking / Insurance / Financial | Loans, insurance, investment offers |
| 7 | Tourism & Leisure | Travel deals, hotel offers |

### Category-Based Filtering

If a consumer selects specific categories (e.g., blocks categories 1, 2, and 3), they still receive commercial communication from non-blocked categories (4, 5, 6, 7).

| Consumer Preference | Receives Category 6 (Banking)? | Receives Category 1 (Real Estate)? |
|--------------------|---------------------------------|-------------------------------------|
| Fully blocked (0) | No | No |
| Blocked: 1, 2, 3 only | Yes | No |
| No DND registered | Yes | Yes |

---

## Impact on Exotel Campaigns

### Voice Campaigns

| Campaign Type | DND Impact |
|--------------|------------|
| Promotional voice calls | DND-registered numbers are blocked |
| Transactional voice calls | Generally allowed (appointment reminders, payment alerts) |
| Service calls to existing customers | Allowed with implicit consent |

### SMS Campaigns

| SMS Route | DND Impact |
|-----------|------------|
| Promotional SMS (`promo`) | DND-registered numbers are blocked by the operator |
| Transactional SMS (`trans`) | Delivered regardless of DND status |
| Service Implicit (`si`) | Partially affected; depends on category preference |
| Service Explicit (`se`) | Partially affected; depends on category preference |

:::info
Transactional messages (OTPs, order updates, account alerts) are exempt from DND filtering because they are considered essential communications, not commercial solicitations. However, you must not abuse the transactional route for promotional content.
:::

---

## How Exotel Handles DND Filtering

### Automatic DND Filtering

Exotel integrates with the NDNC database and provides DND filtering at multiple stages:

1. **At contact upload**: Numbers can be checked against the NDNC registry when uploaded to a contact list
2. **At campaign execution**: Numbers are filtered in real time before calls are placed or SMS are sent
3. **In reporting**: DND-filtered contacts are flagged in campaign reports

### DND Filtering in Campaign Reports

DND-filtered contacts appear in your campaign reports with specific status codes:

| Status | Description |
|--------|-------------|
| `dnd_filtered` | Number is on the NDNC registry; call/SMS was not attempted |
| `dnd_category_blocked` | Number has blocked the specific communication category |

---

## Scrubbing Your Contact Lists

Before running a promotional campaign, scrub your contact list against the NDNC registry:

### Pre-Campaign DND Check

1. Upload your contact list to Exotel
2. Exotel automatically checks numbers against the NDNC database
3. DND numbers are flagged in the upload report
4. When the campaign runs, flagged numbers are automatically skipped

### DND Scrub Freshness

The NDNC registry is updated regularly. Numbers can be added to or removed from DND at any time:

| Consideration | Recommendation |
|--------------|---------------|
| DND registrations take effect | Within 7 days of consumer request |
| DND deregistrations take effect | Within 7 days of consumer request |
| List freshness | Re-scrub contact lists that are more than 7 days old |

:::tip
For recurring campaigns, re-scrub your contact list before each campaign run. A number that was not on DND last week may have been registered since then.
:::

---

## Handling DND Complaints

If a consumer files a DND complaint against your communication:

### Complaint Process

1. Consumer files a complaint through their operator or the TRAI DND app
2. The operator investigates and may contact Exotel
3. Exotel forwards the complaint details to your account
4. You must respond with evidence of consent or compliance within the stipulated timeframe

### Protecting Your Account

| Practice | How |
|----------|-----|
| Maintain consent records | Keep records of when and how each contact provided consent |
| Use correct campaign types | Ensure transactional content uses transactional routes only |
| Honor opt-out requests | Process unsubscribe requests promptly |
| Monitor complaint rates | Track DND complaints in your account dashboard |
| Document everything | Store consent timestamps, communication logs, and opt-out records |

:::warning
A high volume of DND complaints can result in your Sender ID being blacklisted, your ExoPhones being suspended, or financial penalties from TRAI. Take every complaint seriously and maintain thorough consent documentation.
:::

---

## DND Exemptions

Certain types of communication are exempt from DND filtering:

| Exempt Communication | Condition |
|---------------------|-----------|
| Transactional messages | Must be genuinely transactional (OTPs, alerts, updates) |
| Government communications | Authorized government notifications |
| Emergency services | Public safety and emergency alerts |
| Existing customer service | Communication related to an existing business relationship (with implicit consent) |

:::warning
Misusing transactional routes to send promotional content is a serious violation. Telecom operators monitor for this and may blacklist your Entity ID or Sender ID if promotional content is detected on transactional routes.
:::

---

## Best Practices for DND Compliance

1. **Always set the correct campaign type**: Use `promo` for promotional and `trans` for transactional
2. **Pre-scrub contact lists**: Filter DND numbers before every campaign
3. **Maintain consent records**: Document explicit consent with timestamps
4. **Provide opt-out mechanisms**: Include unsubscribe instructions in promotional SMS
5. **Monitor DND complaint rates**: Review complaints regularly in your dashboard
6. **Train your team**: Ensure marketing and sales teams understand DND obligations
7. **Audit regularly**: Periodic compliance audits prevent violations

---

## Frequently Asked Questions

### Can I call a DND number if the person is my existing customer?

You can make service-related calls (transactional) to existing customers even if they are on DND. However, you cannot make promotional calls. The communication must be directly related to your existing business relationship.

### How quickly does DND registration take effect?

DND registration typically takes effect within 7 days of the consumer's request. During this transition period, the number may still receive commercial communication.

### Can a consumer unregister from DND?

Yes. Consumers can deactivate DND by sending `STOP DND` to `1909` or through the TRAI DND app. Deactivation also takes up to 7 days.

### Does DND apply to WhatsApp messages?

TRAI's DND regulations primarily apply to traditional SMS and voice calls through telecom operators. WhatsApp Business messages follow Meta's own policies and are not directly subject to NDNC filtering. However, WhatsApp has its own anti-spam measures.

---

## Related Resources

- [TRAI Regulations](/docs/faqs/trai-regulations) -- Overview of India's telecom regulations
- [DLT Compliance](/docs/faqs/dlt-compliance) -- SMS registration requirements
- [TCCCPR 2018](/docs/faqs/tcccpr-2018) -- Customer preference regulations
- [Spam Prevention](/docs/faqs/spam-prevention) -- Anti-spam rules and limits
- [Calling Hours](/docs/faqs/calling-hours) -- Commercial calling hour restrictions
