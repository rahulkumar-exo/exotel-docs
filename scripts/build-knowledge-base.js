/**
 * Build-time script that extracts markdown documentation content
 * into a knowledge base JSON file for the AI chat feature.
 *
 * This runs before the Docusaurus build and generates:
 * - static/knowledge-base.json (served as a static asset)
 */

const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const OUTPUT_FILE = path.join(__dirname, '..', 'static', 'knowledge-base.json');

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { title: '', body: content };

  const frontmatter = match[1];
  const body = content.slice(match[0].length).trim();

  const titleMatch = frontmatter.match(/title:\s*['"]?(.+?)['"]?\s*$/m);
  const sidebarLabelMatch = frontmatter.match(/sidebar_label:\s*['"]?(.+?)['"]?\s*$/m);

  return {
    title: titleMatch ? titleMatch[1] : '',
    sidebarLabel: sidebarLabelMatch ? sidebarLabelMatch[1] : '',
    body,
  };
}

function cleanMarkdown(text) {
  return text
    // Remove HTML tags
    .replace(/<[^>]+>/g, '')
    // Remove markdown images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Simplify links to just text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove code block markers but keep content
    .replace(/```[\w]*\n?/g, '\n')
    // Remove bold/italic markers
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    // Remove headers markers but keep text
    .replace(/^#{1,6}\s+/gm, '')
    // Remove horizontal rules
    .replace(/^---+$/gm, '')
    // Remove excessive whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function getProductFromPath(filePath) {
  const rel = path.relative(DOCS_DIR, filePath);
  const parts = rel.split(path.sep);

  const productMap = {
    'voice-api': 'Voice API',
    'sms-api': 'SMS API',
    'whatsapp-api': 'WhatsApp API',
    'exoverify-api': 'ExoVerify',
    'campaigns': 'Call Campaigns',
  };

  return productMap[parts[0]] || parts[0];
}

function getDocUrl(filePath) {
  const rel = path.relative(DOCS_DIR, filePath);
  const urlPath = rel
    .replace(/\.mdx?$/, '')
    .replace(/\\/g, '/');
  return `/docs/${urlPath}`;
}

function walkDir(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDir(fullPath));
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }

  return files;
}

function buildKnowledgeBase() {
  console.log('Building AI knowledge base from docs...');

  const files = walkDir(DOCS_DIR);
  const documents = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const { title, sidebarLabel, body } = extractFrontmatter(content);
    const cleanedContent = cleanMarkdown(body);
    const product = getProductFromPath(file);
    const url = getDocUrl(file);

    // Split into chunks of roughly 1000 characters for better context
    const chunks = [];
    const paragraphs = cleanedContent.split('\n\n');
    let currentChunk = '';

    for (const para of paragraphs) {
      if (currentChunk.length + para.length > 1000 && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = para;
      } else {
        currentChunk += (currentChunk ? '\n\n' : '') + para;
      }
    }
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    for (let i = 0; i < chunks.length; i++) {
      documents.push({
        id: `${url}#chunk${i}`,
        title,
        product,
        url,
        content: chunks[i],
      });
    }
  }

  const knowledgeBase = {
    generatedAt: new Date().toISOString(),
    totalDocs: files.length,
    totalChunks: documents.length,
    documents,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(knowledgeBase));

  console.log(`Knowledge base built: ${files.length} docs, ${documents.length} chunks`);
  console.log(`Output: ${OUTPUT_FILE}`);
}

buildKnowledgeBase();
