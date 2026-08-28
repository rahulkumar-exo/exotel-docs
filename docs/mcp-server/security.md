---
id: security
title: Security
description: How the Exotel MCP server authenticates requests, where credentials are stored on each client, how to rotate them, and where the server processes data.
sidebar_label: Security
sidebar_position: 4
---

# Security

The MCP server's only authentication is a JSON `Authorization` header carrying your Exotel API credentials. Treat it like any long-lived API secret. Keep it out of source control. Rotate it when a team member leaves. Give each agent only the products it needs.

## Authentication model

The MCP server itself performs no OAuth handshake and issues no MCP-specific tokens. Every request to `mcp.exotel.com/mcp` carries a single `Authorization` header whose value is a JSON object (not HTTP Basic Auth, not a Bearer token) holding your Exotel API credentials:

```
Authorization: {"token":"BASE64_OF_APIKEY_APITOKEN","from_number":"...","caller_id":"...","account_sid":"...","api_domain":"...","exotel_portal_url":"...", "voicebot_api_key":"...","voicebot_api_token":"...","voicebot_account_id":"...","cqa_api_key":"...","cqa_account_id":"..."}
```

On every request, the server parses the JSON and forwards the relevant credentials to the underlying CPaaS, VoiceBot, or CQA API. Each of those APIs enforces its own authentication. No session is stored server-side.

## What the auth model does not do

Three limits are worth knowing before you deploy this in production:

