var LOGO_DATA_URI = 'data:image/png;base64,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';

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

var CURRENCY_SYMBOLS = { USD: '$', CAD: 'CA$', GBP: '£', EUR: '€' };

function fmtPrice(p, currency) {
  if (p === null || p === undefined) return '<span class="price tbd">TBD</span>';
  var sym = CURRENCY_SYMBOLS[currency] || '$';
  return '<span class="price">' + sym + Number(p).toLocaleString('en-US', { minimumFractionDigits: 0 }) + '</span>';
}

function fmtDate(d) {
  if (!d) return '';
  var parts = d.split('-');
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[parseInt(parts[1], 10) - 1] + ' ' + parseInt(parts[2], 10);
}

function comicAge(year) {
  var y = parseInt(year, 10);
  if (isNaN(y)) return null;
  if (y <= 1955) return { key: 'golden', label: 'Golden Age' };
  if (y <= 1969) return { key: 'silver', label: 'Silver Age' };
  if (y <= 1984) return { key: 'bronze', label: 'Bronze Age' };
  if (y <= 1991) return { key: 'copper', label: 'Copper Age' };
  return { key: 'modern', label: 'Modern Age' };
}

function renderAgePill(year) {
  var age = comicAge(year);
  return age ? '<span class="age-pill ' + age.key + '">' + esc(age.label) + '</span>' : '';
}

function sourceStatus(state, name) {
  var s = null;
  for (var i = 0; i < state.sources.length; i++) {
    if (state.sources[i].name === name) { s = state.sources[i]; break; }
  }
  return s || { name: name, status: 'yellow', methodLabel: 'Status unknown', reason: '' };
}

function renderSourceGrid(state) {
  return state.sources.map(function (s) {
    var status = s.status || 'green';
    return '<div class="source-card">' +
      '<div class="source-card-top"><span class="sname">' + esc(s.name) + '</span><span class="status-pill ' + status + '" title="' + esc(s.reason || '') + '">' + status.toUpperCase() + '</span></div>' +
      '<div class="source-method">' + esc(s.methodLabel || '') + '</div>' +
      '</div>';
  }).join('');
}

function renderSourceSummary(state) {
  var counts = { green: 0, yellow: 0, red: 0 };
  state.sources.forEach(function (s) { counts[s.status || 'green']++; });
  return state.sources.length + ' sources configured — ' + counts.green + ' automated, ' + counts.yellow + ' limited, ' + counts.red + ' requiring permission.';
}

function renderCheckSummary(state) {
  var labels = { checked: 'successfully checked', limited: 'limited', unavailable: 'temporarily unavailable', permission_required: 'requires permission' };
  var order = ['checked', 'limited', 'unavailable', 'permission_required'];
  var counts = {};
  state.sources.forEach(function (s) {
    var k = s.checkStatus || 'checked';
    counts[k] = (counts[k] || 0) + 1;
  });
  var parts = [];
  order.forEach(function (k) {
    if (counts[k]) parts.push(counts[k] + ' ' + labels[k]);
  });
  var dateTxt = state.sources[0] && state.sources[0].checkDate ? ' as of last check (' + fmtDate(state.sources[0].checkDate) + ')' : '';
  return 'Last run: ' + parts.join(' · ') + dateTxt + '.';
}

function requestsToday(source, state) {
  return (source.requestsTodayDate === state.lastRun) ? (source.requestsToday || 0) : 0;
}

function renderSourceHealth(state) {
  return state.sources.map(function (s) {
    var n = requestsToday(s, state);
    var fails = s.consecutiveFailedRuns || 0;
    var flag = fails > 0
      ? '<span class="health-flag warn">' + fails + ' failed run' + (fails === 1 ? '' : 's') + ' in a row' + (s.lastFailureReason ? ' — ' + esc(s.lastFailureReason) : '') + '</span>'
      : '<span class="health-flag ok">Healthy</span>';
    return '<div class="health-card">' +
      '<span class="health-name">' + esc(s.name) + '</span>' +
      '<span class="health-stat">' + n + ' request' + (n === 1 ? '' : 's') + ' today</span>' +
      '<span class="health-stat">Last checked ' + (s.checkDate ? fmtDate(s.checkDate) : '—') + '</span>' +
      flag +
      '</div>';
  }).join('');
}

