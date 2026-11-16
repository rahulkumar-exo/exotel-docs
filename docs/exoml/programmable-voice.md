---
id: programmable-voice
title: Programmable Voice
description: Build complete call flows in code using ExoML webhooks — no dashboard, no App Bazaar, full programmatic control.
sidebar_label: Programmable Voice
sidebar_position: 2
displayed_sidebar: voiceSidebar
---

# Programmable Voice

Programmable Voice lets you build, version-control, and deploy call flows entirely from code using ExoML. Every step — greeting, IVR, routing, recording, transfer — is controlled by XML your server returns to Exotel's webhooks.

No App Bazaar. No drag-and-drop. Git history is your audit trail.

## How it works

```
Incoming Call
     │
     ▼
Exotel receives call on ExoPhone
     │
     ▼
POST /your-webhook  ◄── Exotel sends call details
     │
     ▼
Your server returns ExoML XML
     │
     ▼
Exotel executes instructions (play audio, collect digits, dial, etc.)
     │
     ▼
On caller action (keypress, dial end) → Exotel POSTs to next webhook
     │
     ▼
Loop until <Hangup/>
```

:::note
This document covers the **Voice V1 webhook pattern**, where Exotel POSTs to your server and your server returns ExoML XML in the HTTP response body. Exotel executes the returned XML to control the call.

This is distinct from the [Legs API (ExoML)](/docs/exoml/overview) pattern, where your server returns HTTP 200 immediately and issues control instructions via separate `POST /legs/{leg_sid}/actions` requests.
:::

## Quickstart

### 1. Expose a webhook endpoint

Your server must be reachable from the internet. During development, use a tunnelling tool.

### 2. Return ExoML for the first response

```python
from flask import Flask, request, Response

app = Flask(__name__)

@app.route('/voice', methods=['POST'])
def incoming_call():
    return Response("""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Welcome to Acme Corp.</Say>
  <Gather numDigits="1" action="/voice/menu" timeout="5">
    <Say>Press 1 for Sales. Press 2 for Support. Press 3 to leave a message.</Say>
  </Gather>
  <Say>No input received. Goodbye.</Say>
  <Hangup/>
</Response>""", mimetype='text/xml')
```

```javascript
// Express equivalent
app.post('/voice', (req, res) => {
  res.type('text/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Welcome to Acme Corp.</Say>
  <Gather numDigits="1" action="/voice/menu" timeout="5">
    <Say>Press 1 for Sales. Press 2 for Support. Press 3 to leave a message.</Say>
  </Gather>
  <Hangup/>
</Response>`);
});
```

### 3. Handle keypress input

```python
@app.route('/voice/menu', methods=['POST'])
def menu():
    digit = request.form.get('DigitsPressed', '')
    
    if digit == '1':
        xml = """<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Connecting you to Sales.</Say>
  <Dial action="/voice/dial-done" timeout="30">+919876540001</Dial>
</Response>"""
    elif digit == '2':
        xml = """<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Connecting you to Support.</Say>
  <Dial action="/voice/dial-done" timeout="30">+919876540002</Dial>
</Response>"""
    elif digit == '3':
        xml = """<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Please leave your message after the beep. Press pound when done.</Say>
  <Record action="/voice/voicemail" maxLength="120" finishOnKey="#" playBeep="true"/>
  <Hangup/>
</Response>"""
    else:
        xml = """<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Invalid option.</Say>
  <Hangup/>
</Response>"""
    
    return Response(xml, mimetype='text/xml')

@app.route('/voice/dial-done', methods=['POST'])
def dial_done():
    status = request.form.get('DialCallStatus', '')
    if status == 'no-answer':
        return Response("""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>The agent did not answer. Please try again later. Goodbye.</Say>
  <Hangup/>
</Response>""", mimetype='text/xml')
    return Response("""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Hangup/>
</Response>""", mimetype='text/xml')

@app.route('/voice/voicemail', methods=['POST'])
def voicemail():
    recording_url = request.form.get('RecordingUrl', '')
    # Save recording_url to your DB, send notification, etc.
    return Response("""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Thank you for your message. We will call you back shortly. Goodbye.</Say>
  <Hangup/>
</Response>""", mimetype='text/xml')
```

### 4. Configure your ExoPhone

1. Log in to [Exotel Dashboard](https://my.exotel.com) → **ExoPhones**
2. Select the ExoPhone
3. Under **Incoming**, set the **App URL** to your webhook: `https://your-app.example.com/voice`
4. Set **HTTP Method** to `POST`

