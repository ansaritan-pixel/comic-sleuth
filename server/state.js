// Domain defaults (the seeded want list, the book cap) plus the in-memory
// "sources" health panel shown in the UI. Want-list persistence itself
// lives in server/store/ — this module doesn't touch disk or a database.
// Only the eBay entry reflects a real, currently-implemented connector;
// the rest are labeled accordingly rather than showing invented activity
// for connectors that don't exist yet.

const BOOK_CAP = 100;

const NOT_YET_IMPLEMENTED_SOURCES = [
  'MyComicShop',
  "Reece's Rare Comics",
  'Superworld Comics',
  'Dale Roberts Comics',
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function defaultWantList() {
  return [
    { id: 'asm7', title: 'Amazing Spider-Man', issue: '7', publisher: 'Marvel', year: '1963', addedDate: today(), searchPending: true },
    { id: 'hulk181', title: 'Incredible Hulk', issue: '181', publisher: 'Marvel', year: '1974', addedDate: today(), searchPending: true },
    { id: 'batman1', title: 'Batman', issue: '1', publisher: 'DC', year: '1940', addedDate: today(), searchPending: true },
  ];
}

// --- eBay source health, tracked in memory for the life of the process ---

const ebayHealth = {
  status: 'green',
  checkStatus: 'checked',
  checkDate: null,
  requestsToday: 0,
  requestsTodayDate: null,
  consecutiveFailedRuns: 0,
  lastFailureReason: null,
};

function recordEbaySuccess() {
  const day = today();
  ebayHealth.status = 'green';
  ebayHealth.checkStatus = 'checked';
  ebayHealth.checkDate = day;
  ebayHealth.requestsToday = ebayHealth.requestsTodayDate === day ? ebayHealth.requestsToday + 1 : 1;
  ebayHealth.requestsTodayDate = day;
  ebayHealth.consecutiveFailedRuns = 0;
  ebayHealth.lastFailureReason = null;
}

function recordEbayFailure(reason, { rateLimited = false } = {}) {
  const day = today();
  ebayHealth.status = rateLimited ? 'yellow' : 'red';
  ebayHealth.checkStatus = rateLimited ? 'limited' : 'unavailable';
  ebayHealth.checkDate = day;
  ebayHealth.requestsToday = ebayHealth.requestsTodayDate === day ? ebayHealth.requestsToday + 1 : 1;
  ebayHealth.requestsTodayDate = day;
  ebayHealth.consecutiveFailedRuns += 1;
  ebayHealth.lastFailureReason = reason;
}

function buildSources(ebayEnv) {
  const envLabel = ebayEnv === 'production' ? 'Production' : 'Sandbox';
  const ebaySource = {
    name: 'eBay',
    status: ebayHealth.status,
    methodLabel: `Automated — official Browse API (${envLabel})`,
    reason:
      ebayHealth.lastFailureReason ||
      'OAuth client-credentials flow against eBay’s Browse API. Asking prices only — never treated as completed sales.',
    checkStatus: ebayHealth.checkStatus,
    checkDate: ebayHealth.checkDate,
    requestsToday: ebayHealth.requestsToday,
    requestsTodayDate: ebayHealth.requestsTodayDate,
    consecutiveFailedRuns: ebayHealth.consecutiveFailedRuns,
    lastFailureReason: ebayHealth.lastFailureReason,
  };

  const placeholders = NOT_YET_IMPLEMENTED_SOURCES.map((name) => ({
    name,
    status: 'yellow',
    methodLabel: 'Not yet implemented in this build',
    reason: 'This connector has not been built yet — no requests are made to this source.',
    checkStatus: 'unavailable',
    checkDate: null,
    requestsToday: 0,
    requestsTodayDate: null,
    consecutiveFailedRuns: 0,
    lastFailureReason: null,
  }));

  return [ebaySource, ...placeholders];
}

module.exports = {
  BOOK_CAP,
  defaultWantList,
  recordEbaySuccess,
  recordEbayFailure,
  buildSources,
};
