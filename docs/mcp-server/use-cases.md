---
id: use-cases
title: Use cases
description: Worked examples of what an AI agent can do through the Exotel MCP server, covering VoiceBot, SMS, voice, and quality analysis.
sidebar_label: Use cases
sidebar_position: 2
---

# Use cases

## Create a VoiceBot, call a customer, read the transcript

**Prompt to your AI client:**

> Create a VoiceBot named "Delivery reminder" that greets the caller, asks them to confirm a delivery slot between 6pm and 9pm today, and thanks them. Once it is ready, place a test call to +91XXXXXXXXXX and share the transcript with me.

**What the agent does:**

1. Calls `exotel_voicebot_create` with a natural-language description of the bot. The platform generates the assistant, its system prompt, a TTS voice, and default settings.
2. Polls `exotel_voicebot_creation_status` every few seconds until the bot is ready.
3. Calls `exotel_voicebot_list_phone_numbers` to pick a `caller_id`.
4. Calls `exotel_voicebot_place_call` with the bot ID and target number.
5. Polls `exotel_voicebot_call_status` until the call ends.
6. Calls `exotel_voicebot_transcript_get` with the session UUID and pastes the transcript back in chat.

Credentials required: VoiceBot fields plus the reused CPaaS `calls_*` fields for outbound dialing. See [Overview → VoiceBot](/docs/mcp-server/overview#voicebot).

## Run a DLT-compliant SMS campaign

**Prompt to your AI client:**

> Send our approved `offer_summer_2026` template to the 500 opted-in leads in `leads.csv`, personalizing the `first_name` field per row. Come back with counts of accepted and failed.

**What the agent does:**

1. Reads the CSV from your working directory.
2. Calls `exotel_sms_send_bulk_personalized` with the template ID and one row per lead. Exotel rejects any row whose sender ID or template ID does not match your DLT approvals.
3. Polls `exotel_sms_get_delivery_status` in batches for the returned SMS SIDs.
4. Sums the DELIVERED and FAILED counts and returns a short summary.

Failures come back with the DLT reason attached (invalid template, opted-out DND, header mismatch), which the agent can quote if you ask.

## Click-to-call an agent to a customer, with recording

**Prompt to your AI client:**

> Bridge Agent at +91AGENTNUMBER to Customer at +91CUSTNUMBER, record the call, and give me the recording link when it ends.

**What the agent does:**

1. Calls `exotel_voice_connect_two_numbers` with `record=true`.
2. Polls `exotel_voice_get_single_call_details` on the returned `CallSid` until `Status` is `completed`.
3. Extracts `RecordingUrl` from the response.
4. Wraps it with `exotel_audio_play_from_url` so you get an in-browser player, and `exotel_audio_download_from_url` for the raw file.

The `CallSid` is your reference for everything downstream: quality analysis, callback event lookup, refund disputes.

## Quality-analyze yesterday's inbound calls

**Prompt to your AI client:**

> Ingest every inbound call from yesterday against our `customer_support` quality profile and show me the ten lowest-scoring ones with the top three failure reasons.

**What the agent does:**

1. Calls `exotel_voice_get_bulk_call_details` filtered to yesterday's date and `Direction=inbound`.
2. Builds a batch payload of `{call_sid, audio_url}` and calls `exotel_cqa_ingest_batch`. The server returns a `job_id`.
3. Polls `exotel_cqa_track_job` until the batch analyses complete.
4. Calls `exotel_cqa_list_analyses` sorted by score, limit 10.
5. For each low-scoring interaction, calls `exotel_cqa_get_analysis` to pull the KPI breakdown, then aggregates the most common failed KPIs.

This assumes you already created a quality profile with `exotel_cqa_create_quality_profile` and an assignment rule that routes inbound customer-support calls to it.

## Send a ticket update by SMS

A support agent has a closed ticket and needs to tell the customer. They already have a DLT-approved template. They ask the client to send that template to the customer's number.

**Prompt to your AI client:**

> Send our approved `ticket_update` template to +91XXXXXXXXXX. Set `ticket_id` to TCK-1842. Tell me when Exotel accepts the message.

**What the agent does:**

1. Calls `exotel_sms_send_single` with the template ID, the destination number, and the `ticket_id` value.
2. Returns the SMS SID if Exotel accepts the request. If DLT rejects it (wrong template, DND, header mismatch), the agent quotes the reason.

If the customer later says the message never arrived, ask the client to check that SMS SID with `exotel_sms_get_delivery_status`.

## Hear the last call with a customer

A customer says an agent promised a refund this morning. Before you call them back, you want to hear that conversation.

**Prompt to your AI client:**

> Find this morning's inbound call from +91XXXXXXXXXX. Tell me how long it lasted and give me a link to play the recording.

**What the agent does:**

1. Calls `exotel_voice_search_callbacks_by_number` or `exotel_voice_get_bulk_call_details` with that number and today's date.
2. Picks the matching inbound call and calls `exotel_voice_get_single_call_details`.
3. If a recording exists, wraps the URL with `exotel_audio_play_from_url`.

See the [tools reference](/docs/mcp-server/tools-reference) for the full menu.
