require('dotenv').config();

const path = require('path');
const express = require('express');
const wantlistRoutes = require('./routes/wantlist');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
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
