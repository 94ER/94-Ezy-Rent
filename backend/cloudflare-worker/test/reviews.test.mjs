import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../src/index.js';

const origin = 'https://94er.github.io';
const endpoint = 'https://reviews.example/reviews';
const env = { GOOGLE_API_KEY: 'test-only', GOOGLE_PLACE_ID: 'test-place', CACHE_TTL_SECONDS: '604800' };
const success = {
  status: 'OK',
  result: {
    name: '94 Ezy Rent', rating: 4.9, user_ratings_total: 179,
    reviews: [
      { author_name: 'Recent renter', rating: 5, text: 'Great camera rental.', relative_time_description: 'in the last week' },
      { author_name: 'Another renter', rating: 4, text: 'Good service.' }
    ]
  }
};
const denied = { status: 'REQUEST_DENIED', error_message: 'You must enable Billing on the Google Cloud Project.' };

function harness(t, { cached, upstream = success } = {}) {
  const previousFetch = globalThis.fetch;
  const previousCaches = globalThis.caches;
  const entries = new Map(cached ? [[endpoint, cached]] : []);
  const pending = [];
  const calls = { fetch: 0, put: 0, delete: 0 };
  globalThis.caches = {
    default: {
      async match(key) { return entries.get(key.url)?.clone(); },
      async put(key, response) { calls.put++; entries.set(key.url, response.clone()); },
      async delete(key) { calls.delete++; return entries.delete(key.url); }
    }
  };
  globalThis.fetch = async (url) => {
    calls.fetch++;
    assert.equal(new URL(url).hostname, 'maps.googleapis.com');
    const payload = typeof upstream === 'function' ? upstream(calls.fetch) : upstream;
    if (payload instanceof Error) throw payload;
    return Response.json(payload);
  };
  t.after(() => {
    globalThis.fetch = previousFetch;
    if (previousCaches === undefined) delete globalThis.caches;
    else globalThis.caches = previousCaches;
  });
  return {
    calls, entries,
    async request(query = '') {
      const request = new Request(endpoint + query, { headers: { Origin: origin } });
      const response = await worker.fetch(request, env, { waitUntil(promise) { pending.push(promise); } });
      await Promise.all(pending.splice(0));
      return response;
    }
  };
}

test('replaces a previously cached billing error with fresh Google reviews', async (t) => {
  const h = harness(t, { cached: Response.json({ google: { error: denied.error_message, status: denied.status } }) });
  const response = await h.request();
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.equal(payload.google.status, 'OK');
  assert.equal(payload.google.total, 179);
  assert.equal(payload.google.reviews.length, 1);
  assert.equal(payload.google.reviews[0].name, 'Recent renter');
  assert.deepEqual(h.calls, { fetch: 1, put: 1, delete: 1 });
});

test('billing/API failures are never cached', async (t) => {
  const h = harness(t, { upstream: denied });
  const response = await h.request();
  assert.equal(response.status, 502);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal((await response.json()).google.status, 'REQUEST_DENIED');
  assert.equal(h.calls.put, 0);
  assert.equal(h.entries.size, 0);
});

test('network failures return a non-cacheable response', async (t) => {
  const h = harness(t, { upstream: new Error('Network unavailable') });
  const response = await h.request();
  assert.equal(response.status, 502);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal((await response.json()).google.status, 'UPSTREAM_ERROR');
  assert.equal(h.calls.put, 0);
});

test('successful responses reuse the cache and retain CORS headers', async (t) => {
  const h = harness(t);
  await h.request();
  const response = await h.request();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'public, max-age=604800');
  assert.equal(response.headers.get('access-control-allow-origin'), origin);
  assert.equal(h.calls.fetch, 1);
  assert.equal(h.calls.put, 1);
});

test('invalid cached JSON is discarded and replaced', async (t) => {
  const h = harness(t, { cached: new Response('Not JSON') });
  assert.equal((await h.request()).status, 200);
  assert.equal(h.calls.delete, 1);
  assert.equal(h.calls.fetch, 1);
});

test('the next request can recover immediately after a Google failure', async (t) => {
  const h = harness(t, { upstream: (attempt) => attempt === 1 ? denied : success });
  assert.equal((await h.request()).status, 502);
  assert.equal((await h.request()).status, 200);
  assert.equal((await h.request()).status, 200);
  assert.equal(h.calls.fetch, 2);
  assert.equal(h.calls.put, 1);
});

test('query-string variations do not create extra Google API calls', async (t) => {
  const h = harness(t);
  await h.request('?check=first');
  await h.request('?check=second');
  assert.equal(h.calls.fetch, 1);
  assert.deepEqual([...h.entries.keys()], [endpoint]);
});
