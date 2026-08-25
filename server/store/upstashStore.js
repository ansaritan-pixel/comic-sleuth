// Persists the want list as a single JSON blob in Upstash's Redis REST API
// — survives redeploys/restarts, unlike the local-file store. Opt-in: only
// used when both env vars below are set.

const REDIS_KEY = 'comic-sleuth:wantlist';

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

async function readWantList(getDefaultWantList) {
  const raw = await command(['GET', REDIS_KEY]);
  if (raw === null || raw === undefined) {
    const seeded = getDefaultWantList();
    await writeWantList(seeded);
    return seeded;
  }
  return JSON.parse(raw);
}

async function writeWantList(wantList) {
  await command(['SET', REDIS_KEY, JSON.stringify(wantList)]);
}

module.exports = { isConfigured, readWantList, writeWantList };
