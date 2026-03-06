---
id: template-guidelines
title: WhatsApp Template Guidelines
description: "WhatsApp template approval and rejection guidelines -- what gets approved, common rejection reasons, and best practices for compliance."
sidebar_label: Template Guidelines
sidebar_position: 12
---

# WhatsApp Template Guidelines

Meta reviews every WhatsApp message template before it can be used. Understanding the approval criteria helps you create templates that pass review on the first submission. This guide covers what gets approved, what gets rejected, and best practices for compliance.

## Meta's Review Process

When you submit a template, Meta's review system performs:

1. **Automated checks** -- Policy filters scan for prohibited content, formatting issues, and compliance violations.
2. **Manual review** (if flagged) -- A human reviewer evaluates the template for context, intent, and guideline adherence.
3. **Decision** -- The template is either approved, rejected, or flagged for clarification.

Review typically takes minutes to 24 hours. Templates that require manual review may take up to 3 business days.

## What Gets Approved

Templates are approved when they:

| Criteria | Details |
|----------|---------|
| Clear purpose | The template has a specific, legitimate business use |
| Correct category | Template is categorized accurately (utility, auth, marketing) |
| Compliant content | No prohibited content or policy violations |
| Proper formatting | Parameters are numbered sequentially, body is within limits |
| Realistic samples | Sample values clearly demonstrate the template's use |
| Customer value | The message provides value to the recipient |

### Approved Template Characteristics

- **Specific and actionable** -- Tells the customer exactly what happened or what to do
- **Properly categorized** -- Utility for transactions, authentication for OTPs, marketing for promotions
- **Respectful of user time** -- Concise, relevant, and not overly frequent
- **Includes opt-out** -- Marketing templates include unsubscribe instructions
- **Professional tone** -- Business-appropriate language

## What Gets Rejected

### Content Policy Violations

| Violation | Example | Rule |
|-----------|---------|------|
| Threatening language | "Your account will be deleted if you don't respond" | No threats or intimidation |
| Misleading content | "You've won a prize!" (when no prize exists) | No false or deceptive claims |
| Prohibited products | Templates promoting alcohol, tobacco, weapons, adult content | No regulated substance promotion |
| Personal data requests | "Reply with your Aadhaar number" | No requests for sensitive personal data |
| Password requests | "Please share your password for verification" | Never ask for credentials |
| Phishing indicators | Mimicking bank or government communications | No impersonation |

### Formatting Issues

| Issue | Example | Fix |
|-------|---------|-----|
| Non-sequential parameters | Body uses `{{1}}`, `{{3}}` (skips `{{2}}`) | Number parameters sequentially |
| Excessive parameters | Body is mostly parameters with little static text | Add more static context |
| Body too long | Exceeds 1,024 characters | Shorten the message |
| Missing sample values | Parameters submitted without example values | Provide realistic samples |
| Incorrect category | Marketing content submitted as Utility | Choose the correct category |

### Category-Specific Rejection Reasons

#### Utility Templates

| Rejection Reason | Description |
|------------------|-------------|
| Promotional content | Contains offers, discounts, or marketing language |
| No transactional context | Not related to a specific customer transaction |
| Generic notifications | Too vague to be considered transactional |

#### Authentication Templates

| Rejection Reason | Description |
|------------------|-------------|
| Non-OTP content | Includes information beyond the verification code |
| Marketing language | Includes promotional text alongside the OTP |
| Missing expiry | Does not indicate how long the code is valid |

#### Marketing Templates

| Rejection Reason | Description |
|------------------|-------------|
| No opt-out | Missing unsubscribe instructions |
| Aggressive language | Overly pushy or urgent marketing tone |
| Misleading offers | Claims that are exaggerated or unverifiable |

## Common Rejection Scenarios

### Scenario 1: Miscategorized Template

**Submitted as Utility:**
```
Hi {{1}}, check out our new collection! 30% off on everything.
Shop now at {{2}}.
```

**Why rejected:** This is promotional content, not a transaction update. Submit as **Marketing** instead.

