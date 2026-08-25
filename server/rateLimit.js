// A minimal per-IP fixed-window rate limiter for write endpoints. The goal
// is narrow: stop a script from cheaply spamming POST/DELETE — each of
// which can trigger a real eBay API call and a storage write — not to
// precisely throttle normal human use, which never gets close to these
// limits. Hand-rolled rather than a dependency since the need is this
// small and well-defined.

function createRateLimiter({ windowMs, max }) {
  const hits = new Map(); // ip -> { count, resetAt }

  // Periodic sweep so IPs that never come back don't accumulate forever.
  const sweepInterval = setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of hits) {
      if (now > entry.resetAt) hits.delete(ip);
    }
  }, windowMs);
  sweepInterval.unref?.();

  return function rateLimit(req, res, next) {
    const ip = req.ip || 'unknown';
    const now = Date.now();
    const entry = hits.get(ip);

    if (!entry || now > entry.resetAt) {
      hits.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (entry.count >= max) {
      res.setHeader('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)));
      return res.status(429).json({ error: 'Too many requests — please slow down and try again shortly.' });
    }

    entry.count += 1;
    next();
  };
}

module.exports = { createRateLimiter };
