const { loadConfig } = require('./config');

class ComicVineApiError extends Error {
  constructor(message, { code, retryable = false } = {}) {
    super(message);
    this.name = 'ComicVineApiError';
    this.code = code;
    this.retryable = retryable;
  }
}

async function searchIssues(query) {
  const config = loadConfig();

  if (!config.apiKey) {
    throw new ComicVineApiError('Missing COMICVINE_API_KEY.', {
      code: 'COMICVINE_MISSING_KEY',
      retryable: false,
    });
  }

  const url = new URL(`${config.apiBase}/search/`);
  url.searchParams.set('api_key', config.apiKey);
  url.searchParams.set('format', 'json');
  url.searchParams.set('resources', 'issue');
  url.searchParams.set('query', query);
  url.searchParams.set('field_list', 'name,issue_number,image,volume,cover_date');
  url.searchParams.set('limit', '10');

  let res;
  try {
    res = await fetch(url.toString(), { headers: { 'User-Agent': config.userAgent } });
  } catch (networkErr) {
    throw new ComicVineApiError(`Could not reach Comic Vine: ${networkErr.message}`, {
      code: 'COMICVINE_NETWORK_ERROR',
      retryable: true,
    });
  }

  if (res.status === 420 || res.status === 429) {
    throw new ComicVineApiError('Comic Vine rate limit reached.', {
      code: 'COMICVINE_RATE_LIMITED',
      retryable: true,
    });
  }
  if (res.status >= 500) {
    throw new ComicVineApiError(`Comic Vine is temporarily unavailable (${res.status}).`, {
      code: 'COMICVINE_UNAVAILABLE',
      retryable: true,
    });
  }
  if (!res.ok) {
    throw new ComicVineApiError(`Comic Vine request failed (${res.status}).`, {
      code: 'COMICVINE_REQUEST_FAILED',
      retryable: false,
    });
  }

  const body = await res.json().catch(() => null);

  // Comic Vine signals errors via status_code in the JSON body (1 = OK)
  // even on an HTTP 200 — an invalid key, malformed filter, or a
  // rate-limit surfaced this way all land here. Treated as retryable
  // since we can't distinguish a permanent cause from a transient one.
  if (!body || body.status_code !== 1) {
    throw new ComicVineApiError(
      `Comic Vine API error: ${(body && body.error) || 'unknown'}`,
      { code: 'COMICVINE_API_ERROR', retryable: true }
    );
  }

  return body.results || [];
}

module.exports = { searchIssues, ComicVineApiError };
