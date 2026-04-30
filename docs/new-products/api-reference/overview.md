---
title: CQA API Reference
id: cqa-api-reference
sidebar_label: CQA
---
# CQA API Reference

## Overview

Exotel CQA (Conversation Quality Analysis) provides AI-powered quality analysis for contact center interactions. The platform ingests interaction data -- audio recordings, transcripts, and metadata -- from any source, runs them through configurable quality profiles, and produces detailed quality scores.

This document covers the public API surface:

- **Data Import API** -- Push interactions into CQA via REST (single, batch, or file-based).
- **Analysis API** -- Retrieve detailed quality analysis results.
- **File Schemas** -- CSV format specifications for bulk ingestion.

---

## Base URL

All endpoints are served under the CQA context path:

```
https://{host}/cqa
```

Replace `{host}` with the hostname of your CQA deployment (e.g. `cqa.exotel.com`).

---

## Authentication

All Data Import and Analysis API endpoints authenticate via an API key passed in the `X-API-Key` header.


| API Surface     | Auth Method | Header             |
| --------------- | ----------- | ------------------ |
| Data Import API | API Key     | `X-API-Key: {key}` |
| Analysis API    | API Key     | `X-API-Key: {key}` |


### API Keys

API keys are scoped to a single account and are used for all programmatic ingestion and analysis retrieval. API keys can be created and managed through the CQA dashboard.

---

## Rate Limits

API endpoints are rate-limited per tenant (account). 

