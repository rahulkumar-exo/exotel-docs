---
id: connect-applet-inbound
title: Connect Applet setup for inbound SIP
description: Route inbound PSTN calls to your SIP trunk using an App Bazaar Connect applet and sip:trunk_sid.
sidebar_label: Connect Applet (inbound)
slug: /sip-trunking/connect-applet-inbound
sidebar_position: 7
---

# Connect Applet setup for inbound SIP

Route PSTN calls that hit your Exophone into your SIP trunk.

```
PSTN → Exotel DID → App Bazaar Flow (Connect) → sip:<trunk_sid> → Destination URI → Your SIP
```

## Prerequisites

- Trunk created with **destination URI** set — [Quickstart](./quickstart) steps 1–4
- Phone number mapped to the trunk with mode **`pstn`**
- Destination reachable (firewall allowlist complete)

## Configure the flow

1. Open [App Bazaar](https://my.in.exotel.com/apps) (use your regional dashboard)  
2. Create a new flow  
3. Add a **Connect** applet  
4. In **Dial Whom**, enter: `sip:<trunk_sid>`  
5. Save the flow  

## Map the DID

1. Open Exophone / Numbers manager  
2. Select your DID  
3. Assign the Voice URL / flow to the flow created above  

## Verify

1. Call the Exophone from a mobile  
2. Confirm INVITE arrives at your SIP URI  
3. Confirm two-way audio (UDP 10000–40000 open)

## Dynamic Connect URL (optional)

For runtime routing, use a programmable Connect URL that returns JSON such as:

```json
{
  "fetch_after_attempt": false,
  "destination": { "trunk": "trunk-2134" },
  "custom_params": "param1=value1&param2=value2",
  "record": true,
  "recording_channels": "dual"
}
```

## Related

- [Call directions](./call-directions)
- [StreamKit SIP setup](./streamkit-sip)
- Docs portal: [Connect Applet Setup for Inbound SIP](https://docs.exotel.com/dynamic-sip-trunking/connect-applet-setup-for-inbound-sip-trunking)