function renderRequestTotal(state) {
  return state.sources.reduce(function (sum, s) { return sum + requestsToday(s, state); }, 0);
}

function renderRequestLog(state) {
  var log = (state.requestLog || []).slice(-25).slice().reverse();
  if (!log.length) {
    return '<p class="log-empty">No requests logged yet.</p>';
  }
  var rows = log.map(function (e) {
    var cacheBadge = e.cacheHit ? '<span class="cache-badge hit">cache</span>' : '<span class="cache-badge miss">live</span>';
    var resultTxt = esc(e.result || '') + (e.httpStatus ? ' (' + esc(String(e.httpStatus)) + ')' : '');
    return '<tr>' +
      '<td data-label="Time">' + esc(e.ts || '') + '</td>' +
      '<td data-label="Source">' + esc(e.domain || '') + '</td>' +
      '<td data-label="Comic">' + esc(e.comic || '') + '</td>' +
      '<td data-label="Result">' + resultTxt + '</td>' +
      '<td data-label="Cache">' + cacheBadge + '</td>' +
      '</tr>';
  }).join('');
  return '<table class="listings request-log"><thead><tr><th>Time</th><th>Source</th><th>Comic</th><th>Result</th><th>Cache</th></tr></thead><tbody>' + rows + '</tbody></table>';
}

var SORT_PREFS = {};
var DEFAULT_SORT = 'price-desc';
var CURRENT_TITLE_FILTER = '';

function distinctTitles(wantList) {
  var seen = {}, arr = [];
  wantList.forEach(function (b) {
    if (!seen[b.title]) { seen[b.title] = true; arr.push(b.title); }
  });
  arr.sort(function (a, b) {
    var na = normTitle(a), nb = normTitle(b);
    if (na < nb) return -1;
    if (na > nb) return 1;
    return 0;
  });
  return arr;
}

function applyTitleFilter() {
  var cards = document.querySelectorAll('.book-card');
  for (var i = 0; i < cards.length; i++) {
    var t = cards[i].getAttribute('data-title');
    cards[i].style.display = (!CURRENT_TITLE_FILTER || t === CURRENT_TITLE_FILTER) ? '' : 'none';
  }
}

function sortListings(listings, sortKey) {
  var arr = listings.slice();
  function priceVal(l) { return (l.price === null || l.price === undefined) ? null : Number(l.price); }
  if (sortKey === 'price-desc') {
    arr.sort(function (a, b) {
      var pa = priceVal(a), pb = priceVal(b);
      if (pa === null && pb === null) return 0;
      if (pa === null) return 1;
      if (pb === null) return -1;
      return pb - pa;
    });
  } else if (sortKey === 'date-desc') {
    arr.sort(function (a, b) {
      var da = a.foundDate || '', db = b.foundDate || '';
      if (da === db) return 0;
      return da < db ? 1 : -1;
    });
  } else if (sortKey === 'date-asc') {
    arr.sort(function (a, b) {
      var da = a.foundDate || '', db = b.foundDate || '';
      if (da === db) return 0;
      return da < db ? -1 : 1;
    });
  } else {
    arr.sort(function (a, b) {
      var pa = priceVal(a), pb = priceVal(b);
      if (pa === null && pb === null) return 0;
      if (pa === null) return 1;
      if (pb === null) return -1;
      return pa - pb;
    });
  }
  return arr;
}

