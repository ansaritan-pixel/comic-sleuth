// Public entry point for the eBay connector — this is the only file other
// parts of the app should import from. Adding another marketplace later
// means adding a sibling connectors/<marketplace>/index.js with the same
// searchForBook(book) contract; nothing here needs to change.

const { searchItemSummaries, EbayApiError } = require('./client');
const { normalizeEbayItem, isVariationListing } = require('./normalize');
const { isPlausibleMatch } = require('./match');
const { loadConfig } = require('./config');

function buildQuery(book) {
  const parts = [book.title, `#${book.issue}`];
  // Include the publication year when it's a real 4-digit year (the
  // want-list form stores "—" as a placeholder when it's left blank), so
  // the search is disambiguated from same-title/same-issue reprints and
  // different volumes rather than only relying on eBay's default ranking.
  const year = String(book.year || '').trim();
  if (/^\d{4}$/.test(year)) parts.push(year);
  parts.push('comic');
  return parts.filter(Boolean).join(' ');
}

// eBay's own "best match" ranking returns a different top pool of raw
// results depending on the exact query text — a query without a year
// (e.g. tracking "X-Men #5" and "X-Men #5 1963" as separate books) can
// get crowded out of a small top-N by unrelated volumes/relaunches
// sharing the same title and issue number. A larger pool before our own
// title/issue/year filtering runs gives genuine matches a better chance
// of surviving even when the query itself is less specific.
const SEARCH_RESULT_LIMIT = 50;

async function searchForBook(book) {
  const foundDate = new Date().toISOString().slice(0, 10);
  const items = await searchItemSummaries(buildQuery(book), { limit: SEARCH_RESULT_LIMIT });
  const plausible = items.filter((item) => isPlausibleMatch(item, book) && !isVariationListing(item));
  return plausible.map((item) =>
    normalizeEbayItem(item, {
      wantId: book.id,
      comicTitle: book.title,
      issue: book.issue,
      foundDate,
    })
  );
}

function currentEnvironment() {
  return loadConfig().env;
}

module.exports = { searchForBook, currentEnvironment, EbayApiError };
