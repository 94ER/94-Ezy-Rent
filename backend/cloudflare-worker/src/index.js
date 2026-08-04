const json = (obj, init = {}) => {
  const headers = new Headers(init.headers || {});
  headers.set('content-type', 'application/json; charset=utf-8');
  headers.set('access-control-allow-origin', '*');
  headers.set('access-control-allow-methods', 'GET,OPTIONS');
  headers.set('access-control-allow-headers', 'content-type');
  return new Response(JSON.stringify(obj), { ...init, headers });
};

const ok = (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'access-control-allow-origin': '*' } });
  return null;
};

const getTtl = (env) => {
  const n = Number(env.CACHE_TTL_SECONDS || 21600);
  return Number.isFinite(n) && n >= 600 ? n : 21600;
};

const cleanText = (s) => String(s || '').replace(/\s+/g, ' ').trim();
const isFiveStar = (review) => Math.round(Number(review?.rating) || 0) === 5;

const normalizeGoogle = (payload) => {
  const result = payload?.result || {};
  const reviews = Array.isArray(result.reviews) ? result.reviews : [];
  return {
    name: result.name || 'Google',
    rating: result.rating || null,
    total: result.user_ratings_total || null,
    address: result.formatted_address || '',
    reviews: reviews
      .map((r) => ({
        name: r.author_name || 'Google user',
        rating: r.rating || 0,
        meta: r.relative_time_description || '',
        text: cleanText(r.text || '')
      }))
      .filter((r) => r.text && isFiveStar(r))
      .slice(0, 6)
  };
};

const fetchGoogle = async (env) => {
  if (!env.GOOGLE_API_KEY || !env.GOOGLE_PLACE_ID) {
    return { error: 'Missing GOOGLE_API_KEY or GOOGLE_PLACE_ID' };
  }
  const u = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  u.searchParams.set('place_id', env.GOOGLE_PLACE_ID);
  u.searchParams.set('fields', 'name,formatted_address,rating,user_ratings_total,reviews');
  u.searchParams.set('reviews_sort', 'newest');
  u.searchParams.set('key', env.GOOGLE_API_KEY);
  const res = await fetch(u.toString());
  if (!res.ok) return { error: `Google API error ${res.status}` };
  const payload = await res.json();
  const status = String(payload?.status || '').trim();
  if (status && status !== 'OK') {
    const message = cleanText(payload?.error_message || '');
    return {
      error: `Google status: ${status}${message ? ` - ${message}` : ''}`,
      status,
      placeId: env.GOOGLE_PLACE_ID
    };
  }
  const normalized = normalizeGoogle(payload);
  return {
    ...normalized,
    status: status || 'OK',
    placeId: env.GOOGLE_PLACE_ID
  };
};

export default {
  async fetch(request, env, ctx) {
    const pre = ok(request);
    if (pre) return pre;
    if (request.method !== 'GET') return json({ error: 'Method not allowed' }, { status: 405 });

    const url = new URL(request.url);
    if (url.pathname === '/' || url.pathname === '/health') return json({ ok: true });

    if (url.pathname !== '/reviews') return json({ error: 'Not found' }, { status: 404 });

    const cache = caches.default;
    const ttl = getTtl(env);
    const cacheKey = new Request(url.toString(), request);
    const cached = await cache.match(cacheKey);
    if (cached) return cached;

    const google = await fetchGoogle(env);
    const body = {
      updatedAt: new Date().toISOString(),
      google
    };

    const resp = json(body, {
      headers: {
        'cache-control': `public, max-age=${ttl}`
      }
    });
    ctx.waitUntil(cache.put(cacheKey, resp.clone()));
    return resp;
  }
};
