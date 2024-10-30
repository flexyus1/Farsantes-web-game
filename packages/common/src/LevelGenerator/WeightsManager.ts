import SimpleRNG from "./SimpleRNG";

class WeightsManager<T extends string | number | symbol> {
  private weights: Record<T, number>;

  constructor(weights: Record<T, number>) {
    this.weights = weights;
  }

  public getWeightedRandomItem(rng: SimpleRNG): T {
    const totalWeight = this.getTotalWeight();

    let randomValue = rng.next() * totalWeight;

    let accumulatedWeight = 0;
    for (const [item, weight] of Object.entries(this.weights) as [T, number][]) {
      accumulatedWeight += weight;
      if (randomValue <= accumulatedWeight) {
        return item;
      }
    }

    throw new Error("Failed to select an item");
  }

  public setWeight(item: T, weight: number): void {
    if (weight < 0) {
      throw new Error("Weight cannot be negative");
    }
    this.weights[item] = weight;
  }

  public getTotalWeight(): number {
    const weightValues: number[] = Object.values(this.weights);
    return weightValues.reduce(
      (sum: number, weight: number): number => sum + weight,
      0
    );
  }

  public clone(): WeightsManager<T> {
    const entries = Object.entries(this.weights) as [T, number][];
    const clonedWeights = entries.reduce((acc, [key, value]) => {
      acc[key as T] = value;
      return acc;
    }, {} as Record<T, number>);

    return new WeightsManager<T>(clonedWeights);
  }
}

export default WeightsManager;
