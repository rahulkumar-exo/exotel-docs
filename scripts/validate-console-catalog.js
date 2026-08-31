const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DOCS_DIR = path.join(ROOT, 'docs');
const CATALOG_PATH = path.join(ROOT, 'data', 'console-catalog.json');
const EXPECTED_CHANNELS = ['voice', 'sms', 'whatsapp', 'rcs'];
const EXPECTED_CARD_IDS = ['api_reference', 'sdk_quickstarts', 'exoml_flows'];
const ALLOWED_ORIGIN = 'https://developer.exotel.com';

function walkDocs(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walkDocs(fullPath);
    return /\.mdx?$/.test(entry.name) ? [fullPath] : [];
  });
}

function getFrontmatterValue(content, key) {
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatter) return null;
  const match = frontmatter[1].match(new RegExp(`^${key}:\\s*['"]?(.+?)['"]?\\s*$`, 'm'));
  return match ? match[1] : null;
}

function buildRouteInventory() {
  const routes = new Set();

  for (const filePath of walkDocs(DOCS_DIR)) {
    const relativePath = path.relative(DOCS_DIR, filePath).replace(/\\/g, '/').replace(/\.mdx?$/, '');
    const content = fs.readFileSync(filePath, 'utf8');
    const slug = getFrontmatterValue(content, 'slug');
    routes.add(slug && slug.startsWith('/') ? `/docs${slug}` : `/docs/${relativePath}`);
  }

  return routes;
}

function collectUrls(value, urls = []) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectUrls(item, urls));
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      if (key === 'url') urls.push(child);
      else collectUrls(child, urls);
    }
  }
  return urls;
}

function validateCatalog(catalog, routes) {
  const errors = [];

  if (!catalog.version || typeof catalog.version !== 'string') {
    errors.push('catalog.version must be a non-empty string');
  }
  if (!Array.isArray(catalog.suggested_queries) || catalog.suggested_queries.length !== 7) {
    errors.push('catalog.suggested_queries must contain exactly 7 entries');
  }

  for (const channel of EXPECTED_CHANNELS) {
    const entry = catalog.channels && catalog.channels[channel];
    if (!entry) {
      errors.push(`catalog.channels.${channel} is required`);
      continue;
    }

    const cardIds = Array.isArray(entry.cards) ? entry.cards.map((card) => card.id) : [];
    if (JSON.stringify(cardIds) !== JSON.stringify(EXPECTED_CARD_IDS)) {
      errors.push(`${channel}.cards must be ordered as ${EXPECTED_CARD_IDS.join(', ')}`);
    }
    if (!Array.isArray(entry.cross_sell)) {
      errors.push(`${channel}.cross_sell must be an array`);
    }
  }

  for (const rawUrl of collectUrls(catalog)) {
    try {
      const url = new URL(rawUrl);
      if (url.origin !== ALLOWED_ORIGIN) {
        errors.push(`${rawUrl} must use ${ALLOWED_ORIGIN}`);
      } else if (!routes.has(url.pathname.replace(/\/$/, ''))) {
        errors.push(`${rawUrl} does not resolve to a Docusaurus document route`);
      }
    } catch {
      errors.push(`${String(rawUrl)} is not a valid absolute URL`);
    }
  }

  return errors;
}

function main() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
  const errors = validateCatalog(catalog, buildRouteInventory());

  if (errors.length > 0) {
    console.error('Console catalog validation failed:');
    errors.forEach((error) => console.error(`- ${error}`));
    process.exitCode = 1;
    return;
  }

  console.log(`Console catalog validated for ${EXPECTED_CHANNELS.length} channels.`);
}

if (require.main === module) main();

module.exports = { buildRouteInventory, collectUrls, validateCatalog };
