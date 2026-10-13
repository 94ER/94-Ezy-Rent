const DEFAULT_ORIGINS = [
  'https://94er.github.io',
  'http://127.0.0.1:4173',
  'http://localhost:4173'
];
const PRODUCT_INDEX_KEY = 'catalog/products.json';
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const SESSION_SECONDS = 8 * 60 * 60;

const cleanText = (value, max = 400) => String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
const cleanList = (value) => {
  const input = Array.isArray(value) ? value : String(value || '').split(/\r?\n/);
  return input.map((item) => cleanText(item, 120)).filter(Boolean).slice(0, 12);
};

const allowedOrigin = (request, env) => {
  const configured = String(env.ALLOWED_ORIGINS || '').split(',').map((item) => item.trim()).filter(Boolean);
  const allowed = configured.length ? configured : DEFAULT_ORIGINS;
  const origin = request.headers.get('origin') || '';
  return allowed.includes(origin) ? origin : allowed[0];
};

const corsHeaders = (request, env) => ({
  'access-control-allow-origin': allowedOrigin(request, env),
  'access-control-allow-methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'access-control-allow-headers': 'authorization,content-type',
  'access-control-max-age': '86400',
  vary: 'Origin'
});

const json = (request, env, data, init = {}) => {
  const headers = new Headers(init.headers || {});
  headers.set('content-type', 'application/json; charset=utf-8');
  Object.entries(corsHeaders(request, env)).forEach(([key, value]) => headers.set(key, value));
  return new Response(JSON.stringify(data), { ...init, headers });
};

const bytesToBase64Url = (bytes) => {
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const stringToBase64Url = (value) => bytesToBase64Url(new TextEncoder().encode(value));

const signValue = async (value, secret) => {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return bytesToBase64Url(new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value))));
};

const createSession = async (secret) => {
  const payload = stringToBase64Url(JSON.stringify({ role: 'staff', exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS }));
  return `${payload}.${await signValue(payload, secret)}`;
};

const verifySession = async (request, env) => {
  if (!env.SESSION_SECRET) return false;
  const auth = request.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const [payload, signature] = token.split('.');
  if (!payload || !signature || signature !== await signValue(payload, env.SESSION_SECRET)) return false;
  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const decoded = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(padded), (char) => char.charCodeAt(0))));
    return decoded.role === 'staff' && Number(decoded.exp) > Math.floor(Date.now() / 1000);
  } catch (_) {
    return false;
  }
};

const requireStaff = async (request, env) => {
  if (await verifySession(request, env)) return null;
  return json(request, env, { error: 'Your staff session is invalid or has expired.' }, { status: 401 });
};

const getProducts = async (env) => {
  if (!env.PRODUCT_BUCKET) return [];
  const object = await env.PRODUCT_BUCKET.get(PRODUCT_INDEX_KEY);
  if (!object) return [];
  try {
    const products = JSON.parse(await object.text());
    return Array.isArray(products) ? products : [];
  } catch (_) {
    return [];
  }
};

const saveProducts = async (env, products) => {
  await env.PRODUCT_BUCKET.put(PRODUCT_INDEX_KEY, JSON.stringify(products), {
    httpMetadata: { contentType: 'application/json; charset=utf-8', cacheControl: 'no-store' }
  });
};

const imageExtension = (type) => ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[type] || '');
const slugify = (value) => cleanText(value, 90).toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 72);

const productPayload = (form, imageUrl, imageKey) => {
  const name = cleanText(form.get('name'), 100);
  return {
    slug: slugify(form.get('slug') || name),
    cat: cleanText(form.get('cat'), 20),
    icon: cleanText(form.get('icon') || '📷', 8),
    badge: cleanText(form.get('badge'), 24),
    name,
    image: imageUrl,
    imageKey,
    price: cleanText(form.get('price') || 'Contact for rate', 60),
    desc: cleanText(form.get('desc'), 500),
    features: cleanList(form.get('features')),
    included: cleanList(form.get('included')),
    source: 'staff',
    updatedAt: new Date().toISOString()
  };
};

const validateProduct = (product) => {
  const categories = new Set(['drone', 'action', '360', 'digital', 'acc']);
  if (!product.name || !product.slug || !product.desc) return 'Model name and description are required.';
  if (!categories.has(product.cat)) return 'Choose a valid category.';
  if (!product.features.length || !product.included.length) return 'Add at least one highlight and one included item.';
  return '';
};

