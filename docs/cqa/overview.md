---
id: overview
title: CQA API Reference
sidebar_label: Overview
slug: /cqa/overview
description: Exotel CQA (Conversation Quality Analysis) — AI-powered quality
  scoring for contact center interactions. Data Import API, Analysis API, and
  CSV file schemas.
keywords:
  - CQA
  - Conversation Quality Analysis
  - Quality scoring
  - Contact center quality
  - AI quality analysis
  - Call analytics
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
https://cqa-console.in.exotel.com/
```

---

## Authentication

All Data Import and Analysis API endpoints authenticate via an API key passed in the `X-API-Key` header.

| API Surface | Auth Method | Header |
| --- | --- | --- |
| Data Import API | API Key | `X-API-Key: {key}` |
| Analysis API | API Key | `X-API-Key: {key}` |

### API Keys

API keys are scoped to a single account and are used for all programmatic ingestion and analysis retrieval. API keys can be created and managed through the CQA dashboard.

---

## Rate Limits

API endpoints are rate-limited per tenant (account).

- Requests that exceed the limit receive `429 Too Many Requests` with error code `**RATE_LIMIT_EXCEEDED**` (see Response Envelope).
- Too many **concurrent file jobs** is a separate `429` with code `**TOO_MANY_JOBS`\*\*.

| Endpoint Pattern | Method | Default tenant limit (typical) |
| --- | --- | --- |
| `/ingress/interactions`\* (ingest) | POST | 100 requests per minute |
| `/ingress/`\*\* (tracking) | GET | 300 requests per minute |

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

| Field | Type | Description |
| --- | --- | --- |
| `status` | integer | HTTP status code mirrored in the body. |
| `request_id` | string | Unique request identifier for tracing and support. |
| `message` | string | Human-readable detail (present on many errors; may be omitted when redundant). |
| `data` | object | Response payload (present on success). |
| `error` | object | Present on failure. Contains `**code`\*\* only. |

**Error Codes:**

| Code | HTTP Status | Description |
| --- | --- | --- |
| `VALIDATION_ERROR` | 400 | Request failed validation (missing required fields, exceeded limits). |
| `INVALID_JSON` | 400 | Request body is not valid JSON. |
| `INVALID_REQUEST` | 400 | Request contains invalid arguments. |
| `UNAUTHORIZED` | 401 | Missing or invalid API key. |
| `NOT_FOUND` | 404 | The requested resource was not found. |
| `DUPLICATE` | 409 | Returned for single-ingest conflict responses (see Ingest a Single Interaction). |
| `RATE_LIMIT_EXCEEDED` | 429 | Tenant or user rate limit exceeded. |
| `TOO_MANY_JOBS` | 429 | Too many concurrent file ingestion jobs for this account. |
| `INTERNAL_ERROR` | 500 | An unexpected server error occurred. |
| `CONVERSATION_CAP_EXCEEDED` | 429 | Account conversation cap exceeded. Daily, weekly, or monthly interaction limit reached. |

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

| Parameter Name | Mandatory / Optional | Type | Description |
| --- | --- | --- | --- |
| `external_interaction_id` | Mandatory | string | Your unique identifier for this interaction. Used for deduplication. |
| `channel_type` | Mandatory | string | Interaction channel. Recognized values: `VOICE`, `CHAT`, `EMAIL`, `SMS`, `WHATSAPP`. Other values are accepted (not rejected). |
| `source` | Optional | string | Identifies the originating system (e.g. `my-pbx`, `genesys`). |
| `language` | Optional | string | Language code (e.g. `en`, `hi`, `es`). |
| `interaction_start_time` | Optional | string (ISO-8601) | When the interaction started (e.g. `2026-04-01T10:30:00Z`). |
| `duration_seconds` | Optional | integer | Duration of the interaction in seconds. |
| `audio_format` | Optional | string | Audio format hint (e.g. `WAV`, `MP3`, `OGG`). |
| `callback_url` | Optional | string | Webhook URL for status update notifications. |
| `audio_url` | Mandatory if transcript\_url is not provided | string | Direct URL to the audio recording. |
| `transcript_url` | Mandatory if audio\_url is not provided | string | Direct URL to the transcript file. |
| `pii_redacted` | Optional | boolean | Whether PII has already been redacted in the provided content. Default: `false`.If you have already redacted PII either by your own means or using the [CQA provided capability](https://docs.exotel.com/conversation-intelligence/administration-and-configuration#46-pii-redaction), set this parameter as `true` (used internally to skip PII redaction again) |
| `metadata` | Optional | object | Arbitrary key-value pairs for tagging. Maximum 50 keys. Values can be strings, numbers, or booleans. |

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

`429 Too Many Requests` -- **Conversation cap exceeded.**

```
{
  "status": 429,
  "request_id": "req-abc-126",
  "message": "Daily conversation cap exceeded: 50/50",
  "error": {
    "code": "CONVERSATION_CAP_EXCEEDED"
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

| Parameter Name | Type | Description |
| --- | --- | --- |
| `interaction_id` | string (UUID) | CQA-assigned unique identifier for the interaction. |
| `external_interaction_id` | string | Your identifier, echoed back. |
| `status` | string | `queued` on success. |
| `message` | string | Top-level hint on **201** (e.g. queued). On errors, the detail text is in `message`, not inside `error`. |

---

## Ingest a Batch of Interactions

Submits up to 100 interactions as a single asynchronous job. Returns an `id` in `data` for tracking.

POST

```
https://{host}/cqa/api/v1/accounts/{account_id}/ingress/interactions/batch
```

### Request Parameters (JSON Body)

| Parameter Name | Mandatory / Optional | Type | Description |
| --- | --- | --- | --- |
| `interactions` | Mandatory | array | List of interaction objects, each following the same schema as the single ingest endpoint. Minimum 1, maximum 100. |

### Response Fields

| Parameter Name | Type | Description |
| --- | --- | --- |
| `id` | string | Unique identifier for the batch job. Use this with the batch tracking endpoint. |
| `type` | string | Always `batch` for this endpoint. |
| `status` | string | `pending` -- the job has been accepted and is queued for processing. |

---

## Submit a File for Ingestion

Submits a remote CSV file URL for asynchronous ingestion. CQA downloads and processes the file in the background.

POST

```
https://{host}/cqa/api/v1/accounts/{account_id}/ingress/interactions/files
```

### Request Parameters (JSON Body)

| Parameter Name | Mandatory / Optional | Type | Description |
| --- | --- | --- | --- |
| `file_url` | Mandatory | string | URL to the file. Supported schemes: `https://`, `http://`, `s3://`. `https` is strongly recommended; `http` is accepted but offers no transport encryption. Private/local addresses (localhost, 127.0.0.1, 10.x, 192.168.x, 172.16.x) are rejected. |
| `format` | Mandatory | string | File format: `csv` or `ndjson`. |
| `source` | Optional | string | Default source applied to all rows where the row-level source is not set. |
| `pii_redacted` | Optional | boolean | Default PII flag applied to all rows. |
| `callback_url` | Optional | string | Default callback URL stored per row (same semantics as single ingest; no HTTP callback from ingress). |
| `column_mapping` | Optional | object | Maps your CSV headers to canonical column names. Keys are your original headers (trimmed, lowercased); values are canonical names. Ignored for NDJSON. See CSV Schema for canonical names. |
| `metadata` | Optional | object | Default metadata merged into every row. After merge, each row should respect the **50-key** metadata limit enforced for batch/single ingest; avoid large default maps that push merged rows over the limit. |

### File Processing Limits

| Limit | Default Value |
| --- | --- |
| Max rows per file job | 100,000 |
| Max file size | 100 MB |

---

## Get Interaction by ID

Retrieves the current status and details of an ingested interaction.

GET

```
https://{host}/cqa/api/v1/accounts/{account_id}/ingress/interactions/{interaction_identifier}
```

### Path Parameters

| Parameter Name | Mandatory / Optional | Description |
| --- | --- | --- |
| `account_id` | Mandatory | Your CQA account ID. |
| `interaction_identifier` | Mandatory | Either the CQA-assigned UUID (`interaction_id`) or your `external_interaction_id`. |

### Response Fields

| Parameter Name | Type | Description |
| --- | --- | --- |
| `interaction_id` | string (UUID) | CQA-assigned unique identifier. |
| `external_interaction_id` | string | Your identifier. |
| `batch_id` | string | Job/batch ID if the interaction was part of a batch or file job. Omitted for single ingestion. |
| `channel_type` | string | Channel type as submitted. |
| `source` | string | Originating system. |
| `status` | string | Current status: `queued`, `processing`, `completed`, or `failed`. |
| `status_modified_at` | string (ISO-8601) | When the status last changed. |
| `failure_reason` | string | Reason for failure. Only present when status is `failed`; omitted otherwise. |
| `audio_url` | string | Resolved audio recording URL (same value as submitted `audio_url` / `files` audio URL). |
| `transcript_url` | string | Resolved transcript URL. |
| `pii_redacted` | boolean | Whether PII was flagged as redacted. |
| `created_at` | string (ISO-8601) | When the interaction was ingested. |
| `metadata` | object | Key-value metadata. |
| `analyses` | array | List of analyses triggered for this interaction. Each contains `analysis_id`, `profile_id`, and `status`. |

### Interaction Status Lifecycle

Applies to the `status` field on individual interactions and analyses.

| API Status | Meaning |
| --- | --- |
| `queued` | Interaction accepted, waiting to be processed. |
| `processing` | Analysis is underway. |
| `completed` | All analyses finished successfully. |
| `failed` | Processing failed (check `failure_reason`). |

### Job Status Lifecycle

Applies to the `status` field in the batch/file 202 response and the `job_status` field in the batch tracking response. Job statuses are distinct from interaction statuses.

| Job Status | Meaning |
| --- | --- |
| `pending` | Job accepted and queued. Returned in the initial 202 response. |
| `processing` | A worker has picked up the job and is processing rows. |
| `completed` | All rows have been processed (check `accepted`/`rejected` for counts). |
| `failed` | The job failed entirely (check `error_message`). |

---

## Track Batch / File Job

Retrieves all interactions for a batch or file job, with pagination and job-level status.

GET

```
https://{host}/cqa/api/v1/accounts/{account_id}/ingress/interactions/batch/{id}
```

### Path Parameters

| Parameter Name | Mandatory / Optional | Description |
| --- | --- | --- |
| `account_id` | Mandatory | Your CQA account ID. |
| `id` | Mandatory | The job identifier: the `**id**` returned in the batch or file **202** response (`data.id`). |

### Query Parameters

| Parameter Name | Default | Max | Description |
| --- | --- | --- | --- |
| `page` | 0 | -- | Zero-based page index. |
| `size` | 20 | 100 | Number of interactions per page. Values above 100 are silently clamped to 100. |

### Response Fields

| Parameter Name | Type | Description |
| --- | --- | --- |
| `id` | string | The job identifier (same as `data.id` from the batch or file **202** response). |
| `total` | integer | Total interactions associated with this job. |
| `interactions` | array | Paginated list of interaction detail objects. |
| `pagination` | object | Contains `page`, `size`, `total_elements`, `total_pages`. |
| `job_status` | string | Overall job status: `pending`, `processing`, `completed`, or `failed`. |
| `job_type` | string | `batch` or `file`. |
| `total_rows` | integer | Total rows found in the input (includes accepted + rejected). |
| `accepted` | integer | Number of rows successfully processed. |
| `rejected` | integer | Number of rows that failed validation. |
| `errors` | array | Up to 100 error entries. Each has `line` (row number), `reason`, and `external_interaction_id`. |
| `error_message` | string | Top-level error message if the entire job failed. |
| `completed_at` | string (ISO-8601) | When the job finished processing. |

---

# Analysis API

Retrieve detailed quality analysis results for a completed analysis.

**Base path:** `/api/v1/accounts/{account_id}/analyses`  
**Auth:** `X-API-Key` header

---

## **List Analyses**

Returns a paginated list of completed analyses matching the given filters. Date filter is mandatory; max range is 31 days.

**POST**

```
https://{host}/cqa/api/v1/accounts/{account_id}/analyses?limit={limit}&offset={offset}
```

**Query Parameters**

| Parameter Name | Default | Max | Description |
| --- | --- | --- | --- |
| `limit` | 20 | 100 | Number of results per page. |
| `offset` | 0 | 10000 | Zero-based result offset for pagination. |

**Request Parameters (JSON Body)**

| Parameter Name | Mandatory / Optional | Type | Description |
| --- | --- | --- | --- |
| `other_filters` | Mandatory | array | List of filter objects. Must include at least one `date` filter. |
| `quality_profile_uid` | Optional | string | Filter by quality profile UUID. |
| `metadata_filter_group` | Optional | array of arrays | Nested filter conditions on interaction metadata. Each inner array is an AND group; outer array is OR. |

**Filter Objects (**`other_filters`**)**

**Date filter (mandatory):**

| Field | Value |
| --- | --- |
| `field` | `"date"` |
| `operator` | `"range"` |
| `value` | Object with `start_date` and `end_date` in `YYYY-MM-DD` or ISO-8601 format. Max range: 31 days. |

**Score filter (optional):**

| Field | Value |
| --- | --- |
| `field` | `"score"` |
| `operator` | `"greater_than"`, `"less_than"`, `"greater_than_or_equal"`, `"less_than_or_equal"`, or `"equals"` |
| `value` | Numeric score value. |

**Example Request**

```
curl -X POST "https://{host}/cqa/api/v1/accounts/{account_id}/analyses?limit=5&offset=0" \
  -H "X-API-Key: {your_api_key}" \
  -H "Content-Type: application/json" \
  -d '{
    "other_filters": [
      {"field": "date", "operator": "range", "value": {"start_date": "2026-07-01", "end_date": "2026-07-15"}},
      {"field": "score", "operator": "greater_than_or_equal", "value": 9}
    ]
  }'
```

**Response**

`200 OK`

```
{
  "status": 200,
  "request_id": "51f6705d-6639-41ed-9029-d6053c5df1c2",
  "data": {
    "analyses": [
      {
        "analysis_id": "9f77853f-c4d4-482c-9651-b13394d65020",
        "interaction_id": "a30f0175-2ba0-46d8-8002-5b84667bfb44",
        "external_interaction_id": "file_7b1eeafb-f720-40bb-862f-60107f118e93",
        "profile_id": "e7d721ce-035d-4f79-ab62-e9cc2138f449",
        "status": "completed",
        "ai_score": 19.0,
        "qa_score": 21.0,
        "final_score": 21.0,
        "criticality_adjusted_score": 21.0,
        "metadata": {
          "source": "TestEvaluation",
          "agent_id": "qa_user",
          "campaign_id": "100"
        },
        "created_at": "2026-05-29T17:16:46.259993+05:30"
      }
    ],
    "pagination": {
      "limit": 5,
      "offset": 0,
      "total": 1
    }
  }
}
```

**Response Fields**

| Parameter Name | Type | Description |
| --- | --- | --- |
| `analysis_id` | string (UUID) | Unique analysis identifier. |
| `interaction_id` | string (UUID) | The interaction this analysis belongs to. |
| `external_interaction_id` | string | Your interaction identifier. May be `null` if the interaction record is unavailable. |
| `profile_id` | string | Quality profile used for scoring. |
| `status` | string | `completed`, `failed`, or `queued`. |
| `ai_score` | float | AI-generated quality score. |
| `qa_score` | float | Manual QA score. Omitted if no manual review. |
| `final_score` | float | Effective score (QA if present, otherwise AI). |
| `criticality_adjusted_score` | float | Score after criticality weights. |
| `metadata` | object | Interaction metadata. |
| `created_at` | string (ISO-8601) | When the analysis was created, in tenant timezone. |

**Pagination**

| Field | Type | Description |
| --- | --- | --- |
| `limit` | integer | Requested page size. |
| `offset` | integer | Current offset. |
| `total` | long | Total matching results across all pages. |

**Error Responses**

| Scenario | HTTP Status | Error Code | Example Message |
| --- | --- | --- | --- |
| Missing date filter | 400 | `VALIDATION_ERROR` | "Date filter is required. Provide a date filter with start\_date and end\_date in other\_filters." |
| Date range \> 31 days | 400 | `VALIDATION_ERROR` | "Date range must not exceed 31 days" |
| start\_date after end\_date | 400 | `VALIDATION_ERROR` | "start\_date must be before or equal to end\_date" |
| Invalid date format | 400 | `VALIDATION_ERROR` | "Invalid start\_date format. Expected: YYYY-MM-DD or ISO-8601" |
| Invalid score operator | 400 | `VALIDATION_ERROR` | "Unsupported score filter operator" |
| limit out of range | 400 | `VALIDATION_ERROR` | "limit must be between 1 and 100" |
| offset out of range | 400 | `VALIDATION_ERROR` | "offset must be between 0 and 10000" |

## Get Analysis Detail

Returns the full scoring breakdown for a specific analysis, including categories, subcategories, and individual KPI scores.

GET

```
https://{host}/cqa/api/v1/accounts/{account_id}/analyses/{analysis_id}
```

### Path Parameters

| Parameter Name | Mandatory / Optional | Description |
| --- | --- | --- |
| `account_id` | Mandatory | Your CQA account ID. |
| `analysis_id` | Mandatory | The analysis UUID (obtained from the interaction detail's `analyses` array). |

### Response Fields

| Parameter Name | Type | Description |
| --- | --- | --- |
| `analysis_id` | string (UUID) | Unique analysis identifier. |
| `interaction_id` | string (UUID) | The interaction this analysis belongs to. |
| `external_interaction_id` | string | Your interaction identifier. |
| `profile_id` | string | Quality profile used for scoring. |
| `profile_name` | string | Human-readable quality profile name. |
| `status` | string | `queued`, `processing`, `completed`, or `failed`. |
| `ai_score` | float | AI-generated quality score. |
| `qa_score` | float | Manual QA score (if a human reviewer overrode). Omitted if no manual review has occurred. |
| `final_score` | float | Effective score (QA score if present, otherwise AI score). |
| `criticality_adjusted_score` | float | Score after applying criticality weights. |
| `max_score` | float | Maximum possible score for this profile. |
| `analysis_completed_at` | string (ISO-8601) | Timestamp derived from the interaction's last status change in the account timezone (not a separate analysis-completion clock). May not equal a pure "analysis finished" instant in all edge cases. |
| `failure_reason` | string | Not populated in the current response (`null` omitted). Use `status` and support channels when an analysis fails. |
| `categories` | array | Scored categories. See Category object below. |
| `metadata` | object | Interaction metadata, echoed for convenience. |

### Category Object

| Field | Type | Description |
| --- | --- | --- |
| `name` | string | Category name (e.g. "Communication Skills"). |
| `ai_score` | float | AI score for the category. |
| `qa_score` | float | Manual QA score for the category. Omitted if not set. |
| `final_score` | float | Final score for the category. |
| `criticality_adjusted_score` | float | Criticality-adjusted score. |
| `max_score` | float | Maximum possible score. |
| `sub_categories` | array | Subcategories within this category. |

### SubCategory Object

| Field | Type | Description |
| --- | --- | --- |
| `name` | string | Subcategory name. |
| `qa_score` | float | Manual QA score for the subcategory. Omitted if not set. |
| `kpis` | array | Individual KPIs scored within this subcategory. |

### KPI Object

| Field | Type | Description |
| --- | --- | --- |
| `kpi_name` | string | KPI name (e.g. "Proper Greeting"). |
| `ai_response` | string | The AI's answer (e.g. "Yes", "No", "Partially"). |
| `ai_justification` | string | The AI's reasoning for its score. |
| `ai_suggestion` | string | Optional AI suggestion text. Omitted if not set. |
| `ai_score` | float | AI score for this KPI. |
| `qa_score` | float | Manual QA score for this KPI. Omitted if not set. |
| `qa_justification` | string | QA justification text. Omitted if not set. |
| `qa_selected_kpi_option_uid` | string | UID of the KPI option selected by QA, if any. |
| `qa_selected_kpi_option_value` | string | Label/value of the QA-selected KPI option. |
| `user_comment` | string | Free-text QA/user comment on this KPI. |
| `final_score` | float | Final score (may reflect QA override). |
| `criticality_adjusted_score` | float | Criticality-adjusted score. |
| `max_score` | float | Maximum possible score for this KPI. |

---

# File Schemas

When using the file-based ingestion endpoint (`POST /interactions/files`), CQA supports two file formats: CSV and NDJSON.

---

## CSV Schema

The first row of a CSV file must contain column headers. Headers are trimmed and lowercased before matching against canonical names.

### Canonical Column Names

| Column | Required | Type | Description |
| --- | --- | --- | --- |
| `external_interaction_id` | Yes | string | Your unique interaction identifier. |
| `channel_type` | Yes | string | `VOICE`, `CHAT`, `EMAIL`, `SMS`, `WHATSAPP`. |
| `source` | No | string | Originating system identifier. |
| `language` | No | string | Language code (e.g. `en`). |
| `interaction_start_time` | No | ISO-8601 string | ISO-8601 UTC format (e.g. `2026-04-01T10:00:00Z`). |
| `duration_seconds` | No | integer | Interaction duration in seconds. |
| `audio_format` | No | string | Format hint (e.g. `WAV`, `MP3`). |
| `callback_url` | No | string | Per-row callback URL (stored; no HTTP callback from ingress). |
| `pii_redacted` | No | boolean | `true` or `false`. |
| `audio_url` | Yes (Mandatory if transcript\_url is not provided) | string | Audio file URL(s). Supports multiple URLs separated by `;`. |
| `transcript_url` | Yes (Mandatory if audio\_url is not provided) | string | Transcript file URL(s). Supports multiple URLs separated by `;`. |
| `file_url` | No | string | Generic file URL. Used with `file_type` as a fallback when no `audio_url`/`transcript_url` entries exist. |
| `file_type` | No | string | File extension for type resolution. Audio extensions: `mp3`, `wav`, `ogg`, `flac`, `m4a`, `aac`, `wma`, `amr`. Transcript extensions: `txt`, `pdf`, `doc`, `docx`, `srt`, `vtt`. |

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

| Request Field | Behavior |
| --- | --- |
| `source` | Applied to rows where the row-level source is null or empty. |
| `pii_redacted` | Applied to rows where the row-level value is null. |
| `callback_url` | Applied to rows where the row-level value is null. |
| `metadata` | Merged with each row's metadata. Row-level keys take precedence. |

---

# Webhooks / Callbacks

When a `callback_url` is provided (on the single ingest request, in the batch/file request, or per CSV row), CQA delivers HTTP POST notifications to that URL at key points in the interaction's or file job’s lifecycle.

## Delivery

- **Method**: HTTP POST
- **Content-Type**: `application/json`
- **Timeout**: 10 seconds (connect and read)
- **Feature flag**: Webhook delivery is controlled by the feature flag. If the flag is disabled for the tenant, `callback_url` values are stored but no HTTP requests are made.

## Event Types

| Event | Trigger |
| --- | --- |
| `INTERACTION_INGESTED` | Interaction has been accepted and persisted. |
| `INTERACTION_ANALYSIS_IN_PROGRESS` | Analysis has started for a quality profile. |
| `INTERACTION_ANALYSIS_COMPLETED` | A single analysis completed successfully. Payload includes scores and KPI results. |
| `INTERACTION_ANALYSIS_FAILED` | A single analysis failed. Payload includes error details. |
| `INTERACTION_DISPUTE_RAISED` | A QA dispute has been raised on an analysis. |
| `INTERACTION_DISPUTE_RESOLVED` | A QA dispute has been resolved. |
| `FILE_INGESTION_COMPLETED` | A file ingestion job has finished processing. |

## Payload Structure

Every callback POST body is a JSON object with these top-level fields:

| Field | Type | Description |
| --- | --- | --- |
| `event` | string | The event type (see table above). |
| `deliveryId` | string (UUID) | Unique identifier for this delivery attempt. |
| `timestamp` | string (ISO-8601) | When the callback was generated (e.g. `2026-04-01T10:35:42.123Z`). |
| `accountId` | string | Your account identifier. |
| `interactionId` | string (UUID) | CQA's internal interaction identifier. Present for interaction-level events. |
| `externalInteractionId` | string | Your `external_interaction_id`. Present when available. |
| `data` | object | Event-specific data. Contents vary by event type (see below). |

### `data` by Event Type

`INTERACTION_INGESTED`

```json
{
  "status": "INGESTED"
}
```

`INTERACTION_ANALYSIS_IN_PROGRESS`

```json
{
  "analysisId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "profileId": "prof-001",
  "profileName": "Inbound Support"
}
```

`INTERACTION_ANALYSIS_COMPLETED`

```json
{
  "analysisId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "COMPLETED",
  "profileId": "prof-001",
  "aiScore": 85.0,
  "qaScore": null,
  "finalScore": 85.0,
  "criticalityAdjustedScore": 85.0,
  "analysisCompletedAt": "2026-04-01T10:35:42Z",
  "kpiResults": [
    {
      "kpiId": "kpi-101",
      "categoryId": "cat-01",
      "subCategoryId": "subcat-01",
      "aiResponse": "Yes",
      "aiJustification": "The agent greeted the customer by name.",
      "aiScore": 5.0,
      "qaScore": null,
      "finalScore": 5.0,
      "criticalityAdjustedScore": 5.0
    }
  ]
}
```

The `kpiResults` array is included when KPI-level results are available. Each entry contains the KPI identifier, its category/sub-category, the AI's response and justification, and individual scores.

`INTERACTION_ANALYSIS_FAILED`

```json
{
  "errorCode": "ANALYSIS_FAILED",
  "errorMessage": "Transcript processing timed out"
}
```

`INTERACTION_DISPUTE_RAISED`

```json
{
  "analysisId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "disputeId": "d1e2f3a4-b5c6-7890-abcd-ef1234567890"
}
```

`INTERACTION_DISPUTE_RESOLVED`

```json
{
  "analysisId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "disputeId": "d1e2f3a4-b5c6-7890-abcd-ef1234567890",
  "resolution": "ACCEPTED",
  "updatedScore": 90.0
}
```

`FILE_INGESTION_COMPLETED`

```json
{
  "fileJobId": "job-2026-04-01-001",
  "status": "FILE_INGESTION_COMPLETED",
  "totalRows": 500,
  "accepted": 498,
  "rejected": 2,
  "completedAt": "2026-04-01T11:05:00Z",
  "errors": [
    {
      "row": 42,
      "reason": "Missing required field: external_interaction_id"
    }
  ]
}
```

### Full Example

A complete callback payload for a completed analysis:

```json
{
  "event": "INTERACTION_ANALYSIS_COMPLETED",
  "deliveryId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "timestamp": "2026-04-01T10:35:42.123Z",
  "accountId": "e067e113f4",
  "interactionId": "550e8400-e29b-41d4-a716-446655440000",
  "externalInteractionId": "call-2026-04-01-001",
  "data": {
    "analysisId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "status": "COMPLETED",
    "profileId": "prof-001",
    "aiScore": 85.0,
    "qaScore": null,
    "finalScore": 85.0,
    "criticalityAdjustedScore": 85.0,
    "analysisCompletedAt": "2026-04-01T10:35:42Z",
    "kpiResults": [
      {
        "kpiId": "kpi-101",
        "categoryId": "cat-01",
        "subCategoryId": "subcat-01",
        "aiResponse": "Yes",
        "aiJustification": "The agent greeted the customer by name.",
        "aiScore": 5.0,
        "qaScore": null,
        "finalScore": 5.0,
        "criticalityAdjustedScore": 5.0
      }
    ]
  }
}
```

## Security -- HMAC Signature

Each callback request includes headers for verifying authenticity:

| Header | Description |
| --- | --- |
| `X-CQA-Signature` | HMAC-SHA256 signature of the request body, formatted as `sha256=<hex>`. |
| `X-CQA-Timestamp` | ISO-8601 timestamp of when the request was sent (e.g. `2026-04-01T10:35:42.123Z`). |

To verify a callback:

1. Extract the hex digest from `X-CQA-Signature` (strip the `sha256=` prefix).
2. Compute `HMAC-SHA256(secret, requestBody)` using your API key secret as the signing key.
3. Compare the computed hex digest with the value from step 1.

The signing secret is derived from your active API key. It is shared during onboarding.

## Retry Policy

If the callback endpoint returns a `5xx` or `429` status code (or the request times out), CQA retries delivery. A total of **3 attempts** are made (1 initial + 2 retries):

| Attempt | Delay before attempt |
| --- | --- |
| 1st (initial) | Immediate |
| 2nd (1st retry) | \~10 seconds |
| 3rd (2nd retry) | \~30 seconds |

After 3 failed attempts, the delivery is marked as `FAILED`.

Callbacks that receive `2xx` or `4xx` (other than `429`) responses are **not** retried.

---

# Limits and Constraints

| Constraint | Value |
| --- | --- |
| Max interactions per batch | 100 |
| Max metadata keys per interaction | 50 (enforced on single/batch request bodies; keep merged file-row metadata within this bound) |
| Max rows per file job | 100,000 |
| Max file size per file job | 100 MB |
| Max concurrent file jobs per account | 5 (default) |
| Batch tracking page size (max) | 100 (silently clamped) |
| Supported file formats | `csv`, `ndjson` |
| Supported file URL schemes | `https`, `http`, `s3` (`https` recommended) |
| Supported channel types | `VOICE`, `CHAT`, `EMAIL`, `SMS`, `WHATSAPP` |
| Conversation cap (trial accounts) | 300 per month (default when no cap is explicitly configured) |

