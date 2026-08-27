// Picks the active want-list storage backend: Upstash when configured
// (survives redeploys — the right choice once actually hosted), the local
// file otherwise (zero setup for local development). Also owns what a
// brand-new token starts with: the owner's token gets seeded once from
// this app's pre-multi-tenant data (or the 3 sample books, for a fresh
// install with no prior data); every other token — a named beta tester or
// an auto-provisioned anonymous visitor — starts completely empty.

const fileStore = require('./fileStore');
const upstashStore = require('./upstashStore');
const { OWNER_TOKEN } = require('../ownerToken');
const state = require('../state');

function activeStore() {
  return upstashStore.isConfigured() ? upstashStore : fileStore;
}

function backendName() {
  return upstashStore.isConfigured() ? 'upstash' : 'file';
}

async function readWantList(token) {
  const backend = activeStore();
  const existing = await backend.read(token);
  if (existing !== undefined) return existing;

  if (OWNER_TOKEN && token === OWNER_TOKEN) {
    const legacy = await backend.readLegacy();
    const seeded = legacy !== undefined ? legacy : state.defaultWantList();
    await backend.write(token, seeded);
    return seeded;
  }

  return [];
}

function writeWantList(token, wantList) {
  return activeStore().write(token, wantList);
}

// Owner-only visibility (see routes/wantlist.js) into how many distinct
// tester tokens have ever hit the site — a much more meaningful "unique
// visitors" signal than IP address, since every browser already gets its
// own token via testerMiddleware regardless of shared/rotating IPs.
function recordVisit(token) {
  return activeStore().recordVisit(token);
}

function countVisitors() {
  return activeStore().countVisitors();
}

module.exports = { readWantList, writeWantList, backendName, recordVisit, countVisitors };
