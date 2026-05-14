---
id: overview
title: Exotel MCP Server
description: Set up the Exotel MCP Server to integrate Claude, Cursor, VS Code, and other MCP-compatible IDEs with Exotel SMS, voice calling, and status tracking APIs.
sidebar_label: Overview
slug: /mcp-server/overview
---

# Exotel MCP Server

The Exotel MCP (Model Context Protocol) Server lets your AI tools — Claude Desktop, Cursor, VS Code, Claude Code, and any other MCP-compatible client — call Exotel's communication APIs directly from inside the IDE.

Once configured, you can prompt your AI assistant with things like *"Send an SMS to +919999999999 saying 'Hello'"* or *"Call +919999999999 from my registered number"* and it will execute against your Exotel account.

## Key Features

- **SMS Services** — Single, bulk, and dynamic messaging with DLT compliance
- **Voice Calling** — Initiate calls, connect numbers, integrate call flows
- **Status Tracking** — Real-time delivery and callback management
- **Audio Tools** — Playback, download, and web player access
- **Secure Authentication** — Token-based, Base64-encoded credentials

## Prerequisites

- An IDE / AI client that supports MCP (Claude Desktop, Cursor, VS Code with MCP extension, Claude Code, Windsurf, etc.)
- **Node.js and npm** installed (the MCP Remote bridge is an npm package)
- **Active Exotel account** with API credentials
- **MCP server URL** — provided by your Exotel account manager (this is your tenant-specific endpoint)

## Setup

### 1. Install MCP Remote

`mcp-remote` is the bridge package that connects your local IDE to the hosted Exotel MCP server. Install it globally:

```bash
npm install -g mcp-remote
```

### 2. Get your credentials ready

Before editing config files, gather these values from the Exotel dashboard:

| Value | Where to find it | Example |
|-------|-----------------|---------|
| **API Key** | [Exotel Dashboard → API Settings](https://my.exotel.com/Exotel/apisettings/site#api-credentials) | `abc123...` |
| **API Secret** | Same page (next to API Key) | `xyz456...` |
| **Account SID** | API Settings page header | `Exotel` (or your tenant SID) |
| **Account region / subdomain** | API Settings page (shown below SID) | `api.in.exotel.com` (Mumbai) or `api.exotel.com` (Singapore) |
| **DLT Template ID** | DLT registration documents | Numeric string |
| **DLT Entity ID** | DLT registration documents | Numeric string |
| **Caller ID / Registered Number** | ExoPhones → Manage Phone Numbers | E.164 format, e.g. `+91XXXXXXXXXX` |
| **Exotel MCP Server URL** | Contact your Exotel account manager | e.g. `https://<your-tenant>.mcp.exotel.com/sse` |

### 3. Create a Base64-encoded auth token

The MCP server expects your API credentials Base64-encoded as `key:secret`:

```bash
echo -n "your_api_key:your_api_secret" | base64
```

This outputs the value you'll paste as `EXOTEL_AUTH_TOKEN` in the config below.

### 4. Configure your IDE

Pick the section for your IDE. The config is the same shape across all of them — only the **file path** differs.

:::note Replace placeholders
In every config block below, replace these placeholders with the values from Step 2:
- `<exotel-mcp-url>` — your tenant-specific MCP server URL (ask your account manager)
- `<base64-encoded-token>` — output of the `base64` command from Step 3
- `<your-account-sid>`, `<your-caller-id>`, `<your-dlt-template-id>`, `<your-dlt-entity-id>`
:::

#### Claude Desktop

Open **Claude Desktop → Settings → Developer → Edit Config**, or directly edit:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Add (or merge into) the `mcpServers` block:

```json
{
  "mcpServers": {
    "exotel": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://<exotel-mcp-url>/sse"
      ],
      "env": {
        "EXOTEL_AUTH_TOKEN": "<base64-encoded-token>",
        "EXOTEL_ACCOUNT_SID": "<your-account-sid>",
        "EXOTEL_SUBDOMAIN": "api.in.exotel.com",
        "EXOTEL_CALLER_ID": "+91XXXXXXXXXX",
        "EXOTEL_PHONE_NUMBER": "+91XXXXXXXXXX",
        "EXOTEL_DLT_TEMPLATE_ID": "<your-dlt-template-id>",
        "EXOTEL_DLT_ENTITY_ID": "<your-dlt-entity-id>",
        "EXOTEL_DASHBOARD_URL": "https://my.exotel.com"
      }
    }
  }
}
```

Then **quit and restart Claude Desktop** for the config to load.

#### Cursor

Cursor reads MCP config from either a project-specific or global location.

**Project-specific** (recommended — config travels with the repo):
Create `.cursor/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "exotel": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://<exotel-mcp-url>/sse"
      ],
      "env": {
        "EXOTEL_AUTH_TOKEN": "<base64-encoded-token>",
        "EXOTEL_ACCOUNT_SID": "<your-account-sid>",
        "EXOTEL_SUBDOMAIN": "api.in.exotel.com",
        "EXOTEL_CALLER_ID": "+91XXXXXXXXXX",
        "EXOTEL_PHONE_NUMBER": "+91XXXXXXXXXX",
        "EXOTEL_DLT_TEMPLATE_ID": "<your-dlt-template-id>",
        "EXOTEL_DLT_ENTITY_ID": "<your-dlt-entity-id>",
        "EXOTEL_DASHBOARD_URL": "https://my.exotel.com"
      }
    }
  }
}
```

**Global** (available in every Cursor project on your machine):
Edit `~/.cursor/mcp.json` with the same content.

Cursor picks up changes immediately — no restart needed.

#### VS Code

VS Code with an MCP-compatible extension (or Copilot agents with MCP support) reads:

`.vscode/mcp.json` in your project root:

```json
{
  "servers": {
    "exotel": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://<exotel-mcp-url>/sse"
      ],
      "env": {
        "EXOTEL_AUTH_TOKEN": "<base64-encoded-token>",
        "EXOTEL_ACCOUNT_SID": "<your-account-sid>",
        "EXOTEL_SUBDOMAIN": "api.in.exotel.com",
        "EXOTEL_CALLER_ID": "+91XXXXXXXXXX",
        "EXOTEL_PHONE_NUMBER": "+91XXXXXXXXXX",
        "EXOTEL_DLT_TEMPLATE_ID": "<your-dlt-template-id>",
        "EXOTEL_DLT_ENTITY_ID": "<your-dlt-entity-id>",
        "EXOTEL_DASHBOARD_URL": "https://my.exotel.com"
      }
    }
  }
}
```

#### Claude Code

Claude Code (the CLI tool) reads from `.claude/settings.json` in your project root:

```json
{
  "mcpServers": {
    "exotel": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://<exotel-mcp-url>/sse"
      ],
      "env": {
        "EXOTEL_AUTH_TOKEN": "<base64-encoded-token>",
        "EXOTEL_ACCOUNT_SID": "<your-account-sid>",
        "EXOTEL_SUBDOMAIN": "api.in.exotel.com",
        "EXOTEL_CALLER_ID": "+91XXXXXXXXXX",
        "EXOTEL_PHONE_NUMBER": "+91XXXXXXXXXX",
        "EXOTEL_DLT_TEMPLATE_ID": "<your-dlt-template-id>",
        "EXOTEL_DLT_ENTITY_ID": "<your-dlt-entity-id>",
        "EXOTEL_DASHBOARD_URL": "https://my.exotel.com"
      }
    }
  }
}
```

#### Windsurf

Edit `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "exotel": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://<exotel-mcp-url>/sse"
      ],
      "env": {
        "EXOTEL_AUTH_TOKEN": "<base64-encoded-token>",
        "EXOTEL_ACCOUNT_SID": "<your-account-sid>",
        "EXOTEL_SUBDOMAIN": "api.in.exotel.com",
        "EXOTEL_CALLER_ID": "+91XXXXXXXXXX",
        "EXOTEL_PHONE_NUMBER": "+91XXXXXXXXXX",
        "EXOTEL_DLT_TEMPLATE_ID": "<your-dlt-template-id>",
        "EXOTEL_DLT_ENTITY_ID": "<your-dlt-entity-id>",
        "EXOTEL_DASHBOARD_URL": "https://my.exotel.com"
      }
    }
  }
}
```

### 5. Verify the setup

After saving the config, restart your IDE if it requires it (Claude Desktop and Windsurf do; Cursor and Claude Code reload automatically).

Then try a test prompt:

```
What Exotel tools are available to me?
```

Your AI assistant should respond with the list of MCP tools (SMS send, voice call, status check, etc.). If you get *"no tools found"* or a connection error, see the **Troubleshooting** section below.

A safer first command (doesn't actually send anything):

```
Show me my Exotel account balance.
```

This should call the Balance API and return your current credit. If you see your balance, the integration is working end-to-end.

## Available Services

Once connected, your AI can use these capabilities:

### SMS
- Send individual messages
- Send bulk messages
- Personalized / templated bulk sends
- Check delivery status

### Voice
- Initiate outbound calls
- Connect two numbers
- Trigger App Bazaar IVR flows
- Pull call details

### Status & Tracking
- SMS delivery status
- Call history & recordings
- Phone number metadata

### Audio Tools
- Play audio recordings
- Access web player URLs
- Download audio files

## Usage Examples

```
"Send SMS to +919999999999 saying 'Hello from Exotel'"
"Call +919999999999 from my registered number"
"Connect +919999999999 with +918888888888"
"Check SMS delivery status for SID xyz"
"What's my Exotel account balance?"
"Show me the last 10 calls on my account"
```

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| *"No tools found"* in your AI client | MCP server URL is wrong, or `mcp-remote` isn't installed | Re-check the URL with your account manager; re-run `npm install -g mcp-remote` |
| `401 Unauthorized` on every call | Base64 encoding is malformed, or the API key/secret is wrong | Re-run the `echo -n "key:secret" \| base64` command. The `-n` flag is critical — it suppresses the trailing newline that breaks the token. |
| `403 Forbidden` on calls but SMS works (or vice versa) | API key doesn't have permission for that service | In Exotel Dashboard → API Settings → check the role attached to your API key |
| Calls placed from the wrong number | Wrong `EXOTEL_CALLER_ID` set | Update the env var to the ExoPhone number you actually want to call from |
| SMS rejected with DLT errors | Wrong `EXOTEL_DLT_TEMPLATE_ID` or `EXOTEL_DLT_ENTITY_ID` | These must match the values in your DLT registration. Contact your account manager if unsure. |
| Wrong region — "endpoint not found" errors | `EXOTEL_SUBDOMAIN` doesn't match your account region | Singapore accounts use `api.exotel.com`; Mumbai accounts use `api.in.exotel.com`. Check your dashboard. |

## Need help?

- **Don't have the MCP server URL yet?** Contact your Exotel account manager or email **hello@exotel.com**
- **Stuck on setup?** Reach out to the developer support team via [my.exotel.com → Support](https://my.exotel.com)
