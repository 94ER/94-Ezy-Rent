Setup (Cloudflare Worker)

1) Install Wrangler on your computer
2) In this folder, run:
   - wrangler login
   - wrangler deploy

3) Google (required)
   - wrangler secret put GOOGLE_API_KEY
   - wrangler secret put GOOGLE_PLACE_ID

4) Facebook (optional)
   - wrangler secret put FB_PAGE_ID
   - wrangler secret put FB_PAGE_TOKEN

5) After deploy, you will get a Worker URL like:
   https://ezyrent-live-reviews.<your-subdomain>.workers.dev

6) Open index.html and set the live API URL:
   - Find: data-live-api=""
   - Replace with: data-live-api="https://ezyrent-live-reviews.<your-subdomain>.workers.dev"

Notes

- Google Place Details API usually returns a limited number of reviews.
- Facebook ratings may require Page permissions and a valid Page token. If not provided, the backend returns facebook.disabled=true.
