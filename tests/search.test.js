const assert = require('node:assert/strict');
const test = require('node:test');

const {
  getDocumentChannel,
  getDocumentType,
  getRelevantChunks,
  isApiReferenceDoc,
  isDevIntent,
  searchDocuments,
} = require('../lib/search');

test('detects developer intent and API reference documents', () => {
  assert.equal(isDevIntent('send SMS via API'), true);
  assert.equal(isDevIntent('what is SMS'), false);
  assert.equal(isApiReferenceDoc({ url: '/docs/sms-api/api-reference/send-sms' }), true);
});

test('boosts API references and demotes support documents for developer queries', () => {
  const documents = [
    {
      id: 'support',
      title: 'Send SMS',
      product: 'SMS',
      url: '/docs/sms-support/how-to-send-sms',
      content: 'Send SMS using an API request.',
    },
    {
      id: 'api',
      title: 'Send SMS',
      product: 'SMS API',
      url: '/docs/sms-api/api-reference/send-sms',
      content: 'Send SMS using an API request.',
    },
  ];

  const results = getRelevantChunks('send SMS via API', documents);
  assert.equal(results[0].id, 'api');
  assert.ok(results[0].score > results[1].score);
});

test('maps channel and document type from canonical routes', () => {
  assert.equal(getDocumentChannel({ url: '/docs/voice-v1/quickstart' }), 'voice');
  assert.equal(getDocumentChannel({ url: '/docs/sms-api/overview' }), 'sms');
  assert.equal(getDocumentChannel({ url: '/docs/whatsapp-api/overview' }), 'whatsapp');
  assert.equal(getDocumentChannel({ url: '/docs/rcs-omnichannel/overview' }), 'rcs');
  assert.equal(getDocumentType({ url: '/docs/sms-api/quickstart' }), 'quickstart');
  assert.equal(getDocumentType({ url: '/docs/sms-api/api-reference/send-sms' }), 'api_reference');
});

test('returns the contracted search result shape and channel groups', () => {
  const documents = [
    {
      id: '/docs/sms-api/api-reference/send-sms#chunk0',
      title: 'Send SMS',
      product: 'SMS API',
      url: '/docs/sms-api/api-reference/send-sms',
      content: 'POST /Accounts/{sid}/Sms/send to send an SMS via API.',
    },
  ];

  const response = searchDocuments('send SMS via API', documents, {
    channels: ['sms'],
    types: ['api_reference'],
    limit: 8,
  });

  assert.equal(response.total, 1);
  assert.equal(response.groups.sms, 1);
  assert.equal(response.results[0].type, 'api_reference');
  assert.equal(
    response.results[0].url,
    'https://developer.exotel.com/docs/sms-api/api-reference/send-sms',
  );
  assert.ok(response.results[0].highlights.length > 0);
});
