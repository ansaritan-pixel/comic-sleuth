// Local-disk want-list storage. Fine for local development, but most
// hosting platforms' free/cheap tiers use ephemeral filesystems — this
// file resets on every redeploy or restart once actually hosted. See
// upstashStore.js for the persistence-surviving alternative.

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'wantlist.json');

async function readWantList(getDefaultWantList) {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    const seeded = getDefaultWantList();
    await writeWantList(seeded);
    return seeded;
  }
}

async function writeWantList(wantList) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(wantList, null, 2));
}

module.exports = { isConfigured: () => true, readWantList, writeWantList };
