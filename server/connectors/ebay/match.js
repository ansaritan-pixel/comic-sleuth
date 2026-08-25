// Post-filters eBay Browse API results against the want-list book. eBay's
// `q` search is relevance/keyword-based, not exact-title matching, so a
// query for "Amazing Spider-Man #1" can surface something like "Amazing
// Fantasy #15 (1st App. Spider-Man!)" purely on overlapping words — this
// re-checks that the listing title actually contains the series title and
// issue number before it's treated as a real match.

function normalizeForMatch(s) {
  return String(s == null ? '' : s)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function titleMatches(itemTitle, bookTitle) {
  const normItem = normalizeForMatch(itemTitle);
  const normBook = normalizeForMatch(bookTitle);
  return !!normBook && normItem.includes(normBook);
}

function issueNumberMatches(itemTitle, issue) {
  const digits = String(issue || '').trim().replace(/[^0-9]/g, '');
  if (!digits) return true; // non-numeric issue label (e.g. "Annual") — don't over-filter
  const re = new RegExp(`(?<![0-9])${digits}(?![0-9])`);
  return re.test(itemTitle || '');
}

// Requires the exact publication year in the listing title when one was
// entered for the book — this is what actually separates the original
// printing from same-title/same-issue-number relaunches, later volumes,
// and facsimile reprints, none of which issue number or title alone can
// tell apart (e.g. Amazing Spider-Man has had multiple #1s across
// different volumes/relaunches).
function yearMatches(itemTitle, year) {
  const y = String(year || '').trim();
  if (!/^\d{4}$/.test(y)) return true; // no real year entered — nothing to check
  const re = new RegExp(`(?<![0-9])${y}(?![0-9])`);
  return re.test(itemTitle || '');
}

function isPlausibleMatch(item, book) {
  return (
    titleMatches(item.title, book.title) &&
    issueNumberMatches(item.title, book.issue) &&
    yearMatches(item.title, book.year)
  );
}

module.exports = { isPlausibleMatch, titleMatches, issueNumberMatches, yearMatches };
