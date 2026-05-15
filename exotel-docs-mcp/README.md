# Exotel Developer Docs — MCP Server

A [Model Context Protocol](https://modelcontextprotocol.io) server that exposes the Exotel Developer Documentation repo (the source of [developer.exotel.com](https://developer.exotel.com)) to any MCP-compatible AI assistant — Claude Code, Cursor, VS Code (Copilot agents), Windsurf, Claude Desktop.

Once configured, you can ask your AI client to:

- "Find every page that mentions `BulkVoice` and check whether the auth section is consistent."
- "Read `voice-v1/api-reference/call-details.mdx` and rewrite the response-payload table."
- "Create a new page under `sms-api/best-practices.md` summarising the rate-limit guidance."
- "List all categories and tell me which one has the most pages."

The server reads from your local checkout, so changes land as file edits — commit and push to ship them.

---

## Tools exposed

| Tool | What it does |
|------|--------------|
| `search_documents` | Full-text search across all `.md` / `.mdx` files. Returns paths, titles, line-level snippets. |
| `list_documents` | List documents, optionally filtered by category (folder under `docs/`). |
| `read_document` | Read a doc by path. Returns parsed frontmatter + body. |
| `create_document` | Create a new doc page with frontmatter + body. |
| `update_document` | Update an existing doc — change frontmatter fields and/or body. |
| `get_categories` | List all categories (folders under `docs/`) with page counts. |
| `get_sidebar` | Return the raw `sidebars.ts` so the AI can see navigation structure. |
| `get_portal_config` | Return the raw `docusaurus.config.ts` (navbar, plugins, theme settings). |

---

## Setup

### 1. Install dependencies

From the repo root:

```bash
cd exotel-docs-mcp
npm install
```

Requires Node.js 18+.

### 2. Wire it into your AI client

Editor config files are checked in at the repo root for the three most common clients — open the repo in that client and the MCP server is auto-detected.

| Client | Config file | Status |
|--------|-------------|--------|
| **Claude Code** | `.claude/settings.json` | Ready — open the repo in Claude Code |
| **Cursor** | `.cursor/mcp.json` | Ready — open the repo in Cursor |
| **VS Code** (with MCP-capable extension) | `.vscode/mcp.json` | Ready — open the repo in VS Code |
| **Windsurf** | `~/.codeium/windsurf/mcp_config.json` | Manual — see below |
| **Claude Desktop** | `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) | Manual — see below |

For **Windsurf / Claude Desktop**, add this to the relevant config file (adjust the absolute path):

```json
{
  "mcpServers": {
    "exotel-docs": {
      "command": "node",
      "args": ["/absolute/path/to/exotel-docs/exotel-docs-mcp/index.js"],
      "env": {
        "DOCS_REPO_ROOT": "/absolute/path/to/exotel-docs"
      }
    }
  }
}
```

Then restart the client.

### 3. Verify it's wired up

In your AI client, ask:

> List the tools available from the exotel-docs MCP server.

You should see all 8 tools listed above. If not, see Troubleshooting.

---

## Configuration

| Env var | Default | Description |
|---------|---------|-------------|
| `DOCS_REPO_ROOT` | Parent of this script's directory | Absolute path to the `exotel-docs` checkout. Set this if you run the server from somewhere other than `<repo>/exotel-docs-mcp/`. |

---

## How it works

- Pure Node.js, no native deps. Single file: `index.js`.
- Stdio transport — your AI client spawns this as a subprocess and speaks JSON-RPC over stdin/stdout.
- All file operations are sandboxed to the `docs/` folder via `safeDocPath()` — paths that resolve outside `docs/` are rejected.
- Frontmatter is parsed and rebuilt as YAML so you can update fields like `title` or `sidebar_label` without disturbing the rest of the page.
- The server never auto-commits — changes are written to your working tree and you commit them yourself.

---

## Troubleshooting

**Tools not showing after restart**

```bash
cd exotel-docs-mcp && npm install
```

Confirm `@modelcontextprotocol/sdk` resolves:

```bash
node -e "import('@modelcontextprotocol/sdk/server/index.js').then(()=>console.log('ok'))"
```

**Server starts but tools fail with "docs/ not found"**

The server is looking in the wrong place. Set `DOCS_REPO_ROOT` explicitly in the client config:

```json
"env": { "DOCS_REPO_ROOT": "/absolute/path/to/exotel-docs" }
```

**Path errors when creating docs**

The path argument is relative to `docs/`. Don't pass `docs/foo.md` — pass `foo.md`. Absolute paths are rejected.

**Want to test the server manually**

```bash
# Send an initialize + list_tools request over stdio
node exotel-docs-mcp/index.js <<'EOF'
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"manual","version":"0"}}}
{"jsonrpc":"2.0","id":2,"method":"tools/list"}
EOF
```

You should see a JSON response listing all 8 tools.

---

## Questions

Reach **Exotel support** at [hello@exotel.com](mailto:hello@exotel.com) or open an issue in the repo.
