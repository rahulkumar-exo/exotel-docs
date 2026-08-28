---
id: overview
title: Exotel MCP server
description: Let your AI agents interact with Exotel through the Model Context Protocol server. 62 tools covering voice, SMS, VoiceBot, and Conversational Intelligence, available to any MCP-compatible client.
sidebar_label: Overview
slug: /mcp-server/overview
---

# Exotel MCP server

The Exotel [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server gives AI agents a set of tools they can invoke on your Exotel account. Once you connect a client (Claude, Cursor, VS Code, Windsurf, Claude Code), the agent can place calls, send SMS, manage VoiceBots, pull transcripts, and run Conversational Intelligence.

## How it works

Exotel hosts a remote MCP server at `https://mcp.exotel.com/mcp` that uses the [Streamable HTTP transport](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports). Your AI client connects to that endpoint. Authentication is a JSON object in the `Authorization` header, with one section per product you want to enable.

Server info:

| Field | Value |
|-------|-------|
| Endpoint | `https://mcp.exotel.com/mcp` |
| Transport | Streamable HTTP |
| Protocol version | `2025-06-18` |
| Tools | 62 across CPaaS, VoiceBot, and Conversational Intelligence |
| Resources | 19 API reference documents your agent can pull into context |
| Prompts | 22 pre-built prompt templates for common workflows |

Open source reference implementation: [github.com/exotel/ExotelMCP](https://github.com/exotel/ExotelMCP).

## Authentication

Authentication uses your existing Exotel API credentials. Every request to `https://mcp.exotel.com/mcp` carries an `Authorization` header containing a JSON object with those credentials. The server forwards each tool call to the underlying CPaaS, VoiceBot, or CQA API, which authenticates it against your account. No separate MCP token or OAuth flow is involved: if the credentials work against `api.exotel.com`, they work here.

The JSON has three product groups. Include only the groups you want to enable. Tools for a missing product still appear in `tools/list`, but calling one returns a credential error at call time.

### CPaaS (voice, SMS, number lookup, Engage)

| Field | Value |
|-------|-------|
| `token` | Base64 of `api_key:api_token` from `my.exotel.com` → Settings → API Settings. |
| `account_sid` | Account SID from the same page. |
| `from_number` | Your Exotel virtual number (from Numbers). |
| `caller_id` | Usually same as `from_number`. |
| `api_domain` | `https://api.in.exotel.com` for India-hosted accounts, `https://api.exotel.com` for globally-hosted accounts. |
| `exotel_portal_url` | `https://my.exotel.com` (or `https://my.in.exotel.com` for India-hosted). |

### VoiceBot

| Field | Value |
|-------|-------|
| `voicebot_api_key`, `voicebot_api_token`, `voicebot_account_id` | VoiceBot Dashboard → Settings → API Keys. |
| `voicebot_base_url` | Defaults to `https://voicebot.in.exotel.com/voicebot/api/v2`. |
| `calls_api_key`, `calls_api_token`, `calls_account_id` | Reused from CPaaS credentials. Required for bot-driven outbound calls. |

### Conversational Intelligence (CQA)

| Field | Value |
|-------|-------|
| `cqa_api_key`, `cqa_account_id` | CQA Console → Settings → API Keys. |
| `cqa_host` | Defaults to `https://cqa-console.in.exotel.com`. |

Call `exotel_setup_guide` from your client any time to see which product groups your current header configures.

## Set up Exotel MCP

Pick your client and use the snippet below. All clients point at `https://mcp.exotel.com/mcp` and carry the same JSON `Authorization` header. Cursor and VS Code speak HTTP MCP natively. Claude Desktop, Claude Code, and Windsurf use the `mcp-remote` bridge from npm.

Replace `BASE64_OF_APIKEY_APITOKEN` with the base64 encoding of `api_key:api_token`, and fill in the other placeholder values. On macOS or Linux:

```bash
echo -n "API_KEY:API_TOKEN" | base64
```

The minimum-viable JSON auth header (CPaaS only) is:

```json
{"token":"BASE64_OF_APIKEY_APITOKEN","from_number":"YOUR_EXOTEL_NUMBER","caller_id":"YOUR_EXOTEL_NUMBER","account_sid":"YOUR_ACCOUNT_SID","api_domain":"https://api.in.exotel.com","exotel_portal_url":"https://my.exotel.com"}
```

Add VoiceBot or CQA fields to the same JSON when you want those products enabled.

### Cursor

Add the following to `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (project).

```json
{
  "mcpServers": {
    "exotel": {
      "url": "https://mcp.exotel.com/mcp",
      "headers": {
        "Authorization": "{\"token\":\"BASE64_OF_APIKEY_APITOKEN\",\"from_number\":\"YOUR_EXOTEL_NUMBER\",\"caller_id\":\"YOUR_EXOTEL_NUMBER\",\"account_sid\":\"YOUR_ACCOUNT_SID\",\"api_domain\":\"https://api.in.exotel.com\",\"exotel_portal_url\":\"https://my.exotel.com\"}"
      }
    }
  }
}
```

Reload the window (`Cmd/Ctrl + Shift + P` → **Developer: Reload Window**). Open Cursor Settings → **MCP** to confirm `exotel` shows as connected.

See [Cursor's MCP documentation](https://docs.cursor.com/context/model-context-protocol).

### VS Code

Add the following to `.vscode/mcp.json` in your workspace.

```json
{
  "servers": {
    "exotel": {
      "type": "http",
      "url": "https://mcp.exotel.com/mcp",
      "headers": {
        "Authorization": "{\"token\":\"BASE64_OF_APIKEY_APITOKEN\",\"from_number\":\"YOUR_EXOTEL_NUMBER\",\"caller_id\":\"YOUR_EXOTEL_NUMBER\",\"account_sid\":\"YOUR_ACCOUNT_SID\",\"api_domain\":\"https://api.in.exotel.com\",\"exotel_portal_url\":\"https://my.exotel.com\"}"
      }
    }
  }
}
```

Reload the window. See [VS Code's MCP documentation](https://code.visualstudio.com/docs/copilot/chat/mcp-servers).

### Claude Desktop

Add the following to your Claude Desktop config file (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS, `%APPDATA%\Claude\claude_desktop_config.json` on Windows).

```json
{
  "mcpServers": {
    "exotel": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://mcp.exotel.com/mcp",
        "--header",
        "Authorization:${AUTH_HEADER}"
      ],
      "env": {
        "AUTH_HEADER": "{\"token\":\"BASE64_OF_APIKEY_APITOKEN\",\"from_number\":\"YOUR_EXOTEL_NUMBER\",\"caller_id\":\"YOUR_EXOTEL_NUMBER\",\"account_sid\":\"YOUR_ACCOUNT_SID\",\"api_domain\":\"https://api.in.exotel.com\",\"exotel_portal_url\":\"https://my.exotel.com\"}"
      }
    }
  }
}
```

You need [Node.js 18+](https://nodejs.org) installed, since Claude Desktop launches `mcp-remote` through `npx`. Fully quit and reopen Claude Desktop. See [MCP setup for Claude Desktop](https://modelcontextprotocol.io/quickstart/user).

### Claude Code

Add the server from your project directory:

```bash
claude mcp add --transport http exotel https://mcp.exotel.com/mcp \
  --header 'Authorization: {"token":"BASE64_OF_APIKEY_APITOKEN","from_number":"YOUR_EXOTEL_NUMBER","caller_id":"YOUR_EXOTEL_NUMBER","account_sid":"YOUR_ACCOUNT_SID","api_domain":"https://api.in.exotel.com","exotel_portal_url":"https://my.exotel.com"}'
