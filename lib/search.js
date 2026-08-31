const DEV_INTENT_KEYWORDS = [
  'api', 'endpoint', 'request', 'response', 'curl', 'header', 'param',
  'parameter', 'body', 'json', 'xml', 'auth', 'token', 'sid', 'webhook',
  'callback', 'sdk', 'integration', 'integrate', 'code', 'example',
  'http', 'post', 'get', 'put', 'delete', 'method', 'status code',
  'rate limit', 'webrtc', 'voicebot', 'applet', 'exoml',
];

const CHANNEL_PREFIXES = {
  voice: [
    '/docs/voice/',
    '/docs/voice-v1/',
    '/docs/voice-v3/',
    '/docs/voice-api/',
    '/docs/agentstream/',
    '/docs/sip-trunking/',
  ],
  sms: ['/docs/sms-api/'],
  whatsapp: ['/docs/whatsapp-api/'],
  rcs: ['/docs/rcs-omnichannel/'],
};

function isDevIntent(query) {
  const normalizedQuery = String(query || '').toLowerCase();
  return DEV_INTENT_KEYWORDS.some((keyword) => normalizedQuery.includes(keyword));
}

function isApiReferenceDoc(doc) {
  const url = (doc.url || '').toLowerCase();
  return (
    url.includes('/api-reference/') ||
    url.includes('/api/') ||
    url.endsWith('/quickstart') ||
    url.endsWith('/quickstart.mdx')
  );
}

function isEndCustomerSupportDoc(doc) {
  const url = (doc.url || '').toLowerCase();
  return (
    url.includes('/call-support/') ||
    url.includes('/sms-support/') ||
    url.includes('/whatsapp-support/') ||
    url.includes('/faqs/')
  );
}

function getDocumentChannel(doc) {
  const url = (doc.url || '').toLowerCase();

  for (const [channel, prefixes] of Object.entries(CHANNEL_PREFIXES)) {
    if (prefixes.some((prefix) => url.startsWith(prefix))) {
      return channel;
    }
  }

  return null;
}

function getDocumentType(doc) {
  const url = (doc.url || '').toLowerCase();

  if (url.includes('/quickstart')) return 'quickstart';
  if (url.includes('/api-reference/') || url.includes('/api/')) return 'api_reference';
  if (url.includes('sdk') || url.includes('/integrations/')) return 'sdk';
  return 'guide';
}

function scoreDocuments(query, documents) {
  const queryWords = query.toLowerCase().split(/\s+/).filter((word) => word.length > 2);
  const devIntent = isDevIntent(query);

  return documents.map((doc) => {
    const content = `${doc.title || ''} ${doc.content || ''} ${doc.product || ''}`.toLowerCase();
    let score = 0;

    for (const word of queryWords) {
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const matches = content.match(new RegExp(`\\b${escapedWord}\\b`, 'gi'));
      if (matches) score += matches.length * 2;
      if (content.includes(word)) score += 1;
    }

    const title = (doc.title || '').toLowerCase();
    const product = (doc.product || '').toLowerCase();
    for (const word of queryWords) {
      if (title.includes(word)) score += 5;
      if (product.includes(word)) score += 3;
    }

    if (devIntent) {
      if (isApiReferenceDoc(doc)) score += 15;
      if (isEndCustomerSupportDoc(doc)) score = Math.max(0, score - 8);
    } else if (isApiReferenceDoc(doc)) {
      score += 4;
    }

    return { ...doc, score };
  });
}

function getRelevantChunks(query, documents, topK = 8) {
  return scoreDocuments(query, documents)
    .filter((doc) => doc.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, topK);
}

function createHighlights(content, query, maxHighlights = 2) {
  const text = String(content || '').replace(/\s+/g, ' ').trim();
  const queryWords = query.toLowerCase().split(/\s+/).filter((word) => word.length > 2);
  const highlights = [];

  for (const word of queryWords) {
    const index = text.toLowerCase().indexOf(word);
    if (index === -1) continue;

    const start = Math.max(0, index - 70);
    const end = Math.min(text.length, index + word.length + 110);
    const snippet = `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`;
    if (!highlights.includes(snippet)) highlights.push(snippet);
    if (highlights.length === maxHighlights) break;
  }

  return highlights.length > 0 ? highlights : [text.slice(0, 180)];
}

function searchDocuments(query, documents, { channels, types, limit = 8 } = {}) {
  const channelFilter = channels ? new Set(channels) : null;
  const typeFilter = types ? new Set(types) : null;
  const scored = getRelevantChunks(query, documents, documents.length);
  const filtered = scored.filter((doc) => {
    const channel = getDocumentChannel(doc);
    const type = getDocumentType(doc);
    return (!channelFilter || channelFilter.has(channel)) && (!typeFilter || typeFilter.has(type));
  });

  const groups = { voice: 0, sms: 0, whatsapp: 0, rcs: 0 };
  for (const doc of filtered) {
    const channel = getDocumentChannel(doc);
    if (channel) groups[channel] += 1;
  }

  return {
    total: filtered.length,
    groups,
    results: filtered.slice(0, limit).map((doc) => ({
      id: doc.id,
      title: doc.title,
      product: doc.product,
      type: getDocumentType(doc),
      url: new URL(doc.url, 'https://developer.exotel.com').toString(),
      highlights: createHighlights(doc.content, query),
      score: doc.score,
    })),
  };
}

module.exports = {
  getDocumentChannel,
  getDocumentType,
  getRelevantChunks,
  isApiReferenceDoc,
  isDevIntent,
  isEndCustomerSupportDoc,
  searchDocuments,
};