const handleLogin = async (request, env) => {
  if (!env.STAFF_PASSWORD || !env.SESSION_SECRET) return json(request, env, { error: 'Staff login is not configured.' }, { status: 503 });
  let body;
  try { body = await request.json(); } catch (_) { body = {}; }
  if (String(body.password || '') !== String(env.STAFF_PASSWORD)) {
    return json(request, env, { error: 'Incorrect password.' }, { status: 401 });
  }
  return json(request, env, { token: await createSession(env.SESSION_SECRET), expiresIn: SESSION_SECONDS });
};

const handleProductUpload = async (request, env, url) => {
  if (!env.PRODUCT_BUCKET) return json(request, env, { error: 'Product storage is not configured.' }, { status: 503 });
  const form = await request.formData();
  const file = form.get('image');
  if (!(file instanceof File) || !file.size) return json(request, env, { error: 'A product photo is required.' }, { status: 400 });
  const extension = imageExtension(file.type);
  if (!extension) return json(request, env, { error: 'Use a JPG, PNG or WebP image.' }, { status: 400 });
  if (file.size > MAX_IMAGE_BYTES) return json(request, env, { error: 'The image must be 5 MB or smaller.' }, { status: 400 });

  const provisionalSlug = slugify(form.get('slug') || form.get('name'));
  const imageKey = `product-images/${provisionalSlug}-${crypto.randomUUID()}.${extension}`;
  const imageUrl = `${url.origin}/${imageKey}`;
  const product = productPayload(form, imageUrl, imageKey);
  const error = validateProduct(product);
  if (error) return json(request, env, { error }, { status: 400 });

  const products = await getProducts(env);
  if (products.some((item) => item.slug === product.slug)) return json(request, env, { error: 'A product with this model name already exists.' }, { status: 409 });

  await env.PRODUCT_BUCKET.put(imageKey, file.stream(), {
    httpMetadata: { contentType: file.type, cacheControl: 'public, max-age=31536000, immutable' },
    customMetadata: { widthGuide: '1080', heightGuide: '1350', aspectRatio: '4:5', uploadedBy: 'staff' }
  });
  products.unshift(product);
  await saveProducts(env, products);
  return json(request, env, { ok: true, product }, { status: 201 });
};

const handleProductUpdate = async (request, env, url, slug) => {
  if (!env.PRODUCT_BUCKET) return json(request, env, { error: 'Product storage is not configured.' }, { status: 503 });
  const products = await getProducts(env);
  const index = products.findIndex((item) => item.slug === slug);
  if (index === -1) return json(request, env, { error: 'Product not found.' }, { status: 404 });

  const existing = products[index];
  const form = await request.formData();
  const file = form.get('image');
  const hasReplacement = file instanceof File && file.size > 0;
  let imageKey = existing.imageKey || '';
  let imageUrl = existing.image || '';

  if (hasReplacement) {
    const extension = imageExtension(file.type);
    if (!extension) return json(request, env, { error: 'Use a JPG, PNG or WebP image.' }, { status: 400 });
    if (file.size > MAX_IMAGE_BYTES) return json(request, env, { error: 'The image must be 5 MB or smaller.' }, { status: 400 });
    imageKey = `product-images/${existing.slug}-${crypto.randomUUID()}.${extension}`;
    imageUrl = `${url.origin}/${imageKey}`;
  }

  form.set('slug', existing.slug);
  const product = productPayload(form, imageUrl, imageKey);
  const error = validateProduct(product);
  if (error) return json(request, env, { error }, { status: 400 });

  if (hasReplacement) {
    await env.PRODUCT_BUCKET.put(imageKey, file.stream(), {
      httpMetadata: { contentType: file.type, cacheControl: 'public, max-age=31536000, immutable' },
      customMetadata: { widthGuide: '1080', heightGuide: '1350', aspectRatio: '4:5', uploadedBy: 'staff' }
    });
  }

  products[index] = product;
  await saveProducts(env, products);
  if (hasReplacement && existing.imageKey && existing.imageKey !== imageKey) {
    await env.PRODUCT_BUCKET.delete(existing.imageKey);
  }
  return json(request, env, { ok: true, product });
};