### Scenario 2: Too Many Parameters

**Submitted:**
```
{{1}} {{2}} {{3}} {{4}} {{5}} {{6}} {{7}} {{8}}
```

**Why rejected:** Insufficient static text. The template is mostly variables with no clear message structure.

**Fix:** Add meaningful static text around the parameters.

### Scenario 3: Missing Context

**Submitted:**
```
Your code is {{1}}.
```

**Why rejected:** Too vague. Does not specify what the code is for or provide security guidance.

**Fix:**
```
{{1}} is your login verification code for {{2}}.
This code expires in {{3}} minutes. Do not share this code with anyone.
```

### Scenario 4: Prohibited Content Request

**Submitted:**
```
Hi {{1}}, please reply with your PAN card number to complete verification.
```

**Why rejected:** Requesting sensitive personal information (PAN number) via WhatsApp is a policy violation.

**Fix:** Direct users to a secure website instead:
```
Hi {{1}}, please complete your verification at {{2}}.
```

## Template Quality and Enforcement

After approval, Meta monitors template quality based on customer feedback:

| Action | Trigger |
|--------|---------|
| Quality warning | Customers block your messages or report as spam |
| Template paused | Quality drops to red; template is temporarily disabled |
| Template disabled | Persistent quality issues; template permanently removed |

See [Quality Rating](/docs/whatsapp-support/quality-rating) for details on maintaining good quality.

:::warning
A paused template cannot be used until the quality improves. If your template is paused, you have 7 days to improve quality before it is permanently disabled.
:::

## Appeals and Resubmission

### If a Template Is Rejected

1. Review the rejection reason provided by Meta.
2. Identify the specific guideline violated.
3. Create a **new** template with the corrected content (you cannot edit rejected templates).
4. Submit the new template for review.

### If You Disagree with the Rejection

1. Go to Meta Business Manager > **Message Templates**.
2. Find the rejected template.
3. Click **Appeal** (if available).
4. Provide a justification for why the template should be approved.
5. Meta reviews the appeal within 24-48 hours.

## Best Practices for Approval

1. **Be specific** -- Clearly state the purpose of the message.
2. **Categorize correctly** -- Utility for transactions, authentication for OTPs, marketing for promotions.
3. **Use realistic samples** -- Provide sample values that demonstrate real-world usage.
4. **Balance static and dynamic text** -- Ensure at least 60% of the body is static text.
5. **Include context** -- Explain what the message is about and why the customer is receiving it.
6. **Keep it professional** -- Use proper grammar, no all-caps, no excessive punctuation.
7. **Add opt-out for marketing** -- Always include "Reply STOP to unsubscribe" or similar.
8. **Avoid urgency language** -- Phrases like "ACT NOW" or "LIMITED TIME" in marketing templates may trigger rejection.
9. **Do not request sensitive data** -- Never ask for passwords, PINs, bank details, or government IDs.
10. **Test before scale** -- After approval, send to a small group before a large campaign.

## Checklist Before Submission

- [ ] Template name is lowercase with underscores only
- [ ] Category matches the content (utility/authentication/marketing)
- [ ] Body is under 1,024 characters
- [ ] Parameters are numbered sequentially (`{{1}}`, `{{2}}`, etc.)
- [ ] Realistic sample values provided for all parameters
- [ ] No prohibited content (threats, misleading claims, sensitive data requests)
- [ ] Marketing templates include opt-out instructions
- [ ] Authentication templates include code expiry information
- [ ] Footer is under 60 characters (if used)
- [ ] Buttons have clear, action-oriented labels (under 20 characters)

## Next Steps

- [Creating WhatsApp Templates](/docs/whatsapp-support/creating-templates) -- Step-by-step creation guide
- [Template Categories](/docs/whatsapp-support/template-categories) -- Utility, marketing, authentication details
- [Quality Rating](/docs/whatsapp-support/quality-rating) -- Maintaining template quality
- [WhatsApp API Reference](/docs/whatsapp-api/overview) -- API documentation
