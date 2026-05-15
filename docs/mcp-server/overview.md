---
id: overview
title: Exotel MCP Server
description: Give your AI a voice — connect Claude, Cursor, or any MCP-compatible client to your Exotel account in 60 seconds.
sidebar_label: Overview
slug: /mcp-server/overview
---

# Give Your AI a Voice

Imagine typing *"call Priya and ask her if the onboarding report is ready"* — your AI client calls Priya, has the conversation, and comes back with *"Priya says the report will be ready by 3pm; she's waiting on one number from finance."* That's what Exotel MCP enables. This guide gets you there in 60 seconds — no installations, no config files, just paste your credentials and go.

## What You'll Need

Three things from your Exotel account:

- **API key** — from `my.exotel.com → Settings → API Settings`
- **API secret** — same page
- **Account SID** — same page
- **Your Exotel number** — from Numbers in the sidebar (e.g. `08046800979`)

That's it. You don't need to know what base64 encoding is. You don't need to touch a terminal.

## Supported AI Clients

Exotel MCP works with any AI client that supports the Model Context Protocol. Tested clients and where each one keeps its MCP config (the AI client edits this file for you in Step 1 — you usually don't need to open it manually):

| Client | MCP config location |
|--------|---------------------|
| **Claude Desktop** | `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) · `%APPDATA%\Claude\claude_desktop_config.json` (Windows) |
| **Cursor** | `.cursor/mcp.json` in your project root, or `~/.cursor/mcp.json` globally |
| **Claude Code** | `.claude/settings.json` in your project root |
| **VS Code** (with MCP-supporting extension or Copilot agents) | `.vscode/mcp.json` in your project root |
| **Windsurf** | `~/.codeium/windsurf/mcp_config.json` |

Just open the AI client you already use — the next step is the same regardless.

## Step 1 — Paste This Into Your AI Client

Open Claude, Cursor, or any MCP-compatible AI client and send this message — fill in your actual values:

> Set up Exotel MCP for me. My Exotel credentials: API key `[your api key]`, API secret `[your api secret]`, Account SID `[your account sid]`, Exotel number `[your number, e.g. 08046800979]`, API domain `https://api.in.exotel.com`.
>
> Please install `mcp-remote` via npm if needed, update the MCP config with these credentials, and tell me when I need to restart.

:::note Globally hosted accounts
If your dashboard is at `my.exotel.com` (not `my.in.exotel.com`), use `https://api.exotel.com` as the API domain instead.
:::

The AI will:
- Run `npm install -g mcp-remote` if needed
- Build your base64 token from the key and secret
- Write the correct config block to your MCP settings file
- Tell you exactly when to restart

## Step 2 — Restart Your AI Client

Once the AI says it's done, restart the client completely (quit and reopen). After restarting, you should see Exotel tools available — in Claude Desktop, look for the 🔧 icon in the chat input.

## Step 3 — Make Your First Agentic Call

Type this:

> call +91xxxxxxxxxx and ask them if they're available for a quick catch up tomorrow

That's it. The AI calls the number, a voicebot conducts the conversation, and the AI comes back with what the person said.

## What Just Happened

Your AI client is now connected to your Exotel account. It can:

- **Make calls** — place outbound calls, have a voicebot carry the conversation, return the answer
- **Send SMS** — single messages or bulk
- **Pull transcripts** — from any voicebot call
- **Check call status** — look up any call by number or SID
- **Run quality analysis** — on call recordings

All through plain language. No API calls, no code.

## Troubleshooting

**Tools not showing after restart**

Run `npm list -g mcp-remote` to confirm the install succeeded. If it's missing, run `npm install -g mcp-remote` and retry.

**Authentication error**

Ask your AI client *"show me the current Exotel MCP config"* — it will show you exactly what's in the file so you can spot any typo.

**Not sure which API domain to use**

Check your Exotel dashboard URL:
- `my.in.exotel.com` → use `https://api.in.exotel.com`
- `my.exotel.com` → use `https://api.exotel.com`

## Questions?

Contact your Exotel account manager or reach **Exotel support** at [hello@exotel.com](mailto:hello@exotel.com).
