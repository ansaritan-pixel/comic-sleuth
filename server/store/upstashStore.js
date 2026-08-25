// Persists each tester's want list as its own JSON blob in Upstash's Redis
// REST API — survives redeploys/restarts, unlike the local-file store.
// Opt-in: only used when both env vars below are set.

const { cleanEnvValue } = require('../envUtil');

function loadConfig(env = process.env) {
  return {
    url: cleanEnvValue(env.UPSTASH_REDIS_REST_URL),
    token: cleanEnvValue(env.UPSTASH_REDIS_REST_TOKEN),
  };
}

function isConfigured() {
  const config = loadConfig();
  return !!(config.url && config.token);
}

async function command(args) {
  const config = loadConfig();

  let res;
  try {
    res = await fetch(config.url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(args),
    });
  } catch (networkErr) {
    throw new Error(`Could not reach Upstash: ${networkErr.message}`);
  }

  const body = await res.json().catch(() => null);
  if (!res.ok || !body || body.error) {
    throw new Error(`Upstash request failed: ${(body && body.error) || res.statusText}`);
  }
  return body.result;
}

function keyFor(token) {
  return `comic-sleuth:wantlist:${token}`;
}

// The single pre-multi-tenant key this app used before per-tester storage
// existed. Only ever consulted once, to seed the owner's token.
const LEGACY_KEY = 'comic-sleuth:wantlist';

// Returns undefined if nothing has ever been stored for this token yet —
// distinct from an empty array, which means "stored, and empty."
async function read(token) {
  const raw = await command(['GET', keyFor(token)]);
  return raw === null || raw === undefined ? undefined : JSON.parse(raw);
}

async function readLegacy() {
  const raw = await command(['GET', LEGACY_KEY]);
  return raw === null || raw === undefined ? undefined : JSON.parse(raw);
}

async function write(token, wantList) {
  await command(['SET', keyFor(token), JSON.stringify(wantList)]);
}

module.exports = { isConfigured, read, readLegacy, write };
