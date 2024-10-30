export class Counter {
  private counts: Map<string, number> = new Map();

  increment(key: string): void {
    const currentCount = this.counts.get(key) || 0;
    this.counts.set(key, currentCount + 1);
  }

  incrementMultiple(keys: string[]): void {
    keys.forEach(key => this.increment(key));
  }

  getCount(key: string): number {
    return this.counts.get(key) || 0;
  }

  getAllCounts(): Map<string, number> {
    return new Map(this.counts);
  }

  reset(): void {
    this.counts.clear();
  }
}

export const globalCounter = new Counter();
