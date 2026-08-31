const knowledgeBase = require('../static/knowledge-base.json');
const { searchDocuments } = require('../lib/search');

const ALLOWED_CHANNELS = new Set(['voice', 'sms', 'whatsapp', 'rcs']);
const ALLOWED_TYPES = new Set(['quickstart', 'api_reference', 'sdk', 'guide']);
const DEFAULT_LIMIT = 8;
const MAX_LIMIT = 20;
const TIMEOUT_MS = 5000;

function validateSubset(value, allowed, field) {
  if (value === undefined) return null;
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || !allowed.has(item))) {
    return `${field} contains an unsupported value`;
  }
  return null;
}

function redactQuery(value) {
  return value
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[email]')
    .replace(/\d{5,}/g, '[digits]');
}

function logMetric(name, fields) {
  console.info(JSON.stringify({ metric: name, ...fields }));
}

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const startedAt = Date.now();
  const body = req.body || {};
  const query = typeof body.query === 'string' ? body.query.trim() : '';
  const limit = body.limit === undefined ? DEFAULT_LIMIT : body.limit;
  const validationError =
    (!query || query.length > 200 ? 'query must be a string between 1 and 200 characters' : null) ||
    validateSubset(body.channels, ALLOWED_CHANNELS, 'channels') ||
    validateSubset(body.types, ALLOWED_TYPES, 'types') ||
    (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT
      ? `limit must be an integer between 1 and ${MAX_LIMIT}`
      : null);

  if (validationError) {
    logMetric('docs_search_requests_total', { status: 400, channel: 'none' });
    return res.status(400).json({ error: validationError });
  }

  try {
    const searchResult = searchDocuments(query, knowledgeBase.documents, {
      channels: body.channels,
      types: body.types,
      limit,
    });
    const tookMs = Date.now() - startedAt;

    if (tookMs > TIMEOUT_MS) {
      logMetric('docs_search_requests_total', { status: 504, channel: 'all' });
      return res.status(504).json({ error: 'Search timed out' });
    }

    const channelLabel = body.channels && body.channels.length > 0
      ? body.channels.join(',')
      : 'all';
    logMetric('docs_search_requests_total', { status: 200, channel: channelLabel });
    logMetric('docs_search_latency_seconds', { value: tookMs / 1000 });
    if (searchResult.total === 0) {
      logMetric('docs_search_zero_result_total', { value: 1 });
    }
    console.info(JSON.stringify({
      event: 'docs_search',
      query: redactQuery(query),
      channels: body.channels || [],
      types: body.types || [],
      total: searchResult.total,
      took_ms: tookMs,
    }));

    return res.status(200).json({
      query,
      total: searchResult.total,
      took_ms: tookMs,
      results: searchResult.results,
      groups: searchResult.groups,
    });
  } catch (error) {
    logMetric('docs_search_requests_total', { status: 500, channel: 'all' });
    console.error('[docs-search] failed:', error.message);
    return res.status(500).json({ error: 'Search failed' });
  }
};

module.exports.redactQuery = redactQuery;