function renderListingRows(listings, sortKey) {
  if (!listings.length) {
    return '<tr><td colspan="5" class="empty-row">No listings found yet — this book is being watched across every automated source.</td></tr>';
  }
  listings = sortListings(listings, sortKey || DEFAULT_SORT);
  return listings.map(function (l) {
    var badges = '';
    if (l.facsimile) badges += '<span class="facsimile">FACSIMILE</span>';
    var soldBadge = l.sold ? '<span class="soldpill">SOLD' + (l.soldDate ? ' · ' + fmtDate(l.soldDate) : '') + '</span>' : '';
    var srcStatus = sourceStatus(CURRENT_STATE, l.source).status || 'green';
    var detailTxt = esc(l.note || ('Found ' + fmtDate(l.foundDate)));
    if (srcStatus === 'red') {
      detailTxt += ' <span class="restricted-note">· Source access limited — not refreshed automatically</span>';
    }
    var row = '<tr' + (l.sold ? ' class="sold-row"' : '') + '>' +
      '<td data-label="Source"><span class="src-chip"><span class="src-status-dot ' + srcStatus + '"></span>' + esc(l.source) + '</span></td>' +
      '<td data-label="Price">' + fmtPrice(l.price, l.currency) + badges + '</td>' +
      '<td class="grade" data-label="Grade">' + esc(l.grade || '—') + '</td>' +
      '<td class="note" data-label="Detail">' + detailTxt + '</td>' +
      '<td data-label=""><a class="view-link" href="' + esc(l.url) + '" target="_blank" rel="noopener">View listing →</a>' + soldBadge + '</td>' +
      '</tr>';
    return row;
  }).join('');
}

function renderSortControl(book, sortKey) {
  var options = [
    ['price-desc', 'Price: High to Low'],
    ['price-asc', 'Price: Low to High'],
    ['date-desc', 'Date: New to Old'],
    ['date-asc', 'Date: Old to New']
  ];
  var optionsHtml = options.map(function (o) {
    return '<option value="' + o[0] + '"' + (sortKey === o[0] ? ' selected' : '') + '>' + o[1] + '</option>';
  }).join('');
  return '<span class="sort-wrap">' +
    '<select class="sort-select" data-sort-book="' + esc(book.id) + '" aria-label="Sort listings for ' + esc(book.title) + ' #' + esc(book.issue) + '">' +
      optionsHtml +
    '</select>' +
  '</span>';
}

function highestPricedImageFrom(withImage) {
  var priced = withImage.filter(function (l) { return l.price !== null && l.price !== undefined; });
  var pool = priced.length ? priced : withImage;
  return pool.reduce(function (best, l) {
    return Number(l.price || 0) > Number(best.price || 0) ? l : best;
  }).image;
}

function mostFrequentListingImage(listings) {
  var withImage = listings.filter(function (l) { return l.image; });
  if (!withImage.length) return null;

  var counts = {};
  withImage.forEach(function (l) { counts[l.image] = (counts[l.image] || 0) + 1; });
  var maxCount = 0;
  Object.keys(counts).forEach(function (url) { if (counts[url] > maxCount) maxCount = counts[url]; });

  // Every photo is unique (no listing actually shares one with another) —
  // frequency can't tell us anything useful, so fall back to the
  // highest-priced listing's photo instead of an arbitrary pick.
  if (maxCount <= 1) return highestPricedImageFrom(withImage);

  var candidateUrls = Object.keys(counts).filter(function (url) { return counts[url] === maxCount; });
  if (candidateUrls.length === 1) return candidateUrls[0];

  // Tie between multiple equally-frequent photos — break by highest price.
  var tied = withImage.filter(function (l) { return candidateUrls.indexOf(l.image) !== -1; });
  return highestPricedImageFrom(tied);
}

function renderBookCard(book, state) {
  var listings = state.listings.filter(function (l) { return l.wantId === book.id; });
  var pillClass = listings.length ? 'found' : (book.searchPending ? 'pending' : 'empty');
  var pillText = listings.length ? (listings.length + (listings.length === 1 ? ' listing' : ' listings')) : (book.searchPending ? 'Search queued' : 'Watching');
  var sortKey = SORT_PREFS[book.id] || DEFAULT_SORT;
  var sortControl = listings.length > 1 ? renderSortControl(book, sortKey) : '';
  var coverSrc = mostFrequentListingImage(listings);
  var coverHtml = coverSrc
    ? '<img class="book-cover" src="' + esc(coverSrc) + '" alt="' + esc(book.title) + ' #' + esc(book.issue) + ' — photo from an eBay listing" loading="lazy">'
    : '<div class="book-cover book-cover-placeholder" role="img" aria-label="Cover not yet available"></div>';
  return '<div class="book-card" data-book-id="' + esc(book.id) + '" data-title="' + esc(book.title) + '">' +
    '<div class="book-head">' +
      '<div class="book-head-left">' +
        coverHtml +
        '<div class="book-titling">' +
          '<span class="book-title">' + esc(book.title) + '</span>' +
          '<span class="book-issue">#' + esc(book.issue) + '</span>' +
          '<span class="book-meta">' + esc(book.publisher) + ' · ' + esc(book.year) + renderAgePill(book.year) + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="book-head-right">' +
        '<span class="count-pill ' + pillClass + '">' + pillText + '</span>' +
        sortControl +
        '<button class="remove-btn" data-remove="' + esc(book.id) + '" title="Stop watching this book">Remove</button>' +
      '</div>' +
    '</div>' +
    (listings.length ? '<table class="listings"><thead><tr><th>Source</th><th>Price</th><th>Grade</th><th>Detail</th><th></th></tr></thead><tbody>' + renderListingRows(listings, sortKey) + '</tbody></table>'
                      : '<table class="listings"><tbody>' + renderListingRows(listings, sortKey) + '</tbody></table>') +
    '</div>';
}

