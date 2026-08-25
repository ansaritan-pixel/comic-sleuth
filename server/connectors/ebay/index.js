// Public entry point for the eBay connector — this is the only file other
// parts of the app should import from. Adding another marketplace later
// means adding a sibling connectors/<marketplace>/index.js with the same
// searchForBook(book) contract; nothing here needs to change.

const { searchItemSummaries, EbayApiError } = require('./client');
const { normalizeEbayItem } = require('./normalize');
const { loadConfig } = require('./config');

function buildQuery(book) {
  const parts = [book.title, `#${book.issue}`, 'comic'].filter(Boolean);
  return parts.join(' ');
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
