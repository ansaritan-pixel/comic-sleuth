require('dotenv').config();

const path = require('path');
const express = require('express');
const wantlistRoutes = require('./routes/wantlist');
const { testerMiddleware } = require('./testerMiddleware');
const { isValidToken, setTesterCookie } = require('./cookies');

const app = express();
const PORT = process.env.PORT || 3000;

// Render (and most hosts) terminate HTTPS at a proxy in front of this
// process — trusting it is what makes req.secure correctly reflect
// whether the visitor is actually on HTTPS, so the tester cookie gets
// marked Secure in production without breaking plain-HTTP local dev.
app.set('trust proxy', 1);

app.use(express.json());
app.use(testerMiddleware);

// A beta tester's (or the owner's) invite link: claims a specific
// pre-minted identity for this browser, rather than the random one
// testerMiddleware would otherwise assign on first visit.
app.get('/t/:token', (req, res) => {
  if (!isValidToken(req.params.token)) {
    return res.status(400).send('Invalid invite link.');
  }
  setTesterCookie(res, req.params.token, { secure: req.secure });
  res.redirect('/');
});

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api', wantlistRoutes);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, () => {
  const env = (process.env.EBAY_ENV || 'sandbox').toLowerCase();
  console.log(`Comic Sleuth listening on http://localhost:${PORT} (eBay: ${env})`);
});
