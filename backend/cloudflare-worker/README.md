Setup (Cloudflare Worker)

1) Install Wrangler on your computer
2) In this folder, run:
   - wrangler login
   - wrangler deploy

3) Google (required)
   - GOOGLE_PLACE_ID is already prefilled in `wrangler.toml`
   - wrangler secret put GOOGLE_API_KEY
   - If your Google business listing changes later, update `GOOGLE_PLACE_ID` in `wrangler.toml`

4) Facebook (optional)
   - wrangler secret put FB_PAGE_ID
   - wrangler secret put FB_PAGE_TOKEN

5) After deploy, you will get a Worker URL like:
   https://ezyrent-live-reviews.<your-subdomain>.workers.dev

6) Open index.html and set the live API URL on the reviews shell:
   - Find: data-live-api=""
   - Replace with: data-live-api="https://ezyrent-live-reviews.<your-subdomain>.workers.dev"

Notes

- Google Place Details API usually returns a limited number of reviews.
- The homepage review slider is already wired to consume the Worker `/reviews` response once `data-live-api` is filled in.
- Facebook ratings may require Page permissions and a valid Page token. If not provided, the backend returns facebook.disabled=true.