- **No OAuth today.** The MCP specification (2025-06-18) recommends OAuth 2.1 for remote servers. Exotel is tracking client-side support and will add OAuth once major MCP clients implement it.
- **No scopes or per-tool permissions.** A valid header can call every tool for the products it configures. If you need "SMS-send only" or "read-only VoiceBot" access, use separate Exotel API keys per agent, or separate accounts for dev and prod.
- **Revocation means rotation.** There is no "disconnect this integration" button. To invalidate a leaked header, rotate the underlying API keys at [my.exotel.com](https://my.exotel.com) and update every client that used them.

## Product-scoped credentials

Each field belongs to one product. Omit any product you don't need. Its tools still show up in `tools/list` so your agent can see the full menu, but calling one returns a credential error.

| Product | Fields | Where to find them |
|---------|--------|--------------------|
| CPaaS (voice, SMS, number lookup, Engage) | `token`, `account_sid`, `from_number`, `caller_id`, `api_domain`, `exotel_portal_url` | [my.exotel.com](https://my.exotel.com) → Settings → API Settings + Numbers |
| VoiceBot | `voicebot_api_key`, `voicebot_api_token`, `voicebot_account_id`, `voicebot_base_url`, `calls_api_key`, `calls_api_token`, `calls_account_id` | VoiceBot Dashboard → Settings → API Keys |
| Conversational Intelligence | `cqa_api_key`, `cqa_account_id`, `cqa_host` | CQA Console → Settings → API Keys |

Confirm what your header configures at any time by calling `exotel_setup_guide`.

## Where credentials live on each client

The `Authorization` header has to travel with every MCP request, but you can choose where the JSON sits at rest on your disk. From strongest to weakest:

1. **OS keychain.** The token is encrypted at rest and referenced from client config as an environment variable.
2. **Sourced dotenv file.** The token lives in a `chmod 600` file outside every git repo, sourced by your shell at login.
3. **Inline in client config.** The token sits directly in `mcp.json`. This works, but the config file itself is now a secret.
4. **Inline in `args`.** Avoid this entirely. The token leaks to `ps aux`, crash dumps, and shell history the moment `npx` spawns.

### Recommended: OS keychain + shell env

Store the JSON in your login keychain and expose it as one environment variable at shell start. The client config file then carries no secret and is safe to commit.

On macOS, add the entry once:

```bash
security add-generic-password -a "$USER" -s exotel-mcp-auth \
  -w '{"token":"BASE64_OF_APIKEY_APITOKEN","from_number":"YOUR_NUMBER","caller_id":"YOUR_NUMBER","account_sid":"YOUR_SID","api_domain":"https://api.in.exotel.com","exotel_portal_url":"https://my.exotel.com"}'
```

Export it from `~/.zshrc` or `~/.bashrc`:

```bash
export EXOTEL_AUTH_HEADER="$(security find-generic-password -a "$USER" -s exotel-mcp-auth -w)"
```

Reference the env variable in your client config:

**Cursor** (`~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "exotel": {
      "url": "https://mcp.exotel.com/mcp",
      "headers": { "Authorization": "${env:EXOTEL_AUTH_HEADER}" }
    }
  }
}
```

**VS Code** (`.vscode/mcp.json`):

```json
{
  "servers": {
    "exotel": {
      "type": "http",
      "url": "https://mcp.exotel.com/mcp",
      "headers": { "Authorization": "${env:EXOTEL_AUTH_HEADER}" }
    }
  }
}
```

**Claude Desktop, Claude Code, Windsurf** (`mcp-remote` bridge):

```json
{
  "mcpServers": {
    "exotel": {
      "command": "npx",
      "args": ["mcp-remote", "https://mcp.exotel.com/mcp", "--header", "Authorization:${AUTH_HEADER}"],
      "env": { "AUTH_HEADER": "${EXOTEL_AUTH_HEADER}" }
    }
  }
}
```

Claude Desktop launched from the macOS Dock does not inherit your shell environment. Either launch it from a terminal (`open -a "Claude"`) so it inherits `EXOTEL_AUTH_HEADER`, or write the value to the user session with `launchctl setenv EXOTEL_AUTH_HEADER "$(security find-generic-password -a "$USER" -s exotel-mcp-auth -w)"` from a `~/Library/LaunchAgents/` script.

Non-macOS equivalents for the keychain step:

- **Linux.** Use [`pass`](https://www.passwordstore.org/) (`pass insert exotel-mcp-auth`) or `gnome-keyring` via `secret-tool`.
- **Cross-platform.** Use the 1Password CLI (`op read 'op://Private/Exotel MCP/notesPlain'`) or Bitwarden CLI (`bw get notes exotel-mcp-auth`).

### Alternative: sourced dotenv file

If a keychain is not available, put the JSON in a chmod-600 file outside every git repo:

```bash
touch ~/.exotel-mcp.env && chmod 600 ~/.exotel-mcp.env
```

Contents of `~/.exotel-mcp.env`:

```bash
export EXOTEL_AUTH_HEADER='{"token":"BASE64_OF_APIKEY_APITOKEN","from_number":"YOUR_NUMBER","caller_id":"YOUR_NUMBER","account_sid":"YOUR_SID","api_domain":"https://api.in.exotel.com","exotel_portal_url":"https://my.exotel.com"}'
```

Source it from your shell profile:

```bash
[ -f ~/.exotel-mcp.env ] && source ~/.exotel-mcp.env
```

The client config stays identical to the keychain examples above, with the same `${env:EXOTEL_AUTH_HEADER}` references.

### Fallback: inline in client config

Every client accepts the JSON inline. Use this only when the two options above are not available, and treat the config file itself as a secret. Never commit it, screenshot it, or paste it into a support ticket.

| Client | Config file |
|--------|-------------|
| Cursor | `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (project) |
| VS Code | `.vscode/mcp.json` |
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows) |
| Claude Code | `.claude/settings.json` |
| Windsurf | `~/.codeium/windsurf/mcp_config.json` |

Inline example (Cursor):

```json
{
  "mcpServers": {
    "exotel": {
      "url": "https://mcp.exotel.com/mcp",
      "headers": {
        "Authorization": "{\"token\":\"BASE64_OF_APIKEY_APITOKEN\",\"from_number\":\"YOUR_NUMBER\",\"caller_id\":\"YOUR_NUMBER\",\"account_sid\":\"YOUR_SID\",\"api_domain\":\"https://api.in.exotel.com\",\"exotel_portal_url\":\"https://my.exotel.com\"}"
      }
    }
  }
}
```

Add the config path to your global gitignore (`~/.config/git/ignore`) so it never lands in a repo by accident.

### Never: inline in `args`

For `mcp-remote`-based clients, do **not** put the token directly in the argument list:

```json
"args": ["mcp-remote", "https://mcp.exotel.com/mcp", "--header", "Authorization:{\"token\":\"...\"}"]
```

Once `npx` spawns `mcp-remote`, that argument shows up in `ps aux`, crash dumps, and shell history. Use one of the three patterns above instead.

## Rotate credentials

- **CPaaS.** Regenerate the API key and token at [my.exotel.com](https://my.exotel.com) → Settings → API Settings. Recompute the base64 `token` field with `echo -n "NEW_API_KEY:NEW_API_TOKEN" | base64`. Update every client's config file, then restart.
- **VoiceBot.** Regenerate keys in the VoiceBot Dashboard → Settings → API Keys, update `voicebot_api_key` and `voicebot_api_token`, then restart.
- **CQA.** Call `exotel_cqa_create_api_key` to issue a new key and `exotel_cqa_revoke_api_key` to disable the old one, then update `cqa_api_key` and restart.

Each product has independent keys, so you can rotate one without touching the others.

## Least-privilege setup

Include only the products your agent actually needs. If your agent will only send SMS, drop the VoiceBot and CQA fields entirely. The tools still appear in `tools/list` but return credential errors, and no VoiceBot or CQA credentials sit in your config file.

For production or shared devices, use separate Exotel accounts (or restricted API credentials on the same account) for development and production. Never point an agent at production credentials while iterating on a prompt.

## Human confirmation

Enable human confirmation of tool calls in your MCP client. Most clients (Cursor, Claude Desktop) can prompt before every tool invocation. This blocks the agent from placing a call, sending SMS, or spending money without your explicit approval.

Be careful when running the Exotel MCP server alongside other MCP servers that serve untrusted content. A malicious document from another server can carry instructions that try to trigger your Exotel tools; this is called [prompt injection](https://modelcontextprotocol.io/docs/concepts/security). Human confirmation is your main defense.

## Data residency

Exotel's MCP server routes calls to the standard Exotel APIs: `api.in.exotel.com` or `api.exotel.com`, plus VoiceBot and CQA. Your data stays inside those product boundaries. The MCP server itself is a thin, stateless request router.

For India-hosted accounts, set `api_domain` to `https://api.in.exotel.com` so voice and SMS traffic terminates in Mumbai. For globally-hosted accounts, use `https://api.exotel.com`. VoiceBot and CQA endpoints follow the same pattern.

## Audit trail

Every tool call the MCP server executes lands as an ordinary API call in your Exotel dashboards:

- **Voice calls.** [my.exotel.com](https://my.exotel.com) → Calls → App Details
- **SMS.** [my.exotel.com](https://my.exotel.com) → SMS → Details
- **VoiceBot sessions.** VoiceBot Dashboard → Sessions
- **CQA ingestions and analyses.** CQA Console → Interactions

The dashboards show which API key initiated each action, so per-agent keys give you agent-level audit trails.

## Reporting security issues

Email [hello@exotel.com](mailto:hello@exotel.com) with the subject **Security disclosure — MCP server**. Do not open a public issue in [github.com/exotel/ExotelMCP](https://github.com/exotel/ExotelMCP).
