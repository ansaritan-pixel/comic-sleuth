// Defensively cleans an environment variable value: trims whitespace and
// strips a matching pair of wrapping quotes. Hosting dashboards and
// provider docs often show credentials as ready-to-paste .env lines
// (KEY="value"), so pasting the whole line's value into a dashboard field
// commonly carries the literal quote marks along as part of the value —
// which then breaks anything expecting a bare URL/ID/secret.
function cleanEnvValue(v) {
  const trimmed = String(v || '').trim();
  const unquoted = trimmed.match(/^(['"])(.*)\1$/);
  return unquoted ? unquoted[2] : trimmed;
}

// Constant-time string comparison for secret tokens, so comparing a
// visitor's cookie against OWNER_TESTER_TOKEN can't leak information via
// response-timing differences the way a plain === would.
const crypto = require('crypto');

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a ?? ''));
  const bufB = Buffer.from(String(b ?? ''));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

module.exports = { cleanEnvValue, safeEqual };
