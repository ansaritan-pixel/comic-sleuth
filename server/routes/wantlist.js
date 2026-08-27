const express = require('express');
const ebay = require('../connectors/ebay');
const { TTLCache } = require('../cache');
const { mapWithConcurrency } = require('../concurrency');
const requestLog = require('../requestLog');
const state = require('../state');
const store = require('../store');
const { OWNER_TOKEN } = require('../ownerToken');
const { safeEqual } = require('../envUtil');
const { createRateLimiter } = require('../rateLimit');

const router = express.Router();

const MAX_TITLE_LENGTH = 200;
const MAX_PUBLISHER_LENGTH = 200;
const MAX_ISSUE_LENGTH = 20;
const MAX_YEAR_LENGTH = 20;

// Applies only to the write endpoints (add/remove) — each one can trigger
// a real, uncached eBay API call and a storage write, so this is what
// actually needs protecting from a scripted spam burst. Generous enough
// that no real person adding/removing books by hand would ever notice it.
const writeLimiter = createRateLimiter({ windowMs: 5 * 60 * 1000, max: 30 });

// Short on purpose: the goal is "fresh enough to actually go buy," not a
// bandwidth-saving cache. 60s is a nominal safety margin against a burst of
// duplicate calls with zero benefit (an accidental double-load, a stray
// auto-refreshing tab) rather than a real staleness tolerance — in normal
// use nobody reloads faster than that, so this is effectively "live on
// every visit" without leaving the app defenseless against a reload storm.
const SEARCH_CACHE_TTL_MS = 60 * 1000;
const searchCache = new TTLCache(SEARCH_CACHE_TTL_MS);

// Caps how many eBay searches run at once when refreshing the whole want
// list, so a large list doesn't fire a burst of simultaneous calls that
// trips eBay's per-second rate limiting.
const SEARCH_CONCURRENCY = 8;

function cacheKey(book) {
  return [book.title, book.issue, book.year]
    .map((v) => String(v || '').trim().toLowerCase())
    .join('|');
}

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 24);
}

// Looks up eBay listings for one book, using the cache unless forceFresh is set.
// Never falls back to scraping — a failed API call just yields an empty
// result for that book, surfaced via requestLog/source status instead.
async function getListingsForBook(book, { forceFresh = false } = {}) {
  const key = cacheKey(book);
  const comicLabel = `${book.title} #${book.issue}`;

  if (!forceFresh) {
    const cached = searchCache.get(key);
    if (cached) {
      requestLog.addEntry({
        domain: 'eBay',
        comic: comicLabel,
        result: cached.length ? 'found' : 'empty',
        cacheHit: true,
      });
      return cached;
    }
  }

  try {
    const listings = await ebay.searchForBook(book);
    searchCache.set(key, listings);
    state.recordEbaySuccess();
    requestLog.addEntry({
      domain: 'eBay',
      comic: comicLabel,
      result: listings.length ? 'found' : 'empty',
      cacheHit: false,
    });
    return listings;
  } catch (err) {
    const rateLimited = err.code === 'EBAY_RATE_LIMITED';
    state.recordEbayFailure(err.message, { rateLimited });
    requestLog.addEntry({
      domain: 'eBay',
      comic: comicLabel,
      result: rateLimited ? 'rate_limited' : 'error',
      httpStatus: err.status || null,
      cacheHit: false,
    });
    // Return whatever's still in cache (even if just-expired) rather than
    // nothing, so a transient API hiccup doesn't blank out prior results.
    return searchCache.get(key) || [];
  }
}

async function buildState({ testerId, refreshBookId = null }) {
  const wantList = await store.readWantList(testerId);
  const isOwner = !!OWNER_TOKEN && safeEqual(testerId, OWNER_TOKEN);

  const listingsByBook = await mapWithConcurrency(wantList, SEARCH_CONCURRENCY, (book) =>
    getListingsForBook(book, { forceFresh: book.id === refreshBookId })
  );
  const listings = listingsByBook.flat();

  return {
    wantList: wantList.map((b) => ({ ...b, searchPending: false })),
    listings,
    // Kept for everyone — listing rows use it to color-code each
    // source's status dot regardless of who's viewing.
    sources: state.buildSources(ebay.currentEnvironment()),
    lastRun: new Date().toISOString().slice(0, 10),
    bookCap: state.BOOK_CAP,
    isOwner,
    // The debug request log is operational detail — only sent to the
    // owner's own link, not to beta testers or anonymous visitors.
    requestLog: isOwner ? requestLog.getRecent(25) : undefined,
    // Same restriction — how many people have checked the site out at all
    // is the owner's business, not something a beta tester's own link or
    // the bare site should ever reveal.
    uniqueVisitors: isOwner ? await store.countVisitors() : undefined,
  };
}

router.get('/state', async (req, res, next) => {
  try {
    await store.recordVisit(req.testerId);
    res.json(await buildState({ testerId: req.testerId }));
  } catch (err) {
    next(err);
  }
});

router.post('/wantlist', writeLimiter, async (req, res, next) => {
  try {
    const { title, issue, publisher, year } = req.body || {};
    const cleanTitle = String(title || '').trim();
    const cleanIssue = String(issue || '').trim();
    const cleanPublisher = String(publisher || '').trim();
    const cleanYear = String(year || '').trim();

    if (!cleanTitle || !cleanIssue) {
      return res.status(400).json({ error: 'title and issue are required.' });
    }
    if (
      cleanTitle.length > MAX_TITLE_LENGTH ||
      cleanIssue.length > MAX_ISSUE_LENGTH ||
      cleanPublisher.length > MAX_PUBLISHER_LENGTH ||
      cleanYear.length > MAX_YEAR_LENGTH
    ) {
      return res.status(400).json({ error: 'One or more fields are too long.' });
    }

    const wantList = await store.readWantList(req.testerId);
    if (wantList.length >= state.BOOK_CAP) {
      return res.status(400).json({
        error: `Watch list is at its ${state.BOOK_CAP}-book cap — remove one before adding another.`,
      });
    }

    const newBook = {
      id: slugify(cleanTitle) + slugify(cleanIssue) + '-' + Date.now().toString(36).slice(-4),
      title: cleanTitle,
      issue: cleanIssue,
      publisher: cleanPublisher || '—',
      year: cleanYear || '—',
      addedDate: new Date().toISOString().slice(0, 10),
    };

    wantList.push(newBook);
    await store.writeWantList(req.testerId, wantList);

    const newState = await buildState({ testerId: req.testerId, refreshBookId: newBook.id });
    res.status(201).json(Object.assign(newState, { addedBookId: newBook.id }));
  } catch (err) {
    next(err);
  }
});

router.delete('/wantlist/:id', writeLimiter, async (req, res, next) => {
  try {
    const wantList = await store.readWantList(req.testerId);
    const remaining = wantList.filter((b) => b.id !== req.params.id);
    await store.writeWantList(req.testerId, remaining);
    res.json(await buildState({ testerId: req.testerId }));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
