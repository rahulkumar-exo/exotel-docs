#!/usr/bin/env node
/**
 * Exotel Developer Docs — MCP Server
 *
 * Exposes 8 tools so any MCP-compatible AI assistant (Claude Code, Cursor,
 * VS Code Copilot agents, Windsurf, Claude Desktop) can search, read,
 * create, and edit documentation in the exotel-docs repo.
 *
 * Stdio transport — the AI client spawns this as a subprocess and talks
 * JSON-RPC over stdin/stdout.
 *
 * Configuration:
 *   DOCS_REPO_ROOT  — absolute path to the exotel-docs checkout.
 *                     Defaults to the parent of this file's directory
 *                     (i.e. assumes index.js lives at <repo>/exotel-docs-mcp/index.js).
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { readFile, writeFile, readdir, stat, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// ────────────────────────────────────────────────────────────────────
// Paths
// ────────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = process.env.DOCS_REPO_ROOT
  ? resolve(process.env.DOCS_REPO_ROOT)
  : resolve(__dirname, '..');
const DOCS_DIR = join(REPO_ROOT, 'docs');
const SIDEBARS_FILE = join(REPO_ROOT, 'sidebars.ts');
const CONFIG_FILE = join(REPO_ROOT, 'docusaurus.config.ts');

// ────────────────────────────────────────────────────────────────────
// Safety: prevent path traversal outside DOCS_DIR
// ────────────────────────────────────────────────────────────────────

function safeDocPath(relativePath) {
  // Strip leading slashes, normalise
  const cleaned = String(relativePath || '').replace(/^\/+/, '');
  const absolute = resolve(DOCS_DIR, cleaned);
  // Ensure the resolved path is inside DOCS_DIR
  if (!absolute.startsWith(DOCS_DIR + sep) && absolute !== DOCS_DIR) {
    throw new Error(
      `Path "${relativePath}" resolves outside docs/ — refusing for safety`,
    );
  }
  return absolute;
}

// ────────────────────────────────────────────────────────────────────
// Markdown helpers
// ────────────────────────────────────────────────────────────────────

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---\n?/;

function parseFrontmatter(content) {
  const m = content.match(FRONTMATTER_RE);
  if (!m) return { frontmatter: {}, body: content };
  const fm = {};
  for (const line of m[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();
    // Strip surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    fm[key] = value;
  }
  return { frontmatter: fm, body: content.slice(m[0].length) };
}

function buildFrontmatter(fields) {
  const lines = ['---'];
  for (const [k, v] of Object.entries(fields)) {
    if (v === undefined || v === null || v === '') continue;
    const needsQuoting =
      typeof v === 'string' && /[:#\[\]{}"',&*?|<>=!%@`]/.test(v);
    const formatted = needsQuoting ? JSON.stringify(v) : v;
    lines.push(`${k}: ${formatted}`);
  }
  lines.push('---');
  return lines.join('\n') + '\n';
}

// ────────────────────────────────────────────────────────────────────
// Doc tree walker — collect all .md / .mdx files
// ────────────────────────────────────────────────────────────────────

async function walkDocs(dir = DOCS_DIR) {
  const results = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await walkDocs(full)));
    } else if (/\.mdx?$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

function categoryOf(absPath) {
  const rel = relative(DOCS_DIR, absPath);
  const parts = rel.split(sep);
  return parts.length > 1 ? parts[0] : '(root)';
}

// ────────────────────────────────────────────────────────────────────
// Tool implementations
// ────────────────────────────────────────────────────────────────────

async function toolSearchDocuments({ query, max_results = 20, category }) {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    throw new Error('query is required and must be a non-empty string');
  }
  const needle = query.toLowerCase();
  let files = await walkDocs();
  if (category) {
    files = files.filter((f) => categoryOf(f) === category);
  }

  const results = [];
  for (const path of files) {
    let content;
    try {
      content = await readFile(path, 'utf-8');
    } catch {
      continue;
    }
    const lowerContent = content.toLowerCase();
    if (!lowerContent.includes(needle)) continue;

    const lines = content.split('\n');
    const matches = [];
    for (let i = 0; i < lines.length && matches.length < 5; i++) {
      if (lines[i].toLowerCase().includes(needle)) {
        matches.push({ line: i + 1, text: lines[i].trim().slice(0, 200) });
      }
    }

    const { frontmatter } = parseFrontmatter(content);
    results.push({
      path: relative(DOCS_DIR, path),
      title: frontmatter.title || frontmatter.sidebar_label || '(no title)',
      category: categoryOf(path),
      url: frontmatter.slug
        ? `/docs${frontmatter.slug.startsWith('/') ? '' : '/'}${frontmatter.slug}`
        : `/docs/${relative(DOCS_DIR, path).replace(/\.mdx?$/, '')}`,
      match_count: (lowerContent.match(new RegExp(escapeRegex(needle), 'g')) || []).length,
      matches,
    });
    if (results.length >= max_results) break;
  }
  results.sort((a, b) => b.match_count - a.match_count);

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(
          { query, total_results: results.length, results },
          null,
          2,
        ),
      },
    ],
  };
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function toolListDocuments({ category, limit = 100 }) {
  let files = await walkDocs();
  if (category) {
    files = files.filter((f) => categoryOf(f) === category);
  }
  const docs = [];
  for (const path of files.slice(0, limit)) {
    let frontmatter = {};
    try {
      const content = await readFile(path, 'utf-8');
      frontmatter = parseFrontmatter(content).frontmatter;
    } catch {}
    docs.push({
      path: relative(DOCS_DIR, path),
      title: frontmatter.title || '(no title)',
      sidebar_label: frontmatter.sidebar_label || null,
      category: categoryOf(path),
    });
  }
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(
          { category: category || 'all', count: docs.length, documents: docs },
          null,
          2,
        ),
      },
    ],
  };
}

async function toolReadDocument({ path: relPath }) {
  if (!relPath) throw new Error('path is required');
  const full = safeDocPath(relPath);
  if (!existsSync(full)) {
    throw new Error(`Document not found: docs/${relPath}`);
  }
  const content = await readFile(full, 'utf-8');
  const { frontmatter, body } = parseFrontmatter(content);
  const s = await stat(full);
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(
          {
            path: relPath,
            size_bytes: s.size,
            last_modified: s.mtime.toISOString(),
            frontmatter,
            body,
          },
          null,
          2,
        ),
      },
    ],
  };
}

async function toolCreateDocument({
  path: relPath,
  title,
  description,
  sidebar_label,
  sidebar_position,
  body,
}) {
  if (!relPath) throw new Error('path is required');
  if (!title) throw new Error('title is required');
  if (!body && body !== '') throw new Error('body is required');
  let normalisedPath = String(relPath).replace(/^\/+/, '').replace(/\.mdx?$/, '');
  // Default to .md
  const target = safeDocPath(`${normalisedPath}.md`);
  if (existsSync(target)) {
    throw new Error(`File already exists: docs/${normalisedPath}.md — use update_document instead`);
  }
  await mkdir(dirname(target), { recursive: true });
  const fm = buildFrontmatter({
    title,
    description,
    sidebar_label,
    sidebar_position,
  });
  await writeFile(target, `${fm}\n${body}\n`, 'utf-8');
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(
          {
            success: true,
            path: `${normalisedPath}.md`,
            absolute_path: target,
            note: 'Created locally. Commit + push to ship to production (or use the CMS for a Git-managed workflow).',
          },
          null,
          2,
        ),
      },
    ],
  };
}

async function toolUpdateDocument({
  path: relPath,
  body,
  title,
  description,
  sidebar_label,
  sidebar_position,
}) {
  if (!relPath) throw new Error('path is required');
  const full = safeDocPath(relPath);
  if (!existsSync(full)) {
    throw new Error(`Document not found: docs/${relPath}`);
  }
  const original = await readFile(full, 'utf-8');
  const { frontmatter, body: originalBody } = parseFrontmatter(original);
  const newFm = { ...frontmatter };
  if (title !== undefined) newFm.title = title;
  if (description !== undefined) newFm.description = description;
  if (sidebar_label !== undefined) newFm.sidebar_label = sidebar_label;
  if (sidebar_position !== undefined) newFm.sidebar_position = sidebar_position;
  const newBody = body !== undefined ? body : originalBody;
  await writeFile(full, `${buildFrontmatter(newFm)}\n${newBody.replace(/^\n+/, '')}\n`, 'utf-8');
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(
          {
            success: true,
            path: relPath,
            updated_fields: {
              title: title !== undefined,
              description: description !== undefined,
              sidebar_label: sidebar_label !== undefined,
              sidebar_position: sidebar_position !== undefined,
              body: body !== undefined,
            },
            note: 'Updated locally. Commit + push to ship to production.',
          },
          null,
          2,
        ),
      },
    ],
  };
}

async function toolGetCategories() {
  const files = await walkDocs();
  const counts = {};
  for (const path of files) {
    const cat = categoryOf(path);
    counts[cat] = (counts[cat] || 0) + 1;
  }
  const categories = Object.entries(counts)
    .map(([name, count]) => ({ name, doc_count: count }))
    .sort((a, b) => b.doc_count - a.doc_count);
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(
          { total_docs: files.length, total_categories: categories.length, categories },
          null,
          2,
        ),
      },
    ],
  };
}

async function toolGetSidebar() {
  if (!existsSync(SIDEBARS_FILE)) {
    throw new Error('sidebars.ts not found in repo root');
  }
  const content = await readFile(SIDEBARS_FILE, 'utf-8');
  return {
    content: [{ type: 'text', text: content }],
  };
}

async function toolGetPortalConfig() {
  if (!existsSync(CONFIG_FILE)) {
    throw new Error('docusaurus.config.ts not found in repo root');
  }
  const content = await readFile(CONFIG_FILE, 'utf-8');
  return {
    content: [{ type: 'text', text: content }],
  };
}

// ────────────────────────────────────────────────────────────────────
// Tool registry — schema + handler
// ────────────────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: 'search_documents',
    description:
      'Full-text search across the entire Exotel docs portal (340+ pages). Returns matching paths, titles, line-level snippets, and URLs.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'The search query (case-insensitive substring).' },
        max_results: { type: 'number', description: 'Max results to return (default 20).', default: 20 },
        category: { type: 'string', description: 'Optional — limit to a single category (folder name under docs/).' },
      },
      required: ['query'],
    },
    handler: toolSearchDocuments,
  },
  {
    name: 'list_documents',
    description:
      'List documents in the portal. Optionally filter by category (folder name under docs/). Returns path, title, category for each.',
    inputSchema: {
      type: 'object',
      properties: {
        category: { type: 'string', description: 'Optional category filter (e.g. "voice-v1", "sms-api").' },
        limit: { type: 'number', description: 'Max docs to return (default 100).', default: 100 },
      },
    },
    handler: toolListDocuments,
  },
  {
    name: 'read_document',
    description:
      'Read a specific doc by its path under docs/. Returns frontmatter (title, description, sidebar_label, slug, etc.) plus the markdown body.',
    inputSchema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Path relative to docs/, e.g. "voice-v1/api-reference/call-details.mdx" or "agentstream/overview.md".',
        },
      },
      required: ['path'],
    },
    handler: toolReadDocument,
  },
  {
    name: 'create_document',
    description:
      'Create a new doc page. Writes frontmatter + body to docs/<path>.md. Use only when the page does not exist yet — for existing pages use update_document.',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'New file path under docs/, without extension. e.g. "voice-v1/api-reference/balance" creates docs/voice-v1/api-reference/balance.md.' },
        title: { type: 'string', description: 'Page title (shown as H1 in the rendered page).' },
        description: { type: 'string', description: 'Short description for SEO and AI search snippets.' },
        sidebar_label: { type: 'string', description: 'Short label for the left sidebar (defaults to title).' },
        sidebar_position: { type: 'number', description: 'Numeric position in the sidebar (lower = higher).' },
        body: { type: 'string', description: 'Full markdown content for the page body (without frontmatter).' },
      },
      required: ['path', 'title', 'body'],
    },
    handler: toolCreateDocument,
  },
  {
    name: 'update_document',
    description:
      'Update an existing doc — change frontmatter fields and/or body. Any field left undefined is preserved unchanged. Refuses if the file does not exist (use create_document instead).',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path relative to docs/, e.g. "voice-v1/api-reference/call-details.mdx".' },
        title: { type: 'string', description: 'New title (optional — omit to keep existing).' },
        description: { type: 'string', description: 'New description (optional).' },
        sidebar_label: { type: 'string', description: 'New sidebar label (optional).' },
        sidebar_position: { type: 'number', description: 'New sidebar position (optional).' },
        body: { type: 'string', description: 'New markdown body (optional — omit to keep existing body and only update frontmatter).' },
      },
      required: ['path'],
    },
    handler: toolUpdateDocument,
  },
  {
    name: 'get_categories',
    description:
      'List all top-level categories (folders under docs/) with the count of pages in each. Helps you understand the portal structure before editing.',
    inputSchema: { type: 'object', properties: {} },
    handler: toolGetCategories,
  },
  {
    name: 'get_sidebar',
    description:
      'Return the raw contents of sidebars.ts so you can see the full navigation structure — which sidebar each doc belongs to and the order of items.',
    inputSchema: { type: 'object', properties: {} },
    handler: toolGetSidebar,
  },
  {
    name: 'get_portal_config',
    description:
      'Return the raw contents of docusaurus.config.ts — useful for understanding site settings, navbar structure, plugins, and theme config.',
    inputSchema: { type: 'object', properties: {} },
    handler: toolGetPortalConfig,
  },
];

// ────────────────────────────────────────────────────────────────────
// Server bootstrap
// ────────────────────────────────────────────────────────────────────

const server = new Server(
  {
    name: 'exotel-docs-mcp',
    version: '1.0.0',
  },
  {
    capabilities: { tools: {} },
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(({ name, description, inputSchema }) => ({
    name,
    description,
    inputSchema,
  })),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = TOOLS.find((t) => t.name === request.params.name);
  if (!tool) {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }
  try {
    return await tool.handler(request.params.arguments || {});
  } catch (err) {
    return {
      content: [{ type: 'text', text: `Error: ${err.message}` }],
      isError: true,
    };
  }
});

async function main() {
  if (!existsSync(DOCS_DIR)) {
    console.error(
      `[exotel-docs-mcp] docs/ not found at ${DOCS_DIR}\n` +
        `Set DOCS_REPO_ROOT env var to the exotel-docs checkout, or run from <repo>/exotel-docs-mcp/.`,
    );
    process.exit(1);
  }
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(
    `[exotel-docs-mcp] ready — repo: ${REPO_ROOT}, docs: ${DOCS_DIR}`,
  );
}

main().catch((err) => {
  console.error('[exotel-docs-mcp] fatal:', err);
  process.exit(1);
});
