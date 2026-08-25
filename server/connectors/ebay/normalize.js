// Maps a raw eBay item_summary object onto Comic Sleuth's listing shape.
// eBay's Browse API only ever returns active/asking-price listings — these
// are never treated as sold or as fair-market-value evidence anywhere here.

const GRADING_COMPANIES = ['CGC', 'CBCS', 'PGX'];

// Only ever render http(s) links/images from eBay's response — a
// defense-in-depth guard against a malformed or unexpected value (e.g.
// javascript:) ever becoming a clickable href or img src, regardless of
// how trustworthy the source API is expected to be.
function httpUrlOrNull(u) {
  return typeof u === 'string' && /^https?:\/\//i.test(u) ? u : null;
}

// eBay's Browse API can fold a whole "variation group" listing — a
// dropdown of different conditions/grades/editions each with its own
// price — into a single item_summary result, with `price` set to
// whichever variation eBay picked as the representative one. That's not
// reliably the price a buyer actually sees by default on the listing page
// (confirmed against a real listing: search returned $437.49 for one
// variation while the page defaulted to a $6.55 one). There's no way to
// resolve the "right" price from the search summary alone without an
// extra per-item API call, so these are excluded entirely rather than
// risk showing a wrong asking price.
function isVariationListing(item) {
  return !!(item.itemGroupHref || item.itemGroupType);
}

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
  const image = httpUrlOrNull(
    (item.image && item.image.imageUrl) ||
      (item.thumbnailImages && item.thumbnailImages[0] && item.thumbnailImages[0].imageUrl)
  );

  return {
    wantId,
    source: 'eBay',
    marketplace: 'ebay',
    comicTitle,
    issue,
    listingTitle: item.title || null,
    itemId: item.itemId || null,
    url: httpUrlOrNull(item.itemWebUrl || item.itemHref),
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

module.exports = { normalizeEbayItem, parseGrading, isVariationListing };
