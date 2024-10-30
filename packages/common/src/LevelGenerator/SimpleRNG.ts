// Simple custom random number generator
class SimpleRNG {
  private seed: number;

  constructor(seed: string) {
    this.seed = this.hashString(seed);
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  next(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }

  getRandomBoolean(): boolean {
    return this.next() < 0.5;
  }

  shuffleList<T>(list: T[]): T[] {
    return list.sort(() => this.next() - 0.5);
  }

  getSeed(): number {
    return this.seed;
  }
}

export default SimpleRNG;