Exotel will POST to this URL for every incoming call.

## Webhook parameters

Every POST from Exotel to your webhook includes:

| Parameter | Description |
|-----------|-------------|
| `CallSid` | Unique identifier for the call |
| `CallFrom` | Caller's number (E.164) |
| `CallTo` | Your ExoPhone |
| `CallStatus` | `ringing`, `in-progress` |
| `Direction` | `inbound` |
| `AccountSid` | Your account SID |
| `DigitsPressed` | DTMF digits from `<Gather>` (action URL only) |
| `DialCallStatus` | Dial outcome (Dial action URL only): `completed`, `busy`, `no-answer`, `failed` |
| `RecordingUrl` | Recording URL (Record action URL only) |
| `RecordingDuration` | Recording duration in seconds |

## Real-world patterns

### Business hours routing

```python
from datetime import datetime
import pytz

@app.route('/voice', methods=['POST'])
def incoming_call():
    ist = pytz.timezone('Asia/Kolkata')
    now = datetime.now(ist)
    is_business_hours = (
        now.weekday() < 5 and  # Mon–Fri
        9 <= now.hour < 18     # 9 AM – 6 PM IST
    )
    
    if is_business_hours:
        xml = """<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial timeout="30">+919876543210</Dial>
</Response>"""
    else:
        xml = """<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Our office is currently closed. We are open Monday to Friday, 9 AM to 6 PM IST.</Say>
  <Record action="/voice/after-hours-voicemail" maxLength="60" playBeep="true"/>
  <Hangup/>
</Response>"""
    return Response(xml, mimetype='text/xml')
```

### CRM-based routing

```python
@app.route('/voice', methods=['POST'])
def incoming_call():
    caller = request.form.get('CallFrom', '')
    agent = crm.lookup_assigned_agent(caller)  # your CRM call
    
    if agent:
        xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Connecting you to your account manager.</Say>
  <Dial timeout="20">{agent.phone}</Dial>
</Response>"""
    else:
        xml = """<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather numDigits="1" action="/voice/general-ivr">
    <Say>Press 1 for Sales. Press 2 for Support.</Say>
  </Gather>
</Response>"""
    return Response(xml, mimetype='text/xml')
```

### Dynamic language selection

```python
@app.route('/voice', methods=['POST'])
def incoming_call():
    return Response("""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather numDigits="1" action="/voice/language" timeout="5">
    <Say language="en">For English, press 1.</Say>
    <Say language="hi">हिंदी के लिए 2 दबाएं।</Say>
    <Say language="ta">தமிழுக்கு 3 அழுத்தவும்.</Say>
  </Gather>
  <Hangup/>
</Response>""", mimetype='text/xml')

@app.route('/voice/language', methods=['POST'])
def language():
    digit = request.form.get('DigitsPressed', '1')
    lang_map = {'1': 'en', '2': 'hi', '3': 'ta'}
    lang = lang_map.get(digit, 'en')
    # Store language in session keyed by CallSid
    sessions[request.form['CallSid']] = {'lang': lang}
    return Response(f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="{lang}">Connecting you now.</Say>
  <Dial>+919876543210</Dial>
</Response>""", mimetype='text/xml')
```

## Comparison with Applets

| Feature | Applets (App Bazaar) | Programmable Voice (ExoML) |
|---------|---------------------|---------------------------|
| Flow definition | Dashboard UI | Code (Python, Node, etc.) |
| Dynamic routing | Limited (Passthru applet) | Full programmatic control |
| Version control | None | Git |
| CRM integration | Via Passthru webhook | Direct in your handler |
| Conditional logic | UI-only | Full code |
| Multi-language | Per-flow | Per-call, per-caller |

## For mid-call control

If you need to control an active call in real time — hold, transfer, play audio mid-conversation, or pipe to a voicebot — combine ExoML with the [Legs & Bridges API](/docs/legs/overview).

## Related

- [ExoML Overview](/docs/exoml/overview)
- [Gather](/docs/exoml/verbs/gather) — DTMF input
- [Dial](/docs/exoml/verbs/dial) — connect to agent
- [Record](/docs/exoml/verbs/record) — voicemail and call recording
- [Legs & Bridges API](/docs/legs/overview) — real-time mid-call control
