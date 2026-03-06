---
id: custom-caller-id
title: Custom Caller ID
description: "Configure custom caller ID display rules on Exotel for outbound calls including verified numbers and display regulations."
sidebar_label: Custom Caller ID
sidebar_position: 8
---

# Custom Caller ID

Custom Caller ID lets you control the phone number displayed to the recipient when making outbound calls through Exotel. Instead of showing the default ExoPhone, you can display a specific business number, a verified mobile number, or a department-specific line.

:::tip
Custom Caller ID is available on Growth and Enterprise plans. Starter plan users display the ExoPhone number by default.
:::

## How Caller ID Works

When Exotel places an outbound call on your behalf, the recipient's phone displays a caller ID number. This can be:

| Caller ID Type | What Recipient Sees | Configuration |
|---------------|--------------------|-|
| **ExoPhone (default)** | Your Exotel virtual number | Automatic -- no configuration needed |
| **Verified number** | A specific phone number you own and have verified | Requires verification |
| **Dynamic** | Different numbers for different calls (via API) | Set per-call via API parameter |

```
Outbound Call via Exotel API
   │
   ├── CallerId = ExoPhone ──► Recipient sees: +914412345678 (your ExoPhone)
   │
   ├── CallerId = Verified Number ──► Recipient sees: +919876543210 (your business number)
   │
   └── CallerId = Dynamic ──► Recipient sees: varies per call
```

## Verifying Numbers for Caller ID

Before using a number as a custom caller ID, you must verify that you own it:

### Verification Process

1. Navigate to **Settings** > **Caller ID** > **Verified Numbers**
2. Click **Add Number**
3. Enter the phone number you want to verify
4. Select the verification method:

| Method | Process | Time |
|--------|---------|------|
| **OTP Verification** | Exotel sends an OTP to the number; enter it to verify | Instant |
| **Missed Call** | Exotel makes a missed call; you confirm ownership | Instant |
| **Document Upload** | Upload proof of number ownership (for landlines) | 1 -- 3 business days |

5. Complete the verification
6. The number appears in your verified numbers list

### Verified Number Requirements

| Requirement | Details |
|-------------|---------|
| **Number must be active** | The number must be able to receive calls/SMS for verification |
| **You must be the owner** | You must have legal ownership or authorization to use the number |
| **Indian numbers** | Numbers must be valid Indian mobile or landline numbers |
| **International numbers** | International caller ID support depends on destination country regulations |
| **Maximum verified numbers** | Growth: 10, Enterprise: Custom limit |

:::warning
Using a phone number as a caller ID without proper authorization is a violation of TRAI regulations and Exotel's terms of service. Only verify numbers that you or your organization legally own.
:::

## Setting Caller ID in API Calls

### Per-Call Caller ID

Specify the caller ID when making an API call:

```bash
curl -X POST \
  https://api.exotel.com/v1/Accounts/{account_sid}/Calls/connect.json \
  -u {api_key}:{api_token} \
  -d "From=+919876543210" \
  -d "To=+919876543211" \
  -d "CallerId=+914412345678"
```

The `CallerId` parameter must be either:
- One of your active ExoPhones
- A verified number in your account

### Caller ID for Campaigns

When running voice campaigns, set the caller ID at the campaign level:

1. Navigate to **Campaigns** > **Create Campaign**
2. In the **Caller ID** field, select from your ExoPhones or verified numbers
3. All calls in the campaign display the selected caller ID

## Caller ID Display Rules

### What Recipients See

| Scenario | Caller ID Displayed | Notes |
|----------|-------------------|-------|
| **Standard outbound** | ExoPhone or verified number | As configured in API call |
| **Click-to-call (Leg A)** | ExoPhone | Agent sees the ExoPhone |
| **Click-to-call (Leg B)** | ExoPhone or caller's number | Configurable |
| **Number masking** | ExoPhone (masked number) | Always the masking ExoPhone |
| **Campaign call** | Campaign-level caller ID | Consistent across all campaign calls |

### Carrier Behavior

Caller ID display is ultimately controlled by the terminating carrier:

| Carrier Behavior | Description |
|-----------------|-------------|
| **CLI pass-through** | Carrier displays the caller ID as sent by Exotel |
| **CLI suppression** | Some carriers may suppress or modify the caller ID |
| **Spam filtering** | Carriers may flag numbers with high call volumes as "Suspected Spam" |
| **Truecaller / Apps** | Third-party apps may show the business name if the number is registered |

:::info
Exotel sends the caller ID as configured, but cannot guarantee how every carrier or device displays it. Test with multiple carriers (Jio, Airtel, Vi, BSNL) to verify display behavior.
:::

## Dynamic Caller ID for Campaigns

For campaigns that require different caller IDs per call:

### Use Case: Regional Caller ID

Display a local number based on the recipient's region:

| Recipient Location | Caller ID Displayed | Purpose |
|-------------------|--------------------|-|
| Mumbai | +912212345678 (Mumbai landline) | Local presence |
| Delhi | +911112345678 (Delhi landline) | Local presence |
| Bangalore | +918012345678 (Bangalore landline) | Local presence |

### Implementation

1. Maintain a mapping of regions to caller IDs
2. When making each API call, select the appropriate caller ID based on the recipient's number prefix
3. Pass the selected caller ID in the `CallerId` parameter

See the [Dynamic Caller ID Campaigns](/docs/use-cases/dynamic-caller-id-campaigns) use case for a detailed implementation guide.

## Registering on Truecaller

To display your business name instead of just a number on Truecaller:

1. Register your verified numbers on the Truecaller Business platform
2. Associate your business name, logo, and category
3. When Truecaller users receive calls from your number, they see your business identity

This improves answer rates, as recipients are more likely to pick up calls from identified businesses.

## Best Practices

1. **Use consistent caller IDs** -- Callers develop recognition; do not change numbers frequently
2. **Verify all numbers** -- Only use verified numbers to avoid compliance issues
3. **Register on Truecaller** -- Improves answer rates by displaying your business identity
4. **Test across carriers** -- Verify caller ID display on Jio, Airtel, Vi, and BSNL
5. **Use local numbers for regional campaigns** -- Local caller IDs have higher answer rates
6. **Monitor spam flags** -- If your number is flagged as spam, reduce call volume and register on Truecaller
7. **Rotate numbers for high-volume campaigns** -- Distribute calls across multiple ExoPhones to avoid spam flagging

## Troubleshooting

| Issue | Possible Cause | Resolution |
|-------|---------------|------------|
| Recipient sees "Unknown" | Caller ID not set or carrier suppressed | Verify the CallerID parameter is set correctly |
| API returns error for CallerID | Number not verified or not an active ExoPhone | Verify the number or use an active ExoPhone |
| Number flagged as spam | High call volume from the same number | Reduce volume; register on Truecaller; rotate numbers |
| Verification OTP not received | Number cannot receive SMS | Try the missed call verification method |
| International caller ID not working | Destination country restrictions | Check country-specific caller ID regulations |

## Related Topics

- [Voice API](/docs/voice-api/getting-started/overview) -- Making outbound calls with caller ID
- [Number Masking](/docs/advanced-config/number-masking-setup) -- Privacy-based caller ID
- [Dynamic Caller ID Campaigns](/docs/use-cases/dynamic-caller-id-campaigns) -- Regional caller ID implementation
- [ExoPhones](/docs/exophones/overview) -- Managing virtual numbers