- Requests that exceed the limit receive `429 Too Many Requests` with error code `**RATE_LIMIT_EXCEEDED**` (see [Response Envelope](#response-envelope)).
- Too many **concurrent file jobs** is a separate `429` with code `**TOO_MANY_JOBS`**.


| Endpoint Pattern                  | Method | Default tenant limit (typical) |
| --------------------------------- | ------ | ------------------------------ |
| `/ingress/interactions`* (ingest) | POST   | 100 requests per minute        |
| `/ingress/`** (tracking)          | GET    | 300 requests per minute        |


---

## Response Envelope

All Data Import and Analysis API endpoints return responses in a common envelope.

**Success response:**

```json
{
  "status": 200,
  "request_id": "d4f5a6b7-c8d9-4e0f-a1b2-c3d4e5f6a7b8",
  "data": { }
}
```

**Error response:**

```json
{
  "status": 400,
  "request_id": "d4f5a6b7-c8d9-4e0f-a1b2-c3d4e5f6a7b8",
  "message": "Descriptive error message",
  "error": {
    "code": "VALIDATION_ERROR"
  }
}
```


| Field        | Type    | Description                                                                    |
| ------------ | ------- | ------------------------------------------------------------------------------ |
| `status`     | integer | HTTP status code mirrored in the body.                                         |
| `request_id` | string  | Unique request identifier for tracing and support.                             |
| `message`    | string  | Human-readable detail (present on many errors; may be omitted when redundant). |
| `data`       | object  | Response payload (present on success).                                         |
| `error`      | object  | Present on failure. Contains `**code`** only.                                  |


**Error Codes:**


| Code                  | HTTP Status | Description                                                                                                      |
| --------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------- |
| `VALIDATION_ERROR`    | 400         | Request failed validation (missing required fields, exceeded limits).                                            |
| `INVALID_JSON`        | 400         | Request body is not valid JSON.                                                                                  |
| `INVALID_REQUEST`     | 400         | Request contains invalid arguments.                                                                              |
| `UNAUTHORIZED`        | 401         | Missing or invalid API key.                                                                                      |
| `NOT_FOUND`           | 404         | The requested resource was not found.                                                                            |
| `DUPLICATE`           | 409         | Returned for single-ingest conflict responses (see [Ingest a Single Interaction](#ingest-a-single-interaction)). |
| `RATE_LIMIT_EXCEEDED` | 429         | Tenant or user rate limit exceeded.                                                                              |
| `TOO_MANY_JOBS`       | 429         | Too many concurrent file ingestion jobs for this account.                                                        |
| `INTERNAL_ERROR`      | 500         | An unexpected server error occurred.                                                                             |


---

# Data Import API

The Data Import API is the primary external integration point for pushing interaction data into CQA. It supports three ingestion modes: single, batch, and file-based.

**Base path:** `/api/v1/accounts/{account_id}/ingress`
**Auth:** `X-API-Key` header

---

## Ingest a Single Interaction

Submits one interaction for quality analysis. Returns immediately with a tracking ID.

POST

```
https://{host}/cqa/api/v1/accounts/{account_id}/ingress/interactions
```

### Request Parameters (JSON Body)

**Content requirement:** At least one of `audio_url`, `transcript_url` must be provided.


| Parameter Name            | Mandatory / Optional | Type              | Description                                                                                                                                             |
| ------------------------- | -------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `external_interaction_id` | Mandatory            | string            | Your unique identifier for this interaction. Used for deduplication.                                                                                    |
| `channel_type`            | Mandatory            | string            | Interaction channel. Recognized values: `VOICE`, `CHAT`, `EMAIL`, `SMS`, `WHATSAPP`. Other values are accepted (not rejected). |
| `source`                  | Optional             | string            | Identifies the originating system (e.g. `my-pbx`, `genesys`).                                                                                           |
| `language`                | Optional             | string            | Language code (e.g. `en`, `hi`, `es`).                                                                                                                  |
| `interaction_start_time`  | Optional             | string (ISO-8601) | When the interaction started (e.g. `2026-04-01T10:30:00Z`).                                                                                             |
| `duration_seconds`        | Optional             | integer           | Duration of the interaction in seconds.                                                                                                                 |
| `audio_format`            | Optional             | string            | Audio format hint (e.g. `WAV`, `MP3`, `OGG`).                                                                                                           |
| `callback_url`            | Optional             | string            | Webhook URL for status update notifications.                                                                                                            |
| `audio_url`               | Mandatory if transcript_url is not provided             | string            | Direct URL to the audio recording.                                                                                                                      |
| `transcript_url`          | Mandatory if audio_url is not provided             | string            | Direct URL to the transcript file.                                                                                                                      |
| `pii_redacted`            | Optional             | boolean           | Whether PII has already been redacted in the provided content. Default: `false`.                                                                        |
| `metadata`                | Optional             | object            | Arbitrary key-value pairs for tagging. Maximum 50 keys. Values can be strings, numbers, or booleans.                                                    |


### Example Request

```bash
curl -X POST "https://{host}/cqa/api/v1/accounts/{account_id}/ingress/interactions" \
  -H "X-API-Key: {your_api_key}" \
  -H "Content-Type: application/json" \
  -d '{
    "external_interaction_id": "call-2026-04-01-001",
    "channel_type": "VOICE",
    "source": "my-pbx",
    "language": "en",
    "interaction_start_time": "2026-04-01T10:30:00Z",
    "duration_seconds": 300,
    "audio_format": "WAV",
    "audio_url": "https://storage.example.com/recordings/call-001.wav",
    "pii_redacted": false,
    "callback_url": "https://my-app.example.com/webhooks/cqa",
    "metadata": {
      "agent_id": "agent-42",
      "campaign": "retention-q2",
      "disposition": "RESOLVED"
    }
  }'
```

### Response

`**201 Created**` -- Interaction queued successfully.

```json
{
  "status": 201,
  "request_id": "req-abc-123",
  "message": "Queued for processing",
  "data": {
    "interaction_id": "550e8400-e29b-41d4-a716-446655440000",
    "external_interaction_id": "call-2026-04-01-001",
    "status": "queued"
  }
}
```

`**409 Conflict**` -- **Duplicate** `external_interaction_id`.

```json
{
  "status": 409,
  "request_id": "req-abc-124",
  "message": "Duplicate: interaction with this external_interaction_id already exists",
  "error": {
    "code": "DUPLICATE"
  }
}
```

`**400 Bad Request**` -- Validation error.

```json
{
  "status": 400,
  "request_id": "req-abc-125",
  "message": "metadata must not exceed 50 keys",
  "error": {
    "code": "VALIDATION_ERROR"
  }
}
```

### Response Fields


| Parameter Name            | Type          | Description                                                                                              |
| ------------------------- | ------------- | -------------------------------------------------------------------------------------------------------- |
| `interaction_id`          | string (UUID) | CQA-assigned unique identifier for the interaction.                                                      |
| `external_interaction_id` | string        | Your identifier, echoed back.                                                                            |
| `status`                  | string        | `queued` on success.                                                                                     |
| `message`                 | string        | Top-level hint on **201** (e.g. queued). On errors, the detail text is in `message`, not inside `error`. |


---

## Ingest a Batch of Interactions

Submits up to 100 interactions as a single asynchronous job. Returns an `id` in `data` for tracking.

POST

```
https://{host}/cqa/api/v1/accounts/{account_id}/ingress/interactions/batch
```

### Request Parameters (JSON Body)


| Parameter Name           | Mandatory / Optional | Type    | Description                                                                                                        |
| ------------------------ | -------------------- | ------- | ------------------------------------------------------------------------------------------------------------------ |
| `interactions`           | Mandatory            | array   | List of interaction objects, each following the same schema as the single ingest endpoint. Minimum 1, maximum 100. |
| `skip_duplication_check` | Optional             | boolean | If `true`, skip deduplication by `external_interaction_id`. Default: `false`.                                      |


### Response Fields


| Parameter Name | Type   | Description                                                                                               |
| -------------- | ------ | --------------------------------------------------------------------------------------------------------- |
| `id`           | string | Unique identifier for the batch job. Use this with the [batch tracking](#track-batch--file-job) endpoint. |
| `type`         | string | Always `batch` for this endpoint.                                                                         |
| `status`       | string | `pending` -- the job has been accepted and is queued for processing.                                      |


---

## Submit a File for Ingestion

Submits a remote CSV file URL for asynchronous ingestion. CQA downloads and processes the file in the background.

POST

```
https://{host}/cqa/api/v1/accounts/{account_id}/ingress/interactions/files
```

### Request Parameters (JSON Body)


| Parameter Name           | Mandatory / Optional | Type    | Description                                                                                                                                                                                                                                         |
| ------------------------ | -------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `file_url`               | Mandatory            | string  | URL to the file. Supported schemes: `https://`, `http://`, `s3://`. `https` is strongly recommended; `http` is accepted but offers no transport encryption. Private/local addresses (localhost, 127.0.0.1, 10.x, 192.168.x, 172.16.x) are rejected. |
| `format`                 | Mandatory            | string  | File format: `csv` or `ndjson`.                                                                                                                                                                                                                     |
| `source`                 | Optional             | string  | Default source applied to all rows where the row-level source is not set.                                                                                                                                                                           |
| `pii_redacted`           | Optional             | boolean | Default PII flag applied to all rows.                                                                                                                                                                                                               |
| `callback_url`           | Optional             | string  | Default callback URL stored per row (same semantics as single ingest; no HTTP callback from ingress).                                                                                                                                               |
| `column_mapping`         | Optional             | object  | Maps your CSV headers to canonical column names. Keys are your original headers (trimmed, lowercased); values are canonical names. Ignored for NDJSON. See [CSV Schema](#csv-schema) for canonical names.                                           |
| `metadata`               | Optional             | object  | Default metadata merged into every row. After merge, each row should respect the **50-key** metadata limit enforced for batch/single ingest; avoid large default maps that push merged rows over the limit.                                         |
| `skip_duplication_check` | Optional             | boolean | If `true`, skip deduplication. Default: `false`.                                                                                                                                                                                                    |


### File Processing Limits


| Limit                 | Default Value |
| --------------------- | ------------- |
| Max rows per file job | 100,000       |
| Max file size         | 100 MB        |


---

## Get Interaction by ID

Retrieves the current status and details of an ingested interaction.

GET

```
https://{host}/cqa/api/v1/accounts/{account_id}/ingress/interactions/{interaction_identifier}
```

### Path Parameters


| Parameter Name           | Mandatory / Optional | Description                                                                        |
| ------------------------ | -------------------- | ---------------------------------------------------------------------------------- |
| `account_id`             | Mandatory            | Your CQA account ID.                                                               |
| `interaction_identifier` | Mandatory            | Either the CQA-assigned UUID (`interaction_id`) or your `external_interaction_id`. |


### Response Fields


| Parameter Name            | Type              | Description                                                                                               |
| ------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------- |
| `interaction_id`          | string (UUID)     | CQA-assigned unique identifier.                                                                           |
| `external_interaction_id` | string            | Your identifier.                                                                                          |
| `batch_id`                | string            | Job/batch ID if the interaction was part of a batch or file job. Omitted for single ingestion.            |
| `channel_type`            | string            | Channel type as submitted.                                                                                |
| `source`                  | string            | Originating system.                                                                                       |
| `status`                  | string            | Current status: `queued`, `processing`, `completed`, or `failed`.                                         |
| `status_modified_at`      | string (ISO-8601) | When the status last changed.                                                                             |
| `failure_reason`          | string            | Reason for failure. Only present when status is `failed`; omitted otherwise.                              |
| `audio_url`               | string            | Resolved audio recording URL (same value as submitted `audio_url` / `files` audio URL).                   |
| `transcript_url`          | string            | Resolved transcript URL.                                                                                  |
| `pii_redacted`            | boolean           | Whether PII was flagged as redacted.                                                                      |
| `created_at`              | string (ISO-8601) | When the interaction was ingested.                                                                        |
| `metadata`                | object            | Key-value metadata.                                                                                       |
| `analyses`                | array             | List of analyses triggered for this interaction. Each contains `analysis_id`, `profile_id`, and `status`. |


### Interaction Status Lifecycle

Applies to the `status` field on individual interactions and analyses.


| API Status   | Meaning                                        |
| ------------ | ---------------------------------------------- |
| `queued`     | Interaction accepted, waiting to be processed. |
| `processing` | Analysis is underway.                          |
| `completed`  | All analyses finished successfully.            |
| `failed`     | Processing failed (check `failure_reason`).    |


### Job Status Lifecycle

Applies to the `status` field in the batch/file 202 response and the `job_status` field in the batch tracking response. Job statuses are distinct from interaction statuses.


| Job Status   | Meaning                                                                |
| ------------ | ---------------------------------------------------------------------- |
| `pending`    | Job accepted and queued. Returned in the initial 202 response.         |
| `processing` | A worker has picked up the job and is processing rows.                 |
| `completed`  | All rows have been processed (check `accepted`/`rejected` for counts). |
| `failed`     | The job failed entirely (check `error_message`).                       |


---

## Track Batch / File Job

Retrieves all interactions for a batch or file job, with pagination and job-level status.

GET

```
https://{host}/cqa/api/v1/accounts/{account_id}/ingress/interactions/batch/{id}
```

### Path Parameters


| Parameter Name | Mandatory / Optional | Description                                                                                  |
| -------------- | -------------------- | -------------------------------------------------------------------------------------------- |
| `account_id`   | Mandatory            | Your CQA account ID.                                                                         |
| `id`           | Mandatory            | The job identifier: the `**id**` returned in the batch or file **202** response (`data.id`). |


### Query Parameters


| Parameter Name | Default | Max | Description                                                                    |
| -------------- | ------- | --- | ------------------------------------------------------------------------------ |
| `page`         | 0       | --  | Zero-based page index.                                                         |
| `size`         | 20      | 100 | Number of interactions per page. Values above 100 are silently clamped to 100. |


### Response Fields


| Parameter Name  | Type              | Description                                                                                     |
| --------------- | ----------------- | ----------------------------------------------------------------------------------------------- |
| `id`            | string            | The job identifier (same as `data.id` from the batch or file **202** response).                 |
| `total`         | integer           | Total interactions associated with this job.                                                    |
| `interactions`  | array             | Paginated list of interaction detail objects.                                                   |
| `pagination`    | object            | Contains `page`, `size`, `total_elements`, `total_pages`.                                       |
| `job_status`    | string            | Overall job status: `pending`, `processing`, `completed`, or `failed`.                          |
| `job_type`      | string            | `batch` or `file`.                                                                              |
| `total_rows`    | integer           | Total rows found in the input (includes accepted + rejected).                                   |
| `accepted`      | integer           | Number of rows successfully processed.                                                          |
| `rejected`      | integer           | Number of rows that failed validation.                                                          |
| `errors`        | array             | Up to 100 error entries. Each has `line` (row number), `reason`, and `external_interaction_id`. |
| `error_message` | string            | Top-level error message if the entire job failed.                                               |
| `completed_at`  | string (ISO-8601) | When the job finished processing.                                                               |


---

# Analysis API

Retrieve detailed quality analysis results for a completed analysis.

**Base path:** `/api/v1/accounts/{account_id}/analyses`
**Auth:** `X-API-Key` header

---

## Get Analysis Detail

Returns the full scoring breakdown for a specific analysis, including categories, subcategories, and individual KPI scores.

GET

```
https://{host}/cqa/api/v1/accounts/{account_id}/analyses/{analysis_id}
```

### Path Parameters


| Parameter Name | Mandatory / Optional | Description                                                                  |
| -------------- | -------------------- | ---------------------------------------------------------------------------- |
| `account_id`   | Mandatory            | Your CQA account ID.                                                         |
| `analysis_id`  | Mandatory            | The analysis UUID (obtained from the interaction detail's `analyses` array). |


### Response Fields


| Parameter Name               | Type              | Description                                                                                                                                                                                         |
| ---------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `analysis_id`                | string (UUID)     | Unique analysis identifier.                                                                                                                                                                         |
| `interaction_id`             | string (UUID)     | The interaction this analysis belongs to.                                                                                                                                                           |
| `external_interaction_id`    | string            | Your interaction identifier.                                                                                                                                                                        |
| `profile_id`                 | string            | Quality profile used for scoring.                                                                                                                                                                   |
| `profile_name`               | string            | Human-readable quality profile name.                                                                                                                                                                |
| `status`                     | string            | `queued`, `processing`, `completed`, or `failed`.                                                                                                                                                   |
| `ai_score`                   | float             | AI-generated quality score.                                                                                                                                                                         |
| `qa_score`                   | float             | Manual QA score (if a human reviewer overrode). Omitted if no manual review has occurred.                                                                                                           |
| `final_score`                | float             | Effective score (QA score if present, otherwise AI score).                                                                                                                                          |
| `criticality_adjusted_score` | float             | Score after applying criticality weights.                                                                                                                                                           |
| `max_score`                  | float             | Maximum possible score for this profile.                                                                                                                                                            |
| `analysis_completed_at`      | string (ISO-8601) | Timestamp derived from the interaction’s last status change in the account timezone (not a separate analysis-completion clock). May not equal a pure “analysis finished” instant in all edge cases. |
| `failure_reason`             | string            | Not populated in the current response (`null` omitted). Use `status` and support channels when an analysis fails.                                                                                   |
| `categories`                 | array             | Scored categories. See Category object below.                                                                                                                                                       |
| `metadata`                   | object            | Interaction metadata, echoed for convenience.                                                                                                                                                       |


### Category Object


| Field                        | Type   | Description                                           |
| ---------------------------- | ------ | ----------------------------------------------------- |
| `name`                       | string | Category name (e.g. "Communication Skills").          |
| `ai_score`                   | float  | AI score for the category.                            |
| `qa_score`                   | float  | Manual QA score for the category. Omitted if not set. |
| `final_score`                | float  | Final score for the category.                         |
| `criticality_adjusted_score` | float  | Criticality-adjusted score.                           |
| `max_score`                  | float  | Maximum possible score.                               |
| `sub_categories`             | array  | Subcategories within this category.                   |


### SubCategory Object


| Field      | Type   | Description                                              |
| ---------- | ------ | -------------------------------------------------------- |
| `name`     | string | Subcategory name.                                        |
| `qa_score` | float  | Manual QA score for the subcategory. Omitted if not set. |
| `kpis`     | array  | Individual KPIs scored within this subcategory.          |


### KPI Object


| Field                          | Type   | Description                                       |
| ------------------------------ | ------ | ------------------------------------------------- |
| `kpi_name`                     | string | KPI name (e.g. "Proper Greeting").                |
| `ai_response`                  | string | The AI's answer (e.g. "Yes", "No", "Partially").  |
| `ai_justification`             | string | The AI's reasoning for its score.                 |
| `ai_suggestion`                | string | Optional AI suggestion text. Omitted if not set.  |
| `ai_score`                     | float  | AI score for this KPI.                            |
| `qa_score`                     | float  | Manual QA score for this KPI. Omitted if not set. |
| `qa_justification`             | string | QA justification text. Omitted if not set.        |
| `qa_selected_kpi_option_uid`   | string | UID of the KPI option selected by QA, if any.     |
| `qa_selected_kpi_option_value` | string | Label/value of the QA-selected KPI option.        |
| `user_comment`                 | string | Free-text QA/user comment on this KPI.            |
| `final_score`                  | float  | Final score (may reflect QA override).            |
| `criticality_adjusted_score`   | float  | Criticality-adjusted score.                       |
| `max_score`                    | float  | Maximum possible score for this KPI.              |


---

# File Schemas

When using the file-based ingestion endpoint (`POST /interactions/files`), CQA supports two file formats: CSV and NDJSON.

---

## CSV Schema

The first row of a CSV file must contain column headers. Headers are trimmed and lowercased before matching against canonical names.

### Canonical Column Names


| Column                    | Required | Type            | Description                                                                                                                                                                      |
| ------------------------- | -------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `external_interaction_id` | Yes      | string          | Your unique interaction identifier.                                                                                                                                              |
| `channel_type`            | Yes      | string          | `VOICE`, `CHAT`, `EMAIL`, `SMS`, `WHATSAPP`.                                                                                                            |
| `source`                  | No       | string          | Originating system identifier.                                                                                                                                                   |
| `language`                | No       | string          | Language code (e.g. `en`).                                                                                                                                                       |
| `interaction_start_time`  | No       | ISO-8601 string | ISO-8601 UTC format (e.g. `2026-04-01T10:00:00Z`).                                                                                                                               |
| `duration_seconds`        | No       | integer         | Interaction duration in seconds.                                                                                                                                                 |
| `audio_format`            | No       | string          | Format hint (e.g. `WAV`, `MP3`).                                                                                                                                                 |
| `callback_url`            | No       | string          | Per-row callback URL (stored; no HTTP callback from ingress).                                                                                                                    |
| `pii_redacted`            | No       | boolean         | `true` or `false`.                                                                                                                                                               |
| `audio_url`               | Yes (Mandatory if transcript_url is not provided)       | string          | Audio file URL(s). Supports multiple URLs separated by `;`.                                                                                                                      |
| `transcript_url`          | Yes (Mandatory if audio_url is not provided)       | string          | Transcript file URL(s). Supports multiple URLs separated by `;`.                                                                                                                 |
| `file_url`                | No       | string          | Generic file URL. Used with `file_type` as a fallback when no `audio_url`/`transcript_url` entries exist.                                                                        |
| `file_type`               | No       | string          | File extension for type resolution. Audio extensions: `mp3`, `wav`, `ogg`, `flac`, `m4a`, `aac`, `wma`, `amr`. Transcript extensions: `txt`, `pdf`, `doc`, `docx`, `srt`, `vtt`. |


**Content requirement:** Each row must have at least one of `audio_url`, `transcript_url`.

### Extra Columns Become Metadata

Any column header that is **not** in the canonical set above is automatically added to the row's `metadata` map. For example, columns named `agent`, `campaign`, or `disposition` become metadata key-value pairs without any extra configuration.

### Column Mapping

If your CSV uses non-standard headers, supply a `column_mapping` object in the file submission request to rename them. Keys are your original headers (trimmed, lowercased); values are canonical names.

**Example** -- given a CSV with headers `call_id,type,recording,agent,campaign`:

```json
{
  "column_mapping": {
    "call_id": "external_interaction_id",
    "type": "channel_type",
    "recording": "audio_url"
  }
}
```

After mapping, `agent` and `campaign` are not canonical, so they automatically become metadata.

### Example CSV

```csv
external_interaction_id,channel_type,audio_url,transcript_url,language,agent,campaign
call-001,VOICE,https://s3.example.com/rec-001.wav,https://s3.example.com/tr-001.txt,en,agent-42,retention
call-002,VOICE,https://s3.example.com/rec-002.wav,,hi,agent-15,support
call-003,CHAT,,,,agent-42,retention
```

> **Note:** Row 3 (`call-003`) would fail validation because it has no content source (no audio, transcript).

---

## Request-Level Defaults for File Ingestion

For both CSV and NDJSON file submissions, fields set on the `POST /interactions/files` request body are applied as defaults to every row:


| Request Field  | Behavior                                                         |
| -------------- | ---------------------------------------------------------------- |
| `source`       | Applied to rows where the row-level source is null or empty.     |
| `pii_redacted` | Applied to rows where the row-level value is null.               |
| `callback_url` | Applied to rows where the row-level value is null.               |
| `metadata`     | Merged with each row's metadata. Row-level keys take precedence. |


---

# Limits and Constraints


| Constraint                           | Value                                                                                         |
| ------------------------------------ | --------------------------------------------------------------------------------------------- |
| Max interactions per batch           | 100                                                                                           |
| Max metadata keys per interaction    | 50 (enforced on single/batch request bodies; keep merged file-row metadata within this bound) |
| Max rows per file job                | 100,000                                                                                       |
| Max file size per file job           | 100 MB                                                                                        |
| Max concurrent file jobs per account | 5 (default)                                                                                   |
| Batch tracking page size (max)       | 100 (silently clamped)                                                                        |
| Supported file formats               | `csv`, `ndjson`                                                                               |
| Supported file URL schemes           | `https`, `http`, `s3` (`https` recommended)                                                   |
| Supported channel types              | `VOICE`, `CHAT`, `EMAIL`, `SMS`, `WHATSAPP`                          |