function renderApp(state) {
  CURRENT_STATE = state;
  var totalListings = state.listings.length;
  var html = '';
  html += '<div class="brand-bar"><img class="brand-logo" src="' + LOGO_DATA_URI + '" alt="The Comic Sleuth logo" width="72" height="72">' +
    '<div class="brand-name-wrap"><span class="brand-name">The Comic Sleuth</span><span class="brand-eyebrow">#1 Comic Gumshoe</span></div></div>';
  html += '<div class="gold-rule"></div>';
  html += '<header class="masthead">';
  html += '<h1 class="title">Your want list, watched across eBay and other comic markets</h1>';
  html += '<div class="stat-row">';
  html += '<div class="stat"><span class="num">' + state.wantList.length + '</span><span class="label">Books watched</span></div>';
  html += '<div class="stat"><span class="num">' + totalListings + '</span><span class="label">Listings found</span></div>';
  html += '<div class="stat"><span class="num">' + state.sources.length + '</span><span class="label">Sources</span></div>';
  html += '<div class="stat"><span class="num">' + fmtDate(state.lastRun) + '</span><span class="label">Last checked</span></div>';
  html += '</div>';
  html += '</header>';

  if (state.isOwner) {
    html += '<section class="sources">';
    html += '<h2>Sources monitored</h2>';
    html += '<p class="source-summary">' + esc(renderSourceSummary(state)) + '</p>';
    html += '<p class="source-check-summary">' + esc(renderCheckSummary(state)) + '</p>';
    html += '<div class="source-grid">' + renderSourceGrid(state) + '</div>';
    html += '</section>';

    html += '<section class="admin-panel-wrap"><details class="admin-panel"><summary>Source health &amp; request log (debug)</summary><div class="admin-panel-body">';
    html += '<p class="source-summary">' + renderRequestTotal(state) + ' request' + (renderRequestTotal(state) === 1 ? '' : 's') + ' made today across ' + state.sources.length + ' source' + (state.sources.length === 1 ? '' : 's') + '.</p>';
    html += '<div class="health-grid">' + renderSourceHealth(state) + '</div>';
    html += '<h3>Recent requests</h3>';
    html += '<p class="log-hint">Metadata only — timestamp, source, comic, and result. The page content of any third-party site is never stored here. Showing the most recent ' + Math.min((state.requestLog || []).length, 25) + ' of ' + (state.requestLog || []).length + '.</p>';
    html += renderRequestLog(state);
    html += '</div></details></section>';
  }

  html += '<section class="hero-search">' +
    '<div class="hero-search-kicker-row">' +
      '<svg class="hero-search-glass" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"></circle><line x1="15.5" y1="15.5" x2="21" y2="21"></line></svg>' +
      '<span class="hero-search-kicker">The trail starts here</span>' +
    '</div>' +
    '<form id="quick-search-form" class="hero-search-form">' +
      '<label for="quick-search-input" class="hero-search-label">Give me a Clue?</label>' +
      '<div class="hero-search-row">' +
        '<input id="quick-search-input" type="text" placeholder="e.g. Amazing Spider-Man #1 1963" autocomplete="off">' +
        '<button type="submit" id="quick-search-btn">Let’s Sleuth!</button>' +
      '</div>' +
    '</form>' +
  '</section>';

  html += '<details class="manual-add">' +
    '<summary>Prefer to enter the title, issue, publisher and year separately? Add manually</summary>' +
    '<div class="addbook">' +
      '<form id="add-form">' +
        '<div class="field"><label for="f-title">Title</label><input id="f-title" name="title" placeholder="e.g. Tales of Suspense" required></div>' +
        '<div class="field"><label for="f-issue">Issue #</label><input id="f-issue" name="issue" placeholder="39" required></div>' +
        '<div class="field"><label for="f-pub">Publisher</label><input id="f-pub" name="publisher" placeholder="Marvel"></div>' +
        '<div class="field"><label for="f-year">Year</label><input id="f-year" name="year" placeholder="1963"></div>' +
        '<button type="submit" class="add-submit" id="add-submit-btn">Add to Watch List</button>' +
      '</form>' +
      '<p class="addbook-hint">New books are searched on eBay immediately after you add them. The list is capped at ' + (state.bookCap || 30) + ' books to keep requests light.</p>' +
    '</div>' +
  '</details>';

  html += '<section class="list">';
  html += '<div class="list-head"><h2>Watching (' + state.wantList.length + ')</h2>' +
    '<div class="title-filter-wrap"><label for="title-filter" class="title-filter-label">Filter by title</label>' +
    '<span class="sort-wrap"><select id="title-filter" class="sort-select" aria-label="Filter by comic title"><option value="">All titles</option>' +
    distinctTitles(state.wantList).map(function (t) {
      return '<option value="' + esc(t) + '"' + (CURRENT_TITLE_FILTER === t ? ' selected' : '') + '>' + esc(t) + '</option>';
    }).join('') +
    '</select></span></div></div>';
  var sortedWantList = state.wantList.slice().sort(compareBooksByTitle);
  html += sortedWantList.map(function (b) { return renderBookCard(b, state); }).join('');
  html += '</section>';

  html += '<footer>eBay listings are fetched live via eBay’s official Browse API using OAuth client-credentials — no web scraping, ever, for eBay or as a fallback if the API is unavailable. Prices shown are current asking prices, not completed sales. Other sources listed above (MyComicShop, Reece’s Rare Comics, Superworld Comics, Dale Roberts Comics) are shown for context but are not yet implemented as live connectors in this build. Prices and availability change constantly; always confirm on eBay before bidding or buying.</footer>';

  document.getElementById('app').innerHTML = html;
  wireEvents(state);
  applyTitleFilter();
}

