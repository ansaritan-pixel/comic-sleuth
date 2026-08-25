// Public entry point for the eBay connector — this is the only file other
// parts of the app should import from. Adding another marketplace later
// means adding a sibling connectors/<marketplace>/index.js with the same
// searchForBook(book) contract; nothing here needs to change.

const { searchItemSummaries, EbayApiError } = require('./client');
const { normalizeEbayItem } = require('./normalize');
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

async function searchForBook(book) {
  const foundDate = new Date().toISOString().slice(0, 10);
  const items = await searchItemSummaries(buildQuery(book), { limit: 20 });
  return items.map((item) =>
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
