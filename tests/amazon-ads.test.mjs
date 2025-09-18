import test from 'node:test';
import assert from 'node:assert/strict';

import handler from '../pages/api/amazon-ads.js';

function createMockRes() {
  return {
    statusCode: undefined,
    jsonData: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.jsonData = data;
      return this;
    },
  };
}

test('returns empty items when Amazon credentials are missing', async () => {
  const keys = [
    'AMAZON_ACCESS_KEY',
    'AMAZON_SECRET_KEY',
    'AMAZON_ASSOCIATE_TAG',
  ];
  const original = {};
  for (const key of keys) {
    original[key] = process.env[key];
    delete process.env[key];
  }

  const req = { method: 'GET', query: {} };
  const res = createMockRes();

  try {
    await handler(req, res);
  } finally {
    for (const key of keys) {
      const value = original[key];
      if (typeof value === 'string') {
        process.env[key] = value;
      } else {
        delete process.env[key];
      }
    }
  }

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.jsonData, { items: [] });
});
