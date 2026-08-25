// Runs an async fn over items with at most `concurrency` in flight at once —
// used to keep bursts of outbound marketplace API calls (e.g. refreshing a
// large want list) from hitting a marketplace's per-second rate limits, even
// though the total number of calls is unchanged.

async function mapWithConcurrency(items, concurrency, fn) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const i = nextIndex++;
      results[i] = await fn(items[i], i);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, worker);
  await Promise.all(workers);
  return results;
}

module.exports = { mapWithConcurrency };
