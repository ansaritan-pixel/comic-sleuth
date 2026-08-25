// OAuth client-credentials flow against eBay's token endpoint.
// The Client Secret and access token never leave this server process.

const { loadConfig } = require('./config');

const REFRESH_SKEW_MS = 5 * 60 * 1000; // refresh 5 minutes before actual expiry

let cachedToken = null; // { accessToken, expiresAt }
let pendingFetch = null; // in-flight token request, so concurrent callers share one fetch

async function requestToken() {
  const config = loadConfig();

  if (!config.clientId || !config.clientSecret) {
    const err = new Error(
      `Missing eBay ${config.env} credentials. Set ${config.clientIdVar} and ` +
        `${config.clientSecretVar} in your .env file.`
    );
    err.code = 'EBAY_MISSING_CREDENTIALS';
    throw err;
  }

  const basicAuth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');

  let res;
  try {
    res = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        scope: config.scope,
      }),
    });
  } catch (networkErr) {
    const err = new Error(`Could not reach eBay's OAuth endpoint: ${networkErr.message}`);
    err.code = 'EBAY_NETWORK_ERROR';
    throw err;
  }

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const detail = body.error_description || body.error || res.statusText;
    const err = new Error(`eBay OAuth token request failed (${res.status}): ${detail}`);
    err.code = 'EBAY_OAUTH_FAILED';
    err.status = res.status;
    throw err;
  }

  return {
    accessToken: body.access_token,
    expiresAt: Date.now() + (body.expires_in || 0) * 1000 - REFRESH_SKEW_MS,
  };
}

async function getAccessToken({ forceRefresh = false } = {}) {
  if (!forceRefresh && cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.accessToken;
  }

  if (!pendingFetch) {
    pendingFetch = requestToken()
      .then((token) => {
        cachedToken = token;
        return token;
      })
      .finally(() => {
        pendingFetch = null;
      });
  }

  const token = await pendingFetch;
  return token.accessToken;
}

// Exposed for tests / admin diagnostics only — never logged or sent to the client.
function _resetForTests() {
  cachedToken = null;
  pendingFetch = null;
}

module.exports = { getAccessToken, _resetForTests };
