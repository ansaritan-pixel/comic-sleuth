// The site owner's personal tester token. Set via OWNER_TESTER_TOKEN so it
// never lives in source (this repo is public) — generate your own with:
//   node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))"
// then set it as an env var (locally and wherever this is hosted) and visit
// /t/<that-token> once to claim your existing want list under it.

const { cleanEnvValue } = require('./envUtil');

const OWNER_TOKEN = cleanEnvValue(process.env.OWNER_TESTER_TOKEN) || null;

module.exports = { OWNER_TOKEN };
