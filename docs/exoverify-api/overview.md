---
id: overview
title: ExoVerify
description: "Exotel ExoVerify API — verify phone numbers with SMS OTP in 2 API calls. Secure user authentication."
sidebar_label: Overview
sidebar_position: 1
---

# ExoVerify

Verify phone numbers using SMS OTP (One-Time Password). ExoVerify handles OTP generation, delivery, and validation — so you don't have to build it yourself.

## How It Works

1. Your app calls the **Start Verification** API with the user's phone number
2. ExoVerify sends an SMS OTP to that number
3. The user enters the OTP in your app
4. Your app calls the **Verify OTP** API to validate it
5. ExoVerify returns success or failure

## Base URL

```
https://exoverify.exotel.com/v2/accounts/{account_sid}/verifications/sms
```

## Authentication

ExoVerify uses **Basic Authentication** with your Application credentials (not the main API key/token):

```
Authorization: Basic <base64(Application_ID:Application_Secret)>
Content-Type: application/json
```

### Getting Credentials

1. Log into the [Exotel Dashboard](https://my.exotel.com)
2. Navigate to **ExoVerify** → **Applications**
3. Create a new SMS OTP application
4. Note the **App ID** and **App Secret**

## OTP Defaults

| Setting             | Value |
|---------------------|-------|
| OTP expiry          | 60 seconds |
| Max attempts        | 10 per verification |
| OTP length          | 4–6 digits (configurable) |

## Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| [Start Verification](/docs/exoverify-api/api-reference/start-verification) | POST | Send OTP to a phone number |
| [Verify OTP](/docs/exoverify-api/api-reference/verify-otp) | POST | Validate the OTP entered by the user |
