const assert = require('node:assert/strict');
const test = require('node:test');

const searchHandler = require('../api/search');

function createResponse() {
  return {
    headers: {},
    statusCode: null,
    body: null,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
    end() {
      return this;
    },
  };
}

test('rejects missing and oversized search queries', () => {
  for (const query of ['', 'x'.repeat(201), null]) {
    const response = createResponse();
    searchHandler({ method: 'POST', body: { query } }, response);
    assert.equal(response.statusCode, 400);
  }
});

test('rejects unsupported filters and limits', () => {
  const requests = [
    { query: 'send SMS', channels: ['email'] },
    { query: 'send SMS', types: ['reference'] },
    { query: 'send SMS', limit: 21 },
  ];

  for (const body of requests) {
    const response = createResponse();
    searchHandler({ method: 'POST', body }, response);
    assert.equal(response.statusCode, 400);
  }
});

test('returns API-reference results and populated channel groups', () => {
  const response = createResponse();
  searchHandler({
    method: 'POST',
    body: {
      query: 'send SMS via API',
      channels: ['sms'],
      types: ['api_reference'],
      limit: 8,
    },
  }, response);

  assert.equal(response.statusCode, 200);
  assert.ok(response.body.total > 0);
  assert.ok(response.body.groups.sms > 0);
  assert.equal(response.body.results[0].type, 'api_reference');
});

test('redacts emails and long digit runs from logs', () => {
  assert.equal(
    searchHandler.redactQuery('email dev@example.com or call 919876543210'),
    'email [email] or call [digits]',
  );
});
