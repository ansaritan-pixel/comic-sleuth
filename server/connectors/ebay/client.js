// Low-level eBay Browse API access. No web scraping anywhere in this file —
// if the API call fails, callers get a typed error, never a scraped fallback.

const { loadConfig } = require('./config');
const { getAccessToken } = require('./auth');

class EbayApiError extends Error {
  constructor(message, { status, code, retryable = false } = {}) {
    super(message);
    this.name = 'EbayApiError';
    this.status = status;
    this.code = code;
    this.retryable = retryable;
  }
}

function buildSearchUrl(query, limit, sort) {
  const config = loadConfig();
  const url = new URL(`${config.apiBase}/buy/browse/v1/item_summary/search`);
  url.searchParams.set('q', query);
  url.searchParams.set('limit', String(limit));
  // Explicit rather than relying on eBay's default: both live auctions and
  // fixed-price (Buy It Now) listings should come back, not just one.
  url.searchParams.set('filter', 'buyingOptions:{FIXED_PRICE|AUCTION}');
  // Omitted = eBay's default "best match" relevance ranking. Passing one
  // (e.g. "price") gets a differently-ordered slice of the same
  // underlying inventory — see searchForBook's two-pass merge, which
  // exists because "best match" alone can bury genuine matches for a
  // broad query behind unrelated listings sharing the same keywords.
  if (sort) url.searchParams.set('sort', sort);
  return url.toString();
}

async function searchItemSummaries(query, { limit = 20, sort = null } = {}) {
  const config = loadConfig();
  const url = buildSearchUrl(query, limit, sort);

  const doFetch = async (forceRefresh) => {
    const token = await getAccessToken({ forceRefresh });
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-EBAY-C-MARKETPLACE-ID': config.marketplaceId,
        'Content-Type': 'application/json',
      },
    });
  };

  let res;
  try {
    res = await doFetch(false);
  } catch (networkErr) {
    throw new EbayApiError(`Could not reach the eBay Browse API: ${networkErr.message}`, {
      code: 'EBAY_NETWORK_ERROR',
      retryable: true,
    });
  }

  // Access token expired or was rejected — refresh once and retry.
  if (res.status === 401) {
    try {
      res = await doFetch(true);
    } catch (networkErr) {
      throw new EbayApiError(`Could not reach the eBay Browse API: ${networkErr.message}`, {
        code: 'EBAY_NETWORK_ERROR',
        retryable: true,
      });
    }
  }

  if (res.status === 429) {
    throw new EbayApiError('eBay Browse API rate limit reached — try again shortly.', {
      status: 429,
      code: 'EBAY_RATE_LIMITED',
      retryable: true,
    });
  }

  if (res.status >= 500) {
    throw new EbayApiError(`eBay Browse API is temporarily unavailable (${res.status}).`, {
      status: res.status,
      code: 'EBAY_UNAVAILABLE',
      retryable: true,
    });
  }

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const detail = (body.errors && body.errors[0] && body.errors[0].message) || res.statusText;
    throw new EbayApiError(`eBay Browse API error (${res.status}): ${detail}`, {
      status: res.status,
      code: 'EBAY_REQUEST_FAILED',
      retryable: false,
    });
  }

  return body.itemSummaries || [];
}

module.exports = { searchItemSummaries, EbayApiError };