```

Or edit `.claude/settings.json` with the same block as Claude Desktop above.

Restart the Claude Code session. See [Claude Code MCP documentation](https://docs.anthropic.com/en/docs/claude-code/mcp).

### Windsurf

Add the following to `~/.codeium/windsurf/mcp_config.json`.

```json
{
  "mcpServers": {
    "exotel": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://mcp.exotel.com/mcp",
        "--header",
        "Authorization:${AUTH_HEADER}"
      ],
      "env": {
        "AUTH_HEADER": "{\"token\":\"BASE64_OF_APIKEY_APITOKEN\",\"from_number\":\"YOUR_EXOTEL_NUMBER\",\"caller_id\":\"YOUR_EXOTEL_NUMBER\",\"account_sid\":\"YOUR_ACCOUNT_SID\",\"api_domain\":\"https://api.in.exotel.com\",\"exotel_portal_url\":\"https://my.exotel.com\"}"
      }
    }
  }
}
```

Restart Windsurf. See [Windsurf's MCP documentation](https://docs.windsurf.com/windsurf/cascade/mcp).

### Other MCP-compatible clients

Any client that supports MCP over Streamable HTTP can connect to `https://mcp.exotel.com/mcp`. If your client speaks only stdio, use the `mcp-remote` bridge shown in the Claude Desktop example.

## Verify the connection

After the restart, ask your client:

> Call `exotel_setup_guide` and tell me which Exotel products my credentials configure.

The response shows CPaaS / VoiceBot / CQA as **configured** or **not configured**, based on what fields you included in the JSON auth header.

Follow up with, for example:

> List every tool available from the Exotel MCP server, grouped by category.

## See also

- [Use cases](/docs/mcp-server/use-cases). Worked examples across VoiceBot, SMS, voice, and quality analysis.
- [Tools reference](/docs/mcp-server/tools-reference). Every tool, resource, and prompt the server exposes.
- [Security](/docs/mcp-server/security). Credential handling, rotation, data residency.
- [Troubleshooting](/docs/mcp-server/troubleshooting). Common issues and fixes.
