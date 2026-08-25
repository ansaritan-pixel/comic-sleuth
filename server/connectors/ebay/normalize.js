// Maps a raw eBay item_summary object onto Comic Sleuth's listing shape.
// eBay's Browse API only ever returns active/asking-price listings — these
// are never treated as sold or as fair-market-value evidence anywhere here.

const GRADING_COMPANIES = ['CGC', 'CBCS', 'PGX'];

function parseGrading(title) {
  if (!title) return { gradingCompany: null, grade: null };
  const upper = title.toUpperCase();
  for (const company of GRADING_COMPANIES) {
    const match = upper.match(new RegExp(company + '\\s*(\\d{1,2}(?:\\.\\d)?)'));
    if (match) return { gradingCompany: company, grade: match[1] };
  }
  if (/\braw\b/i.test(title)) return { gradingCompany: null, grade: 'Raw' };
  return { gradingCompany: null, grade: null };
}

function normalizeEbayItem(item, { wantId, comicTitle, issue, foundDate }) {
  const { gradingCompany, grade } = parseGrading(item.title);
  const price = item.price && item.price.value != null ? Number(item.price.value) : null;
  const currency = (item.price && item.price.currency) || null;
  const image =
    (item.image && item.image.imageUrl) ||
    (item.thumbnailImages && item.thumbnailImages[0] && item.thumbnailImages[0].imageUrl) ||
    null;

  return {
    wantId,
    source: 'eBay',
    marketplace: 'ebay',
    comicTitle,
    issue,
    listingTitle: item.title || null,
    itemId: item.itemId || null,
    url: item.itemWebUrl || item.itemHref || null,
    price,
    currency,
    gradingCompany,
    grade: gradingCompany ? `${gradingCompany} ${grade}` : grade,
    image,
    foundDate,
    sold: false, // asking price only — never a completed sale
    facsimile: /\b(reprint|facsimile)\b/i.test(item.title || ''),
    note: item.title || '',
  };
}

module.exports = { normalizeEbayItem, parseGrading };
