---
id: gather
title: Gather
description: ExoML Gather verb — collect DTMF digits from the caller and POST them to your action URL.
sidebar_label: Gather
sidebar_position: 3
displayed_sidebar: voiceSidebar
---

# `<Gather>`

Collects DTMF (keypress) input from the caller. When the caller presses digits, Exotel POSTs them to your `action` URL and you return the next ExoML response.

## Attributes

| Attribute | Required | Default | Description |
|-----------|----------|---------|-------------|
| `action` | No | Current URL | URL to POST the collected digits to |
| `method` | No | `POST` | HTTP method for the action request: `GET` or `POST` |
| `numDigits` | No | — | Stop collecting after this many digits |
| `timeout` | No | `5` | Seconds to wait for input before timing out |
| `finishOnKey` | No | `#` | Key that terminates input early. Set to empty string `""` to disable |
| `maxDigits` | No | — | Alias for `numDigits` |

## Syntax

```xml
<Gather numDigits="1" action="https://your-app.example.com/ivr" timeout="5">
  <Say>Press 1 for Sales, 2 for Support, or 3 to repeat this menu.</Say>
</Gather>
```

## Nesting

`<Gather>` can contain `<Say>` or `<Play>` to prompt the caller:

```xml
<Gather numDigits="1" action="https://your-app.example.com/route">
  <Play>https://cdn.example.com/ivr-prompt.wav</Play>
</Gather>
```

## Action URL parameters

When input is collected, Exotel POSTs to your `action` URL with these additional parameters:

| Parameter | Description |
|-----------|-------------|
| `DigitsPressed` | The digits the caller pressed |
| `CallSid` | Call identifier |
| `CallFrom` | Caller's number |
| `CallTo` | Your ExoPhone |
| `CallStatus` | Current call status |

## Example — multi-level IVR

```python
from flask import Flask, request, Response

app = Flask(__name__)

@app.route('/ivr', methods=['POST'])
def ivr():
    return Response("""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather numDigits="1" action="/ivr/main" timeout="5">
    <Say>Press 1 for Sales. Press 2 for Support. Press 3 for Billing.</Say>
  </Gather>
  <Say>No input received. Goodbye.</Say>
  <Hangup/>
</Response>""", mimetype='text/xml')

@app.route('/ivr/main', methods=['POST'])
def ivr_main():
    digit = request.form.get('DigitsPressed', '')
    routes = {
        '1': '+919876540001',  # Sales
        '2': '+919876540002',  # Support
        '3': '+919876540003',  # Billing
    }
    if digit in routes:
        return Response(f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Connecting you now.</Say>
  <Dial>{routes[digit]}</Dial>
</Response>""", mimetype='text/xml')
    else:
        return Response("""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Invalid option. Goodbye.</Say>
  <Hangup/>
</Response>""", mimetype='text/xml')
```

## Timeout handling

If the caller doesn't press any digit within `timeout` seconds:
- Exotel falls through to the next verb after `<Gather>` in the same `<Response>`
- Your fallback verb runs (usually `<Say>` + `<Hangup>`)

```xml
<Response>
  <Gather numDigits="1" action="/ivr/route" timeout="5">
    <Say>Press 1 for Sales.</Say>
  </Gather>
  <!-- Runs only if Gather times out -->
  <Say>We did not receive your input. Goodbye.</Say>
  <Hangup/>
</Response>
```

## Legs API — Gather action

For collecting DTMF on an active leg via the Legs API:

```bash
curl -u '<api_key>:<api_token>' -X POST \
  'https://cpaas-api.in.exotel.com/v2/accounts/<account_sid>/legs/<leg_sid>/actions' \
  -H 'Content-Type: application/json' \
  -d '{
    "exoml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Flow><Gather numDigits=\"1\" timeout=\"5\"><StartSay>Press 1 to confirm your appointment.</StartSay></Gather></Flow>"
  }'
```

### Events emitted

| Event | Description |
|-------|-------------|
| `gather_input` | Caller pressed digit(s); `DigitsPressed` field contains input |
| `gather_timeout` | No digits received within the timeout window |
| `gather_completed` | Gather finished (either input or timeout) |
