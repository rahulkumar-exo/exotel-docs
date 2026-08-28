---
id: tools-reference
title: Tools
description: The Exotel MCP server exposes 62 tools across CPaaS, VoiceBot, and Conversational Intelligence, plus 19 API reference resources and 22 pre-built prompts.
sidebar_label: Tools
sidebar_position: 3
---

# Tools

The Exotel MCP server exposes the following [MCP tools](https://modelcontextprotocol.io/docs/concepts/tools). Every tool below appears in `tools/list` regardless of which product credentials you provide in your [`Authorization` header](/docs/mcp-server/overview#authentication). Invoking a tool whose product isn't configured (for example, a VoiceBot tool without VoiceBot credentials) returns a credential error.

## Setup helpers

Work without any credentials.

| Tool | Description |
|------|-------------|
| `exotel_setup_guide` | Shows product-by-product setup instructions and which products your current credentials enable. |
| `exotel_build_config` | Generates a ready-to-paste MCP config for `cursor` or `claude`, scoped to `cpaas`, `voicebot`, and / or `cqa`. |

## CPaaS

### Voice

| Tool | Description |
|------|-------------|
| `exotel_voice_call_initiate` | Initiates a voice call to a target number from a fixed source number. |
| `exotel_voice_connect_two_numbers` | Initiates an outgoing voice call from a specified number to a target number. |
| `exotel_voice_connect_to_call_flow` | Initiates a voice call and connects the number to a predefined call flow (app). |
| `exotel_voice_get_single_call_details` | Gets detailed information for a specific `CallSid`. |
| `exotel_voice_get_bulk_call_details` | Fetches bulk voice call details based on a source number. |
| `exotel_voice_get_call_status_callbacks` | Fetches voice call status callbacks for a given phone number. |
| `exotel_voice_search_callbacks_by_number` | Searches voice callbacks by phone number in both `to_number` or `from_number`. |

### SMS

| Tool | Description |
|------|-------------|
| `exotel_sms_send_single` | Sends a DLT-compliant SMS to one number. |
| `exotel_sms_send_bulk_same_message` | Sends the same SMS to multiple numbers in one request. |
| `exotel_sms_send_bulk_personalized` | Sends dynamic SMS to multiple numbers, each with different content. |
| `exotel_sms_get_delivery_status` | Fetches SMS delivery status records for a given phone number. |

### Number metadata

| Tool | Description |
|------|-------------|
| `exotel_number_get_metadata` | Retrieves metadata for a phone number (carrier, circle) with caching. |

### Audio helpers

Return clickable links for audio URLs. Useful with recording URLs returned by voice or VoiceBot calls.

| Tool | Description |
|------|-------------|
| `exotel_audio_play_from_url` | Returns a link to play any audio URL directly in the browser. |
| `exotel_audio_open_player` | Returns a link to open the web audio player interface. |
| `exotel_audio_download_from_url` | Returns a direct download link for an audio URL. |

### Engage campaigns

| Tool | Description |
|------|-------------|
| `exotel_engage_create_sms_campaign` | Creates an Engage SMS message campaign (static content). |

## VoiceBot

### Bot lifecycle

| Tool | Description |
|------|-------------|
| `exotel_voicebot_list_all` | Lists all VoiceBots on the account. Supports pagination and status filter. |
| `exotel_voicebot_get_details` | Gets full details of a single VoiceBot by ID. |
| `exotel_voicebot_create` | Creates a new VoiceBot from a natural-language description. |
| `exotel_voicebot_creation_status` | Checks the status of an in-progress AI bot generation. |
| `exotel_voicebot_delete` | Deletes a VoiceBot permanently. |
| `exotel_voicebot_update_config` | Updates TTS, ASR, VAD, denoiser, webhook, or greeting config. |

### Outbound calls and transcripts

| Tool | Description |
|------|-------------|
| `exotel_voicebot_place_call` | Places an outbound call powered by a VoiceBot. |
| `exotel_voicebot_call_status` | Gets call details by `CallSid` (status, duration, recording URL, timestamps). |
| `exotel_voicebot_list_phone_numbers` | Lists phone numbers (DIDs) available for use as `callerId`. |
| `exotel_voicebot_transcript_get` | Fetches the full conversation transcript for a VoiceBot session UUID. |

### Assistant configuration

| Tool | Description |
|------|-------------|
| `exotel_voicebot_assistant_get_config` | Gets the full config of a VoiceBot assistant. |
| `exotel_voicebot_assistant_update_prompt` | Updates the assistant's instruction / system prompt (creates a new version). |
| `exotel_voicebot_assistant_push_version` | Creates a new assistant version with a custom data payload. |
| `exotel_voicebot_assistant_create_multiagent` | Creates a new multi-agent assistant. |

### Personas, voices, and specializations

| Tool | Description |
|------|-------------|
| `exotel_voicebot_persona_list` | Lists all personas (personality, language, gender profiles). |
| `exotel_voicebot_persona_create` | Creates a new persona. |
| `exotel_voicebot_persona_update` | Updates an existing persona. |
| `exotel_voicebot_tts_list_providers` | Lists available TTS providers (ElevenLabs, Azure, Sarvam). |
| `exotel_voicebot_tts_list_voices` | Lists voices for a given TTS provider. |
| `exotel_voicebot_specialization_list` | Lists specializations (reusable config overrides). |
| `exotel_voicebot_specialization_create` | Creates a new specialization. |
| `exotel_voicebot_specialization_update` | Updates a specialization's name or config. |

## Conversational Intelligence (CQA)

### Ingestion and retrieval

| Tool | Description |
|------|-------------|
| `exotel_cqa_ingest_interaction` | Ingest a single interaction (audio URL, transcript URL, or inline transcript text) for quality analysis. |
| `exotel_cqa_ingest_batch` | Ingest a batch of interactions (up to 100) as one async job. |
| `exotel_cqa_ingest_file` | Submit a remote CSV file URL for bulk async ingestion. |
| `exotel_cqa_get_interaction` | Retrieve the status and details of an ingested interaction. |
| `exotel_cqa_track_job` | Track the status of a batch or file ingestion job. |
| `exotel_cqa_get_analysis` | Retrieve the full quality analysis for a completed interaction. |
| `exotel_cqa_list_analyses` | List scored interaction analyses with optional filters. |

### Auth and API keys

| Tool | Description |
|------|-------------|
| `exotel_cqa_login` | Authenticate with CQA to obtain a JWT bearer token. Do not paste that token into chat, tickets, or logs. Treat it like a password. |
| `exotel_cqa_create_api_key` | Generate a new API key for data import and analysis. |
| `exotel_cqa_list_api_keys` | List all active API keys. |
| `exotel_cqa_revoke_api_key` | Revoke (delete) an API key. |
| `exotel_cqa_configure_metadata` | List or create metadata field mappings for interactions. |

### Quality profiles

| Tool | Description |
|------|-------------|
| `exotel_cqa_create_quality_profile` | Create a quality profile with categories, sub-categories, and KPIs in one call. |
| `exotel_cqa_get_quality_profile` | Get a profile including its full hierarchy. |
| `exotel_cqa_list_quality_profiles` | List profiles with pagination. |
| `exotel_cqa_update_quality_profile` | Update an existing profile. |
| `exotel_cqa_duplicate_quality_profile` | Duplicate a profile including all categories, sub-categories, and KPIs. |
| `exotel_cqa_delete_quality_profile` | Delete a profile permanently. |

### Assignment rules

| Tool | Description |
|------|-------------|
| `exotel_cqa_create_assignment_rule` | Create an assignment rule routing interactions to a profile. |
| `exotel_cqa_list_assignment_rules` | List assignment rules with pagination. |
| `exotel_cqa_update_assignment_rule` | Update an existing assignment rule. |
| `exotel_cqa_delete_assignment_rule` | Delete (deactivate) an assignment rule. |

## Resources

The server also publishes 19 static reference resources: API overviews, request and response JSON schemas, callback formats, error codes, and code samples. AI clients can pull any of them into context.

| URI prefix | Contents |
|------------|----------|
| `exotel://api/voice/*` | Voice API overview, connect-numbers, call-flow docs. |
| `exotel://api/sms/*` | SMS API overview, send, bulk docs (with DLT). |
| `exotel://schema/voice/*` and `exotel://schema/sms/*` | JSON schemas for requests and responses. |
| `exotel://callbacks/voice`, `exotel://callbacks/sms` | Callback event and payload formats. |
| `exotel://errors/codes` | The full Exotel error-code list. |
| `exotel://examples/voice`, `exotel://examples/sms` | Real-world code samples. |
| `exotel://cqa/api/*`, `exotel://cqa/schema/csv` | CQA API overview, ingest, analysis, and CSV column specs. |

## Prompts

The server exposes 22 pre-built prompt templates for the most common workflows. Your AI client lists them under the "prompts" menu. Examples:

- `send_sms`, `make_voice_call`, `connect_calls`
- `send_bulk_sms`, `send_dynamic_bulk_sms`
- `check_sms_status`, `check_call_status`, `get_call_details`, `lookup_number_info`
- `communication_workflow`, `bulk_campaign`
- `cqa_ingest_interaction`, `cqa_ingest_file`, `cqa_check_interaction`, `cqa_get_analysis`, `cqa_track_job`
- `cqa_list_quality_profiles`, `cqa_delete_quality_profile`
- `quick_play_audio`, `open_audio_player`, `download_audio`

## Discovering the live tool set

To see the current list from your client, ask it:

> List every tool available from the Exotel MCP server, with parameters and descriptions.

Or send a raw `tools/list` request over MCP; see [Troubleshooting](/docs/mcp-server/troubleshooting#test-with-curl).