const handleProductDelete = async (request, env, slug) => {
  const products = await getProducts(env);
  const product = products.find((item) => item.slug === slug);
  if (!product) return json(request, env, { error: 'Product not found.' }, { status: 404 });
  if (product.imageKey) await env.PRODUCT_BUCKET.delete(product.imageKey);
  await saveProducts(env, products.filter((item) => item.slug !== slug));
  return json(request, env, { ok: true });
};

const serveProductImage = async (request, env, pathname) => {
  if (!env.PRODUCT_BUCKET) return new Response('Not found', { status: 404 });
  const key = pathname.replace(/^\//, '');
  const object = await env.PRODUCT_BUCKET.get(key);
  if (!object) return new Response('Not found', { status: 404 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('access-control-allow-origin', allowedOrigin(request, env));
  return new Response(object.body, { headers });
};

const getTtl = (env) => {
  const n = Number(env.CACHE_TTL_SECONDS || 21600);
  return Number.isFinite(n) && n >= 600 ? n : 21600;
};

const isFiveStar = (review) => Math.round(Number(review?.rating) || 0) === 5;
const normalizeGoogle = (payload) => {
  const result = payload?.result || {};
  const reviews = Array.isArray(result.reviews) ? result.reviews : [];
  return {
    name: result.name || 'Google', rating: result.rating || null, total: result.user_ratings_total || null,
    address: result.formatted_address || '',
    reviews: reviews.map((review) => ({ name: review.author_name || 'Google user', rating: review.rating || 0, meta: review.relative_time_description || '', text: cleanText(review.text || '') })).filter((review) => review.text && isFiveStar(review)).slice(0, 6)
  };
};

const fetchGoogle = async (env) => {
  if (!env.GOOGLE_API_KEY || !env.GOOGLE_PLACE_ID) return { error: 'Missing GOOGLE_API_KEY or GOOGLE_PLACE_ID' };
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.set('place_id', env.GOOGLE_PLACE_ID);
  url.searchParams.set('fields', 'name,formatted_address,rating,user_ratings_total,reviews');
  url.searchParams.set('reviews_sort', 'newest');
  url.searchParams.set('key', env.GOOGLE_API_KEY);
  const response = await fetch(url.toString());
  if (!response.ok) return { error: `Google API error ${response.status}` };
  const payload = await response.json();
  const status = String(payload?.status || '').trim();
  if (status && status !== 'OK') return { error: `Google status: ${status}${payload?.error_message ? ` - ${cleanText(payload.error_message)}` : ''}`, status, placeId: env.GOOGLE_PLACE_ID };
  return { ...normalizeGoogle(payload), status: status || 'OK', placeId: env.GOOGLE_PLACE_ID };
};

const handleReviews = async (request, env, ctx, url) => {
  const cache = caches.default;
  const cacheKey = new Request(url.toString(), request);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;
  const response = json(request, env, { updatedAt: new Date().toISOString(), google: await fetchGoogle(env) }, { headers: { 'cache-control': `public, max-age=${getTtl(env)}` } });
  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
};

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    const url = new URL(request.url);

    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/health')) return json(request, env, { ok: true, products: Boolean(env.PRODUCT_BUCKET) });
    if (request.method === 'GET' && url.pathname === '/reviews') return handleReviews(request, env, ctx, url);
    if (request.method === 'GET' && url.pathname === '/products') return json(request, env, { products: await getProducts(env) }, { headers: { 'cache-control': 'no-store' } });
    if (request.method === 'GET' && url.pathname.startsWith('/product-images/')) return serveProductImage(request, env, url.pathname);
    if (request.method === 'POST' && url.pathname === '/admin/login') return handleLogin(request, env);

    if (url.pathname.startsWith('/admin/')) {
      const denied = await requireStaff(request, env);
      if (denied) return denied;
      if (request.method === 'GET' && url.pathname === '/admin/products') return json(request, env, { products: await getProducts(env) });
      if (request.method === 'POST' && url.pathname === '/admin/products') return handleProductUpload(request, env, url);
      if (request.method === 'PUT' && url.pathname.startsWith('/admin/products/')) return handleProductUpdate(request, env, url, decodeURIComponent(url.pathname.slice('/admin/products/'.length)));
      if (request.method === 'DELETE' && url.pathname.startsWith('/admin/products/')) return handleProductDelete(request, env, decodeURIComponent(url.pathname.slice('/admin/products/'.length)));
    }

    return json(request, env, { error: 'Not found' }, { status: 404 });
  }
};
