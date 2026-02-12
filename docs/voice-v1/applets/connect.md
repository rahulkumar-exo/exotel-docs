---
title: Connect Applet
id: connect
sidebar_label: Connect
sidebar_position: 2
---
# Connect Applet test

The Connect applet routes an incoming call to a group or list of phone numbers. When a caller reaches this applet, Exotel dials the configured numbers and connects the caller to whoever answers first.

## Features

* **Flexible dialing** — Connect to one or multiple phone numbers
* **Two configuration modes**:

  * **Manual entry** — Enter phone numbers directly in the applet configuration
  * **Dynamic via URL** — Return numbers to dial from your application URL
* **Call recording** — Optionally record the connected conversation

## Configuration

1. In the Exotel Dashboard, open your call flow editor
2. Drag the **Connect** applet into your flow
3. Choose how to provide numbers:

   * **Enter directly**: Type phone numbers into the configuration
   * **Application URL**: Provide a URL that returns the numbers to dial

## Dynamic Number Selection

When using an application URL, your endpoint receives call details and should return the phone number(s) to connect. This enables dynamic routing based on:

* Caller ID (route VIP customers to dedicated agents)
* Time of day (route to different teams based on shifts)
* CRM data (route to the account owner)

For detailed documentation on the URL response format, refer to the [Connect applet dial-whom documentation](https://support.exotel.com/support/solutions/articles/48283-connect-applet-dial-whom).

## Call Recording

When recording is enabled, combine the Connect applet with a [Greeting applet](/docs/voice-v1/applets/greeting) to inform callers that their conversation is being recorded for quality assurance.

## Example Flow

```
Incoming Call → Greeting → Connect (to sales team)
```
