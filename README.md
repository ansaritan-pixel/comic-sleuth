# The Comic Sleuth

A want-list tracker for comic books: add specific issues, and Comic Sleuth
searches marketplaces for active listings that match.

This build implements the **eBay** marketplace connector using eBay's
official Browse API — no web scraping, no browser automation.

## How it's built

- `server/` — Node.js/Express backend. Holds all eBay credentials and makes
  every eBay API call. Nothing here is ever sent to the browser.
- `public/` — static frontend (plain HTML/CSS/JS). Talks only to Comic
  Sleuth's own `/api/*` endpoints, never directly to eBay.
- `server/connectors/ebay/` — the eBay integration, isolated from the rest of
  the app. Adding another marketplace later means adding a sibling
  `server/connectors/<marketplace>/` folder with the same `searchForBook(book)`
  contract — nothing in `ebay/` needs to change.

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy the environment template and fill in your eBay Sandbox keys:
   ```
   cp .env.example .env
   ```
   Open `.env` and set:
   - `EBAY_SANDBOX_CLIENT_ID` and `EBAY_SANDBOX_CLIENT_SECRET` — from your
     [eBay Developer](https://developer.ebay.com/) account, under
     **My Account → Application Keys**, Sandbox tab.
   - Leave `EBAY_ENV=sandbox` as-is for now.

   **`.env` is gitignored and will never be committed.** Nobody but you
   should ever see the values in it — don't paste them into chat, issues, or
   commit messages.

   Optionally, also set `COMICVINE_API_KEY` (free, from
   [comicvine.gamespot.com/api](https://comicvine.gamespot.com/api/)) to get
   real cover art on want-list books. Not required — without it, book cards
   just fall back to a photo from an eBay listing, or a placeholder.
3. Start the server:
   ```
   npm start
   ```
4. Open http://localhost:3000

## Environment: sandbox vs. production

Comic Sleuth reads a single variable, `EBAY_ENV`, to decide which eBay
environment to call:

| `EBAY_ENV` | Token/API host | Credentials used |
|---|---|---|
| `sandbox` (default) | `api.sandbox.ebay.com` | `EBAY_SANDBOX_CLIENT_ID` / `EBAY_SANDBOX_CLIENT_SECRET` |
| `production` | `api.ebay.com` | `EBAY_PRODUCTION_CLIENT_ID` / `EBAY_PRODUCTION_CLIENT_SECRET` |

To go live later: get a production keyset from eBay, fill in
`EBAY_PRODUCTION_CLIENT_ID`/`EBAY_PRODUCTION_CLIENT_SECRET` in `.env`, and set
`EBAY_ENV=production`. No code changes are required — `server/connectors/ebay/config.js`
is the only place that reads these variables.

## How eBay search works

- **Auth**: OAuth 2.0 client-credentials flow (`server/connectors/ebay/auth.js`).
  The server exchanges your Client ID/Secret for a short-lived access token,
  caches it in memory, and refreshes it automatically before it expires (or
  immediately on a 401 from the API). The Client Secret and access token
  never leave the server process.
- **Search**: for each want-list book, the server calls eBay's
  `item_summary/search` endpoint (`server/connectors/ebay/client.js`) with a
  query built from the title and issue number.
- **Normalization**: results are mapped to Comic Sleuth's listing shape
  (`server/connectors/ebay/normalize.js`) — comic title, issue, listing
  title, grading company, grade, price, currency, image, item ID, listing
  URL, and marketplace. eBay's Browse API only returns active/asking-price
  listings, so nothing here is ever labeled as sold or used as fair-market
  value.
- **Caching**: search results are cached in memory for 15 minutes per
  title+issue, so reloading the page or adding a duplicate search doesn't
  make redundant eBay calls. See the "Source health & request log" panel at
  the bottom of the page for a live view of cache hits vs. live calls.
- **Errors, rate limits, and outages**: a failed eBay call never falls back
  to scraping. It's logged and surfaced as a status on the "eBay" source
  card (green/yellow/red) with the reason, and the affected book simply
  shows its most recent cached results (or none) until the next successful
  search.

## Cover art (Comic Vine)

If `COMICVINE_API_KEY` is set, each want-list book gets a one-time lookup
against Comic Vine's `/search/` endpoint (`server/connectors/comicvine/`),
matched on issue number, then disambiguated by title and year when a title
has multiple volumes/reprints. The result (a match, or a confirmed no-match)
is persisted on the book so it's never looked up twice — well within Comic
Vine's rate limit regardless of want-list size. A transient failure (network
blip, rate limit) is *not* persisted, so it's retried on a later page load
rather than permanently giving up. If a book has no cover art, the UI falls
back to a photo from its highest-priced eBay listing, then to a placeholder.

## Not yet implemented

MyComicShop, Reece's Rare Comics, Superworld Comics, and Dale Roberts Comics
are shown in the "Sources monitored" panel for context but have no live
connector in this build — only eBay is currently wired up.