function scrollToCard(bookId) {
  var card = document.querySelector('.book-card[data-book-id="' + bookId + '"]');
  if (!card) return;
  card.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scrollToBook(bookId) {
  scrollToCard(bookId);
  showBackToTop();
}

function showBackToTop() {
  var btn = document.getElementById('back-to-top');
  if (btn) btn.classList.add('show');
}

function setupBackToTop() {
  var btn = document.getElementById('back-to-top');
  if (!btn) return;
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    btn.classList.remove('show');
  });
  window.addEventListener('scroll', function () {
    if (window.scrollY < 200) btn.classList.remove('show');
  }, { passive: true });
}

// Visible (non-filtered) book cards, in the same title-then-issue order
// they're rendered in — the "next" card after a title's last issue is
// naturally that title's successor, so no separate title-boundary logic
// is needed beyond walking this list.
function visibleBookCards() {
  return Array.prototype.filter.call(document.querySelectorAll('.book-card'), function (c) {
    return c.style.display !== 'none';
  });
}

// The last card whose top has scrolled above this line counts as "current".
// "Current" card is whichever card's vertical center sits closest to this
// line (a fraction of viewport height, not a fixed pixel value, so it
// scales with both viewport size and card height instead of lagging on
// tall multi-listing cards or short lists).
function jumpNavCurrentIndex(cards) {
  var refY = window.innerHeight * 0.35;
  var best = -1, bestDist = Infinity;
  for (var i = 0; i < cards.length; i++) {
    var rect = cards[i].getBoundingClientRect();
    var dist = Math.abs((rect.top + rect.bottom) / 2 - refY);
    if (dist < bestDist) { bestDist = dist; best = i; }
  }
  // Nothing scrolled into range yet (e.g. still above the first card).
  if (best >= 0 && cards[best].getBoundingClientRect().top > refY) return -1;
  return best;
}

