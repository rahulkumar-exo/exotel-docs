const assert = require('node:assert/strict');
const test = require('node:test');

const catalog = require('../data/console-catalog.json');
const catalogHandler = require('../api/console-catalog');
const { buildResponse } = catalogHandler;
const {
  buildRouteInventory,
  validateCatalog,
} = require('../scripts/validate-console-catalog');

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

test('catalog contains a scoped response for every supported channel', () => {
  for (const channel of ['voice', 'sms', 'whatsapp', 'rcs']) {
    const response = buildResponse(channel);
    assert.equal(response.channel, channel);
    assert.deepEqual(
      response.cards.map((card) => card.id),
      ['api_reference', 'sdk_quickstarts', 'exoml_flows'],
    );
    assert.equal(response.suggested_queries.length, 7);
    assert.ok(response.cross_sell.length > 0);
  }
});

test('catalog handler returns cache headers and rejects an absent channel', () => {
  const successResponse = createResponse();
  catalogHandler({
    method: 'GET',
    query: { channel: 'voice' },
    headers: {},
  }, successResponse);

  assert.equal(successResponse.statusCode, 200);
  assert.match(successResponse.headers['Cache-Control'], /stale-while-revalidate=86400/);
  assert.match(successResponse.headers.ETag, /^"catalog-/);

  const invalidResponse = createResponse();
  catalogHandler({ method: 'GET', headers: {} }, invalidResponse);
  assert.equal(invalidResponse.statusCode, 400);
});

test('all catalog URLs resolve to developer.exotel.com document routes', () => {
  assert.deepEqual(validateCatalog(catalog, buildRouteInventory()), []);
});

test('catalog validation rejects a missing route', () => {
  const invalidCatalog = structuredClone(catalog);
  invalidCatalog.channels.voice.cards[0].url =
    'https://developer.exotel.com/docs/does-not-exist';

  assert.match(
    validateCatalog(invalidCatalog, buildRouteInventory()).join('\n'),
    /does not resolve/,
  );
});
