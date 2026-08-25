// In-memory log of recent marketplace search requests, feeding the
// "Source health & request log" admin panel in the UI. Metadata only —
// never stores page content from a marketplace, only what was searched
// and what happened.

const MAX_ENTRIES = 200;
const log = [];

function addEntry({ domain, comic, result, httpStatus = null, cacheHit = false }) {
  log.push({
    ts: new Date().toISOString().replace('T', ' ').slice(0, 16),
    domain,
    purpose: 'search',
    comic,
    result,
    httpStatus,
    cacheHit,
  });
  if (log.length > MAX_ENTRIES) log.shift();
}

function getRecent(n = 25) {
  return log.slice(-n);
}

module.exports = { addEntry, getRecent };
