// Ensures every request has a tester identity. A visitor with no cookie
// yet (first visit to the bare URL, not via a /t/:token invite link) gets
// a brand-new random identity with its own empty want list — never the
// site owner's real data. Visiting /t/:token (server/index.js) sets a
// specific pre-minted token instead, for named beta testers or the owner.

const { TESTER_COOKIE, generateToken, isValidToken, parseCookies, setTesterCookie } = require('./cookies');

function testerMiddleware(req, res, next) {
  const cookies = parseCookies(req);
  const existing = cookies[TESTER_COOKIE];

  if (isValidToken(existing)) {
    req.testerId = existing;
    return next();
  }

  const token = generateToken();
  setTesterCookie(res, token, { secure: req.secure });
  req.testerId = token;
  next();
}

module.exports = { testerMiddleware };
