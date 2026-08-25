// Public entry point for the Comic Vine connector. Resolves official cover
// art for a want-list book, keyed on the title/issue/publisher/year the
// user entered when adding it. Isolated from the eBay connector — this is
// a cosmetic enhancement, never required for search to work.

const { loadConfig } = require('./config');
const { searchIssues } = require('./client');
const { pickBestIssue } = require('./match');

function isConfigured() {
  return !!loadConfig().apiKey;
}

function buildQuery(book) {
  return `${book.title} ${book.issue}`;
}

// Resolves to an image URL, or null if no confident match was found (a
// conclusive, successful lookup). Throws on transient failures (network,
// rate limit, missing key, etc.) so callers can leave the book to be
// retried on a later attempt instead of permanently giving up.
async function findCoverImage(book) {
  const results = await searchIssues(buildQuery(book));
  const best = pickBestIssue(results, book);
  if (!best || !best.image) return null;
  return best.image.original_url || best.image.medium_url || best.image.small_url || null;
}

module.exports = { findCoverImage, isConfigured };
