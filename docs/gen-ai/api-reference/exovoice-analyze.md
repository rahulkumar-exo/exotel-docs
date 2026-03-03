---
id: exovoice-analyze
title: ExoVoiceAnalyze
description: Analyze call recordings with the Exotel ExoVoiceAnalyze API to extract transcripts, summaries, sentiment, and categories.
sidebar_label: ExoVoiceAnalyze
---

# ExoVoiceAnalyze API

Analyze call recordings to extract transcripts, summaries, sentiment, and business categories.

## HTTP Request

```
POST http://<API_Key>:<API_Token>@api.exotel.com/v1/Accounts/<account_sid>/Calls/<call_sid>/ExoVoiceAnalyze.json
```

## Prerequisites

- The call must have an associated recording (via `call_sid`)
- Feature must be enabled by your account manager
- This is a chargeable service

## Request Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `task_id` | Yes | Customer-defined identifier for tracking |
| `callback_url` | Yes | Webhook endpoint for receiving results |
| `insight_tasks` | Yes | Comma-separated list of tasks to perform |
| `categories` | No | Business categories for classification |

### Available Insight Tasks

| Task | Description |
|------|-------------|
| `transcript` | Full call transcription |
| `summarization` | Concise call summary |
| `sentiment` | Sentiment analysis (Positive/Negative/Neutral) |
| `categorise` | Classify call into provided business categories |

## Response

Results are delivered asynchronously to your `callback_url` via webhook.

### Sentiment Values

The sentiment task produces one of three values:
- `Positive`
- `Negative`
- `Neutral`
