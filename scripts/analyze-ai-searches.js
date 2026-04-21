#!/usr/bin/env node
/**
 * Analyze the AI search log at data/ai-search-logs.json.
 *
 * Usage:
 *   node scripts/analyze-ai-searches.js
 *   node scripts/analyze-ai-searches.js --days 7     # last 7 days only
 *   node scripts/analyze-ai-searches.js --raw        # dump all questions
 *   node scripts/analyze-ai-searches.js --pull       # git pull first
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const daysArg = args.indexOf('--days');
const days = daysArg >= 0 ? parseInt(args[daysArg + 1], 10) : null;
const rawMode = args.includes('--raw');
const shouldPull = args.includes('--pull');

const REPO_ROOT = path.resolve(__dirname, '..');
const LOG_PATH = path.join(REPO_ROOT, 'data', 'ai-search-logs.json');

if (shouldPull) {
  console.log('Pulling latest from git...\n');
  // Use stash+pull+pop so this works even with a dirty working copy.
  // Fetch only data/ai-search-logs.json so we don't disturb other in-progress edits.
  try {
    execSync(
      'git fetch origin main --quiet && git checkout origin/main -- data/ai-search-logs.json',
      { cwd: REPO_ROOT, stdio: 'inherit' }
    );
  } catch (e) {
    console.warn('Could not pull latest log file from git — analyzing local copy only.');
  }
}

if (!fs.existsSync(LOG_PATH)) {
  console.error(`No log file at ${LOG_PATH}`);
  process.exit(1);
}

let logs = JSON.parse(fs.readFileSync(LOG_PATH, 'utf-8'));

if (days != null) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  logs = logs.filter((l) => new Date(l.timestamp).getTime() >= cutoff);
}

if (rawMode) {
  logs.forEach((l, i) => {
    console.log(`${i + 1}. [${l.timestamp}] ${l.question}`);
  });
  process.exit(0);
}

if (logs.length === 0) {
  console.log('No searches in the selected window.');
  process.exit(0);
}

// ---- Stats ----
const total = logs.length;
const failed = logs.filter((l) => l.failed).length;
const noResults = logs.filter((l) => l.relevant_chunks_found === 0).length;
const avgResponseMs = Math.round(
  logs.reduce((s, l) => s + (l.response_time_ms || 0), 0) / total
);
const avgAnswerLen = Math.round(
  logs.filter((l) => l.answer_length).reduce((s, l) => s + l.answer_length, 0) /
    Math.max(1, logs.filter((l) => l.answer_length).length)
);

// ---- Top questions ----
const questionCounts = {};
logs.forEach((l) => {
  const normalized = l.question.toLowerCase().trim();
  questionCounts[normalized] = (questionCounts[normalized] || 0) + 1;
});
const topQuestions = Object.entries(questionCounts)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 15);

// ---- Top keywords (simple word frequency, skipping stop words) ----
const stopWords = new Set([
  'how', 'what', 'why', 'when', 'where', 'who', 'can', 'i', 'do', 'is', 'are',
  'the', 'a', 'an', 'to', 'of', 'for', 'in', 'on', 'with', 'and', 'or', 'but',
  'my', 'me', 'you', 'it', 'be', 'this', 'that', 'from', 'by', 'as', 'at',
  'does', 'use', 'get', 'set', 'make', 'using',
]);
const wordCounts = {};
logs.forEach((l) => {
  (l.question || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w))
    .forEach((w) => {
      wordCounts[w] = (wordCounts[w] || 0) + 1;
    });
});
const topKeywords = Object.entries(wordCounts)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 20);

// ---- Top source pages referenced ----
const pageRefs = {};
logs.forEach((l) => {
  (l.source_pages || []).forEach((p) => {
    const key = p.url || p.title;
    pageRefs[key] = (pageRefs[key] || 0) + 1;
  });
});
const topPages = Object.entries(pageRefs)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 10);

// ---- Model distribution ----
const modelUsage = {};
logs.forEach((l) => {
  if (l.model_used) modelUsage[l.model_used] = (modelUsage[l.model_used] || 0) + 1;
});

// ---- Output ----
console.log('=== Exotel Developer Docs — AI Search Analytics ===');
console.log(`Window: ${days ? `last ${days} day(s)` : 'all time'}`);
console.log(`Total searches: ${total}`);
console.log(`Failed: ${failed} (${((failed / total) * 100).toFixed(1)}%)`);
console.log(`No relevant docs found: ${noResults} (${((noResults / total) * 100).toFixed(1)}%)`);
console.log(`Avg response time: ${avgResponseMs}ms`);
console.log(`Avg answer length: ${avgAnswerLen} chars`);

console.log('\n--- Models used ---');
Object.entries(modelUsage).forEach(([m, c]) => console.log(`  ${m}: ${c}`));

console.log('\n--- Top 15 questions ---');
topQuestions.forEach(([q, count], i) => {
  console.log(`  ${i + 1}. (${count}x) ${q}`);
});

console.log('\n--- Top 20 keywords ---');
topKeywords.forEach(([k, c], i) => {
  console.log(`  ${i + 1}. ${k} (${c})`);
});

console.log('\n--- Top 10 source pages referenced ---');
topPages.forEach(([url, c], i) => {
  console.log(`  ${i + 1}. ${url} (${c})`);
});

console.log('\n--- Queries with NO relevant docs (content gaps!) ---');
logs
  .filter((l) => l.relevant_chunks_found === 0)
  .slice(0, 20)
  .forEach((l, i) => {
    console.log(`  ${i + 1}. [${l.timestamp.slice(0, 10)}] ${l.question}`);
  });
