// Picks the active want-list storage backend: Upstash when configured
// (survives redeploys — the right choice once actually hosted), the local
// file otherwise (zero setup for local development).

const fileStore = require('./fileStore');
const upstashStore = require('./upstashStore');

function activeStore() {
  return upstashStore.isConfigured() ? upstashStore : fileStore;
}

function backendName() {
  return upstashStore.isConfigured() ? 'upstash' : 'file';
}

function readWantList(getDefaultWantList) {
  return activeStore().readWantList(getDefaultWantList);
}

function writeWantList(wantList) {
  return activeStore().writeWantList(wantList);
}

module.exports = { readWantList, writeWantList, backendName };
