// Isolated eBay configuration. Switching from sandbox to production later is
// a matter of setting EBAY_ENV=production and filling in the production
// credential vars — nothing in auth.js, client.js, or normalize.js changes.

const ENVIRONMENTS = {
  sandbox: {
    tokenUrl: 'https://api.sandbox.ebay.com/identity/v1/oauth2/token',
    apiBase: 'https://api.sandbox.ebay.com',
    clientIdVar: 'EBAY_SANDBOX_CLIENT_ID',
    clientSecretVar: 'EBAY_SANDBOX_CLIENT_SECRET',
  },
  production: {
    tokenUrl: 'https://api.ebay.com/identity/v1/oauth2/token',
    apiBase: 'https://api.ebay.com',
    clientIdVar: 'EBAY_PRODUCTION_CLIENT_ID',
    clientSecretVar: 'EBAY_PRODUCTION_CLIENT_SECRET',
  },
};

function loadConfig(env = process.env) {
  const name = (env.EBAY_ENV || 'sandbox').trim().toLowerCase();
  const target = ENVIRONMENTS[name];

  if (!target) {
    throw new Error(
      `Invalid EBAY_ENV "${name}" — must be "sandbox" or "production".`
    );
  }

  return {
    env: name,
    tokenUrl: target.tokenUrl,
    apiBase: target.apiBase,
    clientId: env[target.clientIdVar] || '',
    clientSecret: env[target.clientSecretVar] || '',
    clientIdVar: target.clientIdVar,
    clientSecretVar: target.clientSecretVar,
    scope: 'https://api.ebay.com/oauth/api_scope',
    marketplaceId: env.EBAY_MARKETPLACE_ID || 'EBAY_US',
  };
}

module.exports = { loadConfig, ENVIRONMENTS };