var jumpNavHideTimer = null;

function updateJumpNav(direction) {
  var el = document.getElementById('jump-nav');
  if (!el) return;

  var cards = visibleBookCards();
  if (cards.length < 2) { el.classList.remove('show'); return; }

  var idx = jumpNavCurrentIndex(cards);
  var targetIdx = direction === 'down' ? idx + 1 : idx - 1;
  if (targetIdx < 0 || targetIdx >= cards.length) { el.classList.remove('show'); return; }

  var currentCard = idx >= 0 ? cards[idx] : null;
  var targetCard = cards[targetIdx];
  var sameTitle = currentCard && currentCard.getAttribute('data-title') === targetCard.getAttribute('data-title');
  var issueEl = targetCard.querySelector('.book-issue');
  var label = (direction === 'down' ? '↓ Next' : '↑ Previous') + (sameTitle ? ' issue: ' : ': ') +
    targetCard.getAttribute('data-title') + ' ' + (issueEl ? issueEl.textContent : '');

  el.textContent = label;
  el.setAttribute('data-jump-target', targetCard.getAttribute('data-book-id'));
  el.classList.add('show');
  clearTimeout(jumpNavHideTimer);
  jumpNavHideTimer = setTimeout(function () { el.classList.remove('show'); }, 1800);
}

function setupJumpNav() {
  var el = document.getElementById('jump-nav');
  if (!el) return;

  el.addEventListener('click', function () {
    var bookId = el.getAttribute('data-jump-target');
    el.classList.remove('show');
    if (bookId) scrollToCard(bookId);
  });

  var lastY = window.scrollY;
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      var delta = y - lastY;
      if (Math.abs(delta) > 4) {
        updateJumpNav(delta > 0 ? 'down' : 'up');
        lastY = y;
      }
      ticking = false;
    });
  }, { passive: true });
}

function showToast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function () { t.classList.remove('show'); }, 2600);
}

function normTitle(t) {
  return String(t == null ? '' : t).trim().toLowerCase();
}

function issueSortValue(issue) {
  var s = String(issue == null ? '' : issue).trim();
  var m = s.match(/-?\d+(\.\d+)?/);
  if (m) return parseFloat(m[0]);
  return Infinity;
}

function compareBooksByTitle(a, b) {
  var ta = normTitle(a.title), tb = normTitle(b.title);
  if (ta < tb) return -1;
  if (ta > tb) return 1;
  var ia = issueSortValue(a.issue), ib = issueSortValue(b.issue);
  if (ia < ib) return -1;
  if (ia > ib) return 1;
  return 0;
}

async function apiGet(url) {
  var res = await fetch(url);
  if (!res.ok) throw new Error((await res.json().catch(function () { return {}; })).error || res.statusText);
  return res.json();
}

