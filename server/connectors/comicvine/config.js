// Isolated Comic Vine configuration, mirroring the eBay connector's shape.
// Comic Vine is used only to fetch cover art for want-list books — it's a
// best-effort visual enhancement, never required for the app to function.

function loadConfig(env = process.env) {
  return {
    apiKey: env.COMICVINE_API_KEY || '',
    apiBase: 'https://comicvine.gamespot.com/api',
    // Comic Vine requires a descriptive User-Agent on requests.
    userAgent: 'ComicSleuth/0.1 (+personal want-list tracker; non-commercial)',
  };
}

module.exports = { loadConfig };
