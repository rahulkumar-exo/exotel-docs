---
id: quickstart
title: ExoML Quickstart
description: Make your first ExoML-controlled call in 5 minutes.
sidebar_label: Quickstart
sidebar_position: 3
displayed_sidebar: voiceSidebar
---

# ExoML Quickstart

This guide walks through a complete outbound call: Exotel dials a number, your server receives events, and you play a greeting then hang up.

## Prerequisites

- An Exotel account with an ExoPhone
- Your API key, API token, and Account SID from [my.exotel.com](https://my.exotel.com) → Developer Settings → API Settings
- A publicly reachable HTTPS server for the event endpoint

## Step 1 — Set up your event endpoint

Your server must accept POST requests and return 200 immediately. After acknowledging, issue ExoML actions.

```js
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const ACCOUNT_SID = process.env.ACCOUNT_SID;
const API_KEY = process.env.API_KEY;
const API_TOKEN = process.env.API_TOKEN;
const BASE_URL = `https://cpaas-api.in.exotel.com/v2/accounts/${ACCOUNT_SID}`;

app.post('/events', async (req, res) => {
  res.sendStatus(200); // Ack immediately

  const { event_name, data } = req.body;

  if (event_name === 'leg_answered') {
    // Play a greeting, then hang up
    await axios.post(
      `${BASE_URL}/legs/${data.leg_sid}/actions`,
      {
        exoml: `<?xml version="1.0" encoding="UTF-8"?>
          <Flow>
            <StartSay language="en" preferredTTSEngine="polly">
              Hello! This is a test call from Exotel. Goodbye.
            </StartSay>
          </Flow>`
      },
      { auth: { username: API_KEY, password: API_TOKEN } }
    );
  }

  if (event_name === 'play_completed' || event_name === 'say_completed') {
    await axios.post(
      `${BASE_URL}/legs/${data.leg_sid}/actions`,
      {
        exoml: `<?xml version="1.0" encoding="UTF-8"?><Flow><Hangup></Hangup></Flow>`
      },
      { auth: { username: API_KEY, password: API_TOKEN } }
    );
  }
});

app.listen(3000);
```

## Step 2 — Create a leg

```bash
curl -u "<api_key>:<api_token>" \
  -H "Content-Type: application/json" \
  -X POST \
  "https://cpaas-api.in.exotel.com/v2/accounts/<account_sid>/legs" \
  -d '{
    "contact_uri": "+91XXXXXXXXXX",
    "exophone": "+91YYYYYYYYYY",
    "leg_event_endpoint": "https://your-server.example.com/events"
  }'
```

**Response** (202 Accepted):
```json
{
  "data": {
    "leg_sid": "<leg_sid>",
    "state": "initiated",
    "contact_uri": "+91XXXXXXXXXX",
    "exophone": "+91YYYYYYYYYY"
  }
}
```

## Step 3 — Handle the call flow

Once you create the leg, Exotel dials the number and posts events to your endpoint in sequence:

1. `leg_connecting` — Exotel is dialling
2. `leg_ringing` — Phone is ringing
3. `leg_answered` → **your handler plays the greeting** (Step 1)
4. `play_completed` → **your handler sends `<Hangup>`**
5. `leg_terminated` — Call ended

## Step 4 — Verify the leg

After the call, fetch the leg to confirm it completed:

```bash
curl -u "<api_key>:<api_token>" \
  "https://cpaas-api.in.exotel.com/v2/accounts/<account_sid>/legs/<leg_sid>"
```

## Next steps

- [Event endpoint reference](/docs/exoml/event-endpoint) — full payload schema and retry behaviour
- [Action reference](/docs/exoml/actions) — all ExoML verbs and their attributes
- [Legs & Bridges API](/docs/legs/overview) — create bridges, manage multiple legs
