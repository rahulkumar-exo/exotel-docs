const crypto = require('crypto');
const catalog = require('../data/console-catalog.json');

const CHANNELS = new Set(['voice', 'sms', 'whatsapp', 'rcs']);

function buildResponse(channel) {
  return {
    version: catalog.version,
    channel,
    cards: catalog.channels[channel].cards,
    cross_sell: catalog.channels[channel].cross_sell,
    mcp_pointer: catalog.mcp_pointer,
    suggested_queries: catalog.suggested_queries,
  };
}

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const rawChannel = (req.query || {}).channel;
  const channel = typeof rawChannel === 'string' ? rawChannel.toLowerCase() : '';
  if (!CHANNELS.has(channel)) {
    return res.status(400).json({
      error: 'channel must be one of: voice, sms, whatsapp, rcs',
    });
  }

  const response = buildResponse(channel);
  const etag = `"catalog-${catalog.version}-${crypto
    .createHash('sha256')
    .update(JSON.stringify(response))
    .digest('hex')
    .slice(0, 12)}"`;

  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=86400');
  res.setHeader('ETag', etag);
  if (req.headers['if-none-match'] === etag) return res.status(304).end();

  return res.status(200).json(response);
};

module.exports.buildResponse = buildResponse;
