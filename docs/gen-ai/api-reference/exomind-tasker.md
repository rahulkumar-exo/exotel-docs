---
id: exomind-tasker
title: ExoMind Tasker
description: Use the Exotel ExoMind Tasker API for AI-powered translation, transcription, summarization, and NLP queries via ExoML.
sidebar_label: ExoMind Tasker
---

# ExoMind Tasker API

Multi-model AI platform for translation, transcription, summarization, and natural language queries using ExoML (XML-based instruction language).

## HTTP Request

```
POST https://exomind.exotel.com/api/v1/exotasks
```

## Request Structure

```json
{
  "exoml": "<xml_flow>",
  "custom_params": {}
}
```

## Available Verbs

### Transcribe

Convert audio media (MP3, WAV) to text.

| Feature | Description |
|---------|-------------|
| Input | Audio file URL |
| Output | Transcribed text |
| Options | Speaker diarization (identify different speakers) |

### Translate

Translate text between languages.

| Feature | Description |
|---------|-------------|
| Input | Source text |
| Output | Translated text |
| Languages | ISO-639-1 language codes |

### Query

Natural language question-answering.

| Feature | Description |
|---------|-------------|
| Input | Question + context |
| Output | AI-generated answer |

### Summarize

Condense text with optional analysis.

| Feature | Description |
|---------|-------------|
| Input | Long text or transcript |
| Output | Summary with optional sentiment/intent |

## Optimization Options

| Option | Description |
|--------|-------------|
| `cost` | Optimize for lowest cost |
| `latency` | Optimize for fastest response |
| `determinism` | Optimize for consistent results |
| `conversational` | Optimize for natural language output |

## Response

Results are delivered asynchronously via webhook notification.
