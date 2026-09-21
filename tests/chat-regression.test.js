const assert = require('node:assert/strict');
const test = require('node:test');

const chatHandler = require('../api/chat');

function createResponse() {
  return {
    statusCode: null,
    body: null,
    setHeader() {},
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

test('preserves the live 200 kill-switch response', async () => {
  const previousValue = process.env.CHAT_TEMPORARILY_DISABLED;
  process.env.CHAT_TEMPORARILY_DISABLED = '1';
  const response = createResponse();

  try {
    await chatHandler({ method: 'POST', query: {}, body: { question: 'How do I call?' } }, response);
  } finally {
    if (previousValue === undefined) delete process.env.CHAT_TEMPORARILY_DISABLED;
    else process.env.CHAT_TEMPORARILY_DISABLED = previousValue;
  }

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.model, 'disabled');
  assert.equal(response.body.response_id, null);
});

test('preserves greeting and gibberish gates', async () => {
  const greetingResponse = createResponse();
  await chatHandler({ method: 'POST', query: {}, body: { question: 'hello' } }, greetingResponse);
  assert.equal(greetingResponse.statusCode, 200);
  assert.equal(greetingResponse.body.gated, 'greeting');

  const gibberishResponse = createResponse();
  await chatHandler({ method: 'POST', query: {}, body: { question: 'bcdfghjkl' } }, gibberishResponse);
  assert.equal(gibberishResponse.statusCode, 400);
  assert.equal(gibberishResponse.body.gated, 'gibberish');
});

test('preserves vote-based feedback with a 200 response', async () => {
  const response = createResponse();
  await chatHandler({
    method: 'POST',
    query: { action: 'feedback' },
    body: { response_id: 'response-1', vote: 'up' },
    headers: {},
  }, response);

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.ok, true);
});
