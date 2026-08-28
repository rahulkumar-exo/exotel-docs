---
id: troubleshooting
title: Troubleshooting
description: Common issues when connecting Claude, Cursor, VS Code, Windsurf, or Claude Code to the Exotel MCP server, with diagnostic commands.
sidebar_label: Troubleshooting
sidebar_position: 5
---

# Troubleshooting

The problems below cover most Exotel MCP connection failures. If none apply, capture the client-side MCP logs (see [Debug logs](#debug-logs)) and email [hello@exotel.com](mailto:hello@exotel.com) with the subject **MCP server — connection issue**.

## Server does not appear in the client

- **Reload the window or restart the app.** MCP servers load once at startup, so changes you make to the config after that are ignored. In Cursor and VS Code, use **Developer: Reload Window**. In Claude Desktop, fully quit (Cmd+Q) and reopen. In Windsurf and Claude Code, restart the process.
- **Check the config path.** Cursor uses `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (project). Claude Desktop uses `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS and `%APPDATA%\Claude\claude_desktop_config.json` on Windows. VS Code uses `.vscode/mcp.json` in your workspace.
- **Validate the JSON.** A single missing comma or unbalanced brace makes the whole file invalid. Run `cat ~/.cursor/mcp.json | jq .` (or the equivalent path).

## `mcp-remote` fails to start (Claude Desktop, Claude Code, Windsurf)

- **Install Node.js 18 or newer.** `mcp-remote` runs through `npx`. Run `node -v` in a terminal. If it errors or shows a version below 18, install from [nodejs.org](https://nodejs.org) and restart your client.
- **First launch is slow.** `npx` downloads `mcp-remote` on first run. Give the client 20-30 seconds.
- **Clear the auth cache.** Run `rm -rf ~/.mcp-auth` and `pkill -f mcp-remote`, then restart your client.

## `401 Unauthorized` or "credential error"

- **Base64 the token correctly.** `token` must be base64 of `api_key:api_token`: the literal string with a colon separator and no spaces. Regenerate with `echo -n "API_KEY:API_TOKEN" | base64`. The `-n` flag matters; a trailing newline breaks the token.
- **Escape the JSON.** In `mcp.json` / `claude_desktop_config.json`, the `Authorization` value is a JSON string, so double quotes inside it must be escaped: `"Authorization": "{\"token\":\"...\"}"`. Or store the JSON in an `env` variable and reference it as `${AUTH_HEADER}`.
- **Match the API domain.** India-hosted accounts use `https://api.in.exotel.com`. Globally-hosted accounts use `https://api.exotel.com`. A mismatch returns `401` or a "resource not found" error.
- **Product-scoped errors.** A CPaaS credential works only for CPaaS tools. If a VoiceBot tool errors with "credential not configured," you missed the `voicebot_*` fields. Call `exotel_setup_guide` to see which products your header configures.

## Tool call fails with "resource not found" or `4xx`

- **Wrong `account_sid`.** The SID must match the account that owns the API key. Copy both from the same row of my.exotel.com → Settings → API Settings.
- **`from_number` isn't a virtual number on this account.** Only numbers you see under my.exotel.com → Numbers can act as `from_number` or `caller_id`. Sub-accounts have their own number pool.
- **DLT-blocked SMS.** SMS to India-registered numbers requires a DLT-approved template and sender ID. Errors return as `500` with a DLT reason. Configure templates at [my.exotel.com](https://my.exotel.com) → SMS → Templates first.

## Tools list is empty

- **Wrong URL.** The endpoint is `https://mcp.exotel.com/mcp`. Not `mcp.exotel.com` (no path), and not `api.exotel.com/mcp`. A wrong URL usually returns HTML, which the client silently drops.
- **Wrong transport.** The server is Streamable HTTP. If your client asks for SSE-only, wrap it with `mcp-remote` (see the Claude Desktop pattern in the [Overview](/docs/mcp-server/overview#claude-desktop)).

## VoiceBot tools return but calls never dial

Bot-driven outbound calls need three credential sets in the same JSON header:

- VoiceBot credentials (`voicebot_api_key`, `voicebot_api_token`, `voicebot_account_id`)
- Outbound-call credentials (`calls_api_key`, `calls_api_token`, `calls_account_id`), typically the same as CPaaS
- A valid `from_number` from `exotel_voicebot_list_phone_numbers`

If any of these is missing, the tool returns a config error before dialing.

## CQA ingestion succeeds but analysis stays "pending"

Analysis runs asynchronously against your assignment rules. If no assignment rule matches, the interaction stays queued. Call `exotel_cqa_list_assignment_rules` to check that an active rule matches the interaction's metadata, then call `exotel_cqa_track_job` (for batches) or `exotel_cqa_get_analysis` (for single interactions) again after 30-60 seconds.

## Test with curl

If your client can't connect, verify the server directly. Store the JSON in a shell variable first. Do not inline it in the command, and do not paste it into shell history.

```bash
AUTH='{"token":"BASE64_OF_APIKEY_APITOKEN","from_number":"YOUR_EXOTEL_NUMBER","caller_id":"YOUR_EXOTEL_NUMBER","account_sid":"YOUR_ACCOUNT_SID","api_domain":"https://api.in.exotel.com","exotel_portal_url":"https://my.exotel.com"}'

curl -sS -N -X POST https://mcp.exotel.com/mcp \
  -H "Authorization: $AUTH" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "MCP-Protocol-Version: 2025-06-18" \
  -d '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"initialize",
    "params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"curl","version":"1"}}
  }'
```

A successful response is a JSON-RPC `result` naming the server. If you get `401`, your `Authorization` is wrong. If you get `404`, your URL is wrong.

Follow up with `tools/list` to enumerate the tools your credentials expose:

```bash
curl -sS -N -X POST https://mcp.exotel.com/mcp \
  -H "Authorization: $AUTH" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "MCP-Protocol-Version: 2025-06-18" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list"}'
```

## Debug logs

- **Cursor.** `View → Output`, choose **MCP Logs** in the dropdown.
- **VS Code.** `View → Output`, choose **GitHub Copilot Chat: MCP Servers**.
- **Claude Desktop.** `~/Library/Logs/Claude/mcp*.log` on macOS.
- **Claude Code.** `~/.claude/logs/` and `--verbose` on the CLI.
- **Windsurf.** Cascade panel → MCP → **View Logs**.

## MCP Inspector

The community [MCP Inspector](https://github.com/modelcontextprotocol/inspector) shows `tools/list`, `resources/list`, and `prompts/list` interactively.

```bash
npx @modelcontextprotocol/inspector
```

Choose **Streamable HTTP**, set URL to `https://mcp.exotel.com/mcp`, and paste your JSON header into the `Authorization` field.

## Still stuck

- File an issue at [github.com/exotel/ExotelMCP](https://github.com/exotel/ExotelMCP/issues) with your client name, redacted `Authorization` JSON (fields present, values removed), and the error message.
- Email [hello@exotel.com](mailto:hello@exotel.com) with the subject **MCP server — credential issue** for account-specific credential problems. Include your Account SID. Do not paste raw API keys or tokens.
