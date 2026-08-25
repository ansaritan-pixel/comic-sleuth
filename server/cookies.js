// Minimal hand-rolled cookie handling for tester identity — no new
// dependency needed for reading/setting a single cookie.

const crypto = require('crypto');

const TESTER_COOKIE = 'cs_tester';
const TOKEN_RE = /^[A-Za-z0-9_-]{10,64}$/;
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function generateToken() {
  return crypto.randomBytes(18).toString('base64url');
}

function isValidToken(token) {
  return typeof token === 'string' && TOKEN_RE.test(token);
}

function parseCookies(req) {
  const header = req.headers.cookie;
  const out = {};
  if (!header) return out;
  header.split(';').forEach((pair) => {
    const idx = pair.indexOf('=');
    if (idx === -1) return;
    const key = pair.slice(0, idx).trim();
    const val = pair.slice(idx + 1).trim();
    if (key) out[key] = decodeURIComponent(val);
  });
  return out;
}

function setTesterCookie(res, token, { secure = false } = {}) {
  const attrs = [
    `${TESTER_COOKIE}=${encodeURIComponent(token)}`,
    'Path=/',
    `Max-Age=${ONE_YEAR_SECONDS}`,
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (secure) attrs.push('Secure');
  res.setHeader('Set-Cookie', attrs.join('; '));
}

module.exports = { TESTER_COOKIE, generateToken, isValidToken, parseCookies, setTesterCookie };
