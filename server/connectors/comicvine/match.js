// Picks the best-matching issue from a Comic Vine search result set for a
// given want-list book (title, issue, publisher, year as entered by the
// user). Comic Vine's free-text search is loose, so results are re-filtered
// here rather than trusted at face value.

function normalizeText(s) {
  return String(s == null ? '' : s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function issueNumbersMatch(a, b) {
  const na = parseFloat(String(a).replace(/[^\d.]/g, ''));
  const nb = parseFloat(String(b).replace(/[^\d.]/g, ''));
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na === nb;
  return normalizeText(a) === normalizeText(b);
}

function pickBestIssue(results, book) {
  const wantTitle = normalizeText(book.title);
  const wantYear = String(book.year || '').trim();

  const issueMatches = results.filter((r) => issueNumbersMatch(r.issue_number, book.issue));
  if (!issueMatches.length) return null;

  const titleMatches = issueMatches.filter((r) => {
    const volumeName = normalizeText(r.volume && r.volume.name);
    if (!volumeName) return false;
    return volumeName === wantTitle || volumeName.includes(wantTitle) || wantTitle.includes(volumeName);
  });

  const pool = titleMatches.length ? titleMatches : issueMatches;

  if (wantYear) {
    const yearMatch = pool.find((r) => typeof r.cover_date === 'string' && r.cover_date.startsWith(wantYear));
    if (yearMatch) return yearMatch;
  }

  return pool[0];
}

module.exports = { pickBestIssue, normalizeText, issueNumbersMatch };
