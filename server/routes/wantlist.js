const express = require('express');
const ebay = require('../connectors/ebay');
const { TTLCache } = require('../cache');
const { mapWithConcurrency } = require('../concurrency');
const requestLog = require('../requestLog');
const state = require('../state');

const router = express.Router();

const SEARCH_CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
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

async function buildState({ refreshBookId = null } = {}) {
  const wantList = state.readWantList();

  const listingsByBook = await mapWithConcurrency(wantList, SEARCH_CONCURRENCY, (book) =>
    getListingsForBook(book, { forceFresh: book.id === refreshBookId })
  );
  const listings = listingsByBook.flat();

  return {
    wantList: wantList.map((b) => ({ ...b, searchPending: false })),
    listings,
    sources: state.buildSources(ebay.currentEnvironment()),
    lastRun: new Date().toISOString().slice(0, 10),
    bookCap: state.BOOK_CAP,
    requestLog: requestLog.getRecent(25),
  };
}

router.get('/state', async (req, res, next) => {
  try {
    res.json(await buildState());
  } catch (err) {
    next(err);
  }
});

router.post('/wantlist', async (req, res, next) => {
  try {
    const { title, issue, publisher, year } = req.body || {};
    const cleanTitle = String(title || '').trim();
    const cleanIssue = String(issue || '').trim();

    if (!cleanTitle || !cleanIssue) {
      return res.status(400).json({ error: 'title and issue are required.' });
    }

    const wantList = state.readWantList();
    if (wantList.length >= state.BOOK_CAP) {
      return res.status(400).json({
        error: `Watch list is at its ${state.BOOK_CAP}-book cap — remove one before adding another.`,
      });
    }

    const newBook = {
      id: slugify(cleanTitle) + cleanIssue + '-' + Date.now().toString(36).slice(-4),
      title: cleanTitle,
      issue: cleanIssue,
      publisher: String(publisher || '').trim() || '—',
      year: String(year || '').trim() || '—',
      addedDate: new Date().toISOString().slice(0, 10),
    };

    wantList.push(newBook);
    state.writeWantList(wantList);

    res.status(201).json(await buildState({ refreshBookId: newBook.id }));
  } catch (err) {
    next(err);
  }
});

router.delete('/wantlist/:id', async (req, res, next) => {
  try {
    const wantList = state.readWantList();
    const next_ = wantList.filter((b) => b.id !== req.params.id);
    state.writeWantList(next_);
    res.json(await buildState());
  } catch (err) {
    next(err);
  }
});

module.exports = router;
