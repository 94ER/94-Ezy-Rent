Setup (Cloudflare Worker)

1) Install Wrangler on your computer
2) In this folder, run:
   - wrangler login
   - wrangler deploy

3) Google (required)
   - GOOGLE_PLACE_ID is already prefilled in `wrangler.toml`
   - wrangler secret put GOOGLE_API_KEY
   - If your Google business listing changes later, update `GOOGLE_PLACE_ID` in `wrangler.toml`

4) Staff product manager (required for admin uploads)
   - Create the image and product storage bucket once: `npx wrangler r2 bucket create ezyrent-products`
   - Add the staff password securely: `npx wrangler secret put STAFF_PASSWORD`
   - Add a long random signing secret: `npx wrangler secret put SESSION_SECRET`
   - Never put either secret in HTML, JavaScript, Git, or `wrangler.toml`.

5) After deploy, you will get a Worker URL like:
   https://ezyrent-live-reviews.<your-subdomain>.workers.dev

6) Open index.html and set the live API URL on the reviews shell:
   - Find: data-live-api=""
   - Replace with: data-live-api="https://ezyrent-live-reviews.<your-subdomain>.workers.dev"

Notes

- Google Place Details API usually returns a limited number of reviews.
- Only successful Google responses are cached for `CACHE_TTL_SECONDS` (currently seven days). Cached errors from older deployments are discarded; API/billing/network failures return `502` with `Cache-Control: no-store` so the next request can recover immediately.
- Review URL query strings share the same cache entry to avoid unnecessary Google API requests.
- Run review-cache regression tests with `node --test test/reviews.test.mjs`.
- The homepage review slider is already wired to consume the Worker `/reviews` response once `data-live-api` is filled in.
- Staff sessions expire after 8 hours. Product images accept JPG, PNG, or WebP up to 5 MB.
- Recommended product photo: 1600 × 1200 px (4:3 landscape), with the device centred.
