// Generic in-memory TTL cache, used to avoid duplicate marketplace API calls
// for the same search within a short window.

class TTLCache {
  constructor(ttlMs) {
    this.ttlMs = ttlMs;
    this.store = new Map();
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key, value) {
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }

  delete(key) {
    this.store.delete(key);
  }
}

module.exports = { TTLCache };
