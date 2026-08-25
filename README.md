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
  query built from the title, issue number, and — when a real 4-digit year
  was entered — the publication year, to reduce mismatches against
  reprints or other volumes that happen to share a title and issue number.
- **Normalization**: results are mapped to Comic Sleuth's listing shape
  (`server/connectors/ebay/normalize.js`) — comic title, issue, listing
  title, grading company, grade, price, currency, image, item ID, listing
  URL, and marketplace. eBay's Browse API only returns active/asking-price
  listings, so nothing here is ever labeled as sold or used as fair-market
  value.
- **Variation listings are excluded**: eBay can fold a listing with a
  condition/grade/edition dropdown into a single search result, with
  `price` set to whichever variation eBay picked — not reliably the price
  a buyer actually sees by default on the listing page (confirmed against
  a real listing, where search returned $437.49 for one variation while
  the page defaulted to a $6.55 one). Any item with `itemGroupHref` or
  `itemGroupType` set (`isVariationListing()` in `normalize.js`) is
  dropped from results entirely rather than risk showing a wrong price.
- **Caching**: search results are cached in memory for 60 seconds per
  title+issue+year (shared across all users), so listings stay effectively
  live on every real visit while still guarding against a burst of
  duplicate calls from something like a double page-load. See the "Source
  health & request log" panel at the bottom of the page for a live view of
  cache hits vs. live calls.
- **Errors, rate limits, and outages**: a failed eBay call never falls back
  to scraping. It's logged and surfaced as a status on the "eBay" source
  card (green/yellow/red) with the reason, and the affected book simply
  shows its most recent cached results (or none) until the next successful
  search.

## Cover art

Book cards show whichever listing photo recurs most often across a book's
matching eBay listings (sellers often reuse the same stock cover photo),
falling back to the highest-priced listing's photo when every photo is
unique, then a placeholder if there are no listings yet. There's no
separate cover-art source in this build.

## Want-list storage

- **Local development**: each tester's want list is stored as its own file
  in `server/data/`. No setup needed — this is the default.
- **Hosted**: most hosting platforms' free/cheap tiers use ephemeral
  filesystems, so those files would silently reset on every redeploy or
  restart. Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (a
  free database at [upstash.com](https://upstash.com)) in your host's
  environment variables and want-list storage switches to Upstash
  automatically (`server/store/index.js` picks the backend — nothing else
  in the app knows or cares which one is active). Leave them unset locally.

## Multiple users (beta testers)

Comic Sleuth supports separate, isolated want lists per visitor, identified
by a browser cookie rather than a login:

- **A random visitor** to the bare site URL, with no invite link, is
  automatically given their own brand-new, empty want list on first visit
  (`server/testerMiddleware.js`) — never the owner's real data.
- **An invite link** — `https://yourdomain.com/t/<token>` — sets a specific,
  pre-chosen token instead of a random one (`GET /t/:token` in
  `server/index.js`). Generate a token for each beta tester with:
  ```
  node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))"
  ```
  and send that person their own `/t/<token>` link. There's no
  pre-registration step — the first visit to a valid-looking token just
  starts that token's list empty, same as an anonymous visitor, except now
  it's a link you know you handed to a specific person.
- **The owner's own list** — the original single-user data this app had
  before multi-tenancy — is reachable the same way, via a token you put in
  `OWNER_TESTER_TOKEN` (see `.env.example`). The first visit to
  `/t/<OWNER_TESTER_TOKEN>` migrates that original data onto the token
  one time (`server/store/index.js`); after that it behaves like any other
  tester's list. Without `OWNER_TESTER_TOKEN` set, that original data just
  sits unused — nobody can reach it, including the owner, until it's set.
- Each visitor's identity persists for a year via an `HttpOnly` cookie —
  they don't need to revisit their `/t/<token>` link on later visits.
- eBay search results stay cached and shared globally across everyone
  (the same "Amazing Spider-Man #1 1963" search returns the same eBay
  listings no matter who's asking) — only the want list itself is
  per-tester. The "Source health & request log" debug panel is also
  shared/global across all visitors, not per-tester.

## Not yet implemented

MyComicShop, Reece's Rare Comics, Superworld Comics, and Dale Roberts Comics
are shown in the "Sources monitored" panel for context but have no live
connector in this build — only eBay is currently wired up.
