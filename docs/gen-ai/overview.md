---
id: overview
title: Gen AI
sidebar_label: Overview
slug: /gen-ai/overview
---

# Gen AI APIs

Exotel's Gen AI APIs provide AI-powered analysis and processing capabilities for your communication data, including call transcription, sentiment analysis, summarization, and more.

:::note Alpha
Gen AI APIs are currently in **Alpha**. Contact your account manager to enable these features.
:::

## Products

### ExoVoiceAnalyze

Derives insights from call recordings including:
- **Transcription** — Convert call audio to text
- **Summarization** — Get concise call summaries
- **Sentiment Analysis** — Determine call sentiment (Positive/Negative/Neutral)
- **Categorization** — Classify calls into business-defined categories

Works with any Exotel Voice product (Click to Call, Lead Assist, Campaigns, etc.)

### ExoMind Tasker

Multi-model AI platform supporting:
- **Transcribe** — Convert media (MP3, WAV) to text with speaker diarization
- **Translate** — Text translation across languages (ISO-639-1 codes)
- **Query** — Natural language question-answering
- **Summarize** — Text condensation with optional sentiment/intent extraction

## Processing Model

Both APIs use **asynchronous processing** — results are delivered via webhook callbacks to your configured endpoint.
