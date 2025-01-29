interface CacheOptions {
  maxAge?: number;
  maxItems?: number;
}

class CacheManager {
  private cache: Map<string, { data: any; timestamp: number }>;
  private maxAge: number;
  private maxItems: number;

  constructor(options: CacheOptions = {}) {
    this.cache = new Map();
    this.maxAge = options.maxAge || 5 * 60 * 1000; // 5 minutes default
    this.maxItems = options.maxItems || 100;
  }

  set(key: string, data: any): void {
    if (this.cache.size >= this.maxItems) {
      const oldestKey = this.findOldestKey();
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  private findOldestKey(): string | null {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;

    for (const [key, value] of this.cache.entries()) {
      if (value.timestamp < oldestTimestamp) {
        oldestTimestamp = value.timestamp;
        oldestKey = key;
      }
    }

    return oldestKey;
  }

  clear(): void {
    this.cache.clear();
  }

  remove(key: string): void {
    this.cache.delete(key);
  }

  size(): number {
    return this.cache.size;
  }
}

export const cacheManager = new CacheManager();