async function apiSend(url, method, body) {
  var res = await fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  var data = await res.json().catch(function () { return {}; });
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

// Pulls a title, issue number, and (optional) year out of one free-typed
// search string, e.g. "Amazing Spider-Man #1 1963" or "Batman 251" or
// "Fantastic Four (1961) #52". Reuses the exact same add/search endpoint
// and server-side match logic as the structured form below — only the
// parsing of the input differs, not how a match is validated.
function parseQuickSearch(raw) {
  var s = String(raw == null ? '' : raw);
  var year = null;

  var yearMatch = s.match(/\(?\b(18|19|20)\d{2}\b\)?/);
  if (yearMatch) {
    year = yearMatch[0].replace(/[()]/g, '');
    s = s.slice(0, yearMatch.index) + s.slice(yearMatch.index + yearMatch[0].length);
  }

  var issue = null;
  var issueMatch = s.match(/#\s*(\d+[a-z]?)/i) || s.match(/\bno\.?\s*(\d+[a-z]?)\b/i);
  if (issueMatch) {
    issue = issueMatch[1];
    s = s.slice(0, issueMatch.index) + s.slice(issueMatch.index + issueMatch[0].length);
  } else {
    var nums = s.match(/\b\d+[a-z]?\b/gi);
    if (nums && nums.length) {
      issue = nums[nums.length - 1];
      var idx = s.lastIndexOf(issue);
      s = s.slice(0, idx) + s.slice(idx + issue.length);
    }
  }

  var title = s.replace(/[(),#]/g, ' ').replace(/\s+/g, ' ').trim();
  return { title: title, issue: issue, year: year };
}

function submitNewBook(payload, btn, idleLabel, busyLabel) {
  btn.disabled = true;
  btn.textContent = busyLabel;

  return apiSend('/api/wantlist', 'POST', payload)
    .then(function (newState) {
      if (CURRENT_TITLE_FILTER && CURRENT_TITLE_FILTER !== payload.title) CURRENT_TITLE_FILTER = '';
      renderApp(newState);
      if (newState.addedBookId) scrollToBook(newState.addedBookId);
    })
    .catch(function (err) {
      btn.disabled = false;
      btn.textContent = idleLabel;
      showToast('Could not add book: ' + err.message);
      throw err;
    });
}

function wireEvents(state) {
  var form = document.getElementById('add-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var title = document.getElementById('f-title').value.trim();
      var issue = document.getElementById('f-issue').value.trim();
      var publisher = document.getElementById('f-pub').value.trim();
      var year = document.getElementById('f-year').value.trim();
      if (!title || !issue) return;

      var btn = document.getElementById('add-submit-btn');
      submitNewBook({ title: title, issue: issue, publisher: publisher, year: year }, btn, 'Add to Watch List', 'Searching eBay…').catch(function () {});
    });
  }

  var quickForm = document.getElementById('quick-search-form');
  if (quickForm) {
    quickForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = document.getElementById('quick-search-input');
      var parsed = parseQuickSearch(input.value);
      var btn = document.getElementById('quick-search-btn');

      if (!parsed.title || !parsed.issue) {
        showToast('Include a title and an issue number, e.g. "Amazing Spider-Man #1 1963".');
        return;
      }

      submitNewBook(
        { title: parsed.title, issue: parsed.issue, publisher: '', year: parsed.year || '' },
        btn, 'Let’s Sleuth!', 'Searching eBay…'
      ).then(function () { input.value = ''; }).catch(function () {});
    });
  }

  var removeBtns = document.querySelectorAll('[data-remove]');
  for (var i = 0; i < removeBtns.length; i++) {
    removeBtns[i].addEventListener('click', function (e) {
      var id = e.currentTarget.getAttribute('data-remove');
      apiSend('/api/wantlist/' + encodeURIComponent(id), 'DELETE')
        .then(function (newState) {
          renderApp(newState);
          showToast('Removed from your watch list');
        })
        .catch(function (err) {
          showToast('Could not remove book: ' + err.message);
        });
    });
  }

  var sortSelects = document.querySelectorAll('[data-sort-book]');
  for (var j = 0; j < sortSelects.length; j++) {
    sortSelects[j].addEventListener('change', function (e) {
      var bookId = e.currentTarget.getAttribute('data-sort-book');
      var sortKey = e.currentTarget.value;
      SORT_PREFS[bookId] = sortKey;
      var card = document.querySelector('.book-card[data-book-id="' + bookId + '"]');
      if (!card) return;
      var tbody = card.querySelector('table.listings tbody');
      if (!tbody) return;
      var listings = state.listings.filter(function (l) { return l.wantId === bookId; });
      tbody.innerHTML = renderListingRows(listings, sortKey);
    });
  }

  var titleFilterSelect = document.getElementById('title-filter');
  if (titleFilterSelect) {
    titleFilterSelect.addEventListener('change', function (e) {
      CURRENT_TITLE_FILTER = e.currentTarget.value;
      applyTitleFilter();
    });
  }
}

var CURRENT_STATE = null;

setupBackToTop();
setupJumpNav();

apiGet('/api/state')
  .then(function (state) { renderApp(state); })
  .catch(function (err) {
    document.getElementById('app').innerHTML =
      '<p style="color:var(--warn)">Could not load Comic Sleuth: ' + esc(err.message) + '</p>';
  });
