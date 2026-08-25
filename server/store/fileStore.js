// Local-disk want-list storage, one file per tester token. Fine for local
// development, but most hosting platforms' free/cheap tiers use ephemeral
// filesystems — these files reset on every redeploy or restart once
// actually hosted. See upstashStore.js for the persistence-surviving
// alternative.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const LEGACY_FILE = path.join(DATA_DIR, 'wantlist.json');

function fileFor(token) {
  const safe = String(token).replace(/[^A-Za-z0-9_-]/g, '');
  return path.join(DATA_DIR, `wantlist-${safe}.json`);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return undefined;
    throw err;
  }
}

// Returns undefined if nothing has ever been stored for this token yet —
// distinct from an empty array, which means "stored, and empty."
async function read(token) {
  return readJson(fileFor(token));
}

// The single pre-multi-tenant want list this app used before per-tester
// storage existed. Only ever consulted once, to seed the owner's token.
async function readLegacy() {
  return readJson(LEGACY_FILE);
}

async function write(token, wantList) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(fileFor(token), JSON.stringify(wantList, null, 2));
}

module.exports = { isConfigured: () => true, read, readLegacy, write };
